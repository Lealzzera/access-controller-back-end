import {
  BadRequestException,
  Inject,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { IResponsibleRepository } from '../repositories/interfaces/responsible-repository.interface';
import { Responsible } from '@prisma/client';
import { hash } from 'bcrypt';
import { IResponsibleOnChildrenRepository } from 'src/modules/responsible-on-children/repositories/interfaces/responsible-on-children-repository.interface';
import { IResponsibleOnInstitutionRepository } from 'src/modules/responsible-on-institution/repositories/interfaces/responsible-on-institution-repository.interface';
import { IChildrenRepository } from 'src/modules/children/repositories/interfaces/children-repository.interface';
import { IInstitutionsRepository } from 'src/modules/institutions/repositories/interfaces/institutions-repository.interface';

type RegisterResponsibleServiceRequest = {
  institutionId: string;
  name: string;
  email: string;
  password: string;
  picture: string;
  cpf: string;
};

type RegisterResponsibleServiceResponse = {
  responsible: Responsible;
};

export class RegisterResponsibleService {
  constructor(
    @Inject('IResponsibleRepository')
    private readonly responsibleRepository: IResponsibleRepository,
    @Inject('IResponsibleOnChildrenRepository')
    private readonly responsibleOnChildrenRepository: IResponsibleOnChildrenRepository,
    @Inject('IResponsibleOnInstitutionRepository')
    private readonly responsibleOnInstitutionRepository: IResponsibleOnInstitutionRepository,
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
    @Inject('IInstitutionsRepository')
    private readonly institutionRepository: IInstitutionsRepository,
  ) {}

  async exec({
    institutionId,
    name,
    email,
    password,
    picture,
    cpf,
  }: RegisterResponsibleServiceRequest): Promise<RegisterResponsibleServiceResponse> {
    const doesTheInstitutionExist =
      await this.institutionRepository.findInstitutionById(institutionId);
    if (!doesTheInstitutionExist) {
      throw new NotFoundException('Institution provided not found.');
    }
    const emailExistAsAnInstitution =
      await this.institutionRepository.findInstitutionByEmail(email);
    if (emailExistAsAnInstitution) {
      throw new NotAcceptableException(
        'Email provided already exists as an institution.',
      );
    }

    if (picture.length === 0) {
      throw new NotAcceptableException('A picture must to be provided.');
    }

    if (cpf.length === 0) {
      throw new NotAcceptableException('The CPF must to be provided.');
    }

    const cpfExistAsChildCpf =
      await this.childrenRepository.findChildByCpf(cpf);
    if (cpfExistAsChildCpf) {
      throw new NotAcceptableException(
        'CPF from a child is not allowed to register as a responsible.',
      );
    }

    const emailAlreadyExist =
      await this.responsibleRepository.findResponsibleByEmail(email);
    const cpfAlreadyExist =
      await this.responsibleRepository.findResponsibleByCpf(cpf);

    if (!emailAlreadyExist && cpfAlreadyExist) {
      throw new BadRequestException(
        'CPF provided is already linked to other email address.',
      );
    }

    if (emailAlreadyExist && !cpfAlreadyExist) {
      throw new BadRequestException(
        'Email provided is already linked to other CPF.',
      );
    }

    if (emailAlreadyExist && cpfAlreadyExist) {
      if (emailAlreadyExist.id !== cpfAlreadyExist.id) {
        throw new BadRequestException(
          'Email and CPF provided belong to different accounts.',
        );
      }

      const isUserLinkedToThisInstitution =
        await this.responsibleOnInstitutionRepository.findResponsibleOnInstitutionById(
          { institutionId, responsibleId: cpfAlreadyExist.id },
        );

      if (isUserLinkedToThisInstitution) {
        throw new BadRequestException(
          'Responsible already registered in this institution.',
        );
      }

      await this.responsibleOnInstitutionRepository.createResponsibleOnInstitution(
        {
          responsibleId: cpfAlreadyExist.id,
          institutionId,
        },
      );

      return { responsible: cpfAlreadyExist };
    }

    const passwordHashed = await hash(password, 6);
    const responsible = await this.responsibleRepository.create({
      email,
      name,
      password: passwordHashed,
      picture,
      cpf,
      role: 'RESPONSIBLE',
    });

    await this.responsibleOnInstitutionRepository.createResponsibleOnInstitution(
      {
        institutionId,
        responsibleId: responsible.id,
      },
    );

    return { responsible };
  }
}
