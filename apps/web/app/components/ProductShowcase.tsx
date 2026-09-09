"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { getEcosystemUrl } from "@lurexa/config/domains";
import type { LurexaProductId } from "@lurexa/config/product-registry";
import styles from "../page.module.css";

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
          const targetId = topVisible?.target.id;
          if (targetId === "learners" || targetId === "educators" || targetId === "institutions") {
            setActiveTab(targetId);
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
    <section id="products" className={styles.pricingSection} style={{ padding: "96px 40px" }} aria-labelledby="products-heading">
      {/* Section Heading matching .sectionHeading */}
      <div className={styles.sectionHeading} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "48px" }}>
        <p className={styles.kicker}>THE PRODUCT ECOSYSTEM</p>
        <h2 id="products-heading" style={{ fontSize: "clamp(36px, 4.8vw, 60px)", fontWeight: 900, letterSpacing: "-0.05em", margin: "16px 0 0", color: "var(--color-brand-navy)", lineHeight: 1.08 }}>
          Purpose-built platforms. <br className="hidden sm:inline" />
          <em style={{ fontStyle: "normal" }}>One intelligent ecosystem.</em>
        </h2>
        <p style={{ maxWidth: "620px", margin: "18px auto 0", color: "var(--color-text-secondary)", fontSize: "1.0625rem", lineHeight: 1.6 }}>
          Every Lurexa product has a distinct role—adapting seamlessly for learners, educators, and enterprise institutions.
        </p>
      </div>

      {/* 1. Sticky Audience Tabs (matching .pricingTabs and .pricingTab / .pricingTabActive) */}
      <nav
        ref={navRef}
        role="tablist"
        aria-label="Product audiences"
        style={{
          position: "sticky",
          top: "70px",
          zIndex: 30,
          padding: "10px 0 16px",
          marginBottom: "48px",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className={styles.pricingTabs} style={{ margin: 0 }}>
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
                className={`${styles.pricingTab} ${isActive ? styles.pricingTabActive : ""}`}
                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
              >
                {section.tabLabel}
              </a>
            );
          })}
        </div>
      </nav>

      {/* Audience Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "96px" }}>
        {audienceSections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            role="region"
            aria-labelledby={`${section.id}-heading`}
            className="scroll-mt-28 lg:scroll-mt-32"
          >
            {/* Audience Section Header (Centered with .planBadge) */}
            <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 36px" }}>
              <span className={styles.planBadge} style={{ display: "inline-block", margin: "0 auto 12px" }}>
                {section.eyebrow}
              </span>
              <h3
                id={`${section.id}-heading`}
                style={{
                  fontSize: "clamp(24px, 3.2vw, 36px)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  margin: 0,
                  color: "var(--color-brand-navy)",
                  lineHeight: 1.15,
                }}
              >
                {section.heading}
              </h3>
            </div>

            {/* Flagship (60%) vs. Companion (40%) Cards matching .pricingCard / .pricingCardFeatured */}
            <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-center max-w-5xl mx-auto">
              {/* Flagship Card (Primary): 60% Width, .pricingCard + .pricingCardFeatured */}
              <article
                className={`${styles.pricingCard} ${styles.pricingCardFeatured} group relative lg:w-[60%]`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "40px 36px",
                  borderRadius: "32px",
                }}
              >
                {/* Full-card link layer */}
                <a
                  href={section.flagship.href}
                  className="absolute inset-0 z-10 rounded-[32px] focus:outline-none"
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
                      <div className="relative size-14 shrink-0 rounded-2xl bg-gradient-to-br from-white to-[#eef2ff] p-2.5 shadow-xs border border-[rgba(74,76,173,0.12)]">
                        <Image
                          src={productMarkSrc[section.flagship.productId]}
                          alt={`${section.flagship.name} logo`}
                          width={48}
                          height={48}
                          className="size-full object-contain"
                        />
                      </div>
                      <div>
                        <span className={styles.planBadgeHighlight} style={{ marginBottom: "4px", fontSize: "0.625rem", padding: "3px 10px" }}>
                          Primary Platform
                        </span>
                        <h4 style={{ fontSize: "1.625rem", fontWeight: 800, margin: 0, color: "var(--color-brand-navy)", letterSpacing: "-0.03em" }}>
                          {section.flagship.name}
                        </h4>
                      </div>
                    </div>

                    {section.flagship.badge && (
                      <span className={styles.planBadge} style={{ margin: 0 }}>
                        {section.flagship.badge}
                      </span>
                    )}
                  </div>

                  <p className={styles.planDescription} style={{ margin: "0 0 24px", fontSize: "0.9375rem", color: "var(--color-text-secondary)", lineHeight: 1.65 }}>
                    {section.flagship.description}
                  </p>
                </div>

                {/* Flagship CTA Button matching .planButtonPrimary */}
                <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(74, 76, 173, 0.08)" }}>
                  <span className={styles.planButtonPrimary} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", textDecoration: "none" }}>
                    {section.flagship.cta}
                  </span>
                </div>
              </article>

              {/* Companion Card (Secondary): 40% Width, .pricingCard */}
              <article
                className={`${styles.pricingCard} group relative lg:w-[40%]`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "40px 32px",
                  borderRadius: "32px",
                }}
              >
                {/* Full-card link layer */}
                <a
                  href={section.companion.href}
                  className="absolute inset-0 z-10 rounded-[32px] focus:outline-none"
                  aria-label={`${section.companion.name}: ${section.companion.description}`}
                />

                {/* Top Content */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className="relative size-14 shrink-0 rounded-2xl bg-[#f8fafc] p-2.5 shadow-xs border border-[rgba(74,76,173,0.08)]">
                        <Image
                          src={productMarkSrc[section.companion.productId]}
                          alt={`${section.companion.name} logo`}
                          width={48}
                          height={48}
                          className="size-full object-contain"
                        />
                      </div>
                      <div>
                        <span className={styles.planBadge} style={{ marginBottom: "4px", fontSize: "0.625rem", padding: "3px 10px" }}>
                          Specialized Engine
                        </span>
                        <h4 style={{ fontSize: "1.625rem", fontWeight: 800, margin: 0, color: "var(--color-brand-navy)", letterSpacing: "-0.03em" }}>
                          {section.companion.name}
                        </h4>
                      </div>
                    </div>

                    {section.companion.badge && (
                      <span className={styles.planBadge} style={{ margin: 0 }}>
                        {section.companion.badge}
                      </span>
                    )}
                  </div>

                  <p className={styles.planDescription} style={{ margin: "0 0 24px", fontSize: "0.9375rem", color: "var(--color-text-secondary)", lineHeight: 1.65 }}>
                    {section.companion.description}
                  </p>
                </div>

                {/* Companion CTA Button matching .planButtonSecondary */}
                <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(74, 76, 173, 0.08)" }}>
                  <span className={styles.planButtonSecondary} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", textDecoration: "none" }}>
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

      {/* 5. Institutional Closing CTA Banner matching .whyCtaBanner */}
      <section
        id="institutional-cta"
        className={styles.whyCtaBanner}
        style={{
          marginTop: "96px",
          borderRadius: "32px",
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
        }}
        aria-labelledby="institutional-closing-heading"
      >
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p className={styles.kicker} style={{ color: "#50e3c2", marginBottom: "8px" }}>
            INSTITUTIONAL DEPLOYMENT
          </p>
          <h3
            id="institutional-closing-heading"
            style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 900, letterSpacing: "-0.04em", margin: "0 0 14px", color: "#ffffff", lineHeight: 1.12 }}
          >
            Bring Lurexa to your school.
          </h3>
          <p style={{ margin: "0 auto 32px", color: "#c0cef5", fontSize: "1.0625rem", lineHeight: 1.65, maxWidth: "600px" }}>
            Deploy Admin governance, Insight analytics, and Teach modules across your district or university.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "16px" }}>
            <a
              href="mailto:contact@lurexa.org?subject=Institutional%20School%20Demo%20Request"
              onClick={(e) => {
                if (onOpenDemoModal) {
                  e.preventDefault();
                  onOpenDemoModal();
                }
              }}
              className={styles.primaryCta}
              style={{
                background: "#ffffff",
                color: "#0a1931",
                padding: "14px 28px",
                fontSize: "0.875rem",
                boxShadow: "0 10px 24px rgba(0, 0, 0, 0.15)",
                cursor: "pointer",
              }}
            >
              Book a demo
            </a>
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ecosystemPillButton}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                color: "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.25)",
                padding: "14px 28px",
                fontSize: "0.875rem",
                backdropFilter: "blur(10px)",
                cursor: "pointer",
              }}
            >
              Review system specs ↗
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
