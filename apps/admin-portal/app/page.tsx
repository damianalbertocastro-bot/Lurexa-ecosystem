"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@lurexa/ui/button";
import { Card } from "@lurexa/ui/card";
import { Badge } from "@lurexa/ui/Badge";
import { AdminService, PlatformMetricsSummary, AdminOrgOverview } from "@lurexa/backend";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<PlatformMetricsSummary | null>(null);
  const [orgs, setOrgs] = useState<AdminOrgOverview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const m = await AdminService.getPlatformMetrics();
        const o = await AdminService.getOrganizationsOverview();
        setMetrics(m);
        setOrgs(o);
      } catch (err) {
        console.error("Failed to load admin data", err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleToggleOrgStatus = async (orgId: string, currentStatus: "active" | "suspended") => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      await AdminService.updateOrgStatus(orgId, nextStatus);
      setOrgs((prev) =>
        prev.map((o) => (o.id === orgId ? { ...o, status: nextStatus } : o))
      );
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-500">Loading platform operations...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Ops Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Lurexa Platform Operations</h1>
            <p className="text-slate-400">System control, tenant management, and moderation</p>
          </div>
          <Badge variant="info">Superadmin Role Active</Badge>
        </div>

        {/* Global System KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700 text-slate-100" title="Monthly Active Users">
            <span className="text-3xl font-extrabold text-indigo-400">
              {metrics?.activeUsersMonthly.toLocaleString()}
            </span>
          </Card>
          <Card className="bg-slate-800 border-slate-700 text-slate-100" title="Monthly Revenue (MRR)">
            <span className="text-3xl font-extrabold text-emerald-400">
              ${metrics?.monthlyRecurringRevenue.toLocaleString()}
            </span>
          </Card>
          <Card className="bg-slate-800 border-slate-700 text-slate-100" title="AI Token Consumption">
            <span className="text-3xl font-extrabold text-amber-400">
              {(metrics?.totalAITokensUsed! / 1000).toFixed(0)}k Tokens
            </span>
          </Card>
          <Card className="bg-slate-800 border-slate-700 text-slate-100" title="System Error Rate">
            <span className="text-3xl font-extrabold text-slate-200">
              {metrics?.systemErrorRatePercent}%
            </span>
          </Card>
        </div>

        {/* Organizations Management Table */}
        <Card className="bg-slate-800 border-slate-700 text-slate-100" title="Registered Organizations" subtitle="Manage school tenants and plan enforcement">
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/60 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Organization Name</th>
                  <th className="px-4 py-3">Plan Tier</th>
                  <th className="px-4 py-3">Students</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {orgs.map((org) => (
                  <tr key={org.id} className="hover:bg-slate-700/50">
                    <td className="px-4 py-3 font-medium text-white">{org.name}</td>
                    <td className="px-4 py-3 uppercase text-xs font-bold text-indigo-400">{org.plan}</td>
                    <td className="px-4 py-3">{org.studentCount}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{org.createdAt}</td>
                    <td className="px-4 py-3">
                      <Badge variant={org.status === "active" ? "success" : "warning"}>
                        {org.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant={org.status === "active" ? "destructive" : "secondary"}
                        size="sm"
                        onClick={() => handleToggleOrgStatus(org.id, org.status)}
                      >
                        {org.status === "active" ? "Suspend" : "Reactivate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
