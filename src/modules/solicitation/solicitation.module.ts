import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SolicitationController } from './solicitation.controller';
import { SolicitationGateway } from './solicitation.gateway';
import { SolicitationRepository } from './repositories/solicitation.repository';
import { ChildrenRepository } from '../children/repositories/children.repository';
import { ResponsibleOnChildrenRepository } from '../responsible-on-children/repositories/responsible-on-children.repository';
import { S3Client } from '@aws-sdk/client-s3';
import { GetPresignedUrlService } from '../aws/get-presigned-url.service';
import { CreateSolicitationService } from './use-cases/create-solicitation.service';
import { AcceptSolicitationService } from './use-cases/accept-solicitation.service';
import { RejectSolicitationService } from './use-cases/reject-solicitation.service';
import { FetchPendingSolicitationsService } from './use-cases/fetch-pending-solicitations.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: () => new S3Client({ region: process.env.AWS_REGION }),
    },
    GetPresignedUrlService,
    SolicitationGateway,
    CreateSolicitationService,
    AcceptSolicitationService,
    RejectSolicitationService,
    FetchPendingSolicitationsService,
    { provide: 'ISolicitationRepository', useClass: SolicitationRepository },
    { provide: 'IChildrenRepository', useClass: ChildrenRepository },
    {
      provide: 'IResponsibleOnChildrenRepository',
      useClass: ResponsibleOnChildrenRepository,
    },
  ],
  controllers: [SolicitationController],
})
export class SolicitationModule {}
