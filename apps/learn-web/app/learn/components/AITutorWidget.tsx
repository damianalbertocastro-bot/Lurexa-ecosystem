"use client";

import React from "react";
import { Card } from "@lurexa/ui/Card";

export interface AITutorWidgetProps {
  lessonTitle: string;
  lessonContext: string;
}

export const AITutorWidget: React.FC<AITutorWidgetProps> = ({ lessonTitle, lessonContext }) => {
  void lessonContext;

  return (
    <Card className="border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.16em] text-amber-700">Preview capability</p>
          <h3 className="mt-2 font-bold text-[var(--lx-ink)]">AI Learning Companion</h3>
          <p className="mt-1 text-xs text-[var(--lx-muted)]">Lesson context: {lessonTitle}</p>
        </div>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-800">
          Not connected
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-5">
        <p className="text-sm font-bold text-[var(--lx-ink)]">Live tutoring is intentionally disabled on this widget.</p>
        <p className="mt-2 text-sm leading-6 text-[var(--lx-muted)]">
          Lurexa will not generate canned responses and present them as Mind-backed tutoring. This surface will become interactive only when it is connected to the governed Learn Tutor server boundary, authorized lesson context, and the learner evidence/privacy contract.
        </p>
      </div>
    </Card>
  );
};
