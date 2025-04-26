import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { Child, Kinship } from '@prisma/client';
import { IChildrenRepository } from '../repositories/interfaces/children-repository.interface';
import { IInstitutionsRepository } from 'src/modules/institutions/repositories/interfaces/institutions-repository.interface';
import { IPeriodRepository } from 'src/modules/period/repositories/interfaces/period-repository.interface';
import { IGradeRepository } from 'src/modules/grade/repositories/interfaces/grade-repository.interface';

export type ResponsibleData = {
  kinship: Kinship;
  name: string;
  email: string;
  password: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  cpf: string;
  state?: string;
  cep?: string;
  picture?: string;
};

type RegisterChildServiceRequest = {
  name: string;
  cpf: string;
  gradeId: string;
  birthDate: Date;
  picture: string;
  periodId: string;
  institutionId: string;
};

type RegisterChildServiceResponse = {
  child: Child;
};

export class RegisterService {
  constructor(
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
    @Inject('IInstitutionsRepository')
    private readonly institutionsRepository: IInstitutionsRepository,
    @Inject('IPeriodRepository')
    private readonly periodRepository: IPeriodRepository,
    @Inject('IGradeRepository')
    private readonly gradeRepository: IGradeRepository,
  ) {}

  async exec({
    name,
    cpf,
    gradeId,
    periodId,
    birthDate,
    picture,
    institutionId,
  }: RegisterChildServiceRequest): Promise<RegisterChildServiceResponse> {
    if (!institutionId.length || !periodId.length || !gradeId.length) {
      throw new BadRequestException('An institutionId must be provided');
    }

    if (!name.length || !cpf.length || !birthDate || !picture.length) {
      throw new BadRequestException(
        'Must to provide these following data, (name, cpf, periodId, gradeId, birthDate, picture and institutionId)',
      );
    }

    const doesInstitutionIdExist =
      await this.institutionsRepository.findInstitutionById(institutionId);

    const doesPeriodExist =
      await this.periodRepository.findPeriodById(periodId);

    const doesGradeExist = await this.gradeRepository.findGradeById(gradeId);
    const doesChildExist = await this.childrenRepository.findChildByCpf(cpf);

    if (!doesInstitutionIdExist) {
      throw new NotFoundException('Institution Id provided does not exist');
    }

    if (!doesPeriodExist) {
      throw new NotFoundException('Period Id provided does not exist');
    }

    if (!doesGradeExist) {
      throw new NotFoundException('Grade Id provided does not exist');
    }

    if (doesChildExist) {
      throw new BadRequestException('Child CPF provided already exists.');
    }

    const child = await this.childrenRepository.create({
      name,
      cpf,
      gradeId,
      periodId,
      birthDate,
      picture,
      institutionId,
    });

    return { child };
  }
}
