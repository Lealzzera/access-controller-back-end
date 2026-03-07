import { Inject, NotFoundException } from '@nestjs/common';
import { IGradeRepository } from 'src/modules/grade/repositories/interfaces/grade-repository.interface';

interface DeleteGradeRequest {
  gradeId: string;
}

export class DeleteGradeService {
  constructor(
    @Inject('IGradeRepository')
    private readonly gradeRepository: IGradeRepository,
  ) {}

  async exec({ gradeId }: DeleteGradeRequest) {
    const grade = await this.gradeRepository.findGradeById(gradeId);

    if (!grade) {
      throw new NotFoundException('Grade not found');
    }

    await this.gradeRepository.delete(gradeId);
  }
}
