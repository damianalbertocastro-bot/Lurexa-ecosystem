# Lesson Player UX Specification

Status: MVP design/engineering handoff

## Product objective
The lesson player should feel like an active guided learning session, not a document reader. The dominant learner behavior is listening, choosing, speaking, building, retrieving, writing and interacting.

## Core screen structure
### Header
- lesson title;
- concise mission;
- estimated remaining time;
- stage progress;
- exit/save control.

### Main activity surface
Only the current activity or a small coherent activity group should dominate the screen. Avoid long scrolling lessons.

### Assistance layer
Context-sensitive:
- replay audio;
- hint;
- vocabulary help;
- transcript when allowed;
- AI tutor entry;
- accessibility controls.

### Feedback layer
After response:
- correct/communication outcome;
- concise explanation;
- retry or continue;
- no celebratory animation so large that it breaks learning flow.

## Lesson stage UI patterns
### Hook
Full-width image/short clip/audio + prediction interaction.

### Mission
One learner-readable statement: `By the end, you can...`

### Vocabulary Builder
Use interactive vocabulary cards, not static front/back cards.
Modes rotate based on mastery:
- see + hear;
- image/context select;
- listen and identify;
- say/record;
- type/reconstruct;
- retrieve without choices;
- use in sentence/conversation.

### Listening
Controls:
- play/replay;
- optional speed only when pedagogically justified;
- first-listen task before transcript;
- second-listen detail task;
- micro-listening segments;
- transcript unlock according to activity design.

### Reading
Allow evidence-highlighting, sequencing, matching and short-response interactions where useful.

### Grammar/Language Focus
Use examples first. Keep explanation collapsible/compact. Follow explanation with action immediately.

### Phonetics Lab
- model audio;
- stress/phoneme visual cue;
- record;
- playback;
- one priority feedback point;
- retry;
- uncertainty messaging when speech analysis confidence is low.

### Conversation
Display scenario, goal and optional phrase support. Conversation should happen in a focused surface rather than a generic chatbot sidebar.

### Create & Apply
Show task brief, success criteria and submission modality. Teacher-assigned variants may include due date and rubric.

### Review
Fast retrieval rounds; avoid presenting the entire lesson again.

### Quiz
5-10 varied formative items. Provide explanatory feedback and retries according to assessment policy.

### Reflection
One short prompt or confidence check. Do not require long journaling every lesson.

## Mobile-first behavior
- primary action reachable with thumb;
- microphone button prominent during speaking;
- audio player persistent only when needed;
- avoid drag interactions that are inaccessible on small screens without alternatives;
- large touch targets;
- preserve progress on interruption.

## Engagement rules
- passive input should rarely exceed 3-5 minutes without interaction;
- vary interaction types but keep controls consistent;
- use progress meaningfully, not as pressure;
- celebrate demonstrated performance, not mere clicking;
- avoid excessive points/confetti during serious feedback.

## AI tutor placement
AI tutor should be context-aware. For a lesson stage, it receives stage/competency context and may:
- explain;
- give a hint;
- practice one extra example;
- conduct a scenario.
It must not replace the main curriculum flow by default.

## Adaptive UI
Examples:
- learner already recognizes vocabulary -> skip recognition card and require recall/use;
- repeated listening difficulty -> offer micro-listening/replay;
- strong performance -> reduce scaffolding;
- recurring phonetic target -> insert short optional Coach-style micro-practice.

## Teacher-visible artifacts
Speaking recordings, writing submissions and Create & Apply artifacts may be marked as teacher-reviewable. The student should know when a human teacher may review an artifact.

## Completion state
At lesson endpoint show:
- lesson completed;
- what learner practiced;
- strongest evidence;
- recommended next step;
- any optional review/Coach/teacher action.
Do not label every touched competency `Mastered`.

## Accessibility
- captions/transcripts where appropriate;
- keyboard alternatives;
- screen-reader labels;
- visible focus states;
- text equivalents for image-only instructions;
- audio controls;
- avoid color-only correctness signals.

## MVP acceptance criteria
A production A1 lesson can be completed on mobile and desktop and includes at least:
- interactive vocabulary;
- audio listening;
- learner response;
- speaking/recording or conversation;
- review/quiz;
- evidence submission;
- resumable progress;
- lesson-end recommendation.