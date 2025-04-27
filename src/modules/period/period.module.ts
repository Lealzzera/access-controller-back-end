import { Module } from '@nestjs/common';
import { FetchPeriodsByInstitutionIdService } from './use-cases/fetch-periods-by-institution-id.service';
import { PeriodController } from './period.controller';
import { InstitutionsRepository } from '../institutions/repositories/institutions.repository';
import { PeriodRepository } from './repositories/period-repository';

@Module({
  providers: [
    FetchPeriodsByInstitutionIdService,
    { provide: 'IInstitutionsRepository', useClass: InstitutionsRepository },
    { provide: 'IPeriodRepository', useClass: PeriodRepository },
  ],
  controllers: [PeriodController],
})
export class PeriodModule {}
