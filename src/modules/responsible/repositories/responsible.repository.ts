import { Responsible } from '@prisma/client';
import {
  ICreateResponsible,
  IResponsibleRepository,
  IUpdateResponsible,
} from './interfaces/responsible-repository.interface';
import { prisma } from 'src/prisma/prisma-client';

export class ResponsibleRepository implements IResponsibleRepository {
  async update({
    id,
    name,
    password,
    picture,
  }: IUpdateResponsible): Promise<Responsible> {
    const responsible = await prisma.responsible.update({
      where: { id },
      data: {
        name,
        password,
        picture,
      },
    });

    return responsible;
  }

  async findResponsibleByCpf(cpf: string): Promise<Responsible | null> {
    const resopnsible = await prisma.responsible.findFirst({
      where: {
        cpf,
      },
    });

    return resopnsible ?? null;
  }

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
    picture,
    cpf,
    role,
  }: ICreateResponsible): Promise<Responsible> {
    const responsible = await prisma.responsible.create({
      data: {
        email,
        name,
        password,
        picture,
        cpf,
        role,
      },
    });
    return responsible;
  }
}
