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
const supportedStages: LearningCapability["stage"][] = [
  "CONTEXTUAL_INPUT",
  "PHONETICS_FOCUS",
  "CONVERSATION",
  "CREATE_APPLY",
  "REVIEW",
];
const cefrLevels: AIRoleplayCapability["cefr"][] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const correctionPolicies: AIRoleplayCapability["correctionPolicy"][] = [
  "post_turn_salient",
  "balanced",
  "direct_precision",
];
const playbackGoals: ModelListeningCapability["playbackGoal"][] = [
  "meaning",
  "noticing",
  "pronunciation_model",
];
const transcriptVisibilities: NonNullable<ModelListeningCapability["transcriptVisibility"]>[] = ["visible", "hidden"];
const evidencePurposes: RecordedSpeakingCapability["evidencePurpose"][] = ["rehearsal", "performance"];

function cleanText(value: unknown, field: string, maxLength = 2_000): string {
  if (typeof value !== "string") throw new Error(`Learning capability ${field} must be text.`);
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > maxLength) {
    throw new Error(`Learning capability ${field} is outside the supported length.`);
  }
  return cleaned;
}

function cleanStringArray(value: unknown, field: string, maxItems = 24): string[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > maxItems) {
    throw new Error(`Learning capability ${field} must contain supported values.`);
  }
  const cleaned = value.map((item) => cleanText(item, field, 160));
  if (new Set(cleaned).size !== cleaned.length) {
    throw new Error(`Learning capability ${field} cannot contain duplicates.`);
  }
  return cleaned;
}

function cleanInteger(value: unknown, field: string, minimum: number, maximum: number): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(`Learning capability ${field} is outside the supported range.`);
  }
  return value;
}

function cleanOptionalAudioUrl(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  const url = cleanText(value, "audioUrl", 2_048);
  if (url.startsWith("/")) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") throw new Error("unsupported protocol");
    return parsed.toString();
  } catch {
    throw new Error("Learning capability audioUrl must be an HTTPS URL or an application-relative path.");
  }
}

function parseBase(value: Record<string, unknown>): Omit<LearningCapability, "kind"> & { kind: LearningCapability["kind"] } {
  if (value.schemaVersion !== "1" || !supportedKinds.includes(value.kind as LearningCapability["kind"])) {
    throw new Error("The lesson contains an unsupported learning capability version or kind.");
  }
  if (!supportedStages.includes(value.stage as LearningCapability["stage"])) {
    throw new Error("The lesson contains an unsupported learning capability stage.");
  }
  if (typeof value.required !== "boolean") {
    throw new Error("Learning capability required must be a boolean.");
  }
  if (typeof value.estimatedMinutes !== "number" || !Number.isFinite(value.estimatedMinutes) || value.estimatedMinutes <= 0 || value.estimatedMinutes > 120) {
    throw new Error("Learning capability estimatedMinutes is outside the supported range.");
  }
  return {
    schemaVersion: "1",
    id: cleanText(value.id, "id", 160),
    kind: value.kind as LearningCapability["kind"],
    stage: value.stage as LearningCapability["stage"],
    title: cleanText(value.title, "title", 240),
    instructions: cleanText(value.instructions, "instructions", 2_000),
    competencyIds: cleanStringArray(value.competencyIds, "competencyIds"),
    estimatedMinutes: Math.round(value.estimatedMinutes * 10) / 10,
    required: value.required,
  } as Omit<LearningCapability, "kind"> & { kind: LearningCapability["kind"] };
}

function parseModelListening(value: Record<string, unknown>): ModelListeningCapability {
  const base = parseBase(value);
  if (base.kind !== "model_listening" || !playbackGoals.includes(value.playbackGoal as ModelListeningCapability["playbackGoal"])) {
    throw new Error("The lesson contains an invalid model-listening capability.");
  }
  if (value.transcriptVisibility !== undefined && !transcriptVisibilities.includes(value.transcriptVisibility as NonNullable<ModelListeningCapability["transcriptVisibility"]>)) {
    throw new Error("Model-listening transcriptVisibility must be visible or hidden.");
  }
  const audioUrl = cleanOptionalAudioUrl(value.audioUrl);
  return {
    ...base,
    kind: "model_listening",
    modelText: cleanText(value.modelText, "modelText", 4_000),
    ...(audioUrl ? { audioUrl } : {}),
    locale: cleanText(value.locale, "locale", 40),
    playbackGoal: value.playbackGoal as ModelListeningCapability["playbackGoal"],
    ...(value.transcriptVisibility !== undefined
      ? { transcriptVisibility: value.transcriptVisibility as NonNullable<ModelListeningCapability["transcriptVisibility"]> }
      : {}),
  };
}

function parseRecordedSpeaking(value: Record<string, unknown>): RecordedSpeakingCapability {
  const base = parseBase(value);
  if (base.kind !== "recorded_speaking" || !evidencePurposes.includes(value.evidencePurpose as RecordedSpeakingCapability["evidencePurpose"])) {
    throw new Error("The lesson contains an invalid recorded-speaking capability.");
  }
  const minimumSeconds = cleanInteger(value.minimumSeconds, "minimumSeconds", 1, 180);
  const maximumSeconds = cleanInteger(value.maximumSeconds, "maximumSeconds", 1, 180);
  if (minimumSeconds > maximumSeconds) {
    throw new Error("Recorded-speaking minimumSeconds cannot exceed maximumSeconds.");
  }
  return {
    ...base,
    kind: "recorded_speaking",
    prompt: cleanText(value.prompt, "prompt", 2_000),
    ...(value.targetText !== undefined ? { targetText: cleanText(value.targetText, "targetText", 2_000) } : {}),
    locale: cleanText(value.locale, "locale", 40),
    minimumSeconds,
    maximumSeconds,
    evidencePurpose: value.evidencePurpose as RecordedSpeakingCapability["evidencePurpose"],
  };
}

function parseRoleplay(value: Record<string, unknown>): AIRoleplayCapability {
  const base = parseBase(value);
  if (
    base.kind !== "ai_roleplay"
    || !cefrLevels.includes(value.cefr as AIRoleplayCapability["cefr"])
    || !correctionPolicies.includes(value.correctionPolicy as AIRoleplayCapability["correctionPolicy"])
    || typeof value.scenario !== "object"
    || value.scenario === null
    || Array.isArray(value.scenario)
  ) {
    throw new Error("The lesson contains an invalid AI-roleplay capability.");
  }
  const scenario = value.scenario as Record<string, unknown>;
  const minimumTurns = cleanInteger(scenario.minimumTurns, "scenario.minimumTurns", 1, 12);
  const maximumTurns = cleanInteger(scenario.maximumTurns, "scenario.maximumTurns", 1, 12);
  if (minimumTurns > maximumTurns) {
    throw new Error("AI-roleplay minimumTurns cannot exceed maximumTurns.");
  }
  return {
    ...base,
    kind: "ai_roleplay",
    cefr: value.cefr as AIRoleplayCapability["cefr"],
    language: cleanText(value.language, "language", 80),
    scenario: {
      role: cleanText(scenario.role, "scenario.role", 300),
      situation: cleanText(scenario.situation, "scenario.situation", 1_000),
      learnerGoal: cleanText(scenario.learnerGoal, "scenario.learnerGoal", 1_000),
      openingLine: cleanText(scenario.openingLine, "scenario.openingLine", 1_000),
      minimumTurns,
      maximumTurns,
    },
    correctionPolicy: value.correctionPolicy as AIRoleplayCapability["correctionPolicy"],
  };
}

/**
 * Parse and sanitize an authored capability into the exact trusted shape used
 * by Learn runtime services. Unknown fields are deliberately discarded.
 */
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

export function readLearningCapability(data: Record<string, unknown>): LearningCapability | null {
  try {
    return parseLearningCapability(data.capability);
  } catch {
    return null;
  }
}
