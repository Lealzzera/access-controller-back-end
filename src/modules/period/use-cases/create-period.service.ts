import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPeriodRepository } from '../repositories/interfaces/period-repository.interface';
import { IInstitutionsRepository } from 'src/modules/institutions/repositories/interfaces/institutions-repository.interface';

type CreatePeriodServiceRequest = {
  name: string;
  institutionId: string;
};

type CreatePeriodServiceResponse = {
  id: string;
  name: string;
  institutionId: string;
};

@Injectable()
export class CreatePeriodService {
  constructor(
    @Inject('IPeriodRepository')
    private readonly periodRepository: IPeriodRepository,
    @Inject('IInstitutionsRepository')
    private readonly institutionRepository: IInstitutionsRepository,
  ) {}

  async exec({
    name,
    institutionId,
  }: CreatePeriodServiceRequest): Promise<CreatePeriodServiceResponse> {
    const doesInstitutionExist =
      await this.institutionRepository.findInstitutionById(institutionId);
    if (!doesInstitutionExist) {
      throw new NotFoundException('Institution id provided does not exist.');
    }

    const period = await this.periodRepository.create({ name, institutionId });

    return {
      id: period.id,
      name: period.name,
      institutionId: period.institutionId,
    };
  }
}
