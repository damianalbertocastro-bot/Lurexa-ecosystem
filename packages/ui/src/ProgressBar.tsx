import React from "react";

export interface ProgressBarProps {
  value: number; // 0 to 100
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = false,
  className = "",
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`flex w-full items-center gap-3 ${className}`}>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full bg-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="min-w-[35px] text-right text-xs font-medium text-slate-600">
          {clampedValue}%
        </span>
      )}
    </div>
  );
};