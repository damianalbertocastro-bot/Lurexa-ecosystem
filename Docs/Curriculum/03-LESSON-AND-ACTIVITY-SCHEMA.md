# Lesson and Activity Schema

Status: MVP implementation contract  
Purpose: define the pedagogical content model Codex and product code should implement

## 1. Principle

Content should be represented as structured learning objects, not hard-coded page copy. The schema must remain compatible with adaptive sequencing, free/paid access, teacher assignment, AI tutoring, learner evidence, future languages and future subjects.

## 2. Lesson contract

Conceptual TypeScript-like shape:

```ts
type Lesson = {
  id: string;
  domain: "language" | string;
  targetLanguage?: "en" | string;
  framework: "CEFR" | string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | string;
  courseId: string;
  moduleId: string;
  unitId: string;
  title: string;
  slug: string;
  summary: string;
  estimatedMinutes: number;
  communicativeGoal: string;
  learnerObjective: string;
  competencyIds: string[];
  prerequisiteCompetencyIds?: string[];
  languageFocus?: {
    vocabularyIds?: string[];
    grammarTargets?: string[];
    phoneticsTargets?: string[];
    functions?: string[];
  };
  stages: LessonStage[];
  assessment: LessonAssessmentConfig;
  evidencePlan: EvidenceExpectation[];
  adaptation: AdaptationRules;
  teacherOptions?: TeacherLessonOptions;
  access: AccessPolicy;
  status: "draft" | "review" | "published" | "retired";
};
```

The production implementation may differ syntactically, but must preserve the concepts.

## 3. Standard lesson stages

Recommended stage types:

- HOOK
- MISSION
- VOCABULARY_BUILDER
- CONTEXTUAL_INPUT
- COMPREHENSION
- LANGUAGE_NOTICING
- GRAMMAR_FOCUS
- PHONETICS_FOCUS
- GUIDED_PRACTICE
- CONVERSATION
- CREATE_APPLY
- REVIEW
- QUIZ
- REFLECTION

Not every lesson needs every stage, but skipping a stage should be intentional.

## 4. Activity contract

```ts
type Activity = {
  id: string;
  lessonId: string;
  stage: string;
  type: ActivityType;
  title: string;
  instructions: string;
  estimatedMinutes?: number;
  competencyIds: string[];
  difficulty: number | string;
  input: ActivityInput;
  expectedAction: LearnerAction;
  expectedOutput?: OutputExpectation;
  feedback: FeedbackPolicy;
  evidence: EvidencePolicy;
  retry: RetryPolicy;
  adaptation?: ActivityAdaptation;
  teacherAssignable?: boolean;
  aiEnabled?: boolean;
  accessibility?: AccessibilityConfig;
};
```

## 5. Activity input types

Inputs may include:

- text;
- image;
- illustration;
- interactive card;
- audio;
- video;
- transcript;
- dialogue;
- map;
- chart;
- teacher prompt;
- AI role/scenario;
- learner-generated artifact.

## 6. Learner action types

Supported pedagogical actions should include:

- select;
- match;
- order;
- classify;
- drag/drop;
- type;
- short-write;
- long-write;
- record-audio;
- listen-and-repeat;
- discriminate-sounds;
- shadow;
- construct-sentence;
- complete-dialogue;
- speak-to-AI;
- respond-to-teacher;
- peer-discussion;
- create-artifact;
- upload/submit;
- self-reflect.

## 7. Evidence contract

Each assessable activity should declare what evidence it can produce rather than merely emit a score.

```ts
type LearningEvidence = {
  evidenceId: string;
  learnerId: string;
  competencyIds: string[];
  sourceProduct: string;
  sourceLessonId?: string;
  sourceActivityId?: string;
  evidenceType: string;
  observedAt: string;
  attempt: number;
  performance?: number | string;
  responseMetadata?: Record<string, unknown>;
  provenance: string;
  humanValidated?: boolean;
};
```

Persistence, authorization and authoritative contracts remain governed by Core architecture.

## 8. Feedback policy

Activities should specify feedback behavior:

- immediate correctness;
- delayed feedback;
- explanatory feedback;
- phonetic feedback;
- communication feedback;
- teacher feedback required;
- AI coaching;
- no automatic answer until retries are exhausted.

Default language-learning feedback should be concise, specific, level-appropriate and actionable.

## 9. Retry policy

Use graduated support where useful:

1. independent retry;
2. small hint;
3. larger hint;
4. example;
5. explanation;
6. answer/reveal.

The system should record first-attempt performance separately from eventual completion.

## 10. Conversation schema

Conversation activities should define:

```ts
type ConversationConfig = {
  mode: "ai" | "teacher" | "peer" | "group";
  scenario: string;
  learnerRole?: string;
  counterpartRole?: string;
  targetCompetencies: string[];
  targetLanguage?: string[];
  turnGoal?: number;
  completionGoal: string;
  scaffoldLevel: "high" | "medium" | "low" | "none";
  correctionMode: "after-turn" | "after-segment" | "after-task";
  retryAllowed: boolean;
};
```

AI conversation prompts should use learner context through approved Mind/Core pathways rather than embedding private learner state directly in content.

## 11. Create & Apply schema

Creation tasks should specify:

- artifact/performance type;
- purpose/audience;
- required competencies;
- minimum success criteria;
- optional teacher rubric;
- AI assistance policy;
- submission type;
- whether human review is recommended or required.

## 12. Vocabulary object

Vocabulary should be reusable across lessons.

```ts
type VocabularyItem = {
  id: string;
  targetLanguage: string;
  lemmaOrPhrase: string;
  level: string;
  meanings: string[];
  exampleSentences: string[];
  audioRef?: string;
  phoneticDisplay?: string;
  stressPattern?: string;
  collocations?: string[];
  imageRef?: string;
  register?: string;
  l1Support?: Record<string, unknown>;
  competencyIds?: string[];
};
```

The UI must support multiple interaction modes per item, not one static front/back flashcard.

## 13. Access policy

Content objects should be able to declare business access without changing pedagogy:

```ts
type AccessPolicy = {
  tier: "free" | "paid" | "all" | string;
  preview?: boolean;
  aiAllowanceClass?: string;
  teacherFeatureRequired?: boolean;
};
```

A learner’s proficiency level must remain independent from subscription tier.

## 14. Teacher options

Lessons/activities may declare:

- recommended live extension;
- teacher discussion prompt;
- teacher-assigned Create & Apply task;
- rubric;
- intervention trigger;
- optional meeting preparation;
- post-session follow-up activity.

## 15. Adaptation rules

Adaptation may alter:

- support level;
- number of retrieval items;
- question difficulty;
- audio replay availability;
- conversation complexity;
- examples/context;
- phonetics targets;
- review frequency.

Adaptation must not silently change the competency standard being assessed.

## 16. UX rule

A page should render learning stages as interactive experiences rather than a long document. Prefer short cycles of input → interaction → feedback → production.

## 17. MVP minimum

The first production lesson should exercise at least:

- Vocabulary Builder;
- audio/listening;
- speaking recording;
- phonetics practice;
- grammar or language noticing;
- interactive practice;
- AI or simulated conversation contract;
- Create & Apply;
- review quiz;
- evidence generation;
- learner next-step recommendation.
