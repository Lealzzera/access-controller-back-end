import { Period } from '@prisma/client';

export interface ICreatePeriod {
  name: string;
  institutionId: string;
}

export interface IPeriodRepository {
  findPeriodById(periodId: string): Promise<Period | null>;
  fetchPeriodsByInstitutionId(institutionId: string): Promise<Period[]>;
  create({ name, institutionId }: ICreatePeriod): Promise<Period>;
}
