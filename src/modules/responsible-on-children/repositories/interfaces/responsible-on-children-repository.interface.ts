import { ResponsibleOnChildren } from '@prisma/client';

export interface ICreateResponsibleOnChildren {
  childId: string;
  responsibleId: string;
  kinshipId: string;
}

export interface IFindResponsibleOnChildrenById {
  childId: string;
  responsibleId: string;
}

export interface IResponsibleOnChildrenRepository {
  findChildListByResponsibleId(
    responsibleId: string,
  ): Promise<ResponsibleOnChildren[] | null>;
  create({
    childId,
    responsibleId,
    kinshipId,
  }: ICreateResponsibleOnChildren): Promise<ResponsibleOnChildren>;

  findResponsibleOnChildrenById({
    childId,
    responsibleId,
  }: IFindResponsibleOnChildrenById): Promise<ResponsibleOnChildren | null>;
}
