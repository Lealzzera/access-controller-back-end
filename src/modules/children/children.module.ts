import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
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
import { FetchChildrenByInstitutionIdCursorPaginatedService } from './use-cases/fetch-children-by-institution-id-cursor-paginated.service';
import { GetPresignedUrlService } from '../aws/get-presigned-url.service';
import { ResponsibleRepository } from '../responsible/repositories/responsible.repository';
import { SavePictureService } from '../aws/save-picture.service';
import { DeletePictureService } from '../aws/delete-picture.service';

@Module({
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: () => new S3Client({ region: process.env.AWS_REGION }),
    },
    PrismaClient,
    RegisterService,
    FetchChildrenByInstitutionIdService,
    FetchChildrenByInstitutionIdCursorPaginatedService,
    GetPresignedUrlService,
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
    { provide: 'IResponsibleRepository', useClass: ResponsibleRepository },
    { provide: 'SavePictureService', useClass: SavePictureService },
    { provide: 'DeletePictureService', useClass: DeletePictureService },
  ],
  controllers: [ChildrenController],
})
export class ChildrenModule {}
