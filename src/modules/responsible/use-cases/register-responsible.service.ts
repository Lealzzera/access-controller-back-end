import { Inject } from '@nestjs/common';
import { IResponsibleRepository } from '../repositories/interfaces/responsible-repository.interface';
import { Responsible } from '@prisma/client';
import { hash } from 'bcrypt';

type RegisterResponsibleServiceRequest = {
  name: string;
  email: string;
  password: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep?: string;
  picture?: string;
};

type RegisterResponsibleServiceResponse = {
  responsible: Responsible;
};

export class RegisterResponsibleService {
  constructor(
    @Inject('IResponsibleRepository')
    private readonly responsibleRepository: IResponsibleRepository,
  ) {}

  async exec({
    name,
    email,
    password,
    street,
    neighborhood,
    city,
    state,
    cep,
    picture,
  }: RegisterResponsibleServiceRequest): Promise<RegisterResponsibleServiceResponse> {
    const passwordHashed = await hash(password, 6);
    const responsible = await this.responsibleRepository.create({
      email,
      name,
      password: passwordHashed,
      cep,
      city,
      neighborhood,
      picture,
      state,
      street,
    });

    return { responsible };
  }
}
