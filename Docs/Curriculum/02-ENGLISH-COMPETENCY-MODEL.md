# English Competency Model

Status: MVP competency authority  
Framework: CEFR A1-C2

## 1. Purpose

This document defines the stable competency layer that sits between curriculum content and the persistent Learner Model. Lessons teach and generate evidence about competencies; competencies must not be tied permanently to one lesson or topic.

## 2. Competency families

Seven explicit skills:

- LISTEN
- SPEAK
- READ
- WRITE
- VOCAB
- GRAMMAR
- PHON

Integrated modes:

- CONV — conversation/interaction
- CREATE — applied production
- PRAG — pragmatic competence
- STRAT — learning/communication strategies
- MED — mediation: relaying, summarizing, reframing, facilitating understanding and co-constructing meaning
- ONLINE — online interaction across synchronous/asynchronous and multimodal communication
- PLURI — plurilingual/pluricultural competence: using linguistic/cultural repertoires and navigating perspectives appropriately

`MED`, `ONLINE`, and `PLURI` operationalize relevant CEFR Companion Volume dimensions. They should normally be integrated into authentic tasks rather than taught as isolated school subjects.

## 3. ID convention

Recommended pattern:

`EN.<CEFR>.<FAMILY>.<COMPETENCY_NAME>`

Examples:

- `EN.A1.SPEAK.INTRODUCE_SELF`
- `EN.A1.LISTEN.PERSONAL_INFORMATION`
- `EN.A1.PHON.FINAL_CONSONANTS`
- `EN.A2.MED.RELAY_SIMPLE_INFORMATION`
- `EN.B1.ONLINE.MANAGE_ROUTINE_EXCHANGE`
- `EN.B1.CONV.EXPRESS_OPINION`
- `EN.B2.MED.SUMMARIZE_ACCESSIBLE_SOURCES`
- `EN.C1.PLURI.NAVIGATE_MULTIPLE_PERSPECTIVES`
- `EN.C1.WRITE.ARGUMENTATIVE_ANALYSIS`

IDs are stable internal identifiers. UI titles can change without changing historical competency evidence.

## 4. Competency state

Recommended educational states:

- NOT_SEEN
- ENCOUNTERED
- PRACTICED
- DEMONSTRATED
- MASTERED
- RETAINED
- NEEDS_REVALIDATION

State must be based on evidence and confidence rather than a single completion flag.

## 5. Evidence dimensions

Where relevant, a competency may track separate evidence for:

- recognition;
- recall;
- guided production;
- independent production;
- interaction;
- mediation;
- online/multimodal performance;
- transfer to new context;
- retention over time;
- teacher validation;
- AI-derived interpretation confidence.

## 6. A1 production competency set

### Listening

- `EN.A1.LISTEN.FAMILIAR_WORDS` — recognize highly familiar words and phrases.
- `EN.A1.LISTEN.PERSONAL_INFORMATION` — understand names, countries, nationality, age, job and contact details in slow clear speech.
- `EN.A1.LISTEN.SHORT_INSTRUCTIONS` — understand short classroom/app and everyday instructions.
- `EN.A1.LISTEN.PREDICTABLE_EXCHANGES` — follow basic greetings, introductions, ordering, shopping and direction exchanges.
- `EN.A1.LISTEN.KEY_DETAILS` — identify predictable details such as number, time, place, price or name.

### Speaking

- `EN.A1.SPEAK.INTRODUCE_SELF`
- `EN.A1.SPEAK.INTRODUCE_OTHER`
- `EN.A1.SPEAK.ASK_PERSONAL_QUESTIONS`
- `EN.A1.SPEAK.DESCRIBE_PERSON`
- `EN.A1.SPEAK.DESCRIBE_ROUTINE`
- `EN.A1.SPEAK.BASIC_TRANSACTION`
- `EN.A1.SPEAK.GIVE_SIMPLE_DIRECTIONS`
- `EN.A1.SPEAK.EXPRESS_BASIC_PREFERENCE`

### Reading

- `EN.A1.READ.FAMILIAR_WORDS`
- `EN.A1.READ.SHORT_MESSAGES`
- `EN.A1.READ.FUNCTIONAL_INFORMATION`
- `EN.A1.READ.SHORT_DESCRIPTIONS`
- `EN.A1.READ.SIMPLE_DIRECTIONS`

### Writing

- `EN.A1.WRITE.BASIC_FORM`
- `EN.A1.WRITE.PERSONAL_SENTENCES`
- `EN.A1.WRITE.SHORT_DESCRIPTION`
- `EN.A1.WRITE.BASIC_MESSAGE`
- `EN.A1.WRITE.SIMPLE_ROUTINE`

### Vocabulary

- `EN.A1.VOCAB.IDENTITY`
- `EN.A1.VOCAB.NUMBERS_TIME_DATES`
- `EN.A1.VOCAB.FAMILY_PEOPLE`
- `EN.A1.VOCAB.DAILY_ACTIVITIES`
- `EN.A1.VOCAB.FOOD_SHOPPING`
- `EN.A1.VOCAB.PLACES_DIRECTIONS`
- `EN.A1.VOCAB.PREFERENCES_HOBBIES`
- `EN.A1.VOCAB.FUNCTIONAL_SURVIVAL_PHRASES`

### Grammar

- `EN.A1.GRAMMAR.SUBJECT_PRONOUNS`
- `EN.A1.GRAMMAR.BE_AFFIRMATIVE_NEGATIVE`
- `EN.A1.GRAMMAR.BE_QUESTIONS`
- `EN.A1.GRAMMAR.POSSESSIVE_ADJECTIVES`
- `EN.A1.GRAMMAR.ARTICLES_BASIC`
- `EN.A1.GRAMMAR.PRESENT_SIMPLE`
- `EN.A1.GRAMMAR.PRESENT_SIMPLE_QUESTIONS`
- `EN.A1.GRAMMAR.THERE_IS_ARE`
- `EN.A1.GRAMMAR.PREPOSITIONS_BASIC`
- `EN.A1.GRAMMAR.COUNTABILITY_FOUNDATIONS`
- `EN.A1.GRAMMAR.SOME_ANY_BASIC`

### Phonetics

- `EN.A1.PHON.SOUND_SPELLING_AWARENESS`
- `EN.A1.PHON.HIGH_VALUE_CONTRASTS`
- `EN.A1.PHON.FINAL_CONSONANTS`
- `EN.A1.PHON.BASIC_CLUSTERS`
- `EN.A1.PHON.WORD_STRESS`
- `EN.A1.PHON.BASIC_SENTENCE_STRESS`
- `EN.A1.PHON.BASIC_INTONATION`
- `EN.A1.PHON.INTELLIGIBLE_CORE_PHRASES`

### Conversation

- `EN.A1.CONV.GREETING_EXCHANGE`
- `EN.A1.CONV.PERSONAL_INTRODUCTION`
- `EN.A1.CONV.ASK_ANSWER_BASIC_QUESTIONS`
- `EN.A1.CONV.REQUEST_CLARIFICATION`
- `EN.A1.CONV.BASIC_TRANSACTION`
- `EN.A1.CONV.SHORT_SUPPORTED_CONVERSATION`

### Create & Apply

- `EN.A1.CREATE.PERSONAL_INTRODUCTION`
- `EN.A1.CREATE.PERSONAL_PROFILE`
- `EN.A1.CREATE.FAMILY_PRESENTATION`
- `EN.A1.CREATE.DAILY_ROUTINE`
- `EN.A1.CREATE.RESTAURANT_ROLEPLAY`
- `EN.A1.CREATE.NEIGHBORHOOD_MAP`

### Pragmatics and strategies

- `EN.A1.PRAG.BASIC_POLITENESS`
- `EN.A1.PRAG.TURN_TAKING_BASIC`
- `EN.A1.STRAT.ASK_REPEAT`
- `EN.A1.STRAT.ASK_MEANING`
- `EN.A1.STRAT.LISTEN_FOR_KEYWORDS`
- `EN.A1.STRAT.USE_CHUNKS`

### Mediation, online interaction and pluricultural foundations

At A1 these modes remain simple and highly scaffolded.

- `EN.A1.MED.RELAY_PERSONAL_DETAIL` — relay a simple name, number, time, place or other highly familiar detail.
- `EN.A1.MED.SHOW_OR_POINT_KEY_INFORMATION` — help another person identify straightforward information using words plus contextual support.
- `EN.A1.ONLINE.SHORT_SOCIAL_EXCHANGE` — participate in a very short predictable digital greeting/message exchange.
- `EN.A1.ONLINE.SHARE_BASIC_INFORMATION` — send or respond to simple personal/logistical information in a supported digital format.
- `EN.A1.PLURI.USE_L1_STRATEGICALLY` — use available linguistic resources strategically to clarify meaning without replacing the English-learning objective.
- `EN.A1.PLURI.RECOGNIZE_CULTURAL_DIFFERENCE` — notice that familiar social conventions may differ across contexts without evaluating one as inherently superior.

## 7. Cross-level progression anchors

A2 should move from formulaic survival language to routine independent communication. Mediation expands to relaying straightforward practical information; online interaction expands to routine messages and coordination.

B1 should move to connected discourse, sustained interaction, narration and supported argument/opinion. Mediation expands to summarizing accessible information and helping others follow familiar ideas; online interaction becomes independently manageable in familiar social/work/study contexts.

B2 should move to flexible spontaneous interaction, academic/professional functions and more authentic input. Mediation includes synthesizing accessible sources and explaining specialist information for non-specialists; online interaction includes collaborative and audience-aware participation.

C1 should move to complex argumentation, precision, register and nuanced discourse. Mediation includes facilitating complex discussion, reframing perspectives and synthesizing demanding material; pluricultural competence includes nuanced perspective-taking.

C2 should move to adaptive mastery across domains, accents, registers and abstract content. Mediation includes strategic facilitation, expert reframing and audience-sensitive transformation of complex meaning across domains.

Do not overload A1 with competencies better suited to A2 simply to make lessons richer.

## 8. Competency mastery rule

A competency should not become MASTERED solely because a learner passed one multiple-choice item. Productive competencies require productive evidence. Conversation requires interaction evidence. Phonetics requires perception and/or production evidence appropriate to the target. Mediation requires evidence that meaning was successfully relayed, reformulated, facilitated or co-constructed for a defined purpose. Online interaction requires actual or simulated interactive digital performance.

## 9. Retention rule

Important competencies should be retrieved after the original unit. Strong later performance increases retention confidence; repeated later difficulty can move a competency to NEEDS_REVALIDATION.

## 10. A2-C2 matrix expansion rule

A1 is production-ready first. A2-C2 competency matrices must be expanded before those levels are released. Each matrix should include all relevant skill and integrated families, prerequisites, evidence types, mastery expectations, transfer contexts and planned retrieval points.

The full macro-curriculum direction is defined in `11-ENGLISH-PROGRAM-MAP-A1-C2.md`.
