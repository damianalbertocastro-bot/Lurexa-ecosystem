import React from "react";

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  action,
  className = "",
}) => {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="mb-4 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};