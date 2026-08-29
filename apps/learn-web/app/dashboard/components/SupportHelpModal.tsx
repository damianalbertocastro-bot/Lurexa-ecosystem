"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@lurexa/ui/Modal";
import { Button } from "@lurexa/ui/Button";
import { getEcosystemUrl } from "@lurexa/config/domains";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How do I resume my English lessons?",
    answer:
      "Click 'Resume Learning' on any enrolled course card, or follow the 'Recommended next step' button at the top of your dashboard to continue from your latest milestone.",
  },
  {
    question: "How does Lurexa Coach practice work?",
    answer:
      "Coach provides low-pressure speaking and pronunciation practice tailored for Dominican Spanish speakers learning English. It focuses on intelligibility, rhythm, and confidence without forcing accent erasure.",
  },
  {
    question: "How do learning streaks and points calculate?",
    answer:
      "Completing at least one lesson or speaking practice per day increments your streak. Every completed lesson awards 10 learning points toward your milestone achievements.",
  },
  {
    question: "Can I practice offline?",
    answer:
      "Yes! Lurexa Learn caches downloaded lesson content locally via Dexie.js so you can continue learning during connectivity drops and sync progress when back online.",
  },
];

export const SupportHelpModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const docsUrl = getEcosystemUrl("docs");

  // Keyboard shortcut: '?' to toggle help modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "?" &&
        !isOpen &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Floating Bottom-Right Support Button */}
      <aside className="fixed bottom-6 right-6 z-40" aria-label="Support and FAQs">
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 hover:shadow-indigo-600/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-3.5"
          aria-label="Open support and frequently asked questions"
          title="Support & FAQs (Press ?)"
        >
          <span className="text-xl leading-none">💬</span>
          <span className="sr-only">Support</span>
        </Button>
      </aside>

      {/* Support & FAQ Dialog */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Support & Learning Guide">
        <div className="space-y-5 text-left text-slate-700">
          <p className="text-xs text-slate-500">
            Find quick answers to common questions about your Lurexa Learn space.
          </p>

          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50/60">
            {FAQS.map((faq, index) => (
              <details
                key={index}
                className="group p-3.5 text-xs transition-colors hover:bg-slate-50 first:rounded-t-2xl last:rounded-b-2xl"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-[var(--color-brand-navy)] focus:outline-none">
                  <span>{faq.question}</span>
                  <span className="ml-2 transition-transform group-open:rotate-180 text-slate-400">
                    ▼
                  </span>
                </summary>
                <p className="mt-2 leading-5 text-slate-600 font-normal">{faq.answer}</p>
              </details>
            ))}
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs">
            <p className="font-bold text-indigo-950">Need in-depth documentation?</p>
            <p className="mt-1 text-slate-600 leading-5">
              Explore the complete English curriculum architecture, CEFR competency models, and linguistic profiles.
            </p>
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              Open Lurexa Documentation ↗
            </a>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
