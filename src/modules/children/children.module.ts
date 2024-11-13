import { Module } from '@nestjs/common';
import { RegisterService } from './use-cases/register.service';
import { ChildrenRepository } from './repositories/children.repository';
import { ChildrenController } from './controllers/children.controller';
import { ResponsibleModule } from '../responsible/responsible.module';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [ResponsibleModule],
  providers: [
    PrismaClient,
    RegisterService,
    { provide: 'IChildrenRepository', useClass: ChildrenRepository },
  ],
  controllers: [ChildrenController],
})
export class ChildrenModule {}
