import type { GrammarSectionData } from "@lurexa/types";

export interface A2ModuleData {
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

export const A2_MODULES_1_TO_8: A2ModuleData[] = [
  {
    id: "english-a2-module-1",
    order: 1,
    title: "Daily Routines, Personal Independence & Time Management",
    mission: "Describe standard daily routines, domestic responsibilities, and frequency of activities using adverbs of frequency and time connectors.",
    competencyIds: [
      "EN.A2.SPEAK.DESCRIBE_ROUTINE",
      "EN.A2.GRAMMAR.FREQUENCY_ADVERBS",
      "EN.A2.VOCAB.DAILY_HABITS",
      "EN.A2.PHON.LINKED_SOUNDS",
      "EN.A2.LISTEN.ROUTINE_DETAILS",
    ],
    vocabulary: ["always", "usually", "frequently", "rarely", "hardly ever", "household chores", "laundry", "prepare meals", "commute", "prioritize"],
    grammarStructures: [
      "I always [verb] before [action]",
      "How often do you [verb]?",
      "She rarely wakes up before 7 AM",
      "First I [action], then I [action], and after that...",
    ],
    grammarSection: {
      conceptTitle: "Adverbs of Frequency & Mid-Position Word Order",
      formula: "[Subject] + [Adverb of Frequency (always/usually/rarely)] + [Main Verb] OR [Subject] + [Verb 'to be'] + [Adverb]",
      explanation: "Adverbs of frequency describe how often an action happens. In English, their position is strict: place them BEFORE regular action verbs ('I always prioritize my tasks') but AFTER the verb 'to be' ('She is usually on time'). In negative sentences, frequency adverbs like 'always' sit between 'don't/doesn't' and the base verb.",
      forms: {
        affirmative: "I usually prepare my meals on Sunday afternoons.",
        negative: "He doesn't always finish his chores before leaving the house.",
        question: "How often do you clean your workspace? / Is she always this organized?",
      },
      l1TransferTip: "Spanish allows flexible adverb placement (*'Siempre yo limpio'* or *'Yo limpio siempre'*). In English, never place the adverb before the subject or at the end of simple clauses. Place it directly between the subject and the main verb.",
      examples: [
        "We rarely take the car during rush hour; we usually use the metro.",
        "Carlos is never late for our morning team sync.",
        "How often do you review your weekly study goals?",
      ],
    },
    phoneticTargets: ["Consonant-to-vowel linking (e.g., 'wake up', 'get on')", "Reduced vowels in unstressed frequency words"],
    spokenPrompts: [
      "Describe how you manage your typical morning and evening schedule.",
      "Explain 3 domestic habits that help you stay organized during busy work weeks.",
    ],
    createApplyTask: {
      title: "My Independent Routine Blueprint",
      prompt: "Record a 60-second audio describing your complete weekday routine and how you balance study, work, and personal time.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-a2-module-2",
    order: 2,
    title: "Navigating Dominican & International Transit and Directions",
    mission: "Ask for and give directions, purchase transit tickets, navigate airport/bus terminals, and understand public transit announcements.",
    competencyIds: [
      "EN.A2.SPEAK.GIVE_DIRECTIONS",
      "EN.A2.LISTEN.TRANSIT_ANNOUNCEMENTS",
      "EN.A2.VOCAB.TRANSPORTATION_WAYFINDING",
      "EN.A2.GRAMMAR.PREPOSITIONS_MOVEMENT",
      "EN.A2.PHON.STOP_CONSONANTS",
    ],
    vocabulary: ["intersection", "roundabout", "terminal", "boarding gate", "one-way ticket", "round trip", "metro line", "straight ahead", "turn left/right", "fare"],
    grammarStructures: [
      "How do I get to [destination]?",
      "Go straight for two blocks and turn left on...",
      "Which platform does the bus to [city] leave from?",
      "Take the metro toward [station] and transfer at...",
    ],
    grammarSection: {
      conceptTitle: "Prepositions of Movement (into, through, along, across, past) & Transit Direction Sequences",
      formula: "[Subject] + [Verb of Motion (walk/go/drive)] + [Preposition of Movement] + [Landmark / Street]",
      explanation: "Prepositions of movement describe trajectory and direction across physical space: 'along' indicates moving parallel to a road/corridor; 'through' indicates passing inside an enclosed or crowded space (a tunnel, terminal, or park); 'across' means traversing from one side to the other; and 'past' means moving by a landmark without entering it.",
      forms: {
        affirmative: "Walk along Duarte Avenue, go through the main plaza, and cross the street.",
        negative: "Do not turn into the private terminal; stay on the main roadway.",
        question: "How do I get to Terminal 2? / Which platform does the Santiago express leave from?",
      },
      l1TransferTip: "Spanish speakers often use generic 'por' for movement. Distinguish between 'through the security checkpoint' (inside), 'across the street' (opposite side), and 'along the avenue' (parallel line).",
      examples: [
        "Go straight past the pharmacy and turn right at the intersection.",
        "Take Metro Line 1 toward Centro de los Héroes and transfer at Juan Pablo Duarte.",
        "Could you tell me how to get to Boarding Gate 14?",
      ],
    },
    phoneticTargets: ["Clear final stops /t/, /d/, /k/ in direction words ('straight', 'next', 'left')", "Intonation in clarification questions"],
    spokenPrompts: [
      "Give a visitor step-by-step directions from the central park to the nearest hospital or metro station.",
      "Simulate asking a ticket agent for a round-trip bus ticket with specific departure times.",
    ],
    createApplyTask: {
      title: "Dominican Transit & City Guide",
      prompt: "Record a transit navigation guide explaining how a foreign traveler can get from Las Américas Airport to the Zona Colonial using public and private transport options.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-a2-module-3",
    order: 3,
    title: "Shopping, Supermarkets, Prices & Transactions",
    mission: "Inquire about prices, quantities, sizes, return policies, and carry out practical transactional interactions in stores and open-air markets.",
    competencyIds: [
      "EN.A2.SPEAK.RETAIL_TRANSACTIONS",
      "EN.A2.VOCAB.SHOPPING_CURRENCY",
      "EN.A2.GRAMMAR.COUNTABLE_UNCOUNTABLE",
      "EN.A2.GRAMMAR.COMPARATIVES",
      "EN.A2.PHON.PLURAL_ENDINGS",
    ],
    vocabulary: ["discount", "receipt", "aisle", "cashier", "fitting room", "in stock", "out of stock", "refund", "a bottle of", "a bunch of"],
    grammarStructures: [
      "How much does this cost?",
      "Is this available in a larger size / different color?",
      "This one is cheaper than that one, but the quality is better.",
      "I would like to return this item with the original receipt.",
    ],
    grammarSection: {
      conceptTitle: "Comparatives & Superlatives (Short vs. Long Adjectives & Irregulars)",
      formula: "1-Syllable: [Adj + -er] + than | 2+ Syllables: more + [Adj] + than | Superlative: the + [Adj + -est / most + Adj]",
      explanation: "Use comparative forms to contrast two items, prices, or options: 1-syllable adjectives add -er (cheaper than, faster than); adjectives ending in -y change to -ier (easier than); adjectives with 2 or more syllables use 'more' (more expensive than, more durable than). Key irregulars: good → better → best; bad → worse → worst.",
      forms: {
        affirmative: "This brand is cheaper than that one, but the quality is significantly better.",
        negative: "Online shopping is not always faster than visiting the local store.",
        question: "Is this laptop more reliable than the smaller model? / Which option is the most economical?",
      },
      l1TransferTip: "Avoid literal Spanish translations like *'more good than'* (*'más bueno que'*) — always use 'better than'. Never combine 'more' with an '-er' ending (*'more cheaper'* ❌ → 'cheaper' ✅).",
      examples: [
        "The supermarket on the corner is closer than the shopping mall.",
        "Organic produce is slightly more expensive, but it tastes fresher.",
        "Which of these two smartphones has the longest battery life?",
      ],
    },
    phoneticTargets: ["Three plural and 3rd person /s/, /z/, /ɪz/ morphemic endings", "Stress in compound nouns ('grocery store', 'credit card')"],
    spokenPrompts: [
      "Negotiate a polite exchange or return with a department store customer service representative.",
      "Compare two electronic devices or clothing items explaining why one is more suitable for your budget.",
    ],
    createApplyTask: {
      title: "Smart Shopper Audio Review",
      prompt: "Record a spoken shopping comparison recommending the best local supermarket or electronics shop based on prices, variety, and customer service.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-a2-module-4",
    order: 4,
    title: "Health, Well-being, Symptoms & Medical Interactions",
    mission: "Describe physical symptoms, schedule doctor appointments, understand basic pharmacy prescriptions, and communicate urgent health needs.",
    competencyIds: [
      "EN.A2.SPEAK.HEALTH_SYMPTOMS",
      "EN.A2.LISTEN.MEDICAL_INSTRUCTIONS",
      "EN.A2.VOCAB.BODY_HEALTH_PHARMACY",
      "EN.A2.GRAMMAR.MODALS_ADVICE",
      "EN.A2.PHON.CONSONANT_CLUSTERS",
    ],
    vocabulary: ["headache", "fever", "dizziness", "sore throat", "prescription", "dosage", "side effects", "appointment", "painkiller", "emergency room"],
    grammarStructures: [
      "I have had a [symptom] since yesterday morning.",
      "You should take this medicine twice a day after meals.",
      "I need to make an appointment with Dr. [Name] for tomorrow.",
      "Is it necessary to take this on an empty stomach?",
    ],
    grammarSection: {
      conceptTitle: "Modal Verbs for Health Advice & Obligation (should, must, have to)",
      formula: "[Subject] + [should / shouldn't / have to / must] + [Base Verb (Bare Infinitive)]",
      explanation: "Use modal verbs to communicate health advice and medical instructions: 'should / shouldn't' gives friendly medical advice ('You should drink plenty of fluids'); 'have to' expresses necessary medical regimens ('You have to take this antibiotic every 8 hours'); 'must' signals crucial prohibitions or urgent warnings ('You must not drive after taking this medication').",
      forms: {
        affirmative: "You should rest and drink warm tea for your sore throat.",
        negative: "You shouldn't take this painkiller on an empty stomach.",
        question: "Should I schedule a follow-up appointment next week? / Do I have to take this with food?",
      },
      l1TransferTip: "Never place 'to' after modal verbs like should (*'You should to rest'* ❌ → 'You should rest' ✅). For 'have to', 'to' is required (*'I have take'* ❌ → 'I have to take' ✅).",
      examples: [
        "If the fever continues, you should visit the nearest health clinic.",
        "You have to complete the entire 7-day course of medication.",
        "What should I do if I experience dizziness or allergic side effects?",
      ],
    },
    phoneticTargets: ["Initial /s/ clusters without prosthetic /e/ ('stomach', 'sprain', 'specialist')", "Voiced /ð/ vs voiceless /θ/ in health terms ('throat', 'breathe')"],
    spokenPrompts: [
      "Explain your symptoms clearly to a triage nurse or pharmacist.",
      "Give health advice to a coworker recovering from the flu or seasonal allergies.",
    ],
    createApplyTask: {
      title: "Clinic & Pharmacy Consultation Simulation",
      prompt: "Record an interactive audio roleplay describing two persistent symptoms to a doctor and repeating the prescribed dosage and care instructions back for verification.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-a2-module-5",
    order: 5,
    title: "Past Experiences, Memories & Storytelling",
    mission: "Narrate memorable past experiences, trips, and biographical milestones using simple past tense, irregular verbs, and time expressions.",
    competencyIds: [
      "EN.A2.SPEAK.NARRATE_PAST",
      "EN.A2.GRAMMAR.PAST_SIMPLE_IRREGULAR",
      "EN.A2.VOCAB.PAST_TIME_MARKERS",
      "EN.A2.PHON.ED_PAST_ENDINGS",
      "EN.A2.WRIT.PAST_PARAGRAPH",
    ],
    vocabulary: ["last weekend", "two years ago", "suddenly", "fortunately", "unforgettable", "childhood", "graduated", "journey", "experience", "overcame"],
    grammarStructures: [
      "When I was younger, I lived in [place].",
      "Last summer we traveled to [place] and visited...",
      "What did you do when the event occurred?",
      "We didn't expect the weather to change so quickly.",
    ],
    grammarSection: {
      conceptTitle: "Past Simple Regular (-ed Allomorphs) & High-Frequency Irregular Verbs",
      formula: "Affirmative: [Subject] + [Past Verb (Regular -ed / Irregular)] | Negative: [Subject] + [did not (didn't)] + [Base Verb]",
      explanation: "The Past Simple narrates completed actions at definite past times (yesterday, two years ago, in 2024). Regular verbs end in -ed, which has three phonetic rules: /t/ after voiceless sounds (watched, worked), /d/ after voiced sounds (lived, played), and /ɪd/ only after /t/ and /d/ (started, visited). In negative sentences and questions, 'did/didn't' carries the past tense, returning the main verb to base form.",
      forms: {
        affirmative: "Last year, I graduated from university and started my first job.",
        negative: "We didn't travel abroad last summer; we stayed in Samaná.",
        question: "Where did you go for your vacation? / Did you enjoy the festival?",
      },
      l1TransferTip: "Do not pronounce '-ed' as a separate extra syllable for every verb (*'work-ed'* ❌). Only add an extra syllable when the verb ends in 't' or 'd' ('need-ed', 'want-ed'). Also remember: after 'didn't', use base form (*'I didn't went'* ❌ → 'I didn't go' ✅).",
      examples: [
        "When I was sixteen, my family moved to Santo Domingo.",
        "We saw a wonderful baseball game at the stadium on Friday night.",
        "She didn't know about the meeting because her phone was out of battery.",
      ],
    },
    phoneticTargets: ["Regular past tense endings (/t/, /d/, /ɪd/ distinctions: 'walked' /t/, 'cleaned' /d/, 'decided' /ɪd/)", "Rhythm and pauses in chronological narrative speech"],
    spokenPrompts: [
      "Share an unforgettable trip or celebration that took place in the Dominican Republic or abroad.",
      "Narrate a challenging experience you had in the past and how you successfully resolved it.",
    ],
    createApplyTask: {
      title: "My Memorable Journey Story",
      prompt: "Record a 75-second narrative describing a memorable experience from your past, including where you went, who was with you, what happened, and what you learned.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-a2-module-6",
    order: 6,
    title: "Workplace Communication, Vocations & Professional Basics",
    mission: "Communicate professional responsibilities, workplace protocols, collaborate in simple team discussions, and write brief status updates.",
    competencyIds: [
      "EN.A2.SPEAK.WORKPLACE_DUTIES",
      "EN.A2.VOCAB.PROFESSIONS_OFFICE",
      "EN.A2.GRAMMAR.MODALS_OBLIGATION",
      "EN.A2.LISTEN.WORKPLACE_INSTRUCTIONS",
      "EN.A2.WRIT.STATUS_EMAIL",
    ],
    vocabulary: ["supervisor", "deadline", "colleague", "task assignment", "shift", "responsibilities", "deliverable", "collaborate", "equipment", "progress report"],
    grammarStructures: [
      "I am responsible for [gerund/noun].",
      "You must submit the report before the Friday deadline.",
      "Do we have to attend the team briefing this afternoon?",
      "Could you please review this draft when you have a moment?",
    ],
    grammarSection: {
      conceptTitle: "Professional Obligations ('have to', 'must', 'be responsible for + -ing')",
      formula: "[Subject] + [am/is/are responsible for] + [Verb-ing / Noun] | [Subject] + [have to / must] + [Base Verb]",
      explanation: "In workplace and vocational settings, describe your role and duties using 'be responsible for + gerund' (e.g. 'I am responsible for managing inventory'). Use 'have to' for external company rules and standard operating procedures, and 'could you please' for collaborative professional requests.",
      forms: {
        affirmative: "I am responsible for coordinating daily client deliveries and preparing reports.",
        negative: "Employees don't have to work on national holidays unless assigned to an emergency shift.",
        question: "Could you please send me the updated spreadsheet before 3:00 PM?",
      },
      l1TransferTip: "After prepositions like 'for', English verbs always take the gerund (-ing): *'responsible for organize'* ❌ → 'responsible for organizing' ✅.",
      examples: [
        "Our team is responsible for testing the new software updates.",
        "All staff members must wear identification badges inside the facility.",
        "Do we have to submit the monthly expense report today?",
      ],
    },
    phoneticTargets: ["Intelligible sentence stress in polite professional requests ('Could you please...?', 'Would it be possible...?')", "Reduction of 'have to' -> /hæftə/ and 'has to' -> /hæstə/ in natural connected speech"],
    spokenPrompts: [
      "Deliver a 1-minute elevator pitch detailing your current job role, key responsibilities, and primary daily tools.",
      "Politely request assistance or clarification from a senior team supervisor regarding a project deadline.",
    ],
    createApplyTask: {
      title: "Professional Workplace Profile",
      prompt: "Record a spoken overview of your vocational role, describing three key daily tasks, one upcoming project deadline, and how you collaborate with team members.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-a2-module-7",
    order: 7,
    title: "Future Intentions, Travel, Bookings & Reservations",
    mission: "Express future plans, intentions, and predictions; make hotel and airline bookings; negotiate travel arrangements with confidence.",
    competencyIds: [
      "EN.A2.SPEAK.FUTURE_PLANS",
      "EN.A2.GRAMMAR.FUTURE_GOING_TO_WILL",
      "EN.A2.VOCAB.TRAVEL_ACCOMMODATION",
      "EN.A2.LISTEN.RESERVATION_DETAILS",
      "EN.A2.PHON.CONTRACTIONS_FUTURE",
    ],
    vocabulary: ["reservation", "confirmation number", "check-in", "check-out", "itinerary", "amenities", "luggage allowance", "departure", "destination", "explore"],
    grammarStructures: [
      "I am going to travel to [destination] next month.",
      "I will call the hotel directly if there is any flight delay.",
      "What are you planning to do during your vacation?",
      "We would like to book a double room with breakfast included.",
    ],
    grammarSection: {
      conceptTitle: "Future Intentions ('be going to') vs. Instant Decisions & Promises ('will')",
      formula: "Prior Plan: [Subject] + [am/is/are going to] + [Base Verb] | Instant/Promise: [Subject] + [will ('ll)] + [Base Verb]",
      explanation: "Distinguish your future intentions: use 'be going to' when you have already planned or decided an action before speaking ('I am going to visit Punta Cana next month'). Use 'will' for spontaneous on-the-spot decisions, offers, or promises made at the moment of speech ('The phone is ringing; I'll answer it.').",
      forms: {
        affirmative: "We are going to stay at a hotel near the beach for four nights.",
        negative: "I won't (will not) book the flight until my visa is confirmed.",
        question: "Are you going to travel alone or with family? / Will you send me the confirmation email?",
      },
      l1TransferTip: "Dominican Spanish uses 'voy a viajar' seamlessly. In English, do not drop the verb 'to be' (*'I going to travel'* ❌ → 'I am going to travel' ✅). Also note that 'will' is contracted naturally in spoken English ('I'll help you').",
      examples: [
        "I am going to start an intensive web development course in January.",
        "Don't worry about the reservation; I will call the front desk right now.",
        "What time are they going to check out of the hotel tomorrow?",
      ],
    },
    phoneticTargets: ["Contractions in natural future speech ('I'll', 'we'll', 'going to' -> /ɡənə/)", "Pitch contours in reservation confirmations and dates"],
    spokenPrompts: [
      "Make a phone reservation for a hotel room specifying check-in dates, number of guests, and required amenities.",
      "Discuss your personal and professional development goals for the next twelve months.",
    ],
    createApplyTask: {
      title: "My Future Travel & Goal Itinerary",
      prompt: "Record a detailed spoken plan for an upcoming trip or career milestone: explain your destination/goal, timeline, preparations, and expected outcomes.",
      stage: "CREATE_APPLY",
    },
  },
  {
    id: "english-a2-module-8",
    order: 8,
    title: "A2 Capstone: Living More Independently in English",
    mission: "Execute an integrated multi-modal simulation demonstrating A2 communicative independence across transit, medical, shopping, workplace, and narrative domains.",
    competencyIds: [
      "EN.A2.CAPSTONE.INDEPENDENT_COMMUNICATION",
      "EN.A2.SPEAK.MULTI_TURN_CONVERSATION",
      "EN.A2.PHON.CONNECTED_SPEECH_INTELLIGIBILITY",
      "EN.A2.PRAG.SITUATIONAL_RESOLVE",
      "EN.A2.SYNTHESIS.4SKILL_INTEGRATION",
    ],
    vocabulary: [
      "independently",
      "contingency plan",
      "clarification",
      "resolution",
      "as scheduled",
      "on behalf of",
      "in summary",
      "moving forward",
    ],
    grammarStructures: [
      "In the past I struggled with [topic], but now I can [skill] with confidence.",
      "If there is an unexpected situation, I usually [action] first and then...",
      "Could you please clarify the details regarding [subject]?",
      "I am confident in my ability to handle daily spoken interactions in English.",
    ],
    grammarSection: {
      conceptTitle: "First Conditional (Real Possibilities) & Multi-Tense Synthesis",
      formula: "If + [Subject] + [Present Simple], [Subject] + [will / can / might] + [Base Verb]",
      explanation: "The First Conditional connects a real, possible condition in the present/future with its likely result. It is essential for negotiating plans, setting contingencies, and resolving problems independently. Combine it with past narratives and present habits to demonstrate full A2 speaking versatility.",
      forms: {
        affirmative: "If there is any delay with the flight, I will notify the hotel immediately.",
        negative: "If we don't confirm the booking today, the discount will expire.",
        question: "What will you do if the client requests an earlier delivery date?",
      },
      l1TransferTip: "Never use 'will' in the 'if' condition clause (*'If it will rain'* ❌ → 'If it rains, we will meet inside' ✅). Use Present Simple after 'if' and 'will' in the result clause.",
      examples: [
        "If I have free time this weekend, I will practice my pronunciation on Lurexa Coach.",
        "If you need any further details, I can provide the documentation tomorrow.",
        "We will resolve the issue quickly if everyone collaborates effectively.",
      ],
    },
    phoneticTargets: ["Comprehensive connected speech rhythm, appropriate pause phrasing, and clear consonant release"],
    spokenPrompts: [
      "Deliver a 2-minute comprehensive synthesis describing an unexpected travel/work contingency you resolved independently using English.",
      "Participate in a 4-turn multi-scenario AI dialogue balancing transactional negotiation, symptom reporting, and schedule adjustment.",
    ],
    createApplyTask: {
      title: "A2 Capstone Defense: My Spoken Independence Portfolio",
      prompt: "Record your complete A2 capstone spoken presentation demonstrating your ability to live, navigate, and communicate independently in English-speaking contexts.",
      stage: "CREATE_APPLY",
    },
  },
];
