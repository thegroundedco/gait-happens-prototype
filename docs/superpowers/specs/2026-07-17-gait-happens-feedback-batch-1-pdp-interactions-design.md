# Gait Happens — Feedback Batch 1, Chunk 4: PDP interactions — design

**Date:** 2026-07-17
**Project:** Gait Happens Web Migration (Phase 2) — client feedback on nav / PLPs / product PDPs
**Repo:** `…\04_Website\00_Claude`; branch off `master` (@ `ff70ce2`). GitHub `thegroundedco/gait-happens-web` (private).
**Figma:** file `FX7PDNvhZwyozODaq8Q8i7`. Brand-section swash node `1046:19567` (decorative layer `1046:19285`).

> Batch roadmap + locked decisions live in `docs/superpowers/specs/2026-07-15-gait-happens-feedback-batch-1-nav-design.md` §0. Chunks 1 (nav), 2 (logo wall), 3a (PLP quick wins), 3b (quick-add modal) are merged. This is **Chunk 4** (PDP interactions). Chunk 5 (Walk cross-sell + instructor photos) follows.

---

## 1. Purpose & scope

Four self-contained PDP polish items, all on existing components, all **pure CSS hover/state changes plus one exported decorative asset** — no JavaScript logic, no data, no interaction-model changes:

1. **Size-pill hover** — the product buy-box size pills gain a hover state (solid teal fill + white text), which they lack today.
2. **Accordion hover + persist-when-open** — the Product Details accordion summary bar fills solid teal (white label + white +/− icon) on hover, and **stays teal while the row is open**.
3. **Add-to-Cart yellow-on-hover** — the Add-to-Cart button stays teal by default and turns yellow (with near-black text) on hover.
4. **Brand-section swash** — the flat-teal brand band gains its Figma decorative footprint/wave background behind the logo + tagline.

**The shared "hover" (items 1 + 2)** is a solid teal fill + white text/icon — chosen by the user over a soft tint. For size pills this is the same look as the selected (`aria-pressed="true"`) state, i.e. hovering an unselected pill previews the selected appearance; this is accepted. Hover is visual-only (no `aria-pressed` change), so the accessible selection state stays accurate.

**Out of scope**
- The quick-add **modal** pills (Chunk 3b) and the **course-PDP** pills / Add-to-Cart / accordion-on-teal band — those belong to their own batches. Flagged for a later consistency pass; not touched here.
- Any content, data, layout, or JS behavior change.

**Success criteria**
- Hovering a size pill fills it solid teal with white text; the real selection (aria-pressed) is unchanged.
- Hovering an accordion row's summary fills it solid teal (white label + icon); an **open** row keeps that solid-teal summary, with its expanded body content still on white and readable.
- The Add-to-Cart button is teal by default and yellow + near-black text on hover.
- The brand band shows the Figma swash behind the logo + tagline, desktop-only, with the content fully legible on top.
- Build clean, `check:links` 0 broken, tests unchanged (28), the existing product/course PDPs otherwise unchanged, and a live browser hover pass on a product PDP.

## 2. Current state (from the code)

- **`src/components/pdp/ProductDetails.astro`**
  - Size pills `.pdp-details__pill`: `border: 1px solid var(--color-teal); background: var(--color-paper); color: var(--color-teal)`, with a `transition: background …, color …` already declared. `[aria-pressed="true"]` → `background: var(--color-teal); color: var(--color-paper)`. **No `:hover` rule.**
  - Add-to-Cart `.pdp-details__add`: `background: var(--color-teal); color: var(--color-paper)`, `transition: transform …`, `:hover { transform: translateY(-2px) }`. The reduced-motion query already nulls that lift. **No color change on hover.** (The file header comment notes the button is deliberately teal, "not yellow" — that documents the *default*; this chunk adds the *hover* color only.)
- **`src/components/pdp/PdpAccordion.astro`**
  - `.pdp-accordion__row`: `border: 1px solid var(--color-teal); padding: var(--space-4) var(--space-6); display: flex; flex-direction: column; gap: var(--space-5)`.
  - `.pdp-accordion__summary`: teal text (`color: var(--color-teal)`), no padding of its own, no `:hover`, no background.
  - `.pdp-accordion__icon`: teal `+`, flips to `−` when `.pdp-accordion__row[open]`.
  - `.pdp-accordion__body`: no padding of its own (the row's padding provides the inset).
  - A `variant="onTeal"` modifier (`.pdp-accordion--on-teal …`) restyles the component for the **course FAQ band** (white borders, white summary text, white icon, `.pdp-accordion__row` padding `var(--space-5) var(--space-6)`), on a teal section background. This variant is course-PDP territory and must keep its current appearance byte-for-byte.
- **`src/components/pdp/BrandSection.astro`**
  - Full-bleed `.brand-section { background: var(--color-teal) }` with a centered white logo trio + `--type-display` white tagline. No `position`/`overflow`. Hidden below 1024px (`@media (max-width: 1023px) { .brand-section { display: none } }`).
- **Tokens** (`src/styles/tokens.css`): `--color-teal #047791`, `--color-yellow #FEC745`, `--color-paper #FFFFFF`, `--color-ink #231F20`. Motion tokens `--motion-fast` / `--ease-standard` are used throughout.

## 3. Design

All colours come from tokens. No new tokens. Additive CSS wherever possible; the one structural change (accordion padding) is behavior-preserving for both variants.

### 3.1 Size-pill hover (`ProductDetails.astro`)

Add a hover rule to `.pdp-details__pill`, reusing the bg+color transition already declared on the pill:

```css
.pdp-details__pill:hover {
  background: var(--color-teal);
  color: var(--color-paper);
}
```

- Visual-only; no `aria-pressed` change, so screen-reader selection stays accurate.
- Matches the selected-state look (accepted "preview the selection" feel).
- Reduced-motion unaffected (a colour transition, not motion).

### 3.2 Accordion hover + persist-when-open (`PdpAccordion.astro`, product/default variant)

**Intent:** the summary header bar fills **solid teal** (white label + white `+`/`−` icon) on hover, and **stays filled while the row is open**; the expanded body remains on white below it so its ink copy stays readable.

**Fill selectors** (add):
```css
.pdp-accordion__summary:hover,
.pdp-accordion__row[open] > .pdp-accordion__summary {
  background: var(--color-teal);
  color: var(--color-paper);
}
.pdp-accordion__summary:hover .pdp-accordion__icon,
.pdp-accordion__row[open] > .pdp-accordion__summary .pdp-accordion__icon {
  color: var(--color-paper);
}
```
Add a `transition: background …, color …` (`--motion-fast` / `--ease-standard`) to `.pdp-accordion__summary` so the fill eases in (reduced-motion: a colour change, not motion — no guard needed).

**These fill rules are intentionally unscoped and are inert no-ops on the `onTeal` variant:** the onTeal summary is already white text with a transparent background sitting on the teal band, so `background: var(--color-teal)` (teal on teal) + `color: var(--color-paper)` (already white) produce no visible change there. No `:not(.pdp-accordion--on-teal)` scoping is required for the *fill*.

**Padding restructure so the teal fill reaches the box edges.** Today the row carries the padding and the summary has none, so a summary background would float inside the bordered box (white strip at the bottom when closed). Move the inset from the row onto the summary and body so the summary fills the bordered box edge-to-edge:

- `.pdp-accordion__row` padding → `0` (keep the border + the `gap: var(--space-5)` between summary and body).
- `.pdp-accordion__summary` → `padding: var(--space-4) var(--space-6)` (so, closed, the padded summary fills the whole box; hover/open fills it teal to all four inner edges).
- `.pdp-accordion__body` → `padding: 0 var(--space-6) var(--space-4)` (left/right/bottom inset; the top gap is still the row flex `gap`).

This reproduces the current product-accordion spacing exactly (verify by diffing a built product PDP's accordion markup/computed box — closed and open — before/after).

**Preserve the `onTeal` variant.** Because the base row padding moves to summary/body, the onTeal override that sets `.pdp-accordion--on-teal .pdp-accordion__row { padding: var(--space-5) var(--space-6) }` must move to the same summary/body scheme (`.pdp-accordion--on-teal .pdp-accordion__summary { padding: var(--space-5) var(--space-6) }` + the matching body inset) so the **course FAQ band renders byte-for-byte unchanged**. This is a behavior-preserving adjustment of a shared component, not a course-PDP feature change; prove it with a before/after diff of a built course PDP's FAQ section.

### 3.3 Add-to-Cart yellow-on-hover (`ProductDetails.astro`)

Default stays teal + white. On hover, swap to yellow background + ink (near-black) text, and keep the existing lift:

```css
.pdp-details__add {
  /* …existing (teal bg, white text)… */
  transition:
    transform var(--motion-fast) var(--ease-standard),
    background var(--motion-fast) var(--ease-standard),
    color var(--motion-fast) var(--ease-standard);
}
.pdp-details__add:hover {
  transform: translateY(-2px);
  background: var(--color-yellow);
  color: var(--color-ink);
}
```

- **Ink-on-yellow, not white-on-yellow** — deliberately (white-on-`--color-yellow` is ~1.56:1 and fails AA; ink-on-yellow passes). This matches the "yellow/black" feedback.
- The existing `@media (prefers-reduced-motion: reduce) { .pdp-details__add:hover { transform: none } }` guard stays; the colour swap is not motion and stays under reduced-motion.

### 3.4 Brand-section swash (`BrandSection.astro`)

Add the Figma decorative footprint/wave layer behind the logo + tagline.

- **Asset:** export the swash decoration (Figma node `1046:19285` inside `1046:19567`) as **SVG** → `public/images/pdp/brand-swash.svg` (crisp at any width, tiny). **Fallback:** if the SVG export is a large embedded-raster blob, export PNG at 2× instead and note it. The swash is subtle tonal-teal shapes (a large sole/footprint silhouette + curved waves) on the `#047791` band.
- **Placement:** `.brand-section` gets `position: relative; overflow: hidden`. The swash is an absolutely-positioned, decorative layer covering the band and clipped by the overflow — either an `<img … alt="" aria-hidden="true">` or a `::before` with `background-image`. It sits **behind** the content: give `.brand-section__pad` (or the logo + tagline) `position: relative; z-index: 1`. Cover the band (`inset: 0; width: 100%; height: 100%; object-fit: cover` for the img, or `background-size: cover`), positioned to match the Figma composition (the heavier shapes read toward the left; center via `object-position`/`background-position` as needed to match the frame).
- **Desktop-only:** the band is already hidden below 1024px, so the swash inherits that — no extra breakpoint work; do not render/paint it on mobile.
- **Legibility:** the white logo + tagline must stay fully legible over the swash (the Figma swash is a low-contrast tonal treatment, so this holds; confirm in the live pass).

## 4. Accessibility

- **Hover is visual-only.** No `aria-pressed`/`aria-expanded` semantics change on hover for pills or accordion; the accordion's open/closed semantics remain the native `<details>`/`<summary>` behavior.
- **Contrast:** white text on solid teal (pills/accordion fill) and ink text on yellow (Add-to-Cart hover) both pass AA. The default teal Add-to-Cart with white text is unchanged.
- **The swash is decorative** — `aria-hidden`/empty `alt`, not announced; it must not reduce logo/tagline contrast below AA.
- **Reduced-motion:** the added transitions are colour/background (not motion); the only motion (the Add-to-Cart `translateY` lift) keeps its existing reduced-motion guard.
- Keyboard: the accordion summary is reachable/operable as today (native `<details>`); the teal fill applies on `:hover` (pointer) and on `[open]` (any activation, incl. keyboard) — an open row shows the persisted fill regardless of how it was opened.

## 5. Verification

- **Build/tests/links:** `npm run build` (41 pages), `npm run check:links` 0 broken, `npm test` (28 — unchanged; these are pure CSS/markup changes with no unit-testable logic; the catalog/sitemap tests already cover the data).
- **Regression (behavior-preserving):** diff a built **product** PDP's accordion (e.g. `dist/products/toe-spacers/index.html`) and a built **course** PDP's FAQ section (e.g. `dist/courses/sole-switch-pro/index.html`) before/after — the accordion padding restructure must leave both variants' rendered spacing unchanged; only the added hover/`[open]` fill rules are new.
- **Live browser pass** (controller, both widths) on a product PDP: (a) hover a size pill → solid teal fill + white text, real selection unchanged; (b) hover an accordion row → teal summary bar, white label + icon; open a row → summary stays teal, body readable on white; (c) hover Add-to-Cart → yellow bg + near-black text + lift; (d) the brand band shows the swash behind the legible logo + tagline (desktop), and the band is absent on mobile.

## 6. Out of scope / flagged

- **Consistency pass (later):** the quick-add modal pills (Chunk 3b), course-PDP course-type pills, course Add-to-Cart/Enroll, and the accordion `onTeal` course-FAQ band do **not** get these hover states in this chunk. Worth unifying when the course-PDP feedback batch runs.
- The Add-to-Cart hover colour resolves the project-wide white-on-yellow contrast note **for this button only**; the yellow course card + testimonial star contrast issues logged elsewhere are separate design calls, untouched here.
