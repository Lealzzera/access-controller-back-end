import { Responsible, Role } from '@prisma/client';

export interface ICreateResponsible {
  name: string;
  email: string;
  password: string;
  picture?: string;
  cpf: string;
  phoneNumber?: string;
  role: Role;
}

export interface IUpdateResponsible {
  id: string;
  name: string;
  password: string;
  picture: string;
}

export interface IFindAllResponsiblesCursorPaginated {
  institutionId: string;
  cursor?: string;
  take: number;
}

export interface ICursorPaginatedResult {
  data: Responsible[];
  nextCursor: string | null;
}

export interface IResponsibleRepository {
  findAllCursorPaginated({
    institutionId,
    cursor,
    take,
  }: IFindAllResponsiblesCursorPaginated): Promise<ICursorPaginatedResult>;
  findResponsiblesByIds(ids: string[]): Promise<Responsible[] | []>;
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
    phoneNumber,
    role,
  }: ICreateResponsible): Promise<Responsible>;
}
