# Gait Happens Course PDP — Design (Chunk B1: testimonial carousel + the four zero-new-section pages)

**Date:** 2026-07-13
**Project:** Gait Happens Web Migration (Phase 2) — Course Detail Pages, chunk B1
**Repo:** `…\04_Website\00_Claude`; branch off `master` (which has Course PDP Chunk A merged at `04cbcc9`)
**Figma:** file `FX7PDNvhZwyozODaq8Q8i7`
**Predecessor spec:** `docs/superpowers/specs/2026-07-12-gait-happens-course-pdp-design.md` (Chunk A — the section library + data-driven composer this chunk consumes)

---

## 1. Purpose & scope

Chunk A built the course-PDP **section library** and generalized `Pdp.astro` into a data-driven composer (`item.pdp.sections` → `type → {Component, props}` registry). This chunk cashes that in: it ships every page that needs **no new section type**, and upgrades the one section that all of them share and that Chunk A knowingly left half-built — the Testimonial carousel.

The original "Chunk B" (all remaining courses) was split in two after a full Figma audit (§7) showed a clean fault line: four pages need nothing new, five need two new section components. This is **B1** — the four.

**In scope**

- **Testimonial carousel** — `Testimonial.astro` gains real multi-quote paging (Chunk A shipped decorative, non-functional arrows and flagged the slider as deferred).
- **Four pages**, each pure catalog data + a route, each verified against Figma at desktop AND mobile:
  - `/courses/sole-switch` (individual)
  - `/courses/combating-bunions` (individual)
  - `/courses/fit-feet` (individual)
  - `/products/walk` (product — deferred in the Product PDP chunk, unblocked by Chunk A's Testimonial + Your Instructors)

**Out of scope**

- **Chunk B2** — `Three Column Info` + `Image With Text` components and the five professional courses that need them (Gait Foundations, FGA Level 1, **FGA Level 2**, Gait Guru Membership, Trainer Certification). Section map recorded in §7 so the audit isn't repeated.
- **Chunk C** — Foot Fest (needs the custom "Foot Fest Courses" section + three `Image With Text` instances).
- **Virtual Consultations** — paused by the client; skip (the Figma frame is stamped "PAUSE").
- Real Kajabi enroll URLs, real course/instructor photography, real review data. Faithful placeholders, per Chunk A.

**Success criteria**

- The four routes render from data, faithful to their Figma frames at desktop and mobile.
- **Sole Switch Pro renders unchanged** apart from the intended carousel markup — the acceptance gate on the testimonial data migration.
- `npm run build` clean, `check:links` 0 broken, tests green (incl. new assertions in §6).

## 2. Testimonial carousel

**The problem with "just make it an array":** `item.pdp.testimonial` is today a single object `{ quote, author, role, rating }` in which **`quote` is *already* an array** — of paragraph strings, because the Figma copy has deliberate internal breaks (see the header comment in `Testimonial.astro`). So "the testimonial field is an array" is ambiguous and must be pinned down explicitly.

**Decision (approach A of three considered):** `item.pdp.testimonial` becomes an **array of testimonial objects** — `[{ quote: [paragraph, …], author, role, rating }, …]`. The component **normalizes a bare object into a 1-element array**, so nothing can break on an un-migrated item, but we **migrate Sole Switch Pro's data to array form** so the catalog carries exactly one shape. (Rejected: a parallel `testimonials` field — two fields meaning one thing, which rots; and a generic `Carousel` wrapper component — speculative structure nothing else in the build needs today.)

**Behavior**

- **All slides render in the DOM.** Inactive slides are `inert` + hidden — no layout shift on paging, and no screen-reader leakage of off-screen quotes.
- **Arrows are real `<button>`s only when there is more than one quote.** With a single quote they stay exactly as today: `aria-hidden`, non-interactive `<span>`s. A control that does nothing is worse than no control — this preserves Chunk A's reasoning rather than overriding it.
- **Keyboard operable**, wrap-around at both ends. The slide region gets an accessible name and a polite live announcement on change.
- **`prefers-reduced-motion`** collapses the crossfade to an instant swap.
- **Leak-free via module-scope event delegation** — a single document-level listener keyed off `data-*` hooks, resolving nodes fresh per event and never caching references. This is the idiom the PDP sections already use (`YourInstructors.astro`'s read-more toggle, `ProductDetails.astro`'s buy box), and it needs **no `astro:page-load` re-init and no swap teardown**: there is nothing cached to go stale across Astro's ClientRouter swaps. Active-slide state lives in the DOM (a `data-*` index on the section), not in a module variable, so a freshly-swapped page is already in a valid state. Do **not** reach for the `astro:page-load` re-init pattern here — that's `Header.astro`'s idiom, and it exists there for reasons that don't apply to a self-contained section.
- The star row is **already rating-aware** (Chunk A fix `bedbd05`), so per-slide ratings track for free.

This is the only client JS added in this chunk.

## 3. Section maps — the four pages

Pulled from the Figma frames; per-section nodes are read at build via `get_design_context` (desktop **and** mobile), which remains the fidelity method.

**The three individual courses use the identical 11-section list already shipped for Sole Switch Pro** — so they are catalog data plus a route, nothing more:

```
course-details, course-overview, four-column, youll-stop-and-instead,
comparison-chart, testimonial, your-instructors, cross-sell, faqs,
pdp-reviews, logo-wall
```

| Page | Desktop frame | Notes |
|---|---|---|
| Sole Switch | `998:14854` | "Sole Switch Basic Page" |
| Combating Bunions | `675:5540` | |
| Fit Feet | `675:8154` | |

Individual-courses mobile frames live under section `999:7142`; desktop section is `674:3086`.

**WALK** (`721:7417`, in the Product PDP section `705:5988`):

```
product-details, testimonial, brand-section, cross-sell,
your-instructors, pdp-reviews
```

WALK is the **first product whose section list differs from the standard six** — a genuine exercise of the data-driven composer, and the reason it belongs in this chunk rather than being lumped with the products. It has **no `four-column` and no `logo-wall`**. Its `Product Cards` instance is **650px tall against the usual 447px**, which suggests a different cross-sell variant — confirm per-section at build and extend `CrossSell` only if the Figma genuinely differs (don't fork it).

## 4. Data model

No new section types, so no registry changes beyond what §2 implies. Per page, add a `pdp` block to `src/data/catalog.js` following the Sole Switch Pro precedent — `sections` list first, then the per-section content fields the existing components already read (`overview`, `features`/`featuresHeading`, `youllStop`, `comparison`, `testimonial`, `instructors`, `faqs`, `reviews`, `crossSell`, plus course fields `priceExact` / `enrollHref` / course card).

Content is **Figma-verbatim** where the design has real copy. Where Figma leaves a section thin or its desktop and mobile frames diverge, follow Chunk A's precedent: keep **desktop canonical**, ship the placeholder, and flag it in §8 as client-supplied rather than silently inventing copy.

`src/data/sitemap.js`: flip the four routes `placeholder` → `built`. New pages `src/pages/courses/{sole-switch,combating-bunions,fit-feet}.astro` and `src/pages/products/walk.astro`, each mirroring the existing one-line page pattern.

## 5. Architecture notes

Nothing structural changes. The composer, the registry, and every section component are consumed as-is — that is the point of this chunk, and if a page *can't* be expressed as data, that's a finding worth surfacing rather than working around with a bespoke page.

Modified: `Testimonial.astro` (carousel), `catalog.js` (4 × `pdp` blocks + the Sole Switch Pro testimonial migration), `sitemap.js` (4 status flips). Added: 4 page files, 1 carousel script/behavior, tests per §6.

## 6. Verification

- **Testimonial migration gate:** Sole Switch Pro's built HTML is unchanged apart from the intended carousel markup. Diff it — this is the acceptance test, exactly as the composer migration was in Chunk A.
- **Per section:** each built section verified against its Figma node at desktop **and** mobile.
- **Routes:** all four flip `built`; confirm no `[...slug]` placeholder collision (the trap Sole Switch Pro already surfaced). Build page count unchanged.
- `check:links` 0 broken; `npm test` green.
- **New tests:** every `built` course/product has a `pdp.sections` list; `pdp.testimonial` is in array shape catalog-wide; carousel paging/wrap logic unit-tested.
- **Live browser, both widths** on one individual course + WALK. Per the Chunk A operational notes: `astro preview --host` + the LAN IP (localhost is unreachable from host Chrome), an in-page `<iframe width=390>` for mobile, and sweep orphaned node/astro processes first — they cause stale `dist` writes.

## 7. Chunk B2 section map (recorded now, built later)

The Figma audit covered every course; capturing it here so B2 doesn't repeat it. **All five professional courses need `Three Column Info`; only Trainer Certification also needs `Image With Text`.** Note how the lists vary — Gait Guru has no Course Overview and no Reviews, Trainer Certification has no Testimonial — which the composer's existing per-section guards already handle.

| Course | Frame | Sections (beyond the shared spine) |
|---|---|---|
| Gait Foundations | `675:9036` | overview, 4-col, **3-col-info**, testimonial, instructors, cross-sell, faqs, reviews, logo-wall |
| FGA Level 1 | `675:9357` | overview, 4-col, comparison, **3-col-info**, testimonial, instructors, cross-sell, faqs, reviews, logo-wall |
| **FGA Level 2** | `1041:10410` | same as L1 |
| Gait Guru Membership | `682:9759` | 4-col, **3-col-info**, testimonial, instructors, cross-sell, faqs, logo-wall (**no overview, no reviews**) |
| Trainer Certification | `683:10086` | overview, 4-col, **3-col-info**, **image-with-text**, instructors, cross-sell, faqs, reviews, logo-wall (**no testimonial**) |

**FGA Level 2 is a fully-designed Figma page that does not exist in the catalog, sitemap, or Professionals PLP.** User decision (2026-07-13): **adopt it** — B2 adds its catalog entry and route, and it will surface on the Professionals PLP.

## 8. Open items / client-supplied content

- **Cross-sell variant on WALK** — the 650px instance (§3). Confirm at build; extend rather than fork if it differs.
- **Course imagery, instructor photos, review data** — placeholders (Chunk A precedent).
- **`enrollHref`** — Kajabi placeholder; real course URLs from the client.
- **Figma copy gaps / desktop-vs-mobile divergence** — desktop canonical, flagged as client-supplied, never invented.
- **Comparison-chart content** differs per course (Chunk A's was "Sole Switch VS Sole Switch Pro"); take each course's verbatim.
