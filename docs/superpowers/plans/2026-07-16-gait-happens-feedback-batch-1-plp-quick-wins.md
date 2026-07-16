# Gait Happens — Feedback Batch 1, Chunk 3a: PLP quick wins (implementation plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bump the PLP intro-block heading to `--type-h3`, and make the whole PLP card clickable (via an accessible block-link overlay) while keeping the quick-add cart button independently clickable.

**Architecture:** Two focused component edits, no JS, no data, no dependencies. The intro heading is a one-token swap. The whole-card link uses the standard pseudo-element overlay pattern (the title link's `::after` stretches over the card; the quick-add button sits above it via `z-index`), replacing today's three duplicate `<a href>`s with one link — no `stopPropagation`, no click handler.

**Tech Stack:** Astro, hand-authored CSS from tokens.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-16-gait-happens-feedback-batch-1-plp-quick-wins-design.md`.
- **`QuickAddModal.astro` is NOT touched.** The quick-add flow is a document-level delegated listener keyed on `[data-quick-add]`; the button keeps that attribute and stays clickable above the overlay, so the existing flow keeps working with zero modal changes.
- **Exactly one link per card after Task 2** (the title link, covering the whole card). The image `<a>` and CTA `<a>` become non-links. Prove it (grep: one `href` per card, was three).
- Tokens govern colour/type/spacing. The intro heading stays `--color-paper` (white); only its font token changes (`--type-h4` → `--type-h3`).
- The card's existing teal-wash-and-invert hover, badges, rating, description clamp, and responsive stacking must render unchanged — only the link structure + overlay change.
- **Per-task verification:** `npm run build` (41 pages — confirm `find dist -name index.html | wc -l`; a transient `.astro/.prerender` EBUSY on exit is benign, trust the count), `npm run check:links` (0 broken; needs port 4321 free — stop any dev/preview server first; a low ~62 count is a flaky cold-start, re-run for ~105), `npm test` (28). Commit per task, conventional messages.

## File Structure

```
src/components/plp/IntroBlock.astro   Task 1 — MODIFY: heading --type-h4 → --type-h3
src/components/plp/PlpCard.astro       Task 2 — MODIFY: block-link overlay (position/z-index/link→non-link)
```

Unchanged: `QuickAddModal.astro`, `Plp.astro`, `PlpGrid.astro`, all data.

---

### Task 1: Intro-block heading → h3

**Files:**
- Modify: `src/components/plp/IntroBlock.astro` (the `.intro-block__heading` rule, ~lines 21-24)

- [ ] **Step 1: Bump the token.** In `src/components/plp/IntroBlock.astro`, change the `.intro-block__heading` `font` from `var(--type-h4)` to `var(--type-h3)`. Leave `color: var(--color-paper)` and everything else as-is:

```css
  .intro-block__heading {
    font: var(--type-h3);
    color: var(--color-paper);
  }
```

- [ ] **Step 2: Verify.** `npm run build` (41 pages), `npm run check:links` 0 broken, `npm test` 28. Grep a built PLP that has an intro cell (e.g. `dist/collections/courses-individuals/index.html`) and confirm the `intro-block__heading` renders (the change is CSS-only, so the visible size change is confirmed by the controller's live pass — note that).

- [ ] **Step 3: Commit.**

```bash
git add src/components/plp/IntroBlock.astro
git commit -m "feat(plp): intro-block heading h4 -> h3"
```

---

### Task 2: Whole PLP card clickable (block-link overlay)

**Files:**
- Modify: `src/components/plp/PlpCard.astro`

**Interfaces:**
- Consumes: nothing from Task 1. Produces nothing for later tasks (3a is done after this).

Read `src/components/plp/PlpCard.astro` in full first. Today it has THREE links to `item.href` (`.plp-card__media` `<a>`, `.plp-card__title` inner `<a>`, `.plp-card__cta` `<a>`) plus the `.plp-card__quick-add` `<button data-quick-add={item.id}>`.

- [ ] **Step 1: Image link → non-link container.** Replace the media `<a>` wrapper with a `<div>` (keep the class and the `<img>` inside; drop `href`, `tabindex="-1"`, `aria-hidden="true"`):

```astro
  <div class="plp-card__media">
    <img src={item.image} alt={item.title} loading="lazy" />
  </div>
```

- [ ] **Step 2: CTA link → visual span.** Replace the CTA `<a href>` with a `<span>` carrying the same class and inner markup (it becomes a visual button covered by the card overlay; its label is still `{item.cta}`):

```astro
        <span class="plp-card__cta">
          <span>{item.cta}</span>
          <span class="plp-card__cta-arrow" aria-hidden="true"></span>
        </span>
```

- [ ] **Step 3: Keep the title link, keep the quick-add button.** Leave `<h3 class="plp-card__title"><a href={item.href}>{item.title}</a></h3>` and the `<button class="plp-card__quick-add" data-quick-add={item.id} …>` exactly as they are — the title `<a>` becomes the one card link (Step 4 stretches it), and the button keeps its `data-quick-add` trigger.

- [ ] **Step 4: The overlay CSS.** In the `<style>` block:
  - Add `position: relative;` to `.plp-card`.
  - Add the stretched overlay to the title link, and raise the quick-add button above it:

```css
  .plp-card { position: relative; /* …existing props… */ }

  /* Block-link overlay: the title link's hit area covers the whole card, so
     clicking anywhere (except the quick-add button) navigates to item.href.
     One real link in the a11y tree (named by the title). */
  .plp-card__title a::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  /* Quick-add sits ABOVE the overlay so it stays independently clickable
     (opens the modal, doesn't navigate) — pure layering, no stopPropagation. */
  .plp-card__quick-add {
    position: relative;
    z-index: 2;
    /* …existing props… */
  }
```
  Merge these into the existing rules (don't duplicate the `.plp-card` / `.plp-card__quick-add` selectors — add the properties to the existing blocks). Keep all existing card/hover CSS.

- [ ] **Step 5: Handle the now-dead CTA direct-hover rule.** `.plp-card__cta:hover { transform: translateY(-2px) }` can no longer fire (the overlay intercepts pointer events over the CTA span), and the CTA is no longer interactive. Remove the standalone `.plp-card__cta:hover` rule (and its reduced-motion entry if it only guarded that). Keep `.plp-card:hover .plp-card__cta` (the whole-card-hover invert) and `.plp-card:hover .plp-card__cta-arrow` — those still fire. Do not remove the `.plp-card__quick-add:hover` rule (the button is still interactive above the overlay).

- [ ] **Step 6: Title underline on hover (spec §6).** `.plp-card__title a:hover { text-decoration: underline }` now fires on whole-card hover (the overlay is the title link's hit area). Leave it for now — the controller will judge in the live pass whether the underline-on-card-hover reads well against the teal-wash-white title; if it looks off, a follow-up scopes it. Note this in the report.

- [ ] **Step 7: Verify — link structure + regression.** `npm run build` (41 pages). **Grep a built PLP** (`dist/collections/all/index.html`): each `.plp-card` now has exactly **one** `href` (the title link) — confirm there is no `plp-card__media"` with an `href` and no `plp-card__cta"` with an `href` (both are now `<div>`/`<span>`). Confirm the `.plp-card__quick-add` still carries `data-quick-add`. `npm run check:links` 0 broken (the one remaining link per card still resolves); `npm test` 28. Report that the live browser pass (whole-card click, quick-add still opens modal, keyboard, hover) is the controller's.

- [ ] **Step 8: Commit.**

```bash
git add src/components/plp/PlpCard.astro
git commit -m "feat(plp): whole card clickable via block-link overlay"
```

---

## Definition of done

- PLP intro cells render their heading at `--type-h3`.
- Each PLP card has exactly one link (the title, covering the whole card); clicking anywhere except the quick-add button navigates to the item; the quick-add button still opens the modal; Tab reaches the card link then the quick-add button.
- The card's teal-wash hover, badges, rating, description clamp, and responsive stacking are unchanged.
- `QuickAddModal.astro` untouched. Build 41 pages, `check:links` 0 broken, tests 28, live browser pass on a product card and a course card.
