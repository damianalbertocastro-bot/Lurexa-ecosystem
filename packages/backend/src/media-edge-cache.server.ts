/**
 * media-edge-cache.server.ts
 * Edge CDN Caching, Byte-Range Streaming, and Custom Domain Routing for Lurexa Media
 */

export interface MediaCacheHeaders {
  cacheControl: string;
  cdnCacheControl?: string;
  acceptRanges: string;
  contentDisposition: string;
}

export type MediaAssetKind = "curriculum_prompt" | "tts_synthesized" | "lesson_dialogue" | "learner_evidence";

export function getMediaCacheHeaders(kind: MediaAssetKind): MediaCacheHeaders {
  switch (kind) {
    case "curriculum_prompt":
    case "lesson_dialogue":
      return {
        cacheControl: "public, max-age=31536000, immutable",
        cdnCacheControl: "max-age=31536000",
        acceptRanges: "bytes",
        contentDisposition: "inline",
      };
    case "tts_synthesized":
      return {
        cacheControl: "public, max-age=604800, stale-while-revalidate=86400",
        cdnCacheControl: "max-age=604800",
        acceptRanges: "bytes",
        contentDisposition: "inline",
      };
    case "learner_evidence":
      return {
        cacheControl: "private, max-age=0, no-store",
        acceptRanges: "bytes",
        contentDisposition: "inline",
      };
  }
}

export function parseByteRange(
  rangeHeader: string | null | undefined,
  totalLength: number
): { start: number; end: number; contentLength: number } | null {
  if (!rangeHeader || !rangeHeader.startsWith("bytes=")) {
    return null;
  }

  const parts = rangeHeader.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : totalLength - 1;

  if (isNaN(start) || isNaN(end) || start > end || start >= totalLength) {
    return null;
  }

  const boundedEnd = Math.min(end, totalLength - 1);
  return {
    start,
    end: boundedEnd,
    contentLength: boundedEnd - start + 1,
  };
}

export function buildZeroEgressMediaUrl(
  storageKey: string,
  customDomain = process.env.R2_PUBLIC_DOMAIN || "https://media.lurexa.com"
): string {
  const cleanDomain = customDomain.replace(/\/+$/, "");
  const cleanKey = storageKey.replace(/^\/+/, "");
  return `${cleanDomain}/${cleanKey}`;
}
