import { BadRequestException, Inject } from '@nestjs/common';
import { Institution } from '@prisma/client';
import { hash } from 'bcrypt';
import { IInstitutionsRepository } from '../repositories/interfaces/institutions-repository.interface';

type RegisterInstitutionServiceRequest = {
  name: string;
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

export class RegisterInstitutionService {
  constructor(
    @Inject('IInstitutionsRepository')
    private readonly institutionsRepository: IInstitutionsRepository,
  ) {}

  async exec({
    name,
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
    const doesInstitutionAlreadyExist =
      await this.institutionsRepository.findInstitutionByCnpj(cnpj);
    if (doesInstitutionAlreadyExist) {
      throw new BadRequestException('CNPJ provided already exists.');
    }
    const passwordHashed = await hash(password, 6);
    const institution = await this.institutionsRepository.create({
      name,
      cnpj,
      street,
      neighborhood,
      city,
      state,
      cep,
      picture,
      email,
      password: passwordHashed,
      responsible,
      role: 'INSTITUTION',
    });

    return { institution };
  }
}
