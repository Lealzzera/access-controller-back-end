import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IGradeRepository } from '../repositories/interfaces/grade-repository.interface';
import { IInstitutionsRepository } from 'src/modules/institutions/repositories/interfaces/institutions-repository.interface';

type CreateGradeServiceRequest = {
  name: string;
  institutionId: string;
};

type CreateGradeServiceResponse = {
  id: string;
  name: string;
  institutionId: string;
};

@Injectable()
export class CreateGradeService {
  constructor(
    @Inject('IGradeRepository')
    private readonly gradeRepository: IGradeRepository,
    @Inject('IInstitutionRepository')
    private readonly institutionRepository: IInstitutionsRepository,
  ) {}

  async exec({
    name,
    institutionId,
  }: CreateGradeServiceRequest): Promise<CreateGradeServiceResponse> {
    const doesInstitutionExist =
      await this.institutionRepository.findInstitutionById(institutionId);
    if (!doesInstitutionExist) {
      console.log(doesInstitutionExist);
      throw new NotFoundException('Institution id provided does not exist.');
    }

    const grade = await this.gradeRepository.create({ name, institutionId });

    return {
      id: grade.id,
      name: grade.name,
      institutionId: grade.institutionId,
    };
  }
}