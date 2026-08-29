import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicDomain?: string;
}

export function getR2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID || process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || process.env.CLOUDFLARE_R2_BUCKET_NAME || "lurexa-media";
  const publicDomain = process.env.R2_PUBLIC_DOMAIN || process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicDomain: publicDomain?.replace(/\/+$/, ""),
  };
}

export function isR2Configured(): boolean {
  return getR2Config() !== null;
}

let cachedS3Client: S3Client | null = null;
let cachedClientAccountId: string | null = null;

export function getR2Client(): S3Client {
  const config = getR2Config();
  if (!config) {
    throw new Error(
      "Cloudflare R2 is not configured. Required environment variables: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY."
    );
  }

  if (cachedS3Client && cachedClientAccountId === config.accountId) {
    return cachedS3Client;
  }

  const endpoint = `https://${config.accountId}.r2.cloudflarestorage.com`;
  cachedS3Client = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
  cachedClientAccountId = config.accountId;

  return cachedS3Client;
}

export interface PresignedUploadOptions {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
  metadata?: Record<string, string>;
}

export async function createR2PresignedUploadUrl(
  options: PresignedUploadOptions
): Promise<{ uploadUrl: string; key: string; expiresInSeconds: number; headers: Record<string, string> }> {
  const config = getR2Config();
  if (!config) {
    throw new Error("Cannot generate R2 presigned URL: R2 credentials missing.");
  }

  const client = getR2Client();
  const expiresInSeconds = options.expiresInSeconds || 900; // Default 15 mins

  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: options.key,
    ContentType: options.contentType,
    Metadata: options.metadata,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });

  return {
    uploadUrl,
    key: options.key,
    expiresInSeconds,
    headers: {
      "Content-Type": options.contentType,
    },
  };
}

export async function createR2PresignedDownloadUrl(
  key: string,
  expiresInSeconds = 3600
): Promise<string> {
  const config = getR2Config();
  if (!config) {
    throw new Error("Cannot generate R2 download URL: R2 credentials missing.");
  }

  // If a public domain or CDN URL is configured, return the zero-egress direct URL
  if (config.publicDomain) {
    return `${config.publicDomain}/${key}`;
  }

  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: config.bucketName,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

export async function verifyR2ObjectExists(key: string): Promise<boolean> {
  const config = getR2Config();
  if (!config) return false;

  try {
    const client = getR2Client();
    const command = new HeadObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    });
    await client.send(command);
    return true;
  } catch {
    return false;
  }
}

export async function uploadBufferToR2(
  key: string,
  bytes: Buffer,
  contentType: string,
  metadata?: Record<string, string>
): Promise<{ key: string; byteLength: number }> {
  const config = getR2Config();
  if (!config) {
    throw new Error("Cannot upload to R2: R2 credentials missing.");
  }

  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    Body: bytes,
    ContentType: contentType,
    Metadata: metadata,
  });

  await client.send(command);
  return { key, byteLength: bytes.length };
}
