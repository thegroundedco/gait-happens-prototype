# Gait Happens — Feedback Batch 1, Chunk 5: Walk cross-sell + author photos (implementation plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the Walk PDP cross-sell to its Figma "Product Cards" design (equal 4-column grid, two stacked Shop All cards, clipped hover) and replace Walk's placeholder author images with the real Conley/McDowell headshots.

**Architecture:** All changes are gated to the Walk PDP: the cross-sell changes live behind the `shop-products` variant so the base `CrossSell` variant is byte-identical; the author-photo `alt` change is a per-instructor `realPhoto` opt-in so every course's instructor cards are byte-identical.

**Tech Stack:** Astro, hand-authored CSS from tokens, `sharp`/Figma-export for assets.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-20-gait-happens-feedback-batch-1-walk-crosssell-authors-design.md`.
- **Walk PDP only.** The base cross-sell variant (every other PDP/PLP) and every course's instructor section must render byte-identical — the cross-sell changes are gated on `crossSell.variant === 'shop-products'`, and the photo `alt` change is gated on a per-instructor `realPhoto` flag that only Walk sets.
- **Two Shop All cards** (shop-products only): "Shop All Products" → `crossSell.shopAllHref` (`/collections/all`), "Shop All Courses" → `crossSell.shopAllCoursesHref` (`/collections/all-courses`, new). Both routes exist. Labels bottom-left; `--type-nav-label` text + 24px `/images/nav/arrow.svg` (NOT the base variant's 40px `--type-display` + 64px `arrow-lg.svg`).
- **Equal columns** (shop-products desktop): `grid-template-columns: repeat(4, 1fr); align-items: stretch`.
- **Hover overflow:** `overflow: hidden` on `.cross-sell--shop-products .cross-sell__media`. The card hover keeps its `prefers-reduced-motion` guard.
- **Tokens only**, no new tokens. Reduced-motion, the instructor Read-More toggle, and heading semantics are all preserved.
- **Per-task verification:** `npm run build` (41 pages — `find dist -name index.html | wc -l`; transient `.astro/.prerender` EBUSY on exit is benign), `npm run check:links` (0 broken; needs port 4321 free — stop any dev/preview server first; a low ~62 count is a flaky cold-start, re-run for ~105), `npm test` (28). Commit per task.

## File Structure

```
src/components/plp/CrossSell.astro          Task 1 — MODIFY: shop-products equal grid, two Shop All cards, hover clip
src/data/catalog.js                          Task 1 — MODIFY: Walk crossSell gains shopAllCoursesHref
                                             Task 2 — MODIFY: Walk instructors[].photo + realPhoto
public/images/instructors/*.png              Task 2 — CREATE: two exported headshots
src/components/pdp/InstructorCard.astro      Task 2 — MODIFY: img alt = realPhoto ? name : ''
```

Unchanged: `Pdp.astro`, `YourInstructors.astro`, `Plp.astro`, all other components/data.

---

### Task 1: Cross-sell shop-products variant (equal grid + two Shop All cards + hover clip)

**Files:**
- Modify: `src/components/plp/CrossSell.astro`
- Modify: `src/data/catalog.js` (Walk's `crossSell`, ~line 991)

**Interfaces:**
- Consumes: nothing. Produces: nothing for later tasks.

Read `src/components/plp/CrossSell.astro` in full first. `const isShopProducts = crossSell?.variant === 'shop-products';` already exists. The base variant's single Shop All `<a class="cross-sell__card cross-sell__card--all" href={crossSell?.shopAllHref}>` (with the 40px `--display` label + 64px `arrow-lg.svg`) must stay unchanged when `isShopProducts` is false.

- [ ] **Step 1: Add `shopAllCoursesHref` to Walk's crossSell.** In `src/data/catalog.js`, in Walk's `crossSell` object (the one with `variant: 'shop-products'`), add the new field next to `shopAllHref`:

```js
        shopAllHref: '/collections/all',
        shopAllCoursesHref: '/collections/all-courses',
```

- [ ] **Step 2: Make the Shop All markup conditional.** In `CrossSell.astro`, replace the single Shop All `<a>` (the `<a class="cross-sell__card cross-sell__card--all" href={crossSell?.shopAllHref}>…</a>` inside `.cross-sell__row`, after the `items.map`) with a conditional. The `else` branch is the EXACT current single card (base variant unchanged); the `shop-products` branch is a wrapper with two smaller cards:

```astro
      {isShopProducts ? (
        <div class="cross-sell__all-stack">
          <a class="cross-sell__card cross-sell__card--all" href={crossSell?.shopAllHref}>
            <span class="cross-sell__label-row cross-sell__label-row--display">
              <span class="cross-sell__label cross-sell__label--display">Shop All Products</span>
              <img class="cross-sell__arrow" src="/images/nav/arrow.svg" width="24" height="24" alt="" />
            </span>
          </a>
          <a class="cross-sell__card cross-sell__card--all" href={crossSell?.shopAllCoursesHref}>
            <span class="cross-sell__label-row cross-sell__label-row--display">
              <span class="cross-sell__label cross-sell__label--display">Shop All Courses</span>
              <img class="cross-sell__arrow" src="/images/nav/arrow.svg" width="24" height="24" alt="" />
            </span>
          </a>
        </div>
      ) : (
        <a class="cross-sell__card cross-sell__card--all" href={crossSell?.shopAllHref}>
          <span class="cross-sell__label-row cross-sell__label-row--display">
            <span class="cross-sell__label cross-sell__label--display">Shop All</span>
            <img class="cross-sell__arrow" src="/images/nav/arrow-lg.svg" width="64" height="64" alt="" />
          </span>
        </a>
      )}
```

- [ ] **Step 3: Equal 4-column grid.** In the `<style>`, in the shop-products block, replace the desktop flex row + fixed-basis rules. Change the base `.cross-sell--shop-products .cross-sell__row` (currently `display:flex; flex-direction:column; gap:var(--space-6)`) to KEEP the mobile column, and replace the `@media (min-width: 901px)` block:

```css
  @media (min-width: 901px) {
    .cross-sell--shop-products .cross-sell__row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      align-items: stretch;
    }
  }
```

Delete the old `@media (min-width: 901px)` rules that set `.cross-sell--shop-products .cross-sell__row { flex-direction: row; align-items: stretch }`, `.cross-sell--shop-products .cross-sell__card:not(.cross-sell__card--all) { flex: 0 0 252px; width: 252px }`, and `.cross-sell--shop-products .cross-sell__card--all { flex: 1 1 0 }` — the grid replaces them (auto-places the 3 product cards + the `.cross-sell__all-stack` into the 4 equal columns).

- [ ] **Step 4: The Shop All stack + smaller label/arrow + hover clip.** Add to the shop-products `<style>` block:

```css
  /* The two stacked Shop All cards fill the equal 4th column, splitting its height. */
  .cross-sell--shop-products .cross-sell__all-stack {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }
  .cross-sell--shop-products .cross-sell__all-stack .cross-sell__card--all {
    flex: 1 1 0;
  }
  /* Figma: these two cards use the nav-label size, not the base variant's 40px display. */
  .cross-sell--shop-products .cross-sell__card--all .cross-sell__label--display {
    font: var(--type-nav-label);
  }
  /* Clip the product-card image so its scale(1.06) hover no longer bleeds out. */
  .cross-sell--shop-products .cross-sell__media {
    overflow: hidden;
  }
```

(The existing `.cross-sell--shop-products .cross-sell__card--all { height: auto; min-height: 125px }` stays as the per-card floor.)

- [ ] **Step 5: Verify base variant unchanged + build.** `npm run build` (41 pages). Prove the base cross-sell variant is byte-identical: diff a built page that uses the base variant (a course PDP with a cross-sell, e.g. `dist/courses/sole-switch-pro/index.html`) — grep its `cross-sell__card--all` block and confirm it still renders the single 40px `Shop All` card with `arrow-lg.svg`, unchanged. On a Walk build (`dist/products/walk/index.html`), confirm `cross-sell__all-stack` appears once and `Shop All Products` + `Shop All Courses` + `arrow.svg` are present:

```bash
grep -c "cross-sell__all-stack" dist/products/walk/index.html          # 1
grep -oE "Shop All Products|Shop All Courses" dist/products/walk/index.html | sort -u   # both
grep -c "cross-sell__all-stack" dist/courses/sole-switch-pro/index.html # 0 (base variant, single card)
```

`npm run check:links` 0 broken (the two Shop All hrefs resolve), `npm test` 28. Report that the live pass (equal columns, no hover bleed, two cards) is the controller's.

- [ ] **Step 6: Commit.**

```bash
git add src/components/plp/CrossSell.astro src/data/catalog.js
git commit -m "feat(pdp): Walk cross-sell equal columns + two Shop All cards + hover clip"
```

---

### Task 2: Author photos (export + data + alt)

**Files:**
- Create: `public/images/instructors/courtney-conley.png`, `public/images/instructors/milica-mcdowell.png`
- Modify: `src/data/catalog.js` (Walk's `instructors`, ~line 933)
- Modify: `src/components/pdp/InstructorCard.astro` (the `<img>`, line 48)

**Interfaces:**
- Consumes: nothing. Produces: nothing for later tasks.

- [ ] **Step 1: Export the two headshots from Figma.** The structured Figma tools (`get_metadata`/`download_assets`/`get_design_context`) return "node not found" for these nodes even though `get_screenshot` renders them — the node-visibility quirk from Chunk 3. Export via the `use_figma` path instead:
  - Load it: `ToolSearch` query `select:mcp__plugin_figma_figma__use_figma` (and read the `/figma-use` skill first, per the plugin's MANDATORY-before-`use_figma` note).
  - In the Figma context, `setCurrentPageAsync` to the page containing node `721:7907` ("Meet the Authors", file `FX7PDNvhZwyozODaq8Q8i7`), then `getNodeByIdAsync('721:7907')`, find its two headshot image descendants (the two circular photo fills), and `exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 2 } })` each.
  - Save the bytes to `public/images/instructors/courtney-conley.png` and `public/images/instructors/milica-mcdowell.png`. The source is rectangular; the component's 222px circular crop (`border-radius:50%` + `object-fit:cover`) masks it — export a square-ish region if the node is the circular frame, else the raw photo fill.
  - **VERIFY the two exports are DISTINCT people** (view both). If the Figma reused one placeholder headshot for both authors, do NOT ship a duplicate for McDowell — use Conley's real photo, and flag that McDowell needs a real client photo (a client-asset follow-up), leaving her `photo` on the placeholder rather than a wrong likeness.

- [ ] **Step 2: Point Walk's instructors at the new photos + add `realPhoto`.** In `src/data/catalog.js`, Walk's `instructors` array — update both entries' `photo` and add `realPhoto: true` (only if a real, correct photo was exported for that person; see Step 1's dupe caveat):

```js
      instructors: [
        {
          photo: '/images/instructors/courtney-conley.png',
          realPhoto: true,
          name: 'Dr. Courtney Conley',
          credential: null,
          bio: [ /* …unchanged… */ ],
        },
        {
          photo: '/images/instructors/milica-mcdowell.png',
          realPhoto: true,
          name: 'Dr. Milica McDowell',
          credential: null,
          bio: [ /* …unchanged (incomplete stub, flagged)… */ ],
        },
      ],
```

(Leave the `bio` arrays exactly as they are — the McDowell stub is a flagged content follow-up, not this task.)

- [ ] **Step 3: Set the alt from `realPhoto`.** In `src/components/pdp/InstructorCard.astro`, change the photo `<img>` (line 48) from `alt=""` to a `realPhoto`-gated name:

```astro
    <img src={instructor.photo} alt={instructor.realPhoto ? instructor.name : ''} loading="lazy" width="222" height="222" />
```

Every course instructor omits `realPhoto`, so `alt` stays `""` there — byte-identical. Only Walk's two real headshots get the name as `alt`.

- [ ] **Step 4: Verify.** `npm run build` (41 pages). Confirm the assets exist and are referenced, and courses are unchanged:

```bash
ls -la public/images/instructors/                                        # the 2 png files
grep -oE 'instructors/(courtney-conley|milica-mcdowell)\.png' dist/products/walk/index.html | sort -u   # both
grep -c 'alt=""' dist/courses/sole-switch-pro/index.html                 # unchanged (course instructor imgs still alt="")
```

`npm run check:links` 0 broken (the new image `src`s resolve), `npm test` 28. Report that the live pass (real headshots render in the circular crop, distinct people) is the controller's.

- [ ] **Step 5: Commit.**

```bash
git add public/images/instructors src/data/catalog.js src/components/pdp/InstructorCard.astro
git commit -m "feat(pdp): real Conley/McDowell author photos on Walk"
```

---

### Task 3: Verification sweep + live pass

**Files:** none (or `.superpowers/sdd/progress.md`).

- [ ] **Step 1: Full sweep.** Stop any dev/preview server; free port 4321. Run and paste actual output: `npm run build` (41 pages), `npm run check:links` (0 broken; re-run if a low count appears), `npm test` (28 — confirm no test asserts an exact `crossSell`/`instructors` shape; adjust if one does).

- [ ] **Step 2: Scope + regression checks.** `git diff --name-only master...HEAD` — expect only `CrossSell.astro`, `catalog.js`, `InstructorCard.astro`, `public/images/instructors/*` (+ the spec/plan docs). Confirm the base cross-sell variant renders unchanged (a course PDP still has the single 40px `Shop All` card, `cross-sell__all-stack` count 0) and course instructor imgs still `alt=""`.

- [ ] **Step 3: Controller live pass (both widths)** on `/products/walk`: (a) cross-sell = 4 equal columns, 3 product cards + a column with "Shop All Products" over "Shop All Courses", labels bottom-left + arrow; (b) hovering a product card scales the image WITHOUT bleeding past its box; (c) the two Shop All links navigate to `/collections/all` and `/collections/all-courses`; (d) "Meet the Authors" shows the two real, distinct headshots in the circular crop; (e) mobile stacks cleanly. Also glance at a course PDP: base cross-sell single Shop All + placeholder instructor photos unchanged.

- [ ] **Step 4: Update `.superpowers/sdd/progress.md`** with the outcome + the deferred flags (McDowell incomplete bio; Conley "DC" suffix; McDowell client photo if the export was a dupe).

- [ ] **Step 5: Commit** any live-pass tweaks; the ledger is gitignored (no-op).

---

## Definition of done

- Walk's cross-sell is a 4-equal-column grid: 3 product cards + a column of two stacked "Shop All Products"/"Shop All Courses" cards (bottom-left labels, nav-label text + 24px arrow); the product-card image hover no longer bleeds.
- Walk's "Meet the Authors" shows the two real Conley/McDowell headshots with the author name as `alt`; course instructor cards are byte-identical (`alt=""` placeholders).
- The base cross-sell variant is byte-identical (variant-gated); the two Shop All routes resolve.
- Build 41 pages, `check:links` 0 broken, tests 28, and a controller live both-widths pass on `/products/walk`. McDowell bio, Conley "DC", and any dupe-headshot client photo remain flagged follow-ups.
- **Feedback Batch 1 is COMPLETE** (chunks 1–5 all merged).
