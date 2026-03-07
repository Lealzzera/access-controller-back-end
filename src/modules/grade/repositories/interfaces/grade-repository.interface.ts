import { Grade } from '@prisma/client';

export interface ICreateGrade {
  name: string;
  institutionId: string;
}

export interface IGradeRepository {
  findGradeById(gradeId: string): Promise<Grade | null>;
  fetchGradesByInstitutionId(institutionId: string): Promise<Grade[]>;
  create({ name, institutionId }: ICreateGrade): Promise<Grade>;
}
