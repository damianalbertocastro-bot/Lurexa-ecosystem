"use client";

import type { ContentBlock, LearningActivity, LearningActivityType, Lesson, LessonStage } from "@lurexa/types";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";

export type ActivityDraft = {
  id: string;
  type: LearningActivityType;
  stage: LessonStage;
  title: string;
  instructions: string;
  prompt: string;
  options: string;
  correctAnswers: string;
  explanation: string;
  competencyIds: string;
  estimatedMinutes: number;
};

type Props = {
  drafts: ActivityDraft[];
  onChange: (drafts: ActivityDraft[]) => void;
};

const lessonStages: LessonStage[] = [
  "HOOK", "MISSION", "VOCABULARY_BUILDER", "CONTEXTUAL_INPUT", "COMPREHENSION",
  "LANGUAGE_NOTICING", "GRAMMAR_FOCUS", "PHONETICS_FOCUS", "GUIDED_PRACTICE",
  "CONVERSATION", "CREATE_APPLY", "REVIEW", "QUIZ", "REFLECTION",
];

export function createActivityDraft(): ActivityDraft {
  return {
    id: crypto.randomUUID(),
    type: "single_choice",
    stage: "GUIDED_PRACTICE",
    title: "Quick check",
    instructions: "Choose the best answer.",
    prompt: "",
    options: "",
    correctAnswers: "",
    explanation: "",
    competencyIds: "",
    estimatedMinutes: 2,
  };
}

function normalizeAuthoringAnswer(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/^[a-z]\s*[.)-]\s*/i, "").replace(/[.!?]+$/, "").trim();
}

function resolveCorrectAnswers(options: string[], answers: string[]): string[] {
  return answers.map((answer) => options.find((option) => normalizeAuthoringAnswer(option) === normalizeAuthoringAnswer(answer)) ?? answer);
}

function competencyIds(value: string): string[] {
  return [...new Set(value.split(",").map((id) => id.trim()).filter(Boolean))];
}

export function readActivityDrafts(lesson: Lesson): ActivityDraft[] {
  return lesson.contentBlocks.filter((block) => block.type === "interactive").flatMap((block) => {
    const activity = block.data.activity;
    if (typeof activity !== "object" || activity === null || Array.isArray(activity)) return [];
    const value = activity as Record<string, unknown>;
    if (!["single_choice", "multiple_selection", "sentence_builder", "short_response"].includes(value.type as string)
      || typeof value.title !== "string" || typeof value.instructions !== "string" || typeof value.prompt !== "string") return [];
    const isShortResponse = value.type === "short_response";
    if (!isShortResponse && (!Array.isArray(value.options) || !value.options.every((option) => typeof option === "string")
      || !Array.isArray(value.correctAnswers) || !value.correctAnswers.every((answer) => typeof answer === "string"))) return [];
    return [{
      id: block.id,
      type: value.type as LearningActivityType,
      stage: typeof value.stage === "string" ? value.stage as LessonStage : "GUIDED_PRACTICE",
      title: value.title,
      instructions: value.instructions,
      prompt: value.prompt,
      options: Array.isArray(value.options) ? value.options.filter((option): option is string => typeof option === "string").join("\n") : "",
      correctAnswers: Array.isArray(value.correctAnswers) ? value.correctAnswers.filter((answer): answer is string => typeof answer === "string").join("\n") : "",
      explanation: typeof value.explanation === "string" ? value.explanation : "",
      competencyIds: Array.isArray(value.competencyIds) ? value.competencyIds.filter((id): id is string => typeof id === "string").join(", ") : "",
      estimatedMinutes: typeof value.estimatedMinutes === "number" ? value.estimatedMinutes : 2,
    }];
  });
}

export function buildActivityBlocks(drafts: ActivityDraft[]): ContentBlock[] {
  return drafts.map((draft, index) => {
    const competencies = competencyIds(draft.competencyIds);
    if (!draft.title.trim() || !draft.instructions.trim() || !draft.prompt.trim() || !competencies.length) {
      throw new Error(`Activity ${index + 1} needs a title, instructions, prompt, and at least one competency ID.`);
    }

    if (draft.type === "short_response") {
      const activity: LearningActivity = {
        schemaVersion: "1",
        type: "short_response",
        stage: draft.stage,
        title: draft.title.trim(),
        instructions: draft.instructions.trim(),
        prompt: draft.prompt.trim(),
        competencyIds: competencies,
        estimatedMinutes: Math.max(1, Math.round(draft.estimatedMinutes)),
        required: true,
        ...(draft.explanation.trim() ? { explanation: draft.explanation.trim() } : {}),
      };
      return { id: draft.id, type: "interactive", data: { activity }, order: index + 2 };
    }

    const options = draft.options.split("\n").map((option) => option.trim()).filter(Boolean);
    const answers = resolveCorrectAnswers(options, draft.correctAnswers.split("\n").map((answer) => answer.trim()).filter(Boolean));
    if (options.length < 2 || !answers.length || answers.some((answer) => !options.includes(answer))) {
      throw new Error(`Activity ${index + 1} needs at least two options and correct answers from the option list.`);
    }
    if (draft.type === "single_choice" && answers.length !== 1) {
      throw new Error(`Activity ${index + 1} is single choice, so it needs exactly one correct answer.`);
    }
    const activity: LearningActivity = {
      schemaVersion: "1",
      type: draft.type,
      stage: draft.stage,
      title: draft.title.trim(),
      instructions: draft.instructions.trim(),
      prompt: draft.prompt.trim(),
      options,
      correctAnswers: answers,
      competencyIds: competencies,
      estimatedMinutes: Math.max(1, Math.round(draft.estimatedMinutes)),
      required: true,
      ...(draft.explanation.trim() ? { explanation: draft.explanation.trim() } : {}),
    };
    return { id: draft.id, type: "interactive", data: { activity }, order: index + 2 };
  });
}

function updateDraft(drafts: ActivityDraft[], id: string, patch: Partial<ActivityDraft>): ActivityDraft[] {
  return drafts.map((draft) => draft.id === id ? { ...draft, ...patch } : draft);
}

export function LearningActivityEditor({ drafts, onChange }: Props) {
  return (
    <div className="space-y-3 rounded-xl border border-[var(--lx-border)] bg-[var(--learn-canvas)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-brand-navy)]">Learning activities</p>
          <p className="text-xs text-[var(--lx-muted)]">Add scored practice or learner-created responses. Core scores objective work server-side and preserves open responses as evidence.</p>
        </div>
        <Button type="button" size="sm" variant="secondary" onClick={() => onChange([...drafts, createActivityDraft()])}>+ Add activity</Button>
      </div>

      {drafts.map((draft, index) => (
        <div key={draft.id} className="space-y-3 rounded-xl border border-[var(--lx-border)] bg-white p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--color-brand-navy)]">Activity {index + 1}</p>
            <Button type="button" size="sm" variant="destructive" onClick={() => onChange(drafts.filter((activity) => activity.id !== draft.id))}>Remove</Button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-[var(--lx-muted)]">Activity type
              <select className="mt-1 w-full rounded-xl border border-[var(--lx-border)] p-2 text-[var(--color-brand-navy)]" value={draft.type} onChange={(event) => onChange(updateDraft(drafts, draft.id, { type: event.target.value as LearningActivityType }))}>
                <option value="single_choice">Single-choice question</option>
                <option value="multiple_selection">Multiple selection</option>
                <option value="sentence_builder">Sentence builder</option>
                <option value="short_response">Short response / Create & Apply</option>
              </select>
            </label>
            <label className="text-sm font-medium text-[var(--lx-muted)]">Lesson stage
              <select className="mt-1 w-full rounded-xl border border-[var(--lx-border)] p-2 text-[var(--color-brand-navy)]" value={draft.stage} onChange={(event) => onChange(updateDraft(drafts, draft.id, { stage: event.target.value as LessonStage }))}>
                {lessonStages.map((stage) => <option key={stage} value={stage}>{stage.replaceAll("_", " ")}</option>)}
              </select>
            </label>
          </div>
          <Input label="Activity title" value={draft.title} onChange={(event) => onChange(updateDraft(drafts, draft.id, { title: event.target.value }))} />
          <Input label="Student instructions" value={draft.instructions} onChange={(event) => onChange(updateDraft(drafts, draft.id, { instructions: event.target.value }))} />
          <Input label="Prompt" value={draft.prompt} onChange={(event) => onChange(updateDraft(drafts, draft.id, { prompt: event.target.value }))} />

          {draft.type !== "short_response" ? <>
            <label className="block text-sm font-medium text-[var(--lx-muted)]">Options, one per line
              <textarea className="mt-1 w-full rounded-xl border border-[var(--lx-border)] p-3 text-[var(--color-brand-navy)]" value={draft.options} onChange={(event) => onChange(updateDraft(drafts, draft.id, { options: event.target.value }))} rows={4} />
            </label>
            <label className="block text-sm font-medium text-[var(--lx-muted)]">Correct answer{draft.type === "multiple_selection" ? "s, one per line" : ""}
              <textarea className="mt-1 w-full rounded-xl border border-[var(--lx-border)] p-3 text-[var(--color-brand-navy)]" value={draft.correctAnswers} onChange={(event) => onChange(updateDraft(drafts, draft.id, { correctAnswers: event.target.value }))} rows={draft.type === "multiple_selection" ? 3 : 1} />
            </label>
          </> : null}

          <Input label="Feedback explanation" value={draft.explanation} onChange={(event) => onChange(updateDraft(drafts, draft.id, { explanation: event.target.value }))} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="Competency IDs (comma separated)" value={draft.competencyIds} onChange={(event) => onChange(updateDraft(drafts, draft.id, { competencyIds: event.target.value }))} placeholder="EN.A1.SPEAK.INTRODUCE_SELF" />
            <Input label="Estimated minutes" type="number" min="1" value={String(draft.estimatedMinutes)} onChange={(event) => onChange(updateDraft(drafts, draft.id, { estimatedMinutes: Number(event.target.value) || 1 }))} />
          </div>
        </div>
      ))}
    </div>
  );
}
