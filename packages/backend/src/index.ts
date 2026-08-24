export * from "./firebase";
export * from "./auth.service";
export * from "./organization.service";
export * from "./course.service";
export * from "./course-builder.service";
export * from "./progress.service";
export * from "./ai-generator.service";
export * from "./analytics.service";
export * from "./offline-db";
export * from "./offline-sync.service";
export * from "./billing.service";
export * from "./ai-guardrails.service";
export * from "./marketplace.service";
export * from "./admin.service";
export * from "./ecosystem.service";
export * from "./telemetry.service";
export * from "./learner-model.service";
export * from "./linguistic-intelligence.service";
export * from "./coach-linguistic-adapter.service";
export * from "./coach-linguistic-pipeline.service";
export * from "./linguistic-pattern-aggregator.service";
export * from "./dominican-corpus-catalog.service";
export * from "./teach.service";
export * from "./teach-mind.service";
export * from "./teach-credential";
export * from "./curriculum/a1";
export * from "./coach-a1.service";

// Server-only capabilities intentionally do not belong in this browser-safe
// barrel. Import them through their explicit server subpaths from API routes or
// other server modules so Firebase Admin / Google Cloud code cannot leak into
// Client Component dependency graphs.
