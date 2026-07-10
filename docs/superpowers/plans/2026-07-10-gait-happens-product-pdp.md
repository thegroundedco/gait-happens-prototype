# Gait Happens Product PDP Implementation Plan (PDP Chunk 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Product Detail Page — 6 composed sections rendered from data — for the 7 physical products, with a working Add-to-Cart, faithful to the Figma at desktop and mobile.

**Architecture:** A `Pdp.astro` composer assembles an ordered list of section components (`src/components/pdp/*`) from per-product `pdp` data in `catalog.js` — the same section-library, data-driven pattern as the PLP. `Toe Spacers` is the pilot product built end-to-end through the section tasks; the remaining products are rolled out from data at the end. Add to Cart reuses `src/scripts/cart.js`.

**Tech Stack:** Astro, vanilla JS, GSAP (existing reveal util), the existing `cart.js`, CSS from design-system tokens. No new dependencies.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-10-gait-happens-product-pdp-design.md`. **Figma:** file `FX7PDNvhZwyozODaq8Q8i7` — Product PDP desktop section `705:5988`, mobile section `1017:9514`. Toe Spacers: desktop `706:7665`, mobile `1017:9515`.
- **Fidelity workflow (every visual section task):** pull the section's `get_design_context` for BOTH its desktop and mobile node (ids given per task) BEFORE building; build ONE responsive component adapting the Figma to our tokens; then **verify the built section against the Figma screenshot at BOTH desktop (1200–1440) and mobile (390) widths** — this both-widths visual check is the task's acceptance gate, not just "it builds". (Subagents may not be able to drive a real browser; when they can't, they say so and the controller does the both-widths pass at the checkpoint.)
- **Content:** use the Figma's real text **verbatim** where it exists (titles, prices with cents, descriptions, bullets, feature copy, brand tagline, accordion Instructions/Research, review counts); placeholder only where the Figma itself is sample. **Images are placeholder** — reuse an existing `public/images/*` where the product already has one (e.g. `walk`, PLP `/images/plp/<handle>.jpg`), else a neutral placeholder under `public/images/pdp/`.
- Tokens govern color/type/spacing (`--color-ink` #231f20, `--color-yellow` #fec745, `--color-teal` #047791, `--color-paper`, `--type-*`, `--space-*`); component-intrinsic structural px may be literal.
- `src/data/*` is the single source of truth — no hardcoded per-product content in components; PDP content comes from `catalog.js`.
- Do NOT flip a `/products/*` route to `status:'built'` until its page renders a real PDP (Toe Spacers in Task 1; the rest in Task 7). `[...slug].astro` already generates only `placeholder` routes (no collision).
- **Add to Cart reuses `cart.js`**: `addLine({ id, title, variant: chosenSize ?? null, price: item.price ?? item.priceRange, qty, image, href })`, then open the drawer via `document.querySelector('[data-util="cart"]')?.click()` (the Quick-Add pattern). No cart-module changes.
- Client JS (gallery swap, accordion, add-to-cart) inits on initial load AND `astro:after-swap`; document-level listeners bound once at module scope; no leaks (pattern: `Header.astro`, `QuickAddModal.astro`).
- Motion respects `prefers-reduced-motion`. Responsive breakpoints: mobile `<768` (design 390), tablet `768`, desktop `1024`/container `1200`, wide `1440`.
- **No unit tests for visual sections** (fidelity is browser-vs-Figma). Verification each task: `npm run build` (page count unchanged — the 7 routes already generate as placeholders; a transient Dropbox `.vite` EBUSY is benign, confirm `find dist -name index.html | wc -l`), `npm run check:links` = 0 broken, `npm test` green, + the both-widths Figma pass. Commit per task, conventional messages.
- **Walk is deferred** to a later chunk: its PDP swaps in `Testimonial` + `Your Instructors`, which are built in the course PDP chunk. Keep `/products/walk` a placeholder; do NOT ship an incomplete Walk PDP.
- **Browser gotcha:** dev server in the Bash sandbox is unreachable from host Chrome via localhost — run `npx astro dev --host` and use the LAN IP; GSAP/motion only animate when the Chrome window is foregrounded. `check:links` needs port 4321 free (stop the dev server first, restart after).

## File Structure

```
src/components/pdp/
  Pdp.astro            composes a PDP from an ordered section list (like Plp.astro)
  ProductDetails.astro hero: gallery + buy box + accordion  (Tasks 2-3)
  FourColumn.astro     yellow feature band                  (Task 4)
  BrandSection.astro   teal brand-statement band            (Task 5)
  PdpReviews.astro     static Customer Reviews placeholder   (Task 6)
src/pages/products/
  toe-spacers.astro (Task 1) ; foot-health-kit / cork-supplement / toe-strengtheners /
  toe-dynamometer / mobility-ball .astro (Task 7)
```
Reuse: `components/plp/CrossSell.astro`, `components/plp/LogoWall.astro`, `components/plp/StarRating.astro`.
Modified: `src/data/catalog.js` (per-product `pdp` block + shared brand block), `src/data/sitemap.js` (flip `/products/*` routes to `built`).

---

### Task 1: PDP scaffold — composer, data shape, Toe Spacers route, reused sections

Prove the pipeline end-to-end with the two sections we already have, so later tasks just add sections.

**Files:** Create `src/components/pdp/Pdp.astro`, `src/pages/products/toe-spacers.astro`. Modify `src/data/catalog.js` (add a `pdp` block to the `toe-spacers` item + a shared brand constant), `src/data/sitemap.js` (flip `/products/toe-spacers` to `built`).

**Interfaces:**
- Produces `Pdp.astro` with prop `{ item }` — renders an ordered section list; in this task it renders `CrossSell` (from `item.pdp.crossSell`) then `LogoWall` (from `pressLogos`), each wrapped in `data-reveal`. Later tasks insert sections above these.
- `item.pdp` shape starts as `{ crossSell: { heading, itemIds:[3], shopAllHref } }` and grows per later task.

- [ ] **Step 1: Add the `pdp` block to Toe Spacers** in `catalog.js`. Give `toe-spacers` a `pdp: { crossSell: { heading: 'More Resources for Your Movement Journey', itemIds: ['toe-spacers','combating-bunions','fit-feet'], shopAllHref: '/collections/all' } }`. (The exact heading text is Figma-verbatim from the Toe Spacers PDP cross-sell — confirm against `1143:16665`.) Add a shared `export const pdpBrand = { … }` stub (filled in Task 5).
- [ ] **Step 2: Create `Pdp.astro`.** `const { item } = Astro.props;` → render `<div class="pdp">` containing `<div data-reveal><CrossSell crossSell={item.pdp.crossSell} /></div>` and `<div data-reveal><LogoWall logos={pressLogos} /></div>`. Import `CrossSell`, `LogoWall`, `pressLogos`. (Sections above cross-sell are added in Tasks 2–6.)
- [ ] **Step 3: Create the page** `src/pages/products/toe-spacers.astro` → `BaseLayout` (title = item.title, `wide` if the PLP pages use it) + `<Pdp item={getItem('toe-spacers')} />`, importing `getItem`.
- [ ] **Step 4: Flip the route** `/products/toe-spacers` to `status:'built'` in `sitemap.js`.
- [ ] **Step 5: Verify.** `npm run build` (page count unchanged; confirm `dist/products/toe-spacers/index.html` exists, no duplicate-route error), `npm run check:links` = 0 broken (cross-sell/shop-all links resolve), `npm test` green. Controller: `/products/toe-spacers` shows the cross-sell band + logo wall.
- [ ] **Step 6: Commit** (`feat(pdp): PDP composer + Toe Spacers route with cross-sell + logo wall`).

---

### Task 2: Product Details — buy box + image gallery (Toe Spacers)

The hero. Figma: desktop `710:6353`, mobile `1017:9517`.

**Files:** Create `src/components/pdp/ProductDetails.astro`. Modify `src/components/pdp/Pdp.astro` (render it first), `src/data/catalog.js` (Toe Spacers `pdp` gains `gallery`, `priceExact`, `description`, `bullets`).

**Interfaces:** Consumes `item` (id/title/price/variants/image + `item.pdp.gallery/priceExact/bullets`) and `StarRating`. The Add-to-Cart hook: a `[data-pdp-add]` button carrying the selected size + qty. Reuses `cart.js`.

- [ ] **Step 1: Pull Figma design context** for `710:6353` (desktop) AND `1017:9517` (mobile). Note exact layout: left column (breadcrumb, title, StarRating + count, price with cents, Size pills from `item.variants`, qty stepper, yellow Add to Cart, description, benefit bullets); right column (main image + thumbnail strip). Mobile stacks to one column.
- [ ] **Step 2: Build `ProductDetails.astro`** — real structure, tokens for color/type/spacing, responsive (2-col desktop → 1-col mobile at the design's breakpoint). Buy box: title, `<StarRating>`, `item.pdp.priceExact`, Size pills (`aria-pressed`, from `item.variants.options`, pre-select first), qty stepper (min 1, `aria-label`s), `<button data-pdp-add …>Add to Cart</button>` (yellow), description, `<ul>` bullets. Gallery: main `<img>` + a row of thumbnail `<button>`s (`data-pdp-thumb`).
- [ ] **Step 3: Gallery swap + Add-to-Cart client script** (co-located in `ProductDetails.astro`, leak-free init on load + `astro:after-swap`; document listeners once at module scope): thumbnail click/Enter → swap the main image `src` (reduced-motion = instant); Add to Cart → read selected size + qty → `cart.addLine({ id: item.id, title: item.title, variant: size ?? null, price: item.price, qty, image: item.image, href: item.href })` → `document.querySelector('[data-util="cart"]')?.click()`. Item data reaches the script via `data-*` attributes or a per-page `import { getItem }` (match the QuickAddModal approach).
- [ ] **Step 4: Render it in `Pdp.astro`** as the first section (above cross-sell), `data-reveal`.
- [ ] **Step 5: Verify (both widths).** Build (toe-spacers still builds; count unchanged), check:links 0. Controller both-widths Figma pass: buy box + gallery match `710:6353` (desktop) and `1017:9517` (mobile); thumbnail swap works; Add to Cart adds `Toe Spacers / <size> / qty` and opens the drawer.
- [ ] **Step 6: Commit** (`feat(pdp): Product Details buy box + gallery (Toe Spacers)`).

---

### Task 3: Product Details — accordion (Size chart / Instructions / Research)

Figma: within `710:6353` (desktop, rows shown expanded), mobile collapsible `1088:15369` (the "Question" items).

**Files:** Modify `src/components/pdp/ProductDetails.astro` (append the accordion below the buy box), `src/data/catalog.js` (Toe Spacers `pdp.accordion = { instructions, research }`; `sizeChart` already on the item).

- [ ] **Step 1: Pull Figma design context** for the accordion (desktop within `710:6353`; mobile `1088:15369`). Note the row style (label + toggle icon), the Size row renders the size-chart TABLE (columns/rows from `item.sizeChart`), Instructions/Research render body copy (Figma-verbatim).
- [ ] **Step 2: Build the accordion** using native `<details>`/`<summary>` (keyboard + SR-free) styled to the Figma, OR a scripted accordion matching the toggle animation (reduced-motion honored). Rows: `Size` (renders `item.sizeChart` as a table), `Instructions` (`item.pdp.accordion.instructions`), `Research` (`item.pdp.accordion.research`). Desktop default-open per the Figma; mobile collapsed.
- [ ] **Step 3: Verify (both widths).** Build, check:links 0. Controller: accordion matches desktop `710:6353` + mobile `1088:15369`; Size row shows the correct size-chart table; keyboard-operable.
- [ ] **Step 4: Commit** (`feat(pdp): Product Details accordion (size chart / instructions / research)`).

---

### Task 4: 4 Column feature band

Figma: desktop `714:6430`, mobile `1017:9518`.

**Files:** Create `src/components/pdp/FourColumn.astro`. Modify `Pdp.astro` (insert after ProductDetails), `catalog.js` (`toe-spacers.pdp.features = [{ image, label, text } ×4]`, Figma-verbatim copy).

- [ ] **Step 1: Pull Figma design context** for `714:6430` (desktop) + `1017:9518` (mobile). Yellow band, heading (e.g. "Toe Spacer Features"), 4 columns each = image + label + blurb. Mobile: stack/1-col per the design.
- [ ] **Step 2: Build `FourColumn.astro`** — prop `{ heading, columns }` (from `item.pdp.features`); responsive 4-col → mobile stack; tokens. Placeholder images.
- [ ] **Step 3:** Render in `Pdp.astro` after ProductDetails, `data-reveal`. Add `item.pdp.featuresHeading` + `features` for Toe Spacers.
- [ ] **Step 4: Verify (both widths)** — build, check:links 0, controller Figma pass desktop `714:6430` + mobile `1017:9518`.
- [ ] **Step 5: Commit** (`feat(pdp): 4-column product feature band`).

---

### Task 5: Brand Section band

Figma: `1046:19633`.

**Files:** Create `src/components/pdp/BrandSection.astro`. Modify `Pdp.astro` (insert after FourColumn), `catalog.js` (`pdpBrand = { tagline, logo }` shared constant).

- [ ] **Step 1: Pull Figma design context** for `1046:19633`. Teal band, Gait Happens logo + tagline ("We're a female-led group of clinicians out to change the world one human sole at a time." — Figma-verbatim). Confirm whether the mobile product frames include it (Toe Spacers mobile omits it — decide: render on both, or hide on mobile per the design).
- [ ] **Step 2: Build `BrandSection.astro`** — prop `{ tagline }` (default from `pdpBrand`); teal band, centered logo + tagline, tokens; responsive per the design (incl. the mobile-visibility decision from Step 1).
- [ ] **Step 3:** Render in `Pdp.astro` after FourColumn, `data-reveal`.
- [ ] **Step 4: Verify (both widths)** — build, check:links 0, controller Figma pass.
- [ ] **Step 5: Commit** (`feat(pdp): brand-statement band`).

---

### Task 6: PDP Reviews placeholder

Figma: desktop `706:7675` (Frame 4292, "Reviews Plugin Here"), mobile `1017:9520`.

**Files:** Create `src/components/pdp/PdpReviews.astro`. Modify `Pdp.astro` (insert between CrossSell and LogoWall, matching the Figma order: … CrossSell? — CONFIRM order: desktop stack is Product Details → 4 Column → Brand → Product Cards(cross-sell) → Reviews → Logo Wall). Insert Reviews after CrossSell. `catalog.js` (`toe-spacers.pdp.reviews = { rating, count, distribution }`, Figma-verbatim numbers).

- [ ] **Step 1: Pull Figma design context** for `706:7675` (desktop) + `1017:9520` (mobile). "Customer Reviews" — average rating + count (`4.75 out of 5 · 12 reviews`), a star-distribution bar chart (5→1 rows with proportional bars), review badges/verified. Static placeholder for the Shopify reviews app.
- [ ] **Step 2: Build `PdpReviews.astro`** — prop `{ reviews }`; rating summary + distribution bars + badges, tokens, responsive. Clearly a static placeholder (the dev team drops the live widget here — a short HTML comment noting that).
- [ ] **Step 3:** Render in `Pdp.astro` in the correct stack position (after cross-sell, before logo wall — per the confirmed Figma order), `data-reveal`.
- [ ] **Step 4: Verify (both widths)** — build, check:links 0, controller Figma pass desktop `706:7675` + mobile `1017:9520`.
- [ ] **Step 5: Commit** (`feat(pdp): customer-reviews placeholder section`).

---

### Task 7: Roll out the remaining products + final verification

Replicate the pilot across the other products (data only — the components are done) and verify all built PDPs. Walk is DEFERRED (needs Testimonial + Your Instructors from the course chunk).

**Files:** Create `src/pages/products/{foot-health-kit,cork-supplement,toe-strengtheners,toe-dynamometer,mobility-ball}.astro`. Modify `src/data/catalog.js` (a `pdp` block for each of those 5 — Figma-verbatim content per each product's own PDP frame), `src/data/sitemap.js` (flip those 5 routes to `built`).

Per-product Figma desktop / mobile frames: Foot Health Kit `719:6542` / `1017:9522`; Cork Supplement `721:7029` / `1017:9529`; Toe Strengtheners `721:7222` / `1017:9536`; Toe Dynamometer `721:8349` / `1017:9543`; Mobility Ball `721:8729` / (mobile per `1017:9550`, labeled "Toe Dynamometer Mobile" — confirm the correct Mobility Ball mobile frame). Walk `721:7417` / `1017:9557` — **deferred**.

- [ ] **Step 1: Add a `pdp` block for each of the 5 products** in `catalog.js`, pulling each product's own PDP frame content (gallery/priceExact/description/bullets/accordion/features/reviews/crossSell — Figma-verbatim where real). Products are "roughly all the same" structure; copy differs. (Note any that omit a section, e.g. Cork Supplement desktop has no accordion Frame-4383 on mobile — match each product's actual section set.)
- [ ] **Step 2: Create the 5 page files** (`BaseLayout` + `<Pdp item={getItem(<handle>)} />`) and flip the 5 routes to `built`.
- [ ] **Step 3 (optional integrity test):** in `tests/catalog.test.mjs`, assert every product whose route is `built` has a `pdp` block with the fields the components require (guards a half-populated rollout).
- [ ] **Step 4: Full verification.** `npm run build` (page count unchanged, all 6 built product routes explicit, no collision), `npm run check:links` = 0 broken, `npm test` green. Controller both-widths browser pass across the 6 built products; Add to Cart works on each; Walk remains a placeholder.
- [ ] **Step 5: Commit** (`feat(pdp): roll out product PDPs (5 products); walk deferred`).

---

## Self-Review — spec coverage

- §2 sections 1–6 → Tasks 2–3 (Product Details), 4 (4 Column), 5 (Brand), 6 (Reviews), 1 (CrossSell + LogoWall reuse). ✓
- §3 architecture (Pdp composer, `pdp` data, `/products` routes, reuse) → Task 1 + each section task. ✓
- §4 cart integration (Add to Cart → `cart.addLine` → drawer) → Task 2 Step 3. ✓
- §5 motion/a11y (gallery swap, accordion, reveal, reduced-motion, responsive) → Tasks 2/3 + Global Constraints. ✓
- §6 verification (build/links/tests + both-widths Figma pass) → every task Step "Verify". ✓
- §7 open items: Walk deferred (Global Constraints + Task 7); accordion/brand/reviews content Figma-verbatim (per-task Step 1); gallery images placeholder (Global Constraints). ✓
- Fidelity workflow (per-section desktop+mobile `get_design_context` + both-widths verify) → Global Constraints + every section task Step 1 + Verify. ✓

Type/name consistency: `Pdp.astro` prop `{ item }`; `item.pdp.{crossSell,gallery,priceExact,description,bullets,accordion,features,featuresHeading,reviews}`; `pdpBrand` shared; section components `ProductDetails`/`FourColumn`/`BrandSection`/`PdpReviews`; Add-to-Cart via `cart.addLine` (existing signature) — used consistently across tasks. Exact per-section pixel specs are intentionally pulled from each task's `get_design_context` at build time (the spec's fidelity workflow), not embedded here — the Figma node ids per task are the concrete requirement.
