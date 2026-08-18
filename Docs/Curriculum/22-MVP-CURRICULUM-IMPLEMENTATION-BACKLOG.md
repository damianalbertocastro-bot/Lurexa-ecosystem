# MVP Curriculum Implementation Backlog

Status: Execution order for Codex / engineering

## Goal
Prove one complete learning loop before scaling curriculum volume.

The MVP milestone is reached when a learner can:
Placement -> Recommended start -> Interactive lesson -> Listen -> Speak -> Practice phonetics -> Converse -> Create/Apply -> Quiz -> Generate evidence -> Update learner context -> Receive an adapted next step.

## Phase A — Contract foundation
### A1. Introduce versioned curriculum types
Create typed v2 contracts alongside current `Course/Module/Lesson/ContentBlock` types.
Deliverables:
- `curriculum.ts`
- `activity.ts`
- typed lesson stages
- competency references
- assessment/evidence metadata

Do not remove legacy types yet.

### A2. Evolve progress model
Separate:
- lesson completion/status;
- activity attempts;
- competency evidence;
- mastery interpretation.
Keep backward compatibility while current routes migrate.

### A3. Extend learner evidence taxonomy
Add evidence types/domains required for:
- listening;
- speaking;
- reading;
- writing;
- grammar;
- vocabulary;
- phonetics;
- conversation;
- Create & Apply.
Preserve provenance and Core/Mind boundaries.

## Phase B — Curriculum content seed
### B1. Seed A1 Module 1 / Unit 1
Implement four lessons from `19-A1-MODULE-1-UNIT-1-VERTICAL-SLICE.md`.

### B2. Build content validation
A lesson cannot publish when required fields or activity contracts are invalid.

### B3. Legacy adapter
Render old generic content blocks through a compatibility path.

## Phase C — Learning UI
### C1. Stage-based lesson player
Replace long text rendering for v2 lessons with stage navigation.

### C2. Vocabulary Builder
Implement interactive card modes:
- reveal/context;
- audio;
- image/context select;
- pronunciation recording placeholder/integration point;
- retrieval;
- contextual use.

### C3. Listening activity
Implement audio player, global/detail prompts, replay policy, optional transcript state and evidence capture.

### C4. Speaking/recording
Implement recording UX and evidence metadata. Speech analysis may initially be mocked or provider-backed behind approved service boundaries.

### C5. Phonetics Lab
Support model audio, stress cue, recording, playback, feedback slot and retry.

### C6. Conversation surface
Scenario-driven interaction distinct from generic tutor chat. Pass bounded lesson/competency context.

### C7. Create & Apply
Support voice/text submission first; teacher review flag optional in MVP.

### C8. Review + Quiz
Use varied question types and explanatory feedback.

## Phase D — Placement
### D1. Placement onboarding route
Collect goal/self-report and run rapid screening.

### D2. A1-A2 diagnostic bank
Implement enough items to avoid trapping experienced beginners at A1.

### D3. Listening diagnostic
Add short audio tasks.

### D4. Speaking sample
Capture a short sample and store evidence. Automated scoring may begin conservatively.

### D5. Recommended starting point
Return level/band + recommended module/unit + confidence.

## Phase E — Learner memory
### E1. Evidence submission
Every qualifying activity submits structured evidence through approved backend/Core boundaries.

### E2. Learner context
Expose minimum authorized context needed by Learn.

### E3. Recommendation v1
Rules/Mind interpretation may recommend:
- continue;
- targeted review;
- pronunciation practice;
- listening practice;
- challenge checkpoint.

### E4. Demonstrate `Lurexa remembers`
Re-enter a later lesson and visibly adapt one activity using prior evidence.
Example: skip recognition for vocabulary already repeatedly recalled and move directly to production.

## Phase F — Human teacher bridge
### F1. Teacher-reviewable artifact flag
Mark selected speaking/writing/Create & Apply evidence.

### F2. Session brief contract
Prepare current targets, strengths and priority patterns.

### F3. Availability/booking
Only implement when scheduling workstream is ready; curriculum does not depend on it.

## Phase G — Free-tier controls
Implement capability limits independently from pedagogy:
- content access policy;
- AI quota;
- Coach quota;
- teacher-session entitlement.
Never encode free/paid differences inside mastery logic.

## Phase H — Quality gates
### Curriculum validation
- objective present;
- competencies referenced;
- required stages satisfied;
- quiz aligned;
- CEFR/language metadata present;
- accessibility metadata for media.

### UX validation
- mobile completion;
- resume after interruption;
- audio controls usable;
- microphone states clear;
- no color-only feedback;
- no static text-only default for v2.

### Evidence validation
- source/provenance present;
- lesson and activity IDs present;
- completion does not set mastery;
- AI interpretations distinguishable from evidence.

## Recommended build order for current Codex branch
1. read `Docs/Curriculum/README.md` and files 00-09;
2. read files 17, 19 and 21;
3. inspect current lesson page/API/types;
4. define v2 types + adapter;
5. implement Lesson 1 `First Hello` end-to-end;
6. validate evidence path;
7. implement remaining Unit 1 lessons;
8. add placement onboarding;
9. demonstrate one adaptation from remembered evidence;
10. only then scale A1 content.

## Definition of done for the vertical slice
- A1 Unit 1 contains 4 usable lessons;
- lesson player is stage-based;
- vocabulary is interactive;
- listening works;
- at least one speech capture path works;
- conversation has a defined scenario;
- quiz produces evidence;
- lesson completion is separate from mastery;
- learner can resume;
- one remembered behavior affects a later experience;
- free-tier access can expose the unit without changing pedagogy.