# Lurexa Language Curriculum Core Architecture

Status: Authoritative cross-language curriculum architecture  
Owner: Lurexa Learning Technologies  
Applies to: all present and future language programs in Lurexa Learn, Coach, Teach, Insight, Studio and authorized curriculum consumers

## 1. Purpose

Lurexa is beginning with English, but the learning system must not become English-specific by accident.

This document defines the reusable language-learning kernel that future English, Spanish, French, Portuguese and other language programs inherit. Target-language curriculum documents specialize this core; they do not replace it.

The goal is:

> **One learning architecture. Multiple languages. Language-specific pedagogy where it matters. Shared evidence and adaptation where it is genuinely portable.**

## 2. Architectural layers

### Layer 0 — Universal Lurexa learning architecture

Shared across languages and other learning domains:

- competency-based progression;
- Encounter → Understand → Practice → Retrieve → Apply → Create → Receive Feedback → Improve → Transfer → Retain;
- first-attempt evidence preserved separately from retries/scaffolding;
- recognition distinguished from production and interaction;
- delayed retrieval;
- adaptive recommendation;
- teacher intervention and return;
- expert escalation;
- accessibility and resume;
- Core-owned trusted records;
- Mind-owned interpretation of authorized evidence.

### Layer 1 — Shared language-learning architecture

Reusable across target languages:

- listening/viewing or receptive oral comprehension where applicable;
- speaking/signing or oral/manual production where applicable;
- reading;
- writing;
- interpersonal interaction;
- presentational production;
- vocabulary/lexical control;
- grammar/morphosyntax;
- pronunciation/phonology/prosody where applicable;
- orthography/script and sound-symbol relationships where applicable;
- pragmatics;
- discourse/text organization;
- mediation;
- online interaction;
- plurilingual/pluricultural competence;
- communication strategies and repair.

Not every language exposes these dimensions identically. The target-language specification defines which are explicit skills, integrated dimensions or non-applicable features.

### Layer 2 — Target-language curriculum profile

Defines what is specific to the language being learned:

- level framework and proficiency descriptors;
- grammatical progression;
- lexical domains;
- phonological system;
- prosody/rhythm/intonation;
- writing system and orthography;
- morphology;
- pragmatics/register;
- sociolinguistic variation;
- culture and discourse conventions;
- target-language competency IDs;
- level/module/unit progression.

Current example: `EN.*` English competencies.

Future examples may use `ES.*`, `FR.*`, `PT.*` or another stable ISO-based language prefix.

### Layer 3 — Learner-language transfer profile

Represents likely transfer from a learner's known language(s) into the target language.

Examples:

- Dominican Spanish → English;
- English → Spanish;
- Haitian Creole → English;
- Spanish → French.

A transfer profile may contain:

- sound/phonology contrasts;
- orthographic transfer;
- morphology/syntax transfer;
- lexical/cognate effects;
- discourse/pragmatic transfer;
- high-value diagnostic cues;
- correction priorities;
- confidence/affect considerations.

Transfer profiles are hypotheses and priors, never learner facts. Individual evidence overrides the profile.

### Layer 4 — Localized program/context layer

Defines audience and market context without changing competency meaning:

- culturally relevant topics;
- local scenarios and services;
- professions/industries;
- institutions;
- age-appropriate contexts;
- regional examples;
- accessibility/localization choices.

A topic is context, not a competency.

## 3. Competency namespace

Language competencies use:

`<LANG>.<LEVEL>.<FAMILY>.<COMPETENCY_NAME>`

Examples:

- `EN.A1.SPEAK.INTRODUCE_SELF`
- `ES.A1.INTERACT.GREETING_EXCHANGE`
- `FR.B1.MED.RELAY_KEY_INFORMATION`

Rules:

1. `<LANG>` is a stable uppercase language identifier.
2. `<LEVEL>` represents the governing framework level used by that program.
3. `<FAMILY>` is a stable capability family.
4. The final name describes performance, not a lesson topic.
5. Competencies remain stable when examples, topics or lesson order change.
6. Cross-language equivalence is never inferred from similar IDs alone.

## 4. Framework policy

Lurexa may benchmark against CEFR, ACTFL or other mature frameworks, but internal curriculum objects remain explicitly versioned and evidence-backed.

### CEFR

CEFR is the primary current framework for the English program and is especially compatible with Lurexa's action-oriented, mediation, online-interaction and plurilingual design.

### ACTFL

ACTFL may be used as a complementary external lens, especially for:

- real-world functions/tasks;
- accuracy;
- context/content;
- text type;
- interpretive/interpersonal/presentational modes.

Do not publish simplistic one-to-one CEFR ↔ ACTFL equivalence claims unless a validated crosswalk supports the use case.

## 5. Shared language performance modes

Every language program should explicitly decide how it develops:

### Interpretive/receptive

Learner derives meaning from spoken, signed, written or multimodal input.

### Interpersonal/interactive

Learner negotiates meaning with another person or AI participant and can clarify, repair and respond.

### Presentational/productive

Learner creates spoken, signed, written or multimodal language for an audience without immediate negotiation.

### Mediation

Learner relays, reframes, summarizes or facilitates meaning for another person or audience.

These modes complement skill labels and prevent a curriculum from becoming a collection of isolated grammar/vocabulary lessons.

## 6. Universal evidence rule

Evidence strength is determined by what the learner actually did.

Examples:

- selected answer → recognition/selection evidence;
- typed recall → retrieval evidence;
- written response → writing/productive evidence;
- recording → spoken-production evidence;
- roleplay transcript + turns → interaction evidence;
- delayed fresh attempt → retention/retrieval evidence;
- relay/synthesis → mediation evidence;
- teacher observation → human-observed evidence.

A productive competency must not be mastered from receptive evidence alone.

## 7. Language-specific evidence adapters

Each target language defines evidence interpretation rules for features such as:

- pronunciation/phonology;
- morphological accuracy;
- script/character formation;
- tone;
- stress;
- register/honorific systems;
- spelling;
- discourse conventions.

The raw evidence remains Core-owned. Language-specific Mind interpreters derive insights without overwriting the raw observation.

## 8. Shared lesson object

A language lesson should remain compatible with the canonical Lurexa lesson runtime and normally includes:

1. performance mission;
2. target competencies;
3. prerequisite/retrieval targets;
4. contextualized input;
5. comprehension/meaning work;
6. noticing of relevant language patterns;
7. guided practice;
8. productive/interactive practice;
9. Create & Apply/transfer;
10. feedback and improvement;
11. retrieval/retention plan;
12. evidence mapping;
13. optional teacher extension/intervention;
14. accessibility/resume requirements.

Target-language documents may add stages but should not remove evidence requirements silently.

## 9. Content-generation rule

AI or Studio may generate localized examples, texts, dialogues and practice, but generated content must inherit authoritative metadata:

- target language;
- proficiency level;
- competency IDs;
- activity/evidence type;
- cultural/localization constraints;
- prohibited assumptions;
- teacher-review requirement when applicable.

Generated content cannot invent competencies or modify mastery thresholds.

## 10. Coach architecture across languages

Lurexa Coach should become a language-practice engine rather than an English-only chat surface.

Shared Coach behavior:

- receives authorized learner context;
- selects target-language competencies and active errors/targets;
- creates bounded interpersonal/presentational practice;
- captures spoken/signed/written evidence as appropriate;
- provides selective feedback;
- returns evidence to Core;
- allows Mind to update recommendations;
- supports delayed retrieval;
- does not claim mastery from one conversation.

Target-language Coach packs define:

- language-specific speech/pronunciation behavior;
- interaction norms;
- transfer-aware interventions;
- level-specific scenarios;
- error taxonomy;
- feedback priorities.

## 11. Teach architecture across languages

Teach professional competencies remain separate from the teacher's target-language proficiency.

Shared professional domains such as learner understanding, design, assessment, inclusion, digital/AI practice and professional growth are reusable.

Language-specific teacher pathways add:

- target-language ability;
- language awareness;
- pronunciation/phonology or script teaching;
- transfer patterns;
- target-language pedagogy;
- cultural/pragmatic knowledge.

## 12. Insight, Admin and Studio curriculum responsibilities

### Lurexa Insight

Aggregates curriculum/evidence signals without redefining competency meaning. Reports coverage, retention, difficulty, intervention and equity/accessibility patterns.

### Lurexa Admin

Manages programs, institutions, permissions, release status and policy. Admin must not directly alter evidence interpretation outside governed curriculum/version changes.

### Lurexa Studio

Authors/generates curriculum objects using the same shared schema. Studio must validate language, level, competencies, evidence requirements and localization before publish.

## 13. Cross-language learner model

A learner may study multiple languages. The learner model therefore stores target-language context explicitly.

Do not merge:

- English grammar evidence with Spanish grammar evidence;
- pronunciation targets across languages;
- CEFR estimates across target languages;
- language-specific vocabulary mastery.

Portable learner traits such as goals, study preferences, accessibility settings and learning-strategy evidence may be shared only when authorized and pedagogically appropriate.

## 14. Curriculum-version rule

Every production language program should eventually declare:

- target language;
- curriculum version;
- competency-set version;
- framework/version used;
- transfer-profile version where used;
- authored-content version.

Learner evidence should retain enough provenance to remain interpretable after curriculum revisions.

## 15. New-language launch checklist

A new target language should not begin with lesson generation. It should begin with:

1. target-language product definition;
2. external-framework decision;
3. level/proficiency architecture;
4. competency matrix;
5. phonology/orthography/script profile;
6. grammar/morphology progression;
7. interaction/pragmatics progression;
8. cultural/localization architecture;
9. first learner-L1 transfer profile;
10. assessment/mastery rules;
11. Coach practice pack;
12. teacher-development specialization;
13. one complete vertical pilot;
14. QA/release evidence.

## 16. Definition of success

The language architecture succeeds when Lurexa can add another language without duplicating the learning engine, while still respecting the target language's unique linguistic, cultural, phonological, orthographic and pedagogical requirements.
