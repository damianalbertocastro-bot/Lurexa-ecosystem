"use client";

import React, { useState } from "react";

export interface PhoneticChipProps {
  ipa: string;
  example: string;
  l1Note?: string;
  category?: "consonant" | "vowel" | "stress" | "cluster";
  className?: string;
}

export const PhoneticChip: React.FC<PhoneticChipProps> = ({
  ipa,
  example,
  l1Note,
  category = "consonant",
  className = "",
}) => {
  const [open, setOpen] = useState(false);

  const categoryStyles = {
    consonant: "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/60",
    vowel: "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800/60",
    stress: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60",
    cluster: "bg-violet-50 text-violet-800 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/60",
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold transition duration-150 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-focus-ring)] ${categoryStyles[category]}`}
        aria-expanded={open}
        aria-label={`Phonetic target: ${ipa} in ${example}`}
      >
        <span className="font-mono text-xs font-black">{ipa}</span>
        <span className="opacity-40">·</span>
        <span className="font-semibold">{example}</span>
        {l1Note && (
          <span className="ml-0.5 rounded-full bg-amber-400/30 px-1.5 py-0.2 text-[9px] font-black text-amber-900 dark:text-amber-200">
            L1
          </span>
        )}
      </button>

      {open && l1Note && (
        <div
          role="tooltip"
          className="animate-scale-in absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-3 text-left text-xs shadow-xl"
        >
          <div className="flex items-center justify-between pb-1 text-[10px] font-black uppercase tracking-wider text-[var(--lx-primary)]">
            <span>Dominican L1 Focus</span>
            <span className="font-mono">{ipa}</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--lx-ink)]">{l1Note}</p>
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[var(--lx-surface)]" />
        </div>
      )}
    </div>
  );
};
