import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { IResponsibleRepository } from '../repositories/interfaces/responsible-repository.interface';

type GetResponsibleDataServiceRequest = {
  responsibleId: string;
};

type GetResponsibleDataServiceResponse = {
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
export class GetResponsibleDataService {
  constructor(
    @Inject('IResponsibleRepository')
    private readonly responsibleRepository: IResponsibleRepository,
  ) {}

  async exec({
    responsibleId,
  }: GetResponsibleDataServiceRequest): Promise<GetResponsibleDataServiceResponse | null> {
    if (!responsibleId.length) {
      throw new BadRequestException('Must to provide a responsibleId');
    }

    const responsible =
      await this.responsibleRepository.findResponsibleById(responsibleId);

    if (!responsible) {
      throw new NotFoundException('Responsible not found');
    }
    return {
      name: responsible.name,
      email: responsible.email,
      cpf: responsible.cpf,
      street: responsible.street,
      neighborhood: responsible.neighborhood,
      city: responsible.city,
      cep: responsible.cep,
      state: responsible.state,
      picture: responsible.picture,
      role: responsible.role,
    };
  }
}
