import { Period } from '@prisma/client';
import { IPeriodRepository } from './interfaces/period-repository.interface';
import { prisma } from 'src/prisma/prisma-client';

export class PeriodRepository implements IPeriodRepository {
  async findPeriodById(periodId: string): Promise<Period | null> {
    const period = await prisma.period.findFirst({
      where: {
        id: periodId,
      },
    });

    return period;
  }
}
