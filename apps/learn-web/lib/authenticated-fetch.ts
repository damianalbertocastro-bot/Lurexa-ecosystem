import { auth } from "@lurexa/backend";

export async function authenticatedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const user = auth.currentUser;
  if (!user) throw new Error("Sign in is required.");
  const token = await user.getIdToken();
  return fetch(input, { ...init, headers: { ...init?.headers, Authorization: `Bearer ${token}` } });
}
