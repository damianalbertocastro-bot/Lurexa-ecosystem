import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  interactive?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  action,
  interactive = false,
  className = "",
  ...props
}) => {
  const interactiveStyles = interactive
    ? "cursor-pointer hover:-translate-y-1 hover:border-[var(--lx-secondary)]/60 hover:shadow-[var(--lx-card-hover-shadow)] active:translate-y-0 active:scale-[0.99]"
    : "hover:border-[var(--lx-secondary)]/30 hover:shadow-[var(--lx-card-hover-shadow)]";

  return (
    <div
      className={`animate-fade-slide-up rounded-[22px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-[var(--lx-card-shadow)] transition-all duration-200 motion-reduce:transform-none motion-reduce:transition-none ${interactiveStyles} ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-lg font-bold tracking-[-.03em] text-[var(--lx-ink)]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm leading-5 text-[var(--lx-muted)]">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};