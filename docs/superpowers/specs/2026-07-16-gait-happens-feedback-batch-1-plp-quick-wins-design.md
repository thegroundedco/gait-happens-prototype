# Gait Happens — Feedback Batch 1, Chunk 3a: PLP quick wins (intro heading + whole-card link) — design

**Date:** 2026-07-16
**Project:** Gait Happens Web Migration (Phase 2) — client feedback on nav / PLPs / product PDPs
**Repo:** `…\04_Website\00_Claude`; branch off `master` (@ `4ef703f`). GitHub `thegroundedco/gait-happens-web` (private).
**Figma:** PLP card `830:7878`; intro block is the teal cell in the PLP grid.

> Batch roadmap + locked decisions live in `docs/superpowers/specs/2026-07-15-gait-happens-feedback-batch-1-nav-design.md` §0. Chunks 1 (nav) and 2 (logo wall) merged. **Chunk 3 was split**: this is **3a** (two quick PLP items); **3b** (the quick-add modal redesign + course controls) gets its own spec next.

---

## 1. Purpose & scope

Two small, self-contained PLP polish items:
1. **Intro-block heading → `--type-h3`.** The "Why Gait Happens courses for individuals?" (and siblings) heading is currently `--type-h4` (24/500); the design system uses `--type-h3` (Montserrat 600/32px) for on-brand section headings. (The feedback quoted Figma names `--text-on-brand`/`--text-h3`; repo equivalents are `--color-paper`/`--type-h3`. The heading is already `--color-paper` white — only the font token changes. Same swap already made to the logo-wall heading in Chunk 2.)
2. **Whole PLP card clickable**, not just the "View Product" CTA — using the accessible block-link overlay pattern, keeping the quick-add cart button independently clickable.

**Out of scope**
- The quick-add **modal** redesign + course buybox controls + Foot Health Kit copy → **Chunk 3b** (its own spec).
- Everything else (nav, PDPs, cross-sell).

**Success criteria**
- The PLP intro cells render their heading at `--type-h3`.
- Clicking anywhere on a PLP card (except the quick-add button) navigates to the item; the quick-add button still opens the modal; keyboard reaches both; the a11y tree has exactly one link per card.
- Build clean, `check:links` 0 broken, tests green, the existing card teal-wash hover unchanged.

## 2. Current state (from the code map)

- **`src/components/plp/IntroBlock.astro`** — `<h2 class="intro-block__heading">{heading}</h2>`, CSS `font: var(--type-h4); color: var(--color-paper)` on a `--color-teal` cell. Props `{ heading, body }` from the collection's `intro`.
- **`src/components/plp/PlpCard.astro`** — the card has **three separate links to `item.href`**: the image (`<a class="plp-card__media" href tabindex="-1" aria-hidden="true">`), the title (`<h3 class="plp-card__title"><a href>`), and the CTA (`<a class="plp-card__cta" href>`). Plus a quick-add **button** (`<button class="plp-card__quick-add" data-quick-add={item.id}>`) that the `QuickAddModal` delegated listener opens. The whole card already has a rich `.plp-card:hover` teal-wash-and-invert treatment. `.plp-card` is not currently `position: relative`.
- **Consumers:** `IntroBlock` + `PlpCard` are rendered by `PlpGrid.astro` inside `Plp.astro` (all PLP/collection pages). The quick-add flow is delegated (document-level listener in `QuickAddModal.astro`), triggered by `[data-quick-add]`.

## 3. Design

### 3.1 Intro heading

In `IntroBlock.astro`, change `.intro-block__heading` `font: var(--type-h4)` → `font: var(--type-h3)`. Nothing else — colour stays `--color-paper`.

### 3.2 Whole card clickable (block-link overlay)

Make the whole card a single link to `item.href` while keeping the quick-add button clickable, via the standard **pseudo-element overlay** pattern (one real link + a stretched `::after`), NOT nested `<a>`s and NOT a JS click handler:

- **`.plp-card { position: relative }`** — the positioning context for the overlay.
- **The title link is THE card link.** `.plp-card__title a::after { content: ''; position: absolute; inset: 0; z-index: 1; }` stretches the title link's hit area over the whole card. Its accessible name is the title text — a good name for the card link. This is the ONLY link in the card.
- **Image:** replace the `<a class="plp-card__media" href …>` wrapper with a non-link container (`<div class="plp-card__media">` or `<span>`). The image is decorative-adjacent to the title; the overlay makes it clickable. Drop the now-unneeded `tabindex="-1"`/`aria-hidden`. (Removes a redundant link.)
- **CTA:** convert `<a class="plp-card__cta" href …>` to a **visual `<span>`** (same classes/markup, no `href`). It's covered by the overlay, so clicking it navigates via the card link; its invert-on-card-hover styling (`.plp-card:hover .plp-card__cta`) still applies. (Removes the second redundant link. Its own direct `:hover` transform becomes unreachable — the overlay intercepts — so it may be dropped or left as harmless dead CSS; prefer dropping the direct `.plp-card__cta:hover` rule if it's now dead, keeping the whole-card-hover invert.)
- **Quick-add button stays interactive above the overlay:** `.plp-card__quick-add { position: relative; z-index: 2; }`. Because it sits above the `z-index:1` overlay, a click on it hits the button (opens the modal) and does NOT trigger the card link — pure layering, no `stopPropagation`. Its own `:hover` (teal fill / white icon) still fires on direct hover.

**Result:** one accessible link per card (title, covering the whole card), the quick-add button as an independent second tab stop, keyboard-operable. The existing badges/rating/description/teal-wash hover are untouched.

**Accepted trade-off:** text on the card is no longer selectable (the overlay captures pointer events) — the standard cost of a block link, acceptable for a product/course card.

### 3.3 Files

```
src/components/plp/IntroBlock.astro   h4 → h3 (one line)
src/components/plp/PlpCard.astro      position:relative; title-link ::after overlay;
                                      image <a>→<div>; CTA <a>→<span>; quick-add z-index:2
```
No data, no JS, no new dependencies. `QuickAddModal.astro` is NOT touched (the delegated `[data-quick-add]` listener still fires because the button sits above the overlay).

## 4. Accessibility

- **Exactly one link per card**, named by the title — screen-reader users hear one "link, <title>" per card, not three (a real improvement over today's three duplicate links).
- **Two tab stops per card:** the card link (title) and the quick-add button. Both keyboard-operable; focus-visible rings from the global stylesheet apply.
- The quick-add button keeps its `aria-label="Quick add <title>"`.
- No `aria-hidden` on interactive content; no keyboard trap.
- Reduced-motion: the card's existing reduced-motion guards are untouched.

## 5. Verification

- **Build/tests/links:** `npm run build` (41 pages), `npm run check:links` 0 broken, `npm test` (28). No new tests needed (pure markup/CSS); the sitemap/catalog tests already assert `item.href` resolves.
- **Regression:** the card's teal-wash-and-invert hover, badges, rating, description clamp, and responsive stacking all render as before — only the link structure and the overlay change. Grep a built PLP and confirm each card now has ONE `href` (the title link) plus the quick-add button, not three `href`s.
- **Live browser pass** on a PLP (`/collections/all`): (a) clicking the image / body / CTA area navigates to the item; (b) clicking the quick-add button opens the modal (does NOT navigate); (c) Tab reaches the card link then the quick-add button; (d) the teal-wash hover still fires on card hover and the quick-add button still inverts on its own hover. Both a product card and a course card.

## 6. Open items

- **Title underline on hover:** `.plp-card__title a:hover { text-decoration: underline }` exists today and fires on direct title hover. With the `::after` overlay, the title link's hit area is the whole card, so this underline will now fire on **whole-card hover**. That's a reasonable "this card is a link" affordance, but confirm it reads well against the teal-wash-white title in the live pass; if it looks off, scope the underline to direct-title hover only (e.g. move it off the overlay-bearing link, or drop it) — implementer's call against the Figma/feel.
- The intro heading at `--type-h3` (32px) is larger; confirm it doesn't overflow the teal cell at narrow widths in the live pass (the cell is `justify-content: center`, so it should reflow fine, but check).
- Course-PDP note (for the LATER course-PDP feedback batch, NOT this chunk): the confirmed product model is that courses are **purchased via cart** (Kajabi provisioned post-purchase by email), which makes course quick-add-to-cart correct — but it also means the course PDPs' current "Enroll Now" **external Kajabi link** CTA is inconsistent with the cart-purchase model and likely needs to become Add-to-Cart. Flag it there; do not touch course PDPs here.
