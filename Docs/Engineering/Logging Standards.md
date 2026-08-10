# Logging Standards

## Purpose

Logs support debugging, observability, security investigations, and incident response.

## Requirements

- Use structured logs where supported, with stable field names.
- Include timestamp, severity, component or operation, and a correlation or request ID when available.
- Log meaningful lifecycle events, unexpected failures, and security-relevant actions.
- Use `debug` for development diagnostics, `info` for normal operational events, `warn` for recoverable concerns, and `error` for failed operations requiring attention.

## Data protection

Never log passwords, API keys, session tokens, authorization headers, full payment data, or unnecessary personal data. Redact sensitive values before logging.

## Quality

Write messages that describe the event and context, rather than merely repeating an exception. Avoid noisy per-item logs in high-volume paths unless they are sampled or gated.
