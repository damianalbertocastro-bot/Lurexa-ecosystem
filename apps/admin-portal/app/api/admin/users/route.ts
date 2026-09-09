import { NextRequest, NextResponse } from "next/server";
import { PlatformAdminService } from "@lurexa/backend/core/platform-admin.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const users = await PlatformAdminService.listAllEcosystemUsers(authHeader);
    return NextResponse.json({ users });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to list ecosystem users.";
    const status = message.includes("Authentication") ? 401 : message.includes("Superadmin") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const body = (await request.json()) as {
      type?: "user" | "progress" | "placement" | "evidence" | "course";
      id?: string;
    };

    if (!body.type || !body.id) {
      return NextResponse.json({ error: "type and id are required." }, { status: 400 });
    }

    const result = await PlatformAdminService.deleteEcosystemEntity(authHeader, {
      type: body.type,
      id: body.id,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete ecosystem entity.";
    const status = message.includes("Authentication") ? 401 : message.includes("Superadmin") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
