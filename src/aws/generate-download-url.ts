import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from './s3-client';
import { ForbiddenException } from '@nestjs/common';

export async function generateDownloadURL(fileName: string) {
  if (!fileName.startsWith('child/')) {
    throw new ForbiddenException('Invalid file path');
  }
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
  return signedUrl;
}
