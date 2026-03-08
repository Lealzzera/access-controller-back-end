import {
  BadRequestException,
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { SolicitationType } from '@prisma/client';
import { IChildrenRepository } from 'src/modules/children/repositories/interfaces/children-repository.interface';
import { IResponsibleOnChildrenRepository } from 'src/modules/responsible-on-children/repositories/interfaces/responsible-on-children-repository.interface';
import { ISolicitationRepository } from '../repositories/interfaces/solicitation-repository.interface';
import { SolicitationGateway } from '../solicitation.gateway';
import { GetPresignedUrlService } from 'src/modules/aws/get-presigned-url.service';
import { resolveSolicitationPictures } from '../helpers/resolve-solicitation-pictures';

interface CreateSolicitationRequest {
  type: SolicitationType;
  childId: string;
  responsibleId: string;
}

export class CreateSolicitationService {
  constructor(
    @Inject('ISolicitationRepository')
    private readonly solicitationRepository: ISolicitationRepository,
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
    @Inject('IResponsibleOnChildrenRepository')
    private readonly responsibleOnChildrenRepository: IResponsibleOnChildrenRepository,
    private readonly solicitationGateway: SolicitationGateway,
    private readonly getPresignedUrlService: GetPresignedUrlService,
  ) {}

  async exec({ type, childId, responsibleId }: CreateSolicitationRequest) {
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
      throw new ForbiddenException(
        'Responsible is not allowed to drop off or pick up this child',
      );
    }

    if (type === SolicitationType.DROP_OFF && child.isPresent) {
      throw new BadRequestException(
        'Child is already present at the institution',
      );
    }

    if (type === SolicitationType.PICK_UP && !child.isPresent) {
      throw new BadRequestException('Child is not present at the institution');
    }

    const solicitation = await this.solicitationRepository.create({
      type,
      childId,
      responsibleId,
      institutionId: child.institutionId,
    });

    const resolved = await resolveSolicitationPictures(
      solicitation,
      this.getPresignedUrlService,
    );

    this.solicitationGateway.notifyInstitution(child.institutionId, {
      event: 'new-solicitation',
      data: resolved,
    });

    return resolved;
  }
}
