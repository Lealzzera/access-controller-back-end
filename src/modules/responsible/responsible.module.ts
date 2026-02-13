import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
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
import { SavePictureService } from '../aws/save-picture.service';
import { DeletePictureService } from '../aws/delete-picture.service';
import { GetPresignedUrlService } from '../aws/get-presigned-url.service';
import { GetResponsiblesCursorPaginatedService } from './use-cases/get-responsibles-cursor-paginated.service';

@Module({
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: () => new S3Client({ region: process.env.AWS_REGION }),
    },
    GetResponsiblesService,
    UpdateResponsibleService,
    RegisterResponsibleService,
    GetResponsibleDataService,
    GetResponsiblesCursorPaginatedService,
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
    { provide: 'SavePictureService', useClass: SavePictureService },
    { provide: 'DeletePictureService', useClass: DeletePictureService },
    GetPresignedUrlService,
  ],
  exports: [RegisterResponsibleService],
  controllers: [ResponsibleController],
})
export class ResponsibleModule {}
