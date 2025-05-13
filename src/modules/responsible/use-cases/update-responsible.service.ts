import { Inject, NotFoundException } from '@nestjs/common';
import { IResponsibleRepository } from '../repositories/interfaces/responsible-repository.interface';
import { Responsible } from '@prisma/client';
import { hash } from 'bcrypt';

type RegisterResponsibleServiceRequest = {
  id: string;
  picture: string;
  name: string;
  password: string;
};

type RegisterResponsibleServiceResponse = {
  responsible: Responsible;
};

export class UpdateResponsibleService {
  constructor(
    @Inject('IResponsibleRepository')
    private readonly responsibleRepository: IResponsibleRepository,
  ) {}

  async exec({
    id,
    name,
    password,
    picture,
  }: RegisterResponsibleServiceRequest): Promise<RegisterResponsibleServiceResponse> {
    const doesResponsibleExist =
      await this.responsibleRepository.findResponsibleById(id);

    if (!doesResponsibleExist) {
      throw new NotFoundException('Responsible id provided does not exist.');
    }

    let passwordHashed = undefined;

    if (password) {
      passwordHashed = await hash(password, 6);
    }

    const responsible = await this.responsibleRepository.update({
      id,
      name,
      password: passwordHashed,
      picture,
    });

    return { responsible };
  }
}
