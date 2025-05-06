import { Kinship } from '@prisma/client';
import { CreateKinship } from './interfaces/kinship-repository.interface';
import { prisma } from 'src/prisma/prisma-client';
import IKinshipRepository from './interfaces/kinship-repository.interface';

export default class KinshipRepository implements IKinshipRepository {
  async fetchAllKinship(): Promise<Kinship[]> {
    const kinshipList = await prisma.kinship.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return kinshipList;
  }
  async create({ name, value }: CreateKinship): Promise<Kinship> {
    const kinship = await prisma.kinship.create({
      data: {
        name,
        value,
      },
    });

    return kinship;
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
