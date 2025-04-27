import { Module } from '@nestjs/common';
import { DownLoadController } from './download.controller';

@Module({
  controllers: [DownLoadController],
})
export class DownLoadModule {}
