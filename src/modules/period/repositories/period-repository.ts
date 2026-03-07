import { Period } from '@prisma/client';
import {
  ICreatePeriod,
  IPeriodRepository,
  IUpdatePeriod,
} from './interfaces/period-repository.interface';
import { prisma } from 'src/prisma/prisma-client';

export class PeriodRepository implements IPeriodRepository {
  async fetchPeriodsByInstitutionId(institutionId: string): Promise<Period[]> {
    const periods = await prisma.period.findMany({
      where: {
        institutionId,
      },
    });

    return periods;
  }
  async findPeriodById(periodId: string): Promise<Period | null> {
    const period = await prisma.period.findFirst({
      where: {
        id: periodId,
      },
    });

    return period;
  }

  async create({ name, institutionId }: ICreatePeriod): Promise<Period> {
    const period = await prisma.period.create({
      data: {
        name,
        institutionId,
      },
    });

    return period;
  }

  async update({ id, name }: IUpdatePeriod): Promise<Period> {
    const period = await prisma.period.update({
      where: { id },
      data: { name },
    });

    return period;
  }

  async delete(periodId: string): Promise<Period> {
    const period = await prisma.period.delete({
      where: {
        id: periodId,
      },
    });

    return period;
  }
}
