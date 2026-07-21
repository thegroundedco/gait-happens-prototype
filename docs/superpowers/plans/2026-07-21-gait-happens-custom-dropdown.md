# Custom Dropdown Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's native `<select>` dropdowns with a styled custom combobox/listbox that matches the account menu (white hover-panel), built as a progressive enhancement so the same implementation covers the SSR selects and the runtime-injected modal one.

**Architecture:** One framework-free module (`src/scripts/custom-select.js`) exports `enhanceSelects(root)`, which upgrades every `<select data-custom-select>` into a wrapper + trigger button + listbox panel and hides the native select (kept as an `aria-hidden` value holder that the custom UI syncs via `.value` + a `change` event). Styling lives in one global stylesheet (`src/styles/custom-select.css`) so it reaches the JS-built and innerHTML-injected elements that Astro's scoped styles never touch. The module runs on load + `astro:after-swap` (site JS idiom, see `motion.js`); the quick-add modal calls `enhanceSelects` on the Location select it injects at `populate()` time.

**Tech Stack:** Astro 7 (static), hand-authored CSS from `src/styles/tokens.css`, vanilla ES modules, `node --test` (no jsdom — pure helpers are extracted and unit-tested; DOM/keyboard behavior is verified live).

## Global Constraints

- **Colour variant, single source:** each dropdown's trigger accent and option-hover MUST come from one `--cselect-accent` / `--cselect-hover-text` pair per variant, so they can never diverge. `teal` → hover bg `var(--color-teal)` + text `var(--color-paper)`; `yellow` → hover bg `var(--color-yellow)` + text `var(--color-ink)`. Variant read from `data-custom-select` value; bare/unknown → `yellow` (the account-menu default the client pointed at).
- **All targeted consumers default to `data-custom-select="yellow"`** (faithful to the referenced account menu). The `teal` variant is implemented + unit-tested and is a one-word change per instance; the live pass confirms whether any instance should be flipped to teal.
- **Empty selects → disabled placeholder:** a select whose every option is `disabled` (the `Location…` placeholder is `disabled hidden`) or that has none, OR that carries the native `disabled` attribute, renders a muted, non-opening trigger showing the placeholder text, with `aria-disabled="true"`.
- **Enhance, don't replace:** the native `<select>` stays in the DOM (`display:none`, `aria-hidden="true"`, `tabindex="-1"`) as the value holder + no-JS fallback. Selecting an option sets `native.value` and dispatches a bubbling `change` event. NEVER remove existing classes/attributes from the native select (e.g. the modal's `data-quick-add-select`, read by `selectionSummary()`).
- **Accessibility (WAI-ARIA select-only combobox):** trigger is `role="combobox" aria-haspopup="listbox" aria-expanded`; panel is `role="listbox"`; options are `role="option" aria-selected`; keyboard nav via `aria-activedescendant`. Keys: Enter/Space/↓/↑ open; ↑/↓/Home/End navigate (no wrap); Enter selects; Escape / outside-click / Tab close; focus returns to the trigger on select/close.
- **Reduced motion:** the chevron rotation is guarded by `prefers-reduced-motion: reduce`.
- **Module import-safety:** all DOM bootstrapping (document listeners, initial run) MUST be wrapped in `typeof document !== 'undefined'` so `node --test` can import the pure helpers without a `document is not defined` ReferenceError.
- **Tokens only:** use existing tokens (`--color-teal`/`--color-yellow`/`--color-paper`/`--color-ink`/`--color-border`, `--space-2/3/4`, `--type-body-16`/`--type-label`/`--type-caption`, `--tracking-caption`, `--motion-fast`/`--ease-standard`). No new tokens, no hardcoded hex (the box-shadow `rgba(0,0,0,.18)` matches AccountMenu.astro verbatim).
- **Verification floor:** `npm run build` → 41 pages; `npm run check:links` → 0 broken; `npm test` → all pass (28 existing + the new file). No regression to the account menu, the modal's pills/size-chart, or the PLP/PDP layouts.

---

## File Structure

- **Create `src/scripts/custom-select.js`** — the enhancer. Pure helpers (`resolveVariant`, `isDisabledOptions`, `nextActiveIndex`) + DOM builders (`enhanceSelects`, `buildDropdown`, `wireInstance`, `closeOpenDropdown`) + guarded bootstrap. One responsibility: turn marked native selects into custom dropdowns.
- **Create `src/styles/custom-select.css`** — all dropdown styling (global). Wrapper/native/trigger/chevron/panel/option, the two colour variants, the compact size, reduced-motion guard.
- **Create `tests/custom-select.test.mjs`** — `node --test` unit tests for the three pure helpers.
- **Modify `src/layouts/BaseLayout.astro`** — import the CSS (frontmatter) and the script (body), mirroring `global.css` / `motion.js`.
- **Modify `src/components/plp/FilterSortBar.astro`** — mark the 3 selects (`data-custom-select="yellow"` + `data-cselect-size="compact"`).
- **Modify `src/components/pdp/CourseDetails.astro`** — mark the Location select (`data-custom-select="yellow"`).
- **Modify `src/components/plp/QuickAddModal.astro`** — mark the injected select in `renderBuyboxControl`, import `enhanceSelects`, call it in `populate()` after the buybox innerHTML write.

---

### Task 1: Enhancer module + styles + unit tests + BaseLayout wiring

**Files:**
- Create: `src/scripts/custom-select.js`
- Create: `src/styles/custom-select.css`
- Create: `tests/custom-select.test.mjs`
- Modify: `src/layouts/BaseLayout.astro` (add CSS import at frontmatter, script import in body)

**Interfaces:**
- Consumes: nothing (leaf module).
- Produces:
  - `enhanceSelects(root = document): void` — enhances every not-yet-enhanced `select[data-custom-select]` under `root`. Idempotent (guards on `dataset.cselectEnhanced`). Imported by QuickAddModal in Task 3.
  - `resolveVariant(value: string|undefined): 'teal'|'yellow'`
  - `isDisabledOptions(opts: {disabled:boolean}[]): boolean`
  - `nextActiveIndex(current: number, count: number, key: string): number`
  - CSS classes consumed by Tasks 2–3 markup: none (consumers only add `data-custom-select` / `data-cselect-size` attributes; all classes are created by the enhancer).

- [ ] **Step 1: Write the failing test**

Create `tests/custom-select.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveVariant, isDisabledOptions, nextActiveIndex } from '../src/scripts/custom-select.js';

test('resolveVariant returns teal only for exact "teal", else yellow', () => {
  assert.equal(resolveVariant('teal'), 'teal');
  assert.equal(resolveVariant('yellow'), 'yellow');
  assert.equal(resolveVariant(''), 'yellow');
  assert.equal(resolveVariant(undefined), 'yellow');
  assert.equal(resolveVariant('TEAL'), 'yellow');
});

test('isDisabledOptions is true when no option is selectable', () => {
  // Empty, and placeholder-only (disabled) — both disabled.
  assert.equal(isDisabledOptions([]), true);
  assert.equal(isDisabledOptions([{ disabled: true }]), true);
  // At least one non-disabled option -> enabled.
  assert.equal(isDisabledOptions([{ disabled: true }, { disabled: false }]), false);
  assert.equal(isDisabledOptions([{ disabled: false }]), false);
});

test('nextActiveIndex navigates without wrapping and honours Home/End', () => {
  // ArrowDown clamps at last; from -1 (nothing active) -> 0.
  assert.equal(nextActiveIndex(-1, 3, 'ArrowDown'), 0);
  assert.equal(nextActiveIndex(0, 3, 'ArrowDown'), 1);
  assert.equal(nextActiveIndex(2, 3, 'ArrowDown'), 2);
  // ArrowUp clamps at 0; from -1 -> last.
  assert.equal(nextActiveIndex(-1, 3, 'ArrowUp'), 2);
  assert.equal(nextActiveIndex(2, 3, 'ArrowUp'), 1);
  assert.equal(nextActiveIndex(0, 3, 'ArrowUp'), 0);
  // Home/End.
  assert.equal(nextActiveIndex(2, 3, 'Home'), 0);
  assert.equal(nextActiveIndex(0, 3, 'End'), 2);
  // Empty list -> -1; unrelated key is a no-op.
  assert.equal(nextActiveIndex(0, 0, 'ArrowDown'), -1);
  assert.equal(nextActiveIndex(1, 3, 'x'), 1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '../src/scripts/custom-select.js'` (file not created yet).

- [ ] **Step 3: Create the enhancer module**

Create `src/scripts/custom-select.js`:

```js
// Progressive enhancement: upgrade native <select data-custom-select> into a
// styled combobox/listbox matching AccountMenu.astro (white hover-panel,
// chevron trigger, yellow/teal option hover). The native <select> STAYS in the
// DOM (display:none via .cselect__native, aria-hidden, tabindex=-1) as the
// value holder + no-JS fallback — choosing an option sets its .value and fires
// a bubbling `change`, so code reading the select (e.g. QuickAddModal's
// selectionSummary) keeps working.
//
// Site JS idiom (see motion.js): module-scope, run once on load + on every
// astro:after-swap. enhanceSelects(root) is also exported so QuickAddModal can
// enhance the Location <select> it injects via innerHTML at populate() time.
//
// Accessibility: WAI-ARIA select-only combobox — trigger role=combobox
// aria-haspopup=listbox aria-expanded, panel role=listbox, options role=option
// aria-selected, keyboard nav via aria-activedescendant.

// ---- Pure helpers (unit-tested; no DOM) --------------------------------

// Colour variant from the data-custom-select value. Bare `data-custom-select`
// (empty string) and any unknown value fall back to 'yellow'.
export function resolveVariant(value) {
  return value === 'teal' ? 'teal' : 'yellow';
}

// A dropdown is disabled when it has no selectable option — every option is
// `disabled` (the "Location…" placeholder is `disabled hidden`) or there are
// none. `opts` is an array of { disabled } (mirrors HTMLOptionElement).
export function isDisabledOptions(opts) {
  return opts.filter((o) => !o.disabled).length === 0;
}

// Next active option index for keyboard nav. No wrap (APG listbox): ArrowDown
// stops at the last, ArrowUp at the first, Home -> 0, End -> last. `current`
// may be -1 (nothing active). Returns a clamped index in [0, count-1], or -1
// when count is 0. Unrelated keys are a no-op (return current).
export function nextActiveIndex(current, count, key) {
  if (count <= 0) return -1;
  const last = count - 1;
  switch (key) {
    case 'ArrowDown': return current < 0 ? 0 : Math.min(current + 1, last);
    case 'ArrowUp': return current < 0 ? last : Math.max(current - 1, 0);
    case 'Home': return 0;
    case 'End': return last;
    default: return current;
  }
}

// ---- DOM enhancement ---------------------------------------------------

let uid = 0;

export function enhanceSelects(root = document) {
  root.querySelectorAll('select[data-custom-select]').forEach((sel) => {
    if (sel.dataset.cselectEnhanced) return;
    sel.dataset.cselectEnhanced = 'true';
    buildDropdown(sel);
  });
}

function buildDropdown(sel) {
  const id = `cselect-${(uid += 1)}`;
  const variant = resolveVariant(sel.dataset.customSelect);
  const opts = Array.from(sel.options);
  const disabled = isDisabledOptions(opts) || sel.disabled;
  const ariaLabel = sel.getAttribute('aria-label');

  // Wrapper inserted before the native select; the select moves inside it.
  const wrap = document.createElement('div');
  wrap.className = `cselect cselect--${variant}`;
  if (sel.dataset.cselectSize === 'compact') wrap.classList.add('cselect--compact');
  if (disabled) wrap.classList.add('cselect--disabled');
  sel.parentNode.insertBefore(wrap, sel);
  wrap.appendChild(sel);
  sel.classList.add('cselect__native');
  sel.setAttribute('aria-hidden', 'true');
  sel.tabIndex = -1;

  // Trigger.
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'cselect__trigger';
  trigger.id = `${id}-trigger`;
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  if (ariaLabel) trigger.setAttribute('aria-label', ariaLabel);
  const labelEl = document.createElement('span');
  labelEl.className = 'cselect__label';
  labelEl.textContent = sel.options[sel.selectedIndex]?.text ?? '';
  const chevron = document.createElement('span');
  chevron.className = 'cselect__chevron';
  chevron.setAttribute('aria-hidden', 'true');
  trigger.append(labelEl, chevron);
  wrap.appendChild(trigger);

  if (disabled) {
    trigger.disabled = true;
    trigger.setAttribute('aria-disabled', 'true');
    return; // muted, non-opening placeholder field — no panel, no listeners
  }

  // Panel + options (skip any disabled placeholder option).
  const panel = document.createElement('ul');
  panel.className = 'cselect__panel';
  panel.id = `${id}-panel`;
  panel.setAttribute('role', 'listbox');
  panel.hidden = true;
  if (ariaLabel) panel.setAttribute('aria-label', ariaLabel);
  trigger.setAttribute('aria-controls', panel.id);

  opts.filter((o) => !o.disabled).forEach((opt, i) => {
    const li = document.createElement('li');
    li.className = 'cselect__option';
    li.id = `${id}-opt-${i}`;
    li.setAttribute('role', 'option');
    li.dataset.value = opt.value;
    li.textContent = opt.text;
    li.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
    panel.appendChild(li);
  });
  wrap.appendChild(panel);

  wireInstance(wrap, sel, trigger, labelEl, panel);
}

function wireInstance(wrap, sel, trigger, labelEl, panel) {
  const options = Array.from(panel.children);
  const activeIndex = () => options.findIndex((li) => li.classList.contains('cselect__option--active'));

  function setActive(i) {
    options.forEach((li, j) => li.classList.toggle('cselect__option--active', j === i));
    if (i >= 0) {
      trigger.setAttribute('aria-activedescendant', options[i].id);
      options[i].scrollIntoView({ block: 'nearest' });
    } else {
      trigger.removeAttribute('aria-activedescendant');
    }
  }

  function open() {
    closeOpenDropdown(); // enforce one-open-at-a-time
    panel.hidden = false;
    wrap.classList.add('cselect--open');
    trigger.setAttribute('aria-expanded', 'true');
    const selIdx = options.findIndex((li) => li.getAttribute('aria-selected') === 'true');
    setActive(selIdx >= 0 ? selIdx : 0);
  }

  function close() {
    panel.hidden = true;
    wrap.classList.remove('cselect--open');
    trigger.setAttribute('aria-expanded', 'false');
    setActive(-1);
  }

  function choose(i) {
    const li = options[i];
    if (!li) return;
    options.forEach((o) => o.setAttribute('aria-selected', 'false'));
    li.setAttribute('aria-selected', 'true');
    labelEl.textContent = li.textContent;
    sel.value = li.dataset.value; // sync the value holder...
    sel.dispatchEvent(new Event('change', { bubbles: true })); // ...and notify
    close();
    trigger.focus();
  }

  trigger.addEventListener('click', () => {
    if (wrap.classList.contains('cselect--open')) close();
    else open();
  });

  trigger.addEventListener('keydown', (e) => {
    const isOpen = wrap.classList.contains('cselect--open');
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen) choose(activeIndex());
        else open();
        break;
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Home':
      case 'End':
        e.preventDefault();
        if (!isOpen) open();
        else setActive(nextActiveIndex(activeIndex(), options.length, e.key));
        break;
      case 'Escape':
        if (isOpen) { e.preventDefault(); close(); }
        break;
      case 'Tab':
        if (isOpen) close();
        break;
      default:
        break;
    }
  });

  options.forEach((li, i) => {
    li.addEventListener('click', () => choose(i));
    li.addEventListener('mousemove', () => setActive(i));
  });
}

// Close whichever dropdown is currently open (generic, DOM-query based so no
// instance registry is needed). Used by open() and the outside-click handler.
function closeOpenDropdown() {
  const open = document.querySelector('.cselect--open');
  if (!open) return;
  const panel = open.querySelector('.cselect__panel');
  const trigger = open.querySelector('.cselect__trigger');
  if (panel) panel.hidden = true;
  open.classList.remove('cselect--open');
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-activedescendant');
  }
  open.querySelectorAll('.cselect__option--active').forEach((li) => li.classList.remove('cselect__option--active'));
}

// ---- Bootstrap (guarded so `node --test` can import the pure helpers) ---
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const open = document.querySelector('.cselect--open');
    if (open && e.target instanceof Node && !open.contains(e.target)) closeOpenDropdown();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => enhanceSelects());
  } else {
    enhanceSelects();
  }
  document.addEventListener('astro:after-swap', () => enhanceSelects());
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS — the new `custom-select.test.mjs` file passes all three tests, and importing the module does NOT throw `document is not defined` (proves the `typeof document` guard). Existing 28 tests still pass.

- [ ] **Step 5: Create the stylesheet**

Create `src/styles/custom-select.css`:

```css
/* Custom dropdown (progressive enhancement of <select data-custom-select>).
   Built by src/scripts/custom-select.js. GLOBAL (not Astro-scoped): the
   trigger/panel are created in JS and the modal's native select is injected via
   innerHTML, so none receive a scoped data-astro-cid attribute. Colour comes
   from one --cselect-accent/--cselect-hover-text pair per variant, so a
   trigger's accent and its option hover can never diverge. */

.cselect {
  --cselect-accent: var(--color-yellow);
  --cselect-hover-text: var(--color-ink);
  position: relative;
  display: inline-block;
  width: 239px; /* matches CourseDetails/modal's measured native-select width */
  max-width: 100%;
}
.cselect--teal {
  --cselect-accent: var(--color-teal);
  --cselect-hover-text: var(--color-paper);
}
.cselect--yellow {
  --cselect-accent: var(--color-yellow);
  --cselect-hover-text: var(--color-ink);
}

/* Native <select> stays as the value holder / no-JS fallback, hidden once
   enhanced. */
.cselect__native {
  display: none;
}

.cselect__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  width: 100%;
  border: 1px solid var(--color-border);
  background: var(--color-paper);
  color: var(--color-ink);
  font: var(--type-body-16);
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  text-align: left;
}
.cselect__trigger:hover,
.cselect__trigger:focus-visible,
.cselect--open .cselect__trigger {
  border-color: var(--cselect-accent);
}
.cselect--disabled .cselect__trigger {
  color: var(--color-border);
  cursor: default;
}
.cselect--disabled .cselect__trigger:hover {
  border-color: var(--color-border);
}

/* Chevron — a CSS caret; rotates when open. */
.cselect__chevron {
  flex: 0 0 auto;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid var(--color-ink);
  transition: transform var(--motion-fast) var(--ease-standard);
}
.cselect--open .cselect__chevron {
  transform: rotate(180deg);
}
.cselect--disabled .cselect__chevron {
  border-top-color: var(--color-border);
}

/* Panel — same look as AccountMenu.astro's .acct. */
.cselect__panel {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 55;
  min-width: 100%;
  margin: var(--space-2) 0 0;
  padding: var(--space-2);
  list-style: none;
  background: var(--color-paper);
  color: var(--color-ink);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  border-radius: 6px;
}
.cselect__panel[hidden] {
  display: none;
}

.cselect__option {
  padding: var(--space-3);
  border-radius: 4px;
  font: var(--type-label);
  cursor: pointer;
  white-space: nowrap;
}
.cselect__option:hover,
.cselect__option--active {
  background: var(--cselect-accent);
  color: var(--cselect-hover-text);
}
.cselect__option[aria-selected="true"] {
  font-weight: 700;
}

/* Compact size (PLP filter/sort toolbar) — keeps FilterSortBar's caption/
   uppercase field metrics so the filter row doesn't balloon. */
.cselect--compact {
  width: auto;
}
.cselect--compact .cselect__trigger {
  font: var(--type-caption);
  text-transform: uppercase;
  letter-spacing: var(--tracking-caption);
  padding: var(--space-2) var(--space-3);
}
.cselect--compact .cselect__option {
  font: var(--type-caption);
  text-transform: uppercase;
  letter-spacing: var(--tracking-caption);
}

@media (prefers-reduced-motion: reduce) {
  .cselect__chevron {
    transition: none;
  }
}
```

- [ ] **Step 6: Wire the CSS + script into BaseLayout**

In `src/layouts/BaseLayout.astro`, add the CSS import after the `global.css` import (frontmatter, currently line 5):

```astro
import '../styles/tokens.css';
import '../styles/motion.css';
import '../styles/global.css';
import '../styles/custom-select.css';
```

And add the script import next to the `motion.js` import at the body bottom (currently line 51):

```astro
    <script>import '../scripts/motion.js';</script>
    <script>import '../scripts/custom-select.js';</script>
```

- [ ] **Step 7: Verify the build is clean**

Run: `npm run build`
Expected: PASS — 41 pages built, no errors. (No consumer marks a select yet, so nothing enhances at runtime; this step proves the CSS/script imports resolve and the site still builds.)

- [ ] **Step 8: Commit**

```bash
git add src/scripts/custom-select.js src/styles/custom-select.css tests/custom-select.test.mjs src/layouts/BaseLayout.astro
git commit -m "feat: custom dropdown enhancer module + styles

Progressive-enhancement enhanceSelects() upgrades <select data-custom-select>
into an accessible combobox/listbox matching the account menu, with a colour
variant driving a single accent/hover-text pair. Native select kept as an
aria-hidden value holder. Pure helpers unit-tested; DOM bootstrap guarded so
node --test can import them. Wired into BaseLayout.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: SSR consumers — FilterSortBar + CourseDetails

**Files:**
- Modify: `src/components/plp/FilterSortBar.astro:10,15,24` (the 3 `<select>` open tags)
- Modify: `src/components/pdp/CourseDetails.astro:176-180` (the Location `<select>` open tag)

**Interfaces:**
- Consumes: `enhanceSelects` runs automatically on load / `astro:after-swap` (Task 1's bootstrap) — these SSR selects enhance with no per-component script.
- Produces: nothing consumed downstream.

- [ ] **Step 1: Mark the FilterSortBar selects**

In `src/components/plp/FilterSortBar.astro`, add `data-custom-select="yellow" data-cselect-size="compact"` to each of the three selects. The block becomes:

```astro
  <div class="filter-sort__group">
    <span class="filter-sort__label">Filter:</span>
    <select class="filter-sort__select" data-custom-select="yellow" data-cselect-size="compact" aria-label="Availability">
      <option>Availability</option>
      <option>In Stock</option>
      <option>Out of Stock</option>
    </select>
    <select class="filter-sort__select" data-custom-select="yellow" data-cselect-size="compact" aria-label="Price">
      <option>Price</option>
      <option>Under $50</option>
      <option>$50 – $150</option>
      <option>$150+</option>
    </select>
  </div>
  <div class="filter-sort__group">
    <span class="filter-sort__label">Sort by:</span>
    <select class="filter-sort__select" data-custom-select="yellow" data-cselect-size="compact" aria-label="Sort by">
      <option selected>Best Selling</option>
      <option>Price: Low to High</option>
      <option>Price: High to Low</option>
      <option>Newest</option>
    </select>
    <span class="filter-sort__count">{count} {noun}</span>
  </div>
```

(Leave the existing `.filter-sort__select` CSS untouched — it styles the native select, which is the no-JS fallback and is hidden once enhanced.)

- [ ] **Step 2: Mark the CourseDetails Location select**

In `src/components/pdp/CourseDetails.astro`, add `data-custom-select="yellow"` to the `<select>` (currently lines 176-180). It becomes:

```astro
                <select
                  class="course-details__select"
                  data-custom-select="yellow"
                  aria-label={selectAccessibleName(control, buybox.label)}
                  aria-disabled={control.disabled ? 'true' : undefined}
                >
```

- [ ] **Step 3: Verify the build is clean**

Run: `npm run build`
Expected: PASS — 41 pages, no errors.

- [ ] **Step 4: Verify the marker reaches the built HTML**

Run: `grep -rl "data-custom-select" dist/ | head`
Expected: at least one PLP page (e.g. `dist/collections/*/index.html`) and one course PDP (e.g. `dist/courses/functional-gait-assessment-level-1/index.html`) contain `data-custom-select` — confirms the markers are server-rendered where the enhancer will find them.

- [ ] **Step 5: Commit**

```bash
git add src/components/plp/FilterSortBar.astro src/components/pdp/CourseDetails.astro
git commit -m "feat: enhance PLP filter/sort + course Location selects

Mark FilterSortBar's Availability/Price/Sort selects (compact) and
CourseDetails' Location select for the custom dropdown enhancer.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Quick-add modal injected Location select

**Files:**
- Modify: `src/components/plp/QuickAddModal.astro:91-92` (add the import)
- Modify: `src/components/plp/QuickAddModal.astro:229` (add the marker to the injected select string)
- Modify: `src/components/plp/QuickAddModal.astro:335-337` (call `enhanceSelects` after the buybox innerHTML write)

**Interfaces:**
- Consumes: `enhanceSelects(root)` from `../../scripts/custom-select.js` (Task 1).
- Produces: nothing consumed downstream.

- [ ] **Step 1: Import the enhancer**

In `src/components/plp/QuickAddModal.astro`, add the import beside the existing script imports (currently lines 91-92):

```astro
<script>
  import { getItem } from '../../data/catalog.js';
  import { addLine } from '../../scripts/cart.js';
  import { enhanceSelects } from '../../scripts/custom-select.js';
```

- [ ] **Step 2: Mark the injected select**

In `renderBuyboxControl` (currently line 229), add `data-custom-select="yellow"` to the injected `<select>` markup string. The `return` becomes:

```js
      return `<select class="quick-add-modal__select" data-custom-select="yellow" data-quick-add-select aria-label="${ariaLabel}"${disabledAttr}>${placeholderOption}${options}</select>`;
```

(Keep `data-quick-add-select` — `selectionSummary()` reads the native select through it; the enhancer never removes it. The Location select carries `aria-disabled` and has zero real options today, so it enhances to a disabled placeholder trigger.)

- [ ] **Step 3: Enhance after the buybox is injected**

In `populate()`, after the buybox controls' `innerHTML` is written (currently lines 335-337), enhance the new select. The `if` branch becomes:

```js
    if (buyboxControls.length > 0 && e.buyboxWrap && e.buyboxControls) {
      e.buyboxWrap.hidden = false;
      if (e.buyboxLabel) e.buyboxLabel.textContent = buybox.label ?? '';
      e.buyboxControls.innerHTML = buyboxControls
        .map((control, index) => renderBuyboxControl(control, `c${index}`, buybox.label))
        .join('');
      // The buybox (and its Location <select>) is rebuilt via innerHTML on
      // every open, so the freshly-injected select has no cselectEnhanced flag
      // and enhances here; the previous open's wrapper was discarded with the
      // overwritten innerHTML (idempotent, no leak).
      enhanceSelects(e.buyboxControls);
    } else {
```

- [ ] **Step 4: Verify the build is clean**

Run: `npm run build`
Expected: PASS — 41 pages, no errors.

- [ ] **Step 5: Verify the modal still runs its tests**

Run: `npm test`
Expected: PASS — all tests (the cart/catalog/sitemap/testimonial + custom-select suites). Confirms the new import didn't break the modal's module graph.

- [ ] **Step 6: Commit**

```bash
git add src/components/plp/QuickAddModal.astro
git commit -m "feat: enhance the quick-add modal Location select

Mark the innerHTML-injected Location <select> and call enhanceSelects after
each populate() so the runtime-built control gets the custom dropdown too
(a disabled placeholder while its option list is empty). Native select kept
behind data-quick-add-select for selectionSummary().

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Full verification + live browser pass

**Files:** none (verification only).

**Interfaces:** exercises Tasks 1–3 end to end.

- [ ] **Step 1: Build, links, tests**

Run: `npm run build && npm run check:links && npm test`
Expected: build 41 pages; check:links 0 broken; all tests pass. If `check:links` reports anything, it must be pre-existing and unrelated to this branch (the branch adds no new hrefs) — investigate any new entry.

- [ ] **Step 2: Start the dev server** (controller)

Start `npm run dev` (background, sandbox disabled) and confirm `localhost:4321` is reachable.

- [ ] **Step 3: Live pass — PLP filter/sort** (controller, Chrome)

On a PLP (e.g. `/collections/all`), for the Availability / Price / Sort dropdowns verify: trigger renders as the compact bordered field with a chevron and the current label; click opens the white hover-panel; hovering an option shows the **yellow** highlight (ink text); the trigger's border also goes yellow on hover/open (accent match); clicking an option updates the trigger label + closes; keyboard — Tab to a trigger, ↓/↑/Home/End move the highlight, Enter selects, Escape closes, focus returns to the trigger; only one dropdown is open at a time; outside-click closes. Check at desktop (~1280px) and mobile (~386px via same-origin iframe).

- [ ] **Step 4: Live pass — quick-add modal Location** (controller, Chrome)

Open the quick-add modal for a course that has a Location select (Functional Gait Assessment Level 1). Verify the Location dropdown renders as a **disabled placeholder** trigger ("Location…", muted, chevron muted, does not open on click or Enter). Close and reopen the modal (and open a different course's modal, then this one again) — confirm it re-enhances cleanly each time (exactly one trigger, no duplicated/stale wrapper). Confirm Add-to-Cart still works and the cart line summary is unchanged (the empty Location contributes nothing).

- [ ] **Step 5: Live pass — course PDP Location** (controller, Chrome)

On the FGA L1 course PDP (`/courses/functional-gait-assessment-level-1`), confirm the buybox Location dropdown renders as the same disabled placeholder trigger, and the course-type pills beside it are unchanged.

- [ ] **Step 6: Regression spot-check** (controller)

Confirm the account menu (person icon) still opens/hovers yellow as before, and the modal's course-type/language pills + size-chart are unchanged (this branch touched none of them).

- [ ] **Step 7: Confirm variant assignment with the user** (controller)

Report that all dropdowns default to the yellow account-menu hover, the buybox Location dropdowns are disabled (empty) so their hover isn't exercised yet, and the teal variant is a one-word flip per instance — ask whether any instance (e.g. the buybox dropdowns, to match the teal buybox) should be teal before merge.

---

## Self-Review

**1. Spec coverage:**
- §3.1 progressive-enhancement module, load + after-swap + modal → Task 1 (module + bootstrap), Task 3 (modal call). ✓
- §3.2 trigger/panel/native structure → Task 1 `buildDropdown`. ✓
- §3.3 keyboard/behavior → Task 1 `wireInstance` + `nextActiveIndex`. ✓
- §3.4 disabled/empty → Task 1 `isDisabledOptions` + disabled branch; verified Task 4 step 4-5. ✓
- §3.5 colour variant, single source → Task 1 CSS `--cselect-accent`/`--cselect-hover-text` + `resolveVariant`; Global Constraints. ✓
- §3.6 style (account-menu panel) → Task 1 CSS. ✓
- §3.7 consumers + BaseLayout → Task 1 (BaseLayout), Task 2 (FilterSortBar/CourseDetails), Task 3 (modal). ✓
- §4 accessibility → roles/aria in `buildDropdown`/`wireInstance`; native kept as value holder; Global Constraints. ✓
- §5 verification → Task 4. ✓

**2. Placeholder scan:** No TBD/TODO; every code step shows complete content; commands have expected output. ✓

**3. Type consistency:** `enhanceSelects(root=document)`, `resolveVariant(value)`, `isDisabledOptions(opts)`, `nextActiveIndex(current,count,key)` — names/signatures identical across the test (Task 1 step 1), the module (step 3), and the modal call (Task 3 step 3). Attribute names `data-custom-select` / `data-cselect-size` consistent across enhancer (`dataset.customSelect` / `dataset.cselectSize`) and consumers (Tasks 2–3). Class names `.cselect*` consistent between the module and the CSS. ✓
