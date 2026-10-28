# Jinghang Gao's homepage

This static edition adapts Hanchao Zhang's homepage and the Minimal Light theme. It uses the template's existing HTML/CSS layout without a Notion API or Jekyll build dependency.

- Update biography, education, experience, awards, papers, and links in `index.html`.
- Update personal activities in `life.html`.
- Personal styling is in `assets/css/site.css`; template styles retain their provenance.
- The main accent is official UH Brick `#960C22`, with Chocolate `#640817` for hover states and gradients, to match the deeper red in the name. The name retains its Chocolate-to-UH-red gradient. The background stays white. Semantic CSS variables cover links, gradients, buttons, surfaces, and shadows.
- The Vanta NET background follows the main accent and uses one small, sparse network in each empty corner outside the content columns. Gutter-aware containers exclude all text; soft boundaries fade the clusters into white. Mouse and touch camera movement is disabled, and node drift runs at 8% of the default speed. The effects are hidden below 1200px and for reduced-motion preferences, and pause in hidden tabs. Three.js r134 and Vanta 0.5.24 are pinned and vendored with their MIT licenses.
- Faint industrial engineering watermarks include linear and binary optimization, Little's law, the Lagrangian, and a nonnegative queue recursion. They are decorative formulas, independent of the listed research results.
- The favicon is the unmodified official Interlocking UH mark from `https://www.uh.edu/brand/_img/uh_red.png`.
- The original repository content and history are preserved outside `docs/`. Publish only `docs/` so inherited third-party CVs and PDFs are not deployed with the new site.

For a local preview, run `python3 -m http.server 3109 --directory docs`. The public GitHub Pages site publishes `master:/docs`; merge reviewed changes into `master` to update it. The `.nojekyll` file keeps publication buildless.

After reviewing the new site, set the Pages custom domain to `gaojinghang.top` before changing DNS. Point the apex A records at GitHub Pages and the `www` CNAME at `jakegjh.github.io`, following GitHub's current documentation. Enable HTTPS after the certificate is ready. Keep the previous Vercel project paused.

If a whole-domain Google Search Console removal was submitted, cancel it once the new site is ready to be indexed. The DNS TXT ownership verification record can remain.

## Adding research and personal images

Store approved images in `docs/assets/img/` and update `assets/data/media.json`. Text remains in the HTML, so papers and accepted posters remain readable without JavaScript. Empty image fields do not create placeholder boxes.

The `research` object has one entry for the published article and one for each presentation. Keep these IDs unchanged: `utilities-policy-2026`, `trb-27-01161`, `trb-27-01159`, `trb-27-01160`, `trb-27-01162`, `uss-2023`, and `isets-2023`. Set each entry's `src`, `alt`, and optional `caption`; `src` is relative to the site, such as `assets/img/trb-27-01161-poster.jpg`. Research thumbnails preserve the whole image and link to its original size.

The `life` array accepts photo objects with the same `src`, `alt`, and `caption` fields. Photos appear in array order on the Beyond Research page. Leave the array empty until personal photos are provided.

Conference acceptance and upcoming poster presentations are separate from journal publications. Add author lists, individual session times, poster PDFs, or presentation images only when their final versions are supplied or verified.
