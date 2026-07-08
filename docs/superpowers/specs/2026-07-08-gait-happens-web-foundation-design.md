# Gait Happens Web Migration — Foundation Slice Design

**Date:** 2026-07-08
**Project:** Gait Happens Web Migration (WordPress → Shopify redesign, Phase 2)
**Repo root:** `C:\Users\Adam Tarr\The Grounded Company Dropbox\CLIENTS\Gait Happens\04_Website\00_Claude`
**Status:** Design approved — pending spec review

---

## 1. Purpose

Build the Gait Happens site as a **living, clickable HTML/CSS/JS reference repo** that is handed to the client's dev team to port into Shopify. It replaces static Figma prototyping: the dev team gets real markup, real styles, real interaction, and real page-to-page linking, which minimizes QA ambiguity and translation guesswork.

This spec covers the **foundation slice**: the shared shell (design tokens, header/nav, footer) plus the **entire sitemap scaffolded as real, linked placeholder pages**. Individual pages (PDPs, PLPs, homepage, etc.) are built out one at a time in later steps; this slice makes every link work from day one.

## 2. Goals & non-goals

**Goals**
- One repo, built incrementally — foundation first, then pages knocked off one at a time as the project is phased.
- Every nav destination and every PDP/PLP exists as a real, linked route now (most as placeholders).
- Shared nav + footer authored once and reused everywhere; they can never drift from the page list.
- Componentization maps cleanly onto Shopify sections/snippets, so the structure doubles as handoff documentation.
- Faithful-but-pragmatic fidelity to the Figma: reads as the real design and matches layout/interaction/flow; exact pixels are a sensible-judgment call, not an obsession.
- Runs locally with a live dev server; builds to plain static HTML that opens/hosts anywhere.

**Non-goals (this slice)**
- Not building out PDP/PLP/homepage content — those are later steps.
- Not real commerce (no live cart/checkout, no real auth). Cart/search/account are demonstrated as interactions with stub destinations.
- Not a Shopify theme (no Liquid). This is a reference build; the dev team writes the Liquid.

## 3. Fidelity

Faithful but pragmatic. Match the Figma's layout, spacing intent, type, color, interaction, and responsive behavior closely enough to read as the real site, without pixel-nudging. Exact tokens come from the design system (Section 5).

## 4. Tech stack

- **Astro** static site generator.
  - Component-based (header, mega-menu, footer, cards, buttons written once).
  - Outputs zero-JS static HTML by default; interactivity (mega-menu, drawers) added with small vanilla JS.
  - Component boundaries map ~1:1 onto Shopify sections/snippets.
- **Local dev:** `npm run dev` for live clicking/linking.
- **Build:** `npm run build` → static `dist/` the dev team can open or host anywhere.
- **No CSS framework.** Hand-authored CSS driven by design tokens (CSS custom properties).
- **Motion:** GSAP + ScrollTrigger for hero/scroll choreography; Astro View Transitions for page-to-page. Shopify-portable. See Section 10.
- **Fonts:** Montserrat self-hosted (woff2 in `/public/fonts`) — renders identically offline, no external font call.

## 5. Design tokens

Source of truth: **Gait Happens Design System** (Figma file `B0fHmlEEm9OdOOnAbnmI8d`). All values become CSS custom properties in `src/styles/tokens.css`; nothing hard-codes a hex or pixel. The dev team inherits the same variable names.

**Type scale (confirmed from DS Typography page, node 71:4) — Montserrat:**

| Token | Font / weight | Size |
|---|---|---|
| `--type-display` | Montserrat Bold | 40 |
| `--type-h3` | Montserrat SemiBold | 32 |
| `--type-h4` | Montserrat Medium | 24 |
| `--type-body-large` | Montserrat Regular | 20 |
| `--type-body` | Montserrat Regular | 20 (tighter line-height) |
| `--type-body-sm` | Montserrat Regular | 14 |
| `--type-label` | Montserrat SemiBold | 16 |
| `--type-caption` | Montserrat Regular | 12, 1.8 tracking, UPPERCASE |
| `--type-cta` | Montserrat SemiBold | 16 |
| `--type-button` | Montserrat Medium | 20 |

**Color** (exact hex to be finalized from the DS Colors page during implementation; palette reads as): charcoal/near-black (header, text), golden yellow (primary accent / cards / CTAs), teal (secondary CTA), white, plus neutrals.

**Spacing:** spacing scale pulled from the DS during implementation → `--space-*` variables.

> Implementation note: `get_variable_defs` requires the DS file to be selected in the Figma desktop app. When building, either select the Colors/Spacing frames so tokens can be read exactly, or provide the node links.

## 6. Repo structure

```
00_Claude/                         (repo root, git-initialized)
  package.json
  astro.config.mjs
  README.md                        run instructions + dev-team handoff notes
  docs/superpowers/specs/          this spec + future specs
  src/
    data/
      sitemap.js                   single source of truth: routes, labels, nav grouping, status
    styles/
      tokens.css                   design-system tokens as CSS variables
      motion.css                   motion tokens (durations, easings) + micro-interaction transitions
      global.css                   reset + base + type styles
    scripts/
      motion.js                    GSAP setup: reveal-on-scroll, hero timelines, reduced-motion guard
    layouts/
      BaseLayout.astro             <html> shell: header (nav row + shipping bar) + <slot/> + footer
    components/
      AnnouncementBar.astro
      Header.astro
      MegaMenu.astro
      NavCard.astro                mega-menu cards (image + label + arrow; yellow / teal variants)
      AccountMenu.astro            account dropdown (login destinations)
      Footer.astro
      Button.astro                 yellow / teal-CTA variants
      SearchOverlay.astro
      CartDrawer.astro
      PlaceholderPage.astro        stub body used by every scaffolded route
    pages/
      index.astro                  Home (placeholder)
      collections/…  products/…  courses/…  resources/…  pages/…  blogs/news/…
      account/…
      _status.astro                internal build-progress checklist
  public/
    images/                        nav card images + logo exported from Figma
    fonts/                         Montserrat woff2
```

## 7. Component model

Each component is a self-contained unit with one purpose, mapping onto a Shopify section/snippet:

- **Global shell:** `AnnouncementBar`, `Header`, `MegaMenu`, `NavCard`, `AccountMenu`, `Footer`, `BaseLayout`.
- **Building blocks:** `Button` (yellow / teal-CTA), `SearchOverlay`, `CartDrawer`, `PlaceholderPage`. This set grows as pages are built.
- **`sitemap.js` drives both the nav and the placeholder pages** — one route entry appears in the correct menu *and* renders a working page, so nav and pages cannot drift.
- **Building a page out later = swap, don't rewire:** replace only that route's placeholder with a real template; nav, links, tokens, and all other pages are untouched.

## 8. Sitemap

All routes get the real header + footer and correct links now. Status: `placeholder` unless noted. URLs follow Shopify conventions so they port directly.

```
/                                          Home                              (Phase 3)

SHOP ▾  (menu opens; no landing page)
  /collections/best-sellers                Shop Best Sellers (PLP)
  /collections/featured                    Featured Products (PLP)
  /collections/all                         Shop All (PLP)
  /products/toe-spacers                    Toe Spacers (PDP)
  /products/foot-health-kit                The Foot Health Kit (PDP)
  /products/cork-supplement                Cork Supplement (PDP)
  /products/toe-strengtheners              Toe Strengtheners (PDP)
  /products/toe-dynamometer                Toe Dynamometer (PDP)
  /products/walk                           WALK — book (PDP)

COURSES ▾  (menu opens; no landing page)
  /collections/courses-individuals         Courses for Individuals (PLP)
  /collections/courses-professionals       Courses for Professionals (PLP)
  /collections/all-courses                 All Courses (teal CTA) — custom PLP grouping
                                           Individuals + Professionals by persona with a
                                           header (design in progress)
  /courses/foot-fest                       Foot Fest (course PDP)
  /courses/combating-bunions               Combating Bunions
  /courses/fit-feet                        Fit Feet
  /courses/virtual-consultations           Virtual Consultations
  /courses/sole-switch                     Sole Switch (Basic)
  /courses/sole-switch-pro                 Sole Switch Pro
  /courses/gait-guru-membership            Gait Guru Membership
  /courses/trainer-certification           Trainer Certification
  /courses/gait-foundations                Gait Foundations
  /courses/functional-gait-assessment-l1   Functional Gait Assessment L1

RESOURCES ▾  (menu opens; no landing page)
  /resources/locally-trained-practitioners Locally Trained Practitioners
  /resources/our-favorite-brands           Our Favorite Brands
  /blogs/news                              Blog                              (Phase 4)
  /resources/find-a-retailer               Find a Retailer
  /resources/guest-appearances             Guest Appearances
  /resources/event-calendar                Event Calendar

ABOUT
  /pages/about                             About — sole direct top-level link (Phase 3)

CONTACT ▾  (menu opens; no landing page)
  /pages/faqs                              FAQs
  /pages/customer-support                  Customer Support = the contact page
  /pages/media-partnerships                Media & Partnerships

UTILITY
  /search                                  Search (overlay + results placeholder)
  Account ▾  (dropdown)
    /account/wholesaler-login              Wholesaler Login → Shopify (external, stubbed)
    /account/course-login                  Course Login → Kajabi (external, stubbed)
    /account/consultation-login            Virtual Consultation Login (platform TBD, stubbed)
  /cart                                    Cart (slide-out drawer; page fallback)
```

**IA decisions (confirmed):** top-level Shop/Courses/Resources/Contact open the menu only — no landing pages. About is the only direct link. Logo → Home. Best Sellers is **not** shared into Courses. "All Courses" replaces the old teal card in the Courses menu.

## 9. Interaction behavior

**Mega-menu (desktop).** Hover or focus a top-level item → full-width panel drops below the header with its cards (yellow cards + teal CTA). Closes on mouse-leave, `Esc`, or outside-click. Keyboard-navigable (tab / arrow / enter).

**Account dropdown.** Compact dropdown (not a mega-menu) from the account icon with the three login destinations. Each is a placeholder route now, ready to repoint at its external URL (Shopify / Kajabi / consultation platform).

**Mobile nav.** Hamburger → slide-in drawer. Top-level items become accordions expanding to the same cards, stacked. The nav row is sticky; the shipping bar sits directly beneath it (per Figma, the two form the single "Nav and Top Bar").

**Utility.**
- **Search** → icon opens an overlay input; submit → `/search` placeholder.
- **Cart** → slide-out drawer with an empty-cart state; `/cart` page fallback.
- **Account** → dropdown (above).
- **Language (EN ▾)** → static / decorative for now.

**Responsive.** Mobile-first, matching the desktop + mobile mockups; pragmatic between breakpoints.

## 10. Motion & animation

"Mildly Awwwards": restrained, purposeful motion that elevates key moments without calling attention to itself. Fast, easing-driven, few elements at a time.

**Tooling.** GSAP + ScrollTrigger for scroll-triggered reveals and hero choreography; Astro View Transitions for smooth page-to-page changes. Both are Shopify-portable so the dev team can reproduce them.

**Established in this foundation slice (so all later pages inherit it):**
- **Motion tokens** — standard durations and easings as variables (`--motion-fast`, `--ease-out-expo`, …) in `motion.css`.
- **Reveal-on-scroll utility** — elements marked to fade + rise as they enter the viewport (staggered), via one shared GSAP/ScrollTrigger setup in `motion.js`.
- **Page transitions** — Astro View Transitions for the SPA-like feel between routes.
- **Nav / drawer / menu easing** — mega-menu, mobile drawer, cart drawer, and account dropdown all use the shared easing tokens.
- **Micro-interactions** — card hover lift, button hover, the "→" arrow nudge on hover.

**Applied as hero pages are built (later steps):**
- **Hero entrances** — staggered fade/rise of headline → subhead → CTA on load.
- **Subtle hero media motion** — restrained parallax or scale on the hero image.
- **Section intros** — scroll reveals per section using the shared utility.

**Guardrails.**
- `prefers-reduced-motion: reduce` → reveals resolve to their final state instantly, parallax/scale off, transitions minimized.
- Transform/opacity only (GPU-friendly); no layout-thrashing properties.
- Sparing by design — a few hero moments and section reveals, not motion on everything.

## 11. Placeholder pattern

Every stub is a real, on-brand page: full header + footer, correct `<title>`, an `H1` of the page's name, a breadcrumb, and a small **"In progress"** chip with a one-line note (e.g. *"This page will be built in Phase 3"*). Looks intentional and finished-enough that clicking around feels like a real site — never blank or broken.

## 12. Progress tracking

`sitemap.js` carries a `status` field (`placeholder` / `built`) per route. `src/pages/_status.astro` renders a live checklist of every route and its status — an at-a-glance view for Adam and the dev team of what's done. Underscore-prefixed so it reads as internal, not part of the real site.

## 13. Handoff notes (in README)

- How to run (`npm install`, `npm run dev`, `npm run build`).
- Token map: CSS variable names → design-system tokens.
- Component → Shopify section/snippet mapping.
- Which routes are placeholders vs. built (mirrors `_status`).
- URL conventions and where they map in Shopify.

## 14. Assets

Exported from Figma into `public/images`: logo, and the nav card images (Best Sellers photo, WALK cover, Courses for Individuals/Professionals photos, etc.). Placeholder bodies need no imagery. Montserrat woff2 into `public/fonts`.

## 15. Open items / assumptions

- Exact color and spacing token values to be read from the DS Colors/Spacing pages at implementation (needs the frames selected in Figma desktop, or node links).
- Login destinations (Shopify wholesaler portal, Kajabi, consultation platform) are stubbed pending real URLs.
- "All Courses" grouped PLP design is in progress; route exists as a placeholder until the design lands.

## 16. Out of scope (future steps)

Homepage (Phase 3), full PDP/PLP/About/Contact/FAQ page buildouts, blog content migration (Phase 4), real cart/checkout/auth, domain consolidation (Phase 5).
