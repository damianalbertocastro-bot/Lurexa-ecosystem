# Assessment, Mastery and Placement

Status: MVP pedagogical assessment authority

## 1. Purpose

This document defines how Lurexa estimates starting level, evaluates learning, supports test-out, interprets mastery, and avoids trapping experienced learners in inappropriate entry-level content.

## 2. Assessment layers

Lurexa uses four core assessment layers:

1. Activity assessment — immediate formative evidence.
2. Lesson assessment — short objective-aligned review.
3. Unit/module assessment — integrated skill performance.
4. Level assessment — CEFR-aligned multi-skill evidence.

Additional assessment modes:

- placement/diagnostic;
- challenge checkpoint/test-out;
- retention/revalidation;
- teacher assessment;
- AI-supported formative interpretation.

## 3. Placement principle

Placement asks two different questions:

1. What is the learner’s best starting level/location?
2. What can the learner already do, and where are the important gaps?

A placement result is initialization, not permanent identity.

## 4. Placement test architecture

Target final system:

1. Rapid adaptive screening
2. Vocabulary + grammar in context
3. Listening
4. Reading
5. Speaking
6. Phonetics/pronunciation
7. Writing
8. Diagnostic synthesis

For MVP, the implementation may begin smaller, but data structures must support expansion to the complete model.

## 5. Placement output

The learner should receive:

- estimated overall CEFR level;
- skill estimates where enough evidence exists;
- recommended starting module/unit;
- priority reinforcement areas;
- confidence/uncertainty where useful.

Example:

```text
Overall: B1
Listening: B1+
Speaking: B1
Reading: B2-
Writing: A2+
Phonetics: A2+
Recommended entry: B1 Module 2
Reinforce: connected speech, extended writing, past accuracy
```

Avoid presenting artificial precision when evidence is weak.

## 6. Adaptive routing

A placement system should increase or decrease difficulty based on performance rather than force every learner through every level band.

The test should stop when there is sufficient evidence for a responsible placement estimate. Long testing that adds little confidence should be avoided.

## 7. Speaking and phonetics

A grammar-only test cannot support a strong CEFR placement claim. Speaking and listening matter especially for language proficiency.

For MVP, if speaking/phonetics assessment is not yet fully automated, clearly label the result as provisional and allow later confirmation through early lessons, Coach, or teacher evaluation.

## 8. Challenge checkpoint

When evidence suggests a learner already controls upcoming content, offer a short challenge such as:

> You seem comfortable with this unit. Take the challenge to move ahead.

Challenge evidence can mark competencies as DEMONSTRATED. Subsequent real performance should validate them before strong long-term mastery assumptions are made.

## 9. Mastery model

Recommended states:

NOT_SEEN → ENCOUNTERED → PRACTICED → DEMONSTRATED → MASTERED → RETAINED

A competency can later become NEEDS_REVALIDATION.

## 10. Evidence requirements

Different competencies require different evidence.

- vocabulary recognition: recognition items may contribute;
- vocabulary productive use: learner must retrieve/use the word;
- speaking: requires spoken output;
- conversation: requires interaction evidence;
- writing: requires writing evidence;
- phonetics: requires perception and/or production evidence;
- listening: requires listening-specific evidence;
- grammar: should eventually include communicative use, not only form selection.

## 11. First-attempt evidence

Record first-attempt performance separately from success after hints or retries. A learner who reaches the answer after heavy scaffolding should not receive the same mastery interpretation as a learner who retrieves it independently.

## 12. Formative quiz design

Every lesson should normally end with a 5-10 item formative review appropriate to the lesson.

Possible items:

- multiple choice;
- audio choice;
- image choice;
- sequencing;
- matching;
- fill-in;
- error correction;
- short answer;
- oral response;
- brief writing.

The quiz should not introduce new content.

## 13. Feedback

Avoid bare “incorrect” responses. Explain the highest-value reason at the learner’s level and allow retry where appropriate.

## 14. Unit/module assessment

A unit/module assessment should combine knowledge evidence with performance evidence.

Knowledge may include vocabulary, grammar, reading or listening comprehension. Performance may include speaking, writing, conversation, phonetics and integrated Create & Apply work.

## 15. Level-exit assessment

Do not certify level completion solely from multiple-choice testing.

A meaningful CEFR level-exit decision should include appropriate evidence across:

- listening;
- speaking;
- reading;
- writing;
- vocabulary/grammar control;
- phonetics/intelligibility;
- interaction/conversation.

Weighting changes by level.

## 16. Speaking rubric dimensions

Possible dimensions:

- task achievement;
- comprehensibility;
- fluency;
- vocabulary;
- grammar control;
- pronunciation/phonetics;
- interaction;
- register/discourse at higher levels.

At A1, task completion and comprehensibility carry more weight than sophistication. At C1-C2, flexibility, precision, nuance and register matter more.

## 17. Teacher authority

AI may suggest scores, patterns or feedback, but high-value performance tasks may require teacher validation depending on product policy. Teacher evidence should retain provenance rather than overwrite original learner evidence.

## 18. Retention and revalidation

Mastery decays. Important competencies should reappear through spaced retrieval. If a previously mastered target becomes consistently weak, move it toward NEEDS_REVALIDATION and provide efficient review instead of forcing complete course repetition.

## 19. Free-tier placement rule

Placement is a learning function and should be available to free learners at a useful level. Subscription tier must not change the learner’s proficiency estimate.

Free content availability may affect what can be accessed next, but the interface should distinguish access limitations from academic level.

## 20. Teacher placement/development

Future Lurexa Teach assessment should separate:

- English proficiency;
- teaching competence.

A teacher may use a related language assessment and receive a development pathway, but teacher assignment policy should not rely on one automated CEFR score alone.

## 21. MVP acceptance criteria

The MVP assessment layer should be able to:

- initialize an A1 vs non-A1 starting recommendation;
- avoid forcing knowledgeable users through beginner material;
- store assessment evidence with competency references;
- distinguish completion from mastery;
- support retries without losing first-attempt evidence;
- produce a next-step recommendation;
- remain extensible to multi-skill adaptive placement.
