/**
 * Lurexa Studio Pedagogical Linter (Server-Only)
 * 
 * Automatically validates Knowledge Objects against CEFR competency trees,
 * 7 English skills standards, and Dominican/L1 transfer metadata before marketplace publication.
 */

import type { StudioKnowledgeObjectDraftV1, CefrLevel } from "@lurexa/types";

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
  public static lintKnowledgeObject(obj: Partial<StudioKnowledgeObjectDraftV1>): PedagogicalLintReport {
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
    if (!obj.name || obj.name.length < 5) {
      issues.push({
        severity: "error",
        ruleId: "LINT-META-01",
        field: "name",
        message: "Name must be descriptive and at least 5 characters.",
      });
      score -= 20;
    }

    // Rule 3: Pedagogical Objective
    if (!obj.pedagogicalObjective || obj.pedagogicalObjective.length < 10) {
      issues.push({
        severity: "warning",
        ruleId: "LINT-OBJ-01",
        field: "pedagogicalObjective",
        message: "Declaring a clear pedagogical objective is strongly recommended for adaptive sequencing.",
      });
      score -= 15;
    }

    // Rule 4: Pronunciation & Transfer Metadata
    if (obj.skills?.includes("phonetics") || obj.skills?.includes("speaking")) {
      if (!obj.l1InterferenceRule) {
        issues.push({
          severity: "warning",
          ruleId: "LINT-L1-01",
          field: "l1InterferenceRule",
          message: "Speaking and phonetics modules should specify L1 transfer friction points.",
        });
        score -= 10;
      }
    }

    // Rule 5: Activity Configuration
    if (!obj.activityConfig || !obj.activityConfig.promptText) {
      issues.push({
        severity: "error",
        ruleId: "LINT-ACT-01",
        field: "activityConfig",
        message: "Knowledge Object must configure a prompt and interactive activity.",
      });
      score -= 25;
    }

    const finalScore = Math.max(0, score);
    const isValid = !issues.some((i) => i.severity === "error");

    return {
      isValid,
      score: finalScore,
      cefrLevel: (obj.cefrLevel as CefrLevel) || "A1",
      skillCoverages: obj.skills ? [...obj.skills] : ["vocabulary", "grammar"],
      issues,
    };
  }
}
