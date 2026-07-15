# Gait Happens — Feedback Batch 1, Chunk 2: Logo wall + real logo assets (design)

**Date:** 2026-07-15
**Project:** Gait Happens Web Migration (Phase 2) — client feedback on nav / PLPs / product PDPs (Chunk 2 of 5)
**Repo:** `…\04_Website\00_Claude`; branch off `master` (@ `0f58538`). GitHub `thegroundedco/gait-happens-web` (private).
**Figma:** press logos come from the **Design System** file `B0fHmlEEm9OdOOnAbnmI8d`, "Logo Wall" component-set `183:439` — specifically the **"As Seen In" / Desktop** variant `180:340`. Page logo-wall instance reference (what the pages actually render): Toe Spacers PDP `707:8024`.

> Batch roadmap + locked decisions live in `docs/superpowers/specs/2026-07-15-gait-happens-feedback-batch-1-nav-design.md` §0. Chunk 1 (Shop nav) is merged (`0f58538`).

---

## 1. Purpose & scope

Replace the placeholder **text wordmarks** in the "As Seen In" logo band with the **real press-logo images** from the design system, and render the band as an **auto-scrolling marquee**. `LogoWall.astro` is the only press-logo block in the site, rendered on **every PLP** (`Plp.astro`) and **every PDP** (via `Pdp.astro`'s `logo-wall` composer registry entry) — so this fixes the "logo blocks" feedback on both surfaces at once.

**In scope**
- Export the **16 "As Seen In" logos** (`180:340`) to `public/images/logos/` as real image files, each with a semantic filename and a correct alt-text mapping.
- Replace `pressLogos` in `catalog.js` (today a flat array of 7 text strings) with **16 `{ name, src }` objects**.
- Rebuild `LogoWall.astro` as a **CSS-only auto-scrolling marquee** (§3) with the required accessibility behavior (§4). Heading "As Seen In" bumped `h4 → h3` teal to match the DS variant.

**Out of scope (decided)**
- The DS component's **Trusted By** (~12 logos) and **Sponsors** (Altra, El Naturalista, Notace) groups. The PLP/PDP pages render **only** the "As Seen In" group (confirmed against `707:8024`); Trusted By / Sponsors don't appear on any current page (they'd belong to a homepage / About page, which aren't built). Not exported this chunk (YAGNI) — noted as ready-to-add when a page needs them.
- The nav (Chunk 1, done) and the other feedback chunks (3–5).

**Success criteria**
- The "As Seen In" band on every PLP and PDP shows the 16 real logo images (not text), auto-scrolling.
- The marquee pauses on hover/focus and **freezes to a static horizontally-scrollable row under `prefers-reduced-motion: reduce`** — every logo remains reachable.
- Build clean, `check:links` 0 broken (the 16 new image paths resolve), tests green.

## 2. Current state (from the code map)

- **`src/components/plp/LogoWall.astro`** renders `<h2 class="logo-wall__heading">As Seen In</h2>` (`--type-h4` teal) over a centered `flex-wrap` `<ul>` of `logos.map((name) => <li>{name}</li>)` — plain **text** wordmarks.
- **`src/data/catalog.js`** — `pressLogos = ['The New York Times', 'People', 'New York Post', 'National Geographic', 'WebMD', 'Bicycling', "Women's Health"]` (7 text strings; header comment flags them as placeholders pending a real logo-mark swap).
- **Consumers (both pass `pressLogos`):** `Plp.astro:62` `<LogoWall logos={pressLogos} />`; `Pdp.astro` registry `'logo-wall' → { Component: LogoWall, props: () => ({ logos: pressLogos }) }`.
- **No press-logo image files exist** under `public/`. `public/images/` has `nav/`, `plp/`, `pdp/` subfolders only.
- **The DS "As Seen In / Desktop" variant `180:340`** is a single-row 16-column grid; heading is `--type-h3` (Montserrat SemiBold 32px) teal (`--text-inverse` = `#047791` = the repo's `--color-teal`). Each logo is a raster `<img>` with its own DS asset URL. Native logo sizes vary widely (≈108×48 to ≈205×92).

## 3. Design

### 3.1 Assets

Re-pull `get_design_context` on `180:340` at build (the asset URLs expire in ~7 days — do not rely on any URL captured in this spec). Download all 16 logo images to **`public/images/logos/`** with **semantic filenames** and map each to its publication (the DS image nodes have generic names like "download 3" / "image 2", so the mapping is by visually inspecting each downloaded asset, left-to-right screenshot order):

`the-new-york-times`, `people`, `new-york-post`, `national-geographic`, `webmd`, `bicycling`, `womens-health`, `mens-health`, `forbes`, `runners-world`, `yahoo`, `gq`, `9news`, `shape`, `fox-news`, `cbs`.

Keep the DS export format (raster PNG). If any exports with a transparent surround, that's fine (they render on the white band). **The implementer must open each downloaded file and confirm which publication it is before naming it** — do not assume the DS column order matches the screenshot order (the grid uses out-of-order `col-N` classes).

### 3.2 Data model

Replace `pressLogos` in `catalog.js` with 16 objects:

```js
export const pressLogos = [
  { name: 'The New York Times', src: '/images/logos/the-new-york-times.png' },
  { name: 'People',             src: '/images/logos/people.png' },
  // … all 16, in the DS left-to-right order …
  { name: 'CBS',                src: '/images/logos/cbs.png' },
];
```
`name` is the accessible label (alt text); `src` is the committed image path. Both consumers keep passing `pressLogos` unchanged.

### 3.3 The marquee (CSS-only, no JS)

`LogoWall.astro` renders:
- The heading `As Seen In` → **`--type-h3`** teal (bumped from `h4`).
- A **clipping band** (`overflow: hidden`) containing a **track** = the 16 logos rendered **twice** (two identical `<ul>`s or a doubled list). The **second copy is `aria-hidden="true"`** so assistive tech reads the 16 logos once, not 32.
- The track animates `transform: translateX(0 → -50%)` via a `@keyframes` loop, `animation: … linear infinite`. Because the track is exactly 2× the content, translating by `-50%` lands the duplicate exactly where the original started → **seamless** loop. Pick a duration that reads as a calm, continuous scroll (≈40–60s for the full 16-logo loop; tune to the Figma feel).
- Each logo is `<img src={l.src} alt={l.name}>` normalized to a **uniform height** (≈`44px`, `width: auto`, `object-fit: contain`) with consistent horizontal gap, so the varied native sizes read as one clean row. Logos are greyscale/mono in the DS — render as-is (do not recolour).

### 3.4 Component boundaries

`LogoWall.astro` stays a single self-contained section component (it's small and has one job). The doubled-track + marquee CSS live in its scoped `<style>`. No new shared util needed. Keep the `logos` prop (default `pressLogos`) so the two consumers are untouched.

## 4. Accessibility & motion (the load-bearing part of a marquee)

- **`prefers-reduced-motion: reduce` → freeze.** The animation is disabled (`animation: none`) and the band becomes a **static horizontally-scrollable row** (`overflow-x: auto`) so keyboard and reduced-motion users can still reach every logo. Under reduced motion the duplicate track is redundant; it may stay (still `aria-hidden`) or be hidden — either is fine as long as no logo is unreachable and nothing is announced twice.
- **Pause on hover AND focus-within** (`:hover`, `:focus-within` → `animation-play-state: paused`) so a user can stop the motion to read a logo.
- **Informative alt text:** each logo `<img alt={name}>` carries its publication name; the `aria-hidden` duplicate carries none of that to the a11y tree.
- **The band is not a link.** These are non-interactive brand marks (matching the current component). No focusable children means `:focus-within` pause only fires if a child is focusable — which it isn't — so **hover-pause is the primary mechanism**; document that.
- **Known WCAG gap to flag (not block):** WCAG 2.2.2 (Pause, Stop, Hide) wants an explicit mechanism to pause auto-moving content that runs >5s. Hover-pause covers mouse; reduced-motion covers that audience; but **touch users have no pause**. For this reference build, ship hover/focus-pause + reduced-motion-freeze and **flag in the report + a code comment** that a dev team may want to add a visible pause button before launch. Do not silently ignore this.

## 5. Verification

- **Both consumers:** confirm the built HTML for a PLP (`/collections/all`) and a PDP (`/products/toe-spacers`) both render the marquee with 16 real `<img>` logos (32 img elements total incl. the aria-hidden duplicate), not text `<li>`s.
- `npm run build` clean (confirm 41 pages); `npm run check:links` 0 broken (this catches any mis-named/missing logo path — it's the guard); `npm test` green.
- **No regression elsewhere:** `LogoWall` is only consumed on PLP/PDP; nothing else should change. The heading `h4→h3` and text→image swap are intended and visible on those pages only.
- **Live browser pass:** on a PLP and a PDP — the marquee scrolls seamlessly (no jump at the loop point), pauses on hover; then emulate `prefers-reduced-motion: reduce` and confirm it freezes to a static, horizontally-scrollable row with all logos reachable. Check both desktop and a narrow width (the marquee should still scroll and the logos stay uniform-height).

## 6. Open items

- Exact logo→filename mapping is resolved at build by inspecting each downloaded asset (§3.1); do not trust the DS grid's `col-N` order.
- Marquee duration/gap tuned to the Figma feel at build; the spec's ≈44px height and ≈40–60s loop are starting points, not exact pulls.
- Trusted By + Sponsors groups are deferred; when a homepage/About page needs them, the same LogoWall component can gain a `group`/`heading` prop and those assets get exported then.
- If any DS logo is a genuinely low-res raster that looks bad at 44px, flag it (a client asset-quality item), don't upscale-blur it silently.
