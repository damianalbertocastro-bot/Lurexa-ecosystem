import type { CefrLevel, DiagnosticTransferHighlight, PlacementSkill } from "@lurexa/types";
import { getServerFirestore } from "./firebase-admin.server";
import { FirestoreLearningEvidenceRepository } from "./learner-firestore.server";
import { refreshLearnerIntelligence } from "./learner-intelligence-pipeline.server";
import { A1_PRODUCTION_COURSE_ID, provisionA1ProductionCurriculum } from "./a1-production-curriculum.server";
import { ensureA2ProductionCurriculumInFirestore } from "./a2-production-curriculum.server";
import { ensureB1ProductionCurriculumInFirestore } from "./b1-production-curriculum.server";
import { ensureB2ProductionCurriculumInFirestore } from "./b2-production-curriculum.server";
import { ensureC1ProductionCurriculumInFirestore } from "./c1-production-curriculum.server";
import { ensureC2ProductionCurriculumInFirestore } from "./c2-production-curriculum.server";

export type { PlacementSkill };

export interface PlacementProbeItem {
  id: string;
  cefr: CefrLevel;
  skill: PlacementSkill;
  title: string;
  prompt: string;
  contextText?: string;
  audioPrompt?: string; // Text to be spoken or played
  options: string[];
  correctAnswer: string;
  explanation: string;
  focusArea: string;
}

export interface PlacementDiagnosticResult {
  estimatedLevel: CefrLevel;
  confidence: "low" | "medium" | "high";
  isProvisional: boolean;
  recommendedCourseId: string;
  recommendedLessonId: string;
  recommendedStartingPoint: string;
  overallScorePercent: number;
  skillBreakdown: Record<PlacementSkill, { score: number; maxScore: number; level: CefrLevel }>;
  priorityReinforcements: string[];
  transferHighlights: DiagnosticTransferHighlight[];
  rationale: string;
}

const ORGANIZATION_ID = "lurexa-self-paced";

// Comprehensive multi-skill item bank across CEFR A1 - C2 (60 items total)
export const PLACEMENT_ITEM_BANK: PlacementProbeItem[] = [
  // ==========================================
  // A1 FOUNDATIONS (10 Items)
  // ==========================================
  {
    id: "a1-gram-01",
    cefr: "A1",
    skill: "grammar",
    title: "Present Simple: Be",
    prompt: "Hello, my name ___ Carlos and I ___ from Santo Domingo.",
    options: ["is / am", "are / is", "am / are", "is / are"],
    correctAnswer: "is / am",
    explanation: "Use 'is' with third-person singular (my name) and 'am' with first-person singular (I).",
    focusArea: "Subject-verb agreement (be)",
  },
  {
    id: "a1-gram-02",
    cefr: "A1",
    skill: "grammar",
    title: "Possessive Determiners",
    prompt: "Maria is a doctor. ___ office is in Santiago.",
    options: ["Her", "His", "Their", "Your"],
    correctAnswer: "Her",
    explanation: "Use 'Her' for third-person singular female possessor.",
    focusArea: "Possessive adjectives",
  },
  {
    id: "a1-voc-01",
    cefr: "A1",
    skill: "vocabulary",
    title: "Everyday Introductions",
    prompt: "When you meet someone for the first time, what is the most polite response to 'Hi, I'm Sarah'?",
    options: ["Nice to meet you.", "I am fine, thank you.", "See you yesterday.", "Good appetite."],
    correctAnswer: "Nice to meet you.",
    explanation: "'Nice to meet you' is standard when introduced to someone for the first time.",
    focusArea: "Social formulaic greetings",
  },
  {
    id: "a1-voc-02",
    cefr: "A1",
    skill: "vocabulary",
    title: "Daily Routine Collocations",
    prompt: "Every morning, I ___ up at 6:30 AM and ___ a cup of coffee.",
    options: ["wake / drink", "wake / make", "stand / eat", "look / take"],
    correctAnswer: "wake / drink",
    explanation: "'Wake up' and 'drink coffee' are standard everyday routine collocations.",
    focusArea: "Daily life verbs",
  },
  {
    id: "a1-voc-03",
    cefr: "A1",
    skill: "vocabulary",
    title: "Family & Relationships",
    prompt: "My father's sister is my ___.",
    options: ["aunt", "niece", "cousin", "daughter"],
    correctAnswer: "aunt",
    explanation: "Your father's or mother's sister is your aunt.",
    focusArea: "Family member vocabulary",
  },
  {
    id: "a1-list-01",
    cefr: "A1",
    skill: "listening",
    title: "First Meeting Dialogue",
    audioPrompt: "Excuse me, where is the English classroom? It's on the second floor, next to room 204.",
    prompt: "Where is the English classroom located?",
    options: ["On the second floor", "In room 204", "On the first floor", "Outside the building"],
    correctAnswer: "On the second floor",
    explanation: "The speaker says 'It's on the second floor, next to room 204.'",
    focusArea: "Listening for simple factual location",
  },
  {
    id: "a1-list-02",
    cefr: "A1",
    skill: "listening",
    title: "Cafe Order & Price",
    audioPrompt: "That will be three dollars and fifty cents for the regular coffee, please.",
    prompt: "How much does the coffee cost?",
    options: ["$3.50", "$3.15", "$5.30", "$3.05"],
    correctAnswer: "$3.50",
    explanation: "The barista explicitly says 'three dollars and fifty cents' ($3.50).",
    focusArea: "Listening for numbers and monetary amounts",
  },
  {
    id: "a1-read-01",
    cefr: "A1",
    skill: "reading",
    title: "Store Opening Notice",
    contextText: "Welcome to Bella Vista Cafe! Open Monday to Saturday: 7:00 AM – 8:00 PM. Closed on Sundays.",
    prompt: "When can you visit Bella Vista Cafe?",
    options: ["On Friday afternoon", "On Sunday morning", "Every day at midnight", "Only on weekends"],
    correctAnswer: "On Friday afternoon",
    explanation: "The cafe is open Monday through Saturday between 7 AM and 8 PM.",
    focusArea: "Reading basic operational notices",
  },
  {
    id: "a1-phon-01",
    cefr: "A1",
    skill: "phonetics",
    title: "Initial S-Cluster Intelligibility",
    prompt: "Which word begins with a clean /s/ sound without adding an extra 'eh' sound before it?",
    options: ["student", "estudent", "eschool", "estudy"],
    correctAnswer: "student",
    explanation: "In standard English, /s/ clusters begin directly with the voiceless sibilant without an epenthetic vowel.",
    focusArea: "Dominican Spanish initial /s/ cluster transfer",
  },
  {
    id: "a1-phon-02",
    cefr: "A1",
    skill: "phonetics",
    title: "Short vs Long Vowels (/ɪ/ vs /iː/)",
    prompt: "Which pair of words contains two distinctly different vowel sounds in English?",
    options: ["ship / sheep", "seat / seat", "bean / been (same)", "meet / meat"],
    correctAnswer: "ship / sheep",
    explanation: "'Ship' has the short lax vowel /ɪ/ while 'sheep' has the long tense vowel /iː/.",
    focusArea: "Vowel duration and lax/tense contrast",
  },

  // ==========================================
  // A2 ELEMENTARY & EVERYDAY (12 Items)
  // ==========================================
  {
    id: "a2-gram-01",
    cefr: "A2",
    skill: "grammar",
    title: "Past Simple vs Present",
    prompt: "Yesterday, we ___ to the market and ___ fresh fruit.",
    options: ["went / bought", "go / buy", "went / buyed", "goes / bought"],
    correctAnswer: "went / bought",
    explanation: "'Go' has the irregular past form 'went' and 'buy' has the irregular past form 'bought'.",
    focusArea: "Irregular past simple forms",
  },
  {
    id: "a2-gram-02",
    cefr: "A2",
    skill: "grammar",
    title: "Comparatives & Superlatives",
    prompt: "This public transit line is ___ and ___ than driving during rush hour.",
    options: ["faster / cheaper", "more fast / more cheap", "fastest / cheapest", "more faster / cheaper"],
    correctAnswer: "faster / cheaper",
    explanation: "Short one-syllable adjectives form comparatives with '-er' (faster, cheaper).",
    focusArea: "Comparative adjective morphology",
  },
  {
    id: "a2-gram-03",
    cefr: "A2",
    skill: "grammar",
    title: "Quantifiers: Much vs Many",
    prompt: "We don't have ___ time, but there are ___ questions left.",
    options: ["much / many", "many / much", "a lot / much", "many / many"],
    correctAnswer: "much / many",
    explanation: "Use 'much' with uncountable nouns (time) and 'many' with countable plural nouns (questions).",
    focusArea: "Countable vs uncountable quantifiers",
  },
  {
    id: "a2-voc-01",
    cefr: "A2",
    skill: "vocabulary",
    title: "Airport & Travel Navigation",
    prompt: "Before you board the airplane, you must show your passport and ___.",
    options: ["boarding pass", "credit receipt", "luggage claim", "driver's license"],
    correctAnswer: "boarding pass",
    explanation: "A 'boarding pass' is the official airline document required to board.",
    focusArea: "Airport navigation vocabulary",
  },
  {
    id: "a2-voc-02",
    cefr: "A2",
    skill: "vocabulary",
    title: "Customer & Retail Interactions",
    prompt: "Customer: 'Excuse me, do you have this shirt in a larger ___?'",
    options: ["size", "number", "measurement", "price"],
    correctAnswer: "size",
    explanation: "In clothing retail, garment sizing is referred to as 'size' (Small, Medium, Large).",
    focusArea: "Shopping & clothing retail transactions",
  },
  {
    id: "a2-voc-03",
    cefr: "A2",
    skill: "vocabulary",
    title: "Health & Physical Symptoms",
    prompt: "I have a terrible headache and a high fever, so I need to make an ___ with the doctor.",
    options: ["appointment", "interview", "invitation", "agreement"],
    correctAnswer: "appointment",
    explanation: "You schedule a professional medical 'appointment' with a doctor or dentist.",
    focusArea: "Health and medical appointments",
  },
  {
    id: "a2-read-01",
    cefr: "A2",
    skill: "reading",
    title: "Public Transit Detour",
    contextText: "Bus Notice: Due to road work on Avenida Central, buses on Route 4 will stop on Calle Luna until Friday evening.",
    prompt: "Where should passengers take Route 4 this week?",
    options: ["On Calle Luna", "On Avenida Central", "At the central station", "Only on Friday"],
    correctAnswer: "On Calle Luna",
    explanation: "The notice states buses will temporarily stop on Calle Luna until Friday.",
    focusArea: "Extracting explicit information from public signs",
  },
  {
    id: "a2-read-02",
    cefr: "A2",
    skill: "reading",
    title: "Restaurant Menu Allergies",
    contextText: "Menu Note: All our bakery items may contain traces of peanuts and dairy. Gluten-free options are prepared in a dedicated separate oven upon request.",
    prompt: "How can a customer get a gluten-free pastry safely?",
    options: [
      "By requesting it so it is baked in the separate oven",
      "All items on the menu are automatically gluten-free",
      "By visiting only on weekends",
      "Gluten-free food is not available"
    ],
    correctAnswer: "By requesting it so it is baked in the separate oven",
    explanation: "The menu specifies gluten-free options are prepared in a dedicated separate oven upon request.",
    focusArea: "Scanning menus for dietary constraints",
  },
  {
    id: "a2-list-01",
    cefr: "A2",
    skill: "listening",
    title: "Schedule Adjustment",
    audioPrompt: "Hi Maria, our team meeting was moved from two o'clock to three thirty this afternoon.",
    prompt: "What time will the meeting begin?",
    options: ["3:30 PM", "2:00 PM", "2:30 PM", "3:00 PM"],
    correctAnswer: "3:30 PM",
    explanation: "The meeting was rescheduled from 2:00 to 3:30.",
    focusArea: "Listening for time and schedule updates",
  },
  {
    id: "a2-list-02",
    cefr: "A2",
    skill: "listening",
    title: "Transit Directions",
    audioPrompt: "To reach the medical center, take the blue metro line toward Downtown, get off at Station 5, and take Exit B.",
    prompt: "Which station exit should you take for the medical center?",
    options: ["Exit B at Station 5", "Exit A at Station 4", "The Central Terminal", "Exit 5 at Downtown Station"],
    correctAnswer: "Exit B at Station 5",
    explanation: "The speaker states 'get off at Station 5, and take Exit B.'",
    focusArea: "Following multi-step directional instructions",
  },
  {
    id: "a2-phon-01",
    cefr: "A2",
    skill: "phonetics",
    title: "Past Tense -ed Pronunciation",
    prompt: "In which of these words is the '-ed' ending pronounced as a separate extra syllable /ɪd/?",
    options: ["decided", "walked", "played", "worked"],
    correctAnswer: "decided",
    explanation: "Verbs ending in /t/ or /d/ add the full extra syllable /ɪd/ (e.g. de-ci-ded).",
    focusArea: "Regular past tense -ed allomorphs",
  },
  {
    id: "a2-phon-02",
    cefr: "A2",
    skill: "phonetics",
    title: "Word Stress in Compound Nouns",
    prompt: "Where is the primary stress placed in the compound word 'AIRPORT'?",
    options: ["On the first syllable: AIR-port", "On the second syllable: air-PORT", "Even stress on both syllables", "Stress on the final consonant"],
    correctAnswer: "On the first syllable: AIR-port",
    explanation: "In English compound nouns, primary tonic stress predominantly falls on the first element (AIR-port, POST office).",
    focusArea: "Compound noun stress patterns",
  },

  // ==========================================
  // B1 INTERMEDIATE & WORKPLACE (12 Items)
  // ==========================================
  {
    id: "b1-gram-01",
    cefr: "B1",
    skill: "grammar",
    title: "Present Perfect vs Past Simple",
    prompt: "I ___ in this city for five years, and I still love living here.",
    options: ["have lived", "lived", "am living", "was living"],
    correctAnswer: "have lived",
    explanation: "Present perfect is used for an action starting in the past that continues to the present.",
    focusArea: "Duration with present perfect",
  },
  {
    id: "b1-gram-02",
    cefr: "B1",
    skill: "grammar",
    title: "Modals of Obligation",
    prompt: "According to company security policies, all employees ___ wear their digital badges inside the server facility.",
    options: ["must", "might", "could", "would"],
    correctAnswer: "must",
    explanation: "'Must' indicates a strict regulatory requirement or mandatory obligation.",
    focusArea: "Modals of necessity and workplace rules",
  },
  {
    id: "b1-gram-03",
    cefr: "B1",
    skill: "grammar",
    title: "Second Conditional (Hypothetical)",
    prompt: "If I ___ more free time, I ___ learn how to play the guitar.",
    options: ["had / would", "have / will", "had / will", "would have / did"],
    correctAnswer: "had / would",
    explanation: "Second conditional uses 'if + past simple' with 'would + base verb' for present hypothetical situations.",
    focusArea: "Hypothetical conditionals",
  },
  {
    id: "b1-voc-01",
    cefr: "B1",
    skill: "vocabulary",
    title: "Collocations in Professional Context",
    prompt: "We need to ___ a decision before the end of the fiscal quarter.",
    options: ["make", "do", "take", "create"],
    correctAnswer: "make",
    explanation: "In English, the standard natural collocation is to 'make a decision'.",
    focusArea: "Make vs Do collocations",
  },
  {
    id: "b1-voc-02",
    cefr: "B1",
    skill: "vocabulary",
    title: "Workplace Phrasal Verbs",
    prompt: "Because the project manager was ill, we had to ___ the afternoon client presentation until next Tuesday.",
    options: ["call off", "put off", "take off", "look up"],
    correctAnswer: "put off",
    explanation: "'Put off' means to postpone or reschedule to a later time.",
    focusArea: "Workplace phrasal verbs (postpone)",
  },
  {
    id: "b1-voc-03",
    cefr: "B1",
    skill: "vocabulary",
    title: "False Cognates: Embarrassed vs Pregnant",
    prompt: "When I spilled coffee during the job interview, I felt extremely ___.",
    options: ["embarrassed", "pregnant", "disgusted", "compromised"],
    correctAnswer: "embarrassed",
    explanation: "'Embarrassed' means feeling awkward or ashamed. (Spanish 'embarazada' is a famous false friend meaning pregnant).",
    focusArea: "Dominican Spanish false cognate differentiation",
  },
  {
    id: "b1-read-01",
    cefr: "B1",
    skill: "reading",
    title: "Workplace Email & Milestones",
    contextText: "Although the initial client feedback was hesitant regarding our proposal timeline, our updated delivery milestones have reassured their executive team.",
    prompt: "What was the client's final reaction after seeing the updated milestones?",
    options: ["They felt reassured.", "They canceled the proposal.", "They remained hesitant.", "They requested more time."],
    correctAnswer: "They felt reassured.",
    explanation: "'reassured their executive team' indicates they gained confidence with the updated milestones.",
    focusArea: "Understanding contrasting clauses (although) and sentiment",
  },
  {
    id: "b1-read-02",
    cefr: "B1",
    skill: "reading",
    title: "Software User Instructions",
    contextText: "Before initiating the data migration, administrators must ensure all active user sessions are terminated. Otherwise, unsaved changes in open draft documents will be permanently overwritten.",
    prompt: "What is the primary risk if user sessions are not closed before migration?",
    options: [
      "Unsaved draft edits will be lost permanently",
      "The server hardware will overheat",
      "Admin passwords will expire immediately",
      "Data will automatically sync to external drives"
    ],
    correctAnswer: "Unsaved draft edits will be lost permanently",
    explanation: "The text explains 'unsaved changes in open draft documents will be permanently overwritten.'",
    focusArea: "Interpreting procedural conditional warnings",
  },
  {
    id: "b1-list-01",
    cefr: "B1",
    skill: "listening",
    title: "Customer Support Resolution",
    audioPrompt: "Thank you for holding. I see that your shipment was held temporarily at the Miami logistics center for customs verification, but it cleared inspection this morning and is scheduled for delivery on Tuesday.",
    prompt: "Why was the package delayed?",
    options: [
      "Customs inspection in Miami",
      "The customer provided an incorrect address",
      "Bad weather canceled the flight",
      "The item was returned to sender"
    ],
    correctAnswer: "Customs inspection in Miami",
    explanation: "The agent explains the shipment was held for 'customs verification' in Miami.",
    focusArea: "Listening for causality in customer support calls",
  },
  {
    id: "b1-list-02",
    cefr: "B1",
    skill: "listening",
    title: "Project Delegation Sync",
    audioPrompt: "Elena, could you double-check the final financial estimates on slide 8 before the eleven o'clock client sync? We need to ensure the exchange rate calculations reflect current market rates.",
    prompt: "What action does Elena need to complete before 11:00 AM?",
    options: [
      "Verify the financial calculations on slide 8",
      "Cancel the eleven o'clock meeting",
      "Send an invoice to the client",
      "Write a new slide presentation"
    ],
    correctAnswer: "Verify the financial calculations on slide 8",
    explanation: "The speaker specifically asks Elena to double-check the financial estimates on slide 8 before 11 AM.",
    focusArea: "Extracting actionable work delegation items",
  },
  {
    id: "b1-phon-01",
    cefr: "B1",
    skill: "phonetics",
    title: "Connected Speech & Linking",
    prompt: "When a speaker says 'pick it up', how are the words naturally linked in fluent speech?",
    options: ["pi-ki-tup", "pick... it... up", "peek-ee-toop", "pick-eat-up"],
    correctAnswer: "pi-ki-tup",
    explanation: "Consonant-to-vowel linking connects the final consonant of one word to the initial vowel of the next.",
    focusArea: "Consonant-to-vowel linking in connected speech",
  },
  {
    id: "b1-phon-02",
    cefr: "B1",
    skill: "phonetics",
    title: "Final Consonant Articulation (Coda Weakening)",
    prompt: "Which pronunciation ensures maximum clarity for a call center agent saying the word 'FIRST'?",
    options: [
      "Pronouncing both the /s/ and final /t/ cleanly (/fɜːrst/)",
      "Dropping the final /t/ completely ('fers')",
      "Adding a vowel at the end ('first-eh')",
      "Replacing the /t/ with a glottal stop"
    ],
    correctAnswer: "Pronouncing both the /s/ and final /t/ cleanly (/fɜːrst/)",
    explanation: "Articulating final consonant clusters cleanly prevents misinterpretation in professional phone communication.",
    focusArea: "Dominican coda weakening remediation in professional English",
  },

  // ==========================================
  // B2 UPPER-INTERMEDIATE & PROFESSIONAL (12 Items)
  // ==========================================
  {
    id: "b2-gram-01",
    cefr: "B2",
    skill: "grammar",
    title: "Mixed Conditionals & Regret",
    prompt: "If I ___ harder at university, I ___ working in a different industry today.",
    options: ["had worked / would be", "worked / will be", "would work / am", "had worked / had been"],
    correctAnswer: "had worked / would be",
    explanation: "A mixed conditional pairs past condition (past perfect) with present result (would + base verb).",
    focusArea: "Mixed conditionals (past condition, present outcome)",
  },
  {
    id: "b2-gram-02",
    cefr: "B2",
    skill: "grammar",
    title: "Passive Voice in Business Reports",
    prompt: "The new quarterly fiscal budget ___ by the board of directors before next Monday.",
    options: ["will have been approved", "will approve", "has being approved", "is approving"],
    correctAnswer: "will have been approved",
    explanation: "Future perfect passive ('will have been + past participle') expresses an action completed prior to a specific future point.",
    focusArea: "Complex passive voice & future perfect",
  },
  {
    id: "b2-gram-03",
    cefr: "B2",
    skill: "grammar",
    title: "Defining vs Non-Defining Relative Clauses",
    prompt: "Our regional headquarters, ___ was renovated last spring, now houses over three hundred software engineers.",
    options: ["which", "that", "where", "what"],
    correctAnswer: "which",
    explanation: "Non-defining relative clauses (separated by commas) providing supplementary information require 'which' for things, not 'that'.",
    focusArea: "Relative clause punctuation and pronoun selection",
  },
  {
    id: "b2-voc-01",
    cefr: "B2",
    skill: "vocabulary",
    title: "Business & Negotiation Idioms",
    prompt: "Before signing the partnership agreement, let's schedule a quick call so we are both on the same ___.",
    options: ["page", "boat", "track", "line"],
    correctAnswer: "page",
    explanation: "'To be on the same page' is a common professional idiom meaning to have a shared mutual understanding.",
    focusArea: "Professional collaboration idioms",
  },
  {
    id: "b2-voc-02",
    cefr: "B2",
    skill: "vocabulary",
    title: "Technical Feasibility & Project Risk",
    prompt: "After evaluating the infrastructure limitations, the engineering team concluded that the proposed cloud migration was not financially ___.",
    options: ["viable", "pliable", "docile", "tactful"],
    correctAnswer: "viable",
    explanation: "'Viable' means feasible, capable of working successfully and cost-effectively.",
    focusArea: "Analytical and business evaluation vocabulary",
  },
  {
    id: "b2-voc-03",
    cefr: "B2",
    skill: "vocabulary",
    title: "Advanced Phrasal Collocations",
    prompt: "The senior architect ___ a creative workaround to circumvent the third-party API latency issues.",
    options: ["came up with", "stood out for", "put up with", "ran out on"],
    correctAnswer: "came up with",
    explanation: "'Come up with' means to produce, devise, or invent an idea or solution.",
    focusArea: "Multi-word professional verbal expressions",
  },
  {
    id: "b2-read-01",
    cefr: "B2",
    skill: "reading",
    title: "Economic Analysis of Remote Work",
    contextText: "The rapid adoption of remote work infrastructure has not merely altered daily commuting patterns; it has fundamentally reorganized urban commercial real estate demand and talent retention strategies.",
    prompt: "According to the author, remote work has:",
    options: [
      "Had broad impacts beyond transportation, affecting real estate and talent.",
      "Only reduced traffic congestion in metropolitan centers.",
      "Lowered employee productivity across most commercial sectors.",
      "Made real estate investment in cities unnecessary.",
    ],
    correctAnswer: "Had broad impacts beyond transportation, affecting real estate and talent.",
    explanation: "'Not merely altered... but fundamentally reorganized...' expresses a multi-dimensional impact.",
    focusArea: "Synthesizing complex argumentation and discourse markers",
  },
  {
    id: "b2-read-02",
    cefr: "B2",
    skill: "reading",
    title: "Service Level Agreement (SLA) Clause",
    contextText: "Service credits shall constitute the customer's sole and exclusive financial remedy for any documented failure to meet the 99.9% monthly uptime threshold, provided that notice of such outage is submitted in writing within thirty days.",
    prompt: "What can a customer claim if the service uptime falls below 99.9%?",
    options: [
      "Service credits, provided they file written notice within 30 days",
      "Immediate full cash reimbursement regardless of notice",
      "Automatic renewal of the annual enterprise contract",
      "Compensation for secondary operational losses"
    ],
    correctAnswer: "Service credits, provided they file written notice within 30 days",
    explanation: "The clause restricts the remedy exclusively to service credits conditional on written notice within 30 days.",
    focusArea: "Interpreting contractual and legal English nuances",
  },
  {
    id: "b2-list-01",
    cefr: "B2",
    skill: "listening",
    title: "Agile Architecture Retrospective",
    audioPrompt: "While the frontend dashboard redesign was delivered on schedule, our primary deployment bottleneck stemmed from the legacy database schema refactoring, which required unexpected migration scripts.",
    prompt: "What caused the main deployment delay?",
    options: [
      "Legacy database schema refactoring",
      "Delays in the frontend UI redesign",
      "Network server hardware outages",
      "Lack of client design approval"
    ],
    correctAnswer: "Legacy database schema refactoring",
    explanation: "The speaker clarifies that the bottleneck 'stemmed from the legacy database schema refactoring'.",
    focusArea: "Identifying primary root causes in technical discourse",
  },
  {
    id: "b2-list-02",
    cefr: "B2",
    skill: "listening",
    title: "Executive Strategic Direction",
    audioPrompt: "Rather than competing directly on price in saturated domestic markets, our strategic focus for Q4 centers on expanding high-margin enterprise consulting services across the Caribbean basin.",
    prompt: "What is the organization's core strategy for the fourth quarter?",
    options: [
      "Focusing on high-margin enterprise services in the Caribbean",
      "Lowering prices aggressively across all domestic retail products",
      "Halting all international service expansion",
      "Acquiring local retail competitors"
    ],
    correctAnswer: "Focusing on high-margin enterprise services in the Caribbean",
    explanation: "The executive states the focus is expanding 'high-margin enterprise consulting services across the Caribbean basin'.",
    focusArea: "Synthesizing executive strategic intent",
  },
  {
    id: "b2-phon-01",
    cefr: "B2",
    skill: "phonetics",
    title: "Dental Fricative Distinction (/θ/ vs /t/ & /s/)",
    prompt: "In which sentence is the word 'THINK' pronounced correctly with the voiceless interdental fricative /θ/ rather than /t/ or /s/?",
    options: [
      "Tongue positioned lightly between the upper and lower teeth with unvoiced airflow (/θɪŋk/)",
      "Tongue making hard stop contact against the alveolar ridge ('tink')",
      "Teeth closed with sharp sibilant friction ('sink')",
      "Glottal friction at the back of the throat"
    ],
    correctAnswer: "Tongue positioned lightly between the upper and lower teeth with unvoiced airflow (/θɪŋk/)",
    explanation: "The English /θ/ is an interdental fricative produced by placing the tongue tip between the front teeth with steady air friction.",
    focusArea: "Interdental fricative articulation vs dental stop substitution",
  },
  {
    id: "b2-phon-02",
    cefr: "B2",
    skill: "phonetics",
    title: "Sentence Nuclear Intonation for Implication",
    prompt: "If a speaker says 'I didn't say SHE took the laptop' with heavy pitch accent on 'SHE', what is the implied meaning?",
    options: [
      "Someone else may have taken the laptop, not her.",
      "The laptop was definitely not stolen by anyone.",
      "The speaker never said anything about a laptop.",
      "The speaker took the laptop personally."
    ],
    correctAnswer: "Someone else may have taken the laptop, not her.",
    explanation: "Nuclear pitch accent on 'SHE' conveys contrastive focus, implying suspicion falls on another individual.",
    focusArea: "Pragmatic intonation and contrastive focus",
  },

  // ==========================================
  // C1 ADVANCED & FLUENCY (8 Items)
  // ==========================================
  {
    id: "c1-gram-01",
    cefr: "C1",
    skill: "grammar",
    title: "Inversion for Rhetorical Emphasis",
    prompt: "Rarely ___ such unanimous consensus among diverse stakeholders during policy negotiations.",
    options: ["have we witnessed", "we have witnessed", "we witnessed", "had witnessed we"],
    correctAnswer: "have we witnessed",
    explanation: "Negative and restrictive adverbs (rarely, seldom, scarcely) trigger subject-auxiliary inversion when placed at the beginning of a clause.",
    focusArea: "Negative inversion and sophisticated rhetorical style",
  },
  {
    id: "c1-gram-02",
    cefr: "C1",
    skill: "grammar",
    title: "Formal Mandative Subjunctive",
    prompt: "It is imperative that every team member ___ informed of compliance revisions prior to the regulatory audit.",
    options: ["be", "is", "was", "will be"],
    correctAnswer: "be",
    explanation: "Expressions of urgency or formal necessity (it is imperative that...) govern the mandative subjunctive bare base form 'be'.",
    focusArea: "Mandative subjunctive in formal registers",
  },
  {
    id: "c1-voc-01",
    cefr: "C1",
    skill: "vocabulary",
    title: "Nuanced Register & Figurative Precision",
    prompt: "The CEO decided to ___ the contentious regulatory dispute during the press conference rather than addressing it head-on.",
    options: ["skirt around", "run across", "make up", "break down"],
    correctAnswer: "skirt around",
    explanation: "'To skirt around an issue' means to deliberately avoid discussing or dealing with it directly.",
    focusArea: "Nuanced phrasal verbs and figurative register",
  },
  {
    id: "c1-voc-02",
    cefr: "C1",
    skill: "vocabulary",
    title: "Academic & Analytical Lexicon",
    prompt: "The author argues that algorithmic bias is not an isolated malfunction, but an ___ feature of datasets reflecting historical inequities.",
    options: ["inherent", "ephemeral", "incidental", "arbitrary"],
    correctAnswer: "inherent",
    explanation: "'Inherent' denotes an essential, permanent, and inseparable characteristic.",
    focusArea: "Advanced academic vocabulary",
  },
  {
    id: "c1-read-01",
    cefr: "C1",
    skill: "reading",
    title: "Epistemological Analysis of AI Cognition",
    contextText: "To conflate statistical pattern completion in large language models with genuine semantic comprehension is to commit a categorical error. While the former relies upon high-dimensional probabilistic distribution across linguistic tokens, the latter demands intentional grounding within phenomenological experience and communicative agency.",
    prompt: "The excerpt posits that the key distinction between LLMs and true comprehension is:",
    options: [
      "Statistical token modeling lacks grounded intentionality and conscious agency",
      "LLMs compute probabilistic vectors too slowly for real dialogue",
      "Human cognition operates entirely through statistical distributions",
      "Language models will never generate grammatically coherent syntax"
    ],
    correctAnswer: "Statistical token modeling lacks grounded intentionality and conscious agency",
    explanation: "The author explicitly differentiates statistical token distribution from intentional grounding in experience.",
    focusArea: "Critical analysis of abstract philosophical and scientific texts",
  },
  {
    id: "c1-list-01",
    cefr: "C1",
    skill: "listening",
    title: "Sociolinguistic Lecture Excerpt",
    audioPrompt: "In Caribbean contact linguistics, the phenomenon of syllable-coda reduction cannot be dismissed as random phonological erosion; rather, it reflects regularized historical substrate influences interacting with syllable-timed rhythmic constraints.",
    prompt: "According to the lecturer, Caribbean syllable-coda reduction:",
    options: [
      "Is governed by historical substrate influences and rhythmic constraints",
      "Is purely random and lacks systematic linguistic patterns",
      "Only occurs in modern technological vocabulary",
      "Prevents speakers from acquiring any secondary languages"
    ],
    correctAnswer: "Is governed by historical substrate influences and rhythmic constraints",
    explanation: "The speaker explains it reflects regularized historical substrate influences and syllable-timed constraints.",
    focusArea: "Comprehending dense academic discourse and theoretical claims",
  },
  {
    id: "c1-phon-01",
    cefr: "C1",
    skill: "phonetics",
    title: "Rhythm & Isochrony Control",
    prompt: "Standard English is a 'stress-timed' language (intervals between stressed syllables are relatively equal). How should unstressed function words (to, for, at) be delivered for natural English rhythm?",
    options: [
      "Reduced with weak vowel forms (schwa /ə/) and shorter duration",
      "Pronounced with full Spanish vowel clarity and equal length",
      "Over-emphasized with louder volume than nouns and verbs",
      "Completely silenced without pronunciation"
    ],
    correctAnswer: "Reduced with weak vowel forms (schwa /ə/) and shorter duration",
    explanation: "In stress-timed English, unstressed grammatical function words naturally reduce to schwa /ə/ to preserve rhythmic isochrony.",
    focusArea: "Stress-timing, reduction, and schwa centralization",
  },
  {
    id: "c1-phon-02",
    cefr: "C1",
    skill: "phonetics",
    title: "Diplomatic Intonation & Tentativeness",
    prompt: "Which intonation contour conveys polite, non-confrontational nuance when offering counter-proposals during executive negotiations?",
    options: [
      "Fall-rise intonation curve indicating openness to dialogue",
      "Abrupt steep falling tone indicating finality",
      "Monotone flat pitch throughout the statement",
      "Staccato loud bursts on every syllable"
    ],
    correctAnswer: "Fall-rise intonation curve indicating openness to dialogue",
    explanation: "A fall-rise intonation contour indicates tentativeness, politeness, and collaborative openness in high-stakes negotiations.",
    focusArea: "Pragmatic intonation in diplomatic registers",
  },

  // ==========================================
  // C2 NATIVE-LIKE MASTERY (6 Items)
  // ==========================================
  {
    id: "c2-gram-01",
    cefr: "C2",
    skill: "grammar",
    title: "Complex Ellipsis & Nominalization",
    prompt: "Had it not been for the interim committee's timely intervention, the resolution ___ into endless procedural gridlock.",
    options: [
      "would inevitably have degenerated",
      "had inevitably degenerated",
      "will inevitably degenerate",
      "would degenerate inevitably have"
    ],
    correctAnswer: "would inevitably have degenerated",
    explanation: "Third conditional inversion ('Had it not been...') with past hypothetical consequence takes 'would + adverb + have + past participle'.",
    focusArea: "Inverted conditional structures with complex auxiliary positioning",
  },
  {
    id: "c2-voc-01",
    cefr: "C2",
    skill: "vocabulary",
    title: "High-Register Rhetorical Precision",
    prompt: "The spokesperson attempted to ___ the legislative intent behind the subsidy package, rendering the statutory text almost incomprehensible to the press.",
    options: ["obfuscate", "delineate", "recapitulate", "vindicate"],
    correctAnswer: "obfuscate",
    explanation: "'To obfuscate' means to render obscure, unclear, or intentionally difficult to understand.",
    focusArea: "Sovereign rhetorical vocabulary",
  },
  {
    id: "c2-voc-02",
    cefr: "C2",
    skill: "vocabulary",
    title: "Idiomatic Mastery & Cultural Allusions",
    prompt: "Despite the initial enthusiasm for the startup merger, differing corporate cultures proved to be the ultimate ___ heel of the venture.",
    options: ["Achilles'", "Promethean", "Pandora's", "Sisyphus'"],
    correctAnswer: "Achilles'",
    explanation: "An 'Achilles' heel' is an established cultural idiom denoting a vulnerable point or fatal flaw in an otherwise strong entity.",
    focusArea: "Classical allusions and idiomatic mastery",
  },
  {
    id: "c2-read-01",
    cefr: "C2",
    skill: "reading",
    title: "Jurisprudential & Constitutional Analysis",
    contextText: "The doctrine of proportionality in constitutional adjudication functions not as a mechanical algorithmic calculus, but as an interpretive prism through which judicial discretion balances state prerogative against fundamental liberties. In doing so, it eschews categorical absolutes in favor of contextualized normative calibration.",
    prompt: "The passage asserts that the doctrine of proportionality:",
    options: [
      "Employs contextual normative judgment rather than rigid formulaic absolutes",
      "Strictly enforces immutable state authority over private rights",
      "Relies entirely on mathematical and computational metrics",
      "Eliminates judicial interpretation from constitutional disputes"
    ],
    correctAnswer: "Employs contextual normative judgment rather than rigid formulaic absolutes",
    explanation: "The author characterizes proportionality as 'contextualized normative calibration' that 'eschews categorical absolutes'.",
    focusArea: "Deconstructing dense jurisprudential texts",
  },
  {
    id: "c2-list-01",
    cefr: "C2",
    skill: "listening",
    title: "Multilateral Diplomatic Briefing",
    audioPrompt: "While several delegates expressed reservations regarding the non-binding carbon offset mechanisms, the overarching plenary consensus favored an iterative ratification framework over immediate statutory mandates.",
    prompt: "What procedural approach was ultimately preferred by the plenary delegation?",
    options: [
      "An iterative ratification framework",
      "Immediate binding statutory mandates",
      "Complete dissolution of the offset agreement",
      "Unconditional economic sanctions"
    ],
    correctAnswer: "An iterative ratification framework",
    explanation: "The speaker confirms the plenary consensus favored an 'iterative ratification framework'.",
    focusArea: "Interpreting nuanced multilateral diplomatic discourse",
  },
  {
    id: "c2-phon-01",
    cefr: "C2",
    skill: "phonetics",
    title: "Sovereign Phonological Agility & Style Shifting",
    prompt: "A C2 speaker demonstrates 'sovereign phonological control' when they can:",
    options: [
      "Effortlessly adjust register, speech rate, and intonational nuance across formal, colloquial, and international settings without sacrificing intelligibility",
      "Imitate only one regional accent while erasing their native cultural identity",
      "Speak continuously at maximum speed without pausing for breath",
      "Avoid all contractions and connected speech in casual dialogue"
    ],
    correctAnswer: "Effortlessly adjust register, speech rate, and intonational nuance across formal, colloquial, and international settings without sacrificing intelligibility",
    explanation: "Lurexa pedagogical standards define C2 mastery as flexible, context-sensitive communicative agility, not accent erasure.",
    focusArea: "Contextual stylistic and phonological mastery",
  },
];

export class PlacementAssessmentService {
  /**
   * Returns initial screening probe set representing balanced A1-A2 baseline competencies.
   */
  static getInitialProbes(): PlacementProbeItem[] {
    return PLACEMENT_ITEM_BANK.filter((item) => item.cefr === "A1" || item.cefr === "A2");
  }

  /**
   * Returns complete comprehensive item bank for exhaustive calibration.
   */
  static getAllProbes(): PlacementProbeItem[] {
    return [...PLACEMENT_ITEM_BANK];
  }

  /**
   * Evaluates answers and determines the next adaptive probe items or completion.
   */
  static getAdaptiveNextProbes(currentAnswers: Record<string, string>): {
    completed: boolean;
    nextItems: PlacementProbeItem[];
    currentPerformanceLevel: CefrLevel;
  } {
    const answeredItems = PLACEMENT_ITEM_BANK.filter((item) => currentAnswers[item.id] !== undefined);
    if (answeredItems.length === 0) {
      return {
        completed: false,
        nextItems: this.getInitialProbes(),
        currentPerformanceLevel: "A1",
      };
    }

    const correctCount = answeredItems.filter(
      (item) => currentAnswers[item.id]?.trim().toLowerCase() === item.correctAnswer.toLowerCase()
    ).length;
    const accuracy = correctCount / answeredItems.length;

    const hasAItems = answeredItems.some((item) => item.cefr === "A1" || item.cefr === "A2");
    const hasBItems = answeredItems.some((item) => item.cefr === "B1" || item.cefr === "B2");
    const hasCItems = answeredItems.some((item) => item.cefr === "C1" || item.cefr === "C2");

    // If learner performed well on A1/A2 (>= 70%) and hasn't seen B1/B2, serve B1/B2 probe set
    if (hasAItems && !hasBItems && accuracy >= 0.70) {
      const bItems = PLACEMENT_ITEM_BANK.filter((item) => item.cefr === "B1" || item.cefr === "B2");
      return {
        completed: false,
        nextItems: bItems,
        currentPerformanceLevel: "B1",
      };
    }

    // If learner performed well on B1/B2 (>= 75%) and hasn't seen C1/C2, serve C1/C2 probe set
    if (hasBItems && !hasCItems && accuracy >= 0.75) {
      const cItems = PLACEMENT_ITEM_BANK.filter((item) => item.cefr === "C1" || item.cefr === "C2");
      return {
        completed: false,
        nextItems: cItems,
        currentPerformanceLevel: "C1",
      };
    }

    // Sufficient diagnostic evidence collected
    return {
      completed: true,
      nextItems: [],
      currentPerformanceLevel: accuracy >= 0.88 ? (hasCItems ? "C1" : "B2") : accuracy >= 0.65 ? (hasBItems ? "B1" : "A2") : "A1",
    };
  }

  /**
   * Finalizes placement assessment, calculates multi-skill breakdown,
   * updates the Learner Model via Core, and persists trusted evidence.
   */
  static async finalizePlacement(input: {
    actorId: string;
    email: string | null;
    goal?: string;
    answers: Record<string, string>;
  }): Promise<PlacementDiagnosticResult> {
    const answeredItems = PLACEMENT_ITEM_BANK.filter((item) => input.answers[item.id] !== undefined);
    const totalAnswered = Math.max(1, answeredItems.length);

    let correctTotal = 0;
    const skillStats: Record<PlacementSkill, { correct: number; total: number }> = {
      listening: { correct: 0, total: 0 },
      speaking: { correct: 0, total: 0 },
      reading: { correct: 0, total: 0 },
      writing: { correct: 0, total: 0 },
      vocabulary: { correct: 0, total: 0 },
      grammar: { correct: 0, total: 0 },
      phonetics: { correct: 0, total: 0 },
    };

    const failedFocusAreas: string[] = [];

    for (const item of answeredItems) {
      const isCorrect = input.answers[item.id]?.trim().toLowerCase() === item.correctAnswer.toLowerCase();
      skillStats[item.skill].total += 1;
      if (isCorrect) {
        correctTotal += 1;
        skillStats[item.skill].correct += 1;
      } else {
        failedFocusAreas.push(item.focusArea);
      }
    }

    // Default missing skills if not tested directly in screening probes
    if (skillStats.speaking.total === 0) {
      skillStats.speaking = { correct: skillStats.phonetics.correct || 1, total: skillStats.phonetics.total || 1 };
    }
    if (skillStats.writing.total === 0) {
      skillStats.writing = { correct: skillStats.grammar.correct || 1, total: skillStats.grammar.total || 1 };
    }

    const overallScorePercent = Math.round((correctTotal / totalAnswered) * 100);

    // Calculate level per skill
    function calculateSkillLevel(correct: number, total: number): CefrLevel {
      if (total === 0) return "A1";
      const ratio = correct / total;
      if (ratio >= 0.9) return "B2";
      if (ratio >= 0.75) return "B1";
      if (ratio >= 0.5) return "A2";
      return "A1";
    }

    // Overall CEFR determination
    let estimatedLevel: CefrLevel = "A1";
    let recommendedCourseId = A1_PRODUCTION_COURSE_ID;
    let recommendedLessonId = "a1-introduce-yourself";
    let recommendedStartingPoint = "English A1 Foundations — Lesson 1 (Meet & Greet)";
    let rationale = "Recommended entry at A1 Foundations to build communicative confidence and clean pronunciation habits.";

    if (overallScorePercent >= 94 && answeredItems.some((i) => i.cefr === "C1")) {
      estimatedLevel = "C2";
      recommendedCourseId = "english-c2-mastery";
      recommendedLessonId = "c2-m1-lesson-1";
      recommendedStartingPoint = "English C2 Native-Like Mastery — Module 1";
      rationale = "Exceptional mastery of pragmatic nuance, diplomatic ambiguity, and classical rhetoric. Recommended entry at sovereign C2 level.";
    } else if (overallScorePercent >= 88 && answeredItems.some((i) => i.cefr === "C1")) {
      estimatedLevel = "C1";
      recommendedCourseId = "english-c1-advanced-fluency";
      recommendedLessonId = "c1-m1-lesson-1";
      recommendedStartingPoint = "English C1 Advanced & Academic Fluency — Module 1";
      rationale = "High command across discourse, nuance, and structural control. Recommended placement in doctoral-level advanced modules.";
    } else if (overallScorePercent >= 80 && answeredItems.some((i) => i.cefr === "B1" || i.cefr === "B2")) {
      estimatedLevel = "B2";
      recommendedCourseId = "english-b2-fluency-communication";
      recommendedLessonId = "b2-m1-lesson-1";
      recommendedStartingPoint = "English B2 Fluency & Professional Communication — Module 1";
      rationale = "Strong mastery of complex syntax and connected speech. Recommended placement in upper-intermediate fluency practice.";
    } else if (overallScorePercent >= 65 && answeredItems.some((i) => i.cefr === "B1")) {
      estimatedLevel = "B1";
      recommendedCourseId = "english-b1-independent-speaker";
      recommendedLessonId = "b1-m1-lesson-1";
      recommendedStartingPoint = "English B1 Intermediate Track — Module 1";
      rationale = "Solid foundational grammar and listening comprehension. Ready for independent communication and varied registers.";
    } else if (overallScorePercent >= 50) {
      estimatedLevel = "A2";
      recommendedCourseId = "english-a2-everyday-conversations";
      recommendedLessonId = "a2-make-a-plan";
      recommendedStartingPoint = "English A2 Everyday Conversations — Module 1";
      rationale = "Demonstrated control of basic greetings and simple past forms. Ready for everyday conversational scenarios.";
    }

    const priorityReinforcements = Array.from(new Set(failedFocusAreas)).slice(0, 4);
    if (priorityReinforcements.length === 0) {
      priorityReinforcements.push("Spoken fluency refinement", "Connected speech & rhythm");
    }

    // Identify Dominican Spanish Transfer Highlights
    const transferHighlights: DiagnosticTransferHighlight[] = [];
    if (answeredItems.some((i) => i.id === "a1-phon-01" && input.answers[i.id]?.toLowerCase() !== i.correctAnswer.toLowerCase())) {
      transferHighlights.push({
        category: "s_cluster_epenthesis",
        detectedPattern: "Initial /s/ consonant cluster epenthesis (e.g., 'estudent')",
        expectedPattern: "Direct voiceless sibilant onset /stjuːdənt/",
        confidenceScore: 0.88,
        pedagogicalNote: "Dominican Spanish speakers often add a prosthetic vowel before initial s-clusters. Targeted phonetics practice builds direct onset control.",
        suggestedFocusModule: "DO-ENG-PRO-002",
      });
    }
    if (answeredItems.some((i) => i.id === "b1-phon-02" && input.answers[i.id]?.toLowerCase() !== i.correctAnswer.toLowerCase())) {
      transferHighlights.push({
        category: "coda_weakening",
        detectedPattern: "Syllable-final consonant coda weakening (e.g., dropping /t/, /s/, /d/)",
        expectedPattern: "Clean release of final consonant clusters (e.g. /fɜːrst/)",
        confidenceScore: 0.86,
        pedagogicalNote: "Dominican Spanish features widespread coda debuccalization. Targeted acoustic articulatory drills in Coach reinforce clean terminal consonants.",
        suggestedFocusModule: "DO-ENG-PRO-004",
      });
    }
    if (answeredItems.some((i) => i.id === "b2-phon-01" && input.answers[i.id]?.toLowerCase() !== i.correctAnswer.toLowerCase())) {
      transferHighlights.push({
        category: "interdental_stopping",
        detectedPattern: "Interdental /θ/ and /ð/ replaced by dental stops /t/ or /d/",
        expectedPattern: "Light interdental frication (/θɪŋk/ vs 'tink')",
        confidenceScore: 0.84,
        pedagogicalNote: "Dominican Spanish lacks phonemic /θ/. Explicit interdental placement exercises ensure intelligibility in professional communications.",
        suggestedFocusModule: "DO-ENG-PRO-008",
      });
    }
    if (answeredItems.some((i) => i.id === "a2-gram-01" && input.answers[i.id]?.toLowerCase() !== i.correctAnswer.toLowerCase())) {
      transferHighlights.push({
        category: "third_person_inflection",
        detectedPattern: "Irregular past tense simplification",
        expectedPattern: "Irregular past forms (went, bought)",
        confidenceScore: 0.82,
        pedagogicalNote: "Dominican Spanish learners benefit from deliberate retrieval practice with irregular past morphology in conversational narratives.",
        suggestedFocusModule: "DO-ENG-PRO-006",
      });
    }

    const skillBreakdown: Record<PlacementSkill, { score: number; maxScore: number; level: CefrLevel }> = {
      listening: {
        score: skillStats.listening.correct,
        maxScore: skillStats.listening.total,
        level: calculateSkillLevel(skillStats.listening.correct, skillStats.listening.total),
      },
      speaking: {
        score: skillStats.speaking.correct,
        maxScore: skillStats.speaking.total,
        level: calculateSkillLevel(skillStats.speaking.correct, skillStats.speaking.total),
      },
      grammar: {
        score: skillStats.grammar.correct,
        maxScore: skillStats.grammar.total,
        level: calculateSkillLevel(skillStats.grammar.correct, skillStats.grammar.total),
      },
      vocabulary: {
        score: skillStats.vocabulary.correct,
        maxScore: skillStats.vocabulary.total,
        level: calculateSkillLevel(skillStats.vocabulary.correct, skillStats.vocabulary.total),
      },
      reading: {
        score: skillStats.reading.correct,
        maxScore: skillStats.reading.total,
        level: calculateSkillLevel(skillStats.reading.correct, skillStats.reading.total),
      },
      writing: {
        score: skillStats.writing.correct,
        maxScore: skillStats.writing.total,
        level: calculateSkillLevel(skillStats.writing.correct, skillStats.writing.total),
      },
      phonetics: {
        score: skillStats.phonetics.correct,
        maxScore: skillStats.phonetics.total,
        level: calculateSkillLevel(skillStats.phonetics.correct, skillStats.phonetics.total),
      },
    };

    const confidence: "low" | "medium" | "high" =
      totalAnswered >= 10 ? "high" : totalAnswered >= 5 ? "medium" : "low";
    const isProvisional = confidence !== "high";

    // Save trusted placement evidence record into Core
    // Provision target curriculum if needed
    try {
      if (estimatedLevel === "A1") {
        await provisionA1ProductionCurriculum();
      } else if (estimatedLevel === "A2") {
        await ensureA2ProductionCurriculumInFirestore();
      } else if (estimatedLevel === "B1") {
        await ensureB1ProductionCurriculumInFirestore();
      } else if (estimatedLevel === "B2") {
        await ensureB2ProductionCurriculumInFirestore();
      } else if (estimatedLevel === "C1") {
        await ensureC1ProductionCurriculumInFirestore();
      } else if (estimatedLevel === "C2") {
        await ensureC2ProductionCurriculumInFirestore();
      }
    } catch (provisionErr) {
      console.warn("Curriculum provisioning warning during placement:", provisionErr);
    }

    const db = getServerFirestore();
    const now = new Date().toISOString();
    const evidenceRepository = new FirestoreLearningEvidenceRepository();
    const placementEvidenceId = `placement-${input.actorId}-${Date.now()}`;

    const organizationReference = db.collection("organizations").doc(ORGANIZATION_ID);
    const membershipReference = organizationReference.collection("members").doc(input.actorId);
    const userMembershipReference = db.collection("user-memberships").doc(input.actorId).collection("organizations").doc(ORGANIZATION_ID);

    await Promise.all([
      organizationReference.set(
        {
          id: ORGANIZATION_ID,
          name: "Lurexa Self-Paced Learning",
          slug: "lurexa-self-paced",
          ownerId: "lurexa-system",
          plan: "platform",
          updatedAt: now,
        },
        { merge: true }
      ),
      membershipReference.set(
        {
          userId: input.actorId,
          orgId: ORGANIZATION_ID,
          role: "student",
          joinedAt: now,
          source: "adaptive-placement",
        },
        { merge: true }
      ),
      userMembershipReference.set(
        {
          userId: input.actorId,
          orgId: ORGANIZATION_ID,
          role: "student",
          joinedAt: now,
          source: "adaptive-placement",
        },
        { merge: true }
      ),
      db.collection("learners").doc(input.actorId).set(
        {
          learnerId: input.actorId,
          email: input.email,
          placement: {
            completed: true,
            estimatedLevel,
            confidence,
            isProvisional,
            overallScorePercent,
            skillBreakdown,
            priorityReinforcements,
            transferHighlights,
            recommendedCourseId,
            recommendedLessonId,
            completedAt: now,
          },
          onboarding: {
            path: "adaptive-placement",
            completedAt: now,
            recommendation: `${estimatedLevel} Diagnostic Placement`,
            recommendedCourseId,
            confidence,
          },
          proficiency: {
            cefr: estimatedLevel,
            confidence,
            overallScorePercent,
            updatedAt: now,
          },
          updatedAt: now,
        },
        { merge: true }
      ),
      db.collection("learner-profiles").doc(input.actorId).set(
        {
          learnerId: input.actorId,
          email: input.email,
          ...(input.goal ? { goals: [input.goal] } : {}),
          placement: {
            estimatedLevel,
            confidence,
            isProvisional,
            overallScorePercent,
            skillBreakdown,
            priorityReinforcements,
            transferHighlights,
            recommendedCourseId,
            recommendedLessonId,
            completedAt: now,
          },
          onboarding: {
            path: "adaptive-placement",
            completedAt: now,
            recommendation: `${estimatedLevel} Diagnostic Placement`,
            recommendedCourseId,
            confidence,
          },
          proficiency: {
            cefr: estimatedLevel,
            confidence,
            overallScorePercent,
            updatedAt: now,
          },
          updatedAt: now,
        },
        { merge: true }
      ),
      evidenceRepository.append({
        contractVersion: "1",
        id: placementEvidenceId,
        learnerId: input.actorId,
        organizationId: ORGANIZATION_ID,
        source: {
          product: "learn",
          courseId: recommendedCourseId,
          lessonId: recommendedLessonId,
          activityId: "adaptive-placement-test",
        },
        type: "assessment_result",
        observedAt: now,
        dataClassification: "sensitive",
        payload: {
          estimatedLevel,
          overallScorePercent,
          confidence,
          isProvisional,
          skillBreakdown,
          priorityReinforcements,
          transferHighlights,
          itemsAnsweredCount: totalAnswered,
          scope: "adaptive_cefr_diagnostic",
        },
        provenance: {
          method: "system_observed",
          actorId: input.actorId,
          confidence: confidence === "high" ? 0.9 : 0.7,
        },
      }),
    ]);

    // Refresh Learner Model Mind intelligence
    try {
      await refreshLearnerIntelligence({
        learnerId: input.actorId,
        organizationId: ORGANIZATION_ID,
        requestedDomains: ["proficiency", "goal"],
      });
    } catch (mindError) {
      console.warn("Learner intelligence refresh after placement encountered a minor warning.", mindError);
    }

    return {
      estimatedLevel,
      confidence,
      isProvisional,
      recommendedCourseId,
      recommendedLessonId,
      recommendedStartingPoint,
      overallScorePercent,
      skillBreakdown,
      priorityReinforcements,
      transferHighlights,
      rationale,
    };
  }
}
