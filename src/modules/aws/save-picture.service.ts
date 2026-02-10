import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

type SavePictureServiceRequest = {
  picture: string;
  folderName: string;
};

@Injectable()
export class SavePictureService {
  constructor(@Inject('S3_CLIENT') private readonly s3Client: S3Client) {}

  async exec({
    picture,
    folderName,
  }: SavePictureServiceRequest): Promise<string> {
    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!bucketName) {
      throw new BadRequestException('AWS_BUCKET_NAME env is missing.');
    }

    const matches = picture.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      throw new BadRequestException('Invalid base64 image format.');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType.split('/')[1];
    const fileName = `${folderName}/${randomUUID()}.${extension}`;
    const fileBuffer = Buffer.from(base64Data, 'base64');

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (fileBuffer.length > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `Image size (${(fileBuffer.length / (1024 * 1024)).toFixed(1)}MB) exceeds the 5MB limit.`,
      );
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await this.s3Client.send(command);

    return `https://${bucketName}.s3.amazonaws.com/${fileName}`;
  }
}
