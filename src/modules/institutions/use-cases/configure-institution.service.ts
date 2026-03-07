import { Inject, NotFoundException } from '@nestjs/common';
import { IInstitutionsRepository } from '../repositories/interfaces/institutions-repository.interface';
import { IPeriodRepository } from 'src/modules/period/repositories/interfaces/period-repository.interface';
import { IGradeRepository } from 'src/modules/grade/repositories/interfaces/grade-repository.interface';
import { Grade, Period } from '@prisma/client';

interface ConfigureInstitutionRequest {
  institutionId: string;
  periods: string[];
  grades: string[];
}

export interface ConfigureInstitutionResponse {
  periods: Period[];
  grades: Grade[];
}

export class ConfigureInstitutionService {
  constructor(
    @Inject('IInstitutionsRepository')
    private readonly institutionsRepository: IInstitutionsRepository,
    @Inject('IPeriodRepository')
    private readonly periodRepository: IPeriodRepository,
    @Inject('IGradeRepository')
    private readonly gradeRepository: IGradeRepository,
  ) {}

  async exec({
    institutionId,
    periods,
    grades,
  }: ConfigureInstitutionRequest): Promise<ConfigureInstitutionResponse> {
    const institution =
      await this.institutionsRepository.findInstitutionById(institutionId);

    if (!institution) {
      throw new NotFoundException('Institution not found');
    }

    const createdPeriods = await Promise.all(
      periods.map((name) =>
        this.periodRepository.create({ name, institutionId }),
      ),
    );

    const createdGrades = await Promise.all(
      grades.map((name) =>
        this.gradeRepository.create({ name, institutionId }),
      ),
    );

    return {
      periods: createdPeriods,
      grades: createdGrades,
    };
  }
}
