import type { CefrLevel, CoachTaskMode } from "@lurexa/types";

export interface CoachPracticePack {
  id: string;
  cefrLevel: CefrLevel;
  title: string;
  subtitle: string;
  description: string;
  mode: CoachTaskMode;
  targetCompetencies: string[];
  targetPhonemes: string[];
  l1InterferenceFocus?: string;
  scenarioRole: string;
  learnerGoal: string;
  openingLine: string;
  suggestedTurns: number;
  starterPhrases: string[];
  learnModuleLink?: string;
  isPublished: boolean;
}

export const COACH_PRACTICE_PACKS: CoachPracticePack[] = [
  // ==========================================
  // LEVEL A1 PRACTICE PACKS (1 TO 8)
  // ==========================================
  {
    id: "coach-a1-pack-1-meet-me",
    cefrLevel: "A1",
    title: "Pack 1: Meet Me",
    subtitle: "Greetings, Identity & First Introductions",
    description: "Practice greeting peers, stating your name and origin, asking simple follow-up questions, and establishing comfortable spoken presence.",
    mode: "guided_conversation",
    targetCompetencies: ["EN.A1.SPEAK.INTRODUCE_SELF", "EN.A1.PHON.INITIAL_S_CLUSTERS", "EN.A1.GRAMMAR.BE_PRESENT"],
    targetPhonemes: ["st", "sp", "sk"],
    l1InterferenceFocus: "DO-ENG-PRO-001 (Avoid initial vowel prefix on /s/ clusters like 'student', 'speak')",
    scenarioRole: "International Student Host",
    learnerGoal: "Introduce yourself, state your country of origin, and ask where your partner is from.",
    openingLine: "Hello! Welcome to the international student center. What is your name and where are you from?",
    suggestedTurns: 4,
    starterPhrases: [
      "Hello! My name is...",
      "I'm from the Dominican Republic.",
      "Nice to meet you!",
      "Where are you from?",
    ],
    learnModuleLink: "english-a1-module-1",
    isPublished: true,
  },
  {
    id: "coach-a1-pack-2-numbers-plans",
    cefrLevel: "A1",
    title: "Pack 2: Numbers & Schedules",
    subtitle: "Times, Dates, Phone Numbers & Appointments",
    description: "Exchange telephone numbers, confirm meeting times, and practice clear articulation of digits and dates.",
    mode: "guided_conversation",
    targetCompetencies: ["EN.A1.SPEAK.NUMBERS_TIME", "EN.A1.PHON.TEEN_TY_STRESS"],
    targetPhonemes: ["t", "d", "n"],
    l1InterferenceFocus: "Clear final consonant release on numbers (e.g. 'eight', 'fifteen' vs 'fifty')",
    scenarioRole: "Language Exchange Coordinator",
    learnerGoal: "Schedule a practice session by agreeing on a specific day, hour, and phone number.",
    openingLine: "Hi there! I'm organizing the Tuesday practice groups. What time are you free to practice?",
    suggestedTurns: 4,
    starterPhrases: [
      "I'm available on Tuesday at 4 PM.",
      "My phone number is...",
      "Could you please repeat the time?",
      "See you at four fifteen!",
    ],
    learnModuleLink: "english-a1-module-2",
    isPublished: true,
  },
  {
    id: "coach-a1-pack-3-people-around-me",
    cefrLevel: "A1",
    title: "Pack 3: People Around Me",
    subtitle: "Describing Family & Coworkers",
    description: "Describe friends, relatives, and colleagues using possessive adjectives and simple descriptive adjectives.",
    mode: "guided_practice",
    targetCompetencies: ["EN.A1.SPEAK.DESCRIBE_PEOPLE", "EN.A1.GRAMMAR.POSSESSIVES"],
    targetPhonemes: ["ð", "h"],
    l1InterferenceFocus: "Voiced /ð/ in 'this' and 'brother' without shifting to hard Spanish [d]",
    scenarioRole: "New Colleague",
    learnerGoal: "Share who you live with or work with and describe one key personality trait.",
    openingLine: "Hey! I saw the photo on your desk. Is that your family or your team?",
    suggestedTurns: 4,
    starterPhrases: [
      "This is my brother and this is my coworker.",
      "My brother is an engineer.",
      "She is very friendly and hardworking.",
      "Do you have a big family?",
    ],
    learnModuleLink: "english-a1-module-3",
    isPublished: true,
  },
  {
    id: "coach-a1-pack-4-my-day",
    cefrLevel: "A1",
    title: "Pack 4: My Daily Life",
    subtitle: "Routines, Habits & Time Markers",
    description: "Narrate your weekday habits, morning routines, and work schedule with present simple and 3rd person singular.",
    mode: "fluency_conversation",
    targetCompetencies: ["EN.A1.SPEAK.DAILY_ROUTINE", "EN.A1.PHON.THIRD_PERSON_S"],
    targetPhonemes: ["s", "z", "ɪz"],
    l1InterferenceFocus: "Audible sibilance on third-person verbs ('he works', 'she finishes')",
    scenarioRole: "Fitness & Wellness Coach",
    learnerGoal: "Describe what time you wake up, what you do in the morning, and when you study.",
    openingLine: "Good morning! Tell me a little about your regular weekday routine.",
    suggestedTurns: 4,
    starterPhrases: [
      "I wake up at six thirty every morning.",
      "First I make coffee, then I study English.",
      "In the afternoon, I work on my computer.",
      "What time do you usually finish?",
    ],
    learnModuleLink: "english-a1-module-4",
    isPublished: true,
  },
  {
    id: "coach-a1-pack-5-food-choices",
    cefrLevel: "A1",
    title: "Pack 5: Food & Choices",
    subtitle: "Ordering in a Café or Restaurant",
    description: "Politely order food, ask about menu prices, specify preferences, and request the bill.",
    mode: "guided_practice",
    targetCompetencies: ["EN.A1.SPEAK.ORDER_FOOD", "EN.A1.PHON.POLITE_INTONATION"],
    targetPhonemes: ["p", "b", "w"],
    l1InterferenceFocus: "Polite rising intonation on requests ('Could I have a bottle of water, please?')",
    scenarioRole: "Café Server",
    learnerGoal: "Order a drink and a light meal, ask for the price, and request the check.",
    openingLine: "Hi, welcome to Sunbeam Café! What can I get started for you today?",
    suggestedTurns: 4,
    starterPhrases: [
      "I would like a black coffee and a sandwich, please.",
      "How much is the fruit salad?",
      "Could we have the check, please?",
      "Thank you very much!",
    ],
    learnModuleLink: "english-a1-module-5",
    isPublished: true,
  },
  {
    id: "coach-a1-pack-6-find-the-place",
    cefrLevel: "A1",
    title: "Pack 6: Find the Place",
    subtitle: "Asking for & Understanding Directions",
    description: "Ask for wayfinding assistance, understand basic route instructions, and confirm landmarks.",
    mode: "guided_conversation",
    targetCompetencies: ["EN.A1.SPEAK.ASK_DIRECTIONS", "EN.A1.PHON.STOP_CONSONANTS"],
    targetPhonemes: ["t", "k", "str"],
    l1InterferenceFocus: "Clear articulation of /str/ in 'straight' without vowel epenthesis",
    scenarioRole: "City Information Desk",
    learnerGoal: "Ask for directions to the central bus terminal or metro station and repeat the route.",
    openingLine: "Hello! Can I help you find somewhere in the city?",
    suggestedTurns: 4,
    starterPhrases: [
      "Excuse me, how do I get to the metro station?",
      "Is it straight ahead or do I turn left?",
      "How many blocks is it from here?",
      "Thank you for your help!",
    ],
    learnModuleLink: "english-a1-module-6",
    isPublished: true,
  },
  {
    id: "coach-a1-pack-7-make-a-plan",
    cefrLevel: "A1",
    title: "Pack 7: Let's Make a Plan",
    subtitle: "Hobbies, Invitations & Availability",
    description: "Talk about favorite activities, invite a friend to an outing, and accept or politely decline.",
    mode: "guided_conversation",
    targetCompetencies: ["EN.A1.SPEAK.MAKE_PLANS", "EN.A1.PHON.VOWEL_CONTRASTS"],
    targetPhonemes: ["æ", "ʌ"],
    l1InterferenceFocus: "Distinguishing /æ/ in 'can' and /ʌ/ in 'fun'",
    scenarioRole: "Classmate",
    learnerGoal: "Propose an activity for Saturday afternoon and agree on a meeting place.",
    openingLine: "Hey! Are you doing anything fun this weekend?",
    suggestedTurns: 4,
    starterPhrases: [
      "I love playing baseball and listening to music.",
      "Would you like to go to the park on Saturday?",
      "That sounds great, let's meet at two.",
      "I'm sorry, I have to work, but how about Sunday?",
    ],
    learnModuleLink: "english-a1-module-7",
    isPublished: true,
  },
  {
    id: "coach-a1-pack-8-life-in-action",
    cefrLevel: "A1",
    title: "Pack 8: Life in Action",
    subtitle: "Integrated A1 Multi-Scenario Rehearsal",
    description: "An integrated challenge connecting greetings, schedules, ordering, and directions in a dynamic roleplay.",
    mode: "guided_practice",
    targetCompetencies: ["EN.A1.SPEAK.INTEGRATED_COMMUNICATION", "EN.A1.PHON.CONNECTED_SPEECH"],
    targetPhonemes: ["ə", "link"],
    l1InterferenceFocus: "Consonant-to-vowel catenation across phrases",
    scenarioRole: "Community Host",
    learnerGoal: "Navigate a 5-turn multi-topic exchange confirming attendance, sharing personal info, and asking questions.",
    openingLine: "Hello! Welcome to our community event. Tell me a bit about yourself and what you're hoping to do today!",
    suggestedTurns: 5,
    starterPhrases: [
      "Hello! I'm happy to be here.",
      "I'm studying English and I work in sales.",
      "Where is the main seminar room?",
      "Thank you so much, have a great day!",
    ],
    learnModuleLink: "english-a1-module-8",
    isPublished: true,
  },

  // ==========================================
  // LEVEL A2 PRACTICE PACKS
  // ==========================================
  {
    id: "coach-a2-pack-1-past-stories",
    cefrLevel: "A2",
    title: "A2: Past Trips & Milestones",
    subtitle: "Narrating Memorable Experiences",
    description: "Share past memories, vacation trips, and milestones with simple past verbs and time markers.",
    mode: "guided_conversation",
    targetCompetencies: ["EN.A2.SPEAK.NARRATE_PAST", "EN.A2.PHON.ED_PAST_ENDINGS"],
    targetPhonemes: ["t", "d", "ɪd"],
    l1InterferenceFocus: "Past regular -ed morpheme endings (/t/ in 'walked', /d/ in 'played', /ɪd/ in 'decided')",
    scenarioRole: "Travel Blogger",
    learnerGoal: "Describe a memorable vacation or past trip with where you went, what you did, and how it felt.",
    openingLine: "Welcome to our travel podcast! What was one of the most unforgettable trips you took in the past few years?",
    suggestedTurns: 4,
    starterPhrases: [
      "Two years ago, I traveled to the north coast.",
      "We visited beautiful beaches and enjoyed local food.",
      "It was an amazing experience because...",
      "What did you do during your last trip?",
    ],
    isPublished: true,
  },
  {
    id: "coach-a2-pack-2-workplace-basics",
    cefrLevel: "A2",
    title: "A2: Workplace Duties & Requests",
    subtitle: "Professional Responsibilities & Deadlines",
    description: "Discuss daily responsibilities, request assistance politely, and update team members on task progress.",
    mode: "guided_practice",
    targetCompetencies: ["EN.A2.SPEAK.WORKPLACE_DUTIES", "EN.A2.PHON.POLITE_REQUESTS"],
    targetPhonemes: ["kʊd", "wʊd"],
    l1InterferenceFocus: "Natural reduction of 'have to' -> /hæftə/ and polite modal intonation",
    scenarioRole: "Project Manager",
    learnerGoal: "State three key duties you manage and ask for a quick deadline extension on a deliverable.",
    openingLine: "Hi! Let's do a quick sync. How are your main tasks going this week?",
    suggestedTurns: 4,
    starterPhrases: [
      "I am responsible for customer support and reports.",
      "I have completed the first draft of the document.",
      "Could we please review the deadline for the final report?",
      "I will send the update by tomorrow morning.",
    ],
    isPublished: true,
  },

  // ==========================================
  // LEVEL B1 PRACTICE PACKS
  // ==========================================
  {
    id: "coach-b1-pack-1-opinion-defense",
    cefrLevel: "B1",
    title: "B1: Opinions, Perspectives & Reasons",
    subtitle: "Expressing & Justifying Viewpoints",
    description: "State your perspective on current topics, explain causes and effects, and respond constructively to differing opinions.",
    mode: "guided_conversation",
    targetCompetencies: ["EN.B1.SPEAK.EXPRESS_OPINIONS", "EN.B1.PHON.DISCOURSE_STRESS"],
    targetPhonemes: ["θ", "ð", "stressed-connectors"],
    l1InterferenceFocus: "Discourse connectors ('furthermore', 'on the other hand') without pauses",
    scenarioRole: "Discussion Moderator",
    learnerGoal: "Give your opinion on remote work vs office work with at least two justified reasons.",
    openingLine: "Today we are discussing the future of work. In your view, do people work better remotely or in an office?",
    suggestedTurns: 5,
    starterPhrases: [
      "In my opinion, remote work offers great flexibility.",
      "However, in-person collaboration helps build strong team culture.",
      "For example, when we work on complex projects...",
      "What are the main disadvantages in your experience?",
    ],
    isPublished: true,
  },

  // ==========================================
  // LEVEL B2 PRACTICE PACKS
  // ==========================================
  {
    id: "coach-b2-pack-1-negotiation",
    cefrLevel: "B2",
    title: "B2: Executive Negotiation & Trade-offs",
    subtitle: "Strategic Bargaining & Diplomatic Compromise",
    description: "Propose contractual conditions, counter initial offers politely, and negotiate mutually beneficial compromises.",
    mode: "professional_communication",
    targetCompetencies: ["EN.B2.SPEAK.EXECUTIVE_NEGOTIATION", "EN.B2.PHON.EMPHATIC_STRESS"],
    targetPhonemes: ["inversion-stress", "pitch-range"],
    l1InterferenceFocus: "Conditional inversions ('Provided that you guarantee delivery...')",
    scenarioRole: "Commercial Vendor Executive",
    learnerGoal: "Negotiate a 15% discount in exchange for a longer multi-year service commitment.",
    openingLine: "Thank you for meeting with us. We are eager to partner, but our current pricing structure is firm at standard rates.",
    suggestedTurns: 5,
    starterPhrases: [
      "We appreciate your proposal; however, our budget requires greater flexibility.",
      "Provided that you can adjust the unit price by 15%, we are prepared to commit to a two-year contract.",
      "Under these circumstances, both teams achieve long-term predictability.",
      "Let us review the service level agreements to finalize the terms.",
    ],
    isPublished: true,
  },

  // ==========================================
  // LEVEL C1 & C2 PRACTICE PACKS
  // ==========================================
  {
    id: "coach-c1-pack-1-scholarly-defense",
    cefrLevel: "C1",
    title: "C1: Epistemic & Scholarly Colloquium",
    subtitle: "Doctoral Discourse & High-Level Rhetoric",
    description: "Articulate abstract epistemological arguments, deconstruct complex methodologies, and defend nuanced philosophical positions.",
    mode: "academic_communication",
    targetCompetencies: ["EN.C1.SPEAK.SCHOLARLY_DISCOURSE", "EN.C1.PHON.RHETORICAL_PROSODY"],
    targetPhonemes: ["prosodic-meter", "complex-cadence"],
    l1InterferenceFocus: "Complex multisyllabic stress in academic nominalizations",
    scenarioRole: "Colloquium Chair",
    learnerGoal: "Defend an ethical AI governance framework against competing utilitarian arguments.",
    openingLine: "Let us turn to the ethical implications of autonomous decision systems. How do you reconcile algorithmic determinism with human agency?",
    suggestedTurns: 6,
    starterPhrases: [
      "Were we to adopt an exclusively utilitarian posture, we would inevitably marginalize systemic minority edge cases.",
      "The fundamental epistemological question rests not merely upon output accuracy, but on procedural transparency.",
      "Consequently, our framework establishes verifiable accountability mechanisms at every layer of deployment.",
    ],
    isPublished: true,
  },
  {
    id: "coach-c2-pack-1-sovereign-oratory",
    cefrLevel: "C2",
    title: "C2: Sovereign Oratory & Statesmanship",
    subtitle: "Pinnacle Native-Equivalent Eloquence",
    description: "Deliver spontaneous, intellectually commanding keynote oratory with effortless register modulation and pragmatic subtlety.",
    mode: "academic_communication",
    targetCompetencies: ["EN.C2.SPEAK.SOVEREIGN_ORATORY", "EN.C2.PHON.NATIVE_EQUIVALENCE"],
    targetPhonemes: ["subtle-pitch-modulation", "ironic-attenuation"],
    l1InterferenceFocus: "Flawless pragmatic inflection and deadpan rhetorical composure",
    scenarioRole: "Diplomatic Envoy",
    learnerGoal: "Deliver a high-stakes diplomatic address articulating a multilateral compromise on global digital infrastructure.",
    openingLine: "The assembly is seated. The floor is yours to deliver your delegation's opening address.",
    suggestedTurns: 6,
    starterPhrases: [
      "Seldom has the international community stood at such a pivotal juncture regarding sovereign technological autonomy.",
      "What is at stake is not merely regulatory harmonization, but the preservation of universal human dignity in the digital era.",
      "We invite our esteemed colleagues to forge a consensus grounded in mutual respect and unassailable transparency.",
    ],
    isPublished: true,
  },
];

export class CoachCatalogService {
  public static getAllPacks(): CoachPracticePack[] {
    return COACH_PRACTICE_PACKS.filter((p) => p.isPublished);
  }

  public static getPacksByLevel(level: CefrLevel): CoachPracticePack[] {
    return COACH_PRACTICE_PACKS.filter((p) => p.cefrLevel === level && p.isPublished);
  }

  public static getPackById(packId: string): CoachPracticePack | undefined {
    return COACH_PRACTICE_PACKS.find((p) => p.id === packId);
  }
}
