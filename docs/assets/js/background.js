/* Vanta NET in UH red. Requires Three r134 and Vanta 0.5.24 first. */
(() => {
  'use strict';

  const element = document.getElementById('vanta-bg');
  if (!element) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const roomyViewport = window.matchMedia('(min-width: 1200px)');
  let effect = null;

  function destroy() {
    if (!effect) return;
    effect.destroy();
    effect = null;
  }

  function syncEffect() {
    if (document.hidden || reducedMotion.matches || !roomyViewport.matches) {
      destroy();
      return;
    }
    if (effect || !window.THREE || !window.VANTA?.NET) return;
    try {
      effect = window.VANTA.NET({
        el: element,
        THREE: window.THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        backgroundColor: 0xffffff,
        color: 0xc8102e,
        points: 8,
        maxDistance: 20,
        spacing: 22,
        showDots: true
      });
      // Slow the pinned NET effect's per-node drift; camera movement is disabled.
      effect.points.forEach(point => { point.r *= .08; });
    } catch (error) {
      // Keep the academic content usable when WebGL is unavailable.
      console.warn('The decorative network background could not start.', error);
    }
  }

  document.addEventListener('visibilitychange', syncEffect);
  reducedMotion.addEventListener('change', syncEffect);
  roomyViewport.addEventListener('change', syncEffect);
  window.addEventListener('pagehide', destroy);
  window.addEventListener('pageshow', syncEffect);
  syncEffect();
})();
