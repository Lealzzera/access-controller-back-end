import { Inject } from '@nestjs/common';
import { IResponsibleRepository } from '../repositories/interfaces/responsible-repository.interface';
import { IResponsibleOnChildrenRepository } from 'src/modules/responsible-on-children/repositories/interfaces/responsible-on-children-repository.interface';
import IKinshipRepository from 'src/modules/kinship/repositories/interfaces/kinship-repository.interface';
import { GetPresignedUrlService } from '../../aws/get-presigned-url.service';

type GetResponsibleServiceResponse = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phoneNumber: string | null;
  picture: string | null;
  kinship: string;
};
export class GetResponsiblesService {
  constructor(
    @Inject('IResponsibleRepository')
    private readonly responsibleRepository: IResponsibleRepository,
    @Inject('IResponsibleOnChildrenRepository')
    private readonly responsibleOnChildrenRepository: IResponsibleOnChildrenRepository,
    @Inject('IKinshipRepository')
    private readonly kinshipRepository: IKinshipRepository,
    private readonly getPresignedUrlService: GetPresignedUrlService,
  ) {}

  async exec(childId: string): Promise<GetResponsibleServiceResponse[] | []> {
    if (!childId.length) {
      return [];
    }

    const responsibleList =
      await this.responsibleOnChildrenRepository.findResponsibleListByChildId(
        childId,
      );

    if (!responsibleList.length) {
      return [];
    }

    const responsible = await Promise.all(
      responsibleList.map(async (item) => {
        const { id, name, email, picture, cpf, phoneNumber } =
          await this.responsibleRepository.findResponsibleById(
            item.responsibleId,
          );
        const { name: kinship } = await this.kinshipRepository.fetchKinshipById(
          item.kinshipId,
        );
        const presignedPicture = picture
          ? await this.getPresignedUrlService.exec(picture)
          : null;
        return {
          id,
          name,
          email,
          cpf,
          phoneNumber,
          picture: presignedPicture,
          kinship,
        };
      }),
    );

    return responsible;
  }
}
