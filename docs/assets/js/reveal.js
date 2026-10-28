/* Restore the reference template's section and publication-row reveal. */
(() => {
  const targets = document.querySelectorAll('.timeline-container, .timeline-entry, .research-interests, .research-interests ul li, .pub-row');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      window.setTimeout(() => entry.target.classList.add('visible'), index * 40);
      observer.unobserve(entry.target);
    });
  }, { threshold: .07 });
  targets.forEach(target => {
    target.classList.add('reveal');
    observer.observe(target);
  });
})();
