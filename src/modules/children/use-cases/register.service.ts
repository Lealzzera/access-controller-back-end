import { BadRequestException, Inject } from '@nestjs/common';
import { Child } from '@prisma/client';
import { IChildrenRepository } from '../interfaces/children-repository.interface';

type RegisterChildServiceRequest = {
  name: string;
  cpf: string;
  grade?: string;
  teacher?: string;
  birthDate?: Date;
  picture?: string;
  period: 'MORNING' | 'AFTERNOON' | 'ALLDAY';
  institutionId: string;
};

type RegisterChildServiceResponse = {
  child: Child;
};

export class RegisterService {
  constructor(
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
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
  }: RegisterChildServiceRequest): Promise<RegisterChildServiceResponse> {
    if (!institutionId.length) {
      throw new BadRequestException('An institutionId must be provided');
    }
    if (!name.length || !cpf.length || !period.length) {
      throw new BadRequestException(
        'Must to provide these following data, name, cpf and period',
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
    });

    return { child };
  }
}
