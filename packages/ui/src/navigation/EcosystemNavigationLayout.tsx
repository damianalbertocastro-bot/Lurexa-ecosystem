"use client";

import React, { useState, useEffect } from "react";
import type { NavigationDomain, WorkspaceKey, NavigationRoute } from "./types";
import { resolveNavigationContext, ECOSYSTEM_NAVIGATION_REGISTRY } from "./registry";
import { GlobalDockTier1 } from "./GlobalDockTier1";
import { ContextualSidebarTier2 } from "./ContextualSidebarTier2";
import { LearnerMobileBottomBar } from "./LearnerMobileBottomBar";
import { EducatorMobileDrawer } from "./EducatorMobileDrawer";

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

  const isLearnerProduct = activeWorkspaceKey === "coach";
  const activeWorkspace = activeWorkspaceKey ? ECOSYSTEM_NAVIGATION_REGISTRY.workspaces[activeWorkspaceKey] : null;

  return (
    <div className={`flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[var(--lx-canvas)] text-[var(--lx-ink)] ${className}`}>
      {/* Mobile Educator/Admin Drawer (screens < md) */}
      {!isLearnerProduct && activeWorkspace && (
        <EducatorMobileDrawer
          title={activeWorkspace.name}
          subtitle={activeWorkspace.tagline}
          roleBadge={activeWorkspace.shortName}
          routes={activeWorkspace.routes}
          userDisplayName={userDisplayName}
          userEmail={userEmail}
        />
      )}

      {/* Tier 1: Fixed Global Dock (Leftmost Rail, 56px) - Desktop Mount */}
      <GlobalDockTier1
        activeDomain={activeDomain}
        activeWorkspaceKey={activeWorkspaceKey}
        onSelectDomain={handleSelectDomain}
        userDisplayName={userDisplayName}
        userEmail={userEmail}
        onOpenSettings={onOpenSettings}
      />

      {/* Tier 2: Contextual Sidebar Panel (Collapsible, ~220px) - Desktop Mount */}
      <ContextualSidebarTier2
        activeDomain={activeDomain}
        activeWorkspaceKey={activeWorkspaceKey}
        activeRouteHref={activeRouteHref}
        onNavigate={handleRouteClick}
      />

      {/* Primary Application / Content Area */}
      <main className={`relative flex-1 overflow-y-auto overflow-x-hidden bg-[var(--lx-canvas)] focus:outline-none ${isLearnerProduct ? "pb-20 md:pb-0" : ""}`}>
        {children}
      </main>

      {/* Mobile Learner Bottom Bar (screens < md for learner products) */}
      {isLearnerProduct && <LearnerMobileBottomBar activeHref={activeRouteHref} />}
    </div>
  );
}
