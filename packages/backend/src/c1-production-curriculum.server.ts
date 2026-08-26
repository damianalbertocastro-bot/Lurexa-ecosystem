import type { ContentBlock, Course, Lesson, Module } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { C1_MODULES_1_TO_8, type C1ModuleData } from "./curriculum/c1/modules";

const ORGANIZATION_ID = "lurexa-self-paced";
export const C1_PRODUCTION_COURSE_ID = "english-c1-advanced-fluency";

export interface C1ProductionCurriculumBundle {
  course: Course;
  modules: Module[];
  lessons: Lesson[];
}

function buildLessonFromModule(moduleData: C1ModuleData): Lesson {
  const lessonId = `c1-m${moduleData.order}-lesson-1`;

  const blocks: ContentBlock[] = [
    {
      id: `${lessonId}-hook-mission`,
      type: "text",
      order: 1,
      data: {
        text: `Mission: ${moduleData.mission}\n\nAdvanced Lexicon: ${moduleData.vocabulary.slice(0, 5).join(", ")}\nSyntactic Focus: ${moduleData.grammarStructures[0] ?? ""}`,
      },
    },
    {
      id: `${lessonId}-model-listening`,
      type: "interactive",
      order: 2,
      data: {
        capability: {
          schemaVersion: "1",
          id: `${lessonId}-listening-capability`,
          kind: "model_listening",
          stage: "CONTEXTUAL_INPUT",
          title: `Scholarly Colloquium: ${moduleData.title}`,
          instructions: "Analyze the speaker's sophisticated syntactic architecture, nuanced register modulation, and academic intonation.",
          competencyIds: moduleData.competencyIds,
          estimatedMinutes: 4,
          required: true,
          modelText: `${moduleData.grammarStructures[0]} ${moduleData.grammarStructures[1] ?? ""}`,
          locale: "en-US",
          playbackGoal: "meaning",
          transcriptVisibility: "hidden",
        },
      },
    },
    {
      id: `${lessonId}-comprehension-check`,
      type: "interactive",
      order: 3,
      data: {
        activity: {
          schemaVersion: "1",
          type: "single_choice",
          stage: "COMPREHENSION",
          title: "Epistemic Thesis Critique",
          instructions: "Select the analysis that most precisely deconstructs the speaker's philosophical or scholarly thesis.",
          prompt: "What is the primary philosophical proposition advanced by the speaker?",
          options: [
            moduleData.grammarStructures[0] ?? "The rapid proliferation of digital platforms necessitates an epistemological re-evaluation.",
            "The speaker proposed abandoning theoretical analysis in favor of unreflective action.",
            "The speaker expressed indifference regarding the ethical implications of the model.",
          ],
          correctAnswers: [moduleData.grammarStructures[0] ?? "The rapid proliferation of digital platforms necessitates an epistemological re-evaluation."],
          explanation: "This matches the target epistemic thesis and complex nominalization structure modeled in the discourse.",
          competencyIds: moduleData.competencyIds,
          estimatedMinutes: 2,
          required: true,
        },
      },
    },
    {
      id: `${lessonId}-language-noticing`,
      type: "interactive",
      order: 4,
      data: {
        activity: {
          schemaVersion: "1",
          type: "single_choice",
          stage: "LANGUAGE_NOTICING",
          title: "Advanced Syntactic & Prosodic Mastery",
          instructions: `Target Phonetics: ${moduleData.phoneticTargets[0] ?? "Academic multisyllabic stress and complex clause intonation"}`,
          prompt: "Complete the sentence with the formal inverted conditional:",
          options: [
            moduleData.grammarStructures[2] ?? "Were we to disregard the qualitative nuances, the conclusions would be flawed.",
            "If we was to disregard qualitative nuances, conclusions are flawed.",
            "Disregarding qualitative nuances if we do, conclusions flaws.",
          ],
          correctAnswers: [moduleData.grammarStructures[2] ?? "Were we to disregard the qualitative nuances, the conclusions would be flawed."],
          explanation: "Inverted conditional clauses with 'Were we to...' represent the pinnacle of formal C1/C2 academic English syntax.",
          competencyIds: moduleData.competencyIds,
          estimatedMinutes: 2,
          required: true,
        },
      },
    },
    {
      id: `${lessonId}-create-apply`,
      type: "interactive",
      order: 5,
      data: {
        activity: {
          schemaVersion: "1",
          type: "short_response",
          stage: "CREATE_APPLY",
          title: moduleData.createApplyTask.title,
          instructions: "Record your advanced spoken defense demonstrating epistemic precision, scholarly register, and native-like prosody.",
          prompt: moduleData.createApplyTask.prompt,
          explanation: "Saved to Core evidence. Forms part of your verified C1 Advanced Spoken Portfolio.",
          competencyIds: moduleData.competencyIds,
          estimatedMinutes: 5,
          required: true,
        },
      },
    },
    {
      id: `${lessonId}-quiz`,
      type: "interactive",
      order: 6,
      data: {
        activity: {
          schemaVersion: "1",
          type: "single_choice",
          stage: "QUIZ",
          title: `C1 Master Check: ${moduleData.title}`,
          instructions: "Select the most intellectually rigorous option.",
          prompt: `Which communicative strategy demonstrates C1 mastery in ${moduleData.title}?`,
          options: [
            moduleData.mission,
            "Using elementary vocabulary without adapting to the academic audience.",
            "Over-simplifying complex theoretical arguments to avoid technical analysis.",
          ],
          correctAnswers: [moduleData.mission],
          explanation: "Lurexa C1 cultivates supreme intellectual agility, academic rigor, and flawless pragmatic eloquence.",
          competencyIds: moduleData.competencyIds,
          estimatedMinutes: 2,
          required: true,
        },
      },
    },
    {
      id: `${lessonId}-reflection`,
      type: "text",
      order: 7,
      data: {
        text: `Lesson Completed!\n\nYou have mastered: ${moduleData.title}.\nPhonetics target: ${moduleData.phoneticTargets.join("; ")}.\nEngage with Lurexa Coach for doctoral-level spoken defense and debate simulations!`,
      },
    },
  ];

  return {
    id: lessonId,
    moduleId: moduleData.id,
    title: moduleData.title,
    summary: moduleData.mission,
    contentBlocks: blocks,
    order: 1,
    estimatedMinutes: 25,
  };
}

export function buildC1ProductionCurriculum(now: string = new Date().toISOString()): C1ProductionCurriculumBundle {
  const modules: Module[] = [];
  const lessons: Lesson[] = [];

  for (const moduleData of C1_MODULES_1_TO_8) {
    const lesson = buildLessonFromModule(moduleData);
    lessons.push(lesson);

    modules.push({
      id: moduleData.id,
      courseId: C1_PRODUCTION_COURSE_ID,
      title: moduleData.title,
      description: moduleData.mission,
      order: moduleData.order,
      lessonIds: [lesson.id],
    });
  }

  const course: Course = {
    id: C1_PRODUCTION_COURSE_ID,
    orgId: ORGANIZATION_ID,
    authorId: "lurexa-system",
    title: "English C1 Advanced & Academic Fluency",
    description: "Doctoral-grade 8-module advanced course for academic epistemology, international diplomacy, abstract philosophy, executive rhetoric, and supreme spoken eloquence.",
    subject: "english",
    status: "published",
    isTemplate: false,
    moduleIds: modules.map((m) => m.id),
    createdAt: now,
    updatedAt: now,
  };

  return { course, modules, lessons };
}

export async function ensureC1ProductionCurriculumInFirestore(): Promise<C1ProductionCurriculumBundle> {
  const database = getServerFirestore();
  const bundle = buildC1ProductionCurriculum();

  await Promise.all([
    database.collection("courses").doc(bundle.course.id).set(bundle.course, { merge: true }),
    ...bundle.modules.map((module) =>
      database.collection("modules").doc(module.id).set(module, { merge: true })
    ),
    ...bundle.lessons.map((lesson) =>
      database.collection("lessons").doc(lesson.id).set(lesson, { merge: true })
    ),
  ]);

  return bundle;
}
