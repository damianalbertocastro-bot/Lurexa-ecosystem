import { NextRequest, NextResponse } from "next/server";
import { TeachReviewServerService } from "@lurexa/backend/teach-review.server";
import type { TeachEvidenceReviewDecision } from "@lurexa/types";

export const runtime = "nodejs";

type ReviewPayload = {
  evidenceId?: unknown;
  decision?: unknown;
  reviewerNote?: unknown;
};

function errorStatus(error: unknown): number {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("Authentication is required")) return 401;
  if (message.includes("reviewer access") || message.includes("own professional evidence")) return 403;
  if (message.includes("not found")) return 404;
  if (message.includes("Only submitted evidence")) return 409;
  return 400;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "The review request could not be completed.";
}

export async function GET(request: NextRequest) {
  try {
    const actor = await TeachReviewServerService.authenticate(request.headers.get("authorization"));
    const evidence = await TeachReviewServerService.listSubmittedEvidence(actor);
    return NextResponse.json({ evidence });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: errorStatus(error) });
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await TeachReviewServerService.authenticate(request.headers.get("authorization"));
    const payload = await request.json() as ReviewPayload;
    const evidenceId = typeof payload.evidenceId === "string" ? payload.evidenceId.trim() : "";
    const decision = payload.decision as TeachEvidenceReviewDecision;
    const reviewerNote = typeof payload.reviewerNote === "string" ? payload.reviewerNote : "";

    if (!evidenceId) throw new Error("Evidence ID is required.");
    if (decision !== "verified" && decision !== "rejected") throw new Error("A valid review decision is required.");
    if (!reviewerNote.trim()) throw new Error("A reviewer note is required for auditability.");

    const result = await TeachReviewServerService.reviewEvidence(actor, evidenceId, decision, reviewerNote);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: errorStatus(error) });
  }
}
