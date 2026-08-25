import type { KnowledgeObjectV1 } from "@lurexa/types";

const NOW = "2026-08-25T00:00:00.000Z";

/**
 * Initial deterministic catalog. These are semantic identifiers, not learner
 * state. Items remain versioned so Studio can later own governed authoring and
 * publication workflows without changing historical evidence references.
 */
const objects: readonly KnowledgeObjectV1[] = [
  {
    contractVersion: "1",
    id: "eng.grammar.simple-past.regular-form",
    kind: "language_form",
    title: "Regular simple-past form",
    description: "Form and use of regular English verbs in the simple past.",
    status: "active",
    language: "en",
    cefrLevels: ["A2", "B1"],
    skillDimensions: ["grammar", "reading", "writing", "speaking"],
    curriculumRefs: [],
    relations: [
      { kind: "supports", targetId: "eng.pronunciation.regular-past-endings" },
    ],
    aliases: ["regular past", "regular past tense", "-ed past form"],
    tags: ["english", "grammar", "simple-past", "regular-verbs"],
    version: 1,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    contractVersion: "1",
    id: "eng.pronunciation.regular-past-endings",
    kind: "pronunciation_target",
    title: "Regular past-tense endings",
    description: "Intelligible production and perception of the common English regular-past ending realizations /t/, /d/, and /ɪd/.",
    status: "active",
    language: "en",
    cefrLevels: ["A2", "B1", "B2"],
    skillDimensions: ["phonetics", "speaking", "listening"],
    curriculumRefs: [],
    relations: [
      { kind: "prerequisite", targetId: "eng.grammar.simple-past.regular-form" },
      { kind: "supports", targetId: "eng.skill.narrative-speaking.past-events" },
    ],
    aliases: ["-ed pronunciation", "regular past pronunciation", "past ending pronunciation"],
    tags: ["english", "pronunciation", "phonetics", "simple-past", "-ed"],
    version: 1,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    contractVersion: "1",
    id: "eng.pronunciation.initial-s-consonant-clusters",
    kind: "pronunciation_target",
    title: "Initial /s/ + consonant clusters",
    description: "Intelligible production of English word-initial /s/ clusters without inserting a preceding vowel, with special relevance to Spanish-to-English transfer.",
    status: "active",
    language: "en",
    cefrLevels: ["A1", "A2", "B1", "B2"],
    skillDimensions: ["phonetics", "speaking", "listening"],
    curriculumRefs: [],
    relations: [],
    aliases: ["s clusters", "s-consonant clusters", "epenthesis before s clusters"],
    tags: ["english", "pronunciation", "phonetics", "spanish-transfer", "dominican-spanish"],
    version: 1,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    contractVersion: "1",
    id: "eng.skill.introductions.personal-identity",
    kind: "skill",
    title: "Personal introductions and identity",
    description: "Introducing oneself, sharing country of origin, and responding to formulaic social greetings in English.",
    status: "active",
    language: "en",
    cefrLevels: ["A1"],
    skillDimensions: ["speaking", "listening", "vocabulary"],
    curriculumRefs: ["EN.A1.SPEAK.INTRODUCE_SELF", "EN.A1.CONV.PERSONAL_INTRODUCTION"],
    relations: [],
    aliases: ["introducing yourself", "meet and greet", "basic introductions"],
    tags: ["english", "speaking", "introductions", "a1-foundations"],
    version: 1,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    contractVersion: "1",
    id: "eng.grammar.frequency-adverbs.routines",
    kind: "language_form",
    title: "Adverbs of frequency in daily routines",
    description: "Accurate placement and use of frequency adverbs (always, usually, rarely, hardly ever) to describe recurring schedules.",
    status: "active",
    language: "en",
    cefrLevels: ["A2"],
    skillDimensions: ["grammar", "speaking", "writing"],
    curriculumRefs: ["EN.A2.GRAMMAR.FREQUENCY_ADVERBS", "EN.A2.SPEAK.DESCRIBE_ROUTINE"],
    relations: [
      { kind: "supports", targetId: "eng.pronunciation.consonant-linking" },
    ],
    aliases: ["frequency adverbs", "routine descriptions", "habitual actions"],
    tags: ["english", "grammar", "routines", "a2-core"],
    version: 1,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    contractVersion: "1",
    id: "eng.pronunciation.consonant-linking",
    kind: "pronunciation_target",
    title: "Consonant-to-vowel linking",
    description: "Connecting the final consonant of one word smoothly to the initial vowel of the following word in natural spoken English.",
    status: "active",
    language: "en",
    cefrLevels: ["A2", "B1"],
    skillDimensions: ["phonetics", "speaking", "listening"],
    curriculumRefs: ["EN.A2.PHON.LINKED_SOUNDS"],
    relations: [
      { kind: "prerequisite", targetId: "eng.grammar.frequency-adverbs.routines" },
    ],
    aliases: ["c-to-v linking", "catenation", "connected speech linking"],
    tags: ["english", "pronunciation", "phonetics", "connected-speech"],
    version: 1,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    contractVersion: "1",
    id: "eng.skill.directions-and-transit",
    kind: "skill",
    title: "Navigating transit and giving directions",
    description: "Asking for wayfinding directions, buying transit tickets, and understanding public transit schedules in English.",
    status: "active",
    language: "en",
    cefrLevels: ["A2"],
    skillDimensions: ["speaking", "listening", "vocabulary"],
    curriculumRefs: ["EN.A2.SPEAK.GIVE_DIRECTIONS", "EN.A2.LISTEN.TRANSIT_ANNOUNCEMENTS"],
    relations: [],
    aliases: ["asking for directions", "transit navigation", "city wayfinding"],
    tags: ["english", "speaking", "transit", "travel"],
    version: 1,
    createdAt: NOW,
    updatedAt: NOW,
  },
] as const;

const byId = new Map(objects.map((object) => [object.id, object]));

const linguisticPatternKnowledgeObjects: Readonly<Record<string, readonly string[]>> = {
  "DO-ENG-PRO-002": ["eng.pronunciation.initial-s-consonant-clusters"],
  "DO-ENG-PRO-006": [
    "eng.pronunciation.regular-past-endings",
    "eng.grammar.simple-past.regular-form",
    "eng.skill.narrative-speaking.past-events",
  ],
};

export function getKnowledgeObjectById(id: string): KnowledgeObjectV1 | null {
  return byId.get(id) ?? null;
}

export function listKnowledgeObjects(): KnowledgeObjectV1[] {
  return [...objects];
}

export function getKnowledgeObjectIdsForLinguisticPattern(patternId?: string): string[] {
  if (!patternId) return [];
  return [...(linguisticPatternKnowledgeObjects[patternId] ?? [])];
}
