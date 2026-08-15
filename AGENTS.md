# Lurexa AI Development Rules

<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

## Tech Stack

- Next.js
- TypeScript
- TailwindCSS
- Firebase
- Gemini
- Turborepo

## Rules

- Never use JavaScript.
- Never use `any`.
- Never hardcode colors.
- Use Design Tokens.
- Follow the UI Component Library.
- Reuse components before creating new ones.
- Do not duplicate logic.
- Prefer Server Components unless client-side state is required.
- Never access Firestore directly from UI components.
