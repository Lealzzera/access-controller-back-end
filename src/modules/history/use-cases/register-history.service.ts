import { Inject } from '@nestjs/common';
import { SolicitationType } from '@prisma/client';
import {
  IHistoryRepository,
  IHistoryWithDetails,
} from '../repositories/interfaces/history-repository.interface';

interface RegisterHistoryRequest {
  type: SolicitationType;
  childId: string;
  responsibleId: string;
  institutionId: string;
}

export class RegisterHistoryService {
  constructor(
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async exec(data: RegisterHistoryRequest): Promise<IHistoryWithDetails> {
    return this.historyRepository.create(data);
  }
}
