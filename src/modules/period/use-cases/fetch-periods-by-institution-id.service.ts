import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPeriodRepository } from '../repositories/interfaces/period-repository.interface';
import { IInstitutionsRepository } from 'src/modules/institutions/repositories/interfaces/institutions-repository.interface';
import { Period } from '@prisma/client';

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

    const periods =
      await this.periodRepository.fetchPeriodsByInstitutionId(institutionId);

    return { periods };
  }
}
