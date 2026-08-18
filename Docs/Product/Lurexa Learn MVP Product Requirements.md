# Lurexa Learn MVP Product Requirements

- Status: **Normative design baseline**
- Product: Lurexa Learn
- Scope: first commercial learner-facing vertical slice

## Product outcome

A Spanish-speaking adult learner can enter Lurexa, receive a justified starting recommendation, complete an interactive A1 learning sequence, practice receptive and productive English, submit evidence, receive useful feedback, and return to an appropriate next recommendation.

The MVP must prove a coherent learning loop—not an exhaustive A1-to-C2 content catalogue.

## Primary user

Initial target: Dominican and other Spanish-speaking young adults learning English, including true beginners. The design must remain usable by learners with limited bandwidth, smaller mobile devices and variable prior digital-learning experience.

## MVP journey

1. Sign in/onboard with the necessary learner declarations and consent controls.
2. Complete a short placement/recommended-start flow or explicitly begin as a true beginner.
3. Enter a course/module/lesson with visible objective and expected output.
4. Complete interactive vocabulary, comprehension and language-form activities.
5. Complete at least one listening, speaking/phonetics or guided conversation activity when technically available.
6. Complete a Create & Apply task.
7. Receive immediate feedback and a clear next action.
8. Have relevant evidence accepted through Core and context available for the next experience.

## Functional requirements

| Area | MVP requirement |
| --- | --- |
| access | authenticated learner flow with safe session handling |
| placement | low-friction initial recommendation; no forced A1 for already knowledgeable learners |
| content | structured course/module/unit/lesson objects with stable IDs and versions |
| activities | at least reusable interactive patterns, not static card-only content |
| feedback | task-specific, constructive, CEFR-appropriate feedback |
| evidence | first attempts, hints/retries and final outcomes remain distinguishable |
| progression | completion and mastery are separate; next recommendation explains the action |
| learner context | only purpose-authorized, minimized context is used |
| resilience | responsive mobile UX, useful loading/error states and low-bandwidth consideration |
| accessibility | keyboard, readable contrast, focus, text alternatives and clear instructions |

## Required initial content scope

One A1 vertical slice should include a practical learner goal, explicit competency IDs, culturally relevant but non-stereotyped context, vocabulary in use, comprehensible input, guided practice, retrieval, communicative output, feedback and a short assessment/checkpoint.

See [Curriculum README](../Curriculum/README.md) for the instructional authority.

## Non-goals

- Full A1–C2 course production.
- Autonomous high-stakes placement decisions.
- A complete standalone Coach product.
- Institution administration, billing automation or marketplace scope.
- Perfect offline speech intelligence.

## Acceptance criteria

The MVP is ready for controlled learner testing only when a representative learner can finish the journey without an engineer, all evidence uses the Learning Evidence Contract, no UI directly writes trusted records or calls an AI provider for persistent intelligence, and the core route has tested empty/loading/error states.

## Success signals

Measure activation to first completed lesson, meaningful activity completion, first-attempt versus assisted performance, return to next recommendation, learner-reported clarity/confidence, technical error rate, latency and cost. Avoid treating time-on-screen alone as learning success.
