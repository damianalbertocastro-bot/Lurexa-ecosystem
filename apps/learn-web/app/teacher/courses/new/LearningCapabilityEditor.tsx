"use client";

import type {
  AIRoleplayCapability,
  ContentBlock,
  LearningCapability,
  LearningCapabilityKind,
  Lesson,
  ModelListeningCapability,
  RecordedSpeakingCapability,
} from "@lurexa/types";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";

export type CapabilityDraft = {
  blockId: string;
  capabilityId: string;
  order: number;
  kind: LearningCapabilityKind;
  title: string;
  instructions: string;
  competencyIds: string;
  estimatedMinutes: number;
  required: boolean;
  modelText: string;
  audioUrl: string;
  locale: string;
  playbackGoal: ModelListeningCapability["playbackGoal"];
  prompt: string;
  targetText: string;
  minimumSeconds: number;
  maximumSeconds: number;
  evidencePurpose: RecordedSpeakingCapability["evidencePurpose"];
  cefr: AIRoleplayCapability["cefr"];
  language: string;
  role: string;
  situation: string;
  learnerGoal: string;
  openingLine: string;
  minimumTurns: number;
  maximumTurns: number;
  correctionPolicy: AIRoleplayCapability["correctionPolicy"];
};

type Props = {
  drafts: CapabilityDraft[];
  onChange: (drafts: CapabilityDraft[]) => void;
};

const kindDefaults: Record<LearningCapabilityKind, Pick<CapabilityDraft, "title" | "instructions" | "order">> = {
  model_listening: {
    title: "Listen to a model",
    instructions: "Listen for meaning first, then notice useful language and pronunciation.",
    order: 20,
  },
  recorded_speaking: {
    title: "Record your response",
    instructions: "Record a short response and save it as learning evidence.",
    order: 60,
  },
  ai_roleplay: {
    title: "Practice the conversation",
    instructions: "Continue the scenario using the language from this lesson.",
    order: 70,
  },
};

export function createCapabilityDraft(kind: LearningCapabilityKind = "model_listening"): CapabilityDraft {
  const defaults = kindDefaults[kind];
  return {
    blockId: crypto.randomUUID(),
    capabilityId: crypto.randomUUID(),
    order: defaults.order,
    kind,
    title: defaults.title,
    instructions: defaults.instructions,
    competencyIds: "",
    estimatedMinutes: kind === "ai_roleplay" ? 4 : 3,
    required: true,
    modelText: "",
    audioUrl: "",
    locale: "en-US",
    playbackGoal: "noticing",
    prompt: "",
    targetText: "",
    minimumSeconds: 3,
    maximumSeconds: 45,
    evidencePurpose: "performance",
    cefr: "A1",
    language: "English",
    role: "a friendly conversation partner",
    situation: "",
    learnerGoal: "",
    openingLine: "",
    minimumTurns: 2,
    maximumTurns: 5,
    correctionPolicy: "post_turn_salient",
  };
}

function parseCompetencyIds(value: string): string[] {
  return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
}

function baseCapability(draft: CapabilityDraft) {
  const competencyIds = parseCompetencyIds(draft.competencyIds);
  if (!draft.title.trim() || !draft.instructions.trim() || !competencyIds.length) {
    throw new Error(`${draft.title || "Learning capability"} needs a title, instructions, and at least one competency ID.`);
  }
  return {
    schemaVersion: "1" as const,
    id: draft.capabilityId,
    kind: draft.kind,
    stage: draft.kind === "model_listening" ? "CONTEXTUAL_INPUT" as const : draft.kind === "recorded_speaking" ? "PHONETICS_FOCUS" as const : "CONVERSATION" as const,
    title: draft.title.trim(),
    instructions: draft.instructions.trim(),
    competencyIds,
    estimatedMinutes: Math.max(1, Math.min(120, Number(draft.estimatedMinutes) || 1)),
    required: draft.required,
  };
}

export function buildLearningCapabilityBlocks(drafts: CapabilityDraft[]): ContentBlock[] {
  const capabilityIds = new Set<string>();
  return drafts.map((draft) => {
    if (capabilityIds.has(draft.capabilityId)) throw new Error("Each advanced learning capability needs a unique ID.");
    capabilityIds.add(draft.capabilityId);
    const base = baseCapability(draft);
    let capability: LearningCapability;

    if (draft.kind === "model_listening") {
      if (!draft.modelText.trim()) throw new Error(`${draft.title} needs approved model text.`);
      capability = {
        ...base,
        kind: "model_listening",
        stage: "CONTEXTUAL_INPUT",
        modelText: draft.modelText.trim(),
        ...(draft.audioUrl.trim() ? { audioUrl: draft.audioUrl.trim() } : {}),
        locale: draft.locale.trim() || "en-US",
        playbackGoal: draft.playbackGoal,
      } satisfies ModelListeningCapability;
    } else if (draft.kind === "recorded_speaking") {
      if (!draft.prompt.trim()) throw new Error(`${draft.title} needs a speaking prompt.`);
      capability = {
        ...base,
        kind: "recorded_speaking",
        stage: "PHONETICS_FOCUS",
        prompt: draft.prompt.trim(),
        ...(draft.targetText.trim() ? { targetText: draft.targetText.trim() } : {}),
        locale: draft.locale.trim() || "en-US",
        minimumSeconds: Math.max(1, Math.round(draft.minimumSeconds)),
        maximumSeconds: Math.max(1, Math.round(draft.maximumSeconds)),
        evidencePurpose: draft.evidencePurpose,
      } satisfies RecordedSpeakingCapability;
      if (capability.minimumSeconds > capability.maximumSeconds) throw new Error(`${draft.title} minimum recording time cannot exceed its maximum.`);
    } else {
      if (!draft.situation.trim() || !draft.learnerGoal.trim() || !draft.openingLine.trim()) {
        throw new Error(`${draft.title} needs a situation, learner goal, and opening line.`);
      }
      capability = {
        ...base,
        kind: "ai_roleplay",
        stage: "CONVERSATION",
        cefr: draft.cefr,
        language: draft.language.trim() || "English",
        scenario: {
          role: draft.role.trim() || "a friendly conversation partner",
          situation: draft.situation.trim(),
          learnerGoal: draft.learnerGoal.trim(),
          openingLine: draft.openingLine.trim(),
          minimumTurns: Math.max(1, Math.round(draft.minimumTurns)),
          maximumTurns: Math.max(1, Math.round(draft.maximumTurns)),
        },
        correctionPolicy: draft.correctionPolicy,
      } satisfies AIRoleplayCapability;
      if (capability.scenario.minimumTurns > capability.scenario.maximumTurns) throw new Error(`${draft.title} minimum turns cannot exceed maximum turns.`);
    }

    return {
      id: draft.blockId,
      type: "interactive",
      order: Math.max(2, Math.round(draft.order)),
      data: { capability },
    };
  });
}

export function readLearningCapabilityDrafts(lesson: Lesson): CapabilityDraft[] {
  return lesson.contentBlocks.flatMap((block) => {
    if (block.type !== "interactive" || typeof block.data.capability !== "object" || block.data.capability === null || Array.isArray(block.data.capability)) return [];
    const value = block.data.capability as Partial<LearningCapability> & Record<string, unknown>;
    if (!["model_listening", "recorded_speaking", "ai_roleplay"].includes(value.kind ?? "")) return [];
    const draft = createCapabilityDraft(value.kind as LearningCapabilityKind);
    const common: CapabilityDraft = {
      ...draft,
      blockId: block.id,
      capabilityId: typeof value.id === "string" ? value.id : draft.capabilityId,
      order: block.order,
      title: typeof value.title === "string" ? value.title : draft.title,
      instructions: typeof value.instructions === "string" ? value.instructions : draft.instructions,
      competencyIds: Array.isArray(value.competencyIds) ? value.competencyIds.filter((item): item is string => typeof item === "string").join(", ") : "",
      estimatedMinutes: typeof value.estimatedMinutes === "number" ? value.estimatedMinutes : draft.estimatedMinutes,
      required: typeof value.required === "boolean" ? value.required : true,
    };

    if (value.kind === "model_listening") {
      const capability = value as Partial<ModelListeningCapability>;
      return [{ ...common, modelText: capability.modelText ?? "", audioUrl: capability.audioUrl ?? "", locale: capability.locale ?? "en-US", playbackGoal: capability.playbackGoal ?? "noticing" }];
    }
    if (value.kind === "recorded_speaking") {
      const capability = value as Partial<RecordedSpeakingCapability>;
      return [{ ...common, prompt: capability.prompt ?? "", targetText: capability.targetText ?? "", locale: capability.locale ?? "en-US", minimumSeconds: capability.minimumSeconds ?? 3, maximumSeconds: capability.maximumSeconds ?? 45, evidencePurpose: capability.evidencePurpose ?? "performance" }];
    }
    const capability = value as Partial<AIRoleplayCapability>;
    return [{
      ...common,
      cefr: capability.cefr ?? "A1",
      language: capability.language ?? "English",
      role: capability.scenario?.role ?? "a friendly conversation partner",
      situation: capability.scenario?.situation ?? "",
      learnerGoal: capability.scenario?.learnerGoal ?? "",
      openingLine: capability.scenario?.openingLine ?? "",
      minimumTurns: capability.scenario?.minimumTurns ?? 2,
      maximumTurns: capability.scenario?.maximumTurns ?? 5,
      correctionPolicy: capability.correctionPolicy ?? "post_turn_salient",
    }];
  });
}

function updateDraft(drafts: CapabilityDraft[], id: string, patch: Partial<CapabilityDraft>): CapabilityDraft[] {
  return drafts.map((draft) => draft.blockId === id ? { ...draft, ...patch } : draft);
}

export function LearningCapabilityEditor({ drafts, onChange }: Props) {
  return (
    <div className="space-y-4 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-brand-navy)]">Advanced learning capabilities</p>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-[var(--lx-muted)]">Author approved listening, recorded speaking, and AI roleplay blocks. Provider settings stay server-controlled; the server validates and sanitizes every capability before persistence.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={() => onChange([...drafts, createCapabilityDraft("model_listening")])}>+ Listening</Button>
          <Button type="button" size="sm" variant="secondary" onClick={() => onChange([...drafts, createCapabilityDraft("recorded_speaking")])}>+ Speaking</Button>
          <Button type="button" size="sm" variant="secondary" onClick={() => onChange([...drafts, createCapabilityDraft("ai_roleplay")])}>+ AI roleplay</Button>
        </div>
      </div>

      {drafts.map((draft, index) => (
        <div key={draft.blockId} className="space-y-3 rounded-xl border border-[var(--lx-border)] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-sm font-semibold text-[var(--color-brand-navy)]">Capability {index + 1}</p><p className="text-xs text-[var(--lx-muted)]">{draft.kind.replaceAll("_", " ")}</p></div>
            <Button type="button" size="sm" variant="destructive" onClick={() => onChange(drafts.filter((item) => item.blockId !== draft.blockId))}>Remove</Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="text-sm font-medium text-[var(--lx-muted)]">Type<select className="mt-1 w-full rounded-xl border border-[var(--lx-border)] p-2 text-[var(--color-brand-navy)]" value={draft.kind} onChange={(event) => { const kind = event.target.value as LearningCapabilityKind; const next = createCapabilityDraft(kind); onChange(updateDraft(drafts, draft.blockId, { ...next, blockId: draft.blockId, capabilityId: draft.capabilityId, order: draft.order })); }}><option value="model_listening">Model listening</option><option value="recorded_speaking">Recorded speaking</option><option value="ai_roleplay">AI roleplay</option></select></label>
            <Input label="Lesson order" type="number" min="2" value={String(draft.order)} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { order: Number(event.target.value) || 2 }))} />
            <Input label="Estimated minutes" type="number" min="1" max="120" value={String(draft.estimatedMinutes)} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { estimatedMinutes: Number(event.target.value) || 1 }))} />
          </div>
          <Input label="Capability title" value={draft.title} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { title: event.target.value }))} />
          <Input label="Student instructions" value={draft.instructions} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { instructions: event.target.value }))} />
          <Input label="Competency IDs (comma separated)" value={draft.competencyIds} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { competencyIds: event.target.value }))} placeholder="EN.A1.LISTEN.BASIC_SOCIAL_EXCHANGES" />
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--lx-muted)]"><input type="checkbox" checked={draft.required} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { required: event.target.checked }))} />Required in this lesson</label>

          {draft.kind === "model_listening" ? <>
            <label className="block text-sm font-medium text-[var(--lx-muted)]">Approved model text<textarea className="mt-1 w-full rounded-xl border border-[var(--lx-border)] p-3 text-[var(--color-brand-navy)]" rows={5} value={draft.modelText} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { modelText: event.target.value }))} /></label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><Input label="Locale" value={draft.locale} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { locale: event.target.value }))} /><label className="text-sm font-medium text-[var(--lx-muted)]">Playback goal<select className="mt-1 w-full rounded-xl border border-[var(--lx-border)] p-2 text-[var(--color-brand-navy)]" value={draft.playbackGoal} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { playbackGoal: event.target.value as ModelListeningCapability["playbackGoal"] }))}><option value="meaning">Meaning</option><option value="noticing">Noticing</option><option value="pronunciation_model">Pronunciation model</option></select></label><Input label="Optional approved audio URL" value={draft.audioUrl} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { audioUrl: event.target.value }))} /></div>
          </> : null}

          {draft.kind === "recorded_speaking" ? <>
            <Input label="Speaking prompt" value={draft.prompt} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { prompt: event.target.value }))} />
            <Input label="Optional model/target text" value={draft.targetText} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { targetText: event.target.value }))} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4"><Input label="Locale" value={draft.locale} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { locale: event.target.value }))} /><Input label="Minimum seconds" type="number" min="1" max="180" value={String(draft.minimumSeconds)} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { minimumSeconds: Number(event.target.value) || 1 }))} /><Input label="Maximum seconds" type="number" min="1" max="180" value={String(draft.maximumSeconds)} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { maximumSeconds: Number(event.target.value) || 1 }))} /><label className="text-sm font-medium text-[var(--lx-muted)]">Evidence purpose<select className="mt-1 w-full rounded-xl border border-[var(--lx-border)] p-2 text-[var(--color-brand-navy)]" value={draft.evidencePurpose} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { evidencePurpose: event.target.value as RecordedSpeakingCapability["evidencePurpose"] }))}><option value="rehearsal">Rehearsal</option><option value="performance">Performance</option></select></label></div>
          </> : null}

          {draft.kind === "ai_roleplay" ? <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><label className="text-sm font-medium text-[var(--lx-muted)]">CEFR level<select className="mt-1 w-full rounded-xl border border-[var(--lx-border)] p-2 text-[var(--color-brand-navy)]" value={draft.cefr} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { cefr: event.target.value as AIRoleplayCapability["cefr"] }))}>{["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => <option key={level}>{level}</option>)}</select></label><Input label="Language" value={draft.language} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { language: event.target.value }))} /><label className="text-sm font-medium text-[var(--lx-muted)]">Correction policy<select className="mt-1 w-full rounded-xl border border-[var(--lx-border)] p-2 text-[var(--color-brand-navy)]" value={draft.correctionPolicy} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { correctionPolicy: event.target.value as AIRoleplayCapability["correctionPolicy"] }))}><option value="post_turn_salient">Post-turn salient</option><option value="balanced">Balanced</option><option value="direct_precision">Direct precision</option></select></label></div>
            <Input label="AI role" value={draft.role} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { role: event.target.value }))} />
            <Input label="Situation" value={draft.situation} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { situation: event.target.value }))} />
            <Input label="Learner goal" value={draft.learnerGoal} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { learnerGoal: event.target.value }))} />
            <Input label="Opening line" value={draft.openingLine} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { openingLine: event.target.value }))} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Input label="Minimum learner turns" type="number" min="1" max="12" value={String(draft.minimumTurns)} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { minimumTurns: Number(event.target.value) || 1 }))} /><Input label="Maximum learner turns" type="number" min="1" max="12" value={String(draft.maximumTurns)} onChange={(event) => onChange(updateDraft(drafts, draft.blockId, { maximumTurns: Number(event.target.value) || 1 }))} /></div>
          </> : null}
        </div>
      ))}
    </div>
  );
}
