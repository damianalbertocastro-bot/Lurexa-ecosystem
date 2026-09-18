import type {
  CefrLevel,
  CoachSession,
  CoachSessionStartResult,
  LinguisticEvidencePayload,
  PhonemeEvaluation,
  CascadedDialogueTurn,
  CoachStreamingTokenResponse,
  CoachSelectiveEvidenceSubmission,
  LearningEvidence,
} from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { getScopedLearnerContext } from "./learner-context.server";
import type { AuthenticatedActor } from "./course-platform.server";
import { CoachA1Service } from "./coach-a1.service";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";
import { LinguisticIntelligenceService } from "./linguistic-intelligence.service";
import { refreshLearnerIntelligence } from "./core/learner-intelligence.server";
import { CoachCascadedRuntimeService } from "./coach-cascaded-runtime.service";
import { QuotaEnforcementServerService } from "./core/quota-enforcement.server";
import { BusinessUsageService } from "./business-usage.server";

export interface CoachTurnResult {
  session: CoachSession;
  coachingCue?: string;
  intelligibilityScore?: number;
}

function buildOpeningMessage(result: CoachSessionStartResult["learnerContext"]): string {
  const parts = ["Welcome to Lurexa Coach! I'm here to practice spoken English with you."];
  if (result.proficiency?.cefr) parts.push(`I'll keep our speaking practice comfortable for CEFR ${result.proficiency.cefr}.`);
  if (result.curriculum?.lessonId) parts.push("We can connect our conversation to what you've recently practiced in Learn.");
  if (result.activeTargets?.pronunciation?.length) parts.push(`Pronunciation focus: ${result.activeTargets.pronunciation.slice(0, 2).join(", ")}.`);
  else if (result.activeTargets?.fluency?.length) parts.push(`Fluency focus: ${result.activeTargets.fluency.slice(0, 2).join(", ")}.`);
  else parts.push("We will focus on clear intelligibility, natural rhythm, and speaking confidence—not accent erasure.");
  parts.push("To start, what's your name, or what would you like to talk about today?");
  return parts.join(" ");
}

function detectLinguisticObservation(learnerText: string) {
  const normalized = learnerText.trim().toLowerCase();
  if (/\b(e|es)[-]?(student|special|speak|school|start|spanish|study)\b/i.test(normalized)) {
    return {
      patternId: "DO-ENG-PRO-002",
      domain: "E01" as const,
      learnerForm: normalized,
      intendedMeaning: "Word-initial /s/ + consonant cluster",
      communicativeImpact: "CI1" as const,
      recurrence: "R1_REPEATED_SAME_SESSION" as const,
      cue: "Tip: Start words like 'study' or 'speak' directly with a soft 's' sound without an 'e' in front: 's-tudent'.",
    };
  }
  if (/\b(yesterday|last (week|month|year))\b/i.test(normalized) && /\b(work|play|finish|start|watch)\b/i.test(normalized) && !/\b(worked|played|finished|started|watched)\b/i.test(normalized)) {
    return {
      patternId: "DO-ENG-PRO-006",
      domain: "E01" as const,
      learnerForm: normalized,
      intendedMeaning: "Regular past tense -ed closure",
      communicativeImpact: "CI2" as const,
      recurrence: "R1_REPEATED_SAME_SESSION" as const,
      cue: "Tip: When talking about the past, make sure the regular '-ed' ending is audible (e.g., 'worked', 'finished').",
    };
  }
  return null;
}

function generateCoachResponse(learnerText: string, cefr: string = "A1"): { reply: string; coachingCue?: string; intelligibilityScore: number; detectedPatternId?: string } {
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
  if (normalized.includes("hello") || normalized.includes("hi") || normalized.includes("my name is") || normalized.includes("i'm ") || normalized.includes("i am ")) reply = "Nice to meet you! It's great to connect. Where are you from, or where are you currently living?";
  else if (normalized.includes("dominican") || normalized.includes("santo domingo") || normalized.includes("santiago") || normalized.includes("from ")) reply = "Wonderful! That is a vibrant place. What do you do on a typical day—do you work, study, or both?";
  else if (normalized.includes("work") || normalized.includes("study") || normalized.includes("job") || normalized.includes("student") || normalized.includes("routine")) reply = "That sounds like a busy and productive routine. What do you like to do in your free time when you relax?";
  else if (normalized.includes("music") || normalized.includes("dance") || normalized.includes("bachata") || normalized.includes("sport") || normalized.includes("movie") || normalized.includes("food")) reply = "That is a great interest! Engaging with hobbies in English builds natural fluency. How often do you get to do that?";
  else if (normalized.includes("repeat") || normalized.includes("sorry") || normalized.includes("understand") || normalized.includes("help")) reply = "Of course! Take your time. We can practice short, natural sentences step by step. What would you like to say?";
  else reply = cefr === "A2" ? "Thank you for sharing! That makes complete sense. Could you tell me a little more about that, or ask me a question?" : "Great job expressing yourself clearly! Tell me one more detail about that.";
  return { reply, coachingCue: linguisticObs?.cue ?? calibration.coachingCue, intelligibilityScore: calibration.intelligibilityScore, detectedPatternId: linguisticObs?.patternId };
}

import { devCoachSessionStore } from "./coach-session-state.server";

export const CoachPlatformService = {
  async startSession(actor: AuthenticatedActor): Promise<CoachSessionStartResult> {
    let scopedContext: CoachSessionStartResult["learnerContext"] = {
      learnerId: actor.uid,
      generatedAt: new Date().toISOString(),
      proficiency: { cefr: "A1" },
    };
    try {
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
      scopedContext = scoped.context;
    } catch {
      // Graceful in dev
    }

    const now = new Date().toISOString();
    const sessionId = `coach_session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const session: CoachSession = {
      id: sessionId,
      learnerId: actor.uid,
      status: "active",
      focus: {
        ...(scopedContext.proficiency?.cefr ? { cefr: scopedContext.proficiency.cefr } : {}),
        ...(scopedContext.curriculum?.courseId ? { courseId: scopedContext.curriculum.courseId } : {}),
        ...(scopedContext.curriculum?.lessonId ? { lessonId: scopedContext.curriculum.lessonId } : {}),
        ...(scopedContext.goals?.length ? { goals: scopedContext.goals } : {}),
        ...(scopedContext.activeTargets?.pronunciation?.length ? { pronunciationTargets: scopedContext.activeTargets.pronunciation } : {}),
        ...(scopedContext.activeTargets?.fluency?.length ? { fluencyTargets: scopedContext.activeTargets.fluency } : {}),
        ...(scopedContext.recommendations?.length ? { recommendedActions: scopedContext.recommendations } : {}),
      },
      transcript: [{ sender: "coach", text: buildOpeningMessage(scopedContext), timestamp: now }],
      createdAt: now,
      updatedAt: now,
    };

    devCoachSessionStore.set(session.id, { ...session });

    try {
      const database = getServerFirestore();
      await database.collection("coach-sessions").doc(session.id).set(session);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("credentials") || msg.includes("default credentials")) {
        // Fallback handled
      } else {
        throw err;
      }
    }

    return { session, learnerContext: scopedContext };
  },

  async sendTurn(actor: AuthenticatedActor, input: { sessionId: string; message: string; audioDurationMs?: number }): Promise<CoachTurnResult> {
    const message = input.message.trim();
    if (!message) throw new Error("A message is required to continue the Coach conversation.");
    
    let session: CoachSession | null = devCoachSessionStore.get(input.sessionId) ?? null;
    try {
      const database = getServerFirestore();
      const sessionDoc = await database.collection("coach-sessions").doc(input.sessionId).get();
      if (sessionDoc.exists) {
        session = sessionDoc.data() as CoachSession;
      }
    } catch {
      // Dev fallback
    }

    if (!session) session = devCoachSessionStore.get(input.sessionId) ?? null;
    if (!session) throw new Error("Coach session not found.");
    if (session.learnerId !== actor.uid) throw new Error("You do not have access to this Coach session.");
    const now = new Date().toISOString();
    const { reply, coachingCue, intelligibilityScore, detectedPatternId } = generateCoachResponse(message, session.focus?.cefr ?? "A1");
    const updatedTranscript = [
      ...session.transcript,
      { sender: "learner" as const, text: message, timestamp: now },
      { sender: "coach" as const, text: reply, timestamp: new Date(Date.now() + 500).toISOString() },
    ];
    const updatedSession: CoachSession = { ...session, transcript: updatedTranscript, updatedAt: now };
    devCoachSessionStore.set(session.id, { ...updatedSession });

    try {
      const database = getServerFirestore();
      await database.collection("coach-sessions").doc(session.id).set(updatedSession, { merge: true });
    } catch {
      // Dev fallback
    }

    const businessUsageApplied = await BusinessUsageService.consumeIfBusiness({
      learnerId: actor.uid,
      aiTurns: 1,
      product: "COACH",
    });
    if (!businessUsageApplied) {
      const quotaCheck = await QuotaEnforcementServerService.assertAndConsumeQuota({
        actorId: actor.uid,
        usageType: "ai_turns",
        unitsToConsume: 1,
      });
      if (!quotaCheck.allowed) {
        throw new Error(quotaCheck.message || "Monthly AI conversation quota exceeded.");
      }
    }

    // Educator-professional Coach is intentionally excluded from the ordinary
    // learner evidence/intelligence pipeline. Live feedback still uses the
    // local linguistic decision above, but persistent evidence is minimized at
    // completion into the professional evidence namespace only.
    if (session.mode !== "educator_professional") {
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
          learnerForm: message,
          intendedMeaning: "Spoken communicative turn in Coach session",
          communicativeImpact: detectedPatternId ? "CI2" : "CI1",
          recurrence: "R1_REPEATED_SAME_SESSION",
          taskMode: "guided_conversation",
          intervention: decision.action,
          correctionTiming: decision.timing,
          selfCorrected: false,
          retrySuccessful: intelligibilityScore > 0.8,
        };
        await evidenceRepository.append({
          contractVersion: "1",
          id: `coach_turn_${actor.uid}_${Date.now()}`,
          learnerId: actor.uid,
          organizationId: "lurexa-self-paced",
          source: { product: "coach", activityId: session.id },
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
    }

    return { session: updatedSession, coachingCue, intelligibilityScore };
  },

  async sendCascadedTurn(
    actor: AuthenticatedActor,
    input: {
      sessionId: string;
      message: string;
      audioBase64?: string;
      audioDurationMs?: number;
    }
  ): Promise<{ session: CoachSession; cascadedTurn: CascadedDialogueTurn }> {
    const message = input.message.trim();
    if (!message) throw new Error("A message is required to continue the Coach conversation.");

    let session: CoachSession | null = devCoachSessionStore.get(input.sessionId) ?? null;
    try {
      const database = getServerFirestore();
      const sessionDoc = await database.collection("coach-sessions").doc(input.sessionId).get();
      if (sessionDoc.exists) {
        session = sessionDoc.data() as CoachSession;
      }
    } catch {
      // Dev fallback
    }

    if (!session) session = devCoachSessionStore.get(input.sessionId) ?? null;
    if (!session) throw new Error("Coach session not found.");
    if (session.learnerId !== actor.uid) throw new Error("You do not have access to this Coach session.");

    const voiceMinutes = input.audioDurationMs && input.audioDurationMs > 0
      ? Math.ceil(input.audioDurationMs / 60000)
      : 0;
    const businessUsageApplied = await BusinessUsageService.consumeIfBusiness({
      learnerId: actor.uid,
      aiTurns: 1,
      voiceMinutes,
      product: "COACH",
    });
    if (!businessUsageApplied) {
      const quotaCheck = await QuotaEnforcementServerService.assertAndConsumeQuota({
        actorId: actor.uid,
        usageType: "ai_turns",
        unitsToConsume: 1,
      });
      if (!quotaCheck.allowed) {
        throw new Error(quotaCheck.message || "Monthly AI conversation quota exceeded.");
      }
      if (voiceMinutes > 0) {
        const voiceCheck = await QuotaEnforcementServerService.assertAndConsumeQuota({
          actorId: actor.uid,
          usageType: "voice_minutes",
          unitsToConsume: voiceMinutes,
        });
        if (!voiceCheck.allowed) {
          throw new Error(voiceCheck.message || "Monthly voice quota exceeded.");
        }
      }
    }

    // 1. Stage 1: Fast Turn loop (<800ms)
    const fastTurn = await CoachCascadedRuntimeService.executeFastTurn({
      sessionId: session.id,
      learnerId: actor.uid,
      transcriptText: message,
      activeScenarioPrompt: "A1 speaking practice",
      turnIndex: session.transcript.length,
    });

    // 2. Stage 2: Deep Turn Acoustic & Phonemic Alignment
    const deepDiagnostic = CoachCascadedRuntimeService.analyzeDeepTurnDiagnostics(
      fastTurn.turnId,
      message
    );

    const now = new Date().toISOString();
    const cascadedTurn = CoachCascadedRuntimeService.createTurnRecord(
      fastTurn.turnId,
      session.id,
      message,
      fastTurn.replyText,
      fastTurn.latencyMs,
      "en-US-Neural2-F",
      deepDiagnostic,
      fastTurn.audioUrl
    );

    const updatedTranscript = [
      ...session.transcript,
      { sender: "learner" as const, text: message, timestamp: now },
      { sender: "coach" as const, text: fastTurn.replyText, timestamp: new Date(Date.now() + 200).toISOString() },
    ];
    const updatedSession: CoachSession = { ...session, transcript: updatedTranscript, updatedAt: now };
    devCoachSessionStore.set(session.id, { ...updatedSession });

    try {
      const database = getServerFirestore();
      await database.collection("coach-sessions").doc(session.id).set(updatedSession, { merge: true });
    } catch {
      // Dev fallback
    }

    return { session: updatedSession, cascadedTurn };
  },

  async createStreamingToken(
    actor: AuthenticatedActor,
    input: { sessionId: string; targetCefr?: CefrLevel }
  ): Promise<CoachStreamingTokenResponse> {
    let session: CoachSession | null = devCoachSessionStore.get(input.sessionId) ?? null;
    try {
      const database = getServerFirestore();
      const sessionDoc = await database.collection("coach-sessions").doc(input.sessionId).get();
      if (sessionDoc.exists) {
        session = sessionDoc.data() as CoachSession;
      }
    } catch {
      // Dev fallback
    }
    if (!session) session = devCoachSessionStore.get(input.sessionId) ?? null;
    if (!session) throw new Error("Coach session not found.");
    if (session.learnerId !== actor.uid) throw new Error("You do not have access to this Coach session.");

    const cefr = input.targetCefr || session.focus?.cefr || "A1";

    // Streaming is an entitlement boundary. Business contracts use the pooled
    // voice allowance; individual tiers use the existing streaming capability.
    const organizationId = await BusinessUsageService.getLearnerOrganizationId(actor.uid);
    const businessContract = organizationId ? await BusinessUsageService.getContract(organizationId) : null;
    if (businessContract) {
      const remaining = await BusinessUsageService.getRemainingAllowance(organizationId!);
      if (remaining.voiceMinutes <= 0) {
        throw new Error("Business monthly voice allowance exceeded.");
      }
    } else {
      const streamingCheck = await QuotaEnforcementServerService.assertAndConsumeQuota({
        actorId: actor.uid,
        usageType: "streaming_audio",
        unitsToConsume: 1,
      });
      if (!streamingCheck.allowed) {
        throw new Error(streamingCheck.message || "Streaming audio is not available.");
      }
    }
    const systemInstruction = `You are Lurexa Coach, an empathetic, encouraging spoken English coach specialized for Dominican and Caribbean Spanish speakers learning English. Your goal is natural communicative competence and intelligible pronunciation at CEFR ${cefr}. Never mock or seek accent erasure; focus on phonemic intelligibility (e.g. word-initial /s/ clusters like 'study' without epenthetic 'e', and clear coda consonants). Keep your turns short (1-2 sentences), conversational, and prompt the learner to speak.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
        const newSessionExpireTime = new Date(Date.now() + 2 * 60 * 1000).toISOString();

        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/auth_tokens", {
          method: "POST",
          headers: {
            "x-goog-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uses: 1,
            expireTime,
            newSessionExpireTime,
            liveConnectConstraints: {
              model: "models/gemini-3.1-flash-live-preview",
              config: {
                sessionResumption: {},
                responseModalities: ["AUDIO"],
                systemInstruction: {
                  parts: [{ text: systemInstruction }],
                },
              },
            },
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as { name?: string; token?: string };
          const token = data.name || data.token;
          if (token) {
            return {
              token,
              expiresAt: expireTime,
              wsUrl: `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?access_token=${token}`,
              model: "gemini-3.1-flash-live-preview",
              audioSampleRateHz: 16000,
              systemInstruction,
              fallbackAvailable: true,
            };
          }
        }
      } catch (tokenErr) {
        console.warn("Failed to provision live ephemeral token, providing fallback configuration:", tokenErr);
      }
    }

    const fallbackToken = `lx-live-sim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return {
      token: fallbackToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      wsUrl: "",
      model: "cascaded-fast-turn-v1",
      audioSampleRateHz: 16000,
      systemInstruction,
      fallbackAvailable: true,
    };
  },

  async recordSelectivePhonemeEvidence(
    actor: AuthenticatedActor,
    submission: CoachSelectiveEvidenceSubmission
  ): Promise<{ success: boolean; evidenceId: string }> {
    const evidenceId = `ev-coach-phoneme-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    const evidenceRecord: LearningEvidence = {
      id: evidenceId,
      contractVersion: "1",
      learnerId: actor.uid,
      type: "assessment_result",
      dataClassification: "standard",
      observedAt: now,
      source: {
        product: "coach" as const,
      },
      provenance: {
        actorId: actor.uid,
        method: "system_observed",
      },
      payload: {
        event: "coach_selective_phoneme_evidence",
        turnId: submission.turnId,
        intelligibilityScore: submission.intelligibilityScore,
        fluencyScore: submission.fluencyScore ?? 85,
        phonemeDeviations: submission.phonemeEvidences.map((p) => ({
          phoneme: p.phoneme,
          category: p.category,
          expectedIpa: p.expectedIpa,
          observedIpa: p.observedIpa,
          score: p.score,
          sampleWord: p.sampleWord,
          targetWord: p.targetWord,
        })),
        spokenText: submission.spokenText || undefined,
        backgroundNoiseDetected: submission.backgroundNoiseDetected ?? false,
      },
    };

    try {
      const repo = new FirestoreLearningEvidenceRepository();
      await repo.append(evidenceRecord);
    } catch (err) {
      console.warn("Evidence repository append fallback:", err);
    }

    try {
      await refreshLearnerIntelligence({
        learnerId: actor.uid,
      });
    } catch {
      // Non-blocking
    }

    return { success: true, evidenceId };
  },
};

