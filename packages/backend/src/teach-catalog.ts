import type { TeachCourse, TeachCredentialDefinition } from "@lurexa/types";

const timestamp = "2026-08-20T00:00:00.000Z";

export const TEACH_MVP_COURSES: TeachCourse[] = [
  {
    id: "english-educators-b2-c1",
    title: "English for educators: B2 → C1",
    description: "Grow professional English through instruction, feedback, meetings, explanation, and academic discussion.",
    track: "english-proficiency",
    cefrTarget: "C1",
    competencyIds: ["professional-english", "academic-discussion", "feedback-language"],
    modules: [
      { id: "feedback-language", title: "Giving precise corrective feedback", order: 1, competencyIds: ["feedback-language"], evidenceRequired: true },
      { id: "instruction-language", title: "Explaining and checking understanding", order: 2, competencyIds: ["professional-english"], evidenceRequired: true },
      { id: "academic-discussion", title: "Professional and academic discussion", order: 3, competencyIds: ["academic-discussion"], evidenceRequired: true },
      { id: "c1-checkpoint", title: "C1 professional performance checkpoint", order: 4, competencyIds: ["professional-english", "academic-discussion"], evidenceRequired: true },
    ],
    published: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "pronunciation-clearer-instruction",
    title: "Pronunciation for clearer instruction",
    description: "Develop intelligible professional speech and learn how to teach pronunciation without accent erasure.",
    track: "teaching-practice",
    competencyIds: ["pronunciation-pedagogy", "professional-english"],
    modules: [
      { id: "intelligibility", title: "Intelligibility before imitation", order: 1, competencyIds: ["pronunciation-pedagogy"] },
      { id: "transfer", title: "Spanish-to-English transfer patterns", order: 2, competencyIds: ["pronunciation-pedagogy"] },
      { id: "feedback", title: "Correct without breaking fluency", order: 3, competencyIds: ["pronunciation-pedagogy"], evidenceRequired: true },
      { id: "simulation", title: "Classroom feedback simulation", order: 4, competencyIds: ["professional-english", "pronunciation-pedagogy"], evidenceRequired: true },
    ],
    published: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "teaching-speaking-confidence",
    title: "Teaching speaking with confidence",
    description: "Design speaking tasks that increase learner talk time, interaction quality, and useful feedback.",
    track: "teaching-practice",
    competencyIds: ["speaking-instruction", "task-design"],
    modules: [
      { id: "talk-time", title: "Increase meaningful student talk time", order: 1, competencyIds: ["speaking-instruction"] },
      { id: "scaffolding", title: "Scaffold interaction without scripting it", order: 2, competencyIds: ["task-design"] },
      { id: "feedback-loop", title: "Build a feedback loop", order: 3, competencyIds: ["speaking-instruction"], evidenceRequired: true },
    ],
    published: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "assessment-supports-learning",
    title: "Assessment that supports learning",
    description: "Use formative evidence, transparent criteria, and feedback to improve learning while it is happening.",
    track: "assessment",
    competencyIds: ["assessment-for-learning", "rubric-design"],
    modules: [
      { id: "evidence", title: "Choose evidence that matters", order: 1, competencyIds: ["assessment-for-learning"] },
      { id: "criteria", title: "Make success criteria usable", order: 2, competencyIds: ["rubric-design"] },
      { id: "feedback-action", title: "Turn feedback into next action", order: 3, competencyIds: ["assessment-for-learning"], evidenceRequired: true },
    ],
    published: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "ai-literacy-language-teachers",
    title: "AI literacy for language teachers",
    description: "Use AI responsibly for planning, practice, feedback, differentiation, and professional judgment.",
    track: "ai-digital",
    competencyIds: ["ai-literacy", "digital-pedagogy"],
    modules: [
      { id: "ai-judgment", title: "Know what AI should and should not decide", order: 1, competencyIds: ["ai-literacy"] },
      { id: "workflow", title: "Build a useful classroom AI workflow", order: 2, competencyIds: ["digital-pedagogy"], evidenceRequired: true },
      { id: "evaluation", title: "Evaluate AI output before learners see it", order: 3, competencyIds: ["ai-literacy"], evidenceRequired: true },
    ],
    published: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "designing-asynchronous-learning",
    title: "Designing asynchronous learning",
    description: "Create coherent asynchronous sequences that keep learners active, supported, and accountable.",
    track: "course-design",
    competencyIds: ["asynchronous-design", "learning-sequencing"],
    modules: [
      { id: "sequence", title: "Sequence for cognitive and language load", order: 1, competencyIds: ["learning-sequencing"] },
      { id: "interaction", title: "Design meaningful asynchronous interaction", order: 2, competencyIds: ["asynchronous-design"] },
      { id: "redesign", title: "Redesign one real learning week", order: 3, competencyIds: ["asynchronous-design", "learning-sequencing"], evidenceRequired: true },
    ],
    published: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
];

export const TEACH_MVP_CREDENTIALS: TeachCredentialDefinition[] = [
  {
    id: "speaking-instruction-foundations",
    name: "Speaking Instruction Foundations",
    description: "Demonstrates evidence-backed capability in designing and facilitating speaking development.",
    active: true,
    requirements: [
      { id: "course", type: "course-completion", courseId: "teaching-speaking-confidence" },
      { id: "evidence", type: "verified-evidence", competencyId: "speaking-instruction", minimumCount: 1 },
    ],
  },
  {
    id: "ai-informed-teaching-essentials",
    name: "AI-Informed Teaching Essentials",
    description: "Demonstrates responsible, evidence-based use of AI in teaching workflows.",
    active: true,
    requirements: [
      { id: "course", type: "course-completion", courseId: "ai-literacy-language-teachers" },
      { id: "evidence", type: "verified-evidence", competencyId: "ai-literacy", minimumCount: 1 },
    ],
  },
  {
    id: "c1-english-for-educators",
    name: "C1 English for Educators",
    description: "Recognizes demonstrated C1 professional communication for educator contexts.",
    active: true,
    requirements: [
      { id: "course", type: "course-completion", courseId: "english-educators-b2-c1" },
      { id: "cefr", type: "cefr-level", cefrLevel: "C1" },
    ],
  },
];
