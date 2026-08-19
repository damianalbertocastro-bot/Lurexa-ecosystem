import styles from "./page.module.css";

type IconName = "learn" | "coach" | "teach" | "admin" | "insight" | "studio";

const learnUrl = process.env.NEXT_PUBLIC_LUREXA_LEARN_URL ?? "https://learn.lurexa.com";

const products: Array<{ name: string; eyebrow: string; description: string; icon: IconName; href: string; status: string }> = [
  { name: "Learn", eyebrow: "Personal learning", description: "A guided English path that turns practice into confidence for real life.", icon: "learn", href: learnUrl, status: "Explore Learn" },
  { name: "Coach", eyebrow: "Speaking intelligence", description: "Focused pronunciation, fluency, and conversation practice that remembers the learner.", icon: "coach", href: "#shared-intelligence", status: "In development" },
  { name: "Teach", eyebrow: "Human teaching", description: "Better timing, clearer learner signals, and space for teachers to do the work only people can do.", icon: "teach", href: "#shared-intelligence", status: "In development" },
  { name: "Admin", eyebrow: "Institutional trust", description: "Safe access, governance, and a reliable foundation for institutions that need to scale.", icon: "admin", href: "#shared-intelligence", status: "In development" },
  { name: "Insight", eyebrow: "Learning evidence", description: "Turns progress, patterns, and needs into useful decisions—not another dashboard of noise.", icon: "insight", href: "#shared-intelligence", status: "In development" },
  { name: "Studio", eyebrow: "Learning creation", description: "A workspace for building and publishing meaningful learning experiences across Lurexa.", icon: "studio", href: "#shared-intelligence", status: "In development" },
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
  if (name === "learn") return <svg viewBox="0 0 64 64" className={styles.productIcon} aria-hidden="true"><path {...common} d="M8 15c10-4 17-2 24 5v31c-7-7-14-9-24-5V15Zm48 0c-10-4-17-2-24 5v31c7-7 14-9 24-5V15Z"/><path d="M32 20v31" stroke="#16c9d1" strokeWidth="4"/></svg>;
  if (name === "coach") return <svg viewBox="0 0 64 64" className={styles.productIcon} aria-hidden="true"><rect {...common} x="12" y="17" width="40" height="32" rx="12"/><path {...common} d="M20 12v5m24-5v5M24 33h.1m16 0h.1M24 41c5 4 11 4 16 0M7 28v10m50-10v10"/><circle cx="24" cy="33" r="2.5" fill="currentColor"/><circle cx="40" cy="33" r="2.5" fill="currentColor"/></svg>;
  if (name === "teach") return <svg viewBox="0 0 64 64" className={styles.productIcon} aria-hidden="true"><path d="m6 25 26-13 26 13-26 13L6 25Z" fill="currentColor"/><path {...common} d="M16 31v10c10 8 22 8 32 0V31M52 28v15"/><circle cx="52" cy="45" r="3" fill="#16c9d1"/></svg>;
  if (name === "admin") return <svg viewBox="0 0 64 64" className={styles.productIcon} aria-hidden="true"><path d="m8 19 24-11 24 11H8Z" fill="currentColor"/><path {...common} d="M12 54h40M16 24v24m10-24v24m12-24v24m10-24v24"/><path d="M10 50h44v5H10z" fill="#16c9d1"/></svg>;
  if (name === "insight") return <svg viewBox="0 0 64 64" className={styles.productIcon} aria-hidden="true"><rect x="8" y="37" width="10" height="17" rx="5" fill="currentColor" opacity=".6"/><rect x="27" y="23" width="10" height="31" rx="5" fill="currentColor"/><rect x="46" y="10" width="10" height="44" rx="5" fill="#16c9d1"/><path {...common} d="M8 55h48"/></svg>;
  return <svg viewBox="0 0 64 64" className={styles.productIcon} aria-hidden="true"><path d="m32 7 22 12v26L32 57 10 45V19L32 7Z" fill="currentColor" opacity=".9"/><path d="m10 19 22 12 22-12M32 31v26" stroke="white" strokeWidth="3" strokeLinejoin="round"/><path d="m32 31 22-12v7L32 38 10 26v-7l22 12Z" fill="#16c9d1"/></svg>;
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

    <section id="shared-intelligence" className={styles.intelligence}>
      <div className={styles.intelligenceVisual}><div className={styles.signalOne}/><div className={styles.signalTwo}/><div className={styles.signalThree}/><div className={styles.intelligenceCore}><MasterMark small/><span>ONE<br/>LEARNER</span></div></div>
      <div className={styles.intelligenceCopy}><p className={styles.kicker}>SHARED INTELLIGENCE, HUMANLY USED</p><h2>Progress should not reset when the experience changes.</h2><p>When a learner practises in Learn, speaks in Coach, or receives support in Teach, Lurexa builds on authorised evidence rather than starting from zero.</p><div className={styles.principles}><span>Trusted by Core</span><span>Interpreted by Mind</span><span>Experienced through products</span></div></div>
    </section>

    <section id="values" className={styles.values}><div className={styles.valueIntro}><p className={styles.kicker}>WHAT GUIDES US</p><h2>Technology should make education feel more personal, not less.</h2></div><div className={styles.valueList}><article><span>♡</span><h3>Learner first</h3><p>We design around real goals, confidence, and dignity.</p></article><article><span>✦</span><h3>Connected by design</h3><p>Useful context moves with people across their learning life.</p></article><article><span>✓</span><h3>Trust is essential</h3><p>Safety, clarity, and responsible data use are not optional.</p></article><article><span>↗</span><h3>Growth with impact</h3><p>We measure progress by what learners can meaningfully do.</p></article></div></section>

    <footer className={styles.footer}><div className={styles.footerBrand}><MasterMark small/><b>Lurexa</b></div><p>Learn. Connect. Grow.</p><a href="#top">Back to top ↑</a><span>© 2026 Lurexa Learning Technologies</span></footer>
  </main>;
}