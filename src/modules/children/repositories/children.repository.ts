import { Child } from '@prisma/client';

import { prisma } from 'src/prisma/prisma-client';
import {
  IChildrenRepository,
  ICreateChildnterface,
} from '../interfaces/children-repository.interface';

export class ChildrenRepository implements IChildrenRepository {
  async findChildById(id: string): Promise<Child | null> {
    const child = await prisma.child.findFirst({
      where: {
        id,
      },
    });

    return child ?? null;
  }
  async create({
    name,
    cpf,
    grade,
    teacher,
    birthDate,
    picture,
    period,
    institutionId,
  }: ICreateChildnterface): Promise<Child> {
    const child = await prisma.child.create({
      data: {
        name,
        cpf,
        grade,
        teacher,
        birthDate,
        picture,
        period,
        institutionId,
      },
    });

    return child;
  }
}
