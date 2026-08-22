# Lurexa Agent Orchestration Contract

## Purpose

Turn specialist instructions into one coordinated repository workflow. The active execution agent acts as orchestrator whenever a task spans more than one domain.

## Core rule

Do not simulate delegation by merely naming specialists. Load the relevant specialist file, apply its constraints to the task, perform the work in the same repository state, and record the handoff/result in the final task summary.

If the execution environment supports true child/subagents, delegate bounded analysis or review tasks to them. If it does not, emulate the same workflow sequentially by adopting each specialist role. Lack of child-agent support must never block progress.

## Routing matrix

Use these roles when the request affects the corresponding domain:

- product architecture, monorepo boundaries, contracts, shared services -> `software-architect.md`
- implementation -> `developer.md`
- curriculum, CEFR, learning objects, assessment, placement -> `curriculum-architect.md`
- instructional quality, cognitive load, feedback, pedagogy -> `pedagogist.md`
- UI, interaction, accessibility, brand/product personality -> `designer.md`
- testing, regression, acceptance criteria -> `qa-engineer.md`
- CI, Vercel, build, release, environments -> `devops-engineer.md`
- security, privacy, Core/Mind trust boundaries -> `auditor.md`
- source-of-truth/documentation -> `documentation-specialist.md`

## Mandatory multi-role patterns

### Feature work
1. Software Architect when boundaries/contracts may change.
2. Developer implements.
3. QA Engineer validates.
4. Auditor reviews security/privacy when data, auth, AI, persistence, or permissions are touched.
5. Documentation Specialist updates affected docs.

### Curriculum or learning-experience work
1. Curriculum Architect defines learning intent and schema impact.
2. Pedagogist reviews learning quality.
3. Software Architect reviews domain/data boundaries when implementation changes.
4. Developer implements.
5. QA Engineer validates behavior and evidence capture.
6. Documentation Specialist synchronizes curriculum/source-of-truth docs.

### UX redesign
1. Designer audits interaction and product personality.
2. Software Architect checks reuse/shared-component boundaries when appropriate.
3. Developer implements.
4. QA Engineer checks responsive behavior, accessibility, regression, and critical flows.

### Deployment/build failure
1. DevOps Engineer diagnoses reproducibly.
2. Software Architect joins if package/config architecture is implicated.
3. Developer applies code/config fix.
4. QA Engineer reruns affected checks.
5. Documentation Specialist updates setup/deployment docs if the fix changes operating procedure.

## Work phases

### 1. Discover
- inspect git/repository state;
- read relevant `AGENTS.md`, specialist files, and authoritative docs;
- identify existing implementation before proposing new structures;
- do not assume stale package, framework, deployment, or curriculum state.

### 2. Decide
- define problem statement;
- identify affected products/packages/docs;
- identify source-of-truth precedence;
- define acceptance criteria;
- prefer the smallest coherent change.

### 3. Implement
- preserve existing working behavior unless change is intentional;
- reuse shared contracts/components/packages;
- avoid duplicate sources of truth;
- do not silently broaden scope into unrelated refactors.

### 4. Verify
Run the narrowest relevant checks first, then broader checks when justified. Typical repository commands may include:

- `pnpm lint`
- `pnpm check-types`
- `pnpm test`
- `pnpm build`
- `pnpm verify:phase0`
- `pnpm verify:learner-model`

Do not claim checks passed unless they were actually executed in the current environment.

### 5. Review
Apply QA to all material changes. Apply Auditor when touching authentication, authorization, Firestore, learner records, AI providers, model inputs/outputs, secrets, or sensitive data.

### 6. Synchronize
Update relevant documentation when implementation changes architecture, product ownership, curriculum contracts, development setup, deployment behavior, or operating rules.

## Conflict resolution

When specialists disagree:

1. newest explicit product-owner decision;
2. root `AGENTS.md` precedence rules;
3. `Docs/00-Lurexa-Bible.md`;
4. detailed authoritative architecture/product/curriculum docs;
5. implementation evidence in the repository;
6. specialist preference.

Escalate only decisions that materially alter product scope, business policy, learner-data policy, or irreversible architecture. Do not escalate routine implementation choices that can be safely resolved from repository evidence.

## Autonomous-work policy

When the product owner asks to continue autonomously:

- perform all reversible, well-supported changes;
- do not stop after an audit when safe fixes are clear;
- validate after changes;
- leave genuinely ambiguous product/business decisions as explicit decision points;
- never fabricate successful command execution, deployments, or repository writes.

## Output contract

At completion report:

- roles applied;
- files/areas changed;
- important decisions;
- validation executed and results;
- remaining risks or blockers;
- product-owner decisions needed, if any.
