import { Institution } from '@prisma/client';
import {
  ICreateInstitution,
  IInstitutionsRepository,
} from '../interfaces/institutions-repository.interface';
import { prisma } from 'src/prisma/prisma-client';

export class InstitutionsRepository implements IInstitutionsRepository {
  async create({
    name,
    cnpj,
    street,
    neighborhood,
    city,
    state,
    cep,
    email,
    password,
    responsible,
    picture,
  }: ICreateInstitution): Promise<Institution> {
    const institution = await prisma.institution.create({
      data: {
        name,
        cnpj,
        street,
        neighborhood,
        city,
        state,
        cep,
        email,
        password,
        responsible,
        picture,
      },
    });

    return institution;
  }
}
