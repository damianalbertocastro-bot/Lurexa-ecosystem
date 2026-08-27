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

  return (
    <>
      <TeacherWorkspaceBanner
        title="Quiz & Assessment Builder"
        subtitle="Create reusable exercises or generate them with AI"
        breadcrumbs={[{ label: "Dashboard", href: "/teacher/dashboard" }, { label: "Quizzes" }]}
        actions={
          <Button variant="secondary" onClick={handleGenerateAiQuestions} isLoading={isAiGenerating}>✨ AI Question Generator</Button>
        }
      />
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* Question Form */}
        <Card title="Add Question" subtitle="Define prompt, options, and correct answers">
          <form onSubmit={handleAddQuestion} className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-[#314b88] mb-1 block">Question Type</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                className="w-full rounded-xl border border-[#d7e0f6] p-2 text-sm text-[#071d67] focus:outline-none focus:ring-2 focus:ring-[#1d5add]"
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
                <label className="text-sm font-medium text-[#314b88]">Answer Options</label>
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
        <Card title={`Questions Pool (${questions.length})`} subtitle="Questions in this assessment draft">
          {questions.length === 0 ? (
            <p className="text-sm text-[#4d5e8c] py-4 text-center">No questions added yet.</p>
          ) : (
            <div className="space-y-3 pt-2">
              {questions.map((q, idx) => (
                <div key={q.id} className="rounded-xl border border-[#dfe7fb] p-4 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-[#592bd6]">Question {idx + 1}</span>
                    <Badge variant="info">{q.type}</Badge>
                  </div>
                  <p className="font-semibold text-[#071d67]">{q.prompt}</p>
                  {q.options && (
                    <ul className="list-disc list-inside text-xs text-[#5d6f9d] space-y-1 pl-2">
                      {q.options.map((opt, oIdx) => (
                        <li key={oIdx} className={opt === q.correctAnswer ? "font-bold text-[#137867]" : ""}>
                          {opt} {opt === q.correctAnswer && "✓"}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
