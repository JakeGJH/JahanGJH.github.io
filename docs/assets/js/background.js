/* Original Vanta NET renderer, with a CSS reading mask and gentler mouse movement. */
(() => {
  'use strict';

  const element = document.getElementById('vanta-bg');
  if (!element) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const roomyViewport = window.matchMedia('(min-width: 1200px)');
  let effect = null;

  function destroy() {
    if (!effect) return;
    const renderer = effect.renderer;
    effect.destroy();
    renderer?.dispose();
    renderer?.forceContextLoss();
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
        mouseControls: true,
        touchControls: false,
        gyroControls: false,
        mouseCoeffX: .25,
        mouseCoeffY: .20,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        backgroundColor: 0xffffff,
        color: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#960c22'
      });
    } catch (error) {
      destroy();
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
