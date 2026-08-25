import type {
  CefrLevel,
  CoachSession,
  CoachSessionEndResult,
  CoachSessionStartResult,
  LinguisticEvidencePayload,
  PhonemeEvaluation,
} from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { getScopedLearnerContext } from "./learner-context.server";
import type { AuthenticatedActor } from "./course-platform.server";
import { CoachA1Service } from "./coach-a1.service";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";
import { LinguisticIntelligenceService } from "./linguistic-intelligence.service";
import { refreshLearnerIntelligence } from "./core/learner-intelligence.server";
import { createProductBridge } from "./product-bridge.server";
import { getKnowledgeObjectIdsForLinguisticPattern } from "./knowledge-object-catalog.server";

export interface CoachTurnResult {
  session: CoachSession;
  coachingCue?: string;
  intelligibilityScore?: number;
}

function buildOpeningMessage(result: CoachSessionStartResult["learnerContext"]): string {
  const parts = ["Welcome to Lurexa Coach! I'm here to practice spoken English with you."];

  if (result.proficiency?.cefr) parts.push(`I'll keep our speaking practice comfortable for CEFR ${result.proficiency.cefr}.`);
  if (result.curriculum?.lessonId) parts.push("We can connect our conversation to what you've recently practiced in Learn.");
  if (result.activeTargets?.pronunciation?.length) {
    parts.push(`Pronunciation focus: ${result.activeTargets.pronunciation.slice(0, 2).join(", ")}.`);
  } else if (result.activeTargets?.fluency?.length) {
    parts.push(`Fluency focus: ${result.activeTargets.fluency.slice(0, 2).join(", ")}.`);
  } else {
    parts.push("We will focus on clear intelligibility, natural rhythm, and speaking confidence—not accent erasure.");
  }

  parts.push("To start, what's your name, or what would you like to talk about today?");
  return parts.join(" ");
}

function detectLinguisticObservation(learnerText: string) {
  const normalized = learnerText.trim().toLowerCase();

  if (/\b(e|es)(student|special|speak|school|start|spanish|study)\b/i.test(normalized)) {
    return {
      patternId: "DO-ENG-PRO-002",
      learnerForm: normalized,
      intendedMeaning: "Word-initial /s/ + consonant cluster",
      communicativeImpact: "CI1" as const,
      cue: "Tip: Start words like 'study' or 'speak' directly with a soft 's' sound without an 'e' in front: 's-tudent'.",
    };
  }

  if (/\b(yesterday|last (week|month|year))\b/i.test(normalized) && /\b(work|play|finish|start|watch)\b/i.test(normalized) && !/\b(worked|played|finished|started|watched)\b/i.test(normalized)) {
    return {
      patternId: "DO-ENG-PRO-006",
      learnerForm: normalized,
      intendedMeaning: "Regular past tense -ed closure",
      communicativeImpact: "CI2" as const,
      cue: "Tip: When talking about the past, make sure the regular '-ed' ending is audible (e.g., 'worked', 'finished').",
    };
  }

  return null;
}

function generateCoachResponse(
  learnerText: string,
  cefr: string = "A1"
): { reply: string; coachingCue?: string; intelligibilityScore: number; detectedPatternId?: string } {
  const normalized = learnerText.trim().toLowerCase();
  const linguisticObs = detectLinguisticObservation(learnerText);

  const phonemeEvals: PhonemeEvaluation[] = normalized.split(/\s+/).map((word) => {
    const hasFinalReductionTarget = ["went", "friend", "student", "fast", "first", "last"].some((w) => word.includes(w));
    const hasThTarget = ["think", "this", "that", "the", "with"].some((w) => word.includes(w));
    const hasSConsonant = ["student", "special", "speak", "school", "start"].some((w) => word.includes(w));
    const phonemeStr = hasFinalReductionTarget ? "t" : hasThTarget ? "θ" : hasSConsonant ? "st" : "ə";
    return { phoneme: phonemeStr, targetIpa: phonemeStr, isIntelligible: true, intelligibilityScore: 0.85, confidence: 0.9 };
  });

  const calibration = CoachA1Service.calibrateA1Utterance(phonemeEvals, learnerText, "guided_conversation");

  let reply = "";
  if (normalized.includes("hello") || normalized.includes("hi") || normalized.includes("my name is") || normalized.includes("i'm ") || normalized.includes("i am ")) {
    reply = "Nice to meet you! It's great to connect. Where are you from, or where are you currently living?";
  } else if (normalized.includes("dominican") || normalized.includes("santo domingo") || normalized.includes("santiago") || normalized.includes("from ")) {
    reply = "Wonderful! That is a vibrant place. What do you do on a typical day—do you work, study, or both?";
  } else if (normalized.includes("work") || normalized.includes("study") || normalized.includes("job") || normalized.includes("student") || normalized.includes("routine")) {
    reply = "That sounds like a busy and productive routine. What do you like to do in your free time when you relax?";
  } else if (normalized.includes("music") || normalized.includes("dance") || normalized.includes("bachata") || normalized.includes("sport") || normalized.includes("movie") || normalized.includes("food")) {
    reply = "That is a great interest! Engaging with hobbies in English builds natural fluency. How often do you get to do that?";
  } else if (normalized.includes("repeat") || normalized.includes("sorry") || normalized.includes("understand") || normalized.includes("help")) {
    reply = "Take your time. We can practice short, natural sentences step by step. What would you like to say?";
  } else {
    reply = cefr === "A2"
      ? "Thank you for sharing. Could you tell me a little more about that, or ask me a question?"
      : "Great job expressing yourself clearly! Tell me one more detail about that.";
  }

  return {
    reply,
    coachingCue: linguisticObs?.cue ?? calibration.coachingCue,
    intelligibilityScore: calibration.intelligibilityScore,
    detectedPatternId: linguisticObs?.patternId,
  };
}

async function loadOwnedSession(actor: AuthenticatedActor, sessionId: string): Promise<CoachSession> {
  const snapshot = await getServerFirestore().collection("coach-sessions").doc(sessionId).get();
  if (!snapshot.exists) throw new Error("Coach session not found.");
  const session = snapshot.data() as CoachSession;
  if (session.learnerId !== actor.uid) throw new Error("You do not have access to this Coach session.");
  return session;
}

export const CoachPlatformService = {
  async startSession(actor: AuthenticatedActor): Promise<CoachSessionStartResult> {
    const scoped = await getScopedLearnerContext({
      actorId: actor.uid,
      request: {
        contractVersion: "1",
        learnerId: actor.uid,
        requestingProduct: "coach",
        purpose: "coach_session_adaptation",
        domains: ["proficiency", "curriculum", "grammar", "vocabulary", "pronunciation", "fluency", "goal", "recommendation"],
      },
    });

    const database = getServerFirestore();
    const reference = database.collection("coach-sessions").doc();
    const now = new Date().toISOString();
    const session: CoachSession = {
      id: reference.id,
      learnerId: actor.uid,
      status: "active",
      focus: {
        ...(scoped.context.proficiency?.cefr ? { cefr: scoped.context.proficiency.cefr } : {}),
        ...(scoped.context.curriculum?.courseId ? { courseId: scoped.context.curriculum.courseId } : {}),
        ...(scoped.context.curriculum?.lessonId ? { lessonId: scoped.context.curriculum.lessonId } : {}),
        ...(scoped.context.goals?.length ? { goals: scoped.context.goals } : {}),
        ...(scoped.context.activeTargets?.pronunciation?.length ? { pronunciationTargets: scoped.context.activeTargets.pronunciation } : {}),
        ...(scoped.context.activeTargets?.fluency?.length ? { fluencyTargets: scoped.context.activeTargets.fluency } : {}),
        ...(scoped.context.recommendations?.length ? { recommendedActions: scoped.context.recommendations } : {}),
      },
      transcript: [{ sender: "coach", text: buildOpeningMessage(scoped.context), timestamp: now }],
      createdAt: now,
      updatedAt: now,
    };

    await reference.set(session);
    return { session, learnerContext: scoped.context };
  },

  async sendTurn(actor: AuthenticatedActor, input: { sessionId: string; message: string; audioDurationMs?: number }): Promise<CoachTurnResult> {
    const message = input.message.trim();
    if (!message) throw new Error("A message is required to continue the Coach conversation.");

    const database = getServerFirestore();
    const session = await loadOwnedSession(actor, input.sessionId);
    if (session.status !== "active") throw new Error("This Coach session has already been completed.");

    const now = new Date().toISOString();
    const { reply, coachingCue, intelligibilityScore, detectedPatternId } = generateCoachResponse(message, session.focus?.cefr ?? "A1");
    const updatedSession: CoachSession = {
      ...session,
      transcript: [
        ...session.transcript,
        { sender: "learner", text: message, timestamp: now },
        { sender: "coach", text: reply, timestamp: new Date(Date.now() + 500).toISOString() },
      ],
      updatedAt: now,
    };

    await database.collection("coach-sessions").doc(session.id).set(updatedSession, { merge: true });

    try {
      const evidenceRepository = new FirestoreLearningEvidenceRepository();
      const intelligenceService = new LinguisticIntelligenceService();
      const decision = intelligenceService.decideIntervention(
        {
          learnerId: actor.uid,
          taskMode: "guided_conversation",
          sessionGoal: "conversation",
          l1Profile: { language: "es", variety: "DO", useForTransferHypotheses: true },
          cefr: (session.focus?.cefr as CefrLevel | undefined) ?? "A1",
        },
        {
          domain: "pronunciation",
          patternId: detectedPatternId,
          learnerForm: message,
          communicativeImpact: detectedPatternId ? "CI2" : "CI1",
          communicationBreakdown: false,
          currentTarget: Boolean(detectedPatternId),
          acceptableVariation: false,
          learnerSelfCorrected: false,
        },
      );

      const payload: LinguisticEvidencePayload = {
        patternId: detectedPatternId ?? "DO-ENG-GEN-001",
        domain: "pronunciation",
        intendedMeaning: "Spoken communicative turn in Coach session",
        communicativeImpact: detectedPatternId ? "CI2" : "CI1",
        recurrence: "R1_REPEATED_SAME_SESSION",
        taskMode: "guided_conversation",
        intervention: decision.action,
        correctionTiming: decision.timing,
        selfCorrected: false,
        retrySuccessful: intelligibilityScore > 0.8,
      };
      const knowledgeObjectIds = getKnowledgeObjectIdsForLinguisticPattern(detectedPatternId);

      await evidenceRepository.append({
        contractVersion: "1",
        id: `coach_turn_${actor.uid}_${Date.now()}`,
        learnerId: actor.uid,
        organizationId: "lurexa-self-paced",
        source: {
          product: "coach",
          activityId: session.id,
          ...(knowledgeObjectIds.length ? { knowledgeObjectIds } : {}),
        },
        type: "pronunciation_observation",
        observedAt: now,
        dataClassification: "sensitive",
        payload,
        provenance: { method: "system_observed", actorId: actor.uid, confidence: 0.9 },
      });

      void refreshLearnerIntelligence({ learnerId: actor.uid, organizationId: "lurexa-self-paced" }).catch((refreshErr) => {
        console.warn("Learner intelligence refresh deferred:", refreshErr);
      });
    } catch (evidenceError) {
      console.error("Failed to append coach turn evidence:", evidenceError);
    }

    return { session: updatedSession, coachingCue, intelligibilityScore };
  },

  async endSession(actor: AuthenticatedActor, input: { sessionId: string }): Promise<CoachSessionEndResult> {
    const database = getServerFirestore();
    const session = await loadOwnedSession(actor, input.sessionId);
    if (session.status !== "active") throw new Error("This Coach session has already been completed.");

    const completedAt = new Date().toISOString();
    const completedSession: CoachSession = { ...session, status: "completed", completedAt, updatedAt: completedAt };
    await database.collection("coach-sessions").doc(session.id).set(completedSession, { merge: true });

    const evidenceRepository = new FirestoreLearningEvidenceRepository();
    await evidenceRepository.append({
      contractVersion: "1",
      id: `coach_session_completed_${actor.uid}_${Date.now()}`,
      learnerId: actor.uid,
      organizationId: "lurexa-self-paced",
      source: { product: "coach", activityId: session.id },
      type: "activity_result",
      observedAt: completedAt,
      dataClassification: "standard",
      payload: {
        event: "coach.session_completed",
        sessionId: session.id,
        learnerTurnCount: session.transcript.filter((message) => message.sender === "learner").length,
        courseId: session.focus.courseId ?? null,
        lessonId: session.focus.lessonId ?? null,
      },
      provenance: { method: "system_observed", actorId: actor.uid, confidence: 1 },
    });

    await refreshLearnerIntelligence({ learnerId: actor.uid, organizationId: "lurexa-self-paced" });

    const returnBridge = await createProductBridge({
      actorId: actor.uid,
      learnerId: actor.uid,
      organizationId: "lurexa-self-paced",
      source: "coach",
      destination: "learn",
      purpose: "return_to_learning",
      destinationRef: "/dashboard",
      contextRef: `coach-session:${session.id}`,
      singleUse: true,
    });

    return { session: completedSession, returnBridge };
  },
};
