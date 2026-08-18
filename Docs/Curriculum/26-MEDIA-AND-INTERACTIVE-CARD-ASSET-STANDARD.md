# Media and Interactive Card Asset Standard

Status: MVP content/design specification

## Principle
Media must reduce cognitive load, provide meaningful context, support comprehension and invite action. Decorative media is secondary to instructional media.

## Interactive Vocabulary Cards
A vocabulary card is a reusable learning object, not a fixed front/back flashcard.

### Required card data where relevant
- term/phrase;
- learner-readable meaning or function;
- audio model;
- contextual example;
- image/context cue;
- stress or pronunciation cue;
- competency reference;
- interaction modes;
- mastery/adaptation behavior.

### Interaction progression
See/Hear -> Recognize -> Pronounce -> Retrieve -> Use -> Recall Later

The system should not force every learner through every mode. Prior evidence may skip recognition and move directly to recall/use.

### A1 card example
Term: `Nice to meet you.`
1. show two people meeting + audio;
2. choose when the phrase is used;
3. record the phrase;
4. later show meeting image only and ask learner to retrieve it;
5. use it in a conversation.

### Higher-level card evolution
B1-C2 cards should increasingly emphasize:
- collocation;
- connotation;
- register;
- synonym distinction;
- discourse function;
- word families;
- idiomaticity;
- productive use.

## Image standard
Images should:
- clearly communicate the target context;
- avoid unnecessary text baked into the image;
- represent Dominican/Latin American learners naturally without visual stereotypes;
- include diverse ages, skin tones, professions and family structures;
- prefer realistic contemporary settings for functional lessons;
- use illustration when abstraction or privacy makes it pedagogically stronger;
- include meaningful alt text in product metadata.

Avoid:
- generic stock-photo overload;
- clichéd national symbols in every Dominican-context lesson;
- image answers that are ambiguous for cultural reasons;
- decorative photos that compete with instructions.

## Cultural context image rule
Use local imagery where it helps comprehension or relevance: neighborhood, café, classroom, transportation, beach/tourism, urban settings, family/community. Mix local and international contexts through level progression.

## Audio standard
### A1-A2
- clear natural speech;
- short utterances;
- controlled vocabulary;
- natural contractions when taught;
- reasonable replay access.

### B1-B2
- increasingly natural speed;
- varied speakers/accents;
- connected speech;
- longer exchanges.

### C1-C2
- authentic/semi-authentic discourse;
- broad accent exposure;
- nuance and natural pacing.

Audio should not be unnaturally slow unless a specific micro-listening exercise requires slowed analysis.

## Listening media package
A listening asset should support:
- audio source;
- speaker metadata where useful;
- transcript;
- transcript-release rule;
- segmentation timestamps for micro-listening;
- accessibility captions/text equivalent;
- target competencies.

## Pronunciation model audio
Where a phonetics activity has a model:
- provide isolated target only when useful;
- also provide phrase/sentence context;
- preserve natural rhythm;
- avoid presenting one accent as the only legitimate English model;
- focus feedback on intelligibility and target feature.

## Video standard
Use video when visual behavior carries meaning: gesture, conversation context, presentation delivery, cultural scene, process demonstration. Do not use video merely because it feels more engaging.

Passive video should rarely exceed 3-5 minutes without an interaction.

## Card motion and interaction
Animation may reinforce:
- reveal;
- sorting;
- progress;
- pronunciation stress;
- success/retry transitions.

Avoid motion that:
- delays every response;
- causes distraction;
- creates accessibility problems;
- makes repetition tedious.

Honor reduced-motion preferences.

## Responsive behavior
Cards and media must work on mobile first:
- no essential hover-only behavior;
- large touch targets;
- readable captions;
- microphone/audio buttons reachable;
- drag-and-drop has tap/keyboard alternative;
- image crop preserves instructional focus.

## Asset metadata contract
Recommended fields:
- id;
- kind;
- source/provider;
- license/provenance when external;
- altText;
- transcript/captions;
- locale/accent metadata where relevant;
- competencyIds;
- version;
- contentSafetyReview where required.

## AI-generated media
AI may generate contextual imagery/audio where permitted, but generated assets must still be reviewed for:
- instructional accuracy;
- cultural representation;
- visible text errors;
- pronunciation/audio quality;
- hallucinated symbols/locations;
- accessibility metadata.

Do not encode learner personal data into generated media prompts unless explicitly authorized and necessary.

## MVP asset priority for `First Hello`
Required:
1. one first-meeting context image/illustration;
2. greeting phrase audio set;
3. A1 dialogue audio with two speakers;
4. micro-listening clips for contractions/target phrases;
5. phonetics model audio for `hello`, `nice to meet you`, and learner greeting frame;
6. optional neutral avatar/scene for Sofia conversation.

The lesson must remain functional if decorative imagery fails to load; critical audio should have text accessibility support.

## Success metric
An asset is successful when it makes the learner more likely to understand, retrieve or use the target language—not when it merely makes the page look richer.