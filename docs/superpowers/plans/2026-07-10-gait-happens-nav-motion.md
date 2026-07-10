# Gait Happens Nav Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a yellow elastic "magic-pill" active-item indicator and a morphing mega-panel transition to the desktop header nav, and make the mega panel ≥1.75× taller.

**Architecture:** Three layered changes to the existing header. (1) All mega panels get one **uniform fixed height** (~440px) with rescaled cards — this removes any height difference between menus, so the "morph" reduces to a card cross-animation. (2) A single yellow pill element in `nav.top` is GSAP-tweened (position + width, elastic ease) to follow the hovered/focused top item. (3) Mega panels switch from instant `hidden` show/hide to an opacity/`inert` crossfade with a staggered card animation, so moving menu-to-menu reads as one panel morphing. All logic lives in `Header.astro`'s existing leak-free init (initial load + `astro:after-swap`, document listeners bound once at module scope).

**Tech Stack:** Astro, vanilla JS, GSAP (already a dependency; used in `src/scripts/motion.js`), CSS custom properties. No new dependencies.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-10-gait-happens-nav-motion-design.md`. **Figma:** file `bOTL6zlJXud1ozlnAnaC8U`, node `4547-3632` (static states; motion is per the spec).
- Desktop-only. The `≤820px` breakpoint (mobile slide-in drawer) must be **unaffected** by every task.
- Tokens govern color: pill `--color-yellow` (#FEC745), active label `--color-ink` (#231F20), inactive label `--color-paper` (#FFFFFF). Structural px may be literal.
- Client JS binds/inits on the **initial load AND on `astro:after-swap`**; document-level listeners registered **once at module scope**; **no listener leaks**. This is the pattern already in `src/components/Header.astro` — extend it, do not deviate.
- Motion respects `prefers-reduced-motion: reduce` (elastic overshoot + staggers disabled; behavior stays functional, just instant/plain).
- The pill and card animations are **decorative** (`aria-hidden` where they add non-content elements); `aria-expanded` on triggers, focus order, Esc/outside-click close, and the account/search/cart mutual-exclusion (`closeOverlays`) contract are all **preserved**.
- Mega height is a **single CSS custom property** (`--mega-height`) so panels + any JS that reads a panel height stay consistent.
- **No unit tests for this feature** (browser motion): each task is verified by `npm run build` (39 pages; a transient Dropbox EBUSY on `.vite`/cleanup is benign — confirm `dist/*/index.html` count), `npm run check:links` = 0 broken, and a **controller real-browser pass** (the executing agent drives Chrome; if it cannot, it says so and the controller does the browser pass). Commit per task, conventional messages.
- **Browser gotcha:** the dev server in the Bash sandbox is unreachable from host Chrome via localhost — run `npx astro dev --host` and use the LAN IP. `check:links` needs port 4321 free, so stop the dev server before it and restart after.

---

### Task 1: Uniform taller mega panel + card rescale

Make all four mega panels one fixed height (≥1.75× the current 250px) and rescale each menu style's cards to fill it. Behavior stays as-is (instant show/hide) — only sizing changes. This removes inter-menu height differences so Task 3's morph is a pure card cross-animation.

**Files:**
- Modify: `src/components/MegaMenu.astro` (panel/column height → `--mega-height`)
- Modify: `src/components/NavCard.astro` (cards fill the taller panel)
- Read first: both files, in full, before editing.

**Interfaces:**
- Produces: a CSS custom property `--mega-height` (set on `.navrow` in `Header.astro` or `:root`; **default `440px`**) that `.mega`/`.mega__col`/card heights reference. Later tasks (morph) read the panel via the DOM, not this value directly, but the value must exist and be the single source of truth for panel height.

- [ ] **Step 1: Define the height token.** In `src/components/Header.astro`'s `<style>`, add to the `.navrow` rule: `--mega-height: 440px;` (≥1.75× the old 250px). (Placed on `.navrow` so both the panels and their absolute positioning context share it.)

- [ ] **Step 2: Apply the height in `MegaMenu.astro`.** Read the file. Replace the hardcoded `.mega__col { height: 250px; }` with `height: var(--mega-height);`. Ensure the `cards`/`white` (non-`bars`) `.mega__inner` also stands the panel up to `--mega-height` — set `.mega__inner { min-height: var(--mega-height); }` and make its NavCard children stretch (`align-items: stretch` is already present; confirm cards use `height: 100%` — see Step 3).

- [ ] **Step 3: Rescale cards in `NavCard.astro`.** Read the file. Make each card fill the panel height: the card root should be `height: 100%` so `cards`/`white`/`bars` cards grow to `--mega-height` (bars: 2 stacked per column → each ~half; cards/white: full height). Keep image `object-fit: cover`, preserve label/arrow layout and existing hover. Do not change card *content* or the `bars` column-first grouping. Adjust internal padding/type only as needed so the larger cards look intentional (no stretched images, no giant empty gaps).

- [ ] **Step 4: Build + link check.** Run: `npm run build` — Expected: 39 pages (confirm `find dist -name index.html | wc -l` = 39 if it EBUSYs). Run: `npm run check:links` — Expected: `0 broken` (no link changes). Run: `npm test` — Expected: 22/22 (unchanged; sanity).

- [ ] **Step 5: Controller browser pass.** Open each mega (Shop/Courses/Resources/Contact) at desktop width: panel is visibly ~1.75× taller, cards fill it cleanly (no distorted images, no dead space), open/close still works, and the `≤820px` mobile drawer is unchanged. (Executing agent: drive Chrome via the LAN IP; if unable, say so for the controller to verify.)

- [ ] **Step 6: Commit.** `git add src/components/Header.astro src/components/MegaMenu.astro src/components/NavCard.astro && git commit -m "feat(nav): uniform taller mega panel (>=1.75x) with rescaled cards"`

---

### Task 2: Magic-pill active-item indicator

A single yellow pill glides behind the hovered/focused top-nav item with an elastic settle; the active item's label flips to ink; the pill pins to an open mega and retracts when the pointer leaves.

**Files:**
- Modify: `src/components/Header.astro` (pill markup in `nav.top`; pill styles; follow logic inside the existing `<script>`)

**Interfaces:**
- Consumes: the existing `initHeader()`/`initMegaMenus()` init flow and the module-scope `header` variable; the `show(id)`/`hide()` functions (Task hooks the pill into them).
- Produces: module-scope helpers `movePillTo(item)` and `retractPill()` and a re-init hook `initNavPill()` called from `initHeader()`. The mega `show()`/`hide()` call these to pin/release the pill.

- [ ] **Step 1: Import GSAP + add pill markup.** In `Header.astro`'s `<script>`, add at top: `import { gsap } from 'gsap';` (same package `src/scripts/motion.js` already uses). Inside `<nav class="top" …>`, add as the FIRST child: `<span class="nav-pill" aria-hidden="true"></span>`. Give each `.top__item` a `position: relative; z-index: 1;` and `.top { position: relative; }` so the pill sits behind the labels.

- [ ] **Step 2: Pill styles.** Add to `<style>`:

```css
.nav-pill {
  position: absolute;
  left: 0;
  top: 50%;
  height: calc(100% - var(--space-3));
  width: 0;
  transform: translate(0, -50%);
  background: var(--color-yellow);
  border-radius: 4px;
  opacity: 0;
  pointer-events: none;
  z-index: 0;
}
.top__item.is-active { color: var(--color-ink); }
```

- [ ] **Step 3: Follow logic (module scope, leak-free).** In the `<script>`, add module-scope state `let navPill = null; let pillPinned = null;` and functions:

```js
function measure(item) {
  // offset relative to nav.top (item.offsetParent is nav.top since it's positioned)
  return { x: item.offsetLeft, w: item.offsetWidth };
}
function movePillTo(item, { elastic = true } = {}) {
  if (!navPill || !item) return;
  const { x, w } = measure(item);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  header?.querySelectorAll('.top__item.is-active').forEach((el) => el.classList.remove('is-active'));
  item.classList.add('is-active');
  gsap.to(navPill, {
    x, width: w, autoAlpha: 1,
    duration: reduce ? 0.001 : 0.5,
    ease: reduce ? 'none' : 'back.out(1.7)',
    overwrite: true,
  });
}
function retractPill() {
  if (!navPill) return;
  if (pillPinned) { movePillTo(pillPinned, { elastic: false }); return; }
  header?.querySelectorAll('.top__item.is-active').forEach((el) => el.classList.remove('is-active'));
  gsap.to(navPill, { autoAlpha: 0, duration: 0.25, overwrite: true });
}
```

- [ ] **Step 4: Wire element listeners in `initNavPill()` (re-bound per DOM, leak-free).**

```js
function initNavPill() {
  if (!header) return;
  navPill = header.querySelector('.nav-pill');
  pillPinned = null;
  const items = header.querySelectorAll('.top__item');
  items.forEach((item) => {
    item.addEventListener('mouseenter', () => movePillTo(item));
    item.addEventListener('focus', () => movePillTo(item));
  });
  // Retract when the pointer leaves the whole top nav (unless a mega is pinned).
  header.querySelector('.top')?.addEventListener('mouseleave', () => retractPill());
}
```

Call `initNavPill();` inside `initHeader()` (after `initMegaMenus()` so `header` is set). NOTE: element listeners here rebind cleanly because each `astro:after-swap` brings fresh `.top__item` nodes — matching the existing pattern; do NOT register document-level listeners in this function.

- [ ] **Step 5: Pin/release on mega open/close.** In `show(id)`, after opening, add: `const t = header.querySelector('[data-menu-trigger="' + id + '"]'); if (t) { pillPinned = t; movePillTo(t); }`. In `hide()`, add at the end: `pillPinned = null;` and if no other mega/overlay is taking over, `retractPill()` (call `retractPill()` — it no-ops the pin since it was cleared). Verify Esc/outside-click paths (which call `hide()`/`closeOverlays`) also release the pin.

- [ ] **Step 6: Build + link check.** `npm run build` (39 pages), `npm run check:links` (0 broken), `npm test` (22/22).

- [ ] **Step 7: Controller browser pass.** Hover across Shop→Courses→Resources→About→Contact: the yellow pill glides item-to-item with a visible overshoot-and-settle; the pointed item's label goes dark. Open a mega → pill pins to that trigger; move pointer out of the nav → pill stays pinned while the mega is open, retracts once closed. Tab through the top items → pill follows focus. Toggle OS reduced-motion → pill still moves but without overshoot. Navigate to another page and back (View Transitions) then repeat → no doubled/janky behavior (no leaked listeners).

- [ ] **Step 8: Commit.** `git add src/components/Header.astro && git commit -m "feat(nav): elastic magic-pill active-item indicator"`

---

### Task 3: Mega-panel morph (crossfade + card stagger)

Switch mega panels from instant `hidden` show/hide to an opacity/`inert` crossfade with a staggered card animation, so moving menu-to-menu reads as one panel morphing. Panels are the same height (Task 1), so no height animation is needed.

**Files:**
- Modify: `src/components/Header.astro` (`show`/`hide` logic + panel state handling in the `<script>`)
- Modify: `src/components/MegaMenu.astro` (panel visibility via opacity/`inert` instead of `hidden`; a card-group hook for staggering)

**Interfaces:**
- Consumes: `gsap` (imported in Task 2), the `panels` Map, `show(id)`/`hide()`, and the Task-2 pill pin hooks (unchanged).
- Produces: no new exports; `show`/`hide` now animate. A panel's cards are selected via `panel.querySelectorAll('.nav-card')` for the stagger (`.nav-card` is the confirmed NavCard root class — `NavCard.astro:15` `<a class="nav-card nav-card--{variant}">`).

- [ ] **Step 1: Panels animatable, not display-none.** In `MegaMenu.astro`, replace the `hidden`-driven `display:none` with an opacity/interactivity model so panels can overlap and crossfade:

```css
.mega {
  position: absolute; top: 100%; left: 0; right: 0;
  background: var(--color-paper);
  opacity: 0;
  pointer-events: none;
  transition: none; /* GSAP drives opacity; keep CSS out of it */
}
.mega.is-open { pointer-events: auto; }
```

Remove `.mega[hidden] { display:none; }` and the `hidden` attribute on the panel root; instead render the panel with `inert` and let JS toggle `inert` + `is-open` + opacity. (Keep `id`/`data-menu-panel`.) Panels are absolutely positioned overlapping; only the open one has `pointer-events`/no-`inert`.

- [ ] **Step 2: Animated `show`/`hide` in `Header.astro`.** Rewrite `show(id)`/`hide()` to crossfade + stagger (reduced-motion = instant):

```js
const reduceMo = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function animatePanelIn(panel) {
  panel.classList.add('is-open');
  panel.removeAttribute('inert');
  const cards = panel.querySelectorAll('.nav-card'); // use NavCard's real root class
  if (reduceMo()) { gsap.set(panel, { autoAlpha: 1 }); gsap.set(cards, { autoAlpha: 1, y: 0 }); return; }
  gsap.to(panel, { autoAlpha: 1, duration: 0.28, overwrite: true });
  gsap.fromTo(cards, { autoAlpha: 0, y: 14 },
    { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.04, ease: 'power2.out', overwrite: true });
}
function animatePanelOut(panel) {
  panel.setAttribute('inert', '');
  panel.classList.remove('is-open');
  if (reduceMo()) { gsap.set(panel, { autoAlpha: 0 }); return; }
  gsap.to(panel, { autoAlpha: 0, duration: 0.2, overwrite: true });
}
```

`show(id)`: keep the existing `closeOverlays()` (account/search) call, then instead of `panel.hidden=false`, call `animatePanelIn(panel)`; if a different mega was open, call `animatePanelOut(prevPanel)` so the two crossfade. Track the currently open panel via the existing `open` id. `hide()`: `animatePanelOut(panels.get(open))` instead of `panel.hidden=true`. Preserve `aria-expanded` toggling and the pill pin/release from Task 2 exactly.

- [ ] **Step 3: Guard the initial state.** On init, ensure all panels start closed: `inert`, `is-open` absent, `autoAlpha:0` (`gsap.set(panel, {autoAlpha:0})` in `initMegaMenus()` after building the `panels` Map). This replaces the old default-`hidden`.

- [ ] **Step 4: Build + link check.** `npm run build` (39 pages), `npm run check:links` (0 broken), `npm test` (22/22).

- [ ] **Step 5: Controller browser pass (the key one).** Open Shop, then move to Courses → Resources → Contact without leaving the nav: one panel stays visible and its cards crossfade/slide+stagger to the next menu's cards — **no flash of closed/white** between menus. Opening from fully-closed plays a clean fade+card-stagger; leaving closes cleanly. Confirm: account/search/cart still open and still close the mega (mutual exclusion intact); Esc + outside-click still close; keyboard can still open a mega and Tab into its links (panel not `inert` while open); the pill still pins/releases correctly. Toggle reduced-motion → instant swap, no stagger, still fully usable. Navigate away + back several times, then rapidly switch menus → no leaks, no stuck/invisible panel, no panel left interactive while closed.

- [ ] **Step 6: Commit.** `git add src/components/Header.astro src/components/MegaMenu.astro && git commit -m "feat(nav): morphing mega-panel transition (crossfade + card stagger)"`

---

## Self-Review — spec coverage

- §3.1 magic-pill (follow + elastic + active label + pin/retract + keyboard + reduced-motion) → Task 2. ✓
- §3.2 mega morph (persistent/crossfade, card stagger, enter/exit, reduced-motion, mutual-exclusion preserved) → Task 3. ✓ (Height-tween from §3.2 is intentionally **not needed**: Task 1 makes all panels one height, per spec §7's "least-fragile technique chosen at plan time" — the morph is a pure card cross-animation. Noted here so it isn't read as a gap.)
- §3.3 taller panel (≥1.75×, per-style card rescale, one height source-of-truth `--mega-height`) → Task 1. ✓
- §4 files (Header, MegaMenu, NavCard) → Tasks 1–3. ✓ (No separate `nav-motion.js` — the logic stayed small enough to live in Header's script, per §4's "optional… decided at plan time".)
- §5 constraints (GSAP, leak-free init, reduced-motion, a11y, tokens) → Global Constraints + every task's verification. ✓
- §6 verification (browser pass, no-leak, build/links) → each task Steps 4–5/7. ✓
- §7 open items (easing constants tuned live; desktop-only; uniform-height decision) → Global Constraints + Task steps note easing defaults (`back.out(1.7)`, stagger 0.04) as tunable. ✓

Type/name consistency: `movePillTo`/`retractPill`/`initNavPill`/`pillPinned`/`navPill` used consistently across Task 2; `animatePanelIn`/`animatePanelOut`/`is-open`/`--mega-height` consistent across Tasks 1 & 3. NavCard root class for the stagger selector is confirmed `.nav-card` (`NavCard.astro:15`). The stagger animates the NavCard `<a>` roots directly; if that fights the cards' existing hover `transform`, wrap the animated property on a child or use `gsap` `x`/`autoAlpha` only (noted for Task 3 tuning).
