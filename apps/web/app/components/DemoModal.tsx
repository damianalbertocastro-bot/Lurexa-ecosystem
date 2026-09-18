"use client";

import React, { useState } from "react";
import { useTranslation } from "@lurexa/i18n";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const { t } = useTranslation();
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
              {t("landing.demoModal.successTitle")}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
              {t("landing.demoModal.successDesc")}
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
                {t("landing.demoModal.done")}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                {t("landing.demoModal.kicker")}
              </span>
              <h3 id="demo-modal-title" className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {t("landing.demoModal.title")}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t("landing.demoModal.desc")}
              </p>
            </div>

            <div>
              <label htmlFor="inst-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                {t("landing.demoModal.schoolLabel")}
              </label>
              <input
                id="inst-name"
                type="text"
                required
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder={t("landing.demoModal.schoolPlaceholder")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label htmlFor="inst-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                {t("landing.demoModal.emailLabel")}
              </label>
              <input
                id="inst-email"
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder={t("landing.demoModal.emailPlaceholder")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label htmlFor="inst-role" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                {t("landing.demoModal.typeLabel")}
              </label>
              <select
                id="inst-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="University / Higher Ed">{t("landing.demoModal.typeHigherEd")}</option>
                <option value="K-12 School / District">{t("landing.demoModal.typeK12")}</option>
                <option value="Language Institute">{t("landing.demoModal.typeInstitute")}</option>
                <option value="Government / Ministry">{t("landing.demoModal.typeGov")}</option>
                <option value="Enterprise / Corporate">{t("landing.demoModal.typeCorporate")}</option>
              </select>
            </div>

            <div>
              <label htmlFor="inst-notes" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                {t("landing.demoModal.goalsLabel")}
              </label>
              <textarea
                id="inst-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("landing.demoModal.goalsPlaceholder")}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {t("landing.demoModal.cancel")}
              </button>
              <button
                type="submit"
                className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 text-xs font-bold shadow-md hover:bg-slate-800 transition"
              >
                {t("landing.demoModal.submit")} →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
