"use client";

import React, { useState, useEffect } from "react";
import type { NavigationDomain, WorkspaceKey, NavigationRoute } from "./types";
import { resolveNavigationContext } from "./registry";
import { GlobalDockTier1 } from "./GlobalDockTier1";
import { ContextualSidebarTier2 } from "./ContextualSidebarTier2";

export interface EcosystemNavigationLayoutProps {
  children: React.ReactNode;
  initialDomain?: NavigationDomain;
  initialWorkspaceKey?: WorkspaceKey;
  currentPathname?: string;
  onNavigate?: (route: NavigationRoute) => void;
  userDisplayName?: string;
  userEmail?: string;
  onOpenSettings?: () => void;
  className?: string;
}

export function EcosystemNavigationLayout({
  children,
  initialDomain = "workspaces",
  initialWorkspaceKey = "coach",
  currentPathname = "",
  onNavigate,
  userDisplayName,
  userEmail,
  onOpenSettings,
  className = "",
}: EcosystemNavigationLayoutProps) {
  const [activeDomain, setActiveDomain] = useState<NavigationDomain>(initialDomain);
  const [activeWorkspaceKey, setActiveWorkspaceKey] = useState<WorkspaceKey | undefined>(initialWorkspaceKey);
  const [activeRouteHref, setActiveRouteHref] = useState<string>(currentPathname);

  // Sync state if initial props or currentPathname changes
  useEffect(() => {
    if (currentPathname) {
      const resolved = resolveNavigationContext(currentPathname, initialWorkspaceKey);
      setActiveDomain(resolved.domain);
      if (resolved.workspaceKey) {
        setActiveWorkspaceKey(resolved.workspaceKey);
      }
      if (resolved.activeRouteHref) {
        setActiveRouteHref(resolved.activeRouteHref);
      }
    }
  }, [currentPathname, initialWorkspaceKey]);

  const handleSelectDomain = (domain: NavigationDomain, workspaceKey?: WorkspaceKey) => {
    setActiveDomain(domain);
    if (workspaceKey) {
      setActiveWorkspaceKey(workspaceKey);
    }
  };

  const handleRouteClick = (route: NavigationRoute) => {
    setActiveRouteHref(route.href);
    if (onNavigate) {
      onNavigate(route);
    } else if (typeof window !== "undefined") {
      window.location.href = route.href;
    }
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-[var(--lx-canvas)] text-[var(--lx-ink)] ${className}`}>
      {/* Tier 1: Fixed Global Dock (Leftmost Rail, 56px) - Permanent DOM Mount */}
      <GlobalDockTier1
        activeDomain={activeDomain}
        activeWorkspaceKey={activeWorkspaceKey}
        onSelectDomain={handleSelectDomain}
        userDisplayName={userDisplayName}
        userEmail={userEmail}
        onOpenSettings={onOpenSettings}
      />

      {/* Tier 2: Contextual Sidebar Panel (Collapsible, ~220px) */}
      <ContextualSidebarTier2
        activeDomain={activeDomain}
        activeWorkspaceKey={activeWorkspaceKey}
        activeRouteHref={activeRouteHref}
        onNavigate={handleRouteClick}
      />

      {/* Primary Application / Content Area */}
      <main className="relative flex-1 overflow-y-auto overflow-x-hidden bg-[var(--lx-canvas)] focus:outline-none">
        {children}
      </main>
    </div>
  );
}
