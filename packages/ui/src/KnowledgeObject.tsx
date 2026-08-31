import React from "react";

export type KnowledgeObjectView = {
  id: string;
  kind: string;
  title: string;
  description: string;
  skillDimensions: string[];
  cefrLevels?: string[];
  version: number;
  status: string;
  relations: Array<{ kind: string; targetId: string }>;
};

export interface KnowledgeObjectProps {
  object: KnowledgeObjectView;
  className?: string;
  compact?: boolean;
}

export function KnowledgeObject({ object, className = "", compact = false }: KnowledgeObjectProps) {
  return (
    <article className={`rounded-[26px] border border-violet-100 bg-[var(--lx-surface)] shadow-[0_14px_36px_rgba(124,58,237,.08)] ${compact ? "p-4" : "p-5 sm:p-6"} ${className}`} aria-labelledby={`${object.id}-title`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-violet-600">Knowledge Object</p>
          <h2 id={`${object.id}-title`} className="mt-1 text-lg font-bold tracking-[-.03em] text-slate-950">{object.title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--lx-muted)]">{object.description}</p>
        </div>
        <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-bold capitalize text-violet-700">{object.kind.replaceAll("_", " ")}</span>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-[var(--lx-canvas)] p-3">
          <dt className="text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--lx-muted)]">Skills</dt>
          <dd className="mt-1 text-sm font-semibold text-[var(--lx-ink)]">{object.skillDimensions.length ? object.skillDimensions.join(", ") : "Not mapped"}</dd>
        </div>
        <div className="rounded-2xl bg-[var(--lx-canvas)] p-3">
          <dt className="text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--lx-muted)]">CEFR</dt>
          <dd className="mt-1 text-sm font-semibold text-[var(--lx-ink)]">{object.cefrLevels?.length ? object.cefrLevels.join(" · ") : "Cross-level"}</dd>
        </div>
        <div className="rounded-2xl bg-[var(--lx-canvas)] p-3">
          <dt className="text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--lx-muted)]">Version</dt>
          <dd className="mt-1 text-sm font-semibold text-[var(--lx-ink)]">v{object.version} · {object.status}</dd>
        </div>
      </dl>

      {!compact && object.relations.length > 0 && (
        <div className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--lx-muted)]">Connected learning</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {object.relations.map((relation, index) => (
              <span key={`${relation.kind}-${relation.targetId}-${index}`} className="rounded-full border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 py-1.5 text-xs text-[var(--lx-muted)]">
                <strong className="font-semibold">{relation.kind.replaceAll("_", " ")}</strong> · {relation.targetId}
              </span>
            ))}
          </div>
        </div>
      )}

      <footer className="mt-5 border-t border-[var(--lx-border)] pt-3 text-xs text-[var(--lx-muted)]">{object.id}</footer>
    </article>
  );
}
