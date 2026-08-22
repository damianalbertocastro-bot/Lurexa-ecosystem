# A1 Implemented Activity Audit and Production Mapping

Status: Active implementation audit  
Scope: all A1 learning activity surfaces currently present under `apps/learn-web/app/learn/*` plus shared Learn activity components that affect A1  
Primary reference: `20-A1-MODULE-1-PRODUCTION-BLUEPRINT.md`

## 1. Executive decision

The existing A1 activity work should be **preserved and evolved**, not rebuilt from zero.

The repository previously contained two separate A1 lesson surfaces:

- `apps/learn-web/app/learn/a1-preview/page.tsx`
- `apps/learn-web/app/learn/english-a1/introduce-yourself/page.tsx`

Both legacy routes now redirect to the canonical server-authorized lesson route, `/learn/english-a1-foundations/a1-introduce-yourself`, so learner testing, future development and evidence collection do not diverge across duplicate lesson implementations.

The generic route `apps/learn-web/app/learn/[courseId]/[lessonId]/page.tsx` renders the `LessonRuntime`, which loads structured lesson content through the authenticated server API. It is the only route permitted to record trusted course progress.

## 2. Critical defect discovered and corrected

The retired static A1 surfaces previously emitted client-defined event types such as:

- `vocabulary_practice.completed`
- `phonetics_practice.completed`
- `quiz.completed`

This allowed a duplicate UI to present activity completion independently of the authoritative course-progress workflow.

### Resolution

The duplicate client-evidence endpoint and the two static activity surfaces were removed from the learning path. The canonical runtime uses authenticated, server-authorized activity, quiz, spoken-evidence, roleplay, and completion operations; the server validates the lesson block, scores eligible activities, records attempt metadata, and appends trusted evidence.

## 3. Competency-ID normalization

Previous implementation IDs included ad hoc values such as:

- `EN-A1-VOC-INTRO-01`
- `EN-A1-PHON-INTRO-01`
- `EN-A1-WRT-INTRO-01`
- `EN-A1-SPK-INTRO-01`

These did not match the authoritative competency convention `EN.<CEFR>.<FAMILY>.<COMPETENCY_NAME>`.

The canonical lesson now uses stable curriculum IDs including:

- `EN.A1.VOCAB.IDENTITY`
- `EN.A1.VOCAB.FUNCTIONAL_SURVIVAL_PHRASES`
- `EN.A1.SPEAK.INTRODUCE_SELF`
- `EN.A1.CONV.GREETING_EXCHANGE`
- `EN.A1.CONV.PERSONAL_INTRODUCTION`
- `EN.A1.PRAG.BASIC_POLITENESS`
- `EN.A1.PHON.WORD_STRESS`
- `EN.A1.PHON.INTELLIGIBLE_CORE_PHRASES`
- `EN.A1.WRITE.PERSONAL_SENTENCES`
- `EN.A1.CREATE.PERSONAL_INTRODUCTION`
- `EN.A1.GRAMMAR.SUBJECT_PRONOUNS`
- `EN.A1.GRAMMAR.BE_AFFIRMATIVE_NEGATIVE`
- `EN.A1.STRAT.USE_CHUNKS`

Historical evidence using old IDs should not be silently rewritten. If migration becomes necessary, use an explicit alias/migration table with provenance.

## 4. Activity-by-activity audit

| Existing / required activity | Previous state | Production decision | Current treatment |
|---|---|---|---|
| Dialogue / noticing | Implemented | REUSE + ENHANCE | Preserved as encounter stage; model-listening entry added |
| Vocabulary cards | Implemented | REUSE + ENHANCE | Preserved; language changed from “mastered” to practice evidence |
| Vocabulary completion | Implemented | FIX | Now uses accepted evidence event + stable competency IDs |
| Multiple-choice greeting/knowledge checks | Implemented | REUSE | Preserved as formative evidence, explicitly not mastery |
| Phonetics / stress guidance | Implemented | REUSE + ENHANCE | Preserved; evidence labeled self-reported rehearsal, not scoring |
| Spoken rehearsal | Implemented as self-report | REUSE TEMPORARILY | Kept until recording/scoring infrastructure exists |
| Create & Apply writing | Implemented | REUSE + ENHANCE | Preserved with stable writing/speaking/create competencies |
| Learner-context retrieval | Implemented | REUSE | Preserved; lesson displays available curriculum context |
| Evidence submission | Implemented | FIX | Event taxonomy corrected; activity/evidence semantics strengthened |
| Guided productive response | Weak/missing in canonical lesson | ADD | Added free-response name-question production |
| Retrieval without visible answer | Missing | ADD | Added explicit unscaffolded-first retrieval challenge |
| Listening exposure | Text-only | ADD TEMPORARY | Browser speech synthesis added as temporary model exposure |
| Delayed retrieval across sessions | Missing | NEW SYSTEM CAPABILITY | Requires scheduling/persistence beyond one page session |
| Adaptive reduction of recognition practice | Missing | NEW SYSTEM CAPABILITY | Requires learner-evidence interpretation and activity routing |
| Graduated hints | Partial | ENHANCE | Retrieval retry now distinguishes first attempt vs hinted retry; broader reusable hint engine still needed |
| Real audio recording | Missing | NEW COMPONENT | Required before speaking evidence can exceed self-report |
| Pronunciation/intelligibility scoring | Missing | FUTURE / COACH-COMPATIBLE | Must use validated speech evidence; do not fake with button completion |
| AI scenario conversation | Missing | NEW CAPABILITY | Existing AI widget is mock and ConversationWindow is placeholder; do not claim real AI interaction yet |
| Teacher brief/intervention | Architecture exists, UI missing | NEW PRODUCT FLOW | Implement after learner evidence can be interpreted reliably |
| Expert educator escalation | Architecture exists, UI missing | LATER PRODUCT FLOW | Implement after teacher workflow and escalation criteria exist |

## 5. Existing AI component judgment

`apps/learn-web/app/learn/components/AITutorWidget.tsx` currently generates a delayed mock response locally. It does not yet satisfy `16-AI-TUTOR-PEDAGOGICAL-CONTRACT.md` because it does not use a real constrained model/backend, authorized learner context, evidence-aware adaptation, curriculum-bound correction policy or task completion rules.

Decision: **do not integrate the mock widget into the canonical A1 lesson as if it were production AI.**

It may remain useful as a UI shell. Production AI integration should replace its mock response mechanism with the approved Lurexa Mind/Core pathway.

## 6. Conversation component judgment

`apps/learn-web/components/ConversationWindow.tsx` is currently a visual placeholder only.

Decision: retain only as a candidate shell or replace it when the real scenario-conversation component is implemented. It currently produces no learning evidence and does not satisfy the conversation framework.

## 7. Evidence-strength corrections

The implementation must never imply that completion equals mastery.

### Vocabulary

Selecting/reviewing cards and clicking completion = practice evidence only.

### Phonetics

Clicking “I said it aloud” = self-reported rehearsal only.

### Quiz

Recognition quiz = formative recognition evidence. It cannot establish speaking, conversation or pronunciation mastery by itself.

### Create & Apply

A learner-authored introduction is stronger productive evidence, but its interpretation still depends on target competencies, scaffolding and quality.

### Retrieval

First unscaffolded retrieval is stored separately from later hinted attempts.

## 8. Current canonical A1 lesson activity flow

The canonical lesson now demonstrates:

1. Encounter / dialogue
2. Temporary model listening
3. Vocabulary exploration
4. Guided productive question
5. Phonetics + spoken rehearsal
6. Create & Apply introduction
7. Retrieval without visible model
8. Formative quiz
9. Evidence capture across multiple evidence strengths

This is substantially closer to the Lurexa cycle than the earlier implementation, but it is not yet the complete production loop.

## 9. Remaining gaps before A1 Module 1 can pass the production blueprint

### P0 — required for the reference vertical slice

1. Real lesson/activity registry instead of the generic route always rendering one A1 page.
2. Real structured content objects instead of a monolithic hard-coded lesson component.
3. Real AI scenario conversation through approved backend/Mind pathways.
4. Real audio assets or controlled speech generation for listening tasks.
5. Audio recording capability for spoken evidence.
6. Persistent attempt numbering and resume state across sessions/devices.
7. Evidence interpretation/adaptation service that changes what comes next.
8. Delayed retrieval scheduling.

### P1 — required for Guided/Intensive validation

1. Teacher evidence brief.
2. Teacher observation/evidence submission.
3. Post-teacher-session recommendation returning to the async path.
4. Trigger rules for evidence-based intervention.

### P2 — expert layer

1. Teacher → expert educator escalation object/workflow.
2. Calibration/disputed-case evidence package.
3. Mechanism to convert recurring expert findings into curriculum, Teach and AI-policy improvements.

## 10. Reuse policy for future A1 authoring

Future A1 lessons should reuse approved activity families rather than copy-paste entire page implementations.

Recommended reusable components/contracts:

- `DialogueEncounter`
- `ModelListening`
- `VocabularyExplorer`
- `RecognitionCheck`
- `GuidedProduction`
- `SpeakingRehearsal`
- `PronunciationPractice`
- `RetrievalChallenge`
- `CreateApplyTask`
- `FormativeQuiz`
- `ScenarioConversation`
- `ReflectionCheck`
- `EvidenceStatus`

Each component should accept structured curriculum data and evidence configuration rather than contain A1 lesson text permanently in the component.

## 11. Production rule

Do not rebuild activities that already work merely to match a new blueprint visually.

Use this decision order:

**Preserve proven interaction → correct evidence semantics → normalize competency mapping → extract reusable component → add missing pedagogical capability → validate with learner evidence.**

That is now the governing migration path from the tested A1 implementation to the full Lurexa production curriculum.
