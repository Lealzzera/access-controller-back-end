import { Module } from '@nestjs/common';
import { UserInfoController } from './userInfo.controller';

@Module({
  controllers: [UserInfoController],
})
export class UserInfoModule {}
