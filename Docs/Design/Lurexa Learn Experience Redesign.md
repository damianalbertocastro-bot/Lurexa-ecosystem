# Lurexa Learn Experience Redesign

- Status: **Implementation specification**
- Scope: Lurexa Learn landing page, sign in, account creation, learner dashboard and educator dashboard
- Applies to: `apps/learn-web`
- Last updated: 2026-08-18

## 1. Design intent

Lurexa Learn must feel like a learning relationship, not a course catalogue, an AI novelty, or a generic school portal.

The experience is built around one promise:

> **Lurexa remembers learning and makes the next useful action clear.**

The visual expression is **calm intelligence**: editorial clarity, restrained warmth, evident progress, and a clear primary action. It is deliberately not gamified-first, visually noisy, or dashboard-heavy.

This specification extends the normative rules in:

- `Docs/Design/Design System Foundations.md`
- `Docs/Design/Learning Experience UX Principles.md`
- `Docs/Curriculum/00-LUREXA-LEARNING-METHODOLOGY.md`
- `Docs/Curriculum/05-LEARNER-MODEL-EDUCATIONAL-SPEC.md`

## 2. Audit findings and correction

| Surface | Current issue | Redesign correction |
| --- | --- | --- |
| Landing | A short dark hero and three generic proof cards do not explain the learning loop or differentiate Lurexa. | A full narrative: promise → personal path → how adaptation works → educator continuity → clear conversion. |
| Sign in | A generic centred card makes Lurexa look interchangeable with an admin tool. | A two-column welcome surface with a concise learning promise, trusted recovery cues, and a low-friction form. |
| Sign up | The learner/educator fork is presented as a technical membership decision before the user understands its value. | A role choice with outcome-based language, purpose-aware field labels, and clear continuation. |
| Learner dashboard | Courses, points, and streak are visually equal; no single lesson recommendation dominates. | The recommended next learning action dominates, with progress, review, and course context supporting it. |
| Teacher dashboard | Course management, invitations, plan information, and placeholder roster compete at the same hierarchy. | A teacher starts with instructional signals: learners needing attention, next class action, course activity, then administration. |

## 3. Experience principles

1. **One primary action.** Every screen exposes one obvious next step.
2. **Progress is orientation, not pressure.** Streaks and points remain supporting signals, never the reason to learn.
3. **Evidence earns prominence.** Show learning context and actionable signals before vanity metrics.
4. **Human teaching remains visible.** Teacher workspaces foreground learners and instructional decisions, not raw administration.
5. **AI is an understandable helper.** Explain personalization in plain language; do not claim certainty from incomplete evidence.
6. **Start local, remain global.** Initial English contexts can feel relevant to Dominican and Spanish-speaking learners without stereotypes or isolation.
7. **Mobile retains meaning.** The primary action, status, and recovery path remain available without hover, a large screen, or uninterrupted connectivity.
8. **Accessibility is structural.** Text hierarchy, control labels, focus, contrast, and non-colour status cues meet the WCAG 2.2 AA target.

## 4. Visual system

### Color roles

| Token | Value | Use |
| --- | --- | --- |
| `--learn-ink` | `#15243d` | Primary text and dark surfaces |
| `--learn-canvas` | `#f7f7f4` | App background |
| `--learn-paper` | `#ffffff` | Cards and forms |
| `--learn-brand` | `#4f46e5` | Primary actions and active states |
| `--learn-sky` | `#dff4ff` | Informational support |
| `--learn-mint` | `#ddf8e9` | Positive progress/support |
| `--learn-sand` | `#fff3d9` | Review and gentle attention |
| `--learn-line` | `#dfe5ec` | Quiet boundaries |

Status never relies only on colour: it includes a label, icon or textual explanation.

### Typography and layout

- Use the installed Geist sans family through the root layout token; do not fall back to generic Arial.
- Use a 12-column maximum 1280px content frame on desktop, 20px gutters on mobile, 32px on tablet/desktop.
- Use compact eyebrow labels for orientation, not as decorative noise.
- Use generous headline line-height and 16px minimum body copy.
- Use 16px card radius, 24px for feature panels, and subtle border/shadow separation rather than heavy floating cards.

### Components

| Component | Design rule |
| --- | --- |
| Primary CTA | Dark ink or brand fill; clear verb; 48px minimum touch target. |
| Secondary CTA | Quiet outline or text treatment; never competes with the main action. |
| Progress | Includes meaningful label and numeric context; never implies mastery from completion alone. |
| Metric | Shows a learning or teaching consequence, not only a number. |
| Empty state | Names what is missing and gives the next valid action. |
| Form field | Persistent visible label, useful example, error text adjacent to the field. |
| Personalized recommendation | Shows the recommended action, concise rationale, time estimate, and alternative/review path where available. |

## 5. Surface specifications

### 5.1 Landing page

**Goal:** Convert interest into an appropriate entry point without overselling AI.

**Information order:**

1. Navigation and split paths for learners and educators.
2. Hero promise: usable English, personal path, no repeated rediscovery.
3. A live-looking learning-path preview showing current mission, progress and next action.
4. A three-step explanation of the learning loop: learn, practise, remember.
5. A learner/teacher continuity section explaining role-appropriate support.
6. Final conversion and low-friction reassurance.

**Primary CTA:** Start your learning path.
**Secondary CTA:** Explore for educators.

### 5.2 Sign in

**Goal:** Return a learner or educator to their continuing context.

- Keep the form concise: email, password, submit.
- State that Lurexa will return the user to their workspace.
- Link directly to account creation.
- Use role-neutral language until the authenticated role determines the destination.
- Add no decorative onboarding questions.

### 5.3 Account creation

**Goal:** Make the first role choice meaningful and reversible in future through Core identity/role relationships.

- Student: “Join your class” with an access code and concise explanation.
- Educator: “Create your teaching space” with an institution name.
- Preserve existing registration and organization APIs.
- Explain what the information is for immediately above the action.
- Do not position a class code as a mysterious technical requirement.

### 5.4 Learner dashboard

**Goal:** Help a learner resume or choose the next educationally meaningful action.

**Hierarchy:**

1. Personal greeting and short continuity statement.
2. Dominant “Continue your path” panel: next lesson, target, rationale, time estimate, action.
3. Supporting progress snapshot: active path, module progress, review need.
4. Course cards only after the recommended action.
5. Streak/points as quiet supporting context.

The dashboard must eventually consume an authorized recommendation from Lurexa Mind through a Core-governed contract. Until that contract is implemented, UI copy must label the shown action as a course continuation, not an unsupported AI inference.

### 5.5 Educator dashboard

**Goal:** Make high-value teaching decisions faster.

**Hierarchy:**

1. Greeting and instructional context.
2. “Teaching focus” panel: a clear action and its evidence/rationale.
3. At-a-glance learning signals: learners needing support, active courses, invitations.
4. Course activity for creation and publishing.
5. Invitation and billing administration below teaching work.

The current API does not provide learner-risk or mastery summaries. The new UI therefore preserves existing data while reserving the teaching-focus component for an explicit empty/coming-next state. Do not fabricate learner risk.

## 6. Responsive and accessibility behavior

- Below 768px, two-column hero/auth layouts stack; primary CTA remains first after the most important content.
- Dashboard metric rows become horizontally readable cards or a single column; actions remain visible without a sticky hover interaction.
- Use `focus-visible` rings with 3:1 contrast against adjacent colours.
- Respect `prefers-reduced-motion`; no essential meaning depends on animation.
- Forms use programmatic labels; status chips combine text and icon.
- Error messages are announced adjacent to their form context and do not depend only on red.
- Decorative visual shapes are hidden from assistive technology.

## 7. Implementation boundary

This redesign changes presentation hierarchy and user guidance. It does not change:

- authentication;
- organization creation, joining, invitations, or revocation;
- authorization;
- direct data access patterns;
- course, lesson, progress, points or streak schemas;
- learner-model ownership or AI provider integration.

Any future live recommendation, learner-risk signal, or teacher intervention feature must use approved Core/Mind contracts, preserve evidence versus interpretation, and expose a learner/teacher-appropriate rationale.

## 8. Acceptance criteria

- [ ] Each of the five surfaces has one unambiguous primary action.
- [ ] Landing content explains the Lurexa learning loop without generic AI claims.
- [ ] Sign in and sign up preserve existing API calls and redirects.
- [ ] Learner dashboard makes lesson continuation visually dominant.
- [ ] Teacher dashboard prioritizes teaching over administration without inventing data.
- [ ] Desktop and mobile layouts reflow without hidden essential information.
- [ ] All changed interactive elements retain labels, keyboard focus, and accessible contrast.
- [ ] New visual values are represented by semantic Learn CSS tokens until promoted to shared `@lurexa/tokens` after cross-product review.
