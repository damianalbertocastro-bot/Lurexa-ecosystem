import { NextRequest, NextResponse } from "next/server";
import { PlatformAdminService } from "@lurexa/backend/core/platform-admin.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const result = await PlatformAdminService.bootstrapSuperadmin(body.email, body.password);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to initialize superadmin.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
