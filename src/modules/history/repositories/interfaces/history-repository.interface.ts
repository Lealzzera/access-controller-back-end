import { History, SolicitationType } from '@prisma/client';

export interface ICreateHistory {
  type: SolicitationType;
  childId: string;
  responsibleId: string;
  institutionId: string;
}

export interface IHistoryWithDetails extends History {
  child: { id: string; name: string; picture: string | null };
  responsible: { id: string; name: string; picture: string | null };
}

export interface IHistoryRepository {
  create(data: ICreateHistory): Promise<IHistoryWithDetails>;
  findByChildId(childId: string): Promise<IHistoryWithDetails[]>;
  findByInstitutionId(institutionId: string): Promise<IHistoryWithDetails[]>;
  findByResponsibleId(responsibleId: string): Promise<IHistoryWithDetails[]>;
}
