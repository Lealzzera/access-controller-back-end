import { Child } from '@prisma/client';

import { prisma } from 'src/prisma/prisma-client';
import {
  IChildrenRepository,
  ICreateChildinterface,
  IFetchChildrenByInstitutionId,
  IUpdateChildInterface,
} from './interfaces/children-repository.interface';

export class ChildrenRepository implements IChildrenRepository {
  async findChildrenByIds(ids: string[]): Promise<Child[] | null> {
    const children = await prisma.child.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return children;
  }
  async findChildrenByInstitutionId({
    institutionId,
    page,
    limit,
  }: IFetchChildrenByInstitutionId): Promise<Child[] | null> {
    const children = await prisma.child.findMany({
      skip: page && limit ? (page - 1) * limit : 0,
      take: limit || 20,
      where: {
        institutionId,
        deletedAt: null,
      },
    });

    return children;
  }
  async findChildByCpf(cpf: string): Promise<Child | null> {
    const child = await prisma.child.findFirst({
      where: {
        cpf,
      },
    });

    return child;
  }
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
    gradeId,
    periodId,
    birthDate,
    picture,
    institutionId,
  }: ICreateChildinterface): Promise<Child> {
    const child = await prisma.child.create({
      data: {
        name,
        cpf,
        gradeId,
        periodId,
        birthDate,
        picture,
        institutionId,
      },
    });

    return child;
  }

  async update({
    id,
    gradeId,
    institutionId,
    name,
    periodId,
    picture,
  }: IUpdateChildInterface): Promise<Child> {
    const child = await prisma.child.update({
      where: { id },
      data: {
        gradeId: gradeId || undefined,
        institutionId: institutionId || undefined,
        name: name || undefined,
        periodId: periodId || undefined,
        picture: picture || undefined,
      },
    });

    return child;
  }
}
