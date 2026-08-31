"use client";

import React, { useState } from "react";
import { Button } from "@lurexa/ui/Button";
import { Input } from "@lurexa/ui/Input";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Question, QuestionType } from "@lurexa/types";
import { AIGeneratorService } from "@lurexa/backend";
import { TeacherWorkspaceBanner } from "../../components/TeacherWorkspaceBanner";

export default function QuizBuilderPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [prompt, setPrompt] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("multiple_choice");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Student Preview States
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewSelectedOption, setPreviewSelectedOption] = useState<string | null>(null);
  const [previewSubmitted, setPreviewSubmitted] = useState(false);
  const [previewScore, setPreviewScore] = useState(0);
  const [previewCompleted, setPreviewCompleted] = useState(false);

  // Add manually created question
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || !correctAnswer) return;

    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type: questionType,
      prompt,
      options: questionType.includes("choice") ? options.filter((o) => o.trim() !== "") : undefined,
      correctAnswer,
      explanation,
    };

    setQuestions([...questions, newQuestion]);

    // Reset Form
    setPrompt("");
    setCorrectAnswer("");
    setExplanation("");
    setOptions(["", "", "", ""]);
  };

  // Delete question
  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Move question
  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= questions.length) return;
    const updated = [...questions];
    const item = updated[index]!;
    updated[index] = updated[target]!;
    updated[target] = item;
    setQuestions(updated);
  };

  // Trigger AI to auto-generate sample question
  const handleGenerateAiQuestions = async () => {
    setIsAiGenerating(true);
    try {
      const aiDraft = await AIGeneratorService.generateLessonDraft("Grammar & Tenses", "B1");
      setQuestions((prev) => [...prev, ...aiDraft.suggestedQuestions]);
    } catch {
      alert("AI generation failed.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const startPreview = () => {
    if (questions.length === 0) return;
    setPreviewIndex(0);
    setPreviewSelectedOption(null);
    setPreviewSubmitted(false);
    setPreviewScore(0);
    setPreviewCompleted(false);
    setIsPreviewOpen(true);
  };

  const handlePreviewSubmit = () => {
    if (!previewSelectedOption) return;
    const currentQ = questions[previewIndex]!;
    const isCorrect = typeof currentQ.correctAnswer === "string"
      ? previewSelectedOption.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase()
      : Array.isArray(currentQ.correctAnswer)
      ? (currentQ.correctAnswer as string[]).map((c) => c.trim().toLowerCase()).includes(previewSelectedOption.trim().toLowerCase())
      : false;
    if (isCorrect) {
      setPreviewScore((prev) => prev + 1);
    }
    setPreviewSubmitted(true);
  };

  const handlePreviewNext = () => {
    if (previewIndex + 1 < questions.length) {
      setPreviewIndex((prev) => prev + 1);
      setPreviewSelectedOption(null);
      setPreviewSubmitted(false);
    } else {
      setPreviewCompleted(true);
    }
  };

  const currentPreviewQ = questions[previewIndex];

  return (
    <>
      <TeacherWorkspaceBanner
        title="Quiz & Assessment Builder"
        subtitle="Create reusable exercises or generate them with AI"
        breadcrumbs={[{ label: "Dashboard", href: "/teacher/dashboard" }, { label: "Quizzes" }]}
        actions={
          <div className="flex items-center gap-2.5">
            {questions.length > 0 && (
              <Button variant="primary" onClick={startPreview}>
                👁️ Preview as Student
              </Button>
            )}
            <Button variant="secondary" onClick={handleGenerateAiQuestions} isLoading={isAiGenerating}>
              ✨ AI Question Generator
            </Button>
          </div>
        }
      />
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* Question Form */}
        <Card title="Add Question" subtitle="Define prompt, options, and correct answers">
          <form onSubmit={handleAddQuestion} className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-[var(--lx-muted)] mb-1 block">Question Type</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                className="w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-2 text-sm text-[var(--color-brand-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--lx-secondary)]"
              >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="single_choice">Single Choice</option>
                <option value="fill_in_blank">Fill in the Blank</option>
              </select>
            </div>

            <Input
              label="Question Prompt"
              placeholder="e.g., Which sentence correctly uses the present perfect tense?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />

            {questionType.includes("choice") && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--lx-muted)]">Answer Options</label>
                {options.map((opt, idx) => (
                  <Input
                    key={idx}
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...options];
                      updated[idx] = e.target.value;
                      setOptions(updated);
                    }}
                  />
                ))}
              </div>
            )}

            <Input
              label="Correct Answer"
              placeholder="Exact string matching correct option"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              required
            />

            <Input
              label="Explanation (Optional)"
              placeholder="Feedback shown to student after answering"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />

            <Button type="submit" variant="primary" className="w-full">
              + Save Question to Quiz
            </Button>
          </form>
        </Card>

        {/* Quiz Questions List */}
        <Card
          title={`Questions Pool (${questions.length})`}
          subtitle="Questions in this assessment draft"
        >
          {questions.length === 0 ? (
            <p className="text-sm text-[var(--lx-muted)] py-4 text-center">No questions added yet. Use the form above or click AI Question Generator.</p>
          ) : (
            <div className="space-y-3 pt-2">
              {questions.map((q, idx) => (
                <div key={q.id} className="group rounded-2xl border border-[var(--lx-border)] p-4 bg-[var(--lx-surface)] space-y-2.5 transition hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-[var(--lx-primary)]">Question {idx + 1}</span>
                      <Badge variant="info">{q.type}</Badge>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition">
                      <button
                        type="button"
                        onClick={() => handleMoveQuestion(idx, "up")}
                        disabled={idx === 0}
                        title="Move Up"
                        className="rounded-lg p-1.5 text-xs text-[var(--lx-muted)] hover:bg-[var(--lx-canvas)] disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveQuestion(idx, "down")}
                        disabled={idx === questions.length - 1}
                        title="Move Down"
                        className="rounded-lg p-1.5 text-xs text-[var(--lx-muted)] hover:bg-[var(--lx-canvas)] disabled:opacity-30"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        title="Delete Question"
                        className="rounded-lg p-1.5 text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-[var(--color-brand-navy)]">{q.prompt}</p>
                  {q.options && (
                    <ul className="list-disc list-inside text-xs text-[var(--lx-muted)] space-y-1 pl-2">
                      {q.options.map((opt, oIdx) => {
                        const isMatch = typeof q.correctAnswer === "string" ? opt === q.correctAnswer : Array.isArray(q.correctAnswer) ? (q.correctAnswer as string[]).includes(opt) : false;
                        return (
                          <li key={oIdx} className={isMatch ? "font-bold text-[var(--lx-success)]" : ""}>
                            {opt} {isMatch && "✓"}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {q.explanation && (
                    <p className="text-[11px] italic text-[var(--lx-muted)] bg-[var(--lx-canvas)] rounded-lg p-2 border border-[var(--lx-border)]">
                      💡 Explanation: {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Interactive Student Preview Modal */}
      {isPreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Student Quiz Preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-xl rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--lx-border)] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[var(--lx-primary)]/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[var(--lx-primary)]">
                    Student Mode Preview
                  </span>
                  <span className="text-xs font-bold text-[var(--lx-muted)]">
                    {previewCompleted ? "Assessment Complete" : `Question ${previewIndex + 1} of ${questions.length}`}
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-black text-[var(--color-brand-navy)]">
                  {previewCompleted ? "Preview Results" : "Interactive Quiz Simulation"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-xl text-sm font-bold text-[var(--lx-muted)] hover:bg-[var(--lx-canvas)] hover:text-[var(--color-brand-navy)]"
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            {!previewCompleted && currentPreviewQ ? (
              <div className="space-y-5">
                {/* Progress Bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--lx-canvas)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--lx-primary)] to-[var(--lx-secondary)] transition-all duration-300"
                    style={{ width: `${((previewIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>

                <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--lx-muted)] mb-1">
                    {currentPreviewQ.type.replace("_", " ")}
                  </p>
                  <p className="text-base font-bold text-[var(--color-brand-navy)] leading-snug">
                    {currentPreviewQ.prompt}
                  </p>
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {currentPreviewQ.options?.map((opt, oIdx) => {
                    const isSelected = previewSelectedOption === opt;
                    const isCorrect = typeof currentPreviewQ.correctAnswer === "string"
                      ? opt.trim().toLowerCase() === currentPreviewQ.correctAnswer.trim().toLowerCase()
                      : Array.isArray(currentPreviewQ.correctAnswer)
                      ? (currentPreviewQ.correctAnswer as string[]).includes(opt)
                      : false;
                    let optionStyle = "border-[var(--lx-border)] bg-[var(--lx-surface)] hover:border-[var(--lx-primary)] hover:bg-[var(--lx-canvas)]";
                    if (previewSubmitted) {
                      if (isCorrect) {
                        optionStyle = "border-[var(--lx-success)] bg-emerald-50 text-emerald-950 font-bold dark:bg-emerald-950/30 dark:text-emerald-300";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "border-rose-500 bg-rose-50 text-rose-950 font-bold dark:bg-rose-950/30 dark:text-rose-300";
                      } else {
                        optionStyle = "opacity-50 border-[var(--lx-border)] bg-[var(--lx-surface)]";
                      }
                    } else if (isSelected) {
                      optionStyle = "border-[var(--lx-primary)] bg-[var(--lx-surface)] ring-2 ring-[var(--lx-primary)]";
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={previewSubmitted}
                        onClick={() => setPreviewSelectedOption(opt)}
                        className={`w-full text-left rounded-2xl border p-3.5 text-sm transition flex items-center justify-between gap-3 ${optionStyle}`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-[var(--lx-canvas)] text-xs font-bold text-[var(--lx-muted)] border border-[var(--lx-border)]">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="text-[var(--color-brand-navy)]">{opt}</span>
                        </span>
                        {previewSubmitted && isCorrect && <span className="text-emerald-600 font-black">✓ Correct</span>}
                        {previewSubmitted && isSelected && !isCorrect && <span className="text-rose-600 font-black">✗ Incorrect</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Explanation */}
                {previewSubmitted && currentPreviewQ.explanation && (
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-xs text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-200">
                    <b className="block font-black mb-1">Explanation:</b>
                    {currentPreviewQ.explanation}
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-[var(--lx-muted)]">
                    Score: {previewScore} / {questions.length}
                  </span>
                  {!previewSubmitted ? (
                    <Button
                      variant="primary"
                      onClick={handlePreviewSubmit}
                      disabled={!previewSelectedOption}
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={handlePreviewNext}>
                      {previewIndex + 1 < questions.length ? "Next Question →" : "View Final Score →"}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              /* Summary Completed View */
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-[var(--lx-primary)] to-[var(--lx-secondary)] text-2xl text-white shadow-lg">
                  🏆
                </div>
                <div>
                  <h4 className="text-xl font-black text-[var(--color-brand-navy)]">Assessment Preview Finished</h4>
                  <p className="mt-1 text-sm text-[var(--lx-muted)]">
                    You scored <b className="text-[var(--lx-primary)]">{previewScore}</b> out of <b>{questions.length}</b> ({Math.round((previewScore / questions.length) * 100)}%)
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <Button variant="secondary" onClick={startPreview}>
                    🔄 Retake Preview
                  </Button>
                  <Button variant="primary" onClick={() => setIsPreviewOpen(false)}>
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
