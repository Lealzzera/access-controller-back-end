import { Inject } from '@nestjs/common';
import { Child } from '@prisma/client';
import { IChildrenRepository } from '../repositories/interfaces/children-repository.interface';
import { IResponsibleOnChildrenRepository } from 'src/modules/responsible-on-children/repositories/interfaces/responsible-on-children-repository.interface';

type FetchChildrenByResponsibleIdServiceResponse = {
  children: Child[];
};

export class FetchChildrenByResponsibleIdService {
  constructor(
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
    @Inject('IResponsibleOnChildrenRepository')
    private readonly responsibleOnChildrenRepository: IResponsibleOnChildrenRepository,
  ) {}

  async exec(
    responsibleId: string,
  ): Promise<FetchChildrenByResponsibleIdServiceResponse> {
    const responsibleOnChildrenData =
      await this.responsibleOnChildrenRepository.findChildListByResponsibleId(
        responsibleId,
      );

    const childrenIds = responsibleOnChildrenData.map(({ childId }) => childId);

    const children =
      await this.childrenRepository.findChildrenByIds(childrenIds);

    return { children };
  }
}
