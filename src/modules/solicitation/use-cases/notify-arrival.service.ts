import {
  BadRequestException,
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { IChildrenRepository } from 'src/modules/children/repositories/interfaces/children-repository.interface';
import { IResponsibleOnChildrenRepository } from 'src/modules/responsible-on-children/repositories/interfaces/responsible-on-children-repository.interface';
import { SolicitationGateway } from '../solicitation.gateway';
import { GetPresignedUrlService } from 'src/modules/aws/get-presigned-url.service';
import { ArrivalAlertType } from '../notify-arrival.dto';

interface NotifyArrivalRequest {
  minutes: ArrivalAlertType;
  childId: string;
  responsibleId: string;
}

export class NotifyArrivalService {
  private static readonly COOLDOWN_MS = 5 * 60 * 1000;
  // In-memory tracking of last alert timestamp per (childId, responsibleId).
  private readonly lastAlertAt = new Map<string, number>();

  constructor(
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
    @Inject('IResponsibleOnChildrenRepository')
    private readonly responsibleOnChildrenRepository: IResponsibleOnChildrenRepository,
    private readonly solicitationGateway: SolicitationGateway,
    private readonly getPresignedUrlService: GetPresignedUrlService,
  ) {}

  private keyFor(childId: string, responsibleId: string) {
    return `${childId}:${responsibleId}`;
  }

  async exec({ minutes, childId, responsibleId }: NotifyArrivalRequest) {
    const child = await this.childrenRepository.findChildById(childId);

    if (!child) {
      throw new NotFoundException('Child not found');
    }

    const responsibleOnChild =
      await this.responsibleOnChildrenRepository.findResponsibleOnChildrenById({
        childId,
        responsibleId,
      });

    if (!responsibleOnChild) {
      throw new ForbiddenException('Responsible is not linked to this child');
    }

    if (responsibleOnChild.notAllowed) {
      throw new ForbiddenException('Responsible is not allowed for this child');
    }

    const cacheKey = this.keyFor(childId, responsibleId);
    const lastSentAt = this.lastAlertAt.get(cacheKey);
    const now = Date.now();

    if (lastSentAt !== undefined) {
      const elapsedMs = now - lastSentAt;
      if (elapsedMs < NotifyArrivalService.COOLDOWN_MS) {
        const remainingSec = Math.ceil(
          (NotifyArrivalService.COOLDOWN_MS - elapsedMs) / 1000,
        );
        throw new BadRequestException(
          `Please wait ${remainingSec}s before sending another arrival alert for this child`,
        );
      }

      // Cooldown expired — override any still-displayed alert in the
      // institution panel before sending the new one.
      this.solicitationGateway.notifyInstitution(child.institutionId, {
        event: 'arrival-alert-removed',
        data: { childId, responsibleId },
      });
    }

    // Resolve presigned URLs for pictures
    const [childPicture] = await Promise.all([
      child.picture ? this.getPresignedUrlService.exec(child.picture) : null,
    ]);

    const payload = {
      minutes,
      childId,
      responsibleId,
      child: {
        id: child.id,
        name: child.name,
        picture: childPicture,
      },
    };

    this.solicitationGateway.notifyInstitution(child.institutionId, {
      event: 'arrival-alert',
      data: payload,
    });

    this.lastAlertAt.set(cacheKey, now);

    return { ok: true };
  }
}
