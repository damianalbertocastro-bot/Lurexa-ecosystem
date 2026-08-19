"use client";

import React, { useState } from "react";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Input } from "@lurexa/ui/Input";
import { Badge } from "@lurexa/ui/Badge";
import { MarketplaceService } from "@lurexa/backend";

export default function CoursePublishPage() {
  const [courseId, setCourseId] = useState("crs_demo_123");
  const [price, setPrice] = useState("24.99");
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await MarketplaceService.publishListing(
        courseId,
        "teacher_current",
        parseFloat(price),
        "USD",
        "one_time"
      );
      setPublished(true);
    } catch {
      alert("Failed to publish course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--learn-canvas)] p-4 sm:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#dfe7fb] pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-[-.06em] text-[#071d67]">Share your course with care.</h1>
            <p className="mt-2 text-[#6677a5]">Set a clear price and publish a trustworthy institutional listing.</p>
          </div>
          <Badge variant="success">Stripe Connect Ready</Badge>
        </div>

        <Card title="Listing Configuration">
          <form onSubmit={handlePublish} className="space-y-4 pt-2">
            <Input
              label="Select Course ID"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            />

            <Input
              label="License Price ($ USD)"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            {/* Split Breakdown */}
            <div className="rounded-2xl bg-[#f3f6ff] p-5 space-y-3 text-xs text-[#4d629d]">
              <p className="font-extrabold text-[#071d67]">Monetization Earnings Breakdown:</p>
              <div className="flex justify-between">
                <span>Teacher Earnings (70%):</span>
                <span className="font-bold text-emerald-600">${(parseFloat(price || "0") * 0.7).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Lurexa Platform Share (20%):</span>
                <span>${(parseFloat(price || "0") * 0.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Processing (10%):</span>
                <span>${(parseFloat(price || "0") * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
              {published ? "Published to Marketplace ✓" : "List Course for Sale"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
