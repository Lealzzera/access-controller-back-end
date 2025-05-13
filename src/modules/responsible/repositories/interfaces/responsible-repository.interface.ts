import { Responsible, Role } from '@prisma/client';

export interface ICreateResponsible {
  name: string;
  email: string;
  password: string;
  picture?: string;
  cpf: string;
  role: Role;
}

export interface IUpdateResponsible {
  id: string;
  name: string;
  password: string;
  picture: string;
}

export interface IResponsibleRepository {
  update({
    id,
    name,
    password,
    picture,
  }: IUpdateResponsible): Promise<Responsible>;
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
