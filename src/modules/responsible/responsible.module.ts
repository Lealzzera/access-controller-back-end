import { Module } from '@nestjs/common';
import { RegisterResponsibleService } from './use-cases/register-responsible.service';
import { ResponsibleRepository } from './repositories/responsible.repository';

@Module({
  providers: [
    RegisterResponsibleService,
    { provide: 'IResponsibleRepository', useClass: ResponsibleRepository },
  ],
})
export class ResponsibleModule {}
