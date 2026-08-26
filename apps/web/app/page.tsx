import { MasterMark } from "@lurexa/ui/MasterMark";
import Image from "next/image";
import {
  lurexaProducts,
  type LurexaProductId,
} from "@lurexa/config/product-registry";
import { getEcosystemUrl } from "@lurexa/config/domains";
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
const coachUrl = process.env.NEXT_PUBLIC_LUREXA_COACH_URL ?? getEcosystemUrl("learn", "/coach");
const productOrder = ["learn", "coach", "teach", "admin", "insight", "studio", "campus"] satisfies LurexaProductId[];

const productPresentation: Record<LurexaProductId, ProductPresentation> = {
  learn: { eyebrow: "Personal learning", href: learnUrl, status: "Explore Learn" },
  coach: { eyebrow: "Speaking intelligence", href: coachUrl, status: "In development" },
  teach: { eyebrow: "Professional growth", href: teachUrl, status: "Explore Teach" },
  admin: { eyebrow: "Institutional trust", href: adminUrl, status: "Explore Admin" },
  insight: { eyebrow: "Learning evidence", href: process.env.NEXT_PUBLIC_LUREXA_INSIGHT_URL ?? "#shared-intelligence", status: "In development" },
  studio: { eyebrow: "Learning creation", href: process.env.NEXT_PUBLIC_LUREXA_STUDIO_URL ?? "#shared-intelligence", status: "In development" },
  campus: { eyebrow: "Institutional deployment", href: process.env.NEXT_PUBLIC_LUREXA_CAMPUS_URL ?? "#shared-intelligence", status: "In development" },
};

const products = productOrder.map((id) => ({
  ...lurexaProducts[id],
  id,
  shortName: lurexaProducts[id].name.replace(/^Lurexa /, ""),
  ...productPresentation[id],
}));

/**
 * The homepage is intentionally self-contained: these product marks are served
 * from this Next application's public directory instead of relying on utility
 * CSS emitted by a consuming app. This keeps the identity assets visible in
 * production builds even when shared-component Tailwind classes are absent.
 */
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
  if (name === "schedule") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><rect x="7" y="10" width="34" height="33" rx="5" fill="currentColor"/><path d="M7 19h34M16 5v9m16-9v9" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/><circle cx="17" cy="28" r="3" fill="white"/><circle cx="31" cy="28" r="3" fill="white"/><circle cx="17" cy="36" r="3" fill="#12cdd4"/><circle cx="31" cy="36" r="3" fill="white"/></svg>;
  if (name === "pay") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><path d="M7 15h28a6 6 0 0 1 6 6v16H7V15Z" fill="currentColor"/><path d="M7 15 32 8v7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/><path d="M31 25h12v10H31a5 5 0 0 1 0-10Z" fill="#12cdd4"/><circle cx="35" cy="30" r="2" fill="white"/></svg>;
  if (name === "mobile") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><rect x="13" y="5" width="22" height="38" rx="5" fill="none" stroke="currentColor" strokeWidth="5"/><circle cx="24" cy="36" r="2.5" fill="#12cdd4"/></svg>;
  if (name === "pwa") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="4"/><path {...common} d="M6 24h36M24 6c-8 10-8 26 0 36M24 6c8 10 8 26 0 36"/></svg>;
  if (name === "offline") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><path {...common} d="M8 19c9-9 23-9 32 0M14 26c6-6 14-6 20 0M20 33c2-2 6-2 8 0"/><path d="M6 41 42 5" stroke="#12cdd4" strokeWidth="5"/></svg>;
  if (name === "tutor") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><rect x="10" y="16" width="28" height="22" rx="7" fill="currentColor"/><path {...common} d="M16 12V8m16 4V8M5 21v11m38-11v11"/><circle cx="19" cy="26" r="2.5" fill="white"/><circle cx="29" cy="26" r="2.5" fill="white"/><path d="M20 33h8" stroke="#12cdd4" strokeWidth="3" strokeLinecap="round"/></svg>;
  if (name === "api") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><path d="M10 14h11v20H10zM27 14h11v20H27z" fill="currentColor"/><path d="M21 24h6" stroke="#12cdd4" strokeWidth="5"/></svg>;
  if (name === "design") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><path d="m8 15 16-8 16 8-16 8-16-8Zm0 10 16 8 16-8v8l-16 8-16-8v-8Z" fill="currentColor"/><path d="m8 33 16 8 16-8" fill="none" stroke="#12cdd4" strokeWidth="4"/></svg>;
  if (name === "content") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><circle cx="10" cy="31" r="5" fill="currentColor"/><circle cx="25" cy="31" r="5" fill="currentColor"/><circle cx="39" cy="10" r="5" fill="currentColor"/><path d="m14 29 7-1m8-2 7-12" stroke="#12cdd4" strokeWidth="4"/></svg>;
  if (name === "marketing") return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><path d="m9 23 22-9v20L9 25v-2Z" fill="currentColor"/><path d="M14 27v12h6l2-10" fill="currentColor"/><path d="M35 19c4 3 4 8 0 11" fill="none" stroke="#12cdd4" strokeWidth="4" strokeLinecap="round"/></svg>;
  return <svg viewBox="0 0 48 48" className={styles.capabilityIcon} aria-hidden="true"><path d="m17 12-10 12 10 12M31 12l10 12-10 12M27 7l-6 34" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export default function Home() {
  return <main className={styles.page}>
    <nav className={styles.nav} aria-label="Lurexa ecosystem navigation">
      <a className={styles.brand} href="#top" aria-label="Lurexa home"><MasterMark compact size="sm" /><span>Lurexa</span></a>
      <div className={styles.navLinks}><a href="#products">Products</a><a href="#shared-intelligence">How it works</a><a href="#values">Values</a></div>
      <a className={styles.navCta} href={learnUrl}>Enter Lurexa Learn <span>↗</span></a>
    </nav>

    <section id="top" className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.kicker}>LUREXA LEARNING TECHNOLOGIES</p>
        <h1>Learning grows when <em>everything connects.</em></h1>
        <p className={styles.intro}>Lurexa is an intelligent learning ecosystem where each experience understands the learner, preserves meaningful progress, and makes the next step clearer.</p>
        <div className={styles.heroActions}><a className={styles.primaryCta} href="#products" aria-label="Explore Lurexa products">Explore the ecosystem <span>↓</span></a><a className={styles.textCta} href="#shared-intelligence">How Lurexa works <span>→</span></a></div>
        <p className={styles.microcopy}>One learner. One evolving model. Every experience adapts around it.</p>
      </div>
      <div className={styles.orbit} aria-label="Interactive Lurexa product map">
        <div className={styles.orbitCore}><MasterMark compact size="lg" /><span>Learn.<br/>Connect.<br/><b>Grow.</b></span></div>
        {products.map((product, index) => <a key={product.id} href={product.href} className={`${styles.orbitNode} ${styles[`node${index}`]}`} aria-label={`${product.name}: ${product.status}`}><ProductLogo product={product.id} /><span>{product.shortName}</span></a>)}
      </div>
    </section>

    <section className={styles.trustBar} aria-label="Lurexa shared architecture">
      <div><span className={styles.stepNumber}>01</span><b>Lurexa Core</b><p>Protects identity, access, and trusted learning records.</p></div>
      <span className={styles.flow}>→</span>
      <div><span className={styles.stepNumber}>02</span><b>Lurexa Mind</b><p>Interprets evidence to make learning intelligence useful.</p></div>
      <span className={styles.flow}>→</span>
      <div><span className={styles.stepNumber}>03</span><b>Focused products</b><p>Give each person the experience they actually need.</p></div>
    </section>

    <section id="products" className={styles.products}>
      <div className={styles.sectionHeading}><p className={styles.kicker}>THE PRODUCT FAMILY</p><h2>Distinct experiences.<br/><em>One intelligent relationship.</em></h2><p>Every product has its own role, visual signature, and purpose—while contributing to the same evolving learner model.</p></div>
      <div className={styles.productGrid}>{products.map((product, index) => <a key={product.id} href={product.href} className={`${styles.productCard} ${styles[`product${index}`]}`}><div className={styles.productTop}><span className={styles.iconTile}><ProductLogo product={product.id} /></span><span className={styles.cardArrow}>↗</span></div><p>{product.eyebrow}</p><h3>Lurexa <strong>{product.shortName}</strong></h3><span className={styles.cardLine}/><div className={styles.cardBottom}><span>{product.description}</span><b>{product.status}</b></div></a>)}</div>
    </section>

    <section className={styles.capabilities} aria-labelledby="capabilities-heading">
      <div className={styles.capabilitiesHeading}><p className={styles.kicker}>THE WIDER ECOSYSTEM</p><h2 id="capabilities-heading">Every capability speaks <em>the same visual language.</em></h2><p>These shared capabilities are being shaped as part of Lurexa’s ecosystem foundation. They are not separate promises; they make the product family more useful together.</p></div>
      <div className={styles.capabilityGrid}>{capabilities.map((capability) => <div className={styles.capability} key={capability.name}><CapabilityIcon name={capability.icon}/><span>{capability.name}</span><i>Planned</i></div>)}</div>
    </section>

    <section id="shared-intelligence" className={styles.intelligence}>
      <div className={styles.intelligenceVisual}><div className={styles.signalOne}/><div className={styles.signalTwo}/><div className={styles.signalThree}/><div className={styles.intelligenceCore}><MasterMark compact size="lg" /><span>ONE<br/>LEARNER</span></div></div>
      <div className={styles.intelligenceCopy}><p className={styles.kicker}>SHARED INTELLIGENCE, HUMANLY USED</p><h2>Progress should not reset when the experience changes.</h2><p>Learners can move between Learn and Coach without starting over because authorized context can travel through the shared Core/Mind foundation. Educators use that same trusted foundation in Teach for professional growth, evidence, credentials, and community—while classroom operations remain in Learn.</p><div className={styles.principles}><span>Trusted by Core</span><span>Interpreted by Mind</span><span>Experienced through products</span></div></div>
    </section>

    <section id="values" className={styles.values}><div className={styles.valueIntro}><p className={styles.kicker}>WHAT GUIDES US</p><h2>Technology should make education feel more personal, not less.</h2></div><div className={styles.valueList}><article><span>♡</span><h3>Learner first</h3><p>We design around real goals, confidence, and dignity.</p></article><article><span>✦</span><h3>Connected by design</h3><p>Useful context moves with people across their learning life.</p></article><article><span>✓</span><h3>Trust is essential</h3><p>Safety, clarity, and responsible data use are not optional.</p></article><article><span>↗</span><h3>Growth with impact</h3><p>We measure progress by what learners can meaningfully do.</p></article></div></section>

    <footer className={styles.footer}><div className={styles.footerBrand}><MasterMark compact size="sm" /><b>Lurexa</b></div><p>Learn. Connect. Grow.</p><a href="#top">Back to top ↑</a><span>© 2026 Lurexa Learning Technologies</span></footer>
  </main>;
}
