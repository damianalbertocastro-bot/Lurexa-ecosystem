"use client";

import React, { useState } from "react";
import { TeacherWorkspaceBanner } from "../components/TeacherWorkspaceBanner";

interface StudioKnowledgeObject {
  id: string;
  kind: "skill" | "language_form" | "pronunciation_target" | "concept";
  title: string;
  description: string;
  cefrLevels: string[];
  skillDimensions: string[];
  version: number;
}

const INITIAL_KNOWLEDGE_OBJECTS: StudioKnowledgeObject[] = [
  {
    id: "eng.skill.introductions.personal-identity",
    kind: "skill",
    title: "Personal introductions and identity",
    description: "Introducing oneself, sharing country of origin, and responding to formulaic social greetings in English.",
    cefrLevels: ["A1"],
    skillDimensions: ["speaking", "listening", "vocabulary"],
    version: 1,
  },
  {
    id: "eng.grammar.simple-past.regular-form",
    kind: "language_form",
    title: "Regular simple-past form",
    description: "Form and use of regular English verbs in the simple past.",
    cefrLevels: ["A2", "B1"],
    skillDimensions: ["grammar", "reading", "writing", "speaking"],
    version: 1,
  },
  {
    id: "eng.pronunciation.initial-s-consonant-clusters",
    kind: "pronunciation_target",
    title: "Initial /s/ + consonant clusters",
    description: "Intelligible production of English word-initial /s/ clusters without vowel epenthesis, specifically for Dominican Spanish speakers.",
    cefrLevels: ["A1", "A2", "B1", "B2"],
    skillDimensions: ["phonetics", "speaking", "listening"],
    version: 1,
  },
  {
    id: "eng.skill.strategic-negotiation.concessions",
    kind: "skill",
    title: "Strategic commercial negotiations",
    description: "Formulating counter-proposals with diplomatic conditionals and risk mitigation frameworks.",
    cefrLevels: ["B2", "C1"],
    skillDimensions: ["speaking", "listening", "pragmatics"],
    version: 1,
  },
];

export default function LurexaStudioPage() {
  const [activeTab, setActiveTab] = useState<"knowledge-objects" | "lesson-builder" | "branching">("knowledge-objects");
  const [knowledgeObjects, setKnowledgeObjects] = useState<StudioKnowledgeObject[]>(INITIAL_KNOWLEDGE_OBJECTS);
  const [selectedCefrFilter, setSelectedCefrFilter] = useState<string>("all");

  // New Knowledge Object Form State
  const [newId, setNewId] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newKind, setNewKind] = useState<StudioKnowledgeObject["kind"]>("skill");
  const [newCefr, setNewCefr] = useState("A2");
  const [newSkill, setNewSkill] = useState("speaking");
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleCreateKnowledgeObject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim() || !newTitle.trim() || !newDescription.trim()) return;

    const newObj: StudioKnowledgeObject = {
      id: newId.trim(),
      kind: newKind,
      title: newTitle.trim(),
      description: newDescription.trim(),
      cefrLevels: [newCefr],
      skillDimensions: [newSkill],
      version: 1,
    };

    setKnowledgeObjects((prev) => [newObj, ...prev]);
    setShowAddModal(false);
    setNewId("");
    setNewTitle("");
    setNewDescription("");
    setStatusMessage(`Knowledge Object '${newObj.id}' created and registered to Studio catalog.`);
    setTimeout(() => setStatusMessage(""), 4000);
  };

  const filteredObjects =
    selectedCefrFilter === "all"
      ? knowledgeObjects
      : knowledgeObjects.filter((o) => o.cefrLevels.includes(selectedCefrFilter));

  return (
    <>
      <TeacherWorkspaceBanner
        title="Curriculum & Knowledge Authoring"
        subtitle="Lurexa Studio — Instructional Design & Semantic Catalog"
        breadcrumbs={[{ label: "Dashboard", href: "/teacher/dashboard" }, { label: "Studio" }]}
      />

      {/* Tab navigation */}
      <nav className="border-b border-[#dfe6f8] bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2 py-3">
          <button
            onClick={() => setActiveTab("knowledge-objects")}
            className={`rounded-xl px-3.5 py-2 text-xs font-extrabold transition ${activeTab === "knowledge-objects" ? "bg-[#071d67] text-white" : "bg-[#edf1fb] text-[#536ba5] hover:bg-[#dfe6f8]"}`}
          >Knowledge Objects</button>
          <button
            onClick={() => setActiveTab("lesson-builder")}
            className={`rounded-xl px-3.5 py-2 text-xs font-extrabold transition ${activeTab === "lesson-builder" ? "bg-[#071d67] text-white" : "bg-[#edf1fb] text-[#536ba5] hover:bg-[#dfe6f8]"}`}
          >7-Stage Lesson Builder</button>
          <button
            onClick={() => setActiveTab("branching")}
            className={`rounded-xl px-3.5 py-2 text-xs font-extrabold transition ${activeTab === "branching" ? "bg-[#071d67] text-white" : "bg-[#edf1fb] text-[#536ba5] hover:bg-[#dfe6f8]"}`}
          >Branching Scenarios</button>
        </div>
      </nav>

      {/* Main Studio Body */}
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
        {statusMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl bg-[#e4f8f2] p-4 text-sm font-bold text-[#137867]">
            <span>✓</span>
            {statusMessage}
          </div>
        )}

        {/* Tab 1: Knowledge Object Catalog Manager */}
        {activeTab === "knowledge-objects" && (
          <div>
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-[11px] font-extrabold tracking-widest text-[#be185d]">
                  SEMANTIC TAXONOMY
                </p>
                <h2 className="text-3xl font-black tracking-tight">Governed Knowledge Objects</h2>
                <p className="mt-1 text-sm text-[#6677a5]">
                  Author, map, and version semantic knowledge entities across the A1–C1 continuum.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedCefrFilter}
                  onChange={(e) => setSelectedCefrFilter(e.target.value)}
                  aria-label="Filter by CEFR Level"
                  className="rounded-xl border border-[#dfe6f8] bg-white px-3.5 py-2.5 text-xs font-extrabold text-[#071d67] outline-none"
                >
                  <option value="all">All CEFR Levels</option>
                  <option value="A1">A1 Level</option>
                  <option value="A2">A2 Level</option>
                  <option value="B1">B1 Level</option>
                  <option value="B2">B2 Level</option>
                  <option value="C1">C1 Level</option>
                </select>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#be185d] px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#9d174d]"
                >
                  + Add Knowledge Object
                </button>
              </div>
            </div>

            {/* Knowledge Objects Table */}
            <div className="overflow-hidden rounded-2xl border border-[#dfe6f8] bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#dfe6f8] bg-[#f7f9ff] text-xs font-extrabold uppercase tracking-wider text-[#6677a5]">
                  <tr>
                    <th className="px-6 py-4">Semantic ID</th>
                    <th className="px-6 py-4">Title & Description</th>
                    <th className="px-6 py-4">Kind</th>
                    <th className="px-6 py-4">CEFR</th>
                    <th className="px-6 py-4">Skills</th>
                    <th className="px-6 py-4">Version</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf1fb]">
                  {filteredObjects.map((obj) => (
                    <tr key={obj.id} className="hover:bg-[#fbfdff]">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-[#6b2bd9]">
                        {obj.id}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#071d67]">{obj.title}</p>
                        <p className="text-xs text-[#6677a5]">{obj.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-md bg-[#edf1fb] px-2.5 py-1 text-[11px] font-extrabold capitalize text-[#536ba5]">
                          {obj.kind.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-md bg-[#eee9ff] px-2 py-0.5 text-xs font-black text-[#6b2bd9]">
                          {obj.cefrLevels.join(", ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-[#6677a5]">
                        {obj.skillDimensions.join(", ")}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-[#137867]">
                        v{obj.version}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: 7-Stage Interactive Lesson Designer */}
        {activeTab === "lesson-builder" && (
          <div>
            <div className="mb-8">
              <p className="text-[11px] font-extrabold tracking-widest text-[#be185d]">
                PEDAGOGICAL STANDARD
              </p>
              <h2 className="text-3xl font-black tracking-tight">7-Stage Lesson Designer</h2>
              <p className="mt-1 text-sm text-[#6677a5]">
                Design standardized, structured interactive learning objects adhering to Lurexa pedagogy.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { stage: "1. HOOK / MISSION", desc: "Communicative objective & key vocabulary intro" },
                { stage: "2. CONTEXTUAL INPUT", desc: "Model listening dialogue with transcript concealment" },
                { stage: "3. COMPREHENSION", desc: "Formative single-choice check on core meaning" },
                { stage: "4. LANGUAGE NOTICING", desc: "Phonetics & discourse structure noticing" },
                { stage: "5. CREATE & APPLY", desc: "Spoken podcast or written artifact task" },
                { stage: "6. KNOWLEDGE QUIZ", desc: "Formative check evaluating mastery" },
                { stage: "7. REFLECTION", desc: "Lesson wrap-up and Lurexa Coach handoff" },
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-[#dfe6f8] bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#eee9ff] text-xs font-black text-[#6b2bd9]">
                      {idx + 1}
                    </span>
                    <h3 className="text-xs font-black uppercase text-[#071d67]">{item.stage}</h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[#6677a5]">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl bg-[#071d67] p-8 text-white">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-[#8df4ef]">✨</span>
                <h3 className="text-xl font-black">Standardized JSON Schema Architecture</h3>
              </div>
              <p className="mt-2 text-sm text-indigo-100">
                All lesson stages are rendered deterministically across Lurexa Learn and Lurexa Teach
                using standard schema blocks, ensuring complete offline synchronization and zero UI distortion.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Branching Scenarios */}
        {activeTab === "branching" && (
          <div>
            <div className="mb-8">
              <p className="text-[11px] font-extrabold tracking-widest text-[#be185d]">
                DYNAMIC SIMULATIONS
              </p>
              <h2 className="text-3xl font-black tracking-tight">Interactive Branching Scenarios</h2>
              <p className="mt-1 text-sm text-[#6677a5]">
                Create decision-tree dialogue simulations and clinical/workplace scenario nodes.
              </p>
            </div>

            <div className="rounded-2xl border border-[#dfe6f8] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-[#6b2bd9]">🌿</span>
                <h3 className="font-black text-[#071d67]">Node 1: Lab Dilemma Start</h3>
              </div>
              <p className="mt-3 rounded-xl bg-[#f7f9ff] p-4 text-sm font-mono text-[#314b88]">
                A chemical reaction starts bubbling unexpectedly. What is your immediate protocol?
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-[#dfe6f8] p-3 text-xs">
                  <span>Option A: Seal container with cap</span>
                  <span className="rounded-md bg-[#fff0eb] px-2 py-0.5 font-extrabold text-[#d9480f]">
                    Remedial Branch
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#dfe6f8] p-3 text-xs">
                  <span>Option B: Neutralize with buffer solution</span>
                  <span className="rounded-md bg-[#e4f8f2] px-2 py-0.5 font-extrabold text-[#137867]">
                    Correct Branch ✓
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Knowledge Object Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
            <h3 className="text-xl font-black">Create New Knowledge Object</h3>
            <p className="mt-1 text-xs text-[#6677a5]">
              Register a persistent semantic identifier into Lurexa Studio.
            </p>

            <form onSubmit={handleCreateKnowledgeObject} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#6677a5]">Semantic ID</label>
                <input
                  type="text"
                  placeholder="e.g. eng.grammar.reported-speech.statements"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#dfe6f8] p-3 text-xs font-mono font-bold text-[#071d67] outline-none focus:ring-2 focus:ring-[#be185d]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#6677a5]">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Reported speech in formal statements"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#dfe6f8] p-3 text-xs font-bold text-[#071d67] outline-none focus:ring-2 focus:ring-[#be185d]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#6677a5]">Description</label>
                <textarea
                  rows={2}
                  placeholder="Precise linguistic/pedagogical definition..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#dfe6f8] p-3 text-xs text-[#071d67] outline-none focus:ring-2 focus:ring-[#be185d]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-[#6677a5]">Kind</label>
                  <select
                    value={newKind}
                    onChange={(e) => setNewKind(e.target.value as StudioKnowledgeObject["kind"])}
                    className="mt-1 w-full rounded-xl border border-[#dfe6f8] p-2.5 text-xs font-bold text-[#071d67] outline-none"
                  >
                    <option value="skill">Skill</option>
                    <option value="language_form">Language Form</option>
                    <option value="pronunciation_target">Pronunciation</option>
                    <option value="concept">Concept</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#6677a5]">CEFR</label>
                  <select
                    value={newCefr}
                    onChange={(e) => setNewCefr(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#dfe6f8] p-2.5 text-xs font-bold text-[#071d67] outline-none"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#6677a5]">Skill</label>
                  <select
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#dfe6f8] p-2.5 text-xs font-bold text-[#071d67] outline-none"
                  >
                    <option value="speaking">Speaking</option>
                    <option value="listening">Listening</option>
                    <option value="grammar">Grammar</option>
                    <option value="phonetics">Phonetics</option>
                    <option value="reading">Reading</option>
                    <option value="writing">Writing</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-[#dfe6f8] px-4 py-2.5 text-xs font-bold text-[#6677a5] hover:bg-[#f7f9ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#be185d] px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#9d174d]"
                >
                  Save Knowledge Object
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
