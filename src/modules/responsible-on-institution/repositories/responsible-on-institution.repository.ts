import { ResponsibleOnInstitution } from '@prisma/client';
import {
  CreateResponsibleOnInstitutionInterface,
  IResponsibleOnInstitutionRepository,
} from './interfaces/responsible-on-institution-repository.interface';
import { prisma } from 'src/prisma/prisma-client';

export class ResponsibleOnInstitutionRepository
  implements IResponsibleOnInstitutionRepository
{
  async findResponsibleOnInstitutionById({
    responsibleId,
    institutionId,
  }: CreateResponsibleOnInstitutionInterface): Promise<ResponsibleOnInstitution | null> {
    const responsibleOnInstitution =
      await prisma.responsibleOnInstitution.findFirst({
        where: {
          responsibleId,
          institutionId,
        },
      });
    return responsibleOnInstitution;
  }

  async createResponsibleOnInstitution({
    responsibleId,
    institutionId,
  }: CreateResponsibleOnInstitutionInterface): Promise<ResponsibleOnInstitution> {
    const responsibleOnInstitution =
      await prisma.responsibleOnInstitution.create({
        data: {
          responsibleId,
          institutionId,
        },
      });
    return responsibleOnInstitution;
  }
}
