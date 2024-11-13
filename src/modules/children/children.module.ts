import { Module } from '@nestjs/common';
import { RegisterService } from './use-cases/register.service';
import { ChildrenRepository } from './repositories/children.repository';
import { ResponsibleModule } from '../responsible/responsible.module';
import { PrismaClient } from '@prisma/client';
import { ChildrenController } from './children.controller';

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
