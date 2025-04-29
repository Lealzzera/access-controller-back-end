import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { generateDownloadURL } from 'src/aws/generate-download-url';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('download')
@UseGuards(AuthGuard)
export class DownLoadController {
  @Post('generate-presigned-url')
  async getPresignedUrl(@Body() body: { files: string[] }) {
    try {
      const getPresignedUrlList = await Promise.all(
        body.files.map(async (fileName) => {
          const url = await generateDownloadURL(fileName);
          return { fileName, url };
        }),
      );

      return { urls: getPresignedUrlList };
    } catch (err) {
      return err.response;
    }
  }
}
