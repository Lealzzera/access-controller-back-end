import { BadRequestException, Inject } from '@nestjs/common';
import { Child, Kinship, PrismaClient } from '@prisma/client';
import { IChildrenRepository } from '../interfaces/children-repository.interface';
import { RegisterResponsibleService } from 'src/modules/responsible/use-cases/register-responsible.service';

export type ResponsibleData = {
  kinship: Kinship;
  responsibleName: string;
  email: string;
  password: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep?: string;
  responsiblePicture?: string;
  responsibleCpf: string;
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
    private readonly prismaClient: PrismaClient,
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

    if (!name.length || !cpf.length || !period.length) {
      throw new BadRequestException(
        'Must to provide these following data, name, cpf and period',
      );
    }

    if (!responsible.length) {
      throw new BadRequestException(
        'Its not allowed register a child without a responsible',
      );
    }

    //TODO: ADJUST METHOD IN CASE USER'S PASS A WRONG RESPONSIBLE INFORMATION
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
    const responsibleData = responsible.map(
      ({
        email,
        kinship,
        password,
        responsibleCpf,
        responsibleName,
        cep,
        city,
        neighborhood,
        responsiblePicture,
        state,
        street,
      }) => {
        this.registerResponsibleService.exec({
          childId: child.id,
          email: email,
          institutionId,
          kinship,
          password,
          cep,
          name: responsibleName,
          cpf: responsibleCpf,
          city,
          neighborhood,
          picture: responsiblePicture,
          state,
          street,
        });
      },
    );

    await Promise.all(responsibleData);

    return { child };
  }
}
