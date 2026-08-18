# MVP Learning UX and Data Migration Target

Status: Engineering handoff specification

## Current repository gap
The current `@lurexa/types` course model uses generic `ContentBlock` values (`text`, `video`, `image`, `interactive`, `quiz_embed`) and `StudentProgress.completed`. The current Learn lesson player on `agent/lurexa-learn-experience` concatenates text blocks and exposes `Mark as Complete`.

That model is acceptable as an early scaffold but does not represent the approved methodology.

## Migration principle
Do not delete the old model abruptly. Introduce a versioned learning-content contract and adapt legacy lessons during migration.

## Required v2 concepts
### LessonDefinition
- id
- version
- level/framework
- course/module/unit relationships
- title/mission
- estimated minutes
- competency IDs
- language targets
- stages
- assessment rules
- cultural/context metadata
- tier/access metadata

### LearningStage
Typed stages such as:
- hook
- mission
- vocabulary_builder
- contextual_input
- listening
- reading
- language_noticing
- grammar_focus
- phonetics_focus
- guided_practice
- conversation
- create_apply
- review
- quiz
- reflection

### ActivityDefinition
Every activity defines:
- type
- instruction
- inputs/media
- expected learner action
- response modality
- feedback strategy
- evidence produced
- adaptation rules
- accessibility hints

### Attempt/Evidence
Progress should preserve attempts and evidence instead of only a boolean completion flag.

### LessonProgress
Recommended fields:
- status: not_started | in_progress | ready_for_review | completed
- stage progress
- attempts
- time spent
- evidence IDs
- competencies touched
- last accessed

`completed` means the learner reached the lesson endpoint; it does NOT equal competency mastery.

### CompetencyState
Separate from lesson progress:
introduced | practiced | demonstrated | mastered | retained | needs_revalidation

## Backward compatibility
During MVP transition:
1. retain `contentBlocks` for legacy content;
2. add v2 typed stages in a new field/interface;
3. lesson player prefers v2 when available;
4. legacy adapter renders old blocks;
5. deprecate direct reliance on `completed` for recommendations/mastery.

## Lesson player target
The player should render one purposeful interaction at a time or one small coherent group, not a long document.

Required UI regions:
- lesson header/mission/progress;
- primary activity surface;
- context-sensitive hint/tutor access;
- response/recording controls;
- immediate feedback;
- next/retry action;
- optional stage map;
- accessibility/audio controls.

## Evidence flow
UI activity -> Core-approved learning evidence endpoint -> trusted evidence record -> Mind interpretation where needed -> authorized Learner Context -> next lesson/adaptation.

The UI must not directly set `mastered=true`.

## AI tutor context
Tutor should receive a bounded context package:
- lesson mission;
- target competencies;
- current stage/activity;
- allowed learner context;
- feedback policy;
- CEFR level.
Do not send arbitrary learner records.

## Recommended type migration
Create new types alongside current types rather than overloading `Record<string, unknown>` indefinitely. Suggested modules:
- `packages/types/src/curriculum.ts`
- `packages/types/src/activity.ts`
- extend `learner.ts` evidence domains
- evolve `progress.ts` without deleting legacy fields until migration is complete.

## MVP acceptance test
A valid v2 lesson must support:
1. vocabulary interaction;
2. listening;
3. speaking/recording or conversation;
4. phonetics where targeted;
5. at least one productive response;
6. review/quiz;
7. evidence creation;
8. lesson completion independent from mastery;
9. personalized next-step recommendation when learner context is available.

## Anti-patterns
- one giant prose card;
- static flashcard-only vocabulary;
- `Mark as Complete` as the sole learning event;
- all activities stored as opaque arbitrary JSON with no type contract;
- AI deciding authoritative mastery directly;
- UI writing inferred learner state directly to Firestore.