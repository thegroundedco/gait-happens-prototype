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
        ['Large', '13+', '11.5+', '45+', '11+'],
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
      // Task 3 (Product Details accordion) — Figma-verbatim from node
      // `710:6353` / `1088:15369`'s "Instructions"/"Research" panels. The
      // "Size" panel needs no data of its own: it renders the size-chart
      // table straight from `sizeChart` (above) plus boilerplate helper copy
      // owned by PdpAccordion.astro itself.
      accordion: {
        // Figma's Instructions panel is literally two YouTube <iframe>
        // embed-code snippets pasted as text (Figma can't render a live
        // iframe on canvas). We embed the real players instead — "Reference
        // build — keep it simple + honest" per the task brief — using these
        // Figma-verbatim video URLs/titles.
        instructions: [
          { title: 'YouTube video player', src: 'https://www.youtube.com/embed/_4wcJ6-2yt4?si=CPXtN6sfZV0qW9aH' },
          { title: 'YouTube video player', src: 'https://www.youtube.com/embed/r_Osy4NfREY?si=eaP1jy8_fEblel-r' },
        ],
        research: [
          '1. Krześniak H, Truszczyńska-Baszak A. Toe Separators as a Therapeutic Tool in Physiotherapy-A Systematic Review. J Clin Med. 2024 Dec 19;13(24):7771. doi: 10.3390/jcm13247771. PMID: 39768694.',
          '2. Aebischer AS, Duff S. Bunions: A review of management. Aust J Gen Pract. 2020 Nov;49(11):720-723. doi: 10.31128/AJGP-07-20-5541. PMID: 33123707.',
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
    price: '$89 USD', // (sample)
    priceRange: null,
    description: 'Our complete starter kit bundles the essential tools to stretch, strengthen, and restore your feet in one easy daily routine.', // (sample)
    image: '/images/plp/foot-health-kit.jpg',
    href: '/products/foot-health-kit',
    cta: 'View Product',
    variants: null,
    sizeChart: null,
  },
  {
    id: 'cork-supplement',
    handle: 'cork-supplement',
    title: 'Cork Supplement',
    kind: 'product',
    badges: ['Product'],
    price: '$38 USD', // (sample)
    priceRange: null,
    description: 'A cushioned cork insert that supports your arch and improves alignment with every step you take.', // (sample)
    image: '/images/plp/cork-supplement.jpg',
    href: '/products/cork-supplement',
    cta: 'View Product',
    variants: null,
    sizeChart: null,
  },
  {
    id: 'toe-strengtheners',
    handle: 'toe-strengtheners',
    title: 'Toe Strengtheners',
    kind: 'product',
    badges: ['Product'],
    price: '$32 USD', // (sample)
    priceRange: null,
    description: 'Resistance loops designed to rebuild strength in your toes and forefoot for a more stable, powerful stride.', // (sample)
    image: '/images/plp/toe-strengtheners.jpg',
    href: '/products/toe-strengtheners',
    cta: 'View Product',
    variants: { label: 'Size', options: ['Small', 'Medium', 'Large'] },
    sizeChart: null,
  },
  {
    id: 'toe-dynamometer',
    handle: 'toe-dynamometer',
    title: 'Toe Dynamometer',
    kind: 'product',
    badges: ['Product'],
    price: '$45 USD', // (sample)
    priceRange: null,
    description: 'A simple at-home tool that measures your toe strength so you can track your progress session to session.', // (sample)
    image: '/images/plp/toe-dynamometer.jpg',
    href: '/products/toe-dynamometer',
    cta: 'View Product',
    variants: null,
    sizeChart: null,
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
    itemIds: ['toe-spacers', 'foot-health-kit', 'cork-supplement', 'toe-strengtheners', 'toe-dynamometer', 'walk'],
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

// TODO(Task 5): shared brand-story content (trust bar, founder note, etc.)
// used across PDP sections. Stubbed here so Task 1's Pdp.astro composer has
// a stable import target to extend from.
export const pdpBrand = {};

// ---- Accessors --------------------------------------------------------

export function getItem(id) {
  return items.find(item => item.id === id);
}

export function getCollection(path) {
  return collections[path];
}
