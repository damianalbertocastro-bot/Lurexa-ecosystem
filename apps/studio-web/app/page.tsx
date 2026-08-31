"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StudioAuthoringService, type StudioKnowledgeObjectDraftV1 } from "@lurexa/backend";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/button";
import { StudioShell } from "./components/StudioShell";

export default function StudioDashboardPage() {
  const [objects, setObjects] = useState<StudioKnowledgeObjectDraftV1[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const draftCount = objects.filter((o) => o.status === "draft").length;
  const inReviewCount = objects.filter((o) => o.status === "in_review").length;
  const publishedCount = objects.filter((o) => o.status === "published").length;

  return (
    <StudioShell active="Dashboard">
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 space-y-8">
        {/* Creative Maker Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-[var(--lx-border)] bg-gradient-to-br from-[var(--lx-surface)] via-[var(--lx-canvas)] to-[var(--lx-surface)] p-6 sm:p-8 shadow-[var(--lx-card-shadow)]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--lx-primary)]">
                  CREATIVE &amp; CONSTRUCTIVE LAYER
                </span>
                <span className="text-[var(--lx-muted)]">·</span>
                <Badge variant="info" className="text-[10px]">
                  Core Governed Assets
                </Badge>
                <Badge variant="success" className="text-[10px]">
                  Immutable v1 Pipeline
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-[-0.04em] text-[var(--lx-ink)]">
                Lurexa Studio Authoring Workbench
              </h1>
              <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-[var(--lx-muted)]">
                Author, calibrate, lint, and publish immutable CEFR-aligned Knowledge Objects. All published artifacts seamlessly adapt inside Learn lessons, Coach pronunciation practice, and Teach educator credentials.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/author">
                <Button className="rounded-xl bg-[var(--lx-primary)] px-4 py-2.5 text-xs font-black text-white shadow-xs hover:opacity-95 transition">
                  Launch Author Workbench →
                </Button>
              </Link>
              <Link href="/catalog">
                <Button
                  variant="secondary"
                  className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-4 py-2.5 text-xs font-bold text-[var(--lx-ink)] hover:bg-[var(--lx-canvas)]"
                >
                  Browse Catalog ({objects.length})
                </Button>
              </Link>
              <Link href="/linter">
                <Button
                  variant="secondary"
                  className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-4 py-2.5 text-xs font-bold text-[var(--lx-ink)] hover:bg-[var(--lx-canvas)]"
                >
                  Open CEFR Linter
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Metrics Row */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] hover:border-[var(--lx-primary)] transition-all">
            <span className="text-xs font-bold text-[var(--lx-muted)] uppercase tracking-wider">
              Total Objects
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-[-0.04em] text-[var(--lx-ink)]">
                {loading ? "..." : objects.length}
              </span>
              <span className="text-xs font-semibold text-[var(--lx-muted)]">Core assets</span>
            </div>
          </Card>

          <Card className="p-5 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] hover:border-[var(--lx-primary)] transition-all">
            <span className="text-xs font-bold text-[var(--lx-muted)] uppercase tracking-wider">
              Drafts In Progress
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-[-0.04em] text-[var(--lx-ink)]">
                {loading ? "..." : draftCount}
              </span>
              <span className="text-xs font-semibold text-[var(--lx-muted)]">unreviewed</span>
            </div>
          </Card>

          <Card className="p-5 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] hover:border-[var(--lx-primary)] transition-all">
            <span className="text-xs font-bold text-[var(--lx-muted)] uppercase tracking-wider">
              In Peer Review
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-[-0.04em] text-[var(--lx-ink)]">
                {loading ? "..." : inReviewCount}
              </span>
              <span className="text-xs font-semibold text-[var(--lx-muted)]">pending signoff</span>
            </div>
          </Card>

          <Card className="p-5 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] hover:border-[var(--lx-primary)] transition-all">
            <span className="text-xs font-bold text-[var(--lx-muted)] uppercase tracking-wider">
              Published &amp; Live
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-[-0.04em] text-[var(--lx-ink)]">
                {loading ? "..." : publishedCount}
              </span>
              <Badge variant="success" className="text-[10px]">
                Immutable v1
              </Badge>
            </div>
          </Card>
        </section>

        {/* Feature Cards Grid */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="p-6 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] hover:border-[var(--lx-primary)] transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--lx-canvas)] text-lg border border-[var(--lx-border)]">
                ✍️
              </div>
              <h2 className="text-base font-black text-[var(--lx-ink)]">Interactive Authoring</h2>
              <p className="text-xs text-[var(--lx-muted)] leading-relaxed">
                Create structured learning objects with target phonemes, dialogue trees, gap fills, and Dominican Spanish (es-DO) articulatory remediation rules.
              </p>
            </div>
            <Link
              href="/author"
              className="inline-flex items-center text-xs font-bold text-[var(--lx-primary)] hover:underline pt-2"
            >
              Open Authoring Workbench →
            </Link>
          </Card>

          <Card className="p-6 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] hover:border-[var(--lx-primary)] transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--lx-canvas)] text-lg border border-[var(--lx-border)]">
                🔍
              </div>
              <h2 className="text-base font-black text-[var(--lx-ink)]">CEFR Linguistic Linter</h2>
              <p className="text-xs text-[var(--lx-muted)] leading-relaxed">
                Real-time linguistic validation of vocabulary bands (A1 to C2), syllable codas, and syntactic complexity scores before publishing to Core.
              </p>
            </div>
            <Link
              href="/linter"
              className="inline-flex items-center text-xs font-bold text-[var(--lx-primary)] hover:underline pt-2"
            >
              Run Diagnostic Linter →
            </Link>
          </Card>

          <Card className="p-6 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] hover:border-[var(--lx-primary)] transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--lx-canvas)] text-lg border border-[var(--lx-border)]">
                📚
              </div>
              <h2 className="text-base font-black text-[var(--lx-ink)]">Governed Catalog</h2>
              <p className="text-xs text-[var(--lx-muted)] leading-relaxed">
                Search, filter, and inspect canonical Knowledge Objects across levels A1 through C2 with full audit history and reviewer sign-off workflows.
              </p>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center text-xs font-bold text-[var(--lx-primary)] hover:underline pt-2"
            >
              Explore Catalog Browser →
            </Link>
          </Card>
        </section>

        {/* Recent Knowledge Objects Table */}
        <Card className="p-6 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--lx-border)] pb-3">
            <div>
              <h3 className="font-black text-[var(--lx-ink)]">Recent Knowledge Object Assets</h3>
              <p className="text-xs text-[var(--lx-muted)]">Latest draft creations and peer-review statuses</p>
            </div>
            <Link href="/catalog" className="text-xs font-bold text-[var(--lx-primary)] hover:underline">
              View All ({objects.length}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--lx-border)] text-[var(--lx-muted)]">
                <tr>
                  <th className="py-2.5 font-bold">Name &amp; Objective</th>
                  <th className="py-2.5 font-bold">CEFR</th>
                  <th className="py-2.5 font-bold">Domain</th>
                  <th className="py-2.5 font-bold">Status</th>
                  <th className="py-2.5 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--lx-border)]">
                {objects.slice(0, 5).map((ko) => (
                  <tr key={ko.id} className="hover:bg-[var(--lx-canvas)] transition">
                    <td className="py-3 pr-4">
                      <p className="font-bold text-[var(--lx-ink)]">{ko.name}</p>
                      <p className="text-[11px] text-[var(--lx-muted)] line-clamp-1">
                        {ko.pedagogicalObjective}
                      </p>
                    </td>
                    <td className="py-3">
                      <span className="rounded-md bg-[var(--lx-canvas)] px-2 py-0.5 font-mono font-bold text-[var(--lx-primary)] border border-[var(--lx-border)]">
                        {ko.cefrLevel}
                      </span>
                    </td>
                    <td className="py-3 text-[var(--lx-muted)] capitalize">{ko.domain}</td>
                    <td className="py-3">
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
                    </td>
                    <td className="py-3 text-right">
                      <Link href="/catalog">
                        <Button size="sm" variant="secondary" className="text-[11px] font-bold rounded-lg">
                          Inspect →
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </StudioShell>
  );
}
