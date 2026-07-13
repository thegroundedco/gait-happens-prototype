# Gait Happens Course PDP — Chunk B1 Implementation Plan (testimonial carousel + the four zero-new-section pages)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship every remaining page that needs no new section type — `/courses/sole-switch`, `/courses/combating-bunions`, `/courses/fit-feet`, `/products/walk` — and upgrade the one section they all share and that Chunk A left half-built: the Testimonial carousel.

**Architecture:** Chunk A's data-driven `Pdp` composer already renders `item.pdp.sections` through a `type → {Component, props}` registry. **This chunk adds no new section types and no registry entries.** Each page is catalog data + a route + a `sitemap.js` status flip. The one component change is `Testimonial.astro`, which gains real multi-quote paging; its paging logic lives in a testable `src/scripts/` module and is wired by module-scope event delegation.

**Tech Stack:** Astro, vanilla JS, existing tokens/components. No new dependencies.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-13-gait-happens-course-pdp-b1-design.md`. **Figma:** file `FX7PDNvhZwyozODaq8Q8i7`.
- **Fidelity workflow (every page task):** run `get_metadata` on the page's desktop frame to get its per-section nodes, then `get_design_context` on each section for BOTH desktop and its mobile counterpart BEFORE authoring data; then **verify the built page against the Figma at BOTH desktop (≥1024) and mobile (390) widths** — the task's acceptance gate. (Subagents that can't drive a real browser say so; the controller does the both-widths pass at the checkpoint and adjudicates deviations via `get_screenshot`.) Mobile frames: individual courses live under section `999:7142`; product PDPs under `1017:9514`.
- **No new section components.** If a page appears to need one, STOP and report it — that is a finding (it would mean the B1/B2 split in the spec is wrong), not something to work around with a bespoke page or an inline one-off.
- **Content is Figma-verbatim** where the design has real copy (titles, price, overview, comparison rows, testimonial quotes, instructor names/bios, FAQ copy). Placeholder images/photos. Where Figma is thin or desktop and mobile diverge: **desktop is canonical**, ship the placeholder, and record it in `.superpowers/sdd/progress.md` as client-supplied — never invent copy and never silently paper over a gap.
- `src/data/catalog.js` is the single source of truth. No hardcoded page content in components.
- Tokens govern color/type/spacing (`--color-ink`/`--color-yellow`/`--color-teal`/`--color-paper`, `--type-*`, `--space-*`); component-intrinsic px may be literal.
- **Client JS uses module-scope event delegation** — one document-level listener keyed off `data-*` hooks, nodes resolved fresh per event, nothing cached. This is the idiom `YourInstructors.astro` and `ProductDetails.astro` already use, and it needs **no `astro:page-load` re-init and no swap teardown**. Do NOT use the `astro:page-load` re-init pattern — that is `Header.astro`'s idiom and it does not apply to a self-contained section. `prefers-reduced-motion` honored.
- **Do NOT flip a route to `built` until its page actually renders.** `[...slug].astro` generates only `placeholder` routes (no collision).
- **No unit tests for visual sections.** Per-task verification: `npm run build`, `npm run check:links` = 0 broken, `npm test` green, + the both-widths Figma pass. Pure logic (carousel paging) and catalog invariants DO get tests. Commit per task, conventional messages.
- **Operational (from Chunk A — these bit us):** sweep orphaned node/astro/preview processes before building, or you get **stale `dist` writes** and will verify the wrong HTML. Live browser QA = `astro preview --host` + the LAN IP (e.g. `192.168.86.200:4321`); **localhost is unreachable from host Chrome**. The OS window won't resize — use an in-page `<iframe width=390>` for mobile. `check:links` needs port 4321 free (stop the preview server first). A transient Dropbox `.vite` EBUSY on build is benign — confirm output with `find dist -name index.html | wc -l`.

## File Structure

```
src/scripts/
  testimonial.js               Task 1 — NEW: pure nextIndex() + delegated carousel wiring
src/components/pdp/
  Testimonial.astro            Task 1 — MODIFY: render all slides, real buttons when >1 quote
src/data/
  catalog.js                   Task 1 (SSP testimonial → array), Tasks 2-5 (one `pdp` block each)
  sitemap.js                   Tasks 2-5 — flip 4 routes placeholder → built
src/pages/
  courses/sole-switch.astro        Task 2 — NEW
  courses/combating-bunions.astro  Task 3 — NEW
  courses/fit-feet.astro           Task 4 — NEW
  products/walk.astro              Task 5 — NEW
tests/
  testimonial.test.mjs         Task 1 — NEW: carousel paging + catalog testimonial shape
  catalog.test.mjs             Task 6 — MODIFY: built-course pdp guard
```

Reused unchanged: `Pdp.astro` (composer + registry), `CourseDetails`, `CourseOverview`, `FourColumn`, `YoullStopAndInstead`, `ComparisonChart`, `YourInstructors`, `Faqs`, `PdpAccordion`, `ProductDetails`, `BrandSection`, `CrossSell`, `PdpReviews`, `LogoWall`, `StarRating`.

---

### Task 1: Testimonial carousel + Sole Switch Pro data migration

**Files:**
- Create: `src/scripts/testimonial.js`, `tests/testimonial.test.mjs`
- Modify: `src/components/pdp/Testimonial.astro`, `src/data/catalog.js` (the `sole-switch-pro` item's `pdp.testimonial` only)

**Interfaces:**
- Produces: `item.pdp.testimonial` is an **array** of `{ quote: string[], author: string, role: string|null, rating: number }`. `quote` is an array of paragraph strings (a `\n` inside a paragraph is a deliberate `<br>`, per the existing `Testimonial.astro` header comment). Tasks 2–5 author their testimonial data in this array shape.
- Produces: `src/scripts/testimonial.js` exports `nextIndex(current, total, dir) → number` (wrap-around; returns `0` when `total <= 1`).
- Consumes: nothing new. `Testimonial.astro` keeps its `{ item }` prop and its registry entry is unchanged.

Read `src/components/pdp/Testimonial.astro` in full first — its header comment already specifies exactly what a real slider must do, and it is the design authority for the arrow markup you are replacing.

- [ ] **Step 1: Write the failing test.**

Create `tests/testimonial.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextIndex } from '../src/scripts/testimonial.js';
import { items } from '../src/data/catalog.js';

test('nextIndex wraps forward past the end', () => {
  assert.equal(nextIndex(0, 3, 1), 1);
  assert.equal(nextIndex(2, 3, 1), 0);
});

test('nextIndex wraps backward past the start', () => {
  assert.equal(nextIndex(2, 3, -1), 1);
  assert.equal(nextIndex(0, 3, -1), 2);
});

test('nextIndex clamps to 0 when there is nothing to page between', () => {
  assert.equal(nextIndex(0, 1, 1), 0);
  assert.equal(nextIndex(0, 1, -1), 0);
  assert.equal(nextIndex(0, 0, 1), 0);
});

// Guards the Chunk B1 data migration: the catalog carries exactly ONE
// testimonial shape (an array), so the carousel has a single contract to
// code against and Tasks 2-5 can't reintroduce the old bare-object form.
test('every pdp.testimonial in the catalog is an array of well-formed testimonials', () => {
  for (const it of items) {
    const t = it.pdp?.testimonial;
    if (t === undefined) continue;
    assert.ok(Array.isArray(t), `${it.id}: pdp.testimonial must be an array`);
    assert.ok(t.length > 0, `${it.id}: pdp.testimonial must not be empty`);
    for (const entry of t) {
      assert.ok(Array.isArray(entry.quote), `${it.id}: testimonial.quote must be an array of paragraphs`);
      assert.ok(entry.quote.length > 0, `${it.id}: testimonial.quote must not be empty`);
      assert.ok(entry.author, `${it.id}: testimonial.author is required`);
      assert.ok(
        Number.isInteger(entry.rating) && entry.rating >= 1 && entry.rating <= 5,
        `${it.id}: testimonial.rating must be an integer 1-5`
      );
    }
  }
});
```

- [ ] **Step 2: Run it to verify it fails.**

Run: `npm test`
Expected: FAIL — `Cannot find module '../src/scripts/testimonial.js'`.

- [ ] **Step 3: Write `src/scripts/testimonial.js`.**

```js
// Testimonial carousel (Course PDP Chunk B1). Framework-free, like cart.js.
//
// Paging state lives in the DOM (`data-testimonial-active` on the section),
// NOT in a module variable, and the single document-level listener resolves
// nodes fresh on every event. So there is nothing cached to go stale across
// Astro ClientRouter swaps: no `astro:page-load` re-init, no teardown. Same
// delegation idiom as YourInstructors.astro's read-more toggle.

/** Wrapping index step. Returns 0 when there is nothing to page between. */
export function nextIndex(current, total, dir) {
  if (total <= 1) return 0;
  return (current + dir + total) % total;
}

function show(section, index) {
  const slides = section.querySelectorAll('[data-testimonial-slide]');
  slides.forEach((slide, i) => {
    const isActive = i === index;
    slide.toggleAttribute('hidden', !isActive);
    slide.toggleAttribute('inert', !isActive);
  });
  section.setAttribute('data-testimonial-active', String(index));
}

function page(section, dir) {
  const total = section.querySelectorAll('[data-testimonial-slide]').length;
  const current = Number(section.getAttribute('data-testimonial-active') ?? 0);
  show(section, nextIndex(current, total, dir));
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const nav = target.closest('[data-testimonial-nav]');
    if (!nav) return;
    const section = nav.closest('[data-testimonial]');
    if (!section) return;
    page(section, nav.getAttribute('data-testimonial-nav') === 'prev' ? -1 : 1);
  });
}
```

- [ ] **Step 4: Run the tests — `nextIndex` passes, the catalog shape test still fails.**

Run: `npm test`
Expected: the three `nextIndex` tests PASS; the catalog shape test FAILS (`sole-switch-pro: pdp.testimonial must be an array`) — Sole Switch Pro's data is still a bare object. That failure is the migration this task exists to do.

- [ ] **Step 5: Migrate the Sole Switch Pro data to array shape.**

In `src/data/catalog.js`, the `sole-switch-pro` item — wrap the existing testimonial object in an array, changing nothing inside it:

```js
      testimonial: [
        {
          quote: [
            "This course put me on track for many positive changes in my foot health and strength!\nI also did Movement RX and also bought the Basic Foot health kit and have benefited in so many ways!",
            'I am pain free and have stronger feet and up the chain benefits!',
            'LOVE GAIT HAPPENS and follow along in podcasts, IG and YouTube!',
          ],
          author: 'Phyllis',
          role: null,
          rating: 5,
        },
      ],
```

- [ ] **Step 6: Run the tests — all green.**

Run: `npm test`
Expected: PASS (all four tests in `testimonial.test.mjs`, plus the existing suites).

- [ ] **Step 7: Rewrite `Testimonial.astro` to render all slides.**

Normalize the prop, render every testimonial as a slide, and make the arrows real controls **only when there is more than one**:

```js
const { item } = Astro.props;
const raw = item.pdp?.testimonial;
// Normalize: a bare object still works (nothing can break on an un-migrated
// item), but the catalog now carries the array shape exclusively — see
// tests/testimonial.test.mjs.
const testimonials = raw ? (Array.isArray(raw) ? raw : [raw]) : [];
const isCarousel = testimonials.length > 1;
```

Markup requirements — keep every existing style, token, star-row and figure/figcaption decision exactly as they are, and change only the structure below:

- The `<section>` gains `data-testimonial` and `data-testimonial-active="0"`.
- Each testimonial renders inside the existing card markup, wrapped in `<div data-testimonial-slide hidden={i !== 0} inert={i !== 0}>`. All slides are in the DOM — that is what prevents layout shift on paging and keeps off-screen quotes out of the accessibility tree.
- The slide region gets an accessible name and a polite live region so a screen reader announces the new quote: `role="region" aria-label="Testimonials" aria-live="polite"` on the slide container.
- **When `isCarousel`:** the arrows become real controls — `<button type="button" data-testimonial-nav="prev" aria-label="Previous testimonial">` / `data-testimonial-nav="next"` / `aria-label="Next testimonial"`, reusing the existing `ARROW_PATH` SVG and the existing `--prev` 180°-rotation. Add a visible `:focus-visible` ring and `cursor: pointer` (they are controls now — the header comment's reasoning for withholding both no longer applies).
- **When `!isCarousel`:** the arrows stay EXACTLY as they are today — `aria-hidden`, non-interactive `<span>`s, no pointer cursor, no focus ring. A control that does nothing is a false affordance; this preserves Chunk A's reasoning rather than overriding it.
- Add the script, and only when it's needed: `{isCarousel && <script>import '../../scripts/testimonial.js';</script>}`.
- Update the header comment: the "carousel arrows: static placeholders, not a real slider" block is now wrong. Replace it with what the arrows actually do, and keep the star/quote/token reasoning intact.

- [ ] **Step 8: Add the reduced-motion-safe transition.**

Give the slides a short opacity crossfade, and collapse it to an instant swap under reduced motion:

```css
[data-testimonial-slide] { transition: opacity 200ms ease; }
@media (prefers-reduced-motion: reduce) {
  [data-testimonial-slide] { transition: none; }
}
```

- [ ] **Step 9: Verify Sole Switch Pro is unchanged — the acceptance gate.**

Sole Switch Pro has exactly ONE testimonial, so it must still render the decorative-span arrows and no script. Sweep orphaned node processes, then:

```bash
git stash && npm run build && cp dist/courses/sole-switch-pro/index.html /tmp/ssp-before.html && git stash pop && npm run build && diff /tmp/ssp-before.html dist/courses/sole-switch-pro/index.html
```

Expected: the ONLY differences are the new `data-testimonial` / `data-testimonial-active` / `data-testimonial-slide` attributes and the slide wrapper `<div>`. **No `<button>`, no `<script>`, no changed copy, no changed classes.** If a button or a script appears, `isCarousel` is wrong. This is the gate — do not proceed past a failure here.

- [ ] **Step 10: Verify the carousel actually pages.**

Temporarily append a second testimonial to `sole-switch-pro.pdp.testimonial` (do NOT commit it), run `npx astro preview --host`, open the LAN IP, and confirm at both widths: arrows are buttons, clicking pages forward and back with wrap-around, keyboard Tab reaches them and Enter/Space activates, and only the active quote is in the accessibility tree. Then revert the temporary data.

- [ ] **Step 11: Verify the suite and commit.**

Run: `npm run build`, `npm run check:links` (0 broken), `npm test` (green).

```bash
git add src/scripts/testimonial.js tests/testimonial.test.mjs src/components/pdp/Testimonial.astro src/data/catalog.js
git commit -m "feat(pdp): testimonial carousel + array-shape testimonial data"
```

---

### Task 2: `/courses/sole-switch`

Figma desktop frame `998:14854` ("Sole Switch Basic Page"); mobile under section `999:7142`.

**Files:**
- Create: `src/pages/courses/sole-switch.astro`
- Modify: `src/data/catalog.js` (add `pdp` to the `sole-switch` item), `src/data/sitemap.js` (flip `/courses/sole-switch` to `built`)

**Interfaces:**
- Consumes: the array-shape `pdp.testimonial` from Task 1; the composer's existing registry types; the `pdp` block field names already established by `sole-switch-pro` in `catalog.js` — read that item first and mirror its structure exactly.
- Produces: nothing later tasks depend on. Tasks 2–5 are independent of each other.

- [ ] **Step 1: Pull the Figma.** `get_metadata` on `998:14854` for its per-section nodes, then `get_design_context` on each section at desktop AND its mobile counterpart under `999:7142`. The section list is the same 11 Sole Switch Pro already ships:

```js
sections: ['course-details','course-overview','four-column','youll-stop-and-instead',
           'comparison-chart','testimonial','your-instructors','cross-sell','faqs',
           'pdp-reviews','logo-wall'],
```

- [ ] **Step 2: Author the `pdp` block** on the `sole-switch` item in `catalog.js` — Figma-verbatim content for every field the existing components read: `priceExact`, `enrollHref` (Kajabi placeholder), the course-card text, `overview`, `featuresHeading` + `features`, `youllStop`, `comparison`, `testimonial` (**array shape**), `instructors`, `faqs`, `reviews`, `crossSell`. Mirror `sole-switch-pro`'s field names exactly — you are adding data to existing components, not designing a shape.
- [ ] **Step 3: Create the page.** `src/pages/courses/sole-switch.astro`, identical in pattern to `src/pages/products/mobility-ball.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Pdp from '../../components/pdp/Pdp.astro';
import { getItem } from '../../data/catalog.js';

const item = getItem('sole-switch');
---
<BaseLayout title={item.title} description={item.description} wide>
  <Pdp item={item} />
</BaseLayout>
```

- [ ] **Step 4: Flip the route.** In `src/data/sitemap.js`, change `r('/courses/sole-switch', 'Sole Switch', 'course', ['Home', 'Courses', 'Sole Switch'])` to pass `{ status: 'built' }` as its 5th argument, matching the `/courses/sole-switch-pro` line directly above it.
- [ ] **Step 5: Verify.** `npm run build` (no `[...slug]` collision; page count unchanged — the route already existed as a generated placeholder), `npm run check:links` = 0 broken, `npm test` green, and the **both-widths Figma pass** on `/courses/sole-switch`. Record any Figma content gaps in `.superpowers/sdd/progress.md`.
- [ ] **Step 6: Commit.**

```bash
git add src/pages/courses/sole-switch.astro src/data/catalog.js src/data/sitemap.js
git commit -m "feat(pdp): sole switch course PDP"
```

---

### Task 3: `/courses/combating-bunions`

Figma desktop frame `675:5540`; mobile under section `999:7142`.

**Files:**
- Create: `src/pages/courses/combating-bunions.astro`
- Modify: `src/data/catalog.js` (add `pdp` to the `combating-bunions` item), `src/data/sitemap.js` (flip `/courses/combating-bunions` to `built`)

**Interfaces:**
- Consumes: the array-shape `pdp.testimonial` from Task 1; the `pdp` field names established by `sole-switch-pro`.
- Note: the `combating-bunions` item has **no `rating`/`reviewCount`** at top level today. If the Figma hero shows a star rating, add them (as `sole-switch-pro` did — this also turns on the star rating on its PLP card, an intentional and consistent side effect). If it doesn't, leave them off; `CourseDetails` guards on their absence.

- [ ] **Step 1: Pull the Figma.** `get_metadata` on `675:5540`, then `get_design_context` per section at desktop AND mobile. Section list — the same 11:

```js
sections: ['course-details','course-overview','four-column','youll-stop-and-instead',
           'comparison-chart','testimonial','your-instructors','cross-sell','faqs',
           'pdp-reviews','logo-wall'],
```

- [ ] **Step 2: Author the `pdp` block** on `combating-bunions` — Figma-verbatim, mirroring `sole-switch-pro`'s field names: `priceExact`, `enrollHref`, course-card text, `overview`, `featuresHeading` + `features`, `youllStop`, `comparison`, `testimonial` (**array shape**), `instructors`, `faqs`, `reviews`, `crossSell`. This course's comparison chart is NOT "Sole Switch VS Sole Switch Pro" — take its rows verbatim from `675:5540`'s own Comparison Chart node.
- [ ] **Step 3: Create the page.**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Pdp from '../../components/pdp/Pdp.astro';
import { getItem } from '../../data/catalog.js';

const item = getItem('combating-bunions');
---
<BaseLayout title={item.title} description={item.description} wide>
  <Pdp item={item} />
</BaseLayout>
```

- [ ] **Step 4: Flip the route** — `r('/courses/combating-bunions', …, { status: 'built' })` in `sitemap.js`.
- [ ] **Step 5: Verify.** Build, `check:links` 0 broken, `npm test` green, both-widths Figma pass. Log content gaps in `.superpowers/sdd/progress.md`.
- [ ] **Step 6: Commit.**

```bash
git add src/pages/courses/combating-bunions.astro src/data/catalog.js src/data/sitemap.js
git commit -m "feat(pdp): combating bunions course PDP"
```

---

### Task 4: `/courses/fit-feet`

Figma desktop frame `675:8154`; mobile under section `999:7142`.

**Files:**
- Create: `src/pages/courses/fit-feet.astro`
- Modify: `src/data/catalog.js` (add `pdp` to the `fit-feet` item), `src/data/sitemap.js` (flip `/courses/fit-feet` to `built`)

**Interfaces:**
- Consumes: the array-shape `pdp.testimonial` from Task 1; the `pdp` field names established by `sole-switch-pro`.
- Note: the item's `id` is `fit-feet` but its title is "Fit Feet Program" and its route is `/courses/fit-feet`. Use `getItem('fit-feet')`.

- [ ] **Step 1: Pull the Figma.** `get_metadata` on `675:8154`, then `get_design_context` per section at desktop AND mobile. Section list — the same 11:

```js
sections: ['course-details','course-overview','four-column','youll-stop-and-instead',
           'comparison-chart','testimonial','your-instructors','cross-sell','faqs',
           'pdp-reviews','logo-wall'],
```

- [ ] **Step 2: Author the `pdp` block** on `fit-feet` — Figma-verbatim, mirroring `sole-switch-pro`'s field names: `priceExact`, `enrollHref`, course-card text, `overview`, `featuresHeading` + `features`, `youllStop`, `comparison`, `testimonial` (**array shape**), `instructors`, `faqs`, `reviews`, `crossSell`. Take this course's comparison rows verbatim from its own Comparison Chart node.
- [ ] **Step 3: Create the page.**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Pdp from '../../components/pdp/Pdp.astro';
import { getItem } from '../../data/catalog.js';

const item = getItem('fit-feet');
---
<BaseLayout title={item.title} description={item.description} wide>
  <Pdp item={item} />
</BaseLayout>
```

- [ ] **Step 4: Flip the route** — `r('/courses/fit-feet', …, { status: 'built' })` in `sitemap.js`.
- [ ] **Step 5: Verify.** Build, `check:links` 0 broken, `npm test` green, both-widths Figma pass. Log content gaps in `.superpowers/sdd/progress.md`.
- [ ] **Step 6: Commit.**

```bash
git add src/pages/courses/fit-feet.astro src/data/catalog.js src/data/sitemap.js
git commit -m "feat(pdp): fit feet course PDP"
```

---

### Task 5: `/products/walk` (un-deferring the Walk PDP)

Figma desktop frame `721:7417` (in the Product PDP section `705:5988`); mobile under section `1017:9514`.

**Files:**
- Create: `src/pages/products/walk.astro`
- Modify: `src/data/catalog.js` (add `pdp` to the `walk` item), `src/data/sitemap.js` (flip `/products/walk` to `built`)

**Interfaces:**
- Consumes: the array-shape `pdp.testimonial` from Task 1. Reads `pdp` field names from BOTH precedents — product fields (`ProductDetails`: gallery, variants, accordion, `crossSell`, `reviews`) from any built product like `toe-spacers`, and `testimonial` / `instructors` from `sole-switch-pro`.

**Why this task is different from Tasks 2–4:** Walk is the **first product whose section list differs from the standard six**. It is a genuine exercise of the data-driven composer — if it needs a code change to express, that is a finding worth reporting, not something to hack around.

- [ ] **Step 1: Pull the Figma.** `get_metadata` on `721:7417`, then `get_design_context` per section at desktop AND mobile. Its section list — note there is **no `four-column` and no `logo-wall`**:

```js
sections: ['product-details','testimonial','brand-section','cross-sell',
           'your-instructors','pdp-reviews'],
```

- [ ] **Step 2: Check the cross-sell variant.** Walk's `Product Cards` instance is **650px tall against the usual 447px** (`1046:10778`). Pull it and compare against the `CrossSell` component the other PDPs use. If it is the same component with more/larger cards, use `CrossSell` as-is. If it genuinely differs, **extend `CrossSell` with a variant prop — do NOT fork it**, and note the extension in the commit. If it turns out to need a whole new section type, STOP and report (that contradicts the spec's B1 scope).
- [ ] **Step 3: Author the `pdp` block** on the `walk` item — Figma-verbatim: the `ProductDetails` buy-box fields (gallery images, `variants`, `accordion`, price), `testimonial` (**array shape**), `instructors`, `crossSell`, `reviews`. Walk is a book, so confirm against the Figma whether it has variants/a size chart at all; omit what it doesn't have (the components guard on absence).
- [ ] **Step 4: Create the page.**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Pdp from '../../components/pdp/Pdp.astro';
import { getItem } from '../../data/catalog.js';

const item = getItem('walk');
---
<BaseLayout title={item.title} description={item.description} wide>
  <Pdp item={item} />
</BaseLayout>
```

- [ ] **Step 5: Flip the route.** In `sitemap.js`, `r('/products/walk', 'WALK', 'pdp', ['Home', 'Shop', 'WALK'], { status: 'built' })`. **Note:** this route's `kind` is `'pdp'`, so the EXISTING `catalog.test.mjs` test "every built product route has a pdp block whose crossSell resolves" will now cover Walk and fail if its `pdp.crossSell` is missing or its ids don't resolve. That is intended — it is a free guard.
- [ ] **Step 6: Verify.** Build, `check:links` 0 broken, `npm test` green, both-widths Figma pass. Walk's Add-to-Cart must work through the existing `cart.js` (it is a product, not a course — no enroll link): quick-add → drawer line item → subtotal → badge.
- [ ] **Step 7: Commit.**

```bash
git add src/pages/products/walk.astro src/data/catalog.js src/data/sitemap.js
git commit -m "feat(pdp): walk product PDP"
```

---

### Task 6: Chunk-wide guard test + verification sweep

**Files:**
- Modify: `tests/catalog.test.mjs`, `.superpowers/sdd/progress.md`

- [ ] **Step 1: Write the failing test.** `catalog.test.mjs` today guards built *product* routes only (`r.kind === 'pdp'`). Add the course equivalent, so a future chunk can't flip a course route to `built` without its data:

```js
// Chunk B1: the course counterpart of the built-product guard above. Every
// course route the sitemap marks `built` must carry the `pdp` block the
// course sections read, an ordered `sections` list for the composer, and a
// resolvable crossSell — otherwise the page silently renders empty sections
// (the composer's unknown/guarded-off types render nothing by design).
test('every built course route has a pdp block with sections and a resolving crossSell', () => {
  const builtCoursePaths = new Set(
    routes.filter(r => r.status === 'built' && r.kind === 'course').map(r => r.path)
  );
  const courseItems = items.filter(it => it.kind === 'course' && builtCoursePaths.has(it.href));

  // Sanity-check the filter — an empty set would make everything below pass vacuously.
  assert.ok(courseItems.length >= 4, `expected >=4 built course items, found ${courseItems.length}`);

  for (const it of courseItems) {
    assert.ok(it.pdp, `built course missing pdp block: ${it.id}`);
    assert.ok(Array.isArray(it.pdp.sections) && it.pdp.sections.length > 0,
      `built course missing pdp.sections: ${it.id}`);
    assert.ok(it.pdp.crossSell, `built course pdp missing crossSell: ${it.id}`);
    for (const id of it.pdp.crossSell.itemIds) {
      assert.ok(getItem(id), `${it.id} pdp.crossSell bad itemId: ${id}`);
    }
    assert.ok(
      routePaths.has(it.pdp.crossSell.shopAllHref),
      `${it.id} pdp.crossSell.shopAllHref not a route: ${it.pdp.crossSell.shopAllHref}`
    );
  }
});
```

- [ ] **Step 2: Run it.**

Run: `npm test`
Expected: PASS — Sole Switch Pro plus the three courses from Tasks 2–4 make four built courses, all with `pdp` blocks. A failure here means one of those tasks left data incomplete; fix the data, not the test.

- [ ] **Step 3: Full verification sweep.** Sweep orphaned node/astro/preview processes FIRST (stale `dist` writes will make you verify the wrong HTML). Then: `npm run build` (confirm the page count with `find dist -name index.html | wc -l` — it should be unchanged at 40, since all four routes already existed as generated placeholders), `npm run check:links` (0 broken), `npm test` (green).
- [ ] **Step 4: Live-browser both-widths pass** via `npx astro preview --host` + the LAN IP, on one individual course AND `/products/walk`. Confirm the testimonial carousel pages on any course that has more than one quote, and that Walk's Add-to-Cart works end-to-end.
- [ ] **Step 5: Update `.superpowers/sdd/progress.md`** with the chunk's carry-overs: client-supplied content gaps found per course, the Walk cross-sell variant outcome, and anything deferred to B2.
- [ ] **Step 6: Commit.**

```bash
git add tests/catalog.test.mjs .superpowers/sdd/progress.md
git commit -m "test(pdp): guard built course routes have pdp data"
```

---

## Definition of done

- Four routes live and `built`: `/courses/sole-switch`, `/courses/combating-bunions`, `/courses/fit-feet`, `/products/walk`.
- `Testimonial.astro` pages between multiple quotes; single-quote sections still render decorative arrows and ship no script.
- Sole Switch Pro renders unchanged apart from the carousel's `data-*` hooks (Task 1, Step 9).
- Build clean, `check:links` 0 broken, `npm test` green, both-widths Figma pass on every new page.
- Chunk B2 (Three Column Info + Image With Text + the five professional courses incl. FGA Level 2) remains scoped and unstarted — its section map is in §7 of the spec.
