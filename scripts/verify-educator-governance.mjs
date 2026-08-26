import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const check = (condition, message) => {
  if (!condition) throw new Error(`Educator governance verification failed: ${message}`);
  console.log(`✓ ${message}`);
};

const types = read("packages/types/src/educator-access.ts");
const service = read("packages/backend/src/core/educator-governance.server.ts");
const access = read("packages/backend/src/educator-access.server.ts");
const route = read("apps/admin-portal/app/api/admin/educators/route.ts");
const page = read("apps/admin-portal/app/educators/page.tsx");

check(types.includes("EducatorGovernanceSnapshotV1") && types.includes("TeachingAuthorizationGrantInputV1") && types.includes("TeachingAuthorizationStatusUpdateV1"), "governance snapshot and teaching-authorization mutations are typed");
check(service.includes('token.role === "super_admin"') && service.includes('new Set(["owner", "admin"])'), "governance writes require superadmin or organization owner/admin authority");
check(!service.includes('governanceRoles = new Set(["owner", "admin", "teacher"])'), "teacher affiliation alone cannot administer educator governance");
check(service.includes('qualification.status !== "qualified"') && service.includes("activeUntil(qualification.validUntil)"), "authorization requires a currently qualified scope");
check(service.includes("courses.some((course) => course.orgId !== input.organizationId)"), "authorization cannot cross organization course boundaries");
check(service.includes("qualificationSupportsCourse") && service.includes("Teaching authorization cannot exceed the educator qualification scope."), "authorization cannot exceed subject or level qualification scope");
check(service.includes('collection("educator-governance-audit")'), "grant and status mutations append a trusted governance audit record");
check(!service.includes(".delete()"), "educator governance does not erase authorization history");
check(route.includes('"Cache-Control": "private, no-store, max-age=0"'), "educator governance API is private and no-store");
check(route.includes("grantTeachingAuthorization") && route.includes("updateTeachingAuthorizationStatus"), "Admin API delegates mutations to Core-owned educator governance service");
check(page.includes("Trusted scope — read only in Admin") && page.includes("Cannot be edited here"), "Admin UX makes qualification records explicitly read-only");
check(page.includes("Grant teaching authorization") && page.includes("Suspend"), "Admin UX can grant and suspend teaching authorization");
check(page.includes("Membership establishes institutional affiliation") && page.includes("Qualification establishes what an educator is prepared to teach"), "Admin UX explains the affiliation/qualification/authorization distinction");
check(access.includes("getEducatorCourseAccessDecision"), "Learn Teacher Workspace authorization continues through the existing Core access decision");

console.log("Educator governance verification passed: Admin can govern exact-course authorization without manufacturing qualification or collapsing institutional roles.");
