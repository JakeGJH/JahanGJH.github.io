/* Lightbox and grouped gallery treatment; optional media is supplied by media.js. */
(() => {
  const beyond = document.querySelector(".beyond");
  const lightbox = document.getElementById("life-lightbox");
  if (!beyond || !lightbox) return;

  const enlarged = document.getElementById("life-lightbox-image");
  const caption = document.getElementById("life-lightbox-caption");
  const error = document.getElementById("life-lightbox-error");
  const closeButton = document.getElementById("life-lightbox-close");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const decorated = new WeakSet();
  const observed = new WeakSet();
  let previousFocus = null;
  let previousOverflow = "";

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(entries => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        window.setTimeout(() => element.classList.add("is-visible"), reducedMotion.matches ? 0 : index * 60);
        revealObserver.unobserve(element);
      });
    }, { threshold: .08 })
    : null;

  function reveal(element) {
    if (observed.has(element)) return;
    observed.add(element);
    if (reducedMotion.matches || !revealObserver) {
      element.classList.add("is-visible");
    } else {
      revealObserver.observe(element);
    }
  }

  function close() {
    if (lightbox.hidden) return;
    lightbox.classList.remove("open");
    lightbox.hidden = true;
    enlarged.removeAttribute("src");
    enlarged.alt = "";
    document.body.style.overflow = previousOverflow;
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  }

  function open(figure) {
    const link = figure.querySelector("a");
    const image = figure.querySelector("img");
    if (!link || !image) return;
    let full;
    try { full = new URL(link.href, document.baseURI); } catch { return; }
    if (!/^https?:$/.test(full.protocol)) return;

    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    const figureCaption = figure.querySelector("figcaption");
    const text = figureCaption?.dataset.captionText || image.alt;
    const subtitle = figure.dataset.lifeSubtitle?.trim() || "";
    caption.replaceChildren(document.createTextNode(text || ""));
    if (subtitle) {
      caption.append(document.createTextNode(" — "));
      const metadata = document.createElement("span");
      metadata.className = "life-zh";
      metadata.textContent = subtitle;
      caption.append(metadata);
    }
    caption.hidden = !text && !subtitle;
    error.hidden = true;
    enlarged.hidden = false;
    enlarged.alt = image.alt || text || "Enlarged personal photograph";
    lightbox.hidden = false;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    enlarged.src = full.href;
    closeButton.focus({ preventScroll: true });
  }

  function decorate(figure) {
    if (decorated.has(figure)) return;
    const link = figure.querySelector("a");
    const image = link?.querySelector("img");
    if (!link || !image) return;
    decorated.add(figure);
    const scroll = figure.dataset.lifeLayout?.toLowerCase() === "scroll";
    const originalCaption = figure.querySelector("figcaption");
    const text = originalCaption?.textContent.trim() || "";
    const subtitle = figure.dataset.lifeSubtitle?.trim() || "";
    const name = text || image.alt || "Personal photograph";
    figure.classList.add(scroll ? "life-scroll" : "life-photo", "life-reveal");
    figure.tabIndex = 0;
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-label", `${name} — enlarge`);
    link.classList.add("life-image-link");
    link.tabIndex = -1;

    const children = [];
    if (scroll) {
      const silk = document.createElement("div");
      silk.className = "life-silk";
      silk.append(link);
      children.push(silk);
    } else {
      children.push(link);
    }
    if (text || subtitle) {
      const figureCaption = originalCaption || document.createElement("figcaption");
      figureCaption.className = scroll ? "life-scroll-caption" : "life-photo-caption";
      figureCaption.dataset.captionText = text;
      const label = document.createElement(scroll ? "span" : "b");
      label.className = scroll ? "life-scroll-text" : "life-photo-text";
      label.textContent = text;
      if (scroll) {
        const title = document.createElement("span");
        title.append(label);
        figureCaption.replaceChildren(title);
      } else {
        figureCaption.replaceChildren(label);
      }
      if (subtitle) {
        const metadata = document.createElement(scroll ? "span" : "small");
        if (scroll) metadata.className = "life-scroll-meta";
        metadata.textContent = subtitle;
        figureCaption.append(metadata);
      }
      if (scroll) {
        const seal = document.createElement("span");
        seal.className = "life-seal";
        seal.setAttribute("aria-hidden", "true");
        seal.textContent = "JG";
        figureCaption.append(seal);
      }
      children.push(figureCaption);
    }
    figure.replaceChildren(...children);
    figure.addEventListener("click", event => {
      if (event.button !== 0) return;
      event.preventDefault();
      open(figure);
    });
    figure.addEventListener("keydown", event => {
      if (event.target !== figure || !["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      open(figure);
    });
  }

  function scan() {
    beyond.querySelectorAll("[data-life-gallery]").forEach(gallery => {
      const figures = Array.from(gallery.querySelectorAll(":scope > figure"));
      figures.forEach(decorate);
      gallery.classList.toggle("is-scrolls", figures.length > 0 && figures.every(figure => figure.dataset.lifeLayout?.toLowerCase() === "scroll"));
      gallery.classList.toggle("is-photos", figures.some(figure => figure.dataset.lifeLayout?.toLowerCase() !== "scroll"));
      gallery.hidden = figures.length === 0;
    });
    beyond.querySelectorAll(".life-reveal").forEach(reveal);
  }

  enlarged.addEventListener("error", () => {
    if (lightbox.hidden) return;
    enlarged.hidden = true;
    error.hidden = false;
  });
  closeButton.addEventListener("click", close);
  lightbox.addEventListener("click", event => { if (event.target === lightbox) close(); });
  document.addEventListener("keydown", event => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      event.preventDefault();
      closeButton.focus();
    }
  });
  reducedMotion.addEventListener("change", event => {
    if (!event.matches) return;
    revealObserver?.disconnect();
    beyond.querySelectorAll(".life-reveal").forEach(element => element.classList.add("is-visible"));
  });
  beyond.classList.add("life-enhanced");
  document.addEventListener("media:ready", scan);
  scan();
})();
