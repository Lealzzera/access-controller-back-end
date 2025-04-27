import { Module } from '@nestjs/common';
import { GradeController } from './grade.controller';
import { GradeRepository } from './repositories/grade-repository';
import { FetchGradesByInstitutionIdService } from './use-cases/fetch-grades-by-institution-id.service';
import { InstitutionsRepository } from '../institutions/repositories/institutions.repository';

@Module({
  providers: [
    FetchGradesByInstitutionIdService,
    { provide: 'IGradeRepository', useClass: GradeRepository },
    { provide: 'IInstitutionRepository', useClass: InstitutionsRepository },
  ],
  controllers: [GradeController],
})
export class GradeModule {}
