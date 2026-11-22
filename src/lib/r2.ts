import "server-only";
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

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

export async function getR2StorageUsage() {
  let usedBytes = 0;
  let objectCount = 0;
  let continuationToken: string | undefined;

  do {
    const result = await r2Client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        ContinuationToken: continuationToken,
      }),
    );

    for (const object of result.Contents ?? []) {
      usedBytes += object.Size ?? 0;
      objectCount++;
    }

    if (result.IsTruncated && !result.NextContinuationToken) {
      throw new Error("No se pudo obtener todo el almacenamiento de R2.");
    }

    continuationToken = result.IsTruncated
      ? result.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return { usedBytes, objectCount };
}

export async function uploadToR2(key: string, data: Uint8Array) {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: data,
      ContentType: "image/webp",
    }),
  );
}
