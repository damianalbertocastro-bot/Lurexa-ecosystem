import type { MarketplaceListing } from "@lurexa/types";

export interface PurchaseReceipt {
  purchaseId: string;
  buyerOrgId: string;
  listingId: string;
  amount: number;
  authorEarnings: number;
  platformFee: number;
  status: "completed" | "failed";
  createdAt: string;
}

const unavailable = () => new Error(
  "Lurexa Marketplace is a future concept and is not an active commerce product. No listing or payment action was performed.",
);

/**
 * Reserved compatibility surface for the future Marketplace concept.
 *
 * Marketplace is intentionally inactive. These methods must not create listings,
 * fabricate catalog data, or record completed purchases until Marketplace is
 * formally activated with authorization, catalog governance, pricing, payment,
 * settlement, refunds, tax, and audit contracts.
 */
export const MarketplaceService = {
  async publishListing(
    _courseId: string,
    _authorId: string,
    _price: number,
    _currency = "USD",
    _type: "one_time" | "subscription" = "one_time",
  ): Promise<MarketplaceListing> {
    throw unavailable();
  },

  async getMarketplaceListings(): Promise<MarketplaceListing[]> {
    return [];
  },

  async purchaseCourse(
    _buyerOrgId: string,
    _listing: MarketplaceListing,
  ): Promise<PurchaseReceipt> {
    throw unavailable();
  },
};
