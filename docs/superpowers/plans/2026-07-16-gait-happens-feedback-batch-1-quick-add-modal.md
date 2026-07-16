# Gait Happens — Feedback Batch 1, Chunk 3b: Quick-add modal redesign (implementation plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the PLP quick-add modal to the Figma — responsive landscape/portrait layout, always-visible full-width size chart for products, and course buybox controls for courses — while preserving the modal's existing interaction model.

**Architecture:** `src/components/plp/QuickAddModal.astro` is one file (SSR-stable markup + a co-located client `<script>` + scoped CSS), a single instance per PLP populated at runtime via `getItem(id)` + `addLine` (cart.js). This chunk reworks its layout (CSS + some markup), converts the size chart to an always-visible grid, and adds course-buybox rendering to `populate()` with a per-control selection map. The PDP `CourseDetails.astro` is NOT touched — the modal MIRRORS its buybox output from the same `item.pdp.buybox` data.

**Tech Stack:** Astro, vanilla JS (no framework, no new deps), hand-authored CSS from tokens.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-16-gait-happens-feedback-batch-1-quick-add-modal-design.md`. **Figma:** file `FX7PDNvhZwyozODaq8Q8i7`, component-set `1078:16015` — **product Toe Spacers desktop `1062:21145`, course FGA desktop `1062:21281`, mobile variants under `1078:16077`.**
- **ONE file changes for the modal itself: `src/components/plp/QuickAddModal.astro`.** Task 3 also adds one catalog field. `Plp.astro`, `PlpCard.astro`, and the PDP `CourseDetails.astro` are NOT touched.
- **PRESERVE the modal's interaction model wholesale:** `role="dialog"` / `aria-modal`, the focus trap, Esc-to-close, scrim-click-close, the `hidden`/`inert`/`aria-hidden` open-state flips, `openModal`/`closeModal`, and `resetQuickAdd()` on load + `astro:after-swap` (leak-free across View Transitions). The **two document-level delegated listeners** (`click`, `keydown`) stay the ONLY event-binding pattern — do NOT add per-element listeners that a later `populate()` innerHTML rewrite would orphan. A `<select>`'s value is read at submit (or via a delegated `change` listener if you add one — keep it document-level).
- **Product vs course is mutually exclusive by data:** products have `item.variants` (+ `item.sizeChart`); courses have `item.pdp.buybox`. Render whichever exists; an item with neither (Foot Fest today) shows just Title/Price/Qty/Add-to-Cart.
- **Course controls MIRROR `CourseDetails.astro`** (read it): `item.pdp.buybox = { label, controls: [{ type: 'pills'|'select', options: [{label, href?, selected?}], placeholder?, ariaLabel? }] }`. Render the same controls the PDP renders. A `pills` option's `href` is ignored in the modal (the modal is a cart flow, not navigation).
- **Deferred:** the **Foot Fest** bespoke modal (Chunk C); the **"Language" buybox group** (needs a multi-labeled-group buybox generalization + course-data + a PDP change → the course-PDP feedback batch). The modal renders only the controls present in the catalog buybox (FGA = Course Type only).
- **Figma-verbatim layout/spacing/type.** `get_design_context` on the desktop + mobile nodes before building; verify at both widths. Tokens govern colour/type/spacing (`--type-h3` title, `--type-cta` pills, `--color-teal` fill, `--color-ink` size-chart header, `--space-*`; the Figma's `--space-24`/`--space-48`/`--space-12`/`--space-16`/`--space-20` map to the repo's `--space-*` — confirm exact repo px at build).
- **Per-task verification:** `npm run build` (41 pages — confirm `find dist -name index.html | wc -l`; a transient `.astro/.prerender` EBUSY on exit is benign, trust the count), `npm run check:links` (0 broken; needs port 4321 free — stop any dev/preview server first; a low ~62 count is a flaky cold-start, re-run for ~105), `npm test` (28). Commit per task, conventional messages. Live browser QA is the controller's (the modal is DOM/interaction-heavy; subagents can't reliably drive host Chrome — say so, don't fake it).

## File Structure

```
src/components/plp/QuickAddModal.astro   Tasks 1-3 — MODIFY: layout, size-chart grid, buybox rendering, selection map, cart line
src/data/catalog.js                       Task 3 — MODIFY: foot-health-kit `quickAddNote`
```

Unchanged: `Plp.astro`, `PlpCard.astro`, `pdp/CourseDetails.astro`, `scripts/cart.js`.

---

### Task 1: Responsive layout + always-visible size-chart grid (product modal fidelity)

**Files:**
- Modify: `src/components/plp/QuickAddModal.astro` (markup + CSS; minimal JS — the size-chart populate() switches from `<details>` to grid rows)

**Interfaces:**
- Produces: the new modal skeleton — a top region (`.quick-add-modal__top`) that is a **row at ≥768px** (controls column left, image right) and a **column below** (image top); a controls column holding Title+Price, an Options block, and a Quantity row where the **stepper and Add-to-Cart sit side by side**; and a **`.quick-add-modal__sizechart` full-width grid section** below the top region (always visible when `item.sizeChart` exists). Task 2 renders the buybox INTO the Options block; the same `[data-quick-add-pills]`/`[data-quick-add-variants]` container the size selector uses is where course controls also mount (or an adjacent `[data-quick-add-buybox]` container — your choice, but keep the Options block the single mount point).

- [ ] **Step 1: Pull the Figma.** `get_design_context` on `1062:21145` (product desktop) and a mobile variant (`1078:16077`). Confirm the desktop landscape structure: top row = `[Product Details column ~493px | gap ~48px | square image ~211px]`, close top-right; the column = Title(h3)+Price(caption uppercase, right) → Options(gap ~24px: Size label+pills) → Quantity row (stepper 168px + Add-to-Cart, side by side, `align-items:flex-end`, gap ~12px, button grows). Below the top row = the size-chart grid (5-col here, dark header `--color-ink`/white, bordered cells). Mobile = same, image on top, portrait ~350px.

- [ ] **Step 2: Restructure the markup.** Rework the modal body so:
  - The image + controls live in a `.quick-add-modal__top` region; the image is `.quick-add-modal__media`, the controls a `.quick-add-modal__panel`.
  - The panel: `.quick-add-modal__title` (keep `id="quick-add-title"` + `data-quick-add-title`) sits in a title+price row with `.quick-add-modal__price` (`data-quick-add-price`).
  - An Options block wraps the existing `[data-quick-add-variants]` (size label + `[data-quick-add-pills]`).
  - The Quantity row wraps the existing qty stepper AND the `[data-quick-add-submit]` Add-to-Cart button, side by side.
  - Move the size chart OUT of the `<details>` into a `.quick-add-modal__sizechart` `<div>` (with `data-quick-add-sizechart` on it, kept `hidden` until populated) containing a `<table>` with `<thead data-quick-add-sizechart-head>` + `<tbody data-quick-add-sizechart-body>` — a real table, full width, `overflow-x:auto` wrapper. Drop the `<summary>Size chart</summary>` and the `<details>` open/close.
  - Keep the close button, the scrim, and all `data-quick-add-*` hooks the script references.

- [ ] **Step 3: The responsive CSS.** Replace the portrait-only layout:
  - `.quick-add-modal { width: min(800px, 94vw); }` (was `min(420px, 92vw)`), keep `max-height:88vh; overflow-y:auto` and the centred fixed position + open transition + reduced-motion guard.
  - `.quick-add-modal__top { display:flex; flex-direction:column; gap:…; padding:var(--space-… ~24); }` and at **`@media (min-width:768px)`** `{ flex-direction:row; align-items:flex-start; gap:var(--space-… ~48); }`.
  - `.quick-add-modal__media` — mobile: full width square on top; desktop: fixed ~211px square on the right (`flex:0 0 auto`), `object-fit:cover`.
  - `.quick-add-modal__panel { flex:1 1 auto; display:flex; flex-direction:column; gap:var(--space-… ~48); }`.
  - Title+price row: `display:flex; justify-content:space-between; gap`; title `font:var(--type-h3)`; price caption uppercase.
  - Options block: `display:flex; flex-direction:column; gap:var(--space-… ~24)`.
  - Quantity row: `display:flex; align-items:flex-end; gap:var(--space-… ~12)`; the Add-to-Cart button `flex:1 1 0` (grows). Keep the existing stepper CSS.
  - Size-chart grid: `.quick-add-modal__sizechart` full width; the `<table>` with a header row (`th` `background:var(--color-ink); color:var(--color-paper)`), bordered `td`s (`--color-border`), `--type-label`/`--type-body-sm`; wrapper `overflow-x:auto`. Remove the old `<details>`/`summary` CSS.
  - Keep the existing pill CSS (`.quick-add-modal__pill` selected teal/white, outline teal) — Task 2 reuses it.

- [ ] **Step 4: Size-chart populate() → grid.** In the client script's `populate()`, the size-chart branch already writes `thead`/`tbody` innerHTML from `item.sizeChart.columns`/`.rows` — keep that, but target the new `data-quick-add-sizechart` div and toggle its `hidden` (no more `.open` on a `<details>`). Everything else in `populate()` (title/price/image/variant pills/qty) stays for now (course buybox is Task 2).

- [ ] **Step 5: Verify.** `npm run build` (41 pages), `npm run check:links` 0 broken, `npm test` 28. Grep the built modal markup on a PLP (`dist/collections/all/index.html`): confirm `.quick-add-modal__top`, `.quick-add-modal__panel`, the Quantity row containing both the stepper and `data-quick-add-submit`, and the `.quick-add-modal__sizechart` `<table>` (no `<details>`/`<summary>`). Report that the live both-widths product-modal Figma pass (Toe Spacers) is the controller's.

- [ ] **Step 6: Commit.**

```bash
git add src/components/plp/QuickAddModal.astro
git commit -m "feat(quick-add): responsive landscape/portrait layout + always-visible size chart"
```

---

### Task 2: Course buybox controls + per-control selection state

**Files:**
- Modify: `src/components/plp/QuickAddModal.astro` (the client `<script>`: `populate()`, `state`, the delegated click handler, `submitAddToCart`; + buybox mount markup/CSS if needed)

**Interfaces:**
- Consumes: the Options block + panel from Task 1.
- Produces: `populate()` renders `item.pdp.buybox` when present (mirroring `CourseDetails.astro`); `state.selections` (an object/array keyed by control index) replaces the single `state.variant`; Task 3 reads `state.selections` to build the cart-line summary.

Read `src/components/pdp/CourseDetails.astro`'s buybox rendering first (the `buybox`/`buyboxControls`/`showBuybox` block and the `.course-details__tier` markup) — the modal mirrors it.

- [ ] **Step 1: Pull the Figma.** `get_design_context` on `1062:21281` (FGA course desktop). Confirm: same skeleton as the product modal, with the buybox replacing size — a `buybox.label` caption (e.g. "COURSE TYPE") then its controls: a pills row (Online On-Demand / In-Person, one selected teal) and a `Location…` `<select>` (bordered field + chevron). No size chart. Note the select field's border/padding/chevron.

- [ ] **Step 2: Generalize the selection state.** Replace `state.variant` (single) with `state.selections` — a per-control map. Define the shape: for products, one entry (the size); for courses, one entry per `pills` control + the select's value. E.g.:

```js
// state.selections: { [controlKey]: selectedLabel }
// products use controlKey 'variant'; courses use controlKey `c${index}` per pills control,
// and the <select> is read at submit (its DOM value), not stored in selections.
const state = { item: null, selections: {}, qty: 1, trigger: null };
```
Update `renderPillPressedState` / `selectVariant` (or add `selectPill(controlKey, value)`) to set `state.selections[controlKey]` and re-render only that control's pressed state (pills carry `data-control` = the key + `data-quick-add-pill` = the value). The product size pills become control `variant`.

- [ ] **Step 3: Render the buybox in populate().** Extend `populate(item)`:
  - Keep the product path: if `item.variants`, render the size label + pills as control `variant`, pre-select `options[0]`.
  - Add the course path: if `item.pdp?.buybox`, render the buybox into the Options block — the `buybox.label` caption, then each control:
    - `type: 'pills'` → a pills row; each `<button class="quick-add-modal__pill" data-control="cN" data-quick-add-pill="<label>" aria-pressed=…>`; pre-select the `selected:true` option (fallback first); set `state.selections['cN']`.
    - `type: 'select'` → a native `<select class="quick-add-modal__select" data-quick-add-select aria-label="<ariaLabel ?? buybox.label>">` with a placeholder `<option value="" selected disabled hidden>` + the `options`. Render the select only if `placeholder || options.length` (mirror the PDP guard). Empty options (FGA) → placeholder-only stub.
  - Escape all interpolated strings via the existing `escapeHtml`.
  - Guard so an item with NEITHER `variants` NOR `pdp.buybox` renders no controls (the Options block just holds the qty row).

- [ ] **Step 4: Wire the delegated click for per-control pills.** The existing delegated `click` handler catches `[data-quick-add-pill]`; update it to read `data-control` too and call `selectPill(control, value)`. No per-element listeners. The `<select>` value is read at submit (Task 3) or via a document-level `change` listener if you prefer — keep it delegated.

- [ ] **Step 5: Verify.** `npm run build` (41 pages), `npm run check:links` 0 broken, `npm test` 28. Grep the built page: the modal still SSR-renders empty control containers (the buybox is JS-populated at open, so the static HTML won't show FGA controls — confirm the SIZE/variant SSR markup is intact and the script references are present). **Regression:** confirm `pdp/CourseDetails.astro` is NOT in the diff (the PDP buybox is untouched; the modal mirrors it). Report that the live course-modal Figma pass (open an FGA card, see Course Type pills + Location select, no size chart) is the controller's.

- [ ] **Step 6: Commit.**

```bash
git add src/components/plp/QuickAddModal.astro
git commit -m "feat(quick-add): course buybox controls + per-control selection state"
```

---

### Task 3: Foot Health Kit copy + cart-line selection summary

**Files:**
- Modify: `src/data/catalog.js` (foot-health-kit item), `src/components/plp/QuickAddModal.astro` (`populate()` renders the note; `submitAddToCart` builds the selection summary)

**Interfaces:**
- Consumes: `state.selections` (Task 2).

- [ ] **Step 1: Add the catalog field.** On the `foot-health-kit` item in `src/data/catalog.js`, add `quickAddNote: 'Please select the Toe Spacer size for your kit'`. (The kit ships with toe spacers, hence the size selector + this note.) No other item authors it.

- [ ] **Step 2: Render the note.** Add a `.quick-add-modal__note` element (with `data-quick-add-note`) in the modal markup, positioned **above the size selector** inside the Options block, `hidden` by default. In `populate()`: if `item.quickAddNote`, set its text and unhide it; else clear + hide. Style it as a short helper line (`--type-body-sm` or `--type-caption`, `--color-ink-70`). Guard so every non-kit modal renders nothing there.

- [ ] **Step 3: Cart-line selection summary.** In `submitAddToCart`, build a readable summary string from `state.selections` (the selected pill labels, in control order) plus the `<select>`'s current value if one is chosen (read `document.querySelector('[data-quick-add-select]')?.value` — skip the empty placeholder value). Pass it as `addLine`'s `variant` field:

```js
function selectionSummary() {
  const pillParts = Object.values(state.selections).filter(Boolean);
  const sel = document.querySelector('[data-quick-add-select]');
  const selVal = sel && sel.value ? sel.value : null;
  return [...pillParts, selVal].filter(Boolean).join(' / ') || null;
}
```
`addLine({ id, title, variant: selectionSummary(), price, qty, image, href })`. Products yield e.g. `"Small"`; courses e.g. `"In-Person"` (Location empty today → omitted). Everything else in `submitAddToCart` (close + open cart drawer) stays.

- [ ] **Step 4: Verify.** `npm run build` (41 pages), `npm run check:links` 0 broken, `npm test` 28. Grep the built page confirming `data-quick-add-note` is present in the SSR markup (hidden). Report that the live pass — Foot Health Kit modal shows the note; adding a sized product / a course to cart yields a line with the selection summary — is the controller's.

- [ ] **Step 5: Commit.**

```bash
git add src/components/plp/QuickAddModal.astro src/data/catalog.js
git commit -m "feat(quick-add): foot health kit helper copy + cart-line selection summary"
```

---

### Task 4: Verification sweep

**Files:** none (or `.superpowers/sdd/progress.md`).

- [ ] **Step 1: Full sweep.** Stop any dev/preview server; free port 4321. Run and paste actual output: `npm run build` (confirm 41 pages), `npm run check:links` (0 broken; re-run if a low count appears), `npm test` (28).
- [ ] **Step 2: Interaction-model regression (grep).** Confirm the modal STILL has: `role="dialog"`, `aria-modal="true"`, the scrim, the close button, `data-quick-add-submit`, and that the client script still registers exactly the two document-level listeners (`click`, `keydown`) + `resetQuickAdd` on load + `astro:after-swap`. Confirm `pdp/CourseDetails.astro`, `Plp.astro`, `PlpCard.astro`, `scripts/cart.js` are NOT in the branch diff (`git diff --name-only master...HEAD`).
- [ ] **Step 3: Both-modal render check.** Grep the built PLP: the SSR modal has the new `.quick-add-modal__top`/`__panel`/`__sizechart` structure, the Quantity row holds the stepper + Add-to-Cart, and `data-quick-add-note` exists. (Course buybox + size-chart rows are JS-populated at open, so they won't appear in static HTML — that's expected.)
- [ ] **Step 4: Update `.superpowers/sdd/progress.md`** with the outcome, the deferred items (Foot Fest modal → Chunk C; Language group → course-PDP batch), and anything found.
- [ ] **Step 5: Commit** if the ledger is tracked (it's gitignored here — likely a no-op; report that).

---

## Definition of done

- Product quick-add modals match `1062:21145` (landscape desktop image-right / portrait mobile image-top; size pills; Quantity + Add-to-Cart side by side; always-visible full-width size-chart grid).
- Course quick-add modals match `1062:21281` (buybox: Course Type pills + Location select; no size chart) — identical to the PDP's controls from the same data.
- The Foot Health Kit modal shows the helper copy; Add-to-Cart records the selection summary; the cart drawer + badge update.
- The modal's focus-trap / Esc / scrim / leak-free-across-View-Transitions interaction model is preserved; the two delegated listeners are the only bindings; PDP/consumers/cart.js untouched.
- Build 41 pages, `check:links` 0 broken, tests 28, live both-widths + functional browser pass on a product and a course modal.
- Foot Fest modal + Language group remain deferred.
