import { ResponsibleOnChildren } from '@prisma/client';

export interface ICreateResponsibleOnChildren {
  childId: string;
  responsibleId: string;
}

export interface IResponsibleOnChildrenRepository {
  create({
    childId,
    responsibleId,
  }: ICreateResponsibleOnChildren): Promise<ResponsibleOnChildren>;

  findResponsibleOnChildrenById({
    childId,
    responsibleId,
  }: ICreateResponsibleOnChildren): Promise<ResponsibleOnChildren | null>;
}
