import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { IChildrenRepository } from '../repositories/interfaces/children-repository.interface';
import { IInstitutionsRepository } from 'src/modules/institutions/repositories/interfaces/institutions-repository.interface';
import { IPeriodRepository } from 'src/modules/period/repositories/interfaces/period-repository.interface';
import { IGradeRepository } from 'src/modules/grade/repositories/interfaces/grade-repository.interface';

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
  isPresent: boolean;
};

type FetchChildrenByInstitutionIdServiceRequest = {
  institutionId: string;
  page?: number;
  limit?: number;
};

type FetchChildrenByInstitutionIdServiceResponse = {
  children: Child[];
};

export class FetchChildrenByInstitutionIdService {
  constructor(
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
    @Inject('IInstitutionsRepository')
    private readonly institutionsRepository: IInstitutionsRepository,
    @Inject('IPeriodRepository')
    private readonly periodRepository: IPeriodRepository,
    @Inject('IGradeRepository')
    private readonly gradeRepository: IGradeRepository,
  ) {}

  async exec({
    institutionId,
    page,
    limit,
  }: FetchChildrenByInstitutionIdServiceRequest): Promise<FetchChildrenByInstitutionIdServiceResponse> {
    if (!institutionId.length) {
      throw new BadRequestException('You must provide a valid institution id');
    }
    const doesInstitutionExist =
      await this.institutionsRepository.findInstitutionById(institutionId);
    if (!doesInstitutionExist) {
      throw new NotFoundException('Institution id is not found');
    }
    const childrenFromRepository =
      await this.childrenRepository.findChildrenByInstitutionId({
        institutionId,
        page,
        limit,
      });

    const children = await Promise.all(
      childrenFromRepository.map(async (child) => {
        const period = child.periodId
          ? await this.periodRepository.findPeriodById(child.periodId)
          : null;
        const grade = child.gradeId
          ? await this.gradeRepository.findGradeById(child.gradeId)
          : null;
        return {
          name: child.name,
          id: child.id,
          cpf: child.cpf,
          birthDate: child.birthDate,
          picture: child.picture,
          createdAt: child.createdAt,
          deletedAt: child.deletedAt,
          institutionId: child.institutionId,
          period: period,
          grade: grade,
          isPresent: child.isPresent,
        };
      }),
    );

    return { children };
  }
}
