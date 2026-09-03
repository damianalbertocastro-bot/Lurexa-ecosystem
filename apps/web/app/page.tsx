"use client";

import React, { useState } from "react";
import { MasterMark } from "@lurexa/ui/MasterMark";
import Image from "next/image";
import {
  lurexaProducts,
  type LurexaProductId,
} from "@lurexa/config/product-registry";
import { getEcosystemUrl } from "@lurexa/config/domains";
import { ProductShowcase } from "./components/ProductShowcase";
import { DemoModal } from "./components/DemoModal";
import styles from "./page.module.css";

type CapabilityName = "connect" | "cloud" | "secure" | "assess" | "schedule" | "pay" | "mobile" | "pwa" | "offline" | "tutor" | "api" | "design" | "content" | "marketing" | "developer";

type ProductPresentation = {
  eyebrow: string;
  href: string;
  status: string;
};

const learnUrl = getEcosystemUrl("learn");
const teachUrl = getEcosystemUrl("teach");
const adminUrl = getEcosystemUrl("admin");
const coachUrl = process.env.NEXT_PUBLIC_LUREXA_COACH_URL ?? getEcosystemUrl("coach");
const productOrder = ["learn", "coach", "teach", "admin", "insight", "studio", "campus"] satisfies LurexaProductId[];

const productPresentation: Record<LurexaProductId, ProductPresentation> = {
  learn: { eyebrow: "Personal learning", href: learnUrl, status: "Live • A1–B1 Production" },
  coach: { eyebrow: "Speaking intelligence", href: coachUrl, status: "Live • Dominican English AI" },
  teach: { eyebrow: "Professional growth", href: teachUrl, status: "Live • Educator Platform" },
  admin: { eyebrow: "Institutional trust", href: adminUrl, status: "Live • Trust & Gov" },
  insight: { eyebrow: "Learning evidence", href: process.env.NEXT_PUBLIC_LUREXA_INSIGHT_URL ?? getEcosystemUrl("insight"), status: "Public Preview" },
  studio: { eyebrow: "Learning creation", href: process.env.NEXT_PUBLIC_LUREXA_STUDIO_URL ?? getEcosystemUrl("studio"), status: "Public Preview" },
  campus: { eyebrow: "Institutional deployment", href: process.env.NEXT_PUBLIC_LUREXA_CAMPUS_URL ?? "#pricing", status: "Institutional Pilot" },
};

const products = productOrder.map((id) => ({
  ...lurexaProducts[id],
  id,
  shortName: lurexaProducts[id].name.replace(/^Lurexa /, ""),
  ...productPresentation[id],
}));

const productMarkSrc: Record<LurexaProductId, string> = {
  learn: "/brand/lurexa-learn.svg",
  coach: "/brand/lurexa-coach.svg",
  teach: "/brand/lurexa-teach.svg",
  admin: "/brand/lurexa-admin.svg",
  insight: "/brand/lurexa-insight.svg",
  studio: "/brand/lurexa-studio.svg",
  campus: "/brand/lurexa-campus.svg",
};

function ProductLogo({ product }: { product: LurexaProductId }) {
  return <Image src={productMarkSrc[product]} width={80} height={80} style={{ display: "block", width: "48px", height: "48px", maxWidth: "100%", objectFit: "contain" }} alt={`Lurexa ${products.find((item) => item.id === product)?.shortName ?? product} logo`} />;
}

const capabilities: Array<{ name: string; icon: CapabilityName }> = [
  { name: "Connect", icon: "connect" }, { name: "Cloud", icon: "cloud" }, { name: "Secure", icon: "secure" },
  { name: "Assess", icon: "assess" }, { name: "Schedule", icon: "schedule" }, { name: "Pay", icon: "pay" },
  { name: "Mobile", icon: "mobile" }, { name: "PWA", icon: "pwa" }, { name: "Offline", icon: "offline" },
  { name: "AI Tutor", icon: "tutor" }, { name: "API", icon: "api" }, { name: "Design System", icon: "design" },
  { name: "Content", icon: "content" }, { name: "Marketing", icon: "marketing" }, { name: "Developer", icon: "developer" },
];

function CapabilityIcon({ name }: { name: CapabilityName }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "connect") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><circle cx="18" cy="17" r="8" fill="currentColor"/><circle cx="31" cy="16" r="9" fill="currentColor" opacity=".78"/><path d="M6 39c1-10 22-12 25-2M21 39c2-9 18-11 23 0" fill="currentColor"/></svg>;
  if (name === "cloud") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><path d="M10 37h28a9 9 0 0 0 0-18 13 13 0 0 0-25 3A8 8 0 0 0 10 37Z" fill="currentColor"/></svg>;
  if (name === "secure") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><path d="M24 5 40 11v11c0 10-7 17-16 21-9-4-16-11-16-21V11l16-6Z" fill="currentColor"/><path d="m16 24 5 5 11-12" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === "assess") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><rect x="10" y="9" width="28" height="34" rx="5" fill="currentColor"/><path d="M17 19h4m4 0h7M17 28h4m4 0h7M17 36h4m4 0h7" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>;
  if (name === "schedule") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><rect x="7" y="10" width="34" height="33" rx="5" fill="currentColor"/><path d="M7 19h34M16 5v9m16-9v9" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/><circle cx="17" cy="28" r="3" fill="white"/><circle cx="31" cy="28" r="3" fill="white"/><circle cx="17" cy="36" r="3" fill="var(--lx-accent)"/><circle cx="31" cy="36" r="3" fill="white"/></svg>;
  if (name === "pay") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><path d="M7 15h28a6 6 0 0 1 6 6v16H7V15Z" fill="currentColor"/><path d="M7 15 32 8v7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/><path d="M31 25h12v10H31a5 5 0 0 1 0-10Z" fill="var(--lx-accent)"/><circle cx="35" cy="30" r="2" fill="white"/></svg>;
  if (name === "mobile") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><rect x="13" y="5" width="22" height="38" rx="5" fill="none" stroke="currentColor" strokeWidth="5"/><circle cx="24" cy="36" r="2.5" fill="var(--lx-accent)"/></svg>;
  if (name === "pwa") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="4"/><path {...common} d="M6 24h36M24 6c-8 10-8 26 0 36M24 6c8 10 8 26 0 36"/></svg>;
  if (name === "offline") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><path {...common} d="M8 19c9-9 23-9 32 0M14 26c6-6 14-6 20 0M20 33c2-2 6-2 8 0"/><path d="M6 41 42 5" stroke="var(--lx-accent)" strokeWidth="5"/></svg>;
  if (name === "tutor") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><rect x="10" y="16" width="28" height="22" rx="7" fill="currentColor"/><path {...common} d="M16 12V8m16 4V8M5 21v11m38-11v11"/><circle cx="19" cy="26" r="2.5" fill="white"/><circle cx="29" cy="26" r="2.5" fill="white"/><path d="M20 33h8" stroke="var(--lx-accent)" strokeWidth="3" strokeLinecap="round"/></svg>;
  if (name === "api") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><path d="M10 14h11v20H10zM27 14h11v20H27z" fill="currentColor"/><path d="M21 24h6" stroke="var(--lx-accent)" strokeWidth="5"/></svg>;
  if (name === "design") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><path d="m8 15 16-8 16 8-16 8-16-8Zm0 10 16 8 16-8v8l-16 8-16-8v-8Z" fill="currentColor"/><path d="m8 33 16 8 16-8" fill="none" stroke="var(--lx-accent)" strokeWidth="4"/></svg>;
  if (name === "content") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><circle cx="10" cy="31" r="5" fill="currentColor"/><circle cx="25" cy="31" r="5" fill="currentColor"/><circle cx="39" cy="10" r="5" fill="currentColor"/><path d="m14 29 7-1m8-2 7-12" stroke="var(--lx-accent)" strokeWidth="4"/></svg>;
  if (name === "marketing") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><path d="m9 23 22-9v20L9 25v-2Z" fill="currentColor"/><path d="M14 27v12h6l2-10" fill="currentColor"/><path d="M35 19c4 3 4 8 0 11" fill="none" stroke="var(--lx-accent)" strokeWidth="4" strokeLinecap="round"/></svg>;
  return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><path d="m17 12-10 12 10 12M31 12l10 12-10 12M27 7l-6 34" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export default function Home() {
  const [pricingTab, setPricingTab] = useState<"individual" | "institutional">("individual");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("products");
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion((curr) => (curr === key ? null : key));
  };

  return (
    <main className={styles.page}>
      {/* Sticky Top Ecosystem Navbar */}
      <header className={styles.navWrapper}>
        <nav className={styles.nav} aria-label="Lurexa ecosystem navigation">
          <div className={styles.brandWrapper}>
            <a className={styles.brand} href="#top" onClick={scrollToTop} aria-label="Lurexa home - Scroll to top">
              <MasterMark compact size="sm" />
              <span>Lurexa</span>
            </a>
          </div>

          <div className={styles.navLinks}>
            <a href="#why-lurexa">Why Lurexa</a>
            <a href="#learners">Learners</a>
            <a href="#educators">Educators</a>
            <a href="#institutions">Institutions</a>
            <a href="#pricing">Pricing</a>
            <a href="#shared-intelligence">Architecture</a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <button
              type="button"
              className={styles.menuToggle}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Navigation Sidebar"
            >
              ☰
            </button>
            <button
              type="button"
              className={styles.ecosystemPillButton}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Ecosystem Accordion Menu"
            >
              <span>🌐</span>
              <span>Ecosystem</span>
              <span>▾</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoModalOpen(true)}
              className="hidden sm:inline-flex items-center justify-center rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs"
            >
              Book a demo
            </button>
            <a
              className="inline-flex items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-xs"
              href={learnUrl}
            >
              Start learning
            </a>
          </div>
        </nav>
      </header>

      {/* Responsive Slide-out Sidebar Accordion */}
      {sidebarOpen && (
        <div className={styles.sidebarBackdrop} onClick={() => setSidebarOpen(false)}>
          <aside
            className={styles.sidebarDrawer}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Ecosystem Menu"
          >
            <div className={styles.sidebarHeader}>
              <a className={styles.brand} href="#top" onClick={(e) => { scrollToTop(e); setSidebarOpen(false); }}>
                <MasterMark compact size="sm" />
                <span>Lurexa</span>
              </a>
              <button
                type="button"
                className={styles.sidebarClose}
                onClick={() => setSidebarOpen(false)}
                aria-label="Close Sidebar"
              >
                ✕
              </button>
            </div>

            <div className={styles.accordionContainer}>
              {/* Accordion Item: Products */}
              <div className={styles.accordionItem}>
                <button
                  type="button"
                  className={styles.accordionTrigger}
                  onClick={() => toggleAccordion("products")}
                >
                  <span>🚀 Products & Ecosystem</span>
                  <span>{openAccordion === "products" ? "−" : "+"}</span>
                </button>
                {openAccordion === "products" && (
                  <div className={styles.accordionContent}>
                    {products.map((p) => (
                      <a key={p.id} href={p.href} className={styles.accordionLink} onClick={() => setSidebarOpen(false)}>
                        <span className={styles.linkTitle}>{p.name}</span>
                        <span className={styles.linkBadge}>{p.status}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion Item: Platform Sections */}
              <div className={styles.accordionItem}>
                <button
                  type="button"
                  className={styles.accordionTrigger}
                  onClick={() => toggleAccordion("explore")}
                >
                  <span>🧭 Navigation & Pillars</span>
                  <span>{openAccordion === "explore" ? "−" : "+"}</span>
                </button>
                {openAccordion === "explore" && (
                  <div className={styles.accordionContent}>
                    <a href="#learners" className={styles.accordionLink} onClick={() => setSidebarOpen(false)}>
                      🎯 For Learners (#learners)
                    </a>
                    <a href="#educators" className={styles.accordionLink} onClick={() => setSidebarOpen(false)}>
                      👩‍🏫 For Educators (#educators)
                    </a>
                    <a href="#institutions" className={styles.accordionLink} onClick={() => setSidebarOpen(false)}>
                      🏛️ For Institutions (#institutions)
                    </a>
                    <a href="#why-lurexa" className={styles.accordionLink} onClick={() => setSidebarOpen(false)}>
                      Why Lurexa (Comparative Overview)
                    </a>
                    <a href="#pricing" className={styles.accordionLink} onClick={() => setSidebarOpen(false)}>
                      Pricing &amp; Plans
                    </a>
                    <a href="#shared-intelligence" className={styles.accordionLink} onClick={() => setSidebarOpen(false)}>
                      How Core &amp; Mind Work
                    </a>
                    <a href="#about" className={styles.accordionLink} onClick={() => setSidebarOpen(false)}>
                      About Lurexa Technologies
                    </a>
                    <a href="#contact" className={styles.accordionLink} onClick={() => setSidebarOpen(false)}>
                      Contact &amp; Institutional Inquiries
                    </a>
                  </div>
                )}
              </div>

              {/* Accordion Item: Pricing Plans */}
              <div className={styles.accordionItem}>
                <button
                  type="button"
                  className={styles.accordionTrigger}
                  onClick={() => toggleAccordion("pricing")}
                >
                  <span>💳 Plans &amp; Memberships</span>
                  <span>{openAccordion === "pricing" ? "−" : "+"}</span>
                </button>
                {openAccordion === "pricing" && (
                  <div className={styles.accordionContent}>
                    <a href="#pricing" className={styles.accordionLink} onClick={() => { setPricingTab("individual"); setSidebarOpen(false); }}>
                      👤 For Individual Learners
                    </a>
                    <a href="#pricing" className={styles.accordionLink} onClick={() => { setPricingTab("institutional"); setSidebarOpen(false); }}>
                      🏢 For Companies &amp; Institutions
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.sidebarFooter}>
              <a className={styles.primaryCta} href={learnUrl} style={{ width: "100%", justifyContent: "center" }}>
                Launch Learning Workspace ↗
              </a>
            </div>
          </aside>
        </div>
      )}

      {/* Hero Section */}
      <section id="top" className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>LUREXA LEARNING TECHNOLOGIES</p>
          <h1>Learning grows when <em>everything connects.</em></h1>
          <p className={styles.intro}>
            Lurexa is an intelligent English learning ecosystem where each product understands the learner, preserves persistent pedagogical evidence, and accelerates conversational fluency.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryCta} href="#why-lurexa" aria-label="Why Lurexa">
              Why Lurexa <span>↓</span>
            </a>
            <a className={styles.textCta} href="#pricing">
              View Plans &amp; Pricing <span>→</span>
            </a>
          </div>
          <p className={styles.microcopy}>One learner. One evolving model. Every experience adapts around it.</p>
        </div>
        <div className={styles.orbit} aria-label="Interactive Lurexa product map">
          <div className={styles.orbitCore}>
            <MasterMark compact size="lg" />
            <span>Learn.<br/>Connect.<br/><b>Grow.</b></span>
          </div>
          {products.map((product, index) => (
            <a
              key={product.id}
              href={product.href}
              className={`${styles.orbitNode} ${styles[`node${index}`]}`}
              aria-label={`${product.name}: ${product.status}`}
            >
              <ProductLogo product={product.id} />
              <span>{product.shortName}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Trust & Architecture Bar */}
      <section id="shared-intelligence" className={styles.trustBar} aria-label="Lurexa shared architecture">
        <div>
          <span className={styles.stepNumber}>01</span>
          <b>Lurexa Core</b>
          <p>Protects identity, access, and trusted persistent learner records.</p>
        </div>
        <span className={styles.flow}>→</span>
        <div>
          <span className={styles.stepNumber}>02</span>
          <b>Lurexa Mind</b>
          <p>Interprets authorized speech, quizzes, and CEFR progression.</p>
        </div>
        <span className={styles.flow}>→</span>
        <div>
          <span className={styles.stepNumber}>03</span>
          <b>Focused Products</b>
          <p>Deliver tailored experiences for learners, coaches, and educators.</p>
        </div>
      </section>

      {/* Why Lurexa Section */}
      <section id="why-lurexa" className={styles.whySection} aria-labelledby="why-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>THE LUREXA ADVANTAGE</p>
          <h2 id="why-heading">Why Lurexa is <em>different from the rest.</em></h2>
          <p>
            Generic language apps rely on isolated flashcards and superficial gamification. Lurexa unites contrastive linguistics, authentic speech intelligence, and teacher synergy into one unified ecosystem.
          </p>
        </div>

        <div className={styles.whyGrid}>
          <article className={styles.whyCard}>
            <div className={styles.whyIcon}>🇩🇴 🎙️</div>
            <h3>Dominican Spanish Linguistic Transfer</h3>
            <p>
              Unlike one-size-fits-all tools, Coach integrates deep contrastive phonology tailored for Dominican Spanish speakers—addressing /s/ aspiration, consonant codas, and vowel durations without accent erasure.
            </p>
          </article>

          <article className={styles.whyCard}>
            <div className={styles.whyIcon}>🧠 ⚡</div>
            <h3>Continuous Single Learner Model</h3>
            <p>
              Your lessons in Learn, oral drills in Coach, and teacher evaluations in Teach feed into a single persistent learner model in Core. Learning never starts over.
            </p>
          </article>

          <article className={styles.whyCard}>
            <div className={styles.whyIcon}>👩‍🏫 📈</div>
            <h3>Teacher-Empowering Synergy</h3>
            <p>
              Lurexa doesn&apos;t replace teachers—it amplifies them. Lurexa Teach equips educators with verifiable CEFR micro-credentials, classroom mastery diagnostics, and collaborative cohorts.
            </p>
          </article>

          <article className={styles.whyCard}>
            <div className={styles.whyIcon}>🛡️ 🏛️</div>
            <h3>Institutional Trust &amp; Governance</h3>
            <p>
              Lurexa Core enforces strict trust boundaries. Student evidence, AI interpretations, and institutional metrics are governed with verifiable audit trails and enterprise security.
            </p>
          </article>
        </div>

        <div className={styles.whyCtaBanner}>
          <div>
            <h3>Ready to accelerate your fluency or transform your classroom?</h3>
            <p>Explore our flexible plans designed for individual learners, educators, and enterprise institutions.</p>
          </div>
          <a className={styles.primaryCta} href="#pricing">
            Know More About Our Plans &amp; Products <span>→</span>
          </a>
        </div>
      </section>

      {/* Products Showcase & Sticky Audience Anchor Navigation */}
      <ProductShowcase onOpenDemoModal={() => setDemoModalOpen(true)} />

      {/* Pricing Section (Individuals vs Companies & Institutions) */}
      <section id="pricing" className={styles.pricingSection} aria-labelledby="pricing-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>TRANSPARENT &amp; ACCESSIBLE</p>
          <h2 id="pricing-heading">Choose the plan that <em>fits your goals.</em></h2>
          <p>Whether you are learning individually or deploying Lurexa across your entire school or company.</p>
        </div>

        {/* Pricing Segment Selector */}
        <div className={styles.pricingTabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={pricingTab === "individual"}
            className={`${styles.pricingTab} ${pricingTab === "individual" ? styles.pricingTabActive : ""}`}
            onClick={() => setPricingTab("individual")}
          >
            👤 For Individual Learners
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={pricingTab === "institutional"}
            className={`${styles.pricingTab} ${pricingTab === "institutional" ? styles.pricingTabActive : ""}`}
            onClick={() => setPricingTab("institutional")}
          >
            🏢 For Companies, Institutions &amp; Businesses
          </button>
        </div>

        {pricingTab === "individual" ? (
          <div className={styles.pricingGrid}>
            {/* Free Starter */}
            <article className={styles.pricingCard}>
              <span className={styles.planBadge}>Starter</span>
              <h3>Free Forever</h3>
              <p className={styles.planPrice}>$0<span>/mo</span></p>
              <p className={styles.planDescription}>Core foundational lessons and placement for individual learners.</p>
              <ul className={styles.planFeatures}>
                <li>✓ English A1 Foundation modules</li>
                <li>✓ Adaptive placement diagnostic</li>
                <li>✓ Spaced-retrieval review checks</li>
                <li>✓ Basic Coach speaking studio (5 mins/day)</li>
              </ul>
              <a className={styles.planButtonSecondary} href={learnUrl}>
                Get Started Free →
              </a>
            </article>

            {/* Fluency Pro */}
            <article className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
              <span className={styles.planBadgeHighlight}>Most Popular</span>
              <h3>Fluency Pro</h3>
              <p className={styles.planPrice}>$14.99<span>/mo</span></p>
              <p className={styles.planDescription}>Full access to interactive lessons, unlimited speaking AI, and Dominican contrastive phonetics.</p>
              <ul className={styles.planFeatures}>
                <li>✓ Complete A1–B2 curriculum pathways</li>
                <li>✓ Unlimited Coach voice turns &amp; waveform feedback</li>
                <li>✓ Contrastive Dominican Spanish acoustic remediation</li>
                <li>✓ Continuous Learner Model progress tracking</li>
                <li>✓ Spoken minimal pair drills &amp; phoneme map</li>
              </ul>
              <a className={styles.planButtonPrimary} href={learnUrl}>
                Start 7-Day Free Trial →
              </a>
            </article>

            {/* Dual Master */}
            <article className={styles.pricingCard}>
              <span className={styles.planBadge}>All Access</span>
              <h3>Dual Master</h3>
              <p className={styles.planPrice}>$24.99<span>/mo</span></p>
              <p className={styles.planDescription}>For ambitious professionals and educators pursuing certified fluency and teaching credentials.</p>
              <ul className={styles.planFeatures}>
                <li>✓ Everything in Fluency Pro</li>
                <li>✓ Full Lurexa Teach professional certification</li>
                <li>✓ CEFR C1–C2 advanced business modules</li>
                <li>✓ Verifiable micro-credentials &amp; certificates</li>
                <li>✓ Priority access to Lurexa Studio content</li>
              </ul>
              <a className={styles.planButtonSecondary} href={teachUrl}>
                Join Dual Master →
              </a>
            </article>
          </div>
        ) : (
          <div className={styles.pricingGrid}>
            {/* Classroom Cohort */}
            <article className={styles.pricingCard}>
              <span className={styles.planBadge}>Classroom</span>
              <h3>Educator Cohort</h3>
              <p className={styles.planPrice}>$49<span>/mo</span></p>
              <p className={styles.planDescription}>For individual teachers and language tutors managing up to 35 students.</p>
              <ul className={styles.planFeatures}>
                <li>✓ Up to 35 student licenses in Learn</li>
                <li>✓ Teacher dashboard &amp; assignment dispatch</li>
                <li>✓ Class-wide phonetics &amp; quiz diagnostics</li>
                <li>✓ Automated homework grading &amp; attendance</li>
              </ul>
              <a className={styles.planButtonSecondary} href="mailto:contact@lurexa.org?subject=Educator%20Cohort">
                Request Classroom Pilot →
              </a>
            </article>

            {/* Campus Pilot */}
            <article className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
              <span className={styles.planBadgeHighlight}>Institutional Pilot</span>
              <h3>Campus &amp; University</h3>
              <p className={styles.planPrice}>Custom<span>/campus</span></p>
              <p className={styles.planDescription}>For universities, bilingual schools, and ministry educational initiatives.</p>
              <ul className={styles.planFeatures}>
                <li>✓ Unlimited students, faculty, and departments</li>
                <li>✓ Lurexa Admin institutional governance &amp; analytics</li>
                <li>✓ LMS integration (Canvas, Google Classroom, Moodle)</li>
                <li>✓ Custom Dominican &amp; regional dialect modules</li>
                <li>✓ Dedicated pedagogical onboarding &amp; SLA</li>
              </ul>
              <a className={styles.planButtonPrimary} href="mailto:contact@lurexa.org?subject=Institutional%20Campus%20Inquiry">
                Book Campus Consultation →
              </a>
            </article>

            {/* Enterprise Business */}
            <article className={styles.pricingCard}>
              <span className={styles.planBadge}>Enterprise</span>
              <h3>Corporate Fluency</h3>
              <p className={styles.planPrice}>Custom<span>/seat</span></p>
              <p className={styles.planDescription}>For BPOs, tech companies, and multinational teams scaling English communication.</p>
              <ul className={styles.planFeatures}>
                <li>✓ Tailored BPO &amp; software engineering voice packs</li>
                <li>✓ Corporate benchmark CEFR testing &amp; certification</li>
                <li>✓ Single Sign-On (SSO / SAML / Okta)</li>
                <li>✓ Real-time employee progress dashboard in Admin</li>
              </ul>
              <a className={styles.planButtonSecondary} href="mailto:contact@lurexa.org?subject=Enterprise%20Fluency%20Inquiry">
                Contact Enterprise Sales →
              </a>
            </article>
          </div>
        )}
      </section>

      {/* Capabilities */}
      <section className={styles.capabilities} aria-labelledby="capabilities-heading">
        <div className={styles.capabilitiesHeading}>
          <p className={styles.kicker}>THE WIDER ECOSYSTEM</p>
          <h2 id="capabilities-heading">Every capability speaks <em>the same visual language.</em></h2>
          <p>These shared capabilities are part of Lurexa’s unified design system and backend architecture.</p>
        </div>
        <div className={styles.capabilityGrid}>
          {capabilities.map((capability) => (
            <div className={styles.capability} key={capability.name}>
              <CapabilityIcon name={capability.icon}/>
              <span>{capability.name}</span>
              <i>Active</i>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.aboutSection} aria-labelledby="about-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>ABOUT LUREXA</p>
          <h2 id="about-heading">Empowering learners and educators with <em>cohesive AI.</em></h2>
          <p>Lurexa Learning Technologies builds pedagogical systems designed for real human fluency, professional educator growth, and verifiable credentials—grounded in cognitive science and contrastive linguistics.</p>
        </div>
        <div className={styles.aboutGrid}>
          <article className={styles.aboutCard}>
            <span className={styles.aboutNumber}>01</span>
            <h3>One Learner Model</h3>
            <p>Every lesson, spoken turn, quiz, and teacher observation updates a single persistent learner model in Core, ensuring learning never starts from zero.</p>
          </article>
          <article className={styles.aboutCard}>
            <span className={styles.aboutNumber}>02</span>
            <h3>Pedagogy First</h3>
            <p>We prioritize communicative intelligibility, targeted phonetics remediation, and active retrieval practice over superficial gamification.</p>
          </article>
          <article className={styles.aboutCard}>
            <span className={styles.aboutNumber}>03</span>
            <h3>Educator Empowerment</h3>
            <p>Through Lurexa Teach, educators receive dedicated CEFR progression, micro-credentials, and classroom insights to amplify their teaching impact.</p>
          </article>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.contactSection} aria-labelledby="contact-heading">
        <div className={styles.contactContainer}>
          <div>
            <p className={styles.kickerLight}>CONNECT WITH US</p>
            <h2 id="contact-heading">Partner with Lurexa for your <em>institution or classroom.</em></h2>
            <p className={styles.contactIntro}>Whether you are an educator, institutional leader, or enterprise partner, we would love to connect and discuss how Lurexa can support your language learning goals.</p>
          </div>
          <div className={styles.contactActions}>
            <a className={styles.contactPrimaryCta} href="mailto:contact@lurexa.org">Email Our Team <span>✉</span></a>
            <a className={styles.contactSecondaryCta} href={getEcosystemUrl("docs")}>Explore Documentation <span>↗</span></a>
          </div>
        </div>
      </section>

      {/* Footer with Back to Top */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <a href="#top" onClick={scrollToTop} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <MasterMark compact size="sm" />
            <span>Lurexa</span>
          </a>
        </div>
        <p>© {new Date().getFullYear()} Lurexa Learning Technologies. All rights reserved.</p>
        <div>
          <a href="#why-lurexa">Why Lurexa</a> · <a href="#pricing">Pricing</a> · <a href="#about">About</a> · <a href="#contact">Contact</a> · <a href={getEcosystemUrl("docs")}>Docs</a>
        </div>
      </footer>

      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </main>
  );
}
