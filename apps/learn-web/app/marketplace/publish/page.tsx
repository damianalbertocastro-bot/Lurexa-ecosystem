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
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Publish Course to Marketplace</h1>
            <p className="text-slate-500">Monetize your curriculum and earn 70% per purchase</p>
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
            <div className="rounded-lg bg-slate-100 p-4 space-y-2 text-xs text-slate-700">
              <p className="font-semibold text-slate-900">Monetization Earnings Breakdown:</p>
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
