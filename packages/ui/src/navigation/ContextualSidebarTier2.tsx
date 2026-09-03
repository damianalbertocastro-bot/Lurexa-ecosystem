"use client";

import React, { useEffect, useState } from "react";
import type { NavigationDomain, WorkspaceKey, NavigationRoute } from "./types";
import { ECOSYSTEM_NAVIGATION_REGISTRY } from "./registry";

export interface ContextualSidebarTier2Props {
  activeDomain: NavigationDomain;
  activeWorkspaceKey?: WorkspaceKey;
  activeRouteHref?: string;
  onNavigate?: (route: NavigationRoute) => void;
  className?: string;
}

const STORAGE_KEY = "lurexa_nav_tier2_collapsed";

export function ContextualSidebarTier2({
  activeDomain,
  activeWorkspaceKey,
  activeRouteHref,
  onNavigate,
  className = "",
}: ContextualSidebarTier2Props) {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // Read collapse state from localStorage on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setCollapsed(stored === "true");
      }
    } catch {
      // Ignore localStorage access issues in restricted contexts
    }
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Determine header and routes according to active domain & workspace
  let title = "Navigation";
  let subtitle = "";
  let badge: string | undefined;
  let accentColor = "#6366f1";
  let routes: NavigationRoute[] = [];

  if (activeDomain === "marketing") {
    title = ECOSYSTEM_NAVIGATION_REGISTRY.marketing.name;
    subtitle = ECOSYSTEM_NAVIGATION_REGISTRY.marketing.tagline;
    routes = ECOSYSTEM_NAVIGATION_REGISTRY.marketing.routes;
    badge = "Public";
    accentColor = "#4f46e5";
  } else if (activeDomain === "docs") {
    title = ECOSYSTEM_NAVIGATION_REGISTRY.docs.name;
    subtitle = ECOSYSTEM_NAVIGATION_REGISTRY.docs.tagline;
    routes = ECOSYSTEM_NAVIGATION_REGISTRY.docs.routes;
    badge = "v2.0";
    accentColor = "#06b6d4";
  } else if (activeDomain === "workspaces" && activeWorkspaceKey) {
    const ws = ECOSYSTEM_NAVIGATION_REGISTRY.workspaces[activeWorkspaceKey];
    if (ws) {
      title = ws.name;
      subtitle = ws.tagline;
      routes = ws.routes;
      accentColor = ws.accentColor;
      badge = ws.shortName;
    }
  }

  return (
    <nav
      aria-label="Contextual Sidebar"
      className={`relative z-30 flex h-full flex-col border-r border-[var(--lx-border)] bg-[var(--lx-surface)] transition-all duration-200 ease-in-out select-none ${
        collapsed ? "w-12" : "w-56"
      } ${className}`}
    >
      {/* Collapse Toggle Button (< / >) */}
      <button
        type="button"
        onClick={toggleCollapse}
        aria-label={collapsed ? "Expand sidebar panel" : "Collapse sidebar panel"}
        title={collapsed ? "Expand sidebar panel" : "Collapse sidebar panel"}
        className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--lx-border)] bg-[var(--lx-surface)] text-[10px] font-bold text-[var(--lx-muted)] shadow-md hover:bg-[var(--lx-canvas)] hover:text-[var(--lx-ink)] focus:outline-none"
      >
        {collapsed ? ">" : "<"}
      </button>

      {/* Header Section */}
      <div className={`p-4 border-b border-[var(--lx-border)] flex flex-col justify-center min-h-[72px] ${collapsed ? "items-center px-1" : ""}`}>
        {collapsed ? (
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black text-white shadow-xs"
            style={{ backgroundColor: accentColor }}
            title={title}
          >
            {badge ? badge.slice(0, 2).toUpperCase() : title.slice(0, 1)}
          </span>
        ) : (
          <div className="space-y-1 overflow-hidden">
            <div className="flex items-center justify-between gap-1.5">
              <h2 className="truncate text-xs font-black tracking-tight text-[var(--lx-ink)]">
                {title}
              </h2>
              {badge && (
                <span
                  className="rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shrink-0"
                  style={{ backgroundColor: accentColor }}
                >
                  {badge}
                </span>
              )}
            </div>
            <p className="truncate text-[10px] text-[var(--lx-muted)]">
              {subtitle}
            </p>
          </div>
        )}
      </div>

      {/* Routes List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {routes.map((route) => {
          const isActive = activeRouteHref
            ? activeRouteHref === route.href || activeRouteHref.includes(route.id)
            : false;

          return (
            <a
              key={route.id}
              href={route.href}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(route);
                }
              }}
              title={collapsed ? route.label : undefined}
              className={`group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-bold transition-all duration-150 ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold"
                  : "text-[var(--lx-muted)] hover:bg-[var(--lx-canvas)] hover:text-[var(--lx-ink)]"
              } ${collapsed ? "justify-center px-0 h-9 w-9 mx-auto" : ""}`}
            >
              {route.icon && (
                <span className="text-sm shrink-0">{route.icon}</span>
              )}

              {!collapsed && (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <span className="truncate">{route.label}</span>
                  {route.badge && (
                    <span className="rounded-full bg-[var(--lx-canvas)] border border-[var(--lx-border)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--lx-muted)]">
                      {route.badge}
                    </span>
                  )}
                </div>
              )}
            </a>
          );
        })}
      </div>

      {/* Bottom Status / Footer info */}
      {!collapsed && (
        <div className="p-3 border-t border-[var(--lx-border)] text-[10px] text-[var(--lx-muted)] flex items-center justify-between">
          <span className="font-semibold">Lurexa OS</span>
          <span className="font-mono text-[9px]">v2026.9</span>
        </div>
      )}
    </nav>
  );
}
