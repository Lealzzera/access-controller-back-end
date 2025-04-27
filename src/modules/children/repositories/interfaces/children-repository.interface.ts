import { Child } from '@prisma/client';

export interface ICreateChildinterface {
  name: string;
  cpf: string;
  gradeId: string;
  periodId: string;
  birthDate: Date;
  picture: string;
  institutionId: string;
}

export interface IFetchChildrenByInstitutionId {
  institutionId: string;
  page?: number;
  limit?: number;
}

export interface IUpdateChildInterface {
  id: string;
  name?: string;
  gradeId?: string;
  periodId?: string;
  picture?: string;
  institutionId?: string;
}

export interface IChildrenRepository {
  findChildrenByIds(id: string[]): Promise<Child[] | null>;
  findChildrenByInstitutionId({
    institutionId,
    page,
    limit,
  }: IFetchChildrenByInstitutionId): Promise<Child[] | null>;
  findChildByCpf(cpf: string): Promise<Child | null>;
  findChildById(id: string): Promise<Child | null>;
  create({
    name,
    cpf,
    gradeId,
    periodId,
    birthDate,
    picture,
    institutionId,
  }: ICreateChildinterface): Promise<Child>;
  update({
    id,
    gradeId,
    institutionId,
    name,
    periodId,
    picture,
  }: IUpdateChildInterface): Promise<Child>;
}
