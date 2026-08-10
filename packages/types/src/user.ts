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
  joinedAt: string;
}

export interface Invitation {
  id: string;
  orgId: string;
  email: string;
  role: MemberRole;
  code: string;
  expiresAt: string;
  usedAt?: string;
}