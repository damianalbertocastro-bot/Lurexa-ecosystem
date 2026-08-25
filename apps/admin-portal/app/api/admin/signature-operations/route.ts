import { getSignatureOperationalRollup } from "@lurexa/backend/signature-operations.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const privateNoStoreHeaders = { "Cache-Control": "private, no-store, max-age=0" };

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const requestedWindow = Number(url.searchParams.get("windowMinutes") ?? "60");
    const value = await getSignatureOperationalRollup({
      authorization: request.headers.get("authorization"),
      windowMinutes: requestedWindow,
    });
    return Response.json(value, { headers: privateNoStoreHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load Signature Operations.";
    const status = message === "Authentication is required."
      ? 401
      : message === "Superadmin access is required."
        ? 403
        : 400;
    return Response.json({ error: message }, { status, headers: privateNoStoreHeaders });
  }
}
