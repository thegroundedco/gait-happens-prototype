# Gait Happens Course PDP — Chunk A Implementation Plan (section library + Sole Switch Pro)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the course-PDP section library — a data-driven `Pdp` composer + 6 new course sections — and assemble the pilot `/courses/sole-switch-pro`, faithful to the Figma at desktop and mobile, without regressing the 6 shipped product PDPs.

**Architecture:** Generalize `Pdp.astro` to render an ordered `item.pdp.sections` list via a `type → component` registry (products migrate to declare their fixed list — behavior-preserving). Add course section components in `src/components/pdp/`, reusing `FourColumn`/`CrossSell`/`PdpReviews`/`LogoWall`/`PdpAccordion`. Course content lives in `catalog.js` per course; the enroll CTA is an external Kajabi link (not the cart). Sole Switch Pro is the pilot built end-to-end; later chunks roll out the rest.

**Tech Stack:** Astro, vanilla JS, existing tokens/components. No new dependencies.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-12-gait-happens-course-pdp-design.md`. **Figma:** file `FX7PDNvhZwyozODaq8Q8i7`. Pilot Sole Switch Pro desktop frame `675:4309`; professional courses mobile section `1109:14374` (the Sole Switch Pro mobile frame + per-section mobile nodes are found within it via `get_metadata` at implementation).
- **Fidelity workflow (every section task):** pull the section's `get_design_context` for BOTH its desktop node (given per task) and its mobile node (from `1109:14374`) BEFORE building; build ONE responsive component to our tokens; then **verify the built section against the Figma at BOTH desktop (≥1024) and mobile (390) widths** — the task's acceptance gate. (Subagents that can't drive a real browser say so; the controller does the both-widths pass at the checkpoint, and adjudicates deviations against the Figma via `get_screenshot`.)
- **Content:** Figma-verbatim where real (titles, price, copy, comparison rows, testimonial quote, instructor names/credentials/bios, FAQ copy); placeholder images/photos. `src/data/catalog.js` is the single source of truth — no hardcoded course content in components.
- Tokens govern color/type/spacing (`--color-ink`/`--color-yellow`/`--color-teal`/`--color-paper`, `--type-*`, `--space-*`); component-intrinsic px may be literal.
- **Enroll CTA:** `CourseDetails`'s primary CTA is an `<a href={item.pdp.enrollHref}>` (external Kajabi link — a placeholder URL for now), NOT a cart button. `cart.js` is untouched this chunk.
- Client JS (if any — e.g. a testimonial carousel) inits on load AND `astro:after-swap`; document listeners once at module scope; no leaks; `prefers-reduced-motion` honored. Prefer no-JS (native `<details>` for FAQs; static testimonial) where the Figma allows.
- Do NOT flip `/courses/sole-switch-pro` to `built` until its page renders (Task 1 creates it). `[...slug].astro` generates only `placeholder` routes (no collision).
- **No unit tests for visual sections.** Verification each task: `npm run build` (page count changes only when a placeholder route flips to explicit — confirm no collision; a transient Dropbox `.vite` EBUSY is benign, confirm `find dist -name index.html | wc -l`), `npm run check:links` = 0 broken, `npm test` green, + the both-widths Figma pass. Commit per task, conventional messages.
- **Composer migration is behavior-preserving:** after Task 1, each of the 6 product PDPs must render the SAME sections in the SAME order as before (spot-check built HTML) — the migration's acceptance gate.
- **Browser/dev-server gotcha:** run ONE `astro dev --host` and use the LAN IP; GSAP/motion animate only when Chrome is foregrounded; `check:links` needs port 4321 free (stop the dev server first, restart after) — and DON'T spawn many dev servers (orphans creep the port). If a section subagent runs `check:links`, it may false-positive off a live dev server; the controller reruns clean.

## File Structure

```
src/components/pdp/            (new this chunk)
  CourseDetails.astro          Task 2 — hero: breadcrumb/title/rating/price/2 CTAs + branded card
  CourseOverview.astro         Task 3 — image + overview copy + detail columns
  YoullStopAndInstead.astro    Task 4 — "you'll stop X / and instead Y" band
  ComparisonChart.astro        Task 5 — feature comparison table (data-driven)
  Testimonial.astro            Task 6 — quote + stars + attribution (+ arrows)
  YourInstructors.astro (+ InstructorCard) Task 7
  Faqs.astro                   Task 8 — band + heading wrapping PdpAccordion
Modified: Pdp.astro (registry + section-list) Task 1; catalog.js (products' sections + sole-switch-pro pdp); sitemap.js (flip route) Task 1.
New page: src/pages/courses/sole-switch-pro.astro Task 1.
Reuse: FourColumn, CrossSell, PdpReviews, LogoWall, PdpAccordion, StarRating.
```

---

### Task 1: Data-driven composer + product migration + Sole Switch Pro scaffold

**Files:** Modify `src/components/pdp/Pdp.astro`, `src/data/catalog.js`, `src/data/sitemap.js`. Create `src/pages/courses/sole-switch-pro.astro`. Read `Pdp.astro` + the 6 products' `pdp` blocks + how the course items look in `catalog.js` first.

**Interfaces:**
- `Pdp.astro` renders `item.pdp.sections` (ordered array of `{ type, ...data }` or plain `type` strings) via a `type → component` registry. Each section component receives `{ item }` (+ spread `data`). **Unknown types render nothing** (a dev comment/`console.warn` in dev) so the course page can carry its full section list while course components are still being built (Tasks 2–7).
- Registry initial entries (already-built): `product-details`, `four-column`, `brand-section`, `cross-sell`, `pdp-reviews`, `logo-wall`. Course entries (`course-details`, `course-overview`, `youll-stop-and-instead`, `comparison-chart`, `testimonial`, `your-instructors`, `faqs`) are added by their tasks.

- [ ] **Step 1: Generalize `Pdp.astro`.** Replace the hardcoded section order with: `const REGISTRY = { 'product-details': ProductDetails, 'four-column': FourColumn, 'brand-section': BrandSection, 'cross-sell': CrossSell, 'pdp-reviews': PdpReviews, 'logo-wall': LogoWall };` then render `(item.pdp?.sections ?? []).map(s => { const type = typeof s === 'string' ? s : s.type; const C = REGISTRY[type]; return C ? <div data-reveal><C item={item} {...(typeof s === 'object' ? s : {})} /></div> : null; })`. (Keep `data-reveal` wrapping.)
- [ ] **Step 2: Migrate the 6 products.** Give each product's `pdp` a `sections: ['product-details','four-column','brand-section','cross-sell','pdp-reviews','logo-wall']`. (Cork/Mobility Ball etc. already omit sections they lack via the component guards — the list can include a type whose data is absent and the component renders nothing, matching today. Confirm brand-section is desktop-only as before.)
- [ ] **Step 3: Verify the migration is behavior-preserving.** `npm run build`; diff/spot-check `dist/products/toe-spacers/index.html` (and one more, e.g. cork-supplement) — same sections, same order, same content as before this task. This is the acceptance gate.
- [ ] **Step 4: Scaffold Sole Switch Pro.** Add a `pdp` block to the `sole-switch-pro` course item in `catalog.js` with `sections: ['course-details','course-overview','four-column','youll-stop-and-instead','comparison-chart','testimonial','your-instructors','cross-sell','faqs','pdp-reviews','logo-wall']`, and the data the ALREADY-BUILT reused sections need: `features` (4 Column — Figma-verbatim from `675:4355`), `crossSell` (heading "More Courses for Professionals" + 3 course itemIds + shopAllHref, from `1021:14005`), `reviews` (placeholder), and `logo-wall` needs none. Create `src/pages/courses/sole-switch-pro.astro` (`BaseLayout` + `<Pdp item={getItem('sole-switch-pro')} />`). Flip `/courses/sole-switch-pro` to `built` in `sitemap.js`.
- [ ] **Step 5: Verify.** Build (route now explicit, no collision; page count +0/+1 as appropriate — the course route was already placeholder-generated, so unchanged), `check:links` 0 broken. The page renders the reused sections (4-Column, cross-sell, reviews, logo wall); the not-yet-built course types render nothing (no error). `npm test` green.
- [ ] **Step 6: Commit** (`feat(pdp): data-driven Pdp composer + product migration + Sole Switch Pro scaffold`).

---

### Task 2: CourseDetails hero

Figma desktop `675:4353`, mobile (from `1109:14374`).

**Files:** Create `src/components/pdp/CourseDetails.astro`. Modify `Pdp.astro` (register `'course-details'`), `catalog.js` (`sole-switch-pro.pdp`: `priceExact`, `enrollHref`, secondary CTA if shown, hero intro/description, and the branded-card text).

- [ ] **Step 1: Pull Figma** `675:4353` (desktop) + its mobile node. Left column: breadcrumb, title, `StarRating` + count, price, **two CTAs** (primary "Enroll"-type + secondary), short intro. Right column: a **branded teal course card** ("SOLESWITCH PRO COURSE" / tagline) — NOT an image gallery.
- [ ] **Step 2: Build `CourseDetails.astro`** — prop `{ item }`; tokens; responsive (2-col → mobile stack per the mobile frame). Primary CTA = `<a href={item.pdp.enrollHref}>` (external — add `target`/`rel`), styled per Figma; secondary CTA per Figma. Reuse `StarRating`. The branded card is a styled block (Figma-verbatim text; placeholder if it needs art).
- [ ] **Step 3: Register + data.** Add `'course-details': CourseDetails` to the registry. Fill the hero fields in `sole-switch-pro.pdp` (Figma-verbatim).
- [ ] **Step 4: Verify (both widths)** — build, check:links 0, controller Figma pass desktop `675:4353` + mobile. Enroll CTA links out (no cart).
- [ ] **Step 5: Commit** (`feat(pdp): course details hero (enroll CTA)`).

---

### Task 3: CourseOverview

Figma desktop `675:4354`, mobile (from `1109:14374`).

**Files:** Create `src/components/pdp/CourseOverview.astro`. Modify `Pdp.astro` (register), `catalog.js` (`sole-switch-pro.pdp.overview = { image, body, details:[{label,value}] }`, Figma-verbatim).

- [ ] **Step 1: Pull Figma** `675:4354` (desktop) + mobile. "Course Overview" — image + overview copy + a set of detail columns (e.g. length / level / format).
- [ ] **Step 2: Build `CourseOverview.astro`** — prop `{ item }` reading `item.pdp.overview`; responsive; tokens; placeholder image.
- [ ] **Step 3: Register + data.**
- [ ] **Step 4: Verify (both widths)** — build, check:links 0, Figma pass desktop `675:4354` + mobile.
- [ ] **Step 5: Commit** (`feat(pdp): course overview section`).

---

### Task 4: YoullStopAndInstead

Figma desktop `675:4356`, mobile (from `1109:14374`).

**Files:** Create `src/components/pdp/YoullStopAndInstead.astro`. Modify `Pdp.astro` (register), `catalog.js` (`sole-switch-pro.pdp.youllStop = { stop, instead }`, Figma-verbatim).

- [ ] **Step 1: Pull Figma** `675:4356` + mobile. Two-part band: "You'll stop [X]" / "and instead you'll [Y]".
- [ ] **Step 2: Build `YoullStopAndInstead.astro`** — prop `{ item }` reading `item.pdp.youllStop`; responsive; tokens.
- [ ] **Step 3: Register + data.**
- [ ] **Step 4: Verify (both widths)** — build, check:links 0, Figma pass.
- [ ] **Step 5: Commit** (`feat(pdp): you'll-stop-and-instead band`).

---

### Task 5: ComparisonChart

Figma desktop `675:4357`, mobile (from `1109:14374`).

**Files:** Create `src/components/pdp/ComparisonChart.astro`. Modify `Pdp.astro` (register), `catalog.js` (`sole-switch-pro.pdp.comparison = { columns:[...], rows:[{ label, values:[...] }] }`, Figma-verbatim).

- [ ] **Step 1: Pull Figma** `675:4357` + mobile. Teal "Sole Switch VS Sole Switch Pro" table — feature rows × 2 product columns with check / × / value cells.
- [ ] **Step 2: Build `ComparisonChart.astro`** — data-driven from `item.pdp.comparison`; a real `<table>` with `<th scope>` headers; check/× marks have accessible text (`aria-label`/visually-hidden). Responsive (the table reflows/scrolls on mobile per the Figma). Tokens.
- [ ] **Step 3: Register + data.**
- [ ] **Step 4: Verify (both widths)** — build, check:links 0, Figma pass desktop `675:4357` + mobile (note how the table handles 390px).
- [ ] **Step 5: Commit** (`feat(pdp): course comparison chart`).

---

### Task 6: Testimonial

Figma desktop `1106:15576`, mobile (from `1109:14374`). (This unblocks the deferred Walk product PDP later.)

**Files:** Create `src/components/pdp/Testimonial.astro`. Modify `Pdp.astro` (register), `catalog.js` (`sole-switch-pro.pdp.testimonial = { quote, author, role, rating }` — or an array; Figma-verbatim).

- [ ] **Step 1: Pull Figma** `1106:15576` + mobile. Yellow band: stars + quote + attribution (name/role), with prev/next carousel arrows.
- [ ] **Step 2: Build `Testimonial.astro`** — prop `{ item }` reading `item.pdp.testimonial`. Render the first (or single) testimonial statically with the arrows PRESENT per the Figma. Default: arrows are **non-functional placeholders** (a real slider is deferred — flag it in a comment). IF the plan/controller opts to build a working slider, it must be keyboard-operable, `prefers-reduced-motion` safe, and leak-free (init on load + `astro:after-swap`, listeners once at module scope) — otherwise keep it static. Tokens; responsive.
- [ ] **Step 3: Register + data.**
- [ ] **Step 4: Verify (both widths)** — build, check:links 0, Figma pass.
- [ ] **Step 5: Commit** (`feat(pdp): testimonial section`).

---

### Task 7: YourInstructors

Figma desktop `1007:7830`, mobile (from `1109:14374`).

**Files:** Create `src/components/pdp/YourInstructors.astro` (+ an `InstructorCard` — inline or its own file). Modify `Pdp.astro` (register), `catalog.js` (`sole-switch-pro.pdp.instructors = [{ photo, name, credential, bio }]`, Figma-verbatim).

- [ ] **Step 1: Pull Figma** `1007:7830` + mobile. "Your Instructors" heading + instructor cards (photo + name + credential + bio) — e.g. Dr. Courtney Conley, Dr. Allison Riley DPT.
- [ ] **Step 2: Build `YourInstructors.astro`** — prop `{ item }` reading `item.pdp.instructors`; a card per instructor (placeholder photo); responsive (row → stack on mobile per the frame); tokens.
- [ ] **Step 3: Register + data.**
- [ ] **Step 4: Verify (both widths)** — build, check:links 0, Figma pass.
- [ ] **Step 5: Commit** (`feat(pdp): your instructors section`).

---

### Task 8: FAQs + final assembly & verification

Figma desktop `1027:12323`, mobile (from `1109:14374`).

**Files:** Create `src/components/pdp/Faqs.astro`. Modify `Pdp.astro` (register `'faqs'`), `catalog.js` (`sole-switch-pro.pdp.faqs = [{ label, content }]`, Figma-verbatim).

- [ ] **Step 1: Pull Figma** `1027:12323` + mobile. Teal "Frequently Asked Questions" band with collapsed accordion rows.
- [ ] **Step 2: Build `Faqs.astro`** — a section wrapper (the teal band + "Frequently Asked Questions" heading, per the Figma) that renders `PdpAccordion` for `item.pdp.faqs`. (Reuse `PdpAccordion` as-is — collapsed default, native `<details>`; if it needs a `rows` prop instead of reading `item.pdp.accordion`, pass the faqs rows explicitly — read `PdpAccordion.astro` and wire it the simplest correct way. If its data source is hardcoded to `item.pdp.accordion`, add a `rows` prop fallback rather than colliding with the product accordion field.) Register `'faqs'`.
- [ ] **Step 3: Verify FAQs (both widths)** — build, check:links 0, Figma pass desktop `1027:12323` + mobile; rows collapsed by default.
- [ ] **Step 4: Final assembly verification.** `/courses/sole-switch-pro` now renders ALL 11 sections in the correct order (course-details → course-overview → four-column → youll-stop-and-instead → comparison-chart → testimonial → your-instructors → cross-sell → faqs → pdp-reviews → logo-wall). `npm run build` (39/40→ unchanged-ish; confirm no collision), `npm run check:links` = 0 broken, `npm test` green. Controller both-widths real-browser pass over the whole course page; enroll CTA links out; FAQs collapse; the 6 product PDPs still render unchanged.
- [ ] **Step 5: Commit** (`feat(pdp): course FAQs + Sole Switch Pro assembled`).

---

## Self-Review — spec coverage

- §2 sections 1–11 → Task 1 (composer + reuse: 4-Col/cross-sell/reviews/logo-wall), 2 (CourseDetails), 3 (CourseOverview), 4 (YoullStop), 5 (ComparisonChart), 6 (Testimonial), 7 (YourInstructors), 8 (FAQs). ✓
- §3 data-driven composer + registry + product migration (behavior-preserving) → Task 1 (with the "render byte-for-byte same" gate). ✓
- §3 course data model (`pdp.sections` + fields) → Task 1 scaffold + each section task's data step. ✓
- §4 enroll CTA = Kajabi link, no cart → Task 2 Step 2 + Global Constraints. ✓
- §5 motion/a11y (static testimonial + arrows, FAQs collapsed accordion, comparison `<table>` + accessible marks, reveal, responsive) → Tasks 5/6/8 + Global Constraints. ✓
- §6 verification (migration gate, both-widths per section, full assembly, build/links/tests) → every task's Verify + Task 8. ✓
- §7 open items: testimonial carousel default-static-flagged (Task 6); FourColumn/CrossSell reuse-not-fork (Task 1); Walk un-defer later (out of scope, noted); per-section pixels from `get_design_context` (fidelity workflow). ✓

Type/name consistency: `item.pdp.sections` (array of type/`{type}`), the `REGISTRY` type keys (`course-details`/`course-overview`/`youll-stop-and-instead`/`comparison-chart`/`testimonial`/`your-instructors`/`faqs` + reused keys), and `item.pdp.{overview,youllStop,comparison,testimonial,instructors,faqs,features,crossSell,reviews,priceExact,enrollHref}` are used consistently across tasks. Exact per-section pixel specs come from each task's `get_design_context` (desktop node given; mobile from `1109:14374`), not embedded here — the fidelity workflow.
