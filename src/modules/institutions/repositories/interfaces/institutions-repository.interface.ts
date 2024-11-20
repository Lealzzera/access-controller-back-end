import { Institution, Role } from '@prisma/client';

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
  role: Role;
}

export interface IInstitutionsRepository {
  findInstitutionByEmail(email: string): Promise<Institution | null>;
  findInstitutionByCnpj(cnpj: string): Promise<Institution | null>;
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
    role,
  }: ICreateInstitution): Promise<Institution>;
}
