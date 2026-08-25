# Lurexa Campus — Product Experience Definition

- Status: **Approved institutional experience direction**
- Customer-facing name: **Lurexa Campus**
- Technical concept: **Institution Workspace**
- Administrative control plane: **Lurexa Admin**
- Applies to: schools, academies, universities, training providers, companies, and other authorized organizations

## 1. Definition

**Lurexa Campus is the institution-facing environment that brings an organization's authorized Lurexa experiences together in one coherent, branded, role-aware space.**

Campus is not a standalone sibling product that owns Learn, Teach, Admin, Insight, Coach, or Studio. It is the institution context and customer experience through which entitled Lurexa products are discovered, entered, and coordinated.

Internally, Campus is backed by the Institution Workspace tenant model.

## 2. Positioning

Primary positioning line:

> **One intelligent learning environment for your entire institution.**

Primary value proposition:

> Lurexa Campus gives an institution one connected environment for its people, learning products, administration, analytics, and authorized intelligence while preserving clear product responsibilities behind the scenes.

Supporting marketing language may include:

- Your institution. One connected learning ecosystem.
- Where your institution learns, teaches, and grows.
- One campus. Every learner. Every Lurexa experience connected.
- One institution. One learning ecosystem. Every learner connected.

## 3. Customer problem

Educational organizations often operate fragmented systems for learning delivery, teacher development, administration, analytics, content creation, and AI tools. Users repeat setup, identities fragment, data becomes difficult to govern, and institutional leaders lack a coherent view of the environment.

Campus addresses the experience-level fragmentation without solving it by building one giant application.

It creates a coherent institutional front door while the Lurexa product family remains modular.

## 4. Target customers

Initial Campus customers may include:

- language academies;
- K–12 schools and school networks;
- universities and higher-education programs;
- technical and vocational institutions;
- teacher-training organizations;
- corporate learning and workforce-development programs;
- government or nonprofit education programs.

## 5. Primary users

### Institution owner / administrator
Needs to manage organization identity, people, permissions, access, plans, governance, and institutional operations.

Primary specialist experience: **Lurexa Admin**.

### Learner
Needs to access assigned and available learning with continuity across the institution's Lurexa environment.

Primary specialist experience: **Lurexa Learn**, plus Coach or other entitled products.

### Teacher / instructor
Needs to operate student learning in Learn and may separately develop professionally in Teach.

Primary specialist experiences: **Lurexa Learn teacher workspace** and, where entitled, **Lurexa Teach**.

### Leader / analyst
Needs trusted institutional visibility into engagement, progress, outcomes, and learning intelligence.

Primary specialist experience: **Lurexa Insight**.

### Author / curriculum specialist
Needs governed creation and publishing workflows.

Primary specialist experience: **Lurexa Studio**.

## 6. Experience architecture

Campus should provide a simple institution-level shell such as:

```text
ABC Language Academy
Lurexa Campus

Overview
People
Groups
Learning
Professional Growth
Analytics
Coaching
Creation
Products & Access
Settings
```

The exact navigation shown depends on role and entitlements.

Campus is responsible for orientation and continuity, not reproducing every product workflow.

## 7. Product relationship model

| Experience | Role inside Campus |
| --- | --- |
| Lurexa Learn | learning management and instructional delivery |
| Lurexa Coach | speaking, pronunciation and fluency coaching |
| Lurexa Teach | educator professional development |
| Lurexa Admin | institutional administrative control plane |
| Lurexa Insight | analytics and learning intelligence views |
| Lurexa Studio | governed authoring and publishing |
| Lurexa Core | trusted identity, tenancy, authorization, records and persistence |
| Lurexa Mind | authorized learning interpretation and AI intelligence |

Campus does not replace any of these responsibilities.

## 8. Brand architecture

Campus should be treated as an **institutional experience brand**, not as another product tile equal to Learn or Coach.

Recommended hierarchy:

```text
Lurexa Learning Technologies
│
├── Lurexa Core
├── Lurexa Mind
│
├── Product family
│   ├── Lurexa Learn
│   ├── Lurexa Coach
│   ├── Lurexa Teach
│   ├── Lurexa Admin
│   ├── Lurexa Insight
│   └── Lurexa Studio
│
└── Institutional experience
    └── Lurexa Campus
        └── presents entitled product experiences in organization context
```

This prevents the false implication that Campus owns the product family while still giving institutions a strong branded environment.

## 9. Visual personality

Campus personality:

**Connected, welcoming, institutionally confident, intelligent.**

Campus should sit visually between Master Lurexa and the specialist products:

- more human and inviting than Admin;
- more institutionally structured than Learn;
- less analytical than Insight;
- less expressive than Coach or Studio;
- clearly part of the Lurexa family.

Key design behaviors:

- institution identity and Lurexa identity visible together;
- spacious orientation surfaces with structured operational sections;
- meaningful product entry points rather than a generic app launcher;
- clear organization and role context;
- entitlement-aware navigation;
- restrained, polished motion;
- shared Lurexa typography and interaction grammar;
- controlled institution accent customization without breaking accessibility or product identity.

## 10. Co-branding model

Preferred presentation:

**ABC Language Academy**  
**Lurexa Campus**

or

**ABC Language Academy Campus**  
**Powered by Lurexa**

Final co-branding templates may vary by commercial tier, but they must preserve recognizable Lurexa trust and product identity.

Institutions may eventually configure:

- institution display name;
- logo;
- approved accent color;
- optional cover/hero imagery;
- custom domain/subdomain where supported.

Institutions must not be able to alter semantic states, accessibility requirements, security indicators, or specialist product identities.

## 11. Naming contract

### Customer-facing
Use **Lurexa Campus**.

Examples:

- Welcome to Lurexa Campus.
- Open your Campus.
- Campus members.
- Campus settings.
- Switch Campus.
- Campus products.

Avoid exposing "Institution Workspace" in ordinary customer-facing copy.

### Engineering-facing
Retain **Institution Workspace** terminology when it accurately describes the tenant/domain implementation.

Approved examples:

- `InstitutionWorkspaceContext`
- `institution-workspace`
- organization-scoped authorization
- `/institutions/[organizationId]`

A marketing rename is not sufficient reason to churn stable code contracts.

## 12. Commercial packaging

Campus provides the coherent institution environment regardless of the exact product bundle.

Possible packages may include:

- Campus Learn — Learn + Admin foundation
- Campus Intelligence — Learn + Admin + Insight
- Campus Growth — Learn + Teach + Admin + Insight
- Campus Speaking — Learn + Coach + Admin
- Campus Complete — broader entitled suite

These names are exploratory packaging language, not approved SKU names. The architecture must support flexible entitlements rather than encode a package structure.

## 13. MVP capabilities

Required foundation:

1. Campus identity and institution profile
2. Campus home
3. organization-scoped server authorization
4. member directory
5. invitations
6. student and teacher roster views
7. role and permission management
8. groups/cohorts
9. product entitlements and seats
10. organization switcher
11. role-aware product navigation
12. basic Campus operational metrics
13. basic audit trail
14. institution branding foundation

## 14. Non-goals for MVP

Do not make Campus responsible for:

- course authoring;
- lesson delivery;
- full analytics dashboards;
- AI tutoring;
- teacher professional-development content;
- speaking-coach workflows;
- direct database administration;
- client-side-only authorization;
- a second learner model.

## 15. Trust and authorization

Campus visibility is not authorization.

All organization-sensitive data and actions must be authorized server-side through Core-governed organization membership and permissions. Institution owners/admins and Lurexa `super_admin` users are separate scopes.

Lurexa Mind never grants Campus access.

## 16. Success criteria

A successful Campus experience should let a new institutional user answer these questions quickly:

1. Which institution am I operating in?
2. What is my role here?
3. What Lurexa capabilities does my institution have?
4. What requires my attention?
5. Where do I go to learn, teach, administer, analyze, coach, or create?
6. Can I move between those experiences without losing institution context?

For the institution, Campus succeeds when the ecosystem feels unified without creating hidden architectural coupling between products.

## 17. Governing principle

Campus extends — but does not replace — Lurexa's central principle:

> **One learner. One evolving model. Every Lurexa experience adapts around it.**

For institutions, the complementary experience promise is:

> **One institution. One connected learning ecosystem.**
