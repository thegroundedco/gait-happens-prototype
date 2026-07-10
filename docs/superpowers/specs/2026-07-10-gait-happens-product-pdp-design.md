# Gait Happens Product PDP — Design (PDP Chunk 1)

**Date:** 2026-07-10
**Project:** Gait Happens Web Migration (Phase 2) — Product Detail Pages, chunk 1 of the PDP effort
**Repo:** `…\04_Website\00_Claude` (branch TBD at implementation; off `master`)
**Figma (Product PDPs):** file `FX7PDNvhZwyozODaq8Q8i7` — desktop section `705:5988`, mobile section `1017:9514`.

---

## 1. Purpose & scope

Build the **Product PDP** — the detail page for the 7 physical products (Toe Spacers, The Foot Health Kit, Cork Supplement, Toe Strengtheners, Toe Dynamometer, Mobility Ball, Walk). This is the first chunk of the larger PDP effort; the Professional and Individual **course** PDPs are later chunks that will reuse the section-library pattern and several of the same sections.

**Approach (agreed in brainstorming):**
- PDPs are **composed from a section library** (like the PLP): section components in `src/components/pdp/`, assembled by a `Pdp.astro` composer, fed per-item data from `catalog.js`.
- **Fidelity workflow, per section:** pull the section's **desktop AND mobile** `get_design_context` from Figma → build ONE responsive component → verify it at **both** widths against the Figma screenshot → review. One section at a time; this granularity is the mechanism for not missing small details.
- **Content:** use the Figma's **real text verbatim** where it exists (titles, prices, descriptions, benefit bullets, feature copy, brand tagline, accordion Instructions/Research, review counts); placeholder only where the Figma itself is sample/Lorem. **Images are placeholder** for now (reuse existing `public/images/*` where a product already has one; otherwise a placeholder).
- **Responsive:** each section built responsive from its desktop (1200/1440) + mobile (390) Figma frames.

**In scope (this chunk)**
- 6 product-PDP sections (below), a `Pdp.astro` composer, per-product PDP data in `catalog.js`, explicit `/products/<handle>` pages for all 7 (flipped `built`), and a working **Add to Cart** wired to the existing `cart.js`.

**Out of scope (later chunks)**
- Course PDPs (professional + individual) and their course-only sections (Course Details/Overview, Your Instructors, Comparison Chart, Three Column Info, etc.).
- Real product photography, real review data, real Shopify buy-button / reviews-app wiring (we build faithful static placeholders the dev team swaps for Shopify).
- The paused individual course.

**Success criteria**
- Each of the 7 product routes renders its PDP from data, faithful to the Figma at desktop and mobile.
- Add to Cart adds the correct line (variant + qty) via `cart.js` and opens the cart drawer.
- `npm run build` 39→ (routes flip from placeholder to built, page count unchanged), `check:links` 0 broken, tests green.

## 2. The 6 sections (Toe Spacers reference — `706:7665` desktop / `1017:9515` mobile)

Top → bottom. Figma instance node ids given per section for the plan to pull `get_design_context` (desktop / mobile).

1. **Product Details** — `710:6353` / `1017:9517`. The hero + buy box, the substantial section:
   - **Left column:** breadcrumb; product **title**; **StarRating** (reuse) + count; **price** (`$28.00 USD`); **variant selector** (Size pills S/M/L, from `item.variants`); **quantity stepper**; **Add to Cart** (yellow CTA); short **description**; **benefit bullets** (list). Then a collapsible **accordion**: `Size` (renders the item's `sizeChart` table), `Instructions`, `Research` (content per product; Figma-verbatim where real). On desktop the Figma shows the accordion rows expanded; on mobile they collapse (the "Question" items, `1088:15369`).
   - **Right column:** **image gallery** — a main image + a thumbnail strip; clicking a thumbnail swaps the main (client JS). Placeholder images.
   - **Add to Cart** calls `cart.addLine({ id, title, variant, price, qty, image, href })` and opens the drawer (same contract the Quick-Add modal uses).
   - Mobile: single column, buy box then gallery then accordion, per `1017:9517`/`1088:15369`.
2. **4 Column** — `714:6430` / `1017:9518`. Yellow band, a heading ("Toe Spacer Features") + 4 columns, each = image + label + short blurb. Mobile: the 4 stack (or 1-col), per `1017:9518`.
3. **Brand Section** — `1046:19633`. Teal band: Gait Happens logo + tagline ("We're a female-led group of clinicians out to change the world one human sole at a time."). Shared/near-identical across products → a mostly-static component (tagline may vary; confirm per product at build). Some mobile frames omit it — reconcile from the mobile design context per product.
4. **Product Cards (cross-sell)** — `1143:16665` / `1046:11084`. "More Resources for Your Movement Journey" — 3 item cards + a teal Shop All card. This IS the existing **`CrossSell.astro`** pattern (yellow band, 3 cards + teal Shop All, white arrows, bottom-left labels — already Figma-matched). **Reuse `CrossSell`**; feed it a per-product `crossSell` from `catalog.js`. Confirm the PDP variant matches CrossSell exactly (heading text differs).
5. **Reviews** — `706:7675` (Frame 4292, "Reviews Plugin Here") / `1017:9520`. A **static placeholder** for the Shopify reviews app: "Customer Reviews", an average rating + count (`4.75 out of 5 · 12 reviews`), a star-distribution bar chart, and review badges. Built faithful to the design, clearly a placeholder (the dev team drops the real widget here).
6. **Logo Wall** — reuse the existing `LogoWall.astro` ("As Seen In" + `pressLogos`).

**Per-product variation:** products are "roughly all the same" (same 6 sections). **Walk** is the exception — it swaps in a **Testimonial** + **Your Instructors** section (it's a book). Handle Walk's extra sections either in this chunk (if the sections are simple) or defer Walk to the course chunk where Testimonial/Your Instructors get built — decided at plan time (flag: don't silently ship an incomplete Walk).

## 3. Architecture / file structure

```
src/components/pdp/
  Pdp.astro            composes a PDP from an ordered section list (like Plp.astro)
  ProductDetails.astro hero: gallery + buy box + accordion; Add to Cart -> cart.js
  Gallery.astro        (if extracted) main image + thumbnail strip + swap JS
  FourColumn.astro     yellow feature band (heading + 4 image/label/text cols)
  BrandSection.astro   teal brand-statement band (logo + tagline)
  PdpReviews.astro     static Customer Reviews placeholder (rating + distribution + badges)
  PdpAccordion.astro   (if extracted) collapsible Size/Instructions/Research
  reuse: components/plp/CrossSell.astro, components/plp/LogoWall.astro, StarRating.astro
src/pages/products/
  toe-spacers.astro  foot-health-kit.astro  cork-supplement.astro
  toe-strengtheners.astro  toe-dynamometer.astro  mobility-ball.astro  walk.astro
```
Modified: `src/data/catalog.js` (per-product PDP content + a shared brand block), `src/data/sitemap.js` (flip the 7 `/products/*` routes to `built`), `src/pages/[...slug].astro` already generates only placeholders (no collision).

**Data model** — extend each product item with a `pdp` block, e.g.:
```js
pdp: {
  gallery: ['/images/pdp/<handle>-1.jpg', ...],   // placeholder
  priceExact: '$28.00 USD',                        // PDP shows cents
  bullets: ['Support alignment of the toes…', ...],// Figma-verbatim
  accordion: { instructions: '…', research: '…' }, // sizeChart already on item
  features: [{ image, label, text }, x4],          // 4 Column, Figma-verbatim copy
  reviews: { rating: 4.75, count: 12, distribution: [.., .., ..] },
  crossSell: { heading, itemIds:[3], shopAllHref }, // feeds CrossSell
}
```
Brand Section tagline lives in a shared constant (per-product override only if the Figma differs). Exact shape finalized in the plan against the real Figma content.

## 4. Cart integration

The buy box's **Add to Cart** reuses `src/scripts/cart.js` — `addLine({ id, title, variant: chosenSize ?? null, price: item.price ?? item.priceRange, qty, image, href })`, then opens the cart drawer via the existing `[data-util="cart"]` click (same decoupled pattern as the Quick-Add modal). The variant pills + qty stepper drive the line. No cart changes needed.

## 5. Motion & a11y

- Gallery thumbnail → main swap: client JS, keyboard-operable (thumbnails are buttons), `astro:after-swap`-safe + leak-free init (the project pattern). Reduced-motion: no cross-fade, instant swap.
- Accordion: native `<details>`/`<summary>` (keyboard + SR free), or a scripted accordion matching the Figma; `prefers-reduced-motion` honored on any expand animation.
- Variant pills = real buttons with `aria-pressed`; qty stepper buttons have `aria-label`s; Add to Cart announces via the cart drawer (existing).
- Section reveal-on-scroll via the existing `[data-reveal]` utility.
- Responsive: each section correct at 390 (mobile), the container breakpoints (768/1024/1200), and 1440 — verified against the mobile + desktop Figma.

## 6. Verification

- **Per section:** built section verified against the Figma screenshot at desktop AND mobile before moving on (the fidelity gate).
- **Per product route:** renders from data, Add to Cart works (adds line + opens drawer), links resolve.
- `npm run build` (page count unchanged — the 7 routes were already generated as placeholders; now explicit), `npm run check:links` = 0 broken (PDP → cross-sell/collections resolve), `npm test` green (+ a catalog-integrity assertion that every product has a `pdp` block if the plan adds one).
- A real-browser pass per product (desktop + mobile widths) as the controller checkpoint.

## 7. Open items / assumptions

- **Walk variant** (Testimonial + Your Instructors) — build now vs defer to the course chunk (decided at plan time; must not ship an incomplete Walk silently).
- **Accordion content** (Instructions/Research) — Figma-verbatim where present; placeholder where sample. Confirm per product.
- **Brand Section** — assume one shared tagline unless the Figma differs per product.
- **Reviews** numbers/badges — Figma-verbatim as static placeholder; the live widget is the dev team's Shopify app.
- **Gallery images** — placeholder; reuse existing product images where available (e.g. `walk`, PLP `/images/plp/*`), else placeholder. Real photography before launch.
- Exact per-section spacing/type/color come from each section's `get_design_context` at build (not invented here) — the fidelity workflow.
