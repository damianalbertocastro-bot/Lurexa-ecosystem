# Security Checklist

Version: 1.0

Status: Approved

Owner: Security & Platform Engineering

Last Updated: 2026-07-28

---

# Purpose

This document defines the minimum security requirements for every feature, service, application, package, and infrastructure component developed within the Lurexa ecosystem.

Security is not a final verification step.

Security is part of the software design process.

Every Pull Request should be evaluated against this checklist before merging.

---

# Security Principles

Lurexa follows these principles:

- Secure by Default
- Least Privilege
- Defense in Depth
- Zero Trust
- Explicit Access
- Encryption Everywhere
- Privacy First

Every feature should assume that attackers exist.

---

# Security Review Process

Every Pull Request should answer:

- What new attack surface was introduced?
- What data is exposed?
- Who can access it?
- How is it protected?
- How would an attacker misuse it?

---

# Authentication

Verify:

- [ ] Authentication required where appropriate
- [ ] Firebase Authentication used correctly
- [ ] Expired sessions handled
- [ ] Session refresh implemented securely
- [ ] Logout clears local credentials
- [ ] Anonymous access intentionally configured

---

# Authorization

Verify:

- [ ] Role-Based Access Control (RBAC)
- [ ] User permissions validated
- [ ] Server verifies authorization
- [ ] UI restrictions are not the only protection
- [ ] Admin endpoints protected
- [ ] Teacher-only resources restricted

Never trust the client.

---

# Firestore Security Rules

Every collection should have explicit rules.

Verify:

- [ ] Read permissions defined
- [ ] Write permissions defined
- [ ] Ownership enforced
- [ ] Validation rules present
- [ ] Public collections intentional

Never deploy with:

```
allow read, write: if true;
```

---

# Input Validation

All external input must be validated.

Includes:

- Forms
- APIs
- URL parameters
- Query strings
- AI prompts
- Uploaded files

Verify:

- [ ] Required fields validated
- [ ] Length limits enforced
- [ ] File types restricted
- [ ] Numeric ranges checked
- [ ] Enum values validated

---

# Sensitive Data

Sensitive information includes:

- Email addresses
- Student information
- Payment details
- Authentication tokens
- API keys
- Internal IDs

Verify:

- [ ] Sensitive fields minimized
- [ ] No unnecessary storage
- [ ] Encryption where required

---

# Secret Management

Secrets must never appear in:

- Source code
- Git history
- Screenshots
- Documentation
- Client applications

Use:

- GitHub Secrets
- Firebase Secret Manager
- Google Secret Manager
- Environment variables

Never commit:

```
.env.local
```

---

# Environment Variables

Separate variables by environment:

Development

Testing

Staging

Production

Verify:

- [ ] Production secrets isolated
- [ ] Client-safe variables prefixed correctly
- [ ] Secret rotation documented

---

# API Security

Every endpoint should verify:

- Authentication
- Authorization
- Request validation
- Response validation
- Error handling

Return generic error messages.

Avoid exposing implementation details.

---

# AI Security

AI introduces unique risks.

Review:

- Prompt Injection
- Data Leakage
- Hallucinations
- Prompt Manipulation
- Jailbreak Attempts

Verify:

- [ ] User input sanitized
- [ ] System prompts protected
- [ ] Sensitive context filtered
- [ ] Unsafe output handled

---

# Prompt Safety

Never expose:

- Internal prompts
- API keys
- Hidden instructions
- System architecture
- Internal tooling

Prompt templates belong inside the AI capability.

---

# File Uploads

Every upload should verify:

- MIME type
- File size
- Extension
- Malware scanning (future)
- Storage permissions

Never trust file extensions alone.

---

# Payment Security

Payments use Stripe.

Applications must never:

- Store card numbers
- Store CVV
- Process raw payment information

Only use Stripe Checkout or Stripe Elements.

---

# Google Calendar Integration

Verify:

- OAuth scopes minimized
- Refresh tokens protected
- Calendar ownership verified
- Revoked access handled

---

# Offline Security

Offline mode must protect:

- Cached student data
- Local AI models
- Downloaded lessons
- Authentication tokens

Verify:

- [ ] Local storage minimized
- [ ] Sensitive cache encrypted where practical
- [ ] Logout clears protected data

---

# Dependency Security

Before adding a dependency:

Verify:

- Maintenance status
- Community adoption
- Security history
- License compatibility

Avoid abandoned packages.

Run:

```
pnpm audit
```

Regularly.

---

# Logging

Logs must never contain:

- Passwords
- Tokens
- Payment data
- AI prompts containing personal data
- Sensitive identifiers

Use structured logging.

---

# Error Messages

Safe:

```
Authentication failed.
```

Unsafe:

```
JWT expired because token X belongs to user Y.
```

Do not expose internal implementation.

---

# Rate Limiting

Protect:

- Login
- Registration
- AI endpoints
- Password reset
- Payments
- Public APIs

Use:

- Request throttling
- Retry limits
- Abuse detection

---

# Security Headers

Applications should enable:

- Content Security Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

HTTPS is mandatory.

---

# Third-Party Services

Before integrating any service:

Review:

- Security practices
- Data retention
- Privacy policy
- Compliance
- Vendor reliability

Document every external integration.

---

# Privacy

Collect only the information necessary.

Verify:

- [ ] Data minimization
- [ ] Clear user consent
- [ ] Deletion supported
- [ ] Export supported (future)

---

# Security Testing

Include:

- Unit tests
- Authorization tests
- Firestore rule tests
- API validation tests
- AI safety evaluations

Security should be continuously tested.

---

# Incident Readiness

Every security issue should include:

- Severity
- Impact
- Timeline
- Mitigation
- Recovery plan

Critical vulnerabilities require immediate response.

---

# Pull Request Security Checklist

Before approving:

- [ ] Authentication verified
- [ ] Authorization verified
- [ ] Firestore rules updated if needed
- [ ] Secrets protected
- [ ] Input validated
- [ ] AI safety reviewed
- [ ] Logs sanitized
- [ ] Dependencies reviewed
- [ ] Security tests pass

---

# Security Severity Levels

## Critical

Immediate exploitation possible.

Examples:

- Authentication bypass
- Secret exposure
- Remote code execution

Target response:

Immediately.

---

## High

Serious risk with limited mitigation.

Examples:

- Privilege escalation
- Unauthorized data access

Target response:

Within 24 hours.

---

## Medium

Moderate impact.

Examples:

- Missing validation
- Weak rate limiting

Target response:

Next development cycle.

---

## Low

Minor improvement.

Examples:

- Missing security headers
- Incomplete logging

Address during routine maintenance.

---

# Related Documents

- Coding Standards.md
- Pull Request Checklist.md
- Architecture Review Checklist.md
- Testing Strategy.md
- Dependency Graph.md
- Capability Architecture.md

---

# Guiding Principle

Security is not achieved by adding more controls.

Security is achieved by designing systems where mistakes are difficult to make and attacks are difficult to succeed.

Every line of code should reduce risk rather than introduce it.