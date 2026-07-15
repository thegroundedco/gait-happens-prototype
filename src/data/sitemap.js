export const menus = [
  {
    id: 'shop', label: 'Shop', type: 'mega', style: 'cards',
    // Figma node 1217:1577 (desktop Shop panel): two yellow photo cards, then
    // a teal column of two stacked "bar" CTAs (Task 1, feat/nav-shop-menu).
    // Product photos reuse existing repo assets rather than adding new files
    // (see task-1-report.md for the byte-level match that drove each choice):
    //  - foot-health-kit.jpg is the same crop as the plp asset (just a
    //    higher-res Figma export) → reuse /images/plp/foot-health-kit.jpg.
    //  - the Walk book-cover crop is byte-identical to the *existing*
    //    /images/nav/featured-products.png (the old "Featured Products"
    //    card's image) — NOT plp/walk.jpg (a different crop/photo) — so it
    //    is reused here (with its established `fit: 'contain'`) instead of
    //    becoming orphaned.
    cards: [
      { kind: 'photo', label: 'The Foot Health Kit', href: '/products/foot-health-kit', image: '/images/plp/foot-health-kit.jpg', variant: 'yellow' },
      { kind: 'photo', label: 'Walk - One Step at a Time', href: '/products/walk', image: '/images/nav/featured-products.png', variant: 'yellow', fit: 'contain' },
      { kind: 'bar', label: 'Shop Best Sellers', href: '/collections/best-sellers' },
      { kind: 'bar', label: 'Shop All Products', href: '/collections/all' },
    ],
  },
  {
    id: 'courses', label: 'Courses', type: 'mega', style: 'cards',
    cards: [
      { label: 'Courses for Individuals', href: '/collections/courses-individuals', image: '/images/nav/courses-individuals.jpg', variant: 'yellow' },
      { label: 'Courses for Professionals', href: '/collections/courses-professionals', image: '/images/nav/courses-professionals.jpg', variant: 'yellow' },
      { label: 'All Courses', href: '/collections/all-courses', variant: 'teal' },
    ],
  },
  {
    id: 'resources', label: 'Resources', type: 'mega', style: 'bars',
    cards: [
      { label: 'Locally Trained Practitioners', href: '/resources/locally-trained-practitioners' },
      { label: 'Our Favorite Brands', href: '/resources/our-favorite-brands' },
      { label: 'Blog', href: '/blogs/news' },
      { label: 'Find a Retailer', href: '/resources/find-a-retailer' },
      { label: 'Guest Appearances', href: '/resources/guest-appearances' },
      { label: 'Event Calendar', href: '/resources/event-calendar' },
    ],
  },
  { id: 'about', label: 'About', type: 'link', href: '/pages/about' },
  {
    id: 'contact', label: 'Contact', type: 'mega', style: 'white',
    cards: [
      { label: 'FAQs', href: '/pages/faqs' },
      { label: 'Customer Support', href: '/pages/customer-support' },
      { label: 'Media & Partnerships', href: '/pages/media-partnerships' },
    ],
  },
];

export const accountMenu = [
  { label: 'Wholesaler Login', href: '/account/wholesaler-login', note: 'Shopify' },
  { label: 'Course Login', href: '/account/course-login', note: 'Kajabi' },
  { label: 'Virtual Consultation Login', href: '/account/consultation-login', note: 'platform TBD' },
];

const r = (path, title, kind, breadcrumb, extra = {}) =>
  ({ path, title, kind, status: 'placeholder', breadcrumb, ...extra });

export const routes = [
  r('/', 'Home', 'home', ['Home'], { phase: 'Phase 3' }),

  // Shop
  r('/collections/best-sellers', 'Shop Best Sellers', 'plp', ['Home', 'Shop', 'Best Sellers'], { status: 'built' }),
  r('/collections/featured', 'Featured Products', 'plp', ['Home', 'Shop', 'Featured Products'], { status: 'built' }),
  r('/collections/all', 'Shop All', 'plp', ['Home', 'Shop', 'All'], { status: 'built' }),
  r('/products/toe-spacers', 'Toe Spacers', 'pdp', ['Home', 'Shop', 'Toe Spacers'], { status: 'built' }),
  r('/products/foot-health-kit', 'The Foot Health Kit', 'pdp', ['Home', 'Shop', 'The Foot Health Kit'], { status: 'built' }),
  r('/products/cork-supplement', 'Cork Supplement', 'pdp', ['Home', 'Shop', 'Cork Supplement'], { status: 'built' }),
  r('/products/toe-strengtheners', 'Toe Strengtheners', 'pdp', ['Home', 'Shop', 'Toe Strengtheners'], { status: 'built' }),
  r('/products/toe-dynamometer', 'Toe Dynamometer', 'pdp', ['Home', 'Shop', 'Toe Dynamometer'], { status: 'built' }),
  // Task 7: new route — Mobility Ball had no page or catalog entry before
  // this task (unlike the other 4 rolled-out products above, which already
  // had placeholder routes to flip).
  r('/products/mobility-ball', 'Mobility Ball', 'pdp', ['Home', 'Shop', 'Mobility Ball'], { status: 'built' }),
  // Chunk B1 Task 5: flipped from placeholder to built (page + catalog `pdp`
  // block now exist; see src/pages/products/walk.astro and catalog.js).
  r('/products/walk', 'WALK', 'pdp', ['Home', 'Shop', 'WALK'], { status: 'built' }),

  // Courses
  r('/collections/courses-individuals', 'Courses for Individuals', 'plp', ['Home', 'Courses', 'Individuals'], { status: 'built' }),
  r('/collections/courses-professionals', 'Courses for Professionals', 'plp', ['Home', 'Courses', 'Professionals'], { status: 'built' }),
  r('/collections/all-courses', 'All Courses', 'plp', ['Home', 'Courses', 'All Courses'], { status: 'built' }),
  r('/courses/foot-fest', 'Foot Fest', 'course', ['Home', 'Courses', 'Foot Fest']),
  // Chunk B1 Task 3: flipped from placeholder to built (page + catalog `pdp`
  // block now exist; see src/pages/courses/combating-bunions.astro and
  // catalog.js).
  r('/courses/combating-bunions', 'Combating Bunions', 'course', ['Home', 'Courses', 'Combating Bunions'], { status: 'built' }),
  // Chunk B1 Task 4: flipped from placeholder to built (page + catalog `pdp`
  // block now exist; see src/pages/courses/fit-feet.astro and catalog.js).
  r('/courses/fit-feet', 'Fit Feet', 'course', ['Home', 'Courses', 'Fit Feet'], { status: 'built' }),
  r('/courses/virtual-consultations', 'Virtual Consultations', 'course', ['Home', 'Courses', 'Virtual Consultations']),
  // Chunk B1 Task 2: flipped from placeholder to built (page + catalog
  // `pdp` block now exist; see src/pages/courses/sole-switch.astro and
  // catalog.js).
  r('/courses/sole-switch', 'Sole Switch', 'course', ['Home', 'Courses', 'Sole Switch'], { status: 'built' }),
  // Task 1 (Course PDP Chunk A): first course PDP scaffold — flipped from
  // placeholder to built (page + catalog `pdp` block now exist; see
  // src/pages/courses/sole-switch-pro.astro and catalog.js).
  r('/courses/sole-switch-pro', 'Sole Switch Pro', 'course', ['Home', 'Courses', 'Sole Switch Pro'], { status: 'built' }),
  // Task 7 (Course PDP Chunk B2): flipped from placeholder to built (page +
  // catalog `pdp` block now exist; see src/pages/courses/gait-guru-membership.astro
  // and catalog.js). This is the LAST course PDP on this branch — its own
  // section list is the shortest (no `course-overview`, no `pdp-reviews`).
  r('/courses/gait-guru-membership', 'Gait Guru Membership', 'course', ['Home', 'Courses', 'Gait Guru Membership'], { status: 'built' }),
  // Task 4 (Course PDP Chunk B2): flipped from placeholder to built (page +
  // catalog `pdp` block now exist; see src/pages/courses/trainer-certification.astro
  // and catalog.js).
  r('/courses/trainer-certification', 'Trainer Certification', 'course', ['Home', 'Courses', 'Trainer Certification'], { status: 'built' }),
  // Course PDP Chunk B2 Task 3: flipped from placeholder to built (page +
  // catalog `pdp` block now exist; see src/pages/courses/gait-foundations.astro
  // and catalog.js).
  r('/courses/gait-foundations', 'Gait Foundations', 'course', ['Home', 'Courses', 'Gait Foundations'], { status: 'built' }),
  // Task 5 (Course PDP Chunk B2): flipped from placeholder to built (page +
  // catalog `pdp` block now exist; see
  // src/pages/courses/functional-gait-assessment-l1.astro and catalog.js).
  r('/courses/functional-gait-assessment-l1', 'Functional Gait Assessment L1', 'course', ['Home', 'Courses', 'Functional Gait Assessment L1'], { status: 'built' }),
  // Task 2 (Course PDP Chunk B2) adopted a fully-designed Figma page
  // (1041:10410) that previously had no catalog entry, route, or PLP
  // presence, as a placeholder. Task 6 flips it to 'built' (page +
  // catalog `pdp` block now exist; see
  // src/pages/courses/functional-gait-assessment-l2.astro and catalog.js).
  r('/courses/functional-gait-assessment-l2', 'Functional Gait Assessment L2', 'course', ['Home', 'Courses', 'Functional Gait Assessment L2'], { status: 'built' }),

  // Resources
  r('/resources/locally-trained-practitioners', 'Locally Trained Practitioners', 'page', ['Home', 'Resources', 'Locally Trained Practitioners']),
  r('/resources/our-favorite-brands', 'Our Favorite Brands', 'page', ['Home', 'Resources', 'Our Favorite Brands']),
  r('/blogs/news', 'Blog', 'blog', ['Home', 'Resources', 'Blog'], { phase: 'Phase 4' }),
  r('/resources/find-a-retailer', 'Find a Retailer', 'page', ['Home', 'Resources', 'Find a Retailer']),
  r('/resources/guest-appearances', 'Guest Appearances', 'page', ['Home', 'Resources', 'Guest Appearances']),
  r('/resources/event-calendar', 'Event Calendar', 'page', ['Home', 'Resources', 'Event Calendar']),

  // About
  r('/pages/about', 'About', 'page', ['Home', 'About'], { phase: 'Phase 3' }),

  // Contact
  r('/pages/faqs', 'FAQs', 'page', ['Home', 'Contact', 'FAQs']),
  r('/pages/customer-support', 'Customer Support', 'page', ['Home', 'Contact', 'Customer Support']),
  r('/pages/media-partnerships', 'Media & Partnerships', 'page', ['Home', 'Contact', 'Media & Partnerships']),

  // Utility
  r('/search', 'Search', 'utility', ['Home', 'Search']),
  r('/cart', 'Cart', 'utility', ['Home', 'Cart']),
  r('/account/wholesaler-login', 'Wholesaler Login', 'utility', ['Home', 'Account', 'Wholesaler Login'], { note: 'External: Shopify wholesaler portal (URL TBD)' }),
  r('/account/course-login', 'Course Login', 'utility', ['Home', 'Account', 'Course Login'], { note: 'External: Kajabi (URL TBD)' }),
  r('/account/consultation-login', 'Virtual Consultation Login', 'utility', ['Home', 'Account', 'Virtual Consultation Login'], { note: 'External: platform TBD' }),
];

export function getRoute(path) {
  return routes.find(route => route.path === path);
}
