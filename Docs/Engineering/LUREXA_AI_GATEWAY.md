# Lurexa AI Gateway Architecture

Status: foundation implementation
Branch: `feat/lurexa-ai-gateway-foundation`

## Purpose

Lurexa Mind owns learning intelligence. It should not be coupled to a single model provider. The AI Gateway is the server-side boundary that turns a Lurexa learning task into a provider/model request, applies routing policy, validates the response, and exposes provider-independent results to products.

## Governing boundary

```text
Lurexa Core
  trusted identity, authorization, evidence, persistence
        |
        v
Lurexa Mind
  interprets authorized evidence and defines the learning task
        |
        v
AI Context Builder / Task Contract
        |
        v
Lurexa AI Gateway
  routing + provider abstraction + validation
        |
   +----+-------------+
   |                  |
Gemini            OpenRouter
   |                  |
Google models    multiple model providers

Audio remains a separate capability boundary:
Lurexa Mind -> Speech/Audio Gateway -> ElevenLabs or other speech provider
```

## Rules

1. Products do not call Gemini or OpenRouter directly.
2. Learner Model records remain owned by Core. Providers receive task-scoped context, not the complete learner record.
3. Model selection is policy-driven by `AiTask`, not hard-coded in product code.
4. A provider failure may trigger the next route. A response validation failure also prevents the response from reaching the learner.
5. Provider names and model IDs are operational configuration, not part of product contracts.
6. ElevenLabs is not an LLM fallback. It belongs behind a separate audio/speech capability interface.
7. AI telemetry must record route, task, latency, success/failure, and usage where available, while avoiding learner-sensitive prompt/response storage by default.

## Current foundation

`packages/backend/src/ai/` now contains:

- `types.ts` — provider-independent contracts.
- `prompts.ts` — shared Lurexa Mind system prompt policy by task.
- `router.server.ts` — task-based route policy.
- `gateway.server.ts` — orchestration and provider fallback.
- `validation.server.ts` — first response guardrails.
- `providers/gemini.server.ts` — direct Gemini adapter.
- `providers/openrouter.server.ts` — OpenRouter adapter.
- `index.ts` — stable backend entrypoint.

## Migration strategy

The existing `learn-tutor.server.ts` currently owns Gemini request construction. The next migration step is to make Learn call `lurexaAiGateway.generate(...)` while preserving its existing scenario logic, transcript limits, deterministic fallback, and Core/Mind evidence boundaries. Do not rewrite the whole tutor flow at once.

After Learn is migrated and verified, Coach should adopt the same gateway for language reasoning while its speech pipeline remains separate.

## Routing policy

The initial policy deliberately favors Gemini for high-volume tutor operations and allows OpenRouter to act as an alternate route. More expensive reasoning routes are available for assessment, lesson generation, and recommendation tasks. These defaults are configurable through server-only environment variables.

The route policy must eventually be evidence-driven using measured quality, latency, cost, and failure rates from Lurexa telemetry. Do not permanently declare one model the "best" model.

## Security

Keep `GEMINI_API_KEY` and `OPENROUTER_API_KEY` server-only. Never expose them through `NEXT_PUBLIC_*`, client bundles, or public deployment variables. OpenRouter requests should receive only the minimum context required for the task.

## Next implementation phase

1. Add environment contracts for OpenRouter and route model configuration.
2. Add gateway unit tests for routing, provider fallback, and validation.
3. Migrate Learn roleplay generation behind the gateway.
4. Add structured AI telemetry.
5. Implement the separate speech/audio provider contract and verify the actual ElevenLabs runtime integration before treating ElevenLabs as production-active.
6. Add controlled model evaluation for Lurexa-specific tasks.
