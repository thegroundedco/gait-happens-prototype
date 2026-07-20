# Gait Happens — Feedback Batch 1, Chunk 5: Walk cross-sell + author photos — design

**Date:** 2026-07-20
**Project:** Gait Happens Web Migration (Phase 2) — client feedback on nav / PLPs / product PDPs
**Repo:** `…\04_Website\00_Claude`; branch off `master` (@ `63c7ed2`). GitHub `thegroundedco/gait-happens-web` (private).
**Figma:** file `FX7PDNvhZwyozODaq8Q8i7`. Walk cross-sell "Product Cards" node `1046:10778`; "Meet the Authors" node `721:7907`.

> Batch roadmap + locked decisions live in `docs/superpowers/specs/2026-07-15-gait-happens-feedback-batch-1-nav-design.md` §0. Chunks 1 (nav), 2 (logo wall), 3a (PLP quick wins), 3b (quick-add modal), 4 (PDP interactions) are merged. This is **Chunk 5 — the LAST chunk of Feedback Batch 1**.

---

## 1. Purpose & scope

Two Walk-PDP items from the batch roadmap, both scoped so **only the Walk product PDP changes** — the base cross-sell variant (every other PDP/PLP) and every course's instructor section stay byte-identical.

**A. Walk cross-sell (`shop-products` variant).** Bring it to the Figma "Product Cards" design (node `1046:10778`):
1. **Equal columns** — the 3 product cards + the Shop All column are equal width (currently fixed-252px product cards + a flexible Shop All).
2. **Two Shop All cards** — the 4th column is two stacked teal cards, "Shop All Products" and "Shop All Courses" (the current build renders a single generic "Shop All").
3. **Hover overflow** — the product-card image `scale(1.06)` hover currently bleeds out of its box; clip it.

**B. Author photos.** Replace Walk's placeholder instructor images with the real Dr. Courtney Conley + Dr. Milica McDowell headshots from the Figma "Meet the Authors" section (`721:7907`).

**Out of scope / flagged, not done**
- **McDowell's bio** is a known-incomplete transcript stub in the data (pre-existing, disclosed in `catalog.js`) — needs real client copy; not part of this photo task.
- **Conley name suffix** — the Figma reads "Dr. Courtney Conley, **DC**"; the data has "Dr. Courtney Conley". A one-word content tweak, flagged; include only if trivially confirmed, otherwise leave.
- The base cross-sell variant, the course instructor sections, the quick-add modal, and all other components.

**Success criteria**
- Walk's cross-sell renders 4 equal-width columns: 3 product cards + a column with "Shop All Products" (→ `/collections/all`) over "Shop All Courses" (→ `/collections/all-courses`), each teal with a bottom-left label + arrow; the product-card image hover no longer bleeds.
- Walk's "Meet the Authors" shows the two real headshots with the author's name as `alt`; course instructor cards are unchanged (still `alt=""` placeholders).
- Build clean, `check:links` 0 broken, tests green, and a live pass on `/products/walk`.

## 2. Current state (from the code + Figma)

- **`src/components/plp/CrossSell.astro`** — one component, two variants. Base: `.cross-sell__row { display:grid; grid-template-columns: repeat(4,1fr) }` (3 item cards + 1 `.cross-sell__card--all` "Shop All"). The **`shop-products`** variant (`crossSell.variant === 'shop-products'`, Walk only) overrides desktop to a flex row: product cards `flex: 0 0 252px`, Shop All `flex: 1 1 0` (unequal), and renders the SAME single Shop All card. The product-card media in this variant is `position: relative; aspect-ratio: 252/226` with **no `overflow: hidden`**, while `.cross-sell__card:hover .cross-sell__media img { transform: scale(1.06) }` → the image bleeds on hover. Walk's `crossSell` data: `{ variant:'shop-products', heading, itemIds, kickers, blurbs, shopAllHref:'/collections/all' }`.
- **`src/components/pdp/YourInstructors.astro` + `InstructorCard.astro`** — shared; `InstructorCard` renders `<img src={instructor.photo} alt="">` in a 222px circular crop (`border-radius:50%` + `object-fit:cover`). Walk's `instructors` (in `catalog.js`): two entries (Dr. Courtney Conley, Dr. Milica McDowell), both `photo: '/images/plp/walk.jpg'` (placeholder), `credential: null`. The `InstructorCard` comment already flags this exact task: "once real headshots replace this placeholder, that alt should become the instructor's name."
- **Figma:** cross-sell `1046:10778` shows 4 equal columns; the 4th is two stacked teal cards ("Shop All Products →", "Shop All Courses →") with bottom-left labels + a modest arrow (not the base variant's 40px-display + 64px-arrow). "Meet the Authors" `721:7907` shows the two circular headshots. Routes `/collections/all` and `/collections/all-courses` both exist (built).

## 3. Design

### 3.1 Cross-sell `shop-products` variant (`CrossSell.astro` + Walk data)

All changes are gated on the `shop-products` variant; the base variant's markup + CSS are untouched.

**Equal columns.** Replace the desktop flex row (fixed 252px + flexible) with an **equal 4-column grid** — `grid-template-columns: repeat(4, 1fr)` with `align-items: stretch` so all four columns are equal width and equal height (matching the Figma's even proportions). The product cards keep their internal stack (media → teal label bar → teal blurb).

**Two Shop All cards.** The 4th grid cell becomes a wrapper (`.cross-sell__all-stack`, a flex column) holding two teal `.cross-sell__card--all` cards that split the column height:
- "Shop All Products" → `crossSell.shopAllHref` (Walk: `/collections/all`).
- "Shop All Courses" → `crossSell.shopAllCoursesHref` (Walk: `/collections/all-courses`, new field).

Each card's label sits **bottom-left** with the arrow at bottom-right (the existing `.cross-sell__card--all { justify-content: flex-end }` + label-row `space-between`). Per the Figma, these two cards use a **smaller label + arrow** than the base variant's single Shop All: label at `--type-nav-label` (not the 40px `--type-display`) and the 24px `/images/nav/arrow.svg` (not the 64px `arrow-lg.svg`). The markup is **conditional on the variant**: `shop-products` renders the two-card wrapper; the base variant renders its existing single 40px-display Shop All card unchanged. The two "Shop All Products/Courses" labels are the variant's fixed strings (in the component's shop-products branch); only the two hrefs come from data.

**Hover overflow.** Add `overflow: hidden` to `.cross-sell--shop-products .cross-sell__media` so the `scale(1.06)` hover is clipped inside the media box (the same clipping the base variant's `overflow: hidden` card already provides). Reduced-motion already nulls the scale.

**Mobile.** The variant's mobile single-column stack is preserved: the 3 product cards, then the two Shop All cards stack full-width (the wrapper is already a flex column).

**Data.** Walk's `crossSell` gains `shopAllCoursesHref: '/collections/all-courses'`. No other product/course uses `shop-products`, so no other data changes.

### 3.2 Author photos (`InstructorCard.astro` + Walk data + assets)

**Assets.** Export the two headshots from Figma "Meet the Authors" (`721:7907`) — Dr. Courtney Conley and Dr. Milica McDowell — to `public/images/instructors/courtney-conley.png` and `public/images/instructors/milica-mcdowell.png`. Because the structured Figma export tools hit the node-visibility quirk (seen in Chunk 3), export via the `use_figma` path (`getNodeByIdAsync` + `setCurrentPageAsync` + `exportAsync`) at a good resolution (the source is rectangular; the component's circular crop masks it). **Verify the two exports are distinct people** — if the Figma reused one placeholder headshot for both, flag that McDowell needs a real photo from the client rather than shipping a duplicate.

**Data + alt.** Point Walk's two `instructors[].photo` at the new assets. Set the photo `alt` to the author's name for these real headshots, via a minimal per-instructor opt-in so the courses' placeholder cards keep `alt=""`: add `realPhoto: true` to Walk's two instructor entries, and change `InstructorCard` to render `alt={instructor.realPhoto ? instructor.name : ''}`. Every course instructor omits `realPhoto`, so its `alt` stays `""` — byte-identical, no a11y regression.

## 4. Accessibility

- **Author photos** get the author's name as `alt` (a real likeness now); course placeholders keep `alt=""` (decorative) via the `realPhoto` opt-in.
- **Cross-sell** — each Shop All card stays a single `<a href>` with visible label text; the arrow is `alt=""` decoration. The two-card wrapper adds no interactive nesting (two sibling links). Card hover (image scale + arrow nudge) keeps its `prefers-reduced-motion` guard.
- No change to the instructor "Read More" toggle, its measured-overflow logic, or the section's heading semantics.

## 5. Verification

- **Build/tests/links:** `npm run build` (41 pages), `npm run check:links` 0 broken (the two new Shop All hrefs `/collections/all` + `/collections/all-courses` both resolve; the new image assets exist), `npm test` (28 — the data additions are additive; confirm no test asserts an exact instructor/crossSell shape and adjust if so).
- **Regression:** grep/diff a built PDP that uses the **base** cross-sell variant (e.g. a course PDP) and a **course** instructor section to confirm they render unchanged (the variant gating + `realPhoto` opt-in leave them byte-identical).
- **Live browser pass** (controller, both widths) on `/products/walk`: (a) cross-sell = 4 equal columns, 3 product cards + two stacked Shop All cards (Products/Courses) with bottom-left labels; (b) hovering a product card scales the image WITHOUT bleeding past its box; (c) "Meet the Authors" shows the two real, distinct headshots; (d) mobile stacks cleanly. Confirm the two Shop All links navigate to `/collections/all` and `/collections/all-courses`.

## 6. Out of scope / flagged

- McDowell bio (incomplete transcript stub — needs real client copy; pre-existing).
- Conley "DC" suffix (optional one-word content tweak).
- If the two Figma headshots turn out to be the same placeholder image, McDowell's real photo is a client-asset follow-up.
- The WCAG 2.2.2 marquee touch-pause button (pre-existing, logged in Chunk 2) — untouched.
