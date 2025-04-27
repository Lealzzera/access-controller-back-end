import { Period } from '@prisma/client';

export interface IPeriodRepository {
  findPeriodById(periodId: string): Promise<Period | null>;
  fetchPeriodsByInstitutionId(institutionId: string): Promise<Period[]>;
}
