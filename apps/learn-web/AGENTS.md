<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Lurexa Learn curriculum rules

Before changing lesson pages, course progression, placement, quizzes, vocabulary, listening, speaking, phonetics, AI conversation, learner recommendations or learning evidence, read `Docs/Curriculum/README.md` and the task-specific files it lists.

For the current MVP vertical slice, read at minimum:
- `Docs/Curriculum/00-LUREXA-LEARNING-METHODOLOGY.md`
- `Docs/Curriculum/03-LESSON-AND-ACTIVITY-SCHEMA.md`
- `Docs/Curriculum/05-LEARNER-MODEL-EDUCATIONAL-SPEC.md`
- `Docs/Curriculum/09-INTERACTIVE-ACTIVITY-LIBRARY.md`
- `Docs/Curriculum/17-MVP-LEARNING-UX-AND-DATA-MIGRATION.md`
- `Docs/Curriculum/19-A1-MODULE-1-UNIT-1-VERTICAL-SLICE.md`
- `Docs/Curriculum/21-LESSON-PLAYER-UX-SPEC.md`
- `Docs/Curriculum/22-MVP-CURRICULUM-IMPLEMENTATION-BACKLOG.md`

## Non-negotiable product behavior
- A lesson is an interactive learning sequence, not a long text document.
- The seven English skills are listening, speaking, reading, writing, vocabulary, grammar and phonetics.
- Conversation and Create & Apply are integrated learning modes.
- Static front/back flashcards are not the default vocabulary experience.
- `lesson completed` does not mean `competency mastered`.
- Product UI records evidence; it must not directly declare inferred mastery.
- Learner memory/personalization must respect Core/Mind boundaries in the root `AGENTS.md` and architecture docs.
- Dominican-Spanish adaptation is a helpful initial profile, not a stereotype or permanent architecture constraint.
- Free-tier lessons preserve pedagogical quality; access/quota is separate from mastery.

## Current production target
Implement and validate:
`A1 -> Module 1: Hello, This Is Me -> Unit 1: Meeting People`

The first lesson to prove end-to-end is `First Hello`.

The flow should demonstrate:
interactive vocabulary -> listening -> language noticing -> phonetics -> guided speaking -> scenario conversation -> Create & Apply -> review/quiz -> structured evidence -> remembered next step.

Do not scale lesson volume before this vertical slice works end-to-end.