import { Responsible } from '@prisma/client';
import {
  ICreateResponsible,
  IResponsibleRepository,
} from './interfaces/responsible-repository.interface';
import { prisma } from 'src/prisma/prisma-client';

export class ResponsibleRepository implements IResponsibleRepository {
  async findResponsibleByEmail(email: string): Promise<Responsible | null> {
    const responsible = await prisma.responsible.findFirst({
      where: {
        email,
      },
    });

    return responsible ?? null;
  }

  async findResponsibleById(id: string): Promise<Responsible | null> {
    const responsible = await prisma.responsible.findFirst({
      where: {
        id,
      },
    });

    return responsible ?? null;
  }
  async create({
    email,
    name,
    password,
    cep,
    city,
    neighborhood,
    picture,
    state,
    street,
    cpf,
  }: ICreateResponsible): Promise<Responsible> {
    const responsible = await prisma.responsible.create({
      data: {
        email,
        name,
        password,
        cep,
        city,
        neighborhood,
        picture,
        state,
        street,
        cpf,
      },
    });
    return responsible;
  }
}
