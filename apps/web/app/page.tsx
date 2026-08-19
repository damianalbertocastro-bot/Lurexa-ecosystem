import styles from "./page.module.css";

type IconName = "learn" | "coach" | "teach" | "admin" | "insight" | "studio";
type CapabilityName = "connect" | "cloud" | "secure" | "assess" | "schedule" | "pay" | "mobile" | "pwa" | "offline" | "tutor" | "api" | "design" | "content" | "marketing" | "developer";

const learnUrl = process.env.NEXT_PUBLIC_LUREXA_LEARN_URL ?? "https://learn.lurexa.com";

const products: Array<{ name: string; eyebrow: string; description: string; icon: IconName; href: string; status: string }> = [
  { name: "Learn", eyebrow: "Personal learning", description: "A guided English path that turns practice into confidence for real life.", icon: "learn", href: learnUrl, status: "Explore Learn" },
  { name: "Coach", eyebrow: "Speaking intelligence", description: "Focused pronunciation, fluency, and conversation practice that remembers the learner.", icon: "coach", href: "#shared-intelligence", status: "In development" },
  { name: "Teach", eyebrow: "Human teaching", description: "Better timing, clearer learner signals, and space for teachers to do the work only people can do.", icon: "teach", href: "#shared-intelligence", status: "In development" },
  { name: "Admin", eyebrow: "Institutional trust", description: "Safe access, governance, and a reliable foundation for institutions that need to scale.", icon: "admin", href: "#shared-intelligence", status: "In development" },
  { name: "Insight", eyebrow: "Learning evidence", description: "Turns progress, patterns, and needs into useful decisions—not another dashboard of noise.", icon: "insight", href: "#shared-intelligence", status: "In development" },
  { name: "Studio", eyebrow: "Learning creation", description: "A workspace for building and publishing meaningful learning experiences across Lurexa.", icon: "studio", href: "#shared-intelligence", status: "In development" },
];

const capabilities: Array<{ name: string; icon: CapabilityName }> = [
  { name: "Connect", icon: "connect" }, { name: "Cloud", icon: "cloud" }, { name: "Secure", icon: "secure" },
  { name: "Assess", icon: "assess" }, { name: "Schedule", icon: "schedule" }, { name: "Pay", icon: "pay" },
  { name: "Mobile", icon: "mobile" }, { name: "PWA", icon: "pwa" }, { name: "Offline", icon: "offline" },
  { name: "AI Tutor", icon: "tutor" }, { name: "API", icon: "api" }, { name: "Design System", icon: "design" },
  { name: "Content", icon: "content" }, { name: "Marketing", icon: "marketing" }, { name: "Developer", icon: "developer" },
];

function MasterMark({ small = false }: { small?: boolean }) {
  return <svg className={small ? styles.masterMarkSmall : styles.masterMark} viewBox="0 0 80 80" aria-hidden="true">
    <path d="M39 38C26 38 13 31 10 15c-1-5 4-9 9-7 14 4 22 15 22 30Z" fill="currentColor" opacity=".95" />
    <path d="M41 38c0-15 8-26 22-30 5-2 10 2 9 7-3 16-16 23-30 23Z" fill="currentColor" opacity=".72" />
    <path d="M39 42c-15 0-27 8-30 23-1 5 4 9 9 7 14-4 22-15 22-30Z" fill="currentColor" opacity=".82" />
    <path d="M41 42c0 15 8 26 22 30 5 2 10-2 9-7-3-15-15-23-30-23Z" fill="#12cdd4" />
    <circle cx="40" cy="40" r="5" fill="white" />
  </svg>;
}

function ProductIcon({ name }: { name: IconName }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "learn") return <svg viewBox="0 0 64 64" className={styles.productIcon} aria-hidden="true"><path d="M7 33 31 9l11 11L29 33 43 47 32 58 7 33Z" fill="currentColor"/><path d="m31 9 11-6v17L31 9Z" fill="#2160df"/><path d="M43 20 57 6v47H43V20Z" fill="currentColor"/></svg>;
  if (name === "coach") return <svg viewBox="0 0 64 64" className={styles.productIcon} aria-hidden="true"><rect x="15" y="21" width="34" height="27" rx="7" fill="currentColor"/><path {...common} d="M22 17v-5m20 5v-5M9 28v12m46-12v12"/><circle cx="25" cy="34" r="3" fill="white"/><circle cx="39" cy="34" r="3" fill="white"/><path d="M29 42h7" stroke="#12cdd4" strokeWidth="3" strokeLinecap="round"/></svg>;
  if (name === "teach") return <svg viewBox="0 0 64 64" className={styles.productIcon} aria-hidden="true"><path d="M7 23h50l-9-11H16L7 23Z" fill="currentColor"/><path d="M15 25h34v7H15z" fill="currentColor"/><path d="M30 32v15" stroke="currentColor" strokeWidth="4"/><circle cx="30" cy="51" r="3" fill="#12cdd4"/></svg>;
  if (name === "admin") return <svg viewBox="0 0 64 64" className={styles.productIcon} aria-hidden="true"><path d="m7 23 25-15 25 15H7Z" fill="currentColor"/><path d="M13 28h7v21h-7zm15 0h8v21h-8zm16 0h7v21h-7z" fill="currentColor"/><path d="M9 52h46v5H9z" fill="#12cdd4"/></svg>;
  if (name === "insight") return <svg viewBox="0 0 64 64" className={styles.productIcon} aria-hidden="true"><rect x="8" y="37" width="10" height="17" rx="5" fill="currentColor" opacity=".6"/><rect x="27" y="23" width="10" height="31" rx="5" fill="currentColor"/><rect x="46" y="10" width="10" height="44" rx="5" fill="#16c9d1"/></svg>;
  return <svg viewBox="0 0 64 64" className={styles.productIcon} aria-hidden="true"><path d="m20 8 22 2 13 20-13 25-24-1L7 32 20 8Z" fill="currentColor"/><path d="m21 31 9 9 17-17" fill="none" stroke="#12cdd4" strokeWidth="7" strokeLinecap="square"/></svg>;
}

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
    <nav className={styles.nav}>
      <a className={styles.brand} href="#top" aria-label="Lurexa home"><MasterMark small /><span>Lurexa</span></a>
      <div className={styles.navLinks}><a href="#products">Products</a><a href="#shared-intelligence">How it works</a><a href="#values">Values</a></div>
      <a className={styles.navCta} href={learnUrl}>Enter Lurexa Learn <span>↗</span></a>
    </nav>

    <section id="top" className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.kicker}>LUREXA LEARNING TECHNOLOGIES</p>
        <h1>Learning grows when <em>everything connects.</em></h1>
        <p className={styles.intro}>Lurexa is an intelligent learning ecosystem where each experience understands the learner, preserves meaningful progress, and makes the next step clearer.</p>
        <div className={styles.heroActions}><a className={styles.primaryCta} href="#products">Explore the ecosystem <span>↓</span></a><a className={styles.textCta} href="#shared-intelligence">How Lurexa works <span>→</span></a></div>
        <p className={styles.microcopy}>One learner. One evolving model. Every experience adapts around it.</p>
      </div>
      <div className={styles.orbit} aria-label="Interactive Lurexa product map">
        <div className={styles.orbitCore}><MasterMark /><span>Learn.<br/>Connect.<br/><b>Grow.</b></span></div>
        {products.map((product, index) => <a key={product.name} href={product.href} className={`${styles.orbitNode} ${styles[`node${index}`]}`} aria-label={`${product.name}: ${product.status}`}><ProductIcon name={product.icon}/><span>{product.name}</span></a>)}
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
      <div className={styles.productGrid}>{products.map((product, index) => <a key={product.name} href={product.href} className={`${styles.productCard} ${styles[`product${index}`]}`}><div className={styles.productTop}><span className={styles.iconTile}><ProductIcon name={product.icon}/></span><span className={styles.cardArrow}>↗</span></div><p>{product.eyebrow}</p><h3>Lurexa <strong>{product.name}</strong></h3><span className={styles.cardLine}/><div className={styles.cardBottom}><span>{product.description}</span><b>{product.status}</b></div></a>)}</div>
    </section>

    <section className={styles.capabilities} aria-labelledby="capabilities-heading">
      <div className={styles.capabilitiesHeading}><p className={styles.kicker}>THE WIDER ECOSYSTEM</p><h2 id="capabilities-heading">Every capability speaks <em>the same visual language.</em></h2><p>These shared capabilities are being shaped as part of Lurexa’s ecosystem foundation. They are not separate promises; they make the product family more useful together.</p></div>
      <div className={styles.capabilityGrid}>{capabilities.map((capability) => <div className={styles.capability} key={capability.name}><CapabilityIcon name={capability.icon}/><span>{capability.name}</span><i>Planned</i></div>)}</div>
    </section>

    <section id="shared-intelligence" className={styles.intelligence}>
      <div className={styles.intelligenceVisual}><div className={styles.signalOne}/><div className={styles.signalTwo}/><div className={styles.signalThree}/><div className={styles.intelligenceCore}><MasterMark small/><span>ONE<br/>LEARNER</span></div></div>
      <div className={styles.intelligenceCopy}><p className={styles.kicker}>SHARED INTELLIGENCE, HUMANLY USED</p><h2>Progress should not reset when the experience changes.</h2><p>When a learner practises in Learn, speaks in Coach, or receives support in Teach, Lurexa builds on authorised evidence rather than starting from zero.</p><div className={styles.principles}><span>Trusted by Core</span><span>Interpreted by Mind</span><span>Experienced through products</span></div></div>
    </section>

    <section id="values" className={styles.values}><div className={styles.valueIntro}><p className={styles.kicker}>WHAT GUIDES US</p><h2>Technology should make education feel more personal, not less.</h2></div><div className={styles.valueList}><article><span>♡</span><h3>Learner first</h3><p>We design around real goals, confidence, and dignity.</p></article><article><span>✦</span><h3>Connected by design</h3><p>Useful context moves with people across their learning life.</p></article><article><span>✓</span><h3>Trust is essential</h3><p>Safety, clarity, and responsible data use are not optional.</p></article><article><span>↗</span><h3>Growth with impact</h3><p>We measure progress by what learners can meaningfully do.</p></article></div></section>

    <footer className={styles.footer}><div className={styles.footerBrand}><MasterMark small/><b>Lurexa</b></div><p>Learn. Connect. Grow.</p><a href="#top">Back to top ↑</a><span>© 2026 Lurexa Learning Technologies</span></footer>
  </main>;
}