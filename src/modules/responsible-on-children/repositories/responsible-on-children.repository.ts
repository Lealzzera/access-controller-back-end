import { ResponsibleOnChildren } from '@prisma/client';
import {
  ICreateResponsibleOnChildren,
  IFindResponsibleOnChildrenById,
  IResponsibleOnChildrenRepository,
} from './interfaces/responsible-on-children-repository.interface';
import { prisma } from 'src/prisma/prisma-client';

export class ResponsibleOnChildrenRepository
  implements IResponsibleOnChildrenRepository
{
  async findResponsibleListByChildId(
    childId: string,
  ): Promise<ResponsibleOnChildren[] | []> {
    const responsibleList = await prisma.responsibleOnChildren.findMany({
      where: {
        childId,
      },
    });

    return responsibleList;
  }
  async findChildListByResponsibleId(
    responsibleId: string,
  ): Promise<ResponsibleOnChildren[] | null> {
    const childIdArray = await prisma.responsibleOnChildren.findMany({
      where: {
        responsibleId,
      },
    });

    return childIdArray ?? null;
  }

  async findResponsibleOnChildrenById({
    childId,
    responsibleId,
  }: IFindResponsibleOnChildrenById): Promise<ResponsibleOnChildren | null> {
    const responsibleOnChildren = await prisma.responsibleOnChildren.findFirst({
      where: {
        childId: childId,
        responsibleId: responsibleId,
      },
    });

    return responsibleOnChildren ?? null;
  }
  async create({
    childId,
    responsibleId,
    kinship,
  }: ICreateResponsibleOnChildren): Promise<ResponsibleOnChildren> {
    const responsibleOnChildren = await prisma.responsibleOnChildren.create({
      data: {
        childId,
        responsibleId,
        kinship,
      },
    });

    return responsibleOnChildren;
  }
}
