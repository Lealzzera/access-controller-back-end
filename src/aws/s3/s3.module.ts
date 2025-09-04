import { Module } from '@nestjs/common';
import { S3 } from './s3';
import { S3Controller } from './s3.controller';
import { S3UploadService } from './s3-upload.service';

@Module({
  providers: [
    {
      provide: 'S3',
      useValue: S3,
    },
    S3UploadService,
  ],
  controllers: [S3Controller],
})
export class S3Module {}
