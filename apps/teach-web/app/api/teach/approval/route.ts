import { NextRequest, NextResponse } from "next/server";
import { CoursePlatformService } from "@lurexa/backend/course-platform.server";
import { TeachApprovalService } from "@lurexa/backend/teach-approval.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const isApprover = await TeachApprovalService.isAuthorizedApprover(actor);
    const { searchParams } = new URL(request.url);
    const listMode = searchParams.get("list") === "1" || searchParams.get("admin") === "1";

    if (listMode && isApprover) {
      const requests = await TeachApprovalService.listEducatorRequests(actor);
      return NextResponse.json({
        isApprover: true,
        ...requests,
      });
    }

    const profile = await TeachApprovalService.getOrRequestEducatorProfile(
      actor.uid,
      actor.email?.split("@")[0] || "Educator",
      actor.email
    );

    return NextResponse.json({
      profile,
      canAccessTeach: profile.status === "approved",
      isApprover,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify educator approval.";
    return NextResponse.json(
      { error: message },
      { status: message === "Authentication is required." ? 401 : 403 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await CoursePlatformService.authenticate(request.headers.get("authorization"));
    const body = (await request.json()) as {
      action?: "requestAccess" | "approve" | "reject";
      targetUserId?: string;
      reason?: string;
      displayName?: string;
    };

    if (body.action === "requestAccess") {
      const profile = await TeachApprovalService.getOrRequestEducatorProfile(
        actor.uid,
        body.displayName || actor.email?.split("@")[0] || "Educator",
        actor.email
      );
      return NextResponse.json({ profile, canAccessTeach: profile.status === "approved" });
    }

    if (body.action === "approve") {
      if (!body.targetUserId) {
        return NextResponse.json({ error: "targetUserId is required for approval." }, { status: 400 });
      }
      await TeachApprovalService.approveEducator(actor, body.targetUserId);
      return NextResponse.json({ success: true, targetUserId: body.targetUserId, status: "approved" });
    }

    if (body.action === "reject") {
      if (!body.targetUserId) {
        return NextResponse.json({ error: "targetUserId is required for rejection." }, { status: 400 });
      }
      await TeachApprovalService.rejectEducator(actor, body.targetUserId, body.reason);
      return NextResponse.json({ success: true, targetUserId: body.targetUserId, status: "rejected" });
    }

    return NextResponse.json({ error: "Invalid approval action." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process educator approval.";
    return NextResponse.json(
      { error: message },
      { status: message.includes("Only superusers") ? 403 : 400 }
    );
  }
}
