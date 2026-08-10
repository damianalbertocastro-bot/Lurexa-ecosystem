# `@lurexa/sdk`

TypeScript SDK for the Lurexa API.

## Usage

```ts
import { createSdk } from "@lurexa/sdk";

const sdk = createSdk();
const { data, error } = await sdk.getUser("user-id");
```

## Scripts

- `pnpm lint` — Run ESLint
- `pnpm check-types` — Run TypeScript type checking
