import { Inject, NotFoundException } from '@nestjs/common';
import { IPeriodRepository } from 'src/modules/period/repositories/interfaces/period-repository.interface';

interface DeletePeriodRequest {
  periodId: string;
}

export class DeletePeriodService {
  constructor(
    @Inject('IPeriodRepository')
    private readonly periodRepository: IPeriodRepository,
  ) {}

  async exec({ periodId }: DeletePeriodRequest) {
    const period = await this.periodRepository.findPeriodById(periodId);

    if (!period) {
      throw new NotFoundException('Period not found');
    }

    await this.periodRepository.delete(periodId);
  }
}
