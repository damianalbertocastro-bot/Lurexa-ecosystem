"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { AuthService } from "@lurexa/backend";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Breadcrumb {
  label: string;
  href?: string;
}

export interface TeacherWorkspaceBannerProps {
  /** Page-level heading (e.g. "Course management"). */
  title: string;
  /** Optional descriptive subtitle shown below the title. */
  subtitle?: string;
  /** Optional breadcrumb trail rendered above the title. */
  breadcrumbs?: Breadcrumb[];
  /** Slot for page-specific CTA buttons rendered on the right side. */
  actions?: ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Shared teacher-workspace banner rendered below the global ProductShell
 * header on every `/teacher/*` page.
 *
 * Provides a time-based greeting, consistent page title / subtitle,
 * optional breadcrumbs and an action slot — eliminating ad-hoc inline
 * headers from individual pages.
 */
export function TeacherWorkspaceBanner({
  title,
  subtitle,
  breadcrumbs,
  actions,
}: TeacherWorkspaceBannerProps) {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const greeting = getGreeting();

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged((user) => {
      setDisplayName(user?.displayName ?? null);
    });
    return unsubscribe;
  }, []);

  const greetingText = displayName
    ? `${greeting}, ${displayName}`
    : greeting;

  return (
    <section
      aria-label="Page header"
      className="border-b border-[#dfe7fb] bg-gradient-to-br from-white via-white to-[#f0f3ff]"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumbs"
            className="mb-3 flex flex-wrap items-center gap-1 text-xs font-bold text-[#6677a5]"
          >
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.label} className="flex items-center gap-1">
                {index > 0 && (
                  <span aria-hidden="true" className="text-[#b9c5ea]">/</span>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="rounded-md px-1 py-0.5 transition hover:bg-[#eef3ff] hover:text-[#1d5add]"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="px-1 py-0.5 text-[#334b87]">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: greeting + title + subtitle */}
          <div className="min-w-0">
            <p
              suppressHydrationWarning
              className="text-sm font-bold text-[#315fd7]"
            >
              {greetingText}
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#071d67] sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6677a5]">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right: action slot */}
          {actions && (
            <div className="flex flex-shrink-0 flex-wrap items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
