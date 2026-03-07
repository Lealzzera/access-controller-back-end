import { Inject, NotFoundException } from '@nestjs/common';
import { IGradeRepository } from 'src/modules/grade/repositories/interfaces/grade-repository.interface';
import { Grade } from '@prisma/client';

interface UpdateGradeRequest {
  gradeId: string;
  name: string;
}

export class UpdateGradeService {
  constructor(
    @Inject('IGradeRepository')
    private readonly gradeRepository: IGradeRepository,
  ) {}

  async exec({ gradeId, name }: UpdateGradeRequest): Promise<Grade> {
    const grade = await this.gradeRepository.findGradeById(gradeId);

    if (!grade) {
      throw new NotFoundException('Grade not found');
    }

    return this.gradeRepository.update({ id: gradeId, name });
  }
}
