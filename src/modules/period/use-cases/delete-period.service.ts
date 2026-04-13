import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPeriodRepository } from '../repositories/interfaces/period-repository.interface';

type DeletePeriodServiceRequest = {
  periodId: string;
};

type DeletePeriodServiceResponse = {
  id: string;
  name: string;
  institutionId: string;
};

@Injectable()
export class DeletePeriodService {
  constructor(
    @Inject('IPeriodRepository')
    private readonly periodRepository: IPeriodRepository,
  ) {}

  async exec({
    periodId,
  }: DeletePeriodServiceRequest): Promise<DeletePeriodServiceResponse> {
    const period = await this.periodRepository.findPeriodById(periodId);
    if (!period) {
      throw new NotFoundException('Period id provided does not exist.');
    }

    const deletedPeriod = await this.periodRepository.delete(periodId);

    return {
      id: deletedPeriod.id,
      name: deletedPeriod.name,
      institutionId: deletedPeriod.institutionId,
    };
  }
}
