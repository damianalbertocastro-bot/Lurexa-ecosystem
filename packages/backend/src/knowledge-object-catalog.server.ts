import type { KnowledgeObjectV1 } from "@lurexa/types";

const NOW = "2026-08-25T00:00:00.000Z";

function object(input: Omit<KnowledgeObjectV1, "contractVersion" | "status" | "language" | "curriculumRefs" | "version" | "createdAt" | "updatedAt">): KnowledgeObjectV1 {
  return {
    contractVersion: "1",
    status: "active",
    language: "en",
    curriculumRefs: [],
    version: 1,
    createdAt: NOW,
    updatedAt: NOW,
    ...input,
  };
}

/**
 * Deterministic semantic catalog. These identifiers represent learning concepts,
 * skills, strategies, and targets—not learner state. Every current Dominican-
 * English corpus pattern resolves to at least one governed Knowledge Object.
 */
const objects: readonly KnowledgeObjectV1[] = [
  object({ id: "eng.strategy.sound-before-spelling", kind: "strategy", title: "Sound before spelling", description: "Build an auditory representation of unfamiliar English words before relying on Spanish letter-to-sound expectations.", cefrLevels: ["A1", "A2"], skillDimensions: ["phonetics", "listening", "speaking"], relations: [{ kind: "supports", targetId: "eng.pronunciation.unpredictable-vowel-spelling" }], aliases: ["auditory-first decoding", "sound-before-print"], tags: ["english", "pronunciation", "orthographic-transfer", "spanish-transfer"] }),
  object({ id: "eng.pronunciation.initial-s-consonant-clusters", kind: "pronunciation_target", title: "Initial /s/ + consonant clusters", description: "Intelligible production of English word-initial /s/ clusters without inserting a preceding vowel.", cefrLevels: ["A1", "A2", "B1", "B2"], skillDimensions: ["phonetics", "speaking", "listening"], relations: [], aliases: ["s clusters", "s-consonant clusters", "epenthesis before s clusters"], tags: ["english", "pronunciation", "phonetics", "spanish-transfer", "dominican-spanish"] }),
  object({ id: "eng.pronunciation.unpredictable-vowel-spelling", kind: "pronunciation_target", title: "English vowel spelling and sound", description: "Perceive and produce English vowel categories without assuming transparent Spanish-style spelling-to-sound relationships.", cefrLevels: ["A1", "A2", "B1"], skillDimensions: ["phonetics", "listening", "speaking", "reading"], relations: [], aliases: ["English vowel decoding", "vowel spelling patterns"], tags: ["english", "pronunciation", "vowels", "orthographic-transfer"] }),
  object({ id: "eng.pronunciation.spelling-pattern-variation", kind: "strategy", title: "Spelling-pattern pronunciation variation", description: "Avoid overgeneralizing one pronunciation across English spelling patterns such as oo; use lexical and auditory evidence.", cefrLevels: ["A1", "A2", "B1"], skillDimensions: ["phonetics", "listening", "reading"], relations: [{ kind: "supports", targetId: "eng.pronunciation.unpredictable-vowel-spelling" }], aliases: ["variable spelling pronunciation", "oo variation"], tags: ["english", "pronunciation", "spelling", "vowels"] }),
  object({ id: "eng.pronunciation.cognate-sound-transfer", kind: "strategy", title: "Cognate pronunciation transfer awareness", description: "Recognize when familiar-looking English forms invite Spanish phonological expectations and verify the English auditory form.", cefrLevels: ["A1", "A2", "B1"], skillDimensions: ["phonetics", "speaking", "listening", "vocabulary"], relations: [], aliases: ["cognate pronunciation", "familiar-looking word transfer"], tags: ["english", "pronunciation", "cognates", "spanish-transfer"] }),
  object({ id: "eng.grammar.simple-past.regular-form", kind: "language_form", title: "Regular simple-past form", description: "Form and use of regular English verbs in the simple past.", cefrLevels: ["A2", "B1"], skillDimensions: ["grammar", "reading", "writing", "speaking"], relations: [{ kind: "supports", targetId: "eng.pronunciation.regular-past-endings" }], aliases: ["regular past", "regular past tense", "-ed past form"], tags: ["english", "grammar", "simple-past", "regular-verbs"] }),
  object({ id: "eng.pronunciation.regular-past-endings", kind: "pronunciation_target", title: "Regular past-tense endings", description: "Intelligible production and perception of the English regular-past ending realizations /t/, /d/, and /ɪd/.", cefrLevels: ["A2", "B1", "B2"], skillDimensions: ["phonetics", "speaking", "listening"], relations: [{ kind: "prerequisite", targetId: "eng.grammar.simple-past.regular-form" }, { kind: "supports", targetId: "eng.skill.narrative-speaking.past-events" }], aliases: ["-ed pronunciation", "regular past pronunciation", "past ending pronunciation"], tags: ["english", "pronunciation", "phonetics", "simple-past", "-ed"] }),
  object({ id: "eng.pronunciation.th-fricatives-perception", kind: "pronunciation_target", title: "Perception of /θ/ and /ð/", description: "Perceive and distinguish English dental fricatives /θ/ and /ð/ in listening and pronunciation tasks.", cefrLevels: ["A1", "A2", "B1", "B2"], skillDimensions: ["listening", "phonetics"], relations: [{ kind: "supports", targetId: "eng.pronunciation.th-fricatives-production" }], aliases: ["TH perception", "theta eth listening"], tags: ["english", "pronunciation", "listening", "spanish-transfer"] }),
  object({ id: "eng.pronunciation.th-fricatives-production", kind: "pronunciation_target", title: "Production of /θ/ and /ð/", description: "Produce English /θ/ and /ð/ intelligibly without replacing them with more familiar consonants when the contrast matters.", cefrLevels: ["A1", "A2", "B1", "B2"], skillDimensions: ["speaking", "phonetics", "listening"], relations: [{ kind: "prerequisite", targetId: "eng.pronunciation.th-fricatives-perception" }], aliases: ["TH pronunciation", "theta eth production"], tags: ["english", "pronunciation", "consonants", "spanish-transfer"] }),
  object({ id: "eng.grammar.english-word-order", kind: "language_form", title: "English clause word order", description: "Build English clauses directly rather than translating Spanish structures element by element.", cefrLevels: ["A1", "A2", "B1", "B2"], skillDimensions: ["grammar", "speaking", "writing"], relations: [], aliases: ["English word order", "avoid Spanish calque order"], tags: ["english", "grammar", "word-order", "spanish-transfer"] }),
  object({ id: "eng.grammar.simple-present.do-questions", kind: "language_form", title: "Simple-present questions with do/does", description: "Form simple-present information and yes/no questions with do/does and appropriate subject-verb order.", cefrLevels: ["A1", "A2", "B1"], skillDimensions: ["grammar", "speaking", "writing"], relations: [{ kind: "supports", targetId: "eng.grammar.english-word-order" }], aliases: ["do-support questions", "do does questions"], tags: ["english", "grammar", "questions", "auxiliary-do"] }),
  object({ id: "eng.grammar.third-person-singular-s", kind: "language_form", title: "Third-person singular -s", description: "Select and audibly produce third-person singular present-tense -s where English requires it.", cefrLevels: ["A1", "A2", "B1"], skillDimensions: ["grammar", "speaking", "phonetics", "writing"], relations: [], aliases: ["third person s", "he she it -s"], tags: ["english", "grammar", "agreement", "morphology"] }),
  object({ id: "eng.skill.advanced-grammar-spontaneous-use", kind: "skill", title: "Spontaneous use of advanced grammar", description: "Retrieve and use higher-level grammar such as conditionals and aspect during real-time production rather than only in controlled study.", cefrLevels: ["B1", "B2", "C1"], skillDimensions: ["grammar", "speaking", "writing"], relations: [{ kind: "supports", targetId: "eng.skill.spoken-sentence-automaticity" }], aliases: ["productive advanced grammar", "grammar automaticity"], tags: ["english", "grammar", "automaticity", "production"] }),
  object({ id: "eng.pragmatics.conventional-requests", kind: "skill", title: "Conventional English requests", description: "Choose request forms whose directness and politeness fit the interaction instead of relying on bare imperatives by default.", cefrLevels: ["A1", "A2", "B1"], skillDimensions: ["speaking", "grammar", "vocabulary"], relations: [], aliases: ["polite requests", "request directness"], tags: ["english", "pragmatics", "requests", "register"] }),
  object({ id: "eng.skill.spoken-sentence-automaticity", kind: "skill", title: "Real-time sentence assembly", description: "Assemble complete English sentences with increasing automaticity during spontaneous speech.", cefrLevels: ["A1", "A2", "B1"], skillDimensions: ["speaking", "grammar", "vocabulary"], relations: [], aliases: ["sentence automaticity", "real-time sentence building"], tags: ["english", "fluency", "automaticity", "speaking"] }),
  object({ id: "eng.skill.lexical-range-in-speaking", kind: "skill", title: "Lexical range in spontaneous speaking", description: "Move beyond a narrow set of familiar words by retrieving a broader, context-appropriate vocabulary during speech.", cefrLevels: ["B1", "B2", "C1", "C2"], skillDimensions: ["vocabulary", "speaking"], relations: [{ kind: "supports", targetId: "eng.skill.productive-lexical-retrieval" }], aliases: ["spoken vocabulary range", "lexical variety"], tags: ["english", "vocabulary", "speaking", "range"] }),
  object({ id: "eng.strategy.reduce-mental-translation", kind: "strategy", title: "Reduce mental translation", description: "Build direct English processing and retrieval strategies to reduce processing load from translating unfamiliar language through Spanish in real time.", cefrLevels: ["B1", "B2"], skillDimensions: ["speaking", "listening", "reading", "vocabulary"], relations: [{ kind: "supports", targetId: "eng.skill.spoken-sentence-automaticity" }], aliases: ["direct English processing", "less mental translation"], tags: ["english", "fluency", "processing", "spanish-transfer"] }),
  object({ id: "eng.skill.productive-lexical-retrieval", kind: "skill", title: "Productive lexical retrieval", description: "Retrieve known vocabulary reliably during spontaneous speaking instead of recognizing it only receptively.", cefrLevels: ["B1", "B2", "C1", "C2"], skillDimensions: ["vocabulary", "speaking", "listening", "reading"], relations: [], aliases: ["active vocabulary retrieval", "productive vocabulary"], tags: ["english", "vocabulary", "retrieval", "production"] }),
  object({ id: "eng.vocabulary.semantic-range-and-collocation", kind: "concept", title: "Semantic range and collocation", description: "Distinguish English words that share similar Spanish translations but differ in usage, collocation, register, or semantic range.", cefrLevels: ["B1", "B2", "C1", "C2"], skillDimensions: ["vocabulary", "reading", "writing", "speaking"], relations: [], aliases: ["semantic range", "collocation choice", "false equivalence"], tags: ["english", "vocabulary", "collocation", "semantic-transfer"] }),
  object({ id: "eng.strategy.spaced-lexical-retrieval", kind: "strategy", title: "Spaced lexical retrieval", description: "Strengthen vocabulary retention with repeated retrieval across time and contexts rather than relying on one exposure.", cefrLevels: ["A2", "B1", "B2", "C1", "C2"], skillDimensions: ["vocabulary", "reading", "listening", "speaking", "writing"], relations: [{ kind: "supports", targetId: "eng.skill.productive-lexical-retrieval" }], aliases: ["vocabulary retrieval practice", "spaced vocabulary review"], tags: ["english", "vocabulary", "retention", "retrieval-practice"] }),
  object({ id: "eng.skill.receptive-productive-balance", kind: "skill", title: "Receptive-to-productive transfer", description: "Close a material gap between what a learner can understand in listening/reading and what they can produce in speaking/writing.", cefrLevels: ["B2", "C1", "C2"], skillDimensions: ["listening", "reading", "speaking", "writing", "vocabulary"], relations: [{ kind: "supports", targetId: "eng.skill.productive-lexical-retrieval" }, { kind: "supports", targetId: "eng.skill.spoken-sentence-automaticity" }], aliases: ["receptive productive gap", "productive transfer"], tags: ["english", "discourse", "productive-skills", "receptive-skills"] }),
  object({ id: "eng.skill.narrative-speaking.past-events", kind: "skill", title: "Speaking about past events", description: "Organize and express comprehensible spoken narratives about completed past experiences.", cefrLevels: ["A2", "B1"], skillDimensions: ["speaking", "grammar", "vocabulary", "phonetics"], relations: [{ kind: "prerequisite", targetId: "eng.grammar.simple-past.regular-form" }, { kind: "supports", targetId: "eng.pronunciation.regular-past-endings" }], aliases: ["past storytelling", "talking about past experiences"], tags: ["english", "speaking", "narrative", "past-events"] }),
] as const;

const byId = new Map(objects.map((entry) => [entry.id, entry]));

const linguisticPatternKnowledgeObjects: Readonly<Record<string, readonly string[]>> = {
  "DO-ENG-PRO-001": ["eng.strategy.sound-before-spelling"],
  "DO-ENG-PRO-002": ["eng.pronunciation.initial-s-consonant-clusters"],
  "DO-ENG-PRO-003": ["eng.pronunciation.unpredictable-vowel-spelling"],
  "DO-ENG-PRO-004": ["eng.pronunciation.spelling-pattern-variation", "eng.pronunciation.unpredictable-vowel-spelling"],
  "DO-ENG-PRO-005": ["eng.pronunciation.cognate-sound-transfer"],
  "DO-ENG-PRO-006": ["eng.pronunciation.regular-past-endings", "eng.grammar.simple-past.regular-form", "eng.skill.narrative-speaking.past-events"],
  "DO-ENG-PRO-007": ["eng.pronunciation.th-fricatives-perception"],
  "DO-ENG-PRO-008": ["eng.pronunciation.th-fricatives-production", "eng.pronunciation.th-fricatives-perception"],
  "DO-ENG-GRA-001": ["eng.grammar.english-word-order", "eng.strategy.reduce-mental-translation"],
  "DO-ENG-GRA-002": ["eng.grammar.simple-present.do-questions"],
  "DO-ENG-GRA-003": ["eng.grammar.third-person-singular-s"],
  "DO-ENG-GRA-004": ["eng.skill.advanced-grammar-spontaneous-use"],
  "DO-ENG-PRA-001": ["eng.pragmatics.conventional-requests"],
  "DO-ENG-FLU-001": ["eng.skill.spoken-sentence-automaticity"],
  "DO-ENG-FLU-002": ["eng.skill.lexical-range-in-speaking", "eng.skill.productive-lexical-retrieval"],
  "DO-ENG-FLU-003": ["eng.strategy.reduce-mental-translation", "eng.skill.spoken-sentence-automaticity"],
  "DO-ENG-LEX-001": ["eng.skill.productive-lexical-retrieval"],
  "DO-ENG-LEX-002": ["eng.skill.lexical-range-in-speaking"],
  "DO-ENG-LEX-003": ["eng.vocabulary.semantic-range-and-collocation"],
  "DO-ENG-LEX-004": ["eng.strategy.spaced-lexical-retrieval", "eng.skill.productive-lexical-retrieval"],
  "DO-ENG-DIS-001": ["eng.skill.receptive-productive-balance"],
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

export function listMappedLinguisticPatternIds(): string[] {
  return Object.keys(linguisticPatternKnowledgeObjects).sort();
}
