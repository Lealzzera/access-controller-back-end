import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DeletePictureService {
  constructor(@Inject('S3_CLIENT') private readonly s3Client: S3Client) {}
  async exec(pictureUrl: string): Promise<void> {
    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!bucketName) {
      throw new BadRequestException('AWS_BUCKET_NAME env is missing.');
    }

    const key = pictureUrl.replace(
      `https://${bucketName}.s3.amazonaws.com/`,
      '',
    );

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }
}
