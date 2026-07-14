---
name: Airavata MongoDB setup
description: How MongoDB was wired into the Airavata project's API server alongside the scaffold's default Postgres/Drizzle db lib.
---

The Replit scaffold's `artifacts/api-server` already depends on `@workspace/db`, a shared Drizzle/Postgres package. The Airavata project has a hard requirement (from the user) to use MongoDB only, never Postgres/MySQL/SQLite/Firebase/Supabase.

**Decision:** Do not touch or use `@workspace/db`. Instead, added `mongoose` as a direct dependency of `artifacts/api-server` and created a self-contained connection module (`src/lib/mongodb.ts`) plus Mongoose models under `src/models/`. Connection string is stored as the `MONGODB_URI` secret (requested from the user directly — never generate a fake connection string).

**Why:** Mixing DB paradigms in one service, or silently defaulting to the pre-provisioned Replit Postgres database, would violate an explicit non-negotiable user constraint. Keeping Mongo setup isolated in the api-server package avoids any risk of the shared `@workspace/db` lib being invoked elsewhere.

**How to apply:** For any future module in this project that needs persistence, import models from `src/models` and call `connectToDatabase()` (idempotent) — never add Postgres-flavored code, ORMs, or a second database.

Health check: `GET /api/healthz/db` returns `{status, mongo: "connected"|...}` — a plain (non-OpenAPI-generated) route since `@workspace/api-zod` schemas are codegen'd and shouldn't be hand-edited for ad-hoc checks.
