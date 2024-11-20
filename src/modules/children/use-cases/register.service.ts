import { BadRequestException, Inject } from '@nestjs/common';
import { Child, Kinship } from '@prisma/client';
import { RegisterResponsibleService } from 'src/modules/responsible/use-cases/register-responsible.service';
import { IChildrenRepository } from '../repositories/interfaces/children-repository.interface';

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
  grade?: string;
  teacher?: string;
  birthDate?: Date;
  picture?: string;
  period: 'MORNING' | 'AFTERNOON' | 'ALLDAY';
  institutionId: string;
  responsible: ResponsibleData[];
};

type RegisterChildServiceResponse = {
  child: Child;
};

export class RegisterService {
  constructor(
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
    @Inject(RegisterResponsibleService)
    private readonly registerResponsibleService: RegisterResponsibleService,
  ) {}

  async exec({
    name,
    cpf,
    grade,
    teacher,
    birthDate,
    picture,
    period,
    institutionId,
    responsible,
  }: RegisterChildServiceRequest): Promise<RegisterChildServiceResponse> {
    if (!institutionId.length) {
      throw new BadRequestException('An institutionId must be provided');
    }

    //TODO: IN THE FUTURE ADD PICTURE AS A MANDATORY DATA TO ADD.
    if (!name.length || !cpf.length || !period.length) {
      throw new BadRequestException(
        'Must to provide these following data, name, cpf and period',
      );
    }

    const doesChildExist = await this.childrenRepository.findChildByCpf(cpf);

    if (doesChildExist) {
      throw new BadRequestException('Child CPF provided already exists.');
    }

    if (!responsible.length) {
      throw new BadRequestException(
        'Its not allowed register a child without a responsible',
      );
    }

    const child = await this.childrenRepository.create({
      name,
      cpf,
      grade,
      teacher,
      birthDate,
      picture,
      period,
      institutionId,
    });

    const responsibleList = responsible.map(
      ({ kinship, name, email, password, cpf }) => {
        this.registerResponsibleService.exec({
          childId: child.id,
          email,
          institutionId,
          password,
          cpf,
          name,
          kinship,
        });
      },
    );

    await Promise.all(responsibleList);

    return { child };
  }
}
