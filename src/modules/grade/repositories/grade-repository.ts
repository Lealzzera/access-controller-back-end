import { Grade } from '@prisma/client';
import { IGradeRepository } from './interfaces/grade-repository.interface';
import { prisma } from 'src/prisma/prisma-client';

export class GradeRepository implements IGradeRepository {
  async findGradeById(gradeId: string): Promise<Grade | null> {
    const grade = await prisma.grade.findFirst({
      where: {
        id: gradeId,
      },
    });

    return grade;
  }
}
