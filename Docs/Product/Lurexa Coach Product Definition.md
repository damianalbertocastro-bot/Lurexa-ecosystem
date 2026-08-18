# Lurexa Coach Product Definition

- Status: **Normative design baseline**
- Product: Lurexa Coach
- Initial specialization: Dominican Spanish speakers learning English

## Product outcome

Coach gives learners focused, context-aware English speaking, pronunciation and fluency practice that improves intelligibility, naturalness, confidence and communicative control. It automatically uses authorized context already earned through Lurexa rather than making each session start from zero.

Coach initially lives within or beside Lurexa Learn. It may become a distinct distribution surface only after it demonstrates independent user value.

## Product principles

- Optimize for intelligibility and agency, not accent erasure.
- Correct patterns that materially improve communication; do not overload the learner with every possible issue.
- Use CEFR level, recent curriculum targets, goals, correction preferences and reliable recurring patterns when authorized.
- Make corrective practice specific, actionable and connected to meaningful speech.
- Treat Dominican Spanish as the first deep linguistic profile, while keeping the profile model extensible.
- Explain uncertainty and allow a learner to disagree, retry or request another example.

## MVP modes

| Mode | Learner value | Minimum evidence |
| --- | --- | --- |
| guided conversation | safe, level-appropriate speaking turns | task/turn metadata, learner response reference, feedback delivery |
| role play | practice a meaningful real-world scenario | scenario, objective, attempt/outcome |
| pronunciation focus | targeted intelligibility practice | target, sample reference, measurement limits, learner retry |
| curriculum-linked practice | transfer a Learn objective into speaking | lesson/competency reference and outcome |

## Feedback policy

Feedback is brief, prioritized and immediately usable. It separates:

1. what was communicated successfully;
2. one or a small number of high-value improvements;
3. a model/recast or focused drill where appropriate;
4. another opportunity to speak.

Feedback must state limitations when speech recognition or model confidence is insufficient. It must not pretend to diagnose accent, identity, intelligence or personality.

## Evidence and learner model

Coach emits structured speaking-practice evidence through Core. Mind may identify evidence-supported candidate patterns. Approved observations return through the Learner Context Contract and can inform later Learn or Coach activities. Coach may not store an unmanaged private history as its source of truth.

## Safety and privacy

Audio/transcript use requires clear purpose and policy controls. Transmit and retain the minimum needed. Do not expose raw speaking records to teachers or institutions without authorization. Provider calls occur behind Mind boundaries with observability that avoids unnecessary learner content.

## MVP acceptance criteria

A learner enters a context-appropriate session, completes a speaking task, receives intelligible useful feedback, sees a next action, and has relevant evidence accepted without duplicate profiles. The system safely falls back when speech/model services are unavailable.
