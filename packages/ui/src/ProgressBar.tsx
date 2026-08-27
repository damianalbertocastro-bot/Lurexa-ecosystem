import React from "react";

export interface ProgressBarProps { value: number; showLabel?: boolean; className?: string; }

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, showLabel = false, className = "" }) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  return <div className={`flex w-full items-center gap-3 ${className}`}><div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e9effc]"><div className="h-full rounded-full bg-gradient-to-r from-[var(--lx-primary)] via-[var(--lx-secondary)] to-[var(--lx-accent)] transition-all duration-500 ease-out" style={{ width: `${clampedValue}%` }} /></div>{showLabel && <span className="min-w-[35px] text-right text-xs font-bold text-[var(--lx-muted)]">{clampedValue}%</span>}</div>;
};