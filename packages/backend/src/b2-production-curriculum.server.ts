import type { ContentBlock, Course, Lesson, Module } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { B2_MODULES_1_TO_8, type B2ModuleData } from "./curriculum/b2/modules";

const ORGANIZATION_ID = "lurexa-self-paced";
export const B2_PRODUCTION_COURSE_ID = "english-b2-fluency-communication";

export interface B2ProductionCurriculumBundle {
  course: Course;
  modules: Module[];
  lessons: Lesson[];
}

function buildLessonFromModule(moduleData: B2ModuleData): Lesson {
  const lessonId = `b2-m${moduleData.order}-lesson-1`;

  const grammarSection = moduleData.grammarSection;
  const grammarText = grammarSection
    ? `### 📖 Grammar Focus: ${grammarSection.conceptTitle}\n\n` +
      `**Structural Formula:**\n\`${grammarSection.formula}\`\n\n` +
      `**Explanation & Strategic Function:**\n${grammarSection.explanation}\n\n` +
      `**Forms Breakdown:**\n` +
      `• *Affirmative:* ${grammarSection.forms.affirmative}\n` +
      `• *Negative:* ${grammarSection.forms.negative}\n` +
      `• *Question / Inverted:* ${grammarSection.forms.question}\n\n` +
      `**💡 Dominican & Spanish Transfer Tip:**\n${grammarSection.l1TransferTip}\n\n` +
      `**Executive Examples in Context:**\n` +
      grammarSection.examples.map((ex) => `• "${ex}"`).join("\n")
    : `### 📖 Grammar Focus: ${moduleData.title}\n\n` +
      `**Key Structure:** \`${moduleData.grammarStructures[0] ?? ""}\`\n\n` +
      `**Usage Note:** Deploy advanced grammatical structures to negotiate, structure discourse, and lead executive discussions.`;

  const blocks: ContentBlock[] = [
    {
      id: `${lessonId}-hook-mission`,
      type: "text",
      order: 1,
      data: {
        text: `Mission: ${moduleData.mission}\n\nKey Terminology: ${moduleData.vocabulary.slice(0, 5).join(", ")}\nTarget Structure: ${moduleData.grammarStructures[0] ?? ""}`,
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
          title: `Executive Briefing: ${moduleData.title}`,
          instructions: "Listen closely to the speaker's rhetorical pacing, use of inversion/conditionals, and pragmatic intonation before reviewing the transcript.",
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
          title: "Executive Decision Check",
          instructions: "Select the response that accurately captures the strategic nuance of the speaker's proposition.",
          prompt: "What is the primary condition established by the speaker?",
          options: [
            moduleData.grammarStructures[0] ?? "Provided that your team guarantees delivery...",
            "The speaker demanded immediate payment without offering any warranty.",
            "The speaker refused to engage in further negotiations.",
          ],
          correctAnswers: [moduleData.grammarStructures[0] ?? "Provided that your team guarantees delivery..."],
          explanation: "This accurately reflects the conditional negotiation strategy modeled in the dialogue.",
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
          title: "Rhetorical & Grammatical Precision",
          instructions: `Target Phonetics: ${moduleData.phoneticTargets[0] ?? "Emphatic inversion and contrastive stress"}`,
          prompt: "Complete the statement using the formal inversion structure:",
          options: [
            moduleData.grammarStructures[3] ?? "Under no circumstances can we compromise on data privacy.",
            "In no circumstances we can compromise data privacy.",
            "Under any circumstance we cannot compromise data privacy.",
          ],
          correctAnswers: [moduleData.grammarStructures[3] ?? "Under no circumstances can we compromise on data privacy."],
          explanation: "In formal B2/C1 discourse, negative adverbials at the beginning of a clause trigger subject-auxiliary inversion.",
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
          instructions: "Record your spoken response applying advanced professional structures, rhetorical pauses, and precise terminology.",
          prompt: moduleData.createApplyTask.prompt,
          explanation: "Saved to Core evidence. Contributes to your verified B2 speaking and pronunciation profile.",
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
          title: `Mastery Check: ${moduleData.title}`,
          instructions: "Select the most professional and diplomatically accurate option.",
          prompt: `Which communicative strategy best demonstrates B2 mastery in ${moduleData.title}?`,
          options: [
            moduleData.mission,
            "Using aggressive, non-diplomatic demands during negotiation.",
            "Relying solely on informal slang without adjusting register.",
          ],
          correctAnswers: [moduleData.mission],
          explanation: "Lurexa B2 builds authoritative executive communication, strategic reasoning, and nuanced fluency.",
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
        text: `Lesson Completed!\n\nYou have mastered: ${moduleData.title}.\nPhonetics target: ${moduleData.phoneticTargets.join("; ")}.\nProceed to Lurexa Coach for real-time executive speaking simulation!`,
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
    estimatedMinutes: 20,
  };
}

export function buildB2ProductionCurriculum(now: string = new Date().toISOString()): B2ProductionCurriculumBundle {
  const modules: Module[] = [];
  const lessons: Lesson[] = [];

  for (const moduleData of B2_MODULES_1_TO_8) {
    const lesson = buildLessonFromModule(moduleData);
    lessons.push(lesson);

    modules.push({
      id: moduleData.id,
      courseId: B2_PRODUCTION_COURSE_ID,
      title: moduleData.title,
      description: moduleData.mission,
      order: moduleData.order,
      lessonIds: [lesson.id],
    });
  }

  const course: Course = {
    id: B2_PRODUCTION_COURSE_ID,
    orgId: ORGANIZATION_ID,
    authorId: "lurexa-system",
    title: "English B2 Fluency & Professional Communication",
    description: "Comprehensive 8-module executive course for strategic negotiation, analytical data synthesis, crisis response, and keynote rhetoric.",
    subject: "english",
    status: "published",
    isTemplate: false,
    moduleIds: modules.map((m) => m.id),
    createdAt: now,
    updatedAt: now,
  };

  return { course, modules, lessons };
}

export async function ensureB2ProductionCurriculumInFirestore(): Promise<B2ProductionCurriculumBundle> {
  const database = getServerFirestore();
  const bundle = buildB2ProductionCurriculum();

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
