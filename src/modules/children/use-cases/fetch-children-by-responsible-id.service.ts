import { Inject, NotFoundException } from '@nestjs/common';
import { IChildrenRepository } from '../repositories/interfaces/children-repository.interface';
import { IResponsibleOnChildrenRepository } from 'src/modules/responsible-on-children/repositories/interfaces/responsible-on-children-repository.interface';
import { IPeriodRepository } from 'src/modules/period/repositories/interfaces/period-repository.interface';
import { IGradeRepository } from 'src/modules/grade/repositories/interfaces/grade-repository.interface';
import { IResponsibleRepository } from 'src/modules/responsible/repositories/interfaces/responsible-repository.interface';

type Child = {
  name: string;
  id: string;
  cpf: string;
  birthDate: Date;
  picture: string;
  createdAt: Date;
  deletedAt: Date;
  institutionId: string;
  period: { id: string; name: string };
  grade: { id: string; name: string };
};

type FetchChildrenByResponsibleIdServiceResponse = {
  children: Child[];
};

export class FetchChildrenByResponsibleIdService {
  constructor(
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
    @Inject('IResponsibleOnChildrenRepository')
    private readonly responsibleOnChildrenRepository: IResponsibleOnChildrenRepository,
    @Inject('IPeriodRepository')
    private readonly periodRepository: IPeriodRepository,
    @Inject('IGradeRepository')
    private readonly gradeRepository: IGradeRepository,
    @Inject('IResponsibleRepository')
    private readonly responsibleRepository: IResponsibleRepository,
  ) {}

  async exec(
    responsibleId: string,
  ): Promise<FetchChildrenByResponsibleIdServiceResponse> {
    const doesResponsibleExist =
      await this.responsibleRepository.findResponsibleById(responsibleId);

    if (!doesResponsibleExist) {
      throw new NotFoundException('Responsible Id provided does not exist.');
    }

    const childListByResponsibleId =
      await this.responsibleOnChildrenRepository.findChildListByResponsibleId(
        responsibleId,
      );

    const childListFromRepository = await Promise.all(
      childListByResponsibleId.map(async (child) => {
        return await this.childrenRepository.findChildById(child.childId);
      }),
    );

    const childrenList = await Promise.all(
      childListFromRepository.map(async (child) => {
        const period = await this.periodRepository.findPeriodById(
          child.periodId,
        );
        const grade = await this.gradeRepository.findGradeById(child.gradeId);

        return {
          id: child.id,
          name: child.name,
          cpf: child.cpf,
          createdAt: child.createdAt,
          deletedAt: child.deletedAt,
          picture: child.picture,
          birthDate: child.birthDate,
          period,
          grade,
          institutionId: child.institutionId,
        };
      }),
    );

    return { children: childrenList };
  }
}
