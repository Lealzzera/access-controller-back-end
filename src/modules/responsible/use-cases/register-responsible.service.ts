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
  childId: string;
  name: string;
  email: string;
  password: string;
  picture?: string;
  cpf?: string;
  kinshipId: string;
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
    childId,
    name,
    email,
    password,
    picture,
    kinshipId,
    cpf,
  }: RegisterResponsibleServiceRequest): Promise<RegisterResponsibleServiceResponse> {
    const emailExistAsAnInstitution =
      await this.institutionRepository.findInstitutionByEmail(email);
    if (emailExistAsAnInstitution) {
      throw new NotAcceptableException(
        'Email provided already exists as an institution.',
      );
    }

    const cpfExistAsChildCpf =
      await this.childrenRepository.findChildByCpf(cpf);
    if (cpfExistAsChildCpf) {
      throw new NotAcceptableException(
        'CPF from a child is not allowed to register as a responsible.',
      );
    }

    const childIdExists = this.childrenRepository.findChildById(childId);

    if (!childIdExists) {
      throw new NotFoundException('Child Id provided does not exist.');
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
      const isUserLinkedToThisChild =
        await this.responsibleOnChildrenRepository.findResponsibleOnChildrenById(
          { childId, responsibleId: cpfAlreadyExist.id },
        );

      if (isUserLinkedToThisChild) {
        throw new NotAcceptableException(
          'This responsible is already linked to this child.',
        );
      }

      const isUserLinkedToThisInstitution =
        await this.responsibleOnInstitutionRepository.findResponsibleOnInstitutionById(
          { institutionId, responsibleId: cpfAlreadyExist.id },
        );

      if (isUserLinkedToThisInstitution) {
        await this.responsibleOnChildrenRepository.create({
          childId,
          responsibleId: cpfAlreadyExist.id,
          kinshipId,
        });

        return { responsible: cpfAlreadyExist };
      }

      await Promise.all([
        this.responsibleOnInstitutionRepository.createResponsibleOnInstitution({
          responsibleId: cpfAlreadyExist.id,
          institutionId,
        }),
        this.responsibleOnChildrenRepository.create({
          childId,
          responsibleId: cpfAlreadyExist.id,
          kinshipId,
        }),
      ]);

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

    await Promise.all([
      this.responsibleOnChildrenRepository.create({
        childId,
        responsibleId: responsible.id,
        kinshipId,
      }),

      this.responsibleOnInstitutionRepository.createResponsibleOnInstitution({
        institutionId,
        responsibleId: responsible.id,
      }),
    ]);

    return { responsible };
  }
}
