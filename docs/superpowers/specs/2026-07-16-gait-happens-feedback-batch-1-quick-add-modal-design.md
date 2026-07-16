# Gait Happens — Feedback Batch 1, Chunk 3b: Quick-add modal redesign — design

**Date:** 2026-07-16
**Project:** Gait Happens Web Migration (Phase 2) — client feedback on nav / PLPs / product PDPs
**Repo:** `…\04_Website\00_Claude`; branch off `master` (@ `bed5d9e`). GitHub `thegroundedco/gait-happens-web` (private).
**Figma:** "PLP Cart Quick Add Modals" component-set `1078:16015`. **Product (Toe Spacers) desktop `1062:21145`; course (FGA) desktop `1062:21281` (Course Type only) and `1062:23702` (Course Type + Language); mobile variants under `1078:16077`+.**

> Batch roadmap + locked decisions in `docs/superpowers/specs/2026-07-15-gait-happens-feedback-batch-1-nav-design.md` §0. Chunks 1 (nav), 2 (logo wall), **3a (intro heading + whole-card click)** merged. This is **3b** — the quick-add modal.

---

## 1. Purpose & scope

Rebuild the PLP quick-add modal to the Figma (`1078:16015`): a **responsive landscape/portrait layout**, an **always-visible full-width size chart** for products, and **course buybox controls** for courses (which the modal doesn't render today). `QuickAddModal.astro` is a single SSR-stable instance per PLP page, populated at runtime from `catalog.js` via `getItem(id)` + `addLine` (cart.js).

**In scope**
- **Responsive layout**: desktop landscape (~800px, image right, controls left, Quantity + Add-to-Cart side by side); mobile portrait (~350px, image top). Replaces today's single portrait/image-top/full-width-button layout.
- **Product modal fidelity**: size label + pills; the size chart rendered as an **always-visible full-width grid table** (dark header, bordered cells) below the top row — not the current collapsible `<details>`.
- **Course modal controls**: render `item.pdp.buybox` (label + controls: pills + the `Location…` select) **exactly as the PDP `CourseDetails` renders it**, so the modal and PDP show the same controls from the same data. Generalize the modal's single-selection `state.variant` to a **per-control selection map**.
- **Foot Health Kit copy**: an optional catalog field rendering "Please select the Toe Spacer size for your kit" above the size selector on that modal only.
- Add-to-Cart records the selections on the cart line.

**Out of scope / deferred**
- **The Foot Fest modal** — bespoke multi-session "Add to Weekend" picker → **Chunk C** (its PDP doesn't exist yet). Its catalog item has no `variants` and no `pdp.buybox`, so its quick-add modal simply shows title/price/qty/Add-to-Cart until Chunk C — acceptable interim.
- **The "Language" buybox group** (in Figma `1062:23702`) — FGA courses' catalog buybox has only "Course Type", and the buybox shape is one-label-per-block, so a second labeled group isn't expressible, and the PDP doesn't render one either. **Decided (2026-07-16): defer.** Adding Language means generalizing the buybox to multiple labeled groups + new course data + a PDP `CourseDetails` change (to keep modal and PDP in sync) — that belongs in the **course-PDP feedback batch**, not here. The modal renders the buybox faithfully (Course Type only) and stays identical to the PDP.
- The nav / PLP card (Chunks 1/3a, done), and the other feedback chunks (4/5).

**Success criteria**
- Product quick-add modals (Toe Spacers, Foot Health Kit) match `1062:21145` at desktop and mobile: landscape image-right / portrait image-top, size pills, Quantity + Add-to-Cart side by side, always-visible size-chart grid.
- Course quick-add modals (FGA etc.) match `1062:21281`: the buybox (Course Type pills + Location select), no size chart, same layout skeleton.
- The Foot Health Kit modal shows the helper copy.
- Selecting options + Add-to-Cart adds a line to the cart with the selections; the existing focus-trap / Esc / scrim / leak-free-across-View-Transitions behavior is preserved.
- Build clean, `check:links` 0 broken, tests green.

## 2. Current state (from the code)

- **`src/components/plp/QuickAddModal.astro`** — SSR-stable markup + a co-located client `<script>` with **two document-level delegated listeners** (`click`, `keydown`), a focus trap, and `resetQuickAdd()` on load + `astro:after-swap` (leak-free across View Transitions). `populate(item)` fills title/price/image, **conditionally** the variant pills (`item.variants` → `data-quick-add-pill`, single-select via `state.variant`) and the size chart (`item.sizeChart` → a `<details>` table), and the qty. `submitAddToCart()` calls `addLine({ id, title, variant, price, qty, image, href })` then closes + opens the cart drawer.
- **Layout today:** `.quick-add-modal` is `width: min(420px, 92vw)`, portrait, image (`.quick-add-modal__media`) on TOP, body below (`display:grid; gap`). Size chart is a collapsible `<details>`.
- **The buybox (`CourseDetails.astro`):** `item.pdp.buybox = { label, controls: [...] }`; each control is `{ type: 'pills'|'select', options: [{label, href?, selected?}], placeholder?, ariaLabel? }`. Pills render as `<span>`/`<a>` (`--selected` → teal fill), the select as a real `<select>` with a placeholder `<option>` + options (FGA L1's select has empty options today → placeholder-only, `aria-disabled`). The block renders under one `buybox.label`.
- **Consumers:** `Plp.astro` renders one `<QuickAddModal />` per PLP; PlpCard's quick-add `<button data-quick-add={item.id}>` triggers it. (No consumer change needed — the modal reads richer item data it already receives via `getItem`.)
- **Data:** products have `variants` + `sizeChart` (Toe Spacers, Foot Health Kit — byte-identical size data). Courses have `pdp.buybox`. Foot Fest has neither. `catalog.js` is the single source of truth.

## 3. Design

### 3.1 Responsive layout (the skeleton, shared by product + course)

The modal becomes a **flex layout that reflows by breakpoint** (viewport media query; the modal is fixed-position centred):

- **Desktop (≥768px):** `width: min(800px, 94vw)`. The top region is a **row**: a controls **column** (grows) on the left, a **square image** (~211px, `object-fit: cover`) on the right, `gap` ~48px, padding ~24px; the **close button** stays top-right (absolute). Inside the controls column (vertical gap ~48px): the **Title (h3, `--type-h3`) + Price (caption, uppercase, right-aligned)** row; then an **Options** block (vertical gap ~24px) holding the type-specific controls (§3.2/§3.3); then the **Quantity row** — the qty stepper and the Add-to-Cart button **side by side** (`gap ~12px`, `align-items: flex-end`), the button growing to fill.
- **Mobile (<768px):** `width: min(400px, 94vw)`. The top region is a **column**: image **on top**, then Title+Price, Options, Quantity — same order, stacked. Keep `max-height: 88vh; overflow-y: auto`.
- **Product size chart (§3.2)** sits **below** the top region, full modal width, at both breakpoints.

Tokens govern spacing/type/colour. Match the Figma padding/gaps (`--space-24`/`--space-48`/`--space-12` map to the repo's `--space-*`; confirm the exact repo token values at build). Keep the existing open/close transition + `prefers-reduced-motion` guard.

### 3.2 Product controls (`item.variants` + `item.sizeChart`)

- **Size:** label (caption, uppercase — e.g. "SIZE") + pills. Pills keep the existing single-select `data-quick-add-pill` mechanism (selected = teal fill/white; unselected = teal outline). Per Figma: `px ~24 / py ~12`, `--type-cta` semibold.
- **Size chart → always-visible full-width grid.** Replace the collapsible `<details>` with a **grid table** rendered below the top region whenever `item.sizeChart` exists: a header row (dark `--color-ink` background, white text) + data rows (bordered cells), columns from `item.sizeChart.columns`, rows from `item.sizeChart.rows`. Full modal width, horizontally scrollable on narrow screens (`overflow-x: auto`) so it never breaks the layout. The JS still populates it from data (no hardcoded rows).

### 3.3 Course controls (`item.pdp.buybox`) — rendered in the modal's JS

The modal's `populate()` renders the buybox **when `item.pdp?.buybox` exists**, mirroring `CourseDetails.astro`'s output so the modal and PDP are identical:

- Render the `buybox.label` (caption, uppercase — e.g. "COURSE TYPE"), then its `controls` in order:
  - **`type: 'pills'`** → a row of selectable pills (reuse the modal's pill styling + the `data-quick-add-pill` selection mechanism, extended per-control — see §3.4). Pre-select the option whose `selected: true` (falling back to the first) so Add-to-Cart always yields a valid line. `href`-bearing options are not expected in the modal (the modal's pills are selections, not links) — render them as selectable pills; if an option has `href`, ignore it in the modal context (the modal is a cart flow, not navigation) and note it.
  - **`type: 'select'`** → a real `<select>` styled as the Figma's bordered field with the placeholder `<option>` (e.g. "Location…") + the `options`. FGA L1's options are empty today → the select shows the placeholder only and is effectively a stub (matching the PDP; `aria-label` from `control.ariaLabel`). Non-emptiness guard: render the select iff it has a placeholder or options (mirrors the PDP's own control guard).
- **No size chart** for courses (they have no `sizeChart`).
- **Language group deferred** (§1): the modal renders only the controls present in the catalog buybox.

**Product vs course is mutually exclusive by data:** products have `variants` (+ `sizeChart`), courses have `pdp.buybox`. Render whichever the item has; an item with neither (e.g. Foot Fest today) shows just Title/Price/Qty/Add-to-Cart.

### 3.4 Selection state + cart line

Generalize the modal's single `state.variant` to **`state.selections`** — one entry per selectable control:
- **Product:** one size selection (the chosen pill).
- **Course:** one selection per `pills` control (pre-set from `selected`), plus the `select`'s current value.
- Each pills control's buttons carry a control key (e.g. `data-quick-add-pill` + a `data-control` index); the delegated click handler sets that control's selection and re-renders only that control's pressed state. The select's `change` is read at submit (add a `change` path to the existing keydown/click delegation, or read the select value directly in `submitAddToCart`).
- **Add-to-Cart** passes a readable selection summary to `addLine`'s `variant` field (the field is a single string): the joined selected pill labels (+ the select value if chosen), e.g. `"In-Person"` or `"Small"`. `id/title/price/qty/image/href` unchanged. The cart drawer + badge already reflect the line via the existing `cart:change` event.

### 3.5 Foot Health Kit copy

Add an optional catalog field on the `foot-health-kit` item — **`quickAddNote: 'Please select the Toe Spacer size for your kit'`**. The modal renders it (when present) as a short line **above the size selector**. It's per-item data (only the kit authors it), guarded so every other modal renders nothing there.

## 4. Accessibility & behavior (preserve what exists)

- **Keep the modal's existing behavior wholesale:** `role="dialog"`, `aria-modal`, the focus trap, Esc-to-close, scrim-click-close, the `hidden`/`inert`/`aria-hidden` open-state flips, and `resetQuickAdd()` on load + `astro:after-swap`. The redesign is layout + control rendering, not a rewrite of the interaction model.
- **The two delegated listeners stay the pattern.** New interactive elements (per-control pills, the select) are handled by the SAME delegated `click` (and the select via `change` or read-at-submit) — do NOT bind per-element listeners that would be lost on the next `populate()` innerHTML rewrite.
- Pills are `<button aria-pressed>`; the select is a native `<select>` with an accessible name; the size-chart is a real `<table>` with `<th scope>` headers.
- Focus order flows top→bottom through the controls column then the size chart; the close button is reachable. The initial focus target stays the first focusable (per the existing `openModal`).
- Reduced-motion: the existing open/close transition guard stays; the layout reflow is CSS, no new animation.

## 5. Verification

- **Per surface, both widths:** product modal (`/collections/all` → Toe Spacers, Foot Health Kit) vs `1062:21145`, and course modal (`/collections/courses-professionals` → an FGA course) vs `1062:21281` — landscape at ≥768px, portrait below. Confirm: image placement, size pills / buybox controls, Quantity + Add-to-Cart side by side, the always-visible size-chart grid (products) / no size chart (courses), and the Foot Health Kit helper copy.
- **Functional (live):** opening from a card, selecting a size / course-type, Add-to-Cart → the cart drawer opens with a line carrying the selection + qty + correct price; the badge updates; Esc / scrim / close all work; focus trap holds; open a modal, navigate (View Transition), open another — no leak/stale state.
- **Build/tests/links:** `npm run build` (41 pages), `npm run check:links` 0 broken, `npm test` green. If the buybox rendering warrants it, a small unit test for the selection-summary string is welcome, but the modal is DOM-heavy — visual + functional verification is primary.
- **Regression:** the PDP `CourseDetails` buybox is untouched (the modal mirrors it, doesn't share code) — confirm the course PDPs render unchanged. The cart.js contract (`addLine`) is unchanged.

## 6. Open items

- Exact spacing/type tokens + the select's chevron asset come from `get_design_context` at build (§3.1–3.3); the `~` values here are the Figma pixel intents, mapped to repo `--space-*`/`--type-*`.
- The responsive breakpoint (~768px) is a starting point; tune so the 800px landscape modal never overflows small tablets and the portrait switch feels right — confirm in the live pass.
- The course cart line's `variant` summary string format (§3.4) — a readable join is fine for the reference build; the Shopify port will map selections to real variant/line-property fields.
- **Deferred to the course-PDP feedback batch:** the "Language" buybox group (needs the multi-labeled-group buybox generalization + course data + a PDP change) — see §1.
- **Foot Fest modal** stays deferred to Chunk C.
