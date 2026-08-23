# Lurexa Brand Marks

These SVG files are the authoritative vector source assets for the Lurexa brand family.

Design principle: **shared grammar + distinct personalities**.

## Parent identity

- `marks/lurexa-master.svg` — **restored original Lurexa Master mark** for Lurexa Learning Technologies; institutional and foundational. The four-part violet/blue/navy/cyan mark with a white center is the canonical parent-company identity. Do not replace it with the later diamond/core-node exploration.
- `apps/web/public/brand/lurexa-master.svg` — static ecosystem-web copy of the same original Master mark for browser/public asset use.
- `apps/web/app/icon.svg` — ecosystem browser icon using the same original Master geometry.

React surfaces must use `MasterMark` from `@lurexa/ui` whenever they represent the parent company/ecosystem. Product surfaces keep their own product mark as the primary identity; a Master mark may appear only where the parent ecosystem is intentionally referenced.

Original editable Canva source: **Master logo for lurexa** (`DAHSqLm8k6M`). The original source design is stored in the shared **Lurexa Brand System** Canva folder.

## Current product family

- `marks/lurexa-learn.svg` — approved earlier Learn mark; inviting and progressive.
- `marks/lurexa-coach.svg` — conversational and alive; speech/pulse/microphone metaphor.
- `marks/lurexa-teach.svg` — approved earlier Teach mark; professional and developmental.
- `marks/lurexa-admin.svg` — authoritative and controlled; shield/trust metaphor.
- `marks/lurexa-insight.svg` — analytical and interpretive; evidence/lens metaphor.
- `marks/lurexa-studio.svg` — creative and constructive; modular creation metaphor.

## Ecosystem surfaces and shared layers

- `marks/lurexa-docs.svg` — structured and knowledge-oriented; document/search metaphor.
- `marks/lurexa-core.svg` — trusted platform foundation; Core is a shared ecosystem layer, not an ordinary end-user product.
- `marks/lurexa-mind.svg` — learning intelligence; Mind is a shared ecosystem layer, not an ordinary end-user product.

## Future identity concepts

Files under `concepts/` are design-ready future directions and must not be added to current product navigation, pricing or deployment without an explicit activation decision.

### Future product concept

- `concepts/lurexa-community-concept.svg` — **Lurexa Community**, a future cross-ecosystem social learning product for learners and educators. Personality: social, welcoming and participatory. The mark uses overlapping conversation spaces and a participation signal so it reads as a network of contribution rather than a single chat interaction.

Community has a stronger architectural status than the capability/offering concepts below: its name, product vision and boundaries are reserved now, while implementation remains deferred.

### Other future ecosystem concepts

- `concepts/lurexa-marketplace-concept.svg` — marketplace-capability direction.
- `concepts/lurexa-api-concept.svg` — public/partner API direction.
- `concepts/lurexa-mobile-concept.svg` — native-mobile direction.
- `concepts/lurexa-enterprise-concept.svg` — enterprise/institutional offering direction.

### Community naming boundary

**Lurexa Community** is reserved for the future cross-ecosystem social product where learners and educators can share posts, ask questions, discuss learning, discover communities, form study groups and exchange resources.

**Teach Community** remains an educator-only professional collaboration feature inside **Lurexa Teach**. It inherits the Teach identity and must not use the standalone Lurexa Community concept mark.

**Learn discussions** remain class/course/lesson discussion features inside **Lurexa Learn** and inherit the Learn identity.

This separation allows Lurexa Community to become a broader learning network later without turning every collaboration feature into a separate product.

## Usage

Use `MasterMark`, `ProductMark`, `DocsMark`, and `EcosystemLayerMark` from `@lurexa/ui` in React surfaces instead of copying SVG markup into applications. The files in this folder exist for design/export/share workflows and non-React uses.

Do not create a new top-level product mark for ordinary feature identities. Features inherit the visual identity of their parent product unless an explicit ecosystem architecture decision promotes them to a standalone surface or product.

Learn and Teach retain their previously approved product marks. The restored original Master identity does not replace those product-specific marks; it replaces only parent-company/ecosystem Master-logo usages.

## Canonical editable design

The current editable board is **Lurexa Brand System v3 — Community Future Product Concept** in the **Lurexa Brand System** Canva folder. It preserves current products, shared layers and ecosystem surfaces on one page and separates Community plus other future concepts on the future-concepts page.

Canva design ID: `DAHS5ZNcP7s`.

The Master slot on the editable board is being restored from the original Canva source asset. Keep Canva exports visually aligned with these SVG masters and preserve the distinction between current products, shared layers, ecosystem surfaces, future product concepts and other future capability/offering concepts.
