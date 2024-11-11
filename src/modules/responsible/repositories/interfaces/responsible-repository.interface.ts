import { Responsible } from '@prisma/client';

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
}

export interface IResponsibleRepository {
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
  }: ICreateResponsible): Promise<Responsible>;
}
