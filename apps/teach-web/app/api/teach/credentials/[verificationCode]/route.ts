import { NextRequest, NextResponse } from "next/server";
import { TeachReviewServerService } from "@lurexa/backend/teach-review.server";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ verificationCode: string }> },
) {
  const { verificationCode } = await context.params;
  const credential = await TeachReviewServerService.getPublicCredential(verificationCode);
  if (!credential) return NextResponse.json({ error: "Credential not found." }, { status: 404 });
  return NextResponse.json({ credential });
}
