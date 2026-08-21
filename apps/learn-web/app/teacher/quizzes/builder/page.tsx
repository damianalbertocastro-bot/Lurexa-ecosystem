"use client";

import React, { useState } from "react";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { Badge } from "@lurexa/ui/Badge";
import type { Question, QuestionType } from "@lurexa/types";
import { AIGeneratorService } from "@lurexa/backend";

export default function QuizBuilderPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [prompt, setPrompt] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("multiple_choice");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);

  function handleAddQuestion(event: React.FormEvent) {
    event.preventDefault();
    if (!prompt || !correctAnswer) return;
    setQuestions((current) => [...current, {
      id: `q_${Date.now()}`,
      type: questionType,
      prompt,
      options: questionType.includes("choice") ? options.filter((option) => option.trim() !== "") : undefined,
      correctAnswer,
      explanation,
    }]);
    setPrompt("");
    setCorrectAnswer("");
    setExplanation("");
    setOptions(["", "", "", ""]);
  }

  async function addPrototypeSample() {
    setIsGeneratingSample(true);
    try {
      const draft = await AIGeneratorService.generateLessonDraft("Grammar & Tenses", "B1");
      setQuestions((current) => [...current, ...draft.suggestedQuestions.map((question) => ({ ...question, id: `${question.id}_${Date.now()}` }))]);
    } catch {
      alert("The prototype sample could not be loaded.");
    } finally {
      setIsGeneratingSample(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8 sm:py-12">
      <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#071d67] via-[#17368f] to-[#592bd6] px-6 py-10 text-white shadow-[0_22px_60px_rgba(35,48,133,.18)] sm:px-10 sm:py-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#12cdd4]/20 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-[11px] font-extrabold tracking-[.2em] text-[#8df4ef]">ASSESSMENT AUTHORING · LUREXA LEARN</p><h1 className="mt-4 text-4xl font-black tracking-[-.055em] sm:text-5xl">Build checks that support the lesson.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-indigo-100">Create reusable questions with clear answers and feedback. Generated content must remain reviewable before it becomes part of a learner experience.</p></div><button type="button" onClick={addPrototypeSample} disabled={isGeneratingSample} className="min-h-12 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white disabled:opacity-60">{isGeneratingSample ? "Loading sample…" : "Insert prototype sample"}</button></div>
      </section>

      <section className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900"><b>Prototype note:</b> the sample helper currently returns deterministic placeholder content. It is not Lurexa Mind or a live AI generator. A production generation workflow must use an approved server-side intelligence boundary and explicit educator review.</section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[.82fr_1.18fr]">
        <article className="rounded-[30px] border border-[#dfe6f8] bg-white p-7 shadow-[0_14px_36px_rgba(32,52,128,.07)]"><p className="text-[10px] font-extrabold tracking-[.18em] text-[#592bd6]">ADD QUESTION</p><form onSubmit={handleAddQuestion} className="mt-5 space-y-4"><label className="block text-sm font-extrabold text-[#314b88]">Question type<select value={questionType} onChange={(event) => setQuestionType(event.target.value as QuestionType)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] bg-white px-3 text-sm text-[#071d67] focus:outline-none focus:ring-2 focus:ring-[#1d5add]"><option value="multiple_choice">Multiple choice</option><option value="single_choice">Single choice</option><option value="fill_in_blank">Fill in the blank</option></select></label><Input label="Question prompt" placeholder="What should the learner demonstrate?" value={prompt} onChange={(event) => setPrompt(event.target.value)} required />{questionType.includes("choice") ? <div className="space-y-2"><p className="text-sm font-extrabold text-[#314b88]">Answer options</p>{options.map((option, index) => <Input key={index} placeholder={`Option ${index + 1}`} value={option} onChange={(event) => setOptions((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} />)}</div> : null}<Input label="Correct answer" value={correctAnswer} onChange={(event) => setCorrectAnswer(event.target.value)} required /><Input label="Explanation (optional)" value={explanation} onChange={(event) => setExplanation(event.target.value)} /><Button type="submit" variant="primary" className="w-full">Add question →</Button></form></article>

        <article className="rounded-[30px] border border-[#dfe6f8] bg-white p-7 shadow-[0_14px_36px_rgba(32,52,128,.07)]"><div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-extrabold tracking-[.18em] text-[#592bd6]">QUESTION POOL</p><h2 className="mt-2 text-2xl font-black tracking-[-.04em] text-[#10245f]">{questions.length} question{questions.length === 1 ? "" : "s"}</h2></div></div>{questions.length === 0 ? <p className="mt-6 rounded-2xl bg-[#f7f9ff] p-5 text-sm text-[#6677a5]">No questions added yet.</p> : <div className="mt-5 space-y-3">{questions.map((question, index) => <div key={question.id} className="rounded-2xl border border-[#dfe6f8] p-5"><div className="flex items-center justify-between gap-3"><span className="text-xs font-extrabold uppercase text-[#592bd6]">Question {index + 1}</span><Badge variant="info">{question.type.replaceAll("_", " ")}</Badge></div><p className="mt-3 font-extrabold text-[#10245f]">{question.prompt}</p>{question.options ? <ul className="mt-3 space-y-2 text-sm text-[#5d6f9d]">{question.options.map((option) => <li key={option} className={option === question.correctAnswer ? "font-extrabold text-[#137867]" : ""}>{option === question.correctAnswer ? "✓ " : "· "}{option}</li>)}</ul> : null}</div>)}</div>}</article>
      </section>
    </main>
  );
}
