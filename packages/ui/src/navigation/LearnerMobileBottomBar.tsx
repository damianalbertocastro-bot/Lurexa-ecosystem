"use client";

import React, { useState, useEffect } from "react";

export interface LearnerBottomBarTab {
  id: string;
  label: string;
  href: string;
  icon: (props: { active: boolean; className?: string }) => React.ReactNode;
  badge?: string | number;
}

export interface LearnerMobileBottomBarProps {
  tabs?: LearnerBottomBarTab[];
  className?: string;
  activeHref?: string;
  onNavigate?: (href: string) => void;
}

// Built-in default icons for learner tabs
function BookOpenIcon({ active, className = "w-6 h-6" }: { active: boolean; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

function MicrophoneIcon({ active, className = "w-6 h-6" }: { active: boolean; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      />
    </svg>
  );
}

function SparklesIcon({ active, className = "w-6 h-6" }: { active: boolean; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function UserIcon({ active, className = "w-6 h-6" }: { active: boolean; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

const DEFAULT_LEARNER_TABS: LearnerBottomBarTab[] = [
  {
    id: "learn",
    label: "Learn",
    href: "/dashboard",
    icon: (p) => <BookOpenIcon {...p} />,
  },
  {
    id: "coach",
    label: "Coach",
    href: "/coach",
    icon: (p) => <MicrophoneIcon {...p} />,
  },
  {
    id: "practice",
    label: "Practice",
    href: "/learn",
    icon: (p) => <SparklesIcon {...p} />,
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile",
    icon: (p) => <UserIcon {...p} />,
  },
];

export function LearnerMobileBottomBar({
  tabs = DEFAULT_LEARNER_TABS,
  className = "",
  activeHref,
  onNavigate,
}: LearnerMobileBottomBarProps) {
  const [currentPathname, setCurrentPathname] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPathname(window.location.pathname);
    }
  }, []);

  const activeTarget = activeHref || currentPathname;

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className={`fixed bottom-0 inset-x-0 z-40 block md:hidden border-t border-[var(--lx-border,#e2e8f0)] bg-[var(--lx-surface,#ffffff)]/95 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl pb-safe transition-all ${className}`}
    >
      <div className="flex h-16 items-center justify-around px-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? activeTarget === "/"
              : activeTarget.startsWith(tab.href);

          return (
            <a
              key={tab.id}
              href={tab.href}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(tab.href);
                }
              }}
              aria-label={tab.label}
              className={`group relative flex flex-1 flex-col items-center justify-center py-1 min-touch-target rounded-xl transition-all duration-150 active:scale-90 ${
                isActive
                  ? "text-[var(--lx-primary,#4f46e5)] font-bold"
                  : "text-[var(--lx-muted,#64748b)] hover:text-[var(--lx-ink,#0a1c55)] font-medium"
              }`}
            >
              {/* Icon Container with active indicator glow */}
              <div className="relative flex items-center justify-center">
                {tab.icon({ active: isActive })}
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="mt-1 text-[11px] leading-tight tracking-tight">
                {tab.label}
              </span>

              {/* Active Pill Indicator */}
              {isActive && (
                <span className="absolute top-0.5 h-0.5 w-6 rounded-full bg-[var(--lx-primary,#4f46e5)] shadow-[0_0_8px_rgba(79,70,229,0.7)]" />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
