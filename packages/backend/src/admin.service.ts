import type {
  AdminOrgOverview,
  AIConversation,
  PlatformMetricsSummary,
} from "@lurexa/types";

export type { AdminOrgOverview, PlatformMetricsSummary } from "@lurexa/types";

const trustedAdminBoundaryError =
  "Direct browser platform administration is disabled. Use the authenticated Lurexa Core admin API.";

/**
 * @deprecated Compatibility facade only.
 *
 * Platform-wide analytics and organization mutations are trusted Core
 * operations. They must not be produced from browser-side Firestore reads or
 * placeholder metrics. Current Admin surfaces use PlatformAdminService through
 * an authenticated server Route Handler.
 */
export const AdminService = {
  async getPlatformMetrics(): Promise<PlatformMetricsSummary> {
    throw new Error(trustedAdminBoundaryError);
  },

  async getOrganizationsOverview(): Promise<AdminOrgOverview[]> {
    throw new Error(trustedAdminBoundaryError);
  },

  async updateOrgStatus(orgId: string, status: "active" | "suspended"): Promise<never> {
    void [orgId, status];
    throw new Error(trustedAdminBoundaryError);
  },

  async getFlaggedAIConversations(): Promise<AIConversation[]> {
    throw new Error(trustedAdminBoundaryError);
  },
};
