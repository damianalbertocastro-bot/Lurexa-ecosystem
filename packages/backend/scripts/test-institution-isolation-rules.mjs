/* eslint-disable no-undef, turbo/no-undeclared-env-vars */

import { initializeApp, deleteApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.GCLOUD_PROJECT ?? "lurexa-app";
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST ?? "127.0.0.1:9099";
const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST ?? "127.0.0.1:8080";
const password = "LurexaTenantTest123!";

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error("FIRESTORE_EMULATOR_HOST is required. Run this through Firebase emulators:exec.");
}

const app = initializeApp({ projectId }, `institution-isolation-${Date.now()}`);
const database = getFirestore(app);
const auth = getAuth(app);

async function createUser(label) {
  const email = `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.test`;
  const response = await fetch(`http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  if (!response.ok) throw new Error(`Unable to create emulator user: ${await response.text()}`);
  const user = await response.json();
  return { ...user, email };
}

async function signIn(email) {
  const response = await fetch(`http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  if (!response.ok) throw new Error(`Unable to sign in emulator user: ${await response.text()}`);
  return response.json();
}

function documentUrl(collection, documentId, updateMask) {
  const base = `http://${firestoreHost}/v1/projects/${projectId}/databases/(default)/documents/${collection}/${documentId}`;
  if (!updateMask?.length) return base;
  const query = updateMask.map((field) => `updateMask.fieldPaths=${encodeURIComponent(field)}`).join("&");
  return `${base}?${query}`;
}

async function firestoreRequest(token, method, collection, documentId, body, updateMask) {
  return fetch(documentUrl(collection, documentId, updateMask), {
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
  const ownerA = await createUser("owner-a");
  const teacherA = await createUser("teacher-a");
  const teacherB = await createUser("teacher-b");
  const learnerA = await createUser("learner-a");
  const outsider = await createUser("outsider");

  await auth.setCustomUserClaims(teacherB.localId, { role: "teacher" });
  const teacherBWithClaim = await signIn(teacherB.email);

  const suffix = Date.now().toString(36);
  const orgA = `tenant_a_${suffix}`;
  const orgB = `tenant_b_${suffix}`;
  const courseA = `course_a_${suffix}`;
  const courseB = `course_b_${suffix}`;
  const now = new Date().toISOString();

  await Promise.all([
    database.collection("organizations").doc(orgA).set({ id: orgA, name: "Tenant A", ownerId: ownerA.localId, plan: "standard", createdAt: now, updatedAt: now }),
    database.collection("organizations").doc(orgB).set({ id: orgB, name: "Tenant B", ownerId: teacherB.localId, plan: "standard", createdAt: now, updatedAt: now }),
    database.collection("organizations").doc(orgA).collection("members").doc(ownerA.localId).set({ userId: ownerA.localId, orgId: orgA, role: "owner" }),
    database.collection("organizations").doc(orgA).collection("members").doc(teacherA.localId).set({ userId: teacherA.localId, orgId: orgA, role: "teacher" }),
    database.collection("organizations").doc(orgA).collection("members").doc(learnerA.localId).set({ userId: learnerA.localId, orgId: orgA, role: "student" }),
    database.collection("organizations").doc(orgB).collection("members").doc(teacherB.localId).set({ userId: teacherB.localId, orgId: orgB, role: "teacher" }),
    database.collection("courses").doc(courseA).set({ id: courseA, orgId: orgA, authorId: teacherA.localId, title: "Tenant A English", subject: "english", level: "A1", status: "published", isTemplate: false, moduleIds: [], createdAt: now, updatedAt: now }),
    database.collection("courses").doc(courseB).set({ id: courseB, orgId: orgB, authorId: teacherB.localId, title: "Tenant B English", subject: "english", level: "A1", status: "published", isTemplate: false, moduleIds: [], createdAt: now, updatedAt: now }),
  ]);

  assertStatus(await firestoreRequest(ownerA.idToken, "GET", "courses", courseA), 200, "organization owner can read a course in their own tenant");
  assertStatus(await firestoreRequest(teacherA.idToken, "GET", "courses", courseA), 200, "organization teacher can read a course in their own tenant");
  assertStatus(await firestoreRequest(learnerA.idToken, "GET", "courses", courseA), 200, "organization learner can read an assigned-tenant course catalog record");
  assertStatus(await firestoreRequest(teacherBWithClaim.idToken, "GET", "courses", courseA), 403, "teacher role claim in Tenant B cannot read Tenant A course data");
  assertStatus(await firestoreRequest(outsider.idToken, "GET", "courses", courseA), 403, "authenticated outsider cannot read tenant course data");
  assertStatus(await firestoreRequest(teacherA.idToken, "PATCH", "courses", courseA, { fields: { title: { stringValue: "Tenant A English Updated" } } }, ["title"]), 200, "teacher membership can update a course inside its own tenant");
  assertStatus(await firestoreRequest(teacherBWithClaim.idToken, "PATCH", "courses", courseA, { fields: { title: { stringValue: "Cross-tenant overwrite" } } }, ["title"]), 403, "global teacher role claim cannot update another tenant's course");
  assertStatus(await firestoreRequest(teacherA.idToken, "PATCH", "courses", courseB, { fields: { title: { stringValue: "Cross-tenant overwrite" } } }, ["title"]), 403, "Tenant A teacher cannot update Tenant B course");
  assertStatus(await firestoreRequest(teacherA.idToken, "PATCH", "courses", courseA, { fields: { orgId: { stringValue: orgB } } }, ["orgId"]), 403, "course ownership cannot be reassigned to another tenant from the client");

  console.log("Institutional tenant-isolation Firestore checks passed.");
} finally {
  await database.terminate();
  await deleteApp(app);
}
