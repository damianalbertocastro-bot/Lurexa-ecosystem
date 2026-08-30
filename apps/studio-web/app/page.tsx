"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StudioAuthoringService, type StudioKnowledgeObjectDraftV1 } from "@lurexa/backend";

export default function StudioDashboardPage() {
  const [objects, setObjects] = useState<StudioKnowledgeObjectDraftV1[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    void StudioAuthoringService.listKnowledgeObjects().then((list) => {
      if (!ignore) {
        setObjects(list);
        setLoading(false);
      }
    }).catch((err) => {
      if (!ignore) {
        console.error(err);
        setLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const draftCount = objects.filter((o) => o.status === "draft").length;
  const inReviewCount = objects.filter((o) => o.status === "in_review").length;
  const publishedCount = objects.filter((o) => o.status === "published").length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
            <span>✨ Sibling Product 6 of 6</span>
            <span>·</span>
            <span>Port 3006 Active</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Lurexa Studio Authoring Workbench
          </h1>
          <p className="text-sm leading-relaxed text-slate-300">
            Author, calibrate, lint, and publish immutable CEFR-aligned Knowledge Objects. All published artifacts seamlessly adapt inside Learn lessons, Coach pronunciation practice, and Teach educator credentials.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/author"
              className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-black text-slate-950 transition hover:bg-amber-400 active:scale-95 shadow-md"
            >
              Launch Author Workbench →
            </Link>
            <Link
              href="/catalog"
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-white/20"
            >
              Browse Catalog ({objects.length})
            </Link>
            <Link
              href="/linter"
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-white/20"
            >
              Open CEFR Linter
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Objects</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{loading ? "..." : objects.length}</span>
            <span className="text-xs font-semibold text-slate-500">Core assets</span>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-5 shadow-sm">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Drafts In Progress</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-900">{loading ? "..." : draftCount}</span>
            <span className="text-xs font-semibold text-amber-700">unreviewed</span>
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/50 p-5 shadow-sm">
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">In Peer Review</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-900">{loading ? "..." : inReviewCount}</span>
            <span className="text-xs font-semibold text-indigo-700">pending signoff</span>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-5 shadow-sm">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Published &amp; Live</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-900">{loading ? "..." : publishedCount}</span>
            <span className="text-xs font-semibold text-emerald-700">immutable v1</span>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-bold">
              ✍️
            </div>
            <h2 className="text-lg font-bold text-slate-900">Interactive Authoring</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Create structured learning objects with target phonemes, dialogue trees, gap fills, and Dominican Spanish (es-DO) articulatory remediation rules.
            </p>
          </div>
          <Link
            href="/author"
            className="inline-flex items-center text-xs font-bold text-amber-600 hover:text-amber-700"
          >
            Open Authoring Workbench →
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-800 font-bold">
              🔍
            </div>
            <h2 className="text-lg font-bold text-slate-900">CEFR Linguistic Linter</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time linguistic validation of vocabulary bands (A1 to C2), syllable codas, and syntactic complexity scores before publishing to Core.
            </p>
          </div>
          <Link
            href="/linter"
            className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            Run Diagnostic Linter →
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold">
              📚
            </div>
            <h2 className="text-lg font-bold text-slate-900">Governed Catalog</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse, filter, and inspect immutable versioned Knowledge Objects distributed across Lurexa Learn, Coach, and Teach.
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            Inspect Catalog Records →
          </Link>
        </div>
      </section>

      {/* Cross-Product Ecosystem Directory */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Lurexa Ecosystem Sibling Products</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 text-center">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
            <span className="block text-xs font-bold text-slate-900">Lurexa Web</span>
            <span className="text-[10px] text-slate-500 font-medium">Port 3000</span>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
            <span className="block text-xs font-bold text-slate-900">Lurexa Learn</span>
            <span className="text-[10px] text-slate-500 font-medium">Port 3001</span>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
            <span className="block text-xs font-bold text-slate-900">Lurexa Coach</span>
            <span className="text-[10px] text-slate-500 font-medium">Port 3005</span>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
            <span className="block text-xs font-bold text-slate-900">Lurexa Teach</span>
            <span className="text-[10px] text-slate-500 font-medium">Port 3002</span>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
            <span className="block text-xs font-bold text-slate-900">Lurexa Admin</span>
            <span className="text-[10px] text-slate-500 font-medium">Port 3004</span>
          </div>
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3 shadow-xs">
            <span className="block text-xs font-black text-amber-900">Lurexa Studio</span>
            <span className="text-[10px] text-amber-700 font-bold">Port 3006 (Active)</span>
          </div>
        </div>
      </section>
    </main>
  );
}
