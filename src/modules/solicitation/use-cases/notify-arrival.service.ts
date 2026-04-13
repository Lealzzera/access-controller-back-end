import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
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
  constructor(
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
    @Inject('IResponsibleOnChildrenRepository')
    private readonly responsibleOnChildrenRepository: IResponsibleOnChildrenRepository,
    private readonly solicitationGateway: SolicitationGateway,
    private readonly getPresignedUrlService: GetPresignedUrlService,
  ) {}

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

    // Resolve presigned URLs for pictures
    const [childPicture, responsiblePicture] = await Promise.all([
      child.picture ? this.getPresignedUrlService.exec(child.picture) : null,
      null, // responsible picture not available here without fetching the full responsible
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

    return { ok: true };
  }
}
