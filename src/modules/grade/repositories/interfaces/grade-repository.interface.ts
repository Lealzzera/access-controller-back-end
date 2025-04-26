import { Grade } from '@prisma/client';

export interface IGradeRepository {
  findGradeById(gradeId: string): Promise<Grade | null>;
}
