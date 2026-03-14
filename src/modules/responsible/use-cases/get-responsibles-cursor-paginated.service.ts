import { Inject } from '@nestjs/common';
import { IResponsibleRepository } from '../repositories/interfaces/responsible-repository.interface';
import { GetPresignedUrlService } from '../../aws/get-presigned-url.service';
import { IInstitutionsRepository } from 'src/modules/institutions/repositories/interfaces/institutions-repository.interface';

type GetResponsiblesCursorPaginatedServiceRequest = {
  institutionId: string;
  cursor?: string;
  take: number;
};

type ResponsibleType = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phoneNumber: string | null;
  picture: string | null;
};

type GetResponsiblesCursorPaginatedServiceResponse = {
  responsibles: ResponsibleType[] | null;
  nextCursor: string | null;
};

export class GetResponsiblesCursorPaginatedService {
  constructor(
    @Inject('IResponsibleRepository')
    private readonly responsibleRepository: IResponsibleRepository,
    private readonly getPresignedUrlService: GetPresignedUrlService,
    @Inject('IInstitutionsRepository')
    private readonly institutionRepository: IInstitutionsRepository,
  ) {}

  async exec({
    institutionId,
    cursor,
    take,
  }: GetResponsiblesCursorPaginatedServiceRequest): Promise<GetResponsiblesCursorPaginatedServiceResponse> {
    const doesTheInstitutionExists =
      await this.institutionRepository.findInstitutionById(institutionId);
    if (!doesTheInstitutionExists) {
      throw new Error('Institution not found');
    }
    const responsibles =
      await this.responsibleRepository.findAllCursorPaginated({
        take,
        cursor,
        institutionId,
      });

    const responsiblesWithPresignedUrls = responsibles.data
      ? await Promise.all(
          responsibles.data.map(async (responsible) => ({
            id: responsible.id,
            name: responsible.name,
            email: responsible.email,
            cpf: responsible.cpf,
            phoneNumber: responsible.phoneNumber,
            picture: responsible.picture
              ? await this.getPresignedUrlService.exec(responsible.picture)
              : null,
          })),
        )
      : null;

    return {
      responsibles: responsiblesWithPresignedUrls,
      nextCursor: responsibles.nextCursor,
    };
  }
}
