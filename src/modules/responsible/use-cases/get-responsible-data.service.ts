import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { IResponsibleRepository } from '../repositories/interfaces/responsible-repository.interface';
import { GetPresignedUrlService } from '../../aws/get-presigned-url.service';

type GetResponsibleDataServiceRequest = {
  responsibleId: string;
};

type GetResponsibleDataServiceResponse = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phoneNumber: string | null;
  picture: string | null;
};
export class GetResponsibleDataService {
  constructor(
    @Inject('IResponsibleRepository')
    private readonly responsibleRepository: IResponsibleRepository,
    private readonly getPresignedUrlService: GetPresignedUrlService,
  ) {}

  async exec({
    responsibleId,
  }: GetResponsibleDataServiceRequest): Promise<GetResponsibleDataServiceResponse | null> {
    if (!responsibleId.length) {
      throw new BadRequestException('Must to provide a responsibleId');
    }

    const responsible =
      await this.responsibleRepository.findResponsibleById(responsibleId);

    if (!responsible) {
      throw new NotFoundException('Responsible not found');
    }
    const picture = responsible.picture
      ? await this.getPresignedUrlService.exec(responsible.picture)
      : null;

    return {
      id: responsible.id,
      name: responsible.name,
      email: responsible.email,
      cpf: responsible.cpf,
      phoneNumber: responsible.phoneNumber,
      picture,
    };
  }
}
