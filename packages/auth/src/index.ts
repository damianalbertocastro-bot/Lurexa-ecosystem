import type { User, UserRole } from "@lurexa/types";

export type Session = {
  user: User;
  role: UserRole;
  expiresAt: string;
};

export type AuthContext = {
  session: Session | null;
  isAuthenticated: boolean;
};

export function createAuthContext(session: Session | null): AuthContext {
  return {
    session,
    isAuthenticated: session !== null,
  };
}
