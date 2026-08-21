import { NextRequest, NextResponse } from "next/server";
import { TeachAssessmentServerService } from "@lurexa/backend/teach-assessment.server";
import type { TeachCefrLevel } from "@lurexa/types";

export async function GET(request: NextRequest) {
  try {
    const actor = await TeachAssessmentServerService.authenticate(request.headers.get("authorization"));
    const assessments = await TeachAssessmentServerService.listPending(actor);
    return NextResponse.json({ assessments });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Assessment queue could not be loaded." }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await TeachAssessmentServerService.authenticate(request.headers.get("authorization"));
    const body = await request.json() as {
      assessmentId?: string;
      verifiedCefrLevel?: TeachCefrLevel;
      competencies?: Array<{ id: string; name: string; level: number }>;
      summary?: string;
      rubricVersion?: string;
    };
    if (!body.assessmentId) throw new Error("Assessment ID is required.");
    const result = await TeachAssessmentServerService.completeAssessment(actor, body.assessmentId, {
      ...(body.verifiedCefrLevel ? { verifiedCefrLevel: body.verifiedCefrLevel } : {}),
      competencies: body.competencies ?? [],
      summary: body.summary ?? "",
      ...(body.rubricVersion ? { rubricVersion: body.rubricVersion } : {}),
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Assessment could not be completed." }, { status: 400 });
  }
}
