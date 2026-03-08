import { GetPresignedUrlService } from 'src/modules/aws/get-presigned-url.service';
import { ISolicitationWithDetails } from '../repositories/interfaces/solicitation-repository.interface';

export async function resolveSolicitationPictures(
  solicitation: ISolicitationWithDetails,
  getPresignedUrlService: GetPresignedUrlService,
) {
  const [childPicture, responsiblePicture] = await Promise.all([
    solicitation.child.picture
      ? getPresignedUrlService.exec(solicitation.child.picture)
      : null,
    solicitation.responsible.picture
      ? getPresignedUrlService.exec(solicitation.responsible.picture)
      : null,
  ]);

  return {
    ...solicitation,
    child: { ...solicitation.child, picture: childPicture },
    responsible: { ...solicitation.responsible, picture: responsiblePicture },
  };
}
