import { Module } from '@nestjs/common';
import { RegisterInstitutionService } from './use-cases/register.service';
import { InstitutionsRepository } from './repositories/institutions.repository';
import { InstitutionController } from './institutions.controller';

@Module({
  providers: [
    RegisterInstitutionService,
    { provide: 'IInstitutionsRepository', useClass: InstitutionsRepository },
  ],
  controllers: [InstitutionController],
})
export class InstitutionsModule {}
