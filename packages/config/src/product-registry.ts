export type LurexaProductId = "learn" | "coach" | "teach" | "admin" | "insight" | "studio";
export type LurexaLayerId = "core" | "mind";
export type LurexaSurfaceId = "docs";
export type LurexaConceptId = "marketplace" | "api" | "mobile" | "enterprise";

export type LurexaRegistryEntry = {
  id: string;
  name: string;
  classification: "product" | "shared-layer" | "ecosystem-surface" | "future-concept";
  personality: string;
  description: string;
  canonicalMark: string;
};

export const lurexaProducts: Record<LurexaProductId, LurexaRegistryEntry> = {
  learn: {
    id: "learn",
    name: "Lurexa Learn",
    classification: "product",
    personality: "inviting and progressive",
    description: "Learning management and instructional delivery for learners and the teachers who operate their learning experiences.",
    canonicalMark: "lurexa-learn.svg",
  },
  coach: {
    id: "coach",
    name: "Lurexa Coach",
    classification: "product",
    personality: "conversational and alive",
    description: "Context-aware English speaking, fluency and pronunciation practice.",
    canonicalMark: "lurexa-coach.svg",
  },
  teach: {
    id: "teach",
    name: "Lurexa Teach",
    classification: "product",
    personality: "professional and developmental",
    description: "Educator professional development, growth pathways, evidence, credentials and community.",
    canonicalMark: "lurexa-teach.svg",
  },
  admin: {
    id: "admin",
    name: "Lurexa Admin",
    classification: "product",
    personality: "authoritative and controlled",
    description: "Institutional administration, governance, roles, programs, billing and policy configuration.",
    canonicalMark: "lurexa-admin.svg",
  },
  insight: {
    id: "insight",
    name: "Lurexa Insight",
    classification: "product",
    personality: "analytical and interpretive",
    description: "Governed analytics, reporting and learning-intelligence views for learners, cohorts and institutions.",
    canonicalMark: "lurexa-insight.svg",
  },
  studio: {
    id: "studio",
    name: "Lurexa Studio",
    classification: "product",
    personality: "creative and constructive",
    description: "Course, lesson, assessment and reusable learning-experience authoring and publishing.",
    canonicalMark: "lurexa-studio.svg",
  },
};

export const lurexaLayers: Record<LurexaLayerId, LurexaRegistryEntry> = {
  core: {
    id: "core",
    name: "Lurexa Core",
    classification: "shared-layer",
    personality: "trusted and foundational",
    description: "Identity, authorization, trusted records, persistence and shared platform services.",
    canonicalMark: "lurexa-core.svg",
  },
  mind: {
    id: "mind",
    name: "Lurexa Mind",
    classification: "shared-layer",
    personality: "intelligent and adaptive",
    description: "Learning interpretation, personalization, recommendations and governed AI intelligence.",
    canonicalMark: "lurexa-mind.svg",
  },
};

export const lurexaSurfaces: Record<LurexaSurfaceId, LurexaRegistryEntry> = {
  docs: {
    id: "docs",
    name: "Lurexa Docs",
    classification: "ecosystem-surface",
    personality: "structured and knowledge-oriented",
    description: "Canonical ecosystem documentation and source-of-truth navigation.",
    canonicalMark: "lurexa-docs.svg",
  },
};

export const lurexaFutureConcepts: Record<LurexaConceptId, LurexaRegistryEntry> = {
  marketplace: {
    id: "marketplace",
    name: "Marketplace concept",
    classification: "future-concept",
    personality: "exchange and discovery",
    description: "Roadmap-backed marketplace-capability direction; not an approved top-level product.",
    canonicalMark: "lurexa-marketplace-concept.svg",
  },
  api: {
    id: "api",
    name: "API concept",
    classification: "future-concept",
    personality: "connected and extensible",
    description: "Roadmap-backed public/partner API direction; not an approved top-level product.",
    canonicalMark: "lurexa-api-concept.svg",
  },
  mobile: {
    id: "mobile",
    name: "Mobile concept",
    classification: "future-concept",
    personality: "portable and resilient",
    description: "Roadmap-backed native-mobile direction; currently mobile remains a Lurexa Learn surface.",
    canonicalMark: "lurexa-mobile-concept.svg",
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise concept",
    classification: "future-concept",
    personality: "institutional and scalable",
    description: "Roadmap-backed enterprise/institutional offering direction; not an approved top-level product.",
    canonicalMark: "lurexa-enterprise-concept.svg",
  },
};

export const lurexaRegistry = {
  products: lurexaProducts,
  layers: lurexaLayers,
  surfaces: lurexaSurfaces,
  futureConcepts: lurexaFutureConcepts,
} as const;
