"use client";

import React, { useEffect, useState, useRef } from "react";
import type { NavigationDomain, WorkspaceKey } from "./types";
import { ECOSYSTEM_NAVIGATION_REGISTRY } from "./registry";
import { MasterMark } from "../MasterMark";
import { Avatar } from "../Avatar";

export interface GlobalDockTier1Props {
  activeDomain: NavigationDomain;
  activeWorkspaceKey?: WorkspaceKey;
  onSelectDomain: (domain: NavigationDomain, workspaceKey?: WorkspaceKey) => void;
  userDisplayName?: string;
  userEmail?: string;
  onOpenSettings?: () => void;
  className?: string;
}

export function GlobalDockTier1({
  activeDomain,
  activeWorkspaceKey,
  onSelectDomain,
  userDisplayName = "Damian Castro",
  userEmail = "damianalbertocastro@gmail.com",
  onOpenSettings,
  className = "",
}: GlobalDockTier1Props) {
  const [quickPopoverOpen, setQuickPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Global Keyboard Shortcuts (Cmd/Ctrl + 1..5)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Command (Mac) or Control (Windows/Linux) is pressed
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "1") {
          e.preventDefault();
          onSelectDomain("workspaces", "coach");
        } else if (e.key === "2") {
          e.preventDefault();
          onSelectDomain("workspaces", "teach");
        } else if (e.key === "3") {
          e.preventDefault();
          onSelectDomain("workspaces", "studio");
        } else if (e.key === "4") {
          e.preventDefault();
          onSelectDomain("workspaces", "insight");
        } else if (e.key === "5") {
          e.preventDefault();
          onSelectDomain("docs");
        } else if (e.key === "0") {
          e.preventDefault();
          onSelectDomain("marketing");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSelectDomain]);

  // Click outside to close quick popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setQuickPopoverOpen(false);
      }
    };
    if (quickPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [quickPopoverOpen]);

  const workspaces = Object.values(ECOSYSTEM_NAVIGATION_REGISTRY.workspaces);

  return (
    <aside
      aria-label="Ecosystem Dock"
      className={`relative z-40 flex h-full w-14 shrink-0 flex-col items-center justify-between border-r border-slate-800 bg-[#0B0F19] py-3 text-slate-400 select-none ${className}`}
    >
      {/* Top: Monogram Logo (Clicks to Public Marketing) */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => onSelectDomain("marketing")}
          title="Lurexa Public Ecosystem (Cmd+0)"
          aria-label="Lurexa Home & Marketing"
          className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-teal-500/20 text-white transition hover:scale-105 hover:from-indigo-500/30 hover:to-teal-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <MasterMark className="h-6 w-6" />
          {/* Active indicator if Marketing is active */}
          {activeDomain === "marketing" && (
            <span className="absolute -left-3 top-2 bottom-2 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          )}
          {/* Tooltip */}
          <span className="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs font-bold text-white shadow-xl group-hover:inline-block border border-slate-700">
            Lurexa Marketing <span className="ml-1 text-[10px] text-slate-400">⌘0</span>
          </span>
        </button>
      </div>

      {/* Middle Section (Scrollable): Workspaces & Knowledge */}
      <div className="flex flex-1 flex-col items-center gap-4 overflow-y-auto overflow-x-hidden py-4 scrollbar-none w-full">
        {/* Section Header: Workspaces */}
        <div className="w-full px-2 text-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">
            APPS
          </span>
          <div className="my-1.5 h-px w-6 mx-auto bg-slate-800" />
        </div>

        {/* Workspace Icon Buttons */}
        <div className="flex flex-col items-center gap-2.5 w-full">
          {workspaces.map((ws) => {
            const isActive = activeDomain === "workspaces" && activeWorkspaceKey === ws.id;
            return (
              <button
                key={ws.id}
                type="button"
                onClick={() => onSelectDomain("workspaces", ws.id)}
                aria-label={ws.name}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold transition-all duration-150 ${
                  isActive
                    ? "bg-white text-slate-950 shadow-md shadow-indigo-500/20"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                {/* Active Pill Indicator */}
                {isActive && (
                  <span
                    className="absolute -left-3 top-1.5 bottom-1.5 w-1 rounded-r-full shadow-[0_0_10px_currentColor]"
                    style={{ backgroundColor: ws.accentColor, color: ws.accentColor }}
                  />
                )}

                {/* Workspace Monogram/Icon */}
                <span>
                  {ws.id === "coach" && "🗣️"}
                  {ws.id === "teach" && "🎓"}
                  {ws.id === "studio" && "🛠️"}
                  {ws.id === "insight" && "📊"}
                </span>

                {/* Tooltip with Shortcut */}
                <span className="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs font-bold text-white shadow-xl group-hover:inline-block border border-slate-700">
                  {ws.name} <span className="ml-1 text-[10px] text-slate-400">⌘{ws.shortcutNumber}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Section Header: Knowledge / Docs */}
        <div className="w-full px-2 text-center mt-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">
            DOCS
          </span>
          <div className="my-1.5 h-px w-6 mx-auto bg-slate-800" />
        </div>

        {/* System Docs Button */}
        <button
          type="button"
          onClick={() => onSelectDomain("docs")}
          aria-label="Technical Governance & Docs"
          aria-current={activeDomain === "docs" ? "page" : undefined}
          className={`group relative flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold transition-all duration-150 ${
            activeDomain === "docs"
              ? "bg-white text-slate-950 shadow-md shadow-teal-500/20"
              : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          {activeDomain === "docs" && (
            <span className="absolute -left-3 top-1.5 bottom-1.5 w-1 rounded-r-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          )}
          <span>🏛️</span>
          <span className="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs font-bold text-white shadow-xl group-hover:inline-block border border-slate-700">
            System Docs <span className="ml-1 text-[10px] text-slate-400">⌘5</span>
          </span>
        </button>
      </div>

      {/* Bottom Section: Quick-Toggle Popover & User Avatar */}
      <div className="flex flex-col items-center gap-3 pt-2">
        {/* External / Public Site Quick-Toggle Popover Trigger */}
        <div className="relative">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setQuickPopoverOpen((prev) => !prev)}
            aria-label="Ecosystem Quick Switcher"
            title="Ecosystem Quick Switcher"
            className={`group relative flex h-9 w-9 items-center justify-center rounded-xl transition ${
              quickPopoverOpen
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs font-bold text-white shadow-xl group-hover:inline-block border border-slate-700">
              Ecosystem Quick Switcher
            </span>
          </button>

          {/* Quick-Toggle Popover Menu */}
          {quickPopoverOpen && (
            <div
              ref={popoverRef}
              className="absolute bottom-0 left-14 z-50 w-64 rounded-2xl border border-slate-700 bg-slate-900 p-3 shadow-2xl text-xs space-y-2 animate-fade-slide-up"
            >
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2">
                Switch Product / Port
              </p>
              <div className="space-y-1">
                {[
                  { label: "Lurexa Learn (3001)", href: "http://localhost:3001", icon: "📚" },
                  { label: "Lurexa Coach (3005)", href: "http://localhost:3005", icon: "🗣️" },
                  { label: "Lurexa Teach (3002)", href: "http://localhost:3002", icon: "🎓" },
                  { label: "Lurexa Studio (3001)", href: "http://localhost:3001", icon: "🛠️" },
                  { label: "Lurexa Insight (3003)", href: "http://localhost:3003", icon: "📊" },
                  { label: "Lurexa Admin (3004)", href: "http://localhost:3004", icon: "🛡️" },
                  { label: "Marketing Portal (3000)", href: "http://localhost:3000", icon: "✨" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-slate-200 hover:bg-slate-800 transition"
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span className="font-semibold">{item.label}</span>
                    </span>
                    <span className="text-[10px] text-slate-500">↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div title={userDisplayName || userEmail} className="cursor-pointer">
          <Avatar
            name={userDisplayName || "User"}
            size="sm"
            className="ring-1 ring-slate-700 hover:ring-indigo-400 transition"
          />
        </div>

        {/* Settings Cog */}
        <button
          type="button"
          onClick={onOpenSettings}
          title="Settings"
          aria-label="Settings"
          className="group relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
