import { Solicitation, SolicitationStatus, SolicitationType } from '@prisma/client';

export interface ICreateSolicitation {
  type: SolicitationType;
  childId: string;
  responsibleId: string;
  institutionId: string;
}

export interface ISolicitationWithDetails extends Solicitation {
  child: { id: string; name: string; picture: string | null };
  responsible: { id: string; name: string; picture: string | null };
}

export interface ISolicitationRepository {
  create(data: ICreateSolicitation): Promise<ISolicitationWithDetails>;
  findById(id: string): Promise<ISolicitationWithDetails | null>;
  updateStatus(id: string, status: SolicitationStatus): Promise<ISolicitationWithDetails>;
  findPendingByInstitutionId(institutionId: string): Promise<ISolicitationWithDetails[]>;
}
