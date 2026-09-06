"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { getEcosystemUrl } from "@lurexa/config/domains";
import type { LurexaProductId } from "@lurexa/config/product-registry";

interface AudienceSection {
  id: "learners" | "educators" | "institutions";
  tabLabel: string;
  eyebrow: string;
  heading: string;
  flagship: {
    productId: LurexaProductId;
    name: string;
    description: string;
    cta: string;
    href: string;
    badge?: string;
  };
  companion: {
    productId: LurexaProductId;
    name: string;
    description: string;
    cta: string;
    href: string;
    badge?: string;
  };
}

const productMarkSrc: Record<LurexaProductId, string> = {
  learn: "/brand/lurexa-learn.svg",
  coach: "/brand/lurexa-coach.svg",
  teach: "/brand/lurexa-teach.svg",
  admin: "/brand/lurexa-admin.svg",
  insight: "/brand/lurexa-insight.svg",
  studio: "/brand/lurexa-studio.svg",
  campus: "/brand/lurexa-campus.svg",
};

interface ProductShowcaseProps {
  onOpenDemoModal?: () => void;
}

export function ProductShowcase({ onOpenDemoModal }: ProductShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"learners" | "educators" | "institutions">("learners");
  const navRef = useRef<HTMLElement>(null);

  const learnUrl = getEcosystemUrl("learn");
  const teachUrl = getEcosystemUrl("teach");
  const adminUrl = getEcosystemUrl("admin");
  const coachUrl = process.env.NEXT_PUBLIC_LUREXA_COACH_URL ?? getEcosystemUrl("coach");
  const insightUrl = process.env.NEXT_PUBLIC_LUREXA_INSIGHT_URL ?? getEcosystemUrl("insight");
  const studioUrl = process.env.NEXT_PUBLIC_LUREXA_STUDIO_URL ?? getEcosystemUrl("studio");
  const docsUrl = getEcosystemUrl("docs");

  const audienceSections: AudienceSection[] = [
    {
      id: "learners",
      tabLabel: "For Learners",
      eyebrow: "FOR LEARNERS",
      heading: "Master English with adaptive fluency & speaking confidence.",
      flagship: {
        productId: "learn",
        name: "Lurexa Learn",
        description: "Structured English courses with persistent learner telemetry and mastery tracking.",
        cta: "Browse courses →",
        href: learnUrl,
      },
      companion: {
        productId: "coach",
        name: "Lurexa Coach",
        description: "Speak, test phonemes, and receive low-latency feedback on pronunciation.",
        cta: "Practice speaking →",
        href: coachUrl,
      },
    },
    {
      id: "educators",
      tabLabel: "For Educators",
      eyebrow: "FOR EDUCATORS",
      heading: "Elevate classroom pedagogy and build verified credentials.",
      flagship: {
        productId: "teach",
        name: "Lurexa Teach",
        description: "Growth pathways, classroom diagnostics, and credential tracking for educators.",
        cta: "View teaching pathways →",
        href: teachUrl,
      },
      companion: {
        productId: "studio",
        name: "Lurexa Studio",
        description: "Authoring workbench to build CEFR-aligned curricula that feed directly into Learn.",
        cta: "Launch workbench →",
        href: studioUrl,
      },
    },
    {
      id: "institutions",
      tabLabel: "For Institutions",
      eyebrow: "FOR INSTITUTIONS",
      heading: "Govern multi-campus language programs with verified data.",
      flagship: {
        productId: "admin",
        name: "Lurexa Admin",
        description: "Multi-tenant governance, role delegation, license management, and institutional billing.",
        cta: "Request school pilot →",
        href: "#institutional-cta",
      },
      companion: {
        productId: "insight",
        name: "Lurexa Insight",
        description: "Cross-cohort reporting, phonemic heatmaps, and automated intervention telemetry.",
        cta: "View telemetry demo →",
        href: insightUrl,
      },
    },
  ];

  // Scroll-spy via IntersectionObserver to dynamically update active tab state
  useEffect(() => {
    const sectionIds: Array<"learners" | "educators" | "institutions"> = ["learners", "educators", "institutions"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible intersecting entries
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by top offset to select the topmost active section
          visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          const topVisible = visibleEntries[0];
          if (topVisible?.target.id && sectionIds.includes(topVisible.target.id as any)) {
            setActiveTab(topVisible.target.id as "learners" | "educators" | "institutions");
          }
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.2, 0.5, 0.8],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      setActiveTab(id as "learners" | "educators" | "institutions");
    }
  };

  return (
    <div id="products" className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <p className="text-xs font-black tracking-[0.2em] text-[var(--color-brand-primary)] dark:text-indigo-400 uppercase mb-3">
          THE PRODUCT ECOSYSTEM
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-[-0.05em] leading-tight">
          Purpose-built platforms. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[var(--color-brand-primary)] via-[var(--color-brand-secondary)] to-[var(--color-brand-accent-cyan)] bg-clip-text text-transparent">
            One intelligent ecosystem.
          </span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[var(--color-text-secondary)] dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Every Lurexa product has a distinct role—adapting seamlessly for learners, educators, and enterprise institutions.
        </p>
      </div>

      {/* 1. Sticky Audience Anchor Navigation */}
      <nav
        ref={navRef}
        role="tablist"
        aria-label="Product audiences"
        className="sticky top-[69px] z-30 mb-12 -mx-4 sm:mx-0 px-4 sm:px-0 py-3"
      >
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-1.5 px-3 max-w-fit mx-auto rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-[rgba(71,87,188,0.12)] dark:border-slate-800 shadow-[0_4px_20px_rgba(31,50,120,0.06)]">
          {audienceSections.map((section) => {
            const isActive = activeTab === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={section.id}
                aria-current={isActive ? "location" : undefined}
                onClick={(e) => handleTabClick(e, section.id)}
                className={`shrink-0 rounded-full px-5 py-2 text-xs sm:text-sm font-extrabold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/40 ${
                  isActive
                    ? "bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white shadow-[0_4px_14px_rgba(47,52,184,0.3)]"
                    : "text-slate-600 dark:text-slate-400 hover:text-[var(--color-brand-primary)] dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                }`}
              >
                {section.tabLabel}
              </a>
            );
          })}
        </div>
      </nav>

      {/* Audience Sections */}
      <div className="space-y-16 lg:space-y-24">
        {audienceSections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            role="region"
            aria-labelledby={`${section.id}-heading`}
            className="scroll-mt-28 lg:scroll-mt-32"
          >
            {/* Audience Section Header */}
            <div className="mb-6 lg:mb-8">
              <span className="inline-block text-[11px] font-black tracking-[0.2em] text-[var(--color-brand-primary)] dark:text-indigo-400 uppercase mb-1">
                {section.eyebrow}
              </span>
              <h3
                id={`${section.id}-heading`}
                className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-[-0.04em]"
              >
                {section.heading}
              </h3>
            </div>

            {/* Flagship (60%) vs. Companion (40%) Card Mechanics */}
            <div className="flex flex-col lg:flex-row gap-6 items-stretch">
              {/* Flagship (Primary): 60% Width */}
              <article className="group relative lg:w-[60%] flex flex-col justify-between rounded-[26px] border border-[rgba(71,87,188,0.14)] dark:border-slate-800 bg-gradient-to-br from-white via-[#fcfdff] to-[#f4f7ff] dark:from-slate-900 dark:to-slate-950 p-7 lg:p-9 shadow-[0_12px_36px_rgba(31,50,120,0.07)] hover:shadow-[0_20px_48px_rgba(31,50,120,0.13)] hover:-translate-y-1 transition-all duration-300">
                {/* Full-card link layer */}
                <a
                  href={section.flagship.href}
                  className="absolute inset-0 z-10 rounded-[26px] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
                  aria-label={`${section.flagship.name}: ${section.flagship.description}`}
                  onClick={(e) => {
                    if (section.flagship.href === "#institutional-cta") {
                      e.preventDefault();
                      if (onOpenDemoModal) onOpenDemoModal();
                      else {
                        const target = document.getElementById("institutional-cta");
                        target?.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                  }}
                />

                {/* Top Content */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className="relative size-12 shrink-0 rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-xs border border-[rgba(71,87,188,0.12)] dark:border-slate-700">
                        <Image
                          src={productMarkSrc[section.flagship.productId]}
                          alt={`${section.flagship.name} logo`}
                          width={48}
                          height={48}
                          className="size-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--color-brand-primary)] dark:text-indigo-400">
                          Primary Platform
                        </span>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          {section.flagship.name}
                        </h4>
                      </div>
                    </div>

                    {section.flagship.badge && (
                      <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-3 py-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                        {section.flagship.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {section.flagship.description}
                  </p>
                </div>

                {/* Flagship CTA Button */}
                <div className="mt-8 pt-4 border-t border-[rgba(71,87,188,0.08)] dark:border-slate-800/80">
                  <span className="relative z-20 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-[0_6px_18px_rgba(47,52,184,0.25)] hover:shadow-[0_10px_24px_rgba(47,52,184,0.35)] transition-all">
                    {section.flagship.cta}
                  </span>
                </div>
              </article>

              {/* Companion (Secondary): 40% Width */}
              <article className="group relative lg:w-[40%] flex flex-col justify-between rounded-[26px] border border-[rgba(71,87,188,0.12)] dark:border-slate-800 bg-white dark:bg-slate-900 p-7 lg:p-9 shadow-[0_8px_24px_rgba(31,50,120,0.05)] hover:shadow-[0_16px_36px_rgba(31,50,120,0.1)] hover:-translate-y-1 transition-all duration-300">
                {/* Full-card link layer */}
                <a
                  href={section.companion.href}
                  className="absolute inset-0 z-10 rounded-[26px] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
                  aria-label={`${section.companion.name}: ${section.companion.description}`}
                />

                {/* Top Content */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className="relative size-12 shrink-0 rounded-2xl bg-slate-50 dark:bg-slate-800 p-2 shadow-xs border border-[rgba(71,87,188,0.08)] dark:border-slate-800">
                        <Image
                          src={productMarkSrc[section.companion.productId]}
                          alt={`${section.companion.name} logo`}
                          width={48}
                          height={48}
                          className="size-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                          Specialized Engine
                        </span>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          {section.companion.name}
                        </h4>
                      </div>
                    </div>

                    {section.companion.badge && (
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        {section.companion.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {section.companion.description}
                  </p>
                </div>

                {/* Companion CTA Link */}
                <div className="mt-8 pt-4 border-t border-[rgba(71,87,188,0.08)] dark:border-slate-800/80">
                  <span className="relative z-20 inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[var(--color-brand-primary)] dark:text-indigo-400 transition-colors group-hover:text-[var(--color-brand-secondary)]">
                    <span>{section.companion.cta.replace(" →", "")}</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </article>
            </div>
          </section>
        ))}
      </div>

      {/* 5. Institutional Closing CTA Banner */}
      <section
        id="institutional-cta"
        className="mt-20 lg:mt-28 rounded-[32px] border border-indigo-400/30 bg-gradient-to-br from-[#0a1931] via-[#122349] to-[var(--color-brand-primary)] p-8 sm:p-12 lg:p-16 text-white shadow-[0_24px_60px_rgba(10,25,49,0.35)] relative overflow-hidden"
        aria-labelledby="institutional-closing-heading"
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-96 h-96 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <span className="inline-block text-xs font-black tracking-[0.2em] text-teal-300 uppercase mb-3">
            INSTITUTIONAL DEPLOYMENT
          </span>
          <h3
            id="institutional-closing-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.05em] text-white leading-tight"
          >
            Bring Lurexa to your school.
          </h3>
          <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal">
            Deploy Admin governance, Insight analytics, and Teach modules across your district or university.
          </p>

          {/* Action Pair */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:contact@lurexa.org?subject=Institutional%20School%20Demo%20Request"
              onClick={(e) => {
                if (onOpenDemoModal) {
                  e.preventDefault();
                  onOpenDemoModal();
                }
              }}
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-xs sm:text-sm font-black text-slate-950 shadow-xl hover:bg-slate-100 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-400/40"
            >
              Book a demo
            </a>
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-xs sm:text-sm font-extrabold text-white backdrop-blur-md hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              Review system specs ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
