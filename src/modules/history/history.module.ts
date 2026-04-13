import { Module } from '@nestjs/common';
import { HistoryRepository } from './repositories/history.repository';
import { RegisterHistoryService } from './use-cases/register-history.service';
import { FetchHistoryByInstitutionIdService } from './use-cases/fetch-history-by-institution-id.service';
import { HistoryController } from './history.controller';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [HistoryController],
  providers: [
    { provide: 'IHistoryRepository', useClass: HistoryRepository },
    RegisterHistoryService,
    FetchHistoryByInstitutionIdService,
  ],
  exports: [RegisterHistoryService],
})
export class HistoryModule {}
