# Gait Happens — Logo-wall area-normalization — design

**Date:** 2026-07-20
**Project:** Gait Happens Web Migration (Phase 2)
**Repo:** `…\04_Website\00_Claude`; branch off `master` (@ `4fb3e48`). GitHub `thegroundedco/gait-happens-web` (private).

> Standalone polish item (not part of Feedback Batch 1's chunks). Follows up Chunk 2 (the logo wall), which shipped the 16 real press logos as a uniform-height marquee.

---

## 1. Purpose & scope

The "As Seen In" press-logo marquee (`LogoWall.astro`) renders every logo at a uniform 44px height, and the logos look wildly different in size. Two compounding causes, found by measuring the assets:

1. **Inconsistent padding baked into the source PNGs.** Every file is 132px tall, but the actual logo *content* inside ranges from 26px (Runner's World) to 132px (New York Post / Fox News). So at a uniform 44px render, WebMD's mark shows ~10px tall while NY Post shows ~44px — a ~4× visible-size gap before aspect ratio even enters.
2. **Aspect-ratio variation.** Even ignoring padding, wide wordmarks (The New York Times ~7:1, New York Post ~6.6:1) occupy far more footprint than compact marks (CBS, GQ, Fox News ~1–3:1).

**Goal:** make the logos scale-justified — balanced visual weight — by (a) trimming each PNG's padding to its content box, then (b) sizing each logo so its bounding-box **area** is roughly equal, within a clamped height range.

**Out of scope**
- Ink-coverage (dark-pixel) normalization — considered, rejected: fragile to measure, and the Fox News opaque box breaks it. The chosen metric is bounding-box area of the trimmed content (the user's ask).
- Re-exporting Fox News as a transparent-background asset — flagged as a follow-up; it stays an opaque black box for now.
- Any change to the marquee mechanics, hover-pause, reduced-motion fallback, or a11y.

**Success criteria**
- Logos render with balanced visual weight — no logo renders ~4× another purely from padding, and wide wordmarks no longer dominate the footprint.
- The seamless marquee loop, hover/focus pause, reduced-motion freeze, and alt-text a11y are all preserved.
- Build clean, `check:links` 0 broken, tests green, and a live both-widths browser pass confirming balance + seamless loop.

## 2. Current state (from the code + measurement)

- **`src/components/plp/LogoWall.astro`** — CSS-only marquee. Renders `pressLogos` twice (visible group + `aria-hidden` duplicate) in a `.logo-wall__track` animated `translateX(0 → -50%)`. The seamless loop depends only on the two groups being identical and the inter-group gap equalling the inter-logo gap (`padding-inline-end` on each group). Every logo image is `.logo-wall__img { height: 44px; width: auto; object-fit: contain; display: block; }`.
- **`src/data/catalog.js`** — `pressLogos` = 16 `{ name, src }` objects (order fixed; `name` is alt text).
- **`public/images/logos/*.png`** — 16 PNGs, all 132px tall, varying widths, with inconsistent internal transparent padding (measured content heights 26–132px). Fox News is an opaque black box (no transparent padding to trim).
- **Consumers** — `LogoWall` renders on every PLP (`Plp.astro`) and every PDP (`Pdp.astro`'s `logo-wall` registry), both passing `pressLogos`. Neither consumer changes.

## 3. Design

### 3.1 Trim script (`scripts/normalize-logos.mjs`)

A committed Node script (uses `sharp`, already a dependency):
- For each PNG in `public/images/logos/`, run sharp `.trim()` (with a small alpha/colour threshold) to crop to the content bounding box, and **overwrite the file** in place.
- **Idempotent:** re-running on an already-trimmed PNG produces the same bytes-content (nothing left to trim) — safe to run repeatedly. Fox News (opaque box) trims to itself.
- Print each logo's trimmed intrinsic `width`/`height` in a paste-ready form (so the `pressLogos` dimensions can be updated), plus the computed display heights for reference.
- The script is the source of truth for regenerating trimmed assets if the logos are ever re-exported.

Trimming also reduces file size (less padding) — a minor bonus on top of the existing Chunk 2 downscale-to-132px.

### 3.2 Data — trimmed dimensions on `pressLogos`

Each `pressLogos` entry gains its **trimmed** intrinsic dimensions:

```js
{ name: 'The New York Times', src: '/images/logos/the-new-york-times.png', width: 891, height: 125 },
```

These are factual content dimensions (post-trim), used both for the area computation and for real `<img width height>` attributes (which set the intrinsic aspect ratio and avoid layout shift). The array order and `name` (alt text) are unchanged.

### 3.3 `LogoWall.astro` — per-logo area-normalized height

- **Frontmatter helper.** Three tuning constants at the top, then a pure function:

```js
const TARGET_AREA = /* px², tuned so the median logo lands ~40–44px tall */;
const MIN_H = 28;
const MAX_H = 56;
function displayHeight({ width, height }) {
  const aspect = width / height;
  const h = Math.sqrt(TARGET_AREA / aspect);   // equal bbox area => h = sqrt(area/aspect)
  return Math.round(Math.min(MAX_H, Math.max(MIN_H, h)));
}
```

- **Render.** Each `<img>` gets its intrinsic `width`/`height` attributes (from the data) and an inline `style={`height: ${displayHeight(logo)}px`}`; the CSS keeps `width: auto; object-fit: contain; display: block` but **drops the fixed `height: 44px`** (height now comes per-logo from the inline style). Both the visible group and the `aria-hidden` duplicate render identically, so the marquee stays seamless.
- **Everything else unchanged:** the track/keyframes/`-50%` loop, `:hover`/`:focus-within` pause, the `prefers-reduced-motion` freeze + scrollable fallback + duplicate-hidden, and the heading.

**Why area = √(TARGET_AREA / aspect):** for a fixed bounding-box area `A`, `w·h = A` and `w/h = aspect`, so `h = √(A / aspect)`. Wide logos (high aspect) get a smaller height; compact logos (low aspect) get a larger one. The `MIN_H`/`MAX_H` clamp prevents the extremes (a pure formula would push NYT to ~24px and WebMD to ~62px); clamped, the range is ~28–56px. `TARGET_AREA` and the clamp bounds are tuned in the live pass.

### 3.4 Fox News

Left as the opaque black box it is today (trim is a no-op on it; area-normalization gives it a near-square height near `MAX_H`). Flagged as a launch follow-up: it wants a transparent-background re-export to sit consistently with the other black-on-transparent marks.

## 4. Accessibility & correctness

- **Alt text unchanged** — the visible group keeps `alt={logo.name}`; the duplicate keeps `alt=""` + `aria-hidden` so AT reads 16 logos, not 32.
- **Seamless loop preserved** — both groups render from the same data with the same per-logo heights, so `-50%` still lands the duplicate exactly where the original started. The inter-group trailing gap still equals the inter-logo gap.
- **Reduced motion / hover pause** — untouched.
- **CLS** — real `<img width height>` attributes (intrinsic trimmed dims) give the browser the aspect ratio up front.
- **Vertical alignment** — logos remain vertically centered in the row (`.logo-wall__group { align-items: center }`), so varied heights center on a common baseline.

## 5. Verification

- **Script idempotency:** running `node scripts/normalize-logos.mjs` twice leaves the PNGs unchanged on the second run (nothing left to trim).
- **Build/tests/links:** `npm run build` (41 pages), `npm run check:links` 0 broken (image `src`s are unchanged), `npm test` (28 — the `width`/`height` additions are additive to `pressLogos`; confirm no test asserts an exact `{name, src}`-only shape, and adjust if one does).
- **Live browser pass** (controller, both widths): the logos read as balanced (no ~4× size outliers, wide wordmarks no longer dominate), the marquee still scrolls seamlessly (no jump at the loop point), hover pauses it, and the reduced-motion fallback still exposes every logo. Tune `TARGET_AREA` + clamps here.

## 6. Out of scope / flagged

- Fox News transparent-bg re-export (launch follow-up).
- WCAG 2.2.2 touch-pause gap for the marquee (a pre-existing item already logged in Chunk 2 — a visible pause button for touch users; not addressed here).
