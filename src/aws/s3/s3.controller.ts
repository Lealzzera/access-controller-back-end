import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/decorators/role.decorator';
import { S3UploadService } from './s3-upload.service';

@UseGuards(AuthGuard)
@Role('INSTITUTION')
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3UploadService) {}

  @Post('upload/get-presigned-url')
  async getPresignedUrl(
    @Body() { fileName, fileType }: { fileName: string; fileType: string },
  ) {
    const url = await this.s3Service.generateUploadURL({ fileName, fileType });
    return { url };
  }
}
