import { getTeachEducatorGrowthPath } from "@lurexa/backend/teach-educator-growth.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    const path = await getTeachEducatorGrowthPath(request.headers.get("authorization"));
    return Response.json(path, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to build educator growth path.";
    return Response.json({ error: message }, {
      status: message === "Authentication is required." ? 401 : 400,
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  }
}
