import { ResponsibleOnChildren } from '@prisma/client';

export interface ICreateResponsibleOnChildren {
  childId: string;
  responsibleId: string;
  kinship?: string;
}

export interface IFindResponsibleOnChildrenById {
  childId: string;
  responsibleId: string;
}

export interface IResponsibleOnChildrenRepository {
  findResponsibleListByChildId(
    childId: string,
  ): Promise<ResponsibleOnChildren[] | []>;
  findChildListByResponsibleId(
    responsibleId: string,
  ): Promise<ResponsibleOnChildren[] | null>;
  create({
    childId,
    responsibleId,
    kinship,
  }: ICreateResponsibleOnChildren): Promise<ResponsibleOnChildren>;

  findResponsibleOnChildrenById({
    childId,
    responsibleId,
  }: IFindResponsibleOnChildrenById): Promise<ResponsibleOnChildren | null>;
}
