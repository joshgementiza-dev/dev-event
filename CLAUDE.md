# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (Turbopack, outputs to .next/dev)
npm run build    # Production build (Turbopack by default)
npm run start    # Start production server
npm run lint     # Run ESLint (flat config, eslint.config.mjs)
```

There is no test suite configured yet.

## Architecture

- **Next.js 16.2.9** with **React 19.2.4** — App Router only, no Pages Router
- **Tailwind CSS v4** — configured via `@import "tailwindcss"` in `globals.css` and `postcss.config.mjs`; no `tailwind.config.*` file
- **TypeScript** — strict mode, path alias `@/*` maps to project root
- CSS custom properties for theming (`--background`, `--foreground`) defined in `globals.css` with dark-mode variants via `@media (prefers-color-scheme: dark)`; Tailwind theme tokens set via `@theme inline`
- Geist Sans and Geist Mono loaded via `next/font/google` in `app/layout.tsx`

## Next.js 16 Breaking Changes

These differ from what most AI training data reflects — read `node_modules/next/dist/docs/` for the authoritative reference.

**Async Request APIs (fully async now):** `cookies()`, `headers()`, `draftMode()`, route `params`, and page `searchParams` are Promises. Synchronous access is removed.

```tsx
// Correct in v16
export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
}
```

Run `npx next typegen` to generate `PageProps`, `LayoutProps`, `RouteContext` helpers.

**`middleware` → `proxy`:** Rename `middleware.ts` to `proxy.ts`; rename the export from `middleware` to `proxy`. The `edge` runtime is not supported in `proxy` — keep `middleware.ts` if you need the edge runtime. Config flags renamed too (e.g. `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`).

**Turbopack is the default bundler** for both `next dev` and `next build`. Use `--webpack` to opt out. Turbopack config moved to top-level `turbopack` in `next.config.ts` (was `experimental.turbopack`).

**`next lint` is removed** — lint runs directly via `eslint`. `next build` no longer runs lint automatically.

**`serverRuntimeConfig` / `publicRuntimeConfig` removed** — use environment variables (`NEXT_PUBLIC_` prefix for client-accessible values). Use `connection()` from `next/server` if you need runtime (not build-time) env vars in Server Components.

**`revalidateTag` requires a second argument** (a `cacheLife` profile, e.g. `'max'`). Use `updateTag` instead for read-your-writes semantics in Server Actions.

**`cacheLife` / `cacheTag` are stable** — drop the `unstable_` prefix.

**PPR renamed:** `experimental.ppr` / `experimental.dynamicIO` / `experimental.useCache` are removed. Use top-level `cacheComponents: true` in `next.config.ts`.

**Parallel routes:** every slot must have an explicit `default.js`; builds fail without them.

**`next/legacy/image` deprecated** — use `next/image`. `images.domains` deprecated — use `images.remotePatterns`.

**ESLint flat config only** — `eslint.config.mjs` format required. Legacy `.eslintrc` is not supported by `@next/eslint-plugin-next`.

**Dev/build output separation:** `next dev` outputs to `.next/dev`; `next build` outputs to `.next`. Concurrent dev and build are supported.
