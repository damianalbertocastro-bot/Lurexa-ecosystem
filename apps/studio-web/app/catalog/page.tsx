"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StudioAuthoringService } from "@lurexa/backend";
import type { CefrLevel, StudioKnowledgeObjectDraftV1 } from "@lurexa/types";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/button";
import { Input } from "@lurexa/ui/Input";
import { StudioShell } from "../components/StudioShell";

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
    void StudioAuthoringService.listKnowledgeObjects()
      .then((list) => {
        if (!ignore) {
          setObjects(list);
          setLoading(false);
        }
      })
      .catch((err) => {
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
    <StudioShell active="Governed Catalog">
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 space-y-8">
        {/* Header */}
        <section className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--lx-border)] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xs font-bold text-[var(--lx-primary)] hover:underline">
                ← Studio Dashboard
              </Link>
              <span className="text-[var(--lx-muted)]">/</span>
              <span className="text-xs text-[var(--lx-muted)]">Governed Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-[-0.04em] text-[var(--lx-ink)]">
              Governed Knowledge Object Catalog
            </h1>
            <p className="text-xs sm:text-sm text-[var(--lx-muted)]">
              Authoritative, immutable learning assets governed in Lurexa Core and dynamically linked to Learn, Coach, and Teach.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/author">
              <Button className="rounded-xl bg-[var(--lx-primary)] px-4 py-2 text-xs font-black text-white shadow-xs hover:opacity-95 transition">
                + Author New Object
              </Button>
            </Link>
          </div>
        </section>

        {statusMessage && (
          <div className="animate-spring-pop rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-4 text-xs font-bold text-[var(--lx-primary)] shadow-sm">
            ✓ {statusMessage}
          </div>
        )}

        {/* Filter Controls Bar */}
        <Card className="p-4 sm:p-5 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="search-catalog" className="text-[11px] font-bold text-[var(--lx-muted)] uppercase tracking-wider">
                Search Assets
              </label>
              <Input
                id="search-catalog"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, prompt, or objective…"
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <label htmlFor="filter-cefr" className="text-[11px] font-bold text-[var(--lx-muted)] uppercase tracking-wider">
                CEFR Level
              </label>
              <select
                id="filter-cefr"
                value={selectedCefr}
                onChange={(e) => setSelectedCefr(e.target.value as never)}
                className="mt-1 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 py-2 text-xs font-bold text-[var(--lx-ink)]"
              >
                {CEFR_FILTER_OPTIONS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl === "ALL" ? "All Levels" : lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-domain" className="text-[11px] font-bold text-[var(--lx-muted)] uppercase tracking-wider">
                Domain
              </label>
              <select
                id="filter-domain"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 py-2 text-xs font-bold text-[var(--lx-ink)]"
              >
                <option value="ALL">All Domains</option>
                <option value="phonology">Phonology</option>
                <option value="grammar">Grammar</option>
                <option value="lexicon">Lexicon</option>
                <option value="pragmatics">Pragmatics</option>
                <option value="discourse">Discourse</option>
              </select>
            </div>

            <div>
              <label htmlFor="filter-status" className="text-[11px] font-bold text-[var(--lx-muted)] uppercase tracking-wider">
                Status
              </label>
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 py-2 text-xs font-bold text-[var(--lx-ink)]"
              >
                <option value="ALL">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="in_review">In Review</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Knowledge Objects Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-xs font-bold text-[var(--lx-muted)]">
              Loading Knowledge Objects from Core repository…
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs font-bold text-[var(--lx-muted)]">
              No Knowledge Objects match the selected filters.
            </div>
          ) : (
            filtered.map((ko) => (
              <Card
                key={ko.id}
                className="p-6 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] hover:border-[var(--lx-primary)] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-[var(--lx-canvas)] px-2 py-0.5 font-mono text-xs font-bold text-[var(--lx-primary)] border border-[var(--lx-border)]">
                      {ko.cefrLevel} · {ko.domain}
                    </span>
                    <Badge
                      variant={
                        ko.status === "published"
                          ? "success"
                          : ko.status === "in_review"
                          ? "info"
                          : "default"
                      }
                      className="text-[10px] uppercase font-bold"
                    >
                      {ko.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[var(--lx-ink)]">{ko.name}</h3>
                    <p className="mt-1 text-xs text-[var(--lx-muted)] leading-relaxed line-clamp-2">
                      {ko.pedagogicalObjective}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3 text-xs font-mono text-[var(--lx-ink)]">
                    &quot;{ko.activityConfig.promptText}&quot;
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {ko.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-[var(--lx-canvas)] px-2 py-0.5 text-[10px] font-bold text-[var(--lx-muted)] uppercase border border-[var(--lx-border)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--lx-border)]">
                  <span className="font-mono text-[10px] text-[var(--lx-muted)]">v{ko.version}</span>
                  {ko.status !== "published" && (
                    <Button
                      size="sm"
                      onClick={() => handlePublish(ko.id)}
                      className="rounded-lg bg-[var(--lx-primary)] text-white text-[11px] font-bold"
                    >
                      Approve &amp; Publish →
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </section>
      </div>
    </StudioShell>
  );
}
