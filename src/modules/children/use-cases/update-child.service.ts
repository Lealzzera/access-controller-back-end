import { Inject, NotFoundException } from '@nestjs/common';
import { IChildrenRepository } from '../repositories/interfaces/children-repository.interface';
import { Child } from '@prisma/client';
import { IGradeRepository } from 'src/modules/grade/repositories/interfaces/grade-repository.interface';
import { IInstitutionsRepository } from 'src/modules/institutions/repositories/interfaces/institutions-repository.interface';
import { IPeriodRepository } from 'src/modules/period/repositories/interfaces/period-repository.interface';

interface UpdateChildServiceRequest {
  id: string;
  gradeId?: string;
  institutionId?: string;
  name?: string;
  periodId?: string;
  picture?: string;
}

interface UpdateChildServiceResponse {
  child: Child;
}

export class UpdateChildService {
  constructor(
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
    @Inject('IInstitutionsRepository')
    private readonly institutionRepository: IInstitutionsRepository,
    @Inject('IGradeRepository')
    private readonly gradeRepository: IGradeRepository,
    @Inject('IPeriodRepository')
    private readonly periodRepository: IPeriodRepository,
  ) {}
  async exec({
    id,
    gradeId,
    institutionId,
    name,
    periodId,
    picture,
  }: UpdateChildServiceRequest): Promise<UpdateChildServiceResponse> {
    const doesChildExist = await this.childrenRepository.findChildById(id);
    if (!doesChildExist) {
      throw new NotFoundException('Child id provided does not exist');
    }

    if (institutionId) {
      const doesInstitutionExist =
        await this.institutionRepository.findInstitutionById(institutionId);
      if (!doesInstitutionExist) {
        throw new NotFoundException('Institution id provided does not exist');
      }
    }

    if (gradeId) {
      const doesGradeIdExist =
        await this.gradeRepository.findGradeById(gradeId);
      if (!doesGradeIdExist) {
        throw new NotFoundException('Grade id provided does not exist');
      }
    }

    if (periodId) {
      const doesPeriodExist =
        await this.periodRepository.findPeriodById(periodId);
      if (!doesPeriodExist) {
        throw new NotFoundException('Period id provided does not exist');
      }
    }

    const childUpdated = await this.childrenRepository.update({
      id,
      gradeId,
      institutionId,
      name,
      periodId,
      picture,
    });

    return { child: childUpdated };
  }
}
