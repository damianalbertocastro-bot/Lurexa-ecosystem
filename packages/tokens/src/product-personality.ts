export type LurexaExperienceId =
  | "master"
  | "learn"
  | "coach"
  | "teach"
  | "admin"
  | "insight"
  | "studio"
  | "campus"
  | "docs";

export type ProductPersonality = {
  name: string;
  character: string;
  interactionEmphasis: string;
  palette: {
    ink: string;
    primary: string;
    secondary: string;
    accent: string;
    canvas: string;
    surface: string;
  };
  shape: "institutional" | "soft" | "expressive" | "professional" | "structured" | "analytical" | "creative" | "editorial";
  density: "spacious" | "balanced" | "compact";
  motion: "restrained" | "gentle" | "responsive" | "purposeful" | "precise" | "data-led" | "expressive" | "minimal";
};

/**
 * Lurexa uses one visual grammar with distinct product personalities.
 * These values are semantic guardrails, not permission to bypass shared tokens/components.
 */
export const productPersonalities: Record<LurexaExperienceId, ProductPersonality> = {
  master: {
    name: "Lurexa",
    character: "Institutional, foundational, trusted, quietly ambitious.",
    interactionEmphasis: "Ecosystem orientation, trust, company-level narrative, and product discovery.",
    palette: { ink: "var(--color-brand-navy)", primary: "var(--lx-secondary)", secondary: "#592bd6", accent: "var(--lx-accent)", canvas: "#f5f7ff", surface: "#ffffff" },
    shape: "institutional",
    density: "spacious",
    motion: "restrained",
  },
  learn: {
    name: "Lurexa Learn",
    character: "Inviting, progressive, calm, optimistic, confidence-building.",
    interactionEmphasis: "Clear next action, visible progress, low cognitive load, and learner momentum.",
    palette: { ink: "#0f172a", primary: "#4f46e5", secondary: "#38bdf8", accent: "#2dd4bf", canvas: "#f8fafc", surface: "#ffffff" },
    shape: "soft",
    density: "balanced",
    motion: "gentle",
  },
  coach: {
    name: "Lurexa Coach",
    character: "Conversational, alive, supportive, immediate, encouraging.",
    interactionEmphasis: "Speaking turns, listening state, responsive feedback, confidence, and safe experimentation.",
    palette: { ink: "var(--color-brand-navy)", primary: "var(--lx-primary)", secondary: "var(--lx-accent)", accent: "#58e4b8", canvas: "#f4fbff", surface: "#ffffff" },
    shape: "expressive",
    density: "balanced",
    motion: "responsive",
  },
  teach: {
    name: "Lurexa Teach",
    character: "Professional, developmental, reflective, credible, aspirational.",
    interactionEmphasis: "Professional growth, evidence, reflection, credentials, and educator community.",
    palette: { ink: "var(--color-brand-navy)", primary: "var(--lx-primary)", secondary: "var(--lx-secondary)", accent: "var(--lx-accent)", canvas: "#f7f6ff", surface: "#ffffff" },
    shape: "professional",
    density: "balanced",
    motion: "purposeful",
  },
  admin: {
    name: "Lurexa Admin",
    character: "Authoritative, stable, operational, trustworthy, controlled.",
    interactionEmphasis: "Permissions, institutional health, auditability, risk, and consequential actions.",
    palette: { ink: "var(--color-brand-navy)", primary: "#173a9d", secondary: "var(--lx-secondary)", accent: "var(--lx-accent)", canvas: "#f4f7fc", surface: "#ffffff" },
    shape: "structured",
    density: "compact",
    motion: "precise",
  },
  insight: {
    name: "Lurexa Insight",
    character: "Analytical, lucid, evidence-led, precise, interpretive.",
    interactionEmphasis: "Comparison, trends, explanation, confidence ranges, and decision support without false precision.",
    palette: { ink: "#0b1f45", primary: "#2458c9", secondary: "#12aab0", accent: "#76d6c9", canvas: "#f5f8fc", surface: "#ffffff" },
    shape: "analytical",
    density: "compact",
    motion: "data-led",
  },
  studio: {
    name: "Lurexa Studio",
    character: "Creative, constructive, expressive, modular, maker-oriented.",
    interactionEmphasis: "Authoring, composition, preview, iteration, validation, and reusable learning assets.",
    palette: { ink: "#20164f", primary: "#7c3aed", secondary: "#ec4899", accent: "#22d3ee", canvas: "#fbf7ff", surface: "#ffffff" },
    shape: "creative",
    density: "balanced",
    motion: "expressive",
  },
  campus: {
    name: "Lurexa Campus",
    character: "Connected, institutional, intelligent, community-ready.",
    interactionEmphasis: "Institutional deployment, cohort learning, campus community, and cross-departmental operations.",
    palette: { ink: "var(--color-brand-navy)", primary: "var(--color-brand-navy)", secondary: "#2160df", accent: "var(--lx-accent)", canvas: "#f4f7fc", surface: "#ffffff" },
    shape: "institutional",
    density: "balanced",
    motion: "purposeful",
  },
  docs: {
    name: "Lurexa Docs",
    character: "Structured, intelligent, knowledge-oriented, navigable, quietly technical.",
    interactionEmphasis: "Reading, search, source provenance, information hierarchy, cross-reference, and deep understanding.",
    palette: { ink: "var(--color-brand-navy)", primary: "var(--lx-secondary)", secondary: "#592bd6", accent: "var(--lx-accent)", canvas: "#f5f7ff", surface: "#ffffff" },
    shape: "editorial",
    density: "balanced",
    motion: "minimal",
  },
};
