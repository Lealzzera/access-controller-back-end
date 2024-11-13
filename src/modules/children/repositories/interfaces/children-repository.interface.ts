import { Child } from '@prisma/client';

export interface ICreateChildinterface {
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
  }: ICreateChildinterface): Promise<Child>;

  findChildById(id: string): Promise<Child | null>;
}
