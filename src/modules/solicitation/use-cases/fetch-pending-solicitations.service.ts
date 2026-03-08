import { Inject } from '@nestjs/common';
import { ISolicitationRepository } from '../repositories/interfaces/solicitation-repository.interface';
import { GetPresignedUrlService } from 'src/modules/aws/get-presigned-url.service';
import { resolveSolicitationPictures } from '../helpers/resolve-solicitation-pictures';

interface FetchPendingSolicitationsRequest {
  institutionId: string;
}

export class FetchPendingSolicitationsService {
  constructor(
    @Inject('ISolicitationRepository')
    private readonly solicitationRepository: ISolicitationRepository,
    private readonly getPresignedUrlService: GetPresignedUrlService,
  ) {}

  async exec({ institutionId }: FetchPendingSolicitationsRequest) {
    const solicitations =
      await this.solicitationRepository.findPendingByInstitutionId(
        institutionId,
      );

    return Promise.all(
      solicitations.map((s) =>
        resolveSolicitationPictures(s, this.getPresignedUrlService),
      ),
    );
  }
}
