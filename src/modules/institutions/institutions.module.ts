import { Module } from '@nestjs/common';
import { RegisterInstitutionService } from './use-cases/register.service';
import { InstitutionsRepository } from './repositories/institutions.repository';
import { InstitutionController } from './institutions.controller';
import { GetInstitutionByIdService } from './use-cases/get-institution-by-id.service';
import { ConfigureInstitutionService } from './use-cases/configure-institution.service';
import { PeriodRepository } from '../period/repositories/period-repository';
import { GradeRepository } from '../grade/repositories/grade-repository';

@Module({
  providers: [
    RegisterInstitutionService,
    GetInstitutionByIdService,
    ConfigureInstitutionService,
    { provide: 'IInstitutionsRepository', useClass: InstitutionsRepository },
    { provide: 'IPeriodRepository', useClass: PeriodRepository },
    { provide: 'IGradeRepository', useClass: GradeRepository },
  ],
  controllers: [InstitutionController],
})
export class InstitutionsModule {}
