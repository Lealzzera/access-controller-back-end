import { Module } from '@nestjs/common';
import { RegisterService } from './use-cases/register.service';
import { ChildrenRepository } from './repositories/children.repository';
import { PrismaClient } from '@prisma/client';
import { ChildrenController } from './children.controller';
import { FetchChildrenByInstitutionIdService } from './use-cases/fetch-children-by-institution-id.service';
import { InstitutionsRepository } from '../institutions/repositories/institutions.repository';
import { ResponsibleOnChildrenRepository } from '../responsible-on-children/repositories/responsible-on-children.repository';
import { FetchChildrenByResponsibleIdService } from './use-cases/fetch-children-by-responsible-id.service';
import { PeriodRepository } from '../period/repositories/period-repository';
import { GradeRepository } from '../grade/repositories/grade-repository';
import { UpdateChildService } from './use-cases/update-child.service';

@Module({
  providers: [
    PrismaClient,
    RegisterService,
    FetchChildrenByInstitutionIdService,
    FetchChildrenByResponsibleIdService,
    UpdateChildService,
    { provide: 'IChildrenRepository', useClass: ChildrenRepository },
    { provide: 'IInstitutionsRepository', useClass: InstitutionsRepository },
    { provide: 'IPeriodRepository', useClass: PeriodRepository },
    { provide: 'IGradeRepository', useClass: GradeRepository },
    {
      provide: 'IResponsibleOnChildrenRepository',
      useClass: ResponsibleOnChildrenRepository,
    },
  ],
  controllers: [ChildrenController],
})
export class ChildrenModule {}
