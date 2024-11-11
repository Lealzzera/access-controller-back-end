import { Module } from '@nestjs/common';
import { RegisterService } from './use-cases/register.service';
import { ChildrenRepository } from './repositories/children.repository';
import { ChildrenController } from './controllers/children.controller';

@Module({
  providers: [
    RegisterService,
    { provide: 'IChildrenRepository', useClass: ChildrenRepository },
  ],
  controllers: [ChildrenController],
})
export class ChildrenModule {}
