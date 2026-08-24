"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/Button";
import { ProductMark } from "@lurexa/ui/ProductMark";

export const CoachPracticeCard: React.FC = () => {
  const router = useRouter();

  return (
    <article className="relative overflow-hidden rounded-3xl border border-violet-200/70 bg-gradient-to-br from-[#180e3d] via-[#24175b] to-[#122868] p-6 text-white shadow-xl shadow-indigo-950/15 sm:p-8">
      {/* Decorative background glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-3">
            <ProductMark product="coach" inverse />
            <Badge variant="info">AI Speaking & Pronunciation</Badge>
          </div>

          <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
            Practice speaking without pressure.
          </h2>

          <p className="text-sm leading-6 text-indigo-100/90">
            Build conversational confidence and pronunciation control. Coach adapts around what Lurexa already knows about your English without asking you to start over.
          </p>

          <div className="flex flex-wrap gap-2 pt-1 text-xs text-indigo-200">
            <span className="rounded-full bg-white/10 px-3 py-1 font-medium backdrop-blur-sm">
              🗣️ Dominican English Transfer
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 font-medium backdrop-blur-sm">
              🎯 Intelligibility & Fluency
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 font-medium backdrop-blur-sm">
              🔒 Private & Guided
            </span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <Button
            variant="primary"
            className="w-full sm:w-auto bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-black shadow-lg shadow-violet-900/40 border-0"
            onClick={() => router.push("/coach")}
          >
            Start Coach Practice →
          </Button>
        </div>
      </div>
    </article>
  );
};
