/* Vanta NET in UH red. Requires Three r134 and Vanta 0.5.24 first. */
(() => {
  'use strict';

  const element = document.getElementById('vanta-bg');
  if (!element) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const roomyViewport = window.matchMedia('(min-width: 1200px)');
  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(position => {
    const corner = document.createElement('div');
    corner.className = `net-corner net-corner--${position}`;
    element.append(corner);
    return corner;
  });
  let effects = [];

  function destroy() {
    effects.forEach(effect => effect.destroy());
    effects = [];
  }

  function syncEffect() {
    if (document.hidden || reducedMotion.matches || !roomyViewport.matches) {
      destroy();
      return;
    }
    if (effects.length || !window.THREE || !window.VANTA?.NET) return;
    try {
      corners.forEach(corner => {
        const effect = window.VANTA.NET({
          el: corner,
          THREE: window.THREE,
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          minHeight: 100,
          minWidth: 80,
          scale: 1,
          scaleMobile: 1,
          backgroundColor: 0xffffff,
          color: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#960c22',
          points: 3,
          maxDistance: 28,
          spacing: 24,
          showDots: true
        });
        effects.push(effect);
        // Slow the pinned NET effect's per-node drift; camera movement is disabled.
        effect.points.forEach(point => { point.r *= .08; });
      });
    } catch (error) {
      destroy();
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
