import { Inject } from '@nestjs/common';
import { IResponsibleRepository } from '../repositories/interfaces/responsible-repository.interface';
import { IResponsibleOnChildrenRepository } from 'src/modules/responsible-on-children/repositories/interfaces/responsible-on-children-repository.interface';
import IKinshipRepository from 'src/modules/kinship/repositories/interfaces/kinship-repository.interface';

type GetResponsibleServiceResponse = {
  id: string;
  name: string;
  email: string;
  picture: string;
  cpf: string;
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
        const { id, name, email, picture, cpf } =
          await this.responsibleRepository.findResponsibleById(
            item.responsibleId,
          );
        const { name: kinship } = await this.kinshipRepository.fetchKinshipById(
          item.kinshipId,
        );
        return { id, name, email, picture, cpf, kinship };
      }),
    );

    return responsible;
  }
}
