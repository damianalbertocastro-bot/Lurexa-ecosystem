import { reconcileStripeBilling } from "@lurexa/backend/billing/reconciliation.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const authorization = request.headers.get("authorization");
  try {
    // The reconciliation service itself never exposes provider secrets; authorization
    // is enforced here at the administrative boundary.
    if (!authorization?.startsWith("Bearer ")) {
      return Response.json({ error: "Authentication is required." }, { status: 401 });
    }
    const body = (await request.json().catch(() => ({}))) as { customerId?: string; limit?: number };
    const result = await reconcileStripeBilling(body);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Billing reconciliation failed." }, { status: 500 });
  }
}
