"use client";

import React, { useMemo, useState } from "react";
import { TeacherWorkspaceBanner } from "../components/TeacherWorkspaceBanner";

type PreviewObject = {
  id: string;
  title: string;
  cefr: string;
  kind: string;
};

const REFERENCE_OBJECTS: PreviewObject[] = [
  { id: "eng.skill.introductions.personal-identity", title: "Personal introductions and identity", cefr: "A1", kind: "skill" },
  { id: "eng.grammar.simple-past.regular-form", title: "Regular simple-past form", cefr: "A2", kind: "language_form" },
  { id: "eng.pronunciation.initial-s-consonant-clusters", title: "Initial /s/ + consonant clusters", cefr: "B1", kind: "pronunciation_target" },
  { id: "eng.skill.strategic-negotiation.concessions", title: "Strategic commercial negotiations", cefr: "C1", kind: "skill" },
];

export default function LurexaStudioPage() {
  const [objects, setObjects] = useState<PreviewObject[]>(REFERENCE_OBJECTS);
  const [filter, setFilter] = useState("all");
  const [title, setTitle] = useState("");
  const [cefr, setCefr] = useState("A1");
  const [message, setMessage] = useState("");

  const visible = useMemo(
    () => (filter === "all" ? objects : objects.filter((item) => item.cefr === filter)),
    [filter, objects],
  );

  function createPreview(event: React.FormEvent) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const id = `preview.${cefr.toLowerCase()}.${Date.now()}`;
    setObjects((current) => [{ id, title: cleanTitle, cefr, kind: "concept" }, ...current]);
    setTitle("");
    setMessage(`Preview object '${id}' created locally. It has not been saved to Core or published to Studio.`);
  }

  return (
    <>
      <TeacherWorkspaceBanner
        title="Studio Authoring Preview"
        subtitle="Local interaction prototype — not the standalone Lurexa Studio product"
        breadcrumbs={[{ label: "Dashboard", href: "/teacher/dashboard" }, { label: "Studio preview" }]}
      />
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <p className="text-xs font-black uppercase tracking-[.14em]">Studio prototype · local preview only</p>
          <h1 className="mt-2 text-2xl font-black">Nothing created here is authoritative or persistent.</h1>
          <p className="mt-2 max-w-4xl text-sm leading-7">
            This Teacher Workspace page is retained to test future authoring interactions. A real Lurexa Studio must be a standalone product whose Knowledge Objects are Core-owned, versioned, provenance-tracked, permissioned, validated and explicitly published. Mind may assist authoring, but it cannot become the authoritative catalog.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
          <form onSubmit={createPreview} className="rounded-3xl border border-[#dfe6f8] bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[.14em] text-[#be185d]">Interaction prototype</p>
            <h2 className="mt-2 text-xl font-black text-[#071d67]">Create a local preview object</h2>
            <label className="mt-5 block text-xs font-black text-[#536792]">
              Title
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dfe6f8] px-3 py-2.5 text-sm" placeholder="e.g. Clarifying a misunderstanding" />
            </label>
            <label className="mt-4 block text-xs font-black text-[#536792]">
              CEFR level
              <select value={cefr} onChange={(event) => setCefr(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dfe6f8] px-3 py-2.5 text-sm">
                {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => <option key={level}>{level}</option>)}
              </select>
            </label>
            <button type="submit" className="mt-5 w-full rounded-xl bg-[#be185d] px-4 py-3 text-sm font-black text-white">Create local preview</button>
            {message ? <p role="status" className="mt-4 rounded-xl bg-[#f8faff] p-3 text-xs font-bold leading-5 text-[#536792]">{message}</p> : null}
          </form>

          <section className="rounded-3xl border border-[#dfe6f8] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[.14em] text-[#6b2bd9]">Reference-only catalog</p>
                <h2 className="mt-2 text-xl font-black text-[#071d67]">A1–C2 authoring coverage</h2>
              </div>
              <select aria-label="Filter preview objects by CEFR" value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-xl border border-[#dfe6f8] px-3 py-2 text-sm font-bold">
                <option value="all">All levels</option>
                {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => <option key={level}>{level}</option>)}
              </select>
            </div>
            <div className="mt-5 space-y-3">
              {visible.map((item) => (
                <article key={item.id} className="rounded-2xl border border-[#edf1fb] bg-[#fbfdff] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-[#071d67]">{item.title}</p>
                    <span className="rounded-full bg-[#eee9ff] px-2.5 py-1 text-xs font-black text-[#6b2bd9]">{item.cefr}</span>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-[#7182aa]">{item.id}</p>
                  <p className="mt-2 text-xs text-[#6074a5]">{item.kind.replace("_", " ")} · local/reference state only</p>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
