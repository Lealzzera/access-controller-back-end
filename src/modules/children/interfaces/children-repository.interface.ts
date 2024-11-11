import { Child } from '@prisma/client';

export interface ICreateChildnterface {
  name: string;
  cpf: string;
  grade?: string;
  teacher?: string;
  birthDate?: Date;
  picture?: string;
  period: 'MORNING' | 'AFTERNOON' | 'ALLDAY';
  institutionId: string;
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
    institutionId,
  }: ICreateChildnterface): Promise<Child>;

  findChildById(id: string): Promise<Child | null>;
}
