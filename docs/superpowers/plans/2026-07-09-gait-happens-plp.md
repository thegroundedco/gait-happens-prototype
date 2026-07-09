# Gait Happens PLP Buildout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 6 Product/Course Listing Pages as real, data-driven pages (4 layouts) with a Quick-Add-to-Cart modal and a persistent localStorage cart, on top of the existing Astro foundation.

**Architecture:** A `src/data/catalog.js` data module (items + collections) is the single source of truth for cards, mirroring `sitemap.js`. A shared `<Plp>` component composes PLP sections from a collection. The 6 PLP routes become explicit page files; `[...slug].astro` generates only `placeholder` routes so there's no collision. A framework-free `cart.js` module persists a cart to localStorage and drives the (upgraded) cart drawer + a header count badge. All client JS uses the established initial-load + `astro:after-swap` init pattern.

**Tech Stack:** Astro, vanilla JS, GSAP (existing reveal utility), localStorage, Node built-in test runner.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-09-gait-happens-plp-design.md`. Figma PLP section: file `FX7PDNvhZwyozODaq8Q8i7`, node `764-10786`.
- Tokens govern color/type/spacing (`--color-ink` #231f20, `--color-yellow` #fec745, `--color-teal` #047791, `--color-paper`, `--type-*`, `--space-*`); component-intrinsic structural px may be literal.
- `src/data/*` is the single source of truth — no hardcoded catalog/route data in components. PLP card content comes from `catalog.js`; routes/labels from `sitemap.js`.
- Every internal link resolves — `npm run check:links` stays at **0 broken** after every task (PLP cards → PDP routes, cross-sell → collections/products).
- Client JS binds on the initial load (directly, or on `DOMContentLoaded`) AND re-inits on `astro:after-swap`; document-level listeners registered once at module scope; no listener leaks. (Pattern: `src/components/Header.astro`, `src/scripts/motion.js`.)
- Motion respects `prefers-reduced-motion`. Off-canvas/hidden interactive panels use `inert` when closed.
- Do NOT flip a route to `status:'built'` unless its explicit page file exists in the same task — otherwise it 404s.
- Commit per task, conventional messages. Work on branch `feat/plp` (set up by the controller).

## File Structure

```
src/
  data/catalog.js                 items + collections (SOURCE OF TRUTH for cards)
  scripts/cart.js                 localStorage cart module (get/add/remove/setQty/subtotal + cart:change event)
  components/plp/
    Plp.astro                     composes a full PLP from a collection
    PlpTitle.astro                teal centered title band
    FilterSortBar.astro           static filter/sort controls + "N products"
    StarRating.astro              stars + "(N)" with aria-label
    PlpCard.astro                 wide 2-up card
    PlpGrid.astro                 2-col grid, embeds intro/promo cells
    IntroBlock.astro              teal heading+body grid cell
    Pagination.astro              static "Page 1 of 1"
    CrossSell.astro               "Shop Our…" band (3 mini cards + teal shop-all card)
    LogoWall.astro                "As Seen In" press logos
    QuickAddModal.astro           dialog: variant/size, qty, size chart, Add to Cart
  pages/collections/
    all.astro  best-sellers.astro  featured.astro
    courses-individuals.astro  courses-professionals.astro  all-courses.astro
tests/
  catalog.test.mjs                catalog integrity
  cart.test.mjs                   cart module logic
public/images/plp/                item images + press logos (exported from Figma by controller)
```
Modified: `src/data/sitemap.js` (flip 6 PLP routes to `built`), `src/pages/[...slug].astro` (generate only placeholders), `src/components/CartDrawer.astro` (line items), `src/components/Header.astro` (cart badge + cart init).

---

### Task 1: Catalog data model + routing setup

**Files:** Create `src/data/catalog.js`, `tests/catalog.test.mjs`. Modify `src/pages/[...slug].astro`.

**Interfaces:**
- Produces `items` (array), `collections` (object keyed by route path), `getItem(id)`, `getCollection(path)`, `pressLogos` (array). Item + collection shapes per spec §3.
- `[...slug].astro` `getStaticPaths` filters `routes` to `status === 'placeholder'`.

- [ ] **Step 1: Write the failing test** (`tests/catalog.test.mjs`)

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { items, collections, getItem, getCollection } from '../src/data/catalog.js';
import { routes } from '../src/data/sitemap.js';

const routePaths = new Set(routes.map(r => r.path));

test('every item has required fields, unique id, and an href that resolves to a route', () => {
  const seen = new Set();
  for (const it of items) {
    assert.ok(it.id && !seen.has(it.id), `bad/dupe id: ${it.id}`); seen.add(it.id);
    assert.ok(it.title && it.kind && it.image && it.href, `missing fields: ${it.id}`);
    assert.ok(['product','course'].includes(it.kind), `bad kind: ${it.id}`);
    assert.ok(routePaths.has(it.href), `item href not a route: ${it.href}`);
  }
});

test('every collection key is a sitemap route and every itemId resolves', () => {
  for (const [path, col] of Object.entries(collections)) {
    assert.ok(routePaths.has(path), `collection path not a route: ${path}`);
    const ids = col.grouped ? col.grouped.flatMap(g => g.itemIds) : col.itemIds;
    for (const id of ids) assert.ok(getItem(id), `collection ${path} bad itemId: ${id}`);
    for (const id of col.crossSell.itemIds) assert.ok(getItem(id), `crossSell bad itemId: ${id}`);
  }
});

test('getCollection / getItem work', () => {
  assert.ok(getCollection('/collections/all'));
  assert.equal(getCollection('/nope'), undefined);
});
```

- [ ] **Step 2: Run test — verify it fails** (`npm test` → cannot find `catalog.js`).

- [ ] **Step 3: Write `src/data/catalog.js`.** Build `items` from the existing sitemap product + course routes (handles/hrefs must match `sitemap.js` paths exactly). Use the Figma sample content for title/price/priceRange/rating/reviewCount/description/badges/cta; `image: '/images/plp/<handle>.jpg'` (controller exports these). Add `variants`/`sizeChart` to products that have size options (e.g. Toe Spacers: Small/Medium/Large + size chart). Build `collections` per spec §3 for all 6 routes (best-sellers/featured = product subsets; all-courses = grouped Individuals/Professionals; crossSell per Figma: courses→products, products/all-courses→courses/products). Export `getItem`, `getCollection`, `pressLogos`. (Complete data — no omissions; the controller will supply the finalized field values with the task brief.)

- [ ] **Step 4: Update `src/pages/[...slug].astro`** — filter placeholders only:

```js
export function getStaticPaths() {
  return routes
    .filter(route => route.path !== '/' && route.status === 'placeholder')
    .map(route => ({ params: { slug: route.path.replace(/^\//, '') }, props: { route } }));
}
```

- [ ] **Step 5: Run tests + build + link check.** `npm test` (catalog + sitemap pass); `npm run build` (still 39 pages — nothing is `built` yet so all 6 PLP routes still generate as placeholders); `npm run check:links` = 0 broken.

- [ ] **Step 6: Commit** (`feat: catalog data model + placeholder-only route generation`).

---

### Task 2: Standard PLP — card, grid, sections, first page

Delivers a complete standard course PLP (`/collections/courses-individuals`) end-to-end, establishing all the reusable pieces.

**Files:** Create `src/components/plp/{StarRating,PlpCard,IntroBlock,FilterSortBar,Pagination,PlpTitle,PlpGrid,Plp}.astro`, `src/pages/collections/courses-individuals.astro`. Modify `src/data/sitemap.js` (flip that one route to `built`).

**Interfaces:**
- Consumes `getCollection`, `getItem` (Task 1). `Plp` prop: `{ collection }` (resolved object) or `{ path }`.
- Produces `PlpCard` prop `{ item }`; `Plp` composes title → filter/sort → grid(+intro) → pagination. (Cross-sell + logo wall added Task 3.)

- [ ] **Step 1: Build the presentational components** matching Figma (controller supplies exact design-context specs + the card layout per task brief). Real structure, tokens for color/type/spacing:
  - `StarRating` — filled/empty stars from `rating`, `(reviewCount)`, `aria-label`.
  - `PlpCard` — wide card: left image (`item.image`), right detail: badges (yellow pills from `item.badges`), title + price/priceRange, `StarRating`, description, CTA button (`item.cta` → `item.href`, teal), a visual compare checkbox, and a quick-add button `data-quick-add={item.id}` (cart icon). Card whole/title links to `item.href`.
  - `IntroBlock` — teal cell, `heading` + `body`.
  - `FilterSortBar` — static: FILTER (Availability, Price), SORT BY (Best Selling), and "`{count}` products". `<select>`s render but are inert.
  - `Pagination` — "Page 1 of 1".
  - `PlpTitle` — teal centered `collection.title`.
  - `PlpGrid` — 2-col grid of `PlpCard`s with the `IntroBlock` placed in the correct cell per the layout.
  - `Plp` — composes the above from `collection`.
- [ ] **Step 2: Create the page** `src/pages/collections/courses-individuals.astro` → `BaseLayout` + `<Plp collection={getCollection('/collections/courses-individuals')} />`, `data-reveal` on sections.
- [ ] **Step 3: Flip the route** `status:'built'` for `/collections/courses-individuals` in `sitemap.js`.
- [ ] **Step 4: Verify** — `npm run build` (39 pages; the route now comes from the explicit file, not the catch-all — confirm no duplicate-route error and the page exists at `dist/collections/courses-individuals/index.html`); `npm run check:links` = 0 broken (card CTAs → `/courses/*` placeholders resolve); `npm test` 3/3+.
- [ ] **Step 5: Commit** (`feat: standard PLP template + card/grid + courses-individuals page`).

---

### Task 3: Cross-sell + logo wall sections

**Files:** Create `src/components/plp/{CrossSell,LogoWall}.astro`. Modify `src/components/plp/Plp.astro` (append the two sections).

**Interfaces:** Consumes `collection.crossSell` (heading, itemIds, shopAllHref) and `pressLogos`.

- [ ] **Step 1:** `CrossSell` — yellow band, `heading`, a row of 3 mini item cards (image + label + arrow → item href) + a teal "Shop All" nav card (→ shopAllHref). `LogoWall` — "As Seen In" + `pressLogos`.
- [ ] **Step 2:** Append both to `Plp` (below Pagination), `data-reveal`.
- [ ] **Step 3: Verify** — build + check:links (0 broken; cross-sell links resolve); the courses-individuals page now shows both sections.
- [ ] **Step 4: Commit** (`feat: PLP cross-sell + logo wall`).

---

### Task 4: Remaining standard PLPs (product + professionals)

**Files:** Create `src/pages/collections/{all,best-sellers,featured,courses-professionals}.astro`. Modify `sitemap.js` (flip those 4 routes to `built`).

**Interfaces:** Reuse `Plp`. Product collections use product items (CTA "View Product"); no intro block unless the collection defines one.

- [ ] **Step 1:** Create the 4 page files, each `BaseLayout` + `<Plp collection={getCollection(<path>)} />`.
- [ ] **Step 2:** Flip the 4 routes to `built` in `sitemap.js`.
- [ ] **Step 3: Verify** — build (39 pages; 5 of 6 PLP routes now explicit; no collisions); check:links 0 broken; spot-check `dist/collections/all/index.html`, `.../best-sellers/…`, `.../featured/…`, `.../courses-professionals/…` exist.
- [ ] **Step 4: Commit** (`feat: product + professionals PLP pages`).

---

### Task 5: Grouped "All Courses" PLP

**Files:** Create `src/pages/collections/all-courses.astro`. Modify `src/components/plp/Plp.astro` (support `collection.grouped`). Modify `sitemap.js` (flip route).

**Interfaces:** `Plp` renders per-persona sections when `collection.grouped` is present (each: `IntroBlock` + its own `PlpGrid`), then one shared cross-sell + logo wall.

- [ ] **Step 1:** Extend `Plp` to branch on `grouped` (render N persona sections) vs a single grid.
- [ ] **Step 2:** Create `all-courses.astro`; flip route to `built`.
- [ ] **Step 3: Verify** — build (all 6 PLP routes now explicit; 39 pages; no catch-all collision); check:links 0 broken; `/_status` shows the 6 as built.
- [ ] **Step 4: Commit** (`feat: grouped all-courses PLP`).

---

### Task 6: Cart module (localStorage) + tests

**Files:** Create `src/scripts/cart.js`, `tests/cart.test.mjs`.

**Interfaces:** Produces `getCart()`, `addLine(line)`, `removeLine(key)`, `setQty(key,n)`, `clear()`; each mutation persists to localStorage and dispatches a `cart:change` CustomEvent. `line = { id, title, variant, price, qty, image, href }`; identical `id+variant` merges (qty sums). `getCart()` returns `{ lines, count, subtotal }`.

- [ ] **Step 1: Write failing tests** (`tests/cart.test.mjs`) using a localStorage + CustomEvent/dispatchEvent stub (node has no DOM): assert add creates a line, adding same id+variant merges qty, removeLine/setQty work, subtotal/count compute from numeric prices, clear empties, and each mutation persists to the stub store. Provide the stub in the test.
- [ ] **Step 2: Run — verify fail.**
- [ ] **Step 3: Implement `cart.js`.** Guard all `localStorage`/`window` access so importing in a non-DOM/test context is safe (inject or feature-detect the store). Parse price to a number for subtotal (handle `$45 USD`, ranges → use base/min or the modal-provided numeric price). Dispatch `cart:change` when a document/window exists.
- [ ] **Step 4: Run tests — pass.** `npm test` green.
- [ ] **Step 5: Commit** (`feat: localStorage cart module + tests`).

---

### Task 7: Cart drawer line items + header count badge

**Files:** Modify `src/components/CartDrawer.astro`, `src/components/Header.astro`.

**Interfaces:** Consumes `cart.js` (`getCart`, `removeLine`, `setQty`, `cart:change`). Renders line items (image, title, variant, qty controls, line price, remove), subtotal, empty state when count 0. Header cart icon shows a count badge (hidden when 0).

- [ ] **Step 1:** `CartDrawer` — add a line-items container + subtotal + checkout button (placeholder). A client script renders lines from `getCart()` on init and on `cart:change`; wires remove/qty via `data-*`. Empty-state shows when count 0.
- [ ] **Step 2:** `Header` — add a `.cart-badge` element on the cart button; a `renderCartBadge()` called from `initHeader()` (initial load + after-swap) and on `cart:change` (bound once at module scope). Follow the leak-free pattern exactly.
- [ ] **Step 3: Verify** — build + check:links 0 broken. (Cart is empty by default, so drawer shows empty state, badge hidden — unchanged visual until Task 8 adds items.) Confirm the render/`cart:change` wiring is present and document listeners are bound once.
- [ ] **Step 4: Commit** (`feat: cart drawer line items + header count badge`).

---

### Task 8: Quick-Add modal + wiring

**Files:** Create `src/components/plp/QuickAddModal.astro`. Modify `src/components/plp/Plp.astro` (render one modal instance per PLP page) and its client wiring.

**Interfaces:** Consumes `catalog` (item data by id) and `cart.js` (`addLine`). Opened by a card's `[data-quick-add={id}]`. Populates title, price, image, variant/size pills, quantity stepper, size chart from the item. Add to Cart → `cart.addLine(...)` (with chosen variant + qty) → open the cart drawer.

- [ ] **Step 1:** Build `QuickAddModal` — centered dialog + scrim, matching Figma (controller supplies design-context spec); `inert`/hidden when closed. Elements: title, price, image, variant pills (from `item.variants`), qty stepper, size chart (if `item.sizeChart`), Add to Cart button, close.
- [ ] **Step 2:** Render one modal per PLP page (in `Plp`), and add client wiring (in the PLP page/Plp script, or a shared `src/scripts/quick-add.js` imported by pages): on `[data-quick-add]` click, populate the modal from `catalog.getItem(id)`, open it (focus in, `inert` off); on Add to Cart, `cart.addLine({...})`, close modal, open cart drawer; Esc/scrim close. Use the initial-load + after-swap init pattern; wire the modal's own trigger set per page.
- [ ] **Step 3: Verify** — build + check:links 0 broken; confirm the modal markup + `data-quick-add` hooks + Add-to-Cart→`cart.addLine` wiring are present. (Full interactive verification happens in the controller's browser pass.)
- [ ] **Step 4: Commit** (`feat: quick-add modal + add-to-cart wiring`).

---

### Task 9: Motion, a11y polish, final verification

**Files:** Touch `QuickAddModal`, `Plp`, `PlpCard` as needed for motion/a11y; no new features.

- [ ] **Step 1:** Reveal-on-scroll already applies via `[data-reveal]` on sections — confirm sections carry it. Card hover lift + CTA arrow nudge (CSS, tokens). Modal fade/scale-in respecting `prefers-reduced-motion`; focus moves into the modal on open, returns to the quick-add trigger on close; Esc/scrim close; `inert` when closed. Badges/rating have accessible text.
- [ ] **Step 2: Full verification** — `npm test` (catalog + cart + sitemap all pass); `npm run build` (39 pages, exit-0 modulo the Dropbox EBUSY); `npm run check:links` = 0 broken (with all PLP pages real).
- [ ] **Step 3: Commit** (`feat: PLP motion + a11y polish; verification`).

---

## Self-Review — spec coverage

- §1 scope (6 routes, 4 layouts, quick-add, persistent cart, real images) → Tasks 2,4,5 (pages), 6–8 (cart+modal), controller asset export. ✓
- §3 catalog data model → Task 1 (+ integrity tests). ✓
- §4 routing (explicit pages, status→built, placeholder-only generator, no collision) → Tasks 1 (filter), 2/4/5 (pages+flip). ✓
- §5 components → Tasks 2,3,8 + CartDrawer/Header edits (7). ✓
- §6 cart (module, persist, drawer, badge, hydrate on load/after-swap) → Tasks 6,7,8. ✓
- §7 static filter/sort, pagination, compare checkbox → Task 2. ✓
- §8 assets → controller exports to `public/images/plp/` before Tasks 2/3/4/5/8. ✓ (real fetch step, not a placeholder)
- §9 motion/a11y → Task 9 (+ inline in 2/8). ✓
- §10 verification (build 39, check:links 0, catalog+cart tests) → every task + Task 9. ✓
- §11 open items (L2 omitted, best-sellers/featured subsets, placeholder logos) → reflected in Task 1 catalog data. ✓

No unresolved placeholders in process steps. Route paths in `catalog.js` collections must equal `sitemap.js` paths (enforced by the Task 1 integrity test). Exact per-component visual specs and item images are pulled from Figma by the controller as task-brief prep (established pattern from the nav build), not invented in the plan.
