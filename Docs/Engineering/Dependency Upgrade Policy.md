# Dependency Upgrade Policy

## Principles

Keep dependencies supported, secure, and intentional. Prefer the smallest upgrade that resolves the need while maintaining compatibility.

## Update expectations

- Review direct dependencies regularly and address security advisories promptly.
- Pin or lock resolved versions through the repository's package manager files.
- Read release notes for major-version changes and any dependency that affects security, storage, networking, or builds.

## Validation

- Run the relevant build, tests, linting, and type checks after an upgrade.
- Add or update tests when behavior changes.
- Document migrations, breaking changes, and rollback steps in the pull request.

## Exceptions

Temporary exceptions require a documented owner, reason, mitigation, and review date.
