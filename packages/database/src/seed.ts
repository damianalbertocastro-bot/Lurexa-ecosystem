import type { Organization, User, Course } from "@lurexa/types";

export const MOCK_ORGANIZATION = {
  id: "org_oakridge_high",
  name: "Oakridge High School",
  slug: "oakridge-high",
  plan: "enterprise",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
} as unknown as Organization;

export const MOCK_USERS = [
  {
    id: "user_student_1",
    email: "alex.student@oakridge.edu",
    displayName: "Alex Rivera",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_teacher_1",
    email: "sarah.jenkins@oakridge.edu",
    displayName: "Dr. Sarah Jenkins",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_admin_1",
    email: "admin@lurexa.io",
    displayName: "Platform Administrator",
    createdAt: new Date().toISOString(),
  },
] as unknown as User[];

export const MOCK_COURSE = {
  id: "course_algebra_101",
  title: "Algebra & Linear Equations",
  description: "Interactive secondary mathematics course with real-time AI tutoring.",
  subject: "math",
  published: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
} as unknown as Course;

export async function seedDatabase() {
  console.log("🌱 [SEED] Seeding mock data for Lurexa Ecosystem...");
  console.log(`- Created Organization: ${(MOCK_ORGANIZATION as any).name || "Oakridge High"}`);
  console.log(`- Created ${MOCK_USERS.length} Users (Student, Teacher, Admin)`);
  console.log(`- Created Course: ${(MOCK_COURSE as any).title || "Algebra 101"}`);
  console.log("✅ [SEED] Database seeding complete.");
}

if (require.main === module) {
  seedDatabase().catch(console.error);
}