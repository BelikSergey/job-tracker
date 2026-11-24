---
paths:
  - "src/db/**"
  - "drizzle/**"
  - "drizzle.config.ts"
---

# Database

- Drizzle ORM + Neon Postgres. Schema: `src/db/schema.ts`, client: `src/db/index.ts` (server-only)
- Drizzle is on the stable 0.x line (drizzle-orm 0.45, drizzle-kit 0.31), not v1/rc — check APIs against the installed version, not the latest docs
- Schema change = edit schema → `npm run db:generate` → show me the SQL → I approve `npm run db:migrate`
- Never edit generated migrations in `drizzle/` by hand; never use `drizzle-kit push`
- Seed only runs on an empty database; there is no reset
