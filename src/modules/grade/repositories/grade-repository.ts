import { Grade } from '@prisma/client';
import {
  ICreateGrade,
  IGradeRepository,
  IUpdateGrade,
} from './interfaces/grade-repository.interface';
import { prisma } from 'src/prisma/prisma-client';

export class GradeRepository implements IGradeRepository {
  async fetchGradesByInstitutionId(institutionId: string): Promise<Grade[]> {
    const grades = await prisma.grade.findMany({
      where: {
        institutionId,
      },
    });

    return grades;
  }
  async findGradeById(gradeId: string): Promise<Grade | null> {
    const grade = await prisma.grade.findFirst({
      where: {
        id: gradeId,
      },
    });

    return grade;
  }

  async create({ name, institutionId }: ICreateGrade): Promise<Grade> {
    const grade = await prisma.grade.create({
      data: {
        name,
        institutionId,
      },
    });

    return grade;
  }

  async update({ id, name }: IUpdateGrade): Promise<Grade> {
    const grade = await prisma.grade.update({
      where: { id },
      data: { name },
    });

    return grade;
  }

  async delete(gradeId: string): Promise<Grade> {
    const grade = await prisma.grade.delete({
      where: {
        id: gradeId,
      },
    });

    return grade;
  }
}
