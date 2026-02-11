import { Body, Controller, Post } from '@nestjs/common';
import { SavePictureService } from './save-picture.service';

@Controller({
  path: 's3',
  version: '1',
})
export class S3Controller {
  constructor(private readonly savePictureService: SavePictureService) {}

  @Post('/upload')
  async upload(@Body() body: { picture: string; folderName: string }) {
    const url = await this.savePictureService.exec(body);
    return { url };
  }
}
