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
    // Task 7: Figma's frame shows boilerplate Small/Medium/Large size pills
    // (copy-pasted from the Toe Spacers template, same as every other
    // product below) but nothing in the copy, accordion, or 4 Column
    // features ever references a size choice for the kit itself — treated
    // as template leftover, not a real variant, per the task brief.
    variants: null,
    sizeChart: null,
    pdp: {
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
      // on both breakpoints. "Finding Your Size" is text + a sizing image
      // (no table — unlike Toe Spacers' Size row, this one has no
      // `type: 'sizechart'`, it just renders `content`).
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
        {
          label: 'Finding Your Size',
          content: `
            <p>Please select your size according to the toe spacer sizing chart above. If you are between sizes we recommend sizing down.</p>
            <img class="pdp-accordion__image" src="/images/plp/foot-health-kit.jpg" alt="Foot Health Kit sizing reference" loading="lazy" />
          `,
        },
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
      // Task 7: no `accordion` key — Cork Supplement's desktop frame (node
      // `721:7029`) shows a single "Shipping to Europe?" Question panel,
      // but that panel is ABSENT on the mobile frame (`1017:9529`), which
      // folds the same copy straight into the body text instead (see
      // `description` above). PdpAccordion.astro has no per-breakpoint
      // presence toggle, and the content is already surfaced in the copy
      // block either way, so this product simply carries no `pdp.accordion`
      // — it degrades cleanly (no accordion renders) rather than adding
      // one-off breakpoint-conditional complexity for a single duplicated
      // row.
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
      // Figma-verbatim from node 721:8349 (desktop) / 1017:9543 (mobile).
      // Figma's CTA for this product reads "Notify When Available" at 30%
      // opacity (i.e. out of stock) rather than "Add to Cart" — ProductDetails.astro
      // doesn't have an out-of-stock/notify-me state (no other product frame
      // needs one), and Task 7's own verification step requires "Add to Cart
      // works on each" of the 6 built products, so this is deliberately left
      // as the standard functional Add to Cart rather than building a new
      // disabled-CTA variant for one row of one product.
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
    price: '$24 USD', // (sample)
    priceRange: null,
    description: "WALK is Gait Happens' guide to understanding your feet and reclaiming a natural, pain-free stride.", // (sample)
    image: '/images/plp/walk.jpg',
    href: '/products/walk',
    cta: 'View Product',
    variants: null,
    sizeChart: null,
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
    rating: 5,
    reviewCount: 15,
    description: 'A one-hour online course to help you better understand how to choose the right shoes for YOU!',
    image: '/images/plp/sole-switch.jpg',
    href: '/courses/sole-switch',
    cta: 'View Course',
    variants: null,
    sizeChart: null,
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
  },
  {
    id: 'fit-feet',
    handle: 'fit-feet',
    title: 'Fit Feet Program',
    kind: 'course',
    badges: ['Course', 'Product'],
    price: '$185 USD',
    priceRange: null,
    rating: 5,
    reviewCount: 32,
    description: 'Online program to help you build a healthier body starting with your feet.',
    image: '/images/plp/fit-feet.jpg',
    href: '/courses/fit-feet',
    cta: 'View Course',
    variants: null,
    sizeChart: null,
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
    variants: null,
    sizeChart: null,
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
