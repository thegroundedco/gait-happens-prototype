// GSAP reveal-on-scroll motion system.
//
// motion.css pre-hides [data-reveal] elements (opacity:0, translateY) but only
// under `prefers-reduced-motion: no-preference` — so under reduced-motion the
// elements are already fully visible and we must skip animating them entirely.
//
// Astro's View Transitions (ClientRouter) swap the DOM in place without a full
// page reload, and this module stays alive across navigations. `astro:page-load`
// fires once on the initial load and again after every client-side navigation,
// so it's the single hook we need — registered once, at module scope, below.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Cap on how far the sibling stagger climbs, so pages with many reveal
// targets don't end up with a long tail of increasing delay.
const STAGGER_STEP = 0.06;
const STAGGER_MAX = 0.3;

function initReveals() {
  // Kill any ScrollTriggers left over from the previous page. Without this,
  // triggers created on a prior page would either leak or keep pointing at DOM
  // nodes View Transitions just removed/replaced.
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  // Re-scan for the current page's reveal targets.
  const els = gsap.utils.toArray('[data-reveal]');
  if (els.length === 0) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    // No pre-hide happened under reduced-motion, but clear/normalize anyway
    // in case an element was left mid-animation by a prior, motion-enabled visit.
    gsap.set(els, { opacity: 1, y: 0, clearProps: 'all' });
    return;
  }

  const vh = window.innerHeight;
  els.forEach((el, i) => {
    const from = { opacity: 0, y: 16 };
    const to = { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' };
    // Above-the-fold targets animate IMMEDIATELY — never gate visible content
    // behind a scroll the user hasn't made. Only below-the-fold targets wait
    // for a ScrollTrigger. (getBoundingClientRect().top < 90% viewport ≈ in view.)
    if (el.getBoundingClientRect().top < vh * 0.9) {
      gsap.fromTo(el, from, { ...to, delay: Math.min(i * STAGGER_STEP, STAGGER_MAX) });
    } else {
      gsap.fromTo(el, from, { ...to, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    }
  });

  // Recompute trigger positions once tweens are registered (and again after
  // images/fonts settle) so below-the-fold triggers fire at the right scroll.
  ScrollTrigger.refresh();
}

// Run on the initial page load AND after each View Transition swap.
// (astro:page-load does not reliably fire on the first hard load in this Astro
// version, so we init directly.) astro:after-swap fires only on navigations,
// never the initial load; initReveals kills prior ScrollTriggers first, so
// re-runs are safe and run exactly once per DOM.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReveals);
} else {
  initReveals();
}
document.addEventListener('astro:after-swap', initReveals);
