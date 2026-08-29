/**
 * Lurexa Studio Pedagogical Linter (Server-Only)
 * 
 * Automatically validates Knowledge Objects against CEFR competency trees,
 * 7 English skills standards, and Dominican/L1 transfer metadata before marketplace publication.
 */

import type { KnowledgeObject, CefrLevel } from "@lurexa/types";

export interface LintValidationIssue {
  severity: "error" | "warning" | "info";
  ruleId: string;
  field: string;
  message: string;
}

export interface PedagogicalLintReport {
  isValid: boolean;
  score: number; // 0 - 100
  cefrLevel: CefrLevel;
  skillCoverages: string[];
  issues: LintValidationIssue[];
}

export class StudioPedagogicalLinter {
  public static lintKnowledgeObject(obj: Partial<KnowledgeObject>): PedagogicalLintReport {
    const issues: LintValidationIssue[] = [];
    let score = 100;

    // Rule 1: CEFR Level Alignment
    if (!obj.cefrLevel) {
      issues.push({
        severity: "error",
        ruleId: "LINT-CEFR-01",
        field: "cefrLevel",
        message: "Knowledge Object must declare an authoritative CEFR baseline (A1-C2).",
      });
      score -= 30;
    }

    // Rule 2: Title and Objective Clarity
    if (!obj.title || obj.title.length < 5) {
      issues.push({
        severity: "error",
        ruleId: "LINT-META-01",
        field: "title",
        message: "Title must be descriptive and at least 5 characters.",
      });
      score -= 20;
    }

    // Rule 3: Pedagogical Competency Tagging
    if (!obj.competencies || obj.competencies.length === 0) {
      issues.push({
        severity: "warning",
        ruleId: "LINT-COMP-01",
        field: "competencies",
        message: "Declaring at least one competency ID is strongly recommended for adaptive sequencing.",
      });
      score -= 15;
    }

    // Rule 4: Pronunciation & Transfer Metadata
    if (obj.skill === "phonetics" || obj.skill === "speaking") {
      if (!obj.culturalContext || !obj.culturalContext.transferNotes) {
        issues.push({
          severity: "warning",
          ruleId: "LINT-L1-01",
          field: "culturalContext",
          message: "Speaking and phonetics modules should specify L1 transfer friction points.",
        });
        score -= 10;
      }
    }

    // Rule 5: Activity Structure
    if (!obj.activities || obj.activities.length === 0) {
      issues.push({
        severity: "error",
        ruleId: "LINT-ACT-01",
        field: "activities",
        message: "Knowledge Object must contain at least 1 interactive learning activity.",
      });
      score -= 25;
    }

    const finalScore = Math.max(0, score);
    const isValid = !issues.some((i) => i.severity === "error");

    return {
      isValid,
      score: finalScore,
      cefrLevel: (obj.cefrLevel as CefrLevel) || "A1",
      skillCoverages: obj.skill ? [obj.skill] : ["vocabulary", "grammar"],
      issues,
    };
  }
}
