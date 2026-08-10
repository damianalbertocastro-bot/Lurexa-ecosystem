# `@lurexa/config`

Shared application configuration loaded from environment variables.

## Usage

```ts
import { createAppConfig } from "@lurexa/config";

const config = createAppConfig();
```

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | App environment | `development` |
| `API_URL` | Backend API URL | `http://localhost:3001` |
| `APP_URL` | Frontend app URL | `http://localhost:3000` |

## Scripts

- `pnpm lint` — Run ESLint
- `pnpm check-types` — Run TypeScript type checking


# @lurexa/config

Shared configuration package for the Lurexa monorepo.

## TypeScript configurations

### Base configuration

Use for packages that do not require framework-specific settings.

```json
{
  "extends": "@lurexa/config/typescript/base",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}