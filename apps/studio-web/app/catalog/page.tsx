"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StudioAuthoringService } from "@lurexa/backend";
import type { CefrLevel, StudioKnowledgeObjectDraftV1 } from "@lurexa/types";
import { Button } from "@lurexa/ui/button";
import { Input } from "@lurexa/ui/Input";

const CEFR_FILTER_OPTIONS: (CefrLevel | "ALL")[] = ["ALL", "PRE_A1", "A1", "A2", "B1", "B2", "C1", "C2"];

export default function StudioCatalogPage() {
  const [objects, setObjects] = useState<StudioKnowledgeObjectDraftV1[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCefr, setSelectedCefr] = useState<CefrLevel | "ALL">("ALL");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchObjects = () => {
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
  };

  useEffect(() => {
    const cancel = fetchObjects();
    return cancel;
  }, []);

  const handlePublish = async (id: string) => {
    setStatusMessage(null);
    try {
      await StudioAuthoringService.publishKnowledgeObject(
        { id: "lead-curriculum-reviewer", email: "reviewer@lurexa.org" } as never,
        id
      );
      setStatusMessage("Knowledge Object approved and published to immutable production catalog.");
      const updated = await StudioAuthoringService.listKnowledgeObjects();
      setObjects(updated);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : "Publishing failed.");
    }
  };

  const filtered = objects.filter((ko) => {
    if (selectedCefr !== "ALL" && ko.cefrLevel !== selectedCefr) return false;
    if (selectedDomain !== "ALL" && ko.domain !== selectedDomain) return false;
    if (statusFilter !== "ALL" && ko.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ko.name.toLowerCase().includes(q) ||
        ko.pedagogicalObjective.toLowerCase().includes(q) ||
        ko.activityConfig.promptText.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xs font-bold text-amber-600 hover:underline">
              ← Studio Dashboard
            </Link>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
            Governed Knowledge Object Catalog
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Authoritative, immutable learning assets governed in Lurexa Core and dynamically linked to Learn, Coach, and Teach.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/author"
            className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-700 active:scale-95"
          >
            + Author New Object
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div role="alert" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-900">
          {statusMessage}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Search</span>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword..."
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">CEFR Level</span>
            <select
              value={selectedCefr}
              onChange={(e) => setSelectedCefr(e.target.value as never)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800"
            >
              {CEFR_FILTER_OPTIONS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Domain</span>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800"
            >
              <option value="ALL">All Domains</option>
              <option value="phonology">Phonology</option>
              <option value="grammar">Grammar</option>
              <option value="lexicon">Lexicon</option>
              <option value="pragmatics">Pragmatics</option>
              <option value="discourse">Discourse</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="draft">Drafts</option>
              <option value="in_review">In Review</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing {filtered.length} of {objects.length} Knowledge Objects
        </div>
      </div>

      {/* Catalog List */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm font-semibold text-slate-500">
          Loading catalog from Lurexa Core...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 space-y-3">
          <p className="text-sm font-bold text-slate-800">No Knowledge Objects match the selected filters.</p>
          <Link
            href="/author"
            className="inline-block rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs"
          >
            Create First Object in this Category →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((ko) => (
            <div
              key={ko.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-slate-300 flex flex-col justify-between gap-4 md:flex-row md:items-center"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-black text-slate-900">{ko.name}</span>
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-black text-amber-800">
                    {ko.cefrLevel}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-black ${
                      ko.status === "published"
                        ? "bg-emerald-100 text-emerald-800"
                        : ko.status === "in_review"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    v{ko.version} · {ko.status}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 capitalize">
                    {ko.domain}
                  </span>
                </div>

                <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">{ko.pedagogicalObjective}</p>

                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-slate-700 font-mono">
                  &ldquo;{ko.activityConfig.promptText}&rdquo;
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {ko.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 capitalize"
                    >
                      {s}
                    </span>
                  ))}
                  {ko.culturalContext && (
                    <span className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      Context: {ko.culturalContext}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {ko.status === "draft" && (
                  <Button
                    type="button"
                    onClick={() => void handlePublish(ko.id)}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 active:scale-95"
                  >
                    Approve &amp; Publish →
                  </Button>
                )}
                {ko.status === "published" && (
                  <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
                    Live in Catalog ✓
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
