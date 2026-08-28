# Real-User Validation Evidence

This directory stores empirical validation evidence produced under `Docs/Engineering/REAL_USER_VALIDATION_PROTOCOL.md`.

## Rules

- Use anonymized participant codes only (`L01`, `E01`, `A01`).
- Never commit passwords, authentication tokens, raw private transcripts, unnecessary learner-identifiable content, or screenshots containing sensitive data.
- Record the exact tested deployment SHA and runtime URL/environment.
- Keep observed outcomes separate from participant opinions and moderator interpretation.
- Link every S0/S1 defect to its issue or PR and record revalidation evidence after the fix.
- Do not call prompted or assisted completion an independent success.

## File convention

- Individual sessions: `YYYY-MM-DD_<participant-code>_<product>.md`
- Round summaries: `YYYY-MM-DD_<scope>_VALIDATION_REPORT.md`

Use `SESSION_TEMPLATE.md` for each participant and `ROUND_REPORT_TEMPLATE.md` for the cohort summary.
