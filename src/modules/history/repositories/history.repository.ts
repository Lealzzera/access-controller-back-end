import {
  ICreateHistory,
  IHistoryRepository,
  IHistoryWithDetails,
} from './interfaces/history-repository.interface';
import { prisma } from 'src/prisma/prisma-client';

const historyInclude = {
  child: {
    select: { id: true, name: true, picture: true },
  },
  responsible: {
    select: { id: true, name: true, picture: true },
  },
};

export class HistoryRepository implements IHistoryRepository {
  async create(data: ICreateHistory): Promise<IHistoryWithDetails> {
    const history = await prisma.history.create({
      data,
      include: historyInclude,
    });

    return history;
  }

  async findByChildId(childId: string): Promise<IHistoryWithDetails[]> {
    const history = await prisma.history.findMany({
      where: { childId },
      include: historyInclude,
      orderBy: { createdAt: 'desc' },
    });

    return history;
  }

  async findByInstitutionId(
    institutionId: string,
  ): Promise<IHistoryWithDetails[]> {
    const history = await prisma.history.findMany({
      where: { institutionId },
      include: historyInclude,
      orderBy: { createdAt: 'desc' },
    });

    return history;
  }

  async findByResponsibleId(
    responsibleId: string,
  ): Promise<IHistoryWithDetails[]> {
    const history = await prisma.history.findMany({
      where: { responsibleId },
      include: historyInclude,
      orderBy: { createdAt: 'desc' },
    });

    return history;
  }
}
