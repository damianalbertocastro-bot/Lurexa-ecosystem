import { PlatformAdminService } from "@lurexa/backend/core/platform-admin.server";
import type { PlatformOrganizationStatusUpdate } from "@lurexa/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failure(error: unknown): Response {
  const message = error instanceof Error ? error.message : "Unable to complete the platform administration request.";
  const status = message === "Authentication is required."
    ? 401
    : message === "Superadmin access is required."
      ? 403
      : message === "Organization not found."
        ? 404
        : 400;
  return Response.json({ error: message }, { status });
}

function readStatusUpdate(value: unknown): PlatformOrganizationStatusUpdate {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("A valid organization status update is required.");
  }
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.organizationId !== "string") {
    throw new Error("Organization id is required.");
  }
  if (candidate.status !== "active" && candidate.status !== "suspended") {
    throw new Error("Organization status is invalid.");
  }
  return {
    organizationId: candidate.organizationId,
    status: candidate.status,
  };
}

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await PlatformAdminService.authenticate(request.headers.get("authorization"));
    return Response.json(await PlatformAdminService.getSnapshot(actor));
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(request: Request): Promise<Response> {
  try {
    const actor = await PlatformAdminService.authenticate(request.headers.get("authorization"));
    const input = readStatusUpdate(await request.json());
    return Response.json(await PlatformAdminService.updateOrganizationStatus(actor, input));
  } catch (error) {
    return failure(error);
  }
}
