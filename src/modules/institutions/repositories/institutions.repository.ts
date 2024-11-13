import { Institution } from '@prisma/client';

import { prisma } from 'src/prisma/prisma-client';
import {
  ICreateInstitution,
  IInstitutionsRepository,
} from './interfaces/institutions-repository.interface';

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
    role,
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
        role,
      },
    });

    return institution;
  }
}
