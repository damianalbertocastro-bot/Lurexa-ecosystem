import { notFound } from "next/navigation";
import { DocsShell } from "../components/DocsShell";

type SectionKey = "architecture" | "product" | "curriculum" | "engineering" | "governance" | "design";

type SectionDefinition = {
  title: string;
  eyebrow: string;
  description: string;
  responsibility: string;
  files: Array<{ name: string; note: string; status?: string }>;
};

const sections: Record<SectionKey, SectionDefinition> = {
  architecture: {
    title: "Architecture",
    eyebrow: "SYSTEM RESPONSIBILITY",
    description: "How Lurexa Core, Lurexa Mind, products, evidence, context, and trusted persistence fit together without duplicating responsibility.",
    responsibility: "Use this section before changing platform boundaries, persistence ownership, cross-product data contracts, learner/educator intelligence, or trust-sensitive services.",
    files: [
      { name:"Capability Architecture.md", note:"Defines ecosystem capabilities and responsibility ownership." },
      { name:"Capability Interaction Matrix.md", note:"Maps how capabilities may interact without bypassing boundaries." },
      { name:"Learner Model Architecture.md", note:"Defines the persistent cross-product learner model." },
      { name:"Learning Evidence Contract v1.md", note:"Defines trustworthy learning-evidence structure and provenance." },
      { name:"Mind Interpretation Contract v1.md", note:"Defines Mind interpretation responsibilities and limits." },
      { name:"LUREXA_TEACH_MVP_ARCHITECTURE.md", note:"Teach trust model, evidence, assessment, credentials, and recommendations.", status:"ACTIVE" },
      { name:"Dependency Graph.md", note:"Documents dependency direction and architecture constraints." },
    ],
  },
  product: {
    title: "Product",
    eyebrow: "PRODUCT OWNERSHIP",
    description: "What each Lurexa product owns, what it must not absorb, and how current MVPs turn ecosystem strategy into concrete experience boundaries.",
    responsibility: "Use this section before adding a new product surface, moving a workflow between products, or interpreting a roadmap item as implementation scope.",
    files: [
      { name:"Product Portfolio and Boundaries.md", note:"Portfolio-level product responsibilities and ecosystem separation." },
      { name:"LUREXA_LEARN_TEACH_BOUNDARY.md", note:"Formal Learn versus Teach ownership rule.", status:"ACTIVE" },
      { name:"Lurexa Learn MVP Product Requirements.md", note:"Learn MVP product requirements and intended experience." },
      { name:"Lurexa Coach Product Definition.md", note:"Coach purpose, linguistic specialization, and product limits." },
      { name:"README.md", note:"Product documentation entry point." },
    ],
  },
  curriculum: {
    title: "Curriculum",
    eyebrow: "LEARNING AUTHORITY",
    description: "The educational system behind Lurexa Learn and related learning experiences: methodology, CEFR architecture, competencies, activities, assessment, phonetics, conversation, and linguistic adaptation.",
    responsibility: "Use this section before designing lessons, assessment, progression, learner-facing recommendations, speaking practice, phonetics, or English-learning content.",
    files: [
      { name:"00-LUREXA-LEARNING-METHODOLOGY.md", note:"Broad pedagogical authority for Lurexa learning experiences.", status:"FOUNDATION" },
      { name:"01-ENGLISH-CURRICULUM-ARCHITECTURE.md", note:"English curriculum structure and CEFR progression." },
      { name:"02-ENGLISH-COMPETENCY-MODEL.md", note:"Stable English competency model used across content and evidence." },
      { name:"03-LESSON-AND-ACTIVITY-SCHEMA.md", note:"Structured lesson and activity contracts." },
      { name:"04-ASSESSMENT-MASTERY-AND-PLACEMENT.md", note:"Assessment, mastery, placement, and progression rules." },
      { name:"05-LEARNER-MODEL-EDUCATIONAL-SPEC.md", note:"Educational interpretation of learner-model state." },
      { name:"06-DOMINICAN-SPANISH-ENGLISH-LINGUISTIC-PROFILE.md", note:"Dominican-Spanish-to-English transfer profile." },
      { name:"07-PHONETICS-PROGRESSION-A1-C2.md", note:"Pronunciation and phonetics progression." },
      { name:"08-CONVERSATION-FRAMEWORK.md", note:"Conversation experience framework." },
    ],
  },
  engineering: {
    title: "Engineering",
    eyebrow: "IMPLEMENTATION DISCIPLINE",
    description: "Standards for turning the architecture into reliable software: coding, accessibility, AI development, reviews, branches, dependencies, errors, verification, and documentation quality.",
    responsibility: "Use this section while implementing, reviewing, deploying, or verifying repository changes. Architecture responsibility still takes precedence over convenience.",
    files: [
      { name:"AI Development Guidelines.md", note:"Rules for responsible AI-assisted engineering." },
      { name:"Accessibility Standards.md", note:"Accessibility requirements for product experiences." },
      { name:"Architecture review checklist.md", note:"Engineering architecture review checklist." },
      { name:"Branching Strategy.md", note:"Repository branch and integration expectations." },
      { name:"Code Review Guidelines.md", note:"Quality expectations for code review." },
      { name:"Coding Standards.md", note:"Repository coding standards." },
      { name:"Definition of done.md", note:"Completion criteria before work is considered done." },
      { name:"Documentation Standards.md", note:"Standards for repository documentation quality." },
    ],
  },
  governance: {
    title: "Governance",
    eyebrow: "CHANGE CONTROL",
    description: "How important decisions are reviewed, documented, superseded, and carried into future implementation without allowing repository context to fragment.",
    responsibility: "Use this section when changing architecture, source-of-truth documentation, review practices, or decision authority.",
    files: [
      { name:"Architecture Review Checklist.md", note:"Governance-level architecture review criteria." },
      { name:"Code Review Guidelines.md", note:"Governance rules for reviewing implementation changes." },
      { name:"Documentation Lifecycle and Change Control.md", note:"How documentation changes, supersession, and lifecycle are governed.", status:"CONTROL" },
    ],
  },
  design: {
    title: "Design",
    eyebrow: "EXPERIENCE SYSTEM",
    description: "The shared Lurexa experience language: visual foundations, interaction quality, accessibility, learning UX, product identity, and patterns that keep products coherent without making them identical.",
    responsibility: "Use this section before creating or redesigning product interfaces, interaction patterns, navigation, learning experiences, or shared visual components.",
    files: [
      { name:"Design System Foundations.md", note:"Core design-system foundations, shared experience direction, and reusable visual rules.", status:"FOUNDATION" },
      { name:"Learning Experience UX Principles.md", note:"UX principles specific to learning experiences." },
      { name:"README.md", note:"Design documentation entry point." },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(sections).map((section) => ({ section }));
}

export default async function DocumentationSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!(section in sections)) notFound();
  const definition = sections[section as SectionKey];
  return <DocsShell active={definition.title}><main className="mx-auto max-w-[1480px] px-5 py-12 sm:px-8 sm:py-16">
    <section className="grid gap-8 lg:grid-cols-[1fr_.72fr] lg:items-end"><div><p className="text-[10px] font-extrabold tracking-[.18em] text-[#592bd6]">{definition.eyebrow}</p><h1 className="mt-3 text-5xl font-black tracking-[-.065em] sm:text-6xl">{definition.title}</h1><p className="mt-5 max-w-3xl text-base leading-8 text-[#5d6f9d]">{definition.description}</p></div><aside className="rounded-[24px] border border-[#dfe6f8] bg-white p-6 shadow-[0_12px_30px_rgba(32,52,128,.055)]"><p className="text-[10px] font-extrabold tracking-[.16em] text-[#7180a8]">WHEN TO USE THIS DOMAIN</p><p className="mt-3 text-sm leading-7 text-[#53679f]">{definition.responsibility}</p></aside></section>

    <section className="mt-12 grid gap-5 lg:grid-cols-[.72fr_1.28fr]"><aside className="h-fit rounded-[28px] bg-gradient-to-br from-[#071d67] via-[#19388f] to-[#4b28ae] p-7 text-white lg:sticky lg:top-28"><p className="text-[10px] font-extrabold tracking-[.18em] text-[#8df4ef]">READING RULE</p><h2 className="mt-3 text-2xl font-black tracking-[-.04em]">Start with authority, then implementation detail.</h2><p className="mt-4 text-sm leading-7 text-indigo-100">A document should be interpreted inside the wider Lurexa source-of-truth hierarchy. If a newer explicit decision conflicts with an older file, the older assumption should be marked superseded rather than silently blended.</p><a href="/" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-white px-4 text-sm font-extrabold text-[#26358c]">Back to Docs home →</a></aside>
      <div><div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-extrabold tracking-[.17em] text-[#592bd6]">KEY DOCUMENTS</p><h2 className="mt-2 text-3xl font-black tracking-[-.045em]">Repository-aligned references</h2></div><span className="rounded-full bg-[#eee9ff] px-3 py-1.5 text-xs font-extrabold text-[#592bd6]">{definition.files.length} references</span></div><div className="mt-5 space-y-3">{definition.files.map((file,index)=><article key={file.name} className="group rounded-[22px] border border-[#dfe6f8] bg-white p-5 transition hover:border-[#c6cff0] hover:shadow-[0_14px_30px_rgba(32,52,128,.07)]"><div className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f0ecff] text-xs font-black text-[#592bd6]">{String(index+1).padStart(2,"0")}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="break-words text-base font-black">{file.name}</h3>{file.status&&<span className="rounded-full bg-[#e6f8f4] px-2.5 py-1 text-[9px] font-extrabold tracking-[.1em] text-[#137867]">{file.status}</span>}</div><p className="mt-2 text-sm leading-6 text-[#6677a5]">{file.note}</p><code className="mt-3 block break-all text-[11px] font-bold text-[#8994b4]">Docs/{definition.title}/{file.name}</code></div></div></article>)}</div></div>
    </section>
  </main></DocsShell>;
}
