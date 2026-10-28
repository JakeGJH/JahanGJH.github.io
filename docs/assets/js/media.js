/* Add optional research thumbnails and personal photos without empty placeholders. */
(() => {
  function imageFigure(item, fallbackAlt, className, mountFigure, onError) {
    if (!item || typeof item.src !== "string" || !item.src.trim()) return;
    let url;
    try {
      url = new URL(item.src, document.baseURI);
    } catch {
      return;
    }
    if (!/^https?:$/.test(url.protocol)) return;
    const figure = document.createElement("figure");
    figure.className = className;
    const link = document.createElement("a");
    link.href = url.href;
    link.target = "_blank";
    link.rel = "noopener";
    const image = document.createElement("img");
    image.alt = item.alt || fallbackAlt;
    image.decoding = "async";
    image.loading = "lazy";
    image.addEventListener("error", () => {
      figure.remove();
      onError?.();
    }, { once: true });
    link.append(image);
    figure.append(link);
    if (item.caption) {
      const caption = document.createElement("figcaption");
      caption.textContent = item.caption;
      figure.append(caption);
    }
    mountFigure(figure);
    image.src = url.href;
  }

  fetch(new URL("assets/data/media.json", document.baseURI))
    .then(response => {
      if (!response.ok) throw new Error("Media manifest unavailable");
      return response.json();
    })
    .then(media => {
      document.querySelectorAll("[data-media-id]").forEach(card => {
        const item = media.research?.[card.dataset.mediaId];
        const title = card.querySelector("h3")?.textContent || "Research image";
        imageFigure(item, title, "research-media", figure => {
          card.prepend(figure);
          card.classList.add("has-media");
        }, () => card.classList.remove("has-media"));
      });
      const gallery = document.getElementById("life-gallery");
      if (!gallery || !Array.isArray(media.life)) return;
      media.life.forEach(item => {
        imageFigure(item, item.caption || "Personal activity photo", "", figure => {
          gallery.append(figure);
          gallery.hidden = false;
        }, () => { gallery.hidden = gallery.children.length === 0; });
      });
    })
    .catch(() => {
      // Text content and navigation remain available when optional media fails.
    });
})();
