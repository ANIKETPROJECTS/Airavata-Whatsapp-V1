# Airavata — WhatsApp Business Solution

A WhatsApp Business marketing and engagement platform. Features include campaign management, contact/group organisation, live chat, chatbot flow builder, template management, and WhatsApp-integrated payments (WAPay).

## Run & Operate

- **Frontend**: `pnpm --filter @workspace/airavata run dev` (workflow: `artifacts/airavata: web`)
- **API Server**: `pnpm --filter @workspace/api-server run dev` (workflow: `artifacts/api-server: API Server`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Required Secrets

| Secret | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `SESSION_SECRET` | JWT signing key |
| `META_ACCESS_TOKEN` | Meta/WhatsApp Cloud API token |
| `META_PHONE_NUMBER_ID` | WhatsApp phone number ID |
| `META_WABA_ID` | WhatsApp Business Account ID |
| `WEBHOOK_VERIFY_TOKEN` | Any string you choose — enter the same value in Meta App Dashboard → WhatsApp → Configuration → Webhook verify token |

> **Note**: `DATABASE_URL` (Postgres) is referenced in `lib/db` but the API server uses MongoDB exclusively via Mongoose. The Postgres/Drizzle lib is scaffolding that is not yet wired up.

## Registering the Webhook (Module 6)

1. Add `WEBHOOK_VERIFY_TOKEN` to Replit Secrets (any string you choose, e.g. `airavata_webhook_2024`).
2. Deploy the project (or use the Replit public URL) so Meta can reach it.
3. In Meta App Dashboard → WhatsApp → Configuration, set:
   - **Callback URL**: `https://<your-replit-domain>/api/webhook`
   - **Verify token**: the same value as `WEBHOOK_VERIFY_TOKEN`
4. Subscribe to the `messages` field.
5. Once verified, incoming messages and delivery status updates will be stored in MongoDB and appear in Live Chat.

## Stack

- **Monorepo**: pnpm workspaces, Node.js 24, TypeScript 5.9
- **Frontend**: React 19 + Vite, Tailwind CSS v4, Radix UI / shadcn, Wouter, TanStack Query
- **API**: Express 5, Pino logging, esbuild (CJS bundle)
- **DB**: MongoDB + Mongoose (primary); Postgres + Drizzle (scaffold, unused)
- **Validation**: Zod v4, drizzle-zod
- **API codegen**: Orval (OpenAPI → React Query hooks + Zod schemas)

## Where things live

- `artifacts/airavata/` — React frontend (Vite)
- `artifacts/api-server/` — Express API server
- `lib/api-spec/` — OpenAPI specification (source of truth for API contract)
- `lib/api-client-react/` — Generated TanStack Query hooks (from Orval)
- `lib/api-zod/` — Generated Zod schemas (from Orval)
- `lib/db/` — Drizzle/Postgres schema (scaffold, not yet active)

## Architecture decisions

- MongoDB is the active database; Mongoose models live in `artifacts/api-server/src/models/`
- API contract is spec-first: edit `lib/api-spec/`, run codegen, then implement
- Frontend uses Wouter for lightweight client-side routing
- Auth uses JWT signed with `SESSION_SECRET` via `jsonwebtoken` + `bcryptjs`

## Product

WhatsApp Business SaaS platform — campaigns, contacts, live chat, chatbot builder, template management, WAPay.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The API server build step runs esbuild before starting (`pnpm run build && pnpm run start`); rebuild is required after any backend change
- Aggregation `$match` stages do NOT auto-cast string IDs — always wrap with `new mongoose.Types.ObjectId(str)`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
