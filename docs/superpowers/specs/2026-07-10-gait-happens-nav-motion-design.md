# Gait Happens Nav Motion — Design

**Date:** 2026-07-10
**Project:** Gait Happens Web Migration (Phase 2) — navigation motion polish
**Repo:** `…\04_Website\00_Claude` (branch TBD at implementation; off `master`)
**Figma:** "Updated Navigation" — file `bOTL6zlJXud1ozlnAnaC8U`, node `4547-3632` (static state frames; no prototype/keyframe data — motion is specified here, not in Figma).

---

## 1. Purpose & scope

Add two motion behaviors to the existing desktop header nav, and make the mega panel taller, to match the client's "Updated Navigation" direction (mildly-Awwwards, per the foundation's motion brief).

**In scope**
1. **Magic-pill active-item indicator** — a yellow container that glides between top-nav items with an elastic settle.
2. **Mega-panel morph** — moving between mega menus (Shop/Courses/Resources/Contact) morphs one persistent panel into the next instead of hard close→open.
3. **Taller mega panel** — mega panel content height ≥ **1.75×** current, with the per-menu card layouts rescaled to fill it.

**Out of scope**
- Mobile nav drawer motion (the slide-in drawer stays as-is; these behaviors are desktop-only).
- Changing mega-menu *content/IA* (labels, links, card set) — structure already matches the updated design closely; only sizing/motion change here.
- The account/search/cart overlays' behavior.

**Success criteria**
- The pill follows the hovered/focused top item with a visible elastic overshoot-and-settle; the active item's label reads dark-on-yellow.
- Switching mega menus keeps a single panel open that resizes and swaps its cards in place (no flash of closed).
- Mega panel is ≥1.75× taller with cards that fill it cleanly at desktop widths.
- `prefers-reduced-motion` disables the springy/stagger motion (instant, non-jarring fallbacks).
- No listener leaks across View-Transition navigations; keyboard + screen-reader parity preserved.

## 2. Current state (what we're changing)

`src/components/Header.astro` — top nav is a row of `.top__item` buttons/links (plain, label color = paper; no active background). Mega panels (`src/components/MegaMenu.astro`) are shown/hidden **instantly** via `show(id)`/`hide()` (`panel.hidden = false/true`); switching triggers `closeOverlays()` then reveals the next panel. `.mega__col` content height is **250px**. All setup runs in `initMegaMenus()`/`initHeader()` (initial load + `astro:after-swap`); document-level listeners are bound once at module scope. Motion utility (`src/scripts/motion.js`) uses GSAP; GSAP is already a dependency.

## 3. Design

### 3.1 Magic-pill indicator

- **Element:** one `.nav-pill` (yellow, `--color-yellow`) absolutely positioned inside the primary `nav.top`, behind the items (`z-index` below the labels), sized/positioned via `transform: translateX()` + `width` (animated). Starts hidden (opacity/scale 0 or off-screen).
- **Follow:** on `mouseenter`/`focus` of any `.top__item` (Shop, Courses, Resources, **About**, Contact), GSAP tweens the pill's `x` (to the item's `offsetLeft`) and `width` (to the item's `offsetWidth`) with an **elastic/back ease** (`back.out(~1.7)` or a light `elastic.out`), ~0.4–0.5s, so it overshoots slightly and settles. Measurements are read from the live DOM each move (so it's correct after resize / after-swap).
- **Active label contrast:** the currently-indicated item's label transitions to `--color-ink` (dark on yellow); others stay `--color-paper`. Managed by toggling an `is-active` class in sync with the pill target.
- **Leave / pinned:** when the pointer leaves the nav and **no mega is open**, the pill retracts (fade/scale out). If a mega menu is **open**, the pill stays pinned to that trigger (matching the Figma "active menu is highlighted" state). Opening a mega pins the pill to its trigger; closing all releases it.
- **Keyboard/a11y:** focusing a top item moves the pill there too (same handler path). The pill is purely decorative (`aria-hidden`); it never gates interaction. Existing `aria-expanded` on triggers is unchanged.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, the pill still repositions but with no overshoot (short linear/ease tween or instant set); label color still flips.

### 3.2 Mega-panel morph

- **Persistent panel while switching:** when moving from an open mega to another mega trigger, do **not** hard-hide the old panel then show the new. Instead, keep a single visible panel region open and transition its contents:
  - Tween the panel container's **height** from the outgoing menu's height to the incoming menu's height (measure incoming height off-screen or from a cached value), eased (~0.35–0.45s, standard ease).
  - **Card swap in place:** outgoing cards crossfade + slight slide/scale **out** while incoming cards crossfade + slide **in**, on a small **stagger** (~0.03–0.05s), within the panel. Net read: one panel morphing menu-to-menu.
- **Open from closed / close to closed:** entering a mega from a fully-closed nav plays a fade + slide-down enter; leaving to closed plays the reverse exit. (Distinct from the morph, which is menu→menu.)
- **Implementation note:** panels currently each have their own `.mega` element (hidden/shown). Morph can be achieved by (a) overlapping the outgoing/incoming panels absolutely in the same region and cross-animating them while animating a shared height driver, or (b) a single panel host whose inner content is swapped and animated. Chosen at plan time; (a) reuses the existing per-menu panels with the least structural change. Whatever is chosen must preserve the leak-free init and not leave a panel stuck visible/`inert`-wrong.
- **Mutual exclusion & other overlays:** account/search overlays still close when a mega opens (existing `closeOverlays` contract) — the morph only applies mega→mega.
- **Reduced motion:** instant swap (today's behavior), no height tween/stagger.

### 3.3 Taller mega panel (≥1.75×)

- Increase mega panel content height from 250px to **≥ ~440px** (1.75×). Because the current card layouts are tuned to 250px, each menu style is rescaled to fill the taller panel gracefully:
  - **`cards` (Shop, Courses):** larger photo cards + teal CTA card; maintain aspect/spacing.
  - **`bars` (Resources):** the 3-column × 2-row bar grid grows to the new height (taller bars / more breathing room).
  - **`white` (Contact):** the 3 white cards grow to fill.
- Height is a single source of truth (a CSS var or the measured panel height) that the morph height-tween also reads, so the two features stay consistent.

## 4. Components / files touched

- `src/components/Header.astro` — add `.nav-pill` markup + styles; pill follow logic + label-active toggling; wire mega open/close to pin/release the pill; orchestrate the mega morph. All within the existing `initHeader()` / module-scope-listener pattern.
- `src/components/MegaMenu.astro` — taller panel height (var), any structural hooks needed for the morph (e.g. a card wrapper / data attributes for staggering), card-layout rescale per style.
- `src/components/NavCard.astro` — card sizing adjustments for the taller panel (if needed).
- (Optional) `src/scripts/nav-motion.js` — if the pill + morph logic is large enough to extract from Header's inline script; must follow the same init pattern. Decided at plan time.
- No new dependencies (GSAP already present).

## 5. Motion & a11y constraints (carry the project's)

- GSAP for tweens; register/init on initial load **and** `astro:after-swap`; document-level listeners bound **once** at module scope (no leaks) — mirror `Header.astro`'s established pattern.
- `prefers-reduced-motion: reduce` honored for both features (§3.1, §3.2).
- Keyboard focus drives the pill; `aria-expanded` and focus behavior on triggers unchanged; pill + morph are decorative (`aria-hidden` where appropriate) and never trap or gate.
- Tokens govern color (`--color-yellow`, `--color-ink`, `--color-paper`); structural px may be literal.

## 6. Verification

- **Real-browser pass (desktop):** pill glides + overshoots between all top items incl. About; active label goes dark; pill pins on open mega, releases on close. Switching Shop→Courses→Resources→Contact morphs one panel (resize + card swap), no flash-of-closed. Panel is visibly ≥1.75× taller with well-filled cards for all four menus. Toggle OS reduced-motion → motion downgrades cleanly.
- **No-leak check:** navigate via View Transitions several times, then switch menus repeatedly — no duplicate/stacked listeners, no stuck panel.
- `npm run build` (39 pages, modulo transient Dropbox EBUSY) and `npm run check:links` = 0 broken (no link changes expected).

## 7. Open items / assumptions

- Exact easing constants (overshoot amount, durations, stagger) are tuned during implementation to taste against the "elastic" brief; defaults noted above.
- Morph technique (overlapping panels vs single host) chosen at plan time for the least-fragile, leak-free result.
- Desktop-only; the ≤820px breakpoint (mobile drawer) is unaffected.
- "1.75×" is a floor; final height chosen to make the rescaled cards look right (won't go below 1.75×).
