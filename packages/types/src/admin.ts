export interface PlatformMetricsSummary {
  activeUsersMonthly: number;
  totalOrganizations: number;
  monthlyRecurringRevenue: number | null;
  totalAITokensUsed: number;
  systemErrorRatePercent: number | null;
}

export interface AdminOrgOverview {
  id: string;
  name: string;
  plan: string;
  studentCount: number;
  status: "active" | "suspended";
  createdAt: string;
}

export interface AdminDashboardProjection {
  generatedAt: string;
  metrics: PlatformMetricsSummary;
  organizations: AdminOrgOverview[];
}
