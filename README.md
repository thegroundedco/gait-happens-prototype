# Gait Happens — Website (Astro reference build)

## What this is

A clickable, production-fidelity **HTML/CSS/JS reference build** of the Gait
Happens site header, navigation, and page shells — built in [Astro](https://astro.build)
so it can be run, browsed, and inspected like a real site.

**This is not a Shopify theme, and it does not become one.** It exists so a
dev team can click through real markup/CSS/JS and port it into Shopify
templates/sections/snippets by hand (see [Component → Shopify mapping](#component--shopify-mapping)
below). The real Gait Happens storefront (Shopify) and this reference build
are independent projects — changes here never deploy to, or sync with, the
live site.

## Run it

All commands run from the repo root.

| Command | What it does |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the live dev server at `localhost:4321` (hot reload) |
| `npm run build` | Build the static production site to `./dist/` |
| `npm run preview` | Serve the built `./dist/` locally, as a final check before sharing/deploying |
| `npm run check:links` | The core acceptance test for this repo. Spawns `preview` and crawls it with [linkinator](https://github.com/JustinBeckwith/linkinator) to catch broken internal/external links, then tears the server down. Expect `0 broken`. `preview` serves the already-built `./dist/`, so run `npm run build` first — a fresh clone must build before checking links. |
| `npm test` | Runs the Node test runner (`node --test`) against `tests/*.test.mjs` — sitemap integrity (unique paths, required fields, menu hrefs resolve to real routes) |

### Dropbox build note

This repo currently lives in a Dropbox-synced folder. `npm run build` can
**exit with code 1** even though the build succeeded, because Dropbox
locks files in `dist/`/`dist/.prerender` while it's syncing them and Astro's
post-build cleanup can't remove them (`EBUSY: resource busy or locked`). If
`npm run build` exits non-zero, **inspect `./dist/` before assuming
failure** — if the expected pages are there, the build worked. This is a
side effect of the Dropbox-synced working folder and will not occur in the
dev team's CI/hosting environment.

## Design tokens

Tokens live as CSS custom properties in [`src/styles/tokens.css`](src/styles/tokens.css) —
color, type scale, and spacing. Every component reads from these variables
rather than hardcoding values, so the token file is the single place to
retune the visual system.

- **Color** — `--color-ink` (`#231F20`), `--color-yellow` (`#FEC745`),
  `--color-teal` (`#047791`), plus `--color-paper` and `--color-ink-70`.
  These hex values were sampled from the rendered Figma design-system
  mockups and cross-checked against the design system, but should still be
  **confirmed against the live Figma variables** before this becomes a
  source of truth for production hex values.
- **Type** — a named scale (`--type-display`, `--type-h3`, `--type-body`,
  `--type-label`, etc.), each a full CSS `font` shorthand (weight/size/line-height/family),
  read from the design system's Typography spec, plus self-hosted
  Montserrat (`public/fonts/*.woff2`, `@font-face` in `src/styles/global.css`) —
  no external font requests.
- **Spacing** — `--space-1` … `--space-8`, a **pragmatic 4px-based scale**
  (4/8/12/16/24/32/48/64). This was not read directly from a DS "Spacing"
  page — it should be **confirmed against the actual design-system spacing
  tokens** once available and adjusted if the steps don't line up.

## Single source of truth: `src/data/sitemap.js`

Every route lives once, in [`src/data/sitemap.js`](src/data/sitemap.js), and
drives two things at once:

1. **Navigation** — `menus` (header mega-menus + footer columns) and
   `accountMenu` (account dropdown) reference route paths from here.
2. **Pages** — [`src/pages/[...slug].astro`](<src/pages/%5B...slug%5D.astro>)
   calls `getStaticPaths()` over `routes` and generates one page per route
   (the home page, `/`, is generated separately by `src/pages/index.astro`,
   also reading from `routes`).

Add, rename, or remove a route in `sitemap.js` and both the nav and the
generated page update together — there's no second list to keep in sync.
`tests/sitemap.test.mjs` enforces that every route has a unique path,
title, and breadcrumb, and that every menu/account href resolves to a real
route.

### Placeholder → built

Each route object carries a `status` of `'placeholder'` or `'built'`. Every
route is currently `'placeholder'` — that's expected; individual pages get
built out in later project phases, not in this foundation pass. A
placeholder route renders via [`src/components/PlaceholderPage.astro`](src/components/PlaceholderPage.astro)
(breadcrumb, title, an "in progress" chip, and a note).

**To build a page out:** replace the `<PlaceholderPage>` rendering for that
route with real content/components, then flip its `status` to `'built'` in
`sitemap.js`. The [`/_status`](#internal-build-status-page) page reflects
progress automatically — no other bookkeeping needed.

## Internal build-status page

`/_status` is an internal, unlinked dashboard — grouped by section, it
lists every route from `sitemap.js` with its path, title, and `status`
(and `phase`, when set), plus a `built/total` count in the heading. It is
**not** linked from the header or footer; it exists for the team building
this reference, not site visitors.

It also serves a second purpose: `npm run check:links` crawls from **both**
`/` and `/_status` (see [`scripts/check-links.mjs`](scripts/check-links.mjs)).
The public nav alone only reaches routes that appear in a menu/footer
column, so PDPs, course pages, `/search`, `/cart`, and `/account/*` are
invisible to a crawl that starts at `/` alone. `/_status` links every route
in the sitemap, so crawling both roots together verifies all 38 content
routes plus the status page itself.

(Implementation note: `/_status` is *not* a file at `src/pages/_status.astro`.
Astro's file-based router silently excludes any path segment starting with
`_` from routing when it scans `src/pages`, so that file would build to
nothing. The component lives at `src/internal/status.astro` instead and is
wired to the `/_status` URL via `injectRoute` in `astro.config.mjs`, which
isn't subject to that exclusion.)

## Component → Shopify mapping

The Astro components are the handoff guide — each maps onto a Shopify
section/snippet:

| Astro component | Shopify equivalent |
| :-- | :-- |
| `Header.astro` + `MegaMenu.astro` + `NavCard.astro` | Header section + mega-menu sub-blocks |
| `AccountMenu.astro` | Account dropdown, in the header section |
| `SearchOverlay.astro` | Predictive search overlay, in the header section |
| `CartDrawer.astro` | Cart drawer section/snippet |
| `MobileNav.astro` | Mobile nav drawer, in the header section |
| `AnnouncementBar.astro` | Announcement bar section |
| `Footer.astro` | Footer section |
| `Breadcrumb.astro` / `StatusChip.astro` | Small reusable snippets |
| `PlaceholderPage.astro` | A generic page template, replaced page-by-page as each route is built out |

`BaseLayout.astro` (global `<head>`, font/token loading, header/footer
mount, motion script) maps to Shopify's `theme.liquid`.

## URL conventions

Routes use **Shopify-style paths** so the eventual Shopify site's URL
structure matches this reference 1:1: `/products/*`, `/collections/*`,
`/pages/*`, `/blogs/*`, plus site-specific paths (`/courses/*`,
`/resources/*`, `/account/*`, `/search`, `/cart`). See `sitemap.js` for the
full list.

## Motion

Scroll-triggered reveals run on [GSAP](https://gsap.com) + ScrollTrigger
(`src/scripts/motion.js`): elements marked `data-reveal` fade/slide in as
they enter the viewport, re-initialized on every navigation via
`astro:page-load` (needed because Astro View Transitions — `<ClientRouter />`,
mounted in `BaseLayout.astro` — swap the DOM in place rather than
reloading the page). Under `prefers-reduced-motion: reduce`, `motion.css`
skips the pre-hide and `motion.js` skips the animation entirely, so content
is simply visible with no motion.

## Stack

- [Astro](https://astro.build) — static site generation, `.astro` components, no UI framework
- [GSAP](https://gsap.com) — scroll reveals, micro-interactions
- Astro View Transitions (`<ClientRouter />`) — page-to-page transitions
- Self-hosted Montserrat (`public/fonts/*.woff2`) — no external font requests
