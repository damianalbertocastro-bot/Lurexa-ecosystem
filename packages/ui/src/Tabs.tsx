import React from "react";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-3.5 py-2 text-xs sm:text-sm",
  };

  return (
    <nav
      role="tablist"
      aria-label="Tabs"
      className={`inline-flex flex-wrap items-center gap-1.5 rounded-2xl bg-[#edf1fb] p-1.5 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 rounded-xl font-extrabold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-focus-ring)] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none ${
              sizeClasses[size]
            } ${
              isActive
                ? "bg-[var(--lx-ink)] text-white shadow-sm"
                : "text-[var(--lx-muted)] hover:bg-[#dfe6f8] hover:text-[var(--lx-ink)]"
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  isActive ? "bg-white/20 text-white" : "bg-white text-[var(--lx-ink)]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
