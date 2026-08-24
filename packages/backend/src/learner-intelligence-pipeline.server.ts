// Compatibility export. Core owns evidence selection, Mind invocation, approval,
// and persistence of derived learner state. New code should import the Core path.
export { refreshLearnerIntelligence } from "./core/learner-intelligence.server";
