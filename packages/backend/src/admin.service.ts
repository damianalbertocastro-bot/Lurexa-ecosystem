import type {
  AdminOrgOverview,
  AIConversation,
  PlatformMetricsSummary,
} from "@lurexa/types";

export type { AdminOrgOverview, PlatformMetricsSummary } from "@lurexa/types";

const trustedAdminError =
  "Platform administration is server-only. Use the authenticated Lurexa Admin API with a verified super_admin claim.";

/**
 * @deprecated Platform-wide administration cannot run through browser Firestore
 * reads or writes. This compatibility facade remains only to surface a clear
 * migration error for stale consumers.
 */
export const AdminService = {
  async getPlatformMetrics(): Promise<PlatformMetricsSummary> {
    throw new Error(trustedAdminError);
  },

  async getOrganizationsOverview(): Promise<AdminOrgOverview[]> {
    throw new Error(trustedAdminError);
  },

  async updateOrgStatus(orgId: string, status: "active" | "suspended"): Promise<void> {
    void orgId;
    void status;
    throw new Error(trustedAdminError);
  },

  async getFlaggedAIConversations(): Promise<AIConversation[]> {
    throw new Error(trustedAdminError);
  },
};
