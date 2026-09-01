import type { ContentBlock, Course, Lesson, Module } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { B1_MODULES_1_TO_8, type B1ModuleData } from "./curriculum/b1/modules";

const ORGANIZATION_ID = "lurexa-self-paced";
export const B1_PRODUCTION_COURSE_ID = "english-b1-independent-speaker";

export interface B1ProductionCurriculumBundle {
  course: Course;
  modules: Module[];
  lessons: Lesson[];
}

function buildLessonFromModule(moduleData: B1ModuleData): Lesson {
  const lessonId = `b1-m${moduleData.order}-lesson-1`;

  const grammarSection = moduleData.grammarSection;
  const grammarText = grammarSection
    ? `### 📖 Grammar Focus: ${grammarSection.conceptTitle}\n\n` +
      `**Structural Formula:**\n\`${grammarSection.formula}\`\n\n` +
      `**Explanation & Usage:**\n${grammarSection.explanation}\n\n` +
      `**Forms Breakdown:**\n` +
      `• *Affirmative:* ${grammarSection.forms.affirmative}\n` +
      `• *Negative:* ${grammarSection.forms.negative}\n` +
      `• *Question:* ${grammarSection.forms.question}\n\n` +
      `**💡 Dominican & Spanish Transfer Tip:**\n${grammarSection.l1TransferTip}\n\n` +
      `**Practical Examples in Context:**\n` +
      grammarSection.examples.map((ex) => `• "${ex}"`).join("\n")
    : `### 📖 Grammar Focus: ${moduleData.title}\n\n` +
      `**Key Structure:** \`${moduleData.grammarStructures[0] ?? ""}\`\n\n` +
      `**Usage Note:** Deploy this grammatical structure to connect multi-clause arguments with independent spoken fluency.`;

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
          instructions: "Listen for the main communicative arguments and narrative flow first. Then notice discourse connectors and intonation patterns.",
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
      id: `${lessonId}-grammar-section`,
      type: "text",
      order: 3,
      data: {
        category: "grammar",
        text: grammarText,
      },
    },
    {
      id: `${lessonId}-comprehension-check`,
      type: "interactive",
      order: 4,
      data: {
        activity: {
          schemaVersion: "1",
          type: "single_choice",
          stage: "COMPREHENSION",
          title: "Check comprehension & reasoning",
          instructions: "Select the sentence that most accurately represents the speaker's main thesis or intent.",
          prompt: `Which statement best captures the speaker's perspective?`,
          options: [
            moduleData.grammarStructures[0] ?? "I was working on the project when suddenly...",
            "The speaker avoided discussing any causes or consequences.",
            "The speaker expressed complete uncertainty without offering any reasons.",
          ],
          correctAnswers: [moduleData.grammarStructures[0] ?? "I was working on the project when suddenly..."],
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
      order: 5,
      data: {
        activity: {
          schemaVersion: "1",
          type: "single_choice",
          stage: "LANGUAGE_NOTICING",
          title: "Language & Discourse Focus",
          instructions: `Focus on: ${moduleData.phoneticTargets[0] ?? "Discourse markers and sentence stress"}`,
          prompt: `Complete the sentence with the natural B1 English transition:`,
          options: [
            moduleData.vocabulary[0] ?? "meanwhile",
            "at the meantime moment",
            "in the while of",
          ],
          correctAnswers: [moduleData.vocabulary[0] ?? "meanwhile"],
          explanation: `In standard B1 usage, we use discourse connectors to structure multi-clause sentences logically.`,
          competencyIds: moduleData.competencyIds,
          estimatedMinutes: 2,
          required: true,
        },
      },
    },
    {
      id: `${lessonId}-create-apply`,
      type: "interactive",
      order: 6,
      data: {
        activity: {
          schemaVersion: "1",
          type: "short_response",
          stage: "CREATE_APPLY",
          title: moduleData.createApplyTask.title,
          instructions: "Respond in your own words. Use the target vocabulary, discourse markers, and grammatical forms practiced in this module.",
          prompt: moduleData.createApplyTask.prompt,
          explanation: "Your response is saved as structured learning evidence in Core. Successful completion reinforces independent spoken fluency.",
          competencyIds: moduleData.competencyIds,
          estimatedMinutes: 4,
          required: true,
        },
      },
    },
    {
      id: `${lessonId}-quiz`,
      type: "interactive",
      order: 7,
      data: {
        activity: {
          schemaVersion: "1",
          type: "single_choice",
          stage: "QUIZ",
          title: `Knowledge Check: ${moduleData.title}`,
          instructions: "Select the best answer.",
          prompt: `What is the primary communicative objective of ${moduleData.title}?`,
          options: [
            moduleData.mission,
            "To translate text mechanically without considering audience or register.",
            "To avoid expressing reasons or justified opinions.",
          ],
          correctAnswers: [moduleData.mission],
          explanation: "Lurexa focuses on independent communicative mastery, reasoning, and spoken fluency.",
          competencyIds: moduleData.competencyIds,
          estimatedMinutes: 2,
          required: true,
        },
      },
    },
    {
      id: `${lessonId}-reflection`,
      type: "text",
      order: 8,
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
    estimatedMinutes: 18,
  };
}

export function buildB1ProductionCurriculum(now: string = new Date().toISOString()): B1ProductionCurriculumBundle {
  const modules: Module[] = [];
  const lessons: Lesson[] = [];

  for (const moduleData of B1_MODULES_1_TO_8) {
    const lesson = buildLessonFromModule(moduleData);
    lessons.push(lesson);

    modules.push({
      id: moduleData.id,
      courseId: B1_PRODUCTION_COURSE_ID,
      title: moduleData.title,
      description: moduleData.mission,
      order: moduleData.order,
      lessonIds: [lesson.id],
    });
  }

  const course: Course = {
    id: B1_PRODUCTION_COURSE_ID,
    orgId: ORGANIZATION_ID,
    authorId: "lurexa-system",
    title: "English B1 Independent Speaker",
    description: "Comprehensive 8-module course for independent narration, reasoning, workplace discussions, and intercultural communication.",
    subject: "english",
    status: "published",
    isTemplate: false,
    moduleIds: modules.map((m) => m.id),
    createdAt: now,
    updatedAt: now,
  };

  return { course, modules, lessons };
}

export async function ensureB1ProductionCurriculumInFirestore(): Promise<B1ProductionCurriculumBundle> {
  const database = getServerFirestore();
  const bundle = buildB1ProductionCurriculum();

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
