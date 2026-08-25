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
    id: "eng.skill.narrative-speaking.past-events",
    kind: "skill",
    title: "Speaking about past events",
    description: "Organizing and expressing comprehensible spoken narratives about completed past experiences.",
    status: "active",
    language: "en",
    cefrLevels: ["A2", "B1"],
    skillDimensions: ["speaking", "grammar", "vocabulary", "phonetics"],
    curriculumRefs: [],
    relations: [
      { kind: "prerequisite", targetId: "eng.grammar.simple-past.regular-form" },
      { kind: "supports", targetId: "eng.pronunciation.regular-past-endings" },
    ],
    aliases: ["past storytelling", "talking about past experiences"],
    tags: ["english", "speaking", "narrative", "past-events"],
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
