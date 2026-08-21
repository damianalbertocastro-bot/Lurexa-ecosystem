# Lurexa Learn / Lurexa Teach Product Boundary

Status: Authoritative product rule

## Governing rule

Lurexa Learn and Lurexa Teach serve different jobs and must never be presented as interchangeable teacher surfaces.

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

Lurexa Teach is the educator professional-development product.

Owned experiences:
- Teacher development
- Teacher CEFR / English proficiency growth
- Professional courses
- Training and certification
- Teacher community
- Peer collaboration
- Professional evidence, reflection and credentials

## Identity rules

1. Any teacher-facing workspace used to manage students, classes, lessons, assignments or learner progress must be branded Lurexa Learn.
2. Lurexa Teach branding must only identify professional-development experiences for educators.
3. Lurexa Teach may link to Lurexa Learn, but it does not own Learn's teacher dashboard.
4. Lurexa Learn may promote Lurexa Teach as a separate ecosystem product, but Teach must appear as a secondary destination rather than the current workspace identity.
5. Shared Lurexa ecosystem navigation should use the master Lurexa mark and return users to the ecosystem landing page.

## Shared educator identity

A teacher may use both products with one Lurexa account. Authentication and trusted records belong to Lurexa Core. Product-specific educator evidence can be interpreted by Lurexa Mind, but each product keeps a clear domain boundary.

## Routing guidance

- `apps/teacher-portal`: teacher operational workspace for Lurexa Learn.
- `apps/teach-web`: independent Lurexa Teach product.

Future code, copy, routes, navigation and AI-generated changes must preserve this distinction.
