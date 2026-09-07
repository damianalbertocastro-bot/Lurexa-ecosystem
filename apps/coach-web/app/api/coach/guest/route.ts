import { getServerFirebaseAuth } from "@lurexa/backend/firebase-admin.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(): Promise<Response> {
  const guestUid = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  let customToken: string | null = null;
  try {
    const authAdmin = getServerFirebaseAuth();
    customToken = await authAdmin.createCustomToken(guestUid, {
      isGuest: true,
      role: "learner",
    });
  } catch (error) {
    console.warn("Could not create Firebase custom token for guest, using fallback bearer token", error);
  }

  const guestSession = {
    isGuest: true,
    uid: guestUid,
    token: customToken ? undefined : guestUid,
    lessonsCompleted: 0,
    maxAllowedLessons: 1,
    createdAt: new Date().toISOString(),
  };

  return Response.json({ customToken, guestSession });
}
