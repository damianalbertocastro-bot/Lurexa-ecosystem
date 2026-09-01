import type { ContentBlock, Course, Lesson, Module } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";

const ORGANIZATION_ID = "lurexa-self-paced";
export const A1_PRODUCTION_COURSE_ID = "english-a1-foundations";
const MODULE_1_ID = "english-a1-introductions";

export interface A1ProductionCurriculumBundle {
  course: Course;
  modules: Module[];
  lessons: Lesson[];
}

type A1LessonSpec = {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  mission: string;
  modelText: string;
  competencyIds: string[];
  productionPrompt: string;
  production: "recorded_speaking" | "ai_roleplay";
  role?: string;
  situation?: string;
};

type A1ModuleSpec = {
  id: string;
  order: number;
  title: string;
  description: string;
  lessons: A1LessonSpec[];
};

function activityBlock(spec: A1LessonSpec, order: number): ContentBlock {
  return {
    id: `${spec.id}-create-apply`,
    type: "interactive",
    order,
    data: {
      activity: {
        schemaVersion: "1",
        type: "short_response",
        stage: "CREATE_APPLY",
        title: "Create and apply",
        instructions: "Respond in your own words. Use the lesson language to complete the communication goal.",
        prompt: spec.productionPrompt,
        explanation: "Your response is saved as productive learning evidence. Completion alone is not a mastery decision.",
        competencyIds: spec.competencyIds,
        estimatedMinutes: 4,
        required: true,
      },
    },
  };
}

function listeningBlock(spec: A1LessonSpec): ContentBlock {
  return {
    id: `${spec.id}-model-listening`,
    type: "interactive",
    order: 2,
    data: {
      capability: {
        schemaVersion: "1",
        id: `${spec.id}-listening-capability`,
        kind: "model_listening",
        stage: "CONTEXTUAL_INPUT",
        title: "Listen for meaning",
        instructions: "Listen for the communication goal first. Then listen again and notice the useful chunks.",
        competencyIds: spec.competencyIds,
        estimatedMinutes: 3,
        required: true,
        modelText: spec.modelText,
        locale: "en-US",
        playbackGoal: "meaning",
        transcriptVisibility: "hidden",
      },
    },
  };
}

function grammarBlock(spec: A1LessonSpec): ContentBlock {
  const grammarMap: Record<string, { concept: string; formula: string; explanation: string; affirmative: string; negative: string; question: string; l1Tip: string; examples: string[] }> = {
    "a1-m2-u1-l1-phone-details": {
      concept: "Verb 'To Be' & Personal Identifiers (Phone, Age, Name)",
      formula: "[Subject] + [Verb 'to be' (am/is/are)] + [Number / Personal Detail]",
      explanation: "Use the verb 'to be' to share personal contact details and numbers. Group phone numbers into 3-digit and 4-digit rhythm chunks.",
      affirmative: "My phone number is 809-555-2480, and I am twenty-two years old.",
      negative: "My area code is not 829; it is 809.",
      question: "What is your phone number? / How old are you?",
      l1Tip: "In Spanish, we say 'Tengo 22 años' (using tener). In English, always use 'to be' ('I am 22 years old', never *'I have 22 years'*).",
      examples: ["My name is Rosa and I'm twenty-two.", "Her phone number is 809-555-1234."],
    },
    "a1-m2-u1-l2-ages-addresses": {
      concept: "Addresses & Prepositions of Location ('on' for streets, 'at' for numbers)",
      formula: "[Subject] + [live on + Street Name] OR [live at + Building Number + Street Name]",
      explanation: "Use 'on' when stating the street name alone (on Duarte Street), and 'at' when stating the full specific street address with building number (at 12 Duarte Street).",
      affirmative: "I live on Duarte Street, and my apartment is number twelve.",
      negative: "I do not live in Santiago; I live in Santo Domingo.",
      question: "Where do you live? / What is your exact address?",
      l1Tip: "Spanish uses 'en' for both ('vivo en la calle Duarte'). In English, use 'on' for street names and 'at' for numbered addresses.",
      examples: ["I live on Mella Avenue.", "David lives at 45 Independencia Street."],
    },
    "a1-m2-u2-l1-days-months-dates": {
      concept: "Prepositions of Time with Days, Months & Ordinal Dates",
      formula: "on + [Day / Specific Date] | in + [Month / Year]",
      explanation: "Use 'on' for specific calendar days and full dates ('on Monday', 'on March 15th'). Use 'in' for months without a specific day ('in March').",
      affirmative: "My birthday is on March fifteenth, and the class is on Monday.",
      negative: "The exam is not in April; it is on March twentieth.",
      question: "When is your birthday? / What day is the meeting?",
      l1Tip: "Never say *'in Monday'* (translating 'en lunes'). Always use 'on Monday' and 'on Friday'.",
      examples: ["The conference is on Friday, October 12th.", "My sister was born in August."],
    },
    "a1-m2-u2-l2-my-week": {
      concept: "Weekly Schedules & Time Markers ('at + time', 'on + days')",
      formula: "[Subject] + [Action Verb] + [at + time] + [on + day]",
      explanation: "Combine habitual routine actions with time prepositions to communicate clear weekly schedules.",
      affirmative: "I work on Monday, and English class is at six on Wednesday.",
      negative: "I am not free on weekdays, but I'm free on Saturday.",
      question: "Are you free on Wednesday evening? / When do you study?",
      l1Tip: "When listing days of the week in English, always capitalize them (Monday, Wednesday, Saturday).",
      examples: ["I study English at six on Tuesday and Thursday.", "We are free on Sunday afternoon."],
    },
    "a1-m2-u3-l1-what-time": {
      concept: "Asking & Telling Clock Time ('What time is it?', 'It's at...')",
      formula: "Question: What time + [does / is] + [Subject]? | Answer: It's at + [Time]",
      explanation: "To ask about schedules, use 'What time...?' followed by the auxiliary verb. Use 'It's at' to indicate departure or start times.",
      affirmative: "The bus leaves at seven thirty in the morning.",
      negative: "The flight is not at seven; it departs at eight fifteen.",
      question: "What time does the bus arrive? / Could you repeat the departure time?",
      l1Tip: "Spanish speakers often drop the dummy subject 'it' (*'Is at seven'* ❌). In English, 'It' is required: 'It is at seven thirty.'",
      examples: ["What time is the meeting? It's at two thirty.", "The store opens at eight in the morning."],
    },
    "a1-m2-u3-l2-how-much-when": {
      concept: "Transactional Price Inquiries ('How much is...?') & Time Arrangements",
      formula: "How much is + [Singular Item]? | How much are + [Plural Items]? | Let's meet at + [Time]",
      explanation: "Use 'How much is...?' for singular items or prices, and 'Let's meet at...' to confirm mutual arrangements.",
      affirmative: "The ticket is five hundred pesos, and the movie starts at eight.",
      negative: "The return fare is not included in the single ticket price.",
      question: "How much are these two tickets? / Can we meet at seven thirty?",
      l1Tip: "Use 'How much' for prices (uncountable money), never *'How many is the ticket'*. For plural items, use 'How much are the tickets?'.",
      examples: ["How much is the bus ticket to Puerto Plata?", "Let's meet at the entrance at seven thirty."],
    },
  };

  const lookup = grammarMap[spec.id];
  const conceptTitle = lookup?.concept ?? `Language Structure: ${spec.title}`;
  const formula = lookup?.formula ?? `[Subject] + [Verb] + [Key Structure]`;
  const explanation = lookup?.explanation ?? `Practice this key grammatical structure to achieve the lesson mission: "${spec.mission}".`;
  const affirmative = lookup?.affirmative ?? spec.modelText;
  const negative = lookup?.negative ?? `Ensure correct negation without double negative markers.`;
  const question = lookup?.question ?? `Use standard question word order to ask for information.`;
  const l1Tip = lookup?.l1Tip ?? `Pay close attention to English subject pronouns and word order to avoid direct translation errors from Spanish.`;
  const examples = lookup?.examples ?? [spec.modelText];

  const grammarText =
    `### 📖 Grammar Focus: ${conceptTitle}\n\n` +
    `**Structural Formula:**\n\`${formula}\`\n\n` +
    `**Explanation & Usage:**\n${explanation}\n\n` +
    `**Forms Breakdown:**\n` +
    `• *Affirmative:* ${affirmative}\n` +
    `• *Negative:* ${negative}\n` +
    `• *Question:* ${question}\n\n` +
    `**💡 Dominican & Spanish Transfer Tip:**\n${l1Tip}\n\n` +
    `**Practical Examples in Context:**\n` +
    examples.map((ex) => `• "${ex}"`).join("\n");

  return {
    id: `${spec.id}-grammar-section`,
    type: "text",
    order: 3,
    data: {
      category: "grammar",
      text: grammarText,
    },
  };
}

function listeningCheckBlock(spec: A1LessonSpec): ContentBlock {
  const correctAnswer = spec.modelText;
  const listeningCompetencyIds = spec.competencyIds.filter((id) => id.startsWith("EN.A1.LISTEN."));
  const distractor = spec.modelText
    .replace(/\b(I'm|I am)\b/i, "She is")
    .replace(/\b(twenty-two|two|three|four|five|six|seven|eight|nine|ten)\b/i, "twenty-three");
  return {
    id: `${spec.id}-listening-check`,
    type: "interactive",
    order: 4,
    data: {
      activity: {
        schemaVersion: "1",
        type: "single_choice",
        stage: "COMPREHENSION",
        title: "Check what you heard",
        instructions: "Listen first. Then choose the sentence that matches the audio.",
        prompt: "Which sentence did you hear?",
        options: [correctAnswer, distractor === correctAnswer ? `Not: ${correctAnswer}` : distractor],
        correctAnswers: [correctAnswer],
        explanation: "Use the audio to check the key words and details.",
        competencyIds: listeningCompetencyIds.length ? listeningCompetencyIds : ["EN.A1.LISTEN.PREDICTABLE_EXCHANGES"],
        estimatedMinutes: 2,
        required: true,
      },
    },
  };
}

function functionalCapstoneReadingBlock(spec: A1LessonSpec): ContentBlock | null {
  if (spec.id !== "a1-m8-u3-l3-capstone") return null;
  return {
    id: `${spec.id}-functional-reading`,
    type: "interactive",
    order: 7,
    data: {
      activity: {
        schemaVersion: "1",
        type: "single_choice",
        stage: "COMPREHENSION",
        title: "Read a practical notice",
        instructions: "Read the notice and choose the correct detail.",
        prompt: "NOTICE: Your appointment is Friday at 4:30. The office is next to the pharmacy. What time is the appointment?",
        options: ["Friday at 4:30", "Friday at 3:30"],
        correctAnswers: ["Friday at 4:30"],
        explanation: "Find the day and time in the notice before you answer.",
        competencyIds: ["EN.A1.READ.FUNCTIONAL_INFORMATION", "EN.A1.ONLINE.SHARE_BASIC_INFORMATION"],
        estimatedMinutes: 2,
        required: true,
      },
    },
  };
}

function productionCapabilityBlock(spec: A1LessonSpec): ContentBlock {
  if (spec.production === "ai_roleplay") {
    return {
      id: `${spec.id}-roleplay`,
      type: "interactive",
      order: 5,
      data: {
        capability: {
          schemaVersion: "1",
          id: `${spec.id}-roleplay-capability`,
          kind: "ai_roleplay",
          stage: "CONVERSATION",
          title: "Use it in a short conversation",
          instructions: "Complete the goal without memorizing a full script. Ask for repetition if you need it.",
          competencyIds: spec.competencyIds,
          estimatedMinutes: 5,
          required: true,
          cefr: "A1",
          language: "English",
          scenario: {
            role: spec.role ?? "a friendly conversation partner",
            situation: spec.situation ?? spec.mission,
            learnerGoal: spec.productionPrompt,
            openingLine: spec.modelText.split(/(?<=[.!?])\s+/)[0] ?? "Hello!",
            minimumTurns: 2,
            maximumTurns: 6,
          },
          correctionPolicy: "post_turn_salient",
        },
      },
    };
  }

  return {
    id: `${spec.id}-recorded-speaking`,
    type: "interactive",
    order: 5,
    data: {
      capability: {
        schemaVersion: "1",
        id: `${spec.id}-recorded-speaking-capability`,
        kind: "recorded_speaking",
        stage: "CREATE_APPLY",
        title: "Say it independently",
        instructions: "Record one clear A1 response. Focus on intelligibility and meaning, not accent imitation.",
        competencyIds: spec.competencyIds,
        estimatedMinutes: 4,
        required: true,
        prompt: spec.productionPrompt,
        locale: "en-US",
        minimumSeconds: 3,
        maximumSeconds: 45,
        evidencePurpose: "performance",
      },
    },
  };
}

function buildLesson(spec: A1LessonSpec): Lesson {
  return {
    id: spec.id,
    moduleId: spec.moduleId,
    title: spec.title,
    summary: spec.mission,
    order: spec.order,
    estimatedMinutes: 18,
    contentBlocks: [
      {
        id: `${spec.id}-mission`,
        type: "text",
        order: 1,
        data: { text: `Mission: ${spec.mission}\n\nYou will listen, learn the grammar structure, produce language, and use it for a real A1 communication goal.` },
      },
      listeningBlock(spec),
      grammarBlock(spec),
      listeningCheckBlock(spec),
      productionCapabilityBlock(spec),
      activityBlock(spec, 6),
      ...(functionalCapstoneReadingBlock(spec) ? [functionalCapstoneReadingBlock(spec)!] : []),
    ],
  };
}

const MODULE_SPECS: A1ModuleSpec[] = [
  {
    id: "english-a1-m2-numbers",
    order: 2,
    title: "My World in Numbers",
    description: "Exchange numbers, dates, times, prices and simple schedule information.",
    lessons: [
      { id: "a1-m2-u1-l1-phone-details", moduleId: "english-a1-m2-numbers", order: 1, title: "Phone Numbers and Personal Details", mission: "Understand and say phone numbers, ages and basic contact details.", modelText: "My name is Rosa. My phone number is 809 555 2480. I'm twenty-two.", competencyIds: ["EN.A1.LISTEN.KEY_DETAILS", "EN.A1.VOCAB.NUMBERS_TIME_DATES", "EN.A1.SPEAK.ASK_PERSONAL_QUESTIONS"], productionPrompt: "Say your name and give a safe example phone number and age, then ask the other person for one detail.", production: "ai_roleplay", role: "a new classmate", situation: "You exchange basic contact information." },
      { id: "a1-m2-u1-l2-ages-addresses", moduleId: "english-a1-m2-numbers", order: 2, title: "Ages, Addresses and Identifiers", mission: "Exchange age and simple location or identifying information.", modelText: "I'm thirty. I live on Duarte Street. My apartment is number twelve.", competencyIds: ["EN.A1.LISTEN.PERSONAL_INFORMATION", "EN.A1.MED.RELAY_PERSONAL_DETAIL", "EN.A1.ONLINE.SHARE_BASIC_INFORMATION"], productionPrompt: "Give two simple personal details and relay one detail you heard about another person.", production: "recorded_speaking" },
      { id: "a1-m2-u2-l1-days-months-dates", moduleId: "english-a1-m2-numbers", order: 3, title: "Days, Months and Dates", mission: "Understand and communicate common dates.", modelText: "My birthday is on March fifteenth. The class is on Monday, April eighth.", competencyIds: ["EN.A1.LISTEN.KEY_DETAILS", "EN.A1.VOCAB.NUMBERS_TIME_DATES", "EN.A1.PHON.HIGH_VALUE_CONTRASTS"], productionPrompt: "Say one important date and one day of the week clearly.", production: "recorded_speaking" },
      { id: "a1-m2-u2-l2-my-week", moduleId: "english-a1-m2-numbers", order: 4, title: "My Week", mission: "Say when simple activities happen.", modelText: "I work on Monday. English class is at six on Wednesday. I'm free on Saturday.", competencyIds: ["EN.A1.VOCAB.NUMBERS_TIME_DATES", "EN.A1.GRAMMAR.PREPOSITIONS_BASIC", "EN.A1.ONLINE.SHARE_BASIC_INFORMATION"], productionPrompt: "Describe three times or days in your week and share one time when you are free.", production: "recorded_speaking" },
      { id: "a1-m2-u3-l1-what-time", moduleId: "english-a1-m2-numbers", order: 5, title: "What Time Is It?", mission: "Understand and communicate basic clock time.", modelText: "The bus leaves at seven thirty. Sorry, did you say seven thirty? Yes, seven thirty.", competencyIds: ["EN.A1.LISTEN.KEY_DETAILS", "EN.A1.CONV.REQUEST_CLARIFICATION", "EN.A1.STRAT.ASK_REPEAT"], productionPrompt: "Ask for a time, confirm what you heard, and repeat the correct time.", production: "ai_roleplay", role: "a bus station assistant", situation: "You need to confirm a departure time." },
      { id: "a1-m2-u3-l2-how-much-when", moduleId: "english-a1-m2-numbers", order: 6, title: "How Much? When?", mission: "Combine price and time information in a predictable transaction or arrangement.", modelText: "The ticket is five hundred pesos. The movie starts at eight. Let's meet at seven thirty.", competencyIds: ["EN.A1.SPEAK.BASIC_TRANSACTION", "EN.A1.LISTEN.KEY_DETAILS", "EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS"], productionPrompt: "Ask about a price and time, then confirm one simple arrangement.", production: "ai_roleplay", role: "a ticket seller", situation: "You ask for a price and time and make a simple plan." },
    ],
  },
  {
    id: "english-a1-m3-people",
    order: 3,
    title: "The People Around Me",
    description: "Identify, describe and introduce family, friends and familiar people.",
    lessons: [
      { id: "a1-m3-u1-l1-who-is-this", moduleId: "english-a1-m3-people", order: 1, title: "Who Is This?", mission: "Identify familiar people and relationships.", modelText: "This is my sister, Laura. She is twenty-four. She is a student.", competencyIds: ["EN.A1.LISTEN.PERSONAL_INFORMATION", "EN.A1.VOCAB.FAMILY_PEOPLE", "EN.A1.SPEAK.INTRODUCE_OTHER"], productionPrompt: "Introduce one familiar person and say the relationship and one detail.", production: "recorded_speaking" },
      { id: "a1-m3-u1-l2-my-family", moduleId: "english-a1-m3-people", order: 2, title: "My Family, My People", mission: "Introduce one or more people who are important to you.", modelText: "This is my friend Miguel. He's from Santiago. He's funny and kind.", competencyIds: ["EN.A1.SPEAK.INTRODUCE_OTHER", "EN.A1.WRITE.SHORT_DESCRIPTION", "EN.A1.PRAG.TURN_TAKING_BASIC"], productionPrompt: "Introduce someone important to you and answer one follow-up question.", production: "ai_roleplay", role: "a friendly classmate", situation: "You talk about people who are important to you." },
      { id: "a1-m3-u2-l1-describing-people", moduleId: "english-a1-m3-people", order: 3, title: "What Are They Like?", mission: "Use basic descriptive language for familiar people.", modelText: "Ana is tall. She has short hair. She is friendly and quiet.", competencyIds: ["EN.A1.READ.SHORT_DESCRIPTIONS", "EN.A1.SPEAK.DESCRIBE_PERSON", "EN.A1.VOCAB.FAMILY_PEOPLE"], productionPrompt: "Describe one person in three or four simple sentences.", production: "recorded_speaking" },
      { id: "a1-m3-u2-l2-find-person", moduleId: "english-a1-m3-people", order: 4, title: "Find the Person", mission: "Use description and clarification to identify a person.", modelText: "I'm looking for Daniel. He's tall and he has glasses. Sorry, glasses? Yes, glasses.", competencyIds: ["EN.A1.SPEAK.DESCRIBE_PERSON", "EN.A1.CONV.REQUEST_CLARIFICATION", "EN.A1.PHON.FINAL_CONSONANTS"], productionPrompt: "Describe a person and respond when your partner asks for clarification.", production: "ai_roleplay", role: "someone helping you find a person", situation: "You identify someone from a simple description." },
      { id: "a1-m3-u3-l1-people-i-know", moduleId: "english-a1-m3-people", order: 5, title: "People I Know", mission: "Talk about simple roles and relationships in your school, work or community.", modelText: "Mr. Pérez is my teacher. Carla is my coworker. Luis is my neighbor.", competencyIds: ["EN.A1.SPEAK.INTRODUCE_OTHER", "EN.A1.LISTEN.PERSONAL_INFORMATION", "EN.A1.VOCAB.FAMILY_PEOPLE"], productionPrompt: "Name two people you know and explain their role or relationship to you.", production: "recorded_speaking" },
      { id: "a1-m3-u3-l2-introduce-someone", moduleId: "english-a1-m3-people", order: 6, title: "Introduce Someone", mission: "Introduce a familiar person to someone else and respond to follow-up questions.", modelText: "Maria, this is my friend Joel. Joel, this is Maria. Nice to meet you both.", competencyIds: ["EN.A1.SPEAK.INTRODUCE_OTHER", "EN.A1.CONV.SHORT_SUPPORTED_CONVERSATION", "EN.A1.PRAG.BASIC_POLITENESS"], productionPrompt: "Introduce one person to another and keep the exchange going for a few turns.", production: "ai_roleplay", role: "a person meeting your friend", situation: "You introduce two people and support a short first meeting." },
    ],
  },
  {
    id: "english-a1-m4-routines",
    order: 4,
    title: "My Everyday Life",
    description: "Describe routines, ask about daily activities and understand simple schedules.",
    lessons: [
      { id: "a1-m4-u1-l1-everyday-actions", moduleId: "english-a1-m4-routines", order: 1, title: "Everyday Actions", mission: "Understand and use core routine verbs and chunks.", modelText: "I wake up at six. I eat breakfast. I go to work at eight.", competencyIds: ["EN.A1.VOCAB.DAILY_ACTIVITIES", "EN.A1.SPEAK.DESCRIBE_ROUTINE", "EN.A1.LISTEN.PREDICTABLE_EXCHANGES"], productionPrompt: "Say three things you do on a normal day.", production: "recorded_speaking" },
      { id: "a1-m4-u1-l2-morning-night", moduleId: "english-a1-m4-routines", order: 2, title: "From Morning to Night", mission: "Produce a simple ordered routine.", modelText: "First I wake up. Then I get ready. After work, I eat dinner and relax.", competencyIds: ["EN.A1.SPEAK.DESCRIBE_ROUTINE", "EN.A1.WRITE.SIMPLE_ROUTINE", "EN.A1.CREATE.DAILY_ROUTINE"], productionPrompt: "Describe your routine from morning to night in four to six simple sentences.", production: "recorded_speaking" },
      { id: "a1-m4-u2-l1-routine-questions", moduleId: "english-a1-m4-routines", order: 3, title: "What Do You Do Every Day?", mission: "Ask and answer present-simple routine questions.", modelText: "What time do you start work? I start at nine. What do you do after work? I go home.", competencyIds: ["EN.A1.GRAMMAR.PRESENT_SIMPLE_QUESTIONS", "EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS", "EN.A1.SPEAK.DESCRIBE_ROUTINE"], productionPrompt: "Ask two routine questions and answer your partner's questions.", production: "ai_roleplay", role: "a classmate comparing routines", situation: "You interview each other about daily routines." },
      { id: "a1-m4-u2-l2-third-person", moduleId: "english-a1-m4-routines", order: 4, title: "He or She Does…", mission: "Report a familiar person's routine.", modelText: "My mother works at a hospital. She starts at eight and finishes at four.", competencyIds: ["EN.A1.GRAMMAR.PRESENT_SIMPLE", "EN.A1.PHON.FINAL_CONSONANTS", "EN.A1.SPEAK.DESCRIBE_ROUTINE"], productionPrompt: "Describe another person's routine and make the final verb endings clear enough to understand.", production: "recorded_speaking" },
      { id: "a1-m4-u3-l1-compare-routines", moduleId: "english-a1-m4-routines", order: 5, title: "My Routine and Your Routine", mission: "Compare simple daily patterns.", modelText: "I start work at eight, but my friend starts at ten. We both eat lunch at one.", competencyIds: ["EN.A1.SPEAK.DESCRIBE_ROUTINE", "EN.A1.READ.SHORT_DESCRIPTIONS", "EN.A1.PHON.BASIC_SENTENCE_STRESS"], productionPrompt: "Say one thing that is the same and one thing that is different in two routines.", production: "recorded_speaking" },
      { id: "a1-m4-u3-l2-day-in-life", moduleId: "english-a1-m4-routines", order: 6, title: "A Day in My Life", mission: "Integrate time, routines and personal information.", modelText: "I'm Daniela. I live in Santo Domingo. I wake up at six thirty and study English at night.", competencyIds: ["EN.A1.CREATE.DAILY_ROUTINE", "EN.A1.SPEAK.DESCRIBE_ROUTINE", "EN.A1.VOCAB.NUMBERS_TIME_DATES"], productionPrompt: "Give a short 'day in my life' presentation using personal information and time markers.", production: "recorded_speaking" },
    ],
  },
  {
    id: "english-a1-m5-food",
    order: 5,
    title: "Food, Drink and Common Needs",
    description: "Express basic needs, order food, and talk about food preferences.",
    lessons: [
      { id: "a1-m5-u1-l1-i-like-food", moduleId: "english-a1-m5-food", order: 1, title: "I Like / I Don't Like", mission: "Say simple food and drink preferences.", modelText: "I like rice and beans. I don't like coffee. I love fresh fruit.", competencyIds: ["EN.A1.SPEAK.EXPRESS_BASIC_PREFERENCE", "EN.A1.VOCAB.FOOD_SHOPPING", "EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS"], productionPrompt: "Say two things you like and one thing you don't like, then ask your partner what they like.", production: "ai_roleplay", role: "a friend sharing a meal", situation: "You talk about food and drink preferences." },
      { id: "a1-m5-u1-l2-ordering-food", moduleId: "english-a1-m5-food", order: 2, title: "Ordering Food and Drink", mission: "Use polite request chunks in a café or restaurant.", modelText: "I'd like a chicken sandwich, please. And a water. How much is that?", competencyIds: ["EN.A1.SPEAK.BASIC_TRANSACTION", "EN.A1.PRAG.BASIC_POLITENESS", "EN.A1.VOCAB.FOOD_SHOPPING"], productionPrompt: "Order one food item, one drink, and ask for the price.", production: "ai_roleplay", role: "a café worker", situation: "You order food and drink at a counter." },
      { id: "a1-m5-u2-l1-grocery-needs", moduleId: "english-a1-m5-food", order: 3, title: "At the Colmado / Grocery Store", mission: "Ask for items and check availability.", modelText: "Do you have milk? Yes, we do. How many? Two, please.", competencyIds: ["EN.A1.SPEAK.BASIC_TRANSACTION", "EN.A1.LISTEN.KEY_DETAILS", "EN.A1.VOCAB.FOOD_SHOPPING"], productionPrompt: "Ask for two items and confirm the quantity and price.", production: "ai_roleplay", role: "a shopkeeper", situation: "You buy a few everyday grocery items." },
      { id: "a1-m5-u2-l2-solve-order-problem", moduleId: "english-a1-m5-food", order: 4, title: "Solve an Order Problem", mission: "Handle a simple service breakdown or change.", modelText: "Sorry, we don't have chicken today. Okay, I'll have the cheese sandwich instead.", competencyIds: ["EN.A1.CONV.REQUEST_CLARIFICATION", "EN.A1.STRAT.ASK_REPEAT", "EN.A1.SPEAK.BASIC_TRANSACTION"], productionPrompt: "Respond when something you ordered is unavailable and choose an alternative.", production: "ai_roleplay", role: "a café worker", situation: "An item you want is not available." },
      { id: "a1-m5-u3-l1-my-favorite-dish", moduleId: "english-a1-m5-food", order: 5, title: "My Favorite Dish", mission: "Describe a dish or meal you enjoy.", modelText: "My favorite dish is mangú. It has plantains, cheese and salami. It's delicious.", competencyIds: ["EN.A1.SPEAK.DESCRIBE_ROUTINE", "EN.A1.WRITE.SHORT_DESCRIPTION", "EN.A1.VOCAB.FOOD_SHOPPING"], productionPrompt: "Describe your favorite meal with at least three simple details.", production: "recorded_speaking" },
      { id: "a1-m5-u3-l2-restaurant-roleplay", moduleId: "english-a1-m5-food", order: 6, title: "Restaurant Roleplay", mission: "Complete a full order exchange from greeting to payment.", modelText: "Good evening. A table for one, please. I'd like the fish with rice. And the bill, please.", competencyIds: ["EN.A1.SPEAK.BASIC_TRANSACTION", "EN.A1.CONV.SHORT_SUPPORTED_CONVERSATION", "EN.A1.PRAG.BASIC_POLITENESS"], productionPrompt: "Roleplay ordering a complete meal, asking one question, and requesting the bill.", production: "ai_roleplay", role: "a restaurant server", situation: "You have a full meal at a restaurant." },
    ],
  },
  {
    id: "english-a1-m6-neighborhood",
    order: 6,
    title: "Places in My Community",
    description: "Identify places, ask for and give simple directions, and describe your neighborhood.",
    lessons: [
      { id: "a1-m6-u1-l1-places-in-town", moduleId: "english-a1-m6-neighborhood", order: 1, title: "Places Around Me", mission: "Identify common community places.", modelText: "There is a bank on the corner. The pharmacy is next to the supermarket.", competencyIds: ["EN.A1.VOCAB.PLACES_DIRECTIONS", "EN.A1.READ.SHORT_DESCRIPTIONS", "EN.A1.SPEAK.GIVE_SIMPLE_DIRECTIONS"], productionPrompt: "Name three places in your neighborhood and where they are.", production: "recorded_speaking" },
      { id: "a1-m6-u1-l2-where-is-the", moduleId: "english-a1-m6-neighborhood", order: 2, title: "Where Is the…?", mission: "Ask for the location of a place.", modelText: "Excuse me, where is the metro station? It's on Main Street, across from the park.", competencyIds: ["EN.A1.SPEAK.GIVE_SIMPLE_DIRECTIONS", "EN.A1.LISTEN.KEY_DETAILS", "EN.A1.PRAG.BASIC_POLITENESS"], productionPrompt: "Ask for directions to one place and confirm what you heard.", production: "ai_roleplay", role: "a person on the street", situation: "You need to find a nearby place." },
      { id: "a1-m6-u2-l1-simple-directions", moduleId: "english-a1-m6-neighborhood", order: 3, title: "Go Straight, Turn Left", mission: "Give and follow simple directions.", modelText: "Go straight for two blocks. Turn left at the traffic light. The clinic is on the right.", competencyIds: ["EN.A1.SPEAK.GIVE_SIMPLE_DIRECTIONS", "EN.A1.LISTEN.SHORT_INSTRUCTIONS", "EN.A1.PHON.FINAL_CONSONANTS"], productionPrompt: "Give simple three-step directions from one landmark to another.", production: "recorded_speaking" },
      { id: "a1-m6-u2-l2-help-a-visitor", moduleId: "english-a1-m6-neighborhood", order: 4, title: "Help a Visitor", mission: "Help someone find a place with clarification.", modelText: "Excuse me, is the hospital near here? Yes, walk straight and turn right at the bank.", competencyIds: ["EN.A1.SPEAK.GIVE_SIMPLE_DIRECTIONS", "EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS", "EN.A1.MED.SHOW_OR_POINT_KEY_INFORMATION"], productionPrompt: "Help a visitor reach a place and check that they understand.", production: "ai_roleplay", role: "a lost visitor", situation: "Someone asks you for directions." },
      { id: "a1-m6-u3-l1-my-neighborhood", moduleId: "english-a1-m6-neighborhood", order: 5, title: "My Neighborhood", mission: "Describe your local area.", modelText: "I live in Gazcue. It's quiet. There are trees, small shops and a nice park.", competencyIds: ["EN.A1.SPEAK.GIVE_SIMPLE_DIRECTIONS", "EN.A1.WRITE.SHORT_DESCRIPTION", "EN.A1.CREATE.PERSONAL_INTRODUCTION"], productionPrompt: "Describe your neighborhood in four simple sentences.", production: "recorded_speaking" },
      { id: "a1-m6-u3-l2-community-map", moduleId: "english-a1-m6-neighborhood", order: 6, title: "Community Guide", mission: "Present a simple guide to two or three places in your area.", modelText: "Welcome to my neighborhood. The best colmado is on Duarte Street. The park is great for walking.", competencyIds: ["EN.A1.SPEAK.GIVE_SIMPLE_DIRECTIONS", "EN.A1.CREATE.PERSONAL_INTRODUCTION", "EN.A1.MED.RELAY_PERSONAL_DETAIL"], productionPrompt: "Present a short guide to three places in your community for a new neighbor.", production: "recorded_speaking" },
    ],
  },
  {
    id: "english-a1-m7-preferences",
    order: 7,
    title: "Likes, Free Time and Passions",
    description: "Talk about hobbies, music, sports, free time and what you enjoy.",
    lessons: [
      { id: "a1-m7-u1-l1-free-time", moduleId: "english-a1-m7-preferences", order: 1, title: "What Do You Do on Weekends?", mission: "Talk about free-time activities.", modelText: "On weekends, I play baseball. I listen to music. I spend time with my family.", competencyIds: ["EN.A1.SPEAK.EXPRESS_BASIC_PREFERENCE", "EN.A1.VOCAB.DAILY_ACTIVITIES", "EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS"], productionPrompt: "Say three things you like to do when you have free time.", production: "recorded_speaking" },
      { id: "a1-m7-u1-l2-music-and-culture", moduleId: "english-a1-m7-preferences", order: 2, title: "Music, Sports and Passions", mission: "Share personal cultural interests and ask about another person's.", modelText: "I love bachata and merengue. Do you like baseball? Yes, my favorite team is Tigres del Licey.", competencyIds: ["EN.A1.SPEAK.EXPRESS_BASIC_PREFERENCE", "EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS", "EN.A1.PRAG.TURN_TAKING_BASIC"], productionPrompt: "Share your favorite music or sport and ask the other person what they enjoy.", production: "ai_roleplay", role: "a friend talking about interests", situation: "You chat about music, sports and weekend fun." },
      { id: "a1-m7-u2-l1-making-plans", moduleId: "english-a1-m7-preferences", order: 3, title: "Do You Want to…?", mission: "Invite someone and respond to an invitation.", modelText: "Do you want to play baseball on Saturday? Sure! What time? Let's meet at four.", competencyIds: ["EN.A1.CONV.SHORT_SUPPORTED_CONVERSATION", "EN.A1.VOCAB.NUMBERS_TIME_DATES"], productionPrompt: "Invite someone to an activity, suggest a time, and confirm the plan.", production: "ai_roleplay", role: "a friend making a weekend plan", situation: "You make a simple plan to do something together." },
      { id: "a1-m7-u2-l2-cant-make-it", moduleId: "english-a1-m7-preferences", order: 4, title: "I'm Busy, but How About…?", mission: "Decline an invitation politely and suggest another time.", modelText: "Can you come on Friday? Sorry, I'm working on Friday. How about Saturday? Saturday is great.", competencyIds: ["EN.A1.PRAG.BASIC_POLITENESS", "EN.A1.CONV.REQUEST_CLARIFICATION", "EN.A1.CONV.SHORT_SUPPORTED_CONVERSATION"], productionPrompt: "Politely say you cannot make one time and propose an alternative.", production: "ai_roleplay", role: "a classmate proposing a time", situation: "You cannot make the first suggested time." },
      { id: "a1-m7-u3-l1-my-weekend-story", moduleId: "english-a1-m7-preferences", order: 5, title: "A Great Weekend", mission: "Connect activities into a short spoken narrative.", modelText: "On Saturday morning, I cleaned my house. In the afternoon, I went to the beach. It was fun.", competencyIds: ["EN.A1.SPEAK.DESCRIBE_ROUTINE", "EN.A1.WRITE.SIMPLE_ROUTINE", "EN.A1.PHON.BASIC_SENTENCE_STRESS"], productionPrompt: "Describe your ideal or recent weekend using time order words.", production: "recorded_speaking" },
      { id: "a1-m7-u3-l2-weekend-plan-roleplay", moduleId: "english-a1-m7-preferences", order: 6, title: "Plan a Weekend Together", mission: "Complete a multi-turn conversation to agree on a weekend activity.", modelText: "What are you doing this weekend? Nothing yet. Let's go to the park on Sunday at ten. Perfect.", competencyIds: ["EN.A1.CONV.SHORT_SUPPORTED_CONVERSATION", "EN.A1.PRAG.TURN_TAKING_BASIC"], productionPrompt: "Negotiate a weekend plan with a friend: activity, day, and time.", production: "ai_roleplay", role: "a friend planning an outing", situation: "You agree on a shared weekend activity." },
    ],
  },
  {
    id: "english-a1-m8-integration",
    order: 8,
    title: "Life in Action",
    description: "Integrate A1 competencies with less support and generate level-exit evidence.",
    lessons: [
      { id: "a1-m8-u1-l1-meet-someone", moduleId: "english-a1-m8-integration", order: 1, title: "Meet Someone New", mission: "Combine greeting, identity, questions and clarification in one first meeting.", modelText: "Hi, I'm Maya. I'm from Trinidad. I'm a student. What about you?", competencyIds: ["EN.A1.SPEAK.INTRODUCE_SELF", "EN.A1.CONV.PERSONAL_INTRODUCTION", "EN.A1.CONV.REQUEST_CLARIFICATION"], productionPrompt: "Meet someone new, exchange basic personal information, and ask at least one question.", production: "ai_roleplay", role: "a person you are meeting for the first time", situation: "You meet before a community event." },
      { id: "a1-m8-u1-l2-introduce-other", moduleId: "english-a1-m8-integration", order: 2, title: "Introduce Someone Else", mission: "Introduce another person and respond to follow-up questions.", modelText: "This is my friend Leo. He's from La Romana and he works at a hotel.", competencyIds: ["EN.A1.SPEAK.INTRODUCE_OTHER", "EN.A1.LISTEN.PERSONAL_INFORMATION", "EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS"], productionPrompt: "Introduce another person with three details and answer one follow-up question.", production: "ai_roleplay", role: "someone meeting your friend", situation: "You introduce a familiar person at a social event." },
      { id: "a1-m8-u2-l1-arrange-time", moduleId: "english-a1-m8-integration", order: 3, title: "Arrange a Time", mission: "Combine schedules, time and invitations.", modelText: "Are you free on Tuesday? Yes, after six. Great. Let's meet at six thirty.", competencyIds: ["EN.A1.VOCAB.NUMBERS_TIME_DATES", "EN.A1.CONV.SHORT_SUPPORTED_CONVERSATION", "EN.A1.ONLINE.SHARE_BASIC_INFORMATION"], productionPrompt: "Arrange a time for one activity and confirm the final plan.", production: "ai_roleplay", role: "a friend with a different schedule", situation: "You need to find one time when you are both free." },
      { id: "a1-m8-u2-l2-order-problem", moduleId: "english-a1-m8-integration", order: 4, title: "Order and Solve a Small Problem", mission: "Order something and repair one predictable problem.", modelText: "I'd like the chicken sandwich, please. Sorry, we don't have chicken today. Okay, I'll have the cheese sandwich.", competencyIds: ["EN.A1.SPEAK.BASIC_TRANSACTION", "EN.A1.CONV.BASIC_TRANSACTION", "EN.A1.CONV.REQUEST_CLARIFICATION"], productionPrompt: "Order one item and respond when it is unavailable, unclear, or different from what you expected.", production: "ai_roleplay", role: "a café server", situation: "You order something and solve one small service problem." },
      { id: "a1-m8-u2-l3-find-place", moduleId: "english-a1-m8-integration", order: 5, title: "Find a Place", mission: "Understand and give directions with repair.", modelText: "Go straight for one block, turn left at the bank, and the clinic is next to the pharmacy.", competencyIds: ["EN.A1.SPEAK.GIVE_SIMPLE_DIRECTIONS", "EN.A1.LISTEN.SHORT_INSTRUCTIONS", "EN.A1.MED.SHOW_OR_POINT_KEY_INFORMATION"], productionPrompt: "Help someone find a place and confirm that the route is understood.", production: "ai_roleplay", role: "a visitor", situation: "You help someone reach a nearby place." },
      { id: "a1-m8-u3-l1-my-life-in-english", moduleId: "english-a1-m8-integration", order: 6, title: "My Life in English", mission: "Assemble and improve selected A1 work across identity, people, routines, preferences and practical communication.", modelText: "I'm Elena. I live in Santo Domingo. I work during the day, study English at night, and I love music.", competencyIds: ["EN.A1.WRITE.PERSONAL_SENTENCES", "EN.A1.CREATE.PERSONAL_INTRODUCTION", "EN.A1.STRAT.USE_CHUNKS"], productionPrompt: "Create a short personal profile that combines information from at least three earlier A1 modules.", production: "recorded_speaking" },
      { id: "a1-m8-u3-l2-conversation-challenge", moduleId: "english-a1-m8-integration", order: 7, title: "A1 Conversation Challenge", mission: "Complete a multi-goal conversation with reduced prompts.", modelText: "Hi! I'm Jordan. I'm new here. What do you like to do on weekends?", competencyIds: ["EN.A1.CONV.SHORT_SUPPORTED_CONVERSATION", "EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS", "EN.A1.CONV.REQUEST_CLARIFICATION", "EN.A1.PHON.INTELLIGIBLE_CORE_PHRASES"], productionPrompt: "Sustain the conversation, ask at least one question, initiate one turn, and repair meaning if needed.", production: "ai_roleplay", role: "an unfamiliar but friendly conversation partner", situation: "You meet and then make one simple practical or social plan." },
      { id: "a1-m8-u3-l3-capstone", moduleId: "english-a1-m8-integration", order: 8, title: "Capstone: My Life, My English", mission: "Use A1 English across listening, speaking, reading, writing, mediation and practical transfer.", modelText: "Your appointment is Friday at four thirty. The office is next to the pharmacy. Please bring your name and phone number.", competencyIds: ["EN.A1.LISTEN.KEY_DETAILS", "EN.A1.READ.FUNCTIONAL_INFORMATION", "EN.A1.WRITE.BASIC_MESSAGE", "EN.A1.SPEAK.BASIC_TRANSACTION", "EN.A1.MED.RELAY_PERSONAL_DETAIL"], productionPrompt: "Explain the key information, relay one detail to another person, and respond with a short message confirming what you will do.", production: "ai_roleplay", role: "a community service assistant", situation: "You receive practical information, clarify it, relay one detail, and confirm the next step." },
    ],
  },
];

export function buildA1ProductionCurriculum(now = new Date().toISOString()): A1ProductionCurriculumBundle {
  const modules: Module[] = MODULE_SPECS.map((module) => ({
    id: module.id,
    courseId: A1_PRODUCTION_COURSE_ID,
    title: module.title,
    description: module.description,
    order: module.order,
    lessonIds: module.lessons.map((lesson) => lesson.id),
  }));
  const lessons = MODULE_SPECS.flatMap((module) => module.lessons.map(buildLesson));
  const course: Course = {
    id: A1_PRODUCTION_COURSE_ID,
    orgId: ORGANIZATION_ID,
    authorId: "lurexa-system",
    title: "English A1 Foundations",
    description: "Foundations for real communication: an evidence-based A1 path from first interaction through integrated level-exit performance.",
    subject: "english",
    status: "published",
    isTemplate: false,
    moduleIds: [MODULE_1_ID, ...modules.map((module) => module.id)],
    createdAt: now,
    updatedAt: now,
  };
  return { course, modules, lessons };
}

export async function provisionA1ProductionCurriculum(): Promise<A1ProductionCurriculumBundle> {
  const database = getServerFirestore();
  const bundle = buildA1ProductionCurriculum();
  await Promise.all([
    database.collection("courses").doc(bundle.course.id).set(bundle.course, { merge: true }),
    ...bundle.modules.map((module) => database.collection("modules").doc(module.id).set(module, { merge: true })),
    ...bundle.lessons.map((lesson) => database.collection("lessons").doc(lesson.id).set(lesson, { merge: true })),
  ]);
  return bundle;
}
