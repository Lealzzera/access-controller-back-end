import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SavePictureService } from './save-picture.service';
import { GetPresignedUrlService } from './get-presigned-url.service';

@Controller({
  path: 's3',
  version: '1',
})
export class S3Controller {
  constructor(
    private readonly savePictureService: SavePictureService,
    private readonly getPresignedUrlService: GetPresignedUrlService,
  ) {}

  @Post('/upload')
  async upload(@Body() body: { picture: string; folderName: string }) {
    const url = await this.savePictureService.exec(body);
    return { url };
  }

  @Get('/presigned-url')
  async getPresignedUrl(@Query('url') url: string) {
    const presignedUrl = await this.getPresignedUrlService.exec(url);
    return { presignedUrl };
  }
}
