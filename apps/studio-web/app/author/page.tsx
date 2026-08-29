"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { StudioAuthoringService } from "@lurexa/backend";
import type { CefrLevel, EnglishSkill } from "@lurexa/types";
import { Button } from "@lurexa/ui/button";
import { Input } from "@lurexa/ui/Input";

const ALL_SKILLS: EnglishSkill[] = [
  "listening",
  "speaking",
  "reading",
  "writing",
  "vocabulary",
  "grammar",
  "phonetics",
];

const CEFR_LEVELS: CefrLevel[] = ["PRE_A1", "A1", "A2", "B1", "B2", "C1", "C2"];

export default function StudioAuthorWorkbenchPage() {
  const [name, setName] = useState("");
  const [cefrLevel, setCefrLevel] = useState<CefrLevel>("A1");
  const [domain, setDomain] = useState<"phonology" | "grammar" | "lexicon" | "pragmatics" | "discourse">("phonology");
  const [culturalContext, setCulturalContext] = useState<"dominican" | "caribbean" | "latin_american" | "global">("dominican");
  const [selectedSkills, setSelectedSkills] = useState<EnglishSkill[]>(["speaking", "phonetics"]);
  const [objective, setObjective] = useState("");
  const [activityType, setActivityType] = useState<"minimal_pairs" | "dialogue_roleplay" | "gap_fill" | "phoneme_shadowing" | "create_and_apply">("phoneme_shadowing");
  const [promptText, setPromptText] = useState("I speak Spanish and study English every day in Santo Domingo.");
  const [l1Rule, setL1Rule] = useState("Final coda s-aspiration and liquid neutralization (/l/ vs /r/).");
  const [articulatoryRemediation, setArticulatoryRemediation] = useState("Maintain alveolar friction and avoid epenthetic /e/ before s-clusters.");

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Real-time CEFR linguistic linter
  const lintReport = useMemo(() => {
    return StudioAuthoringService.lintCefrLinguistics(promptText, cefrLevel);
  }, [promptText, cefrLevel]);

  const toggleSkill = (skill: EnglishSkill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !promptText.trim()) {
      setStatusMessage({ type: "error", text: "Please provide a name and prompt text." });
      return;
    }

    setSaving(true);
    setStatusMessage(null);
    try {
      const draft = await StudioAuthoringService.createKnowledgeObjectDraft(
        { id: "author-studio-user", email: "author@lurexa.org" } as never,
        {
          name,
          cefrLevel,
          domain,
          skills: selectedSkills,
          culturalContext,
          pedagogicalObjective: objective || `Master ${cefrLevel} ${domain} with targeted articulatory clarity.`,
          activityConfig: {
            type: activityType,
            promptText,
            expectedResponses: [promptText],
          },
          l1InterferenceRule: {
            dialectCode: culturalContext === "dominican" ? "es-DO" : "es-419",
            phonologicalRule: l1Rule,
            articulatoryRemediation,
          },
        }
      );

      setStatusMessage({
        type: "success",
        text: `Knowledge Object Draft "${draft.name}" (v${draft.version}) stored in Core with ID: ${draft.id}`,
      });
      setName("");
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to create draft in Core.",
      });
    } finally {
      setSaving(false);
    }
  };

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
            Knowledge Object Authoring Workbench
          </h1>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            Compose structured, CEFR-aligned learning objects. Real-time linguistic analysis validates vocabulary complexity and syllable codas before storage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/catalog"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50"
          >
            Browse Catalog
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div
          role="alert"
          className={`rounded-2xl p-4 text-xs font-bold border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleCreateDraft} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form: Authoring Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900">1. Object Identity &amp; CEFR Level</h2>

            <div className="space-y-1.5">
              <label htmlFor="ko-name" className="block text-xs font-bold text-slate-700">
                Knowledge Object Name
              </label>
              <Input
                id="ko-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Initial S-Cluster Friction & Coda Preservation"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label htmlFor="ko-cefr" className="block text-xs font-bold text-slate-700">
                  Target CEFR Level
                </label>
                <select
                  id="ko-cefr"
                  value={cefrLevel}
                  onChange={(e) => setCefrLevel(e.target.value as CefrLevel)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                >
                  {CEFR_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="ko-domain" className="block text-xs font-bold text-slate-700">
                  Linguistic Domain
                </label>
                <select
                  id="ko-domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as never)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="phonology">Phonology</option>
                  <option value="grammar">Grammar</option>
                  <option value="lexicon">Lexicon</option>
                  <option value="pragmatics">Pragmatics</option>
                  <option value="discourse">Discourse</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="ko-context" className="block text-xs font-bold text-slate-700">
                  Cultural Context
                </label>
                <select
                  id="ko-context"
                  value={culturalContext}
                  onChange={(e) => setCulturalContext(e.target.value as never)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="dominican">Dominican (es-DO)</option>
                  <option value="caribbean">Caribbean</option>
                  <option value="latin_american">Latin American</option>
                  <option value="global">Global Context</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-700">Preserved English Skills</span>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map((skill) => {
                  const active = selectedSkills.includes(skill);
                  return (
                    <Button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition capitalize ${
                        active
                          ? "bg-amber-600 text-white shadow-xs"
                          : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {skill}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ko-obj" className="block text-xs font-bold text-slate-700">
                Pedagogical Objective
              </label>
              <textarea
                id="ko-obj"
                rows={2}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Explicit communicative goal (e.g. Articulate /sp/ and /st/ onsets without leading vowels in spontaneous answers)"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900">2. Activity &amp; Phonological Rule</h2>

            <div className="space-y-1.5">
              <label htmlFor="ko-act-type" className="block text-xs font-bold text-slate-700">
                Activity Type
              </label>
              <select
                id="ko-act-type"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as never)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800"
              >
                <option value="phoneme_shadowing">Phoneme Shadowing (Speaking/Phonetics)</option>
                <option value="minimal_pairs">Minimal Pairs Discrimination</option>
                <option value="dialogue_roleplay">Dialogue Roleplay</option>
                <option value="gap_fill">Contextual Gap Fill</option>
                <option value="create_and_apply">Create &amp; Apply Task</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ko-prompt" className="block text-xs font-bold text-slate-700">
                Prompt Text / Model Spoken Sentence
              </label>
              <textarea
                id="ko-prompt"
                rows={3}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="ko-l1-rule" className="block text-xs font-bold text-slate-700">
                  L1 Interference Rule
                </label>
                <Input
                  id="ko-l1-rule"
                  type="text"
                  value={l1Rule}
                  onChange={(e) => setL1Rule(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="ko-remedy" className="block text-xs font-bold text-slate-700">
                  Articulatory Remediation
                </label>
                <Input
                  id="ko-remedy"
                  type="text"
                  value={articulatoryRemediation}
                  onChange={(e) => setArticulatoryRemediation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-amber-600 py-3 text-xs font-black text-white shadow-sm transition hover:bg-amber-700 active:scale-95 disabled:opacity-50"
              >
                {saving ? "Saving to Core..." : "💾 Save Knowledge Object Draft to Core"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel: Live Linguistic Linter & Diagnostic Analysis */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">CEFR Linguistic Linter</h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase ${
                  lintReport.isApproved
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {lintReport.isApproved ? "Approved ✓" : "Needs Refinement ⚠"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <span className="block text-[10px] font-bold text-slate-500 uppercase">Target</span>
                <span className="text-xl font-black text-slate-900">{lintReport.targetCefr}</span>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <span className="block text-[10px] font-bold text-slate-500 uppercase">Calculated</span>
                <span className="text-xl font-black text-amber-600">{lintReport.calculatedCefrScore}</span>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <span className="block text-[10px] font-bold text-slate-500 uppercase">Words</span>
                <span className="text-xl font-black text-slate-900">{lintReport.totalWords}</span>
              </div>
            </div>

            {/* Band Distribution */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-700">Vocabulary Band Distribution</span>
              <div className="space-y-1.5">
                {Object.entries(lintReport.vocabularyBandPercentages).map(([band, pct]) => (
                  <div key={band} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                      <span>Band {band}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Syntactic Complexity */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Syntactic Complexity Score</span>
                <span>{(lintReport.syntacticComplexityScore * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${lintReport.syntacticComplexityScore * 100}%` }}
                />
              </div>
            </div>

            {/* Out of Level Words */}
            {lintReport.outOfLevelWords.length > 0 && (
              <div className="space-y-1.5">
                <span className="block text-xs font-bold text-rose-700">
                  Out-of-Level Vocabulary ({lintReport.outOfLevelWords.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {lintReport.outOfLevelWords.map((word) => (
                    <span
                      key={word}
                      className="rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-[11px] font-bold text-rose-800"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="space-y-1.5 border-t border-slate-100 pt-3">
              <span className="block text-xs font-bold text-slate-700">Pedagogical Recommendations</span>
              <ul className="space-y-1 text-xs text-slate-600 list-disc pl-4">
                {lintReport.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
