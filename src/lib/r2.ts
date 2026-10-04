import "server-only";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = getRequiredEnv("R2_ENDPOINT");
const accessKeyId = getRequiredEnv("R2_ACCESS_KEY_ID");
const secretAccessKey = getRequiredEnv("R2_SECRET_ACCESS_KEY");
const bucketName = getRequiredEnv("R2_BUCKET_NAME");
const publicUrl = getRequiredEnv("R2_PUBLIC_URL");

const r2Client = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function createR2UploadUrl(key: string) {
  return getSignedUrl(
    r2Client,
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: "image/webp",
    }),
    {
      expiresIn: 300,
    },
  );
}

export function getR2PublicUrl(key: string) {
  return `${publicUrl.replace(/\/+$/, "")}/${key}`;
}

export async function deleteFromR2(key: string) {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  );
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}
