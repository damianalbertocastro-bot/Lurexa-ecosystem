import { PlatformAdminService } from "@lurexa/backend/platform-admin.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failure(error: unknown): Response {
  const message = error instanceof Error ? error.message : "Platform operation failed.";
  const status = message === "Authentication is required."
    ? 401
    : message === "Superadmin access is required."
      ? 403
      : message.includes("not found")
        ? 404
        : 400;
  return Response.json({ error: message }, { status });
}

export async function GET(request: Request): Promise<Response> {
  try {
    await PlatformAdminService.authenticate(request.headers.get("authorization"));
    return Response.json(await PlatformAdminService.getDashboard(), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(request: Request): Promise<Response> {
  try {
    const actor = await PlatformAdminService.authenticate(request.headers.get("authorization"));
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new Error("Invalid request body.");
    }
    const payload = body as { orgId?: unknown; status?: unknown };
    if (typeof payload.orgId !== "string" || !["active", "suspended"].includes(payload.status as string)) {
      throw new Error("orgId and a valid status are required.");
    }
    await PlatformAdminService.updateOrganizationStatus(
      actor,
      payload.orgId,
      payload.status as "active" | "suspended",
    );
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
