export interface A2ModuleData {
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
