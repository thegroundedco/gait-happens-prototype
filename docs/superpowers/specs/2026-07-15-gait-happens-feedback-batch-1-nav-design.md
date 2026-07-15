# Gait Happens — Client Feedback Batch 1, Chunk 1: Shop mega-nav (design)

**Date:** 2026-07-15
**Project:** Gait Happens Web Migration (Phase 2) — client feedback on nav / PLPs / product PDPs
**Repo:** `…\04_Website\00_Claude`; branch off `master` (@ `39dafdb`). GitHub `thegroundedco/gait-happens-web` (private).
**Figma:** file `FX7PDNvhZwyozODaq8Q8i7` — "Updated Navigation" section `1217:1576`. **Shop panel desktop `1217:1577`, mobile `1217:1579`.**

---

## 0. Feedback-batch roadmap (context — the whole batch, so no chunk loses the thread)

A client feedback batch on **navigation, PLPs, and product PDPs** (course-PDP feedback is a *later* batch). It decomposes into **5 chunks**, run **one at a time** (spec → plan → subagent build → review → live browser pass → merge), same workflow as the course-PDP chunks. **This spec covers Chunk 1 only**; the rest get their own specs when reached.

1. **Nav — Shop mega-menu** (this spec).
2. **Logo wall + real logo assets** — export ~31 logos from the design-system component (file `B0fHmlEEm9OdOOnAbnmI8d`, node `183:439`), grouped **As Seen In / Trusted By / Sponsors**; rebuild `LogoWall.astro`. Shared by both PLPs and PDPs — fixes the "logo blocks" feedback on both surfaces at once. (Today `LogoWall` renders 7 placeholder *text* wordmarks from `pressLogos` in `catalog.js`.)
3. **PLP polish** — (a) intro-block heading → h3 (see §note); (b) whole PLP card clickable while keeping the quick-add cart button working; (c) quick-add modal fidelity to Figma node `1078:16015` + course-modal controls + the Foot Health Kit helper copy.
4. **PDP interactions** — accordion blue-hover-persists-when-open; size-pill hover; Add-to-Cart **yellow-on-hover** (default stays teal); brand-section footprint/swash background (Figma `1046:19567`).
5. **Walk cross-sell + instructor photos** — `CrossSell` `shop-products` variant: equal columns, fix hover overflow, Shop All bottom-left; + Dr. Conley / Dr. McDowell photos **exported from the Walk PDP Figma frame `721:7417`**.

**Decisions locked (2026-07-15):**
- Instructor photos → export from Figma `721:7417` (Chunk 5).
- **Foot Fest quick-add modal → DEFERRED to Chunk C** (bespoke multi-session "Add to Weekend" picker; Foot Fest PDP doesn't exist yet).
- **Add to Cart → yellow with black text ON HOVER**; default stays teal/white (matches the Figma quick-add modals showing teal buttons at rest) (Chunk 4).
- **Token-name note:** the feedback quotes Figma variable names `--text-on-brand` and `--text-h3` that **do not exist in this repo**. Repo equivalents: `--text-on-brand` → `--color-paper` (white); `--text-h3` → `--type-h3` (Montserrat 600 / 32px). The intro heading is already white `--color-paper`; it is currently `--type-h4` (24/500), so Chunk 3's real change is bumping it to `--type-h3` (32/600).

---

## 1. Purpose & scope (Chunk 1)

Rebuild the **Shop** mega-menu — desktop and mobile — to match Figma `1217:1577` / `1217:1579`. **No other menu changes.**

**In scope**
- Shop menu **data** in `src/data/sitemap.js`: replace the current three cards with four items — two **product photo cards** and two **collection "bar" buttons**.
- A new card **kind** so the panel can render a horizontal teal **bar** button (label left, arrow right) as well as the existing photo card, and lay the Shop panel out as *two photo cards + a stacked pair of bars*.
- **Mobile** Shop panel rebuilt to show the image cards + the two teal buttons (per Figma mobile), replacing today's plain-text link list.
- Nav card images for the two products, pulled from the Figma Shop panel crops.

**Out of scope**
- The Courses / More Resources / Contact mega menus (they must render **byte-identically** after this chunk — that is the regression gate).
- Chunks 2–5 above.

**Success criteria**
- Desktop Shop panel matches `1217:1577`: Foot Health Kit + Walk photo cards, then a right column of two stacked teal bars (Shop Best Sellers, Shop All Products), each with an arrow.
- Mobile Shop panel matches `1217:1579`: two stacked product cards, then the two teal buttons side-by-side.
- The other three mega menus and the mobile nav for them are unchanged (byte-diff).
- Build clean, `check:links` 0 broken (the new hrefs resolve to real routes), tests green.

## 2. Current state (from the code map)

- **`src/data/sitemap.js`** — `menus` array drives the nav. The `shop` menu is `{ id:'shop', type:'mega', style:'cards', cards:[…] }` with three cards: Shop Best Sellers (`/collections/best-sellers`, yellow, image), Featured Products (`/collections/featured`, yellow, image `contain`), Shop All (`/collections/all`, teal big-CTA).
- **`src/components/Header.astro`** renders top-nav buttons + one `<MegaMenu>` per mega menu; all open/close/pill logic is its co-located GSAP `<script>`. Panel height is fixed by `--mega-height: 440px`.
- **`src/components/MegaMenu.astro`** — `style:'cards'` renders a flex row of `<NavCard>`; `style:'bars'` (used by More Resources) renders a grid of bar links.
- **`src/components/NavCard.astro`** — `variant:'yellow'` = photo + small label + `arrow.svg`; `variant:'teal'` = no photo, big display label + `arrow-lg.svg`.
- **`src/components/MobileNav.astro`** — each mega menu becomes a native `<details>` accordion whose body is a `<ul>` of its `cards` as **plain `<a>` text links** (no images). Shown ≤820px.
- Nav images live in `public/images/nav/`. Product photos exist at `public/images/plp/foot-health-kit.jpg` and `…/walk.jpg`.

## 3. Design

### 3.1 Data — the new Shop cards

Replace the `shop` menu's `cards` with four entries. Introduce a card **`kind`** (default `'photo'` so existing cards are unaffected):

```js
{
  id: 'shop', label: 'Shop', type: 'mega', style: 'cards',
  cards: [
    { kind: 'photo', label: 'The Foot Health Kit', href: '/products/foot-health-kit', image: '/images/nav/shop-foot-health-kit.jpg', variant: 'yellow' },
    { kind: 'photo', label: 'Walk - One Step at a Time', href: '/products/walk', image: '/images/nav/shop-walk.jpg', variant: 'yellow' },
    { kind: 'bar', label: 'Shop Best Sellers', href: '/collections/best-sellers' },
    { kind: 'bar', label: 'Shop All Products', href: '/collections/all' },
  ],
}
```
Exact labels/crops come from the Figma at build (§5). The two `bar` cards carry no image.

**Card-kind contract** (so later menus can adopt it safely): `kind: 'photo'` = today's photo card (unchanged default). `kind: 'bar'` = a horizontal teal button, full width of its column, label left + arrow right — visually the teal counterpart of the existing More-Resources yellow bars.

### 3.2 Desktop panel layout

The Shop panel is a flex row of **three columns**: photo card, photo card, and a **stacked pair** of the two `bar` cards. The panel groups **consecutive trailing `bar` cards into one narrower flex column**; the photo cards each take an equal flex share to their left. Do this without a bespoke Shop-only branch if reasonable — a general "bars group into a right-hand stack" rule keyed off `kind` is fine, but it must be a **no-op for every menu that has no `bar` cards** (Courses/Resources/Contact), proven by byte-diff. Reuse `--mega-height`; the bar stack fills the column height, split into two equal bars with the panel's gap between them.

### 3.3 Mobile panel

Rebuild the Shop accordion body in `MobileNav.astro` to match `1217:1579`: the two `photo` cards stacked full-width (image + label, like the Figma), then the two `bar` cards **side-by-side** in a two-up row. Keep it driven by the same `cards` data. **Only the Shop menu's mobile body changes shape**; menus with no `bar` cards keep rendering their current text-link list (byte-diff).

### 3.4 Components

- **`NavCard.astro`** — add the `bar` rendering (or a small sibling `NavBar.astro` if that keeps `NavCard` focused — implementer's call, but a `bar` is a distinct enough shape that a sibling is reasonable). A `bar` is an `<a>` with the label and an arrow (`arrow.svg`), teal background, white text, full column width; hover state consistent with the existing nav cards.
- **`MegaMenu.astro`** — the grouping rule from §3.2.
- **`MobileNav.astro`** — the §3.3 layout.
- **`Header.astro`** — no logic change expected; if the panel grid needs a class hook, add it without touching the open/close/pill script.

### 3.5 Images

Export the two product nav crops from the Figma Shop panel (`1217:1577` children) and commit them under `public/images/nav/` (`shop-foot-health-kit.jpg`, `shop-walk.jpg`), following the existing nav-image convention. If the Figma crop is materially the same as the existing `public/images/plp/*.jpg`, reuse the plp image rather than committing a near-duplicate — decide at build against the actual crop.

## 4. Motion & a11y

- The Shop trigger keeps its existing open/close/hover/magic-pill behavior — **do not modify the Header GSAP script's logic.** The new bar cards are ordinary links inside the panel; the existing reveal/inert handling covers them.
- Bars are real `<a>` links (keyboard-focusable, in tab order when the panel is open, `inert` when closed — same as the photo cards today).
- Arrow glyphs are decorative (`aria-hidden`); the link's text is its accessible name.
- Reduced-motion: inherit the panel's existing guarding; add no new animation that isn't reduced-motion-safe.

## 5. Verification

- **Per side:** desktop Shop panel verified against `1217:1577`, mobile against `1217:1579`, at their real widths — the fidelity method (pull each card node's crop/label/arrow, build, compare).
- **Regression gate:** the Courses / More Resources / Contact desktop panels AND their mobile accordions render **byte-identically** after this chunk. Prove it (build before/after, diff those pages/fragments), since the card-kind and grouping changes touch shared components.
- `npm run build` clean; `npm run check:links` 0 broken (the four Shop hrefs — `/products/foot-health-kit`, `/products/walk`, `/collections/best-sellers`, `/collections/all` — all already exist as routes; confirm).
- `npm test` green (sitemap tests assert nav hrefs resolve; extend only if the card-kind needs a new assertion).
- **Live both-widths browser pass:** open the Shop menu on desktop and confirm the two photo cards + two stacked teal bars; shrink to mobile and confirm the two stacked cards + side-by-side buttons. Confirm the other three menus still open and look unchanged.

## 6. Open items

- Exact Figma labels/crops/arrow sizes come from `1217:1577` / `1217:1579` at build, not invented here.
- If the "bars group into a right column" rule can't be made a clean no-op for the other menus, fall back to a Shop-scoped layout class — but report that as a finding (it means the card model needs more thought before Chunk 2 reuses any of it).
- `--mega-height` (440px) may need revisiting if the Shop panel's natural height differs from the Figma; match the Figma, and if the shared height token no longer fits all panels, flag it rather than silently changing a value four menus depend on.
