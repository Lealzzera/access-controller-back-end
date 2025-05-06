import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import IKinshipRepository from '../repositories/interfaces/kinship-repository.interface';
import { Kinship } from '@prisma/client';

interface RegisterKinshipServiceRequest {
  name: string;
  value: number;
}

interface RegisterKinshipServiceResponse {
  kinship: Kinship;
}

@Injectable()
export default class RegisterKinshipService {
  constructor(
    @Inject('IKinshipRepository')
    private readonly kinshipRepository: IKinshipRepository,
  ) {}

  async exec({
    name,
    value,
  }: RegisterKinshipServiceRequest): Promise<RegisterKinshipServiceResponse> {
    const kinshipList = await this.kinshipRepository.fetchAllKinship();
    const doesKinshipExist = kinshipList.find((kinship) => {
      return kinship.value === value || kinship.name === name;
    });

    if (doesKinshipExist) {
      throw new BadRequestException(
        'Already exist a kinship with same name or value provided.',
      );
    }

    const kinship = await this.kinshipRepository.create({ name, value });

    return { kinship };
  }
}
