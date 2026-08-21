'use client';
import React from "react";
import Link from "next/link";
import { ConversationWindow } from "../../components/ConversationWindow";
import Image from "next/image";
// Sign‑out handled locally; remove next‑auth import

type ChatSession = { user?: { name?: string } };
export default function ChatPage({ session }: { session?: ChatSession }) {
  const userName = session?.user?.name || "User";
  return (
    <main className="flex min-h-screen flex-col items-center bg-[var(--learn-canvas)] p-4">
      {/* Top-left Educator Workspace notice */}
      <div className="w-full flex items-start mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9V5h2v4h3l-4 4-4-4h3z" />
          </svg>
          <span className="font-medium">EDUCATOR WORKSPACE</span>
          <span>Make every lesson count. Create learning experiences and see the next useful action.</span>
        </div>
      </div>
      {/* Welcome message */}
      <h2 className="mb-2 text-lg font-semibold text-gray-800">Welcome back, {userName}</h2>
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Lurexa Coach Chat</h1>
      <ConversationWindow />
      {/* Action buttons */}
      <div className="mt-4 flex gap-4">
          <button type="button" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700" aria-label="Create a new course">
            Create Course
          </button>
        <button
          onClick={() => console.log("Sign out clicked")}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
      {/* Related Section */}
      <section className="mt-8 w-full border-t pt-4">
        <h3 className="mb-2 text-md font-medium text-gray-600">Related</h3>
          <div className="flex items-center gap-4">

          <Image src="/assets/lurexa-teach-logo.svg" alt="Lurexa Teach" width={48} height={48} className="h-12 w-12" />
          {/* Main Lurexa logo button */}
          <Link href="https://lurexa.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" aria-label='Visit Lurexa ecosystem'>
          <Image src="/assets/lurexa-logo.svg" alt="Lurexa" width={24} height={24} className="h-6 w-6" />
            <span>Lurexa Ecosystem</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
