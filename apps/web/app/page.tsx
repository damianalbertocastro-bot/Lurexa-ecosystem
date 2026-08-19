import styles from "./page.module.css";

const learnUrl = process.env.NEXT_PUBLIC_LUREXA_LEARN_URL ?? "https://learn.lurexa.com";
const products = [
  ["Learn", "Structured English learning", "↗", learnUrl, "Explore Learn"],
  ["Coach", "Speaking and pronunciation", "◌", "", "Coming soon"],
  ["Teach", "Teaching decisions and class support", "⌁", "", "Coming soon"],
  ["Admin", "Institutions, access and governance", "□", "", "Coming soon"],
  ["Insight", "Learning evidence made useful", "✦", "", "Coming soon"],
  ["Studio", "Create and publish learning", "◇", "", "Coming soon"],
];

export default function Home() {
  return <main className={styles.page}><nav><b>lurexa<span>.</span></b><div><a href="#about">About</a><a href="#products">Products</a><a href="#services">Services</a><a href="#contact">Contact</a></div><a className={styles.cta} href="#products">Explore ecosystem</a></nav>
    <section className={styles.hero}><p>LEARNING TECHNOLOGIES</p><h1>One learning relationship.<br/><i>Many ways to grow.</i></h1><h2>Lurexa builds connected learning experiences for learners, teachers, institutions and creators—so progress is not rediscovered from zero.</h2><a className={styles.cta} href="#products">Meet the products</a></section>
    <section id="about" className={styles.statement}><p>THE ECOSYSTEM</p><h2>Lurexa Core protects the trusted record. Lurexa Mind interprets learning. Every product delivers a focused experience.</h2></section>
    <section id="products"><p>PRODUCT FAMILY</p><h2>Built as one system. Designed for distinct work.</h2><div className={styles.grid}>{products.map(([name,description,mark,href,cta],index)=><article key={name} className={styles["p"+index]}><span aria-hidden="true">{mark}</span><h3>lurexa <b>{name}</b></h3><p>{description}</p>{href?<a className={styles.productLink} href={href}>{cta} →</a>:<span className={styles.comingSoon}>{cta}</span>}</article>)}</div></section>
    <section id="services" className={styles.services}><p>WHAT WE OFFER</p><h2>Learning systems that connect curriculum, human teaching and useful intelligence.</h2><div><b>Personalized learning</b><b>Teacher enablement</b><b>Institutional capability</b><b>Learning intelligence</b></div></section>
    <footer id="contact"><b>lurexa.</b><p>Learning technologies for a more connected future.</p><span>© 2026 Lurexa Learning Technologies</span></footer>
  </main>;
}