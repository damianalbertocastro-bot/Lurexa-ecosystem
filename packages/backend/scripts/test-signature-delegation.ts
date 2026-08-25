import { getServerFirestore } from "../src/firebase-admin.server";
import { getScopedLearnerContext } from "../src/learner-context.server";

function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Delegated context integration failed: ${message}`);
  console.log(`✓ ${message}`);
}

async function expectFailure(run: () => Promise<unknown>, fragment: string, message: string) {
  try {
    await run();
    throw new Error(`Expected failure containing: ${fragment}`);
  } catch (error) {
    const text = error instanceof Error ? error.message : String(error);
    check(text.includes(fragment), message);
  }
}

const database = getServerFirestore();
const suffix = Date.now().toString(36);
const teacherId = `teacher_${suffix}`;
const ownerId = `owner_${suffix}`;
const learnerId = `learner_${suffix}`;
const outsiderId = `outsider_${suffix}`;
const orgA = `org_a_${suffix}`;
const orgB = `org_b_${suffix}`;
const courseA = `course_a_${suffix}`;
const courseB = `course_b_${suffix}`;

await Promise.all([
  database.collection("user-memberships").doc(teacherId).collection("organizations").doc(orgA).set({ role: "teacher" }),
  database.collection("user-memberships").doc(ownerId).collection("organizations").doc(orgA).set({ role: "owner" }),
  database.collection("user-memberships").doc(learnerId).collection("organizations").doc(orgA).set({ role: "student" }),
  database.collection("user-memberships").doc(learnerId).collection("organizations").doc(orgB).set({ role: "student" }),
  database.collection("user-memberships").doc(outsiderId).collection("organizations").doc(orgA).set({ role: "student" }),
  database.collection("courses").doc(courseA).set({ id: courseA, orgId: orgA, title: "Org A course" }),
  database.collection("courses").doc(courseB).set({ id: courseB, orgId: orgB, title: "Org B course" }),
  database.collection("progress").doc(`${learnerId}_a`).set({
    id: `${learnerId}_a`, studentId: learnerId, lessonId: "lesson-a", moduleId: "module-a", courseId: courseA,
    completed: false, timeSpentSeconds: 60, attempts: [], lastAccessedAt: "2026-08-24T10:00:00.000Z",
  }),
  database.collection("progress").doc(`${learnerId}_b`).set({
    id: `${learnerId}_b`, studentId: learnerId, lessonId: "lesson-b", moduleId: "module-b", courseId: courseB,
    completed: false, timeSpentSeconds: 60, attempts: [], lastAccessedAt: "2026-08-25T10:00:00.000Z",
  }),
]);

const request = {
  contractVersion: "1" as const,
  learnerId,
  organizationId: orgA,
  requestingProduct: "learn" as const,
  purpose: "teacher_instructional_support" as const,
  domains: ["curriculum" as const, "pronunciation" as const, "fluency" as const],
};

const teacherContext = await getScopedLearnerContext({ actorId: teacherId, request });
check(teacherContext.context.organizationId === orgA, "Learn teacher delegation stays inside the explicitly requested organization");
check(teacherContext.context.curriculum?.courseId === courseA, "requested organization wins over newer progress in another organization");

const ownerContext = await getScopedLearnerContext({ actorId: ownerId, request });
check(ownerContext.context.organizationId === orgA, "organization owner may perform Learn instructional support");

const selfContext = await getScopedLearnerContext({ actorId: learnerId, request });
check(selfContext.context.organizationId === orgA, "learner self-service may request an organization they belong to");

await expectFailure(
  () => getScopedLearnerContext({ actorId: outsiderId, request }),
  "teacher, organization admin, or owner",
  "student membership cannot delegate instructional support for another learner",
);

await expectFailure(
  () => getScopedLearnerContext({ actorId: teacherId, request: { ...request, organizationId: orgB } }),
  "teacher, organization admin, or owner",
  "teacher membership in Org A cannot read a learner through Org B",
);

await expectFailure(
  () => getScopedLearnerContext({
    actorId: teacherId,
    request: { ...request, purpose: "learn_adaptive_practice" },
  }),
  "Delegated learner context is not authorized",
  "delegated access cannot reuse a self-service Learn purpose",
);

await expectFailure(
  () => getScopedLearnerContext({
    actorId: teacherId,
    request: { ...request, requestingProduct: "teach" },
  }),
  "requesting product is not authorized",
  "Lurexa Teach cannot request student instructional context",
);

console.log("Learn teacher delegated learner-context Firestore integration passed.");
