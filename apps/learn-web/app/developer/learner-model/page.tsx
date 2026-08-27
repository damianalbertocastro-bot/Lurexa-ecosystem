"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SkillMastery {
  skill: string;
  cefr: string;
  scorePercent: number;
}

interface PhonemeTarget {
  phoneme: string;
  status: "struggling" | "emerging" | "mastered";
  accuracy: number;
  ruleId: string;
}

const SKILL_DATA: SkillMastery[] = [
  { skill: "Speaking", cefr: "B2", scorePercent: 82 },
  { skill: "Listening", cefr: "C1", scorePercent: 88 },
  { skill: "Reading", cefr: "C1", scorePercent: 91 },
  { skill: "Writing", cefr: "B2", scorePercent: 78 },
  { skill: "Grammar", cefr: "B2", scorePercent: 84 },
  { skill: "Vocabulary", cefr: "C1", scorePercent: 89 },
  { skill: "Phonetics", cefr: "B1", scorePercent: 72 },
];

const PHONEME_TARGETS: PhonemeTarget[] = [
  {
    phoneme: "/s/ + consonant epenthesis",
    status: "struggling",
    accuracy: 58,
    ruleId: "DO-ENG-PRO-001",
  },
  {
    phoneme: "Syllable-coda /s/ retention",
    status: "emerging",
    accuracy: 74,
    ruleId: "DO-ENG-PRO-002",
  },
  {
    phoneme: "Interdental /ð/ lenition",
    status: "emerging",
    accuracy: 79,
    ruleId: "DO-ENG-PRO-003",
  },
  {
    phoneme: "Vowel length contrast /iː/ vs /ɪ/",
    status: "mastered",
    accuracy: 94,
    ruleId: "CO-ENG-PRO-001",
  },
];

export default function LearnerModelInspectorPage() {
  const [activeLearnerId] = useState("learner_caribbean_demo_01");
  const [l1Profile] = useState("Dominican Spanish (es-DO)");
  const [overallCefr] = useState("B2 Upper-Intermediate");

  useEffect(() => {
    document.title = "Lurexa Mind Trace & Learner Model Inspector";
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#071d67]">
      {/* Top Inspector Header */}
      <header className="border-b border-[#dfe6f8] bg-white px-6 py-4 shadow-sm sm:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#071d67] to-[#6b2bd9] text-lg font-black text-white shadow-md">
              🧬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#6b2bd9]">
                  Lurexa Mind & Core
                </span>
                <span className="rounded-full bg-[#e4f8f2] px-2 py-0.5 text-[10px] font-extrabold text-[#137867]">
                  Single Learner Model
                </span>
              </div>
              <h1 className="text-lg font-black tracking-tight">Learner Model & Mind Trace Inspector</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-[#dfe6f8] bg-white px-4 py-2 text-xs font-bold text-[#536ba5] hover:bg-[#f7f9ff]"
            >
              ← Back to Learner Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
        {/* Banner Section */}
        <section className="mb-10 rounded-[32px] bg-gradient-to-br from-[#071d67] via-[#162f85] to-[#315fd7] p-8 text-white shadow-xl sm:p-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-extrabold text-[#8df4ef] backdrop-blur-md">
                ✨ REAL-TIME LEARNER STATE VISUALIZATION
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                One Evolving Model. Zero Data Duplication.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-indigo-100">
                Lurexa Core owns trusted identity, records, and evidence persistence. Lurexa Mind
                interprets learning state and computes real-time recommendations.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-lg">
              <span className="text-xs font-bold uppercase text-[#8df4ef]">Active Learner Record</span>
              <p className="mt-1 font-mono text-sm font-black text-white">{activeLearnerId}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/15 pt-3 text-xs">
                <div>
                  <span className="text-indigo-200">L1 Profile:</span>
                  <p className="font-bold text-white">{l1Profile}</p>
                </div>
                <div>
                  <span className="text-indigo-200">Estimated Level:</span>
                  <p className="font-bold text-white">{overallCefr}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7-Skill Mastery & Phoneme Matrices */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* 7 Skills Continuum */}
          <section className="rounded-3xl border border-[#dfe6f8] bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold tracking-widest text-[#6b2bd9]">
                  PEDAGOGICAL PROFICIENCY
                </p>
                <h3 className="text-xl font-black">7-Skill Competency Continuum</h3>
              </div>
              <span className="rounded-full bg-[#eee9ff] px-3 py-1 text-xs font-black text-[#6b2bd9]">
                CEFR A1–C2
              </span>
            </div>

            <div className="space-y-4">
              {SKILL_DATA.map((item) => (
                <div key={item.skill} className="rounded-2xl border border-[#edf1fb] bg-[#fbfdff] p-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-sm font-black text-[#071d67]">{item.skill}</span>
                    <span className="rounded-md bg-[#eee9ff] px-2 py-0.5 font-mono font-black text-[#6b2bd9]">
                      {item.cefr} ({item.scorePercent}%)
                    </span>
                  </div>
                  <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-[#edf1fb]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6b2bd9] to-[#315fd7]"
                      style={{ width: `${item.scorePercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Phonological Interference & Coach History Matrix */}
          <section className="rounded-3xl border border-[#dfe6f8] bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold tracking-widest text-[#d9480f]">
                  PHONETICS & PRONUNCIATION
                </p>
                <h3 className="text-xl font-black">L1 Transfer & Spaced Repetition Queue</h3>
              </div>
              <span className="rounded-full bg-[#fff0eb] px-3 py-1 text-xs font-black text-[#d9480f]">
                Lurexa Coach
              </span>
            </div>

            <div className="space-y-4">
              {PHONEME_TARGETS.map((target) => (
                <div
                  key={target.phoneme}
                  className="flex items-center justify-between rounded-2xl border border-[#edf1fb] bg-[#fbfdff] p-4"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-[#4d5e8c]">
                      {target.ruleId}
                    </span>
                    <p className="text-sm font-black text-[#071d67]">{target.phoneme}</p>
                    <p className="text-xs text-[#4d5e8c]">Accuracy: {target.accuracy}%</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      target.status === "struggling"
                        ? "bg-[#fff0eb] text-[#d9480f]"
                        : target.status === "emerging"
                          ? "bg-[#edf5ff] text-[#2275d7]"
                          : "bg-[#e4f8f2] text-[#137867]"
                    }`}
                  >
                    {target.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>

            {/* Mind Recommendation Callout */}
            <div className="mt-6 rounded-2xl bg-[#071d67] p-5 text-white">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8df4ef]">
                Mind Trace: Active Next Recommendation
              </span>
              <p className="mt-2 text-sm font-bold text-indigo-100">
                &ldquo;Prioritize minimal pair drills contrasting /s/ cluster onsets (DO-ENG-PRO-001) in
                Module 4 before scheduling B2 Capstone Spoken Defense.&rdquo;
              </p>
              <p className="mt-2 text-right font-mono text-[11px] text-[#8df4ef]">
                Confidence: 0.94 • Method: system_inferred
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
