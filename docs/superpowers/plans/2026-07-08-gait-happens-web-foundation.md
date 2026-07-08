# Gait Happens Web Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the shared foundation (design tokens, header/mega-nav/footer, motion system) plus the entire sitemap scaffolded as real, linked placeholder pages, as an Astro reference repo the client's dev team ports into Shopify.

**Architecture:** Astro static site. A single `src/data/sitemap.js` is the source of truth for both the navigation menus and the generated placeholder pages, so nav and pages cannot drift. Components are small, self-contained, and map ~1:1 onto Shopify sections/snippets. Styling is hand-authored CSS driven entirely by design-system tokens exposed as CSS custom properties. Motion is GSAP + ScrollTrigger plus Astro View Transitions, established as a shared system in the foundation so later pages inherit it.

**Tech Stack:** Astro, vanilla JS, GSAP + ScrollTrigger, self-hosted Montserrat (woff2), `linkinator` (dev link-check), Node built-in test runner (`node --test`).

## Global Constraints

- Fidelity: faithful-but-pragmatic to Figma (mockups file `FX7PDNvhZwyozODaq8Q8i7` node 357-274; nav node 426-214). Match layout/type/color/interaction; do not pixel-nudge.
- No hard-coded hex or px in components — reference CSS custom properties from `tokens.css` / `motion.css` only.
- Design tokens sourced from design-system Figma file `B0fHmlEEm9OdOOnAbnmI8d`; type family is Montserrat throughout.
- URLs follow Shopify conventions (`/products/`, `/collections/`, `/pages/`, `/blogs/`) exactly as defined in `sitemap.js` — never invent a path not in that file.
- Every internal link must resolve (zero broken links) — this is the primary acceptance test.
- All motion respects `prefers-reduced-motion: reduce`. Animate transform/opacity only.
- Top-level Shop/Courses/Resources/Contact open a menu only (no landing page); About is the sole direct link; logo → `/`.
- Placeholder pages must look intentional and on-brand (full header/footer, title, breadcrumb, "In progress" chip) — never blank.
- Commit after every task with a conventional-commit message.

## File Structure

```
00_Claude/
  package.json                         scripts + deps
  astro.config.mjs                     Astro config (View Transitions)
  README.md                            run instructions + dev-team handoff notes
  tests/
    sitemap.test.mjs                   validates sitemap data integrity
  scripts/
    check-links.mjs                    builds + crawls preview for broken links
  src/
    data/sitemap.js                    SOURCE OF TRUTH: menus + routes
    styles/
      tokens.css                       design-system tokens (color/type/space)
      motion.css                       motion tokens + micro-interaction transitions
      global.css                       reset + base + type styles
    scripts/motion.js                  GSAP reveal-on-scroll + reduced-motion guard
    layouts/BaseLayout.astro           html shell: header + slot + footer + View Transitions
    components/
      AnnouncementBar.astro
      Header.astro
      MegaMenu.astro
      NavCard.astro
      AccountMenu.astro
      SearchOverlay.astro
      CartDrawer.astro
      MobileNav.astro
      Footer.astro
      Button.astro
      Breadcrumb.astro
      StatusChip.astro
      PlaceholderPage.astro
    pages/
      index.astro                      Home placeholder
      [...slug].astro                  generates every non-home placeholder route from sitemap
      _status.astro                    internal build-progress checklist
  public/
    images/nav/                        exported nav card images + logo
    fonts/                             Montserrat woff2
```

---

### Task 1: Scaffold Astro project + tooling

**Files:**
- Create: `package.json`, `astro.config.mjs`, `src/pages/index.astro` (temporary), `README.md`
- Create: `scripts/check-links.mjs`

**Interfaces:**
- Produces: working `npm run dev`, `npm run build`, `npm run preview`, `npm run check:links`, `npm test`.

- [ ] **Step 1: Initialize a minimal Astro project in the repo root**

Run (from repo root, which already contains `.gitignore` and `docs/`):
```bash
npm create astro@latest -- --template minimal --no-install --no-git --yes .
```
If the directory-not-empty prompt blocks non-interactively, scaffold in a temp dir and copy `package.json`, `astro.config.mjs`, `src/`, `public/`, `tsconfig.json` into the repo root.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install gsap
npm install -D linkinator
```

- [ ] **Step 3: Configure Astro with View Transitions and a site URL**

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://gaithappens.com',
  // Astro View Transitions are enabled per-page via the <ClientRouter /> in BaseLayout.
});
```

- [ ] **Step 4: Add npm scripts**

Merge into `package.json` `"scripts"`:
```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "check:links": "node scripts/check-links.mjs",
  "test": "node --test"
}
```

- [ ] **Step 5: Write the link-check script**

`scripts/check-links.mjs`:
```js
import { spawn } from 'node:child_process';
import { LinkChecker } from 'linkinator';

const PORT = 4321;
const BASE = `http://localhost:${PORT}`;

const preview = spawn('npm', ['run', 'preview', '--', '--port', String(PORT)], {
  stdio: 'ignore', shell: true,
});

async function waitForServer(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try { await fetch(url); return; } catch { await new Promise(r => setTimeout(r, 250)); }
  }
  throw new Error('preview server did not start');
}

try {
  await waitForServer(BASE);
  const checker = new LinkChecker();
  const result = await checker.check({ path: BASE, recurse: true });
  const broken = result.links.filter(l => l.state === 'BROKEN');
  if (broken.length) {
    console.error(`\n${broken.length} BROKEN links:`);
    for (const b of broken) console.error(`  ${b.status}  ${b.url}  (on ${b.parent})`);
    process.exitCode = 1;
  } else {
    console.log(`OK — ${result.links.length} links checked, 0 broken.`);
  }
} finally {
  preview.kill();
}
```

- [ ] **Step 6: Verify dev + build run**

Run: `npm run build`
Expected: build succeeds, `dist/` created, no errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project + link-check tooling"
```

---

### Task 2: Design tokens, global styles, fonts

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/motion.css`, `src/styles/global.css`
- Create: `public/fonts/` (Montserrat woff2)

**Interfaces:**
- Produces: CSS custom properties consumed by every component: colors `--color-ink`, `--color-yellow`, `--color-teal`, `--color-paper`, plus type `--type-display|h3|h4|body-large|body|body-sm|label|caption|cta|button`, spacing `--space-1..8`, and motion `--motion-fast|base|slow`, `--ease-out-expo`, `--ease-standard`.

- [ ] **Step 1: Add Montserrat woff2 files**

Download Montserrat weights 400/500/600/700 (woff2) into `public/fonts/`. Source: Google Fonts export or the design-system font. Name them `montserrat-{weight}.woff2`.

- [ ] **Step 2: Read exact color + spacing values from the design system**

Using the Figma design-system file `B0fHmlEEm9OdOOnAbnmI8d`, capture the Colors and Spacing pages (select the frames in Figma desktop so `get_variable_defs` works, or screenshot them). Record exact hex + spacing steps. Starting values observed from the mockups (VERIFY against the DS and replace if different):
- ink/charcoal ≈ `#211E1F`, yellow ≈ `#F5C34E`, teal ≈ `#1C7C86`, paper `#FFFFFF`.

- [ ] **Step 3: Write `tokens.css`**

```css
:root {
  /* color */
  --color-ink: #211E1F;      /* VERIFY from DS */
  --color-yellow: #F5C34E;   /* VERIFY from DS */
  --color-teal: #1C7C86;     /* VERIFY from DS */
  --color-paper: #FFFFFF;
  --color-ink-70: rgba(33,30,31,.7);

  /* type family */
  --font-sans: "Montserrat", system-ui, sans-serif;

  /* type scale (family/weight/size) — confirmed from DS Typography */
  --type-display: 700 40px/1.1 var(--font-sans);
  --type-h3: 600 32px/1.15 var(--font-sans);
  --type-h4: 500 24px/1.2 var(--font-sans);
  --type-body-large: 400 20px/1.6 var(--font-sans);
  --type-body: 400 20px/1.4 var(--font-sans);
  --type-body-sm: 400 14px/1.5 var(--font-sans);
  --type-label: 600 16px/1.3 var(--font-sans);
  --type-caption: 400 12px/1.4 var(--font-sans);
  --type-cta: 600 16px/1 var(--font-sans);
  --type-button: 500 20px/1 var(--font-sans);
  --tracking-caption: 0.108em; /* 1.8 * 0.06 */

  /* spacing — VERIFY step values from DS */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;

  /* layout */
  --container-max: 1200px;
}
```

- [ ] **Step 4: Write `motion.css`**

```css
:root {
  --motion-fast: 180ms;
  --motion-base: 320ms;
  --motion-slow: 600ms;
  --ease-standard: cubic-bezier(.4, 0, .2, 1);
  --ease-out-expo: cubic-bezier(.16, 1, .3, 1);
}
/* Elements the reveal utility manages start hidden, but only when JS+motion are on. */
@media (prefers-reduced-motion: no-preference) {
  html.js [data-reveal] { opacity: 0; transform: translateY(16px); }
}
```

- [ ] **Step 5: Write `global.css`** (reset, font-face, base type, `.container`, focus states)

```css
@font-face { font-family:"Montserrat"; src:url("/fonts/montserrat-400.woff2") format("woff2"); font-weight:400; font-display:swap; }
@font-face { font-family:"Montserrat"; src:url("/fonts/montserrat-500.woff2") format("woff2"); font-weight:500; font-display:swap; }
@font-face { font-family:"Montserrat"; src:url("/fonts/montserrat-600.woff2") format("woff2"); font-weight:600; font-display:swap; }
@font-face { font-family:"Montserrat"; src:url("/fonts/montserrat-700.woff2") format("woff2"); font-weight:700; font-display:swap; }

*,*::before,*::after { box-sizing:border-box; margin:0; }
html { -webkit-text-size-adjust:100%; }
body { font:var(--type-body); color:var(--color-ink); background:var(--color-paper); }
h1{font:var(--type-display);} h2{font:var(--type-h3);} h3{font:var(--type-h4);}
a { color:inherit; text-decoration:none; }
img,svg { display:block; max-width:100%; }
.container { max-width:var(--container-max); margin-inline:auto; padding-inline:var(--space-5); }
:focus-visible { outline:2px solid var(--color-teal); outline-offset:2px; }
/* progressive enhancement flag for reveal utility */
```
Add a tiny inline head script (in BaseLayout, Task 4) that sets `document.documentElement.classList.add('js')`.

- [ ] **Step 6: Verify tokens render**

Temporarily import the three stylesheets in `src/pages/index.astro` and add one of each heading; run `npm run dev` and confirm Montserrat loads and the type scale looks correct. Remove the temp markup after.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: design tokens, motion tokens, global styles, self-hosted Montserrat"
```

---

### Task 3: Sitemap data model (source of truth)

**Files:**
- Create: `src/data/sitemap.js`
- Test: `tests/sitemap.test.mjs`

**Interfaces:**
- Produces:
  - `menus`: array of `{ id, label, type: 'mega'|'link', href?, style?: 'cards'|'bars'|'white', cards?: [{ label, href, image?, variant?: 'yellow'|'teal' }] }`
  - `accountMenu`: `[{ label, href, note }]`
  - `routes`: array of `{ path, title, kind, status: 'placeholder'|'built', phase?, note?, breadcrumb: string[] }`
  - helper `getRoute(path)` returning the route or `undefined`.

- [ ] **Step 1: Write the failing test**

`tests/sitemap.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { menus, accountMenu, routes, getRoute } from '../src/data/sitemap.js';

test('every route has required fields and unique path', () => {
  const seen = new Set();
  for (const r of routes) {
    assert.ok(r.path?.startsWith('/'), `bad path: ${r.path}`);
    assert.ok(r.title, `missing title: ${r.path}`);
    assert.ok(Array.isArray(r.breadcrumb) && r.breadcrumb.length, `missing breadcrumb: ${r.path}`);
    assert.ok(['placeholder', 'built'].includes(r.status), `bad status: ${r.path}`);
    assert.ok(!seen.has(r.path), `duplicate path: ${r.path}`);
    seen.add(r.path);
  }
});

test('every menu href resolves to a real route', () => {
  const paths = new Set(routes.map(r => r.path));
  const hrefs = [
    ...menus.filter(m => m.type === 'link').map(m => m.href),
    ...menus.flatMap(m => (m.cards ?? []).map(c => c.href)),
    ...accountMenu.map(a => a.href),
  ];
  for (const href of hrefs) assert.ok(paths.has(href), `menu href with no route: ${href}`);
});

test('getRoute returns a known route and undefined otherwise', () => {
  assert.equal(getRoute('/pages/about')?.title, 'About');
  assert.equal(getRoute('/nope'), undefined);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot find module `../src/data/sitemap.js`.

- [ ] **Step 3: Write `src/data/sitemap.js` (complete, no omissions)**

```js
export const menus = [
  {
    id: 'shop', label: 'Shop', type: 'mega', style: 'cards',
    cards: [
      { label: 'Shop Best Sellers', href: '/collections/best-sellers', image: '/images/nav/shop-best-sellers.jpg', variant: 'yellow' },
      { label: 'Featured Products', href: '/collections/featured', image: '/images/nav/featured-products.jpg', variant: 'yellow' },
      { label: 'Shop All', href: '/collections/all', variant: 'teal' },
    ],
  },
  {
    id: 'courses', label: 'Courses', type: 'mega', style: 'cards',
    cards: [
      { label: 'Courses for Individuals', href: '/collections/courses-individuals', image: '/images/nav/courses-individuals.jpg', variant: 'yellow' },
      { label: 'Courses for Professionals', href: '/collections/courses-professionals', image: '/images/nav/courses-professionals.jpg', variant: 'yellow' },
      { label: 'All Courses', href: '/collections/all-courses', variant: 'teal' },
    ],
  },
  {
    id: 'resources', label: 'Resources', type: 'mega', style: 'bars',
    cards: [
      { label: 'Locally Trained Practitioners', href: '/resources/locally-trained-practitioners' },
      { label: 'Our Favorite Brands', href: '/resources/our-favorite-brands' },
      { label: 'Blog', href: '/blogs/news' },
      { label: 'Find a Retailer', href: '/resources/find-a-retailer' },
      { label: 'Guest Appearances', href: '/resources/guest-appearances' },
      { label: 'Event Calendar', href: '/resources/event-calendar' },
    ],
  },
  { id: 'about', label: 'About', type: 'link', href: '/pages/about' },
  {
    id: 'contact', label: 'Contact', type: 'mega', style: 'white',
    cards: [
      { label: 'FAQs', href: '/pages/faqs' },
      { label: 'Customer Support', href: '/pages/customer-support' },
      { label: 'Media & Partnerships', href: '/pages/media-partnerships' },
    ],
  },
];

export const accountMenu = [
  { label: 'Wholesaler Login', href: '/account/wholesaler-login', note: 'Shopify' },
  { label: 'Course Login', href: '/account/course-login', note: 'Kajabi' },
  { label: 'Virtual Consultation Login', href: '/account/consultation-login', note: 'platform TBD' },
];

const r = (path, title, kind, breadcrumb, extra = {}) =>
  ({ path, title, kind, status: 'placeholder', breadcrumb, ...extra });

export const routes = [
  r('/', 'Home', 'home', ['Home'], { phase: 'Phase 3' }),

  // Shop
  r('/collections/best-sellers', 'Shop Best Sellers', 'plp', ['Home', 'Shop', 'Best Sellers']),
  r('/collections/featured', 'Featured Products', 'plp', ['Home', 'Shop', 'Featured Products']),
  r('/collections/all', 'Shop All', 'plp', ['Home', 'Shop', 'All']),
  r('/products/toe-spacers', 'Toe Spacers', 'pdp', ['Home', 'Shop', 'Toe Spacers']),
  r('/products/foot-health-kit', 'The Foot Health Kit', 'pdp', ['Home', 'Shop', 'The Foot Health Kit']),
  r('/products/cork-supplement', 'Cork Supplement', 'pdp', ['Home', 'Shop', 'Cork Supplement']),
  r('/products/toe-strengtheners', 'Toe Strengtheners', 'pdp', ['Home', 'Shop', 'Toe Strengtheners']),
  r('/products/toe-dynamometer', 'Toe Dynamometer', 'pdp', ['Home', 'Shop', 'Toe Dynamometer']),
  r('/products/walk', 'WALK', 'pdp', ['Home', 'Shop', 'WALK']),

  // Courses
  r('/collections/courses-individuals', 'Courses for Individuals', 'plp', ['Home', 'Courses', 'Individuals']),
  r('/collections/courses-professionals', 'Courses for Professionals', 'plp', ['Home', 'Courses', 'Professionals']),
  r('/collections/all-courses', 'All Courses', 'plp', ['Home', 'Courses', 'All Courses']),
  r('/courses/foot-fest', 'Foot Fest', 'course', ['Home', 'Courses', 'Foot Fest']),
  r('/courses/combating-bunions', 'Combating Bunions', 'course', ['Home', 'Courses', 'Combating Bunions']),
  r('/courses/fit-feet', 'Fit Feet', 'course', ['Home', 'Courses', 'Fit Feet']),
  r('/courses/virtual-consultations', 'Virtual Consultations', 'course', ['Home', 'Courses', 'Virtual Consultations']),
  r('/courses/sole-switch', 'Sole Switch', 'course', ['Home', 'Courses', 'Sole Switch']),
  r('/courses/sole-switch-pro', 'Sole Switch Pro', 'course', ['Home', 'Courses', 'Sole Switch Pro']),
  r('/courses/gait-guru-membership', 'Gait Guru Membership', 'course', ['Home', 'Courses', 'Gait Guru Membership']),
  r('/courses/trainer-certification', 'Trainer Certification', 'course', ['Home', 'Courses', 'Trainer Certification']),
  r('/courses/gait-foundations', 'Gait Foundations', 'course', ['Home', 'Courses', 'Gait Foundations']),
  r('/courses/functional-gait-assessment-l1', 'Functional Gait Assessment L1', 'course', ['Home', 'Courses', 'Functional Gait Assessment L1']),

  // Resources
  r('/resources/locally-trained-practitioners', 'Locally Trained Practitioners', 'page', ['Home', 'Resources', 'Locally Trained Practitioners']),
  r('/resources/our-favorite-brands', 'Our Favorite Brands', 'page', ['Home', 'Resources', 'Our Favorite Brands']),
  r('/blogs/news', 'Blog', 'blog', ['Home', 'Resources', 'Blog'], { phase: 'Phase 4' }),
  r('/resources/find-a-retailer', 'Find a Retailer', 'page', ['Home', 'Resources', 'Find a Retailer']),
  r('/resources/guest-appearances', 'Guest Appearances', 'page', ['Home', 'Resources', 'Guest Appearances']),
  r('/resources/event-calendar', 'Event Calendar', 'page', ['Home', 'Resources', 'Event Calendar']),

  // About
  r('/pages/about', 'About', 'page', ['Home', 'About'], { phase: 'Phase 3' }),

  // Contact
  r('/pages/faqs', 'FAQs', 'page', ['Home', 'Contact', 'FAQs']),
  r('/pages/customer-support', 'Customer Support', 'page', ['Home', 'Contact', 'Customer Support']),
  r('/pages/media-partnerships', 'Media & Partnerships', 'page', ['Home', 'Contact', 'Media & Partnerships']),

  // Utility
  r('/search', 'Search', 'utility', ['Home', 'Search']),
  r('/cart', 'Cart', 'utility', ['Home', 'Cart']),
  r('/account/wholesaler-login', 'Wholesaler Login', 'utility', ['Home', 'Account', 'Wholesaler Login'], { note: 'External: Shopify wholesaler portal (URL TBD)' }),
  r('/account/course-login', 'Course Login', 'utility', ['Home', 'Account', 'Course Login'], { note: 'External: Kajabi (URL TBD)' }),
  r('/account/consultation-login', 'Virtual Consultation Login', 'utility', ['Home', 'Account', 'Virtual Consultation Login'], { note: 'External: platform TBD' }),
];

export function getRoute(path) {
  return routes.find(route => route.path === path);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: sitemap data model as single source of truth (+ integrity tests)"
```

---

### Task 4: BaseLayout, Footer, PlaceholderPage, and generated placeholder routes

This task delivers the **core acceptance criterion**: every route resolves and links work. Header is a minimal stub here; the real header is Task 5–8.

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/Footer.astro`, `src/components/Breadcrumb.astro`, `src/components/StatusChip.astro`, `src/components/PlaceholderPage.astro`, `src/components/Button.astro`
- Create: `src/pages/[...slug].astro`, replace `src/pages/index.astro`
- Create temporary: `src/components/Header.astro` (stub, replaced in Task 5)

**Interfaces:**
- Consumes: `routes`, `getRoute` from Task 3; tokens from Task 2.
- Produces: `BaseLayout` props `{ title, breadcrumb?, description? }`; `PlaceholderPage` props `{ route }`.

- [ ] **Step 1: Minimal Header stub** (`src/components/Header.astro`)

```astro
---
import { menus } from '../data/sitemap.js';
---
<header class="site-header">
  <div class="container">
    <a href="/" class="logo">GAIT<span>Happens</span></a>
    <nav>
      {menus.map(m => m.type === 'link'
        ? <a href={m.href}>{m.label}</a>
        : <span class="top">{m.label}</span>)}
    </nav>
  </div>
</header>
<style>
  .site-header { background: var(--color-ink); color: var(--color-paper); }
  .site-header .container { display:flex; align-items:center; justify-content:space-between; min-height:64px; }
  nav { display:flex; gap:var(--space-5); }
</style>
```

- [ ] **Step 2: Footer** (`src/components/Footer.astro`) — grouped links from `menus`

```astro
---
import { menus } from '../data/sitemap.js';
const columns = menus.filter(m => m.type === 'mega');
---
<footer class="site-footer">
  <div class="container cols">
    {columns.map(col => (
      <div class="col">
        <h4>{col.label}</h4>
        <ul>{col.cards.map(c => <li><a href={c.href}>{c.label}</a></li>)}</ul>
      </div>
    ))}
    <div class="col"><h4>About</h4><ul><li><a href="/pages/about">About</a></li></ul></div>
  </div>
  <div class="container legal"><p>© Gait Happens</p></div>
</footer>
<style>
  .site-footer { background: var(--color-ink); color: var(--color-paper); padding-block: var(--space-8); }
  .cols { display:grid; grid-template-columns: repeat(auto-fit, minmax(160px,1fr)); gap: var(--space-6); }
  h4 { font: var(--type-label); margin-bottom: var(--space-3); }
  ul { list-style:none; padding:0; display:grid; gap:var(--space-2); }
  a { font: var(--type-body-sm); color: var(--color-ink-70); }
  a:hover { color: var(--color-paper); }
</style>
```

- [ ] **Step 3: StatusChip + Breadcrumb + Button**

`StatusChip.astro`:
```astro
---
const { phase } = Astro.props;
---
<span class="chip">In progress{phase ? ` · ${phase}` : ''}</span>
<style>
  .chip { display:inline-block; font: var(--type-caption); letter-spacing: var(--tracking-caption);
    text-transform: uppercase; background: var(--color-yellow); color: var(--color-ink);
    padding: var(--space-1) var(--space-3); border-radius: 999px; }
</style>
```
`Breadcrumb.astro`:
```astro
---
const { trail = [] } = Astro.props;
---
<nav class="crumbs" aria-label="Breadcrumb">
  {trail.map((c, i) => <span>{c}{i < trail.length - 1 ? ' / ' : ''}</span>)}
</nav>
<style>.crumbs { font: var(--type-body-sm); color: var(--color-ink-70); }</style>
```
`Button.astro`:
```astro
---
const { href = '#', variant = 'yellow' } = Astro.props;
---
<a class={`btn btn--${variant}`} href={href}><slot /></a>
<style>
  .btn { display:inline-flex; align-items:center; gap:var(--space-2); font: var(--type-cta);
    padding: var(--space-3) var(--space-5); border-radius: 4px; transition: transform var(--motion-fast) var(--ease-standard); }
  .btn--yellow { background: var(--color-yellow); color: var(--color-ink); }
  .btn--teal { background: var(--color-teal); color: var(--color-paper); }
  .btn:hover { transform: translateY(-2px); }
</style>
```

- [ ] **Step 4: BaseLayout** (`src/layouts/BaseLayout.astro`) with View Transitions + `js` flag

```astro
---
import { ClientRouter } from 'astro:transitions';
import '../styles/tokens.css';
import '../styles/motion.css';
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
const { title, description = '', breadcrumb } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title} · Gait Happens</title>
    {description && <meta name="description" content={description} />}
    <script is:inline>document.documentElement.classList.add('js');</script>
    <ClientRouter />
  </head>
  <body>
    <Header />
    <main class="container" style="padding-block: var(--space-8);">
      <slot />
    </main>
    <Footer />
    <script>import '../scripts/motion.js';</script>
  </body>
</html>
```
> Note: `src/scripts/motion.js` is created in Task 9; add a temporary empty `src/scripts/motion.js` now so the import resolves, and flesh it out in Task 9.

- [ ] **Step 5: PlaceholderPage** (`src/components/PlaceholderPage.astro`)

```astro
---
import Breadcrumb from './Breadcrumb.astro';
import StatusChip from './StatusChip.astro';
const { route } = Astro.props;
---
<article class="placeholder">
  <Breadcrumb trail={route.breadcrumb} />
  <h1 data-reveal>{route.title}</h1>
  <StatusChip phase={route.phase} />
  <p class="note" data-reveal>
    This page is scaffolded. {route.note ?? 'Full content will be built in a later step.'}
  </p>
</article>
<style>
  .placeholder { display:grid; gap: var(--space-4); max-width: 60ch; }
  .note { font: var(--type-body-large); color: var(--color-ink-70); }
</style>
```

- [ ] **Step 6: Home page** (`src/pages/index.astro`)

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PlaceholderPage from '../components/PlaceholderPage.astro';
import { getRoute } from '../data/sitemap.js';
const route = getRoute('/');
---
<BaseLayout title={route.title} breadcrumb={route.breadcrumb}>
  <PlaceholderPage route={route} />
</BaseLayout>
```

- [ ] **Step 7: Catch-all placeholder generator** (`src/pages/[...slug].astro`)

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PlaceholderPage from '../components/PlaceholderPage.astro';
import { routes } from '../data/sitemap.js';

export function getStaticPaths() {
  return routes
    .filter(route => route.path !== '/')
    .map(route => ({ params: { slug: route.path.replace(/^\//, '') }, props: { route } }));
}
const { route } = Astro.props;
---
<BaseLayout title={route.title} breadcrumb={route.breadcrumb}>
  <PlaceholderPage route={route} />
</BaseLayout>
```

- [ ] **Step 8: Build and verify every route exists**

Run: `npm run build`
Expected: build succeeds; `dist/` contains an `index.html` for each of the 38 routes (spot-check `dist/products/toe-spacers/index.html`, `dist/pages/about/index.html`, `dist/account/course-login/index.html`).

- [ ] **Step 9: Link integrity check (the core acceptance test)**

Run: `npm run check:links`
Expected: `OK — N links checked, 0 broken.`
If any BROKEN: the offending href is not in `routes` — fix `sitemap.js` or the link, do not add a one-off page.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: base layout, footer, placeholder pages generated from sitemap; links verified"
```

---

### Task 5: Real header — nav row, logo, announcement/shipping bar, utility icons

**Files:**
- Modify: `src/components/Header.astro` (replace stub)
- Create: `src/components/AnnouncementBar.astro`
- Assets: export logo to `public/images/nav/logo.svg` (or png) from Figma nav node 426-214.

**Interfaces:**
- Consumes: `menus` from Task 3.
- Produces: header markup with `[data-menu-trigger="<id>"]` on each mega top-level item and `[data-util="search|account|cart"]` on the utility icons — hooks the later interactive tasks bind to.

- [ ] **Step 1: Export the logo** from Figma (node 426-214 header) to `public/images/nav/logo.svg`. If SVG export isn't available, export 2x PNG.

- [ ] **Step 2: AnnouncementBar** (`src/components/AnnouncementBar.astro`)

```astro
<div class="ann"><p>Free US Shipping over $50</p></div>
<style>
  .ann { background: var(--color-yellow); color: var(--color-ink); text-align:center; }
  .ann p { font: var(--type-label); padding: var(--space-2); }
</style>
```

- [ ] **Step 3: Replace Header** with the real nav row (dark bar): logo left; centered top-level items from `menus` (mega items get `data-menu-trigger`, link items are anchors); right-side utility icons (search, account, cart) with `data-util`; shipping bar directly below the nav row. Match Figma nav node 426-214.

```astro
---
import { menus } from '../data/sitemap.js';
import AnnouncementBar from './AnnouncementBar.astro';
---
<header class="site-header">
  <div class="navrow container">
    <a href="/" class="logo"><img src="/images/nav/logo.svg" alt="Gait Happens" /></a>
    <nav class="top" aria-label="Primary">
      {menus.map(m => m.type === 'link'
        ? <a class="top__item" href={m.href}>{m.label}</a>
        : <button class="top__item" data-menu-trigger={m.id} aria-expanded="false">{m.label}</button>)}
    </nav>
    <div class="util">
      <span class="lang">EN ▾</span>
      <button data-util="search" aria-label="Search">⌕</button>
      <button data-util="account" aria-label="Account" aria-expanded="false">◔</button>
      <button data-util="cart" aria-label="Cart">▢</button>
    </div>
  </div>
  <AnnouncementBar />
  <!-- MegaMenu panels + AccountMenu + overlays injected in Tasks 6-8 -->
</header>
<style>
  .site-header { position: sticky; top: 0; z-index: 50; }
  .navrow { background: var(--color-ink); color: var(--color-paper); display:flex;
    align-items:center; justify-content:space-between; min-height: 64px; }
  .logo img { height: 28px; }
  .top { display:flex; gap: var(--space-6); }
  .top__item { font: var(--type-label); color: var(--color-paper); background:none; border:0; cursor:pointer; }
  .util { display:flex; align-items:center; gap: var(--space-4); }
  .util button { background:none; border:0; color: var(--color-paper); font-size:20px; cursor:pointer; }
  @media (max-width: 820px) { .top, .util .lang { display:none; } }
</style>
```
> Replace the placeholder glyphs (⌕ ◔ ▢ EN ▾) with the exported icon SVGs from Figma during this step.

- [ ] **Step 4: Visual check** — run `npm run dev`, open `/`, compare header to Figma nav node 426-214 (logo, five items, utilities, yellow shipping bar beneath). Adjust spacing to match.

- [ ] **Step 5: Re-run link check + commit**

```bash
npm run check:links
git add -A
git commit -m "feat: real header nav row, announcement bar, utility icons"
```

---

### Task 6: Desktop mega-menus

**Files:**
- Create: `src/components/NavCard.astro`, `src/components/MegaMenu.astro`
- Modify: `src/components/Header.astro` (render MegaMenu panels + open/close JS)
- Assets: export nav card images to `public/images/nav/` (`shop-best-sellers.jpg`, `featured-products.jpg`, `courses-individuals.jpg`, `courses-professionals.jpg`) from Figma node 426-214.

**Interfaces:**
- Consumes: `menus`; header `[data-menu-trigger]`.
- Produces: one `[data-menu-panel="<id>"]` per mega menu; JS that toggles `open` on hover/focus/click and closes on mouse-leave/Esc/outside-click.

- [ ] **Step 1: Export the four nav card images** from Figma to `public/images/nav/`.

- [ ] **Step 2: NavCard** (`src/components/NavCard.astro`) — supports `cards` (image, yellow/teal), `bars` (yellow text bar), `white` variants

```astro
---
const { card, style } = Astro.props; // style: 'cards'|'bars'|'white'
const variant = card.variant ?? (style === 'white' ? 'white' : 'bar');
---
<a class={`nav-card nav-card--${variant}`} href={card.href}>
  {card.image && <img src={card.image} alt="" />}
  <span class="nav-card__label">{card.label}</span>
  <span class="nav-card__arrow" aria-hidden="true">→</span>
</a>
<style>
  .nav-card { position:relative; display:flex; align-items:flex-end; justify-content:space-between;
    gap: var(--space-3); padding: var(--space-4); min-height: 96px; }
  .nav-card img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:0; }
  .nav-card__label, .nav-card__arrow { position:relative; z-index:1; font: var(--type-h4); }
  .nav-card--yellow { background: var(--color-yellow); color: var(--color-ink); }
  .nav-card--teal { background: var(--color-teal); color: var(--color-paper); }
  .nav-card--white { background: var(--color-paper); color: var(--color-ink); outline:1px solid var(--color-ink); }
  .nav-card--bar { background: var(--color-yellow); color: var(--color-ink); min-height:64px; }
  .nav-card__arrow { transition: transform var(--motion-fast) var(--ease-out-expo); }
  .nav-card:hover .nav-card__arrow { transform: translateX(6px); }
</style>
```

- [ ] **Step 3: MegaMenu** (`src/components/MegaMenu.astro`) — grid of NavCards for one menu

```astro
---
import NavCard from './NavCard.astro';
const { menu } = Astro.props;
const cols = menu.style === 'bars' ? 3 : 3;
---
<div class="mega" data-menu-panel={menu.id} hidden>
  <div class="container mega__grid" style={`--cols:${cols}`}>
    {menu.cards.map(card => <NavCard card={card} style={menu.style} />)}
  </div>
</div>
<style>
  .mega { position:absolute; left:0; right:0; background: var(--color-ink); }
  .mega__grid { display:grid; grid-template-columns: repeat(var(--cols), 1fr); gap: var(--space-4); padding-block: var(--space-5); }
  .mega[hidden] { display:none; }
</style>
```

- [ ] **Step 4: Render panels in Header + add open/close JS**

In `Header.astro`, import MegaMenu and render one per mega menu after the navrow. Add an inline module script:
```astro
<script>
  const header = document.currentScript.closest('header') ?? document.querySelector('.site-header');
  const triggers = header.querySelectorAll('[data-menu-trigger]');
  const panels = new Map([...header.querySelectorAll('[data-menu-panel]')].map(p => [p.dataset.menuPanel, p]));
  let open = null;
  const show = id => { hide(); const p = panels.get(id); if (!p) return; p.hidden = false;
    header.querySelector(`[data-menu-trigger="${id}"]`)?.setAttribute('aria-expanded','true'); open = id; };
  const hide = () => { if (!open) return; panels.get(open).hidden = true;
    header.querySelector(`[data-menu-trigger="${open}"]`)?.setAttribute('aria-expanded','false'); open = null; };
  triggers.forEach(t => {
    t.addEventListener('mouseenter', () => show(t.dataset.menuTrigger));
    t.addEventListener('focus', () => show(t.dataset.menuTrigger));
    t.addEventListener('click', () => (open === t.dataset.menuTrigger ? hide() : show(t.dataset.menuTrigger)));
  });
  header.addEventListener('mouseleave', hide);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
  document.addEventListener('click', e => { if (!header.contains(e.target)) hide(); });
</script>
```

- [ ] **Step 5: Visual check** against Figma mega-menu frames (Shop 761:2112, Courses 761:2189, Resources 848:10673, Contact 763:5462). Confirm hover opens, mouse-leave/Esc/outside-click close, keyboard focus works.

- [ ] **Step 6: Link check + commit**

```bash
npm run check:links
git add -A
git commit -m "feat: desktop mega-menus (cards, bars, white variants) with open/close + a11y"
```

---

### Task 7: Account dropdown, search overlay, cart drawer

**Files:**
- Create: `src/components/AccountMenu.astro`, `src/components/SearchOverlay.astro`, `src/components/CartDrawer.astro`
- Modify: `src/components/Header.astro` (render + wire to `[data-util]`)

**Interfaces:**
- Consumes: `accountMenu`; header `[data-util="account|search|cart"]`.
- Produces: dropdown/overlay/drawer toggled by their util buttons; all use `--ease-standard`.

- [ ] **Step 1: AccountMenu** (compact dropdown, three logins)

```astro
---
import { accountMenu } from '../data/sitemap.js';
---
<div class="acct" data-util-panel="account" hidden>
  <ul>
    {accountMenu.map(a => (
      <li><a href={a.href}>{a.label}<small>{a.note}</small></a></li>
    ))}
  </ul>
</div>
<style>
  .acct { position:absolute; right: var(--space-5); background: var(--color-paper); color: var(--color-ink);
    box-shadow: 0 8px 24px rgba(0,0,0,.18); border-radius: 6px; min-width: 240px; }
  .acct[hidden] { display:none; }
  .acct ul { list-style:none; margin:0; padding: var(--space-2); }
  .acct a { display:flex; flex-direction:column; padding: var(--space-3); border-radius:4px; font: var(--type-label); }
  .acct a:hover { background: var(--color-yellow); }
  .acct small { font: var(--type-caption); color: var(--color-ink-70); }
</style>
```

- [ ] **Step 2: SearchOverlay** — input that submits to `/search`

```astro
<div class="search-overlay" data-util-panel="search" hidden>
  <form class="container" action="/search" method="get" role="search">
    <input name="q" type="search" placeholder="Search products, courses, resources…" aria-label="Search" autofocus />
  </form>
</div>
<style>
  .search-overlay { position:absolute; left:0; right:0; background: var(--color-ink); padding-block: var(--space-5); }
  .search-overlay[hidden] { display:none; }
  input { width:100%; font: var(--type-body-large); padding: var(--space-4); border:0; border-radius:4px; }
</style>
```

- [ ] **Step 3: CartDrawer** — empty state, slide-in from right

```astro
<aside class="cart-drawer" data-util-panel="cart" aria-hidden="true">
  <header><h3>Your Cart</h3><button data-cart-close aria-label="Close">✕</button></header>
  <p class="empty">Your cart is empty.</p>
  <a class="btn btn--teal" href="/collections/all">Shop All</a>
</aside>
<div class="cart-scrim" data-cart-close hidden></div>
<style>
  .cart-drawer { position:fixed; top:0; right:0; height:100dvh; width:min(420px,90vw);
    background: var(--color-paper); transform: translateX(100%);
    transition: transform var(--motion-base) var(--ease-standard); z-index:60; padding: var(--space-5); display:grid; gap: var(--space-5); align-content:start; }
  .cart-drawer.open { transform: translateX(0); }
  .cart-scrim { position:fixed; inset:0; background: rgba(0,0,0,.4); z-index:59; }
  .cart-scrim[hidden] { display:none; }
</style>
```

- [ ] **Step 4: Wire util buttons in Header** — extend the header script

```astro
<script>
  const h = document.querySelector('.site-header');
  const panel = name => h.querySelector(`[data-util-panel="${name}"]`);
  const account = panel('account'), search = panel('search'), cart = panel('cart');
  const scrim = h.querySelector('.cart-scrim') ?? document.querySelector('.cart-scrim');
  h.querySelector('[data-util="account"]').addEventListener('click', () => { account.hidden = !account.hidden; });
  h.querySelector('[data-util="search"]').addEventListener('click', () => { search.hidden = !search.hidden; if(!search.hidden) search.querySelector('input')?.focus(); });
  const openCart = o => { cart.classList.toggle('open', o); cart.setAttribute('aria-hidden', String(!o)); scrim.hidden = !o; };
  h.querySelector('[data-util="cart"]').addEventListener('click', () => openCart(true));
  document.querySelectorAll('[data-cart-close]').forEach(el => el.addEventListener('click', () => openCart(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape'){ account.hidden = true; search.hidden = true; openCart(false); } });
</script>
```

- [ ] **Step 5: Visual + interaction check** — account opens dropdown with 3 logins; search opens input and submits to `/search`; cart slides in with empty state + scrim; Esc closes all.

- [ ] **Step 6: Link check + commit**

```bash
npm run check:links
git add -A
git commit -m "feat: account dropdown, search overlay, cart drawer"
```

---

### Task 8: Mobile navigation

**Files:**
- Create: `src/components/MobileNav.astro`
- Modify: `src/components/Header.astro` (hamburger button < 820px + render MobileNav)

**Interfaces:**
- Consumes: `menus`, `accountMenu`.
- Produces: slide-in drawer with accordion top-level items expanding to the same cards.

- [ ] **Step 1: Add a hamburger button** to the navrow, visible only < 820px, `data-util="menu"`.

- [ ] **Step 2: MobileNav** (`src/components/MobileNav.astro`) — drawer + `<details>` accordions per mega menu, plus About link and account logins

```astro
---
import { menus, accountMenu } from '../data/sitemap.js';
---
<aside class="mobile-nav" data-util-panel="menu" aria-hidden="true">
  <nav>
    {menus.map(m => m.type === 'link'
      ? <a class="m-item" href={m.href}>{m.label}</a>
      : (
        <details class="m-acc">
          <summary>{m.label}</summary>
          <ul>{m.cards.map(c => <li><a href={c.href}>{c.label}</a></li>)}</ul>
        </details>
      ))}
    <details class="m-acc">
      <summary>Account</summary>
      <ul>{accountMenu.map(a => <li><a href={a.href}>{a.label}</a></li>)}</ul>
    </details>
    <a class="m-item" href="/search">Search</a>
  </nav>
</aside>
<div class="mobile-scrim" data-util-panel-scrim="menu" hidden></div>
<style>
  .mobile-nav { position:fixed; top:0; left:0; height:100dvh; width:min(360px,88vw);
    background: var(--color-ink); color: var(--color-paper); transform: translateX(-100%);
    transition: transform var(--motion-base) var(--ease-standard); z-index:60; padding: var(--space-6) var(--space-5); overflow:auto; }
  .mobile-nav.open { transform: translateX(0); }
  .m-item, summary { display:block; font: var(--type-h4); padding-block: var(--space-3); cursor:pointer; }
  .m-acc ul { list-style:none; padding-left: var(--space-4); }
  .m-acc a { display:block; font: var(--type-body); padding-block: var(--space-2); color: var(--color-ink-70); }
  .mobile-scrim { position:fixed; inset:0; background:rgba(0,0,0,.4); z-index:59; }
  .mobile-scrim[hidden] { display:none; }
  @media (min-width: 821px) { .mobile-nav, .mobile-scrim { display:none; } }
</style>
```

- [ ] **Step 3: Wire hamburger** — extend header script to toggle `.open` on `.mobile-nav` + scrim, Esc closes.

- [ ] **Step 4: Responsive check** — at ≤820px: top nav/utilities hide, hamburger shows, drawer slides in, accordions expand to cards, links navigate. At >820px: mega-menus behave as Task 6.

- [ ] **Step 5: Link check + commit**

```bash
npm run check:links
git add -A
git commit -m "feat: mobile slide-in nav with accordion menus"
```

---

### Task 9: Motion system (GSAP reveals, transitions, reduced-motion)

**Files:**
- Replace: `src/scripts/motion.js` (was an empty stub from Task 4)

**Interfaces:**
- Consumes: `[data-reveal]` attributes already on elements (e.g., PlaceholderPage); `--ease-*`, `--motion-*` tokens.
- Produces: on-scroll reveal for `[data-reveal]`, re-initialized on View Transitions, fully disabled under reduced-motion.

- [ ] **Step 1: Implement `src/scripts/motion.js`**

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initReveals() {
  const els = gsap.utils.toArray('[data-reveal]');
  if (reduced) { gsap.set(els, { opacity: 1, y: 0, clearProps: 'all' }); return; }
  gsap.registerPlugin(ScrollTrigger);
  els.forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 16 }, {
      opacity: 1, y: 0, duration: 0.6, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

function init() { ScrollTrigger.getAll?.().forEach(t => t.kill()); initReveals(); }
init();
// Re-run after Astro View Transitions swap the DOM
document.addEventListener('astro:after-swap', init);
```

- [ ] **Step 2: Verify reveals** — run `npm run dev`; placeholder `h1`/note fade+rise on load/scroll; navigate between pages (View Transitions) and confirm reveals re-fire.

- [ ] **Step 3: Verify reduced-motion** — in DevTools emulate `prefers-reduced-motion: reduce`; content is fully visible with no motion; page transitions minimal.

- [ ] **Step 4: Build + link check + commit**

```bash
npm run build && npm run check:links
git add -A
git commit -m "feat: GSAP reveal-on-scroll motion system with reduced-motion guard"
```

---

### Task 10: Status page + README handoff notes + final verification

**Files:**
- Create: `src/pages/_status.astro`
- Modify: `README.md`

**Interfaces:**
- Consumes: `routes`.

- [ ] **Step 1: `_status.astro`** — build-progress checklist grouped by section

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { routes } from '../data/sitemap.js';
const groups = routes.reduce((acc, r) => {
  const key = r.breadcrumb[1] ?? 'Top';
  (acc[key] ??= []).push(r); return acc;
}, {});
const total = routes.length;
const built = routes.filter(r => r.status === 'built').length;
---
<BaseLayout title="Build Status" breadcrumb={['Internal', 'Status']}>
  <h1>Build Status — {built}/{total} built</h1>
  {Object.entries(groups).map(([g, rs]) => (
    <section>
      <h3>{g}</h3>
      <ul>{rs.map(r => (
        <li><a href={r.path}>{r.path}</a> — {r.title} · <strong>{r.status}</strong>{r.phase ? ` · ${r.phase}` : ''}</li>
      ))}</ul>
    </section>
  ))}
</BaseLayout>
```

- [ ] **Step 2: README** — run instructions + handoff notes

Write `README.md` covering: `npm install`, `npm run dev`, `npm run build`, `npm run preview`, `npm run check:links`, `npm test`; the token map (CSS variable names → design-system tokens); the component → Shopify section/snippet mapping; how placeholder pages are generated from `sitemap.js` and how to promote one to `built`; URL conventions; and where the internal `/_status` page lives.

- [ ] **Step 3: Full verification pass**

Run: `npm test && npm run build && npm run check:links`
Expected: tests pass; build succeeds; `0 broken` links.

- [ ] **Step 4: Manual smoke** — open `/_status`, click through one route per section, exercise every mega-menu, account dropdown, search, cart, and the mobile drawer.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: internal status page + README handoff notes; foundation complete"
```

---

## Self-Review — spec coverage

- §1–3 purpose/goals/fidelity → Global Constraints + all tasks. ✓
- §4 tech stack (Astro, GSAP, View Transitions, self-hosted Montserrat, no framework) → Tasks 1, 2, 9. ✓
- §5 design tokens (type scale + color/spacing from DS) → Task 2. ✓ (exact hex/spacing read from DS in Task 2 Step 2 — a real fetch step, not a placeholder.)
- §6 repo structure → matches File Structure + Tasks. ✓
- §7 component model + sitemap.js drives nav & pages → Tasks 3, 4. ✓
- §8 full sitemap (38 routes, IA corrections) → Task 3 `sitemap.js` (complete). ✓
- §9 interactions (mega-menu, account dropdown, mobile drawer, search, cart, language static) → Tasks 6, 7, 8. ✓ (language EN ▾ is static markup in Task 5. ✓)
- §10 motion (tokens, reveals, transitions, nav/drawer easing, micro-interactions, reduced-motion) → Tasks 2, 4, 6, 9. ✓
- §11 placeholder pattern (header/footer, title, breadcrumb, In-progress chip) → Task 4. ✓
- §12 progress tracking `_status` → Task 10. ✓
- §13 handoff notes README → Task 10. ✓
- §14 assets (logo + nav card images, Montserrat woff2) → Tasks 2, 5, 6. ✓
- §15 open items (exact hex, login URLs) → carried as explicit steps/notes, not blockers. ✓
- §16 out of scope (page buildouts) → not included. ✓

No unresolved placeholders in process steps; menu hrefs and route paths are consistent between `sitemap.js` and the link test.
