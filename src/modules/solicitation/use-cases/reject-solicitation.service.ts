import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ISolicitationRepository } from '../repositories/interfaces/solicitation-repository.interface';
import { SolicitationGateway } from '../solicitation.gateway';
import { GetPresignedUrlService } from 'src/modules/aws/get-presigned-url.service';
import { resolveSolicitationPictures } from '../helpers/resolve-solicitation-pictures';

interface RejectSolicitationRequest {
  solicitationId: string;
}

export class RejectSolicitationService {
  constructor(
    @Inject('ISolicitationRepository')
    private readonly solicitationRepository: ISolicitationRepository,
    private readonly solicitationGateway: SolicitationGateway,
    private readonly getPresignedUrlService: GetPresignedUrlService,
  ) {}

  async exec({ solicitationId }: RejectSolicitationRequest) {
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
      'REJECTED',
    );

    const resolved = await resolveSolicitationPictures(
      updatedSolicitation,
      this.getPresignedUrlService,
    );

    this.solicitationGateway.notifyResponsible(solicitation.responsibleId, {
      event: 'solicitation-rejected',
      data: resolved,
    });

    return resolved;
  }
}
