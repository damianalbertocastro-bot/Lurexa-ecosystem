import type { ContentBlock, Course, Lesson, Module } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { A2_MODULES_1_TO_8, type A2ModuleData } from "./curriculum/a2/modules";

const ORGANIZATION_ID = "lurexa-self-paced";
export const A2_PRODUCTION_COURSE_ID = "english-a2-everyday-conversations";

export interface A2ProductionCurriculumBundle {
  course: Course;
  modules: Module[];
  lessons: Lesson[];
}

function buildLessonFromModule(moduleData: A2ModuleData): Lesson {
  const lessonId = `a2-m${moduleData.order}-lesson-1`;

  const blocks: ContentBlock[] = [
    {
      id: `${lessonId}-hook-mission`,
      type: "text",
      order: 1,
      data: {
        text: `Mission: ${moduleData.mission}\n\nCore Vocabulary: ${moduleData.vocabulary.slice(0, 5).join(", ")}\nKey Structure: ${moduleData.grammarStructures[0] ?? ""}`,
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
          title: `Listen: ${moduleData.title}`,
          instructions: "Listen for the main communicative idea first. Then notice key phrases and pronunciation cues.",
          competencyIds: moduleData.competencyIds,
          estimatedMinutes: 3,
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
          title: "Check comprehension",
          instructions: "Select the sentence that most accurately represents what you heard.",
          prompt: `Which statement best expresses the speaker's main intent in this scenario?`,
          options: [
            moduleData.grammarStructures[0] ?? "I always organize my tasks before starting work.",
            "I never check details or schedule plans in advance.",
            "I prefer to ignore directions and recommendations.",
          ],
          correctAnswers: [moduleData.grammarStructures[0] ?? "I always organize my tasks before starting work."],
          explanation: "This matches the target structure and communicative objective modeled in the dialogue.",
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
          title: "Language & Phonetics Focus",
          instructions: `Focus on: ${moduleData.phoneticTargets[0] ?? "Natural connected speech"}`,
          prompt: `Complete the sentence with the natural A2 English form:`,
          options: [
            moduleData.vocabulary[0] ?? "always",
            "not ever",
            "at the never",
          ],
          correctAnswers: [moduleData.vocabulary[0] ?? "always"],
          explanation: `In standard A2 usage, we place frequency markers and key vocabulary naturally in sentence structure.`,
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
          instructions: "Respond in your own words. Use the target vocabulary and grammatical forms practiced in this module.",
          prompt: moduleData.createApplyTask.prompt,
          explanation: "Your response is saved as structured learning evidence in Core. Successful completion reinforces communicative confidence.",
          competencyIds: moduleData.competencyIds,
          estimatedMinutes: 4,
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
          title: `Knowledge Check: ${moduleData.title}`,
          instructions: "Select the best answer.",
          prompt: `What is the primary communicative purpose of ${moduleData.title}?`,
          options: [
            moduleData.mission,
            "To translate text word-for-word without speaking.",
            "To memorize isolated grammar rules without communicative application.",
          ],
          correctAnswers: [moduleData.mission],
          explanation: "Lurexa focuses on practical communicative mastery and spoken fluency.",
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
        text: `Lesson Completed!\n\nYou have practiced: ${moduleData.title}.\nPhonetics target: ${moduleData.phoneticTargets.join("; ")}.\nNext, practice your spoken responses in Lurexa Coach!`,
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
    estimatedMinutes: 15,
  };
}

export function buildA2ProductionCurriculum(now: string = new Date().toISOString()): A2ProductionCurriculumBundle {
  const modules: Module[] = [];
  const lessons: Lesson[] = [];

  for (const moduleData of A2_MODULES_1_TO_8) {
    const lesson = buildLessonFromModule(moduleData);
    lessons.push(lesson);

    modules.push({
      id: moduleData.id,
      courseId: A2_PRODUCTION_COURSE_ID,
      title: moduleData.title,
      description: moduleData.mission,
      order: moduleData.order,
      lessonIds: [lesson.id],
    });
  }

  const course: Course = {
    id: A2_PRODUCTION_COURSE_ID,
    orgId: ORGANIZATION_ID,
    authorId: "lurexa-system",
    title: "English A2 Everyday Conversations",
    description: "Comprehensive 8-module practical course for living, traveling, and communicating independently in English.",
    subject: "english",
    status: "published",
    isTemplate: false,
    moduleIds: modules.map((m) => m.id),
    createdAt: now,
    updatedAt: now,
  };

  return { course, modules, lessons };
}

export async function ensureA2ProductionCurriculumInFirestore(): Promise<A2ProductionCurriculumBundle> {
  const database = getServerFirestore();
  const bundle = buildA2ProductionCurriculum();

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
