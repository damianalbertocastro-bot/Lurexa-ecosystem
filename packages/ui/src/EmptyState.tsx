import React from "react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "📚",
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[var(--lx-border)] bg-[var(--lx-surface)] px-6 py-12 text-center ${className}`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef3ff] text-2xl shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[var(--lx-ink)]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-6 text-[var(--lx-muted)]">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
