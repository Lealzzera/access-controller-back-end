import { Module } from '@nestjs/common';
import { KinshipController } from './kinship.controller';
import KinshipRepository from './repositories/kinship.repository';
import FetchAllKinshipService from './use-cases/fetch-all-kinship.service';
import RegisterKinshipService from './use-cases/register-kinship.service';

@Module({
  controllers: [KinshipController],
  providers: [
    {
      provide: 'IKinshipRepository',
      useClass: KinshipRepository,
    },
    FetchAllKinshipService,
    RegisterKinshipService,
  ],
})
export class KinshipModule {}
