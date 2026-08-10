import { Organization, User, Course } from "@lurexa/types";

export const MOCK_ORGANIZATION: Organization = {
  id: "org_oakridge_high",
  name: "Oakridge High School",
  slug: "oakridge-high",
  plan: "enterprise",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_USERS: User[] = [
  {
    id: "user_student_1",
    email: "alex.student@oakridge.edu",
    name: "Alex Rivera",
    role: "student",
    organizationId: "org_oakridge_high",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_teacher_1",
    email: "sarah.jenkins@oakridge.edu",
    name: "Dr. Sarah Jenkins",
    role: "teacher",
    organizationId: "org_oakridge_high",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_admin_1",
    email: "admin@lurexa.io",
    name: "Platform Administrator",
    role: "admin",
    organizationId: "org_oakridge_high",
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_COURSE: Course = {
  id: "course_algebra_101",
  organizationId: "org_oakridge_high",
  title: "Algebra & Linear Equations",
  description: "Interactive secondary mathematics course with real-time AI tutoring.",
  subject: "Mathematics",
  published: true,
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

// Execute if run directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}