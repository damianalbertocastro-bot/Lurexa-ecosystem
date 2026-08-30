"use client";

import React from "react";
import Link from "next/link";
import { SPECIALIZED_INDUSTRY_TRACKS } from "@lurexa/backend";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/button";

export const SpecializedTracksCard: React.FC = () => {
  return (
    <Card
      className="border-0 bg-[var(--lx-surface)] shadow-lg shadow-slate-200/60 dark:shadow-none"
      title="Specialized Career Tracks"
      subtitle="Industry-focused English for Dominican professionals"
      action={
        <Link href="/learn/tracks">
          <Button variant="ghost" size="sm">
            View all ({SPECIALIZED_INDUSTRY_TRACKS.length}) →
          </Button>
        </Link>
      }
    >
      <div className="grid gap-3 pt-2 sm:grid-cols-3">
        {SPECIALIZED_INDUSTRY_TRACKS.map((track) => (
          <Link
            key={track.id}
            href={`/learn/tracks/${track.slug}`}
            className="group flex flex-col justify-between rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)]/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--lx-primary)]/50 hover:bg-[var(--lx-canvas)] hover:shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <Badge variant="info">{track.targetIndustry}</Badge>
                <span className="text-[10px] font-bold text-[var(--lx-muted)]">
                  Min {track.minimumCefrLevel}
                </span>
              </div>
              <h4 className="mt-2.5 text-xs font-bold text-[var(--lx-ink)] group-hover:text-[var(--lx-primary)] transition-colors">
                {track.title}
              </h4>
              <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[var(--lx-muted)]">
                {track.description}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[var(--lx-border)] pt-2.5 text-[10px] font-bold text-[var(--lx-primary)]">
              <span>{track.modules.length} Modules</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
};
