# Error Handling Standards

## Principles

Handle failures deliberately: preserve useful context, protect sensitive information, and give callers an actionable outcome.

## Requirements

- Validate inputs at system boundaries and fail early with clear messages.
- Use typed or structured errors where the language and framework support them.
- Include operation context and the underlying cause when propagating errors.
- Never expose secrets, tokens, private data, or internal stack details to end users.
- Do not silently swallow errors; explicitly handle, retry, transform, or rethrow them.

## Retries and recovery

Retry only transient, idempotent operations, with bounded attempts and backoff. Surface failures that need user action or operator intervention.

## User-facing errors

Messages should state what failed and the next safe action. Log the technical details separately with a correlation identifier when available.
