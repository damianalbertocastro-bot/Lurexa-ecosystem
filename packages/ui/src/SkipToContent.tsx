import React from "react";

export interface SkipToContentProps {
  targetId?: string;
  label?: string;
}

export const SkipToContent: React.FC<SkipToContentProps> = ({
  targetId = "main-content",
  label = "Skip to main content",
}) => {
  return (
    <a
      href={`#${targetId}`}
      className="skip-link sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-xl focus:bg-[var(--lx-primary)] focus:px-4 focus:py-2.5 focus:text-xs focus:font-bold focus:text-white focus:shadow-xl focus:ring-4 focus:ring-[var(--lx-accent)]"
    >
      {label}
    </a>
  );
};
