import { processStripeWebhook } from "@lurexa/backend/billing/stripe-webhook.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing Stripe signature." }, { status: 400 });

  try {
    const payload = await request.text();
    const result = await processStripeWebhook(payload, signature);
    return Response.json(result, { status: result.duplicate ? 200 : 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process billing event.";
    const status = message.includes("signature") || message.includes("timestamp") || message.includes("payload")
      ? 400
      : 500;
    return Response.json({ error: status === 400 ? "Invalid billing event." : "Billing event processing failed." }, { status });
  }
}
