/* One Vanta NET scene shared across a soft oval frame. Three r134 / Vanta 0.5.24. */
(() => {
  'use strict';

  const element = document.getElementById('vanta-bg');
  if (!element) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const roomyViewport = window.matchMedia('(min-width: 1200px)');
  const positions = ['top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left'];
  const anchors = positions.map(position => {
    const anchor = document.createElement('div');
    anchor.className = `net-region net-region--${position}`;
    element.append(anchor);
    return anchor;
  });
  let effect = null;
  let regions = [];
  let readingAreas = [];

  function updateLayout() {
    if (!roomyViewport.matches || reducedMotion.matches) return;
    const width = element.clientWidth;
    const height = element.clientHeight;
    regions = anchors.map(anchor => {
      const rect = anchor.getBoundingClientRect();
      return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
    });
    const mask = regions.map(rect => `radial-gradient(ellipse ${rect.width / 2}px ${rect.height / 2}px at ${rect.x + rect.width / 2}px ${rect.y + rect.height / 2}px, #000 55%, transparent 100%)`).join(',');
    element.style.maskImage = mask;
    element.style.webkitMaskImage = mask;

    // Top/bottom fragments can meet scrolling content; erase ink behind reading areas.
    const selectors = '.header-content, #main-content p, #main-content h2, #main-content h3, #main-content li, #main-content .research-card, #main-content figure';
    readingAreas = [];
    document.querySelectorAll(selectors).forEach(node => {
      const rect = node.getBoundingClientRect();
      const area = {
        x: Math.max(0, Math.floor(rect.left - 10)),
        y: Math.max(0, Math.floor(rect.top - 10)),
        right: Math.min(width, Math.ceil(rect.right + 10)),
        bottom: Math.min(height, Math.ceil(rect.bottom + 10))
      };
      if (!rect.width || !rect.height || area.right <= area.x || area.bottom <= area.y) return;
      if (readingAreas.some(other => other.x <= area.x && other.y <= area.y && other.right >= area.right && other.bottom >= area.bottom)) return;
      readingAreas = readingAreas.filter(other => !(area.x <= other.x && area.y <= other.y && area.right >= other.right && area.bottom >= other.bottom));
      readingAreas.push(area);
    });
  }

  function shareScene(net) {
    const renderer = net.renderer;
    const renderScene = renderer.render.bind(renderer);
    renderer.autoClear = false;
    renderer.render = (scene, camera) => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      const aspect = camera.aspect;
      const rotation = net.cont.rotation.y;
      renderer.setScissorTest(false);
      renderer.setClearColor(0xffffff, 1);
      renderer.clear();
      renderer.setScissorTest(true);
      regions.forEach((rect, index) => {
        renderer.setViewport(rect.x, height - rect.y - rect.height, rect.width, rect.height);
        renderer.setScissor(rect.x, height - rect.y - rect.height, rect.width, rect.height);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        net.cont.rotation.y = rotation + index * Math.PI / 4;
        renderScene(scene, camera);
      });
      readingAreas.forEach(rect => {
        renderer.setScissor(rect.x, height - rect.bottom, rect.right - rect.x, rect.bottom - rect.y);
        renderer.clear();
      });
      net.cont.rotation.y = rotation;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setViewport(0, 0, width, height);
      renderer.setScissorTest(false);
    };
    renderer.render(net.scene, net.camera);
  }

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
      updateLayout();
      effect = window.VANTA.NET({
        el: element,
        THREE: window.THREE,
        mouseControls: true,
        touchControls: false,
        gyroControls: false,
        mouseCoeffX: .10,
        mouseCoeffY: .08,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        backgroundColor: 0xffffff,
        color: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#960c22',
        points: 3,
        maxDistance: 28,
        spacing: 24,
        showDots: true
      });
      effect.points.forEach(point => { point.r *= .08; });
      shareScene(effect);
    } catch (error) {
      destroy();
      console.warn('The decorative network background could not start.', error);
    }
  }

  document.addEventListener('visibilitychange', syncEffect);
  reducedMotion.addEventListener('change', syncEffect);
  roomyViewport.addEventListener('change', syncEffect);
  window.addEventListener('resize', updateLayout);
  window.addEventListener('scroll', updateLayout, { passive: true });
  document.addEventListener('load', updateLayout, true);
  document.fonts?.ready.then(updateLayout);
  window.addEventListener('pagehide', destroy);
  window.addEventListener('pageshow', syncEffect);
  syncEffect();
})();
