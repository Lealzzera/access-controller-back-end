import { Inject } from '@nestjs/common';
import { IInstitutionsRepository } from '../interfaces/institutions-repository.interface';
import { Institution } from '@prisma/client';

type RegisterInstitutionServiceRequest = {
  cnpj?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep?: string;
  picture?: string;
  email: string;
  responsible: string;
  password: string;
};

type RegisterInstitutionServiceResponse = {
  institution: Institution;
};

export class RegisterService {
  constructor(
    @Inject('IInstitutionsRepository')
    private readonly institutionsRepository: IInstitutionsRepository,
  ) {}

  async exec({
    cnpj,
    street,
    neighborhood,
    city,
    state,
    cep,
    picture,
    email,
    password,
    responsible,
  }: RegisterInstitutionServiceRequest): Promise<RegisterInstitutionServiceResponse> {
    const institution = await this.institutionsRepository.create({
      cnpj,
      street,
      neighborhood,
      city,
      state,
      cep,
      picture,
      email,
      password,
      responsible,
    });

    return { institution };
  }
}
