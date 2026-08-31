"use client";

import React from "react";
import { WelcomeTourModal, type WelcomeTourStep } from "@lurexa/ui/WelcomeTourModal";

const LEARN_TOUR_STEPS: WelcomeTourStep[] = [
  {
    title: "Welcome to Lurexa Learn",
    badge: "Personalized Space",
    icon: "🚀",
    description:
      "Your intelligent English learning environment adapts around you. All your progress, practice evidence, and milestones are unified in one evolving learner model.",
    tip: "Designed with specialized support for Dominican Spanish speakers mastering English intelligibility.",
  },
  {
    title: "Evidence-Informed Next Steps",
    badge: "Lurexa Mind",
    icon: "🧠",
    description:
      "Lurexa Mind analyzes your recent learning evidence to recommend your optimal next action—whether advancing to new competencies or targeted retrieval.",
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
  return (
    <WelcomeTourModal
      isOpen={isOpen}
      onClose={onClose}
      storageKey={TOUR_STORAGE_KEY}
      productName="Lurexa Learn"
      steps={LEARN_TOUR_STEPS}
    />
  );
};
