"use client";

import React, { useEffect, useState, useCallback, type FC } from "react";
import { Button } from "./button";

export interface WelcomeTourStep {
  title: string;
  badge: string;
  description: string;
  icon: string;
  tip?: string;
  highlightText?: string;
}

export interface WelcomeTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  storageKey?: string;
  productName?: string;
  steps: WelcomeTourStep[];
}

export const WelcomeTourModal: FC<WelcomeTourModalProps> = ({
  isOpen,
  onClose,
  storageKey,
  productName = "Lurexa",
  steps,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Reset to first step whenever opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleFinish = useCallback(() => {
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, "true");
      } catch {
        // Safe fallback in private browsing mode
      }
    }
    onClose();
  }, [storageKey, onClose]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  }, [currentStep, steps.length, handleFinish]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Keyboard navigation
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

  if (!isOpen || steps.length === 0) return null;

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-dialog-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-2xl sm:p-8 transition-all">
        {/* Top Header: Step Counter & Close button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[var(--lx-primary)]/10 border border-[var(--lx-primary)]/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[var(--lx-primary)]">
              {step.badge}
            </span>
            <span className="text-xs font-bold text-[var(--lx-muted)]">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={handleFinish}
            className="grid h-8 w-8 place-items-center rounded-full text-[var(--lx-muted)] transition hover:bg-[var(--lx-canvas)] hover:text-[var(--lx-ink)] focus:outline-none"
            aria-label="Skip tour and close"
          >
            ✕
          </Button>
        </div>

        {/* Center Content */}
        <div className="mt-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--lx-primary)]/15 via-[var(--lx-canvas)] to-[var(--lx-accent)]/15 text-4xl shadow-inner ring-1 ring-[var(--lx-border)]">
            <span role="img" aria-hidden="true">
              {step.icon}
            </span>
          </div>

          <h2
            id="tour-dialog-title"
            className="mt-5 text-2xl font-black tracking-tight text-[var(--lx-ink)] sm:text-3xl"
          >
            {step.title}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[var(--lx-muted)]">
            {step.description}
          </p>

          {step.tip && (
            <div className="mt-5 rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-3.5 text-left text-xs text-[var(--lx-ink)] shadow-xs">
              <span className="font-extrabold text-[var(--lx-primary)]">💡 Pro-Tip: </span>
              <span className="text-[var(--lx-muted)]">{step.tip}</span>
            </div>
          )}
        </div>

        {/* Bottom Actions & Step Dots */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--lx-border)] pt-5">
          {/* Step indicator dots */}
          <div className="flex items-center gap-1.5" aria-label={`Step ${currentStep + 1} of ${steps.length}`}>
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                aria-label={`Go to step ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? "w-7 bg-[var(--lx-primary)]"
                    : "w-2 bg-[var(--lx-border)] hover:bg-[var(--lx-muted)]"
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleBack}
                className="rounded-xl px-4 text-xs font-extrabold"
              >
                ← Back
              </Button>
            )}

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleNext}
              className="rounded-xl px-5 text-xs font-black shadow-md transition hover:brightness-105"
            >
              {isLastStep ? `Get Started with ${productName} →` : "Next →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
