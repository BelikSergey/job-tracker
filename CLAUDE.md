# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project state

`job-tracker` is a freshly bootstrapped `create-next-app` project (App Router, TypeScript, Tailwind). No domain code, data layer, or tests exist yet — `src/app/page.tsx` is still the starter page and `layout.tsx` still has the default metadata.

## Commands

npm is the package manager (`package-lock.json`).

- `npm run dev` — dev server at http://localhost:3000 (Turbopack)
- `npm run build` — production build; also the main type-check gate
- `npm run start` — serve the production build
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`, `core-web-vitals` + `typescript` presets)
- `npx tsc --noEmit` — type-check only

No test runner is configured.

## Stack and versions

Next.js 16.4, React 19.3, Tailwind CSS 4.3, TypeScript (strict). These are newer than most training data — per AGENTS.md, read the bundled docs in `node_modules/next/dist/docs/` (`01-app/` is the App Router) before writing Next.js code rather than relying on memory.

## Architecture notes

- **App Router under `src/app/`.** Import alias `@/*` → `./src/*`.
- **Cache Components + Partial Prefetching are on** (`cacheComponents: true`, `partialPrefetching: true` in `next.config.ts`). This changes the rendering model: caching is opt-in via the `"use cache"` directive (pair it with `cacheLife`), uncached dynamic data must be wrapped in `<Suspense>`, and `GET` Route Handlers prerender like pages. See `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` and `02-guides/optimizing-prefetching.md`. Don't use the old `export const dynamic`/`revalidate` segment-config model without checking the docs.
- **Typed route helpers**: layouts/pages use global generated types such as `LayoutProps<"/">` (see `src/app/layout.tsx`), generated into `.next/types` by `next dev`/`next build`.
- **Tailwind v4 is wired through Turbopack**: `next.config.ts` routes `*.css` through the `@tailwindcss/turbopack` loader (there is no `postcss.config` / `tailwind.config`). Theme tokens live in `src/app/globals.css` via `@import "tailwindcss"` and an `@theme inline` block mapping CSS variables (`--background`, `--foreground`, Geist font vars) to Tailwind colors/fonts. Dark mode follows `prefers-color-scheme`.
- Fonts are Geist / Geist Mono via `next/font/google`, exposed as CSS variables on `<html>`.
