import { ResponsibleOnInstitution } from '@prisma/client';

export interface CreateResponsibleOnInstitutionInterface {
  responsibleId: string;
  institutionId: string;
}

export interface IResponsibleOnInstitutionRepository {
  findResponsibleOnInstitutionById({
    responsibleId,
    institutionId,
  }: CreateResponsibleOnInstitutionInterface): Promise<ResponsibleOnInstitution | null>;
  createResponsibleOnInstitution({
    responsibleId,
    institutionId,
  }: CreateResponsibleOnInstitutionInterface): Promise<ResponsibleOnInstitution>;
}
