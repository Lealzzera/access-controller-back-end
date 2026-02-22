import { Inject, NotFoundException } from '@nestjs/common';
import { IChildrenRepository } from '../repositories/interfaces/children-repository.interface';
import { IPeriodRepository } from 'src/modules/period/repositories/interfaces/period-repository.interface';
import { IGradeRepository } from 'src/modules/grade/repositories/interfaces/grade-repository.interface';
import { GetPresignedUrlService } from '../../aws/get-presigned-url.service';

export class FetchChildByIdService {
  constructor(
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
    @Inject('IPeriodRepository')
    private readonly periodRepository: IPeriodRepository,
    @Inject('IGradeRepository')
    private readonly gradeRepository: IGradeRepository,
    private readonly getPresignedUrlService: GetPresignedUrlService,
  ) {}

  async exec(id: string) {
    const child = await this.childrenRepository.findChildById(id);

    if (!child) {
      throw new NotFoundException('Child not found.');
    }

    const period = child.periodId
      ? await this.periodRepository.findPeriodById(child.periodId)
      : null;
    const grade = child.gradeId
      ? await this.gradeRepository.findGradeById(child.gradeId)
      : null;
    const presignedPicture = child.picture
      ? await this.getPresignedUrlService.exec(child.picture)
      : null;

    return {
      id: child.id,
      name: child.name,
      cpf: child.cpf,
      birthDate: child.birthDate,
      picture: presignedPicture,
      createdAt: child.createdAt,
      deletedAt: child.deletedAt,
      institutionId: child.institutionId,
      period,
      grade,
    };
  }
}
