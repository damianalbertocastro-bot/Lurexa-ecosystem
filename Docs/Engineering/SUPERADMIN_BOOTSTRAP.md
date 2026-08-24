# Lurexa Superadmin Bootstrap

## Purpose

Lurexa Admin platform operations require a Firebase ID token whose custom `role` claim is `super_admin`.

The product must never self-provision this privilege. A trusted operator explicitly chooses the account and applies the claim using server credentials.

## Safety model

The repository command is dry-run by default:

```bash
pnpm admin:grant-superadmin -- --email admin@example.com
```

or:

```bash
pnpm admin:grant-superadmin -- --uid FIREBASE_UID
```

The dry run resolves the selected Firebase account and prints the proposed role change without modifying custom claims.

After verifying that the selected account is correct, the operator explicitly adds `--apply`:

```bash
pnpm admin:grant-superadmin -- --email admin@example.com --apply
```

The command:

- requires exactly one explicit email or UID;
- has no default account;
- performs no mutation without `--apply`;
- preserves all existing Firebase custom claims;
- changes only the `role` claim to `super_admin`;
- embeds no password, private key, service account, or account identifier in source control.

## Credentials

The command uses the repository's existing Firebase Admin server configuration. The trusted operator environment must already provide the approved Firebase Admin credentials through the supported environment variables.

Do not paste service-account JSON, private keys, passwords, API keys, or refresh tokens into chat, command history, source files, or pull requests.

## After applying the claim

Firebase ID tokens issued before the claim change remain stale. The selected user should sign out and sign back in to Lurexa Admin so the client receives a refreshed token.

The Admin client checks the claim for user experience, but authorization is still enforced server-side on every Core platform operation.

## Verification

`pnpm verify:superadmin-bootstrap` checks that:

- the command remains dry-run by default;
- `--apply` gates the Firebase mutation;
- an explicit account selector is required;
- existing custom claims are preserved;
- no credentials are embedded in the bootstrap script.

This verification does not grant access to any account.

## Approval boundary

Selecting the first real superadmin account is an operational security decision. The repository can provide safe tooling, but it must not infer which person or account should receive platform-wide authority.
