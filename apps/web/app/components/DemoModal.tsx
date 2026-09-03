"use client";

import React, { useState } from "react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [institutionName, setInstitutionName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [role, setRole] = useState("University / Higher Ed");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-bold transition"
          aria-label="Close dialog"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="inline-grid size-14 place-items-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">
              ✓
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Consultation Requested
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
              Thank you for connecting. Our institutional partnerships team will review{" "}
              <strong>{institutionName || "your institution"}</strong>&apos;s requirements and reach out at{" "}
              <strong>{contactEmail}</strong> within one business day.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 text-sm font-bold shadow-xs hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                INSTITUTIONAL DEMO
              </span>
              <h3 id="demo-modal-title" className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                Bring Lurexa to your school
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Experience multi-tenant Admin governance, phonemic telemetry in Insight, and Teach certification.
              </p>
            </div>

            <div>
              <label htmlFor="inst-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                School or District Name
              </label>
              <input
                id="inst-name"
                type="text"
                required
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="e.g., Santo Domingo Metropolitan District / UASD"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label htmlFor="inst-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Official Institutional Email
              </label>
              <input
                id="inst-email"
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="dean@university.edu or director@school.edu.do"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label htmlFor="inst-role" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Institution Type
              </label>
              <select
                id="inst-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="University / Higher Ed">University / Higher Education</option>
                <option value="K-12 School / District">K-12 Bilingual School / District</option>
                <option value="Language Institute">Language Institute / Academy</option>
                <option value="Government / Ministry">Ministry of Education / Public Agency</option>
                <option value="Enterprise / Corporate">Corporate Fluency Program</option>
              </select>
            </div>

            <div>
              <label htmlFor="inst-notes" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Specific Goals or Cohort Size (Optional)
              </label>
              <textarea
                id="inst-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Number of students, LMS requirements, or target timeline..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 text-xs font-bold shadow-md hover:bg-slate-800 transition"
              >
                Submit Demo Request →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
