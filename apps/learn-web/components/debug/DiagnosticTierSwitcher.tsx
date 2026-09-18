"use client";

import React, { useState } from "react";
import type { SubscriptionTier } from "@lurexa/types";
import { UserService } from "@lurexa/backend";

export interface DiagnosticTierSwitcherProps {
  userId?: string;
  currentTier?: SubscriptionTier | string;
  organizationId?: string;
  onTierChanged?: (newTier: SubscriptionTier) => void;
}

export function DiagnosticTierSwitcher({
  userId,
  currentTier = "basic",
  organizationId,
  onTierChanged,
}: DiagnosticTierSwitcherProps) {
  const [activeTier, setActiveTier] = useState<string>(String(currentTier).toLowerCase());
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Gated visibility per Lurexa Directive
  const isDevelopment = process.env.NODE_ENV !== "production";
  const isAlphaOrg = organizationId === "org_lurexa_alpha";

  if (!isDevelopment && !isAlphaOrg) {
    return null;
  }

  const handleTierChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextTier = event.target.value as SubscriptionTier;
    setActiveTier(nextTier);
    setSuccessMsg(null);

    if (!userId) {
      onTierChanged?.(nextTier);
      return;
    }

    setUpdating(true);
    try {
      await UserService.updateUserProfile(userId, {
        subscriptionTier: nextTier,
        ...(nextTier === "ultra" ? { unlockedModules: ["ALL"] } : {}),
      });
      setSuccessMsg(`Switched to ${nextTier.toUpperCase()}`);
      onTierChanged?.(nextTier);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error("Failed to switch diagnostic subscription tier:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 items-center rounded-full bg-indigo-500/20 px-2 text-xs font-bold uppercase tracking-wider text-indigo-500">
            🛠️ Tester Diagnostic
          </span>
          <span className="text-xs text-[var(--lx-ink-muted)]">
            Instant Tier Gating Switcher
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="diagnostic-tier-select" className="text-xs font-semibold text-[var(--lx-ink)]">
            Active Tier:
          </label>
          <select
            id="diagnostic-tier-select"
            value={activeTier}
            onChange={handleTierChange}
            disabled={updating}
            className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 py-1.5 text-xs font-bold text-[var(--lx-ink)] shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="basic">Basic (Trial: 3 modules, no Capstone)</option>
            <option value="plus">Plus (Single Product: 120 voice mins)</option>
            <option value="ultra">Ultra (Universal Model: Capstone, Sync, PWA)</option>
            <option value="enterprise">Enterprise (Institutional Analytics)</option>
          </select>
        </div>
      </div>

      {successMsg && (
        <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          ✓ {successMsg} — UI permissions updated in real time.
        </p>
      )}
    </div>
  );
}
