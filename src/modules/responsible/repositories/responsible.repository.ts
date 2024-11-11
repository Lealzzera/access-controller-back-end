import { Responsible } from '@prisma/client';
import {
  ICreateResponsible,
  IResponsibleRepository,
} from './interfaces/responsible-repository.interface';
import { prisma } from 'src/prisma/prisma-client';

export class ResponsibleRepository implements IResponsibleRepository {
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
      },
    });
    return responsible;
  }
}
