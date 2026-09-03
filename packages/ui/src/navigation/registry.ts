import { getEcosystemUrl } from "@lurexa/config/domains";
import type {
  EcosystemNavigationRegistry,
  NavigationDomain,
  WorkspaceKey,
  ActiveNavigationContext,
} from "./types";

const rootMarketingUrl = getEcosystemUrl("root");
const teachUrl = getEcosystemUrl("teach");
const coachUrl = getEcosystemUrl("coach");
const studioUrl = getEcosystemUrl("studio");
const insightUrl = getEcosystemUrl("insight");
const docsUrl = getEcosystemUrl("docs");

export const ECOSYSTEM_NAVIGATION_REGISTRY: EcosystemNavigationRegistry = {
  // 1. DOMAIN: MARKETING (Public / Pre-auth)
  marketing: {
    id: "marketing",
    name: "Public Marketing",
    tagline: "Global learning technologies platform",
    domain: "marketing",
    defaultHref: rootMarketingUrl,
    routes: [
      {
        id: "why",
        label: "Why Lurexa",
        href: `${rootMarketingUrl}/why`,
        description: "Pedagogical philosophy and learner model edge",
        icon: "✨",
      },
      {
        id: "products",
        label: "Products",
        href: `${rootMarketingUrl}/products`,
        description: "The 6 specialized learning and teaching tools",
        icon: "🧩",
      },
      {
        id: "pricing",
        label: "Pricing",
        href: `${rootMarketingUrl}/pricing`,
        description: "Transparent institutional and individual plans",
        icon: "💎",
      },
      {
        id: "how-it-works",
        label: "How It Works",
        href: `${rootMarketingUrl}/how-it-works`,
        description: "Universal Learner Model & Lurexa Mind adaptation",
        icon: "⚡",
      },
      {
        id: "about",
        label: "About",
        href: `${rootMarketingUrl}/about`,
        description: "Our mission, leadership, and Dominican linguistic roots",
        icon: "🌍",
      },
      {
        id: "contact",
        label: "Contact",
        href: `${rootMarketingUrl}/contact`,
        description: "Get in touch with enterprise advisors",
        icon: "📬",
      },
    ],
  },

  // 2. DOMAIN: WORKSPACES (Authenticated Applications)
  workspaces: {
    coach: {
      id: "coach",
      name: "Lurexa Coach",
      shortName: "Coach",
      tagline: "AI Spoken Fluency & Phonetics",
      domain: "workspaces",
      accentColor: "#0d9488", // teal-600
      shortcutNumber: 1, // Cmd/Ctrl + 1
      defaultHref: `${coachUrl}/dashboard`,
      routes: [
        { id: "home", label: "Home", href: `${coachUrl}/`, icon: "🏠" },
        { id: "dashboard", label: "Dashboard", href: `${coachUrl}/dashboard`, icon: "📊" },
        { id: "studio", label: "Speaking Studio", href: `${coachUrl}/studio`, icon: "🎙️", badge: "Live" },
        { id: "pronunciation", label: "Pronunciation", href: `${coachUrl}/pronunciation`, icon: "🗣️" },
        { id: "history", label: "History", href: `${coachUrl}/history`, icon: "📜" },
        { id: "educators", label: "Educators", href: `${coachUrl}/educators`, icon: "🧑‍🏫" },
      ],
    },
    teach: {
      id: "teach",
      name: "Lurexa Teach",
      shortName: "Teach",
      tagline: "Educator Development & Community",
      domain: "workspaces",
      accentColor: "#7c3aed", // violet-600
      shortcutNumber: 2, // Cmd/Ctrl + 2
      defaultHref: `${teachUrl}/dashboard`,
      routes: [
        { id: "home", label: "Home", href: `${teachUrl}/`, icon: "🏠" },
        { id: "dashboard", label: "Dashboard", href: `${teachUrl}/dashboard`, icon: "📊" },
        { id: "learning", label: "Learning", href: `${teachUrl}/courses`, icon: "📚" },
        { id: "growth-plan", label: "Growth Plan", href: `${teachUrl}/growth-plan`, icon: "🎯" },
        { id: "evidence", label: "Evidence", href: `${teachUrl}/growth`, icon: "📂" },
        { id: "community", label: "Community", href: `${teachUrl}/community`, icon: "👥" },
        { id: "assessment", label: "Assessment", href: `${teachUrl}/assessment`, icon: "📝" },
        { id: "credentials", label: "Credentials", href: `${teachUrl}/certifications`, icon: "🎖️", badge: "T1–T5" },
      ],
    },
    studio: {
      id: "studio",
      name: "Lurexa Studio",
      shortName: "Studio",
      tagline: "Curriculum & Knowledge Object Workbench",
      domain: "workspaces",
      accentColor: "#d97706", // amber-600
      shortcutNumber: 3, // Cmd/Ctrl + 3
      defaultHref: `${studioUrl}/dashboard`,
      routes: [
        { id: "dashboard", label: "Dashboard", href: `${studioUrl}/dashboard`, icon: "📊" },
        { id: "workbench", label: "Author Workbench", href: `${studioUrl}/workbench`, icon: "✏️", badge: "Editor" },
        { id: "catalog", label: "Governed Catalog", href: `${studioUrl}/catalog`, icon: "🗃️" },
        { id: "linter", label: "CEFR Linter", href: `${studioUrl}/linter`, icon: "🔍", badge: "AI" },
      ],
    },
    insight: {
      id: "insight",
      name: "Lurexa Insight",
      shortName: "Insight",
      tagline: "Institutional Analytics & Trajectories",
      domain: "workspaces",
      accentColor: "#0284c7", // sky-600
      shortcutNumber: 4, // Cmd/Ctrl + 4
      defaultHref: `${insightUrl}/overview`,
      routes: [
        { id: "overview", label: "Overview", href: `${insightUrl}/overview`, icon: "📈" },
        { id: "heatmaps", label: "Phonemic Heatmaps", href: `${insightUrl}/heatmaps`, icon: "🔥", badge: "Acoustic" },
        { id: "interventions", label: "Intervention Routing", href: `${insightUrl}/interventions`, icon: "🔀" },
        { id: "reports", label: "Milestone Reports", href: `${insightUrl}/reports`, icon: "📑" },
      ],
    },
  },

  // 3. DOMAIN: SYSTEM DOCS (Technical Governance)
  docs: {
    id: "docs",
    name: "Technical Governance",
    tagline: "Ecosystem Architecture & Standards",
    domain: "docs",
    shortcutNumber: 5, // Cmd/Ctrl + 5
    defaultHref: `${docsUrl}/architecture`,
    routes: [
      { id: "architecture", label: "Architecture", href: `${docsUrl}/architecture`, icon: "🏛️" },
      { id: "product", label: "Product", href: `${docsUrl}/product`, icon: "📦" },
      { id: "curriculum", label: "Curriculum", href: `${docsUrl}/curriculum`, icon: "📖" },
      { id: "engineering", label: "Engineering", href: `${docsUrl}/engineering`, icon: "⚙️" },
      { id: "governance", label: "Governance", href: `${docsUrl}/governance`, icon: "🛡️" },
      { id: "design", label: "Design", href: `${docsUrl}/design`, icon: "🎨" },
    ],
  },
};

/**
 * Resolves the active navigation state based on current pathname or target workspace.
 */
export function resolveNavigationContext(
  currentPathname: string,
  initialWorkspaceKey?: WorkspaceKey
): ActiveNavigationContext {
  // If an initial workspace is explicitly designated (e.g. within Teach or Coach app)
  if (initialWorkspaceKey && ECOSYSTEM_NAVIGATION_REGISTRY.workspaces[initialWorkspaceKey]) {
    const ws = ECOSYSTEM_NAVIGATION_REGISTRY.workspaces[initialWorkspaceKey];
    const matchedRoute = ws.routes.find((r) => currentPathname.includes(r.id) || currentPathname === r.href);
    return {
      domain: "workspaces",
      workspaceKey: initialWorkspaceKey,
      activeRouteId: matchedRoute?.id || ws.routes[0]?.id,
      activeRouteHref: matchedRoute?.href || ws.defaultHref,
    };
  }

  // Check Docs
  if (currentPathname.startsWith("/docs") || currentPathname.includes("/architecture") || currentPathname.includes("/governance")) {
    const matchedRoute = ECOSYSTEM_NAVIGATION_REGISTRY.docs.routes.find(
      (r) => currentPathname.includes(r.id) || currentPathname === r.href
    );
    return {
      domain: "docs",
      activeRouteId: matchedRoute?.id || "architecture",
      activeRouteHref: matchedRoute?.href || ECOSYSTEM_NAVIGATION_REGISTRY.docs.defaultHref,
    };
  }

  // Check Marketing routes
  const matchedMarketing = ECOSYSTEM_NAVIGATION_REGISTRY.marketing.routes.find(
    (r) => currentPathname.includes(r.id) || currentPathname === r.href
  );
  if (matchedMarketing || currentPathname === "/" || currentPathname === "") {
    return {
      domain: "marketing",
      activeRouteId: matchedMarketing?.id || "why",
      activeRouteHref: matchedMarketing?.href || ECOSYSTEM_NAVIGATION_REGISTRY.marketing.defaultHref,
    };
  }

  // Default to Coach workspace
  return {
    domain: "workspaces",
    workspaceKey: "coach",
    activeRouteId: "dashboard",
    activeRouteHref: ECOSYSTEM_NAVIGATION_REGISTRY.workspaces.coach.defaultHref,
  };
}
