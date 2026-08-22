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
      },
    },
  };
}

function productionCapabilityBlock(spec: A1LessonSpec): ContentBlock {
  if (spec.production === "ai_roleplay") {
    return {
      id: `${spec.id}-roleplay`,
      type: "interactive",
      order: 3,
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
    order: 3,
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
    estimatedMinutes: 17,
    contentBlocks: [
      {
        id: `${spec.id}-mission`,
        type: "text",
        order: 1,
        data: { text: `Mission: ${spec.mission}\n\nYou will listen, produce language, and use it for a real A1 communication goal.` },
      },
      listeningBlock(spec),
      productionCapabilityBlock(spec),
      activityBlock(spec, 4),
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
    title: "Food, Flavor and Everyday Choices",
    description: "Express food preferences, understand prices and order in predictable situations.",
    lessons: [
      { id: "a1-m5-u1-l1-food-around-me", moduleId: "english-a1-m5-food", order: 1, title: "Food Around Me", mission: "Identify common foods and meals in local and international contexts.", modelText: "For breakfast I like eggs and fruit. For lunch I often eat rice, beans and chicken.", competencyIds: ["EN.A1.VOCAB.FOOD_SHOPPING", "EN.A1.SPEAK.EXPRESS_BASIC_PREFERENCE", "EN.A1.LISTEN.PREDICTABLE_EXCHANGES"], productionPrompt: "Name foods you like and one food you do not usually choose.", production: "recorded_speaking" },
      { id: "a1-m5-u1-l2-food-preferences", moduleId: "english-a1-m5-food", order: 2, title: "What Do You Like?", mission: "Ask and answer basic food preferences.", modelText: "Do you like mango? Yes, I do. I love mango. What about you?",
        competencyIds: ["EN.A1.SPEAK.EXPRESS_BASIC_PREFERENCE", "EN.A1.CONV.SHORT_SUPPORTED_CONVERSATION", "EN.A1.PRAG.TURN_TAKING_BASIC"], productionPrompt: "Ask about two foods and respond with your preferences.", production: "ai_roleplay", role: "a friend choosing food", situation: "You compare food preferences before a meal." },
      { id: "a1-m5-u2-l1-a-some-any", moduleId: "english-a1-m5-food", order: 3, title: "A, Some, Any", mission: "Use high-frequency quantity patterns in food and shopping contexts.", modelText: "We need a tomato, some rice and some water. Do we have any eggs?",
        competencyIds: ["EN.A1.GRAMMAR.ARTICLES_BASIC", "EN.A1.GRAMMAR.SOME_ANY_BASIC", "EN.A1.GRAMMAR.COUNTABILITY_FOUNDATIONS"], productionPrompt: "Say or write a short shopping list using a, some, or any where appropriate.", production: "recorded_speaking" },
      { id: "a1-m5-u2-l2-what-we-need", moduleId: "english-a1-m5-food", order: 4, title: "What Do We Need?", mission: "Plan a simple meal or shopping list and relay one needed item.", modelText: "We need some bread and two bottles of water. Please tell Ana we also need bananas.", competencyIds: ["EN.A1.VOCAB.FOOD_SHOPPING", "EN.A1.MED.RELAY_PERSONAL_DETAIL", "EN.A1.GRAMMAR.COUNTABILITY_FOUNDATIONS"], productionPrompt: "Plan three items for a simple meal and relay one item another person needs.", production: "recorded_speaking" },
      { id: "a1-m5-u3-l1-reading-menu", moduleId: "english-a1-m5-food", order: 5, title: "Reading a Menu", mission: "Locate simple menu information and prices.", modelText: "The chicken sandwich is six dollars. The fruit juice is three dollars. Today's soup is five dollars.", competencyIds: ["EN.A1.READ.FUNCTIONAL_INFORMATION", "EN.A1.LISTEN.KEY_DETAILS", "EN.A1.VOCAB.FOOD_SHOPPING"], productionPrompt: "Choose one menu item, say the price, and explain your simple preference.", production: "recorded_speaking" },
      { id: "a1-m5-u3-l2-ordering", moduleId: "english-a1-m5-food", order: 6, title: "I'd Like…", mission: "Complete a short polite ordering exchange.", modelText: "Hello. I'd like a chicken sandwich, please. Anything to drink? Yes, a water, please.", competencyIds: ["EN.A1.SPEAK.BASIC_TRANSACTION", "EN.A1.CONV.BASIC_TRANSACTION", "EN.A1.PRAG.BASIC_POLITENESS"], productionPrompt: "Order food and a drink, confirm one detail, and close politely.", production: "ai_roleplay", role: "a café server", situation: "You order a simple meal and respond to one follow-up question." },
    ],
  },
  {
    id: "english-a1-m6-neighborhood",
    order: 6,
    title: "My Neighborhood",
    description: "Identify community places and understand or give simple directions.",
    lessons: [
      { id: "a1-m6-u1-l1-neighborhood-places", moduleId: "english-a1-m6-neighborhood", order: 1, title: "What's in the Neighborhood?", mission: "Identify and locate common places.", modelText: "There is a pharmacy next to the supermarket. There are two banks near the park.", competencyIds: ["EN.A1.VOCAB.PLACES_DIRECTIONS", "EN.A1.GRAMMAR.THERE_IS_ARE", "EN.A1.READ.SIMPLE_DIRECTIONS"], productionPrompt: "Describe three places in a neighborhood using there is or there are.", production: "recorded_speaking" },
      { id: "a1-m6-u1-l2-where-is-it", moduleId: "english-a1-m6-neighborhood", order: 2, title: "Where Is It?", mission: "Ask and answer basic location questions.", modelText: "Excuse me, where is the pharmacy? It's across from the park, next to the bank.", competencyIds: ["EN.A1.GRAMMAR.PREPOSITIONS_BASIC", "EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS", "EN.A1.VOCAB.PLACES_DIRECTIONS"], productionPrompt: "Ask where a place is and understand a short location answer.", production: "ai_roleplay", role: "a person who knows the neighborhood", situation: "You ask for the location of a nearby place." },
      { id: "a1-m6-u2-l1-go-turn-stop", moduleId: "english-a1-m6-neighborhood", order: 3, title: "Go, Turn, Stop", mission: "Understand simple direction instructions.", modelText: "Go straight. Turn left at the bank. Stop at the supermarket.", competencyIds: ["EN.A1.LISTEN.SHORT_INSTRUCTIONS", "EN.A1.STRAT.LISTEN_FOR_KEYWORDS", "EN.A1.VOCAB.PLACES_DIRECTIONS"], productionPrompt: "Give three short direction instructions in the correct order.", production: "recorded_speaking" },
      { id: "a1-m6-u2-l2-how-get-there", moduleId: "english-a1-m6-neighborhood", order: 4, title: "How Do I Get There?", mission: "Ask for and give short directions.", modelText: "How do I get to the museum? Go straight and turn right at the café. It's on your left.", competencyIds: ["EN.A1.SPEAK.GIVE_SIMPLE_DIRECTIONS", "EN.A1.CONV.REQUEST_CLARIFICATION", "EN.A1.READ.SIMPLE_DIRECTIONS"], productionPrompt: "Ask for directions, follow the answer, and ask for clarification once if needed.", production: "ai_roleplay", role: "a local person giving directions", situation: "You need to find a place in an unfamiliar neighborhood." },
      { id: "a1-m6-u3-l1-getting-around", moduleId: "english-a1-m6-neighborhood", order: 5, title: "Bus, Walk, Drive", mission: "Discuss very basic transport choices and locations.", modelText: "I walk to the pharmacy. I take the bus to work. The bus stop is near my house.", competencyIds: ["EN.A1.VOCAB.PLACES_DIRECTIONS", "EN.A1.LISTEN.KEY_DETAILS", "EN.A1.SPEAK.GIVE_SIMPLE_DIRECTIONS"], productionPrompt: "Explain how you get to one familiar place and where you start.", production: "recorded_speaking" },
      { id: "a1-m6-u3-l2-help-find-it", moduleId: "english-a1-m6-neighborhood", order: 6, title: "Help Me Find It", mission: "Integrate place, direction and clarification strategies.", modelText: "The clinic is on Duarte Avenue. Go straight, then turn left. Do you see the blue building? That's it.", competencyIds: ["EN.A1.SPEAK.GIVE_SIMPLE_DIRECTIONS", "EN.A1.MED.SHOW_OR_POINT_KEY_INFORMATION", "EN.A1.CONV.REQUEST_CLARIFICATION"], productionPrompt: "Help another person find a place by giving a short route and one useful landmark detail.", production: "ai_roleplay", role: "a visitor who needs help", situation: "You help someone reach a community place." },
    ],
  },
  {
    id: "english-a1-m7-preferences",
    order: 7,
    title: "What I Like",
    description: "Express preferences and abilities and make simple social plans.",
    lessons: [
      { id: "a1-m7-u1-l1-hobbies", moduleId: "english-a1-m7-preferences", order: 1, title: "Hobbies and Interests", mission: "Identify and express common interests.", modelText: "I like music and basketball. I also like cooking. What do you like?",
        competencyIds: ["EN.A1.VOCAB.PREFERENCES_HOBBIES", "EN.A1.SPEAK.EXPRESS_BASIC_PREFERENCE", "EN.A1.CONV.SHORT_SUPPORTED_CONVERSATION"], productionPrompt: "Say two things you like and ask one follow-up question about another person's interests.", production: "ai_roleplay", role: "a new friend", situation: "You talk about hobbies and interests." },
      { id: "a1-m7-u1-l2-me-too", moduleId: "english-a1-m7-preferences", order: 2, title: "Me Too / Not Me", mission: "Maintain a short preference exchange.", modelText: "I love dancing. Me too! I don't like running very much. Really? I like it.", competencyIds: ["EN.A1.PRAG.TURN_TAKING_BASIC", "EN.A1.SPEAK.EXPRESS_BASIC_PREFERENCE", "EN.A1.PHON.BASIC_INTONATION"], productionPrompt: "Respond to preferences with agreement or a different preference and keep the conversation going.", production: "ai_roleplay", role: "a friend comparing interests", situation: "You discover interests you share and interests that are different." },
      { id: "a1-m7-u2-l1-abilities", moduleId: "english-a1-m7-preferences", order: 3, title: "Abilities", mission: "Express basic ability and non-ability.", modelText: "I can swim, but I can't drive. My sister can cook very well.", competencyIds: ["EN.A1.SPEAK.EXPRESS_BASIC_PREFERENCE", "EN.A1.PHON.BASIC_SENTENCE_STRESS", "EN.A1.VOCAB.PREFERENCES_HOBBIES"], productionPrompt: "Say two things you can do and one thing you cannot do yet.", production: "recorded_speaking" },
      { id: "a1-m7-u2-l2-find-someone", moduleId: "english-a1-m7-preferences", order: 4, title: "Find Someone Who…", mission: "Ask about abilities or interests and report one result.", modelText: "Can you cook? Yes, I can. Do you like dancing? Yes, I do.", competencyIds: ["EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS", "EN.A1.PRAG.TURN_TAKING_BASIC", "EN.A1.SPEAK.INTRODUCE_OTHER"], productionPrompt: "Ask two ability or interest questions and report one thing you learned about the other person.", production: "ai_roleplay", role: "a classmate", situation: "You ask simple questions to find someone with a particular interest or ability." },
      { id: "a1-m7-u3-l1-invitations", moduleId: "english-a1-m7-preferences", order: 5, title: "Want to…?", mission: "Recognize and use basic invitation and response chunks.", modelText: "Do you want to watch a movie on Friday? Sure! What time? At seven.", competencyIds: ["EN.A1.WRITE.BASIC_MESSAGE", "EN.A1.PRAG.BASIC_POLITENESS", "EN.A1.ONLINE.SHORT_SOCIAL_EXCHANGE"], productionPrompt: "Invite someone to one activity and respond naturally to an acceptance or refusal.", production: "ai_roleplay", role: "a friend", situation: "You invite a friend to a simple activity." },
      { id: "a1-m7-u3-l2-make-plan", moduleId: "english-a1-m7-preferences", order: 6, title: "Let's Make a Plan", mission: "Combine preferences, time and invitation language.", modelText: "Let's go to the park on Sunday. Great. I'm free at three. Let's meet at the entrance.", competencyIds: ["EN.A1.VOCAB.NUMBERS_TIME_DATES", "EN.A1.CONV.SHORT_SUPPORTED_CONVERSATION", "EN.A1.ONLINE.SHARE_BASIC_INFORMATION"], productionPrompt: "Make a simple social plan, agree on a time, and confirm it in one short message.", production: "ai_roleplay", role: "a friend making plans", situation: "You choose an activity and agree on a time." },
    ],
  },
  {
    id: "english-a1-m8-integration",
    order: 8,
    title: "Life in Action",
    description: "Integrate A1 competencies with less support and generate level-exit evidence.",
    lessons: [
      { id: "a1-m8-u1-l1-meet-someone", moduleId: "english-a1-m8-integration", order: 1, title: "Meet Someone New", mission: "Combine greeting, identity, questions and clarification in one first meeting.", modelText: "Hi, I'm Maya. I'm from Trinidad. I'm a student. What about you?",
        competencyIds: ["EN.A1.SPEAK.INTRODUCE_SELF", "EN.A1.CONV.PERSONAL_INTRODUCTION", "EN.A1.CONV.REQUEST_CLARIFICATION"], productionPrompt: "Meet someone new, exchange basic personal information, and ask at least one question.", production: "ai_roleplay", role: "a person you are meeting for the first time", situation: "You meet before a community event." },
      { id: "a1-m8-u1-l2-introduce-other", moduleId: "english-a1-m8-integration", order: 2, title: "Introduce Someone Else", mission: "Introduce another person and respond to follow-up questions.", modelText: "This is my friend Leo. He's from La Romana and he works at a hotel.", competencyIds: ["EN.A1.SPEAK.INTRODUCE_OTHER", "EN.A1.LISTEN.PERSONAL_INFORMATION", "EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS"], productionPrompt: "Introduce another person with three details and answer one follow-up question.", production: "ai_roleplay", role: "someone meeting your friend", situation: "You introduce a familiar person at a social event." },
      { id: "a1-m8-u2-l1-arrange-time", moduleId: "english-a1-m8-integration", order: 3, title: "Arrange a Time", mission: "Combine schedules, time and invitations.", modelText: "Are you free on Tuesday? Yes, after six. Great. Let's meet at six thirty.", competencyIds: ["EN.A1.VOCAB.NUMBERS_TIME_DATES", "EN.A1.CONV.SHORT_SUPPORTED_CONVERSATION", "EN.A1.ONLINE.SHARE_BASIC_INFORMATION"], productionPrompt: "Arrange a time for one activity and confirm the final plan.", production: "ai_roleplay", role: "a friend with a different schedule", situation: "You need to find one time when you are both free." },
      { id: "a1-m8-u2-l2-order-problem", moduleId: "english-a1-m8-integration", order: 4, title: "Order and Solve a Small Problem", mission: "Order something and repair one predictable problem.", modelText: "I'd like the chicken sandwich, please. Sorry, we don't have chicken today. Okay, I'll have the cheese sandwich.", competencyIds: ["EN.A1.SPEAK.BASIC_TRANSACTION", "EN.A1.CONV.BASIC_TRANSACTION", "EN.A1.CONV.REQUEST_CLARIFICATION"], productionPrompt: "Order one item and respond when it is unavailable, unclear, or different from what you expected.", production: "ai_roleplay", role: "a café server", situation: "You order something and solve one small service problem." },
      { id: "a1-m8-u2-l3-find-place", moduleId: "english-a1-m8-integration", order: 5, title: "Find a Place", mission: "Understand and give directions with repair.", modelText: "Go straight for one block, turn left at the bank, and the clinic is next to the pharmacy.", competencyIds: ["EN.A1.SPEAK.GIVE_SIMPLE_DIRECTIONS", "EN.A1.LISTEN.SHORT_INSTRUCTIONS", "EN.A1.MED.SHOW_OR_POINT_KEY_INFORMATION"], productionPrompt: "Help someone find a place and confirm that the route is understood.", production: "ai_roleplay", role: "a visitor", situation: "You help someone reach a nearby place." },
      { id: "a1-m8-u3-l1-my-life-in-english", moduleId: "english-a1-m8-integration", order: 6, title: "My Life in English", mission: "Assemble and improve selected A1 work across identity, people, routines, preferences and practical communication.", modelText: "I'm Elena. I live in Santo Domingo. I work during the day, study English at night, and I love music.", competencyIds: ["EN.A1.WRITE.PERSONAL_SENTENCES", "EN.A1.CREATE.PERSONAL_INTRODUCTION", "EN.A1.STRAT.USE_CHUNKS"], productionPrompt: "Create a short personal profile that combines information from at least three earlier A1 modules.", production: "recorded_speaking" },
      { id: "a1-m8-u3-l2-conversation-challenge", moduleId: "english-a1-m8-integration", order: 7, title: "A1 Conversation Challenge", mission: "Complete a multi-goal conversation with reduced prompts.", modelText: "Hi! I'm Jordan. I'm new here. What do you like to do on weekends?",
        competencyIds: ["EN.A1.CONV.SHORT_SUPPORTED_CONVERSATION", "EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS", "EN.A1.CONV.REQUEST_CLARIFICATION", "EN.A1.PHON.INTELLIGIBLE_CORE_PHRASES"], productionPrompt: "Sustain the conversation, ask at least one question, initiate one turn, and repair meaning if needed.", production: "ai_roleplay", role: "an unfamiliar but friendly conversation partner", situation: "You meet and then make one simple practical or social plan." },
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

/**
 * Provisions the A1 production curriculum as trusted server-authored objects.
 * This function is idempotent and preserves learner progress/evidence because
 * it updates curriculum documents only; it never rewrites learner records.
 */
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
