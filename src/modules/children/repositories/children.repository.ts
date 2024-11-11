import { Child } from '@prisma/client';
import {
  IChildrenRepository,
  ICreateChildnterface,
} from 'src/modules/interfaces/children-repository.interface';
import { prisma } from 'src/prisma/prisma-client';

export class ChildrenRepository implements IChildrenRepository {
  async create({
    name,
    cpf,
    grade,
    teacher,
    birthDate,
    picture,
    period,
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
      },
    });

    return child;
  }
}
