import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPeriodRepository } from '../repositories/interfaces/period-repository.interface';
import { IInstitutionsRepository } from 'src/modules/institutions/repositories/interfaces/institutions-repository.interface';

type Period = {
  id: string;
  name: string;
};

type FetchPeriodsByInstitutionIdServiceRequest = {
  institutionId: string;
};

type FetchPeriodsByInstitutionIdServiceResponse = {
  periods: Period[];
};
@Injectable()
export class FetchPeriodsByInstitutionIdService {
  constructor(
    @Inject('IPeriodRepository')
    private readonly periodRepository: IPeriodRepository,
    @Inject('IInstitutionsRepository')
    private readonly institutionsRepository: IInstitutionsRepository,
  ) {}

  async exec({
    institutionId,
  }: FetchPeriodsByInstitutionIdServiceRequest): Promise<FetchPeriodsByInstitutionIdServiceResponse> {
    const doesInstitutionExist =
      await this.institutionsRepository.findInstitutionById(institutionId);
    if (!doesInstitutionExist) {
      throw new NotFoundException('Institution id provided does not exist');
    }

    const periodsFromRepository =
      await this.periodRepository.fetchPeriodsByInstitutionId(institutionId);

    const periods = periodsFromRepository.map((period) => {
      return { id: period.id, name: period.name };
    });

    return { periods };
  }
}
