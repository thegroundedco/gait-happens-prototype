# Gait Happens — Feedback Batch 1, Chunk 4: PDP interactions (implementation plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the four PDP interaction/polish items — size-pill hover, accordion teal-hover-that-persists-when-open, Add-to-Cart yellow-on-hover, and the brand-section decorative swash — to the existing PDP components.

**Architecture:** Pure CSS hover/state changes on three existing components plus one exported decorative asset. No JavaScript logic, no data, no markup-structure changes to the interactive surface. The one structural CSS change (accordion padding moves from the row onto the summary/body) is scoped to the product/default variant so the shared course-FAQ `onTeal` variant is provably untouched.

**Tech Stack:** Astro, hand-authored CSS from design-system tokens.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-17-gait-happens-feedback-batch-1-pdp-interactions-design.md`.
- **Tokens only, no new tokens.** `--color-teal #047791`, `--color-yellow #FEC745`, `--color-paper #FFFFFF`, `--color-ink #231F20`; motion `--motion-fast` / `--ease-standard`; spacing `--space-2` (8px) / `--space-4` (16px) / `--space-6` (32px).
- **The shared hover is a SOLID teal fill + white text/icon** (user-chosen). For size pills this matches the selected look; hover is **visual-only** — no `aria-pressed`/`aria-expanded` change.
- **Add-to-Cart hover uses INK text on yellow, never white** (white-on-yellow fails AA; ink-on-yellow passes). Keep the existing `translateY(-2px)` lift and its reduced-motion guard.
- **No JS logic, no data, no interaction-model change.** Only `src/components/pdp/ProductDetails.astro`, `src/components/pdp/PdpAccordion.astro`, `src/components/pdp/BrandSection.astro`, and one new asset under `public/images/pdp/` may change. `catalog.js`, `cart.js`, `Pdp.astro`, and all other components are untouched.
- **The course-FAQ `onTeal` accordion variant must render byte-for-byte unchanged** — all Chunk-4 accordion rules are scoped to `.pdp-accordion:not(.pdp-accordion--on-teal)`, and the existing `.pdp-accordion--on-teal …` rules are not edited.
- **The brand swash is decorative** — `aria-hidden`/empty `alt`, desktop-only (the band is already hidden below 1024px), and must not reduce logo/tagline legibility.
- **Per-task verification:** `npm run build` (41 pages — confirm `find dist -name index.html | wc -l`; a transient `.astro/.prerender` EBUSY on exit is benign, trust the count), `npm run check:links` (0 broken; needs port 4321 free — stop any dev/preview server first; a low ~62 count is a flaky cold-start, re-run for ~105), `npm test` (28 — unchanged; these are CSS/asset changes with no unit-testable logic, and the catalog/sitemap tests already cover the data). Commit per task, conventional messages.
- **Live browser hover pass** (controller, both widths) is owed at the end — hover states cannot be verified in static build output.

## File Structure

```
src/components/pdp/ProductDetails.astro   Task 1 — size-pill :hover + Add-to-Cart :hover (yellow/ink)
src/components/pdp/PdpAccordion.astro     Task 2 — default-variant teal summary hover + persist-when-open + padding restructure
src/components/pdp/BrandSection.astro     Task 3 — decorative swash layer behind logo/tagline
public/images/pdp/brand-swash.svg         Task 3 — exported Figma decoration (or .png fallback)
```

Unchanged: `Pdp.astro`, `catalog.js`, `cart.js`, `Faqs.astro`, `CourseDetails.astro`, all other components and data.

---

### Task 1: ProductDetails hover states (size pill + Add-to-Cart)

**Files:**
- Modify: `src/components/pdp/ProductDetails.astro` (the `.pdp-details__pill` rules ~lines 372-386 and the `.pdp-details__add` rules ~lines 434-446, plus the reduced-motion block ~lines 508-511)

**Interfaces:**
- Consumes: nothing. Produces: nothing for later tasks.

Read `src/components/pdp/ProductDetails.astro`'s `<style>` block first. The size pill already declares `transition: background …, color …`; the Add-to-Cart button currently transitions only `transform`.

- [ ] **Step 1: Add the size-pill hover.** Immediately after the existing `.pdp-details__pill` rule (the one ending `transition: … color var(--motion-fast) var(--ease-standard);`) and before `.pdp-details__pill[aria-pressed="true"]`, add:

```css
  .pdp-details__pill:hover {
    background: var(--color-teal);
    color: var(--color-paper);
  }
```

(No transition needed here — the base `.pdp-details__pill` rule already declares the `background`/`color` transition. Hover is visual-only; the click handler still owns `aria-pressed`, so the real selection is unaffected.)

- [ ] **Step 2: Extend the Add-to-Cart transition.** In the existing `.pdp-details__add` rule, replace the single-property transition:

```css
    transition: transform var(--motion-fast) var(--ease-standard);
```

with the three-property transition:

```css
    transition:
      transform var(--motion-fast) var(--ease-standard),
      background var(--motion-fast) var(--ease-standard),
      color var(--motion-fast) var(--ease-standard);
```

- [ ] **Step 3: Add the Add-to-Cart hover colours.** Replace the existing hover rule:

```css
  .pdp-details__add:hover { transform: translateY(-2px); }
```

with:

```css
  .pdp-details__add:hover {
    transform: translateY(-2px);
    background: var(--color-yellow);
    color: var(--color-ink);
  }
```

- [ ] **Step 4: Leave the reduced-motion guard as-is.** Confirm the existing block still reads:

```css
  @media (prefers-reduced-motion: reduce) {
    .pdp-details__media img { transition: none; }
    .pdp-details__add:hover { transform: none; }
  }
```

Do NOT add the colour swap to this guard — under reduced-motion the button should still turn yellow on hover (a colour change is not motion); only the `translateY` lift is suppressed, which this block already handles.

- [ ] **Step 5: Verify.** `npm run build` (41 pages — `find dist -name index.html | wc -l` = 41), `npm run check:links` 0 broken, `npm test` 28. Grep the source to confirm the two hover rules landed:

```bash
grep -nE "pdp-details__pill:hover|pdp-details__add:hover" src/components/pdp/ProductDetails.astro
```

Expected: `.pdp-details__pill:hover` present, and `.pdp-details__add:hover` present with `--color-yellow` + `--color-ink` nearby. Report that the visible hover behavior (pill fills teal; Add-to-Cart turns yellow/ink + lifts) is the controller's live pass — CSS `:hover` doesn't render in static output.

- [ ] **Step 6: Commit.**

```bash
git add src/components/pdp/ProductDetails.astro
git commit -m "feat(pdp): size-pill teal hover + Add-to-Cart yellow-on-hover"
```

---

### Task 2: Accordion teal-hover + persist-when-open (default variant)

**Files:**
- Modify: `src/components/pdp/PdpAccordion.astro` (add a new block to the `<style>`; do NOT edit the existing `.pdp-accordion__row` / `__summary` / `__body` base rules or any `.pdp-accordion--on-teal …` rule)

**Interfaces:**
- Consumes: nothing. Produces: nothing for later tasks.

Read `src/components/pdp/PdpAccordion.astro` in full first. Key facts:
- The component is used two ways: `ProductDetails.astro` renders `<PdpAccordion item={item} />` (wrapper class `pdp-accordion` — the **default** variant), and `Faqs.astro` renders it with `variant="onTeal"` (wrapper class `pdp-accordion pdp-accordion--on-teal` — the course-FAQ band).
- Base rules today: `.pdp-accordion__row { … padding: var(--space-4) var(--space-6); gap: var(--space-5) }`; `.pdp-accordion__summary { … color: var(--color-teal) }` (no padding, no background, no `:hover`); `.pdp-accordion__icon { … color: var(--color-teal) }` (flips `+`→`−` on `[open]`); `.pdp-accordion__body` (no padding — inset comes from the row's padding).
- The onTeal variant overrides row padding to `var(--space-5) var(--space-6)`, summary colour to paper, icon to paper — **these must stay exactly as they are.**

**Why scope to `:not(.pdp-accordion--on-teal)`:** the teal fill is meaningless on the already-teal onTeal band, and the padding restructure would collide with the onTeal row-padding override. Scoping every new rule to the default variant leaves the onTeal variant's rules literally unedited and unmatched, so the course-FAQ band is provably byte-identical.

**Why `gap: var(--space-2)` on the default row:** moving the row's inset onto the summary gives the summary its own `var(--space-4)` (16px) bottom padding. To keep the summary→body distance at the original `var(--space-5)` (24px), the row gap drops to `var(--space-2)` (8px): 16px summary bottom-padding + 8px gap = 24px. Closed-state box size and horizontal insets are unchanged, so the default accordion's spacing is pixel-identical — only the teal fill is added.

- [ ] **Step 1: Add the scoped Chunk-4 block.** Append this block to the END of `PdpAccordion.astro`'s `<style>` (after the existing onTeal rules), leaving every existing rule untouched:

```css
  /* ---- Chunk 4: product-accordion teal hover + persist-when-open --------
     Scoped to the DEFAULT variant (`:not(.pdp-accordion--on-teal)`) so the
     course-FAQ onTeal band's rules are neither edited nor matched here —
     it renders byte-for-byte unchanged. The row's inset moves onto the
     summary + body so the teal summary fills the bordered box edge-to-edge;
     the row gap drops to var(--space-2) so the summary→body distance stays
     the original var(--space-5) (16px summary bottom-padding + 8px gap).
     The summary bar fills solid teal (white label + white +/- icon) on
     hover and STAYS filled while the row is open; the body stays on white
     below it so its ink copy remains readable. */
  .pdp-accordion:not(.pdp-accordion--on-teal) .pdp-accordion__row {
    padding: 0;
    gap: var(--space-2);
  }
  .pdp-accordion:not(.pdp-accordion--on-teal) .pdp-accordion__summary {
    padding: var(--space-4) var(--space-6);
    transition:
      background var(--motion-fast) var(--ease-standard),
      color var(--motion-fast) var(--ease-standard);
  }
  .pdp-accordion:not(.pdp-accordion--on-teal) .pdp-accordion__body {
    padding: 0 var(--space-6) var(--space-4);
  }
  .pdp-accordion:not(.pdp-accordion--on-teal) .pdp-accordion__summary:hover,
  .pdp-accordion:not(.pdp-accordion--on-teal) .pdp-accordion__row[open] > .pdp-accordion__summary {
    background: var(--color-teal);
    color: var(--color-paper);
  }
  .pdp-accordion:not(.pdp-accordion--on-teal) .pdp-accordion__summary:hover .pdp-accordion__icon,
  .pdp-accordion:not(.pdp-accordion--on-teal) .pdp-accordion__row[open] > .pdp-accordion__summary .pdp-accordion__icon {
    color: var(--color-paper);
  }
```

- [ ] **Step 2: Confirm no existing rule was edited.** The base `.pdp-accordion__row`/`__summary`/`__body` rules and every `.pdp-accordion--on-teal …` rule must be identical to before this task. Verify:

```bash
git diff src/components/pdp/PdpAccordion.astro
```

Expected: the diff shows ONLY the appended block above — no changes inside any pre-existing rule, no change to any `--on-teal` selector.

- [ ] **Step 3: Verify build + course-FAQ unchanged.** `npm run build` (41 pages). The course-FAQ (onTeal) markup is CSS-scoped-hash-stable and its rules are unedited, so the built course PDP FAQ is unchanged; confirm the FAQ section still builds by checking a course page exists and contains the accordion:

```bash
find dist -name index.html | wc -l          # 41
grep -c "pdp-accordion__row" dist/courses/sole-switch-pro/index.html   # > 0 (FAQ band still renders)
grep -c "pdp-accordion__row" dist/products/toe-spacers/index.html      # > 0 (product accordion still renders)
```

- [ ] **Step 4: Verify links + tests.** `npm run check:links` 0 broken, `npm test` 28.

- [ ] **Step 5: Report the verification the controller owes.** State clearly that the live browser pass must confirm, on a **product** PDP: (a) hovering a closed row fills the whole bordered box teal with white label + white `+`; (b) an **open** row keeps the teal summary bar (white label + white `−`) with the body readable on white below; (c) the product accordion's closed/open spacing looks unchanged from before. And on a **course** PDP: the FAQ band is visually identical to before (no teal-fill hover, white-on-teal as it was). Report that you could not visually verify these in static output.

- [ ] **Step 6: Commit.**

```bash
git add src/components/pdp/PdpAccordion.astro
git commit -m "feat(pdp): product accordion teal summary hover, persists when open"
```

---

### Task 3: Brand-section decorative swash

**Files:**
- Create: `public/images/pdp/brand-swash.svg` (or `.png` fallback — see Step 2)
- Modify: `src/components/pdp/BrandSection.astro`

**Interfaces:**
- Consumes: nothing. Produces: nothing for later tasks.

Read `src/components/pdp/BrandSection.astro` first. Today `.brand-section { background: var(--color-teal) }` with a centered white logo trio (`.brand-section__logo` …) + white `--type-display` tagline inside `.brand-section__pad`, hidden below 1024px. There is no `position`/`overflow` on the band today.

The Figma brand band (node `1046:19567`, file `FX7PDNvhZwyozODaq8Q8i7`) shows a subtle tonal-teal decorative background — a large sole/footprint silhouette plus curved "swash" waves — behind the logo + tagline, on the `#047791` teal. The decoration is a single layer (node `1046:19285`). The current build renders flat teal.

- [ ] **Step 1: Pull the Figma reference.** Run `get_screenshot` on node `1046:19567` (file `FX7PDNvhZwyozODaq8Q8i7`) and download it (`curl -L -o <scratch>/brand-ref.png "<url>"`, then view it) so you can match the swash's placement and tone. This is your fidelity reference for Step 3.

- [ ] **Step 2: Export the swash asset.** Run `download_assets` on node `1046:19285` (file `FX7PDNvhZwyozODaq8Q8i7`) with `defaultFormat: "svg"`. Inspect the result:
  - If it is a clean/compact vector SVG (no giant embedded base64 raster), save it to `public/images/pdp/brand-swash.svg`.
  - If the SVG is a large embedded-raster blob (e.g. >100KB with a `data:image/png;base64,…` payload), instead export with `defaultFormat: "png", defaultScale: 2` and save to `public/images/pdp/brand-swash.png`.
  - Report which format you saved and its file size. Use the saved path in Step 3 (`.svg` or `.png`).

- [ ] **Step 3: Place the swash behind the content.** Edit `BrandSection.astro`. Add the decorative layer as the first child inside `.brand-section` (before `.brand-section__pad`), and update the CSS so the band clips the decoration and the content sits above it:

Markup — insert immediately after `<section class="brand-section">`:

```astro
  <img class="brand-section__swash" src="/images/pdp/brand-swash.svg" alt="" aria-hidden="true" />
```

(Use `/images/pdp/brand-swash.png` if you saved a PNG in Step 2.)

CSS — change the `.brand-section` rule to add positioning + clipping, add the swash rule, and lift the content. Replace the existing `.brand-section` rule:

```css
  .brand-section {
    background: var(--color-teal);
  }
```

with:

```css
  .brand-section {
    position: relative;
    overflow: hidden;
    background: var(--color-teal);
  }

  /* Decorative footprint/swash layer (Figma 1046:19285) — covers the band,
     clipped by the band's overflow, sits behind the content. Purely
     decorative (aria-hidden, empty alt). */
  .brand-section__swash {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    pointer-events: none;
    user-select: none;
  }
```

Then ensure the content paints above the swash — add `position: relative; z-index: 1;` to the existing `.brand-section__pad` rule (keep all its current properties):

```css
  .brand-section__pad {
    position: relative;
    z-index: 1;
    max-width: var(--container-max);
    margin-inline: auto;
    padding-inline: var(--space-7);
    padding-block: 96px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-5);
  }
```

The band is already hidden below 1024px (`@media (max-width: 1023px) { .brand-section { display: none } }`), so the swash is desktop-only automatically — no extra breakpoint work. Adjust `object-position` if the reference screenshot from Step 1 shows the heavier shapes offset from center; the overflow clip hides any bleed.

- [ ] **Step 4: Verify.** `npm run build` (41 pages — `find dist -name index.html | wc -l` = 41). Confirm the asset is referenced and present:

```bash
grep -c "brand-section__swash" dist/products/toe-spacers/index.html    # 1 (band renders the swash img)
ls -la public/images/pdp/brand-swash.*                                  # the exported asset exists
```

`npm run check:links` 0 broken, `npm test` 28. Report that the visual pass — swash reads correctly behind a fully-legible logo + tagline on desktop, and the band is absent on mobile — is the controller's live pass.

- [ ] **Step 5: Commit.**

```bash
git add src/components/pdp/BrandSection.astro public/images/pdp/brand-swash.*
git commit -m "feat(pdp): brand-section decorative swash background"
```

---

### Task 4: Verification sweep

**Files:** none (or `.superpowers/sdd/progress.md`).

- [ ] **Step 1: Full sweep.** Stop any dev/preview server; free port 4321. Run and paste actual output: `npm run build` (confirm 41 pages via `find dist -name index.html | wc -l`), `npm run check:links` (0 broken; re-run if a low count appears), `npm test` (28).

- [ ] **Step 2: Scope check.** Confirm the branch changed only the three components + the one asset, and nothing else:

```bash
git diff --name-only master...HEAD
```

Expected exactly: `src/components/pdp/ProductDetails.astro`, `src/components/pdp/PdpAccordion.astro`, `src/components/pdp/BrandSection.astro`, `public/images/pdp/brand-swash.svg` (or `.png`). Confirm `catalog.js`, `cart.js`, `Pdp.astro`, `Faqs.astro`, `CourseDetails.astro` are NOT in the list.

- [ ] **Step 3: onTeal-untouched check.** Confirm the Task 2 diff added only the scoped block and edited no `--on-teal` rule:

```bash
git diff master...HEAD -- src/components/pdp/PdpAccordion.astro
```

Expected: additions are all under `.pdp-accordion:not(.pdp-accordion--on-teal) …`; no line inside a pre-existing `.pdp-accordion__row`/`__summary`/`__body` base rule or any `.pdp-accordion--on-teal …` rule is changed.

- [ ] **Step 4: Update `.superpowers/sdd/progress.md`** with the outcome and the deferred consistency item (quick-add modal pills + course-PDP pills/CTA/onTeal accordion don't get these hovers — later batch).

- [ ] **Step 5: Commit** if the ledger is tracked (it's gitignored here — likely a no-op; report that).

---

## Definition of done

- Hovering a product size pill fills it solid teal with white text; the real (aria-pressed) selection is unchanged.
- Hovering a product accordion row fills its summary solid teal (white label + `+`/`−` icon); an open row keeps the teal summary with the body readable on white below; the product accordion's spacing is otherwise unchanged.
- The course-FAQ `onTeal` accordion band renders byte-for-byte unchanged (its rules unedited, unmatched by the scoped selectors).
- The Add-to-Cart button is teal + white by default and yellow + ink text (plus the existing lift) on hover; reduced-motion keeps the yellow but drops the lift.
- The brand band shows the Figma swash behind a fully-legible white logo + tagline on desktop, and is absent on mobile.
- Only the three PDP components + one new asset changed. Build 41 pages, `check:links` 0 broken, tests 28, and a controller live browser hover pass at both widths on a product PDP (plus a glance at a course PDP FAQ to confirm it's unchanged).
