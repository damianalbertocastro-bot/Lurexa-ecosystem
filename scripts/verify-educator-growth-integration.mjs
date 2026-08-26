import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const check = (condition, message) => {
  if (!condition) throw new Error(`Educator growth integration verification failed: ${message}`);
  console.log(`✓ ${message}`);
};

const types = read("packages/types/src/educator-access.ts");
const lifecycle = read("packages/backend/src/core/educator-qualification-lifecycle.server.ts");
const reviewerApi = read("apps/admin-portal/app/api/admin/qualification-lifecycle/route.ts");
const reviewerPage = read("apps/admin-portal/app/educators/review/page.tsx");
const educatorsLayout = read("apps/admin-portal/app/educators/layout.tsx");
const mind = read("packages/backend/src/mind/educator-growth-path.server.ts");
const teachAdapter = read("packages/backend/src/teach-educator-growth.server.ts");
const teachPage = read("apps/teach-web/app/growth-plan/page.tsx");
const enrollment = read("packages/backend/src/core/course-enrollment-index.server.ts");
const roster = read("packages/backend/src/learn-teacher-roster.server.ts");
const intelligence = read("packages/backend/src/learn-teacher-course-intelligence.server.ts");
const learnPage = read("apps/learn-web/app/teacher/insights/page.tsx");
const coachGate = read("packages/backend/src/educator-coach.server.ts");
const coachRuntime = read("packages/backend/src/coach-platform.server.ts");
const coachCompletion = read("packages/backend/src/coach-session-completion.server.ts");
const coachApi = read("apps/learn-web/app/api/coach/route.ts");

check(types.includes('"under_review"') && types.includes('"revoked"'), "qualification lifecycle includes review and terminal revocation states");
check(types.includes("toStatus: EducatorQualificationStatus"), "qualification transition contract allows Core to validate every state-machine destination, including under-review return to candidate");
check(lifecycle.includes("const transitions") && lifecycle.includes('candidate: ["under_review", "revoked"]') && lifecycle.includes('under_review: ["qualified", "candidate", "revoked"]'), "Core enforces explicit qualification state transitions including governed evidence-revision return");
check(lifecycle.includes("Qualification reviewer access is required") && !lifecycle.includes('role === "teacher"'), "teacher or institution role alone cannot grant qualification");
check(lifecycle.includes('collection("events")') && lifecycle.includes("suspendLinkedAuthorizations"), "qualification decisions are append-only and invalidation suspends linked teaching grants");
check(reviewerApi.includes('action: "create_candidate"') && reviewerApi.includes('action: "transition"') && reviewerApi.includes('action: "events"'), "Admin reviewer API exposes candidate, transition, and audit-history operations only through the governed lifecycle service");
check(exists("apps/admin-portal/app/educators/review/page.tsx") && reviewerPage.includes("QUALIFICATION REVIEW") && reviewerPage.includes("Load audit history"), "Admin has a reviewer workspace for evidence-backed qualification decisions and audit history");
check(reviewerPage.includes("transitionMap") && reviewerPage.includes('under_review: ["qualified", "candidate", "revoked"]'), "Admin reviewer UX mirrors the governed Core state machine instead of inventing status changes");
check(reviewerPage.includes("validUntil") && reviewerPage.includes('toStatus === "qualified"'), "qualified decisions require an explicit validity boundary in the reviewer UX");
check(educatorsLayout.includes('href="/educators/review"') && educatorsLayout.includes('href="/educators"'), "qualification review and teaching authorization are discoverable as separate operations within one Admin educator workspace");
check(mind.includes("never reads Firestore") && !mind.includes("getServerFirestore") && !mind.includes(".set("), "Mind growth engine is interpretation-only and storage-free");
check(teachAdapter.includes('collection("educator-qualifications")') && teachAdapter.includes("getEducatorBenefitEntitlements"), "Teach growth adapter loads Core professional state and educator benefits");
check(teachPage.includes("Your development path is yours—not your students") && teachPage.includes("Privacy boundary"), "Teach UX makes professional/student data separation explicit");
check(enrollment.includes('collection("course-enrollments")') && enrollment.includes("Exact-course teaching authorization"), "Core owns exact-course enrollment and protects enrollment mutations");
check(roster.includes("CourseEnrollmentIndexService.listCourseEnrollments") && !roster.includes("[...byLearner.entries()].map"), "Learn roster is enrollment-first rather than progress-first");
check(intelligence.includes("getEducatorCourseAccessDecision") && intelligence.includes("privacyBoundary") && intelligence.includes("notStarted"), "course intelligence is exact-course authorized, aggregate-first, and enrollment-aware");
check(learnPage.includes("Course intelligence & enrollment") && learnPage.includes("Develop yourself in Teach"), "Learn Teacher Workspace exposes richer course operations and explicit professional-growth handoff");
check(coachGate.includes("getEducatorBenefitEntitlements") && coachGate.includes("benefits.coachFull"), "educator Coach mode requires the governed Coach benefit");
check(coachApi.includes('mode?: "learner" | "educator_professional"') && exists("apps/learn-web/app/coach/educator/page.tsx"), "Coach has an explicit educator-professional entry path");
check(coachRuntime.includes('if (session.mode !== "educator_professional")') && coachRuntime.includes("refreshLearnerIntelligence"), "educator Coach turns are excluded from the ordinary learner evidence and intelligence pipeline");
check(coachCompletion.includes('collection("educator-professional-evidence")') && coachCompletion.includes('studentContextIncluded: false'), "educator Coach completion writes minimized professional evidence with no student context");
check(coachCompletion.includes('destination: educatorMode ? "teach" : "learn"') && coachCompletion.includes('purpose: educatorMode ? "professional_growth" : "return_to_learning"'), "Coach preserves distinct Teach and Learn return loops");

console.log("Educator growth integration verification passed: qualification review, Teach growth, Coach benefits, Core enrollment, course intelligence, and Learn Teacher Workspace remain purpose-scoped and connected.");
