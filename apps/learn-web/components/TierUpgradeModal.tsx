"use client";

import React from "react";
import Link from "next/link";
import { Modal } from "@lurexa/ui/Modal";
import type { SubscriptionTier } from "@lurexa/types";

export interface TierUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  requiredTier?: SubscriptionTier;
  currentTier?: SubscriptionTier | string;
}

export function TierUpgradeModal({
  isOpen,
  onClose,
  featureName = "this premium capability",
  requiredTier = "ultra",
  currentTier = "basic",
}: TierUpgradeModalProps) {
  const isUltra = String(requiredTier).toLowerCase() === "ultra";
  const tierName = isUltra ? "Lurexa Ultra" : "Lurexa Plus";
  const tierPrice = isUltra ? "$19.99/mo" : "$9.99/mo";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Subscription Tier Required">
      <div className="space-y-5">
        {/* Tier Indicator Banner */}
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Current Tier: {String(currentTier).toUpperCase()}
            </span>
            <h3 className="mt-1 text-base font-semibold text-[var(--lx-ink)]">
              Unlock {featureName}
            </h3>
          </div>
          <div className="rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 px-3 py-1 text-xs font-extrabold uppercase text-white shadow-sm">
            {tierName} • {tierPrice}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-3">
          <p className="text-sm text-[var(--lx-ink-muted)]">
            {isUltra
              ? `Lurexa Ultra (${tierPrice}) unlocks the full potential of Lurexa's adaptive learning ecosystem with verified oral certifications and persistent intelligence:`
              : `Upgrade to Lurexa Plus (${tierPrice}) to unlock dedicated mastery, contrastive Dominican phonetics, and high-volume interactive practice:`}
          </p>

          <ul className="space-y-2 text-xs text-[var(--lx-ink)]">
            {isUltra ? (
              <>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>B1/B2 Oral Capstones:</strong> Defend real-world communicative projects with teacher/AI review</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Universal Learner Model:</strong> Seamless real-time cross-product sync between Learn & Coach</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>300+ Monthly Voice Practice Minutes:</strong> Ultra-low-latency Gemini streaming feedback</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Offline PWA Downloads:</strong> Full background curriculum sync on mobile devices</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Full Single-Product Access:</strong> Complete unlocked curriculum catalogue</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>120 Monthly Voice Practice Minutes:</strong> Dominican-transfer error remediation</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--lx-border)] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[var(--lx-border)] px-4 py-2 text-sm font-medium text-[var(--lx-ink-muted)] hover:bg-[var(--lx-canvas)]"
          >
            Cancel
          </button>
          <Link
            href={`/billing?recommendedTier=${isUltra ? "ultra" : "plus"}`}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Upgrade to {isUltra ? "Ultra ($19.99/mo)" : "Plus ($9.99/mo)"} →
          </Link>
        </div>
      </div>
    </Modal>
  );
}
