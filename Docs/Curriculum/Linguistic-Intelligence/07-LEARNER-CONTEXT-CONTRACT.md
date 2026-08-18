# Lurexa Learner Context Contract

Status: Pedagogical product contract — v0.1  
Applies to: context supplied by Lurexa Mind to Coach and other learning products  
Depends on: learner-model authority, Error Taxonomy, Corpus, Correction Policy, Evidence Model

## 1. Purpose

This contract defines the minimum educational context Lurexa Mind may provide to Coach so the conversation can adapt to the learner without Coach maintaining a competing learner profile.

This is a pedagogical contract. Core remains responsible for persistence, authorization, identity, and authoritative records.

## 2. Governing rule

> **Send only context that can change the current learning experience appropriately.**

The context should be compact, current, provenance-aware, and scoped to the present session.

## 3. Required top-level domains

A Coach context package should support:

- learner proficiency profile;
- session/task goal;
- current curriculum targets;
- active recurring linguistic patterns;
- pronunciation priorities;
- productive vocabulary targets;
- strengths or recently demonstrated control;
- recent correction history;
- correction preferences/mode where authorized;
- constraints on intervention;
- context version and freshness.

## 4. Skill-specific proficiency

Do not reduce proficiency to a single CEFR label when skill-specific evidence exists.

Example:

```json
{
  "overallEstimated": "B2",
  "listening": "C1",
  "reading": "C1",
  "speaking": "B2",
  "writing": "B2",
  "productiveVocabulary": "B2",
  "receptiveVocabulary": "C1"
}
```

Unknown fields may be omitted; they must not be invented.

## 5. Active patterns

Coach should receive only the highest-value learner patterns relevant to the session, not the full learner history.

Each active pattern should support:

- `patternId`;
- domain/subdomain;
- current state;
- recurrence;
- confidence;
- communicative impact;
- current priority;
- modality;
- last observed/validated time where useful;
- recommended intervention families;
- correction cooldown/recent history;
- optional learner-safe explanation hint.

Population transfer hypotheses should not appear as learner facts.

## 6. Current targets

Targets may come from Learn curriculum, Coach goals, teacher recommendations, or Mind review scheduling.

Each target should identify:

- competency/pattern reference;
- target type;
- expected activity mode;
- target priority;
- evidence needed to demonstrate progress.

## 7. Pronunciation priorities

Pronunciation context should distinguish:

- perception target;
- production target;
- connected-speech target;
- intelligibility impact;
- whether pronunciation/grammar cause is unresolved.

Coach must not receive a generic instruction such as `fix accent`.

## 8. Vocabulary context

Vocabulary context should distinguish:

- not known;
- recognized;
- recall with cue;
- independent recall;
- spontaneous productive use;
- retained use.

When receptive knowledge is stronger than productive use, Coach should prefer retrieval opportunities over redundant definitions.

## 9. Recent correction history

To prevent repetitive nagging, context may include recent interventions for the same pattern:

```json
{
  "patternId": "DO-ENG-PRO-006",
  "recentInterventions": 2,
  "lastAction": "MODEL_AND_REPEAT",
  "lastRetrySuccessful": true,
  "cooldownSuggested": true
}
```

Cooldown does not block correction when communication breaks down or the feature is the active accuracy target.

## 10. Session mode

Required session/task metadata should include one of the taxonomy task modes, for example:

- `CONTROLLED_ACCURACY`
- `GUIDED_PRACTICE`
- `GUIDED_CONVERSATION`
- `FLUENCY_CONVERSATION`
- `PRONUNCIATION_FOCUS`
- `ASSESSMENT`
- `FREE_PRODUCTION`
- `PROFESSIONAL_COMMUNICATION`
- `ACADEMIC_COMMUNICATION`

Correction behavior depends strongly on this field.

## 11. Correction configuration

Mind may provide a bounded recommendation such as:

```json
{
  "timingDefault": "DELAYED",
  "maxPriorityCorrectionsPerSegment": 2,
  "preferSelfRepair": true,
  "allowL1AwareExplanation": true,
  "protectFluency": true
}
```

Coach may override timing for actual communication breakdown or safety-critical misunderstanding.

## 12. Strengths and protected successes

Context should include relevant recently demonstrated strengths so Coach does not repeatedly remediate mastered features.

Examples:

- current target recently used spontaneously three times;
- pronunciation feature improved and is in revalidation rather than active remediation;
- vocabulary target is productively retained.

## 13. Population profile boundary

A learner context may identify an authorized L1/variety profile for selecting possible explanations or diagnostic contrasts. It must not inject unconfirmed population errors into `activePatterns`.

Example:

```json
{
  "languageBackground": {
    "l1": "es",
    "variety": "es-DO",
    "useForHypothesisGeneration": true
  }
}
```

This permits Coach to consider Spanish-aware contrasts without asserting transfer.

## 14. Privacy/minimization

Do not include personal biography, demographic assumptions, or unrelated memory merely to make Coach sound personalized. Context must be educationally relevant and authorized.

## 15. Freshness and versioning

Every context package should support:

- `contractVersion`;
- generated timestamp;
- optional learner-model revision/version;
- source freshness for high-priority patterns.

Coach must not silently persist or mutate the authoritative context. It returns evidence; Mind/Core update authoritative state.

## 16. Example context

```json
{
  "contractVersion": "0.1",
  "proficiency": {
    "overallEstimated": "B1",
    "speaking": "B1",
    "listening": "B2"
  },
  "session": {
    "mode": "GUIDED_CONVERSATION",
    "goal": "describe a recent experience"
  },
  "currentTargets": [
    {
      "patternId": "DO-ENG-PRO-006",
      "priority": "HIGH",
      "evidenceGoal": "spontaneous regular-past production"
    }
  ],
  "activePatterns": [
    {
      "patternId": "DO-ENG-PRO-006",
      "state": "UNSTABLE",
      "recurrence": "R2_REPEATED_ACROSS_SESSIONS",
      "confidence": "HIGH",
      "communicativeImpact": "CI1",
      "preferredActions": ["DELAYED_FEEDBACK", "RETRY_SEGMENT"]
    }
  ],
  "correction": {
    "timingDefault": "DELAYED",
    "maxPriorityCorrectionsPerSegment": 2,
    "preferSelfRepair": true,
    "protectFluency": true
  }
}
```

## 17. Coach evidence return contract

Coach should return structured evidence rather than editing learner state directly. Evidence may include:

- observed pattern ID or unclassified observation;
- learner form;
- context/task;
- communicative impact;
- intervention used;
- self-correction/retry outcome;
- spontaneous success;
- confidence/reliability metadata;
- session timestamp/source.

Mind interprets the returned evidence.

## 18. Failure-safe behavior

If context is missing or stale, Coach should use conservative level/task defaults and avoid inventing learner weaknesses. If a population profile is present without learner evidence, use it only to choose possible diagnostics or explanations.

## 19. MVP contract requirements

The MVP context must at minimum provide:

1. skill/overall level;
2. session mode/goal;
3. current targets;
4. a bounded list of recurring patterns with confidence;
5. correction timing/dosage recommendation;
6. pronunciation/vocabulary targets where relevant;
7. recent intervention state when needed;
8. a structured evidence-return pathway.
