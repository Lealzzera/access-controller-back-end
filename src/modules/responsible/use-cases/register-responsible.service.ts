import { BadRequestException, Inject } from '@nestjs/common';
import { IResponsibleRepository } from '../repositories/interfaces/responsible-repository.interface';
import { Responsible } from '@prisma/client';
import { hash } from 'bcrypt';
import { IResponsibleOnChildrenRepository } from 'src/modules/responsible-on-children/repositories/interfaces/responsible-on-children-repository.interface';
import { IResponsibleOnInstitutionRepository } from 'src/modules/responsible-on-institution/repositories/interfaces/responsible-on-institution-repository.interface';

type RegisterResponsibleServiceRequest = {
  institutionId: string;
  childId: string;
  name: string;
  email: string;
  password: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep?: string;
  picture?: string;
  cpf?: string;
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
  ) {}

  async exec({
    institutionId,
    childId,
    name,
    email,
    password,
    street,
    neighborhood,
    city,
    state,
    cep,
    picture,
    cpf,
  }: RegisterResponsibleServiceRequest): Promise<RegisterResponsibleServiceResponse> {
    const doesResponsibleAlreadyExist =
      await this.responsibleRepository.findResponsibleByEmail(email);

    if (doesResponsibleAlreadyExist) {
      const isResponsibleLinkedToChild =
        await this.responsibleOnChildrenRepository.findResponsibleOnChildrenById(
          { childId, responsibleId: doesResponsibleAlreadyExist.id },
        );

      if (isResponsibleLinkedToChild) {
        throw new BadRequestException(
          'This responsible is already linked to this child',
        );
      }

      const isResponsibleLinkedToInstitution =
        await this.responsibleOnInstitutionRepository.findResponsibleOnInstitutionById(
          {
            institutionId,
            responsibleId: doesResponsibleAlreadyExist.id,
          },
        );

      if (isResponsibleLinkedToInstitution) {
        await this.responsibleOnChildrenRepository.create({
          childId,
          responsibleId: doesResponsibleAlreadyExist.id,
        });

        return { responsible: doesResponsibleAlreadyExist };
      }

      await this.responsibleOnChildrenRepository.create({
        childId,
        responsibleId: doesResponsibleAlreadyExist.id,
      });

      await this.responsibleOnInstitutionRepository.createResponsibleOnInstitution(
        { institutionId, responsibleId: doesResponsibleAlreadyExist.id },
      );

      return { responsible: doesResponsibleAlreadyExist };
    }

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
      cpf,
    });

    await Promise.all([
      this.responsibleOnChildrenRepository.create({
        childId,
        responsibleId: responsible.id,
      }),

      this.responsibleOnInstitutionRepository.createResponsibleOnInstitution({
        institutionId,
        responsibleId: responsible.id,
      }),
    ]);

    return { responsible };
  }
}
