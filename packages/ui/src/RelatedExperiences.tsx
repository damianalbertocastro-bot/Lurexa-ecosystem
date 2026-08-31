import type { HTMLAttributes } from "react";
import { DocsMark } from "./DocsMark";
import { MasterMark } from "./MasterMark";
import { ProductMark, type LurexaProduct } from "./ProductMark";

export type RelatedExperienceKind = LurexaProduct | "docs" | "teach-community" | "ecosystem";

export type RelatedExperience = {
  kind: RelatedExperienceKind;
  title: string;
  description: string;
  href: string;
  badge?: string;
  cta?: string;
};

export interface RelatedExperiencesProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: RelatedExperience[];
}

function Mark({ kind }: { kind: RelatedExperienceKind }) {
  if (kind === "docs") return <DocsMark compact />;
  if (kind === "ecosystem") return <MasterMark compact />;
  if (kind === "teach-community") return <ProductMark product="teach" compact />;
  return <ProductMark product={kind} compact />;
}

export function RelatedExperiences({
  eyebrow = "RELATED LUREXA EXPERIENCES",
  title = "Keep moving through the ecosystem.",
  description = "Your Lurexa identity connects learning, professional growth, intelligence, and shared tools without making you start over.",
  items,
  className = "",
  ...props
}: RelatedExperiencesProps) {
  return <section className={`rounded-[32px] border border-[var(--color-border-default)] bg-gradient-to-br from-white via-[var(--color-background-secondary)] to-white p-6 shadow-[0_18px_46px_rgba(32,52,128,.07)] sm:p-8 lg:p-10 ${className}`} {...props}>
    <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[var(--color-brand-primary)]">{eyebrow}</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-.05em] text-[var(--color-brand-navy)] sm:text-4xl">{title}</h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, index) => <a key={`${item.kind}-${item.title}`} href={item.href} className={`group relative overflow-hidden rounded-[22px] border p-5 transition motion-reduce:transition-none ${index===0?"border-[var(--color-border-default)] bg-gradient-to-br from-[var(--color-background-secondary)] to-white md:col-span-2":"border-[var(--color-border-default)] bg-[var(--lx-surface)]"} hover:-translate-y-0.5 hover:border-[var(--color-border-focus)] hover:shadow-[0_16px_34px_rgba(32,52,128,.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 motion-reduce:transform-none`}>
          <div className="flex items-start justify-between gap-4">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${index===0?"bg-[var(--lx-surface)] shadow-sm":"bg-[var(--color-background-secondary)]"}`}><Mark kind={item.kind} /></span>
            {item.badge && <span className="rounded-full bg-[var(--color-background-secondary)] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.12em] text-[var(--color-brand-primary)]">{item.badge}</span>}
          </div>
          <h3 className="mt-5 text-lg font-black tracking-[-.035em] text-[var(--color-text-primary)]">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{item.description}</p>
          <span className="mt-5 inline-flex min-h-10 items-center text-sm font-extrabold text-[var(--color-brand-secondary)]">{item.cta ?? "Explore"} <span className="ml-1 transition group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none" aria-hidden="true">→</span></span>
        </a>)}
      </div>
    </div>
  </section>;
}
