/* eslint-disable no-undef, turbo/no-undeclared-env-vars */

import { initializeApp, deleteApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.GCLOUD_PROJECT ?? "lurexa-app";
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST ?? "127.0.0.1:9099";
const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST ?? "127.0.0.1:8080";

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error("FIRESTORE_EMULATOR_HOST is required. Run this through Firebase emulators:exec.");
}

const app = initializeApp({ projectId }, `learn-progress-rules-${Date.now()}`);
const database = getFirestore(app);

async function createUser(label) {
  const response = await fetch(`http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.test`,
      password: "LurexaTest123!",
      returnSecureToken: true,
    }),
  });
  if (!response.ok) throw new Error(`Unable to create emulator user: ${await response.text()}`);
  return response.json();
}

function documentUrl(collection, documentId) {
  return `http://${firestoreHost}/v1/projects/${projectId}/databases/(default)/documents/${collection}/${documentId}`;
}

async function firestoreRequest(token, method, collection, documentId, body) {
  return fetch(documentUrl(collection, documentId), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

function assertStatus(response, expected, description) {
  if (response.status !== expected) {
    throw new Error(`${description}: expected HTTP ${expected}, received ${response.status}.`);
  }
  console.log(`✓ ${description}`);
}

try {
  const owner = await createUser("owner");
  const other = await createUser("other");
  const organizationId = "org-rules-test";
  const courseId = "course-a1";
  const moduleId = "module-a1-1";
  const lessonId = "lesson-a1-intro";
  const progressId = `${owner.localId}_${lessonId}`;
  const evidenceId = `learn_${owner.localId}_${lessonId}_quiz-1_1`;
  const insightId = `mind_next_step_${owner.localId}_lurexa-self-paced`;
  const tutorSessionId = `tutor_${owner.localId}`;
  const spokenEvidenceId = `spoken_${owner.localId}`;
  const retrievalId = `retrieval_${owner.localId}`;
  const interventionId = `intervention_${owner.localId}`;
  const now = new Date().toISOString();

  await database.collection("organizations").doc(organizationId).set({
    id: organizationId,
    ownerId: owner.localId,
    name: "Rules Test Organization",
    slug: "rules-test-organization",
    plan: "free",
    createdAt: now,
    updatedAt: now,
  });
  await database.collection("organizations").doc(organizationId).collection("members").doc(owner.localId).set({
    id: owner.localId,
    orgId: organizationId,
    userId: owner.localId,
    role: "owner",
    joinedAt: now,
  });
  await database.collection("user-memberships").doc(owner.localId).collection("organizations").doc(organizationId).set({
    id: owner.localId,
    orgId: organizationId,
    userId: owner.localId,
    role: "owner",
    joinedAt: now,
  });
  await database.collection("courses").doc(courseId).set({
    id: courseId,
    orgId: organizationId,
    authorId: owner.localId,
    title: "Rules Test Course",
    description: "Trusted authoring boundary fixture.",
    subject: "english",
    status: "draft",
    isTemplate: false,
    moduleIds: [moduleId],
    createdAt: now,
    updatedAt: now,
  });
  await database.collection("modules").doc(moduleId).set({
    id: moduleId,
    courseId,
    title: "Module 1",
    order: 1,
    lessonIds: [lessonId],
  });
  await database.collection("lessons").doc(lessonId).set({
    id: lessonId,
    moduleId,
    title: "Introduce yourself",
    contentBlocks: [],
    order: 1,
    estimatedMinutes: 10,
  });

  await database.collection("progress").doc(progressId).set({
    id: progressId,
    studentId: owner.localId,
    lessonId,
    moduleId,
    courseId,
    completed: false,
    status: "in_progress",
    startedAt: now,
    timeSpentSeconds: 0,
    attempts: [],
    lastAccessedAt: now,
  });

  await database.collection("learning-evidence").doc(evidenceId).set({
    contractVersion: "1",
    id: evidenceId,
    learnerId: owner.localId,
    organizationId: "lurexa-self-paced",
    source: {
      product: "learn",
      courseId,
      lessonId,
      activityId: "quiz-1",
    },
    type: "assessment_result",
    observedAt: now,
    dataClassification: "standard",
    payload: { correct: true, attemptNumber: 1 },
    provenance: { method: "system_observed", actorId: owner.localId },
  });

  await database.collection("learner-insights").doc(insightId).set({
    id: insightId,
    learnerId: owner.localId,
    organizationId: "lurexa-self-paced",
    domain: "recommendation",
    summary: "Continue with supported practice.",
    confidence: 0.7,
    basedOnEvidenceIds: [evidenceId],
    data: {
      kind: "recommendation",
      actions: ["Continue"],
      recommendations: [{
        outcome: "continue",
        label: "Continue",
        reason: "Recent evidence supports normal continuation.",
        courseId,
        lessonId,
      }],
      interpretationVersion: "learn-next-step-v1",
    },
    generatedAt: now,
  });

  await database.collection("learn-tutor-sessions").doc(tutorSessionId).set({
    id: tutorSessionId,
    learnerId: owner.localId,
    organizationId: "lurexa-self-paced",
    courseId,
    lessonId,
    activityId: "roleplay-1",
    status: "active",
    transcript: [],
    provider: null,
    createdAt: now,
    updatedAt: now,
  });
  await database.collection("spoken-evidence").doc(spokenEvidenceId).set({
    id: spokenEvidenceId,
    learnerId: owner.localId,
    organizationId: "lurexa-self-paced",
    courseId,
    lessonId,
    activityId: "speaking-1",
    storagePath: "server-only",
    observedAt: now,
  });
  await database.collection("retrieval-schedules").doc(retrievalId).set({
    id: retrievalId,
    learnerId: owner.localId,
    organizationId: "lurexa-self-paced",
    courseId,
    lessonId,
    dueAt: now,
    status: "scheduled",
  });
  await database.collection("teacher-interventions").doc(interventionId).set({
    id: interventionId,
    learnerId: owner.localId,
    organizationId: "lurexa-self-paced",
    courseId,
    status: "open",
    createdAt: now,
  });

  assertStatus(
    await firestoreRequest(owner.idToken, "GET", "courses", courseId),
    200,
    "organization member can read course metadata",
  );
  assertStatus(
    await firestoreRequest(other.idToken, "GET", "courses", courseId),
    403,
    "non-member cannot read organization course metadata",
  );
  assertStatus(
    await firestoreRequest(owner.idToken, "PATCH", "courses", courseId, {
      fields: { title: { stringValue: "Forged browser title" } },
    }),
    403,
    "teacher browser clients cannot mutate authoritative course records",
  );
  assertStatus(
    await firestoreRequest(owner.idToken, "PATCH", "courses", "browser-created-course", {
      fields: {
        id: { stringValue: "browser-created-course" },
        orgId: { stringValue: organizationId },
        authorId: { stringValue: owner.localId },
        title: { stringValue: "Browser created" },
      },
    }),
    403,
    "teacher browser clients cannot create authoritative course records",
  );
  assertStatus(
    await firestoreRequest(owner.idToken, "GET", "modules", moduleId),
    403,
    "module records remain behind the trusted Learn server boundary",
  );
  assertStatus(
    await firestoreRequest(owner.idToken, "GET", "lessons", lessonId),
    403,
    "lesson content remains behind the trusted Learn server boundary",
  );

  assertStatus(
    await firestoreRequest(owner.idToken, "GET", "progress", progressId),
    200,
    "learner can read their own progress",
  );
  assertStatus(
    await firestoreRequest(other.idToken, "GET", "progress", progressId),
    403,
    "another learner cannot read progress",
  );
  assertStatus(
    await firestoreRequest(owner.idToken, "PATCH", "progress", progressId, {
      fields: { completed: { booleanValue: true } },
    }),
    403,
    "learner clients cannot forge trusted progress writes",
  );
  assertStatus(
    await firestoreRequest(other.idToken, "PATCH", "progress", progressId, {
      fields: { completed: { booleanValue: true } },
    }),
    403,
    "another learner cannot write progress",
  );
  assertStatus(
    await firestoreRequest(owner.idToken, "GET", "learning-evidence", evidenceId),
    403,
    "learning evidence remains server-only even for its learner",
  );
  assertStatus(
    await firestoreRequest(other.idToken, "GET", "learning-evidence", evidenceId),
    403,
    "another learner cannot read learning evidence",
  );
  assertStatus(
    await firestoreRequest(owner.idToken, "GET", "learner-insights", insightId),
    403,
    "Mind recommendations remain behind the trusted Core read boundary",
  );
  assertStatus(
    await firestoreRequest(other.idToken, "GET", "learner-insights", insightId),
    403,
    "another learner cannot read persisted Mind recommendations",
  );
  assertStatus(
    await firestoreRequest(owner.idToken, "PATCH", "learner-insights", insightId, {
      fields: { summary: { stringValue: "Forged recommendation" } },
    }),
    403,
    "learner clients cannot manufacture trusted Mind recommendations",
  );

  for (const [collection, id, description] of [
    ["learn-tutor-sessions", tutorSessionId, "server-owned tutor sessions"],
    ["spoken-evidence", spokenEvidenceId, "spoken evidence records"],
    ["retrieval-schedules", retrievalId, "retrieval schedules"],
    ["teacher-interventions", interventionId, "teacher intervention records"],
  ]) {
    assertStatus(
      await firestoreRequest(owner.idToken, "GET", collection, id),
      403,
      `${description} are not directly readable by learner clients`,
    );
    assertStatus(
      await firestoreRequest(owner.idToken, "PATCH", collection, id, { fields: { forged: { booleanValue: true } } }),
      403,
      `${description} cannot be forged by learner clients`,
    );
  }

  console.log("Learn course/progress/evidence/Mind/adaptation Firestore rule checks passed.");
} finally {
  await database.terminate();
  await deleteApp(app);
}
