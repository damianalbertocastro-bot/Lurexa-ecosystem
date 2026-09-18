/**
 * Canonical customer-facing commercial benefit descriptions.
 *
 * These descriptions explain the purpose and principal value of each
 * individual plan/product choice. They are not authorization rules.
 * Core entitlement resolution remains the source of truth for access.
 */

import type { ProductId } from "./entitlements";

export interface CommercialBenefit {
  id: string;
  label: string;
  description: string;
}

export interface ProductPlusOffer {
  product: Extract<ProductId, "learn" | "coach" | "teach">;
  name: string;
  priceMonthlyUsd: number;
  purpose: string;
  benefits: CommercialBenefit[];
  audience: string;
  notIncluded: string[];
}

export const PLUS_PRODUCT_OFFERS: readonly ProductPlusOffer[] = [
  {
    product: "learn",
    name: "Learn Plus",
    priceMonthlyUsd: 9.99,
    purpose:
      "A structured English-learning experience for learners who want to develop their language skills through Lurexa Learn.",
    benefits: [
      {
        id: "learn-full",
        label: "Full Learn experience",
        description:
          "Access the full Lurexa Learn product rather than the limited Basic experience.",
      },
      {
        id: "learn-practice",
        label: "Expanded learning practice",
        description:
          "Use the Plus-level Learn practice and assessment capabilities available to your account.",
      },
      {
        id: "learn-offline",
        label: "Offline learning",
        description:
          "Use the Plus-level offline learning capability where supported.",
      },
    ],
    audience:
      "Learners whose primary goal is systematic English learning across the Lurexa curriculum.",
    notIncluded: [
      "Full Coach entitlement",
      "Full Teach entitlement",
      "Premium ElevenLabs speech entitlement",
    ],
  },
  {
    product: "coach",
    name: "Coach Plus",
    priceMonthlyUsd: 9.99,
    purpose:
      "A speaking and pronunciation practice experience for learners who want focused spoken-English development.",
    benefits: [
      {
        id: "coach-full",
        label: "Full Coach experience",
        description:
          "Access the full Lurexa Coach product rather than the limited Basic experience.",
      },
      {
        id: "coach-voice",
        label: "Expanded voice practice",
        description:
          "Use the Plus-level Coach voice-practice allowance and speaking capabilities.",
      },
      {
        id: "coach-pronunciation",
        label: "Pronunciation-focused practice",
        description:
          "Practice intelligibility, fluency, naturalness, and pronunciation refinement with Coach.",
      },
    ],
    audience:
      "Learners whose primary goal is improving spoken English and pronunciation.",
    notIncluded: [
      "Full Learn entitlement",
      "Full Teach entitlement",
      "Premium ElevenLabs speech entitlement",
    ],
  },
  {
    product: "teach",
    name: "Teach Plus",
    priceMonthlyUsd: 9.99,
    purpose:
      "A professional-development experience for educators and future educators who want to strengthen their teaching practice.",
    benefits: [
      {
        id: "teach-full",
        label: "Full Teach experience",
        description:
          "Access the full Lurexa Teach professional-learning product rather than the limited Basic experience.",
      },
      {
        id: "teach-development",
        label: "Professional growth",
        description:
          "Develop academic knowledge, methodology, planning, assessment, practice, and professional capabilities through Teach.",
      },
      {
        id: "teach-ai-support",
        label: "Teacher-focused AI support",
        description:
          "Use Teach-specific AI support within the capabilities and limits assigned to the account.",
      },
    ],
    audience:
      "Educators and future educators whose primary goal is professional growth as teachers.",
    notIncluded: [
      "Full Learn entitlement",
      "Full Coach entitlement",
      "Teaching authorization or educator qualification by subscription alone",
    ],
  },
] as const;
