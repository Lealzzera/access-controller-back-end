import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IGradeRepository } from '../repositories/interfaces/grade-repository.interface';

type DeleteGradeServiceRequest = {
  gradeId: string;
};

type DeleteGradeServiceResponse = {
  id: string;
  name: string;
  institutionId: string;
};

@Injectable()
export class DeleteGradeService {
  constructor(
    @Inject('IGradeRepository')
    private readonly gradeRepository: IGradeRepository,
  ) {}

  async exec({
    gradeId,
  }: DeleteGradeServiceRequest): Promise<DeleteGradeServiceResponse> {
    const grade = await this.gradeRepository.findGradeById(gradeId);
    if (!grade) {
      throw new NotFoundException('Grade id provided does not exist.');
    }

    const deletedGrade = await this.gradeRepository.delete(gradeId);

    return {
      id: deletedGrade.id,
      name: deletedGrade.name,
      institutionId: deletedGrade.institutionId,
    };
  }
}
