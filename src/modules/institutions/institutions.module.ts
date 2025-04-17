import { Module } from '@nestjs/common';
import { RegisterInstitutionService } from './use-cases/register.service';
import { InstitutionsRepository } from './repositories/institutions.repository';
import { InstitutionController } from './institutions.controller';
import { GetInstitutionByIdService } from './use-cases/get-institution-by-id.service';

@Module({
  providers: [
    RegisterInstitutionService,
    GetInstitutionByIdService,
    { provide: 'IInstitutionsRepository', useClass: InstitutionsRepository },
  ],
  controllers: [InstitutionController],
})
export class InstitutionsModule {}
