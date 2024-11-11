import { ResponsibleOnChildren } from '@prisma/client';
import {
  ICreateResponsibleOnChildren,
  IResponsibleOnChildrenRepository,
} from './interfaces/responsible-on-children-repository.interface';
import { prisma } from 'src/prisma/prisma-client';

export class ResponsibleOnChildrenRepository
  implements IResponsibleOnChildrenRepository
{
  async findResponsibleOnChildrenById({
    childId,
    responsibleId,
  }: ICreateResponsibleOnChildren): Promise<ResponsibleOnChildren | null> {
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
  }: ICreateResponsibleOnChildren): Promise<ResponsibleOnChildren> {
    const responsibleOnChildren = await prisma.responsibleOnChildren.create({
      data: {
        childId,
        responsibleId,
      },
    });

    return responsibleOnChildren;
  }
}
