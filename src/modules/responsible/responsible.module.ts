import { Module } from '@nestjs/common';
import { RegisterResponsibleService } from './use-cases/register-responsible.service';
import { ResponsibleRepository } from './repositories/responsible.repository';
import { ResponsibleOnChildrenRepository } from '../responsible-on-children/repositories/responsible-on-children.repository';
import { ResponsibleOnInstitutionRepository } from '../responsible-on-institution/repositories/responsible-on-institution.repository';
import { ResponsibleController } from './responsible.controller';
import { ChildrenRepository } from '../children/repositories/children.repository';
import { GetResponsibleDataService } from './use-cases/get-responsible-data.service';
import { InstitutionsRepository } from '../institutions/repositories/institutions.repository';

@Module({
  providers: [
    RegisterResponsibleService,
    GetResponsibleDataService,
    { provide: 'IResponsibleRepository', useClass: ResponsibleRepository },
    {
      provide: 'IResponsibleOnChildrenRepository',
      useClass: ResponsibleOnChildrenRepository,
    },
    {
      provide: 'IResponsibleOnInstitutionRepository',
      useClass: ResponsibleOnInstitutionRepository,
    },
    { provide: 'IChildrenRepository', useClass: ChildrenRepository },
    { provide: 'IInstitutionsRepository', useClass: InstitutionsRepository },
  ],
  exports: [RegisterResponsibleService],
  controllers: [ResponsibleController],
})
export class ResponsibleModule {}
