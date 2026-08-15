import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import { MarketplaceListing } from "@lurexa/types";

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

export const MarketplaceService = {
  /**
   * Publish a course to the Marketplace
   */
  async publishListing(
    courseId: string,
    authorId: string,
    price: number,
    currency = "USD",
    type: "one_time" | "subscription" = "one_time"
  ): Promise<MarketplaceListing> {
    const listingId = doc(collection(db, "marketplace_listings")).id;

    const listing: MarketplaceListing = {
      id: listingId,
      courseId,
      authorId,
      price,
      currency,
      type,
      rating: 5.0,
      salesCount: 0,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "marketplace_listings", listingId), listing);
    return listing;
  },

  /**
   * Fetch published marketplace listings
   */
  async getMarketplaceListings(): Promise<MarketplaceListing[]> {
    const q = query(collection(db, "marketplace_listings"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    if (snap.empty) {
      // Fallback demo marketplace listings
      return [
        {
          id: "list_1",
          courseId: "crs_math_b2",
          authorId: "tch_alvarez",
          price: 29.99,
          currency: "USD",
          type: "one_time",
          rating: 4.9,
          salesCount: 38,
          createdAt: new Date().toISOString(),
        },
        {
          id: "list_2",
          courseId: "crs_eng_grammar",
          authorId: "tch_santos",
          price: 19.99,
          currency: "USD",
          type: "one_time",
          rating: 4.8,
          salesCount: 104,
          createdAt: new Date().toISOString(),
        },
      ];
    }

    return snap.docs.map((d) => d.data() as MarketplaceListing);
  },

  /**
   * Purchase a marketplace course with 70/20 revenue distribution split
   */
  async purchaseCourse(buyerOrgId: string, listing: MarketplaceListing): Promise<PurchaseReceipt> {
    const purchaseId = doc(collection(db, "purchases")).id;

    // Revenue Split Model: 70% Author / 20% Platform / 10% Fee Processing
    const authorEarnings = Number((listing.price * 0.7).toFixed(2));
    const platformFee = Number((listing.price * 0.2).toFixed(2));

    const receipt: PurchaseReceipt = {
      purchaseId,
      buyerOrgId,
      listingId: listing.id,
      amount: listing.price,
      authorEarnings,
      platformFee,
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "purchases", purchaseId), receipt);
    return receipt;
  },
};
