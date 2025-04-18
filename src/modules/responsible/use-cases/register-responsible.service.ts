import { BadRequestException, Inject } from '@nestjs/common';
import { IResponsibleRepository } from '../repositories/interfaces/responsible-repository.interface';
import { Kinship, Responsible } from '@prisma/client';
import { hash } from 'bcrypt';
import { IResponsibleOnChildrenRepository } from 'src/modules/responsible-on-children/repositories/interfaces/responsible-on-children-repository.interface';
import { IResponsibleOnInstitutionRepository } from 'src/modules/responsible-on-institution/repositories/interfaces/responsible-on-institution-repository.interface';
import { IChildrenRepository } from 'src/modules/children/repositories/interfaces/children-repository.interface';

type RegisterResponsibleServiceRequest = {
  institutionId: string;
  childId: string;
  kinship: Kinship;
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
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
  ) {}

  async exec({
    institutionId,
    childId,
    kinship,
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

    const doesChildExist = await this.childrenRepository.findChildById(childId);

    if (!doesChildExist) {
      throw new BadRequestException('Child Id provided does not exist.');
    }

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
          kinship,
        });

        return { responsible: doesResponsibleAlreadyExist };
      }

      await this.responsibleOnChildrenRepository.create({
        childId,
        responsibleId: doesResponsibleAlreadyExist.id,
        kinship,
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
      role: 'RESPONSIBLE',
    });

    await Promise.all([
      this.responsibleOnChildrenRepository.create({
        childId,
        responsibleId: responsible.id,
        kinship,
      }),

      this.responsibleOnInstitutionRepository.createResponsibleOnInstitution({
        institutionId,
        responsibleId: responsible.id,
      }),
    ]);

    return { responsible };
  }
}
