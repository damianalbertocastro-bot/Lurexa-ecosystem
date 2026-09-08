export type UserRole = "student" | "teacher" | "admin" | "super_admin";

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  defaultOrgId?: string;
  createdAt: string; // ISO String
  updatedAt: string;
}

export type PricingPlan = "free" | "basic" | "pro" | "enterprise";

export interface Organization {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  plan: PricingPlan;
  settings: {
    allowSelfRegistration: boolean;
    aiQueryLimitPerStudent: number;
    offlineSyncEnabled: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export type MemberRole = "owner" | "admin" | "teacher" | "student";

export interface OrganizationMember {
  id: string;
  orgId: string;
  userId: string;
  role: MemberRole;
  invitationId?: string;
  joinedAt: string;
}

export interface Invitation {
  id: string;
  orgId: string;
  email: string;
  role: MemberRole;
  code: string;
  expiresAt: string;
  expiresAtMillis: number;
  usedAt?: string | null;
}

export type PrimaryLearningGoal = "academic" | "career" | "daily_conversation";
export type PreferredAccentDialect = "general_american" | "dominican" | "british" | "neutral_international";

export interface UserProfileDetails {
  id: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  targetCefrLevel?: string;
  primaryGoal?: PrimaryLearningGoal | string;
  preferredAccent?: PreferredAccentDialect | string;
  interests?: string[];
  nativeLanguage?: string;
  dailyTargetMinutes?: number;
  role?: UserRole;
  createdAt: string;
  updatedAt: string;
}
