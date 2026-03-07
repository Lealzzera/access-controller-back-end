import { Inject, NotFoundException } from '@nestjs/common';
import { IPeriodRepository } from 'src/modules/period/repositories/interfaces/period-repository.interface';
import { Period } from '@prisma/client';

interface UpdatePeriodRequest {
  periodId: string;
  name: string;
}

export class UpdatePeriodService {
  constructor(
    @Inject('IPeriodRepository')
    private readonly periodRepository: IPeriodRepository,
  ) {}

  async exec({ periodId, name }: UpdatePeriodRequest): Promise<Period> {
    const period = await this.periodRepository.findPeriodById(periodId);

    if (!period) {
      throw new NotFoundException('Period not found');
    }

    return this.periodRepository.update({ id: periodId, name });
  }
}
