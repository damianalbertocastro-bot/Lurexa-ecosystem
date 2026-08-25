import { AdaptiveLearningPath } from "@lurexa/ui/AdaptiveLearningPath";
import { KnowledgeObject } from "@lurexa/ui/KnowledgeObject";
import { LearnerPulse } from "@lurexa/ui/LearnerPulse";
import { MemoryThread } from "@lurexa/ui/MemoryThread";
import { MindTrace } from "@lurexa/ui/MindTrace";
import { ProductBridge } from "@lurexa/ui/ProductBridge";
import type {
  AdaptiveLearningPathV1,
  KnowledgeObjectV1,
  LearnerPulseProjectionV1,
  MemoryThreadV1,
  MindTraceV1,
  ProductBridgeV1,
} from "@lurexa/types";

const evidenceBasis = {
  evidenceIds: ["fixture-evidence-1", "fixture-evidence-2"],
  freshness: "current" as const,
  limitations: ["Developer fixture only; not production learner data."],
};

const pulse: LearnerPulseProjectionV1 = {
  contractVersion: "1",
  learnerId: "signature-prototype",
  generatedAt: "2026-08-25T12:00:00.000Z",
  consumer: "learn",
  overallMomentum: "improving",
  dimensions: [
    { dimension: "vocabulary", state: "stable", momentum: "steady", confidence: "medium", summary: "Core vocabulary is stable in recent A2 work.", evidenceBasis },
    { dimension: "grammar", state: "developing", momentum: "improving", confidence: "high", summary: "Simple-past form is improving across recent practice.", evidenceBasis },
    { dimension: "listening", state: "unknown", momentum: "unknown", confidence: "low", summary: "Not enough recent listening evidence.", evidenceBasis },
    { dimension: "speaking", state: "developing", momentum: "improving", confidence: "medium", summary: "Past-event narration is becoming more fluent.", evidenceBasis },
    { dimension: "reading", state: "stable", momentum: "steady", confidence: "medium", summary: "Recent reading evidence is consistent.", evidenceBasis },
    { dimension: "writing", state: "unknown", momentum: "unknown", confidence: "low", summary: "Not enough recent writing evidence.", evidenceBasis },
    { dimension: "phonetics", state: "developing", momentum: "watch", confidence: "high", summary: "Regular-past endings still need targeted practice.", evidenceBasis },
  ],
  highlights: [
    { kind: "growth", label: "Simple-past grammar is improving.", dimension: "grammar" },
    { kind: "focus", label: "Practice regular-past endings in connected speech.", dimension: "phonetics", knowledgeObjectId: "eng.pronunciation.regular-past-endings" },
  ],
  limitations: ["Prototype fixture. Unknown states are intentionally visible."],
};

const path: AdaptiveLearningPathV1 = {
  contractVersion: "1",
  learnerId: "signature-prototype",
  generatedAt: "2026-08-25T12:00:00.000Z",
  curriculumRef: "a2-module-past-events",
  currentNodeId: "lesson-past-stories",
  nodes: [
    { id: "lesson-past-stories", kind: "canonical", state: "current", title: "Tell a short story about yesterday", product: "learn", destinationRef: "/learn/a2/past-stories", canonicalRef: "a2:past-stories", knowledgeObjectIds: ["eng.skill.narrative-speaking.past-events"], reason: "canonical_sequence", required: true },
    { id: "coach-ed", kind: "coach_practice", state: "recommended", title: "Practice regular-past endings in Coach", product: "coach", destinationRef: "/coach", knowledgeObjectIds: ["eng.pronunciation.regular-past-endings"], reason: "coach_speaking_transfer", mindTraceId: "trace-fixture", required: false },
    { id: "lesson-followup", kind: "review", state: "recommended", title: "Return to past-event storytelling", product: "learn", destinationRef: "/learn/a2/past-stories-review", knowledgeObjectIds: ["eng.skill.narrative-speaking.past-events"], reason: "review_after_instability", required: false },
  ],
  constraints: { canonicalRequirementsPreserved: true, autonomousRequiredContentSkipping: false },
  evidenceBasis,
};

const thread: MemoryThreadV1 = {
  contractVersion: "1",
  learnerId: "signature-prototype",
  generatedAt: "2026-08-25T12:00:00.000Z",
  topic: { title: "Regular past-tense endings", knowledgeObjectId: "eng.pronunciation.regular-past-endings", dimension: "phonetics" },
  events: [
    { id: "m1", occurredAt: "2026-08-04T12:00:00.000Z", kind: "observed", sourceProduct: "learn", title: "Pattern first observed", summary: "Final regular-past endings were inconsistent in a speaking activity.", knowledgeObjectId: "eng.pronunciation.regular-past-endings", evidenceIds: ["e1"], confidence: "medium" },
    { id: "m2", occurredAt: "2026-08-10T12:00:00.000Z", kind: "practiced", sourceProduct: "coach", title: "Targeted Coach practice", summary: "Practiced /t/, /d/, and /ɪd/ endings in short past-event sentences.", knowledgeObjectId: "eng.pronunciation.regular-past-endings", evidenceIds: ["e2"], confidence: "high" },
    { id: "m3", occurredAt: "2026-08-20T12:00:00.000Z", kind: "improved", sourceProduct: "learn", title: "Improvement observed", summary: "Recent production shows stronger control, with some instability remaining.", knowledgeObjectId: "eng.pronunciation.regular-past-endings", evidenceIds: ["e3"], confidence: "medium" },
  ],
  currentSummary: "The pattern is improving but still benefits from short targeted reinforcement.",
  limitations: ["Prototype fixture only."],
};

const trace: MindTraceV1 = {
  contractVersion: "1",
  id: "trace-fixture",
  learnerId: "signature-prototype",
  generatedAt: "2026-08-25T12:00:00.000Z",
  consumer: "learn",
  signal: "Recent speaking evidence shows regular-past endings remain inconsistent.",
  interpretation: "The pattern appears across more than one recent interaction, so a short reinforcement is useful before the next narrative task.",
  action: { kind: "practice", label: "Practice in Lurexa Coach", destinationRef: "/coach", product: "coach" },
  confidence: "medium",
  evidenceBasis,
  limitations: ["This is an approved learner-facing explanation, not hidden model reasoning."],
  explanationPolicy: "approved_summary_only",
};

const bridge: ProductBridgeV1 = {
  contractVersion: "1",
  bridgeId: "prototype-bridge",
  actorId: "signature-prototype",
  learnerId: "signature-prototype",
  source: "learn",
  destination: "coach",
  purpose: "targeted_practice",
  destinationRef: "/coach",
  contextRef: "knowledge-object:eng.pronunciation.regular-past-endings",
  createdAt: "2026-08-25T12:00:00.000Z",
  expiresAt: "2026-08-25T12:10:00.000Z",
  singleUse: true,
};

const object: KnowledgeObjectV1 = {
  contractVersion: "1",
  id: "eng.pronunciation.regular-past-endings",
  kind: "pronunciation_target",
  title: "Regular past-tense endings",
  description: "Intelligible production and perception of /t/, /d/, and /ɪd/ in regular English past-tense forms.",
  status: "active",
  language: "en",
  cefrLevels: ["A2", "B1", "B2"],
  skillDimensions: ["phonetics", "speaking", "listening"],
  curriculumRefs: ["a2:past-events"],
  relations: [
    { kind: "prerequisite", targetId: "eng.grammar.simple-past.regular-form" },
    { kind: "supports", targetId: "eng.skill.narrative-speaking.past-events" },
  ],
  aliases: ["-ed pronunciation", "regular past pronunciation"],
  tags: ["english", "pronunciation", "simple-past"],
  version: 1,
  createdAt: "2026-08-25T00:00:00.000Z",
  updatedAt: "2026-08-25T00:00:00.000Z",
};

export default function SignatureExperiencePrototypePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[.18em] text-indigo-600">Developer prototype · S2</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-.05em] text-[#071d67]">Lurexa Signature Experience System</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">Deterministic fixture gallery for reviewing all six signature patterns together. This route contains no production learner data and is not a source of learner truth.</p>
        </header>

        <LearnerPulse pulse={pulse} />
        <div className="grid gap-6 xl:grid-cols-2">
          <AdaptiveLearningPath path={path} />
          <MindTrace trace={trace} />
        </div>
        <MemoryThread thread={thread} />
        <div className="grid gap-6 xl:grid-cols-2">
          <ProductBridge bridge={bridge} description="A purpose-scoped continuation from Learn into Coach. The destination re-authorizes learner context rather than trusting URL data." />
          <KnowledgeObject object={object} />
        </div>
      </div>
    </main>
  );
}
