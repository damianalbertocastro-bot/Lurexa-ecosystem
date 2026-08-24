import type { PricingPlan } from "./user";

export interface PlatformMetricsSummary {
  activeLearnersMonthly: number;
  totalOrganizations: number;
  totalAITokensRecorded: number;
  monthlyRecurringRevenue: number | null;
  systemErrorRatePercent: number | null;
  generatedAt: string;
  limitations: string[];
}

export interface AdminOrgOverview {
  id: string;
  name: string;
  plan: PricingPlan;
  studentCount: number;
  status: "active" | "suspended";
  createdAt: string;
}

export interface PlatformAdminSnapshot {
  metrics: PlatformMetricsSummary;
  organizations: AdminOrgOverview[];
}

export interface PlatformOrganizationStatusUpdate {
  organizationId: string;
  status: "active" | "suspended";
}
