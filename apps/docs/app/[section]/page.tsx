import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsShell } from "../components/DocsShell";
import { getDocsBySection } from "../../lib/docs-content";

const sections = {
  architecture: { title:"Architecture", eyebrow:"SYSTEM RESPONSIBILITY", description:"How Lurexa Core, Lurexa Mind, products, evidence, context, and trusted persistence fit together without duplicating responsibility.", responsibility:"Use this section before changing platform boundaries, persistence ownership, cross-product data contracts, learner/educator intelligence, or trust-sensitive services." },
  product: { title:"Product", eyebrow:"PRODUCT OWNERSHIP", description:"What each Lurexa product owns, what it must not absorb, and how current MVPs turn ecosystem strategy into concrete experience boundaries.", responsibility:"Use this section before adding a new product surface, moving a workflow between products, or interpreting a roadmap item as implementation scope." },
  curriculum: { title:"Curriculum", eyebrow:"LEARNING AUTHORITY", description:"The educational system behind Lurexa learning experiences: methodology, CEFR architecture, competencies, activities, assessment, phonetics, conversation, and linguistic adaptation.", responsibility:"Use this section before designing lessons, assessment, progression, learner-facing recommendations, speaking practice, phonetics, or English-learning content." },
  engineering: { title:"Engineering", eyebrow:"IMPLEMENTATION DISCIPLINE", description:"Standards for turning the architecture into reliable software: coding, accessibility, AI development, reviews, branches, dependencies, errors, verification, and documentation quality.", responsibility:"Use this section while implementing, reviewing, deploying, or verifying repository changes." },
  governance: { title:"Governance", eyebrow:"CHANGE CONTROL", description:"How important decisions are reviewed, documented, superseded, and carried into future implementation without allowing repository context to fragment.", responsibility:"Use this section when changing architecture, source-of-truth documentation, review practices, or decision authority." },
  design: { title:"Design", eyebrow:"EXPERIENCE SYSTEM", description:"The shared Lurexa experience language: visual foundations, interaction quality, accessibility, learning UX, product identity, and patterns that keep products coherent without making them identical.", responsibility:"Use this section before creating or redesigning product interfaces, interaction patterns, navigation, learning experiences, or shared visual components." },
} as const;

type SectionKey = keyof typeof sections;

export function generateStaticParams() { return Object.keys(sections).map((section)=>({section})); }

export default async function DocumentationSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!(section in sections)) notFound();
  const definition = sections[section as SectionKey];
  const docs = getDocsBySection(definition.title);
  return <DocsShell active={definition.title}><main className="mx-auto max-w-[1480px] px-5 py-12 sm:px-8 sm:py-16">
    <section className="grid gap-8 lg:grid-cols-[1fr_.72fr] lg:items-end"><div><p className="text-[10px] font-extrabold tracking-[.18em] text-[#592bd6]">{definition.eyebrow}</p><h1 className="mt-3 text-5xl font-black tracking-[-.065em] sm:text-6xl">{definition.title}</h1><p className="mt-5 max-w-3xl text-base leading-8 text-[#5d6f9d]">{definition.description}</p></div><aside className="rounded-[24px] border border-[#dfe6f8] bg-white p-6 shadow-[0_12px_30px_rgba(32,52,128,.055)]"><p className="text-[10px] font-extrabold tracking-[.16em] text-[#7180a8]">WHEN TO USE THIS DOMAIN</p><p className="mt-3 text-sm leading-7 text-[#53679f]">{definition.responsibility}</p></aside></section>

    <section className="mt-12 grid gap-5 lg:grid-cols-[.72fr_1.28fr]"><aside className="h-fit rounded-[28px] bg-gradient-to-br from-[#071d67] via-[#19388f] to-[#4b28ae] p-7 text-white lg:sticky lg:top-28"><p className="text-[10px] font-extrabold tracking-[.18em] text-[#8df4ef]">CANONICAL CONTENT</p><h2 className="mt-3 text-2xl font-black tracking-[-.04em]">These pages read directly from the repository.</h2><p className="mt-4 text-sm leading-7 text-indigo-100">There is no duplicated web-document copy. Edit the Markdown file under <code className="rounded bg-white/10 px-1.5 py-1">Docs/</code> and the rendered document/search index follows it.</p><Link href="/search" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-white px-4 text-sm font-extrabold text-[#26358c]">Search all Docs →</Link></aside>
      <div><div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-extrabold tracking-[.17em] text-[#592bd6]">CANONICAL DOCUMENTS</p><h2 className="mt-2 text-3xl font-black tracking-[-.045em]">Repository source files</h2></div><span className="rounded-full bg-[#eee9ff] px-3 py-1.5 text-xs font-extrabold text-[#592bd6]">{docs.length} documents</span></div><div className="mt-5 space-y-3">{docs.map((doc,index)=><Link key={doc.relativePath} href={doc.href} className="group block rounded-[22px] border border-[#dfe6f8] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#c6cff0] hover:shadow-[0_14px_30px_rgba(32,52,128,.07)]"><div className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f0ecff] text-xs font-black text-[#592bd6]">{String(index+1).padStart(2,"0")}</span><div className="min-w-0 flex-1"><h3 className="break-words text-base font-black">{doc.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-[#4d5e8c]">{doc.excerpt}</p><code className="mt-3 block break-all text-[11px] font-bold text-[#8994b4]">{doc.relativePath}</code><span className="mt-3 inline-flex text-sm font-extrabold text-[#315fd7]">Read document →</span></div></div></Link>)}</div></div>
    </section>
  </main></DocsShell>;
}
