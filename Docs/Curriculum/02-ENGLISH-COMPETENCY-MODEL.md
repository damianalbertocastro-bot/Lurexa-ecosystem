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

## 3. ID convention

Recommended pattern:

`EN.<CEFR>.<FAMILY>.<COMPETENCY_NAME>`

Examples:

- `EN.A1.SPEAK.INTRODUCE_SELF`
- `EN.A1.LISTEN.PERSONAL_INFORMATION`
- `EN.A1.PHON.FINAL_CONSONANTS`
- `EN.B1.CONV.EXPRESS_OPINION`
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

## 7. Cross-level progression anchors

A2 should move from formulaic survival language to routine independent communication.  
B1 should move to connected discourse, sustained interaction, narration and supported argument/opinion.  
B2 should move to flexible spontaneous interaction, academic/professional functions and more authentic input.  
C1 should move to complex argumentation, precision, register and nuanced discourse.  
C2 should move to adaptive mastery across domains, accents, registers and abstract content.

Do not overload A1 with competencies better suited to A2 simply to make lessons richer.

## 8. Competency mastery rule

A competency should not become MASTERED solely because a learner passed one multiple-choice item. Productive competencies require productive evidence. Conversation requires interaction evidence. Phonetics requires perception and/or production evidence appropriate to the target.

## 9. Retention rule

Important competencies should be retrieved after the original unit. Strong later performance increases retention confidence; repeated later difficulty can move a competency to NEEDS_REVALIDATION.

## 10. MVP expansion rule

A1 is production-ready first. A2-C2 competency matrices should be expanded before those levels are released. The ID system and state model should be implemented in a way that does not require redesign when later levels are added.
