import type { ContentBlock, Course, Lesson, Module } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";
import { refreshLearnerIntelligence } from "./learner-intelligence-pipeline.server";

const ORGANIZATION_ID = "lurexa-self-paced";
const COURSE_ID = "english-a1-foundations";
const MODULE_ID = "english-a1-introductions";
const LESSON_ID = "a1-introduce-yourself";
const A2_COURSE_ID = "english-a2-everyday-conversations";
const A2_MODULE_ID = "english-a2-making-plans";
const A2_LESSON_ID = "a2-make-a-plan";

const A1_INTRO_COMPETENCIES = [
  "EN.A1.SPEAK.INTRODUCE_SELF",
  "EN.A1.CONV.PERSONAL_INTRODUCTION",
  "EN.A1.PRAG.BASIC_POLITENESS",
] as const;

export type SelfPacedGoal = "daily_life" | "work" | "travel" | "study";
export type PlacementAnswer = "nice_to_meet_you" | "fine_thanks" | "i_live_in" | "i_live" | "are" | "is" | "going_to" | "go";

export interface SelfPacedOnboardingResult {
  courseId: string;
  lessonId: string;
  recommendation: {
    level: "A1" | "A2";
    confidence: "low";
    rationale: string;
  };
}

function lessonContentBlocks(): ContentBlock[] {
  return [
    {
      id: "a1-intro-text",
      type: "text",
      order: 1,
      data: {
        text: "Mission: introduce yourself in two short sentences.\n\nAndrea: Hi, I’m Andrea. What’s your name?\nLuis: Hello, I’m Luis. Nice to meet you.\nAndrea: Nice to meet you too.\n\nUse I’m + your name. Say Nice to meet you when you meet someone for the first time.",
      },
    },
    {
      id: "a1-model-listening",
      type: "interactive",
      order: 2,
      data: {
        capability: {
          schemaVersion: "1",
          id: "a1-m1-u1-l1-model-listening-production",
          kind: "model_listening",
          stage: "CONTEXTUAL_INPUT",
          title: "Listen to a natural first meeting",
          instructions: "Listen first for meaning. Then notice how the greeting, name question, and polite response sound as connected chunks.",
          competencyIds: ["EN.A1.LISTEN.PREDICTABLE_EXCHANGES", "EN.A1.CONV.PERSONAL_INTRODUCTION"],
          estimatedMinutes: 2,
          required: true,
          modelText: "Carlos: Hello, I'm Carlos. What's your name? Elena: I'm Elena. Nice to meet you. Carlos: Nice to meet you too, Elena!",
          locale: "en-US",
          playbackGoal: "noticing",
        },
      },
    },
    {
      id: "a1-listening-check",
      type: "interactive",
      order: 3,
      data: {
        activity: {
          schemaVersion: "1",
          type: "single_choice",
          stage: "COMPREHENSION",
          title: "Listen for the name",
          instructions: "Listen to the first meeting, then choose the name Carlos hears.",
          prompt: "What is the other person's name?",
          options: ["Elena", "Andrea", "Luis"],
          correctAnswers: ["Elena"],
          explanation: "Carlos asks Elena for her name, and she says: “I'm Elena.”",
          competencyIds: ["EN.A1.LISTEN.PREDICTABLE_EXCHANGES"],
          estimatedMinutes: 1,
          required: true,
        },
      },
    },
    {
      id: "a1-greeting-response",
      type: "interactive",
      order: 4,
      data: {
        activity: {
          schemaVersion: "1",
          type: "single_choice",
          stage: "GUIDED_PRACTICE",
          title: "Choose a natural response",
          instructions: "Choose the best response.",
          prompt: "Someone says: “Hi, I’m Carlos. Nice to meet you.”",
          options: ["Nice to meet you.", "I am fine, thank you.", "See you yesterday."],
          correctAnswers: ["Nice to meet you."],
          explanation: "Nice to meet you is the natural response when you meet someone for the first time.",
          competencyIds: [...A1_INTRO_COMPETENCIES],
          estimatedMinutes: 2,
          required: true,
        },
      },
    },
    {
      id: "a1-build-introduction",
      type: "interactive",
      order: 5,
      data: {
        activity: {
          schemaVersion: "1",
          type: "sentence_builder",
          stage: "GUIDED_PRACTICE",
          title: "Build your introduction",
          instructions: "Select the words in the correct order.",
          prompt: "Make one sentence to introduce yourself.",
          options: ["Hello,", "I’m", "Ana."],
          correctAnswers: ["Hello,", "I’m", "Ana."],
          explanation: "Use Hello, then I’m, then your name.",
          competencyIds: ["EN.A1.SPEAK.INTRODUCE_SELF"],
          estimatedMinutes: 2,
          required: true,
        },
      },
    },
    {
      id: "a1-recorded-speaking",
      type: "interactive",
      order: 6,
      data: {
        capability: {
          schemaVersion: "1",
          id: "a1-m1-u1-l1-recorded-greeting",
          kind: "recorded_speaking",
          stage: "PHONETICS_FOCUS",
          title: "Record your greeting",
          instructions: "Say the greeting in one natural short turn. Focus on clear meaning and useful stress, not accent erasure.",
          competencyIds: ["EN.A1.SPEAK.INTRODUCE_SELF", "EN.A1.PHON.WORD_STRESS"],
          estimatedMinutes: 3,
          required: true,
          prompt: "Greet the listener, say your name, and say ‘Nice to meet you.’",
          targetText: "Hello, I'm [your name]. Nice to meet you.",
          locale: "en-US",
          minimumSeconds: 3,
          maximumSeconds: 30,
          evidencePurpose: "performance",
        },
      },
    },
    {
      id: "a1-ai-roleplay",
      type: "interactive",
      order: 7,
      data: {
        capability: {
          schemaVersion: "1",
          id: "a1-m1-u1-l1-ai-greeting-roleplay",
          kind: "ai_roleplay",
          stage: "CONVERSATION",
          title: "Meet a new classmate",
          instructions: "Continue the short conversation. Introduce yourself and respond naturally. The tutor keeps the exchange at A1 level.",
          competencyIds: [...A1_INTRO_COMPETENCIES],
          estimatedMinutes: 4,
          required: true,
          cefr: "A1",
          language: "English",
          scenario: {
            role: "a friendly new classmate",
            situation: "You meet for the first time before an English class.",
            learnerGoal: "Greet the classmate, say your name, respond politely, and sustain a very short first-meeting exchange.",
            openingLine: "Hi! I'm Alex. Nice to meet you. What's your name?",
            minimumTurns: 2,
            maximumTurns: 5,
          },
          correctionPolicy: "post_turn_salient",
        },
      },
    },
    {
      id: "a1-intro-check",
      type: "quiz_embed",
      order: 8,
      data: {
        prompt: "Which sentence introduces your name?",
        options: ["I’m Daniela.", "Nice yesterday.", "I am fine name."],
        correctAnswer: "I’m Daniela.",
        explanation: "I’m + name is a short, natural introduction.",
      },
    },
    {
      id: "a1-create-apply",
      type: "interactive",
      order: 9,
      data: {
        activity: {
          schemaVersion: "1",
          type: "short_response",
          stage: "CREATE_APPLY",
          title: "Create your introduction",
          instructions: "Write your own short introduction. Include your name, where you are from, and “Nice to meet you.”",
          prompt: "Write two or three sentences to introduce yourself to a new classmate.",
          explanation: "You submitted a real introduction. Read it aloud slowly to practise clear, confident communication.",
          competencyIds: ["EN.A1.WRITE.PERSONAL_SENTENCES", "EN.A1.CREATE.PERSONAL_INTRODUCTION"],
          estimatedMinutes: 3,
          required: true,
        },
      },
    },
  ];
}

type A1LessonBlueprint = {
  id: string;
  moduleId: string;
  title: string;
  summary: string;
  mission: string;
  dialogue: string;
  listeningPrompt: string;
  listeningOptions: string[];
  listeningAnswer: string;
  builder: string[];
  spokenPrompt: string;
  role: string;
  situation: string;
  goal: string;
  openingLine: string;
  writingPrompt: string;
  competencies: string[];
  order: number;
  roleplayTurns?: [number, number];
  /** Defaults preserve the short A1 speaking-practice window. */
  spokenDuration?: {
    minimumSeconds: number;
    maximumSeconds: number;
  };
};

function structuredA1Lesson(spec: A1LessonBlueprint): Lesson {
  const prefix = spec.id;
  const [minimumTurns, maximumTurns] = spec.roleplayTurns ?? [2, 5];
  const { minimumSeconds = 3, maximumSeconds = 45 } = spec.spokenDuration ?? {};
  return {
    id: spec.id,
    moduleId: spec.moduleId,
    title: spec.title,
    summary: spec.summary,
    order: spec.order,
    estimatedMinutes: 21,
    contentBlocks: [
      { id: `${prefix}-mission`, type: "text", order: 1, data: { text: `Mission: ${spec.mission}\n\n${spec.dialogue}\n\nWork for meaning first. Then use the short English chunks in your own response.` } },
      { id: `${prefix}-listen`, type: "interactive", order: 2, data: { capability: { schemaVersion: "1", id: `${prefix}-model-listening`, kind: "model_listening", stage: "CONTEXTUAL_INPUT", title: "Listen for meaning", instructions: "Listen once without reading for every word. Listen again to notice the useful chunks.", competencyIds: spec.competencies, estimatedMinutes: 2, required: true, modelText: spec.dialogue, locale: "en-US", playbackGoal: "meaning" } } },
      { id: `${prefix}-listen-check`, type: "interactive", order: 3, data: { activity: { schemaVersion: "1", type: "single_choice", stage: "COMPREHENSION", title: "Check what you heard", instructions: "Choose the answer from the short exchange.", prompt: spec.listeningPrompt, options: spec.listeningOptions, correctAnswers: [spec.listeningAnswer], explanation: `The exchange gives the answer: ${spec.listeningAnswer}`, competencyIds: spec.competencies, estimatedMinutes: 2, required: true } } },
      { id: `${prefix}-build`, type: "interactive", order: 4, data: { activity: { schemaVersion: "1", type: "sentence_builder", stage: "GUIDED_PRACTICE", title: "Build the useful chunk", instructions: "Select the words in the natural order.", prompt: "Build the sentence for this situation.", options: spec.builder, correctAnswers: spec.builder, explanation: "Use this short chunk as a whole, then change the personal detail for yourself.", competencyIds: spec.competencies, estimatedMinutes: 2, required: true } } },
      { id: `${prefix}-speak`, type: "interactive", order: 5, data: { capability: { schemaVersion: "1", id: `${prefix}-recorded-speaking`, kind: "recorded_speaking", stage: "PHONETICS_FOCUS", title: "Say it clearly", instructions: "Record one short, meaningful response. Focus on understandable words, stress, and phrase endings—not accent erasure.", competencyIds: [...spec.competencies, "EN.A1.PHON.INTELLIGIBLE_CORE_PHRASES"], estimatedMinutes: 3, required: true, prompt: spec.spokenPrompt, locale: "en-US", minimumSeconds, maximumSeconds, evidencePurpose: "performance" } } },
      { id: `${prefix}-roleplay`, type: "interactive", order: 6, data: { capability: { schemaVersion: "1", id: `${prefix}-roleplay-capability`, kind: "ai_roleplay", stage: "CONVERSATION", title: "Use it in a short exchange", instructions: "Respond in your own words. The tutor remains at A1 and gives one useful correction only when it helps communication.", competencyIds: spec.competencies, estimatedMinutes: 4, required: true, cefr: "A1", language: "English", scenario: { role: spec.role, situation: spec.situation, learnerGoal: spec.goal, openingLine: spec.openingLine, minimumTurns, maximumTurns }, correctionPolicy: "post_turn_salient" } } },
      { id: `${prefix}-quick-check`, type: "quiz_embed", order: 7, data: { prompt: spec.listeningPrompt, options: spec.listeningOptions, correctAnswer: spec.listeningAnswer, explanation: `The correct response is ${spec.listeningAnswer}.` } },
      { id: `${prefix}-create`, type: "interactive", order: 8, data: { activity: { schemaVersion: "1", type: "short_response", stage: "CREATE_APPLY", title: "Create and apply", instructions: "Write a short, real response. You can change personal details to keep it comfortable and private.", prompt: spec.writingPrompt, explanation: "Your response is preserved as learner-generated evidence. Completion is not a mastery claim; the next activity can use it as a starting point.", competencyIds: [...spec.competencies, "EN.A1.WRITE.BASIC_FORM"], estimatedMinutes: 3, required: true } } },
    ],
  };
}

function a1StarterCourse(now: string): { course: Course; modules: Module[]; lessons: Lesson[]; entryLesson: Lesson } {
  const unitOneNames = structuredA1Lesson({
    id: "a1-ask-your-name", moduleId: MODULE_ID, title: "What's your name?", summary: "Say your name, ask another person's name, and complete a two-way exchange.", mission: "I can say my name and ask another person's name.", dialogue: "Maya: Hi, I'm Maya. What's your name?\nJoel: I'm Joel. Nice to meet you.\nMaya: Nice to meet you too.", listeningPrompt: "What is the second person's name?", listeningOptions: ["Joel", "Maya", "Carlos"], listeningAnswer: "Joel", builder: ["My", "name", "is", "Ana."], spokenPrompt: "Say your name and ask, ‘What's your name?’", role: "a new classmate", situation: "You meet before an English class.", goal: "Say your name, ask for a name, and close politely.", openingLine: "Hi! I'm Maya. What's your name?", writingPrompt: "Write a two-line name exchange for two new classmates.", competencies: ["EN.A1.SPEAK.INTRODUCE_SELF", "EN.A1.SPEAK.ASK_PERSONAL_QUESTIONS", "EN.A1.CONV.GREETING_EXCHANGE"], order: 2,
  });
  const countries = structuredA1Lesson({
    id: "a1-countries-identity", moduleId: "english-a1-who-am-i", title: "Where are you from?", summary: "Share and understand a country of origin in a short exchange.", mission: "I can say where I am from and ask where another person is from.", dialogue: "Rosa: Where are you from?\nDavid: I'm from the Dominican Republic. And you?\nRosa: I'm from Brazil.", listeningPrompt: "Where is David from?", listeningOptions: ["The Dominican Republic", "Brazil", "Mexico"], listeningAnswer: "The Dominican Republic", builder: ["I'm", "from", "the", "Dominican Republic."], spokenPrompt: "Say where you are from. You may use a real or practice country.", role: "a friendly student", situation: "You are sharing basic information before a class activity.", goal: "Ask and answer where someone is from, then ask one follow-up question.", openingLine: "Hello! Where are you from?", writingPrompt: "Write a short profile line with a name and country. Use a practice identity if you prefer.", competencies: ["EN.A1.LISTEN.PERSONAL_INFORMATION", "EN.A1.VOCAB.IDENTITY", "EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS"], order: 1,
  });
  const beQuestions = structuredA1Lesson({
    id: "a1-be-questions", moduleId: "english-a1-who-am-i", title: "I am / You are / Are you...?", summary: "Use am and are in simple identity statements and questions.", mission: "I can use am and are in simple statements and questions.", dialogue: "Leo: Are you from Santo Domingo?\nNia: No, I'm not. I'm from Santiago.\nLeo: Oh, you're from Santiago.", listeningPrompt: "Is Nia from Santo Domingo?", listeningOptions: ["No, she isn't.", "Yes, she is.", "She is a teacher."], listeningAnswer: "No, she isn't.", builder: ["Are", "you", "from", "Santiago?"], spokenPrompt: "Ask one ‘Are you...?’ question and answer it with Yes, I am or No, I'm not.", role: "a class partner", situation: "You are checking a simple identity detail.", goal: "Ask one Are you...? question and answer naturally.", openingLine: "Are you from Santo Domingo?", writingPrompt: "Write one ‘I am’ statement and one ‘Are you’ question about a practice profile.", competencies: ["EN.A1.GRAMMAR.SUBJECT_PRONOUNS", "EN.A1.GRAMMAR.BE_AFFIRMATIVE_NEGATIVE", "EN.A1.GRAMMAR.BE_QUESTIONS"], order: 2,
  });
  const occupations = structuredA1Lesson({
    id: "a1-student-worker", moduleId: "english-a1-people-around-me", title: "Student, teacher, worker", summary: "Share a simple study or work identity without forcing personal disclosure.", mission: "I can say if I am a student and identify a few common occupations.", dialogue: "Ana: Are you a student?\nMiguel: Yes, I am. I'm a design student.\nAna: I'm a teacher.", listeningPrompt: "What is Ana's job?", listeningOptions: ["Teacher", "Student", "Driver"], listeningAnswer: "Teacher", builder: ["I'm", "a", "student."], spokenPrompt: "Say one simple identity statement: ‘I'm a student,’ ‘I'm a teacher,’ or another practice identity.", role: "a community-class participant", situation: "You are introducing a simple study or work identity.", goal: "Ask and answer one student or job question respectfully.", openingLine: "Hi! Are you a student?", writingPrompt: "Write two short profile sentences with a name, country, and student or job identity. Practice details are fine.", competencies: ["EN.A1.VOCAB.IDENTITY", "EN.A1.SPEAK.INTRODUCE_SELF", "EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS"], order: 1,
  });
  const profile = structuredA1Lesson({
    id: "a1-personal-profile", moduleId: "english-a1-people-around-me", title: "A simple personal profile", summary: "Combine name, country, and a simple identity detail in speech and writing.", mission: "I can combine my name, country, and student or job information.", dialogue: "Profile: My name is Carla. I'm from Mexico. I'm a nurse.\nSam: Nice to meet you, Carla.\nCarla: Nice to meet you too.", listeningPrompt: "What is Carla's job?", listeningOptions: ["Nurse", "Teacher", "Designer"], listeningAnswer: "Nurse", builder: ["I'm", "from", "Mexico.", "I'm", "a", "nurse."], spokenPrompt: "Record a three-part profile: name, country, and one identity detail.", role: "a welcoming community member", situation: "You read and exchange short profiles before an activity.", goal: "Share a short profile and ask for one detail from the other person.", openingLine: "Hello! My name is Sam. I'm from Canada. I'm a student.", writingPrompt: "Write a three-sentence personal profile. Do not include contact details or anything you prefer to keep private.", competencies: ["EN.A1.READ.FAMILIAR_WORDS", "EN.A1.WRITE.BASIC_FORM", "EN.A1.CREATE.PERSONAL_INTRODUCTION"], order: 2,
  });
  const alphabet = structuredA1Lesson({
    id: "a1-spell-your-name", moduleId: "english-a1-spell-it", title: "The alphabet for real communication", summary: "Use English letter names to spell a name clearly.", mission: "I can recognize and say English letter names well enough to spell my name.", dialogue: "Kim: How do you spell your name?\nOmar: O-M-A-R.\nKim: Thank you. O-M-A-R.", listeningPrompt: "How does Omar spell his name?", listeningOptions: ["O-M-A-R", "A-M-O-R", "O-R-M-A"], listeningAnswer: "O-M-A-R", builder: ["How", "do", "you", "spell", "that?"], spokenPrompt: "Spell a first name slowly in English letter names. Use a practice name if needed.", role: "a registration helper", situation: "A name needs to be confirmed before a class activity.", goal: "Spell a name and confirm that you understood another name.", openingLine: "Hello. How do you spell your first name?", writingPrompt: "Write a name and spell it with hyphens, for example: A-N-A.", competencies: ["EN.A1.PHON.SOUND_SPELLING_AWARENESS", "EN.A1.LISTEN.PREDICTABLE_EXCHANGES", "EN.A1.SPEAK.ASK_PERSONAL_QUESTIONS"], order: 1,
  });
  const repair = structuredA1Lesson({
    id: "a1-ask-repeat", moduleId: "english-a1-spell-it", title: "Can you repeat that?", summary: "Use simple repair phrases when communication breaks down.", mission: "I can ask for repetition or spelling when I do not understand.", dialogue: "Tara: My name is Niamh.\nLuis: Sorry? Can you repeat that, please?\nTara: Niamh. N-I-A-M-H.\nLuis: Thank you.", listeningPrompt: "What does Luis ask Tara to do?", listeningOptions: ["Repeat her name", "Close the conversation", "Say her job"], listeningAnswer: "Repeat her name", builder: ["Can", "you", "repeat", "that,", "please?"], spokenPrompt: "Ask for repetition politely, then say ‘Thank you.’", role: "a patient classmate", situation: "You did not understand a name the first time.", goal: "Use one repair phrase and continue the exchange.", openingLine: "Hi! My name is Niamh.", writingPrompt: "Write a two-line repair exchange using ‘Sorry?’ or ‘Can you repeat that, please?’", competencies: ["EN.A1.CONV.REQUEST_CLARIFICATION", "EN.A1.STRAT.ASK_REPEAT", "EN.A1.PRAG.BASIC_POLITENESS"], order: 2,
  });
  const buildIntroduction = structuredA1Lesson({
    id: "a1-build-introduction", moduleId: "english-a1-real-introductions", title: "Build my introduction", summary: "Prepare an independent short introduction with optional personal details.", mission: "I can prepare a short introduction about myself.", dialogue: "Hello, I'm Elena. I'm from the Dominican Republic. I'm a student. Nice to meet you.", listeningPrompt: "Which detail is optional in the introduction?", listeningOptions: ["Student or job identity", "Greeting", "Name"], listeningAnswer: "Student or job identity", builder: ["Hello,", "I'm", "Elena.", "I'm", "from", "Mexico."], spokenPrompt: "Record a short introduction with a greeting, name, country, and optional study or work detail.", role: "a supportive preparation coach", situation: "You are preparing to meet a new learning group.", goal: "Give an independent introduction before asking for a small prompt if you need one.", openingLine: "Hi! Please introduce yourself in two or three short sentences.", writingPrompt: "Write your first independent introduction. Keep any personal details optional and safe to share.", competencies: ["EN.A1.SPEAK.INTRODUCE_SELF", "EN.A1.CREATE.PERSONAL_INTRODUCTION", "EN.A1.PRAG.BASIC_POLITENESS"], order: 1, roleplayTurns: [3, 6],
  });
  const introductionConversation = structuredA1Lesson({
    id: "a1-introduction-conversation", moduleId: "english-a1-real-introductions", title: "Introduction conversation", summary: "Complete a supported A1 introduction conversation and ask questions, not only answer them.", mission: "I can complete a short introduction conversation with another person.", dialogue: "Alex: Hi, I'm Alex. What's your name?\nMia: I'm Mia. Nice to meet you. Where are you from?\nAlex: I'm from Canada. And you?\nMia: I'm from the Dominican Republic.", listeningPrompt: "What question does Mia ask Alex?", listeningOptions: ["Where are you from?", "What is your phone number?", "What do you eat?"], listeningAnswer: "Where are you from?", builder: ["Where", "are", "you", "from?"], spokenPrompt: "Give a short introduction, ask two personal-information questions, and close politely.", role: "another new student", situation: "You meet before a class or activity.", goal: "Greet, exchange names and countries, share one identity detail, ask at least two questions, and close politely.", openingLine: "Hi! I'm Alex. Nice to meet you. What's your name?", writingPrompt: "Write a six-line supported introduction conversation. Include greeting, names, countries, two questions, and a closing.", competencies: ["EN.A1.CONV.PERSONAL_INTRODUCTION", "EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS", "EN.A1.PRAG.TURN_TAKING_BASIC"], order: 2, roleplayTurns: [6, 10],
  });
  const finalArtifact = structuredA1Lesson({
    id: "a1-module-one-create-apply", moduleId: "english-a1-real-introductions", title: "Create & Apply: My introduction", summary: "Create a short introduction artifact and retrieve earlier language without a visible model.", mission: "I can introduce myself clearly to a new class or community.", dialogue: "Hello, I'm Paulo. I'm from Brazil. I'm a teacher. Nice to meet you.\nPartner: Nice to meet you, Paulo. Can you spell your name?\nPaulo: P-A-U-L-O.", listeningPrompt: "What does the partner ask Paulo to do?", listeningOptions: ["Spell his name", "Name his teacher", "Repeat his country"], listeningAnswer: "Spell his name", builder: ["Nice", "to", "meet", "you."], spokenPrompt: "Record a 45–90 second introduction. Include a greeting, name, country, one optional identity detail, one question, and a polite closing.", role: "a new learning-community member", situation: "You are making a first introduction for a class community.", goal: "Complete a 45–90 second supported introduction exchange, use a repair phrase if needed, and close politely.", openingLine: "Welcome! Please introduce yourself. I may ask you to repeat or spell one detail.", writingPrompt: "Create a short personal introduction artifact: a written profile plus a 45–90 second recording when available. Include only details you are comfortable sharing.", competencies: ["EN.A1.CREATE.PERSONAL_INTRODUCTION", "EN.A1.ONLINE.SHORT_SOCIAL_EXCHANGE", "EN.A1.STRAT.ASK_REPEAT", "EN.A1.CONV.PERSONAL_INTRODUCTION"], order: 3, roleplayTurns: [6, 10], spokenDuration: { minimumSeconds: 45, maximumSeconds: 90 },
  });
  const entryLesson: Lesson = { id: LESSON_ID, moduleId: MODULE_ID, title: "Greetings that work", summary: "Greet someone, say your name, listen to a first meeting, speak, interact, and create a short introduction.", contentBlocks: lessonContentBlocks(), order: 1, estimatedMinutes: 23 };
  const modules: Module[] = [
    { id: MODULE_ID, courseId: COURSE_ID, title: "Meeting people", description: "Greet people, exchange names, and close a short conversation.", order: 1, lessonIds: [LESSON_ID, unitOneNames.id] },
    { id: "english-a1-who-am-i", courseId: COURSE_ID, title: "Who am I?", description: "Share country and identity details with useful am/are patterns.", order: 2, lessonIds: [countries.id, beQuestions.id] },
    { id: "english-a1-people-around-me", courseId: COURSE_ID, title: "People around me", description: "Talk about simple study, work, and profile information.", order: 3, lessonIds: [occupations.id, profile.id] },
    { id: "english-a1-spell-it", courseId: COURSE_ID, title: "Spell it, please", description: "Spell key information and repair a communication breakdown.", order: 4, lessonIds: [alphabet.id, repair.id] },
    { id: "english-a1-real-introductions", courseId: COURSE_ID, title: "Real-life introductions", description: "Integrate Module 1 language in a short conversation and introduction artifact.", order: 5, lessonIds: [buildIntroduction.id, introductionConversation.id, finalArtifact.id] },
  ];
  const lessons = [entryLesson, unitOneNames, countries, beQuestions, occupations, profile, alphabet, repair, buildIntroduction, introductionConversation, finalArtifact];
  const course: Course = { id: COURSE_ID, orgId: ORGANIZATION_ID, authorId: "lurexa-system", title: "English A1 Foundations", description: "Module 1: Hello, This Is Me — a structured five-unit foundation for real introductions.", subject: "english", status: "published", isTemplate: false, moduleIds: modules.map((module) => module.id), createdAt: now, updatedAt: now };
  return { course, modules, lessons, entryLesson };
}

function a2StarterCourse(now: string): { course: Course; module: Module; lesson: Lesson; entryLesson: Lesson } {
  const lesson: Lesson = {
    id: A2_LESSON_ID,
    moduleId: A2_MODULE_ID,
    title: "Make a simple plan",
    summary: "Invite someone, suggest a time, and respond to a plan.",
    contentBlocks: [
      { id: "a2-plan-text", type: "text", order: 1, data: { text: "Mission: make a simple plan with a friend.\n\nSofía: Are you free on Saturday?\nMateo: Yes, I am. What are you going to do?\nSofía: I’m going to visit the Malecón. Do you want to come?\nMateo: Sure! Let’s meet at three.\n\nUse Are you free…? to invite someone. Use going to for a plan." } },
      { id: "a2-plan-response", type: "interactive", order: 2, data: { activity: { schemaVersion: "1", type: "single_choice", stage: "GUIDED_PRACTICE", title: "Respond to an invitation", instructions: "Choose the most natural response.", prompt: "A friend says: “Do you want to come to the park?”", options: ["Sure, I’d like to.", "I am going yesterday.", "Nice to meet Saturday."], correctAnswers: ["Sure, I’d like to."], explanation: "Sure, I’d like to is a natural way to accept an invitation.", competencyIds: ["EN.A2.SPEAK.MAKE_PLAN"], estimatedMinutes: 2, required: true } } },
      { id: "a2-plan-builder", type: "interactive", order: 3, data: { activity: { schemaVersion: "1", type: "sentence_builder", stage: "GUIDED_PRACTICE", title: "Build a plan", instructions: "Select the words in the correct order.", prompt: "Make a sentence about your plan.", options: ["I’m", "going", "to", "call", "my friend."], correctAnswers: ["I’m", "going", "to", "call", "my friend."], explanation: "Use I’m going to + verb to talk about a plan.", competencyIds: ["EN.A2.SPEAK.MAKE_PLAN"], estimatedMinutes: 2, required: true } } },
      { id: "a2-plan-check", type: "quiz_embed", order: 4, data: { prompt: "Which question asks about a future plan?", options: ["What are you going to do?", "Where you yesterday?", "Nice to meet plan."], correctAnswer: "What are you going to do?", explanation: "What are you going to do? asks about a future plan." } },
      { id: "a2-plan-create-apply", type: "interactive", order: 5, data: { activity: { schemaVersion: "1", type: "short_response", stage: "CREATE_APPLY", title: "Invite a friend", instructions: "Write two or three sentences. Invite someone, say what you are going to do, and suggest a time.", prompt: "Write a short message to make a plan with a friend.", explanation: "You created a practical invitation. Read it aloud to rehearse the conversation.", competencyIds: ["EN.A2.SPEAK.MAKE_PLAN", "EN.A2.WRITE.PLAN_ARRANGEMENT"], estimatedMinutes: 3, required: true } } },
    ],
    order: 1,
    estimatedMinutes: 12,
  };
  const module: Module = { id: A2_MODULE_ID, courseId: A2_COURSE_ID, title: "Everyday conversations", description: "Make plans and respond naturally in common situations.", order: 1, lessonIds: [A2_LESSON_ID] };
  const course: Course = { id: A2_COURSE_ID, orgId: ORGANIZATION_ID, authorId: "lurexa-system", title: "English A2 Everyday Conversations", description: "A practical starter path for learners with early English foundations.", subject: "english", status: "published", isTemplate: false, moduleIds: [A2_MODULE_ID], createdAt: now, updatedAt: now };
  return { course, module, lesson, entryLesson: lesson };
}

function scorePlacement(answers: PlacementAnswer[] | undefined): { level: "A1" | "A2"; confidence: "low"; rationale: string; score: number } {
  if (!answers) return { level: "A1", confidence: "low", score: 0, rationale: "You chose the beginner path, so we are starting with a practical A1 introduction lesson. This is not a formal CEFR placement result." };
  const expected: PlacementAnswer[] = ["nice_to_meet_you", "i_live_in", "are", "going_to"];
  const score = answers.filter((answer, index) => answer === expected[index]).length;
  if (score >= 3) return { level: "A2", confidence: "low", score, rationale: "Your short start check suggests that an early A2 conversation lesson is a useful next step. This is a provisional recommendation, not a CEFR certification; speaking and listening evidence can refine it later." };
  return { level: "A1", confidence: "low", score, rationale: "Your short start check points to the A1 foundation lesson as the most useful starting step. This is a provisional recommendation, not a CEFR placement result." };
}

/**
 * Creates the smallest viable self-paced entry path. A1 is a starter-course
 * recommendation for the learner-selected beginner path, not a CEFR placement
 * result or proficiency inference.
 */
export async function onboardSelfPacedLearner(input: {
  learnerId: string;
  email: string | null;
  goal: SelfPacedGoal;
  placementAnswers?: PlacementAnswer[];
}): Promise<SelfPacedOnboardingResult> {
  const database = getServerFirestore();
  const evidenceRepository = new FirestoreLearningEvidenceRepository();
  const now = new Date().toISOString();
  const a1 = a1StarterCourse(now);
  const a2 = a2StarterCourse(now);
  const recommendation = scorePlacement(input.placementAnswers);
  const selected = recommendation.level === "A2" ? a2 : a1;

  const organizationReference = database.collection("organizations").doc(ORGANIZATION_ID);
  const membershipReference = organizationReference.collection("members").doc(input.learnerId);
  const userMembershipReference = database.collection("user-memberships").doc(input.learnerId).collection("organizations").doc(ORGANIZATION_ID);
  const profileReference = database.collection("learner-profiles").doc(input.learnerId);
  const goalEvidenceId = database.collection("learning-evidence").doc().id;
  const placementEvidenceId = database.collection("learning-evidence").doc().id;

  await Promise.all([
    organizationReference.set({
      id: ORGANIZATION_ID,
      name: "Lurexa Self-Paced Learning",
      slug: "lurexa-self-paced",
      ownerId: "lurexa-system",
      plan: "platform",
      createdAt: now,
      updatedAt: now,
    }, { merge: true }),
    database.collection("courses").doc(a1.course.id).set(a1.course, { merge: true }),
    ...a1.modules.map((module) => database.collection("modules").doc(module.id).set(module, { merge: true })),
    ...a1.lessons.map((lesson) => database.collection("lessons").doc(lesson.id).set(lesson, { merge: true })),
    database.collection("courses").doc(a2.course.id).set(a2.course, { merge: true }),
    database.collection("modules").doc(a2.module.id).set(a2.module, { merge: true }),
    database.collection("lessons").doc(a2.lesson.id).set(a2.lesson, { merge: true }),
    membershipReference.set({
      userId: input.learnerId,
      orgId: ORGANIZATION_ID,
      role: "student",
      joinedAt: now,
      source: "self-paced-onboarding",
    }, { merge: true }),
    userMembershipReference.set({
      userId: input.learnerId,
      orgId: ORGANIZATION_ID,
      role: "student",
      joinedAt: now,
      source: "self-paced-onboarding",
    }, { merge: true }),
    profileReference.set({
      learnerId: input.learnerId,
      goals: [input.goal],
      onboarding: {
        path: input.placementAnswers ? "self-paced-start-check" : "self-paced-beginner",
        completedAt: now,
        recommendation: `${recommendation.level} starter course`,
        recommendedCourseId: selected.course.id,
        confidence: recommendation.confidence,
      },
      updatedAt: now,
    }, { merge: true }),
    evidenceRepository.append({
      contractVersion: "1",
      id: goalEvidenceId,
      learnerId: input.learnerId,
      organizationId: ORGANIZATION_ID,
      source: {
        product: "learn",
        courseId: selected.course.id,
        lessonId: selected.entryLesson.id,
      },
      type: "goal_update",
      observedAt: now,
      dataClassification: "sensitive",
      payload: {
        goal: input.goal,
        startingPath: input.placementAnswers ? "self-paced-start-check" : "self-paced-beginner",
      },
      provenance: {
        method: "learner_reported",
        actorId: input.learnerId,
        confidence: 1,
      },
    }),
    ...(input.placementAnswers ? [evidenceRepository.append({
      contractVersion: "1",
      id: placementEvidenceId,
      learnerId: input.learnerId,
      organizationId: ORGANIZATION_ID,
      source: { product: "learn", courseId: selected.course.id, lessonId: selected.entryLesson.id, activityId: "self-paced-start-check" },
      type: "assessment_result",
      observedAt: now,
      dataClassification: "sensitive",
      payload: { answers: input.placementAnswers, score: recommendation.score, recommendation: recommendation.level, confidence: recommendation.confidence, scope: "short_start_check" },
      provenance: { method: "system_observed", actorId: input.learnerId, confidence: 0.25 },
    })] : []),
  ]);

  try {
    await refreshLearnerIntelligence({
      learnerId: input.learnerId,
      organizationId: ORGANIZATION_ID,
      requestedDomains: ["goal"],
    });
  } catch (error) {
    console.error("Learner goal interpretation failed after onboarding.", error);
  }

  return {
    courseId: selected.course.id,
    lessonId: selected.entryLesson.id,
    recommendation: {
      level: recommendation.level,
      confidence: recommendation.confidence,
      rationale: recommendation.rationale,
    },
  };
}
