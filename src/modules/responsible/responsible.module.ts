import { Module } from '@nestjs/common';
import { RegisterResponsibleService } from './use-cases/register-responsible.service';
import { ResponsibleRepository } from './repositories/responsible.repository';
import { ResponsibleOnChildrenRepository } from '../responsible-on-children/repositories/responsible-on-children.repository';
import { ResponsibleOnInstitutionRepository } from '../responsible-on-institution/repositories/responsible-on-institution.repository';
import { ResponsibleController } from './responsible.controller';
import { ChildrenRepository } from '../children/repositories/children.repository';
import { GetResponsibleDataService } from './use-cases/get-responsible-data.service';
import { InstitutionsRepository } from '../institutions/repositories/institutions.repository';
import { UpdateResponsibleService } from './use-cases/update-responsible.service';
import { GetResponsiblesService } from './use-cases/get-responsibles.service';
import KinshipRepository from '../kinship/repositories/kinship.repository';

@Module({
  providers: [
    GetResponsiblesService,
    UpdateResponsibleService,
    RegisterResponsibleService,
    GetResponsibleDataService,
    { provide: 'IKinshipRepository', useClass: KinshipRepository },
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
