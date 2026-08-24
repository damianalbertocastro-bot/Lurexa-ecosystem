export interface A1ModuleData {

  id: string;
  order: number;
  title: string;
  mission: string;
  competencyIds: string[];
  vocabulary: string[];
  grammarStructures: string[];
  phoneticTargets: string[];
  spokenPrompts: string[];
  createApplyTask: {
    title: string;
    prompt: string;
    stage: "CREATE_APPLY";
  };
}

export const A1_MODULES_2_TO_8: A1ModuleData[] = [
  {
    id: "english-a1-module-2",
    order: 2,
    title: "My World in Numbers, Time & Schedules",
    mission: "Exchange numbers, phone contacts, prices, clock times, and simple weekly schedule commitments accurately.",
    competencyIds: [
      "EN.A1.LISTEN.KEY_DETAILS",
      "EN.A1.SPEAK.ASK_PERSONAL_QUESTIONS",
      "EN.A1.VOCAB.NUMBERS_TIME_DATES",
      "EN.A1.GRAMMAR.PREPOSITIONS_BASIC",
      "EN.A1.PHON.WORD_STRESS",
    ],
    vocabulary: ["phone number", "clock", "morning", "afternoon", "Monday", "Friday", "quarter past", "half past", "dollars", "pesos"],
    grammarStructures: ["What time is it?", "It's at [time]", "How much is...?", "When do you...?"],
    phoneticTargets: ["teen vs ty stress contrasts", "digit rhythm and chunking", "final -s on plural days"],
    spokenPrompts: [
      "Say your contact phone number and birth month clearly.",
      "Tell a partner what time you start work or class on Mondays.",
      "Ask a shopkeeper for the price of two items.",
    ],
    createApplyTask: {
      title: "My Weekly Schedule Plan",
      prompt: "Record a 45-second audio sharing your weekly schedule: mention two days of the week, one class or work time, and one meeting with a friend.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-a1-module-3",
    order: 3,
    title: "The People Around Me & Family",
    mission: "Identify, describe, and introduce family members, friends, and community acquaintances using basic descriptive phrases.",
    competencyIds: [
      "EN.A1.SPEAK.INTRODUCE_OTHER",
      "EN.A1.SPEAK.DESCRIBE_PERSON",
      "EN.A1.VOCAB.FAMILY_PEOPLE",
      "EN.A1.GRAMMAR.POSSESSIVE_ADJECTIVES",
      "EN.A1.PHON.FINAL_CONSONANTS",
    ],
    vocabulary: ["mother", "father", "brother", "sister", "friend", "coworker", "tall", "kind", "busy", "young"],
    grammarStructures: ["This is my [relative]", "His/Her name is...", "They are very [adjective]", "Who is she?"],
    phoneticTargets: ["voiced vs voiceless final consonants in adjectives", "possessive -s endings (/s/, /z/, /ɪz/)"],
    spokenPrompts: [
      "Introduce your best friend or a family member to your teacher.",
      "Describe someone in your family using three descriptive adjectives.",
    ],
    createApplyTask: {
      title: "My People Audio Album",
      prompt: "Record an introduction of two important people in your life, explaining who they are and one thing they like to do.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-a1-module-4",
    order: 4,
    title: "My Daily Life & Habitual Routines",
    mission: "Describe everyday daily routines, morning habits, work activities, and frequency of common actions in Simple Present.",
    competencyIds: [
      "EN.A1.SPEAK.DESCRIBE_ROUTINE",
      "EN.A1.GRAMMAR.SIMPLE_PRESENT_HABITS",
      "EN.A1.VOCAB.DAILY_ACTIONS",
      "EN.A1.PHON.THIRD_PERSON_S",
      "EN.A1.CONV.ASK_ANSWER_ROUTINE",
    ],
    vocabulary: ["wake up", "take a shower", "have breakfast", "go to work", "study English", "cook dinner", "always", "usually", "sometimes"],
    grammarStructures: ["I wake up at...", "She works at...", "Do you usually have coffee?", "He doesn't eat breakfast."],
    phoneticTargets: ["third person singular -s endings", "reduced prepositions 'at' and 'to'"],
    spokenPrompts: [
      "Describe your morning routine from waking up until arriving at work or class.",
      "Ask an AI partner three questions about their daily habits.",
    ],
    createApplyTask: {
      title: "A Day in My Life",
      prompt: "Record a 60-second summary of your typical weekday, including your morning, afternoon, and evening habits.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-a1-module-5",
    order: 5,
    title: "Places in Town & Getting Around",
    mission: "Ask for and give simple directions, locate familiar buildings and landmarks, and describe nearby places in the neighborhood.",
    competencyIds: [
      "EN.A1.SPEAK.ASK_DIRECTIONS",
      "EN.A1.VOCAB.PLACES_BUILDINGS",
      "EN.A1.GRAMMAR.PREPOSITIONS_PLACE",
      "EN.A1.PHON.TH_SOUNDS",
      "EN.A1.LISTEN.DIRECTIONS_MAPS",
    ],
    vocabulary: ["supermarket", "bank", "pharmacy", "bus stop", "next to", "across from", "between", "turn left", "go straight"],
    grammarStructures: ["Excuse me, where is the...?", "Is there a pharmacy near here?", "It's on Main Street next to the bank."],
    phoneticTargets: ["/θ/ in 'through' and 'north' without stopping to /t/", "syllable stress on compound place names"],
    spokenPrompts: [
      "Ask for directions to the nearest bank in a polite manner.",
      "Explain how to get from your home to your favorite local spot.",
    ],
    createApplyTask: {
      title: "My Neighborhood Tour Guide",
      prompt: "Describe 3 key places in your neighborhood and give simple directions on how to find them.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-a1-module-6",
    order: 6,
    title: "Food, Drink & Everyday Transactions",
    mission: "Order food and drinks, express basic food preferences, ask menu prices, and handle polite cafe or grocery transactions.",
    competencyIds: [
      "EN.A1.SPEAK.ORDER_FOOD",
      "EN.A1.VOCAB.FOOD_BEVERAGES",
      "EN.A1.GRAMMAR.WOULD_LIKE_COUNTABLE",
      "EN.A1.PHON.LINKING_WORDS",
      "EN.A1.PRAG.POLITENESS_MARKERS",
    ],
    vocabulary: ["coffee", "water", "rice", "chicken", "salad", "menu", "bill", "delicious", "can I have", "I would like"],
    grammarStructures: ["I'd like a [item], please", "Can we have the check?", "Do you have any vegetarian options?", "How much is this?"],
    phoneticTargets: ["consonant-to-vowel linking ('can I', 'like a')", "polite intonation rise on requests"],
    spokenPrompts: [
      "Order your favorite Dominican or international lunch at a restaurant.",
      "Ask a server for the bill and check the total price.",
    ],
    createApplyTask: {
      title: "Cafe & Restaurant Order Roleplay",
      prompt: "Complete an interactive ordering dialogue: order one main dish, one drink, and ask for the final bill.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-a1-module-7",
    order: 7,
    title: "Free Time, Likes & Personal Interests",
    mission: "Talk about hobbies, leisure activities, sports, music, and express what you like, love, or dislike doing.",
    competencyIds: [
      "EN.A1.SPEAK.EXPRESS_LIKES_DISLIKES",
      "EN.A1.VOCAB.HOBBIES_LEISURE",
      "EN.A1.GRAMMAR.LIKE_LOVE_GERUND",
      "EN.A1.PHON.VOWEL_LENGTH",
      "EN.A1.CONV.DISCUSS_INTERESTS",
    ],
    vocabulary: ["listen to music", "watch movies", "play baseball", "dance bachata", "travel", "read books", "love", "don't like"],
    grammarStructures: ["I like playing...", "I love listening to...", "What do you do on weekends?", "Do you like dancing?"],
    phoneticTargets: ["-ing participle articulation (/ɪŋ/ without /n/ reduction friction)", "vowel duration contrasts (/iː/ vs /ɪ/)"],
    spokenPrompts: [
      "Share 3 things you love doing on weekends and 1 thing you dislike.",
      "Ask a speaking partner about their favorite music and hobbies.",
    ],
    createApplyTask: {
      title: "My Weekend & Passions Showcase",
      prompt: "Record a conversational audio sharing your hobbies, what music you enjoy, and how you spend Sunday afternoons.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-a1-module-8",
    order: 8,
    title: "Everyday Spoken Communication & Capstone Preparation",
    mission: "Synthesize all A1 conversational skills: self-introductions, daily schedules, place descriptions, family introductions, and defense preparation.",
    competencyIds: [
      "EN.A1.SPEAK.INTEGRATED_PRESENTATION",
      "EN.A1.CONV.MULTI_TURN_EXCHANGE",
      "EN.A1.PHON.INTELLIGIBILITY_FLUENCY",
      "EN.A1.CAPSTONE.SELF_SYNTHESIS",
      "EN.A1.PRAG.CONFIDENCE_CLARITY",
    ],
    vocabulary: ["originally from", "currently living", "my family consists of", "during the week", "in my free time", "pleased to meet you"],
    grammarStructures: [
      "I am / He is / They are [origin/description]",
      "In the morning I [routine action], and in the afternoon...",
      "I like [activity] because it is [adjective]",
      "Could you please tell me about...?",
    ],

    phoneticTargets: ["Overall conversational intelligibility, rhythm, and spoken confidence"],
    spokenPrompts: [
      "Deliver a complete 2-minute oral presentation covering yourself, your family, your daily routine, and your hometown.",
      "Participate in a 3-turn interactive oral defense answering questions about your daily life and future learning goals.",
    ],
    createApplyTask: {
      title: "My Life, My English — Capstone Readiness Pitch",
      prompt: "Synthesize your full A1 portfolio into a comprehensive audio presentation demonstrating spontaneous, intelligible English communication.",
      stage: "CREATE_APPLY",
    },
  },
];
