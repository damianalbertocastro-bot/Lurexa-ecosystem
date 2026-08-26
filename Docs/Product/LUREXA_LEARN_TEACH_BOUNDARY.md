# Lurexa Learn / Lurexa Teach Product Boundary

Status: **Authoritative product rule**

## Governing rule

Lurexa Learn and Lurexa Teach serve different jobs and must never be presented as interchangeable teacher surfaces.

> **Lurexa Learn is where teachers operate and support student learning. Lurexa Teach is where practicing and future teachers learn, practice, develop, and grow as educators.**

See `Docs/Product/LUREXA_TEACH_PRODUCT_DEFINITION.md` for the canonical Teach definition.

## Lurexa Learn

Lurexa Learn is the learning-management and instructional-delivery product.

Owned experiences:
- Student dashboard
- Teacher dashboard
- Course and lesson experience
- Learning management
- Assignments, class progress, learner support and instructional delivery

The teacher dashboard inside Learn exists so teachers can operate learning experiences for students. It is not the Lurexa Teach product.

## Lurexa Teach

Lurexa Teach is Lurexa's **professional learning and teacher-formation platform for practicing educators and teachers-to-be**.

It serves two primary educator pathways:

1. **Teacher Formation Pathway** — aspiring teachers learning methodology, subject/academic knowledge, lesson planning, assessment, classroom practice, educational technology, reflection, and professional competencies.
2. **Practicing Educator Growth Pathway** — active educators improving academic/subject knowledge, language proficiency where relevant, methodology, teaching practice, specialization, evidence, credentials, and professional growth.

Owned experiences include:
- Teacher formation and methodology learning
- Academic and subject-knowledge development
- Teacher CEFR / English proficiency growth where relevant
- Professional courses and structured pathways
- Teaching-practice development, rehearsal and simulation
- Training and competency-based certification
- AI-guided tutoring, coaching, rehearsal and feedback through governed Mind capabilities
- Human instructor, mentor, reviewer or coaching support where programs require it
- Teacher community and professional circles
- Peer collaboration and feedback
- Professional evidence and reflection
- Persistent educator-development history
- Professional credentials
- Personalized professional-growth recommendations through Mind

Teach must not be reduced to a passive self-study course library. Its intended model combines structured learning, AI support, human support, guided practice, evidence, community, reflection, assessment, and progressive professional pathways.

## Identity rules

1. Any teacher-facing workspace used to manage students, classes, lessons, assignments or learner progress must be branded **Lurexa Learn**.
2. **Lurexa Teach** identifies teacher formation and professional-growth experiences for practicing educators and teachers-to-be.
3. Lurexa Teach may link to Lurexa Learn, but it does not own Learn's teacher dashboard.
4. Lurexa Learn may promote Lurexa Teach as a separate ecosystem product, but Teach must appear as a secondary destination rather than the current classroom-operations workspace identity.
5. Shared Lurexa ecosystem navigation should use the master Lurexa relationship and preserve the user's current product/context.
6. An institution may provide Teach through **Lurexa Campus**, but Campus supplies institutional context and access rather than owning Teach's professional-learning workflows.

## Shared educator identity

A teacher or teacher-to-be may use Lurexa products with one Lurexa account. Authentication, authorization and trusted records belong to Lurexa Core. Product-specific educator evidence can be interpreted by Lurexa Mind through approved contracts, but each product keeps a clear domain boundary.

## Routing guidance

- `apps/learn-web/app/teacher`: teacher operational workspace for Lurexa Learn.
- `apps/teach-web`: independent Lurexa Teach product.

Future code, copy, routes, navigation and AI-generated changes must preserve this distinction.
