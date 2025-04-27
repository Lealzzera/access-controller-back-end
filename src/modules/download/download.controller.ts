import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { generateDownloadURL } from 'src/aws/generate-download-url';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('download')
@UseGuards(AuthGuard)
export class DownLoadController {
  @Get('generate-presigned-url')
  async getPresignedUrl(@Query('fileName') fileName: string) {
    try {
      const url = await generateDownloadURL(fileName);
      return { url };
    } catch (err) {
      return err.response;
    }
  }
}
