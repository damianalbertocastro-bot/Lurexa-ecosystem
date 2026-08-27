import { PlatformAdminService } from "@lurexa/backend/core/platform-admin.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failure(error: unknown): Response {
  const message = error instanceof Error ? error.message : "Unable to process institutional billing request.";
  const status =
    message === "Authentication is required."
      ? 401
      : message === "Superadmin access is required."
      ? 403
      : message === "Organization not found."
      ? 404
      : 400;
  return Response.json({ error: message }, { status });
}

export async function GET(request: Request): Promise<Response> {
  try {
    const authHeader = request.headers.get("authorization");
    const accounts = await PlatformAdminService.getInstitutionalBillingAccounts(authHeader);
    return Response.json({ accounts });
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(request: Request): Promise<Response> {
  try {
    const authHeader = request.headers.get("authorization");
    const body = (await request.json()) as {
      organizationId?: string;
      allocatedSeats?: number;
      planTier?: import("@lurexa/types").InstitutionalPlanTier;
    };

    if (!body.organizationId || typeof body.allocatedSeats !== "number" || !body.planTier) {
      throw new Error("organizationId, allocatedSeats, and planTier are required.");
    }

    const updated = await PlatformAdminService.updateInstitutionalBillingSeats(authHeader, {
      organizationId: body.organizationId,
      allocatedSeats: body.allocatedSeats,
      planTier: body.planTier,
    });

    return Response.json({ account: updated });
  } catch (error) {
    return failure(error);
  }
}
