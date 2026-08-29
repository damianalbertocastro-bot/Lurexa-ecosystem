import { DocsMark } from "@lurexa/ui/DocsMark";
import { EcosystemLayerMark } from "@lurexa/ui/EcosystemLayerMark";
import { MasterMark } from "@lurexa/ui/MasterMark";
import { ProductMark, type LurexaProduct } from "@lurexa/ui/ProductMark";
import { RelatedExperiences } from "@lurexa/ui/RelatedExperiences";

const products: LurexaProduct[] = ["learn", "coach", "teach", "admin", "insight", "studio", "campus"];

export default function BrandIdentityPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[var(--lx-primary)]">LOCAL VISUAL QA</p>
      <h1 className="mt-3 text-4xl font-black tracking-[-.055em] text-[var(--color-brand-navy)] sm:text-5xl">Lurexa identity reference</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--lx-muted)]">Use this local Docs route to inspect canonical shared marks, semantic sizing, inverse treatments, and the cross-product recommendation component before an intentional hosted preview or production release.</p>

      <section className="mt-10 rounded-[28px] border border-[var(--lx-surface)] bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black text-[var(--color-brand-navy)]">Master identity · semantic scale</h2>
        <div className="mt-6 flex flex-wrap items-end gap-8"><MasterMark size="sm" /><MasterMark size="md" /><MasterMark size="lg" /></div>
        <div className="mt-6 flex flex-wrap items-end gap-8"><MasterMark size="sm" compact /><MasterMark size="md" compact /><MasterMark size="lg" compact /></div>
      </section>

      <section className="mt-6 rounded-[28px] border border-[var(--lx-surface)] bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black text-[var(--color-brand-navy)]">Current product family</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => <div key={product} className="rounded-2xl border border-[#e4e9f5] bg-[#fbfcff] p-5"><ProductMark product={product} size="lg" /><div className="mt-5 flex items-end gap-4"><ProductMark product={product} size="sm" compact /><ProductMark product={product} size="md" compact /><ProductMark product={product} size="lg" compact /></div></div>)}
        </div>
      </section>

      <section className="mt-6 rounded-[28px] border border-[var(--lx-surface)] bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black text-[var(--color-brand-navy)]">Shared layers and Docs</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-[#e4e9f5] p-5"><EcosystemLayerMark layer="core" size="lg" /></div><div className="rounded-2xl border border-[#e4e9f5] p-5"><EcosystemLayerMark layer="mind" size="lg" /></div><div className="rounded-2xl border border-[#e4e9f5] p-5"><DocsMark size="lg" /></div></div>
      </section>

      <section className="mt-6 rounded-[28px] bg-[var(--color-brand-navy)] p-6 sm:p-8">
        <h2 className="text-xl font-black text-white">Inverse treatment</h2>
        <div className="mt-6 flex flex-wrap items-center gap-8"><MasterMark inverse size="lg" />{products.map((product) => <ProductMark key={product} product={product} inverse />)}<DocsMark inverse /><EcosystemLayerMark layer="core" inverse /><EcosystemLayerMark layer="mind" inverse /></div>
      </section>

      <div className="mt-6"><RelatedExperiences items={[{ kind: "learn", title: "Lurexa Learn", description: "Current learner experience.", href: "#" }, { kind: "teach-community", title: "Teach Community", description: "Educator-only professional collaboration inside Lurexa Teach.", href: "#" }, { kind: "docs", title: "Lurexa Docs", description: "Canonical ecosystem documentation.", href: "#" }]} /></div>

      <section className="mt-6 rounded-[28px] border border-dashed border-[#c9d4ee] bg-[#f8faff] p-6 sm:p-8">
        <h2 className="text-xl font-black text-[var(--color-brand-navy)]">Future concepts</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--lx-muted)]">Lurexa Community and other future-concept marks remain source assets under <code>packages/ui/brand/concepts</code>. They are intentionally not rendered through current-product runtime types until activation.</p>
      </section>
    </main>
  );
}
