// Testimonial carousel (Course PDP Chunk B1). Framework-free, like cart.js.
//
// Paging state lives in the DOM (`data-testimonial-active` on the section),
// NOT in a module variable, and the single document-level listener resolves
// nodes fresh on every event. So there is nothing cached to go stale across
// Astro ClientRouter swaps: no `astro:page-load` re-init, no teardown. Same
// delegation idiom as YourInstructors.astro's read-more toggle.

/** Wrapping index step. Returns 0 when there is nothing to page between. */
export function nextIndex(current, total, dir) {
  if (total <= 1) return 0;
  return (current + dir + total) % total;
}

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
  const total = section.querySelectorAll('[data-testimonial-slide]').length;
  const current = Number(section.getAttribute('data-testimonial-active') ?? 0);
  show(section, nextIndex(current, total, dir));
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
