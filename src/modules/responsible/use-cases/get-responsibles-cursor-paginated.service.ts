import { Inject } from '@nestjs/common';
import { IResponsibleRepository } from '../repositories/interfaces/responsible-repository.interface';

type GetResponsiblesCursorPaginatedServiceRequest = {
  cursor?: string;
  take: number;
};

type ResponsibleType = {
  name: string;
  email: string;
  cpf: string;
  street: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  cep: string | null;
  picture: string | null;
  role: string;
};

type GetResponsiblesCursorPaginatedServiceResponse = {
  responsibles: ResponsibleType[] | null;
  nextCursor: string | null;
};

export class GetResponsiblesCursorPaginatedService {
  constructor(
    @Inject('IResponsibleRepository')
    private readonly responsibleRepository: IResponsibleRepository,
  ) {}

  async exec({
    cursor,
    take,
  }: GetResponsiblesCursorPaginatedServiceRequest): Promise<GetResponsiblesCursorPaginatedServiceResponse> {
    const responsibles =
      await this.responsibleRepository.findAllCursorPaginated({
        take,
        cursor,
      });

    return {
      responsibles: responsibles.data,
      nextCursor: responsibles.nextCursor,
    };
  }
}
