"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { getEcosystemUrl } from "@lurexa/config/domains";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  links?: Array<{ label: string; href: string }>;
  timestamp: string;
}

interface FAQItem {
  question: string;
  answer: string;
  category: "Learn" | "Coach" | "Teach" | "Insight" | "General";
}

const FAQS: FAQItem[] = [
  {
    category: "Learn",
    question: "How do I resume my English lessons?",
    answer:
      "Click 'Resume Learning' on any enrolled course card, or follow the 'Recommended next step' button at the top of your dashboard to continue from your latest milestone.",
  },
  {
    category: "Coach",
    question: "How does Lurexa Coach speaking practice work?",
    answer:
      "Coach provides low-pressure speaking and pronunciation practice tailored for Dominican Spanish speakers learning English. It focuses on intelligibility, stress-timed rhythm, and confidence without forcing accent erasure.",
  },
  {
    category: "Teach",
    question: "How do teacher credentials and growth work in Teach?",
    answer:
      "Lurexa Teach connects your pedagogical practice, classroom evidence, CEFR proficiency growth, and verified micro-credentials in an evolving educator profile governed by Core.",
  },
  {
    category: "Insight",
    question: "What is CEFR Velocity in Lurexa Insight?",
    answer:
      "CEFR Velocity measures empirical time-to-proficiency across cohorts, comparing observed learning acceleration against international CEFR duration guidelines.",
  },
  {
    category: "Learn",
    question: "Can I practice and learn offline without internet?",
    answer:
      "Yes! Lurexa Learn caches downloaded lesson content locally via Dexie.js so you can continue learning during connectivity drops and sync evidence when you are back online.",
  },
  {
    category: "General",
    question: "How do learning streaks and points calculate?",
    answer:
      "Completing at least one lesson or speaking practice per day increments your streak. Every completed lesson awards 10 learning points toward your milestone achievements.",
  },
  {
    category: "General",
    question: "How do I calibrate or take the placement diagnostic?",
    answer:
      "Visit the Placement page at /placement to take the adaptive multi-skill diagnostic. It calibrates your listening, grammar, and pronunciation readiness across A1–C1.",
  },
];

const KNOWLEDGE_RESPONSES: Array<{
  keywords: string[];
  response: string;
  links?: Array<{ label: string; href: string }>;
}> = [
  {
    keywords: ["coach", "speaking", "pronunciation", "accent", "voice", "talk"],
    response:
      "Lurexa Coach is our AI speaking studio. It focuses on communicative intelligibility and spoken confidence for Dominican Spanish speakers learning English. It targets phonological patterns like initial /s/-cluster epenthesis and coda weakening without penalizing your natural accent.",
    links: [{ label: "Open Lurexa Coach ↗", href: "/coach" }],
  },
  {
    keywords: ["resume", "lesson", "course", "learn", "class", "study"],
    response:
      "You can jump straight back into your lessons by navigating to your Learn dashboard and clicking 'Resume Learning' on your active course or selecting your recommended next action.",
    links: [{ label: "Go to Dashboard →", href: "/dashboard" }],
  },
  {
    keywords: ["teach", "educator", "teacher", "credential", "growth"],
    response:
      "Lurexa Teach is dedicated to teacher development. It helps educators elevate CEFR proficiency, earn verified pedagogical credentials, and collaborate with peers.",
    links: [{ label: "Open Lurexa Teach ↗", href: "https://teach.lurexa.org" }],
  },
  {
    keywords: ["offline", "internet", "wifi", "cache", "connection"],
    response:
      "Lurexa Learn supports offline study! Content is automatically cached in your browser using IndexedDB/Dexie.js, allowing you to complete reading and grammar tasks offline. Your evidence will sync automatically once reconnected.",
  },
  {
    keywords: ["placement", "diagnostic", "level", "cefr", "test", "calibrate"],
    response:
      "The adaptive placement diagnostic evaluates your listening, grammar, and pronunciation to calibrate your CEFR standing (from A1 to C1). Once taken, your pathway is tailored to your exact proficiency level.",
    links: [{ label: "Take Placement Diagnostic 🎯", href: "/placement" }],
  },
  {
    keywords: ["insight", "analytics", "data", "report", "cohort", "sla"],
    response:
      "Lurexa Insight provides institutional learning telemetry, longitudinal CEFR progression benchmarks, phonemic error heatmaps, and instructor grading SLA tracking.",
    links: [{ label: "Open Lurexa Insight ↗", href: "https://insight.lurexa.org" }],
  },
  {
    keywords: ["streak", "point", "gamification", "badge", "reward"],
    response:
      "Daily activity keeps your streak alive! Complete at least one lesson, speaking drill, or review session every day to build momentum. Each completed lesson gives you 10 points toward level milestones.",
  },
  {
    keywords: ["contact", "support", "help", "email", "bug", "issue"],
    response:
      "Need hands-on technical or pedagogical support? You can explore our canonical documentation or reach our team at support@lurexa.org.",
    links: [{ label: "Explore Documentation ↗", href: "https://docs.lurexa.org" }],
  },
];

function generateBotResponse(input: string): { text: string; links?: Array<{ label: string; href: string }> } {
  const lower = input.toLowerCase();

  for (const item of KNOWLEDGE_RESPONSES) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return { text: item.response, links: item.links };
    }
  }

  return {
    text: "I can help you with lessons in Learn, speaking in Coach, teacher growth in Teach, institutional analytics in Insight, or CEFR placement diagnostics. What would you like to explore?",
    links: [
      { label: "Placement Diagnostic", href: "/placement" },
      { label: "Lurexa Documentation", href: "https://docs.lurexa.org" },
    ],
  };
}

export function EcosystemSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "faq">("chat");
  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "msg-welcome",
      sender: "bot",
      text: "Hello! I'm your Lurexa Assistant. How can I help your learning or teaching today?",
      timestamp: "Just now",
      links: [
        { label: "Resume Lessons", href: "/dashboard" },
        { label: "Speaking Studio", href: "/coach" },
      ],
    },
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const docsUrl = useMemo(() => {
    try {
      return getEcosystemUrl("docs");
    } catch {
      return "https://docs.lurexa.org";
    }
  }, []);

  // Keyboard shortcut: '?' to toggle help assistant when not focused on an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "?" &&
        !isOpen &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === "chat") {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, activeTab, messages]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputQuery("");

    // Generate responsive reply
    setTimeout(() => {
      const reply = generateBotResponse(query);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: reply.text,
        links: reply.links,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 350);
  };

  const quickPrompts = [
    "How does Coach speaking practice work?",
    "Can I learn offline without internet?",
    "How do teacher credentials work in Teach?",
    "Where is the placement diagnostic?",
  ];

  return (
    <>
      {/* Persistent Floating Bottom-Right Support Button */}
      <aside className="fixed bottom-6 right-6 z-50 select-none" aria-label="Support and AI Assistant">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-600 text-white shadow-2xl shadow-indigo-600/40 transition-all duration-300 hover:scale-110 hover:shadow-indigo-600/50 focus:outline-none focus:ring-4 focus:ring-indigo-400/40"
          aria-label={isOpen ? "Close Lurexa Assistant" : "Open Lurexa Assistant & Support"}
          title="Lurexa Assistant & FAQs (Press ?)"
        >
          <span className="text-2xl transition-transform duration-200 group-hover:scale-110">
            {isOpen ? "✕" : "💬"}
          </span>

          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-teal-500 border-2 border-white" />
            </span>
          )}
        </button>
      </aside>

      {/* Floating Assistant Modal / Window */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6 pointer-events-none"
          role="dialog"
          aria-modal="true"
          aria-label="Lurexa Assistant"
        >
          <div
            className="pointer-events-auto flex flex-col h-[540px] max-h-[85vh] w-full max-w-sm sm:max-w-md rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl shadow-slate-900/20 overflow-hidden transition-all duration-200"
          >
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 px-5 py-3.5 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-base shadow-sm">
                  💬
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">Lurexa Assistant</h3>
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    Ecosystem Intelligence · Online
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-xs font-bold transition"
                  aria-label="Close assistant"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Subheader Navigation Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-5 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={`flex-1 border-b-2 pb-2.5 text-xs font-extrabold transition ${
                  activeTab === "chat"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                🤖 AI Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("faq")}
                className={`flex-1 border-b-2 pb-2.5 text-xs font-extrabold transition ${
                  activeTab === "faq"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                📚 Quick FAQs
              </button>
            </div>

            {/* Window Content */}
            {activeTab === "chat" ? (
              <div className="flex flex-1 flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900/30">
                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-indigo-600 text-white font-medium rounded-tr-xs"
                            : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-normal rounded-tl-xs shadow-xs"
                        }`}
                      >
                        <p>{msg.text}</p>
                        {msg.links && msg.links.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                            {msg.links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.href}
                                className="inline-flex items-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 hover:underline"
                              >
                                {link.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="mt-1 px-1 text-[9px] text-slate-400">{msg.timestamp}</span>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                {/* Quick Prompts */}
                <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5">
                  <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                    {quickPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(prompt)}
                        className="shrink-0 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:bg-white transition"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  {/* Input form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="mt-1 flex items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputQuery}
                      onChange={(e) => setInputQuery(e.target.value)}
                      placeholder="Ask about lessons, speaking, CEFR..."
                      className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      type="submit"
                      disabled={!inputQuery.trim()}
                      className="inline-flex size-8 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xs disabled:opacity-40 hover:bg-indigo-700 transition"
                      aria-label="Send message"
                    >
                      ↑
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* FAQ Mode */
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
                <p className="text-[11px] font-medium text-slate-500">
                  Select a question to view direct guidance across the Lurexa ecosystem.
                </p>

                <div className="space-y-2">
                  {FAQS.map((faq, index) => (
                    <details
                      key={index}
                      className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 text-xs shadow-xs transition"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-slate-900 dark:text-white focus:outline-none">
                        <span className="flex items-center gap-2">
                          <span className="rounded-md bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 text-[9px] font-black text-indigo-600 dark:text-indigo-400">
                            {faq.category}
                          </span>
                          <span>{faq.question}</span>
                        </span>
                        <span className="ml-2 text-slate-400 transition-transform group-open:rotate-180">
                          ▼
                        </span>
                      </summary>
                      <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>

                <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/60 dark:bg-indigo-950/40 p-3.5 text-xs text-indigo-950 dark:text-indigo-200">
                  <p className="font-bold">Need official developer documentation?</p>
                  <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                    Explore curriculum architecture, CEFR specifications, and APIs.
                  </p>
                  <a
                    href={docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Open Lurexa Documentation ↗
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
