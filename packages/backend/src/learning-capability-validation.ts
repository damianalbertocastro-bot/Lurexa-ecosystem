import type {
  AIRoleplayCapability,
  LearningCapability,
  ModelListeningCapability,
  RecordedSpeakingCapability,
} from "@lurexa/types";

const supportedKinds: LearningCapability["kind"][] = [
  "model_listening",
  "recorded_speaking",
  "ai_roleplay",
];

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function validateBase(value: Record<string, unknown>): void {
  if (
    value.schemaVersion !== "1"
    || typeof value.id !== "string"
    || !value.id
    || !supportedKinds.includes(value.kind as LearningCapability["kind"])
    || typeof value.stage !== "string"
    || !["CONTEXTUAL_INPUT", "PHONETICS_FOCUS", "CONVERSATION", "CREATE_APPLY", "REVIEW"].includes(value.stage)
    || typeof value.title !== "string"
    || !value.title
    || typeof value.instructions !== "string"
    || !value.instructions
    || !isStringArray(value.competencyIds)
    || typeof value.estimatedMinutes !== "number"
    || value.estimatedMinutes <= 0
    || typeof value.required !== "boolean"
  ) {
    throw new Error("The lesson contains an invalid learning capability.");
  }
}

function parseModelListening(value: Record<string, unknown>): ModelListeningCapability {
  validateBase(value);
  if (
    value.kind !== "model_listening"
    || typeof value.modelText !== "string"
    || !value.modelText
    || typeof value.locale !== "string"
    || !value.locale
    || !["meaning", "noticing", "pronunciation_model"].includes(String(value.playbackGoal))
    || (value.audioUrl !== undefined && typeof value.audioUrl !== "string")
  ) throw new Error("The lesson contains an invalid model-listening capability.");
  return value as unknown as ModelListeningCapability;
}

function parseRecordedSpeaking(value: Record<string, unknown>): RecordedSpeakingCapability {
  validateBase(value);
  if (
    value.kind !== "recorded_speaking"
    || typeof value.prompt !== "string"
    || !value.prompt
    || typeof value.locale !== "string"
    || !value.locale
    || typeof value.minimumSeconds !== "number"
    || typeof value.maximumSeconds !== "number"
    || value.minimumSeconds < 0
    || value.maximumSeconds <= 0
    || value.maximumSeconds > 180
    || value.minimumSeconds > value.maximumSeconds
    || !["rehearsal", "performance"].includes(String(value.evidencePurpose))
    || (value.targetText !== undefined && typeof value.targetText !== "string")
  ) throw new Error("The lesson contains an invalid recorded-speaking capability.");
  return value as unknown as RecordedSpeakingCapability;
}

function parseRoleplay(value: Record<string, unknown>): AIRoleplayCapability {
  validateBase(value);
  const scenario = value.scenario;
  if (
    value.kind !== "ai_roleplay"
    || !["A1", "A2", "B1", "B2", "C1", "C2"].includes(String(value.cefr))
    || typeof value.language !== "string"
    || !value.language
    || !["post_turn_salient", "balanced", "direct_precision"].includes(String(value.correctionPolicy))
    || typeof scenario !== "object"
    || scenario === null
    || Array.isArray(scenario)
  ) throw new Error("The lesson contains an invalid AI-roleplay capability.");
  const candidate = scenario as Record<string, unknown>;
  if (
    typeof candidate.role !== "string"
    || !candidate.role
    || typeof candidate.situation !== "string"
    || !candidate.situation
    || typeof candidate.learnerGoal !== "string"
    || !candidate.learnerGoal
    || typeof candidate.openingLine !== "string"
    || !candidate.openingLine
    || typeof candidate.minimumTurns !== "number"
    || typeof candidate.maximumTurns !== "number"
    || candidate.minimumTurns < 1
    || candidate.maximumTurns > 12
    || candidate.minimumTurns > candidate.maximumTurns
  ) throw new Error("The lesson contains an invalid AI-roleplay scenario.");
  return value as unknown as AIRoleplayCapability;
}

export function parseLearningCapability(value: unknown): LearningCapability {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("The lesson capability is invalid.");
  }
  const candidate = value as Record<string, unknown>;
  if (candidate.kind === "model_listening") return parseModelListening(candidate);
  if (candidate.kind === "recorded_speaking") return parseRecordedSpeaking(candidate);
  if (candidate.kind === "ai_roleplay") return parseRoleplay(candidate);
  throw new Error("The lesson capability kind is not supported.");
}

export function hasValidLearningCapability(data: Record<string, unknown>): boolean {
  try {
    parseLearningCapability(data.capability);
    return true;
  } catch {
    return false;
  }
}
