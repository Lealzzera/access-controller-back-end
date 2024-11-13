import { Responsible, Role } from '@prisma/client';

export interface ICreateResponsible {
  name: string;
  email: string;
  password: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep?: string;
  picture?: string;
  cpf: string;
  role: Role;
}

export interface IResponsibleRepository {
  findResponsibleByEmail(email: string): Promise<Responsible | null>;
  findResponsibleById(id: string): Promise<Responsible | null>;
  create({
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
    role,
  }: ICreateResponsible): Promise<Responsible>;
}
