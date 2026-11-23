# CLAUDE.md

@AGENTS.md

## Commands

- Package manager: npm (don't use pnpm/yarn)

- `npm run dev` — dev server at http://localhost:3000
- `npm run check` — lint + typecheck + format:check + test. **Run before saying a task is done.**
- `npm run test` — unit tests once; `npm run test:watch` — watch mode (don't run it, it never exits)
- `npm run format` — fix formatting (use this, not npx prettier)
- `npm run build` — production build
- `npm run db:generate` — generate a SQL migration from the schema
- `npm run db:migrate` — apply migrations to the database (needs my approval)
- `npm run db:seed` — seed demo data (empty database only)
- `npm run db:studio` — Drizzle Studio (long-running, I run it myself)

Testing: Vitest + React Testing Library + jest-dom matchers, jsdom environment (`vi.*`, not `jest.*`). Linting: ESLint 9 flat config + Prettier.

## Database

- Drizzle ORM + Neon Postgres. Schema: `src/db/schema.ts`, client: `src/db/index.ts` (server-only)
- Drizzle is on the stable 0.x line (drizzle-orm 0.45, drizzle-kit 0.31), not v1/rc — check APIs against the installed version, not the latest docs
- Schema change = edit schema → `npm run db:generate` → show me the SQL → I approve `npm run db:migrate`
- Never edit generated migrations in `drizzle/` by hand; never use `drizzle-kit push`
- Seed only runs on an empty database; there is no reset

## Product

Personal job-search tracker: add a vacancy by pasting its text, AI parses it into
structured fields, matches it against my CV, and tracks the application funnel
(found → applied → HR → tech → offer / rejected).

## Conventions

- No `any`: use `unknown` and narrow it
- Tests live next to the file: `Component.test.tsx`
- Use `@/` imports, not relative `../../`

## Workflow

- For changes touching more than 2 files, propose a plan first
- Never install dependencies without asking
- Never read or print `.env*` files
- Don't commit unless I ask

## Stack and versions

Next.js 16.4, React 19.3, Tailwind CSS 4.3, TypeScript (strict). These are newer than most training data — per AGENTS.md, read the bundled docs in `node_modules/next/dist/docs/` (`01-app/` is the App Router) before writing Next.js code rather than relying on memory.

## Architecture notes

- **App Router under `src/app/`.** Import alias `@/*` → `./src/*`.
- **Cache Components + Partial Prefetching are on** (`cacheComponents: true`, `partialPrefetching: true` in `next.config.ts`). This changes the rendering model: caching is opt-in via the `"use cache"` directive (pair it with `cacheLife`), uncached dynamic data must be wrapped in `<Suspense>`, and `GET` Route Handlers prerender like pages. See `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` and `02-guides/optimizing-prefetching.md`. Don't use the old `export const dynamic`/`revalidate` segment-config model without checking the docs.
- **Typed route helpers**: layouts/pages use global generated types such as `LayoutProps<"/">` (see `src/app/layout.tsx`), generated into `.next/types` by `next dev`/`next build`.
- **Tailwind v4 is wired through Turbopack**: `next.config.ts` routes `*.css` through the `@tailwindcss/turbopack` loader (there is no `postcss.config` / `tailwind.config`). Theme tokens live in `src/app/globals.css` via `@import "tailwindcss"` and an `@theme inline` block mapping CSS variables (`--background`, `--foreground`, Geist font vars) to Tailwind colors/fonts. Dark mode follows `prefers-color-scheme`.
- Fonts are Geist / Geist Mono via `next/font/google`, exposed as CSS variables on `<html>`.
