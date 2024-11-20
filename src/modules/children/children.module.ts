import { Module } from '@nestjs/common';
import { RegisterService } from './use-cases/register.service';
import { ChildrenRepository } from './repositories/children.repository';
import { ResponsibleModule } from '../responsible/responsible.module';
import { PrismaClient } from '@prisma/client';
import { ChildrenController } from './children.controller';
import { FetchChildrenByInstitutionIdService } from './use-cases/fetch-children-by-institution-id.service';
import { InstitutionsRepository } from '../institutions/repositories/institutions.repository';

@Module({
  imports: [ResponsibleModule],
  providers: [
    PrismaClient,
    RegisterService,
    FetchChildrenByInstitutionIdService,
    { provide: 'IChildrenRepository', useClass: ChildrenRepository },
    { provide: 'IInstitutionsRepository', useClass: InstitutionsRepository },
  ],
  controllers: [ChildrenController],
})
export class ChildrenModule {}
