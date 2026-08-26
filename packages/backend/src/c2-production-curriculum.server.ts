import type { ContentBlock, Course, Lesson, Module } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { C2_MODULES_1_TO_8, type C2ModuleData } from "./curriculum/c2/modules";

const ORGANIZATION_ID = "lurexa-self-paced";
export const C2_PRODUCTION_COURSE_ID = "english-c2-mastery";

export interface C2ProductionCurriculumBundle {
  course: Course;
  modules: Module[];
  lessons: Lesson[];
}

function buildLessonFromModule(moduleData: C2ModuleData): Lesson {
  const lessonId = `c2-m${moduleData.order}-lesson-1`;

  const blocks: ContentBlock[] = [
    {
      id: `${lessonId}-hook-mission`,
      type: "text",
      order: 1,
      data: {
        text: `Mission: ${moduleData.mission}\n\nSovereign Lexicon: ${moduleData.vocabulary.slice(0, 5).join(", ")}\nRhetorical Device: ${moduleData.grammarStructures[0] ?? ""}`,
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
          title: `Sovereign Oratory: ${moduleData.title}`,
          instructions: "Analyze the speaker's subtle micro-intonational contours, rhetorical cadence, and subtextual insinuation.",
          competencyIds: moduleData.competencyIds,
          estimatedMinutes: 5,
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
          title: "Subtextual Insinuation Deconstruction",
          instructions: "Select the analysis that accurately decodes the unspoken subtext and strategic intent of the speaker.",
          prompt: "What is the unwritten subtext conveyed by the speaker's deliberate syntactic ellipsis?",
          options: [
            moduleData.grammarStructures[1] ?? "Were one to read between the lines, the circumspection reveals a decisive strategic pivot.",
            "The speaker explicitly affirmed every term without hesitation.",
            "The speaker exhibited complete indifference toward the geopolitical outcome.",
          ],
          correctAnswers: [moduleData.grammarStructures[1] ?? "Were one to read between the lines, the circumspection reveals a decisive strategic pivot."],
          explanation: "At C2 level, communication operates predominantly through subtle pragmatic inference, syntactic omission, and tone modulation.",
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
          title: "Classical Rhetorical Virtuosity",
          instructions: `Target Phonetics: ${moduleData.phoneticTargets[0] ?? "Sovereign cadence, pitch attenuation, and sublime metered pauses"}`,
          prompt: "Identify the classical rhetorical device deployed in the statement:",
          options: [
            moduleData.grammarStructures[0] ?? "Seldom has a statement conveyed such profound ambivalence through syntactic omission.",
            "Informal colloquial contraction without inversion.",
            "Elementary declarative statement without modifiers.",
          ],
          correctAnswers: [moduleData.grammarStructures[0] ?? "Seldom has a statement conveyed such profound ambivalence through syntactic omission."],
          explanation: "Masterful negative adverbial inversion combined with nominalization represents the pinnacle of native-equivalent C2 English prose.",
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
          instructions: "Record your sovereign oral defense exhibiting native-level prosody, deadpan wit/oratorical sublimity, and unassailable structural mastery.",
          prompt: moduleData.createApplyTask.prompt,
          explanation: "Saved to Core evidence. Forms part of your verified C2 Sovereign English Magnum Opus Portfolio.",
          competencyIds: moduleData.competencyIds,
          estimatedMinutes: 6,
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
          title: `C2 Sovereign Mastery Check: ${moduleData.title}`,
          instructions: "Select the response demonstrating effortless native-like linguistic sovereignty.",
          prompt: `Which communicative performance best demonstrates C2 sovereign mastery in ${moduleData.title}?`,
          options: [
            moduleData.mission,
            "Relying on textbook translations without perceiving cultural subtext.",
            "Using literal interpretations during ironic or diplomatic exchanges.",
          ],
          correctAnswers: [moduleData.mission],
          explanation: "Lurexa C2 represents absolute linguistic sovereignty, spontaneous intellectual brilliance, and near-native communicative mastery.",
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
        text: `Lesson Completed!\n\nYou have mastered: ${moduleData.title}.\nPhonetics target: ${moduleData.phoneticTargets.join("; ")}.\nEngage in spontaneous, unscripted high-stakes debates with Lurexa Coach!`,
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
    estimatedMinutes: 30,
  };
}

export function buildC2ProductionCurriculum(now: string = new Date().toISOString()): C2ProductionCurriculumBundle {
  const modules: Module[] = [];
  const lessons: Lesson[] = [];

  for (const moduleData of C2_MODULES_1_TO_8) {
    const lesson = buildLessonFromModule(moduleData);
    lessons.push(lesson);

    modules.push({
      id: moduleData.id,
      courseId: C2_PRODUCTION_COURSE_ID,
      title: moduleData.title,
      description: moduleData.mission,
      order: moduleData.order,
      lessonIds: [lesson.id],
    });
  }

  const course: Course = {
    id: C2_PRODUCTION_COURSE_ID,
    orgId: ORGANIZATION_ID,
    authorId: "lurexa-system",
    title: "English C2 Native-Like Mastery & Sovereign Fluency",
    description: "Pinnacle 8-module mastery curriculum for international statesmanship, post-structuralist hermeneutics, spontaneous sociolect code-switching, classical oratory, and sovereign spoken eloquence.",
    subject: "english",
    status: "published",
    isTemplate: false,
    moduleIds: modules.map((m) => m.id),
    createdAt: now,
    updatedAt: now,
  };

  return { course, modules, lessons };
}

export async function ensureC2ProductionCurriculumInFirestore(): Promise<C2ProductionCurriculumBundle> {
  const database = getServerFirestore();
  const bundle = buildC2ProductionCurriculum();

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
