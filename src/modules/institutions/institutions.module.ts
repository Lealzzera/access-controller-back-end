import { Module } from '@nestjs/common';
import { RegisterInstitutionService } from './use-cases/register.service';
import { InstitutionsRepository } from './repositories/institutions.repository';
import { InstitutionController } from './institutions.controller';
import { GetInstitutionByIdService } from './use-cases/get-institution-by-id.service';
import { ConfigureInstitutionService } from './use-cases/configure-institution.service';
import { PeriodRepository } from '../period/repositories/period-repository';
import { GradeRepository } from '../grade/repositories/grade-repository';
import { DeletePeriodService } from './use-cases/delete-period.service';
import { DeleteGradeService } from './use-cases/delete-grade.service';
import { UpdatePeriodService } from './use-cases/update-period.service';
import { UpdateGradeService } from './use-cases/update-grade.service';

@Module({
  providers: [
    RegisterInstitutionService,
    GetInstitutionByIdService,
    ConfigureInstitutionService,
    DeletePeriodService,
    DeleteGradeService,
    UpdatePeriodService,
    UpdateGradeService,
    { provide: 'IInstitutionsRepository', useClass: InstitutionsRepository },
    { provide: 'IPeriodRepository', useClass: PeriodRepository },
    { provide: 'IGradeRepository', useClass: GradeRepository },
  ],
  controllers: [InstitutionController],
})
export class InstitutionsModule {}
