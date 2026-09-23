import { reconcileStripeBilling } from "@lurexa/backend/billing/reconciliation.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const authorization = request.headers.get("authorization");
  try {
    const body = (await request.json().catch(() => ({}))) as { customerId?: string; limit?: number };
    const result = await reconcileStripeBilling(authorization, body);
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Billing reconciliation failed.";
    const status = message.includes("Authentication") ? 401 : message.includes("Superadmin") ? 403 : 500;
    return Response.json({ error: status === 500 ? "Billing reconciliation failed." : message }, { status });
  }
}
