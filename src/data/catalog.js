// Catalog data model — products + courses + PLP collections.
// Source of truth for PLP/PDP content until this is wired to Shopify/Kajabi.
// Prices/ratings/descriptions marked "(sample)" in the design spec are filled
// with realistic placeholder values in Gait Happens' foot-health brand voice.

export const items = [
  // ---- Products ------------------------------------------------------

  {
    id: 'toe-spacers',
    handle: 'toe-spacers',
    title: 'Toe Spacers',
    kind: 'product',
    badges: ['Product'],
    price: '$28 USD',
    priceRange: null,
    description: 'Soft, flexible toe spacers that gently realign your toes to relieve pressure from bunions, hammertoes, and tight shoes.',
    image: '/images/plp/toe-spacers.jpg',
    href: '/products/toe-spacers',
    cta: 'View Product',
    // Figma PDP hero (710:6353 / 1017:9517): 5-star rating, 270 reviews.
    rating: 5,
    reviewCount: 270,
    variants: { label: 'Size', options: ['Small', 'Medium', 'Large'] },
    sizeChart: {
      columns: ['Size', 'Women', 'Men', 'EU Size', 'UK Size'],
      rows: [
        ['Small', '6.5-9', '6-7', '37-40', '4.5-7'],
        ['Medium', '9.5-12.5', '7.5-11', '41-44', '7.5-10.5'],
        ['Large', '13 OR LARGER', '11.5 OR LARGER', '45 OR LARGER', '11 OR LARGER'],
      ],
    },
    pdp: {
      // Task 1 (Course PDP Chunk A): drives the data-driven Pdp.astro
      // composer — same order the hardcoded composer rendered before this
      // task (Product Details -> 4 Column -> Brand -> CrossSell -> Reviews
      // -> LogoWall). Behavior-preserving: `four-column` still renders
      // nothing without `features`, `pdp-reviews` still renders nothing
      // without `reviews` (see Pdp.astro's REGISTRY guards).
      sections: ['product-details', 'four-column', 'brand-section', 'cross-sell', 'pdp-reviews', 'logo-wall'],
      // Task 2 (Product Details hero) — Figma-verbatim price/description/
      // bullets/notes from node 710:6353 (desktop) / 1017:9517 (mobile), both
      // frames matched. `gallery` is a placeholder set (real photography
      // later) — reuses the one PLP product shot per the task brief.
      priceExact: '$28.00 USD',
      description:
        'Gait Happens Toe Spacers are designed to improve the spacing and alignment of the toes, which can help your feet be better able to assist with balance, shock absorption, and movement. The Toe Spacers assist in splaying (spreading / separating) the toes with a design that fits your daily life and can be worn on the go in proper footwear.',
      bullets: [
        'Support alignment of the toes and metatarsals',
        'Promote muscle engagement of the foot intrinsics',
        'Combat the effects of years in narrow shoes',
        'Customizable to create a personalized fit',
        'Can be worn in proper footwear and while on the go!',
      ],
      notes: [
        'Toe spacers are also commonly known as toe spreaders or toe separators.',
        '*Shipping available to United States, Canada, the European Union and United Kingdom',
      ],
      gallery: [
        '/images/plp/toe-spacers.jpg',
        '/images/plp/toe-spacers.jpg',
        '/images/plp/toe-spacers.jpg',
        '/images/plp/toe-spacers.jpg',
        '/images/plp/toe-spacers.jpg',
      ],
      crossSell: {
        heading: 'More Resources for Your Movement Journey',
        itemIds: ['toe-spacers', 'combating-bunions', 'fit-feet'],
        shopAllHref: '/collections/all',
      },
      // Task 4 (4 Column feature band) — Figma-verbatim heading/copy from
      // node 714:6430 (desktop) / 1017:9518 (mobile), both frames matched.
      // Real feature photography isn't available yet, so `image` reuses the
      // one PLP product shot for all 4 (same placeholder approach Task 2
      // took for `gallery` above).
      featuresHeading: 'Toe Spacer Features',
      features: [
        { image: '/images/plp/toe-spacers.jpg', label: null, text: 'Support alignment of the toes and metatarsals' },
        { image: '/images/plp/toe-spacers.jpg', label: null, text: 'Promote muscle engagement of the foot intrinsics' },
        { image: '/images/plp/toe-spacers.jpg', label: null, text: 'Customizable to create a personalized fit' },
        { image: '/images/plp/toe-spacers.jpg', label: null, text: 'Combat the effects of years in narrow shoes' },
      ],
      // Task 3 (Product Details accordion) — Figma-verbatim from node
      // `710:6353` / `1088:15369`'s "Instructions"/"Research" panels. The
      // "Size" row needs no `content` of its own: PdpAccordion.astro's
      // `type: 'sizechart'` branch renders the size-chart table straight
      // from `sizeChart` (above) plus boilerplate helper copy it owns.
      //
      // Task 7 refactored PdpAccordion.astro to be data-driven (an array of
      // `{ label, content?, type? }` rows, since the 5 rolled-out products
      // each have a different row set) — converted here to that shape with
      // no visual change: same 3 rows, same order, same content. Figma's
      // Instructions panel is literally two YouTube <iframe> embed-code
      // snippets pasted as text (Figma can't render a live iframe on
      // canvas); we embed the real players instead — "Reference build —
      // keep it simple + honest" per the task brief — using these
      // Figma-verbatim video URLs/titles, wrapped in the
      // `.pdp-accordion__video(s)` markup PdpAccordion.astro's global styles
      // target.
      accordion: [
        { label: 'Size', type: 'sizechart' },
        {
          label: 'Instructions',
          content: `
            <div class="pdp-accordion__videos">
              <div class="pdp-accordion__video"><iframe src="https://www.youtube.com/embed/_4wcJ6-2yt4?si=CPXtN6sfZV0qW9aH" title="YouTube video player" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
              <div class="pdp-accordion__video"><iframe src="https://www.youtube.com/embed/r_Osy4NfREY?si=eaP1jy8_fEblel-r" title="YouTube video player" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
            </div>
          `,
        },
        {
          label: 'Research',
          content: `
            <p>1. Krześniak H, Truszczyńska-Baszak A. Toe Separators as a Therapeutic Tool in Physiotherapy-A Systematic Review. J Clin Med. 2024 Dec 19;13(24):7771. doi: 10.3390/jcm13247771. PMID: 39768694.</p>
            <p>2. Aebischer AS, Duff S. Bunions: A review of management. Aust J Gen Pract. 2020 Nov;49(11):720-723. doi: 10.31128/AJGP-07-20-5541. PMID: 33123707.</p>
          `,
        },
      ],
      // Task 6 (Customer Reviews placeholder band) — Figma-verbatim summary
      // values read off node 706:7675 (desktop) / 1017:9520 (mobile). That
      // frame is a flattened screenshot of a live reviews-app widget (not
      // real Figma layers), so these numbers were measured off the image
      // directly: rating/count text ("4.75 out of 5" / "Based on 12
      // reviews") plus the 5 per-star counts read straight off the bar
      // chart's row labels (11/0/0/1/0), which cross-foot correctly —
      // (11*5 + 1*2) / 12 = 4.75. See PdpReviews.astro for the full note.
      reviews: {
        rating: 4.75,
        count: 12,
        distribution: [
          { stars: 5, count: 11 },
          { stars: 4, count: 0 },
          { stars: 3, count: 0 },
          { stars: 2, count: 1 },
          { stars: 1, count: 0 },
        ],
      },
    },
  },
  {
    id: 'foot-health-kit',
    handle: 'foot-health-kit',
    title: 'The Foot Health Kit',
    kind: 'product',
    badges: ['Product'],
    price: '$85 USD',
    priceRange: null,
    description: 'Curated by Dr. Courtney Conley and Dr. Jen Perez, this convenient kit bundles everything you need to improve the mobility and strength of your feet in one easy daily routine.',
    image: '/images/plp/foot-health-kit.jpg',
    href: '/products/foot-health-kit',
    cta: 'View Product',
    // Figma PDP hero (719:6542 / 1017:9522): same partial-star "Rating"
    // component instance as every product below (4 full + 1 half-size
    // star icon), read as 4.5; review count is Figma-verbatim ("(99)").
    rating: 4.5,
    reviewCount: 99,
    // Task 7 fix (PDP review): the Small/Medium/Large size pills on node
    // 719:6542 are NOT template leftover — the kit's own "Finding Your Size"
    // accordion panel says "Please select your size according to the toe
    // spacer sizing chart above" and shows the same S/M/L toe-spacer sizing
    // table (the kit bundles toe spacers, so it inherits their sizing).
    // Reuses the identical `sizeChart` object Toe Spacers carries above
    // (same corrected "13 OR LARGER" row) since it's the same physical
    // spacers being sized.
    variants: { label: 'Size', options: ['Small', 'Medium', 'Large'] },
    sizeChart: {
      columns: ['Size', 'Women', 'Men', 'EU Size', 'UK Size'],
      rows: [
        ['Small', '6.5-9', '6-7', '37-40', '4.5-7'],
        ['Medium', '9.5-12.5', '7.5-11', '41-44', '7.5-10.5'],
        ['Large', '13 OR LARGER', '11.5 OR LARGER', '45 OR LARGER', '11 OR LARGER'],
      ],
    },
    pdp: {
      // Task 1 (Course PDP Chunk A): drives the data-driven Pdp.astro
      // composer — same order/guards as every other product (see Toe
      // Spacers' `sections` comment above).
      sections: ['product-details', 'four-column', 'brand-section', 'cross-sell', 'pdp-reviews', 'logo-wall'],
      // Figma-verbatim from node 719:6542 (desktop) / 1017:9522 (mobile),
      // both frames matched. Figma's two lead paragraphs are merged into
      // one `description` string (ProductDetails.astro renders a single
      // description paragraph); the shipping line becomes `notes` — same
      // order Figma shows, just reshaped to fit the existing two-field
      // copy block instead of changing that component's contract.
      priceExact: '$85.00 USD',
      description:
        "Curated by Dr. Courtney Conley and Dr. Jen Perez to support your foot health journey. This convenient kit includes tools to help improve the mobility and strength of your feet. It's time to build a healthy body from the ground up. Our Foot Health Kit is the perfect partner to our 12-week online Fit Feet program, but you can also use it as a standalone to support your foot and lower body function. This kit is intentionally designed by clinicians to ensure you have everything you need to relieve discomfort and to build strong and mobile feet.",
      notes: ['*Shipping available to United States, Canada, and United Kingdom'],
      gallery: [
        '/images/plp/foot-health-kit.jpg',
        '/images/plp/foot-health-kit.jpg',
        '/images/plp/foot-health-kit.jpg',
        '/images/plp/foot-health-kit.jpg',
        '/images/plp/foot-health-kit.jpg',
      ],
      crossSell: {
        heading: 'More Resources for Your Movement Journey',
        itemIds: ['toe-spacers', 'combating-bunions', 'fit-feet'],
        shopAllHref: '/collections/all',
      },
      featuresHeading: 'Foot Health Kit Features',
      features: [
        { image: '/images/plp/foot-health-kit.jpg', label: null, text: 'Simple tools to help improve the mobility and strength of your feet' },
        { image: '/images/plp/foot-health-kit.jpg', label: null, text: 'Video instructions taught by clinicians specializing in foot health' },
        { image: '/images/plp/foot-health-kit.jpg', label: null, text: 'Convenient travel-friendly bag to take your kit on the go' },
        { image: '/images/plp/foot-health-kit.jpg', label: null, text: 'Tools for all foot types' },
      ],
      // Task 7 (data-driven accordion, see PdpAccordion.astro): 3 rows,
      // Figma-verbatim from `719:6544;309:842` / `1088:15396` — same 3 rows
      // on both breakpoints.
      //
      // Task 7 fix (PDP review): "Finding Your Size" is now `type:
      // 'sizechart'` (was plain `content` text + a generic photo, no table)
      // — its Figma copy literally says "Please select your size according
      // to the toe spacer sizing chart above" and shows the S/M/L table, so
      // rendering a table-less row contradicted its own text. `type:
      // 'sizechart'` reuses the exact same size-chart block Toe Spacers'
      // "Size" row renders (helper copy + table, from `sizeChart` above,
      // same component-owned pattern — see PdpAccordion.astro), which now
      // actually shows the table the copy references instead of a generic
      // product photo.
      accordion: [
        {
          label: "What's Included",
          content: `
            <ul>
              <li>Everything you need to improve function from the ground up</li>
              <li>Toe spacers (toe spreaders / toe separators) to promote alignment and balance</li>
              <li>Medium size mobility ball for targeted massage</li>
              <li>Patented toe strengthening bands in three different resistances</li>
              <li>Medium strength resistance band to strengthen the whole kinetic chain</li>
              <li>Convenient Travel Bag to take your kit on the go</li>
            </ul>
          `,
        },
        { label: 'Finding Your Size', type: 'sizechart' },
        {
          label: 'How To Use Your Kit',
          content: `
            <div class="pdp-accordion__videos">
              <div class="pdp-accordion__video"><iframe src="https://www.youtube.com/embed/0GtYglrJqlU?si=jW_PXwWeMS9z58iV" title="YouTube video player" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
              <div class="pdp-accordion__video"><iframe src="https://www.youtube.com/embed/2h7Cmz9-vVQ?si=hgtOH0Ngc1StA6ac" title="YouTube video player" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
              <div class="pdp-accordion__video"><iframe src="https://www.youtube.com/embed/bAJyl0WT5VU?si=kvfHRXhNTNLCmrlr" title="YouTube video player" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
              <div class="pdp-accordion__video"><iframe src="https://www.youtube.com/embed/0GtYglrJqlU?si=dt3H_hSCR-RYoo-W" title="YouTube video player" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
              <div class="pdp-accordion__video"><iframe src="https://www.youtube.com/embed/2h7Cmz9-vVQ?si=nOMOoYimuprSeDSv" title="YouTube video player" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
            </div>
          `,
        },
      ],
      // Same static placeholder reviews-app screenshot as Toe Spacers'
      // node 706:7675 — every product frame reuses this identical flattened
      // image (rating/count/distribution are Figma-verbatim, just not
      // product-specific; see PdpReviews.astro's note).
      reviews: {
        rating: 4.75,
        count: 12,
        distribution: [
          { stars: 5, count: 11 },
          { stars: 4, count: 0 },
          { stars: 3, count: 0 },
          { stars: 2, count: 1 },
          { stars: 1, count: 0 },
        ],
      },
    },
  },
  {
    id: 'cork-supplement',
    handle: 'cork-supplement',
    title: 'Cork Supplement',
    kind: 'product',
    badges: ['Product'],
    price: '$8.50 USD',
    priceRange: null,
    description: 'Pre-cut cork inserts designed to add more space or stiffness to your Gait Happens Toe Spacers.',
    image: '/images/plp/cork-supplement.jpg',
    href: '/products/cork-supplement',
    cta: 'View Product',
    rating: 4.5,
    reviewCount: 28,
    variants: null,
    sizeChart: null,
    pdp: {
      // Task 1 (Course PDP Chunk A): drives the data-driven Pdp.astro
      // composer — same order/guards as every other product (see Toe
      // Spacers' `sections` comment above).
      sections: ['product-details', 'four-column', 'brand-section', 'cross-sell', 'pdp-reviews', 'logo-wall'],
      // Figma-verbatim from node 721:7029 (desktop) / 1017:9529 (mobile).
      priceExact: '$8.50 USD',
      // Figma's lead paragraph contains an inline "Click here" hyperlink to
      // the European distributor; ProductDetails.astro's copy block renders
      // plain text only (no inline markup), so it's kept as plain text here
      // — the SAME sentence gets a real `<a>` in the accordion row below,
      // whose `content` supports raw HTML.
      description:
        'Shipping to Europe? We currently only process orders for the UK. Click here to shop with our European distributor. US/CA orders are unaffected.',
      notes: [
        'Pre-cut cork inserts designed to add more space or stiffness to your Gait Happens Toe Spacers.',
        'By adding cork to the spaces between your 1st and 2nd or 4th and 5th toes we are able to provide more separation of the toes. This can be helpful if the spacers have a tendency to slide more or if you are looking for more spread out of your spacers.',
        '*Please note the cork supplement is sized to fit in the Large Toe Spacers. To use them for Small or Medium Toe Spacers simply trim the cork to fit in the appropriate space as demonstrated in the video by Dr. Conley.',
        '*Shipping available to United States, Canada, and United Kingdom',
      ],
      gallery: [
        '/images/plp/cork-supplement.jpg',
        '/images/plp/cork-supplement.jpg',
        '/images/plp/cork-supplement.jpg',
        '/images/plp/cork-supplement.jpg',
        '/images/plp/cork-supplement.jpg',
      ],
      crossSell: {
        heading: 'More Resources for Your Movement Journey',
        itemIds: ['toe-spacers', 'combating-bunions', 'fit-feet'],
        shopAllHref: '/collections/all',
      },
      featuresHeading: 'Cork Supplement Features',
      // Only 2 cards in this frame (not 4) — FourColumn.astro's row is a
      // flexible `flex: 1 1 0` row, so a shorter `columns` array just
      // renders 2 stretched cards instead of 4, no component change needed.
      features: [
        { image: '/images/plp/cork-supplement.jpg', label: null, text: 'Great for those with bunions or tailors bunions' },
        { image: '/images/plp/cork-supplement.jpg', label: null, text: 'Add stiffness to your spacers to keep them in place while walking' },
      ],
      // Task 7 fix (PDP review): restores the "Shipping to Europe?"
      // accordion row Cork Supplement's desktop frame (node `721:7029`)
      // shows — Figma-verbatim label + body copy, both read directly off
      // that "Question" panel. The panel's inline "Click here" is a real
      // `<a href="https://www.meijers.com/en_GB/shop/brands/gait-happens-58">`
      // in Figma; `description` above renders as plain text only (no inline
      // markup in ProductDetails.astro's copy block), so that hyperlink was
      // being lost entirely. This `content` string carries the real `<a>` —
      // same `content` + `set:html` pattern every other product's accordion
      // rows already use (static catalog data, XSS-safe).
      //
      // Cork Supplement's mobile frame (`1017:9529`) has no accordion — it
      // folds the same copy into the body text instead (see `description`
      // above) — but PdpAccordion.astro has no per-breakpoint presence
      // toggle, and rendering this FAQ (with its now-real link) at both
      // widths is strictly better than losing the link altogether, so this
      // row renders on mobile too.
      accordion: [
        {
          label: 'Shipping to Europe?',
          content:
            '<p>Shipping to Europe? We currently only process orders for the UK. <a href="https://www.meijers.com/en_GB/shop/brands/gait-happens-58" target="_blank" rel="noopener">Click here</a> to shop with our European distributor. US/CA orders are unaffected.</p>',
        },
      ],
      reviews: {
        rating: 4.75,
        count: 12,
        distribution: [
          { stars: 5, count: 11 },
          { stars: 4, count: 0 },
          { stars: 3, count: 0 },
          { stars: 2, count: 1 },
          { stars: 1, count: 0 },
        ],
      },
    },
  },
  {
    id: 'toe-strengtheners',
    handle: 'toe-strengtheners',
    title: 'Toe Strengtheners',
    kind: 'product',
    badges: ['Product'],
    price: '$26.25 USD',
    priceRange: null,
    description: 'Patented resistance bands designed by Dr. Courtney Conley to rebuild strength in the four layers of muscles in your feet.',
    image: '/images/plp/toe-strengtheners.jpg',
    href: '/products/toe-strengtheners',
    cta: 'View Product',
    rating: 4.5,
    reviewCount: 37,
    // Task 7: fixes a pre-existing placeholder bug — this item previously
    // carried `variants: { label: 'Size', options: [...] }`, but Figma
    // (721:7222 / 1017:9536) never references a size choice anywhere in the
    // copy or accordion (the "Size" pills shown are the same copy-pasted
    // Toe Spacers boilerplate every other product frame shows). No real
    // variant exists, so this is now `null` like the rest.
    variants: null,
    sizeChart: null,
    pdp: {
      // Task 1 (Course PDP Chunk A): drives the data-driven Pdp.astro
      // composer — same order/guards as every other product (see Toe
      // Spacers' `sections` comment above).
      sections: ['product-details', 'four-column', 'brand-section', 'cross-sell', 'pdp-reviews', 'logo-wall'],
      // Figma-verbatim sale pricing from node 721:7222 (desktop) /
      // 1017:9536 (mobile) — rendered via ProductDetails.astro's Task 7
      // `compareAtPrice` addition (red sale price + strikethrough original).
      priceExact: '$26.25 USD',
      compareAtPrice: '$35 USD',
      description:
        'These patented bands were specifically designed by Dr. Courtney Conley to help strengthen the four layers of muscles in your feet. Strong feet are associated with:',
      bullets: ['increased balance', 'improved athletic performance', 'decreased risk of falls', 'increased comfort'],
      notes: [
        'These bands are multifunctional and can be used in a variety of ways to target the four layers of intrinsic foot muscles.',
        '*Shipping available to United States, Canada, and United Kingdom',
      ],
      gallery: [
        '/images/plp/toe-strengtheners.jpg',
        '/images/plp/toe-strengtheners.jpg',
        '/images/plp/toe-strengtheners.jpg',
        '/images/plp/toe-strengtheners.jpg',
        '/images/plp/toe-strengtheners.jpg',
      ],
      crossSell: {
        heading: 'More Resources for Your Movement Journey',
        itemIds: ['toe-spacers', 'combating-bunions', 'fit-feet'],
        shopAllHref: '/collections/all',
      },
      featuresHeading: 'Toe Strengtheners Features',
      features: [
        { image: '/images/plp/toe-strengtheners.jpg', label: null, text: 'Patented design by Dr. Courtney Conley, renowned foot health expert' },
        { image: '/images/plp/toe-strengtheners.jpg', label: null, text: 'Resistance bands with three levels of resistance' },
        { image: '/images/plp/toe-strengtheners.jpg', label: null, text: 'Multifunctional to strengthen the four layers of muscles in our feet' },
      ],
      // Figma-verbatim from node `721:7224;309:842` / `1088:15431` — same 2
      // rows on both breakpoints.
      accordion: [
        {
          label: "What's Included",
          content: '<p>Each order comes with one set of three strengtheners (easy, medium, difficult), and instructional videos to get started.</p>',
        },
        {
          label: 'How To Use Them',
          content: `
            <div class="pdp-accordion__videos">
              <div class="pdp-accordion__video"><iframe src="https://www.youtube.com/embed/0GtYglrJqlU?si=C2Pbfmy6lxFPNMlB" title="YouTube video player" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
            </div>
          `,
        },
      ],
      reviews: {
        rating: 4.75,
        count: 12,
        distribution: [
          { stars: 5, count: 11 },
          { stars: 4, count: 0 },
          { stars: 3, count: 0 },
          { stars: 2, count: 1 },
          { stars: 1, count: 0 },
        ],
      },
    },
  },
  {
    id: 'toe-dynamometer',
    handle: 'toe-dynamometer',
    title: 'Toe Dynamometer',
    kind: 'product',
    badges: ['Product'],
    price: '$75 USD',
    priceRange: null,
    description: 'A clinical-grade tool that precisely quantifies toe strength so you and your clients can track measurable progress.',
    image: '/images/plp/toe-dynamometer.jpg',
    href: '/products/toe-dynamometer',
    cta: 'View Product',
    rating: 4.5,
    reviewCount: 7,
    variants: null,
    sizeChart: null,
    pdp: {
      // Task 1 (Course PDP Chunk A): drives the data-driven Pdp.astro
      // composer — same order/guards as every other product (see Toe
      // Spacers' `sections` comment above).
      sections: ['product-details', 'four-column', 'brand-section', 'cross-sell', 'pdp-reviews', 'logo-wall'],
      // Figma-verbatim from node 721:8349 (desktop) / 1017:9543 (mobile).
      // Task 7 fix (PDP review): Figma's CTA for this product reads "Notify
      // When Available" at 30% opacity (i.e. out of stock) rather than "Add
      // to Cart" — ProductDetails.astro's button label is now data-driven
      // off `ctaLabel` (defaults to "Add to Cart" for every other product),
      // so this sets the Figma-verbatim label without needing a new
      // disabled/out-of-stock CTA state. The button stays wired to the same
      // functional Add to Cart handler underneath (reference build — keep
      // it simple + honest, and every product's "Add to Cart works" per the
      // task's verification step); only the visible label changes.
      ctaLabel: 'Notify When Available',
      priceExact: '$75.00 USD',
      description:
        "By placing the plastic card beneath the patient's toes and removing it slowly, the ToePro Strength dynamometer allows you to precisely quantify toe strength. Toe strength deficits have been proven to correlate with chronic plantar fasciitis, falls in the elderly, and impaired athletic performance.",
      bullets: [
        'These tests can be performed in seconds and repeated upon re-examinations to monitor strength gains.',
        'The objective strength scores for the toes muscles provide the doctor and the patient clear proof of the need to perform exercises. The strength scores provide measurable guidelines for return to sport and/or restoration of activity.',
      ],
      gallery: [
        '/images/plp/toe-dynamometer.jpg',
        '/images/plp/toe-dynamometer.jpg',
        '/images/plp/toe-dynamometer.jpg',
        '/images/plp/toe-dynamometer.jpg',
        '/images/plp/toe-dynamometer.jpg',
      ],
      crossSell: {
        heading: 'More Resources for Your Movement Journey',
        itemIds: ['toe-spacers', 'combating-bunions', 'fit-feet'],
        shopAllHref: '/collections/all',
      },
      featuresHeading: 'More About the Toe Dynamometer',
      features: [
        { image: '/images/plp/toe-dynamometer.jpg', label: null, text: 'Precisely quantify toe strength for big toe and lesser toes' },
        { image: '/images/plp/toe-dynamometer.jpg', label: null, text: "Show your clients quantitative progress by remeasuring their strength throughout their programming" },
      ],
      // Figma-verbatim from node `721:8351;309:842` / `1088:15486` — same 3
      // rows on both breakpoints. Each row's body is literally a bare
      // resource URL in Figma (a PDF/MP4 link, not embed-code); linked for
      // real (visible text stays the literal URL) rather than left as
      // inert text, matching Task 3's "reference build — keep it simple and
      // honest" precedent for the Instructions video embeds.
      accordion: [
        {
          label: 'Instructions',
          content:
            '<p><a href="https://cdn.shopify.com/s/files/1/2565/7146/files/InstructionsforUsingDynamometer.pdf?v=1649269731" target="_blank" rel="noopener">https://cdn.shopify.com/s/files/1/2565/7146/files/InstructionsforUsingDynamometer.pdf?v=1649269731</a></p>',
        },
        {
          label: 'Details',
          content:
            '<p><a href="https://cdn.shopify.com/s/files/1/2565/7146/files/ToeStrengthTester_April2018.pdf?6046141564691974552" target="_blank" rel="noopener">https://cdn.shopify.com/s/files/1/2565/7146/files/ToeStrengthTester_April2018.pdf?6046141564691974552</a></p>',
        },
        {
          label: 'Evaluate Toe Strength',
          content:
            '<p><a href="https://cdn.shopify.com/s/files/1/2565/7146/files/New_Dyn_set_up_instructions.mp4?v=1648063425" target="_blank" rel="noopener">https://cdn.shopify.com/s/files/1/2565/7146/files/New_Dyn_set_up_instructions.mp4?v=1648063425</a></p>',
        },
      ],
      reviews: {
        rating: 4.75,
        count: 12,
        distribution: [
          { stars: 5, count: 11 },
          { stars: 4, count: 0 },
          { stars: 3, count: 0 },
          { stars: 2, count: 1 },
          { stars: 1, count: 0 },
        ],
      },
    },
  },
  {
    // Task 7: NEW catalog item — Mobility Ball didn't exist in `items` or
    // `sitemap.js` before this task (unlike the other 4 rolled-out
    // products, which already had skeletal placeholder entries). Added in
    // full here from its own PDP frame (721:8729 desktop / 1017:9550
    // mobile — the latter is mislabeled "Toe Dynamometer Mobile" in the
    // Figma file itself; confirmed by content, its title/copy/features are
    // all Mobility Ball's, not the Toe Dynamometer's).
    id: 'mobility-ball',
    handle: 'mobility-ball',
    title: 'Mobility Ball',
    kind: 'product',
    badges: ['Product'],
    price: '$15 USD',
    priceRange: null,
    description: 'A firm, compact ball designed by clinicians to gently stimulate the foot, ankle, and calf and help restore natural movement.',
    // No dedicated product photo exists yet for this product (every other
    // rolled-out product reuses an existing /images/plp/<handle>.jpg PLP
    // shot; this one has none) — falls back to a flat placeholder rectangle
    // matching Figma's own unphotographed gray-box treatment of every PDP
    // gallery slot in this file (including the ones with real photos).
    image: '/images/plp/placeholder.svg',
    href: '/products/mobility-ball',
    cta: 'View Product',
    rating: 4.5,
    reviewCount: 12,
    variants: null,
    sizeChart: null,
    pdp: {
      // Task 1 (Course PDP Chunk A): drives the data-driven Pdp.astro
      // composer — same order/guards as every other product (see Toe
      // Spacers' `sections` comment above). No `accordion` here (see the
      // note below `features`), same as pre-refactor.
      sections: ['product-details', 'four-column', 'brand-section', 'cross-sell', 'pdp-reviews', 'logo-wall'],
      priceExact: '$15.00 USD',
      compareAtPrice: '$20.00 USD',
      description:
        'Wake your feet up from the ground up! The Gait Happens Mobility Ball is designed by clinicians to gently stimulate the foot, ankle, and calf, helping restore natural movement and improve mobility where it matters most. By popular demand, our mobility ball is now available for individual sale or in the Gait Happens Foot Health Kit!',
      bullets: [
        'Use under the foot or around the lower leg to support better ankle mobility and functional movement for walking, training, and daily life.',
        'Stimulates thousands of nerves in your feet & can increases circulation.',
        'Perfect size for targeted pressure (2.3 inch diameter) under the foot to help relieve built-up tension.',
        'Compact and firm enough for effective soft tissue work without being overly aggressive.',
        'Easy to use at home, in the gym, or on the go.',
        'Complements strength & rehab exercises such as adding it between your heels for calf raises to enhance results.',
      ],
      gallery: [
        '/images/plp/placeholder.svg',
        '/images/plp/placeholder.svg',
        '/images/plp/placeholder.svg',
        '/images/plp/placeholder.svg',
        '/images/plp/placeholder.svg',
      ],
      crossSell: {
        heading: 'More Resources for Your Movement Journey',
        itemIds: ['toe-spacers', 'combating-bunions', 'fit-feet'],
        shopAllHref: '/collections/all',
      },
      featuresHeading: 'Mobility Ball Features',
      features: [
        { image: '/images/plp/placeholder.svg', label: null, text: 'Help soothe stiff and sore feet' },
        { image: '/images/plp/placeholder.svg', label: null, text: 'Clinician recommended' },
        { image: '/images/plp/placeholder.svg', label: null, text: 'Stimulate thousands of nerves in the soles of your feet' },
        { image: '/images/plp/placeholder.svg', label: null, text: 'Pair with your favorite exercises' },
      ],
      // No `accordion` key — Mobility Ball's desktop frame (721:8729) has
      // an empty, childless accordion placeholder div (node
      // `I721:8731;309:842`, fixed 192px tall, zero "Question" panels) and
      // the mobile frame skips straight from the buy box to 4 Column —
      // confirmed no accordion on either breakpoint.
      reviews: {
        rating: 4.75,
        count: 12,
        distribution: [
          { stars: 5, count: 11 },
          { stars: 4, count: 0 },
          { stars: 3, count: 0 },
          { stars: 2, count: 1 },
          { stars: 1, count: 0 },
        ],
      },
    },
  },
  {
    id: 'walk',
    handle: 'walk',
    title: 'WALK',
    kind: 'product',
    badges: ['Product'],
    // Chunk B1 Task 5 — was a `(sample)` guess ($24) before this task; now
    // Figma-verified ($30.00 USD, node 721:7419 desktop / 1017:9559 mobile,
    // both frames agree) and kept in sync with `pdp.priceExact` below, same
    // pattern every other product's top-level `price` follows. This field
    // (not `pdp.priceExact`) is also what ProductDetails.astro's Add-to-Cart
    // handler puts on the cart line (`item.price ?? item.priceRange`), so
    // leaving it at the old $24 guess would have put the WRONG price in the
    // cart/drawer/subtotal despite the PDP itself showing $30.
    price: '$30 USD',
    priceRange: null,
    // Review-fix wave: was a `(sample)` guess (a nice-sounding but invented
    // sentence, never in Figma) before this fix — the other 3 top-level
    // sample fields (price/rating/reviewCount) were Figma-verified by Task 5
    // but this one was missed. Real Figma copy DOES exist for it: the
    // Products PLP grid (section 764:10786, file FX7PDNvhZwyozODaq8Q8i7),
    // Walk's own "PLP Card" instance (node 867:9364), carries a real,
    // legible (non-lorem-ipsum) blurb — confirmed via `get_design_context`
    // on 867:9354 (the full grid, all 7 product cards pulled in one call to
    // positively identify which card is Walk's by its own title/price/
    // rating text, not by node-id proximity guessing). This is a near-match
    // to `pdp.description` below (the PDP hero's own paragraph) but not
    // identical — the PLP card drops ", longevity," — reproduced Figma-
    // verbatim, not deduplicated against the hero copy. This is what
    // PlpCard.astro renders as the PLP grid blurb AND what BaseLayout uses
    // as this page's `<meta name="description">` (the same top-level field
    // every other item's PLP-card blurb doubles as).
    description:
      'Discover the new rules of walking to increase your health and overall wellbeing--from two go-to experts.',
    image: '/images/plp/walk.jpg',
    href: '/products/walk',
    cta: 'View Product',
    // Figma PDP hero (721:7419 / 1017:9559): 5-star rating, "(12)" reviews —
    // this item had no top-level rating/reviewCount at all before this task
    // (StarRating would have rendered 0 stars / "(0)" without these).
    rating: 5,
    reviewCount: 12,
    // Confirmed via both breakpoints' Figma hero (see `pdp.heroTitle`
    // comment below): no size/variant pills and no size-chart accordion row
    // on the CANONICAL desktop frame — Walk is a single-format hardcover
    // book, not a sized product like Toe Spacers. (Mobile's OWN hero,
    // 1017:9559, shows a "Size" label + Small/Medium/Large pills — see the
    // CLIENT-CONTENT FLAG on `pdp.heroTitle` below for why that's treated as
    // a template artifact, not real data, and not reproduced here.)
    variants: null,
    sizeChart: null,
    // Chunk B1 Task 5 — Walk product PDP. Figma desktop frame 721:7417
    // ("Walk", file FX7PDNvhZwyozODaq8Q8i7, in the Product PDP section
    // 705:5988) / mobile "Walk Mobile" frame 1017:9557 (under the Product
    // PDP's Mobile 390px section 1017:9514).
    //
    // ---- Section list — CORRECTS the task brief's own claim -----------
    // The brief handed to this task states Walk's section list has "NO
    // four-column and NO logo-wall". `four-column` is confirmed absent (no
    // "4 Column" instance anywhere in either the desktop or mobile frame).
    // `logo-wall` is NOT absent: `get_metadata` on 721:7417 (and its parent
    // section 705:5988, cross-checked against all 6 other product frames)
    // shows a real "Logo Wall" instance (1154:16663) as the frame's LAST
    // child, positioned with the exact same off-canvas x/width
    // (x:-534.2452392578125, width:2268.490478515625) every other product's
    // own Logo Wall instance carries — not a stray leftover. A full-frame
    // screenshot of 721:7417 confirms it renders, visually, as the same "As
    // Seen In" press-logo strip every other product/course PDP ends on
    // (Frame 4293 — the reviews placeholder — sits directly above it, also
    // present and Figma-verbatim-identical to every other product's own
    // "4.75 out of 5 / Based on 12 reviews / 11-0-0-1-0" reviews screenshot).
    // `logo-wall` is therefore INCLUDED below, reproducing the real desktop
    // frame rather than the brief's written claim — flagged here (and in
    // the task report) precisely because it contradicts an explicit written
    // instruction; LogoWall.astro takes no per-item data (`props: () =>
    // ({ logos: pressLogos })`, the same site-wide press-logo array every
    // page reuses), so including it carries no content-authoring risk.
    //
    // One real desktop/mobile section-PRESENCE divergence exists here (not
    // just content): Walk's own "Walk Mobile" frame (1017:9557) has NO Logo
    // Wall instance at all in its child list — unlike every other product's
    // OWN mobile frame, which does carry one (e.g. Toe Spacers Mobile's
    // 1017:9521). `brand-section` is ALSO absent from the mobile frame, but
    // that's already expected/by-design (BrandSection.astro is desktop-only
    // per its own `@media (max-width: 1023px) { display: none }`, no
    // composer-level guard needed — see Pdp.astro's registry comment).
    // Logo Wall has no such built-in mobile hide, so if this is a genuine
    // per-page Figma decision (not an oversight) rather than the brief's
    // claim, Walk's real mobile page will show a Logo Wall band the mobile
    // FRAME itself never designed. Kept in per this file's own established
    // "desktop canonical" convention (LogoWall renders on every breakpoint
    // for every other product), but flagged here as a genuine, confirmed
    // section-presence divergence, not a content-wording one.
    //
    // Every other entry below matches the brief's given order exactly
    // (product-details -> testimonial -> brand-section -> cross-sell ->
    // your-instructors -> pdp-reviews), confirmed against the real desktop
    // frame's own child order.
    pdp: {
      sections: [
        'product-details',
        'testimonial',
        'brand-section',
        'cross-sell',
        'your-instructors',
        'pdp-reviews',
        'logo-wall',
      ],
      // ---- Product Details hero -------------------------------------------
      // Figma-verbatim from node 721:7419 (desktop) / 1017:9559 (mobile).
      //
      // `heroTitle` overrides this item's short catalog `title` ("WALK",
      // used site-wide for nav/breadcrumbs/PLP cards/cross-sell tiles/the
      // <title> tag) for just the PDP's own <h1> — the SAME
      // `item.pdp?.heroTitle ?? item.title` fallback CourseDetails.astro
      // already carries for its own courses (see that component's header
      // comment), now also added to ProductDetails.astro since Walk is the
      // first PRODUCT whose real Figma H1 isn't identical to its short
      // catalog title. The em dash here is Figma's own literal character
      // (U+2015 HORIZONTAL BAR, "―", not a standard em dash) — preserved
      // verbatim rather than normalized. Figma's own H1 renders "Walk" in
      // italics as a run within the larger heading (SemiBold Italic vs.
      // plain SemiBold for the rest) — ProductDetails.astro's `<h1>` is a
      // single plain-text interpolation with no rich-run support (and none
      // of the 6 already-shipped products ever needed one), so that one
      // typographic nuance is not reproduced; flagged here rather than
      // silently dropped.
      heroTitle:
        'Walk: Rediscover the Most Natural Way to Boost Your Health and Longevity―One Step at a Time (Hardcover)',
      priceExact: '$30.00 USD',
      description:
        'Discover the new rules of walking to increase your health, longevity, and overall wellbeing--from two go-to experts.',
      // No `bullets` — Figma's hero copy block is this one paragraph only
      // (no bullet list under it, unlike Toe Spacers/Foot Health Kit).
      //
      // Gallery — Figma's own gallery is 5 flat gray placeholder blocks (1
      // main + 4 thumbnails, no real photography), same "reuse the one PLP
      // shot" placeholder convention every other product's `gallery` takes.
      gallery: [
        '/images/plp/walk.jpg',
        '/images/plp/walk.jpg',
        '/images/plp/walk.jpg',
        '/images/plp/walk.jpg',
        '/images/plp/walk.jpg',
      ],
      // ---- CLIENT-CONTENT FLAG (mobile hero, 1017:9559) -------------------
      // Mobile's OWN Product Details frame shows a "SIZE" label + a real
      // Small (selected) / Medium / Large pill row between the intro
      // paragraph and the Quantity/Add to Cart controls — byte-for-byte the
      // same size-pill pattern the toe-spacer-family products use. This is
      // NOT reproduced as `variants` above: the CANONICAL desktop frame
      // (721:7419) has no such section at all, and this SAME item's own
      // "Details" accordion row (both breakpoints, identical) lists "Format:
      // Hardcover" as a single fixed fact with no size dimension anywhere —
      // a book has no S/M/L. Treated as a mobile-only template artifact (the
      // mobile frame was very likely built by duplicating a toe-spacer
      // product's mobile frame and swapping copy, the same origin the
      // branch's other mobile-only artifacts have had), not real product
      // data — desktop kept canonical per this task's brief.
      //
      // ---- Accordion (Task 3/7 shape: array of { label, content }) --------
      // Figma-verbatim from node I721:7419;309:842 (desktop) / 1088:15456
      // (mobile) — both rows agree word-for-word on both breakpoints (no
      // divergence here, unlike the hero above). Neither row is a
      // `type: 'sizechart'` row (Walk has no size chart — see `sizeChart:
      // null` above); both are plain `content` HTML, same as Toe Spacers'
      // own Instructions/Research rows.
      accordion: [
        {
          label: 'Did You Know...',
          content: `
            <ul>
              <li>Your risk of falls and overall longevity can be measured by your foot health</li>
              <li>Your walking speed can predict your overall health status and risk of early death</li>
              <li>Increasing your walking cadence has been shown to help reduce knee, hip, and lower back pain</li>
              <li>The number of daily optimal steps is not 10,000 (spoiler alert: it's fewer!)</li>
            </ul>
            <p>What James Nestor did for breathing, Christopher McDougall and Mark Cucuzzella did for running, and Kelly and Juliet Starrett have done for mobility, founder of Gait Happens Dr. Courtney Conley and Dr. Milica McDowell do for walking. Walking is as important to our health and longevity as sleep and proper breathing; it is the 6th vital sign. And yet we've almost engineered it out of our lives. Walk is an expert-driven, science-backed guide that not only underscores the power of movement to just about every aspect of our life, it restores walking to its rightful spot as one of the key pillars of health.</p>
            <p>With the most up-to-date research, self-assessments, tips on choosing the best shoes for foot health, as well as easy movement snacks to help with low back pain and foot pain, and customizable programs to develop or enhance your own fitness, <em>Walk</em> is the definitive guide to optimizing wellness.</p>
          `,
        },
        {
          label: 'Details',
          content: `
            <ul>
              <li>Authors: Courtney Conley DC, Milica McDowell MS DPT</li>
              <li>Format: Hardcover</li>
              <li>Price: $30</li>
              <li>Available in: US and Canada only</li>
              <li>Language: English</li>
              <li>Ships: May 5th, 2026</li>
            </ul>
          `,
        },
      ],
      // ---- Testimonial (array shape — see tests/testimonial.test.mjs) -----
      // Figma-verbatim from node 721:7840 (desktop) / 1017:9560 (mobile) —
      // identical quote/author/role/rating on both frames, no divergence.
      // Only one testimonial in the data, so Testimonial.astro's carousel
      // renders its prev/next arrows as inert decoration (same as Sole
      // Switch Pro's single Phyllis testimonial) — real paging only turns on
      // once an item carries more than one. A real external endorsement (the
      // Vivobarefoot CEO), not a Gait Happens clinician — no `role` beyond
      // his own title/company, carried verbatim.
      testimonial: [
        {
          quote: [
            'Modern health has forgotten something elemental: we are a bi-pedal walking species. This book restores walking to its rightful place not as exercise, but as a biological necessity. It reminds us that resilience, longevity, and agency begin at ground level, one step at a time.',
          ],
          author: 'Galahad Clark',
          role: 'CEO & Co-Founder, Vivobarefoot',
          rating: 5,
        },
      ],
      // ---- Your Instructors ------------------------------------------------
      // REVIEW FIX WAVE — the heading/credential/toggle component gaps
      // flagged by Task 5 (below, preserved for history) are now fixed.
      // Figma's own heading for this section, BOTH breakpoints (721:7907
      // desktop node I721:7907;173:318 / 1017:9594 mobile node
      // I1017:9594;183:393), reads "Meet the Authors" — not "Your
      // Instructors" (re-verified directly via `get_design_context` on
      // 721:7907 during the fix: the node's own pulled text is literally
      // "Meet the Authors", confirmed against a 2600px screenshot too).
      // YourInstructors.astro now reads `item.pdp.instructorsHeading`
      // (optional, defaults to "Your Instructors" — see that component's
      // header comment for the FourColumn `featuresHeading` precedent this
      // follows).
      instructorsHeading: 'Meet the Authors',
      //
      // Neither instructor card shows a distinct teal credential/location
      // line under the name on either breakpoint (unlike every course's own
      // instructor cards) — `credential: null` on both entries below is
      // Figma-accurate, not a missing-data gap. InstructorCard.astro now
      // guards `credential` the same optional-field way Testimonial.astro
      // guards `role` (fixed in this review wave — previously rendered one
      // small empty `<p></p>` per card, confirmed gone from the built HTML).
      //
      // Conley's bio: this item's own Figma card (both breakpoints) opens
      // with the EXACT same sentence Fit Feet's already-shipped Conley bio
      // opens with ("Dr. Courtney Conley is a national bestselling
      // author... Her book, Walk, hit both the USA Today and Amazon
      // best[seller lists]..." — Walk literally IS the book that fit-feet
      // bio references) — confirmed via `get_design_context` on the desktop
      // hero's own hardcover-book blurb too ("Walk is an expert-driven,
      // science-backed guide..."). Reused verbatim from fit-feet's own
      // catalog entry (same "same clinician, same bio, reused across pages"
      // precedent that entry's own comment already documents for
      // Conley/Perez across Fit Feet/Combating Bunions). Her bio is long
      // enough to genuinely overflow InstructorCard's 4-line clamp (live DOM
      // measurement during this fix: ~2740 characters, well past the
      // clamp — live DOM measurement during the Chunk B2 Task 1 fix), so her
      // Read More toggle is real and needed; the runtime overflow check in
      // YourInstructors.astro/InstructorCard.astro measures this directly,
      // no per-instructor data flag required.
      //
      // McDowell's bio: NEW instructor, never in this catalog before, and a
      // genuine tooling limitation blocked full extraction — `get_metadata`
      // /`get_design_context` on 721:7907 (and a forced full-page pull of
      // 721:7417) all returned this section's instructor-card children as a
      // literally EMPTY node (`<div ... />`, no text at all), even though
      // the section visibly renders 2 populated cards on canvas. A 2600px
      // `get_screenshot` of 721:7907 (re-pulled during this fix) DOES show
      // her card's legible text, but Figma's own card visually clamps the
      // bio behind a "Read More" toggle, and only the clamped preview is
      // legible in any screenshot — the full reveal text was never
      // retrievable by any tool available to this task. The paragraph below
      // is a best-effort verbatim transcription of ONLY the confirmed-
      // legible portion. Figma's own legible text reads (screenshot-
      // verified): "...a master's degree (Physical Therapy, University of
      // Colorado Health Sciences Cent…" — visibly truncated MID-WORD by
      // Figma's own clamp, not at a word boundary. The word is completed
      // here ("Center" — the only institution this can plausibly be:
      // "University of Colorado Health Sciences Center" is a real,
      // correctly-named institution; the prior version of this entry cut the
      // word short at "Health Sciences" and appended a fabricated closing
      // paren + period, which read as a complete sentence while actually
      // misnaming the institution — fixed here to name it correctly, with
      // no invented closing parenthesis: the parenthetical Figma opened
      // ("(Physical Therapy, ...") is left genuinely unclosed below, because
      // we do not know where — or whether — it closes in the untruncated
      // original. An ellipsis ("…") is appended instead, in place of the
      // fabricated ")." — this is a typographic truncation MARKER, not
      // invented biographical content: it's the same character Figma's own
      // clamped rendering already uses at this exact cut point (confirmed in
      // the re-pulled screenshot: "...Health Sciences Cent…"), so ending on
      // it here honestly signals "this sentence is cut off" instead of
      // presenting either a fabricated complete sentence (the prior bug) or
      // an unmarked, silently dangling open parenthesis (which would read as
      // a typo rather than a disclosed cut). No wording beyond the one
      // completed proper noun is invented or paraphrased. Separately,
      // Figma's own source text has a doubled open
      // parenthesis ("(Exercise Physiology and Health Promotion, (Montana
      // State University)") that reads as a typo in the design file itself;
      // this entry silently normalizes it to a single, correctly-paired
      // parenthetical below — a reasonable call, but flagged here (per this
      // review wave) as a disclosed deviation from strict verbatim, which
      // the prior version of this comment did not disclose.
      // THIS BIO IS NOT COMPLETE — NEEDS REAL CLIENT COPY before this ships
      // past a reference build. No per-instructor override field is needed
      // here (the earlier stopgap flag for this exact case was removed in
      // Chunk B2 Task 1): the text we have IS the entire preview Figma
      // itself shows before clamping, so it doesn't overflow InstructorCard's
      // 4-line clamp — the runtime measured overflow check in
      // YourInstructors.astro hides her "Read More" toggle on its own, the
      // same way it would for any other short bio (see InstructorCard.astro's
      // header comment for the full reasoning).
      instructors: [
        {
          photo: '/images/plp/walk.jpg',
          name: 'Dr. Courtney Conley',
          credential: null,
          bio: [
            "Dr. Courtney Conley is a national bestselling author, international educator, and one of the world's foremost authorities on foot and gait health. Her book, Walk, hit both the USA Today and Amazon bestseller lists, resonating with readers eager to understand the profound connection between foot function and whole-body health. The book's success has brought Dr. Conley to some of the most respected platforms in health and wellness media, including appearances on The Peter Attia Drive Podcast, Diary of a CEO, Feel Better, Live More with Dr. Rangan Chatterjee, as well as national television features on CBS Mornings and Fox & Friends.",
            "Dr. Conley holds a Doctorate in Chiropractic Medicine and two Bachelor's degrees in Kinesiology and Human Biology. With nearly 25 years of clinical practice, she has worked with professional athletes from organizations including the Phoenix Suns, New York Yankees, Cleveland Browns, New York Giants, and San Francisco 49ers. She has also collaborated with medical experts across the country, addressing complex foot and gait challenges at the highest level of performance. She currently serves as Head of Patient Care at Total Health Solutions and Total Health Performance in Lakewood, Colorado—premier clinics known for comprehensive, rehabilitation-focused patient care where she is committed to helping people improve their lives one step at a time.",
            'That same commitment led her to found and lead Gait Happens, an education enterprise leading a paradigm shift in foot health by empowering people worldwide to reclaim optimal foot function through science-backed training and protocols. Gait Happens offers a comprehensive ecosystem of resources — from professional education for practitioners to consumer training programs and personalized consultations with top-of-field specialists — all grounded in research and designed to deliver real, measurable results. With a focus on natural, preventative approaches to foot and gait health, Gait Happens has built a global community of individuals committed to moving better and living pain-free, offering a proven alternative to unnecessary surgical intervention through education and evidence-based care.',
            'An internationally recognized speaker, Dr. Conley shares her expertise to clinicians and consumers alike through in-person and online lectures on foot mechanics and gait dynamics. Her work spans authorship, mentorship, patent and curriculum development, and the creation of pioneering foot and gait methodologies. Yet at the heart of every lecture, protocol, and patient interaction is the same driving belief: real strength starts from the ground up, and healthy feet are the foundation every body needs to move through life with confidence and ease.',
          ],
        },
        {
          photo: '/images/plp/walk.jpg',
          name: 'Dr. Milica McDowell',
          credential: null,
          // Best-effort transcription of Figma's own clamped preview text —
          // see the comment above. NOT a complete bio — needs real client
          // copy.
          bio: [
            "Dr. Milica McDowell holds two Bachelor of Science degrees (Exercise Physiology and Health Promotion, Montana State University), a master's degree (Physical Therapy, University of Colorado Health Sciences Center…",
          ],
        },
      ],
      // ---- Cross-sell — `shop-products` variant (Chunk B1 Task 5) ---------
      // Figma-verbatim from the "Product Cards" instance, node 1046:10778
      // (desktop) / 1044:10698 (mobile) — see CrossSell.astro's own header
      // comment for the full "same component, extra description block, not
      // a new section type" reasoning behind `variant: 'shop-products'`.
      //
      // CLIENT-CONTENT FLAG (heading, desktop vs. mobile): desktop reads
      // "Shop Our Products"; mobile reads "Resources For Your Movement
      // Journey" (closer to the generic "More Resources For Your Movement
      // Journey" heading every other product/course crossSell already uses)
      // — a genuine desktop/mobile wording disagreement. Desktop kept
      // canonical per this file's established convention.
      //
      // CLIENT-CONTENT FLAG (per-card blurb, desktop vs. mobile — an
      // INVERTED case of the usual convention): desktop's own 3 cards repeat
      // the IDENTICAL placeholder paragraph verbatim ("This is a description
      // about learning about certain things about a product and whatever
      // the product does or how it works and all of that good stuff. It
      // could be pretty long and it could be kinda short, but best to see
      // how it looks if its really long.") — self-evidently Figma's own
      // lorem-ipsum-style component-default filler, not real per-product
      // copy, on all 3 cards. Mobile's 3 cards instead carry genuine,
      // DIFFERENT, real per-product copy (one of which — the Toe Spacers
      // card, about Dr. Conley's own use of the product — reads as
      // authentic marketing copy, not a placeholder). Per this task's
      // explicit instruction against shipping obvious internal-build/
      // placeholder text as customer-facing copy, `blurbs` below uses
      // MOBILE's real text for all 3 cards instead of the usual "desktop
      // canonical" rule — a deliberate, disclosed exception, not an
      // oversight (see task report for the full reasoning + both frames'
      // evidence). `kickers` ("From the book on X:") agreed word-for-word
      // between both breakpoints (including Figma's own inconsistent
      // "The"/"the"/no-article usage per card) — those ARE Figma-verbatim
      // and unaffected by the blurb exception above.
      crossSell: {
        variant: 'shop-products',
        heading: 'Shop Our Products',
        itemIds: ['foot-health-kit', 'fit-feet', 'toe-spacers'],
        kickers: [
          'From the book on The Foot Health Kit:',
          'From the book on the Fit Feet Course:',
          'From the book on Toe Spacers:',
        ],
        blurbs: [
          'When the toes can properly splay, our foot and ankle muscles engage, creating a stronger, more stable platform from which to propel ourselves forward.',
          'Foot muscles and the ability to splay your toes play an essential role in maintaining posture and balance. Compromising this critical function could lead to balance challenges or falls.',
          "Consistently wearing toe spacers has reshaped Dr. Conley's feet, strengthening them and reducing her foot pain. She walks and runs in them and using them is one of the best pieces of advice she currently offers her patients.",
        ],
        shopAllHref: '/collections/all',
      },
      // Reviews placeholder — same static reviews-app-screenshot values
      // every product/course PDP reuses (Figma-verified for Walk too, node
      // 875:10798: "4.75 out of 5 / Based on 12 reviews" / 11-0-0-1-0 — an
      // exact match, not just an assumed reuse).
      reviews: {
        rating: 4.75,
        count: 12,
        distribution: [
          { stars: 5, count: 11 },
          { stars: 4, count: 0 },
          { stars: 3, count: 0 },
          { stars: 2, count: 1 },
          { stars: 1, count: 0 },
        ],
      },
    },
  },

  // ---- Courses — Individuals -----------------------------------------

  {
    id: 'foot-fest',
    handle: 'foot-fest',
    title: 'Foot Fest',
    kind: 'course',
    badges: ['Course', 'Product'],
    price: null,
    priceRange: '$147–897 USD',
    description: 'Workshops to build healthier feet.',
    image: '/images/plp/foot-fest.jpg',
    href: '/courses/foot-fest',
    cta: 'View Course',
    variants: null,
    sizeChart: null,
  },
  {
    id: 'sole-switch',
    handle: 'sole-switch',
    title: 'Sole Switch',
    kind: 'course',
    badges: ['Course'],
    price: '$40 USD',
    priceRange: null,
    // Pre-existing top-level rating/reviewCount (not touched by this task —
    // Chunk B1 Task 2 brief flags these as "already" set). Figma's own
    // Course Details hero (998:14856 / 999:7197, both breakpoints) reads a
    // Figma-verbatim "(5)" review count next to its 5 stars, which disagrees
    // with this `15` — CourseDetails.astro sources both fields straight off
    // these top-level item fields (same as every product's hero), so the
    // rendered page will show "(15)" rather than Figma's "(5)". Flagged as a
    // client-content item, not corrected here: changing a pre-existing
    // top-level field is outside this task's `pdp`-block scope per the brief.
    rating: 5,
    reviewCount: 15,
    description: 'A one-hour online course to help you better understand how to choose the right shoes for YOU!',
    image: '/images/plp/sole-switch.jpg',
    href: '/courses/sole-switch',
    cta: 'View Course',
    variants: null,
    sizeChart: null,
    // Chunk B1 Task 2 — Sole Switch (Basic tier) course PDP. Figma desktop
    // frame 998:14854 ("Sole Switch Basic Page", file FX7PDNvhZwyozODaq8Q8i7)
    // / mobile "Sole Switch Basic Page Mobile" frame under section 999:7142.
    // Same 11-section order Sole Switch Pro already ships (see that item's
    // own `sections` comment above) — every type below already has a
    // Pdp.astro REGISTRY entry, so this assembles end to end with no new
    // components, matching this task's "data-only" brief.
    pdp: {
      sections: [
        'course-details',
        'course-overview',
        'four-column',
        'youll-stop-and-instead',
        'comparison-chart',
        'testimonial',
        'your-instructors',
        'cross-sell',
        'faqs',
        'pdp-reviews',
        'logo-wall',
      ],
      // Course Details hero — Figma-verbatim from node 998:14856 (desktop) /
      // 999:7197 (mobile), both frames matched (title/rating/price/intro/
      // pill labels/instructors byline are all identical between the two).
      //
      // `heroTitle` overrides the catalog's shorter `title` ("Sole Switch")
      // for just the hero <h1> — the frame reads "Sole Switch Course" — same
      // targeted-override pattern Sole Switch Pro's own `heroTitle` uses.
      heroTitle: 'Sole Switch Course',
      //
      // Both frames show a SALE price — "$40.00 USD" in red plus a
      // struck-through "$50 USD" original — not a single flat price.
      // `priceExact` carries the real current price (matches this item's
      // own top-level `price`); `compareAtPrice` is the Figma-verbatim
      // original, now rendered via CourseDetails.astro's `compareAtPrice`
      // field/render path (the component-generalization fix — see that
      // file's header comment; same OPTIONAL field/idiom ProductDetails.astro
      // already established for sale prices).
      priceExact: '$40.00 USD',
      compareAtPrice: '$50 USD',
      // Matches this item's own top-level `description` verbatim — Figma's
      // intro paragraph is identical on both breakpoints, no divergence to
      // flag here (unlike Sole Switch Pro's own hero intro).
      description:
        'A one-hour online course to help you better understand how to choose the right shoes for YOU!',
      // Primary CTA (enroll, external — see CourseDetails.astro's Sole
      // Switch Pro remap precedent: Figma's own buybox is a cart/quantity-
      // stepper "Add to Cart" flow, remapped to a Kajabi enrollment link
      // since this course is fulfilled on Kajabi, not the Shopify cart).
      // Realistic Kajabi placeholder URL; swap for the real offer/checkout
      // URL once the course is live on Kajabi.
      enrollHref: 'https://gaithappens.mykajabi.com/offers/sole-switch-course',
      enrollLabel: 'Enroll Now',
      // Pill group — Task 4 follow-up (Chunk B1's 9th-finding fix) migrated
      // this off the old single-purpose tier-pill field onto the
      // generalized `pills` shape CourseDetails.astro now renders (see that
      // file's header comment). Figma's OUTLINE pill on this page is "Sole
      // Switch Pro" (the filled/selected pill is "Sole Switch Basic" — this
      // page's own tier, dropped per CourseDetails.astro's established
      // convention: the tier already being viewed isn't repeated as a 3rd
      // CTA). Links to the Pro course's own page (already `built` — see
      // sitemap.js). `label` is this page's own real Figma caption
      // ("Select your course", node 998:14856); `options` is a
      // single-element array — same real link/label pair the old field
      // carried, just renamed and reshaped to a 1-item list.
      pills: {
        label: 'Select your course',
        options: [{ label: 'Sole Switch Pro', href: '/courses/sole-switch-pro' }],
      },
      //
      // Figma's branded card (right column) is a flattened screenshot, same
      // situation Sole Switch Pro's own `courseCard` comment describes — but
      // on THIS page it's genuinely different: (1) the card is YELLOW
      // (`--color-yellow`), not teal — `variant: 'yellow'` selects
      // CourseDetails.astro's `--yellow` modifier class (component-
      // generalization fix; unset defaults to the base teal card, see
      // Sole Switch Pro's own `courseCard` below); (2) there is NO "For X"
      // tag pill under the title — `tag` is simply omitted here, and
      // CourseDetails.astro now guards its render with the same optional-
      // field idiom the rest of this file uses, so no empty pill artifact
      // renders. `titleLines` is the frame's own 2-line break ("SOLESWITCH"
      // / "COURSE"), same array-of-lines shape Sole Switch Pro's card uses.
      courseCard: {
        titleLines: ['SoleSwitch', 'Course'],
        variant: 'yellow',
      },
      // Same byline text as Sole Switch Pro's page (same 2 instructors teach
      // both tiers) — Figma-verbatim, identical on both breakpoints.
      instructorsByline: 'Course By: Dr. Conley and Dr. Riley',
      // Course Overview — Figma 998:14857 (desktop) / 999:7198 (mobile).
      // Desktop kept canonical for `details`/Audience per the SAME
      // desktop/mobile disagreement CourseOverview.astro's header comment
      // already documents for Sole Switch Pro: mobile's 3rd/4th facts read
      // "Course Format"/"Course Style" ("Online on demand"/"Video lecture")
      // instead of desktop's "Course Structure"/"Continuing Education
      // Credit" ("Online on demand"/"Yes") — a genuinely different 4th fact,
      // not a label rename. Mobile's Audience value also drops desktop's
      // trailing period ("...for themselves" vs "...for themselves."). Both
      // flagged here as the same class of client-content item, not merged
      // or guessed. `body`'s wording also differs by one word ("where you
      // sit" desktop vs "where to sit" mobile) — desktop kept, trailing
      // Figma text-node whitespace trimmed.
      overview: {
        image: '/images/plp/sole-switch.jpg',
        details: [
          { label: 'Course Length', value: '50 minutes' },
          { label: 'Evidence Based', value: 'Yes' },
          { label: 'Course Structure', value: 'Online on demand' },
          { label: 'Continuing Education Credit', value: 'Yes' },
          {
            label: 'Audience',
            value: 'Anyone looking to understand how to choose healthy shoes for themselves.',
          },
        ],
        body: 'Understanding the key features of shoes, the concept of the shoe spectrum and where you sit on the spectrum, finding your baseline and learning what shoes are appropriate for you, transition strategies, and a PDF shoe guide.',
      },
      // 4 Column feature band — Figma-verbatim heading + 4 blurbs from node
      // 998:14858 (desktop) / 999:7199 (mobile). This frame's own heading
      // correctly reads "...Sole Switch Course" (this IS the Sole Switch
      // page, unlike Sole Switch Pro's own reused-heading quirk).
      //
      // CLIENT-CONTENT FLAG (4th blurb — desktop/mobile genuinely diverge in
      // CONTENT, not just wording): desktop's 4th card cuts off mid-sentence
      // — "When the toes can properly splay, our foot and ankle muscles
      // engage," (trailing comma, no closing clause) — while mobile carries
      // the FULL sentence: "...our foot and ankle muscles engage, creating a
      // stronger, more stable platform from which to propel ourselves
      // forward." Per this task's brief ("keep DESKTOP canonical, ship it,
      // and REPORT the divergence"), the truncated desktop fragment is used
      // below even though mobile's version is clearly the complete,
      // probably-intended copy — flagged loudly, not silently completed
      // using mobile's text.
      //
      // No dedicated feature photography exists for this course (same
      // "reuses the one PLP course shot" placeholder approach Sole Switch
      // Pro's own `features` takes).
      featuresHeading: 'What to Expect in the Sole Switch Course',
      features: [
        {
          image: '/images/plp/sole-switch.jpg',
          label: null,
          text: 'Walk away with a better understanding of how to select healthy footwear! Plus, get a bonus PDF footwear guide!',
        },
        {
          image: '/images/plp/sole-switch.jpg',
          label: null,
          text: 'Receive lifetime access to a course written by clinicians with over 30 years of experience helping patients build foot health naturally.',
        },
        {
          image: '/images/plp/sole-switch.jpg',
          label: null,
          text: 'Learn specific and helpful strategies to help transition safely to less restrictive natural footwear.',
        },
        {
          image: '/images/plp/sole-switch.jpg',
          label: null,
          text: 'When the toes can properly splay, our foot and ankle muscles engage,',
        },
      ],
      // "You'll Stop and Instead" — Figma 998:14859 (desktop) / 999:7200
      // (mobile). Both frames pair the SAME lead-in/body text as each
      // other, AND it's word-for-word identical to Sole Switch Pro's own
      // `youllStop` copy above (same pain point/benefit framing reused
      // across both course tiers) — no desktop/mobile disagreement to flag.
      youllStop: {
        stop: {
          lead: "You'll stop",
          body: 'feeling frustrated by confusing shoe feature terminology',
        },
        instead: {
          lead: "and instead you'll",
          body: 'gain confidence in your ability to look for key features when shoe shopping.',
        },
      },
      // Comparison Chart — Figma-verbatim from node 998:14860 (desktop) /
      // 999:7201 (mobile). Identical table (same columns/rows/values,
      // literally byte-for-byte the same comparison Sole Switch Pro's own
      // `comparison` block above already carries — it's the SAME two-tier
      // comparison table shown on both course pages) — no desktop/mobile
      // disagreement on the table itself.
      //
      // ComparisonChart.astro's heading ("Sole Switch VS Sole Switch Pro")
      // is DERIVED from `comparison.columns` (`${columns[0]} VS` + `
      // ${columns[1]}`, commit 0095c92) — not hardcoded, and no separate
      // heading data slot exists or is needed; `columns` below already
      // carries both names for the table itself. The CTA is data-driven per the
      // component-generalization fix: `cta.label` is the frame's own
      // Figma-verbatim button text ("View Sole Switch Pro Course",
      // confirmed via get_design_context on THIS item's own comparison node
      // 998:14860 — same text as Sole Switch Pro's own CTA, since both
      // pages' frames show the same upsell button); `cta.href` is
      // `/courses/sole-switch-pro` — an internal route to the Pro course
      // this button is upselling, NOT this item's own `enrollHref` above
      // (that would incorrectly self-enroll the visitor in the Basic course
      // a button reading "View Sole Switch Pro Course" — the bug this fix
      // corrects; see ComparisonChart.astro's header comment). Because this
      // href is internal, ComparisonChart.astro's `isExternal` check omits
      // `target="_blank" rel="noopener noreferrer"` for this CTA.
      //
      // `intro` (review fix wave 2): THIS course's own comparison node
      // (998:14860) — confirmed via get_design_context, desktop frame — pairs
      // the table with a table-purpose explainer, "Trying to figure out
      // which course is right for you? This table provides a brief overview
      // of the differences between the Sole Switch and Sole Switch Pro
      // courses.", NOT Sole Switch Pro's Dr. Courtney Conley bio (a
      // component-level hardcode this field replaces — see
      // ComparisonChart.astro's header comment). Figma-verbatim; a single
      // trailing space in the pulled node's own text is trimmed as a
      // text-node artifact, same precedent as `youllStop.instead.body`
      // above.
      comparison: {
        columns: ['Sole Switch', 'Sole Switch Pro'],
        intro:
          'Trying to figure out which course is right for you? This table provides a brief overview of the differences between the Sole Switch and Sole Switch Pro courses.',
        rows: [
          { label: 'Course Structure', values: ['Online', 'Online'] },
          { label: 'Course Length', values: ['50 Minutes', '2 Hours 13 Min'] },
          { label: 'Audience', values: ['Individuals', 'Professionals'] },
          { label: 'Evidence Based', values: ['Yes', 'Yes'] },
          { label: 'Continuing Education Credit', values: ['No', 'Yes'] },
          { label: 'Course Price', values: ['$50', '$150'] },
        ],
        cta: { label: 'View Sole Switch Pro Course', href: '/courses/sole-switch-pro' },
      },
      // Testimonial — Figma-verbatim from node 1000:9051 (desktop) /
      // 1106:15235 (mobile). Identical quote/author/rating to Sole Switch
      // Pro's own testimonial above — same Phyllis review, reused verbatim
      // on both course pages, no desktop/mobile disagreement. See
      // tests/testimonial.test.mjs — array shape required.
      testimonial: [
        {
          quote: [
            "This course put me on track for many positive changes in my foot health and strength!\nI also did Movement RX and also bought the Basic Foot health kit and have benefited in so many ways!",
            'I am pain free and have stronger feet and up the chain benefits!',
            'LOVE GAIT HAPPENS and follow along in podcasts, IG and YouTube!',
          ],
          author: 'Phyllis',
          role: null,
          rating: 5,
        },
      ],
      // Your Instructors — Figma-verbatim from node 998:14861 (desktop) /
      // 999:7202 (mobile). Identical 2 instructors/bios/credentials to Sole
      // Switch Pro's own `instructors` above (same two clinicians teach both
      // tiers) — `photo` swapped to this item's own PLP image (same
      // per-item placeholder-photo convention every other course/product
      // takes), everything else reused verbatim.
      instructors: [
        {
          photo: '/images/plp/sole-switch.jpg',
          name: 'Dr. Courtney Conley',
          credential: 'Lakewood, Colorado',
          bio: [
            "Dr. Courtney Conley is a national bestselling author, international educator, and one of the world's foremost authorities on foot and gait health. Her book, Walk, hit both the USA Today and Amazon bestseller lists, resonating with readers eager to understand the profound connection between foot function and whole-body health. The book's success has brought Dr. Conley to some of the most respected platforms in health and wellness media, including appearances on The Peter Attia Drive Podcast, Diary of a CEO, Feel Better, Live More with Dr. Rangan Chatterjee, as well as national television features on CBS Mornings and Fox & Friends.",
            "Dr. Conley holds a Doctorate in Chiropractic Medicine and two Bachelor's degrees in Kinesiology and Human Biology. With nearly 25 years of clinical practice, she has worked with professional athletes from organizations including the Phoenix Suns, New York Yankees, Cleveland Browns, New York Giants, and San Francisco 49ers. She has also collaborated with medical experts across the country, addressing complex foot and gait challenges at the highest level of performance. She currently serves as Head of Patient Care at Total Health Solutions and Total Health Performance in Lakewood, Colorado—premier clinics known for comprehensive, rehabilitation-focused patient care where she is committed to helping people improve their lives one step at a time.",
            'That same commitment led her to found and lead Gait Happens, an education enterprise leading a paradigm shift in foot health by empowering people worldwide to reclaim optimal foot function through science-backed training and protocols. Gait Happens offers a comprehensive ecosystem of resources — from professional education for practitioners to consumer training programs and personalized consultations with top-of-field specialists — all grounded in research and designed to deliver real, measurable results. With a focus on natural, preventative approaches to foot and gait health, Gait Happens has built a global community of individuals committed to moving better and living pain-free, offering a proven alternative to unnecessary surgical intervention through education and evidence-based care.',
            'An internationally recognized speaker, Dr. Conley shares her expertise to clinicians and consumers alike through in-person and online lectures on foot mechanics and gait dynamics. Her work spans authorship, mentorship, patent and curriculum development, and the creation of pioneering foot and gait methodologies. Yet at the heart of every lecture, protocol, and patient interaction is the same driving belief: real strength starts from the ground up, and healthy feet are the foundation every body needs to move through life with confidence and ease.',
          ],
        },
        {
          photo: '/images/plp/sole-switch.jpg',
          name: 'Dr. Allison Riley, DPT',
          credential: 'Salem, Massachusetts',
          bio: [
            'Dr. Allison Riley has a passion for helping people recognize that movement is a powerful way to get and stay healthy, active, and happy. She has had an interest in lower body injuries and gait since early in her career.',
          ],
        },
      ],
      // Cross-sell band — Figma-verbatim heading from the "Product Cards"
      // frame, node 998:19178 (desktop) / 1106:15252 (mobile). Both frames'
      // 3 cards (Toe Spacers / Combating Bunions / Fit Feet) are the EXACT
      // same trio + heading + `/collections/all` "Shop All" every product
      // PDP's own cross-sell already carries (see Toe Spacers' `crossSell`
      // comment near the top of this file) — reused verbatim rather than
      // treated as course-specific, since it genuinely is the same block.
      // (Desktop's heading reads "More Resources for Your Movement
      // Journey"; mobile's drops the leading "More" — "Resources For Your
      // Movement Journey" — a wording-only diff, desktop kept canonical,
      // same as every other divergence on this page.)
      crossSell: {
        heading: 'More Resources for Your Movement Journey',
        itemIds: ['toe-spacers', 'combating-bunions', 'fit-feet'],
        shopAllHref: '/collections/all',
      },
      // FAQs — Figma node 998:14863 (desktop) / 999:7208 (mobile). Same 4
      // questions, same order, Figma-verbatim on both frames (no
      // desktop/mobile wording disagreement).
      //
      // UNLIKE Sole Switch Pro's own FAQ section (whose header comment flags
      // that NEITHER of its frames carried any answer copy, forcing authored
      // placeholder content), this course's MOBILE frame (999:7208) renders
      // the accordion in its EXPANDED state — every row shows real,
      // Figma-verbatim answer copy, not just the collapsed question label.
      // (Desktop 998:14863 only shows the collapsed state, same as Sole
      // Switch Pro's desktop frame — but mobile fills the gap here.) Every
      // `content` value below is therefore REAL pulled Figma content, not
      // authored copy — confirmed via get_design_context on both node
      // trees.
      faqs: [
        {
          label: 'Is this mini-course right for me?',
          content:
            '<p>The Sole Switch mini-course is perfect for you if you are struggling to understand how to select functional footwear to fit your lifestyle. If you want to transition into using footwear that will protect your feet while helping you build foot strength and improve your foot health, this course is for you!</p>',
        },
        {
          label: 'I wear orthotics, should I still take this course?',
          content:
            '<p>Yes! Whether you are looking to transition out of your orthotics or find shoes that fit your orthotics appropriately, this course has answers for you.</p>',
        },
        {
          label: 'Do you talk about shoes for flat feet? What about high arches?',
          content:
            '<p>In this course we talk about the structure and function of feet and how different footwear options can be used to help all feet regardless of shape, size, or symptoms.</p>',
        },
        {
          label: 'Does the Pro Course include everything in the regular course?',
          content:
            '<p>Yes! The Sole Switch Pro includes everything taught in the regular course but then expands deeper into the research and clinical applications of the shoe spectrum. We discuss specific diagnoses and assessments to utilize when making recommendations for your patients and clients.</p>',
        },
      ],
      // Reviews placeholder — same static reviews-app-screenshot values
      // every product/course PDP reuses (see Toe Spacers' `reviews` comment
      // / PdpReviews.astro's note); this course's own "Reviews Plugin Here"
      // frame (998:14864 / 999:7205) is the same unbuilt placeholder frame
      // every other PDP has, not real review data.
      reviews: {
        rating: 4.75,
        count: 12,
        distribution: [
          { stars: 5, count: 11 },
          { stars: 4, count: 0 },
          { stars: 3, count: 0 },
          { stars: 2, count: 1 },
          { stars: 1, count: 0 },
        ],
      },
    },
  },
  {
    id: 'combating-bunions',
    handle: 'combating-bunions',
    title: 'Combating Bunions',
    kind: 'course',
    badges: ['Course'],
    price: '$45 USD',
    priceRange: null,
    description: "1 hour, 4-Module Online Course taught by Gait Happens' Drs Conley and Perez.",
    image: '/images/plp/combating-bunions.jpg',
    href: '/courses/combating-bunions',
    cta: 'View Course',
    variants: null,
    sizeChart: null,
    // Chunk B1 Task 3 (Course Details hero, 675:5542 desktop / 999:7156
    // mobile) — this item previously had no top-level rating; both frames
    // show a 5-star rating with "(27)" reviews, so it's added here per this
    // task's brief. Also turns the star rating on for this item's PLP card
    // (PlpCard.astro only renders <StarRating> when `item.rating` is set) —
    // the same intentional side effect Sole Switch Pro's own `rating` field
    // already documents.
    rating: 5,
    reviewCount: 27,
    // Chunk B1 Task 3 — Combating Bunions course PDP. Figma desktop frame
    // 675:5540 ("Combating Bunions Course", file FX7PDNvhZwyozODaq8Q8i7) /
    // mobile "Combating Bunions Course Mobile" frame under section 999:7142.
    // Same 11-section order the first 2 shipped courses use — every type
    // below already has a Pdp.astro REGISTRY entry, so this assembles end to
    // end with no new components, matching this task's "data-only" brief.
    //
    // CLIENT-CONTENT FLAG (systemic): this course's MOBILE frames repeatedly
    // carry content that was clearly copy-pasted from the Sole Switch
    // template and never updated for Combating Bunions — not just wording
    // drift, but wrong facts (an instructor name that doesn't teach this
    // course, an Audience sentence about shoes not bunions, a comparison
    // intro naming the wrong two courses, a 4-column blurb about toe splay
    // instead of bunions, and an FAQ accordion whose 5 mobile questions don't
    // match desktop's at all). Every instance is called out at its own field
    // below; DESKTOP is kept canonical throughout per this task's brief, and
    // every mobile mismatch is flagged here as a client-content item — this
    // page's mobile Figma frames need a real content pass before this ships
    // past the reference build.
    pdp: {
      sections: [
        'course-details',
        'course-overview',
        'four-column',
        'youll-stop-and-instead',
        'comparison-chart',
        'testimonial',
        'your-instructors',
        'cross-sell',
        'faqs',
        'pdp-reviews',
        'logo-wall',
      ],
      // Course Details hero — Figma-verbatim from node 675:5542 (desktop) /
      // 999:7156 (mobile). `heroTitle` overrides the catalog's shorter
      // `title` for just the hero <h1> (both frames read "Combating Bunions
      // Course").
      heroTitle: 'Combating Bunions Course',
      // Both frames show a single flat price, no sale/compare-at price —
      // `priceExact` matches this item's own top-level `price` exactly, so
      // no `compareAtPrice` field is set (unlike Sole Switch's sale price).
      priceExact: '$45.00 USD',
      // Hero intro paragraph — desktop text kept canonical (trailing
      // Figma text-node whitespace trimmed, curly apostrophe normalized to
      // straight per this file's convention). Mobile's own copy of this
      // same paragraph only differs by lowercasing "tailor's" — a wording-
      // only diff, not flagged as a separate client-content item.
      description:
        "Gain the tools you need to walk away from the pain and limitations of bunions and bunionettes (Tailor's bunions).",
      // Primary CTA (enroll, external — see CourseDetails.astro's Sole
      // Switch/Sole Switch Pro remap precedent: Figma's own buybox is a
      // cart/quantity-stepper "Add to Cart" flow, remapped to a Kajabi
      // enrollment link since this course is fulfilled on Kajabi, not the
      // Shopify cart). Realistic Kajabi placeholder URL; swap for the real
      // offer/checkout URL once the course is live on Kajabi.
      enrollHref: 'https://gaithappens.mykajabi.com/offers/combating-bunions-course',
      enrollLabel: 'Enroll Now',
      // No `pills` — unlike Sole Switch/Sole Switch Pro's two-tier pill
      // toggle (now the generalized `pdp.pills` shape — see
      // CourseDetails.astro's header comment) or Fit Feet's language
      // selector, neither of this course's Course Details frames shows any
      // pill-group content next to the CTA (single-tier course, no sibling
      // tier or language selector to cross-link from the hero). Left unset
      // — the whole pill-group block guards on this field's presence, same
      // idiom as `courseCard`/`heroImage`, so nothing renders.
      //
      // ---- COMPONENT GAP — RESOLVED (CourseDetails.astro hero image fix) --
      // No `courseCard` is set, and never should be for this course: unlike
      // Sole Switch/Sole Switch Pro, whose Figma hero right column is a
      // flattened raster of a BRANDED card (solid teal/yellow background +
      // title text + optional tag — reconstructed as real markup via
      // `courseCard.titleLines`/`tag`/`variant`), THIS course's right-column
      // raster (675:5542 node I675:5542;173:147 / 999:7156 node
      // I999:7156;181:674) is a plain close-up PHOTO of feet — no overlaid
      // text, no colored background, confirmed via get_design_context on
      // both breakpoints. This was originally flagged as a component gap
      // (CourseDetails.astro had no branch for "just an image, no card") and
      // left unset, shipping a blank hero right column — since fixed by
      // adding the sibling `heroImage` field below + a second, mutually
      // exclusive render branch in CourseDetails.astro (see that file's
      // header comment for the full field-shape/alt-text/layout reasoning).
      // `courseCard` and `heroImage` are never both set on the same item.
      heroImage: '/images/plp/combating-bunions.jpg',
      // Same placeholder PLP course shot every other image slot on this
      // item already reuses (`overview.image`, `features[].image`,
      // `instructors[].photo` below) — no dedicated hero photography exists
      // for this course yet (see this file's other placeholder-image
      // comments on this same item).
      instructorsByline: 'Course By: Dr. Conley and Dr. Perez',
      // CLIENT-CONTENT FLAG: mobile's own instructors byline (999:7156)
      // reads "Course By: Dr. Conley and Dr. Riley" instead — Dr. Riley
      // doesn't teach this course (this page's own Your Instructors section,
      // both breakpoints, lists Conley + Perez, not Riley) — a mobile-only
      // copy-paste error from the Sole Switch template. Desktop's "Dr.
      // Conley and Dr. Perez" is kept canonical (matches this item's own
      // top-level `description` and the real instructor roster below).
      //
      // Course Overview — Figma 675:5543 (desktop) / 999:7157 (mobile).
      // Desktop kept canonical for `details`/`body` — mobile disagrees on
      // MORE than wording here (see the CLIENT-CONTENT FLAG below).
      overview: {
        image: '/images/plp/combating-bunions.jpg',
        details: [
          { label: 'Course Length', value: '4 Module Mini-Course' },
          { label: 'Evidence Based', value: 'Yes' },
          { label: 'Course Structure', value: 'Online on demand' },
          { label: 'Course Style', value: 'Video Lecture and Exercises' },
          {
            label: 'Audience',
            value:
              "Individuals dealing with bunions or tailor's bunions who want to understand their condition and explore non-surgical solutions.",
          },
        ],
        // CLIENT-CONTENT FLAG: mobile's Audience value (999:7157) reads
        // "Anyone looking to understand how to choose healthy shoes for
        // themselves" — that's Sole Switch's own Audience sentence
        // (byte-for-byte, see that item's own `overview.details` above),
        // not this course's, and has nothing to do with bunions — another
        // Sole-Switch-template copy-paste error. Mobile's 3rd/4th detail
        // labels also rename to "Course Format"/"Course Style" (dropping
        // "Video Lecture and Exercises" down to just "Video lecture") —
        // desktop's 5-fact set above is kept canonical throughout.
        body: "Understand what bunions and Tailor's bunions are and are not, learn how the mobility and strength of your feet can improve the function of your toes, get specific exercises for individuals with bunions, and discover footwear and tools that can support your feet and can help reduce the need for surgery.",
      },
      // 4 Column feature band — Figma-verbatim heading + 4 blurbs from node
      // 675:5544 (desktop) / 999:7158 (mobile). No dedicated feature
      // photography exists for this course — `image` reuses this item's own
      // PLP course shot for all 4 cards, same placeholder approach every
      // other course's `features` array takes.
      featuresHeading: "What's Included:",
      features: [
        {
          image: '/images/plp/combating-bunions.jpg',
          label: null,
          text: "A 4-module mini-course designed SPECIFICALLY to target discomfort caused by bunions AND Tailor's bunions.",
        },
        {
          image: '/images/plp/combating-bunions.jpg',
          label: null,
          text: 'The ability to improve function of your feet and get back to your favorite activities.',
        },
        {
          image: '/images/plp/combating-bunions.jpg',
          label: null,
          text: 'Crystal clear instruction on how to care for your feet - form exercises to choosing footwear.',
        },
        {
          image: '/images/plp/combating-bunions.jpg',
          label: null,
          // CLIENT-CONTENT FLAG: mobile's 4th blurb (999:7158) reads "When
          // the toes can properly splay, our foot and ankle muscles engage,
          // creating a stronger, more stable platform from which to propel
          // ourselves forward." — that's Sole Switch/Sole Switch Pro's own
          // 4th blurb verbatim, not written for this course and unrelated
          // to bunions. Desktop's bunion-specific text is kept canonical.
          text: "Tools to overcome bunion and Tailor's bunion pain without needing surgery.",
        },
      ],
      // "You'll Stop and Instead" — Figma 675:5545 (desktop) / 999:7159
      // (mobile). Both frames pair the SAME lead-in/body text as each other
      // (mobile only differs by a CSS-only capitalize transform) — no
      // desktop/mobile disagreement to flag here, unlike every other section
      // on this page.
      youllStop: {
        stop: {
          lead: "You'll stop",
          body: 'thinking surgery is your only option',
        },
        instead: {
          lead: "and instead you'll",
          body: 'gain confidence in your ability to reduce bunion pain and foot limitations.',
        },
      },
      // Comparison Chart — Figma-verbatim from node 996:8246 (desktop) /
      // 1037:16571 (mobile). This course's own comparison is "Combating
      // Bunions VS Fit Feet" (NOT Sole Switch's own "Sole Switch VS Sole
      // Switch Pro" table) — `columns`/`rows`/`intro`/`cta` are all pulled
      // fresh from this course's own comparison node, per this task's brief.
      comparison: {
        columns: ['Combating Bunions', 'Fit Feet'],
        intro:
          'Trying to figure out which course is right for you? This table provides a brief overview of the differences between the Combating Bunions and Fit Feet courses.',
        // CLIENT-CONTENT FLAG: mobile's own intro paragraph (1037:16571)
        // instead reads "...between the Sole Switch and Sole Switch Pro
        // courses." — a verbatim copy of Sole Switch's own intro text, not
        // updated for this course's actual Combating Bunions/Fit Feet
        // comparison. Desktop's correct intro is kept canonical.
        rows: [
          { label: 'Course Structure', values: ['Online', 'Online'] },
          { label: 'Course Length', values: ['4 Mini-Modules', '12 Weeks'] },
          { label: 'Audience', values: ['Individuals', 'Individuals'] },
          { label: 'Evidence Based', values: ['Yes', 'Yes'] },
          { label: 'Continuing Education Credit', values: ['No', 'No'] },
          { label: 'Course Price', values: ['$45', '$185'] },
        ],
        // CLIENT-CONTENT FLAG (real DATA divergence, not just wording):
        // mobile's own "Continuing Education Credit" row (1037:16571) reads
        // ['No', 'Yes'] — Fit Feet shows "Yes" on mobile vs desktop's "No".
        // Every other cell agrees between breakpoints. Desktop's ['No',
        // 'No'] is kept canonical per this task's brief, but this one is
        // flagged as needing real clarification from Gait Happens (which
        // value is actually correct for Fit Feet), not just a cosmetic
        // wording fix.
        //
        // CTA — Figma-verbatim button text on both frames ("View the Fit
        // Feet Course"); `href` is an internal route to the Fit Feet
        // course's own page (`/courses/fit-feet`, an existing placeholder
        // route — see sitemap.js), so ComparisonChart.astro's `isExternal`
        // check omits `target="_blank"` for this CTA.
        cta: { label: 'View the Fit Feet Course', href: '/courses/fit-feet' },
      },
      // Testimonial — Figma-verbatim from node 675:7967 (desktop) /
      // 999:7161 (mobile). Identical quote/author/role/rating on both
      // frames — no desktop/mobile disagreement here, unlike every other
      // section on this page. `role` is Bethany's own second attribution
      // line, "Human Sole" (present on both frames, unlike Phyllis' name-only
      // attribution on the other 2 courses) — populated rather than left
      // `null`. See tests/testimonial.test.mjs — array shape required.
      testimonial: [
        {
          quote: [
            'I just started the Bunions mini-course - and I am LOVING it!',
            'The exercises are fantastic! Thank you SO, so much for putting this together. I love the educational aspect behind the exercises as well!',
            "I've already improved my toe and foot strength/splay over the past few months with the Fit Feet Program, and I can't wait to progress even more with the added eduction and exercises from the Bunions program. You are all truly amazing!!",
          ],
          author: 'Bethany Pendergrass',
          role: 'Human Sole',
          rating: 5,
        },
      ],
      // Your Instructors — Figma-verbatim from node 675:5547 (desktop) /
      // 999:7162 (mobile). Identical 2 instructors/bios/credentials on both
      // frames — no desktop/mobile disagreement here. Dr. Courtney Conley's
      // bio is the SAME 4-paragraph biography Sole Switch/Sole Switch Pro
      // already carry (same clinician teaches all 3 courses) — reused
      // verbatim. Dr. Jenifer Perez, DC is new to this course (not one of
      // Sole Switch's 2 instructors). `photo` reuses this item's own PLP
      // course shot for both cards (no dedicated instructor photography
      // exists yet, same placeholder convention every other course takes).
      instructors: [
        {
          photo: '/images/plp/combating-bunions.jpg',
          name: 'Dr. Courtney Conley',
          credential: 'Lakewood, Colorado',
          bio: [
            "Dr. Courtney Conley is a national bestselling author, international educator, and one of the world's foremost authorities on foot and gait health. Her book, Walk, hit both the USA Today and Amazon bestseller lists, resonating with readers eager to understand the profound connection between foot function and whole-body health. The book's success has brought Dr. Conley to some of the most respected platforms in health and wellness media, including appearances on The Peter Attia Drive Podcast, Diary of a CEO, Feel Better, Live More with Dr. Rangan Chatterjee, as well as national television features on CBS Mornings and Fox & Friends.",
            "Dr. Conley holds a Doctorate in Chiropractic Medicine and two Bachelor's degrees in Kinesiology and Human Biology. With nearly 25 years of clinical practice, she has worked with professional athletes from organizations including the Phoenix Suns, New York Yankees, Cleveland Browns, New York Giants, and San Francisco 49ers. She has also collaborated with medical experts across the country, addressing complex foot and gait challenges at the highest level of performance. She currently serves as Head of Patient Care at Total Health Solutions and Total Health Performance in Lakewood, Colorado—premier clinics known for comprehensive, rehabilitation-focused patient care where she is committed to helping people improve their lives one step at a time.",
            'That same commitment led her to found and lead Gait Happens, an education enterprise leading a paradigm shift in foot health by empowering people worldwide to reclaim optimal foot function through science-backed training and protocols. Gait Happens offers a comprehensive ecosystem of resources — from professional education for practitioners to consumer training programs and personalized consultations with top-of-field specialists — all grounded in research and designed to deliver real, measurable results. With a focus on natural, preventative approaches to foot and gait health, Gait Happens has built a global community of individuals committed to moving better and living pain-free, offering a proven alternative to unnecessary surgical intervention through education and evidence-based care.',
            'An internationally recognized speaker, Dr. Conley shares her expertise to clinicians and consumers alike through in-person and online lectures on foot mechanics and gait dynamics. Her work spans authorship, mentorship, patent and curriculum development, and the creation of pioneering foot and gait methodologies. Yet at the heart of every lecture, protocol, and patient interaction is the same driving belief: real strength starts from the ground up, and healthy feet are the foundation every body needs to move through life with confidence and ease.',
          ],
        },
        {
          photo: '/images/plp/combating-bunions.jpg',
          name: 'Dr. Jenifer Perez, DC',
          credential: 'Lafayette, Colorado',
          bio: [
            'Dr. Jen Perez is the co-owner and Vice President of Gait Happens. As both an educator and a clinician, her mission is to empower as many people as possible to take charge of their lower body health so they can get back to what they love.',
          ],
        },
      ],
      // Cross-sell band — Figma-verbatim heading from the "Product Cards"
      // frame, node 1000:11633 (desktop) / 1106:15395 (mobile).
      //
      // CLIENT-CONTENT FLAG: desktop's own 3 cards read "Combating Bunions"
      // / "Fit Feet Course" / "Sole Switch Pro" — the FIRST card literally
      // cross-sells THIS SAME course from its own page (a self-referencing
      // link), which is almost certainly a Figma authoring artifact (this
      // "Product Cards" band appears to be a shared/reused frame across
      // several course pages, not built fresh per page — see Sole Switch's
      // own `crossSell` comment for the identical situation on that course).
      // Kept Figma-verbatim per this task's "content is Figma-verbatim,
      // never invent" instruction rather than editorially swapping it for a
      // 4th course — flagged here for Gait Happens to correct. Mobile
      // (1106:15395) disagrees with desktop on this same first card, reading
      // "Sole Switch Course" instead of "Combating Bunions" — yet another
      // Sole-Switch-template mismatch; desktop's literal (if odd) trio is
      // kept canonical.
      crossSell: {
        heading: 'More Resources For Your Movement Journey',
        itemIds: ['combating-bunions', 'fit-feet', 'sole-switch-pro'],
        shopAllHref: '/collections/all',
      },
      // FAQs — Figma node 1002:10467 (desktop) / 999:7164 (mobile).
      //
      // CRITICAL FLAG: mobile's FAQ accordion doesn't just disagree on
      // wording — it shows 5 ENTIRELY DIFFERENT questions ("Virtual
      // Consultations", "Gait Happens Education", "Online Courses",
      // "Memberships", "Gait Happens Products" — generic site-wide category
      // labels, not course questions), confirmed via get_design_context on
      // both node trees. This is not this course's own accordion at all on
      // mobile; desktop's 5 real, course-specific question labels are used
      // below instead, per this task's "keep desktop canonical" brief.
      //
      // Neither frame contains any ANSWER copy for its own questions (both
      // are static mockups of the collapsed state only) — same situation
      // Sole Switch Pro's own FAQ section hit. Per this task's explicit
      // instruction NOT to author plausible-sounding invented answers, each
      // row below is handled per its own actual grounding:
      //   - Row 1 ("right for me"): restates this SAME entry's already-
      //     Figma-verbatim `overview.details` Audience line + `description`.
      //   - Row 2 (exercises): restates this SAME entry's already-Figma-
      //     verbatim `overview.details` Course Style value ("Video Lecture
      //     and Exercises") in plain customer-facing prose.
      //   - Row 3 (Tailor's bunions included): restates this SAME entry's
      //     already-Figma-verbatim `description` + `features[0].text`,
      //     both of which explicitly name Tailor's bunions/bunionettes.
      //   - Rows 4 & 5 (equipment; course access length): NO grounding data
      //     exists anywhere in this file for either question, and neither
      //     answer can be inferred from real data without inventing a new
      //     fact. Each `content` value is a short, neutral "copy pending"
      //     placeholder — no invented factual claim about the course.
      //
      // REVIEW FIX (Chunk B1 Task 3 fix wave): rows 4 & 5 previously rendered
      // an internal build note verbatim as the customer-facing "answer" (it
      // literally said the copy didn't exist "in the Figma source" and
      // needed approval "before this ships past the reference build") — that
      // is build commentary, not something a client-facing page should ever
      // render. Row 2 similarly leaked an internal parenthetical referencing
      // the raw "Course Style" field name. All three are now plain,
      // client-safe prose/placeholders; the disclosure that rows 4 & 5 are
      // NOT yet client-approved copy belongs only here and in this task's
      // report, never in the rendered HTML. Still flagged: rows 4 & 5 need
      // real client-approved answer copy before this ships past the
      // reference build.
      faqs: [
        {
          label: 'Is this course right for me?',
          content:
            "<p>This course is built for individuals dealing with bunions or tailor's bunions who want to understand their condition and explore non-surgical solutions — the tools to walk away from the pain and limitations of bunions and bunionettes (Tailor's bunions).</p>",
        },
        {
          label: 'Are there exercises in the Combating Bunions course?',
          content: '<p>Yes — the course pairs video lecture with exercises.</p>',
        },
        {
          label: "Are Tailor's bunions included?",
          content:
            "<p>Yes. The course is specifically designed to target discomfort caused by both bunions and Tailor's bunions (bunionettes).</p>",
        },
        {
          label: 'Do I need equipment',
          content: '<p>Details on equipment for this course are coming soon.</p>',
        },
        {
          label: 'How long do I have access to the course?',
          content: '<p>Details on course access are coming soon.</p>',
        },
      ],
      // Reviews placeholder — same static reviews-app-screenshot values
      // every product/course PDP reuses (see Toe Spacers' `reviews` comment
      // / PdpReviews.astro's note); this course has no real review data any
      // more than the others do.
      reviews: {
        rating: 4.75,
        count: 12,
        distribution: [
          { stars: 5, count: 11 },
          { stars: 4, count: 0 },
          { stars: 3, count: 0 },
          { stars: 2, count: 1 },
          { stars: 1, count: 0 },
        ],
      },
    },
  },
  {
    id: 'fit-feet',
    handle: 'fit-feet',
    title: 'Fit Feet Program',
    kind: 'course',
    badges: ['Course', 'Product'],
    price: '$185 USD',
    priceRange: null,
    // This item already had a top-level rating before this task. Figma's own
    // Course Details hero (675:8156/999:7170) also shows a 5-star rating but
    // "(21)" reviews, not 32 — the same systemic catalog-vs-Figma
    // review-count disagreement already flagged on Sole Switch/Sole Switch
    // Pro/Combating Bunions (each item's own Figma count disagrees with its
    // catalog `reviewCount`). NOT changed here, per this task's brief
    // (batched for the client, not a per-item patch).
    rating: 5,
    reviewCount: 32,
    description: 'Online program to help you build a healthier body starting with your feet.',
    image: '/images/plp/fit-feet.jpg',
    href: '/courses/fit-feet',
    cta: 'View Course',
    variants: null,
    sizeChart: null,
    // Chunk B1 Task 4 — Fit Feet course PDP. Figma desktop frame 675:8154
    // ("Fit Feet Course", file FX7PDNvhZwyozODaq8Q8i7) / mobile "Fit Feet
    // Course Mobile" frame 999:7168 (under mobile section 999:7142). Same
    // 11-section order the first 3 shipped courses use — every type below
    // already has a Pdp.astro REGISTRY entry, so this assembles end to end
    // with no new components, matching this task's "data-only" brief.
    //
    // ---- COMPONENT GAP — RESOLVED (Chunk B1 pill-group generalization) ----
    // This course's Course Details hero (675:8156 desktop / 999:7170 mobile)
    // shows a real "Language" selector row between the intro paragraph and
    // the Add to Cart/Enroll button: 4 pills ("English" filled/selected;
    // "Spanish"/"French"/"Japanese" outline), present identically on BOTH
    // breakpoints (confirmed via get_design_context on both node trees —
    // not a one-off single-frame artifact). This was the 9th finding on
    // this branch (reported, not fixed, by the task that first authored
    // this item's data) because CourseDetails.astro had no render path for
    // it at all. The follow-up task generalized the pilot's single-pill
    // "Select your course" tier block (its old single-purpose field) into
    // one data-driven `pdp.pills = { label, options }` shape that
    // expresses both cases —
    // see CourseDetails.astro's header comment. `pills.options` below is
    // set from this course's own `pdp.pills` field, not a new parallel
    // field, per that task's explicit "generalize, don't bolt on"
    // instruction. Verified: neither pill links anywhere in either Figma
    // frame (each is a plain unlinked "Button" node, no prototype
    // interaction, no destination) — these are a Kajabi/Shopify-side
    // language-variant control this reference build doesn't wire up, so
    // `options` carries no `href` and CourseDetails.astro renders them as
    // inert `<span>`s, not links — same "a control that does nothing is a
    // false affordance" call Testimonial.astro's decorative arrows already
    // made for this exact situation. `English` is the one filled/selected
    // pill in both frames — carried as `selected: true`, reflected in the
    // markup via a `--selected` modifier class + `aria-current`.
    //
    // ---- CLIENT-CONTENT FLAG (systemic, recurs a 4th time — worse this
    // time) — this course's MOBILE frames again carry content that reads
    // like an un-updated copy-paste, but this time it's not just wording
    // drift: "You'll Stop and Instead" mobile (999:7173) shows COMBATING
    // BUNIONS' own copy VERBATIM ("...thinking surgery is your only
    // option" / "...reduce bunion pain and foot limitations" — nothing to
    // do with Fit Feet), and the Comparison Chart's CTA button ("View Sole
    // Switch Pro Course") disagrees with BOTH compared courses (Fit Feet vs
    // Virtual Consultations) on BOTH breakpoints, not just mobile. Every
    // instance is called out at its own field below; DESKTOP is kept
    // canonical throughout per this task's brief.
    pdp: {
      sections: [
        'course-details',
        'course-overview',
        'four-column',
        'youll-stop-and-instead',
        'comparison-chart',
        'testimonial',
        'your-instructors',
        'cross-sell',
        'faqs',
        'pdp-reviews',
        'logo-wall',
      ],
      // Course Details hero — Figma-verbatim from node 675:8156 (desktop) /
      // 999:7170 (mobile). `heroTitle` overrides the catalog's longer
      // `title` for just the hero <h1> (both frames read "Fit Feet Course").
      heroTitle: 'Fit Feet Course',
      // Both frames show a single flat price, no sale/compare-at price —
      // `priceExact` matches this item's own top-level `price` (just with
      // Figma's own ".00"), so no `compareAtPrice` field is set.
      priceExact: '$185.00 USD',
      // Hero intro paragraph — desktop text kept canonical (trailing Figma
      // text-node whitespace trimmed, curly apostrophe normalized to
      // straight per this file's convention). Identical wording on mobile
      // (999:7170) — no desktop/mobile disagreement on this field, unlike
      // most others on this item.
      description:
        "Online program taught by Gait Happens' Doctors Conley and Perez to help you build a healthier body starting with your feet.",
      // Primary CTA (enroll, external — see CourseDetails.astro's Sole
      // Switch/Sole Switch Pro/Combating Bunions remap precedent: Figma's
      // own buybox is a cart/quantity-stepper "Add to Cart" flow, remapped
      // to a Kajabi enrollment link). Realistic Kajabi placeholder URL;
      // swap for the real offer/checkout URL once the course is live on
      // Kajabi.
      enrollHref: 'https://gaithappens.mykajabi.com/offers/fit-feet-course',
      enrollLabel: 'Enroll Now',
      // Pill group — the 9th-finding fix (see this item's own header
      // comment above for the full Figma evidence + reasoning). `label` is
      // Figma-verbatim ("Language", node I675:8156;264:1453 desktop /
      // I999:7170;181:1153 mobile — identical text on both frames, rendered
      // uppercase via CSS text-transform like every other caption label on
      // this page, not stored upper-cased here). `options` has no `href` on
      // any entry (unlinked in Figma — see header comment), so
      // CourseDetails.astro renders these as inert spans; `English` alone
      // carries `selected: true` (the one filled pill in both frames).
      pills: {
        label: 'Language',
        options: [
          { label: 'English', selected: true },
          { label: 'Spanish' },
          { label: 'French' },
          { label: 'Japanese' },
        ],
      },
      //
      // No `courseCard` — like Combating Bunions, this course's Figma hero
      // right column (675:8156 node I675:8156;173:147 / 999:7170 node
      // I999:7170;181:674) is a plain close-up PHOTO of feet, no overlaid
      // text/colored background (confirmed via get_design_context on both
      // breakpoints) — `heroImage` is used instead (mutually exclusive with
      // `courseCard`, see CourseDetails.astro's header comment).
      heroImage: '/images/plp/fit-feet.jpg',
      // Same placeholder PLP course shot every other image slot on this item
      // already reuses (`overview.image`, `features[].image`,
      // `instructors[].photo` below) — no dedicated hero photography exists
      // for this course yet.
      instructorsByline: 'Course By: Dr. Conley and Dr. Perez',
      // CLIENT-CONTENT FLAG: mobile's own instructors byline (999:7170)
      // reads "Course By: Dr. Conley and Dr. Riley" instead — Dr. Riley
      // doesn't teach this course (this page's own Your Instructors section,
      // both breakpoints, lists Conley + Perez, not Riley) — the same
      // mobile-only copy-paste error Combating Bunions' own byline hit.
      // Desktop's "Dr. Conley and Dr. Perez" is kept canonical (matches this
      // item's own top-level `description` and the real instructor roster
      // below).
      //
      // Course Overview — Figma 675:8157 (desktop) / 999:7171 (mobile).
      // Desktop kept canonical for `details`/`body` — mobile disagrees on
      // MORE than wording here (see the CLIENT-CONTENT FLAG below).
      overview: {
        image: '/images/plp/fit-feet.jpg',
        details: [
          { label: 'Course Length', value: '12 Weeks' },
          { label: 'Evidence Based', value: 'Yes' },
          { label: 'Course Structure', value: 'Online on demand' },
          { label: 'Course Style', value: 'Follow-Along Video Workouts' },
          {
            label: 'Audience',
            value:
              'Individuals with foot or lower body aches and pains that are keeping you from moving freely.',
          },
        ],
        // CLIENT-CONTENT FLAG: mobile's Audience value (999:7171) reads
        // "Anyone looking to understand how to choose healthy shoes for
        // themselves" — that's Sole Switch's own Audience sentence
        // (byte-for-byte, see that item's own `overview.details` above),
        // not this course's, and has nothing to do with Fit Feet — another
        // Sole-Switch-template copy-paste error. Mobile's 3rd/4th detail
        // labels also rename to "Course Format"/"Course Style" (dropping
        // "Follow-Along Video Workouts" down to just "Video lecture") —
        // desktop's 5-fact set above is kept canonical throughout. Mobile's
        // Course Concepts paragraph also carries 2 typos ("individualize",
        // "more with greater ease" instead of "individualized"/"move with
        // greater ease") not present in desktop's grammatically-correct
        // version below.
        body: 'This 12-week, clinician-informed program introduces foundational concepts centered on restoring foot function through individualized, progressive movement. Over a 12-week framework, participants explore how foot structure influences movement patterns while developing strength, mobility, and stability tailored to their specific foot type. This program helps individuals move with greater ease and confidence.',
      },
      // 4 Column feature band — Figma-verbatim heading + 4 blurbs from node
      // 675:8158 (desktop) / 999:7172 (mobile). No dedicated feature
      // photography exists for this course — `image` reuses this item's own
      // PLP course shot for all 4 cards, same placeholder approach every
      // other course's `features` array takes.
      featuresHeading: "What's Included:",
      features: [
        {
          image: '/images/plp/fit-feet.jpg',
          label: null,
          text: 'The Fit Feet Program includes a structured 12-week progression divided into four phases.',
        },
        {
          image: '/images/plp/fit-feet.jpg',
          label: null,
          text: 'Fifteen 25 minute follow-along workouts led by clinicians, with built-in modifications and progressions.',
        },
        {
          image: '/images/plp/fit-feet.jpg',
          label: null,
          text: 'Clinically curated exercises to target your feet and connect your feet to your hips, core, and more.',
        },
        {
          image: '/images/plp/fit-feet.jpg',
          label: null,
          // CLIENT-CONTENT FLAG: mobile's 4th blurb (999:7172) reads "When
          // the toes can properly splay, our foot and ankle muscles engage,
          // creating a stronger, more stable platform from which to propel
          // ourselves forward." — that's Sole Switch/Sole Switch Pro's own
          // 4th blurb verbatim, not written for this course. Desktop's
          // Fit-Feet-specific text is kept canonical.
          text: "You'll gain access to the Fit Feet community where you can ask questions and share your progress.",
        },
      ],
      // "You'll Stop and Instead" — Figma 996:8331 (desktop) / 999:7173
      // (mobile).
      youllStop: {
        stop: {
          lead: "You'll stop",
          body: 'chasing symptoms',
        },
        instead: {
          lead: "and instead you'll",
          body: 'focus on restoring the foundation of healthy movement through your feet.',
        },
      },
      // CLIENT-CONTENT FLAG (severe — not just wording drift): mobile's own
      // "You'll Stop and Instead" (999:7173) shows COMBATING BUNIONS' full
      // copy verbatim instead of this course's own — "You'll stop / thinking
      // surgery is your only option" and "and instead you'll / gain
      // confidence in your ability to reduce bunion pain and foot
      // limitations." has nothing to do with Fit Feet. Desktop's real
      // "chasing symptoms" / "restoring the foundation of healthy movement"
      // copy above is kept canonical.
      //
      // Comparison Chart — Figma-verbatim rows from node 996:8332 (desktop) /
      // 1037:16515 (mobile). This course's own comparison is "Fit Feet VS
      // Virtual Consultations" — `columns` uses the correct course names
      // exactly as they appear in the table's own column headers/CTA target
      // (see CLIENT-CONTENT FLAG below re: the big heading's own typo).
      comparison: {
        columns: ['Fit Feet', 'Virtual Consultations'],
        intro:
          'Trying to figure out which program is right for you? This table provides a brief overview of the differences between the Fit Feet Course and Virtual Consultations.',
        // CLIENT-CONTENT FLAG: mobile's own intro paragraph (1037:16515)
        // instead reads "...between the Sole Switch and Sole Switch Pro
        // courses." — a verbatim copy of Sole Switch's own intro text, not
        // updated for this course's actual Fit Feet/Virtual Consultations
        // comparison. Desktop's correct intro is kept canonical.
        //
        // CLIENT-CONTENT FLAG (the big <h2>, both breakpoints): the pulled
        // heading text literally reads "Feet Fit VS Virtual Consultation"
        // (word order swapped + singular "Consultation") — disagreeing with
        // this SAME frame's own column headers ("Fit Feet" / "Virtual
        // Consultations", used above and in every row). Since the rendered
        // `<h2>` is DERIVED from `columns` (ComparisonChart.astro), it can
        // only carry one canonical form of the course names — `columns`
        // above uses the correct, real course names (matching the table body
        // and this course's own catalog `title`/route), not the big
        // heading's own typo'd text.
        rows: [
          { label: 'Course Structure', values: ['Online', 'Online'] },
          { label: 'Course Length', values: ['12 Weeks', '3-6 Weeks'] },
          { label: 'Audience', values: ['Individuals', 'Individuals'] },
          { label: 'Evidence Based', values: ['Yes', 'Yes'] },
          { label: 'Continuing Education Credit', values: ['Yes', 'No'] },
          { label: 'Course Price', values: ['$185', '$699'] },
        ],
        // Rows agree byte-for-byte between desktop and mobile — no data
        // divergence here (unlike Combating Bunions' CE-Credit row).
        //
        // CTA — Figma-verbatim button text on BOTH frames ("View Sole Switch
        // Pro Course").
        //
        // CLIENT-CONTENT FLAG: this CTA text names neither course in this
        // table (Fit Feet vs Virtual Consultations) — it's Sole Switch's own
        // CTA copy, apparently baked into this shared "Comparison Chart"
        // component's default state rather than updated per-instance, and
        // unlike every prior mismatch on this branch it's identical on BOTH
        // breakpoints (not just a mobile-only drift). Kept Figma-verbatim
        // (label text unchanged) and pointed at the internal route that
        // literally matches that label (`/courses/sole-switch-pro`, an
        // existing built route) rather than inventing a different target
        // (e.g. a "View Virtual Consultations" link, which — beyond not
        // being what Figma's text says — would point at a still-unbuilt
        // placeholder route). Needs a real client decision before this ships
        // past the reference build.
        cta: { label: 'View Sole Switch Pro Course', href: '/courses/sole-switch-pro' },
      },
      // Testimonial — Figma-verbatim from node 675:8160 (desktop) / 999:7175
      // (mobile). Identical quote/author/rating on both frames — no
      // desktop/mobile disagreement here, unlike every other section on this
      // page. No `role` line on either frame (name-only attribution, same as
      // Sole Switch Pro's Phyllis). See tests/testimonial.test.mjs — array
      // shape required.
      testimonial: [
        {
          quote: [
            "I'm very thankful for this program. Your exercises are easy to do anywhere, especially those first couple weeks. The videos are great. I've learned so much about my foot. I'm thankful to be able to walk without excruciating pain like I experienced for 8 months before starting this program.",
          ],
          author: 'Michele Banfield',
          role: null,
          rating: 5,
        },
      ],
      // Your Instructors — Figma-verbatim from node 675:8161 (desktop) /
      // 999:7176 (mobile). Identical 2 instructors/bios/credentials on both
      // frames — no desktop/mobile disagreement here. Both instructors and
      // both bios are byte-for-byte the SAME ones Combating Bunions already
      // carries (same 2 clinicians teach all 3 courses) — reused verbatim.
      // `photo` reuses this item's own PLP course shot for both cards (no
      // dedicated instructor photography exists yet, same placeholder
      // convention every other course takes).
      instructors: [
        {
          photo: '/images/plp/fit-feet.jpg',
          name: 'Dr. Courtney Conley',
          credential: 'Lakewood, Colorado',
          bio: [
            "Dr. Courtney Conley is a national bestselling author, international educator, and one of the world's foremost authorities on foot and gait health. Her book, Walk, hit both the USA Today and Amazon bestseller lists, resonating with readers eager to understand the profound connection between foot function and whole-body health. The book's success has brought Dr. Conley to some of the most respected platforms in health and wellness media, including appearances on The Peter Attia Drive Podcast, Diary of a CEO, Feel Better, Live More with Dr. Rangan Chatterjee, as well as national television features on CBS Mornings and Fox & Friends.",
            "Dr. Conley holds a Doctorate in Chiropractic Medicine and two Bachelor's degrees in Kinesiology and Human Biology. With nearly 25 years of clinical practice, she has worked with professional athletes from organizations including the Phoenix Suns, New York Yankees, Cleveland Browns, New York Giants, and San Francisco 49ers. She has also collaborated with medical experts across the country, addressing complex foot and gait challenges at the highest level of performance. She currently serves as Head of Patient Care at Total Health Solutions and Total Health Performance in Lakewood, Colorado—premier clinics known for comprehensive, rehabilitation-focused patient care where she is committed to helping people improve their lives one step at a time.",
            'That same commitment led her to found and lead Gait Happens, an education enterprise leading a paradigm shift in foot health by empowering people worldwide to reclaim optimal foot function through science-backed training and protocols. Gait Happens offers a comprehensive ecosystem of resources — from professional education for practitioners to consumer training programs and personalized consultations with top-of-field specialists — all grounded in research and designed to deliver real, measurable results. With a focus on natural, preventative approaches to foot and gait health, Gait Happens has built a global community of individuals committed to moving better and living pain-free, offering a proven alternative to unnecessary surgical intervention through education and evidence-based care.',
            'An internationally recognized speaker, Dr. Conley shares her expertise to clinicians and consumers alike through in-person and online lectures on foot mechanics and gait dynamics. Her work spans authorship, mentorship, patent and curriculum development, and the creation of pioneering foot and gait methodologies. Yet at the heart of every lecture, protocol, and patient interaction is the same driving belief: real strength starts from the ground up, and healthy feet are the foundation every body needs to move through life with confidence and ease.',
          ],
        },
        {
          photo: '/images/plp/fit-feet.jpg',
          name: 'Dr. Jenifer Perez, DC',
          credential: 'Lafayette, Colorado',
          bio: [
            'Dr. Jen Perez is the co-owner and Vice President of Gait Happens. As both an educator and a clinician, her mission is to empower as many people as possible to take charge of their lower body health so they can get back to what they love.',
          ],
        },
      ],
      // Cross-sell band — Figma-verbatim heading from the "Product Cards"
      // frame, node 1006:7484 (desktop) / 1106:15515 (mobile). Identical
      // content on both breakpoints — no desktop/mobile disagreement here.
      //
      // CLIENT-CONTENT FLAG: this course's own 3 cards read "Combating
      // Bunions" / "Fit Feet Course" / "Sole Switch Course" — the SECOND
      // card literally cross-sells THIS SAME course from its own page (a
      // self-referencing link), the same "Product Cards" shared/reused-frame
      // artifact already flagged on Combating Bunions' own crossSell (that
      // item's first card self-referenced instead). Kept Figma-verbatim per
      // this task's "content is Figma-verbatim, never invent" instruction
      // rather than editorially swapping it for a 4th course.
      crossSell: {
        heading: 'More Resources For Your Movement Journey',
        itemIds: ['combating-bunions', 'fit-feet', 'sole-switch'],
        shopAllHref: '/collections/all',
      },
      // FAQs — Figma node 1002:10523 (desktop) / 999:7178 (mobile).
      //
      // CRITICAL FLAG: mobile's FAQ accordion doesn't just disagree on
      // wording — it shows 5 ENTIRELY DIFFERENT questions ("Virtual
      // Consultations", "Gait Happens Education", "Online Courses",
      // "Memberships", "Gait Happens Products" — generic site-wide category
      // labels, not course questions), confirmed via get_design_context on
      // both node trees — the same mobile-FAQ artifact already flagged on
      // Combating Bunions (in fact these are the SAME 5 generic labels).
      // Desktop's 7 real, course-specific question labels are used below
      // instead, per this task's "keep desktop canonical" brief.
      //
      // Neither frame contains any ANSWER copy for its own questions (both
      // are static mockups of the collapsed state only) — same situation
      // Sole Switch Pro's/Combating Bunions' own FAQ sections hit. Per this
      // task's explicit instruction NOT to author plausible-sounding
      // invented answers, each row below is handled per its own actual
      // grounding:
      //   - Row 1 (athletic ability): restates this SAME entry's already-
      //     Figma-verbatim `features[1]` text ("built-in modifications and
      //     progressions") in plain customer-facing prose.
      //   - Row 6 (Fit Feet vs. Virtual Consultation): restates this SAME
      //     entry's already-Figma-verbatim `comparison` rows (length,
      //     structure, price).
      //   - Rows 2, 3, 4, 5 & 7 (equipment; watch-count/access; app;
      //     diagnosis suitability x2): NO grounding data exists anywhere in
      //     this file for any of these, and none can be answered from real
      //     data without inventing a new fact — 2 of them (5 & 7) are
      //     medical-suitability questions, where inventing an answer would
      //     be an unfounded clinical claim, not just a content gap. Each
      //     `content` value is a short, neutral "copy pending" placeholder —
      //     no invented factual claim about the course. This disclosure
      //     lives only here and in this task's report, never in the
      //     rendered HTML (see Combating Bunions' own FAQ comment for the
      //     precedent this follows).
      faqs: [
        {
          label: "I'm not very athletic, can I still do this program?",
          content:
            "<p>Yes — the program's fifteen 25-minute follow-along workouts include built-in modifications and progressions, so they can be adapted to different fitness levels.</p>",
        },
        {
          label: 'What equipment will I need to use in this program?',
          content: '<p>Details on equipment for this program are coming soon.</p>',
        },
        {
          label: 'How many times will I be able to watch the program?',
          content: '<p>Details on program access are coming soon.</p>',
        },
        {
          label: 'Is there an app I can use?',
          content: '<p>Details on a companion app are coming soon.</p>',
        },
        {
          label: 'I have a specific diagnosis. Will the Fit Feet Program work for me?',
          content: "<p>Details on this program's suitability for specific diagnoses are coming soon.</p>",
        },
        {
          label: "What's the difference between the Fit Feet Program and a Virtual Consultation?",
          content:
            '<p>The Fit Feet Program is a $185, 12-week structured, on-demand program for individuals. Virtual Consultations run $699 over 3-6 weeks. See the comparison table above for the full breakdown.</p>',
        },
        {
          label: 'Will the Fit Feet Program treat my specific diagnosis?',
          content: '<p>Details on treating specific diagnoses are coming soon.</p>',
        },
      ],
      // Reviews placeholder — same static reviews-app-screenshot values
      // every product/course PDP reuses (see Toe Spacers' `reviews` comment
      // / PdpReviews.astro's note); this course has no real review data any
      // more than the others do.
      reviews: {
        rating: 4.75,
        count: 12,
        distribution: [
          { stars: 5, count: 11 },
          { stars: 4, count: 0 },
          { stars: 3, count: 0 },
          { stars: 2, count: 1 },
          { stars: 1, count: 0 },
        ],
      },
    },
  },
  {
    id: 'virtual-consultations',
    handle: 'virtual-consultations',
    title: 'Virtual Consultations',
    kind: 'course',
    badges: ['Course', 'Product'],
    price: '$699 USD',
    priceRange: null,
    rating: 5,
    reviewCount: 128,
    description: 'Our team believes every case, every person, every answer is different.',
    image: '/images/plp/virtual-consultations.jpg',
    href: '/courses/virtual-consultations',
    cta: 'View Course',
    variants: null,
    sizeChart: null,
  },

  // ---- Courses — Professionals ----------------------------------------

  {
    id: 'sole-switch-pro',
    handle: 'sole-switch-pro',
    title: 'Sole Switch Pro',
    kind: 'course',
    badges: ['Course', 'Professional'],
    price: '$59 USD', // (sample)
    priceRange: null,
    description: 'A course to help you make better footwear recommendations for your clients.',
    image: '/images/plp/sole-switch-pro.jpg',
    href: '/courses/sole-switch-pro',
    cta: 'View Course',
    // Task 2 (Course Details hero, 675:4353): 5-star rating, 5 reviews —
    // sourced top-level exactly like every product's PDP hero (see e.g. Toe
    // Spacers' `rating`/`reviewCount` comment above), not duplicated under
    // `pdp`. This also turns rating on for this item's PLP card (PlpCard.astro
    // only renders `<StarRating>` when `item.rating` is set) — an intentional
    // side effect of reusing the single top-level field, not a separate PLP
    // change.
    rating: 5,
    reviewCount: 5,
    variants: null,
    sizeChart: null,
    // Task 1 (Course PDP Chunk A) — scaffolds the Sole Switch Pro course
    // PDP on the same data-driven Pdp.astro composer the 6 products use
    // (see their `sections` comments above). This 11-entry list is the
    // FULL intended course-page section order. As of Task 8 (final task):
    // every entry — `four-column`, `cross-sell`, `pdp-reviews`, `logo-wall`
    // (reused-from-products), `course-details`, `course-overview`,
    // `youll-stop-and-instead`, `comparison-chart`, `testimonial`,
    // `your-instructors`, and `faqs` (course-only, built by Tasks 2-8) — has
    // data below and a Pdp.astro REGISTRY entry, so the full course PDP now
    // assembles end to end.
    pdp: {
      sections: [
        'course-details',
        'course-overview',
        'four-column',
        'youll-stop-and-instead',
        'comparison-chart',
        'testimonial',
        'your-instructors',
        'cross-sell',
        'faqs',
        'pdp-reviews',
        'logo-wall',
      ],
      // Task 2 (Course Details hero) — Figma-verbatim price/copy/CTA labels
      // from node 675:4353 (desktop) / 1109:14377 (mobile — the "Sole Switch
      // Pro Page" > "Course Details" instance under the professional-courses
      // mobile frame 1109:14374). See CourseDetails.astro's header comment
      // for the cart->enroll CTA remap this task's brief mandated.
      //
      // `heroTitle` overrides the catalog's shorter `title` ("Sole Switch
      // Pro") for just the hero <h1> — the frame reads "Sole Switch Pro
      // Course"; `title` itself is left alone since nav/breadcrumbs/PLP
      // cards/the page <title> all read it too.
      heroTitle: 'Sole Switch Pro Course',
      // `priceExact` intentionally differs from the top-level `price` ($59,
      // marked "(sample)") above — same "PDP hero shows the Figma-verbatim
      // exact price, top-level `price` is the separate PLP-card sample"
      // split every product's catalog entry already has (see Toe
      // Strengtheners' sale-price case) — flagged here, not silently
      // reconciled.
      priceExact: '$150.00 USD',
      // Desktop's intro paragraph is grammatically clean ("...to give you
      // better, more individualized..."); the mobile frame's copy has an
      // apparent authoring typo ("...to give you make better..."). Since
      // this is a single field rendered at both breakpoints (no separate
      // mobile copy slot), the desktop frame's text was kept as the one
      // canonical source, per this task's "pull desktop first" directive —
      // flagged, not silently "corrected" into a third wording.
      description:
        'A two-hour online course to give you better, more individualized, footwear recommendations for your clients.',
      // Primary CTA (enroll, external — see CourseDetails.astro). Realistic
      // Kajabi placeholder URL; swap for the real offer/checkout URL once
      // the course is live on Kajabi.
      enrollHref: 'https://gaithappens.mykajabi.com/offers/sole-switch-pro-course',
      enrollLabel: 'Enroll Now',
      // Pill group — Task 4 follow-up (Chunk B1's 9th-finding fix) migrated
      // this off the old single-purpose tier-pill field onto the
      // generalized `pills` shape CourseDetails.astro now renders (see that
      // file's header comment). Figma's outline "Sole Switch Basic" pill,
      // kept as a real link (verbatim label) to the Basic-tier course's own
      // page (`/courses/sole-switch`, an existing placeholder route — see
      // sitemap.js). The Figma frame's second, filled "Sole Switch Pro"
      // pill is NOT reproduced as a 3rd element — see CourseDetails.astro's
      // header comment for why. `label` is this page's own real Figma
      // caption ("Select your course", node 675:4353).
      pills: {
        label: 'Select your course',
        options: [{ label: 'Sole Switch Basic', href: '/courses/sole-switch' }],
      },
      // Branded teal card (right column) — Figma-verbatim text read off the
      // frame's flattened screenshot (see CourseDetails.astro's header
      // comment: no real text layers to pull structurally). `titleLines` is
      // an array so the exact 2-line break shown in both the desktop and
      // mobile screenshots renders reliably.
      courseCard: {
        titleLines: ['SoleSwitch', 'Pro Course'],
        tag: 'For Health Professionals',
      },
      // Decorative byline under the CTAs — Figma-verbatim text; the 2
      // avatar circles are flat placeholders (no real instructor
      // photography yet). Task 7 ("Your Instructors") owns real bios/photos
      // further down the page.
      instructorsByline: 'Course By: Dr. Conley and Dr. Riley',
      // Task 3 (Course Overview) — Figma 675:4354 (desktop, file
      // FX7PDNvhZwyozODaq8Q8i7) kept as the canonical source for `details`;
      // see CourseOverview.astro's header comment for why (mobile node
      // 1109:14378 disagrees on the 3rd/4th facts AND the Audience wording,
      // and `details` has no separate desktop/mobile slot). `body` is the
      // frame's closing "Course Concepts" paragraph — identical on both
      // desktop and mobile screenshots, trailing whitespace trimmed (a text
      // node artifact, not wording).
      //
      // No dedicated course-overview photography exists (this course has
      // never had a PDP before) — `image` reuses the same PLP course shot
      // every other slot on this page already reuses (see the `features`
      // comment below).
      overview: {
        image: '/images/plp/sole-switch-pro.jpg',
        details: [
          { label: 'Course Length', value: '2 Hours 13 Minutes' },
          { label: 'Evidence Based', value: 'Yes' },
          { label: 'Course Structure', value: 'Online on demand' },
          { label: 'Continuing Education Credit', value: 'Yes' },
          {
            label: 'Audience',
            value:
              'Healthcare professionals looking to improve their footwear recommendations for clients and patients.',
          },
        ],
        body: 'Understanding the key features of shoes, the concept of the shoe spectrum and where to sit on the spectrum, finding your baseline and learning what shoes are appropriate for you, transition strategies, and a PDF shoe guide.',
      },
      // 4 Column feature band — Figma-verbatim heading + 4 blurbs from the
      // "What to Expect" frame, node 675:4355 (file FX7PDNvhZwyozODaq8Q8i7).
      // That frame's own heading literally reads "...Sole Switch Course"
      // (not "...Sole Switch Pro Course") — kept Figma-verbatim per this
      // task's instruction rather than silently "corrected", same
      // verbatim-over-assumed precedent the product PDPs set (e.g. Toe
      // Dynamometer's accordion links stay literal URLs). The 4th blurb's
      // trailing comma with no closing clause ("...muscles engage,") is
      // also copied verbatim off the frame, not rewritten — the source
      // text is a fragment there too.
      //
      // No dedicated course photography exists yet (this course has never
      // had a PDP before), so `image` reuses the one PLP course shot for
      // all 4 cards — the same placeholder approach every product's
      // `features` array takes for the same reason (see Toe Spacers'
      // `features` comment).
      featuresHeading: 'What to Expect in the Sole Switch Course',
      features: [
        {
          image: '/images/plp/sole-switch-pro.jpg',
          label: null,
          text: 'Walk away with a better understanding of how to select healthy footwear! Plus, get a bonus PDF footwear guide!',
        },
        {
          image: '/images/plp/sole-switch-pro.jpg',
          label: null,
          text: 'Receive lifetime access to a course written by clinicians with over 30 years of experience helping patients build foot health naturally.',
        },
        {
          image: '/images/plp/sole-switch-pro.jpg',
          label: null,
          text: 'Learn specific and helpful strategies to help transition safely to less restrictive natural footwear.',
        },
        {
          image: '/images/plp/sole-switch-pro.jpg',
          label: null,
          text: 'When the toes can properly splay, our foot and ankle muscles engage,',
        },
      ],
      // Task 4 ("You'll Stop and Instead" band) — Figma-verbatim copy from
      // node 675:4356 (desktop, file FX7PDNvhZwyozODaq8Q8i7) / 1109:14380
      // (mobile — the "Sole Switch Pro Page" > "You'll Stop and Instead"
      // instance inside the professional-courses mobile frame 1109:14374).
      // Both frames pair the SAME lead-in/body text (mobile only differs by
      // a CSS-only capitalize transform — see YoullStopAndInstead.astro's
      // header comment), so there's no desktop/mobile wording disagreement
      // to flag here, unlike `overview` above. `lead` is the frame's own
      // short framing phrase ("You'll stop" / "and instead you'll"); `body`
      // is the course-specific pain point / benefit sentence completing it.
      // Trailing whitespace on the "instead" body (a text-node artifact in
      // Figma's pulled code, not wording) is trimmed, same precedent as
      // `overview.body` above.
      youllStop: {
        stop: {
          lead: "You'll stop",
          body: 'feeling frustrated by confusing shoe feature terminology',
        },
        instead: {
          lead: "and instead you'll",
          body: 'gain confidence in your ability to look for key features when shoe shopping.',
        },
      },
      // Task 5 (Comparison Chart) — Figma-verbatim from node 675:4357
      // (desktop, file FX7PDNvhZwyozODaq8Q8i7) / 1109:14381 (mobile — the
      // "Sole Switch Pro Page" > "Comparison Chart" instance inside the
      // professional-courses mobile frame 1109:14374). Both frames agree on
      // every column name, row label, and cell value here (no
      // desktop/mobile disagreement to flag on the table itself, unlike
      // `overview` above — see `intro` below for the one place this
      // section's OWN content differs from Sole Switch's). `columns` are
      // the 2 product names ("Sole Switch"
      // vs "Sole Switch Pro" — this course's OWN page, compared against its
      // Basic-tier sibling); `rows` are the 6 feature rows in the frames'
      // own top-to-bottom order.
      //
      // Each row's `values` entries are plain STRINGS, not booleans, even
      // for the two yes/no-shaped rows (Evidence Based, Continuing
      // Education Credit) — both frames render those as literal "Yes"/"No"
      // TEXT, not check/× icon marks, so the data stays verbatim rather
      // than reinterpreting them as boolean icons the design doesn't show.
      // ComparisonChart.astro's cell renderer still supports a `true`/
      // `false` value (rendered as an accessible check/× glyph) for any
      // future comparison table whose Figma frame actually uses one.
      //
      // `cta` (component-generalization fix): this course's own CTA
      // upsells nothing beyond itself — it IS the Pro course's own page —
      // so `cta.href` reproduces this item's `enrollHref` above byte-for-
      // byte (the same external Kajabi link ComparisonChart.astro's CTA
      // already pointed at before this field existed), preserving today's
      // rendered output exactly. `cta.label` is the frame's own
      // Figma-verbatim button text. Because this href is external,
      // ComparisonChart.astro's `isExternal` check still spreads
      // `target="_blank" rel="noopener noreferrer"` onto this CTA — the
      // same attributes it unconditionally carried before that fix, so
      // this page's rendered HTML is unchanged.
      //
      // `intro` (review fix wave 2): THIS course's own comparison node
      // (675:4357, main-component subtree 1017:8983/1017:8987) is Dr.
      // Courtney Conley's bio, "Dr. Courtney Conley holds a Doctorate in
      // Chiropractic Medicine as well as two bachelor's degrees in
      // Kinesiology and Human Biology. The founder and creator of Gait
      // Happens." — reproduced byte-for-byte from what was previously
      // ComparisonChart.astro's own hardcoded text (see that component's
      // header comment), so moving it here doesn't change this page's
      // rendered HTML.
      comparison: {
        columns: ['Sole Switch', 'Sole Switch Pro'],
        intro:
          "Dr. Courtney Conley holds a Doctorate in Chiropractic Medicine as well as two bachelor's degrees in Kinesiology and Human Biology. The founder and creator of Gait Happens.",
        rows: [
          { label: 'Course Structure', values: ['Online', 'Online'] },
          { label: 'Course Length', values: ['50 Minutes', '2 Hours 13 Min'] },
          { label: 'Audience', values: ['Individuals', 'Professionals'] },
          { label: 'Evidence Based', values: ['Yes', 'Yes'] },
          { label: 'Continuing Education Credit', values: ['No', 'Yes'] },
          { label: 'Course Price', values: ['$50', '$150'] },
        ],
        cta: {
          label: 'View Sole Switch Pro Course',
          href: 'https://gaithappens.mykajabi.com/offers/sole-switch-pro-course',
        },
      },
      // Task 6 (Testimonial band) — Figma-verbatim from node 1106:15576
      // (desktop, file FX7PDNvhZwyozODaq8Q8i7) / 1109:14382 (mobile — the
      // "Sole Switch Pro Page" > "Testimonial" instance inside the
      // professional-courses mobile frame 1109:14374). Both frames show the
      // identical single testimonial (same quote, same author, same 5-star
      // rating) — no desktop/mobile disagreement to flag here.
      //
      // `quote` is an array of paragraph strings (one per `<p>` in the
      // pulled Figma code); the first paragraph's embedded `\n` reproduces
      // a genuine, deliberate `<br>` between two sentences in the source
      // (present at both the 916px desktop card and the 342px mobile card,
      // so it's real data, not width-based reflow) — see
      // Testimonial.astro's header comment. `role` has no value in either
      // frame (Phyllis' attribution is name-only, no title/role line) —
      // kept `null` rather than omitted, since it's part of this task's
      // brief-mandated `{ quote, author, role, rating }` shape.
      //
      // Chunk B1 migrated this field to an ARRAY of testimonials (Sole
      // Switch Pro still has exactly one entry) so Testimonial.astro's
      // carousel and Tasks 2-5's data all share a single shape — see
      // tests/testimonial.test.mjs.
      testimonial: [
        {
          quote: [
            "This course put me on track for many positive changes in my foot health and strength!\nI also did Movement RX and also bought the Basic Foot health kit and have benefited in so many ways!",
            'I am pain free and have stronger feet and up the chain benefits!',
            'LOVE GAIT HAPPENS and follow along in podcasts, IG and YouTube!',
          ],
          author: 'Phyllis',
          role: null,
          rating: 5,
        },
      ],
      // Task 7 (Your Instructors) — Figma-verbatim from node 1007:7830
      // (desktop, file FX7PDNvhZwyozODaq8Q8i7) / 1109:14383 (mobile — the
      // "Sole Switch Pro Page" > "Your Instructors" instance inside the
      // professional-courses mobile frame 1109:14374). Both frames show the
      // identical 2 instructors, same names/credential-lines/bios — no
      // desktop/mobile disagreement to flag here, unlike `overview` above.
      //
      // `credential` holds each card's teal second line as the frame
      // actually renders it — a LOCATION ("Lakewood, Colorado" / "Salem,
      // Massachusetts"), not a professional credential (Riley's real
      // credential, "DPT", is already part of her `name` string below) —
      // see YourInstructors.astro's header comment for why the field keeps
      // this name regardless. `bio` is an array of paragraph strings, one
      // per real `<p>` in the pulled Figma code (Conley's is a genuine
      // 4-paragraph biography; Riley's is a single paragraph).
      //
      // No dedicated instructor photography exists yet (see this file's
      // `instructorsByline` comment above) — `photo` reuses the same PLP
      // course shot every other slot on this page already reuses.
      instructors: [
        {
          photo: '/images/plp/sole-switch-pro.jpg',
          name: 'Dr. Courtney Conley',
          credential: 'Lakewood, Colorado',
          bio: [
            "Dr. Courtney Conley is a national bestselling author, international educator, and one of the world's foremost authorities on foot and gait health. Her book, Walk, hit both the USA Today and Amazon bestseller lists, resonating with readers eager to understand the profound connection between foot function and whole-body health. The book's success has brought Dr. Conley to some of the most respected platforms in health and wellness media, including appearances on The Peter Attia Drive Podcast, Diary of a CEO, Feel Better, Live More with Dr. Rangan Chatterjee, as well as national television features on CBS Mornings and Fox & Friends.",
            "Dr. Conley holds a Doctorate in Chiropractic Medicine and two Bachelor's degrees in Kinesiology and Human Biology. With nearly 25 years of clinical practice, she has worked with professional athletes from organizations including the Phoenix Suns, New York Yankees, Cleveland Browns, New York Giants, and San Francisco 49ers. She has also collaborated with medical experts across the country, addressing complex foot and gait challenges at the highest level of performance. She currently serves as Head of Patient Care at Total Health Solutions and Total Health Performance in Lakewood, Colorado—premier clinics known for comprehensive, rehabilitation-focused patient care where she is committed to helping people improve their lives one step at a time.",
            'That same commitment led her to found and lead Gait Happens, an education enterprise leading a paradigm shift in foot health by empowering people worldwide to reclaim optimal foot function through science-backed training and protocols. Gait Happens offers a comprehensive ecosystem of resources — from professional education for practitioners to consumer training programs and personalized consultations with top-of-field specialists — all grounded in research and designed to deliver real, measurable results. With a focus on natural, preventative approaches to foot and gait health, Gait Happens has built a global community of individuals committed to moving better and living pain-free, offering a proven alternative to unnecessary surgical intervention through education and evidence-based care.',
            'An internationally recognized speaker, Dr. Conley shares her expertise to clinicians and consumers alike through in-person and online lectures on foot mechanics and gait dynamics. Her work spans authorship, mentorship, patent and curriculum development, and the creation of pioneering foot and gait methodologies. Yet at the heart of every lecture, protocol, and patient interaction is the same driving belief: real strength starts from the ground up, and healthy feet are the foundation every body needs to move through life with confidence and ease.',
          ],
        },
        {
          photo: '/images/plp/sole-switch-pro.jpg',
          name: 'Dr. Allison Riley, DPT',
          credential: 'Salem, Massachusetts',
          bio: [
            'Dr. Allison Riley has a passion for helping people recognize that movement is a powerful way to get and stay healthy, active, and happy. She has had an interest in lower body injuries and gait since early in her career.',
          ],
        },
      ],
      // Cross-sell band — Figma-verbatim heading from the "Product Cards"
      // frame, node 1021:14005. That frame's 3 cards ("Functional Gait
      // Assessment 1", "Gait Foundations Course", "Gait Happens Trainer
      // Cert.") map to these 3 real Professionals-course catalog ids (their
      // own `title`/`image`/`href` are what CrossSell.astro actually
      // renders — see ../plp/CrossSell.astro, it looks items up by id and
      // ignores any label text passed here). `shopAllHref` points at the
      // Professionals course PLP (matching the section's own "for
      // Professionals" framing) rather than the all-products collection
      // every product PDP's cross-sell uses.
      crossSell: {
        heading: 'More Courses for Professionals',
        itemIds: ['functional-gait-assessment-l1', 'gait-foundations', 'trainer-certification'],
        shopAllHref: '/collections/courses-professionals',
      },
      // Task 8 (FAQs — final section, Sole Switch Pro assembly) —
      // Figma-verbatim `label`s from node 1027:12323 (desktop, file
      // FX7PDNvhZwyozODaq8Q8i7) / 1109:14385 (mobile — the "Sole Switch Pro
      // Page" > "FAQs" instance inside the professional-courses mobile frame
      // 1109:14374). Both frames show the identical 4 questions, same
      // top-to-bottom order — no desktop/mobile disagreement to flag here.
      //
      // `content` is NOT Figma-verbatim, unlike every other field in this
      // entry — see Faqs.astro's header comment for the full explanation:
      // both frames are static mockups of the accordion's COLLAPSED state
      // only, with no expanded-state panel, hidden layer, or component-doc
      // string anywhere carrying real answer copy (confirmed via
      // get_design_context on both node trees plus a search_design_system
      // sweep of every library referenced from this file, including the
      // "Question"/"FAQs" component_sets in the Gait Happens Design System
      // library itself). Each row's `content` below is therefore AUTHORED
      // copy, disclosed per-row:
      //   - Row 1 ("right for me"): restates this SAME entry's already-
      //     Figma-verbatim `overview.details` Audience line + `description`
      //     — grounded in real, verified data, not invented.
      //   - Row 4 ("Pro Course vs. regular course"): restates this SAME
      //     entry's already-Figma-verbatim `comparison` table numbers
      //     (course length, audience, CE credit) — grounded, not invented.
      //   - Rows 2 & 3 (orthotics; flat feet/high arches): NO grounding
      //     data exists anywhere in this file for either question. Written
      //     conservatively — general framing, no new clinical claims — as a
      //     clearly-flagged placeholder pending real client-approved copy.
      // Flag this loudly in any downstream review: rows 2 & 3 in particular
      // need real answers from Gait Happens before this ships past the
      // reference build.
      faqs: [
        {
          label: 'Is this mini-course right for me?',
          content:
            '<p>Yes — this course is built for healthcare professionals (physical therapists, chiropractors, trainers, and other clinicians) who want to give clients more individualized footwear recommendations. If foot health, gait, or movement is part of your practice, Sole Switch Pro was written for you.</p>',
        },
        {
          label: 'I wear orthotics, should I still take this course?',
          content:
            "<p>Yes. The course covers the shoe spectrum and how to evaluate footwear features broadly, so the framework applies whether or not a client wears orthotics — you'll come away with a wider set of tools, not a one-size-fits-all rule.</p>",
        },
        {
          label: 'Do you talk about shoes for flat feet? What about high arches?',
          content:
            "<p>Yes. The course walks through the shoe spectrum and how to find the right baseline across a range of foot shapes and arch types, so you'll leave with a framework you can apply to different client presentations.</p>",
        },
        {
          label: 'Does the Pro Course include everything in the regular course?',
          content:
            '<p>Sole Switch Pro builds on the original Sole Switch course with expanded, professional-level content (2 hours 13 minutes vs. 50 minutes) plus Continuing Education Credit, which the original course does not offer.</p>',
        },
      ],
      // Reviews placeholder — same static reviews-app-screenshot values
      // every product PDP reuses (see Toe Spacers' `reviews` comment /
      // PdpReviews.astro's note); this course has no real review data any
      // more than the products do.
      reviews: {
        rating: 4.75,
        count: 12,
        distribution: [
          { stars: 5, count: 11 },
          { stars: 4, count: 0 },
          { stars: 3, count: 0 },
          { stars: 2, count: 1 },
          { stars: 1, count: 0 },
        ],
      },
    },
  },
  {
    id: 'gait-foundations',
    handle: 'gait-foundations',
    title: 'Gait Foundations',
    kind: 'course',
    badges: ['Course', 'Professional'],
    price: '$29 USD',
    priceRange: null,
    description: 'Improve your patient outcomes with even the most complex cases.',
    image: '/images/plp/gait-foundations.jpg',
    href: '/courses/gait-foundations',
    cta: 'View Course',
    variants: null,
    sizeChart: null,
  },
  {
    id: 'functional-gait-assessment-l1',
    handle: 'functional-gait-assessment-l1',
    title: 'Functional Gait Assessment Level 1',
    kind: 'course',
    badges: ['Course', 'Professional'],
    price: '$249 USD', // (sample)
    priceRange: null,
    rating: 5,
    reviewCount: 28,
    description: 'Our Level 1 FGA course is designed to sharpen your gait assessment and clinical reasoning.',
    image: '/images/plp/functional-gait-assessment-l1.jpg',
    href: '/courses/functional-gait-assessment-l1',
    cta: 'View Course',
    variants: null,
    sizeChart: null,
  },
  {
    id: 'gait-guru-membership',
    handle: 'gait-guru-membership',
    title: 'Gait Guru Membership',
    kind: 'course',
    badges: ['Course', 'Professional'],
    price: '$150 USD',
    priceRange: null,
    description: 'The pro-level membership to keep you one step ahead.',
    image: '/images/plp/gait-guru-membership.jpg',
    href: '/courses/gait-guru-membership',
    cta: 'View Course',
    variants: null,
    sizeChart: null,
  },
  {
    id: 'trainer-certification',
    handle: 'trainer-certification',
    title: 'Trainer Certification',
    kind: 'course',
    badges: ['Course', 'Professional'],
    price: '$399 USD', // (sample)
    priceRange: null,
    description: 'Get certified and featured in our Certified Foot Health directory.',
    image: '/images/plp/trainer-certification.jpg',
    href: '/courses/trainer-certification',
    cta: 'View Course',
    variants: null,
    sizeChart: null,
  },
];

// ---- Collections --------------------------------------------------------

const individualsIntro = {
  heading: 'Why Gait Happens courses for individuals?',
  body: "Our courses are built by doctors of physical therapy who specialize in foot health, translating clinical expertise into simple, step-by-step guidance you can follow at home. Whether you're managing bunions, choosing better shoes, or rebuilding strength from the ground up, each course gives you a clear plan and the confidence to stick with it.",
};

const professionalsIntro = {
  heading: 'Why Gait Happens courses for professionals?',
  body: 'Built for clinicians, trainers, and footwear specialists, our professional courses translate the latest gait and biomechanics research into practical tools you can use with clients the same day. Earn credentials, sharpen your assessment skills, and join a growing network of Gait Happens-certified practitioners.',
};

const coursesCrossSell = {
  heading: 'Shop Our Best Selling Courses',
  itemIds: ['foot-fest', 'sole-switch', 'fit-feet'],
  shopAllHref: '/collections/all-courses',
};

export const collections = {
  '/collections/all': {
    title: 'Shop All Products',
    // 'mobility-ball' appended (Task 7 — new catalog item, wasn't part of
    // any collection before this task).
    itemIds: ['toe-spacers', 'foot-health-kit', 'cork-supplement', 'toe-strengtheners', 'toe-dynamometer', 'walk', 'mobility-ball'],
    crossSell: coursesCrossSell,
  },
  '/collections/best-sellers': {
    title: 'Best Sellers',
    itemIds: ['toe-spacers', 'walk', 'foot-health-kit'],
    crossSell: coursesCrossSell,
  },
  '/collections/featured': {
    title: 'Featured Products',
    itemIds: ['foot-health-kit', 'cork-supplement', 'toe-dynamometer'],
    crossSell: coursesCrossSell,
  },
  '/collections/courses-individuals': {
    title: 'Gait Happens Individuals Courses',
    intro: individualsIntro,
    itemIds: ['foot-fest', 'sole-switch', 'combating-bunions', 'fit-feet', 'virtual-consultations'],
    crossSell: {
      heading: 'Shop Our Products',
      itemIds: ['toe-spacers', 'foot-health-kit', 'toe-strengtheners'],
      shopAllHref: '/collections/all',
    },
  },
  '/collections/courses-professionals': {
    title: 'Gait Happens Professionals Courses',
    intro: professionalsIntro,
    itemIds: ['sole-switch-pro', 'gait-foundations', 'functional-gait-assessment-l1', 'gait-guru-membership', 'trainer-certification'],
    // Teal CTA cells interspersed in the grid (Figma Professionals PLP).
    // `at` is the index in the final cell sequence (intro is cell 0).
    // href is a placeholder until the real wholesale/affiliate URLs exist.
    promos: [
      {
        at: 5,
        heading: 'Become a Wholesaler',
        body: "Interested in carrying Gait Happens products? Join our wholesale program to offer trusted foot health solutions backed by education and designed for lasting results. Whether you're a retailer, clinic, or wellness professional, you'll receive access to wholesale pricing, dedicated support, and premium products your customers will love.",
        cta: { label: 'Learn More', href: '#' },
      },
      {
        at: 6,
        heading: 'Become an Ambassador!',
        body: 'Ready to share natural foot health with the world while earning rewards? Sign up to become our affiliate! After sign up, you will get access to your custom referral link, instructional videos, digital assets, and your own dashboard.',
        cta: { label: 'Ambassador Program', href: '#' },
      },
    ],
    crossSell: {
      heading: 'Shop Our Products',
      itemIds: ['toe-spacers', 'foot-health-kit', 'toe-dynamometer'],
      shopAllHref: '/collections/all',
    },
  },
  '/collections/all-courses': {
    title: 'All Courses',
    grouped: [
      {
        persona: 'Individuals',
        intro: individualsIntro,
        itemIds: ['foot-fest', 'sole-switch', 'combating-bunions', 'fit-feet', 'virtual-consultations'],
      },
      {
        persona: 'Professionals',
        intro: professionalsIntro,
        itemIds: ['sole-switch-pro', 'gait-foundations', 'functional-gait-assessment-l1', 'gait-guru-membership', 'trainer-certification'],
      },
    ],
    crossSell: {
      heading: 'Shop Our Best Selling Products',
      itemIds: ['toe-spacers', 'foot-health-kit', 'walk'],
      shopAllHref: '/collections/all',
    },
  },
};

// ---- Press / "As Seen In" -------------------------------------------

export const pressLogos = [
  'The New York Times',
  'People',
  'New York Post',
  'National Geographic',
  'WebMD',
  'Bicycling',
  "Women's Health",
];

// ---- PDP brand content --------------------------------------------------

// Task 5 (Brand Section band) — Figma-verbatim tagline from node 1046:19633
// ("Brand Section PDP"). Shared default so every PDP's <BrandSection> reads
// the same brand statement unless a product overrides it.
export const pdpBrand = {
  tagline: "We're a female-led group of clinicians out to change the world one human sole at a time.",
};

// ---- Accessors --------------------------------------------------------

export function getItem(id) {
  return items.find(item => item.id === id);
}

export function getCollection(path) {
  return collections[path];
}
