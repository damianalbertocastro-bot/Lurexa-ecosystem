"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { StudioAuthoringService } from "@lurexa/backend";
import type { CefrLevel, EnglishSkill } from "@lurexa/types";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/button";
import { Input } from "@lurexa/ui/Input";
import { StudioShell } from "../components/StudioShell";

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
    <StudioShell active="Author Workbench">
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 space-y-8">
        {/* Header */}
        <section className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--lx-border)] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xs font-bold text-[var(--lx-primary)] hover:underline">
                ← Studio Dashboard
              </Link>
              <span className="text-[var(--lx-muted)]">/</span>
              <span className="text-xs text-[var(--lx-muted)]">Author Workbench</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-[-0.04em] text-[var(--lx-ink)]">
              Author Knowledge Object
            </h1>
            <p className="text-xs sm:text-sm text-[var(--lx-muted)]">
              Compose immutable, CEFR-aligned learning objects with real-time linguistic frequency linting and Dominican Spanish L1 remediation rules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/catalog">
              <Button
                variant="secondary"
                className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-4 py-2 text-xs font-bold text-[var(--lx-ink)] hover:bg-[var(--lx-canvas)]"
              >
                Browse Catalog
              </Button>
            </Link>
          </div>
        </section>

        {statusMessage && (
          <div
            className={`animate-spring-pop rounded-2xl border p-4 text-xs font-bold shadow-xs ${
              statusMessage.type === "success"
                ? "border-[var(--lx-border)] bg-[var(--lx-surface)] text-[var(--lx-primary)]"
                : "border-[var(--lx-destructive)] bg-[var(--lx-destructive-surface)] text-[var(--lx-destructive)]"
            }`}
          >
            {statusMessage.type === "success" ? "✓ " : "✕ "}
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleCreateDraft} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6 sm:p-8 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] space-y-6">
              <h2 className="text-base font-black text-[var(--lx-ink)]">Asset Metadata &amp; Objectives</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="object-name" className="text-xs font-bold text-[var(--lx-ink)]">
                    Asset Name *
                  </label>
                  <Input
                    id="object-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Dominican /s/-Cluster Intelligibility Drill"
                    className="mt-1 text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="cefr-select" className="text-xs font-bold text-[var(--lx-ink)]">
                      Target CEFR Level
                    </label>
                    <select
                      id="cefr-select"
                      value={cefrLevel}
                      onChange={(e) => setCefrLevel(e.target.value as CefrLevel)}
                      className="mt-1 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 py-2 text-xs font-bold text-[var(--lx-ink)]"
                    >
                      {CEFR_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="domain-select" className="text-xs font-bold text-[var(--lx-ink)]">
                      Linguistic Domain
                    </label>
                    <select
                      id="domain-select"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value as never)}
                      className="mt-1 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 py-2 text-xs font-bold text-[var(--lx-ink)]"
                    >
                      <option value="phonology">Phonology</option>
                      <option value="grammar">Grammar</option>
                      <option value="lexicon">Lexicon</option>
                      <option value="pragmatics">Pragmatics</option>
                      <option value="discourse">Discourse</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="cultural-select" className="text-xs font-bold text-[var(--lx-ink)]">
                      Cultural Context
                    </label>
                    <select
                      id="cultural-select"
                      value={culturalContext}
                      onChange={(e) => setCulturalContext(e.target.value as never)}
                      className="mt-1 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 py-2 text-xs font-bold text-[var(--lx-ink)]"
                    >
                      <option value="dominican">Dominican Republic (es-DO)</option>
                      <option value="caribbean">Caribbean (es-PR/es-CU)</option>
                      <option value="latin_american">Latin American (es-419)</option>
                      <option value="global">Global International</option>
                    </select>
                  </div>
                </div>

                {/* 7-Skill Checkbox Selector */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[var(--lx-ink)]">Targeted Skills (7 Dimensions)</span>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SKILLS.map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <Button
                          key={skill}
                          type="button"
                          variant={isSelected ? "primary" : "secondary"}
                          size="sm"
                          onClick={() => toggleSkill(skill)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition ${
                            isSelected
                              ? "bg-[var(--lx-primary)] text-white shadow-xs"
                              : "border-[var(--lx-border)] bg-[var(--lx-canvas)] text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
                          }`}
                        >
                          {skill}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="pedagogical-objective" className="text-xs font-bold text-[var(--lx-ink)]">
                    Pedagogical Objective
                  </label>
                  <Input
                    id="pedagogical-objective"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="e.g., Enable A1 learners to pronounce s-initial words without epenthetic 'e'"
                    className="mt-1 text-xs"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 sm:p-8 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] space-y-6">
              <h2 className="text-base font-black text-[var(--lx-ink)]">Activity &amp; Prompt Configuration</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="activity-type" className="text-xs font-bold text-[var(--lx-ink)]">
                    Activity Interaction Type
                  </label>
                  <select
                    id="activity-type"
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as never)}
                    className="mt-1 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 py-2 text-xs font-bold text-[var(--lx-ink)]"
                  >
                    <option value="phoneme_shadowing">Phoneme Shadowing &amp; Acoustic Mimicry</option>
                    <option value="minimal_pairs">Contrastive Minimal Pair Drill</option>
                    <option value="dialogue_roleplay">Guided Dialogue Role-Play</option>
                    <option value="gap_fill">Contextual Gap Fill</option>
                    <option value="create_and_apply">Stage 7 Create &amp; Apply Task</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="prompt-text" className="text-xs font-bold text-[var(--lx-ink)]">
                    Model Prompt / Spoken Passage Text *
                  </label>
                  <textarea
                    id="prompt-text"
                    rows={4}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3 text-xs font-mono text-[var(--lx-ink)] leading-relaxed focus:border-[var(--lx-primary)] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="l1-rule" className="text-xs font-bold text-[var(--lx-ink)]">
                      L1 Phonological Rule
                    </label>
                    <Input
                      id="l1-rule"
                      value={l1Rule}
                      onChange={(e) => setL1Rule(e.target.value)}
                      className="mt-1 text-xs"
                    />
                  </div>

                  <div>
                    <label htmlFor="articulatory-remediation" className="text-xs font-bold text-[var(--lx-ink)]">
                      Articulatory Cue
                    </label>
                    <Input
                      id="articulatory-remediation"
                      value={articulatoryRemediation}
                      onChange={(e) => setArticulatoryRemediation(e.target.value)}
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-[var(--lx-primary)] py-3 text-xs font-black text-white shadow-xs hover:opacity-95 transition"
                >
                  {saving ? "Saving to Core..." : "Save Knowledge Object Draft to Core →"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Real-Time CEFR Linguistic Linter */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="sticky top-24 p-6 sm:p-8 border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--lx-border)] pb-4">
                <div>
                  <h3 className="font-black text-[var(--lx-ink)]">CEFR Linguistic Linter</h3>
                  <p className="text-[11px] text-[var(--lx-muted)]">Real-time linguistic density diagnostics</p>
                </div>
                <Badge
                  variant={lintReport.isApproved ? "success" : "warning"}
                  className="text-xs font-bold uppercase"
                >
                  {lintReport.isApproved ? "Approved ✓" : "Review ⚠"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--lx-muted)]">
                    Syntactic Complexity
                  </span>
                  <p className="mt-1 text-2xl font-black text-[var(--lx-ink)]">
                    {Math.round(lintReport.syntacticComplexityScore * 100)}/100
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--lx-muted)]">
                    Word Count
                  </span>
                  <p className="mt-1 text-2xl font-black text-[var(--lx-ink)]">
                    {lintReport.totalWords}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[var(--lx-ink)]">Vocabulary CEFR Band Breakdown</span>
                <div className="space-y-1.5 text-xs">
                  {Object.entries(lintReport.vocabularyBandPercentages).map(([level, pct]) => (
                    <div key={level} className="flex items-center justify-between">
                      <span className="font-mono text-[var(--lx-muted)]">{level.replace("_", "/")} Words:</span>
                      <span className="font-bold text-[var(--lx-ink)]">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {lintReport.outOfLevelWords.length > 0 && (
                <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-4 space-y-2">
                  <span className="text-xs font-bold text-[var(--lx-warning)]">
                    ⚠ Out of Band Words for {cefrLevel}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {lintReport.outOfLevelWords.map((w, idx) => (
                      <Badge key={idx} variant="warning" className="font-mono text-[10px]">
                        {w}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3 text-[11px] text-[var(--lx-muted)] leading-relaxed">
                💡 <b>Lurexa Core Governance:</b> Published Knowledge Objects become immutable and receive deterministic cryptographic version hashes (`v1.0.0`).
              </div>
            </Card>
          </div>
        </form>
      </div>
    </StudioShell>
  );
}
