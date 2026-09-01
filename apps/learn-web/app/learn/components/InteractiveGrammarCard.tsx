"use client";

import { useMemo, useState } from "react";
import { Button } from "@lurexa/ui/button";

export interface InteractiveGrammarCardProps {
  blockId: string;
  rawText: string;
  wrapperClass?: string;
  initialDialect?: "es-DO" | "es" | "ht" | string;
}

interface ParsedGrammarData {
  title: string;
  formula: string;
  explanation: string;
  forms: {
    affirmative: string;
    negative: string;
    question: string;
  };
  l1TransferTip: string;
  examples: string[];
}

function parseGrammarText(rawText: string): ParsedGrammarData {
  // Extract Title
  const titleMatch = rawText.match(/###\s*(?:📖\s*)?Grammar Focus:\s*(.+)/i);
  const title = titleMatch?.[1]?.trim() ?? "Grammar Focus & Language Architecture";

  // Extract Formula
  const formulaMatch = rawText.match(/\*\*Structural Formula:\*\*\s*(?:`([^`]+)`|`?([^`\n]+)`?)/i) ||
    rawText.match(/\*\*Formula:\*\*\s*(?:`([^`]+)`|`?([^`\n]+)`?)/i);
  const formula = formulaMatch?.[1]?.trim() ?? formulaMatch?.[2]?.trim() ?? "[Subject] + [Verb] + [Complement]";

  // Extract Explanation
  const explanationMatch = rawText.match(/\*\*(?:Explanation|Usage Note|Theoretical Explanation|Sovereign Explanation)[^*]*\*\*\s*([\s\S]*?)(?=\*\*Forms Breakdown:|\*\*💡|\*\*Practical Examples|\*\*Masterpiece Examples|\*\*Executive Examples|$)/i);
  const explanation = explanationMatch?.[1]?.trim() ?? "Master this grammatical structure to express your ideas with clarity and natural spoken fluency.";

  // Extract Forms
  const affirmativeMatch = rawText.match(/•\s*\*Affirmative:\*\s*(.+)/i);
  const negativeMatch = rawText.match(/•\s*\*Negative:\*\s*(.+)/i);
  const questionMatch = rawText.match(/•\s*\*(?:Question|Question \/ Inverted|Scholarly Inquiry \/ Inversion|Sovereign Inquest \/ Classical Inversion):\*\s*(.+)/i);

  const forms = {
    affirmative: affirmativeMatch?.[1]?.trim() ?? "I am ready to communicate with confidence.",
    negative: negativeMatch?.[1]?.trim() ?? "Ensure proper negation without double negative markers.",
    question: questionMatch?.[1]?.trim() ?? "Use standard inverted word order for inquiries.",
  };

  // Extract L1 Transfer Tip
  const l1Match = rawText.match(/\*\*💡[^*]+\*\*\s*([\s\S]*?)(?=\*\*Practical Examples|\*\*Masterpiece Examples|\*\*Executive Examples|\*\*Examples|$)/i);
  const l1TransferTip = l1Match?.[1]?.trim() ?? "Pay close attention to English subject pronouns and word order to avoid direct translation interference.";

  // Extract Examples
  const examplesSectionMatch = rawText.match(/\*\*(?:Practical Examples|Masterpiece Examples|Executive Examples|Examples)[^*]*\*\*\s*([\s\S]*)$/i);
  const examplesText = examplesSectionMatch?.[1] ?? "";
  const examples = examplesText
    .split("\n")
    .map((line) => line.replace(/^•\s*"?|"?\s*$/g, "").trim())
    .filter((line) => line.length > 0 && !line.startsWith("**"));

  return {
    title,
    formula,
    explanation,
    forms,
    l1TransferTip,
    examples: examples.length > 0 ? examples : [forms.affirmative],
  };
}

export function InteractiveGrammarCard({
  blockId,
  rawText,
  wrapperClass = "",
  initialDialect = "es-DO",
}: InteractiveGrammarCardProps) {
  const data = useMemo(() => parseGrammarText(rawText), [rawText]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [activeDialect, setActiveDialect] = useState<"es-DO" | "es" | "ht">(
    initialDialect === "es" || initialDialect === "ht" ? initialDialect : "es-DO"
  );
  const [playingText, setPlayingText] = useState<string | null>(null);
  const [showQuickCheck, setShowQuickCheck] = useState(false);
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<number | null>(null);

  // Parse formula tokens: e.g. "[Subject] + [Verb 'to be'] + [Complement]"
  const formulaSlots = useMemo(() => {
    const regex = /\[([^\]]+)\]/g;
    const slots: string[] = [];
    let match;
    while ((match = regex.exec(data.formula)) !== null) {
      if (match[1]) slots.push(match[1]);
    }
    return slots.length > 0 ? slots : ["Subject", "Verb", "Structure"];
  }, [data.formula]);

  // Audio speech synthesis helper
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    if (playingText === text) {
      setPlayingText(null);
      return;
    }

    const cleanText = text.replace(/^[•\s*"]+|["]+$/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    utterance.rate = 0.9; // Slightly measured for pedagogical clarity

    utterance.onstart = () => setPlayingText(text);
    utterance.onend = () => setPlayingText(null);
    utterance.onerror = () => setPlayingText(null);

    window.speechSynthesis.speak(utterance);
  };

  // Dialect-specific transfer note adaptations
  const adaptedTransferTip = useMemo(() => {
    if (activeDialect === "ht") {
      return `🇭🇹 Haitian Creole Contrast: Creole uses pre-verbal aspect markers (te, ap, pral) and invariant verbs without inflections. In English, conjugate auxiliary verbs directly and use explicit verb inflections (e.g. 3rd-person -s or past -ed). ${data.l1TransferTip.replace(/Spanish/gi, "Creole")}`;
    }
    if (activeDialect === "es") {
      return `🇪🇸 General Spanish Contrast: ${data.l1TransferTip.replace(/Dominican &/gi, "")}`;
    }
    return `🇩🇴 Dominican Spanish Contrast: ${data.l1TransferTip}`;
  }, [activeDialect, data.l1TransferTip]);

  // Quick Check Micro-Drill
  const quickCheckOptions = useMemo(() => {
    const correct = data.forms.affirmative;
    const incorrect1 = data.forms.affirmative.split(" ").reverse().join(" ");
    const incorrect2 = `Not ${data.forms.affirmative}`;
    const options = [
      { text: correct, isCorrect: true, explanation: "Accurately follows the target structural formula." },
      { text: incorrect1, isCorrect: false, explanation: "Incorrect syntactic word order." },
      { text: incorrect2, isCorrect: false, explanation: "Missing auxiliary or affirmative structure." },
    ];
    const offset = data.forms.affirmative.length % 3;
    return [...options.slice(offset), ...options.slice(0, offset)];
  }, [data.forms.affirmative]);

  return (
    <section
      id={`block-${blockId}`}
      className={`overflow-hidden rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 p-6 sm:p-8 shadow-sm transition-all duration-300 ${wrapperClass}`}
    >
      {/* Top Header Badge & Dialect Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">
            <span>📖</span>
            <span>Grammar Focus &amp; Architecture</span>
          </span>
          <span className="text-xs font-semibold text-indigo-700 hidden sm:inline-block">Interactive Lesson Guide</span>
        </div>

        {/* Multi-L1 Profile Switcher */}
        <div className="flex items-center gap-1 bg-white/80 p-1 rounded-2xl border border-indigo-100 text-xs">
          <span className="text-[11px] font-bold text-slate-500 px-2">L1 Contrast:</span>
          <Button
            type="button"
            onClick={() => setActiveDialect("es-DO")}
            className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${
              activeDialect === "es-DO"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-indigo-50"
            }`}
            title="Dominican Spanish L1 Transfer"
          >
            🇩🇴 Dominican
          </Button>
          <Button
            type="button"
            onClick={() => setActiveDialect("es")}
            className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${
              activeDialect === "es"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-indigo-50"
            }`}
            title="Standard Spanish L1 Transfer"
          >
            🇪🇸 Spanish
          </Button>
          <Button
            type="button"
            onClick={() => setActiveDialect("ht")}
            className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${
              activeDialect === "ht"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-indigo-50"
            }`}
            title="Haitian Creole L1 Transfer"
          >
            🇭🇹 Kreyòl
          </Button>
        </div>
      </div>

      {/* Main Concept Title & Usage Explanation */}
      <div className="mt-5 space-y-2">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
          {data.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
          {data.explanation}
        </p>
      </div>

      {/* Interactive Structural Formula Box */}
      <div className="mt-6 rounded-2xl border border-indigo-200 bg-white/95 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
            <span>🧩</span>
            <span>Structural Formula (Tap tokens to inspect structure):</span>
          </p>
          {selectedSlot ? (
            <Button
              type="button"
              onClick={() => setSelectedSlot(null)}
              className="text-[11px] font-bold text-indigo-600 hover:underline"
            >
              Clear selection
            </Button>
          ) : null}
        </div>

        {/* Formula Chips */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-sm sm:text-base">
          {formulaSlots.map((slot, index) => {
            const isSelected = selectedSlot === slot;
            return (
              <Button
                key={`${slot}-${index}`}
                type="button"
                onClick={() => setSelectedSlot(isSelected ? null : slot)}
                className={`rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-bold tracking-wide transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400 scale-105"
                    : "bg-indigo-50 border border-indigo-200/80 text-indigo-950 hover:border-indigo-400 hover:bg-indigo-100/70"
                }`}
              >
                [{slot}]
              </Button>
            );
          })}
        </div>

        {selectedSlot ? (
          <div className="mt-3 rounded-xl bg-indigo-50/70 border border-indigo-100 p-3 text-xs text-indigo-950">
            <span className="font-bold">Active Syntactic Slot: [{selectedSlot}]</span> — Notice how this element functions in the affirmative, negative, and question forms below.
          </div>
        ) : null}
      </div>

      {/* Forms Breakdown with Audio Narration */}
      <div className="mt-6 space-y-3">
        <p className="text-xs font-black uppercase tracking-wider text-slate-600">
          Forms Breakdown &amp; Spoken Narration:
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          {/* Affirmative */}
          <div className="flex flex-col justify-between rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 transition hover:border-emerald-300">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <span>✓</span>
                  <span>Affirmative</span>
                </span>
                <Button
                  type="button"
                  onClick={() => speakText(data.forms.affirmative)}
                  className="rounded-full bg-emerald-200/60 p-1.5 text-emerald-900 hover:bg-emerald-300 transition"
                  title="Listen to affirmative form"
                  aria-label="Listen to affirmative form"
                >
                  {playingText === data.forms.affirmative ? "⏹️" : "🔊"}
                </Button>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                {data.forms.affirmative}
              </p>
            </div>
          </div>

          {/* Negative */}
          <div className="flex flex-col justify-between rounded-2xl border border-rose-200 bg-rose-50/40 p-4 transition hover:border-rose-300">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center gap-1">
                  <span>✕</span>
                  <span>Negative</span>
                </span>
                <Button
                  type="button"
                  onClick={() => speakText(data.forms.negative)}
                  className="rounded-full bg-rose-200/60 p-1.5 text-rose-900 hover:bg-rose-300 transition"
                  title="Listen to negative form"
                  aria-label="Listen to negative form"
                >
                  {playingText === data.forms.negative ? "⏹️" : "🔊"}
                </Button>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                {data.forms.negative}
              </p>
            </div>
          </div>

          {/* Question */}
          <div className="flex flex-col justify-between rounded-2xl border border-amber-200 bg-amber-50/40 p-4 transition hover:border-amber-300">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <span>?</span>
                  <span>Question / Inversion</span>
                </span>
                <Button
                  type="button"
                  onClick={() => speakText(data.forms.question)}
                  className="rounded-full bg-amber-200/60 p-1.5 text-amber-900 hover:bg-amber-300 transition"
                  title="Listen to question form"
                  aria-label="Listen to question form"
                >
                  {playingText === data.forms.question ? "⏹️" : "🔊"}
                </Button>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                {data.forms.question}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* L1 Contrastive Tip Alert Card */}
      <div className="mt-6 rounded-2xl border border-indigo-200/90 bg-indigo-100/50 p-4 sm:p-5 text-indigo-950 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-xl sm:text-2xl mt-0.5">💡</span>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-indigo-900">
              L1 Contrast &amp; Linguistic Transfer Tip
            </h4>
            <p className="text-xs sm:text-sm font-medium leading-relaxed text-indigo-950">
              {adaptedTransferTip}
            </p>
          </div>
        </div>
      </div>

      {/* Practical Examples in Context with Audio */}
      {data.examples.length > 0 ? (
        <div className="mt-6 space-y-2.5">
          <p className="text-xs font-black uppercase tracking-wider text-slate-600">
            Practical Examples in Context (Tap 🔊 to listen):
          </p>
          <div className="grid gap-2">
            {data.examples.map((example, idx) => (
              <div
                key={`${example}-${idx}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 shadow-sm hover:border-indigo-300 transition"
              >
                <span>• &ldquo;{example}&rdquo;</span>
                <Button
                  type="button"
                  onClick={() => speakText(example)}
                  className="shrink-0 rounded-full bg-indigo-50 p-2 text-indigo-700 hover:bg-indigo-100 transition"
                  title="Listen to example"
                  aria-label="Listen to example"
                >
                  {playingText === example ? "⏹️" : "🔊"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Quick Check Mini-Drill Trigger */}
      <div className="mt-6 border-t border-indigo-100 pt-4 flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          onClick={() => setShowQuickCheck((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-xl border border-indigo-300 bg-white px-4 py-2 text-xs font-bold text-indigo-700 shadow-sm hover:bg-indigo-50 transition"
        >
          <span>⚡</span>
          <span>{showQuickCheck ? "Hide Quick Structure Check" : "Quick Check: Test Your Understanding"}</span>
        </Button>

        <span className="text-[11px] font-semibold text-slate-500">
          Saved in Learner Model memory
        </span>
      </div>

      {/* Quick Check Card */}
      {showQuickCheck ? (
        <div className="mt-4 rounded-2xl border border-indigo-300 bg-white p-5 shadow-md">
          <p className="text-xs font-black uppercase tracking-wider text-indigo-900 mb-2">
            ⚡ Quick Check: Select the sentence that correctly follows the target formula:
          </p>
          <div className="grid gap-2 mt-3">
            {quickCheckOptions.map((opt, idx) => {
              const isSelected = quizAnswerSelected === idx;
              let style = "border-slate-200 bg-slate-50 hover:bg-indigo-50 text-slate-900";
              if (isSelected) {
                style = opt.isCorrect
                  ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                  : "border-rose-600 bg-rose-50 text-rose-950 font-bold";
              }

              return (
                <Button
                  key={`${opt.text}-${idx}`}
                  type="button"
                  onClick={() => setQuizAnswerSelected(idx)}
                  className={`rounded-xl border p-3.5 text-left text-xs sm:text-sm transition flex items-center justify-between ${style}`}
                >
                  <span>{opt.text}</span>
                  {isSelected ? (
                    <span className="font-black text-xs">{opt.isCorrect ? "✓ Correct" : "✕ Try Again"}</span>
                  ) : null}
                </Button>
              );
            })}
          </div>
          {quizAnswerSelected !== null ? (
            <p className="mt-3 text-xs font-semibold text-slate-700">
              {quickCheckOptions[quizAnswerSelected]?.explanation}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
