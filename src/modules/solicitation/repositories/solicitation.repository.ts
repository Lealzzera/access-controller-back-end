import { SolicitationStatus } from '@prisma/client';
import {
  ICreateSolicitation,
  ISolicitationRepository,
  ISolicitationWithDetails,
} from './interfaces/solicitation-repository.interface';
import { prisma } from 'src/prisma/prisma-client';

const solicitationInclude = {
  child: {
    select: { id: true, name: true, picture: true },
  },
  responsible: {
    select: { id: true, name: true, picture: true },
  },
};

export class SolicitationRepository implements ISolicitationRepository {
  async create(data: ICreateSolicitation): Promise<ISolicitationWithDetails> {
    const solicitation = await prisma.solicitation.create({
      data,
      include: solicitationInclude,
    });

    return solicitation;
  }

  async findById(id: string): Promise<ISolicitationWithDetails | null> {
    const solicitation = await prisma.solicitation.findFirst({
      where: { id },
      include: solicitationInclude,
    });

    return solicitation ?? null;
  }

  async updateStatus(
    id: string,
    status: SolicitationStatus,
  ): Promise<ISolicitationWithDetails> {
    const solicitation = await prisma.solicitation.update({
      where: { id },
      data: { status },
      include: solicitationInclude,
    });

    return solicitation;
  }

  async findPendingByInstitutionId(
    institutionId: string,
  ): Promise<ISolicitationWithDetails[]> {
    const solicitations = await prisma.solicitation.findMany({
      where: {
        institutionId,
        status: 'PENDING',
      },
      include: solicitationInclude,
      orderBy: { createdAt: 'asc' },
    });

    return solicitations;
  }
}
