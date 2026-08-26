import { EducatorGovernanceService } from "@lurexa/backend/core/educator-governance.server";
import type { TeachingAuthorizationGrantInputV1, TeachingAuthorizationStatusUpdateV1 } from "@lurexa/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failure(error: unknown): Response {
  const message = error instanceof Error ? error.message : "Unable to complete educator governance request.";
  const status = message === "Authentication is required."
    ? 401
    : message === "Organization owner or admin access is required."
      ? 403
      : message === "Organization not found." || message === "Qualification not found." || message === "Course not found." || message === "Teaching authorization not found."
        ? 404
        : 400;
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store, max-age=0" } });
}

function stringField(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
}

function grantInput(value: unknown): TeachingAuthorizationGrantInputV1 {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("A valid teaching authorization grant is required.");
  const candidate = value as Record<string, unknown>;
  if (!Array.isArray(candidate.courseIds) || !candidate.courseIds.every((item) => typeof item === "string" && item.trim())) throw new Error("At least one valid course is required.");
  return {
    organizationId: stringField(candidate.organizationId, "Organization id"),
    userId: stringField(candidate.userId, "Educator id"),
    qualificationId: stringField(candidate.qualificationId, "Qualification id"),
    courseIds: candidate.courseIds.map((item) => String(item).trim()),
    validUntil: candidate.validUntil === null || candidate.validUntil === undefined || candidate.validUntil === "" ? null : stringField(candidate.validUntil, "Valid-until date"),
  };
}

function statusInput(value: unknown): TeachingAuthorizationStatusUpdateV1 {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("A valid authorization status update is required.");
  const candidate = value as Record<string, unknown>;
  if (candidate.status !== "active" && candidate.status !== "suspended") throw new Error("Authorization status must be active or suspended.");
  return {
    organizationId: stringField(candidate.organizationId, "Organization id"),
    userId: stringField(candidate.userId, "Educator id"),
    authorizationId: stringField(candidate.authorizationId, "Authorization id"),
    status: candidate.status,
  };
}

export async function GET(request: Request): Promise<Response> {
  try {
    const organizationId = new URL(request.url).searchParams.get("organizationId") ?? "";
    const result = await EducatorGovernanceService.getSnapshot(request.headers.get("authorization"), organizationId);
    return Response.json(result, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const result = await EducatorGovernanceService.grantTeachingAuthorization(request.headers.get("authorization"), grantInput(await request.json()));
    return Response.json(result, { status: 201, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(request: Request): Promise<Response> {
  try {
    const result = await EducatorGovernanceService.updateTeachingAuthorizationStatus(request.headers.get("authorization"), statusInput(await request.json()));
    return Response.json(result, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    return failure(error);
  }
}
