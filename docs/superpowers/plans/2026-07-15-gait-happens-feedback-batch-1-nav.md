# Gait Happens — Feedback Batch 1, Chunk 1: Shop mega-nav (implementation plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Shop mega-menu — desktop and mobile — to match Figma: two product photo cards (Foot Health Kit, Walk) + two teal "bar" collection buttons (Shop Best Sellers, Shop All Products), without changing any other menu.

**Architecture:** The nav is data-driven from `menus` in `src/data/sitemap.js`, rendered by `Header.astro` → `MegaMenu.astro` → `NavCard.astro` (desktop) and `MobileNav.astro` (mobile). This chunk adds a card **`kind`** (`'photo'` default / `'bar'`) as an ADDITIVE field: a `bar` card renders as a teal button, and the Shop panel groups its trailing `bar` cards into a right-hand stacked column beside the photo cards. The change must be a **no-op for every menu that has no `bar` cards** (Courses / Resources / Contact) and for the About link — proven by byte-diff.

**Tech Stack:** Astro, hand-authored CSS from tokens, no new dependencies. The Header GSAP open/close/pill script is NOT touched.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-15-gait-happens-feedback-batch-1-nav-design.md`. **Figma:** file `FX7PDNvhZwyozODaq8Q8i7` — Shop panel **desktop `1217:1577`**, **mobile `1217:1579`**.
- **Additive only.** The card `kind` defaults to `'photo'` (today's behavior). The other three mega menus (Courses/Resources/Contact) and the About link must render **byte-identically** after this chunk — that is the regression gate on every task that touches a shared component.
- **Do NOT modify the Header.astro GSAP `<script>` logic** (open/close/hover/magic-pill/inert). The new bar cards are ordinary `<a>` links inside the panel; the existing reveal/inert handling already covers them.
- **Content/labels/crops are Figma-verbatim** — pull each card node's label, crop, and arrow from `1217:1577` / `1217:1579` at build; do not invent. New nav card image files go under `public/images/nav/`; if the Figma crop is materially identical to an existing `public/images/plp/*.jpg`, reuse that file rather than committing a near-duplicate.
- Tokens govern colour/type/spacing (`--color-teal`, `--color-yellow`, `--color-paper`, `--color-ink`, `--type-*`, `--space-*`). The teal bars are `--color-teal` background with **white (`--color-paper`) label + white arrow** per Figma; the two product cards are the existing yellow photo-card treatment.
- **Fidelity workflow:** `get_design_context` on the panel node at its real width before building; verify the built panel against the Figma at that width. Desktop panel width ~1200; mobile ~390.
- **Verification per task:** `npm run build`, `npm run check:links` (0 broken; the four Shop hrefs `/products/foot-health-kit`, `/products/walk`, `/collections/best-sellers`, `/collections/all` already exist as routes — confirm), `npm test` (28; the existing `sitemap.test.mjs` "every menu href resolves" test already covers the new hrefs). Commit per task, conventional messages.
- **Operational:** `dist/` is Dropbox-ignored so builds are clean; `npm run build` may still exit 1 on a transient `.astro/.prerender` EBUSY even though all pages generate — confirm the page count (`find dist -name index.html | wc -l` = 41), don't trust the exit code. `npm run check:links` needs port 4321 free; a `dev` server is currently running on 4321 — stop it (or use a different port) before `check:links`, and a low link count (~62) is a known flaky cold-start, re-run for ~83.

## File Structure

```
src/data/sitemap.js         Task 1 — MODIFY: Shop `cards` → 2 photo + 2 bar; introduce `kind`
src/components/NavCard.astro Task 1 — MODIFY: add the `teal-bar` variant (kind:'bar')
src/components/MegaMenu.astro Task 1 — MODIFY: group trailing `bar` cards into one right-hand .mega__col
src/components/MobileNav.astro Task 2 — MODIFY: card-layout body for kind-tagged menus (Shop only today)
public/images/nav/          Task 1 — ADD: shop-foot-health-kit.jpg, shop-walk.jpg (or reuse plp shots)
```

Unchanged: `Header.astro` (unless a panel needs a class hook — add it WITHOUT touching the script), the whole PLP/PDP surface, all other `menus` entries.

---

### Task 1: Desktop Shop panel — card `kind`, teal bar, and panel grouping

**Files:**
- Modify: `src/data/sitemap.js` (the `shop` menu entry, lines 2-9), `src/components/NavCard.astro`, `src/components/MegaMenu.astro`
- Add: `public/images/nav/shop-foot-health-kit.jpg`, `public/images/nav/shop-walk.jpg` (or reuse existing plp shots — Step 2)

**Interfaces:**
- Produces: a mega card may carry `kind: 'photo' | 'bar'` (absent ⇒ `'photo'`). A `bar` card renders as `.nav-card--teal-bar` (teal bg, white label + white arrow). `MegaMenu` groups the **trailing** `bar` cards of a `style:'cards'` panel into one `.mega__col` (reusing the existing Resources column primitive), rendered after the non-bar cards. Task 2 (mobile) reads the same `kind` field.

- [ ] **Step 1: Pull the Figma.** `get_design_context` on `1217:1577` (desktop Shop panel). Confirm: two yellow photo cards (Foot Health Kit, Walk) each with the small arrow, then a right-hand teal column of two stacked bars — "Shop Best Sellers" and "Shop All Products" — each teal with **white** label + **white** arrow, label left / arrow right. Note the exact labels and the two product image crops.

- [ ] **Step 2: Nav images.** For each product card, compare the Figma crop to the existing `public/images/plp/foot-health-kit.jpg` and `public/images/plp/walk.jpg`. If the Figma crop is materially the same, set the card `image` to the existing plp path and add NO new file. If it differs, download the crop from the `get_design_context` asset URL and commit it as `public/images/nav/shop-foot-health-kit.jpg` / `shop-walk.jpg`. State which you chose in the report. (The now-unused `public/images/nav/featured-products.png` and `shop-best-sellers.jpg` become orphaned by this change — leave them; a repo-wide unused-asset sweep is out of scope here.)

- [ ] **Step 3: Update the Shop data** in `src/data/sitemap.js` — replace the `shop` menu's `cards` (lines 4-8) with:

```js
    cards: [
      { kind: 'photo', label: 'The Foot Health Kit', href: '/products/foot-health-kit', image: '<from Step 2>', variant: 'yellow' },
      { kind: 'photo', label: 'Walk - One Step at a Time', href: '/products/walk', image: '<from Step 2>', variant: 'yellow' },
      { kind: 'bar', label: 'Shop Best Sellers', href: '/collections/best-sellers' },
      { kind: 'bar', label: 'Shop All Products', href: '/collections/all' },
    ],
```
Use the exact Figma labels from Step 1. Keep `style: 'cards'` on the menu.

- [ ] **Step 4: Add the `teal-bar` variant to `NavCard.astro`.** Extend the variant derivation (line 9) so a `kind:'bar'` card in a `cards`/`white` panel becomes `'teal-bar'`, WITHOUT changing the existing `style === 'bars'` (Resources yellow bar) or `style === 'white'` branches:

```js
const variant =
  style === 'bars' ? 'bar' :
  style === 'white' ? 'white' :
  card.kind === 'bar' ? 'teal-bar' :
  (card.variant ?? 'yellow');
```
`teal-bar` is a no-photo, non-`big` variant (small 24px arrow, `--type-nav-label`), so `big`/`arrowSrc`/`arrowSize` stay correct as-is (it is not in the `big` set). Add its CSS: a teal bar with white label and a **white arrow**. Match the existing `.nav-card--bar` box (`flex: 1 1 0; min-height: 0`) but teal+white:

```css
  .nav-card--teal-bar { background: var(--color-teal); color: var(--color-paper); flex: 1 1 0; min-height: 0; }
```
The arrow must render white. The `arrow.svg` asset is a fixed colour, so recolour it via a CSS mask driven by `currentColor` — the same mask+`currentColor` approach `PlpCard.astro`'s CTA arrow uses (read it first). Apply the mask only to the arrow inside a teal-bar (`.nav-card--teal-bar .nav-card__arrow`), so the yellow Resources bars and photo-card arrows are untouched. Keep the existing `translateX(6px)` hover on the arrow.

- [ ] **Step 5: Group trailing `bar` cards in `MegaMenu.astro`.** Keep the `style:'bars'` (Resources) branch exactly as-is. For the non-bars branch, split the cards into leading (non-bar) cards rendered as direct flex children and trailing `bar` cards wrapped in one `.mega__col`:

```astro
---
import NavCard from './NavCard.astro';
const { menu } = Astro.props;
const panelId = `mega-panel-${menu.id}`;
const columns = menu.style === 'bars'
  ? Array.from({ length: 3 }, (_, c) => menu.cards.filter((_, i) => i % 3 === c))
  : null;
// Cards panels may carry trailing `kind:'bar'` cards (Shop). Group them into one
// stacked right-hand column; menus with no bar cards render exactly as before.
const barCards = menu.style === 'bars' ? [] : menu.cards.filter((c) => c.kind === 'bar');
const leadCards = menu.style === 'bars' ? menu.cards : menu.cards.filter((c) => c.kind !== 'bar');
---
<div class="mega" data-menu-panel={menu.id} id={panelId} inert>
  <div class="mega__pad">
    <div class="mega__inner">
      {columns
        ? columns.map((col) => (
            <div class="mega__col">
              {col.map((card) => <NavCard card={card} style={menu.style} />)}
            </div>
          ))
        : (
          <>
            {leadCards.map((card) => <NavCard card={card} style={menu.style} />)}
            {barCards.length > 0 && (
              <div class="mega__col">
                {barCards.map((card) => <NavCard card={card} style={menu.style} />)}
              </div>
            )}
          </>
        )}
    </div>
  </div>
</div>
```
The `.mega__col`/`.mega__inner` CSS is unchanged and already produces equal-width columns (`flex: 1 1 0`) at `--mega-height`, so the panel is two photo cards + one two-bar column = three equal thirds.

- [ ] **Step 6: Verify — desktop fidelity + regression.** Sweep orphaned node/astro processes first (a `dev` server holds 4321; stop it before `check:links`). Then:
  - `npm run build` (41 pages).
  - **Regression gate:** the Courses, Resources, and Contact desktop panels render byte-identically. Prove it — build before/after this task and diff the mega-panel markup for those three menus (e.g. grep `data-menu-panel="courses"` / `"resources"` / `"contact"` regions out of any built page's HTML and compare). Any difference means the `leadCards`/`barCards` split isn't a no-op for kind-less menus — fix it.
  - `npm run check:links` 0 broken; `npm test` 28.
  - Report that the live desktop Figma pass is the controller's (subagents can't reliably drive host Chrome).

- [ ] **Step 7: Commit.**

```bash
git add src/data/sitemap.js src/components/NavCard.astro src/components/MegaMenu.astro public/images/nav/
git commit -m "feat(nav): Shop mega-menu desktop — product cards + teal collection bars"
```

---

### Task 2: Mobile Shop panel

**Files:**
- Modify: `src/components/MobileNav.astro`

**Interfaces:**
- Consumes: the `kind` field on Shop's cards (Task 1). A mega menu whose cards carry a `kind` renders the **card layout**; menus without `kind` (Courses/Resources/Contact) keep today's text-link `<details>` accordion, byte-identical.

- [ ] **Step 1: Pull the Figma.** `get_design_context` on `1217:1579` (mobile Shop panel). Confirm the layout: the two product **photo cards stacked** full-width (image + label, yellow), then the two teal **bars side-by-side** in a two-up row (white label + white arrow). Note spacing.

- [ ] **Step 2: Render the card body for kind-tagged menus.** In `MobileNav.astro`, the mega branch currently renders every menu's cards as a `<ul>` of text links (lines 16-20). Discriminate on whether the menu's cards carry a `kind` (Shop does; the others don't), so the change is a no-op for the others:

```astro
{menus.map((m) =>
  m.type === 'link' ? (
    <a class="m-item" href={m.href}>{m.label}</a>
  ) : m.cards?.some((c) => c.kind) ? (
    <details class="m-acc m-acc--cards">
      <summary>{m.label}</summary>
      <div class="m-cards">
        {m.cards.filter((c) => c.kind !== 'bar').map((c) => (
          <a class="m-photo-card" href={c.href}>
            {c.image && <img class="m-photo-card__img" src={c.image} alt="" loading="lazy" />}
            <span class="m-photo-card__label">{c.label}</span>
          </a>
        ))}
        {m.cards.some((c) => c.kind === 'bar') && (
          <div class="m-bars">
            {m.cards.filter((c) => c.kind === 'bar').map((c) => (
              <a class="m-bar" href={c.href}>
                <span>{c.label}</span>
                <img class="m-bar__arrow" src="/images/nav/arrow.svg" width="24" height="24" alt="" />
              </a>
            ))}
          </div>
        )}
      </div>
    </details>
  ) : (
    <details class="m-acc">
      <summary>{m.label}</summary>
      <ul>{m.cards.map((c) => <li><a href={c.href}>{c.label}</a></li>)}</ul>
    </details>
  )
)}
```
The third branch is the current markup verbatim — Courses/Resources/Contact hit it unchanged.

- [ ] **Step 3: Style the mobile Shop body.** Add CSS for `.m-cards` (column, gap), `.m-photo-card` (yellow bg, image on top, label below — a compact stacked card), `.m-bars` (2-up flex row, gap), `.m-bar` (teal bg, white label left + white arrow right, `flex: 1 1 0`). Recolour the bar arrow white with the same mask+`currentColor` approach as Task 1 (or reuse a shared class if Task 1 made one). Match `1217:1579` proportions. Tokens for colour/type/spacing; the drawer background is `--color-ink`, so ensure the yellow/teal cards read correctly on it.

- [ ] **Step 4: Verify — mobile fidelity + regression.** `npm run build`; **regression gate:** the mobile bodies of Courses/Resources/Contact and the About link render byte-identically (diff the `mobile-nav` markup before/after). `npm run check:links` 0 broken; `npm test` 28. Live mobile Figma pass is the controller's.

- [ ] **Step 5: Commit.**

```bash
git add src/components/MobileNav.astro
git commit -m "feat(nav): Shop mobile menu — stacked product cards + teal bar buttons"
```

---

### Task 3: Verification sweep

**Files:** none (or `.superpowers/sdd/progress.md`).

- [ ] **Step 1: Full sweep.** Sweep orphaned node/astro processes; stop the dev server on 4321. Run and paste actual output: `npm run build` (confirm 41 pages via `find dist -name index.html | wc -l`), `npm run check:links` (0 broken; re-run if it reports a low count), `npm test` (28).
- [ ] **Step 2: Whole-nav regression proof.** From a clean build, confirm that ONLY the Shop menu changed: diff the built HTML for the Courses/Resources/Contact mega panels and the mobile nav bodies for those menus + the About link against a `master`-based build; all must be byte-identical except the Shop regions. Paste the summary.
- [ ] **Step 3: Section-render sanity.** Grep a built page's Header markup and confirm the Shop desktop panel now contains two photo `nav-card` links + a `.mega__col` of two `.nav-card--teal-bar` links; grep the `mobile-nav` markup and confirm Shop's body is the card layout while the other menus are still `<ul>` text-link accordions.
- [ ] **Step 4: Update `.superpowers/sdd/progress.md`** with the chunk's outcome and any findings (e.g. whether the mobile-menu inconsistency — Shop card-style vs the others' text-link style — should become a follow-up to bring all mobile menus to their Figma card layouts).
- [ ] **Step 5: Commit** (if the ledger is tracked; it is gitignored here, so this step may be a no-op — report that).

---

## Definition of done

- Desktop Shop panel = two product photo cards (Foot Health Kit, Walk) + a right column of two teal bars (Shop Best Sellers, Shop All Products), faithful to `1217:1577`.
- Mobile Shop panel = two stacked product cards + two side-by-side teal bars, faithful to `1217:1579`.
- Courses / Resources / Contact mega panels and the About link render byte-identically, desktop and mobile.
- Build 41 pages, `check:links` 0 broken, tests 28, both-widths live Figma pass on the Shop menu.
- The card `kind` mechanism is data-driven and reusable (About can adopt it later by data alone).
