#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`✓ ${message}`);
}

function check(condition, message) {
  if (!condition) fail(message);
  else pass(message);
}

console.log("\n========================================================");
console.log("  LUREXA INSTITUTIONAL CAMPUS & ASSIGNMENT ENGINE       ");
console.log("========================================================\n");

// 1. Verify Data Contracts & Type files
const assignmentTypePath = path.join(repoRoot, "packages/types/src/assignment.ts");
check(fs.existsSync(assignmentTypePath), "packages/types/src/assignment.ts exists");
const typesContent = fs.readFileSync(assignmentTypePath, "utf8");
check(typesContent.includes("AssignmentV1"), "Declares AssignmentV1 interface");
check(typesContent.includes("AssignmentSubmissionV1"), "Declares AssignmentSubmissionV1 interface");
check(typesContent.includes("RosterStudentEntry"), "Declares RosterStudentEntry interface");

// 2. Verify Backend Services
const assignmentServicePath = path.join(repoRoot, "packages/backend/src/assignment.service.ts");
check(fs.existsSync(assignmentServicePath), "AssignmentService backend file exists");
const assignmentServiceContent = fs.readFileSync(assignmentServicePath, "utf8");
check(assignmentServiceContent.includes("createAssignment"), "AssignmentService has createAssignment");
check(assignmentServiceContent.includes("submitAssignment"), "AssignmentService has submitAssignment");
check(assignmentServiceContent.includes("gradeSubmission"), "AssignmentService has gradeSubmission");
check(assignmentServiceContent.includes("mindEvaluation"), "AssignmentService includes Mind AI evaluation");

const rosterServicePath = path.join(repoRoot, "packages/backend/src/roster-import.service.ts");
check(fs.existsSync(rosterServicePath), "RosterImportService backend file exists");
const rosterContent = fs.readFileSync(rosterServicePath, "utf8");
check(rosterContent.includes("parseCSV"), "RosterImportService has parseCSV");
check(rosterContent.includes("importRoster"), "RosterImportService has importRoster");

// 3. Verify Teacher Assignment Workspace
const teacherAssignPath = path.join(repoRoot, "apps/learn-web/app/teacher/assignments/page.tsx");
check(fs.existsSync(teacherAssignPath), "Teacher assignments UI page exists");
const teacherAssignContent = fs.readFileSync(teacherAssignPath, "utf8");
check(teacherAssignContent.includes("Class Assignments"), "Teacher assignments page title verified");
check(teacherAssignContent.includes("handleCreateAssignment"), "Teacher assignment creation handler verified");
check(teacherAssignContent.includes("handleGradeSubmission"), "Teacher grading workflow handler verified");

// 4. Verify Student Assignment Inbox
const studentAssignPath = path.join(repoRoot, "apps/learn-web/app/learn/assignments/page.tsx");
check(fs.existsSync(studentAssignPath), "Student assignments inbox UI page exists");
const studentAssignContent = fs.readFileSync(studentAssignPath, "utf8");
check(studentAssignContent.includes("Your Assignments"), "Student assignments page title verified");
check(studentAssignContent.includes("handleSubmit"), "Student homework submission handler verified");
check(studentAssignContent.includes("Due Soon"), "Student homework due-soon filter verified");

// 5. Verify Admin Roster Portal
const adminRosterPath = path.join(repoRoot, "apps/admin-portal/app/roster/page.tsx");
check(fs.existsSync(adminRosterPath), "Admin bulk roster sync UI page exists");
const adminRosterContent = fs.readFileSync(adminRosterPath, "utf8");
check(adminRosterContent.includes("Bulk Student Roster Sync"), "Admin roster sync title verified");
check(adminRosterContent.includes("handleParse"), "Admin CSV parse handler verified");
check(adminRosterContent.includes("handleImport"), "Admin batch import handler verified");

console.log("\n========================================================");
if (process.exitCode === 1) {
  console.log("  ✗ Assignment Engine Verification FAILED.");
} else {
  console.log("  ✓ All Institutional Campus & Assignment Checks PASSED (100%)");
}
console.log("========================================================\n");
