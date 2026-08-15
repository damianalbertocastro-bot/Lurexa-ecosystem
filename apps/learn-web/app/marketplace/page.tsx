"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Input } from "@lurexa/ui/Input";
import { MarketplaceService } from "@lurexa/backend";
import { MarketplaceListing } from "@lurexa/types";

export default function MarketplacePage() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const data = await MarketplaceService.getMarketplaceListings();
        setListings(data);
      } catch (err) {
        console.error("Failed to load catalog", err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const handlePurchase = async (listing: MarketplaceListing) => {
    setPurchasingId(listing.id);
    try {
      const receipt = await MarketplaceService.purchaseCourse("org_buyer_demo", listing);
      alert(`Success! Course unlocked. Receipt ID: ${receipt.purchaseId}. Author earned $${receipt.authorEarnings}`);
    } catch {
      alert("Purchase failed.");
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Lurexa Course Marketplace</h1>
            <p className="text-slate-500">Discover and import proven courses created by top educators</p>
          </div>
          <Button variant="primary" onClick={() => (window.location.href = "/teacher/marketplace/publish")}>
            + Publish Your Course
          </Button>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <Input
            placeholder="Search courses by subject, level, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button variant="secondary">Filter Options</Button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-slate-500">Loading catalog...</p>
          ) : (
            listings.map((item) => (
              <Card
                key={item.id}
                title={item.id === "list_1" ? "High School Algebra II & Logic" : "English B2 Conversational Mastery"}
                subtitle={`Created by Educator #${item.authorId.slice(-6)}`}
                action={<Badge variant="info">★ {item.rating}</Badge>}
                className="flex flex-col justify-between"
              >
                <div className="space-y-4 pt-3">
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs text-slate-500">{item.salesCount} School Licenses Sold</span>
                    <span className="text-2xl font-extrabold text-slate-900">${item.price}</span>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handlePurchase(item)}
                    isLoading={purchasingId === item.id}
                  >
                    License Course (${item.price})
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
