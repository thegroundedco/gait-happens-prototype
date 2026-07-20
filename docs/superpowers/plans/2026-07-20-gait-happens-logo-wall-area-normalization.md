# Gait Happens — Logo-wall area-normalization (implementation plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the "As Seen In" logo marquee scale-justified — trim each source PNG's padding, then size each logo so its bounding-box area is roughly equal, within a clamped height range.

**Architecture:** A committed `sharp` script trims each logo PNG to its content box in place (idempotent) and reports trimmed dimensions. Those dimensions go onto each `pressLogos` entry, and `LogoWall.astro` computes a per-logo display height from an area formula with min/max clamps, replacing the flat `height: 44px`. The marquee mechanics, hover-pause, reduced-motion fallback, and a11y are untouched.

**Tech Stack:** Astro, `sharp` (already a dependency), hand-authored CSS.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-20-gait-happens-logo-wall-area-normalization-design.md`.
- **Metric:** bounding-box **area** of the **trimmed** content; `displayHeight = clamp(round(√(TARGET_AREA / (width/height))), MIN_H, MAX_H)`. Defaults: `TARGET_AREA = 7000`, `MIN_H = 28`, `MAX_H = 56` (tuned in the live pass — median logo ≈ 42px).
- **Trim overwrites the PNGs in place and must be idempotent** (a 2nd run leaves the bytes-content unchanged). Fox News is an opaque box → trims to itself, no change.
- **Preserve the marquee wholesale:** the two identical groups, the `translateX(0 → -50%)` seamless loop, the trailing inter-group gap, `:hover`/`:focus-within` pause, and the `prefers-reduced-motion` freeze + scrollable fallback + duplicate-hidden.
- **Preserve a11y:** visible group `alt={logo.name}`; duplicate group `alt=""` + `aria-hidden`.
- **Only these change:** `scripts/normalize-logos.mjs` (new), `public/images/logos/*.png` (trimmed), `src/data/catalog.js` (`pressLogos` gains `width`/`height`), `src/components/plp/LogoWall.astro`. `Plp.astro` / `Pdp.astro` (consumers) are NOT touched.
- **Per-task verification:** `npm run build` (41 pages — `find dist -name index.html | wc -l`; transient `.astro/.prerender` EBUSY on exit is benign), `npm run check:links` (0 broken; needs port 4321 free — stop any dev/preview server first; a low ~62 count is a flaky cold-start, re-run for ~105), `npm test` (28). Commit per task.

## File Structure

```
scripts/normalize-logos.mjs           Task 1 — CREATE: trim PNGs in place + report trimmed dims
public/images/logos/*.png             Task 1 — MODIFY: trimmed to content box (16 files)
src/data/catalog.js                   Task 2 — MODIFY: pressLogos entries gain width/height
src/components/plp/LogoWall.astro     Task 2 — MODIFY: displayHeight() + per-logo <img> height
```

Unchanged: `Plp.astro`, `Pdp.astro`, all other components/data.

---

### Task 1: Trim script + trimmed assets

**Files:**
- Create: `scripts/normalize-logos.mjs`
- Modify (by running the script): `public/images/logos/*.png`

**Interfaces:**
- Produces: the trimmed intrinsic `width`/`height` for each of the 16 logo PNGs (printed paste-ready), consumed by Task 2's `pressLogos` update.

- [ ] **Step 1: Write the script.** Create `scripts/normalize-logos.mjs`:

```js
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGO_DIR = path.join(__dirname, '..', 'public', 'images', 'logos');

// Mirror LogoWall.astro's displayHeight so the printout previews the result.
const TARGET_AREA = 7000, MIN_H = 28, MAX_H = 56;
const displayHeight = (w, h) =>
  Math.round(Math.min(MAX_H, Math.max(MIN_H, Math.sqrt(TARGET_AREA / (w / h)))));

const files = readdirSync(LOGO_DIR).filter((f) => f.endsWith('.png')).sort();
const rows = [];
for (const file of files) {
  const p = path.join(LOGO_DIR, file);
  // Read + trim fully into a buffer BEFORE writing back to the same path
  // (no concurrent read/write). trim() crops the uniform (transparent) border
  // to the content bounding box; threshold tolerates anti-aliased edges.
  // Idempotent: a trimmed image has content edge-to-edge, so a 2nd run finds
  // no border to remove and the dimensions are unchanged.
  const out = await sharp(p).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
  await sharp(out.data).toFile(p);
  rows.push({ file, w: out.info.width, h: out.info.height });
}

console.log('Trimmed logo dimensions (paste width/height into pressLogos):\n');
for (const r of rows) {
  console.log(
    `  ${r.file.padEnd(26)} width: ${String(r.w).padEnd(4)} height: ${String(r.h).padEnd(4)} -> displayHeight ${displayHeight(r.w, r.h)}px`,
  );
}
```

- [ ] **Step 2: Run it (trims the assets, prints the dims).**

Run: `node scripts/normalize-logos.mjs`
Expected: a table of 16 rows with trimmed `width`/`height` + a `displayHeight` preview. Content heights should now vary far less than the raw 132px canvas implied (e.g. `runners-world.png` ≈ 229×26, `the-new-york-times.png` ≈ 891×125). **Copy this output** — Task 2 pastes the dims. Fox News (`fox-news.png`) stays ~140×132 (opaque box, nothing to trim).

- [ ] **Step 3: Verify idempotency.** Run it a second time:

Run: `node scripts/normalize-logos.mjs`
Expected: identical `width`/`height` values to Step 2 (a trimmed image has no border left to remove). Confirm `git status` shows the 16 PNGs modified once (from Step 2), and the second run produced no further diff (`git diff --stat public/images/logos/` unchanged between the two runs).

- [ ] **Step 4: Sanity-check the assets built.** `npm run build` (41 pages), `npm run check:links` 0 broken (the `src` paths are unchanged, so links resolve). No test change yet.

- [ ] **Step 5: Commit.**

```bash
git add scripts/normalize-logos.mjs public/images/logos
git commit -m "chore(logos): trim press-logo padding + add normalize script"
```

---

### Task 2: Area-normalized rendering (data + component)

**Files:**
- Modify: `src/data/catalog.js` (the `pressLogos` array, ~line 5036)
- Modify: `src/components/plp/LogoWall.astro`

**Interfaces:**
- Consumes: the trimmed `width`/`height` printed by Task 1.
- Produces: nothing for later tasks.

- [ ] **Step 1: Add trimmed dimensions to `pressLogos`.** In `src/data/catalog.js`, give each of the 16 entries the `width`/`height` printed by Task 1 (keep the existing order + `name`/`src`). Use the actual Task 1 numbers; the shape is:

```js
export const pressLogos = [
  { name: 'The New York Times', src: '/images/logos/the-new-york-times.png', width: 891, height: 125 },
  { name: 'People', src: '/images/logos/people.png', width: 273, height: 92 },
  { name: 'New York Post', src: '/images/logos/new-york-post.png', width: 869, height: 131 },
  { name: 'National Geographic', src: '/images/logos/national-geographic.png', width: 274, height: 89 },
  { name: 'WebMD', src: '/images/logos/webmd.png', width: 129, height: 30 },
  { name: 'Bicycling', src: '/images/logos/bicycling.png', width: 226, height: 41 },
  { name: "Women's Health", src: '/images/logos/womens-health.png', width: 228, height: 46 },
  { name: "Men's Health", src: '/images/logos/mens-health.png', width: 264, height: 55 },
  { name: 'Forbes', src: '/images/logos/forbes.png', width: 98, height: 26 },
  { name: "Runner's World", src: '/images/logos/runners-world.png', width: 229, height: 26 },
  { name: 'Yahoo', src: '/images/logos/yahoo.png', width: 294, height: 57 },
  { name: 'GQ', src: '/images/logos/gq.png', width: 151, height: 76 },
  { name: '9News', src: '/images/logos/9news.png', width: 235, height: 89 },
  { name: 'Shape', src: '/images/logos/shape.png', width: 132, height: 36 },
  { name: 'Fox News', src: '/images/logos/fox-news.png', width: 140, height: 132 },
  { name: 'CBS', src: '/images/logos/cbs.png', width: 142, height: 44 },
];
```

(If Task 1's printed numbers differ from the above by a pixel or two, use Task 1's — they are the ground truth.)

- [ ] **Step 2: Add the `displayHeight` helper to `LogoWall.astro`.** In the frontmatter (`---` block), below the existing `const { logos = pressLogos } = Astro.props;`, add the three tuning constants + the helper:

```js
// Area-normalized per-logo height: for a fixed bounding-box area, h = √(area / aspect),
// so wide wordmarks get shorter and compact marks taller. Clamped so nothing goes extreme.
// TARGET_AREA + clamps tuned in the live pass (median logo ≈ 42px at these defaults).
const TARGET_AREA = 7000;
const MIN_H = 28;
const MAX_H = 56;
function displayHeight({ width, height }) {
  const aspect = width / height;
  return Math.round(Math.min(MAX_H, Math.max(MIN_H, Math.sqrt(TARGET_AREA / aspect))));
}
```

- [ ] **Step 3: Render each `<img>` at its per-logo height.** Replace BOTH `<li>` templates (the visible group and the `aria-hidden` duplicate) so each image carries its intrinsic dims + the computed inline height. Visible group:

```astro
        <ul class="logo-wall__group">
          {logos.map((logo) => (
            <li class="logo-wall__item"><img class="logo-wall__img" src={logo.src} alt={logo.name} width={logo.width} height={logo.height} style={`height: ${displayHeight(logo)}px`} /></li>
          ))}
        </ul>
        <ul class="logo-wall__group" aria-hidden="true">
          {logos.map((logo) => (
            <li class="logo-wall__item"><img class="logo-wall__img" src={logo.src} alt="" width={logo.width} height={logo.height} style={`height: ${displayHeight(logo)}px`} /></li>
          ))}
        </ul>
```

(`alt` stays `logo.name` on the visible group and `""` on the duplicate — unchanged from today; only the `width`/`height`/`style` are added.)

- [ ] **Step 4: Drop the flat height from the CSS.** In the `<style>`, change:

```css
  .logo-wall__img { height: 44px; width: auto; object-fit: contain; display: block; }
```

to (remove `height: 44px` — the height is now the per-logo inline style; keep the rest):

```css
  .logo-wall__img { width: auto; object-fit: contain; display: block; }
```

Leave every other rule (`.logo-wall`, `__pad`, `__heading`, `__viewport`, `__track`, the hover/focus pause, `__group`, `@keyframes logo-wall-scroll`, the reduced-motion block) exactly as-is.

- [ ] **Step 5: Verify build + data-shape tests.** `npm run build` (41 pages). `npm test` (28) — the `width`/`height` additions are additive; **if a test fails asserting an exact `{ name, src }`-only shape for `pressLogos`, update that test to allow the new fields** (report which test + the change). `npm run check:links` 0 broken. Grep a built page to confirm per-logo heights render, e.g.:

```bash
grep -o 'logo-wall__img[^>]*height: [0-9]*px' dist/collections/all/index.html | sort -u | head
```

Expected: multiple distinct `height: NNpx` values (not a single uniform height), within 28–56.

- [ ] **Step 6: Report the live-pass tuning owed.** State that the controller must, in the live browser at both widths: confirm the logos read balanced (no ~4× outliers; wide wordmarks no longer dominate), the marquee still loops seamlessly (no jump), hover pauses it, and the reduced-motion fallback exposes every logo — and tune `TARGET_AREA`/`MIN_H`/`MAX_H` if the balance needs it.

- [ ] **Step 7: Commit.**

```bash
git add src/data/catalog.js src/components/plp/LogoWall.astro
git commit -m "feat(logos): area-normalized per-logo sizing in the marquee"
```

---

### Task 3: Verification sweep + live tuning

**Files:** none (or `.superpowers/sdd/progress.md`).

- [ ] **Step 1: Full sweep.** Stop any dev/preview server; free port 4321. Run and paste actual output: `npm run build` (41 pages), `npm run check:links` (0 broken; re-run if a low count appears), `npm test` (28).

- [ ] **Step 2: Scope check.** `git diff --name-only master...HEAD` — expect only `scripts/normalize-logos.mjs`, `public/images/logos/*` (16 PNGs), `src/data/catalog.js`, `src/components/plp/LogoWall.astro` (+ the spec/plan docs already on master). Confirm `Plp.astro`/`Pdp.astro` are NOT listed.

- [ ] **Step 3: Marquee-preservation grep.** Confirm `LogoWall.astro` still has: the two `.logo-wall__group` (one `aria-hidden`), `@keyframes logo-wall-scroll` with `translateX(-50%)`, the `:hover`/`:focus-within` pause, and the `@media (prefers-reduced-motion: reduce)` block. Confirm the `alt` attributes are unchanged (visible = name, duplicate = "").

- [ ] **Step 4: Controller live pass (both widths).** With the dev server up, confirm: balanced logo sizes (measure a few computed `<img>` heights — all within 28–56, varied), seamless loop (no visible jump at the `-50%` point), hover/focus pauses the scroll, and reduced-motion freezes + lets every logo be reached. Tune `TARGET_AREA`/clamps in `LogoWall.astro` if needed, rebuild, re-confirm.

- [ ] **Step 5: Update `.superpowers/sdd/progress.md`** with the outcome + deferred items (Fox News transparent-bg re-export; WCAG touch-pause button — pre-existing).

- [ ] **Step 6: Commit** any live-pass tuning to `LogoWall.astro` (`git commit -m "fix(logos): tune area-normalization target/clamps"`); the ledger is gitignored (no-op).

---

## Definition of done

- Each logo PNG is trimmed to its content box; `scripts/normalize-logos.mjs` is committed and idempotent.
- Each `pressLogos` entry carries its trimmed `width`/`height`; `LogoWall` renders every logo at an area-normalized, clamped per-logo height (no flat `height: 44px`).
- Logos read as balanced (no ~4× outliers; wide wordmarks no longer dominate); the seamless marquee, hover-pause, reduced-motion fallback, and alt-text a11y are all preserved.
- Build 41 pages, `check:links` 0 broken, tests 28, and a controller live both-widths pass. Fox News + the WCAG touch-pause button remain flagged follow-ups.
