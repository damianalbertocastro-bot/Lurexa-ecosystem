import type { GrammarSectionData } from "@lurexa/types";

export interface A1ModuleData {
  id: string;
  order: number;
  title: string;
  mission: string;
  competencyIds: string[];
  vocabulary: string[];
  grammarStructures: string[];
  grammarSection?: GrammarSectionData;
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
    grammarSection: {
      conceptTitle: "Prepositions of Time & Asking Questions with 'When' and 'What Time'",
      formula: "[Preposition] + [Time Specificity] (at + clock time | on + days/dates | in + parts of day/months)",
      explanation: "In English, we use specific prepositions for distinct time units: 'at' for precise clock times and moments (at 7:00, at noon, at night); 'on' for specific calendar days and dates (on Monday, on March 15th); and 'in' for longer periods and parts of the day (in the morning, in April, in 2026).",
      forms: {
        affirmative: "The bus departs at 7:30 AM on Monday morning.",
        negative: "The class is not on Friday; it takes place on Wednesday.",
        question: "What time does your English class start? / When is your meeting?",
      },
      l1TransferTip: "In Dominican Spanish, 'en' is often used for everything ('en la mañana', 'en lunes', 'en las tres'). In English, avoid saying 'in Monday' or 'in 3:00'. Always use 'on Monday' and 'at 3:00'.",
      examples: [
        "English class starts at 6:00 PM on Wednesdays.",
        "My birthday is on October 24th.",
        "I usually study in the evening after work.",
      ],
    },
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
    grammarSection: {
      conceptTitle: "Possessive Adjectives (my, your, his, her, our, their) & the Saxon Genitive ('s)",
      formula: "[Possessor] + ['s] + [Noun] OR [Possessive Adjective] + [Noun]",
      explanation: "Possessive adjectives indicate ownership or relationships. 'His' refers to a male possessor (his mother = the mother of a male), while 'her' refers to a female possessor (her brother = the brother of a female). The Saxon genitive ('s) attaches directly to the possessor person.",
      forms: {
        affirmative: "This is Laura's brother. His name is Miguel, and he is very friendly.",
        negative: "Carlos is not her coworker; he is her university classmate.",
        question: "Is this your sister's notebook? / Who is his English teacher?",
      },
      l1TransferTip: "In Spanish, 'su' agrees with the noun possessed ('su madre' for his or her mother). In English, 'his' and 'her' agree with the gender of the owner: use 'his' for a man's family/belongings and 'her' for a woman's. Also replace 'the friend of Carlos' with 'Carlos's friend'.",
      examples: [
        "Maria is talking to her mother on the phone.",
        "David and his sister live in Santiago.",
        "That is my teacher's car.",
      ],
    },
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
    grammarSection: {
      conceptTitle: "Present Simple for Daily Habits, Routines & 3rd Person Singular (-s/-es)",
      formula: "[Subject (He/She/It)] + [Base Verb + -s/-es] | Negation: [Subject] + [do not / does not] + [Base Verb]",
      explanation: "The Present Simple describes facts, regular habits, and daily recurring routines. For third-person singular subjects (he, she, it, single names), we add -s or -es to the base verb in affirmative statements. In negative sentences and questions, the auxiliary 'does / doesn't' carries the third-person marker, returning the main verb to base form.",
      forms: {
        affirmative: "I wake up at 6:30 AM, but my sister wakes up at 7:00 AM.",
        negative: "He does not (doesn't) drink coffee in the evening.",
        question: "Do you exercise before work? / What time does she start her shift?",
      },
      l1TransferTip: "In Dominican Spanish, final /s/ is often dropped in everyday speech ('él trabaja aquí'). In English, the third-person '-s' is crucial for grammatical agreement ('He works here'). Also, never negate with 'no' alone (*'He no work'*); always use 'doesn't + base verb'.",
      examples: [
        "Daniel works in an IT company in Santo Domingo.",
        "We usually take the metro at eight o'clock.",
        "She doesn't eat meat on weekdays.",
      ],
    },
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
    grammarSection: {
      conceptTitle: "Prepositions of Place (next to, across from, between, behind) & Direction Imperatives",
      formula: "[Place A] + [is] + [Preposition of Place] + [Place B] | Imperative: [Base Verb] + [Direction/Location]",
      explanation: "To describe exact spatial locations, use prepositions of place. 'Next to' indicates adjacency, 'across from' indicates facing on the opposite side of a street or plaza, and 'between' connects two flanking landmarks. For directions, use bare imperative verbs (Turn left, Walk two blocks, Go straight).",
      forms: {
        affirmative: "The pharmacy is across from the central park, next to the bank.",
        negative: "The hospital is not near the metro station; it is three blocks away.",
        question: "Is there a bank near here? / Where can I find the nearest bus stop?",
      },
      l1TransferTip: "Spanish 'frente a' means 'across from' or 'opposite' when across a street. Avoid using 'in front of' for buildings on opposite sides of a road ('in front of' means right at the front entrance).",
      examples: [
        "Go straight for two blocks and turn right on Duarte Avenue.",
        "The supermarket is between the bakery and the clinic.",
        "Excuse me, is there an ATM on this street?",
      ],
    },
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
    grammarSection: {
      conceptTitle: "Polite Request Modal ('Would like' / 'Could I have') & Countable vs. Uncountable Nouns",
      formula: "[Subject] + [would like ('d like)] + [Noun / to Verb] | [Could / Can I have] + [Noun] + [please]?",
      explanation: "In English service encounters, direct imperatives ('Give me coffee') sound harsh. We use the polite conditional 'would like' or modal requests 'Could I have / Can I have'. Countable nouns take 'a/an' or numbers (a sandwich, two coffees), while uncountable nouns take 'some' or measurement containers (some water, a bottle of water, a plate of rice).",
      forms: {
        affirmative: "I would like (I'd like) a black coffee and some water, please.",
        negative: "We would not like any dessert right now, thank you.",
        question: "Could we have the bill, please? / Would you like anything else to drink?",
      },
      l1TransferTip: "In Caribbean and Dominican Spanish, saying 'Dame un café' is completely warm and normal. In English, translating literally to 'Give me a coffee' feels demanding. Always use 'I'd like a coffee, please' or 'Could I get a coffee, please?'",
      examples: [
        "I'd like the grilled chicken with salad, please.",
        "Could I have a glass of water with ice?",
        "How much is the total with tax included?",
      ],
    },
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
    grammarSection: {
      conceptTitle: "Verbs of Preference (like, love, enjoy, dislike) + Gerund (-ing)",
      formula: "[Subject] + [like / love / enjoy / hate / don't like] + [Verb-ing] + [Complement]",
      explanation: "When expressing ongoing hobbies, interests, and recreational activities, English verbs of preference are naturally followed by a gerund (verb + ing acting as an activity noun). While 'like to play' is grammatically possible, 'like playing' is the most natural native pattern for general hobbies.",
      forms: {
        affirmative: "I love dancing bachata and playing baseball on weekends.",
        negative: "He doesn't like cooking on busy weekdays.",
        question: "Do you enjoy traveling to new places? / What do you love doing in your free time?",
      },
      l1TransferTip: "Spanish uses the infinitive after preference verbs ('Me gusta bailar'). Avoid translating directly as *'I like dance'* (missing -ing/to). Always say 'I like dancing' or 'I like to dance'.",
      examples: [
        "Elena enjoys listening to Caribbean music while working.",
        "We love visiting the beach on long holiday weekends.",
        "I don't like waking up early on Sundays.",
      ],
    },
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
    grammarSection: {
      conceptTitle: "Coordinating Conjunctions (and, but, because, so) for Connected Fluency",
      formula: "[Clause 1] + [and (addition) | but (contrast) | because (cause) | so (result)] + [Clause 2]",
      explanation: "To advance from isolated words to connected multi-sentence speech, coordinating conjunctions link your ideas: 'and' joins similar details; 'but' introduces an unexpected contrast; 'because' explains your reason or motivation; and 'so' explains the result or consequence.",
      forms: {
        affirmative: "I live in Santo Domingo and I work at a technology startup.",
        negative: "I don't have much free time during the week, but I always study English at night.",
        question: "Do you prefer studying in the morning because it is quiet, or in the evening?",
      },
      l1TransferTip: "Avoid stringing choppy fragments with only commas. Use 'because' for reasons ('I study because I want to grow') and 'so' for results ('It was raining, so I took the metro').",
      examples: [
        "My sister is a student, and my brother works as an accountant.",
        "I love my neighborhood, but the traffic is sometimes heavy.",
        "I want to travel next year, so I am practicing my spoken English every day.",
      ],
    },
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
