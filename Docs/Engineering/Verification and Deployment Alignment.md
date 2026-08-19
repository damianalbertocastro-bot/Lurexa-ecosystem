# Verification and Deployment Alignment

## Findings

1. The root verification contract is `verify:phase0`, which correctly uses `check-types`.
2. The root `typecheck` script calls a task that many workspaces do not expose; `check-types` is the canonical task.
3. `turbo.json` defines build, lint and check-types, but no test task.
4. Two Vercel configurations target Learn: root `vercel.json` and `apps/learn-web/vercel.json`. Only one deployment root/configuration may govern a Vercel project.
5. `verify-learn-web.yml` runs only on a historical fix branch and therefore does not protect normal PRs.

## Canonical contract

- Local and CI Phase 0: `pnpm verify:phase0`.
- Type checking: `check-types` everywhere.
- Learn deployment: configure Vercel with root directory `apps/learn-web`, using the app-local `vercel.json`; remove the root config only after Vercel project settings are verified.
- CI: move Learn verification into normal pull-request coverage after the foundation lock is green.
- Tests: add a Turbo `test` task only after every active package has either a real test script or an explicit no-test policy.

## Safe next implementation

Do not delete either Vercel config until the configured Vercel root directory is read from the connected Vercel project. First change CI branch triggers and root script naming; then verify a preview deployment.
