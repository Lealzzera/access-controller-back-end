import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { SolicitationType } from '@prisma/client';
import { IChildrenRepository } from 'src/modules/children/repositories/interfaces/children-repository.interface';
import { ISolicitationRepository } from '../repositories/interfaces/solicitation-repository.interface';
import { SolicitationGateway } from '../solicitation.gateway';
import { GetPresignedUrlService } from 'src/modules/aws/get-presigned-url.service';
import { resolveSolicitationPictures } from '../helpers/resolve-solicitation-pictures';
import { RegisterHistoryService } from 'src/modules/history/use-cases/register-history.service';

interface AcceptSolicitationRequest {
  solicitationId: string;
}

export class AcceptSolicitationService {
  constructor(
    @Inject('ISolicitationRepository')
    private readonly solicitationRepository: ISolicitationRepository,
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
    private readonly solicitationGateway: SolicitationGateway,
    private readonly getPresignedUrlService: GetPresignedUrlService,
    private readonly registerHistoryService: RegisterHistoryService,
  ) {}

  async exec({ solicitationId }: AcceptSolicitationRequest) {
    const solicitation =
      await this.solicitationRepository.findById(solicitationId);

    if (!solicitation) {
      throw new NotFoundException('Solicitation not found');
    }

    if (solicitation.status !== 'PENDING') {
      throw new BadRequestException('Solicitation has already been processed');
    }

    const updatedSolicitation = await this.solicitationRepository.updateStatus(
      solicitationId,
      'ACCEPTED',
    );

    await this.childrenRepository.update({
      id: solicitation.childId,
      isPresent: solicitation.type === SolicitationType.DROP_OFF,
    });

    await this.registerHistoryService.exec({
      type: solicitation.type,
      childId: solicitation.childId,
      responsibleId: solicitation.responsibleId,
      institutionId: solicitation.institutionId,
    });

    const resolved = await resolveSolicitationPictures(
      updatedSolicitation,
      this.getPresignedUrlService,
    );

    this.solicitationGateway.notifyResponsible(solicitation.responsibleId, {
      event: 'solicitation-accepted',
      data: resolved,
    });

    return resolved;
  }
}
