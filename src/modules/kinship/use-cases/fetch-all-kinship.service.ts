import { Inject, Injectable } from '@nestjs/common';
import IKinshipRepository from '../repositories/interfaces/kinship-repository.interface';
import { Kinship } from '@prisma/client';

export interface FetchAllKinshipServiceResponse {
  kinships: Kinship[];
}

@Injectable()
export default class FetchAllKinshipService {
  constructor(
    @Inject('IKinshipRepository')
    private readonly kinshipRepository: IKinshipRepository,
  ) {}

  async exec(): Promise<FetchAllKinshipServiceResponse> {
    const kinships = await this.kinshipRepository.fetchAllKinship();
    return { kinships };
  }
}
