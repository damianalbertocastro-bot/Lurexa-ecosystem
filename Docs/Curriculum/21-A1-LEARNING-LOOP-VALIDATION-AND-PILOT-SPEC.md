# A1 Learning Loop Validation and Pilot Specification

Status: Production validation authority  
Purpose: prove that Lurexa's asynchronous + AI + evidence + optional teacher model works before scaling lesson production

## 1. Validation question

A1 is not validated because lessons render or quizzes submit. The first production slice is validated only when a learner can move through the complete Lurexa learning loop and the resulting evidence changes what happens next.

The loop to prove is:

**Enter → Diagnose/Place → Learn Asynchronously → Receive AI Assistance → Produce Evidence → Interpret Evidence → Adapt Next Step → Retrieve Later → Optional Teacher Intervention → Return to Improved Async Path**

## 2. Pilot slice

Primary pilot: **A1 Module 1 — Hello, This Is Me**.

Required pilot behaviors:

1. learner starts at a responsible entry point;
2. lesson state resumes after interruption;
3. interactive input is followed by action;
4. AI responds within A1 constraints;
5. learner speaks and writes, not only selects;
6. first attempt is stored separately from supported completion;
7. repeated success can reduce support;
8. repeated difficulty increases targeted support rather than generic repetition;
9. module evidence produces a competency-level interpretation;
10. later activity retrieves earlier language;
11. teacher brief can be generated when teacher support exists;
12. teacher observation can affect future recommendations;
13. expert educator/mentor escalation is available for teacher/curriculum ambiguity;
14. no support mode lowers competency standards silently.

## 3. Validation layers

### Layer A — Content validity

Check that each activity measures or practices the competency it claims to target.

Pass conditions:

- objective, task, evidence and feedback align;
- recognition tasks are not used as sole proof of productive mastery;
- pronunciation tasks focus on intelligibility;
- conversation requires interaction;
- final module performance resembles the stated communicative goal.

### Layer B — Async completeness

Pass conditions:

- no required pedagogical step depends on a live teacher;
- learner can understand what to do without hidden teacher explanation;
- support is available inside the experience;
- learner can stop and resume;
- progression is not tied to one weekly calendar schedule.

### Layer C — AI pedagogical quality

Evaluate whether AI:

- respects level and task;
- uses current competencies;
- does not over-answer;
- allows productive struggle;
- corrects selectively;
- handles unexpected but reasonable learner language;
- distinguishes communication success from formal accuracy;
- produces traceable formative interpretation rather than opaque grades;
- escalates uncertainty appropriately.

### Layer D — Evidence integrity

Pass conditions:

- evidence records source, competency, attempt and provenance;
- first attempt is preserved;
- hint/retry history is preserved;
- teacher and AI observations are distinguishable;
- interpretation does not silently overwrite raw evidence;
- later evidence can strengthen, weaken or revalidate a mastery inference.

### Layer E — Adaptation quality

Test at least these learner profiles:

1. fast learner with strong recognition and production;
2. learner with strong recognition but weak speaking;
3. learner with repeated `be` omission;
4. learner with pronunciation issue that affects intelligibility;
5. learner who needs multiple hints;
6. learner returning after several days;
7. learner who demonstrates prior knowledge and should accelerate.

For each profile, verify that the next experience changes in a pedagogically defensible way.

### Layer F — Teacher integration

Teacher-supported pilot should verify:

- teacher receives concise evidence brief;
- recommended live task targets a real need;
- teacher can reject/modify AI recommendation;
- teacher can capture observation/confidence;
- post-session async path changes appropriately;
- learner is not forced to repeat unrelated content.

### Layer G — Expert educator/mentor integration

Pilot expert support with at least one teacher case involving:

- assessment ambiguity;
- persistent pronunciation/correction question;
- difficult learner-pattern interpretation; or
- curriculum/async-design issue.

Success means the expert response helps the teacher make a stronger decision and yields a reusable artifact or protocol when the issue is recurring.

## 4. Core pilot scenarios

### Scenario 1 — Independent success

Learner completes Lesson 1.1.1 with strong first-attempt recognition and intelligible spoken greeting.

Expected system behavior:

- reduce redundant recognition;
- continue required retrieval;
- move learner toward production;
- do not label full competency mastered from one task.

### Scenario 2 — Recognition-production gap

Learner gets greeting/name items correct but cannot produce `What's your name?` without a model.

Expected:

- maintain recognition evidence as strong;
- keep production evidence low-confidence;
- present spoken retrieval and guided conversation;
- do not repeat easy MCQ practice as default.

### Scenario 3 — Heavy scaffolding success

Learner succeeds after multiple hints.

Expected:

- completion recorded;
- first attempt remains weak evidence;
- competency remains practiced/demonstrated only as appropriate;
- future retrieval scheduled.

### Scenario 4 — Recurrent language-transfer issue

Learner repeatedly produces `I from Dominican Republic`.

Expected:

- identify possible target-language pattern;
- provide concise `I am / I'm from...` contrast;
- require whole-phrase repair;
- re-check in a later context;
- escalate to teacher only if persistent or consequential.

### Scenario 5 — Intelligibility issue

Learner's pronunciation repeatedly causes AI misunderstanding in a core phrase.

Expected:

- focus only on communication-relevant feature;
- provide listen/compare/retry;
- retain communication goal;
- avoid accent-erasure framing;
- optionally surface Coach-compatible practice.

### Scenario 6 — Teacher extension

Learner completed async module but question formation remains weak.

Teacher receives evidence and runs short introduction/information-gap interaction.

Expected:

- teacher records observed independent performance;
- interpretation confidence adjusts;
- next async session retrieves questions in a new context.

### Scenario 7 — Expert educator escalation

Teacher is unsure whether a recurring learner pattern is a curriculum gap, expected development, or correction priority.

Expected:

- expert educator receives evidence summary and teacher question;
- provides rationale and recommended intervention;
- recurring solution is converted to curriculum guidance/case library/teacher-development asset where warranted.

## 5. Pilot metrics

Do not reduce quality to a single engagement score.

Track at minimum:

### Learning

- first-attempt success by evidence type;
- independent vs scaffolded production;
- retrieval performance after delay;
- conversation task completion;
- repair-strategy use;
- speaking/listening balance;
- productive/receptive gap.

### AI

- hint frequency;
- answer reveal frequency;
- correction frequency;
- learner retries after feedback;
- task-abandonment after AI interaction;
- level-control violations;
- human override/uncertainty cases.

### Async UX

- completion by stage;
- resume success;
- time on task by activity family;
- repeated loops without progress;
- accessibility failures;
- points where instructions cause avoidable confusion.

### Teacher

- brief usefulness;
- teacher preparation time;
- percentage of live time spent on target interaction vs reteaching;
- teacher override patterns;
- evidence captured after session;
- measurable post-session change.

### Expert educator

- escalation reason;
- resolution category;
- whether case revealed teacher-development need, curriculum issue, assessment-calibration issue, or one-off learner complexity;
- reusable artifact created;
- repeat frequency of the same issue.

## 6. Qualitative pilot observation protocol

For selected pilot learners, review recordings/screens/session traces and ask:

- Did the learner know what they were trying to accomplish?
- Did support arrive before frustration but after enough productive struggle?
- Did AI make the learner think/speak, or do the work for them?
- Did feedback improve the next attempt?
- Did the learner encounter prior language again later?
- Did the system distinguish "finished" from "can do"?
- Could the learner progress without waiting for a teacher?
- When a teacher entered, did human involvement add something materially different?

## 7. Failure conditions

Stop scaling A1 content and fix the underlying system if any of these occur systematically:

- learners can complete without speaking;
- AI routinely gives answers too early;
- AI exceeds level constraints;
- first attempts are lost after retries;
- every weak score triggers generic repetition;
- teacher sessions mostly repeat digital explanations;
- teacher observations do not influence the next path;
- learners cannot reliably resume;
- evidence cannot be traced to a competency/activity;
- opaque AI scoring is treated as authoritative mastery;
- accessibility barriers prevent an otherwise valid learning route.

## 8. Pilot sample strategy

Early internal/small pilot should intentionally include varied profiles rather than only high-performing volunteers.

Suggested profiles:

- true A1 beginner;
- A1 learner with partial prior knowledge;
- Spanish-speaking Dominican learner;
- learner with stronger reading than speaking;
- learner with low confidence/high hesitation;
- learner progressing quickly;
- learner using Flex only;
- learner using Guided teacher support.

This is a calibration sample, not a claim of population validity.

## 9. Release decision

A1 Module 1 can become the production reference only when:

- all critical pilot behaviors work;
- no major evidence-integrity defects remain;
- AI behavior is pedagogically bounded;
- at least one delayed-retrieval cycle works;
- at least one teacher-supported cycle returns useful evidence to the async path;
- expert escalation process is documented and usable;
- curriculum and product teams agree that the same model can be replicated without manual workarounds.

## 10. What follows after validation

Once the loop passes:

1. apply the validated production pattern to A1 Modules 2–8;
2. calibrate module-specific language/phonetics without redesigning the core loop;
3. move A2 Module 1 into production lesson authoring;
4. keep B1+ curriculum architecture ahead of implementation;
5. reuse pilot findings to improve Lurexa Teach teacher-development cases and AI simulations.
