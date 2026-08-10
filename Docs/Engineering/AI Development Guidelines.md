# AI Development Guidelines

## Scope

These guidelines apply to AI-assisted features and to engineering work performed with AI tools.

## Safe use

- Do not submit secrets, credentials, proprietary customer data, or personal data to an AI service unless it is explicitly approved for that data.
- Treat AI output as untrusted: review it for correctness, security, licensing, privacy, and project conventions before use.
- Verify generated code with the same tests, review, and release controls required for human-authored code.

## Product behavior

- Make AI-assisted user experiences clear about their capabilities and limitations.
- Provide user controls and confirmation for consequential actions.
- Design for failure: show useful fallbacks, preserve user work, and avoid presenting generated content as certain when it is not.

## Accountability

The engineer making the change remains accountable for its quality and impact. Document significant model, prompt, evaluation, privacy, and safety decisions in the relevant design or pull-request record.
