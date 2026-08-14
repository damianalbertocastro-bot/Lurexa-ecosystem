import type { Organization, User, Course } from "@lurexa/types";

export const MOCK_ORGANIZATION: Organization = {
  id: "org_oakridge_high",
  name: "Oakridge High School",
  slug: "oakridge-high",
  plan: "enterprise",
  settings: {
    allowSelfRegistration: false,
    aiQueryLimitPerStudent: 100,
    offlineSyncEnabled: true,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_USERS: User[] = [
  {
    id: "user_student_1",
    email: "alex.student@oakridge.edu",
    displayName: "Alex Rivera",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "user_teacher_1",
    email: "sarah.jenkins@oakridge.edu",
    displayName: "Dr. Sarah Jenkins",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "user_admin_1",
    email: "admin@lurexa.io",
    displayName: "Platform Administrator",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_COURSE: Course = {
  id: "course_algebra_101",
  orgId: "org_oakridge_high",         // Added relation to org
  authorId: "user_teacher_1",         // Added relation to teacher
  title: "Algebra & Linear Equations",
  description: "Interactive secondary mathematics course with real-time AI tutoring.",
  subject: "math",
  status: "published",                // Added status (likely a union like "draft" | "published")
  isTemplate: false,                  // Added boolean flag
  moduleIds: [],                      // Added empty array for modules
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function seedDatabase() {
  console.log("🌱 [SEED] Seeding mock data for Lurexa Ecosystem...");
  console.log(`- Created Organization: ${MOCK_ORGANIZATION.name}`);
  console.log(`- Created ${MOCK_USERS.length} Users (Student, Teacher, Admin)`);
  console.log(`- Created Course: ${MOCK_COURSE.title}`);
  console.log("✅ [SEED] Database seeding complete.");
}

if (require.main === module) {
  seedDatabase().catch(console.error);
}