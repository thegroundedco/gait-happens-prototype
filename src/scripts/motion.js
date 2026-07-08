// Interim motion stub. The full GSAP reveal-on-scroll system lands in Task 9.
// motion.css pre-hides [data-reveal]; until GSAP arrives, just show them —
// on first load and after every ClientRouter navigation.
document.addEventListener('astro:page-load', () => {
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
});
