# Gait Happens Course PDP — Chunk B2 Implementation Plan (the last two sections + the five professional courses)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the course PDPs — build the last two section components (Three Column Info, Image With Text), roll the library out to the five professional courses, adopt FGA Level 2, and clear three B1 carry-overs.

**Architecture:** The data-driven `Pdp` composer already renders `item.pdp.sections` through a `type → {Component, props}` registry (13 types). B2 adds **two** registry entries and five `pdp` blocks. Both new components are built against **every non-paused instance the Figma actually contains** — not just the first page that needs them — because B1 produced ten separate defects from components fitted to whichever page was built first.

**Tech Stack:** Astro, vanilla JS, existing tokens/components. No new dependencies.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-14-gait-happens-course-pdp-b2-design.md`. **Figma:** file `FX7PDNvhZwyozODaq8Q8i7`.
- **Fidelity workflow (every task):** `get_metadata` on the page's desktop frame for its per-section node ids, then `get_design_context` on each section at desktop **AND** mobile BEFORE authoring; then verify the built section against the Figma at BOTH desktop (≥1024) and mobile (390) widths. Professional-course mobile frames are under section `1109:14374`.
- **Guards check NON-EMPTINESS, not presence.** `[]` and `{}` are truthy. An absent-or-empty optional field must render **nothing** — never an empty wrapper, caption, pill, heading, or `<p>`. This is the single most-repeated defect class in this project (fixed 3× in B1).
- **Build each component against every instance the design contains** (see Task 4 for Image With Text). Optional fields the *other* instances need are not speculation — those frames exist today.
- **If a task reveals an ELEVENTH hardcoded-to-the-first-page gap in an existing component: STOP and REPORT it.** Do not work around it and do not silently edit the component inside a data task. That report is the task's most valuable output.
- **Content is Figma-VERBATIM** — never invent, improve, or paraphrase; preserve even Figma's own typos. Where desktop and mobile diverge, **DESKTOP is canonical**: ship it and REPORT the divergence. Where Figma has no copy (the FAQ frames routinely mock only the collapsed accordion), **DISCLOSE the gap in a `catalog.js` code comment and the report — NEVER in rendered HTML.** Never invent factual or medical claims. (A B1 task shipped internal build notes as customer FAQ copy; caught and fixed. It must not recur.)
- `src/data/catalog.js` is the single source of truth. Tokens govern colour/type/spacing; component-intrinsic px may be literal.
- **Client JS uses module-scope event delegation** — one document-level listener keyed off `data-*` hooks, nodes resolved fresh per event, nothing cached (the idiom in `YourInstructors.astro` / `ProductDetails.astro`). Note the one exception Task 1 introduces: a *measurement* pass genuinely must re-run per page, so it hooks `astro:page-load` — the listener itself is still registered once at module scope.
- **Build page count: 41** after Task 2 (FGA Level 2 is the only genuinely new route; the other four courses already exist as generated placeholders, so flipping them to `built` swaps a generated page for an explicit one and leaves the count unchanged). Any other number means a `[...slug]` collision or a missing route — investigate, don't wave it through.
- Per-task verification: `npm run build`, `npm run check:links` = 0 broken, `npm test` green, + the both-widths Figma pass. Commit per task, conventional messages.
- **Operational:** `dist/` is now Dropbox-ignored, so builds are clean. `npm run check:links` needs port 4321 free. `npm test` is `node --test`. Live browser QA: the agent shell is **network-isolated from host Chrome** — a server it starts is unreachable — so the controller runs the live pass; check `list_connected_browsers` first, and note a BACKGROUNDED tab clamps `setTimeout` to ~430–760ms (which silently invalidates timing-sensitive tests).

## File Structure

```
src/components/pdp/
  ThreeColumnInfo.astro     Task 3 — NEW: display heading + 3 check-list columns + CTA
  ImageWithText.astro       Task 4 — NEW: image beside heading + bullets (+ optional intro/lead/CTA)
  InstructorCard.astro      Task 1 — MODIFY: drop `bioExpandable`, add `data-instructor-bio` hook
  YourInstructors.astro     Task 1 — MODIFY: measured overflow check for the Read More toggle
  PdpReviews.astro          Task 1 — MODIFY: <!-- --> → {/* */}
  Pdp.astro                 Tasks 3,4 — MODIFY: 2 new registry entries
src/components/
  CartDrawer.astro          Task 1 — MODIFY: <!-- --> → {/* */}
astro.config.mjs            Task 1 — MODIFY: pin build.inlineStylesheets
public/images/pdp/
  check.svg                 Task 3 — NEW: exported from Figma (no reusable check icon exists)
src/data/
  catalog.js                Tasks 2-7 — FGA L2 item + 5 `pdp` blocks
  sitemap.js                Tasks 2-7 — FGA L2 route + 5 status flips
src/pages/courses/
  gait-foundations.astro                Task 3 — NEW
  trainer-certification.astro           Task 4 — NEW
  functional-gait-assessment-l1.astro   Task 5 — NEW
  functional-gait-assessment-l2.astro   Task 6 — NEW
  gait-guru-membership.astro            Task 7 — NEW
```

Reused unchanged: `CourseDetails`, `CourseOverview`, `FourColumn`, `ComparisonChart`, `Testimonial`, `Faqs`, `PdpAccordion`, `CrossSell`, `PdpReviews`, `LogoWall`, `StarRating`.

---

### Task 1: B1 carry-overs (Read More false affordance, DEV comments, pin inlineStylesheets)

**Files:**
- Modify: `src/components/pdp/InstructorCard.astro`, `src/components/pdp/YourInstructors.astro`, `src/components/pdp/PdpReviews.astro`, `src/components/CartDrawer.astro`, `astro.config.mjs`, `src/data/catalog.js` (remove the `bioExpandable` field)

**Interfaces:**
- Produces: the bio element carries `data-instructor-bio`; the toggle is hidden at runtime when the bio does not overflow its clamp. **`instructor.bioExpandable` is DELETED** — Tasks 3–7 must not author it.

**Why `bioExpandable` goes away.** It was added as a stopgap so Walk's McDowell card wouldn't show a toggle revealing nothing. But a measured check subsumes it: a short bio simply doesn't overflow, so no toggle appears — same outcome, no data field, one mechanism instead of two. It is also actively wrong to keep: whether a bio overflows is **width-dependent** (a 219-char bio can fit four lines on a 384px desktop card and overflow on a 320px mobile one), so no authored boolean can be correct at both breakpoints. Deleting it removes a field that would mislead the Shopify porting team.

- [ ] **Step 1: Add the measurement hook to the bio element.**

In `src/components/pdp/InstructorCard.astro`: delete the `const showToggle = instructor.bioExpandable !== false;` line and the `bioExpandable` header-comment block. Render the toggle unconditionally again, and add a `data-instructor-bio` attribute to the bio element (keep its existing `id`, class, and `data-collapsed`):

```astro
<div class="instructor-card__bio" id={bioId} data-instructor-bio data-collapsed>
```
The toggle button and its `aria-controls={bioId}` stay exactly as they are today.

- [ ] **Step 2: Add the measured overflow check.**

In `src/components/pdp/YourInstructors.astro`'s existing `<script>`, ADD the following alongside (not replacing) the existing delegated click listener:

```js
  // The Read More toggle must only exist when the bio ACTUALLY overflows its
  // 4-line clamp — otherwise it is a control that reveals nothing (a false
  // affordance; same reasoning that keeps Testimonial's arrows inert when
  // there is only one quote). Overflow is WIDTH-dependent, so this cannot be
  // an authored data flag: it must be measured, and re-measured on resize.
  //
  // The listeners below are registered ONCE at module scope (Astro's
  // ClientRouter never re-executes an identical inline module), but the
  // measurement itself must re-run against each new page's DOM — hence
  // `astro:page-load`. Nodes are resolved fresh on every run; nothing is cached.
  function syncInstructorToggles() {
    document.querySelectorAll('[data-instructor-bio]').forEach((bio) => {
      const toggle = document.querySelector(`[aria-controls="${bio.id}"]`);
      if (!toggle) return;
      if (toggle.getAttribute('aria-expanded') === 'true') return; // user opened it — leave alone
      bio.setAttribute('data-collapsed', ''); // measure the CLAMPED height
      const overflows = bio.scrollHeight > bio.clientHeight + 1; // +1 absorbs sub-pixel rounding
      toggle.hidden = !overflows;
      if (!overflows) bio.removeAttribute('data-collapsed');
    });
  }

  document.addEventListener('astro:page-load', syncInstructorToggles);
  window.addEventListener('resize', () => requestAnimationFrame(syncInstructorToggles));
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncInstructorToggles);
  } else {
    syncInstructorToggles();
  }
```

- [ ] **Step 3: Remove `bioExpandable` from the data.** In `src/data/catalog.js`, delete the `bioExpandable: false` field from Walk's McDowell instructor entry (and any other occurrence — `grep -n bioExpandable src/data/catalog.js` must return nothing when you're done). Leave the comment explaining that her bio is a known-incomplete Figma excerpt the client must supply — that fact is still true and still worth recording; only the now-redundant flag goes.

- [ ] **Step 4: Convert the DEV HTML comments.**

`src/components/pdp/PdpReviews.astro:43` and `src/components/CartDrawer.astro:27` use `<!-- … -->`, which SHIPS the comment in the page source of every page — and one of them tells any reader that the review numbers are fake. Convert both to Astro's compile-time form `{/* … */}` so they stay in the source but never reach the browser. Preserve the comment text.

- [ ] **Step 5: Pin `inlineStylesheets`.**

In `astro.config.mjs`, inside `defineConfig({...})`, add:

```js
  // Pinned deliberately. Astro's default `'auto'` inlines a stylesheet only
  // while it is under 4096 bytes, so an unrelated CSS edit can silently flip
  // 17 pages between <style> and <link>. `'never'` makes the build output
  // deterministic — the right trade for a reference build the client's dev
  // team reads and ports.
  build: { inlineStylesheets: 'never' },
```

- [ ] **Step 6: Verify — and note what SHOULD change.**

Run: `npm run build`, `npm run check:links`, `npm test`.
Expected: 40 pages (FGA L2 doesn't exist yet — that's Task 2), 0 broken links, 28/28 tests.

**Built-HTML diff expectations — read carefully, several changes here are INTENDED:**
- **The Read More fix is a RUNTIME change**, so built HTML changes only by (a) the new `data-instructor-bio` attribute, (b) the toggle no longer being conditionally omitted on Walk's McDowell card (it is now always rendered and hidden at runtime instead), and (c) the new script. **The visible fix must be confirmed in a real browser, not in `dist`.**
- **The DEV comments disappear** from all pages' source. Intended.
- **`inlineStylesheets: 'never'` moves every inline `<style>` to a `<link>`** across all pages. Intended, and the point of pinning it.

So the gate for this task is **not** "zero diff" — it is *"every difference is one of the three intended changes above, and nothing else."* Enumerate them and confirm. (B1 twice showed the cost of treating byte-identity as the goal rather than as a proxy for "nothing changed that shouldn't have".)

- [ ] **Step 7: Confirm the actual fix in a browser.** Report that you cannot drive host Chrome if you cannot — the controller runs this. The check: on `/courses/sole-switch-pro`, **Dr. Conley's** long bio still shows a working Read More; **Dr. Riley's** short bio shows **no toggle at all**. Same on `/products/walk` for **McDowell**. Then narrow the window to ~390px and confirm a bio that fits at desktop but overflows at mobile **gains** its toggle back — that is the whole reason this is measured rather than authored.

- [ ] **Step 8: Commit.**

```bash
git add src/components/pdp/InstructorCard.astro src/components/pdp/YourInstructors.astro src/components/pdp/PdpReviews.astro src/components/CartDrawer.astro astro.config.mjs src/data/catalog.js
git commit -m "fix(pdp): measure bio overflow for Read More; hide DEV comments; pin inlineStylesheets"
```

---

### Task 2: Adopt Functional Gait Assessment Level 2 into the data model

**Files:**
- Modify: `src/data/catalog.js` (new item + collection membership), `src/data/sitemap.js` (new route)

**Interfaces:**
- Produces: catalog item id **`functional-gait-assessment-l2`**, handle `functional-gait-assessment-l2`, href `/courses/functional-gait-assessment-l2`. Tasks 3–7 may reference this id in their `crossSell.itemIds`.

**Why this is its own task, and why it comes first.** `1041:10410` is a fully-designed Figma page that exists **nowhere** in our data. The other four courses' cross-sell blocks may reference it, and `catalog.test.mjs` fails if a `crossSell.itemIds` entry doesn't resolve — so the item must exist before any page authors its cross-sell. This task adds the **item, route, and PLP membership only**; its actual PDP is Task 6.

- [ ] **Step 1: Pull the Figma for the item's card-level fields.** `get_metadata` on `1041:10410`, then `get_design_context` on its Course Details node for the title, price, and description. Also check the Professionals PLP frame for its card copy if it differs.

- [ ] **Step 2: Add the catalog item.** In `src/data/catalog.js`, in the "Courses — Professionals" block, add an item mirroring the shape of its sibling `functional-gait-assessment-l1` exactly (id, handle, title, kind, badges, price, priceRange, description, image, href, cta, variants, sizeChart). Use the Figma-verbatim title and price. `image` is a placeholder — point it at an existing file under `public/images/plp/` following the convention the other course items use, and **confirm the file exists on disk** (a missing image breaks `check:links`).

- [ ] **Step 3: Add it to the collections.** Add `'functional-gait-assessment-l2'` to the `itemIds` of the **Gait Happens Professionals Courses** collection and the **All Courses** collection, positioned as the Figma PLP shows (immediately after Level 1 unless the design says otherwise).

- [ ] **Step 4: Add the sitemap route** as a **placeholder** (do NOT mark it `built` — its page is Task 6):

```js
  r('/courses/functional-gait-assessment-l2', 'Functional Gait Assessment L2', 'course', ['Home', 'Courses', 'Functional Gait Assessment L2']),
```
Place it next to the Level 1 line.

- [ ] **Step 5: Verify.**

Run: `npm run build` → **41 pages** (this route is genuinely new, so `[...slug]` generates a placeholder page for it: +1). Confirm with `find dist -name index.html | wc -l`.
Run: `npm run check:links` → 0 broken (this is what catches a bad `image` path or a bad `href`).
Run: `npm test` → green (the existing catalog test asserts every item's `href` resolves to a route).
Confirm the item now appears on `/collections/courses-professionals` and `/collections/all-courses`.

- [ ] **Step 6: Commit.**

```bash
git add src/data/catalog.js src/data/sitemap.js
git commit -m "feat(catalog): adopt Functional Gait Assessment Level 2"
```

---

### Task 3: Three Column Info + `/courses/gait-foundations`

Figma: Gait Foundations desktop frame `675:9036`; its Three Column Info node `675:9040`. Mobile under section `1109:14374`.

**Files:**
- Create: `src/components/pdp/ThreeColumnInfo.astro`, `public/images/pdp/check.svg`, `src/pages/courses/gait-foundations.astro`
- Modify: `src/components/pdp/Pdp.astro` (register `three-column-info`), `src/data/catalog.js` (`gait-foundations.pdp`), `src/data/sitemap.js` (flip the route)

**Interfaces:**
- Consumes: the registry pattern in `Pdp.astro`; the `pdp` field names established by the B1 courses (read `fit-feet`'s block — it is the most complete template).
- Produces: registry type **`three-column-info`**, reading `item.pdp.threeColumn`:

```js
threeColumn: {
  heading,                                    // string — e.g. "About The Gait Foundations Course"
  columns: [ { heading, items: [string] } ],  // teal sub-heading + a check-list; item counts DIFFER per column
  cta: { label, href },
}
```
Tasks 5–7 author this same shape.

- [ ] **Step 1: Pull the Figma.** `get_design_context` on `675:9040` (desktop) and its mobile counterpart. The structure: a centred display heading (`--type-display`, 40px bold); three equal columns each with a **teal** 20px bold sub-heading and a vertical list of *check-icon + text* rows (`--type-body-sm`, 14px); a teal CTA button below, centred. **Item counts differ per column** (3 / 3 / 5 on this course) — so `columns` is a list of lists, never a fixed triple.

- [ ] **Step 2: Export the check icon.** The Three Column Info node's icon is a real asset. Download it from the `get_design_context` asset URL and commit it as `public/images/pdp/check.svg`.
  **Do NOT reuse `ComparisonChart.astro`'s `✓`** — that is a *text character* in a branch that never renders (both comparison frames use literal "Yes"/"No" text, so the glyph appears nowhere in the built HTML), and it is not an icon. There is no check icon in the official brand library either (`01_Assets\00_Icons\` holds only `QuickCart.svg`). Store it following the convention the existing nav/PLP icons use.

- [ ] **Step 3: Build `ThreeColumnInfo.astro`.** Prop is `{ item }` (same as every other course section). Read `item.pdp.threeColumn`. Tokens for colour/type/spacing. Responsive per the mobile frame (the three columns stack).
  The check icons are **decorative** — the text beside each carries the meaning — so mark them `aria-hidden="true"` and give them no accessible name. Do not add an `sr-only` "included" string here: unlike `ComparisonChart` (where a bare ✓/✕ in a table cell IS the content), these icons sit next to their own text.
  The CTA: reuse the shared external-link predicate `isExternalHref()` from `src/scripts/links.js` (it already exists — B1 unified it) so an internal `/courses/...` href does not get `target="_blank"`.

- [ ] **Step 4: Register it.** In `src/components/pdp/Pdp.astro`, add to `REGISTRY`, guarding on **non-emptiness** exactly like its siblings:

```js
  'three-column-info': {
    Component: ThreeColumnInfo,
    props: (item) => (item.pdp?.threeColumn?.columns?.length > 0 ? { item } : null),
  },
```

- [ ] **Step 5: Author Gait Foundations' full `pdp` block** in `catalog.js`, Figma-verbatim, mirroring `fit-feet`'s field names. Its sections:

```js
sections: ['course-details','course-overview','four-column','three-column-info','testimonial',
           'your-instructors','cross-sell','faqs','pdp-reviews','logo-wall'],
```
**FLAG — its instructor section.** In Figma, Gait Foundations' instructor cards sit in a **bare frame (`1027:12431`)**, not a `Your Instructors` component instance — so it may have **no section heading**. `YourInstructors` has an optional `instructorsHeading` (default `'Your Instructors'`), but that default is **on**. Check the node. If the frame genuinely has no heading, the component needs an explicit *no-heading* case — **STOP and REPORT that; do not work around it and do not edit the component in this data task.**

- [ ] **Step 6: Create the page** `src/pages/courses/gait-foundations.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Pdp from '../../components/pdp/Pdp.astro';
import { getItem } from '../../data/catalog.js';

const item = getItem('gait-foundations');
---
<BaseLayout title={item.title} description={item.description} wide>
  <Pdp item={item} />
</BaseLayout>
```

- [ ] **Step 7: Flip the route** in `sitemap.js` — pass `{ status: 'built' }` as the 5th argument to the `/courses/gait-foundations` line.

- [ ] **Step 8: Verify.** `npm run build` (**41 pages**, unchanged from Task 2 — this route already existed as a placeholder), `npm run check:links` 0 broken, `npm test` green, + the both-widths Figma pass on `/courses/gait-foundations`. Confirm the nine already-shipped PDPs are unchanged (you only added data + a new component nothing else uses).

- [ ] **Step 9: Commit.**

```bash
git add src/components/pdp/ThreeColumnInfo.astro src/components/pdp/Pdp.astro public/images/pdp/check.svg src/pages/courses/gait-foundations.astro src/data/catalog.js src/data/sitemap.js
git commit -m "feat(pdp): three column info section + gait foundations PDP"
```

---

### Task 4: Image With Text + `/courses/trainer-certification`

Figma: Trainer Certification desktop frame `683:10086`; its Image With Text node `686:6540`; its Three Column Info node `1057:31123`. Mobile under `1109:14374`.
**Also pull (for the component's shape, NOT for data):** Foot Fest's Image With Text instances `674:7748`, `674:7750`, `674:7752`.

**Files:**
- Create: `src/components/pdp/ImageWithText.astro`, `src/pages/courses/trainer-certification.astro`
- Modify: `src/components/pdp/Pdp.astro` (register `image-with-text`), `src/data/catalog.js` (`trainer-certification.pdp`), `src/data/sitemap.js` (flip the route)

**Interfaces:**
- Consumes: `three-column-info` (Task 3) — Trainer Cert uses it too.
- Produces: registry type **`image-with-text`**, reading `item.pdp.imageWithText`:

```js
imageWithText: {
  image,                 // string — path under /images/...
  imageSide,             // 'left' (default) | 'right'
  heading,               // string
  intro,                 // OPTIONAL — a line above the list
  listLead,              // OPTIONAL — e.g. "The VIP Package includes:"
  items: [string],       // bullet list
  cta,                   // OPTIONAL — { label, href }
}
```

**BUILD IT AGAINST ALL ITS INSTANCES.** Trainer Cert's (`686:6540`) is image-**LEFT**, heading + bullets, **no** intro, **no** lead-in, **no** CTA. Foot Fest's (Chunk C) are image-**RIGHT**, and add an intro line, a lead-in sentence, and a **CTA button**. Those frames exist in the design **today** — supporting them is not speculation, and B1 produced ten defects from components fitted to whichever page happened to be built first. **Chunk B2 ships only Trainer Certification's data**; Chunk C must then need no component edit.

- [ ] **Step 1: Pull the Figma.** `get_design_context` on `686:6540` (desktop) + its mobile counterpart, AND on Foot Fest's `674:7750` — the latter purely to learn the shape of the optional fields (image side, intro, lead-in, CTA). Do not author Foot Fest data.

- [ ] **Step 2: Build `ImageWithText.astro`.** Prop `{ item }`, reading `item.pdp.imageWithText`. Image beside a text column: heading (`--type-h3`), optional intro, optional lead-in, a `<ul>` of `items`, optional CTA.
  **Every optional field is guarded on non-emptiness: absent → renders NOTHING, no empty `<p>`, no empty `<ul>`, no empty button.** `imageSide: 'right'` flips the order (use CSS `order`/`row-reverse`, not a duplicated markup branch). Responsive per the mobile frame (stacks; confirm which of image/text comes first on mobile — do not assume it follows `imageSide`).
  The image's `alt`: these are decorative/lifestyle shots beside a heading that already carries the meaning — follow `InstructorCard.astro`'s precedent (`alt=""`) and say which you chose and why. Reuse `isExternalHref()` from `src/scripts/links.js` for the CTA.

- [ ] **Step 3: Register it.** In `Pdp.astro`:

```js
  'image-with-text': {
    Component: ImageWithText,
    props: (item) => (item.pdp?.imageWithText?.items?.length > 0 ? { item } : null),
  },
```

- [ ] **Step 4: Author Trainer Certification's full `pdp` block**, Figma-verbatim. Its sections — note **no `testimonial`**:

```js
sections: ['course-details','course-overview','four-column','three-column-info','image-with-text',
           'your-instructors','cross-sell','faqs','pdp-reviews','logo-wall'],
```
Its `imageWithText` sets `image`, `heading`, and `items` only — **omit `imageSide`, `intro`, `listLead`, and `cta` entirely** (its Figma has none of them). Course imagery is placeholder: point `image` at an existing file under `public/images/` and confirm it exists.

- [ ] **Step 5: Create the page** `src/pages/courses/trainer-certification.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Pdp from '../../components/pdp/Pdp.astro';
import { getItem } from '../../data/catalog.js';

const item = getItem('trainer-certification');
---
<BaseLayout title={item.title} description={item.description} wide>
  <Pdp item={item} />
</BaseLayout>
```

- [ ] **Step 6: Flip the route** — `{ status: 'built' }` on the `/courses/trainer-certification` line in `sitemap.js`.

- [ ] **Step 7: Verify.** Build (41 pages), `check:links` 0, `npm test` green, both-widths Figma pass. **Additionally prove the optional fields are genuinely optional:** grep `dist/courses/trainer-certification/index.html` and confirm the Image With Text section contains **no** empty intro `<p>`, **no** empty lead-in, and **no** CTA button — since its data omits all three.

- [ ] **Step 8: Commit.**

```bash
git add src/components/pdp/ImageWithText.astro src/components/pdp/Pdp.astro src/pages/courses/trainer-certification.astro src/data/catalog.js src/data/sitemap.js
git commit -m "feat(pdp): image with text section + trainer certification PDP"
```

---

### Task 5: `/courses/functional-gait-assessment-l1`

Figma desktop frame `675:9357`; Three Column Info node `675:9361`; Comparison Chart node `1045:22122`. Mobile under `1109:14374`.

**Files:**
- Create: `src/pages/courses/functional-gait-assessment-l1.astro`
- Modify: `src/data/catalog.js` (`functional-gait-assessment-l1.pdp`), `src/data/sitemap.js` (flip the route)

**Interfaces:**
- Consumes: `three-column-info` (Task 3). No new components — this is pure data.

- [ ] **Step 1: Pull the Figma.** `get_metadata` on `675:9357` for per-section nodes, then `get_design_context` on each at desktop AND mobile. Sections:

```js
sections: ['course-details','course-overview','four-column','comparison-chart','three-column-info',
           'testimonial','your-instructors','cross-sell','faqs','pdp-reviews','logo-wall'],
```

- [ ] **Step 2: Author the `pdp` block**, Figma-verbatim, mirroring `fit-feet`'s field names. Reminders on the fields B1 made data-driven — read this course's OWN nodes, never assume:
  - `comparison`: `{ intro?, columns, rows, cta:{label,href} }`. The `<h2>` is **derived** as `columns[0] VS columns[1]`, so `columns` must be the real course names from its own table. `intro` and `cta` are per-course.
  - `courseCard` **or** `heroImage` (mutually exclusive — read the hero node), `compareAtPrice` only if the hero shows a struck-through price, `pills` only if the hero shows a label + pill group, `courseCard.tag` omitted entirely if there is no pill.
  - `testimonial` **must be an ARRAY** of `{ quote: string[], author, role, rating }` (a test enforces this). `quote` is an array of paragraph strings; a `\n` inside one is a deliberate `<br>`. If the frame shows multiple testimonials, author them ALL — the carousel is real.
  - `threeColumn` per Task 3's shape.
  - Do **not** author `bioExpandable` (Task 1 deleted it).
- [ ] **Step 3: Create the page** `src/pages/courses/functional-gait-assessment-l1.astro` (same 10-line pattern as Task 3 Step 6, with `getItem('functional-gait-assessment-l1')`).
- [ ] **Step 4: Flip the route** — `{ status: 'built' }` on the `/courses/functional-gait-assessment-l1` line.
- [ ] **Step 5: Verify.** Build (41 pages), `check:links` 0, `npm test` green, both-widths Figma pass. Log all desktop/mobile divergences and Figma content gaps in the report.
- [ ] **Step 6: Commit.**

```bash
git add src/pages/courses/functional-gait-assessment-l1.astro src/data/catalog.js src/data/sitemap.js
git commit -m "feat(pdp): functional gait assessment level 1 PDP"
```

---

### Task 6: `/courses/functional-gait-assessment-l2`

Figma desktop frame `1041:10410`; Three Column Info node `1041:10415`; Comparison Chart node `1075:15698`. Mobile under `1109:14374`.

**Files:**
- Create: `src/pages/courses/functional-gait-assessment-l2.astro`
- Modify: `src/data/catalog.js` (`functional-gait-assessment-l2.pdp`), `src/data/sitemap.js` (flip the route to `built`)

**Interfaces:**
- Consumes: the catalog item created in **Task 2**, and `three-column-info` (Task 3). Pure data.

Its section list is the same as Level 1's:

```js
sections: ['course-details','course-overview','four-column','comparison-chart','three-column-info',
           'testimonial','your-instructors','cross-sell','faqs','pdp-reviews','logo-wall'],
```

- [ ] **Step 1: Pull the Figma.** `get_metadata` on `1041:10410`, then `get_design_context` per section at desktop AND mobile.
- [ ] **Step 2: Author the `pdp` block** on the `functional-gait-assessment-l2` item Task 2 created. Figma-verbatim, same field reminders as Task 5 Step 2 (comparison `columns` drive the derived `<h2>`; `courseCard` XOR `heroImage`; `testimonial` is an ARRAY; no `bioExpandable`). **This course's comparison table is its own — do not copy Level 1's.**
- [ ] **Step 3: Create the page** `src/pages/courses/functional-gait-assessment-l2.astro` (same 10-line pattern, `getItem('functional-gait-assessment-l2')`).
- [ ] **Step 4: Flip the route to `built`** — add `{ status: 'built' }` to the `/courses/functional-gait-assessment-l2` line Task 2 added.
- [ ] **Step 5: Verify.** Build → **still 41 pages** (Task 2 already added the route as a placeholder; this flips a generated page to an explicit one, so the count must NOT change). `check:links` 0, `npm test` green, both-widths Figma pass.
- [ ] **Step 6: Commit.**

```bash
git add src/pages/courses/functional-gait-assessment-l2.astro src/data/catalog.js src/data/sitemap.js
git commit -m "feat(pdp): functional gait assessment level 2 PDP"
```

---

### Task 7: `/courses/gait-guru-membership`

Figma desktop frame `682:9759`; Three Column Info node `1057:31197`. Mobile under `1109:14374`.

**Files:**
- Create: `src/pages/courses/gait-guru-membership.astro`
- Modify: `src/data/catalog.js` (`gait-guru-membership.pdp`), `src/data/sitemap.js` (flip the route)

**Interfaces:**
- Consumes: `three-column-info` (Task 3). Pure data.

**This course's section list is the shortest — note what is ABSENT: no `course-overview`, no `pdp-reviews`.**

```js
sections: ['course-details','four-column','three-column-info','testimonial',
           'your-instructors','cross-sell','faqs','logo-wall'],
```
This is a real exercise of the composer's guards: simply omitting a type from `sections` must render nothing for it, with no empty wrapper. If either section renders anyway, that's a composer bug — report it.

- [ ] **Step 1: Pull the Figma.** `get_metadata` on `682:9759`, then `get_design_context` per section at desktop AND mobile.
- [ ] **Step 2: Author the `pdp` block**, Figma-verbatim, same field reminders as Task 5 Step 2. Do **not** author `overview` or `reviews` — this course has neither.
- [ ] **Step 3: Create the page** `src/pages/courses/gait-guru-membership.astro` (same 10-line pattern, `getItem('gait-guru-membership')`).
- [ ] **Step 4: Flip the route** — `{ status: 'built' }` on the `/courses/gait-guru-membership` line.
- [ ] **Step 5: Verify.** Build (41 pages), `check:links` 0, `npm test` green, both-widths Figma pass. **Additionally grep the built page** to confirm it contains **no** Course Overview section and **no** Reviews section — and no empty wrappers where they'd have been.
- [ ] **Step 6: Commit.**

```bash
git add src/pages/courses/gait-guru-membership.astro src/data/catalog.js src/data/sitemap.js
git commit -m "feat(pdp): gait guru membership PDP"
```

---

### Task 8: Verification sweep

**Files:**
- Modify: `.superpowers/sdd/progress.md` (and `tests/catalog.test.mjs` only if a gap is found)

- [ ] **Step 1: Confirm the guard tests already cover the new courses.** `tests/catalog.test.mjs` asserts every `built` course route has a `pdp` block, a non-empty `pdp.sections`, and a resolving `crossSell`. Run `npm test` — the five new courses are covered for free. Its sanity assertion is `courseItems.length >= 4`; there are now **nine** built courses, so bump that floor to `>= 9` so the test can't go vacuously green if a filter breaks.
- [ ] **Step 2: Full sweep.** Run and paste the actual output:
  - `npm run build` → **41 pages** (`find dist -name index.html | wc -l`).
  - `npm run check:links` → 0 broken.
  - `npm test` → green.
- [ ] **Step 3: Per-page section counts.** The composer renders unknown/guarded-off types as NOTHING, so a typo'd `sections` entry **fails silently**. Grep each new built page and confirm its section count matches its list: gait-foundations 10, trainer-certification 10, FGA L1 11, FGA L2 11, gait-guru-membership 8. Report any section declared in data that renders nothing.
- [ ] **Step 4: Confirm `_status`** shows all five new routes as `built`.
- [ ] **Step 5: Update `.superpowers/sdd/progress.md`** with the chunk's findings: every client-content gap and desktop/mobile divergence found, any eleventh component gap, and what remains for Chunk C.
- [ ] **Step 6: Commit.**

```bash
git add tests/catalog.test.mjs .superpowers/sdd/progress.md
git commit -m "test(pdp): raise built-course floor to 9"
```

---

## Definition of done

- Five professional course routes live and `built`; FGA Level 2 adopted into catalog, sitemap, and both PLP collections.
- `ThreeColumnInfo` and `ImageWithText` exist, are registered, guard on non-emptiness, and carry **no per-course content**. `ImageWithText` supports every instance the Figma contains, so Chunk C needs no component edit.
- The Read More toggle appears **only** when the bio actually overflows — verified in a browser at both widths, not just in `dist`.
- DEV comments no longer ship in page source; `inlineStylesheets` pinned.
- Build 41 pages, `check:links` 0 broken, tests green, both-widths Figma pass on every new page.
- Chunk C (Foot Fest) and the paused Virtual Consultations remain the only course pages left.
