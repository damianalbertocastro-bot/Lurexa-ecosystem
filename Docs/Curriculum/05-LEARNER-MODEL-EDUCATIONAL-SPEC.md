# Learner Model Educational Specification

Status: MVP pedagogical interpretation spec  
Architecture dependency: `Docs/Architecture/Learner Model Architecture.md`

## 1. Purpose

This document defines what learner information matters educationally and how curriculum, assessment, AI tutoring and teacher experiences should use it. It does not redefine ownership, authorization or persistence architecture.

## 2. Governing principle

> **Lurexa remembers learning.**

The longer a learner uses Lurexa, the less the ecosystem should need to rediscover what the learner knows, can do, struggles with, has improved, and should practice next.

## 3. Educational model domains

The Learner Model may progressively represent:

- estimated CEFR level and confidence;
- skill-specific proficiency evidence;
- competency state;
- curriculum position;
- vocabulary knowledge;
- grammar development;
- listening development;
- speaking development;
- reading/writing development;
- phonetic/pronunciation targets;
- conversation/interaction performance;
- recurring errors or misconceptions;
- strengths;
- learning goals;
- teacher observations;
- prior interventions;
- review/retention needs;
- relevant learning preferences when evidenced and useful.

## 4. Evidence is not interpretation

Evidence is what occurred. Interpretation is what Lurexa Mind infers from it.

Evidence examples:

- learner selected an answer;
- learner recalled a word without help;
- learner used three hints;
- learner submitted a recording;
- teacher marked a speaking target as developing;
- learner successfully used a target in later conversation.

Interpretation examples:

- likely B1 listening level;
- probable recurring final-consonant issue;
- vocabulary target likely mastered;
- recommended review in three days.

Do not overwrite evidence with conclusions.

## 5. Useful evidence fields

Where applicable, learning evidence should carry:

- competency ID(s);
- source product;
- lesson/activity/session;
- timestamp;
- attempt number;
- first-attempt result;
- scaffold/hint usage;
- response/performance metadata;
- human validation status;
- provenance;
- relevant reliability/confidence metadata.

Exact schemas are Core implementation work.

## 6. Actionable memory rule

Memory is useful only when it changes future learning appropriately.

Authorized learner context may influence:

- next lesson recommendation;
- challenge/skip suggestion;
- review timing;
- vocabulary card mode;
- phonetics target selection;
- AI conversation difficulty;
- scaffold amount;
- examples/context;
- teacher-session focus;
- Create & Apply suggestions;
- alerts for repeated difficulty.

## 7. Competency history

For each stable competency, Lurexa should be able to distinguish current educational state from evidence history.

Recommended state progression:

NOT_SEEN → ENCOUNTERED → PRACTICED → DEMONSTRATED → MASTERED → RETAINED → NEEDS_REVALIDATION

A state is a summary interpretation. Historical evidence remains traceable.

## 8. Vocabulary memory

Do not reduce vocabulary to known/unknown. Useful distinctions include:

- recognized from text/image;
- recognized from audio;
- recalled with prompt;
- recalled independently;
- pronounced intelligibly;
- used in sentence;
- used spontaneously in conversation/writing;
- retained later.

Example: a learner may recognize `although` reliably but rarely retrieve it in speech. Lurexa should stop over-practicing recognition and increase productive use.

## 9. Phonetics memory

Useful phonetics context may include:

- target feature;
- perception performance;
- production observations;
- intelligibility impact;
- recurrence across tasks;
- successful correction;
- last validated date.

Do not treat one automated pronunciation score as unquestionable truth.

## 10. Conversation memory

Relevant observations may include:

- task completion;
- response length;
- turn-taking;
- repair/clarification strategy use;
- fluency indicators;
- recurring target-language errors;
- pronunciation patterns affecting understanding;
- vocabulary retrieval;
- interaction confidence signals where responsibly inferred.

## 11. Teacher continuity

Teacher-facing context should summarize high-value learning information, not dump raw logs.

Example brief:

```text
Current target: describing past experiences
Strengths: listening detail; topic vocabulary
Priorities: irregular past forms; longer answers; final consonant clarity
Suggested live focus: guided storytelling + corrective pronunciation practice
```

Teachers should be able to add observations through approved evidence pathways.

## 12. Cross-product continuity

When authorized and relevant:

- Learn can surface targets identified by Coach;
- Coach can use current Learn curriculum context;
- Teach can surface learner priorities to a teacher;
- teacher evidence can influence future Learn/Coach recommendations;
- Insight may aggregate progress according to permissions.

Products must not create competing authoritative learner profiles.

## 13. Placement initialization

Placement initializes estimated proficiency and competency evidence. Early course performance should confirm or revise it. Learners must not be permanently constrained by their first placement result.

## 14. Forgetting and retention

Forgetting is expected. Important content should be retrieved later. If retrieval weakens, Lurexa should schedule focused reactivation rather than reset the learner to an entire earlier course section.

## 15. Personalization boundaries

Personalization should be educationally relevant and minimal. Avoid collecting or inferring personal data that is unnecessary for learning.

A learner preference should not override evidence that a different practice type is needed for mastery; instead, balance engagement and learning efficacy.

## 16. Future cross-domain model

The Learner Model must remain extensible beyond English. A person may eventually have independent but related competency graphs for English, mathematics, science or professional development.

Do not encode English-specific fields at the universal learner root when they can live inside a domain/language profile.

## 17. Student vs teacher-as-learner

The same identity may hold multiple educational roles. Teacher development should use a separate educational profile/context from student teaching records while remaining connected to the same authenticated person through Core.

## 18. MVP requirements

The MVP should at minimum be able to remember:

- placement recommendation;
- current lesson/module position;
- competency references from completed activities;
- first-attempt vs retry performance;
- basic mastery/progress state;
- recurring high-value errors where supported;
- next recommended practice;
- enough context to demonstrate that later lessons can adapt.

The MVP does not need to implement every future learner-model domain before validating the learning loop.
