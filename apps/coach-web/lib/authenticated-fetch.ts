import { auth } from "@lurexa/backend";

export async function authenticatedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let user = auth.currentUser;
  if (!user) {
    await new Promise<void>((resolve) => {
      const unsub = auth.onAuthStateChanged((nextUser) => {
        unsub();
        user = nextUser;
        resolve();
      });
      setTimeout(() => {
        unsub();
        resolve();
      }, 1200);
    });
  }
  if (!user) {
    if (typeof window !== "undefined") {
      try {
        const guestData = window.sessionStorage.getItem("lurexa.coach.guest-session");
        if (guestData) {
          const parsed = JSON.parse(guestData) as { isGuest?: boolean; uid?: string; token?: string };
          if (parsed.isGuest) {
            const guestToken = parsed.token || `guest_${parsed.uid || "demo"}`;
            const headers = new Headers(init?.headers || {});
            headers.set("Authorization", `Bearer ${guestToken}`);
            return fetch(input, { ...init, headers });
          }
        }
      } catch {
        // pass
      }
    }
    throw new Error("Sign in is required.");
  }
  const token = await user.getIdToken();
  const headers = new Headers(init?.headers || {});
  headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}
