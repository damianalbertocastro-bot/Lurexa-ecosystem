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
  return (
    <section
      className={`rounded-[32px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-[var(--lx-card-shadow)] sm:p-8 lg:p-10 ${className}`}
      {...props}
    >
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--lx-secondary)]">
          {eyebrow}
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <h2 className="max-w-2xl text-3xl font-black tracking-[-.05em] text-[var(--lx-ink)] sm:text-4xl">
            {title}
          </h2>
          <p className="text-sm leading-7 text-[var(--lx-muted)]">
            {description}
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <a
            key={`${item.kind}-${item.title}`}
            href={item.href}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-[var(--lx-border)] bg-[var(--lx-canvas)]/70 p-5 transition hover:-translate-y-0.5 hover:border-[var(--lx-secondary)] hover:bg-[var(--lx-canvas)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-secondary)] focus-visible:ring-offset-2 motion-reduce:transform-none"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--lx-surface)] shadow-xs ring-1 ring-[var(--lx-border)]">
                  <Mark kind={item.kind} />
                </span>
                {item.badge && (
                  <span className="rounded-full bg-[var(--lx-surface)] border border-[var(--lx-border)] px-2.5 py-1 text-[9px] font-black uppercase tracking-[.12em] text-[var(--lx-secondary)]">
                    {item.badge}
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-lg font-black tracking-[-.035em] text-[var(--lx-ink)] group-hover:text-[var(--lx-secondary)] transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--lx-muted)]">
                {item.description}
              </p>
            </div>
            <span className="mt-5 inline-flex min-h-10 items-center text-sm font-extrabold text-[var(--lx-secondary)]">
              {item.cta ?? "Explore"}{" "}
              <span
                className="ml-1 transition group-hover:translate-x-1 motion-reduce:transform-none"
                aria-hidden="true"
              >
                →
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
