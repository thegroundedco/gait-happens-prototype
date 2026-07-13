// Testimonial carousel (Course PDP Chunk B1). Framework-free, like cart.js.
//
// Paging state lives in the DOM (`data-testimonial-active` on the section),
// NOT in a module variable, and the single document-level listener resolves
// nodes fresh on every event. So there is nothing cached to go stale across
// Astro ClientRouter swaps: no `astro:page-load` re-init, no teardown. Same
// delegation idiom as YourInstructors.astro's read-more toggle.
//
// Slides crossfade on paging, following ProductDetails.astro's `selectThumb`
// gallery-swap idiom (same `--motion-fast` duration, same `matchMedia`
// reduced-motion short-circuit) adapted from one <img> whose `src` changes
// to N always-mounted slides whose `hidden`/`inert` toggle. Only the ONE
// slide mid-swap is ever touched — `page()` fades the outgoing slide out,
// THEN (only once that finishes) flips `hidden`/`inert` and fades the
// incoming slide in — so exactly one slide is ever unhidden at a time, same
// as before this crossfade existed. That's what keeps the crossfade from
// reintroducing layout shift or exposing an off-screen quote to assistive
// tech: it's a sequential fade-out-then-fade-in around a single swap, never
// two slides visible at once.

/** Wrapping index step. Returns 0 when there is nothing to page between. */
export function nextIndex(current, total, dir) {
  if (total <= 1) return 0;
  return (current + dir + total) % total;
}

const MOTION_FAST_MS = 180; // matches --motion-fast in src/styles/motion.css

function show(section, index) {
  const slides = section.querySelectorAll('[data-testimonial-slide]');
  slides.forEach((slide, i) => {
    const isActive = i === index;
    slide.toggleAttribute('hidden', !isActive);
    slide.toggleAttribute('inert', !isActive);
  });
  section.setAttribute('data-testimonial-active', String(index));
}

function page(section, dir) {
  // Ignore paging clicks that land before the pending swap's `show()` call
  // has run — `current`/the slide attributes are mid-flight (`from` fading
  // out, `to` not yet unhidden) until then, so a second `page()` call in
  // that window would compute against stale state. Once `show()` runs, the
  // flag clears immediately; a click during the (purely visual) fade-in leg
  // that follows is safe to act on, since the DOM state is already settled.

  const slides = section.querySelectorAll('[data-testimonial-slide]');
  const total = slides.length;
  const current = Number(section.getAttribute('data-testimonial-active') ?? 0);
  const next = nextIndex(current, total, dir);
  if (next === current) return;

  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    show(section, next);
    return;
  }

  const from = slides[current];
  const to = slides[next];
  section.setAttribute('data-testimonial-animating', '');
  from.classList.add('is-fading'); // leg 1: fade the outgoing slide to opacity 0
  window.setTimeout(() => {
    show(section, next); // swap while both are momentarily invisible/hidden
    from.classList.remove('is-fading');
    to.classList.add('is-fading'); // leg 2 setup: incoming slide starts at opacity 0
    // Force a style flush so the browser commits that opacity:0 starting
    // point as its own paint before the next line changes it — without
    // this, both style changes (unhiding `to` and adding `.is-fading`)
    // would land in the same paint, leaving nothing for the transition
    // below to animate from.
    void to.offsetWidth;
    to.classList.remove('is-fading'); // leg 2: fade the incoming slide back to opacity 1
    section.removeAttribute('data-testimonial-animating');
  }, MOTION_FAST_MS);
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const nav = target.closest('[data-testimonial-nav]');
    if (!nav) return;
    const section = nav.closest('[data-testimonial]');
    if (!section) return;
    page(section, nav.getAttribute('data-testimonial-nav') === 'prev' ? -1 : 1);
  });
}
