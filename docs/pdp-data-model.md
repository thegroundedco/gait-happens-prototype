# PDP data model

This is the handoff document for the PDP (product/course detail page) system —
written for someone opening this repo with zero context. It covers how the
composer works, the full `pdp` data contract, the guard discipline that keeps
optional data from rendering broken/empty markup, and — the part that matters
most for porting — what each piece of this data model becomes in Shopify.

The authoritative source for everything below is the code itself, mainly
[`src/components/pdp/Pdp.astro`](../src/components/pdp/Pdp.astro)'s registry
and the ~2,500 lines of header comments spread across the 15 section
components in [`src/components/pdp/`](../src/components/pdp/). This document
collects and organizes that knowledge; it does not replace it — when the two
disagree, the component is right and this doc is stale.

## Architecture, in one paragraph

[`src/data/catalog.js`](../src/data/catalog.js) (5,000+ lines) holds every
product and course as one flat array, `items` — 7 products + 11 courses today.
Any item **may** carry an optional `pdp` block. `pdp.sections` is an ordered
array of type strings (e.g. `['product-details', 'four-column', 'brand-section',
'cross-sell', 'pdp-reviews', 'logo-wall']`) — the literal, top-to-bottom recipe
for that item's page. [`Pdp.astro`](../src/components/pdp/Pdp.astro) is a
composer: it owns a `type -> { Component, props }` **registry** of the 15
known section types, walks `item.pdp.sections`, resolves each entry's props,
and renders whichever section components survive. Every PDP page
(`src/pages/products/*.astro`, `src/pages/courses/*.astro`) is a two-line
wrapper: look up the catalog item, hand it to `<Pdp item={item} />`. A type
with no registry entry renders nothing (dev-only `console.warn`, no crash) —
this is how a course can list its full intended section order before every
section has a component yet. **A registered type with no (or empty) backing
data also renders nothing** — sections are opt-in per item, not a fixed
template every item fills in. This is deliberate and is the single most
load-bearing rule in this file (see "Guard rules" below).

## The 15 registry types

This is `Pdp.astro`'s `REGISTRY` object, current as of `feat/course-pdp-b2`.
Verify this list against `Pdp.astro` directly before trusting it — it is the
one source of truth for "what sections exist."

| # | `type` string | Component | Renders | Reads (`item.pdp.*` unless noted) | Scope |
|---|---|---|---|---|---|
| 1 | `product-details` | `ProductDetails.astro` (+ `PdpAccordion.astro`) | Hero: eyebrow/title/rating, price, size pills, qty + Add to Cart, description/bullets/notes, gallery, accordion | `heroTitle`, `priceExact`, `compareAtPrice`, `ctaLabel`, `description`, `bullets`, `notes`, `gallery`, `accordion`; top-level `item.variants`, `item.sizeChart`, `item.rating`, `item.reviewCount` | Product-only |
| 2 | `course-details` | `CourseDetails.astro` | Hero: eyebrow/title/rating, price, intro copy, buy-box controls, Enroll CTA, instructor byline/avatars, branded card or hero image | `heroTitle`, `priceExact`, `compareAtPrice`, `heroCaption`, `description`, `buybox`, `enrollHref`, `enrollLabel`, `instructorsByline`, `heroAvatars`, `courseCard`, `heroImage`; top-level `item.rating`, `item.reviewCount` | Course-only |
| 3 | `course-overview` | `CourseOverview.astro` | "Course Overview" band: details grid, image, "Course Concepts" copy | `overview` | Course-only |
| 4 | `four-column` | `FourColumn.astro` | Yellow 4-card feature band | `featuresHeading`, `features` | Shared (both kinds use it today) |
| 5 | `youll-stop-and-instead` | `YoullStopAndInstead.astro` | Two-panel "you'll stop / and instead" callout | `youllStop` | Course-only today |
| 6 | `comparison-chart` | `ComparisonChart.astro` | Comparison table band with an optional upsell CTA | `comparison` | Course-only today |
| 7 | `testimonial` | `Testimonial.astro` | Yellow testimonial band; becomes a real carousel once there's more than one entry | `testimonial` | Course-only data today; component is written generically (no course-specific hardcoding) so a future product PDP can reuse it unchanged |
| 8 | `your-instructors` | `YourInstructors.astro` (+ `InstructorCard.astro`) | Bio cards (photo/name/credential/bio) with a real read-more toggle | `instructorsHeading`, `instructors` | Course-only data today; same "written generically" note as `testimonial` |
| 9 | `faqs` | `Faqs.astro` (reuses `PdpAccordion.astro`) | Teal FAQ accordion band | `faqsHeading`, `faqs` | Course-only today |
| 10 | `three-column-info` | `ThreeColumnInfo.astro` | 3-column checklist band with an optional CTA | `threeColumn` | Course-only today |
| 11 | `image-with-text` | `ImageWithText.astro` | Media/text split band with an optional CTA | `imageWithText` | Course-only today (component is built against 4 known Figma instances, only 1 of which ships data yet — see the file's own header comment) |
| 12 | `brand-section` | `BrandSection.astro` | Teal brand band: logo + tagline | No per-item data — reads `pdpBrand.tagline`, a catalog-level export, not `item.pdp` | Shared; desktop-only (CSS-hidden under 1024px) |
| 13 | `cross-sell` | `CrossSell.astro` (`src/components/plp/CrossSell.astro` — reused from the PLP grid) | Yellow band of linked item cards + a "Shop All" card | `crossSell` | Shared |
| 14 | `pdp-reviews` | `PdpReviews.astro` | Reviews summary band (average rating, star distribution, badges) | `reviews` | Shared — but see "Known artifacts," this is a **static placeholder** |
| 15 | `logo-wall` | `LogoWall.astro` (`src/components/plp/LogoWall.astro` — reused from the PLP grid) | "As Seen In" press-logo band | No per-item data — reads `pressLogos`, a catalog-level export | Shared |

Registry type-string list, copy-pasted from `Pdp.astro` for cross-checking:
`product-details`, `course-details`, `course-overview`, `four-column`,
`youll-stop-and-instead`, `comparison-chart`, `testimonial`,
`your-instructors`, `faqs`, `three-column-info`, `image-with-text`,
`brand-section`, `cross-sell`, `pdp-reviews`, `logo-wall`.

## Top-level item fields (not under `pdp`)

Every catalog entry — product or course — carries these regardless of
whether it has a `pdp` block at all:

| Field | Shape | Notes |
|---|---|---|
| `id` / `handle` | string | `handle` currently duplicates `id`; both exist as separate fields |
| `title` | string | Used site-wide: nav, breadcrumbs, PLP cards, cross-sell tiles, `<title>` |
| `kind` | `'product'` \| `'course'` | Drives routing (`/products/*` vs `/courses/*`, see `sitemap.js`) |
| `badges` | string[] | e.g. `['Product']`, `['Course', 'Professional']` — PLP card chips |
| `price` | string | PLP-card sample price — the PDP hero may override it with `pdp.priceExact` |
| `priceRange` | string \| `null` | Used instead of `price` for at least one course (Foot Fest) |
| `description` | string | PLP-card copy — the PDP hero may override it with `pdp.description` |
| `image` | string | PLP-card image; also `ProductDetails`' gallery fallback when `pdp.gallery` is unset |
| `href` | string | Canonical route, must resolve in `sitemap.js` (enforced by `tests/catalog.test.mjs`) |
| `cta` | string | PLP-card CTA label |
| `rating` / `reviewCount` | number \| undefined | Feeds `StarRating` on PLP cards AND the PDP hero (`ProductDetails`/`CourseDetails`) — a **separate concept** from `pdp.reviews` below |
| `variants` | `{ label, options: string[] }` \| `null` | Size pills; `null` when the item has none (never an empty object) |
| `sizeChart` | `{ columns: string[], rows: string[][] }` \| `null` | Feeds `PdpAccordion`'s `type: 'sizechart'` row |
| `pdp` | object \| undefined | Everything below |

## The `pdp` field reference

Every field is optional unless stated otherwise. "Absent" always means
`undefined` (the key omitted entirely) — the catalog never authors an empty
placeholder value for a field it doesn't need (see "Guard rules").

**Composer-level**
- `sections: (string | { type, ...data })[]` — **required** for anything to
  render. Ordered list of registry type strings. A plain object form
  (`{ type, ...data }`) is supported by `Pdp.astro`'s normalization step but
  unused by the catalog today — every item authors plain strings.

**`product-details` (`ProductDetails.astro`)**
- `heroTitle?: string` — overrides `item.title` for just the `<h1>`
- `priceExact?: string` — overrides `item.price` for the hero
- `compareAtPrice?: string` — struck-through original price beside `priceExact` (sale pricing)
- `ctaLabel?: string` — overrides the "Add to Cart" button label (e.g. "Notify When Available" for an out-of-stock item); the button's behavior never changes, only the text
- `description?: string` — hero intro paragraph
- `bullets?: string[]` — benefit bullet list
- `notes?: string[]` — footnote paragraphs below the bullets
- `gallery?: string[]` — image gallery; empty/absent falls back to `[item.image]` (a real default, not "render nothing" — the gallery region is structurally required)
- `accordion?: { label, content?, type? }[]` — rows for `PdpAccordion.astro`. `type: 'sizechart'` renders `item.sizeChart` as a table; every other row renders `label` + `content`, where `content` is **trusted, hand-authored HTML** injected via `set:html` (paragraphs, bullet lists, YouTube iframe embeds, PDF links)

**`course-details` (`CourseDetails.astro`)**
- `heroTitle?`, `priceExact?`, `compareAtPrice?`, `description?` — same meaning as `product-details`'s equivalents
- `heroCaption?: string` — optional credibility line above `description`
- `buybox?: { label, controls: [{ type: 'pills' | 'select', options?, placeholder?, ariaLabel? }] }` — an ordered list of controls under one shared label. A `pills` option with `href` renders a real `<a>`; without `href` it's an inert `<span>` (no destination = no false affordance). A `select` with `options: []` is a **documented client-content stub** — it renders `aria-disabled="true"` rather than a fake-functional combobox (see "Known artifacts")
- `enrollHref? / enrollLabel?` — primary CTA. Every course is Kajabi-fulfilled, not a Shopify-cart purchase, so this is a plain external `<a>`
- `instructorsByline?: string` — "Course By: …" text
- `heroAvatars?: number` — avatar-circle count override; defaults to `instructors.length`
- `courseCard?: { titleLines: string[], variant?: 'yellow', tag? }` — branded right-column card, mutually exclusive with `heroImage`
- `heroImage?: string` — plain photo for the right column, mutually exclusive with `courseCard`

**`course-overview` (`CourseOverview.astro`)** — reads `overview`
- `overview.image?: string`
- `overview.details?: { label, value }[]`
- `overview.body?: string | string[]` — a plain string renders one `<p>`; an array renders a `<ul>` (or `<ol>` if `overview.ordered === true`) of one `<li>` per entry
- `overview.ordered?: boolean` — only meaningful when `body` is an array

**`four-column` (`FourColumn.astro`)** — shared by both kinds
- `featuresHeading?: string` — sibling heading key (see "Heading convention")
- `features: { image, label?, text, body? }[]` — `text` is the card's bold headline sentence; `label` is an optional small caption above it; `body` is an optional second paragraph below it

**`youll-stop-and-instead` (`YoullStopAndInstead.astro`)** — reads `youllStop`
- `youllStop.stop: { lead, body }`, `youllStop.instead: { lead, body }` — all four leaf strings are effectively required (the registry guard requires all four before this section renders at all)

**`comparison-chart` (`ComparisonChart.astro`)** — reads `comparison`
- `comparison.columns: [string, string]` — also drives the derived heading (`"${columns[0]} VS ${columns[1]}"`)
- `comparison.intro?: string` — optional paragraph under the heading
- `comparison.rows: { label, values: (string | boolean)[] }[]` — a boolean value renders an accessible check/✕ glyph; every shipped row today uses plain "Yes"/"No" strings instead (the boolean branch exists for a future Figma frame that actually shows icons)
- `comparison.cta?: { label, href }`

**`testimonial` (`Testimonial.astro`)** — reads `testimonial`, an **array**, never a bare object (enforced by `tests/testimonial.test.mjs`)
- `testimonial: { quote: string[], author, role?, rating }[]` — `quote` is an array of paragraph strings (one `<p>` each); a literal `\n` inside a paragraph renders as a `<br>`. More than one entry turns on a real, scripted carousel; exactly one entry renders the same card with decorative (non-interactive) arrows

**`your-instructors` (`YourInstructors.astro`, `InstructorCard.astro`)** — reads `instructors`
- `instructorsHeading?: string` — sibling heading key, defaults to `'Your Instructors'`
- `instructors: { photo, name, credential?, bio: string[] }[]` — `credential` in the shipped data is actually a location line, not a professional credential (kept under this name to match the original brief — see the component's own header comment); `bio` is an array of paragraph strings. A "Read More" toggle only renders when the bio's rendered height actually overflows a 4-line clamp (measured client-side, not authored)

**`faqs` (`Faqs.astro`, reusing `PdpAccordion.astro`)** — reads `faqs`
- `faqsHeading?: string` — sibling heading key, defaults to `'Frequently Asked Questions'`
- `faqs: { label, content }[]` — `content` is **trusted, hand-authored HTML** via `set:html`, same trust model as `product-details.accordion`

**`three-column-info` (`ThreeColumnInfo.astro`)** — reads `threeColumn`
- `threeColumn.heading?: string` — heading lives **inside** this object (contrast with the sibling-key sections above)
- `threeColumn.columns: { heading?, items: string[] }[]` — column count and item-per-column count both vary freely; a column with an empty/absent `items` is filtered out before rendering
- `threeColumn.cta?: { label, href }`

**`image-with-text` (`ImageWithText.astro`)** — reads `imageWithText`
- `imageWithText.image: string`, `.imageSide?: 'left' | 'right'` (default `'left'`, desktop-only — mobile always stacks image-above-text), `.imageWidth?: number` (px; absent = a ~50/50 flex split, present = a fixed-width column)
- `.heading?: string` — inside the object, like `threeColumn`
- `.intro?`, `.listLead?`, `.note?: string` — three distinct optional copy slots (intro/lead render above the list, note renders after it)
- `.items: string[]` — **required**; this is the one field the registry guard checks
- `.cta?: { label, href, icon?: boolean }`

**`brand-section` (`BrandSection.astro`)** — no per-item field; reads the catalog-level `pdpBrand.tagline` export (a single shared default, not authored per item)

**`cross-sell` (`CrossSell.astro`)** — reads `crossSell`
- `crossSell.heading: string`, `.itemIds: string[]` (looked up via `getItem`), `.shopAllHref: string` — all three are required for the section to render
- `.variant?: 'shop-products'` — an extended card layout (extra kicker/blurb text, a cart glyph instead of an arrow) used by exactly one product (Walk) today
- `.kickers?: string[]`, `.blurbs?: string[]` — only meaningful with `variant: 'shop-products'`; parallel-indexed to `itemIds`

**`pdp-reviews` (`PdpReviews.astro`)** — reads `reviews`. **This is a static placeholder** (see "Known artifacts")
- `reviews.rating: number`, `.count: number`, `.distribution: { stars, count }[]` — `rating`/`count` are checked with `!= null`, not truthiness, because a genuinely-zero rating/count (`0`) is real content, not absence

**`logo-wall` (`LogoWall.astro`)** — no per-item field; reads the catalog-level `pressLogos` export

## Guard rules

This is the rule that mattered most getting this branch built correctly, and
it is genuinely easy to get wrong — the registry's own header comment and
several components' header comments (`ThreeColumnInfo.astro` cites **ten**
prior instances of one variant of this bug on this branch; `ImageWithText.astro`
cites **thirteen**) document a long history of catching it late.

**The rule:** an absent OR empty optional field must render **nothing** — no
empty section wrapper, no caption with nothing under it, no pill/button with
no destination, no `<p></p>`. Not "render something reasonable," not "render
a placeholder" — nothing, same as if the section type didn't exist in
`sections` at all.

**Why it's a trap, concretely — four JavaScript truthiness gotchas this
codebase had to explicitly guard against:**

1. **Empty array `[]` is truthy.** `item.pdp?.threeColumn &&` passes for
   `threeColumn: { columns: [] }` just as readily as for real data. Every
   array-backed section guards on `.length > 0`, not bare presence — see
   `Pdp.astro`'s registry entries for `four-column`, `testimonial`,
   `your-instructors`, `faqs`, `three-column-info`, `image-with-text`.
2. **Empty object `{}` is truthy.** `item.pdp?.youllStop &&` passes for
   `youllStop: {}`, and a naive render would then crash reading
   `youllStop.stop.lead` off `undefined`. Object-backed sections guard on
   the specific leaf fields they actually read (`comparison-chart` checks
   `columns.length >= 2 && rows.length > 0`; `youll-stop-and-instead` checks
   all four of `stop.lead`/`stop.body`/`instead.lead`/`instead.body`).
3. **Empty string `''` is falsy — the one case that's safe with a bare `&&`.**
   `item.pdp?.description &&` correctly renders nothing for `description: ''`
   with no extra `.length` check needed. This is why `intro`/`listLead`/`note`/
   `heading` string fields across these components use plain `&&`, while
   their array/object siblings need the extra non-emptiness check above —
   don't "fix" a string guard by adding a `.length` check it doesn't need.
4. **`0` is falsy, but is sometimes real data, not absence.** A genuinely
   zero star rating or zero review count is content the page should still
   render, not hide. `pdp-reviews`' registry guard and `course-details`'
   rating check both use `!= null` rather than bare truthiness for exactly
   this reason (see the "Guarded on the fields that actually matter" comments
   in `Pdp.astro`). The flip side of this gotcha: **Astro renders a literal
   `0`**, same as React/JSX — `{count.length && <div>…</div>}` where
   `count.length` is `0` prints the character `0` onto the page instead of
   rendering nothing, because `0 && x` evaluates to `0` in JavaScript and
   Astro renders any non-`null`/`undefined`/`false` expression result as
   text. This is why every guard in this codebase is written as an explicit
   boolean comparison (`.length > 0`, `!= null`) rather than relying on the
   raw value's own truthiness inside a template `{}` expression — see
   `ProductDetails.astro`'s `{item.pdp?.bullets?.length > 0 && (...)}` for a
   representative example, and grep this codebase for `.length > 0` vs. the
   absence of any bare `.length &&` pattern.

**One deliberate exception:** `ProductDetails.astro`'s `gallery` falls back to
`[item.image]` rather than rendering nothing, because the gallery region is
structurally required by the hero layout — there's no "no gallery" state for
a product PDP the way there's a "no comparison table" state for a course.

**One known gap, found during this pass, not fixed (documentation-only task —
flagging per the brief, not fixing):** `FourColumn.astro` renders
`<h2>{heading}</h2>` with no guard on `heading` itself. If an item sets
`features` (so the registry guard passes) but never sets `featuresHeading`,
this renders an empty `<h2></h2>`. Every shipped item happens to set both
together, so this has never fired — but it's the one heading in this system
that isn't guarded the way the guard-rule discipline above would predict.

## Heading convention

There's a real, consistent rule for where a section's heading text lives,
verified against every one of the 15 components:

**Array-shaped section data → heading is a SIBLING key in `pdp`,
independent of the array itself:**

| Section | Array field | Sibling heading key | Default when unset |
|---|---|---|---|
| `four-column` | `features` | `featuresHeading` | *(none — see the guard gap above)* |
| `your-instructors` | `instructors` | `instructorsHeading` | `'Your Instructors'` (via `??`, so `''` would render as a literal empty heading, not fall back) |
| `faqs` | `faqs` | `faqsHeading` | `'Frequently Asked Questions'` (via `\|\|`, so `''` *does* fall back — a real, minor inconsistency with `instructorsHeading`'s `??`) |

**Object-shaped section data → heading lives INSIDE the object, when the
section is genuinely data-driven at all:**

| Section | Object field | Heading location |
|---|---|---|
| `three-column-info` | `threeColumn` | `threeColumn.heading` (optional, guarded — renders nothing if unset) |
| `image-with-text` | `imageWithText` | `imageWithText.heading` (optional, guarded — renders nothing if unset) |

**Two more object-shaped sections exist but don't follow either pattern —
worth knowing before assuming the rule above is universal:**
- `course-overview` (`overview`): the "Course Overview" heading is **static
  markup**, not a data field at all — there is no `overview.heading` to set.
- `comparison-chart` (`comparison`): the heading is **derived**, not stored —
  it's built from `comparison.columns[0]`/`columns[1]` at render time
  (`"${columns[0]} VS ${columns[1]}"`), not a separate authored string.

## The porting boundary — what becomes what in Shopify

This is the part the dev team needs most and the part this reference build
can't fully settle on its own. Below is a concrete, honest mapping — anywhere
this repo can't determine the right Shopify primitive on its own, it's
flagged as a **decision for the dev team**, not guessed.

**Top-level item fields → the Shopify product record.** `title`, `price`
(→ variant price), `image`/`gallery` (→ product images), `description` (→
Shopify's native product description), `variants` (→ real Shopify product
options/variants, not this reference build's fake size-pill buttons),
`sizeChart` (→ likely a metafield, since Shopify has no native size-chart
concept). This part is the least ambiguous piece of the whole model.

**The `pdp` block → metafields and/or metaobjects.** Every section's data
(`overview`, `features`, `youllStop`, `comparison`, `testimonial`,
`instructors`, `faqs`, `threeColumn`, `imageWithText`, `crossSell`,
`reviews`) is naturally metafield/metaobject data, scoped to the product (or,
for courses, to whatever resource courses end up being — see below). **Which
Shopify field type each one becomes is a real decision, not something this
build can dictate:**
- A **metaobject definition per section shape** (e.g. a `testimonial`
  metaobject type, referenced as a list) gives merchants a structured admin
  UI to edit each entry, at the cost of defining ~10 metaobject types.
- **One JSON metafield per section**, holding the object/array as-is, is far
  less admin work to set up but gives merchants a raw JSON blob to hand-edit
  instead of a form.
- This repo's data shapes (arrays of small objects, mostly 2-4 fields each)
  work either way — **flagged as a decision for the dev team**, not resolved
  here.

**The `sections` array → the template/section-group config, probably NOT a
metafield at all.** If the Shopify build uses a distinct Online Store 2.0
JSON template per PDP (or per PDP "shape"), the section *order* is just how
blocks are arranged in that template — `pdp.sections` wouldn't need to exist
as data in Shopify at all, since Shopify's own section/block system already
expresses "which sections, in what order." A metafield-driven single generic
template (reading one order field to decide what to render, mirroring this
repo's own composer) is the alternative, closer architecturally to what this
repo does — but duplicates a mechanism Shopify already provides natively.
**Flagged as a decision for the dev team**, and probably the single biggest
architectural choice in this whole port.

**`kind: 'course'` vs. `'product'` → also a real decision, not obvious.**
This reference build treats courses as their own route kind (`/courses/*`,
routed and Kajabi-fulfilled — no cart, no Shopify checkout) distinct from
products (`/products/*`, real cart/checkout). Whether the Shopify build
should model courses as actual Shopify Products (so they can reuse the same
template/metafield machinery, with `enrollHref` standing in for the "buy"
action) or as an entirely separate resource (a custom page type/metaobject,
since they never enter Shopify's cart) is **not decided by this repo** and
should be a deliberate call, not an accident of "products were easier to
wire up first."

**`crossSell.itemIds: string[]` → a Shopify "list of product references"
metafield**, not a list of strings — this repo's plain-string IDs are a
stand-in for what Shopify would resolve as real product references.

**`accordion[].content` / `faqs[].content` (trusted raw HTML via `set:html`)
→ likely NOT a plain Shopify rich-text metafield.** Shopify's native
`rich_text` metafield type supports a constrained set of formatting and does
not support arbitrary embeds (the YouTube `<iframe>` rows in
`product-details.accordion` are the clearest case). **Flagged as a decision
for the dev team**: options include an HTML-type metafield (less
merchant-safe), a structured metaobject with a dedicated "embed URL" field
the section template renders, or an app block for video specifically. This
repo's `set:html` approach is a reference-build convenience, not a
recommendation.

**Two separate "reviews" concepts exist and probably shouldn't stay
separate.** Top-level `item.rating`/`item.reviewCount` (drives the PLP card
and the PDP hero's star row) and `pdp.reviews` (drives the `pdp-reviews`
band's chart) are two different fields in this catalog, but in a real
Shopify build both would likely be sourced from the **same** reviews app
(Judge.me/Loox/etc.) once one is installed — carrying them as two
independently-editable metafields would invite the two numbers drifting
out of sync. **Flagged as a decision for the dev team.**

**Catalog-level (non-per-item) exports (`pdpBrand.tagline`, `pressLogos`) →
shop-level theme settings or a shop metafield, NOT a per-product metafield.**
`brand-section` and `logo-wall` read these regardless of which item's page
they're on — there is nothing per-item to port for either.

## Known reference-build artifacts the team must NOT port

These exist to make this build clickable and honest about its own gaps —
none of them are real Shopify behavior, and porting any of them as-is would
be a regression, not a head start.

- **`ProductDetails.astro` imports `getItem` from `catalog.js` inside its
  client `<script>`** (`src/components/pdp/ProductDetails.astro:162`) purely
  to look up one line-item's price/title/image at Add-to-Cart time. This
  ships the *entire* ~100KB catalog module to the browser. **The same defect
  exists in `QuickAddModal.astro`'s client script**
  (`src/components/plp/QuickAddModal.astro:60`), which is mounted once per
  PLP/collection page — so this isn't limited to the 7 product PDPs; it also
  ships on the 6 collection pages that render a `QuickAddModal`, for **13
  affected pages total**. In Shopify this is a Liquid/metafield lookup (or a
  small per-product JSON blob Shopify already emits on the page), never a
  client-side import of the whole catalog. Do not port either import.
- **`src/scripts/cart.js` is a framework-free `localStorage` cart** standing
  in for Shopify's real cart/AJAX Cart API. It exists so Add to Cart /
  quantity/remove interactions are clickable in this reference build; none
  of its persistence logic should be ported.
- **Course enroll CTAs (`pdp.enrollHref`) are placeholder Kajabi links** —
  realistic-looking URLs, not live checkout/offer links. Every one needs to
  be swapped for the real Kajabi offer URL before this goes live.
- **`PdpReviews.astro`'s data (`pdp.reviews`) is a static placeholder**,
  values measured directly off a flattened screenshot of a reviews-app
  widget in Figma (the Figma layer itself has no real structured data — see
  the component's own header comment). The whole section should be replaced
  by the real Shopify reviews app's embed, not ported as rendered markup.
- **`faqs[].content` answer copy is partly authored, not Figma-sourced, for
  at least one course.** Sole Switch Pro's FAQ `content` values are flagged
  in `catalog.js` as author-written placeholders for two of its four rows
  (grounded conservatively, no invented clinical claims) because neither
  Figma frame nor any design-system library had real answer copy behind the
  FAQ accordion's collapsed-state mockup. Treat FAQ answer copy generally as
  needing client sign-off, not as finished content, before porting it as
  real answers.
- **Select controls ship with empty option lists.** The task brief for this
  doc flagged two; a direct grep of `catalog.js` for `type: 'select'` found
  **three**: Functional Gait Assessment Level 1, Functional Gait Assessment
  Level 2, and Trainer Certification each carry a `buybox` control shaped
  `{ type: 'select', placeholder: 'Location…', options: [] }`. All three
  render as a real, focusable `<select>` with `aria-disabled="true"` (not
  `disabled`, to preserve Figma's un-greyed visual) rather than a fake
  functional combobox — because neither breakpoint's Figma frame exposes the
  real location list behind the control, only its closed/placeholder state.
  Each is explicitly commented in `catalog.js` as a "CLIENT-CONTENT
  FLAG"/"DISCLOSURE": **the client must supply the real option list before
  this control is functionally complete.**
