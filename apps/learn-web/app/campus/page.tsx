"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getEcosystemUrl } from "@lurexa/config/domains";

interface CampusDepartment {
  id: string;
  name: string;
  enrolledStudents: number;
  activeFaculty: number;
  primaryTrack: string;
}

const DEPARTMENTS: CampusDepartment[] = [
  {
    id: "dept-languages",
    name: "Department of Modern Languages & English Studies",
    enrolledStudents: 340,
    activeFaculty: 18,
    primaryTrack: "English A1–C1 Language Continuum",
  },
  {
    id: "dept-engineering",
    name: "School of Engineering & Applied Technology",
    enrolledStudents: 520,
    activeFaculty: 24,
    primaryTrack: "Technical & Professional English B2",
  },
  {
    id: "dept-business",
    name: "Faculty of International Business & Economics",
    enrolledStudents: 410,
    activeFaculty: 16,
    primaryTrack: "Executive Negotiations & C1 Fluency",
  },
];

export default function CampusWorkspacePage() {
  const [selectedDept, setSelectedDept] = useState<string>("dept-languages");
  const [activeOrgName] = useState("Universidad Autónoma de Santo Domingo (UASD)");
  const [accentColor] = useState("#6b2bd9");

  const currentDepartment =
    DEPARTMENTS.find((d) => d.id === selectedDept) ?? DEPARTMENTS[0];

  useEffect(() => {
    document.title = `Lurexa Campus — ${activeOrgName}`;
  }, [activeOrgName]);

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#071d67]">
      {/* Institutional Co-Branded Top Header */}
      <header className="border-b border-[#dfe6f8] bg-white px-6 py-4 shadow-sm sm:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-xl text-lg font-black text-white shadow-md"
              style={{ backgroundColor: accentColor }}
            >
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#6b2bd9]">
                  Lurexa Campus
                </span>
                <span className="rounded-full bg-[#e4f8f2] px-2 py-0.5 text-[10px] font-extrabold text-[#137867]">
                  Accredited Institution
                </span>
              </div>
              <h1 className="text-lg font-black tracking-tight">{activeOrgName}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-[#4d5e8c]">Signed in as Academic Leader</p>
              <p className="text-xs font-extrabold text-[#071d67]">Institutional Single Sign-On</p>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#eee9ff] text-sm font-black text-[#6b2bd9]">
              UA
            </div>
          </div>
        </div>
      </header>

      {/* Main Campus Workspace Body */}
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
        {/* Welcome & Department Switcher Section */}
        <section className="mb-10 rounded-[32px] bg-gradient-to-br from-[#071d67] via-[#162f85] to-[#315fd7] p-8 text-white shadow-xl sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-extrabold text-[#8df4ef] backdrop-blur-md">
                ✨ UNIFIED INSTITUTIONAL WORKSPACE
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                One campus. Every specialized Lurexa tool.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-indigo-100">
                Welcome to your unified academic gateway. Access specialized products tailored to
                student delivery, faculty development, speaking labs, and macro analytics.
              </p>
            </div>

            {/* Department / Academic Unit Selector Card */}
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-lg">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#8df4ef]">
                Active Department / Academic Unit
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/20 bg-white/20 p-3 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-[#8df4ef]"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id} className="bg-[#071d67] text-white">
                    {dept.name}
                  </option>
                ))}
              </select>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 text-xs font-bold text-indigo-100">
                <div>
                  <span className="text-indigo-200">Enrolled Students:</span>
                  <p className="text-base font-black text-white">
                    {currentDepartment?.enrolledStudents ?? 0}
                  </p>
                </div>
                <div>
                  <span className="text-indigo-200">Active Faculty:</span>
                  <p className="text-base font-black text-white">
                    {currentDepartment?.activeFaculty ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Product Entitlement Launcher Grid */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold tracking-widest text-[#6b2bd9]">
                INSTITUTIONAL PRODUCT SUITE
              </p>
              <h3 className="text-2xl font-black tracking-tight">Available Entitlements</h3>
            </div>
            <span className="text-xs font-bold text-[#4d5e8c]">
              Seamless Single-Use Product Bridges
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Lurexa Learn */}
            <article className="flex flex-col justify-between rounded-3xl border border-[#dfe6f8] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eee9ff] text-xl font-black text-[#6b2bd9]">
                    📖
                  </div>
                  <span className="rounded-full bg-[#e4f8f2] px-3 py-1 text-xs font-extrabold text-[#137867]">
                    Active Entitlement
                  </span>
                </div>
                <h4 className="mt-5 text-xl font-black">Lurexa Learn</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#4d5e8c]">
                  Student course runner, 8-module interactive curriculum tracks (A1 through C1),
                  formative checks, and teacher classroom workspace.
                </p>
              </div>
              <div className="mt-6 border-t border-[#edf1fb] pt-4">
                <Link
                  href="/dashboard"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#071d67] py-3 text-sm font-extrabold text-white transition hover:bg-[#162f85]"
                >
                  Enter Learn Workspace →
                </Link>
              </div>
            </article>

            {/* Lurexa Teach */}
            <article className="flex flex-col justify-between rounded-3xl border border-[#dfe6f8] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e9fbf9] text-xl font-black text-[#137d7f]">
                    🎓
                  </div>
                  <span className="rounded-full bg-[#e4f8f2] px-3 py-1 text-xs font-extrabold text-[#137867]">
                    Active Entitlement
                  </span>
                </div>
                <h4 className="mt-5 text-xl font-black">Lurexa Teach</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#4d5e8c]">
                  Faculty professional development, teacher CEFR advancement, T1–T5
                  micro-credentialing, peer review, and public credential verification.
                </p>
              </div>
              <div className="mt-6 border-t border-[#edf1fb] pt-4">
                <a
                  href={getEcosystemUrl("teach")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#071d67] py-3 text-sm font-extrabold text-white transition hover:bg-[#162f85]"
                >
                  Enter Teach Portal →
                </a>
              </div>
            </article>

            {/* Lurexa Coach */}
            <article className="flex flex-col justify-between rounded-3xl border border-[#dfe6f8] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0eb] text-xl font-black text-[#d9480f]">
                    🎙️
                  </div>
                  <span className="rounded-full bg-[#e4f8f2] px-3 py-1 text-xs font-extrabold text-[#137867]">
                    Active Entitlement
                  </span>
                </div>
                <h4 className="mt-5 text-xl font-black">Lurexa Coach</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#4d5e8c]">
                  AI speaking & pronunciation lab with Dominican Spanish linguistic transfer
                  intelligence, real-time intervention policies, and turn privacy redaction.
                </p>
              </div>
              <div className="mt-6 border-t border-[#edf1fb] pt-4">
                <Link
                  href="/coach"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#071d67] py-3 text-sm font-extrabold text-white transition hover:bg-[#162f85]"
                >
                  Open Speaking Lab →
                </Link>
              </div>
            </article>

            {/* Lurexa Insight */}
            <article className="flex flex-col justify-between rounded-3xl border border-[#dfe6f8] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#edf5ff] text-xl font-black text-[#2275d7]">
                    📊
                  </div>
                  <span className="rounded-full bg-[#e4f8f2] px-3 py-1 text-xs font-extrabold text-[#137867]">
                    Active Entitlement
                  </span>
                </div>
                <h4 className="mt-5 text-xl font-black">Lurexa Insight</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#4d5e8c]">
                  Academic cohort progression, diagnostic placement outcomes, retention trends, and
                  teacher intervention status filtering.
                </p>
              </div>
              <div className="mt-6 border-t border-[#edf1fb] pt-4">
                <Link
                  href="/teacher/insights"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#071d67] py-3 text-sm font-extrabold text-white transition hover:bg-[#162f85]"
                >
                  View Macro Analytics →
                </Link>
              </div>
            </article>

            {/* Lurexa Studio */}
            <article className="flex flex-col justify-between rounded-3xl border border-[#dfe6f8] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fdf2f8] text-xl font-black text-[#be185d]">
                    🧭
                  </div>
                  <span className="rounded-full bg-[#e4f8f2] px-3 py-1 text-xs font-extrabold text-[#137867]">
                    Active Entitlement
                  </span>
                </div>
                <h4 className="mt-5 text-xl font-black">Lurexa Studio</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#4d5e8c]">
                  Instructional design suite for authoring Knowledge Objects, interactive lesson
                  stages, and custom assessment rubrics.
                </p>
              </div>
              <div className="mt-6 border-t border-[#edf1fb] pt-4">
                <Link
                  href="/teacher/studio"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#071d67] py-3 text-sm font-extrabold text-white transition hover:bg-[#162f85]"
                >
                  Open Studio Authoring →
                </Link>
              </div>
            </article>

            {/* Lurexa Admin */}
            <article className="flex flex-col justify-between rounded-3xl border border-[#dfe6f8] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f5f3ff] text-xl font-black text-[#7c3aed]">
                    🛡️
                  </div>
                  <span className="rounded-full bg-[#e4f8f2] px-3 py-1 text-xs font-extrabold text-[#137867]">
                    Superadmin / Registrar
                  </span>
                </div>
                <h4 className="mt-5 text-xl font-black">Lurexa Admin</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#4d5e8c]">
                  Campus tenant administration, user role assignments, license seat allocations, and
                  governance security compliance audit.
                </p>
              </div>
              <div className="mt-6 border-t border-[#edf1fb] pt-4">
                <a
                  href={getEcosystemUrl("admin")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#071d67] py-3 text-sm font-extrabold text-white transition hover:bg-[#162f85]"
                >
                  Enter Admin Console →
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* Security & Identity Governance Callout */}
        <section className="mt-12 rounded-[28px] border border-[#dfe6f8] bg-white p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-[#137867]">✓</span>
            <h3 className="text-xl font-black">One Institutional Identity. Zero Data Duplication.</h3>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4d5e8c]">
            Lurexa Campus operates as an institutional experience shell. All learner records, educator
            credentials, and linguistic observations are owned by Lurexa Core and interpreted by
            Lurexa Mind through explicit, secure contracts.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-extrabold text-[#536ba5]">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f7f9ff] px-3 py-2">
              👥 Multi-Tenant Role Isolation
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f7f9ff] px-3 py-2">
              🛡️ Core Security Boundaries Enforced
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
