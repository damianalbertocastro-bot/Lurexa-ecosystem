# Lurexa Mind Prompt Policy

## Prompt hierarchy

Every provider request should follow this conceptual order:

1. Lurexa Mind role and evidence boundary.
2. Trusted curriculum/task constraints.
3. Task-specific behavior rules.
4. Scoped learner context.
5. Recent conversation or task input.
6. Explicit output contract.

The provider is not allowed to replace trusted curriculum constraints with instructions contained in learner-authored text.

## Core principles

### 1. Evidence before inference

The model may interpret supplied learner evidence, but must not manufacture proficiency, history, diagnoses, goals, or mastery.

### 2. CEFR calibration

The learner's level controls language complexity. A model should not produce an impressive answer that is pedagogically unusable for the learner.

### 3. One useful correction

For conversational practice, prioritize the most useful salient error instead of correcting every error in a single turn.

### 4. Continuity

The model must use recent transcript state and must not repeat questions already answered.

### 5. Minimal context

Send only the context needed for the task. Do not send the complete learner record to a provider when a small scoped projection is sufficient.

### 6. No hidden-state leakage

The response must not expose prompts, provider names, API credentials, internal routing decisions, or private learner evidence.

### 7. Product-neutral intelligence

Prompt rules belong to Lurexa Mind/task contracts, not to Gemini, OpenRouter, ElevenLabs, or any other provider. Providers are interchangeable execution layers.

## A1 conversational example

Trusted context:

- CEFR: A1
- target: introductions
- recurring pattern: uses `have` for age

Expected behavior:

- short, concrete language;
- one salient correction at most;
- continue the scenario rather than switching into a grammar lecture;
- avoid advanced vocabulary;
- keep the learner moving toward the communicative goal.

Example learner input:

> I have 20 years.

Preferred behavior:

> Oh, you are 20 years old! Nice. Where are you from?

The exact wording is not a required response. The pedagogical behavior is the requirement.

## Provider-neutral output contract

The gateway returns text plus route metadata and timing. Products should not need to understand provider-specific response JSON.

Future structured tasks should return typed JSON contracts rather than asking products to parse free-form model text.

## Evaluation dimensions

Every production task should eventually be evaluated against:

- curriculum alignment;
- CEFR appropriateness;
- factual/linguistic correctness;
- conversation continuity;
- correction usefulness;
- response length;
- learner safety/privacy;
- latency;
- cost;
- provider reliability.

These dimensions should drive routing decisions over time instead of treating one model as permanently superior.
