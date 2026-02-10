import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { S3Controller } from './s3.controller';
import { SavePictureService } from './save-picture.service';
import { DeletePictureService } from './delete-picture.service';

@Module({
  controllers: [S3Controller],
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: () => new S3Client({ region: process.env.AWS_REGION }),
    },
    SavePictureService,
    DeletePictureService,
  ],
  exports: ['S3_CLIENT', SavePictureService, DeletePictureService],
})
export class AwsModule {}
