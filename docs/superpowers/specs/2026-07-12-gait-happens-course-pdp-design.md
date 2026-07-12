# Gait Happens Course PDP — Design (Course PDP Chunk A: section library + pilot)

**Date:** 2026-07-12
**Project:** Gait Happens Web Migration (Phase 2) — Course Detail Pages, chunk A of the course-PDP effort
**Repo:** `…\04_Website\00_Claude` (branch TBD at implementation; off `master`, which has the Product PDP chunk merged)
**Figma:** file `FX7PDNvhZwyozODaq8Q8i7` — Professional courses desktop section `674:8022` / mobile `1109:14374`; Individual courses desktop `674:3086` / mobile `999:7142`. **Pilot: Sole Switch Pro** desktop frame `675:4309`.

---

## 1. Purpose & scope

Build the **course-PDP section library** by taking one rich professional course — **Sole Switch Pro** — end to end. Professional and individual courses share this same section set (each picks a subset + order), so this chunk unlocks the rest. This is chunk A; later chunks roll out the remaining courses (B) and the custom ones (Foot Fest, C). **Virtual Consultations is paused — skip it.**

**Approach (continuing the Product PDP method):** section-library + a data-driven composer; **per-section fidelity** — pull each section's desktop AND mobile `get_design_context`, build one responsive component, verify at BOTH widths against the Figma, then review. Content **Figma-verbatim** where real; placeholder images.

**In scope (this chunk)**
- Generalize `Pdp.astro` to a **data-driven ordered section list** and migrate the 6 existing products to declare their (fixed) list — low-risk, they render identically.
- 6 new course section components + FAQs wiring, assembled into `/courses/sole-switch-pro` (flipped `built`), each Figma-verified desktop + mobile.

**Out of scope (later chunks)**
- The other courses (professional + individual), the custom Foot Fest / paused Virtual Consultations, and un-deferring the Walk product PDP (which now becomes possible once Testimonial + Your Instructors exist).
- Real Kajabi enroll wiring, real course imagery/instructor photos, real review data (faithful placeholders; dev team wires Kajabi/reviews).

**Success criteria**
- `/courses/sole-switch-pro` renders its 11 sections from data, faithful to `675:4309` at desktop and mobile.
- The 6 products still render exactly as before (composer migration is behavior-preserving).
- `npm run build` (route flips placeholder→built), `check:links` 0 broken, tests green.

## 2. Sole Switch Pro sections (desktop `675:4309`; per-section nodes for the plan)

Top → bottom. Desktop node ids given; mobile per-section nodes are pulled from the Sole Switch Pro mobile frame within `1109:14374` at implementation.

1. **Course Details** (hero) — `675:4353`. Breadcrumb, title ("Sole Switch Pro Course"), StarRating + count, **price** (`$…USD`), **two CTAs** (primary "Enroll"-type + secondary), short intro; on the RIGHT a **branded teal course card** ("SOLESWITCH PRO COURSE" / "The Health Professional"), NOT an image gallery. **The enroll CTA is an external Kajabi link (placeholder href for now) — it does NOT use `cart.js`** (courses live on Kajabi). NEW component `CourseDetails.astro`.
2. **Course Overview** — `675:4354`. "Course Overview" — an image + overview copy (with sub-detail columns e.g. length/level/format). NEW `CourseOverview.astro`.
3. **4 Column** ("What to Expect…") — `675:4355`. Yellow band, heading + 4 image/label/text cols. **Reuse `FourColumn.astro`** (confirm the course instance matches the product one; extend only if it differs).
4. **You'll Stop and Instead** — `675:4356`. A two-part band: "You'll stop [X]" / "and instead you'll [Y]". NEW `YoullStopAndInstead.astro`.
5. **Comparison Chart** — `675:4357`. Teal "Sole Switch VS Sole Switch Pro" feature table (rows × 2 columns with check/marks). NEW `ComparisonChart.astro` (data-driven rows/columns).
6. **Testimonial** — `1106:15576`. Yellow band: quote + stars + attribution, with carousel arrows. NEW `Testimonial.astro` (see §5 re: carousel). This section ALSO unblocks the deferred Walk product PDP.
7. **Your Instructors** — `1007:7830`. "Your Instructors" heading + instructor cards (photo + name + credential + bio) — e.g. Dr. Courtney Conley, Dr. Allison Riley DPT. NEW `YourInstructors.astro` (+ an `InstructorCard`).
8. **Product Cards** ("More Courses for Professionals") — `1021:14005`. Teal band, course cards + Shop All. **Reuse `CrossSell.astro`** (course cross-sell; confirm heading/variant).
9. **FAQs** — `1027:12323`. Teal "Frequently Asked Questions" band, collapsed accordion rows. **Reuse `PdpAccordion.astro`** (data-driven rows, collapsed default — the treatment we just shipped). Confirm the FAQ Figma matches the accordion styling; if the band chrome differs (teal background/heading), wrap the accordion in a `Faqs.astro` section that supplies the band + heading and renders `PdpAccordion` inside.
10. **Reviews** — `675:4361` ("Reviews Plugin Here"). **Reuse `PdpReviews.astro`** placeholder.
11. **Logo Wall** — `707:7992`. **Reuse `LogoWall.astro`**.

## 3. Architecture — data-driven composer + course sections

**Composer generalization** (`src/components/pdp/Pdp.astro`): render an **ordered `item.pdp.sections` array**; each entry is a `{ type, ...data }` descriptor. A `type → component` registry maps e.g. `'course-details' → CourseDetails`, `'four-column' → FourColumn`, `'cross-sell' → CrossSell`, `'faqs' → Faqs/PdpAccordion`, etc. Each section component receives `{ item }` (reading its content from `item.pdp.<field>`) plus any per-instance `data` the descriptor carries (needed later for repeated sections like Image-With-Text). Wrap each in `data-reveal`.
- **Product migration:** give each of the 6 products a `pdp.sections = ['product-details','four-column','brand-section','cross-sell','pdp-reviews','logo-wall']` and delete the hardcoded section order from `Pdp.astro`. Verify each product's built HTML is unchanged (same sections, same order) — this is the acceptance test for the migration.

```
src/components/pdp/            (new this chunk)
  CourseDetails.astro          course hero (title/rating/price/2 CTAs + branded card)
  CourseOverview.astro         image + overview copy + detail columns
  YoullStopAndInstead.astro    "you'll stop X / and instead Y" band
  ComparisonChart.astro        feature comparison table (data-driven)
  Testimonial.astro            quote + stars + attribution (+ carousel arrows)
  YourInstructors.astro        heading + InstructorCard(s)
  Faqs.astro                   band + heading wrapping PdpAccordion (if the band differs)
  (reuse: FourColumn, CrossSell, PdpReviews, LogoWall, PdpAccordion)
```
Modified: `src/components/pdp/Pdp.astro` (registry + section-list rendering), `src/data/catalog.js` (add `pdp.sections` to the 6 products; add a `pdp` block for `sole-switch-pro` with its section list + Figma-verbatim content), `src/data/sitemap.js` (flip `/courses/sole-switch-pro` to `built`). New page `src/pages/courses/sole-switch-pro.astro`.

**Course data model** — `sole-switch-pro.pdp`:
```js
pdp: {
  sections: ['course-details','course-overview','four-column','youll-stop-and-instead',
             'comparison-chart','testimonial','your-instructors','cross-sell','faqs',
             'pdp-reviews','logo-wall'],
  priceExact, enrollHref: '<kajabi placeholder>', ctaSecondary?: {...},
  overview: { image, body, details:[{label,value}] },
  features: [{image,label,text} x4],            // 4 Column
  youllStop: { stop, instead },
  comparison: { columns:[...], rows:[{ label, values:[...] }] },
  testimonial: { quote, author, role, rating } | [ … ],
  instructors: [{ photo, name, credential, bio }],
  faqs: [{ label, content }],                   // -> PdpAccordion
  reviews: { rating, count, distribution },
  crossSell: { heading, itemIds, shopAllHref },
}
```
Exact shapes finalized in the plan against the real Figma.

## 4. Enroll CTA (no cart)

Unlike products, a course's primary CTA is **enroll**, an external Kajabi link (placeholder `enrollHref` for now). `CourseDetails` renders it as a link (not a cart button). `cart.js` is untouched. (If the Figma shows a secondary CTA, render it per the design.)

## 5. Motion & a11y

- **Testimonial carousel:** the Figma shows prev/next arrows. For this reference build, render the first testimonial statically with the arrows present but **non-functional (or a simple static rotation)** — a real carousel/slider is deferred (flag it); if built, it must be keyboard-operable + `prefers-reduced-motion` safe + leak-free (project init pattern).
- **FAQs accordion:** collapsed by default (matches the just-shipped PDP accordion), native `<details>` (keyboard/SR-free).
- Comparison table: real `<table>` with `<th scope>` headers; check/×  marks have accessible text.
- Section reveal-on-scroll via `[data-reveal]`. Responsive per each section's desktop + mobile Figma. Instructor photos / course imagery placeholder.

## 6. Verification

- **Composer migration:** the 6 product PDPs render byte-for-byte the same section order (spot-check built HTML) — the migration's acceptance gate.
- **Per section:** built section verified vs its Figma at desktop AND mobile.
- `/courses/sole-switch-pro` renders all 11 sections in order; enroll CTA links out; links resolve.
- `npm run build` (route flips built; page count changes only if the route was a placeholder — confirm no collision), `check:links` 0 broken, `npm test` green (+ optionally assert every `built` course has a `pdp.sections` list).
- Controller both-widths real-browser pass on `/courses/sole-switch-pro`.

## 7. Open items / assumptions

- **Testimonial carousel** behavior (static vs real slider) — decided at plan time; default static + flagged.
- **FourColumn / CrossSell reuse** — confirm the course instances match the product components; extend only if the Figma differs (don't fork).
- **Course price/enroll** — Figma-verbatim price; `enrollHref` placeholder (Kajabi). Real course URLs later.
- **Walk product PDP** can be un-deferred in a later chunk now that Testimonial + Your Instructors exist — not this chunk.
- Exact per-section spacing/type/color come from each section's `get_design_context` at build (the fidelity workflow), not invented here.
