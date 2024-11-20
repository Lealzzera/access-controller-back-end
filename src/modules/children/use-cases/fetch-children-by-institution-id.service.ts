import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { Child } from '@prisma/client';
import { IChildrenRepository } from '../repositories/interfaces/children-repository.interface';
import { IInstitutionsRepository } from 'src/modules/institutions/repositories/interfaces/institutions-repository.interface';

type FetchChildrenByInstitutionIdServiceRequest = {
  institutionId: string;
  page?: number;
  limit?: number;
};

type FetchChildrenByInstitutionIdServiceResponse = {
  children: Child[];
};

export class FetchChildrenByInstitutionIdService {
  constructor(
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
    @Inject('IInstitutionsRepository')
    private readonly institutionsRepository: IInstitutionsRepository,
  ) {}

  async exec({
    institutionId,
    page,
    limit,
  }: FetchChildrenByInstitutionIdServiceRequest): Promise<FetchChildrenByInstitutionIdServiceResponse> {
    if (!institutionId.length) {
      throw new BadRequestException('You must provide a valid institution id');
    }
    const doesInstitutionExist =
      await this.institutionsRepository.findInstitutionById(institutionId);
    if (!doesInstitutionExist) {
      throw new NotFoundException('Institution id is not found');
    }
    const children = await this.childrenRepository.findChildrenByInstitutionId({
      institutionId,
      page,
      limit,
    });
    return { children };
  }
}
