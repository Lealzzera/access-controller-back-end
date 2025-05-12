import { Responsible, Role } from '@prisma/client';

export interface ICreateResponsible {
  name: string;
  email: string;
  password: string;
  picture?: string;
  cpf: string;
  role: Role;
}

export interface IResponsibleRepository {
  findResponsibleByEmail(email: string): Promise<Responsible | null>;
  findResponsibleByCpf(cpf: string): Promise<Responsible | null>;
  findResponsibleById(id: string): Promise<Responsible | null>;
  create({
    email,
    name,
    password,
    picture,
    cpf,
    role,
  }: ICreateResponsible): Promise<Responsible>;
}
