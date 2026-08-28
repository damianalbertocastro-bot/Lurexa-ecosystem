"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { TeacherWorkspaceBanner } from "../components/TeacherWorkspaceBanner";
import {
  StudioAuthoringService,
  type StudioKnowledgeObjectDraftV1,
  type CefrLinguisticValidationReportV1,
  type EnglishSkill,
} from "@lurexa/backend";
import { auth } from "@lurexa/backend";
import type { CefrLevel } from "@lurexa/types";

const ALL_SKILLS: EnglishSkill[] = [
  "listening",
  "speaking",
  "reading",
  "writing",
  "vocabulary",
  "grammar",
  "phonetics",
];

export default function LurexaStudioPage() {
  const [knowledgeObjects, setKnowledgeObjects] = useState<StudioKnowledgeObjectDraftV1[]>([]);
  const [loading, setLoading] = useState(true);

  // Authoring Form State
  const [name, setName] = useState("");
  const [cefrLevel, setCefrLevel] = useState<CefrLevel>("A1");
  const [domain, setDomain] = useState<StudioKnowledgeObjectDraftV1["domain"]>("phonology");
  const [selectedSkills, setSelectedSkills] = useState<EnglishSkill[]>(["phonetics", "speaking"]);
  const [culturalContext, setCulturalContext] = useState<StudioKnowledgeObjectDraftV1["culturalContext"]>("dominican");
  const [objective, setObjective] = useState("");
  const [promptText, setPromptText] = useState("Repeat after the audio model: 'Special students speak softly.'");
  const [activityType, setActivityType] = useState<StudioKnowledgeObjectDraftV1["activityConfig"]["type"]>("phoneme_shadowing");
  const [l1Rule, setL1Rule] = useState("Prosthesis /e/ prevention before /sC/ clusters.");

  // Linting State derived directly from promptText and cefrLevel
  const lintReport: CefrLinguisticValidationReportV1 = useMemo(
    () => StudioAuthoringService.lintCefrLinguistics(promptText, cefrLevel),
    [promptText, cefrLevel]
  );
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    void StudioAuthoringService.listKnowledgeObjects().then((list) => {
      if (!ignore) {
        setKnowledgeObjects(list);
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
  }, []);

  const toggleSkill = (skill: EnglishSkill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    const actor = user ? { uid: user.uid, id: user.uid, email: user.email || "" } : { uid: "author-lead", id: "author-lead", email: "author@lurexa.org" };

    setSaving(true);
    setStatusMessage(null);
    try {
      await StudioAuthoringService.createKnowledgeObjectDraft(actor as never, {
        name,
        cefrLevel,
        domain,
        skills: selectedSkills,
        culturalContext,
        pedagogicalObjective: objective,
        activityConfig: {
          type: activityType,
          promptText,
          expectedResponses: [promptText],
        },
        l1InterferenceRule: {
          dialectCode: culturalContext === "dominican" ? "es-DO" : "es-419",
          phonologicalRule: l1Rule,
          articulatoryRemediation: "Pre-exhale alveolar friction.",
        },
      });

      setName("");
      setObjective("");
      const updated = await StudioAuthoringService.listKnowledgeObjects();
      setKnowledgeObjects(updated);
      setStatusMessage("Knowledge Object Draft successfully created and stored in Core.");
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : "Failed to create draft.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (id: string) => {
    const user = auth.currentUser;
    const actor = user ? { uid: user.uid, id: user.uid, email: user.email || "" } : { uid: "reviewer-lead", id: "reviewer-lead", email: "reviewer@lurexa.org" };

    setStatusMessage(null);
    try {
      await StudioAuthoringService.publishKnowledgeObject(actor as never, id);
      const updated = await StudioAuthoringService.listKnowledgeObjects();
      setKnowledgeObjects(updated);
      setStatusMessage("Knowledge Object approved and published to immutable production catalog.");
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : "Publishing failed.");
    }
  };

  return (
    <>
      <TeacherWorkspaceBanner
        title="Lurexa Studio: Knowledge Object Authoring"
        subtitle="Author, lint, and publish immutable CEFR-aligned learning objects and articulatory remediation activities."
        actions={
          <>
            <Link href="/teacher/dashboard" className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20">
              ← Teacher Dashboard
            </Link>
          </>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <p className="text-xs font-black uppercase tracking-[.14em]">Studio prototype · local preview only</p>
          <h1 className="mt-2 text-2xl font-black">Knowledge Object Authoring Workbench</h1>
          <p className="mt-2 max-w-4xl text-sm leading-7">
            This workbench demonstrates knowledge object authoring and real-time CEFR linguistic linting. It has not been saved to Core or published to Studio.
          </p>
        </section>

        {statusMessage && (
          <div role="status" className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-xs font-bold text-indigo-900">
            {statusMessage}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          {/* Authoring Form */}
          <form onSubmit={handleCreateDraft} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-600">AUTHORING WORKBENCH</p>
              <h2 className="text-xl font-bold text-slate-900">Create Knowledge Object</h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Knowledge Object Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Regular Simple Past /-ed/ Coda Articulation"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CEFR Level</label>
                <select
                  value={cefrLevel}
                  onChange={(e) => setCefrLevel(e.target.value as CefrLevel)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none"
                >
                  <option value="A1">A1 - Foundations</option>
                  <option value="A2">A2 - Elementary</option>
                  <option value="B1">B1 - Threshold</option>
                  <option value="B2">B2 - Vantage</option>
                  <option value="C1">C1 - Advanced</option>
                  <option value="C2">C2 - Mastery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Activity Type</label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value as StudioKnowledgeObjectDraftV1["activityConfig"]["type"])}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none"
                >
                  <option value="phoneme_shadowing">Phoneme Shadowing</option>
                  <option value="coda_drill">Coda Articulation Drill</option>
                  <option value="minimal_pair_discrimination">Minimal Pair Discrimination</option>
                  <option value="connected_speech_flow">Connected Speech Flow</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as StudioKnowledgeObjectDraftV1["domain"])}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none"
                >
                  <option value="phonology">Phonology &amp; Prosody</option>
                  <option value="grammar">Grammar &amp; Syntax</option>
                  <option value="lexicon">Lexicon &amp; Idioms</option>
                  <option value="pragmatics">Pragmatics &amp; Culture</option>
                  <option value="discourse">Discourse Strategy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cultural Context</label>
                <select
                  value={culturalContext}
                  onChange={(e) => setCulturalContext(e.target.value as StudioKnowledgeObjectDraftV1["culturalContext"])}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none"
                >
                  <option value="dominican">Dominican (es-DO)</option>
                  <option value="caribbean">Caribbean</option>
                  <option value="latin_american">Latin American</option>
                  <option value="global">International</option>
                </select>
              </div>
            </div>

            {/* 7 English Skills Checkbox Array */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Preserved English Skills (The 7 Skills)</label>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition ${
                      selectedSkills.includes(skill)
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pedagogical Objective</label>
              <textarea
                rows={2}
                required
                placeholder="Declare explicit communicative and articulatory purpose…"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">L1 Interference &amp; Articulatory Rule</label>
              <input
                type="text"
                value={l1Rule}
                onChange={(e) => setL1Rule(e.target.value)}
                placeholder="e.g. Coda deletion of /-d/ and /-t/ in regular past tense verbs."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Learner Prompt Text &amp; Dialogue</label>
              <textarea
                rows={3}
                required
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-mono outline-none focus:border-indigo-600"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={saving}>
              Save Knowledge Object Draft
            </Button>
          </form>

          {/* Real-time CEFR Linguistic Linter */}
          <div className="space-y-6">
            <Card title="CEFR Linguistic Linter" subtitle="Real-time vocabulary frequency and syntax analyzer">
              {lintReport && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="font-bold text-slate-600">Linguistic Gate:</span>
                    <Badge variant={lintReport.isApproved ? "success" : "warning"}>
                      {lintReport.isApproved ? "✓ CEFR Approved" : "⚠ Review Recommendations"}
                    </Badge>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700">Vocabulary Band Distribution:</span>
                    <div className="grid grid-cols-4 gap-2 mt-2 font-mono text-center">
                      <div className="rounded-xl bg-emerald-50 p-2 text-emerald-800">
                        <p className="text-[10px] font-bold">A1 Band</p>
                        <p className="text-base font-black">{lintReport.vocabularyBandPercentages.A1}%</p>
                      </div>
                      <div className="rounded-xl bg-blue-50 p-2 text-blue-800">
                        <p className="text-[10px] font-bold">A2 Band</p>
                        <p className="text-base font-black">{lintReport.vocabularyBandPercentages.A2}%</p>
                      </div>
                      <div className="rounded-xl bg-amber-50 p-2 text-amber-800">
                        <p className="text-[10px] font-bold">B1/B2</p>
                        <p className="text-base font-black">{lintReport.vocabularyBandPercentages.B1 + lintReport.vocabularyBandPercentages.B2}%</p>
                      </div>
                      <div className="rounded-xl bg-rose-50 p-2 text-rose-800">
                        <p className="text-[10px] font-bold">C1/C2</p>
                        <p className="text-base font-black">{lintReport.vocabularyBandPercentages.C1_C2}%</p>
                      </div>
                    </div>
                  </div>

                  {lintReport.outOfLevelWords.length > 0 && (
                    <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-rose-900">
                      <p className="font-bold mb-1">Flagged Out-of-Level Words:</p>
                      <p className="font-mono text-[11px]">{lintReport.outOfLevelWords.join(", ")}</p>
                    </div>
                  )}

                  {lintReport.recommendations.length > 0 && (
                    <div className="rounded-xl bg-slate-50 p-3 text-slate-700 space-y-1">
                      <p className="font-bold">Pedagogical Recommendations:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                        {lintReport.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Interactive Previewer */}
            <Card title="Activity Runtime Preview" subtitle="How this will render in Learn &amp; Coach">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-indigo-700">Type: {activityType}</span>
                  <Badge variant="info">{cefrLevel}</Badge>
                </div>
                <p className="text-xs font-bold text-slate-800">&ldquo;{promptText}&rdquo;</p>
                <div className="rounded-xl bg-white p-3 text-[11px] font-mono text-slate-600 border border-slate-200">
                  Target Phonemes: [s], [st], [sp] · L1 Remediation: {l1Rule}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Catalog of Authored Knowledge Objects */}
        <Card title="Knowledge Object Production Catalog" subtitle="Immutable Core curriculum library">
          {loading ? (
            <p className="py-6 text-sm text-slate-500 text-center">Loading Knowledge Objects…</p>
          ) : knowledgeObjects.length === 0 ? (
            <p className="py-6 text-sm text-slate-500 text-center">No knowledge objects authored yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {knowledgeObjects.map((ko) => (
                <div key={ko.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">{ko.name}</span>
                      <Badge variant="info">{ko.cefrLevel}</Badge>
                      <Badge variant={ko.status === "published" ? "success" : "warning"}>
                        v{ko.version} · {ko.status}
                      </Badge>
                      <Badge variant="neutral">{ko.domain}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 max-w-2xl">{ko.pedagogicalObjective}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {ko.skills.map((s) => (
                        <span key={s} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {ko.status === "draft" && (
                      <Button variant="primary" size="sm" onClick={() => void handlePublish(ko.id)}>
                        Approve &amp; Publish →
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </>
  );
}
