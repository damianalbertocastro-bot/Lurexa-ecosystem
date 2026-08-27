"use client";

import React, { useEffect, useMemo, useState } from "react";

export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  category: "Navigation" | "Learning" | "Teaching" | "Preferences";
  action: () => void;
  keywords?: string[];
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (href: string) => void;
}

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigate = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    } else if (typeof window !== "undefined") {
      window.location.href = href;
    }
  };

  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: "nav-dashboard",
        title: "Learner Dashboard",
        subtitle: "View current progress, streak, and daily learning path",
        icon: "🏠",
        category: "Navigation",
        keywords: ["home", "stats", "today"],
        action: () => navigate("/dashboard"),
      },
      {
        id: "nav-coach",
        title: "Lurexa Coach",
        subtitle: "Interactive AI speaking & pronunciation space",
        icon: "🎙️",
        category: "Learning",
        keywords: ["speaking", "pronunciation", "voice", "practice"],
        action: () => navigate("/coach"),
      },
      {
        id: "nav-placement",
        title: "CEFR Placement Test",
        subtitle: "Diagnostic multi-skill proficiency evaluation",
        icon: "🎯",
        category: "Learning",
        keywords: ["assessment", "diagnostic", "level", "test"],
        action: () => navigate("/placement"),
      },
      {
        id: "nav-teacher-dash",
        title: "Educator Dashboard",
        subtitle: "Manage classes, student progression, and interventions",
        icon: "👩‍🏫",
        category: "Teaching",
        keywords: ["teacher", "classes", "educator"],
        action: () => navigate("/teacher/dashboard"),
      },
      {
        id: "nav-studio",
        title: "Curriculum Studio",
        subtitle: "Knowledge objects, 7-stage builder, and branching catalog",
        icon: "📐",
        category: "Teaching",
        keywords: ["studio", "authoring", "lessons"],
        action: () => navigate("/teacher/studio"),
      },

      {
        id: "nav-theme",
        title: "Toggle Dark / Light Theme",
        subtitle: "Switch appearance mode",
        icon: "🌓",
        category: "Preferences",
        keywords: ["dark", "light", "mode", "color"],
        action: () => {
          const current = document.documentElement.getAttribute("data-theme") || "light";
          const next = current === "light" ? "dark" : "light";
          document.documentElement.setAttribute("data-theme", next);
          localStorage.setItem("lurexa-theme", next);
        },
      },
    ],
    [onNavigate],
  );

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle?.toLowerCase().includes(q) ||
        c.keywords?.some((k) => k.toLowerCase().includes(q)),
    );
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, filteredCommands, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 p-4 pt-20 backdrop-blur-sm sm:pt-28">
      <div className="animate-scale-in relative w-full max-w-xl overflow-hidden rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-2xl">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 border-b border-[var(--lx-border)] px-5 py-4">
          <span className="text-lg">🔍</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, course, or workspace to jump to…"
            className="flex-1 bg-transparent text-sm font-semibold text-[var(--lx-ink)] outline-none placeholder:text-slate-400"
          />
          <kbd className="rounded-lg border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-2 py-0.5 text-[10px] font-bold text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Command Items List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition duration-150 ${
                    isSelected
                      ? "bg-[var(--lx-canvas)] text-[var(--lx-ink)] ring-1 ring-[var(--lx-border)]"
                      : "text-slate-600 hover:bg-[var(--lx-canvas)]/50"
                  }`}
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-800 text-lg border border-slate-100 dark:border-slate-700">
                    {cmd.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[var(--lx-ink)]">{cmd.title}</p>
                    {cmd.subtitle && (
                      <p className="truncate text-[11px] text-[var(--lx-muted)]">{cmd.subtitle}</p>
                    )}
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching commands or pages found for &quot;{query}&quot;.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-[var(--lx-border)] bg-[var(--lx-canvas)] px-4 py-2.5 text-[11px] font-semibold text-slate-500">
          <span>Navigate with ↑ ↓ and Enter</span>
          <span className="text-[10px]">Lurexa Universal Search</span>
        </div>
      </div>
    </div>
  );
}
