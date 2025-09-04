import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Inject } from '@nestjs/common';

type GenerateUploadURLRequest = {
  fileName: string;
  fileType: string;
};

export class S3UploadService {
  constructor(
    @Inject('S3')
    private S3: S3Client,
  ) {}

  async generateUploadURL({ fileName, fileType }: GenerateUploadURLRequest) {
    if (!fileName) {
      throw new BadRequestException('Provide a fileName');
    }

    if (!fileType) {
      throw new BadRequestException('Provide a fileType');
    }

    if (!process.env.AWS_BUCKET_NAME) {
      throw new BadRequestException('AWS_BUCKET_NAME env is missing.');
    }

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
    });

    const url = await getSignedUrl(this.S3, command, { expiresIn: 300 });
    return url;
  }
}
