import React from "react";

export interface SkeletonProps {
  variant?: "line" | "card" | "avatar" | "paragraph" | "heading" | "circle";
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "line",
  className = "",
  count = 1,
}) => {
  const base = "animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800 motion-reduce:animate-none";

  const renderSingle = (key?: number) => {
    switch (variant) {
      case "avatar":
        return <div key={key} className={`h-12 w-12 rounded-2xl ${base} ${className}`} />;
      case "circle":
        return <div key={key} className={`h-10 w-10 rounded-full ${base} ${className}`} />;
      case "heading":
        return <div key={key} className={`h-7 w-3/4 ${base} ${className}`} />;
      case "paragraph":
        return (
          <div key={key} className={`space-y-2.5 ${className}`}>
            <div className={`h-4 w-full ${base}`} />
            <div className={`h-4 w-5/6 ${base}`} />
            <div className={`h-4 w-4/6 ${base}`} />
          </div>
        );
      case "card":
        return (
          <div key={key} className={`rounded-[22px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm ${className}`}>
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl ${base}`} />
              <div className="flex-1 space-y-2">
                <div className={`h-4 w-1/3 ${base}`} />
                <div className={`h-3 w-1/2 ${base}`} />
              </div>
            </div>
            <div className={`mt-5 h-20 w-full rounded-xl ${base}`} />
          </div>
        );
      case "line":
      default:
        return <div key={key} className={`h-4 w-full ${base} ${className}`} />;
    }
  };

  if (count > 1 && variant !== "paragraph") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => renderSingle(i))}
      </div>
    );
  }

  return renderSingle();
};
