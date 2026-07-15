# Gait Happens — Feedback Batch 1, Chunk 2: Logo wall + real logo assets (implementation plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder text wordmarks in the "As Seen In" logo band with the 16 real press-logo images from the design system, rendered as a CSS-only auto-scrolling marquee, on every PLP and PDP.

**Architecture:** `LogoWall.astro` is the only press-logo block, consumed by `Plp.astro` (all PLPs) and `Pdp.astro`'s `logo-wall` composer registry entry (all PDPs) — both pass `pressLogos` from `catalog.js`. This chunk (1) exports 16 logos and turns `pressLogos` from a flat text array into `{ name, src }` objects, then (2) rebuilds `LogoWall` to render real `<img>` logos as a marquee. Built in two layers: first a working STATIC image band, then the marquee behavior on top — so each layer is independently reviewable.

**Tech Stack:** Astro, hand-authored CSS from tokens, no JS, no new dependencies. The marquee is pure CSS.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-15-gait-happens-feedback-batch-1-logowall-design.md`. **Figma:** Design System file `B0fHmlEEm9OdOOnAbnmI8d`, "As Seen In / Desktop" variant **`180:340`**.
- **Scope: "As Seen In" only.** 16 logos. Trusted By + Sponsors are DEFERRED (not shown on any current page) — do NOT export or render them.
- **Content-faithful, but the logo→filename mapping is resolved by INSPECTING each downloaded asset** — the DS grid uses out-of-order `col-N` classes, so do NOT assume column order matches the left-to-right screenshot. Open each downloaded image and confirm which publication it is before naming it.
- **Informative alt text:** each logo `<img alt={name}>` carries its publication name. The marquee's duplicated track is `aria-hidden="true"` so AT reads 16 logos, not 32.
- **`prefers-reduced-motion: reduce` MUST freeze the marquee** (`animation: none`) and leave the band a static, horizontally-scrollable row (`overflow-x: auto`) — every logo reachable.
- **Pause on hover/focus** (`animation-play-state: paused`). **Flag (don't block) the WCAG 2.2.2 gap:** hover-pause doesn't cover touch users; note in the report + a code comment that a dev team may want a visible pause button before launch.
- Tokens govern colour/type/spacing. Heading "As Seen In" → `--type-h3` teal (`--color-teal`), bumped from the current `--type-h4`.
- `LogoWall` keeps its `logos` prop (default `pressLogos`); the two consumers (`Plp.astro:62`, `Pdp.astro` registry) are NOT edited.
- **Fidelity:** `get_design_context` on `180:340` at build for the current asset URLs (they expire ~7 days) and the layout feel. Verify the marquee against the Figma look.
- **Per-task verification:** `npm run build` (41 pages — confirm with `find dist -name index.html | wc -l`; exit 1 on a transient `.astro/.prerender` EBUSY is benign, trust the count), `npm run check:links` (0 broken — THIS is the guard that catches a missing/mis-named logo path; needs port 4321 free; a low ~62 count is a flaky cold-start, re-run for ~89), `npm test` (28). Commit per task, conventional messages.

## File Structure

```
public/images/logos/          Task 1 — ADD: 16 real press-logo image files
src/data/catalog.js           Task 1 — MODIFY: pressLogos → 16 { name, src } objects
src/components/plp/LogoWall.astro  Task 1 — MODIFY: render real <img> (static band, h3 heading)
                                   Task 2 — MODIFY: marquee (doubled aria-hidden track + CSS anim + a11y)
```

Unchanged: `Plp.astro`, `Pdp.astro` (both keep passing `pressLogos`), and the whole nav/PDP-section surface.

---

### Task 1: Export the 16 logos + data model + static image band

**Files:**
- Add: `public/images/logos/*.png` (16 files)
- Modify: `src/data/catalog.js` (`pressLogos`, lines ~5027-5035), `src/components/plp/LogoWall.astro`

**Interfaces:**
- Produces: `pressLogos` is now `Array<{ name: string, src: string }>` (16 entries). `LogoWall.astro`'s `logos` prop is that array; it renders each as `<img src={l.src} alt={l.name}>`. Task 2 consumes this same shape and the `.logo-wall__*` markup this task establishes.

- [ ] **Step 1: Pull the Figma + download the assets.** `get_design_context` on `180:340` (file `B0fHmlEEm9OdOOnAbnmI8d`). It returns 16 image asset URLs and a screenshot. The 16 publications (DS left-to-right screenshot order) are: The New York Times, People, New York Post, National Geographic, WebMD, Bicycling, Women's Health, Men's Health, Forbes, Runner's World, Yahoo, GQ, 9News, Shape, Fox News, CBS. Download each asset URL (e.g. `curl -L -o …`) and **open each downloaded file to confirm which publication it is** — the DS `col-N` order is NOT the visual order, so match by looking, not by index.

- [ ] **Step 2: Commit the images.** Save all 16 to `public/images/logos/` with semantic kebab-case filenames matching the publication:
  `the-new-york-times`, `people`, `new-york-post`, `national-geographic`, `webmd`, `bicycling`, `womens-health`, `mens-health`, `forbes`, `runners-world`, `yahoo`, `gq`, `9news`, `shape`, `fox-news`, `cbs` (`.png`). If a file is genuinely low-res and looks bad at ~44px tall, note it in the report (a client asset-quality item) — do not upscale-blur it.

- [ ] **Step 3: Rewrite `pressLogos` in `catalog.js`.** Replace the 7-string array (and update its header comment, which currently says "placeholder text wordmarks") with the 16 objects in DS left-to-right order:

```js
// Press logos for the "As Seen In" band (LogoWall.astro). Real logo images
// exported from the design system (file B0fHmlEEm9OdOOnAbnmI8d, node 180:340).
// `name` is the accessible alt text; `src` is the committed image path.
export const pressLogos = [
  { name: 'The New York Times', src: '/images/logos/the-new-york-times.png' },
  { name: 'People', src: '/images/logos/people.png' },
  { name: 'New York Post', src: '/images/logos/new-york-post.png' },
  { name: 'National Geographic', src: '/images/logos/national-geographic.png' },
  { name: 'WebMD', src: '/images/logos/webmd.png' },
  { name: 'Bicycling', src: '/images/logos/bicycling.png' },
  { name: "Women's Health", src: '/images/logos/womens-health.png' },
  { name: "Men's Health", src: '/images/logos/mens-health.png' },
  { name: 'Forbes', src: '/images/logos/forbes.png' },
  { name: "Runner's World", src: '/images/logos/runners-world.png' },
  { name: 'Yahoo', src: '/images/logos/yahoo.png' },
  { name: 'GQ', src: '/images/logos/gq.png' },
  { name: '9News', src: '/images/logos/9news.png' },
  { name: 'Shape', src: '/images/logos/shape.png' },
  { name: 'Fox News', src: '/images/logos/fox-news.png' },
  { name: 'CBS', src: '/images/logos/cbs.png' },
];
```
(Use the filenames you actually committed in Step 2; the above is the intended set.)

- [ ] **Step 4: Render a STATIC image band in `LogoWall.astro`.** Change the markup from text `<li>{name}</li>` to real images, and bump the heading to `--type-h3`. No marquee yet — a plain centered wrapping row of the 16 logos, normalized height. Full new file:

```astro
---
// Full-width "As Seen In" press band. Real press-logo images from the design
// system (see `pressLogos` in catalog.js). Rendered on every PLP (Plp.astro)
// and every PDP (Pdp.astro's `logo-wall` registry). Task 2 adds the marquee.
import { pressLogos } from '../../data/catalog.js';

const { logos = pressLogos } = Astro.props;
---
<section class="logo-wall">
  <div class="logo-wall__pad">
    <h2 class="logo-wall__heading">As Seen In</h2>
    <ul class="logo-wall__row">
      {logos.map((logo) => (
        <li class="logo-wall__item">
          <img class="logo-wall__img" src={logo.src} alt={logo.name} loading="lazy" />
        </li>
      ))}
    </ul>
  </div>
</section>
<style>
  .logo-wall { background: var(--color-paper); }
  .logo-wall__pad {
    max-width: var(--container-max);
    margin-inline: auto;
    padding-block: var(--space-8);
    padding-inline: var(--space-5);
    text-align: center;
  }
  .logo-wall__heading {
    font: var(--type-h3);
    color: var(--color-teal);
    margin-bottom: var(--space-6);
  }
  .logo-wall__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--space-6);
    list-style: none;
  }
  .logo-wall__img {
    height: 44px;
    width: auto;
    object-fit: contain;
    display: block;
  }
</style>
```

- [ ] **Step 5: Verify.** `npm run build` (41 pages). `npm run check:links` — **0 broken is the gate here**: a mis-named or missing `/images/logos/*.png` shows as a broken link (linkinator crawls `<img src>`). If any logo path 404s, the filename in `catalog.js` doesn't match the committed file — fix it. `npm test` 28. Grep `dist/products/toe-spacers/index.html` and `dist/collections/all/index.html` and confirm both render 16 `<img class="logo-wall__img"` with real alt text (not text `<li>` wordmarks).

- [ ] **Step 6: Commit.**

```bash
git add public/images/logos/ src/data/catalog.js src/components/plp/LogoWall.astro
git commit -m "feat(logo-wall): real As Seen In press logos (static band)"
```

---

### Task 2: Auto-scrolling marquee + accessibility

**Files:**
- Modify: `src/components/plp/LogoWall.astro`

**Interfaces:**
- Consumes: the `pressLogos` `{ name, src }` shape and `.logo-wall__*` markup from Task 1.
- Produces: the band is a marquee — a clipping viewport containing a track = the 16 logos rendered TWICE (second copy `aria-hidden`), CSS-animated, pausing on hover/focus, freezing under reduced-motion.

- [ ] **Step 1: Pull the Figma feel.** Re-check `180:340`'s look (single continuous row of uniform-height logos). Note the DS is a static canvas row; our web band scrolls. Decide a calm loop duration (≈40–60s for 16 logos) at build.

- [ ] **Step 2: Restructure the markup into a doubled track.** Wrap the row in a clipping viewport and render the logo list twice — the visible copy and an `aria-hidden` duplicate — inside one animated track, so the loop is seamless (translating by half the track lands the duplicate exactly on the original's start). Replace the `.logo-wall__row` block:

```astro
    <div class="logo-wall__viewport">
      <div class="logo-wall__track">
        <ul class="logo-wall__group">
          {logos.map((logo) => (
            <li class="logo-wall__item"><img class="logo-wall__img" src={logo.src} alt={logo.name} loading="lazy" /></li>
          ))}
        </ul>
        <ul class="logo-wall__group" aria-hidden="true">
          {logos.map((logo) => (
            <li class="logo-wall__item"><img class="logo-wall__img" src={logo.src} alt="" loading="lazy" /></li>
          ))}
        </ul>
      </div>
    </div>
```
The duplicate's images use `alt=""` AND the `<ul>` is `aria-hidden` (belt-and-suspenders) so nothing is announced twice.

- [ ] **Step 3: The marquee CSS.** Replace the static `.logo-wall__row` styles with the viewport/track/group/animation. The key seam requirement: the two `.logo-wall__group`s must stream continuously (the gap between them equals the internal gap), and the track translates by exactly `-50%` so the second group slides into the first's position with no jump:

```css
  .logo-wall__viewport { overflow: hidden; }
  .logo-wall__track {
    display: flex;
    width: max-content;
    animation: logo-wall-scroll 50s linear infinite;
  }
  /* pause when a user wants to read it */
  .logo-wall__viewport:hover .logo-wall__track,
  .logo-wall__viewport:focus-within .logo-wall__track { animation-play-state: paused; }

  .logo-wall__group {
    display: flex;
    align-items: center;
    gap: var(--space-6);
    /* trailing gap so the two groups stream with a uniform gap everywhere,
       making the -50% loop point invisible */
    padding-inline-end: var(--space-6);
    list-style: none;
    margin: 0;
  }
  .logo-wall__img { height: 44px; width: auto; object-fit: contain; display: block; }

  @keyframes logo-wall-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* Reduced motion: freeze + make the row statically scrollable so every
     logo stays reachable. (WCAG 2.2.2 note: hover/focus pause doesn't cover
     TOUCH users; a dev team may want a visible pause button before launch.) */
  @media (prefers-reduced-motion: reduce) {
    .logo-wall__track { animation: none; }
    .logo-wall__viewport { overflow-x: auto; }
  }
```
Keep `.logo-wall`, `.logo-wall__pad`, `.logo-wall__heading` from Task 1. Tune the `50s` and `--space-6` gap against the live look (Step 5) — the values above are starting points.

- [ ] **Step 4: Verify build + a11y-tree.** `npm run build` (41 pages), `npm run check:links` 0 broken, `npm test` 28. Grep the built PLP + PDP and confirm: the track contains TWO `.logo-wall__group`s, the second is `aria-hidden="true"` and its imgs have `alt=""`; the first group's imgs carry the real publication alt text. (So AT sees 16 named logos, not 32.)

- [ ] **Step 5: Live browser pass (mark clearly if you can't drive Chrome — the controller runs it).** On a PLP and a PDP: (a) the marquee scrolls continuously with **no visible jump at the loop point** — if it jumps, the seam gap/`-50%` math is off, adjust the trailing-gap/track width; (b) hovering the band pauses it; (c) emulate `prefers-reduced-motion: reduce` (DevTools Rendering) and confirm the animation stops and the band becomes a horizontally-scrollable static row with all 16 logos reachable; (d) at a narrow width the logos stay uniform height and it still scrolls. Report what you could not verify.

- [ ] **Step 6: Commit.**

```bash
git add src/components/plp/LogoWall.astro
git commit -m "feat(logo-wall): auto-scrolling marquee + reduced-motion/hover-pause a11y"
```

---

### Task 3: Verification sweep

**Files:** none (or `.superpowers/sdd/progress.md`).

- [ ] **Step 1: Full sweep.** Sweep orphaned node/astro/preview processes; free port 4321. Run and paste actual output: `npm run build` (confirm 41 pages), `npm run check:links` (0 broken — re-run if a low count appears), `npm test` (28).
- [ ] **Step 2: Both-surface render check.** Grep the built HTML for one PLP (`dist/collections/all/index.html`) and one PDP (`dist/products/toe-spacers/index.html`): each has the `.logo-wall` section with 32 `<img class="logo-wall__img"` total (16 visible + 16 aria-hidden), the h3 heading, and NO leftover text-wordmark `<li>`s.
- [ ] **Step 3: Regression scan.** `LogoWall` is only consumed on PLP/PDP; confirm nothing else changed. Grep that `Plp.astro` and `Pdp.astro` still pass `pressLogos` (untouched). Confirm no press-logo text strings remain in the built output.
- [ ] **Step 4: Update `.superpowers/sdd/progress.md`** with the chunk outcome, the WCAG 2.2.2 touch-pause flag (for the client/dev-team handoff), any low-res-logo asset-quality items found, and that Trusted By + Sponsors remain deferred.
- [ ] **Step 5: Commit** if the ledger is tracked (it's gitignored here, so likely a no-op — report that).

---

## Definition of done

- The "As Seen In" band on every PLP and PDP shows the 16 real press-logo images, auto-scrolling as a seamless marquee, heading in `--type-h3` teal.
- Pauses on hover/focus; freezes to a static horizontally-scrollable row under `prefers-reduced-motion`; AT reads 16 named logos (not 32).
- Build 41 pages, `check:links` 0 broken, tests 28, live browser pass on a PLP + a PDP.
- `Plp.astro` / `Pdp.astro` untouched (still pass `pressLogos`). Trusted By + Sponsors deferred. WCAG 2.2.2 touch-pause gap flagged for the handoff.
