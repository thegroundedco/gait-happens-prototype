// Interim motion stub. The full GSAP reveal-on-scroll system lands in Task 9.
// motion.css pre-hides [data-reveal]; until GSAP arrives, just show them.
document.querySelectorAll('[data-reveal]').forEach((el) => {
  el.style.opacity = '1';
  el.style.transform = 'none';
});
