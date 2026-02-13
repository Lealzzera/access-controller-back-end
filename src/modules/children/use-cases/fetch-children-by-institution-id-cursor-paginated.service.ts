import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { IChildrenRepository } from '../repositories/interfaces/children-repository.interface';
import { IInstitutionsRepository } from 'src/modules/institutions/repositories/interfaces/institutions-repository.interface';
import { IPeriodRepository } from 'src/modules/period/repositories/interfaces/period-repository.interface';
import { IGradeRepository } from 'src/modules/grade/repositories/interfaces/grade-repository.interface';
import { GetPresignedUrlService } from '../../aws/get-presigned-url.service';

type Child = {
  name: string;
  id: string;
  cpf: string;
  birthDate: Date;
  picture: string | null;
  createdAt: Date;
  deletedAt: Date;
  institutionId: string;
  period: { id: string; name: string };
  grade: { id: string; name: string };
  isPresent: boolean;
};

type FetchChildrenByInstitutionIdCursorPaginatedServiceRequest = {
  institutionId: string;
  cursor?: string;
  take: number;
};

type FetchChildrenByInstitutionIdCursorPaginatedServiceResponse = {
  children: Child[];
  nextCursor: string | null;
};

export class FetchChildrenByInstitutionIdCursorPaginatedService {
  constructor(
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
    @Inject('IInstitutionsRepository')
    private readonly institutionsRepository: IInstitutionsRepository,
    @Inject('IPeriodRepository')
    private readonly periodRepository: IPeriodRepository,
    @Inject('IGradeRepository')
    private readonly gradeRepository: IGradeRepository,
    private readonly getPresignedUrlService: GetPresignedUrlService,
  ) {}

  async exec({
    institutionId,
    cursor,
    take,
  }: FetchChildrenByInstitutionIdCursorPaginatedServiceRequest): Promise<FetchChildrenByInstitutionIdCursorPaginatedServiceResponse> {
    if (!institutionId.length) {
      throw new BadRequestException('You must provide a valid institution id');
    }

    const doesInstitutionExist =
      await this.institutionsRepository.findInstitutionById(institutionId);
    if (!doesInstitutionExist) {
      throw new NotFoundException('Institution id is not found');
    }

    const result =
      await this.childrenRepository.findChildrenByInstitutionIdCursorPaginated({
        institutionId,
        cursor,
        take,
      });

    const children = await Promise.all(
      result.data.map(async (child) => {
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
          name: child.name,
          id: child.id,
          cpf: child.cpf,
          birthDate: child.birthDate,
          picture: presignedPicture,
          createdAt: child.createdAt,
          deletedAt: child.deletedAt,
          institutionId: child.institutionId,
          period: period,
          grade: grade,
          isPresent: child.isPresent,
        };
      }),
    );

    return { children, nextCursor: result.nextCursor };
  }
}
