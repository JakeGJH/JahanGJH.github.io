/* Optional template thumbnails, venue badges, and section-specific personal photos. */
(() => {
  const text = (value, fallback = "") =>
    typeof value === "string" && value.trim() ? value.trim() : fallback;

  function mediaURL(value) {
    if (!text(value)) return null;
    try {
      const url = new URL(value, document.baseURI);
      return /^https?:$/.test(url.protocol) ? url : null;
    } catch {
      return null;
    }
  }

  function ready(phase, detail = {}) {
    document.dispatchEvent(new CustomEvent("media:ready", {
      detail: { phase, ...detail }
    }));
  }

  function linkedImage(item, source, fallbackAlt, loading) {
    const link = document.createElement("a");
    link.href = (mediaURL(item.href) || source).href;
    link.target = "_blank";
    link.rel = "noopener";
    const image = document.createElement("img");
    image.alt = text(item.alt, fallbackAlt);
    image.decoding = "async";
    image.loading = loading;
    link.append(image);
    return { link, image };
  }

  function researchImage(card, item) {
    let container = card.querySelector(".pub-row .abbr.research-media") ||
      card.querySelector(".research-media");
    const source = mediaURL(item?.src);
    if (!source) {
      if (container) container.hidden = true;
      card.classList.remove("has-media");
      return false;
    }

    // The restored template supplies this container; retain compatibility with
    // research/project cards that have not yet adopted the template row markup.
    if (!container) {
      container = document.createElement("div");
      container.className = "col-sm-3 abbr research-media";
      (card.querySelector(".pub-row") || card).prepend(container);
    }
    container.hidden = true;
    container.replaceChildren();

    const title = text(card.querySelector("h3, .title")?.textContent, "Research image");
    // Hidden lazy images may never load. Request research thumbnails eagerly,
    // then reveal only successful images so missing media never leaves a frame.
    const { link, image } = linkedImage(item, source, title, "eager");
    image.className = "teaser img-fluid z-depth-1";
    container.append(link);
    if (text(item.badge)) {
      const badge = document.createElement("abbr");
      badge.className = "badge";
      badge.textContent = text(item.badge);
      badge.title = text(item.badgeTitle, text(item.badge));
      container.append(badge);
    }
    if (text(item.caption)) {
      const caption = document.createElement("p");
      caption.className = "research-caption";
      caption.textContent = text(item.caption);
      container.append(caption);
    }
    image.addEventListener("load", () => {
      container.hidden = false;
      card.classList.add("has-media");
      ready("image-load", { kind: "research", id: card.dataset.mediaId, success: true });
    }, { once: true });
    image.addEventListener("error", () => {
      container.hidden = true;
      container.replaceChildren();
      card.classList.remove("has-media");
      ready("image-error", { kind: "research", id: card.dataset.mediaId, success: false });
    }, { once: true });
    image.src = source.href;
    return true;
  }

  function lifeImage(item) {
    const source = mediaURL(item?.src);
    if (!source) return false;
    const section = text(item.section, "general");
    const gallery = Array.from(document.querySelectorAll("[data-life-gallery]"))
      .find(element => element.dataset.lifeGallery === section) ||
      document.getElementById("life-gallery");
    if (!gallery) return false;

    const figure = document.createElement("figure");
    figure.dataset.lifeLayout = item.layout === "scroll" ? "scroll" : "photo";
    if (text(item.subtitle)) figure.dataset.lifeSubtitle = text(item.subtitle);
    const { link, image } = linkedImage(item, source,
      text(item.caption, "Personal activity photo"), "lazy");
    figure.append(link);
    if (text(item.caption)) {
      const caption = document.createElement("figcaption");
      caption.textContent = text(item.caption);
      figure.append(caption);
    }
    image.addEventListener("load", () => {
      ready("image-load", { kind: "life", section, success: true });
    }, { once: true });
    image.addEventListener("error", () => {
      figure.remove();
      gallery.hidden = gallery.children.length === 0;
      ready("image-error", { kind: "life", section, success: false });
    }, { once: true });
    gallery.append(figure);
    gallery.hidden = false;
    image.src = source.href;
    return true;
  }

  fetch(new URL("assets/data/media.json", document.baseURI))
    .then(response => {
      if (!response.ok) throw new Error("Media manifest unavailable");
      return response.json();
    })
    .then(media => {
      let researchCount = 0;
      let lifeCount = 0;
      document.querySelectorAll("[data-media-id]").forEach(card => {
        if (researchImage(card, media?.research?.[card.dataset.mediaId])) researchCount++;
      });
      if (Array.isArray(media?.life)) {
        media.life.forEach(item => { if (lifeImage(item)) lifeCount++; });
      }
      ready("manifest", { success: true, researchCount, lifeCount });
    })
    .catch(() => {
      // Text content and navigation remain available when optional media fails.
      ready("manifest", { success: false, researchCount: 0, lifeCount: 0 });
    });
})();
