export type LurexaCoreProductId = "learn" | "coach" | "teach" | "admin" | "insight" | "studio";
export type LurexaInstitutionalShellId = "campus";
/**
 * Compatibility type for existing ecosystem UI consumers that render both
 * sibling products and the institutional shell. Prefer LurexaCoreProductId
 * when code specifically means a product at the Learn/Coach/Teach/Admin/Insight/Studio tier.
 */
export type LurexaProductId = LurexaCoreProductId | LurexaInstitutionalShellId;
export type LurexaLayerId = "core" | "mind";
export type LurexaSurfaceId = "docs";
export type LurexaProductSurfaceId = "mobile";
export type LurexaConceptId = "community" | "marketplace" | "api" | "enterprise";

export type LurexaRegistryEntry = {
  id: string;
  name: string;
  classification:
    | "product"
    | "institutional-shell"
    | "shared-layer"
    | "ecosystem-surface"
    | "product-surface"
    | "future-concept"
    | "future-product-concept";
  personality: string;
  description: string;
  canonicalMark: string;
};

export const lurexaCoreProducts: Record<LurexaCoreProductId, LurexaRegistryEntry> = {
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

export const lurexaInstitutionalShells: Record<LurexaInstitutionalShellId, LurexaRegistryEntry> = {
  campus: {
    id: "campus",
    name: "Lurexa Campus",
    classification: "institutional-shell",
    personality: "connected, institutional and intelligent",
    description: "Institutional orchestration shell that connects Lurexa products, programs, cohorts, educators, governance and institution-level experiences without becoming a seventh sibling product.",
    canonicalMark: "lurexa-campus.svg",
  },
};

/**
 * Compatibility aggregate for UI surfaces that still render Campus beside the
 * sibling products. Do not use this object to infer architectural tier.
 */
export const lurexaProducts: Record<LurexaProductId, LurexaRegistryEntry> = {
  ...lurexaCoreProducts,
  ...lurexaInstitutionalShells,
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

export const lurexaProductSurfaces: Record<LurexaProductSurfaceId, LurexaRegistryEntry> = {
  mobile: {
    id: "mobile",
    name: "Lurexa Learn Mobile",
    classification: "product-surface",
    personality: "portable and resilient",
    description: "Native mobile surface owned by Lurexa Learn. It may expose governed Coach functionality through shared contracts without becoming a seventh sibling product or an independent product identity.",
    canonicalMark: "lurexa-learn.svg",
  },
};

export const lurexaFutureConcepts: Record<LurexaConceptId, LurexaRegistryEntry> = {
  community: {
    id: "community",
    name: "Lurexa Community",
    classification: "future-product-concept",
    personality: "social, welcoming and participatory",
    description: "Future cross-ecosystem social product for learners and educators to share, discuss, ask questions, discover communities, form study groups and exchange useful resources. Distinct from Teach Community, which remains educator-only professional collaboration inside Lurexa Teach.",
    canonicalMark: "lurexa-community-concept.svg",
  },
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
  products: lurexaCoreProducts,
  institutionalShells: lurexaInstitutionalShells,
  layers: lurexaLayers,
  surfaces: lurexaSurfaces,
  productSurfaces: lurexaProductSurfaces,
  futureConcepts: lurexaFutureConcepts,
} as const;
