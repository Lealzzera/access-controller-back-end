import { BadRequestException, Inject } from '@nestjs/common';
import { IInstitutionsRepository } from '../repositories/interfaces/institutions-repository.interface';

type RegisterInstitutionServiceRequest = {
  institutionId: string;
};

type RegisterInstitutionServiceResponse = {
  institution: {
    cnpj: string;
    name: string;
    street: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    cep: string | null;
    picture: string | null;
    email: string;
    responsible: string;
  };
};

export class GetInstitutionByIdService {
  constructor(
    @Inject('IInstitutionsRepository')
    private readonly institutionsRepository: IInstitutionsRepository,
  ) {}

  async exec({
    institutionId,
  }: RegisterInstitutionServiceRequest): Promise<RegisterInstitutionServiceResponse> {
    const institution =
      await this.institutionsRepository.findInstitutionById(institutionId);
    if (!institution) {
      throw new BadRequestException('Institution provided does not exist');
    }

    return {
      institution: {
        cnpj: institution.cnpj,
        name: institution.name,
        street: institution.street,
        neighborhood: institution.neighborhood,
        city: institution.city,
        state: institution.state,
        cep: institution.cep,
        picture: institution.picture,
        email: institution.email,
        responsible: institution.responsible,
      },
    };
  }
}
