import { Kinship } from '@prisma/client';
import KinshipRepositoryInterface, {
  CreateKinship,
} from './interfaces/kinship-repository.interface';
import { prisma } from 'src/prisma/prisma-client';

export default class KinshipRepository implements KinshipRepositoryInterface {
  async fetchAllKinship(): Promise<Kinship[]> {
    const kinshipList = await prisma.kinship.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return kinshipList;
  }
  async create({ name, value }: CreateKinship): Promise<void> {
    await prisma.kinship.create({
      data: {
        name,
        value,
      },
    });
  }
  async fetchKinshipById(id: string): Promise<Kinship | null> {
    const kinship = await prisma.kinship.findFirst({
      where: {
        id,
      },
    });

    return kinship;
  }
}
