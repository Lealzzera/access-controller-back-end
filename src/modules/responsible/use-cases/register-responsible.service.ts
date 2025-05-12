import { BadRequestException, Inject } from '@nestjs/common';
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
    const doesTheEmailAlreadyExist =
      await this.institutionRepository.findInstitutionByEmail(email);

    if (doesTheEmailAlreadyExist) {
      throw new BadRequestException(
        'Email provided already exists as an institution',
      );
    }

    const doesTheCpfAlreadyExist =
      await this.responsibleRepository.findResponsibleByCpf(cpf);

    if (doesTheCpfAlreadyExist) {
      throw new BadRequestException('CPF provided already exists.');
    }

    const isThisCpfFromAChild =
      await this.childrenRepository.findChildByCpf(cpf);
    if (isThisCpfFromAChild) {
      throw new BadRequestException(
        'CPF from a child is not allowed to register',
      );
    }

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
          kinshipId,
        });

        return { responsible: doesResponsibleAlreadyExist };
      }

      await this.responsibleOnChildrenRepository.create({
        childId,
        responsibleId: doesResponsibleAlreadyExist.id,
        kinshipId,
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
