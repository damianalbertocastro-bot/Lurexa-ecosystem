# Lurexa Real-User Validation Protocol

Updated: 2026-08-28

This protocol defines the minimum empirical validation required before a verified repository implementation is promoted toward production-readiness. Automated tests, simulations, roadmap completion, and successful deployments are prerequisites; they are not substitutes for observed user success.

## 1. Validation principles

1. Test the intended product journey, not a guided demo path.
2. Use participants who match the intended role and experience level.
3. Record observable outcomes separately from opinions.
4. Do not collect passwords, raw private messages, or unnecessary learner content in research notes.
5. Do not represent a simulated or researcher-assisted success as independent task success.
6. Stop a session if the participant encounters a privacy/security concern or cannot safely continue.
7. Product promotion requires both automated evidence and empirical evidence.

## 2. Initial validation cohort

The first validation round should remain small enough to diagnose problems deeply.

### Learners

Minimum: 5 participants.

Target characteristics:
- adult or young-adult English learners;
- Spanish-speaking participants preferred for the first Learn/Coach cohort;
- at least 3 participants at beginner/A1-A2 range;
- at least 1 participant primarily using a mobile-width device or phone;
- participants should not have been involved in implementing the tested interface.

### Educators

Minimum: 2 participants.

Target characteristics:
- active or recent English-language educators;
- able to evaluate teacher-workspace and Teach professional-development semantics;
- at least one participant unfamiliar with the repository architecture.

### Institutional administrator

Minimum: 1 participant before any institutional-production claim.

This role is not required for the first learner-only pilot, but is mandatory before Admin/Campus is promoted beyond internal validation.

## 3. Environment prerequisites

Do not begin the formal round until:

- required protected CI checks are green on the tested commit;
- the intended deployment is reachable through its canonical test/preview URL;
- the tested deployment SHA is recorded;
- test accounts/roles are isolated from production-sensitive records;
- basic telemetry/error correlation is enabled;
- known blocking security defects are closed or explicitly exclude the affected workflow;
- the moderator has a rollback/abort path.

Record at session start:

- deployment SHA;
- product/surface;
- browser/device category;
- participant role;
- test-account identifier or anonymized participant code;
- session date/time.

## 4. Learner validation journey

Run the journey without telling the participant exactly where to click unless the protocol reaches an assistance threshold.

### L1 — Entry and orientation

Prompt: "You want to start learning English with Lurexa. Begin from the product entry page and find the right starting path for you."

Observe:
- Can the participant identify the primary start action?
- Do they understand that onboarding chooses a goal and starting route?
- Can they explain the difference between beginning at A1 and taking the start check?

Success:
- reaches onboarding without moderator navigation;
- chooses a goal and starting route;
- can state what will happen next.

### L2 — Account transition

Prompt: "Continue until Lurexa asks you to create or use your account."

Observe:
- whether the account transition feels expected;
- whether intent is preserved;
- whether errors provide a recovery path.

Success:
- participant completes or reaches the expected authenticated transition without losing onboarding intent.

### L3 — First lesson

Prompt: "Start your recommended first lesson and work through it as naturally as you would on your own."

Observe:
- lesson orientation;
- activity instructions;
- progress feedback;
- error recovery;
- completion clarity;
- whether the learner understands what is practice versus assessed evidence.

Success:
- participant can start the lesson;
- completes required activities without moderator instruction;
- understands completion state and next action.

### L4 — Coach handoff

Prompt: "Find a speaking/pronunciation practice opportunity and continue into Coach."

Observe:
- whether Coach feels like a connected Lurexa product rather than an unrelated site;
- permission handling;
- microphone denial/retry behavior where safe to test;
- understanding of feedback;
- return-to-learning continuity.

Success:
- launches Coach through the governed product transition;
- begins a practice session;
- understands at least one actionable feedback item;
- can return to the appropriate learning context.

### L5 — Learner continuity

Prompt: "Return later in the session and find where you should continue."

Observe:
- dashboard comprehension;
- path/progress semantics;
- whether learner-facing intelligence is understandable rather than merely technically correct.

Success:
- participant can identify the next meaningful action without moderator explanation.

## 5. Educator validation journey

### E1 — Learn Teacher Workspace

Prompt: "You teach a course in Lurexa. Find your course, identify a learner who needs attention, and determine what action you could take."

Success:
- educator distinguishes course operations from professional development;
- finds roster/course insight without unsupported access;
- understands the instructional-support context.

### E2 — Learn → Teach boundary

Prompt: "Now suppose you want to improve your own professional skills rather than manage students. Find where Lurexa supports that."

Success:
- participant reaches Teach or clearly identifies Teach as the professional-development destination;
- does not mistake Teach for student/course administration.

### E3 — Professional Coach practice

Prompt: "Use the professional-development experience to find language practice that supports your growth."

Success:
- reaches Coach educator-professional mode through the intended bridge;
- understands that professional evidence is separate from learner/student context;
- returns to Teach appropriately.

## 6. Institutional validation journey

Run only after tenant-isolation and deployment prerequisites pass.

### I1 — Institution context

Prompt: "You manage one institution. Confirm where you are working and locate the people/program controls available to you."

Success:
- institution context is clear;
- participant cannot accidentally operate in another institution;
- governance terminology is understandable.

### I2 — Educator governance

Prompt: "Determine whether an educator is allowed to teach a specific course and make the permitted governance change."

Success:
- participant can distinguish affiliation, qualification, and teaching authorization;
- the UI does not imply that organization role alone grants teaching qualification.

### I3 — Billing preview/production truth

Until transactional billing exists, participant must correctly understand any billing surface as non-transactional planning/prototype behavior.

Failure condition:
- participant believes money was charged, a subscription was settled, or an entitlement was activated when no trusted transaction occurred.

## 7. Assistance thresholds

Classify every task outcome:

- **Independent success** — participant completes without moderator instruction.
- **Minor recovery** — participant self-recovers after an error or brief hesitation.
- **Prompted success** — moderator must give a directional hint.
- **Assisted success** — moderator gives step-level instruction.
- **Failure** — participant cannot complete or reaches an incorrect terminal state.

Do not combine prompted/assisted success with independent success in reported completion rates.

## 8. Severity model

### S0 — Safety/security blocker

Examples:
- cross-tenant data exposure;
- unauthorized action succeeds;
- secrets/private learner data exposed;
- user is falsely told an external transaction succeeded.

Action: stop affected validation and block promotion.

### S1 — Journey blocker

Participant cannot complete a critical task without moderator intervention.

Action: fix before next production-readiness promotion.

### S2 — Material confusion/recovery problem

Task completes, but terminology, navigation, state, or feedback causes repeated confusion.

Action: prioritize before broad rollout.

### S3 — Usability/polish issue

Task is understandable and completable; improvement would reduce friction.

Action: backlog unless repeated across participants.

## 9. Quantitative acceptance thresholds

For the first small cohort, treat these as decision thresholds rather than statistical claims.

Critical learner tasks L1-L5:
- at least 80% independent or minor-recovery success across participants;
- zero S0 findings;
- no critical task with more than one S1 failure in a five-person cohort.

Coach:
- at least 80% of participants can explain one actionable piece of feedback in their own words;
- zero sessions where a failed/unperformed provider action is presented as completed success.

Educator flows:
- both initial educators should correctly distinguish Learn Teacher Workspace from Teach after using the products;
- zero unauthorized learner-context access.

Accessibility/device:
- critical journey must be completed by at least one phone/mobile-width participant;
- keyboard-only smoke journey must have no blocking focus/navigation defect before production promotion.

## 10. Session evidence template

Use an anonymized participant code such as `L01`, `L02`, `E01`.

Record:

| Field | Value |
| --- | --- |
| Participant code | |
| Role | learner / educator / admin |
| Deployment SHA | |
| Product/surface | |
| Device/browser category | |
| Task | |
| Outcome | independent / minor recovery / prompted / assisted / failure |
| Time/hesitation note | |
| Observed issue | |
| Severity | S0 / S1 / S2 / S3 |
| Request/error correlation ID, if applicable | |
| Follow-up issue/PR | |

Never include a password, authentication token, raw private transcript, or unnecessary learner-identifiable content in this record.

## 11. Moderator questions

Ask only after observing the task unless clarification is necessary:

1. "What did you think would happen when you chose that?"
2. "What does this status mean to you?"
3. "What would you do next if I were not here?"
4. "Was anything unclear or unexpected?"
5. "For Coach: what feedback would you act on next?"
6. "For educators: where would you go to manage learners, and where would you go to develop yourself professionally?"

Avoid leading questions such as "Did you notice the Coach button?"

## 12. Promotion decision

After the cohort, produce a dated validation report containing:

- tested commit/deployment;
- participant composition;
- independent/minor/prompted/assisted/failure counts per critical task;
- all S0/S1 findings;
- repeated S2 patterns;
- defect links;
- what was not tested;
- whether the tested scope remains Verified, may advance toward Deployed/Production ready, or requires another iteration.

A product does not become production-ready merely because the cohort liked it. Promotion requires the repository maturity conditions, deployment acceptance, security, observability, and the relevant user-validation evidence together.

## 13. First-round exit rule

The first formal learner validation round is complete when:

- at least 5 learner sessions are recorded;
- required critical journey tasks have measured outcomes;
- all S0 findings are zero or fixed and revalidated;
- S1 blockers are fixed and revalidated;
- repeated S2 findings have an explicit decision/owner;
- the exact deployment SHA and runtime used are recorded;
- a summary report is committed under `Docs/Engineering/Validation/`.

The educator round is complete when at least 2 educator sessions meet the same evidence discipline for E1-E3.

Institutional production claims require a separate Admin/Campus validation round after the institutional trust boundaries and deployment are ready.
