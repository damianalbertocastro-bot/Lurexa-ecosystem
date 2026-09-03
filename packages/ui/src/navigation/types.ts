export type NavigationDomain = "marketing" | "workspaces" | "docs";

export type WorkspaceKey = "teach" | "coach" | "studio" | "insight";

export interface NavigationRoute {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  shortcut?: string;
  description?: string;
  external?: boolean;
}

export interface WorkspaceConfig {
  id: WorkspaceKey;
  name: string;
  shortName: string;
  tagline: string;
  domain: "workspaces";
  accentColor: string;
  shortcutNumber: number; // 1: Coach, 2: Teach, 3: Studio, 4: Insight
  defaultHref: string;
  routes: NavigationRoute[];
}

export interface MarketingDomainConfig {
  id: "marketing";
  name: string;
  tagline: string;
  domain: "marketing";
  defaultHref: string;
  routes: NavigationRoute[];
}

export interface SystemDocsDomainConfig {
  id: "docs";
  name: string;
  tagline: string;
  domain: "docs";
  shortcutNumber: number;
  defaultHref: string;
  routes: NavigationRoute[];
}

export interface EcosystemNavigationRegistry {
  marketing: MarketingDomainConfig;
  workspaces: Record<WorkspaceKey, WorkspaceConfig>;
  docs: SystemDocsDomainConfig;
}

export interface ActiveNavigationContext {
  domain: NavigationDomain;
  workspaceKey?: WorkspaceKey;
  activeRouteId?: string;
  activeRouteHref?: string;
}
