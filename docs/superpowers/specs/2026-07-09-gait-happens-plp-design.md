# Gait Happens PLP Buildout — Design

**Date:** 2026-07-09
**Project:** Gait Happens Web Migration (Phase 2) — first page buildout on top of the foundation
**Repo:** `…\04_Website\00_Claude` (on `master`; foundation merged at 84d7539)
**Status:** Design approved — pending spec review
**Figma:** PLP section `FX7PDNvhZwyozODaq8Q8i7` node `764-10786`

---

## 1. Purpose & scope

Build out the Product/Course **Listing Pages** — promoting the 6 PLP routes from placeholders to real, data-driven pages, plus a working Quick-Add-to-Cart flow with a persistent client-side cart. This is the first real page template built on the foundation and establishes the catalog data model, the card/grid components, and the cart that later PDP work will reuse.

**In scope (this slice)**
- A catalog data model (`src/data/catalog.js`) driving all cards.
- PLP template + components (title band, filter/sort bar, card, grid, intro/promo cells, pagination, cross-sell, logo wall).
- The 6 PLP routes built out (4 layouts) and flipped to `status: 'built'`.
- The **Quick-Add-to-Cart modal** (variant/size selector, quantity stepper, size chart, Add to Cart).
- A **persistent client-side cart** (localStorage): line items in the cart drawer, subtotal, remove, header cart-count badge; survives page navigation.
- Real card imagery exported from the Figma PDP/course frames.

**Out of scope (later slices)**
- Interactive filter/sort logic (the controls render but are static/visual).
- Real Shopify cart / checkout (the dev team wires Shopify's AJAX cart).
- PDP page buildouts (still placeholders; PLP cards link to them).
- Real per-review content, real pagination beyond "Page 1 of 1".

**Fidelity:** faithful-but-pragmatic, matching the Figma PLP frames.

## 2. Global constraints (carry the foundation's)

- Tokens govern color/type/spacing; component-intrinsic structural px may be literal.
- `src/data/*` are the single source of truth — no hardcoded catalog/route data in components.
- Every internal link resolves (`check:links` stays at 0 broken; new PLP↔PDP↔cross-sell links included).
- Client JS binds/inits on the initial load AND on `astro:after-swap` (never solely `astro:page-load`); document-level listeners bound once; no listener leaks. (This is the pattern established in `Header.astro`/`motion.js`.)
- Motion respects `prefers-reduced-motion`.
- Commit per task, conventional messages.

## 3. Catalog data model → `src/data/catalog.js`

**Items** (products + courses):
```js
{
  id, handle,
  title,                         // "Foot Fest"
  kind: 'product' | 'course',
  badges: ['Course', 'Product'], // yellow pills shown on the card
  price: '$45 USD' | null,
  priceRange: '$147–897 USD' | null,
  rating: 5, reviewCount: 15,    // stars + "(15)"; omit if none
  description,                   // short blurb on the card
  image: '/images/plp/<handle>.jpg',
  href,                          // links to the item's PDP route (existing placeholder)
  cta: 'View Course' | 'View Product',
  variants: { label: 'Size', options: ['Small','Medium','Large'] } | null,
  sizeChart: { columns: [...], rows: [...] } | null,
}
```
Items derive from existing sitemap routes: products (Toe Spacers, The Foot Health Kit, Cork Supplement, Toe Strengtheners, Toe Dynamometer, WALK) and courses (Foot Fest, Sole Switch, Combating Bunions, Fit Feet, Virtual Consultations, Sole Switch Pro, Gait Foundations, Functional Gait Assessment L1, Gait Guru Membership, Trainer Certification). Content (prices/ratings/descriptions/badges) uses the Figma sample values.

**Collections** (keyed by route path):
```js
{
  '/collections/all':          { title, intro?, itemIds:[…products], crossSell },
  '/collections/best-sellers': { title, itemIds:[…subset], crossSell },
  '/collections/featured':     { title, itemIds:[…subset], crossSell },
  '/collections/courses-individuals':   { title, intro:{heading,body}, itemIds:[…], crossSell },
  '/collections/courses-professionals': { title, intro:{heading,body}, itemIds:[…], crossSell },
  '/collections/all-courses':  { title, grouped:[
        { persona:'Individuals',   intro:{heading,body}, itemIds:[…] },
        { persona:'Professionals', intro:{heading,body}, itemIds:[…] } ], crossSell },
}
```
- `intro` renders as the teal intro block embedded in the grid (first/among cells).
- `crossSell`: `{ heading:'Shop Our Products' | 'Shop Our Best Selling Courses' | 'Shop Our Best Selling Products', itemIds:[3], shopAllHref }` — courses pages cross-sell products; product/all-courses pages cross-sell courses/products per the Figma.
- Best-sellers / featured are subsets of the product set (flagged items).

**Also in data:** the "As Seen In" logo list (reuse if a logo-wall data source exists; otherwise a `pressLogos` array).

## 4. Routing

- The 6 PLP routes get **explicit page files**: `src/pages/collections/all.astro`, `best-sellers.astro`, `featured.astro`, `courses-individuals.astro`, `courses-professionals.astro`, `all-courses.astro`. Each renders the shared `<Plp>` component (§5), fed its collection looked up from `catalog.js` by pathname, wrapped in `BaseLayout`.
- In `sitemap.js`, these 6 routes flip to `status: 'built'`.
- `src/pages/[...slug].astro` (the placeholder generator) changes `getStaticPaths` to generate **only `status:'placeholder'`** routes — so the explicit PLP files don't collide with a generated route. (Verify: no duplicate-route build error.)
- `/_status` then shows the 6 as built.

## 5. Components

```
src/components/plp/
  PlpTitle.astro        teal centered page title band (from collection.title)
  FilterSortBar.astro   FILTER: Availability/Price  ·  SORT BY: Best Selling  ·  "N products" (static)
  PlpCard.astro         wide 2-up card: image (left) + detail (right): badges, title, price/range,
                        star rating + count, description, CTA button, compare checkbox, quick-add cart btn
  PlpGrid.astro         2-column grid; places IntroBlock/promo cells among cards per the layout
  IntroBlock.astro      teal content cell (heading + body) embedded in the grid
  PromoCard.astro       (if needed) label + Button cell variant seen in the Professionals grid
  Pagination.astro      static "Page 1 of 1"
  CrossSell.astro       yellow "Shop Our…" band: 3 small product cards + a teal Shop-All nav card
  LogoWall.astro        "As Seen In" press logos
  QuickAddModal.astro   dialog: title, price, image, variant/size pills, qty stepper, Add to Cart, size chart
  Plp.astro             composes: PlpTitle → FilterSortBar → PlpGrid (or grouped sections) → Pagination
                        → CrossSell → LogoWall; single QuickAddModal instance per page
```
Existing components updated: `CartDrawer.astro` (renders line items + subtotal + remove; empty state when 0) and `Header.astro` (cart-count badge on the cart icon).

**Star rating** is a small presentational component/snippet (filled/empty stars + "(N)").

## 6. Quick-Add + persistent cart

**`src/scripts/cart.js`** — framework-free cart module:
```
getCart(): { lines:[{ id, title, variant, price, qty, image, href }], count, subtotal }
addLine(line) · removeLine(key) · setQty(key, n) · clear()
```
- Persists to `localStorage` under a namespaced key.
- Dispatches a `cart:change` CustomEvent on every mutation.

**Flow:** a card's quick-add button carries the item's data (id) → clicking opens the single `QuickAddModal`, populated from `catalog` for that id (variant options, size chart, price, image) → choosing a variant/qty and Add to Cart calls `cart.addLine(...)` → the cart drawer opens showing the new line.

**UI wiring (in Header's init, following the load + after-swap pattern):**
- On each page init: read the cart from localStorage and render the `CartDrawer` line items + subtotal, and the header cart-count badge (hidden when 0).
- Listen once (module scope) for `cart:change` to re-render drawer + badge.
- The modal open/close integrates with the existing overlay logic (Esc/scrim close). The modal is a centered dialog with a scrim (distinct from the top-area dropdowns); it should be `inert` when closed.
- Add-to-cart persists across navigations because state lives in localStorage and re-hydrates on every page load.

**Checkout:** the cart drawer's primary button remains a placeholder (links to `/cart` or is labeled "Checkout" and inert) — real checkout is Shopify's.

## 7. Static / visual-only elements

- **Filter/sort:** dropdowns render (native `<select>` or styled), visually complete, but do not filter/sort. `"N products"` count is the collection's item count.
- **Pagination:** static "Page 1 of 1".
- **Compare checkbox** on each card: a visual toggle (checkbox state), non-functional.

## 8. Assets

Export each item's image from its Figma PDP/course frame (and reuse existing `public/images/nav/*` where an item already has an asset — e.g. WALK) into `public/images/plp/<handle>.(jpg|png)`, resized to a web-appropriate size (~800px, like the nav photos). Cross-sell + logo-wall imagery exported similarly (press logos as SVG/PNG).

## 9. Motion & a11y

- Section reveal-on-scroll via the existing `[data-reveal]` utility (PLP title, grid sections, cross-sell, logo wall).
- Card hover lift + CTA arrow nudge (CSS, tokens).
- Quick-Add modal: fade/scale in, scrim; `prefers-reduced-motion` disables; focus moves into the modal on open and returns to the trigger on close; `inert` when closed; Esc/scrim close.
- Star rating and badges have accessible text (e.g. `aria-label="Rated 5 out of 5, 15 reviews"`).

## 10. Verification

- `npm run build` (39 → 39 pages; the 6 PLP routes now real, not placeholder — page count unchanged).
- `npm run check:links` = 0 broken (PLP cards → PDP routes, cross-sell → collections/products, all resolve).
- `npm test` — extend sitemap tests if needed; add a small catalog-integrity test (every collection itemId resolves to an item; every item href resolves to a sitemap route).
- Real-browser pass: each PLP layout renders vs Figma; quick-add opens, variant/qty work, Add to Cart fills the drawer + badge, cart persists across a navigation, reduced-motion honored.

## 11. Open items / assumptions

- Card content uses Figma sample values (prices/ratings/descriptions) — to be replaced by Shopify data.
- The Figma "All Courses" grid shows a **"Functional Gait Assessment Level 2"** that has no route in the current sitemap. Default: build the catalog from existing routes (omit L2) and flag it — add an L2 course route + PDP placeholder if desired.
- Best-sellers / featured product subsets are a reasonable selection (flagged items) pending client direction.
- Press logos: use recognizable placeholder wordmarks unless the client provides official logos (licensing is the client's call).
