import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IGradeRepository } from '../repositories/interfaces/grade-repository.interface';
import { Grade } from '@prisma/client';
import { IInstitutionsRepository } from 'src/modules/institutions/repositories/interfaces/institutions-repository.interface';

type FetchGradesByInstitutionIdServiceRequest = {
  institutionId: string;
};

type FetchGradesByInstitutionIdServiceResponse = {
  grades: Grade[];
};

@Injectable()
export class FetchGradesByInstitutionIdService {
  constructor(
    @Inject('IGradeRepository')
    private readonly gradeRepository: IGradeRepository,
    @Inject('IInstitutionRepository')
    private readonly institutionRepository: IInstitutionsRepository,
  ) {}

  async exec({
    institutionId,
  }: FetchGradesByInstitutionIdServiceRequest): Promise<FetchGradesByInstitutionIdServiceResponse> {
    const doesInstitutionExist =
      await this.institutionRepository.findInstitutionById(institutionId);
    if (!doesInstitutionExist) {
      throw new NotFoundException('Institution id provided does not exist.');
    }

    const grades =
      await this.gradeRepository.fetchGradesByInstitutionId(institutionId);

    return { grades };
  }
}
