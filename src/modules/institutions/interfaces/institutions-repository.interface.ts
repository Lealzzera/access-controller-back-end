import { Institution } from '@prisma/client';

export interface ICreateInstitution {
  name;
  cnpj?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep?: string;
  picture?: string;
  email: string;
  responsible: string;
  password: string;
}

export interface IInstitutionsRepository {
  create({
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
  }: ICreateInstitution): Promise<Institution>;
}
