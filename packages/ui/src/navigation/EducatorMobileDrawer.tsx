"use client";

import React, { useState, useEffect } from "react";
import type { NavigationRoute } from "./types";
import { MasterMark } from "../MasterMark";

export interface EducatorMobileDrawerProps {
  title?: string;
  subtitle?: string;
  roleBadge?: string;
  routes: NavigationRoute[];
  userDisplayName?: string;
  userEmail?: string;
  onNavigate?: (route: NavigationRoute) => void;
  onSignOut?: () => void;
  className?: string;
}

export function EducatorMobileDrawer({
  title = "Lurexa Portal",
  subtitle = "Educator Workspace",
  roleBadge = "Educator",
  routes,
  userDisplayName,
  userEmail,
  onNavigate,
  onSignOut,
  className = "",
}: EducatorMobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname);
    }
  }, []);

  // Prevent background body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Mobile Top App Bar (Only visible on screens < md) */}
      <header
        className={`sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[var(--lx-border,#e2e8f0)] bg-[var(--lx-surface,#ffffff)]/90 px-4 backdrop-blur-xl md:hidden ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <MasterMark className="h-6 w-6 text-[var(--lx-primary,#1d5add)]" />
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-tight text-[var(--lx-ink,#0a1c55)]">
              {title}
            </span>
            <span className="text-[10px] text-[var(--lx-muted,#64748b)]">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Hamburger Toggle Button (Minimum 44px touch target) */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--lx-border,#e2e8f0)] bg-[var(--lx-canvas,#f8fafc)] text-[var(--lx-ink,#0a1c55)] active:scale-95 transition"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          role="presentation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 md:hidden"
        />
      )}

      {/* Slide-out Drawer Panel */}
      <aside
        aria-label="Navigation drawer"
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-sm flex-col justify-between bg-[var(--lx-surface,#ffffff)] border-r border-[var(--lx-border,#e2e8f0)] shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[var(--lx-border,#e2e8f0)] px-5 py-4 pt-safe">
          <div className="flex items-center gap-2.5">
            <MasterMark className="h-7 w-7 text-[var(--lx-primary,#1d5add)]" />
            <div>
              <h2 className="text-sm font-extrabold text-[var(--lx-ink,#0a1c55)]">
                {title}
              </h2>
              <span className="inline-block rounded-md bg-[var(--lx-canvas,#f1f5f9)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--lx-primary,#1d5add)]">
                {roleBadge}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--lx-border,#e2e8f0)] text-[var(--lx-muted,#64748b)] hover:text-[var(--lx-ink,#0a1c55)] active:scale-95 transition"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Route Links (Scrollable) */}
        <nav aria-label="Portal routes" className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {routes.map((route) => {
            const isActive =
              route.href === "/"
                ? pathname === "/"
                : pathname.startsWith(route.href);

            return (
              <a
                key={route.id}
                href={route.href}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate(route);
                  }
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 active:scale-[0.98] min-touch-target ${
                  isActive
                    ? "bg-[var(--lx-primary,#1d5add)] text-white shadow-md shadow-indigo-500/20"
                    : "text-[var(--lx-ink,#0a1c55)] hover:bg-[var(--lx-canvas,#f1f5f9)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {route.icon && (
                    <span className="text-base" aria-hidden="true">
                      {route.icon}
                    </span>
                  )}
                  <span>{route.label}</span>
                </div>

                {route.badge && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[var(--lx-canvas,#e2e8f0)] text-[var(--lx-muted,#475569)]"
                    }`}
                  >
                    {route.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Drawer Footer: User Profile & Actions */}
        <div className="border-t border-[var(--lx-border,#e2e8f0)] bg-[var(--lx-canvas,#f8fafc)] p-4 pb-safe">
          {(userDisplayName || userEmail) && (
            <div className="mb-3 flex items-center gap-3 px-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lx-primary,#1d5add)] font-black text-white text-xs">
                {userDisplayName ? userDisplayName[0].toUpperCase() : "U"}
              </div>
              <div className="min-w-0 flex-1">
                {userDisplayName && (
                  <p className="truncate text-xs font-bold text-[var(--lx-ink,#0a1c55)]">
                    {userDisplayName}
                  </p>
                )}
                {userEmail && (
                  <p className="truncate text-[11px] text-[var(--lx-muted,#64748b)]">
                    {userEmail}
                  </p>
                )}
              </div>
            </div>
          )}

          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--lx-border,#e2e8f0)] bg-[var(--lx-surface,#ffffff)] py-2.5 text-xs font-bold text-rose-600 shadow-xs hover:bg-rose-50 active:scale-95 transition min-touch-target"
            >
              Sign out
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
