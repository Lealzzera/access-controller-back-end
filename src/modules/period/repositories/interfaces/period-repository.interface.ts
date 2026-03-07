import { Period } from '@prisma/client';

export interface ICreatePeriod {
  name: string;
  institutionId: string;
}

export interface IUpdatePeriod {
  id: string;
  name: string;
}

export interface IPeriodRepository {
  findPeriodById(periodId: string): Promise<Period | null>;
  fetchPeriodsByInstitutionId(institutionId: string): Promise<Period[]>;
  create({ name, institutionId }: ICreatePeriod): Promise<Period>;
  update({ id, name }: IUpdatePeriod): Promise<Period>;
  delete(periodId: string): Promise<Period>;
}
