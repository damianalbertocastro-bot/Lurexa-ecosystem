"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@lurexa/ui/Button";

interface TourStep {
  title: string;
  badge: string;
  description: string;
  icon: string;
  tip: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to Lurexa Learn",
    badge: "Personalized Space",
    icon: "🚀",
    description:
      "Your intelligent English learning environment adapts around you. All your progress, practice evidence, and milestones are unified in one place.",
    tip: "Designed with specialized support for Dominican Spanish speakers mastering English intelligibility.",
  },
  {
    title: "Evidence-Informed Next Steps",
    badge: "Lurexa Mind",
    icon: "🧠",
    description:
      "Lurexa Mind analyzes your recent learning evidence to recommend your optimal next action—whether it's advancing to new competencies or targeted retrieval.",
    tip: "Look for the 'Recommended Next Step' card at the top of your dashboard anytime you log in.",
  },
  {
    title: "Practice with Lurexa Coach",
    badge: "Speaking & Pronunciation",
    icon: "🎙️",
    description:
      "Build speaking confidence in a low-pressure interactive space. Coach uses your existing learner context to refine pronunciation without repetitive restarts.",
    tip: "Coach prioritizes intelligibility and fluency rather than forced accent erasure.",
  },
  {
    title: "Daily Momentum & Milestones",
    badge: "Habit Tracking",
    icon: "🔥",
    description:
      "Maintain your daily learning streak with the 7-day visual tracker and unlock milestone badges as you complete lessons, quizzes, and Capstones.",
    tip: "Completing just one interactive lesson or speaking session keeps your streak burning.",
  },
  {
    title: "Structured Courses & Modules",
    badge: "CEFR A1–C2",
    icon: "📚",
    description:
      "Explore structured courses from A1 Foundations up to advanced mastery. Resume directly where you paused and track your progress in real time.",
    tip: "You're all set! Enjoy your learning journey.",
  },
];

const TOUR_STORAGE_KEY = "lurexa_tour_seen";

interface DashboardTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardTourModal: React.FC<DashboardTourModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleFinish = useCallback(() => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
    } catch {
      // Ignore localStorage write failures in private browsing
    }
    onClose();
  }, [onClose]);

  const handleNext = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  }, [currentStep, handleFinish]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Keyboard navigation: Escape to close, ArrowLeft/ArrowRight to navigate
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleFinish();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handleBack, handleFinish]);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-dialog-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-indigo-100 bg-white p-6 shadow-2xl shadow-indigo-950/20 sm:p-8">
        {/* Top Header: Step Counter & Close button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
              {step.badge}
            </span>
            <span className="text-xs font-bold text-slate-400">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Skip tour and close"
          >
            ✕
          </button>
        </div>

        {/* Center Content */}
        <div className="mt-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-50 to-indigo-100/60 text-4xl shadow-inner shadow-indigo-200/50 ring-8 ring-indigo-50/50">
            {step.icon}
          </div>

          <h2
            id="tour-dialog-title"
            className="mt-5 text-2xl font-black tracking-tight text-[#071d67]"
          >
            {step.title}
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {step.description}
          </p>

          <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs leading-5 text-indigo-950">
            💡 <span className="font-semibold">{step.tip}</span>
          </div>
        </div>

        {/* Step Dots Indicator */}
        <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
          {TOUR_STEPS.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-indigo-600"
                  : "w-2 bg-slate-200 hover:bg-slate-300"
              }`}
              aria-label={`Jump to tour step ${index + 1}`}
            />
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={handleFinish}
            className="text-xs font-bold text-slate-400 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
          >
            Skip tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <Button variant="secondary" onClick={handleBack} size="sm">
                Back
              </Button>
            )}
            <Button variant="primary" onClick={handleNext} size="sm">
              {isLastStep ? "Get Started 🚀" : "Next →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
