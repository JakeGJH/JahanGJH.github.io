/* Reading progress, following the reference template's document scroll ratio. */
(function () {
  'use strict';

  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  let pending = false;

  function update() {
    pending = false;
    const root = document.scrollingElement || document.documentElement;
    const distance = root.scrollHeight - document.documentElement.clientHeight;
    const ratio = distance > 0 ? root.scrollTop / distance : 0;
    bar.style.width = (Math.min(1, Math.max(0, ratio)) * 100) + '%';
  }

  function requestUpdate() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  window.addEventListener('load', requestUpdate);
  window.addEventListener('pageshow', requestUpdate);

  // Optional media can change document height after the initial page load.
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(requestUpdate);
    observer.observe(document.body);
  }

  update();
}());
