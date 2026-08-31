"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TeachService } from "@lurexa/backend";
import type { TeachEvidenceSubmission } from "@lurexa/types";
import { TeachShell } from "../components/TeachShell";
import { TeachPrivate } from "../components/TeachPrivate";
import { useTeachAuth } from "../components/TeachAuthProvider";
import { Button } from "@lurexa/ui/button";
import { Input } from "@lurexa/ui/Input";

interface PathwayTrack {
  id: string;
  name: string;
  category: string;
  currentLevel: number; // 1 to 5
  targetLevel: number;
  description: string;
  nextMilestone: string;
  recommendedCourseId?: string;
  recommendedCourseTitle?: string;
}

const T_LEVEL_LABELS: Record<number, { code: string; title: string; desc: string }> = {
  1: { code: "T1", title: "Foundation", desc: "Emerging educator · Pedagogical awareness & classroom English" },
  2: { code: "T2", title: "Practitioner", desc: "Developing educator · Evidence-backed scaffolding & pronunciation" },
  3: { code: "T3", title: "Proficient", desc: "Accomplished educator · CEFR C1 mastery & AI differentiation" },
  4: { code: "T4", title: "Specialist", desc: "Master educator · Curriculum sequencing & peer coaching" },
  5: { code: "T5", title: "Lead Fellow", desc: "Educational leader · Assessment leadership & institutional design" },
};

function GrowthContent() {
  const { user, profile } = useTeachAuth();
  const search = useSearchParams();
  const [evidence, setEvidence] = useState<TeachEvidenceSubmission[]>([]);
  const [showForm, setShowForm] = useState(Boolean(search.get("moduleId")));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCompetency, setSelectedCompetency] = useState("speaking-instruction");
  const [targetTLevel, setTargetTLevel] = useState("T2");
  const [type, setType] = useState<TeachEvidenceSubmission["type"]>("reflection");
  const [resourceUrl, setResourceUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      TeachService.listEvidence(user.uid)
        .then(setEvidence)
        .catch((err) => setError(err instanceof Error ? err.message : "Evidence could not be loaded."));
    }
  }, [user]);

  const competencyMap = useMemo(
    () => new Map(profile?.competencies.map((item) => [item.id, item]) ?? []),
    [profile]
  );

  const pathwayTracks: PathwayTrack[] = useMemo(
    () => [
      {
        id: "professional-english",
        name: "Professional English Proficiency",
        category: "Language Mastery",
        currentLevel: profile?.cefrLevel === "C1" || profile?.cefrLevel === "C2" ? 3 : 2,
        targetLevel: profile?.targetCefrLevel === "C2" ? 5 : profile?.targetCefrLevel === "C1" ? 4 : 3,
        description: "Instructional clarity, nuanced feedback delivery, academic discourse, and professional meetings.",
        nextMilestone: "Complete C1 performance checkpoint and submit simulated parent-teacher feedback.",
        recommendedCourseId: "english-educators-b2-c1",
        recommendedCourseTitle: "English for educators: B2 → C1",
      },
      {
        id: "pronunciation-pedagogy",
        name: "Pronunciation & L1-Transfer Pedagogy",
        category: "Instructional Practice",
        currentLevel: competencyMap.get("pronunciation-pedagogy")?.level ?? 2,
        targetLevel: 4,
        description: "Intelligibility-first coaching, Dominican Spanish transfer diagnosis, acoustic closure without accent erasure.",
        nextMilestone: "Submit recorded simulation of corrective recasting during spontaneous student talk.",
        recommendedCourseId: "pronunciation-clearer-instruction",
        recommendedCourseTitle: "Pronunciation for clearer instruction",
      },
      {
        id: "speaking-instruction",
        name: "Speaking Instruction & Task Design",
        category: "Instructional Practice",
        currentLevel: competencyMap.get("speaking-instruction")?.level ?? 2,
        targetLevel: 4,
        description: "Maximizing meaningful student talk time, interactive scaffolding, and communicative flow.",
        nextMilestone: "Design and implement a structured conversation task with authentic student evidence.",
        recommendedCourseId: "teaching-speaking-confidence",
        recommendedCourseTitle: "Teaching speaking with confidence",
      },
      {
        id: "assessment-for-learning",
        name: "Formative Assessment & Rubrics",
        category: "Assessment & Evidence",
        currentLevel: competencyMap.get("assessment-for-learning")?.level ?? 1,
        targetLevel: 3,
        description: "Transparent criteria, non-punitive formative evaluation, and turning feedback into next actions.",
        nextMilestone: "Publish a 4-tier communicative speaking rubric with observable descriptors.",
        recommendedCourseId: "assessment-supports-learning",
        recommendedCourseTitle: "Assessment that supports learning",
      },
      {
        id: "ai-literacy",
        name: "Responsible Classroom AI & Digital Pedagogy",
        category: "AI & Digital Literacy",
        currentLevel: competencyMap.get("ai-literacy")?.level ?? 2,
        targetLevel: 4,
        description: "Pedagogical prompt engineering, output verification, and AI-scaffolded lesson differentiation.",
        nextMilestone: "Audit an AI-generated learning object against CEFR A1 Dominican Spanish transfer standards.",
        recommendedCourseId: "ai-literacy-language-teachers",
        recommendedCourseTitle: "AI literacy for language teachers",
      },
      {
        id: "asynchronous-design",
        name: "Curriculum Sequencing & Asynchronous Design",
        category: "Course Design",
        currentLevel: competencyMap.get("asynchronous-design")?.level ?? 1,
        targetLevel: 3,
        description: "Sequencing cognitive and language load, structured asynchronous tasks, and Create & Apply integration.",
        nextMilestone: "Redesign one full learning module to balance input, rehearsal, and authentic production.",
        recommendedCourseId: "designing-asynchronous-learning",
        recommendedCourseTitle: "Designing asynchronous learning",
      },
    ],
    [profile, competencyMap]
  );

  const dimensions = [
    [
      "English Proficiency",
      profile?.cefrLevel ?? "B2",
      profile?.targetCefrLevel ? `Target CEFR ${profile.targetCefrLevel}` : "Set a target CEFR goal",
    ],
    [
      "Teaching Competencies",
      `${pathwayTracks.filter((t) => t.currentLevel >= 2).length} / ${pathwayTracks.length} Active`,
      "Evidence-backed T1–T5 progression",
    ],
    [
      "Verified Evidence",
      `${evidence.filter((e) => e.status === "verified").length} Verified`,
      `${evidence.filter((e) => e.status === "submitted").length} Under review`,
    ],
    [
      "Professional Network",
      String(profile?.communityContributionScore ?? 120),
      "Community contribution points",
    ],
  ];

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setBusy(true);
    setError("");
    setSuccessMessage("");
    try {
      const item = await TeachService.submitEvidence({
        userId: user.uid,
        title: title.trim(),
        description: `${description.trim()}\n\n[Pathway Target: ${targetTLevel} · Competency: ${selectedCompetency}]`,
        type,
        competencyIds: [selectedCompetency],
        courseId: search.get("courseId") || undefined,
        moduleId: search.get("moduleId") || undefined,
        resourceUrl: resourceUrl.trim() || undefined,
        status: "submitted",
      });
      setEvidence((current) => [item, ...current]);
      setTitle("");
      setDescription("");
      setResourceUrl("");
      setShowForm(false);
      setSuccessMessage("Evidence submitted successfully for professional review!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evidence could not be submitted.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <TeachShell active="Growth">
      <TeachPrivate>
        <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8">
          {/* Header & Product Boundary Banner */}
          <section className="grid gap-7 lg:grid-cols-[1fr_.75fr] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[var(--lx-surface)] px-3.5 py-1 text-xs font-black uppercase tracking-[.15em] text-[var(--lx-primary)]">
                  EDUCATOR PROFESSIONAL PATHWAYS
                </span>
                <span className="rounded-full bg-[var(--lx-surface)] px-3 py-1 text-xs font-bold text-[var(--lx-success)]">
                  T1–T5 Growth Framework
                </span>
              </div>
              <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-.055em] sm:text-6xl text-[var(--color-brand-navy)]">
                One evolving record of the educator you are becoming.
              </h1>
            </div>
            <div>
              <p className="max-w-xl text-base leading-7 text-[var(--lx-muted)]">
                Lurexa Teach empowers your career progression through verified competency pathways, authentic evidence reflections, and institutional credentials.
              </p>
              {/* Clean Single-Identity Bridge to Learn Classroom */}
              <div className="mt-4 rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-4 text-xs text-[var(--lx-ink)] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <b className="font-bold text-[var(--color-brand-navy)]">Need to manage your student classes?</b>
                  <p className="mt-0.5 text-[var(--lx-muted)]">Classrooms, assignments, and learner analytics belong to Lurexa Learn.</p>
                </div>
                <a
                  href="/teacher/dashboard"
                  className="rounded-xl bg-[var(--lx-primary)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90 transition"
                >
                  Open Learn Classroom →
                </a>
              </div>
            </div>
          </section>

          {/* Quick Metrics */}
          <section className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dimensions.map(([name, value, detail]) => (
              <article key={name} className="rounded-[26px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm">
                <p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[var(--lx-muted)]">{name}</p>
                <b className="mt-3 block text-2xl tracking-[-.04em] text-[var(--color-brand-navy)]">{value}</b>
                <p className="mt-2 text-sm leading-6 text-[var(--lx-muted)]">{detail}</p>
              </article>
            ))}
          </section>

          {/* T1–T5 Pathways Matrix */}
          <section className="mt-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">COMPETENCY PROGRESSION</p>
                <h2 className="mt-1 text-2xl font-black text-[var(--color-brand-navy)]">T1–T5 Educator Growth Tracks</h2>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-[var(--lx-muted)]">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <span key={lvl} className="rounded-lg bg-[var(--lx-surface)] border border-[var(--lx-border)] px-2.5 py-1">
                    <strong className="text-[var(--lx-primary)]">{T_LEVEL_LABELS[lvl].code}</strong>: {T_LEVEL_LABELS[lvl].title}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {pathwayTracks.map((track) => {
                const currentInfo = T_LEVEL_LABELS[track.currentLevel];
                const targetInfo = T_LEVEL_LABELS[track.targetLevel];
                return (
                  <article
                    key={track.id}
                    className="flex flex-col justify-between rounded-[28px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-sm hover:shadow-md transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--lx-muted)]">
                          {track.category}
                        </span>
                        <span className="rounded-full bg-[var(--lx-surface)] px-2.5 py-1 text-xs font-black text-[var(--lx-primary)]">
                          {currentInfo.code} · {currentInfo.title}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-[var(--color-brand-navy)]">{track.name}</h3>
                      <p className="mt-2 text-xs leading-5 text-[var(--lx-muted)]">{track.description}</p>

                      {/* Level Step Bar */}
                      <div className="mt-5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[var(--lx-muted)] mb-1.5">
                          <span>Stage: <strong>{currentInfo.code}</strong></span>
                          <span>Target: <strong className="text-[var(--lx-primary)]">{targetInfo.code}</strong></span>
                        </div>
                        <div className="flex gap-1.5 h-2">
                          {[1, 2, 3, 4, 5].map((step) => (
                            <div
                              key={step}
                              className={`flex-1 rounded-full ${
                                step <= track.currentLevel
                                  ? "bg-gradient-to-r from-[var(--lx-primary)] to-[var(--lx-secondary)]"
                                  : step <= track.targetLevel
                                  ? "bg-indigo-100"
                                  : "bg-[var(--lx-canvas)]"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Next Milestone Box */}
                      <div className="mt-5 rounded-2xl bg-[var(--lx-surface)] border border-[var(--lx-border)] p-3.5">
                        <p className="text-[10px] font-black uppercase tracking-wider text-[var(--lx-muted)]">Next Action:</p>
                        <p className="mt-1 text-xs font-semibold text-[var(--color-brand-navy)] leading-relaxed">
                          {track.nextMilestone}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-[var(--lx-border)] pt-4 flex items-center justify-between gap-3">
                      {track.recommendedCourseId ? (
                        <Link
                          href={`/courses/${track.recommendedCourseId}`}
                          className="text-xs font-bold text-[var(--lx-secondary)] hover:underline"
                        >
                          Course Module →
                        </Link>
                      ) : <span />}
                      <Button
                        type="button"
                        onClick={() => {
                          setSelectedCompetency(track.id);
                          setTargetTLevel(`T${track.currentLevel + 1}`);
                          setShowForm(true);
                        }}
                        className="rounded-xl bg-[var(--lx-surface)] px-3 py-1.5 text-xs font-bold text-[var(--lx-primary)] hover:bg-[var(--lx-surface)] transition"
                      >
                        + Submit Evidence
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Evidence Portfolio Section */}
          <section className="mt-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">EVIDENCE PORTFOLIO</p>
                <h2 className="mt-1 text-2xl font-black text-[var(--color-brand-navy)]">Proof of Growth, Not Just Claims</h2>
              </div>
              <Button
                type="button"
                onClick={() => setShowForm((value) => !value)}
                className="min-h-11 rounded-xl bg-gradient-to-r from-[var(--lx-primary)] to-[var(--lx-secondary)] px-6 text-sm font-extrabold text-white shadow-md hover:opacity-90 transition"
              >
                {showForm ? "Close Form" : "+ Submit Evidence"}
              </Button>
            </div>

            {successMessage ? (
              <p role="status" className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-bold text-emerald-900">
                ✓ {successMessage}
              </p>
            ) : null}

            {showForm && (
              <form onSubmit={submit} className="mt-6 rounded-[28px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-md animate-in fade-in duration-200">
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="text-sm font-extrabold text-[var(--lx-muted)]">
                    <div className="flex items-center justify-between">
                      <span>Evidence Title</span>
                      <span className={`text-[10px] font-bold ${title.trim().length >= 5 ? "text-[var(--lx-success)]" : "text-[var(--lx-muted)]"}`}>
                        {title.trim().length >= 5 ? "✓ Ready" : `${Math.max(0, 5 - title.trim().length)} more chars`}
                      </span>
                    </div>
                    <Input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-2 min-h-12 w-full rounded-xl border border-[var(--lx-border)] px-4 text-sm"
                      placeholder="e.g. Dominican Spanish Pronunciation Recast"
                    />
                  </label>

                  <label className="text-sm font-extrabold text-[var(--lx-muted)]">
                    Target Competency
                    <select
                      value={selectedCompetency}
                      onChange={(e) => setSelectedCompetency(e.target.value)}
                      className="mt-2 min-h-12 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-4 text-sm text-[var(--color-brand-navy)]"
                    >
                      <option value="speaking-instruction">Speaking Instruction</option>
                      <option value="pronunciation-pedagogy">Pronunciation Pedagogy</option>
                      <option value="professional-english">Professional English</option>
                      <option value="assessment-for-learning">Formative Assessment</option>
                      <option value="ai-literacy">AI Literacy &amp; Digital Pedagogy</option>
                      <option value="asynchronous-design">Asynchronous Design</option>
                    </select>
                  </label>

                  <label className="text-sm font-extrabold text-[var(--lx-muted)]">
                    Evidence Type
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as TeachEvidenceSubmission["type"])}
                      className="mt-2 min-h-12 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-4 text-sm text-[var(--color-brand-navy)]"
                    >
                      <option value="reflection">Pedagogical Reflection</option>
                      <option value="artifact">Lesson Artifact / Rubric</option>
                      <option value="practice">Recorded Teaching Simulation</option>
                      <option value="peer-contribution">Peer Community Review</option>
                    </select>
                  </label>
                </div>

                {/* Contextual Guidance Banner */}
                <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3.5 text-xs text-indigo-950 dark:border-indigo-900/40 dark:bg-indigo-950/30 dark:text-indigo-200">
                  <span className="font-extrabold text-[var(--lx-primary)]">💡 Quality Guidance: </span>
                  {selectedCompetency === "pronunciation-pedagogy" && "Highlight L1-transfer diagnostic identification (e.g. Dominican Spanish vowel shifts, consonant cluster epenthesis) and corrective recast feedback."}
                  {selectedCompetency === "speaking-instruction" && "Focus on communicative fluency, scaffolded turn-taking, and active student retrieval time over passive listening."}
                  {selectedCompetency === "professional-english" && "Demonstrate workplace communicative readiness, executive register shifting, and professional feedback delivery."}
                  {selectedCompetency === "assessment-for-learning" && "Showcase formative exit tickets, rubric alignment, and actionable feedback loops."}
                  {selectedCompetency === "ai-literacy" && "Highlight purposeful integration of AI tools for lesson enrichment, speech practice, or differentiated scaffolds."}
                  {selectedCompetency === "asynchronous-design" && "Demonstrate structured modular activities, multimodal instructions, and clear evidence submission milestones."}
                </div>

                <label className="mt-4 block text-sm font-extrabold text-[var(--lx-muted)]">
                  <div className="flex items-center justify-between">
                    <span>Pedagogical Context &amp; Reflection</span>
                    <span className={`text-[10px] font-bold ${description.trim().length >= 20 ? "text-[var(--lx-success)]" : "text-[var(--lx-muted)]"}`}>
                      {description.trim().length}/20 min chars {description.trim().length >= 20 ? "✓" : ""}
                    </span>
                  </div>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 min-h-32 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-4 text-sm text-[var(--color-brand-navy)] placeholder:text-[var(--lx-muted)]"
                    placeholder="Describe the instructional setting, what pedagogical decision you made, and what verified capability this demonstrates."
                  />
                </label>

                <label className="mt-4 block text-sm font-extrabold text-[var(--lx-muted)]">
                  Resource URL <span className="font-medium text-[var(--lx-muted)]">(Optional video, audio, or document link)</span>
                  <Input
                    type="url"
                    value={resourceUrl}
                    onChange={(e) => setResourceUrl(e.target.value)}
                    className="mt-2 min-h-12 w-full rounded-xl border border-[var(--lx-border)] px-4 text-sm"
                    placeholder="https://..."
                  />
                </label>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--lx-border)] pt-4">
                  <p className="text-xs font-bold text-[var(--lx-muted)]">
                    Submissions are logged into your persistent educator record and evaluated against standard rubrics.
                  </p>
                  <Button
                    disabled={busy || title.trim().length < 5 || description.trim().length < 20}
                    className="min-h-11 rounded-xl bg-[var(--lx-primary)] px-6 text-sm font-extrabold text-white disabled:opacity-50 hover:bg-[var(--lx-primary)] transition"
                  >
                    {busy ? "Submitting…" : "Submit for Professional Review"}
                  </Button>
                </div>
              </form>
            )}

            {error && (
              <p role="alert" className="mt-5 rounded-2xl bg-[var(--lx-destructive)] p-4 text-sm font-bold text-[var(--lx-destructive)]">
                {error}
              </p>
            )}

            <section className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
              <article className="rounded-[28px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-sm">
                <h3 className="text-base font-extrabold text-[var(--color-brand-navy)] mb-4">Submitted Evidence Records</h3>
                {evidence.length ? (
                  evidence.map((item) => (
                    <div
                      key={item.id}
                      className="mt-4 first:mt-0 border-t first:border-t-0 border-[var(--lx-border)] pt-4 first:pt-0"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <b className="text-sm font-bold text-[var(--color-brand-navy)]">{item.title}</b>
                          <p className="mt-1 text-xs leading-5 text-[var(--lx-muted)] whitespace-pre-wrap">
                            {item.description}
                          </p>
                          <p className="mt-2 text-[11px] font-bold text-[var(--lx-muted)]">
                            {item.type.replaceAll("-", " ")} · {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-extrabold capitalize ${
                            item.status === "verified"
                              ? "bg-[var(--lx-surface)] text-[var(--lx-success)]"
                              : item.status === "rejected"
                              ? "bg-[var(--lx-destructive)] text-[var(--lx-destructive)]"
                              : "bg-[var(--lx-surface)] text-[var(--lx-primary)]"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl bg-[var(--lx-surface)] p-5 text-sm leading-6 text-[var(--lx-muted)]">
                    No professional evidence has been submitted yet. Submit an artifact or reflection from any competency card above.
                  </p>
                )}
              </article>

              <aside className="rounded-[28px] bg-[var(--lx-warning)] border border-[var(--lx-warning)] p-7 shadow-sm">
                <p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-warning)]">PROFESSIONAL GOALS</p>
                <h3 className="mt-2 text-xl font-black text-[var(--lx-warning)]">What matters next?</h3>
                {profile?.goals.length ? (
                  profile.goals.map((goal) => (
                    <div key={goal} className="mt-4 border-t border-[var(--lx-warning)] pt-4">
                      <b className="text-sm text-[var(--lx-warning)]">{goal}</b>
                    </div>
                  ))
                ) : (
                  <>
                    <p className="mt-3 text-xs leading-5 text-[var(--lx-muted)]">
                      Set focused goals on your educator profile to receive targeted recommendations and credential milestones.
                    </p>
                    <Link
                      href="/profile"
                      className="mt-4 inline-flex items-center text-xs font-extrabold text-[var(--lx-warning)] hover:underline"
                    >
                      Edit Educator Profile →
                    </Link>
                  </>
                )}
              </aside>
            </section>
          </section>
        </main>
      </TeachPrivate>
    </TeachShell>
  );
}

export default function GrowthPage() {
  return (
    <Suspense
      fallback={
        <div role="status" className="min-h-screen bg-[var(--lx-surface)] px-5 py-20 text-center text-sm font-bold text-[var(--lx-muted)]">
          Loading educator growth pathways…
        </div>
      }
    >
      <GrowthContent />
    </Suspense>
  );
}
