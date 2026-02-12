import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetPresignedUrlService {
  constructor(@Inject('S3_CLIENT') private readonly s3Client: S3Client) {}

  async exec(pictureUrl: string): Promise<string> {
    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!bucketName) {
      throw new BadRequestException('AWS_BUCKET_NAME env is missing.');
    }

    const key = pictureUrl.replace(
      `https://${bucketName}.s3.amazonaws.com/`,
      '',
    );

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });

    return presignedUrl;
  }
}
