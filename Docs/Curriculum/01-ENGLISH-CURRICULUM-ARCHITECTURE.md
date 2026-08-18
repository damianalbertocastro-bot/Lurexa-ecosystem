# English Curriculum Architecture

Status: Authoritative MVP curriculum structure  
Framework: CEFR A1-C2  
Initial audience: Spanish speakers, optimized first for Dominican learners

## 1. Purpose

This document defines how English curriculum content is organized inside Lurexa Learn and how content connects to competencies, cultural themes, assessment, conversation, phonetics, creation tasks, and adaptive learning.

It does not define persistence or authorization architecture. Those responsibilities remain in `Docs/Architecture/*`.

## 2. Curriculum hierarchy

English Domain → CEFR Level → Level Identity/Course → Module → Unit → Lesson → Activity → Learning Evidence → Mastery

Every learning object should be traceable to one or more competencies.

## 3. Level identities

### A1 — Foundations for Real Communication

Goal: manage basic personal and highly familiar everyday communication with substantial support.

### A2 — Everyday Independence

Goal: manage routine social and practical situations with less dependence on memorized scripts.

### B1 — Independent Communication

Goal: maintain conversations, describe experiences, explain opinions, understand familiar extended input, and produce connected language.

### B2 — Flexible Communication

Goal: communicate confidently and spontaneously across personal, academic, professional and social contexts.

### C1 — Precision, Identity and Global Perspective

Goal: communicate complex ideas with flexibility, nuance, argumentation, register awareness and strong discourse control.

### C2 — Adaptive Mastery

Goal: interpret and produce sophisticated language across domains, registers, accents and abstract contexts with high flexibility.

## 4. Skill progression principle

The seven skills are Listening, Speaking, Reading, Writing, Vocabulary, Grammar and Phonetics. Conversation and Create & Apply are integrated modes.

A1-A2: prioritize listening, vocabulary, phonetics, supported speaking and survival communication.  
B1-B2: prioritize interaction, fluency, listening, discourse, reading/writing growth and spontaneous use.  
C1-C2: prioritize precision, nuance, synthesis, advanced interaction, register, rhetorical control and sophisticated production.

## 5. Cultural progression

Contexts should expand through:

Personal → Local → Dominican → Caribbean → Latin American → International → Global/Abstract

Local relevance must not become local limitation.

## 6. Naming standard

Titles at every layer should connect to the broader theme and feel like one learning journey.

Example:

- C1 — Language, Identity & Global Perspective
- Module 1 — Caribbean Heritage
- Unit 3 — Dominican Music and Cultural Fusion
- Lesson 2 — Dembow: Rhythm, Language and Identity
- Activity — Hear the Beat: Stress and Meaning

Avoid generic sequences such as “Grammar Lesson 4” unless used internally as metadata.

## 7. Module design rule

A module groups related communicative goals and competencies under a coherent theme. A module should normally contain 3-5 units, but pedagogy takes priority over symmetry.

Each module should include:

- module mission;
- cumulative vocabulary system;
- multiple listening experiences;
- reading and writing appropriate to level;
- grammar in context;
- phonetics targets where relevant;
- repeated conversation;
- Create & Apply work;
- vocabulary wrap;
- integrated skills challenge;
- module assessment.

## 8. Unit design rule

A unit should normally contain 3-5 lessons and culminate in a meaningful integrated task.

Every unit should include at minimum:

- one guided speaking activity;
- one interactive conversation activity;
- one increasingly independent speaking task;
- multiple listening events;
- reading appropriate to level;
- micro-writing or guided writing;
- grammar and vocabulary recycling;
- phonetics where relevant;
- a vocabulary wrap;
- an integrated skill challenge;
- review and assessment.

## 9. Lesson design rule

Each lesson follows `00-LUREXA-LEARNING-METHODOLOGY.md` and the detailed contract in `03-LESSON-AND-ACTIVITY-SCHEMA.md`.

A lesson should normally include:

Hook → Mission → Vocabulary Builder → Input → Comprehension → Noticing → Language/Phonetics Focus → Guided Practice → Conversation → Create & Apply → Review → Quiz → Reflection → Evidence

## 10. Preliminary level breadth

Do not force identical module counts across levels. As an initial planning target:

- A1: about 8 modules
- A2: about 8 modules
- B1: about 8 modules
- B2: about 8 modules
- C1: about 6-8 modules
- C2: about 6-8 modules

These counts are planning bounds, not release requirements.

## 11. A1 production architecture for MVP

A1 is the first production-ready level.

### Module 1 — Hello, This Is Me

Core areas: greetings, identity, alphabet/sound awareness, countries/nationalities, occupations, subject pronouns, `to be`, basic question patterns, introductions.

Suggested units:

1. Meeting People
2. Who Am I?
3. People Around Me
4. Real-Life Introductions

### Module 2 — My World in Numbers

Numbers, dates, time, schedules, contact information, calendars, simple availability.

### Module 3 — The People Around Me

Family, relationships, physical/personal descriptions, possessives.

### Module 4 — My Everyday Life

Daily routines, time, present simple, frequency, basic sequencing.

### Module 5 — Food, Flavor and Everyday Choices

Food, ordering, cafés, shopping, countability, articles, some/any, Dominican and international contexts.

### Module 6 — My Neighborhood

Places, directions, location, simple transportation and community contexts.

### Module 7 — What I Like

Preferences, hobbies, entertainment, invitations, simple social plans.

### Module 8 — Life in Action

A1 integration, practical scenarios, portfolio production and readiness assessment.

## 12. A1 capstone

Suggested title: **My Life, My English**

Possible portfolio evidence:

- self-introduction recording;
- family/person description;
- routine;
- favorite food/activity;
- neighborhood explanation;
- short supported conversation;
- brief written profile.

The capstone integrates all seven skills at A1-appropriate depth.

## 13. Existing topic preservation

The original curriculum topics remain valid starting content, but they are now subordinate to the competency architecture and may be expanded, reordered or split into units where required for sound learning progression.

Original A1 topics preserved:

- introductions and greetings;
- numbers, dates and time;
- family and descriptions;
- daily routines;
- food and shopping;
- places and directions.

New A1 breadth adds preferences/social life and an integration module.

Original A2-C2 topics should be retained where pedagogically appropriate but expanded after competency-gap analysis.

## 14. Topic-to-competency rule

A topic is not a competency. “Dembow” is a context. “Express and support an interpretation using evaluative and hedging language” is a competency.

This separation allows Lurexa to localize or regenerate content while preserving learner-history continuity.

## 15. Content independence

Lessons should reference stable competencies rather than own them.

Example competency: `EN.B1.CONV.EXPRESS_OPINION` may appear in media, environment, music, workplace, or travel contexts.

This allows the Learner Model to remember performance independently from one specific lesson.

## 16. Interactive vocabulary requirement

Every lesson includes a Vocabulary Builder. Every unit includes cumulative vocabulary recycling and a Vocabulary Wrap.

Vocabulary interactions should progress from recognition to retrieval and use. Avoid fixed card decks that repeat identical behavior.

## 17. Conversation requirement

Every unit includes conversation that uses current language. AI conversation must be contextualized and level-controlled; teacher/peer conversation may be assigned where available.

## 18. Create & Apply requirement

Every unit should include at least one meaningful production task. Human teachers may assign richer versions and assess them. AI may suggest or generate them.

## 19. Free-tier content architecture

Free access should preserve a coherent path. The platform may expose selected complete modules, an A1 foundation pathway, or level-appropriate sample units depending on business decisions.

A learner’s proficiency is independent of plan. A B1 learner should receive B1-appropriate free content rather than being labeled A1 because more A1 content is free.

## 20. 54-week program compatibility

The curriculum is competency-based and can be scheduled through a 54-week annual program, but module structure must not encode calendar weeks as mastery gates.

Flex, Guided and Intensive plans can map different weekly workloads to the same competency graph.

## 21. MVP vertical slice

The first product-quality slice should prove the full loop rather than maximize lesson count.

Recommended initial slice:

A1 → Module 1 → Unit 1 plus enough adjacent content to test progression.

The slice must exercise:

placement/recommended start → vocabulary → listening → speaking → phonetics → grammar → reading/writing → AI conversation → Create & Apply → quiz → evidence → learner-model update → next recommendation → teacher visibility.

## 22. Release rule

Before a level is commercially represented as complete, it must have:

- competency coverage audit;
- balanced skill progression;
- phonetics progression;
- conversation coverage;
- assessment coverage;
- cultural breadth;
- creation/performance opportunities;
- level-exit evidence.

Do not claim a level is complete because a target number of lessons exists.
