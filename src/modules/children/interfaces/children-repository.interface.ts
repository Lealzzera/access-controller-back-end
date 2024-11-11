import { Child } from '@prisma/client';

export interface ICreateChildnterface {
  name: string;
  cpf: string;
  grade?: string;
  teacher?: string;
  birthDate?: Date;
  picture?: string;
  period: 'MORNING' | 'AFTERNOON' | 'ALLDAY';
}

export interface IChildrenRepository {
  create({
    name,
    cpf,
    grade,
    teacher,
    birthDate,
    picture,
    period,
  }: ICreateChildnterface): Promise<Child>;
}
