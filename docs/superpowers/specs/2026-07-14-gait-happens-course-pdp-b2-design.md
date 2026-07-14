# Gait Happens Course PDP — Design (Chunk B2: the last two sections + the five professional courses)

**Date:** 2026-07-14
**Project:** Gait Happens Web Migration (Phase 2) — Course Detail Pages, chunk B2
**Repo:** `…\04_Website\00_Claude`; branch off `master` (Chunk B1 merged at `2038714`). GitHub `thegroundedco/gait-happens-web` (private).
**Figma:** file `FX7PDNvhZwyozODaq8Q8i7`
**Predecessor specs:** `2026-07-12-…-course-pdp-design.md` (Chunk A — the section library + data-driven composer) and `2026-07-13-…-course-pdp-b1-design.md` (Chunk B1 — the carousel + the four zero-new-section pages; **its §7 carries the B2 section map, reproduced in §3 below**).

---

## 1. Purpose & scope

Chunk B2 finishes the course PDPs. It builds the **last two section components** in the library and rolls the library out to the **five professional courses**. After this, only Foot Fest (Chunk C) and the paused Virtual Consultations remain.

**In scope**

- **Two new section components**, each built against **every non-paused instance that exists in Figma today** (§2) — not just the first page that needs them.
- **Five professional course pages** (§3), each catalog data + a page file + a sitemap flip.
- **Adopting Functional Gait Assessment Level 2** (§4) — a fully-designed Figma page with *no* catalog entry, route, or PLP presence.
- **Three carry-overs from B1** (§6), all folded in deliberately.

**Out of scope**

- **Chunk C** — Foot Fest (its custom "Foot Fest Courses" section, plus three `Image With Text` instances this chunk's component will already support).
- **Virtual Consultations** — paused by the client; its Figma frame is stamped "PAUSE". Skip.
- Real Kajabi enroll URLs, real course/instructor photography, real review data.

**Success criteria**

- Five course routes render from data, faithful to their Figma frames at desktop and mobile.
- The nine already-shipped PDPs regress only where §6 *intends* them to.
- Build clean, `check:links` 0 broken, tests green.

## 2. The two new sections

Both are data-driven and carry no per-course content — the constraint B1 learned the hard way (see §7).

### Three Column Info — `675:9040` (Gait Foundations)

A centred display heading, three columns each with a teal sub-heading and a check-icon list, and a teal CTA button beneath. **Item counts differ per column** (3 / 3 / 5 on Gait Foundations), so columns are a list, not a fixed triple.

```js
threeColumn: {
  heading,                                   // e.g. "About The Gait Foundations Course"
  columns: [ { heading, items: [string] } ], // teal sub-heading + check-list
  cta: { label, href },
}
```

Used by **all five** professional courses (and by FGA L2).

**The check icon is a NEW asset — export it from the Figma node.** Do not reuse `ComparisonChart.astro`'s `✓`: that is a *text character* in a branch that never actually renders (both comparison frames use literal "Yes"/"No" text, so the glyph appears nowhere in the built HTML), and it is not an icon. There is also no check icon in the official brand library (`01_Assets\00_Icons\` holds only `QuickCart.svg`). So: export the real icon from the Three Column Info node's own asset and commit it under `public/images/`, following how the nav/PLP icons are already stored.

The check icons are **decorative** — the text beside each one carries the meaning — so they must be `aria-hidden` and add no noise to the accessibility tree. `ComparisonChart`'s `sr-only` idiom is still the reference for *that* reasoning, just not for the glyph itself.

### Image With Text — `686:6540` (Trainer Certification)

An image beside a heading and a bullet list.

**Build it against all its instances, not just Trainer Certification's.** Trainer Cert's is image-LEFT with just a heading + bullets. Foot Fest's (`674:7748` / `674:7750` / `674:7752`, Chunk C) are image-**RIGHT**, with an intro line above the list, a lead-in sentence ("The VIP Package includes:"), and a **CTA button** — none of which Trainer Cert has. Those instances exist in the design *today*; supporting them is not speculation, and B1 produced ten separate defects from components fitted to whichever page happened to be built first (§7).

```js
imageWithText: {
  image, imageSide,        // imageSide: 'left' (default) | 'right'
  heading,
  intro,                   // optional — a line above the list
  listLead,                // optional — e.g. "The VIP Package includes:"
  items: [string],
  cta,                     // optional — { label, href }
}
```
Every optional field is guarded: absent → renders **nothing**, no empty artifact. This is the single most-repeated defect class in this project.

**Chunk B2 ships only Trainer Certification's data.** Foot Fest's data is Chunk C's job — but Chunk C should then need **no component edit**.

## 3. The five professional courses

Each is `pdp` data in `catalog.js` + a page file + a `sitemap.js` status flip. Per-section nodes are pulled at build via `get_design_context` at desktop **and** mobile — the fidelity method, unchanged.

| Course | Desktop frame | Sections |
|---|---|---|
| Gait Foundations | `675:9036` | course-details, course-overview, four-column, **three-column-info**, testimonial, your-instructors, cross-sell, faqs, pdp-reviews, logo-wall |
| FGA Level 1 | `675:9357` | course-details, course-overview, four-column, comparison-chart, **three-column-info**, testimonial, your-instructors, cross-sell, faqs, pdp-reviews, logo-wall |
| **FGA Level 2** | `1041:10410` | same as Level 1 |
| Gait Guru Membership | `682:9759` | course-details, four-column, **three-column-info**, testimonial, your-instructors, cross-sell, faqs, logo-wall — **no course-overview, no pdp-reviews** |
| Trainer Certification | `683:10086` | course-details, course-overview, four-column, **three-column-info**, **image-with-text**, your-instructors, cross-sell, faqs, pdp-reviews, logo-wall — **no testimonial** |

The composer's existing per-section guards already handle that variation; a section absent from `sections` simply isn't rendered.

**Flag — Gait Foundations' instructors.** In Figma its instructor cards sit in a bare frame (`1027:12431`) rather than a `Your Instructors` component instance, so it may have **no section heading**. `YourInstructors` gained an optional `instructorsHeading` in B1 (default "Your Instructors"), but that defaults *on*. Confirm against the node; if the frame genuinely has no heading, the component needs an explicit "no heading" case — and that is a **finding to report, not to work around**.

## 4. Adopting FGA Level 2

`1041:10410` is a complete, designed page that exists **nowhere** in our data — not in `catalog.js`, not in `sitemap.js`, not in the Professionals PLP collection. User decision (2026-07-13): **adopt it.**

That makes it more than a page:
- a new `catalog.js` item (id/handle/title/kind/badges/price/image/href/cta),
- a new `sitemap.js` route,
- membership in the **Professionals** and **All Courses** collections — so it surfaces on the PLP and becomes cross-sellable.

**Adopt it FIRST**, before the other four pages. Their `crossSell.itemIds` may reference it, and `catalog.test.mjs` fails if a cross-sell id doesn't resolve.

**It is the one route that does not already exist as a placeholder**, so it is the only page that changes the count: **the build goes 40 → 41.** (The other four courses already have generated placeholder routes; flipping them to `built` swaps a generated page for an explicit one and leaves the count unchanged.) A count other than 41 means a `[...slug]` collision or a missing route — investigate, don't wave it through.

## 5. Data model

No architectural change. Two new registry entries — `three-column-info` and `image-with-text` — join the existing thirteen in `Pdp.astro`. Content is **Figma-verbatim**; where desktop and mobile diverge, **desktop is canonical**, the divergence is reported, and nothing is invented. Where Figma has no copy (the FAQ frames routinely mock only the collapsed accordion), the gap is **disclosed in a `catalog.js` comment and the report — never in rendered HTML.**

## 6. B1 carry-overs, folded in

1. **The instructor "Read More" toggle is a false affordance.** Measured: only Conley's 2743-char bio overflows the 4-line clamp; Riley (219), Perez (237), and McDowell (211) do not — yet McDowell's toggle is suppressed while Riley's and Perez's, 8 and 26 characters *longer*, still render. Fix with a **measured `scrollHeight > clientHeight` check** on load and on resize, skipping cards that set `bioExpandable: false`. **Do NOT use a static authored flag** — whether a bio overflows is *width-dependent*, so no boolean can be right at both breakpoints. All five B2 courses use this component, so we are in it anyway.
   **This intentionally changes the nine shipped PDPs** (toggles vanish on bios that never overflowed). The regression gate for this task is therefore *"the diff is exactly the intended toggle removals"* — **not** "expect zero diff". Byte-identity is a proxy for "shipped pages didn't change"; here the proxy is *supposed* to move, and B1 twice showed the cost of optimising the proxy over the thing it stands for (§7).
2. **DEV comments ship in the page source.** `PdpReviews.astro` and `CartDrawer.astro` carry `<!-- -->` comments — one tells any reader the review numbers are fake — and they are emitted into the source of all 40 pages. Convert to `{/* */}` (compile-time only). Two characters each.
3. **Pin `inlineStylesheets`.** CSS delivery currently flips on Astro's 4096-byte `'auto'` threshold, so an unrelated CSS edit can silently change how 17 pages load their styles. Pin it in `astro.config.mjs` for deterministic output.

## 7. The lesson this chunk must not relearn

Rolling the section library out to courses 2–5 in B1 exposed **ten separate cases** of a shared component hardcoded to whichever page was built first — several of which shipped visibly broken pages (a blank hero column; a "SELECT YOUR COURSE" caption with nothing to select; an instructor bio where the design says an explainer). Two rules follow, and they are binding on this chunk:

- **Build each new component against every instance the design actually contains** (§2), not the first one that needs it.
- **Guards check non-emptiness, not presence.** `[]` and `{}` are truthy; an absent-or-empty optional field must render *nothing*, never an empty wrapper, caption, or pill.

And if a B2 course reveals an **eleventh** such gap in an existing component: **stop and report it.** Do not work around it, and do not silently edit the component inside a data task — that report is the most valuable output of the task.

## 8. Verification

- **Per section:** built section verified against its Figma node at desktop **and** mobile.
- **Per page:** all sections render in order; `check:links` 0 broken; tests green.
- **Build = 41 pages** (see §4).
- **Regression:** the nine shipped PDPs change *only* where §6.1 intends. Verify the diff, don't just assert zero.
- **Guard tests:** the existing built-course and built-product tests already require `pdp.sections` + a resolving `crossSell` — they will cover the five new courses for free. Extend only if B2 introduces a shape they don't cover.
- **Live both-widths browser pass** on the new pages. Builds are clean now (`dist/` is Dropbox-ignored). Run `npx astro preview --host` from a *user* terminal — the agent's shell is network-isolated from host Chrome — and check `list_connected_browsers` before driving.

## 9. Open items

- **Gait Foundations' possibly-headingless instructor section** (§3) — confirm against the node; report if the component needs a no-heading case.
- The `three-column-info` **check icon** must be exported from Figma (§2) — no reusable icon exists in the repo or the official brand library.
- Course imagery, instructor photos, `enrollHref`, and review data remain placeholders (project-wide, disclosed).
- Client-content divergences found while building are **reported, never reconciled** — several B1 courses' mobile frames turned out to be un-updated copy-paste of another course's template.
