import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { generateUploadURL } from 'src/aws/generate-upload-url';
import { Role } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('uploads')
@UseGuards(AuthGuard)
@Role('INSTITUTION')
export class UploadController {
  @Get('generate-presigned-url')
  async getPresignedUrl(
    @Query('fileName') fileName: string,
    @Query('fileType') fileType: string,
  ) {
    try {
      const url = await generateUploadURL(fileName, fileType);
      return { url };
    } catch (err) {
      return err.response;
    }
  }
}
