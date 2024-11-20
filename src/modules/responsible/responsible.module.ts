import { Module } from '@nestjs/common';
import { RegisterResponsibleService } from './use-cases/register-responsible.service';
import { ResponsibleRepository } from './repositories/responsible.repository';
import { ResponsibleOnChildrenRepository } from '../responsible-on-children/repositories/responsible-on-children.repository';
import { ResponsibleOnInstitutionRepository } from '../responsible-on-institution/repositories/responsible-on-institution.repository';
import { ResponsibleController } from './responsible.controller';
import { ChildrenRepository } from '../children/repositories/children.repository';

@Module({
  providers: [
    RegisterResponsibleService,
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
  ],
  exports: [RegisterResponsibleService],
  controllers: [ResponsibleController],
})
export class ResponsibleModule {}
