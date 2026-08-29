/**
 * Lurexa Mind AI Guardrails Server Capability
 * 
 * Enforces strict pedagogical boundaries, prompt-injection defense,
 * token bounds, and response safety before and after AI provider invocations.
 */

export interface GuardrailValidationResult {
  allowed: boolean;
  sanitizedInput?: string;
  violations?: string[];
}

export interface GuardrailOutputResult {
  safe: boolean;
  sanitizedOutput: string;
  flaggedCategories?: string[];
}

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /system\s+override/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /act\s+as\s+an\s+unfiltered/i,
  /jailbreak/i,
  /reveal\s+(the\s+)?system\s+prompt/i,
  /bypass\s+safety/i,
];

const MAX_INPUT_TOKENS_APPROX = 4000;
const MAX_OUTPUT_TOKENS_APPROX = 1500;

export class AIGuardrailsServerService {
  /**
   * Validates and sanitizes prompt input before sending to Lurexa Mind or model runtime.
   */
  public static validateInput(prompt: string, maxTokens = MAX_INPUT_TOKENS_APPROX): GuardrailValidationResult {
    const violations: string[] = [];

    if (!prompt || typeof prompt !== "string") {
      return { allowed: false, violations: ["Prompt cannot be empty"] };
    }

    // Check approximate token length (approx 4 chars per token)
    if (prompt.length > maxTokens * 4) {
      violations.push(`Input exceeds maximum character length limit (${maxTokens * 4} chars)`);
    }

    // Check for known adversarial / injection patterns
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(prompt)) {
        violations.push(`Detected prohibited instruction override pattern: ${pattern}`);
      }
    }

    if (violations.length > 0) {
      return {
        allowed: false,
        violations,
      };
    }

    // Strip unprintable control characters cleanly
    const sanitizedInput = Array.from(prompt.trim())
      .filter((char) => {
        const code = char.charCodeAt(0);
        return (code >= 32 && code !== 127) || code === 10 || code === 13 || code === 9;
      })
      .join("");

    return {
      allowed: true,
      sanitizedInput,
    };
  }

  /**
   * Validates model outputs before persisting or streaming to product client.
   */
  public static validateOutput(rawOutput: string, maxTokens = MAX_OUTPUT_TOKENS_APPROX): GuardrailOutputResult {
    const flaggedCategories: string[] = [];

    if (!rawOutput) {
      return {
        safe: true,
        sanitizedOutput: "",
      };
    }

    let sanitized = rawOutput;

    // Truncate if token bounds exceeded
    if (sanitized.length > maxTokens * 4) {
      sanitized = sanitized.slice(0, maxTokens * 4) + "... [Output truncated for safety]";
      flaggedCategories.push("OutputLengthLimitExceeded");
    }

    // Check for accidental secret or environment variable leakage
    if (/AIZA[0-9A-Za-z-_]{35}/.test(sanitized) || /sk-[0-9A-Za-z]{32,}/.test(sanitized)) {
      sanitized = "[Redacted: sensitive token detected in output]";
      flaggedCategories.push("SecretLeakageDetected");
    }

    return {
      safe: flaggedCategories.length === 0,
      sanitizedOutput: sanitized,
      flaggedCategories: flaggedCategories.length > 0 ? flaggedCategories : undefined,
    };
  }
}
