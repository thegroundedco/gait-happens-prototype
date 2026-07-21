# Gait Happens — Custom dropdown component — design

**Date:** 2026-07-21
**Project:** Gait Happens Web Migration (Phase 2) — client Prototype Feedback Batch 2.
**Repo:** `…\04_Website\00_Claude`; branch off `master` (@ `cc3cc69`). GitHub `thegroundedco/gait-happens-web` (private).

> Batch 2 source: `C:\Obsidian Vault\Design Thinking\02 Work\Grounded\Clients\GH, Prototype Feedback.md`. This is the "custom dropdown" item (the modal pills + ComparisonChart items already merged in `cc3cc69`).

---

## 1. Purpose & scope

The site's native `<select>` dropdowns don't reflect the design system, and the client wants them to look and behave like the **account dropdown** (`AccountMenu.astro`) — a styled panel with a hover-highlighted menu. This builds a **custom dropdown** that replaces the native selects.

**Targets (all native `<select>`s become custom dropdowns):**
1. `FilterSortBar.astro` — the PLP **Availability / Price / Sort by** selects (real placeholder options; visual-only, not wired to filtering).
2. `QuickAddModal.astro` — the course **Location** select, built at runtime via `innerHTML` in `renderBuyboxControl` (an empty-options stub today).
3. `CourseDetails.astro` — the course PDP **Location** select (SSR, empty stub).

**Non-goals:** wiring real filter/sort/location logic (these stay non-functional placeholders in this reference build). No change to the account dropdown itself.

**Success criteria**
- Every targeted `<select>` renders as a custom dropdown matching the account-menu style (white panel, box-shadow, yellow/teal hover-highlighted options, a chevron trigger).
- Keyboard- and screen-reader-operable (no accessibility regression from native selects).
- Empty selects (the Location stubs) render as a **disabled placeholder** trigger (visible, not openable).
- The trigger accent and the option-hover **always share the same colour** (teal ↔ teal, yellow ↔ yellow).
- Build clean, `check:links` 0 broken, tests green, and a live keyboard + mouse pass across PLP / modal / PDP at both widths.

## 2. Current state (from the code)

- **`AccountMenu.astro`** (the reference) — a `<div class="acct" data-util-panel="account" hidden>` with a `<ul>` of `<a>` items (`label` + `<small>note`); white rounded panel, box-shadow, `min-width:240px`; `.acct a:hover { background: var(--color-yellow) }`. Toggled by `Header.astro`'s `[data-util="account"]` button (`aria-expanded`, `aria-controls`), which flips `panel.hidden`; closed on Escape/outside-click via `closeOverlays()`, mutually exclusive with the mega/search panels. It's a **link menu**, not a value selector.
- **`FilterSortBar.astro`** — 3 native `<select class="filter-sort__select" aria-label="…">` (Availability, Price, Sort by) with real placeholder `<option>`s; the comment states they're visual-only.
- **`QuickAddModal.astro`** — `renderBuyboxControl` builds `<select class="quick-add-modal__select" data-quick-add-select aria-label="Location" aria-disabled>` via `innerHTML` (placeholder-only options today). Injected at modal-open time; **not an SSR element** (this is why a plain Astro component can't cover it).
- **`CourseDetails.astro`** — an SSR `.course-details__select` Location `<select>` (placeholder-only stub).
- **Tokens:** `--color-teal #047791`, `--color-yellow #FEC745`, `--color-paper`, `--color-ink`, `--color-border`; motion `--motion-fast`/`--ease-standard`.

## 3. Design

### 3.1 Architecture — a progressive-enhancement module

A single framework-free script, **`src/scripts/custom-select.js`**, exporting `enhanceSelects(root = document)`. It:
- Finds every `<select data-custom-select>` under `root` that is not already enhanced (guarded by a flag so it's idempotent).
- Builds a custom dropdown UI as a sibling and hides the native `<select>` (`aria-hidden`, visually hidden) — the native select **stays in the DOM as the value holder + fallback**.
- Is called on initial load, on `astro:after-swap`, and **by the modal right after it injects its Location select** — so the same implementation enhances the SSR selects (PLP, PDP) and the runtime-injected modal one.

Loaded once site-wide (imported from `BaseLayout.astro`), with module-scope listeners bound once (leak-free across the ClientRouter, the same idiom Header/ProductDetails use). The modal imports `enhanceSelects` and calls it in `populate()` after building the buybox.

### 3.2 Component structure (per enhanced select)

- **Trigger** — `<button type="button" class="cselect__trigger" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="<panel-id>">` showing the selected option's text (or the placeholder) + a chevron. Reflects the native select's `aria-label`.
- **Panel** — `<ul class="cselect__panel" role="listbox" id="<panel-id>" hidden>` styled like the account menu (white, box-shadow, rounded, absolute), with one `<li role="option" id="…" aria-selected>` per real option; the current option is `aria-selected="true"`.
- **Native select** — kept, `class="cselect__native"`, visually hidden + `aria-hidden="true"`. Selecting an option sets `native.value` and dispatches a `change` event (so any future wiring works). One `.cselect` wrapper holds all three.

### 3.3 Behavior & keyboard (WAI-ARIA select-only combobox)

- **Open:** click the trigger, or Enter / Space / ↓ / ↑ when focused → show the panel, `aria-expanded="true"`, close any other open custom-select first. Active option = the selected one (or the first).
- **Navigate:** ↑/↓ move the active option (tracked with `aria-activedescendant` on the trigger + a `.is-active` class); Home/End jump to first/last.
- **Select:** click an option, or Enter on the active option → set the value, update the trigger text + `aria-selected`, close, return focus to the trigger.
- **Close:** Escape, outside-click, or blur → hide, `aria-expanded="false"`, focus stays on / returns to the trigger.
- **Reduced motion:** the chevron rotation + any panel transition are guarded by `prefers-reduced-motion`.

### 3.4 Disabled / empty state

A `<select>` with no real options (only a disabled placeholder — the Location stubs) enhances to a **disabled trigger**: it shows the placeholder text ("Location…"), is styled muted (`--color-border` text), carries `aria-disabled="true"`, and does **not** open. Disabled is determined by the native select having 0 selectable options **or** carrying the native `disabled` attribute — the `data-custom-select` value is reserved for the colour variant (§3.5), so the two signals never collide.

### 3.5 Colour variant — trigger and hover always match

The dropdown takes a colour variant via `data-custom-select="teal"` or `data-custom-select="yellow"` (bare `data-custom-select` = the default). The variant colours **both** the trigger accent (its border/focus/chevron, or fill) **and** the option hover/active highlight, from one source so they can never diverge:
- **teal** → option hover/active = `--color-teal` bg + `--color-paper` text; trigger accent teal.
- **yellow** → option hover/active = `--color-yellow` bg + `--color-ink` text (the account-menu look); trigger accent yellow.

Implemented with a CSS custom property on the wrapper (e.g. `.cselect--teal { --cselect-accent: var(--color-teal); --cselect-hover-text: var(--color-paper) }` and `--yellow` its counterpart), so a single `--cselect-accent`/`--cselect-hover-text` pair drives the trigger and the options. Each consumer sets the variant to match its own button colour (the client's rule: "if the button is teal, the hover is teal; if yellow, yellow"). Default variant = **yellow** (matches the account menu); the exact per-consumer assignment is confirmed in the live pass.

### 3.6 Style

Match the account menu: panel `background: var(--color-paper)`, `box-shadow: 0 8px 24px rgba(0,0,0,.18)`, `border-radius: 6px`, `min-width` matching the trigger; options are flex rows with `padding: var(--space-3)`, `border-radius: 4px`, hover/active per §3.5. The trigger is a bordered DS field (border `--color-border`, `--color-paper` bg, padding matching the native select it replaces) + a chevron that rotates on open. Panel positioned absolutely under the trigger (`position: relative` on the wrapper).

### 3.7 Consumers

- **`FilterSortBar.astro`** — add `data-custom-select` (+ variant) to its 3 selects.
- **`CourseDetails.astro`** — add `data-custom-select` (+ variant) to the Location select.
- **`QuickAddModal.astro`** — `renderBuyboxControl` adds `data-custom-select` (+ variant) to the injected `<select>`; `populate()` calls `enhanceSelects(modalRoot)` after building the buybox. The enhancer must also **re-sync / re-enhance** when the modal re-populates (idempotent + handles the select being replaced).
- **`BaseLayout.astro`** — import + run `enhanceSelects()` on load + `astro:after-swap`.

## 4. Accessibility

- The custom dropdown is a real, focusable, keyboard-operable **combobox/listbox** (roles, `aria-expanded`, `aria-activedescendant`, `aria-selected`), announced to screen readers; the native select is `aria-hidden` value-holder only (no double announcement).
- Focus is visible on the trigger and moves correctly on open/close (returns to the trigger on select/close).
- Colour contrast: teal-hover uses white text (AA on teal); yellow-hover uses ink text (AA on yellow — the account-menu pairing).
- Disabled dropdowns expose `aria-disabled` and are not focusable-into-open.
- Reduced-motion guards the chevron/panel motion.
- **No JS fallback:** if the script fails, the native `<select>` is still present and operable (it's only hidden by the enhancer once it succeeds) — same "enhance, don't replace" resilience as the rest of the site's JS.

## 5. Verification

- **Build/tests/links:** `npm run build` (41 pages), `npm run check:links` 0 broken, `npm test` (28 — plus, if practical, a small `node --test` for the enhancer's pure logic, e.g. option-list building / disabled detection; UI/keyboard is verified live).
- **Live browser pass** (controller, both widths): on a PLP — the 3 filter/sort selects open as styled panels, mouse + keyboard (Tab, ↑/↓, Enter, Esc) select and update the trigger, the hover highlight is the variant colour; on the quick-add modal (a course) — the Location dropdown renders enhanced (disabled placeholder, empty), and re-enhances cleanly each open; on a course PDP — the Location dropdown same. Confirm the trigger colour and hover colour match on every instance, and that a keyboard-only user can operate each.

## 6. Out of scope / flagged

- Real filter/sort/location functionality (placeholders remain).
- The account dropdown component itself (unchanged; it already uses the yellow-hover style this mirrors).
- The sitewide real-images pass (the other remaining Batch 2 item) — separate.
