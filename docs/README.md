# Jinghang Gao's homepage

This static edition adapts Hanchao Zhang's homepage and the Minimal Light theme. It uses the template's existing HTML/CSS layout without a Notion API or Jekyll build dependency.

- Update biography, education, experience, awards, papers, and links in `index.html`.
- Update personal activities in `life.html`.
- Personal styling is in `assets/css/site.css`; template styles retain their provenance.
- Research cards follow the reference template's 10px rounded corners, 8px/6px internal padding, 2px hover lift and soft shadow. Card spacing reserves the original list margin and line-break gap without external outlines. `assets/js/progress.js` restores the 3px reading progress bar; both details retain keyboard and reduced-motion handling where applicable.
- The main accent is official UH Brick `#960C22`, with Chocolate `#640817` for hover states and gradients. The name shimmers only between these dark reds. The background stays white. Semantic CSS variables cover links, gradients, buttons, surfaces, and shadows.
- The background uses the original pinned Vanta NET renderer and default node layout, with one continuous full-window field. A CSS ellipse leaves the reading area clear; there are no fixed fragments, cloned views, custom render passes, or modified node motion. Mouse camera coefficients are reduced to 0.25 horizontally and 0.20 vertically. The effect is hidden below 1200px and for reduced-motion preferences, and pauses in hidden tabs. Three.js r134 and Vanta 0.5.24 are vendored with their MIT licenses.
- Faint industrial engineering watermarks include linear and binary optimization, Little's law, the Lagrangian, and a nonnegative queue recursion. They are decorative formulas, independent of the listed research results.
- The favicon is the unmodified official Interlocking UH mark from `https://www.uh.edu/brand/_img/uh_red.png`.
- The original repository content and history are preserved outside `docs/`. Publish only `docs/` so inherited third-party CVs and PDFs are not deployed with the new site.

For a local preview, run `python3 -m http.server 3109 --directory docs`. The public GitHub Pages site publishes `master:/docs`; merge reviewed changes into `master` to update it. The `.nojekyll` file keeps publication buildless.

After reviewing the new site, set the Pages custom domain to `gaojinghang.top` before changing DNS. Point the apex A records at GitHub Pages and the `www` CNAME at `jakegjh.github.io`, following GitHub's current documentation. Enable HTTPS after the certificate is ready. Keep the previous Vercel project paused.

If a whole-domain Google Search Console removal was submitted, cancel it once the new site is ready to be indexed. The DNS TXT ownership verification record can remain.

## Adding research and personal images

Store approved images in `docs/assets/img/` and update `assets/data/media.json`. Text remains in the HTML, so papers, research and presentations remain readable without JavaScript. Research covers use a uniform 16:10 frame with `object-fit: contain`, preserving the whole figure. Missing or failed research images use `assets/img/covers/blank-cover.svg`; the frame and venue badge remain available for later replacement. Images load lazily after their containers enter layout.

The `research` object has one entry for each published article, research project and presentation. Keep its IDs matched to the HTML `data-media-id` values. Set `src`, `alt`, and optional `caption`. The original thumbnail shadow, rounded corners and top-left `abbr.badge` are retained. `badge` controls the visible journal/conference label; `badgeTitle` supplies its full-name tooltip, including “Target” for unsubmitted projects. Clicking opens `href`, or the cover image when `href` is empty. Current project images open only the images; no private manuscript, slide deck or PDF is deployed.

The eight selected covers are copied unchanged from the approved figures. The TR-B framework retains the credit “Icons by Magnific, Special Flat.” ([icon source](https://www.magnific.com/author/magnific/icons/special-flat_8)). The CYBER-CARE cover is the Houston subnetwork map embedded in the actual presentation. The six conference entries without verified version-specific artwork retain blank covers.

## Research and presentation versions

Only the published Utilities Policy article appears under Publications. The Research section contains journal manuscripts and ongoing projects, with statuses confirmed by the owner on October 28, 2026:

| ID | Journal or target | Status |
| --- | --- | --- |
| `tre-cyber-resilience` | Transportation Research Part E | Under review |
| `crime-beryl` | Applied Geography | Submitted after revision |
| `tra-campus-travel` | Target: Transportation Research Part A | In final preparation |
| `trb-priority-reversals` | Target: Transportation Research Part B | In final preparation |
| `trc-trusted-recovery` | Target: Transportation Research Part C | Ongoing |
| `trd-charging-coverage` | Target: Transportation Research Part D | Ongoing |

The four `trb-27-*` entries retain their accepted conference-version titles under Poster Presentations. They are distinct from the journal projects, including the project whose target is Part B. `cybercare-admm-2026` is an oral presentation at the CYBER-CARE Annual Symposium, April 13–15, 2026, Embry-Riddle Aeronautical University, Daytona Beach, Florida ([official event notice](https://www.uh.edu/cybercare/newsevents/cybercare-symposium-2025/2026cybercare-symposium.pdf)). No exact individual session date is asserted. `isets-2023` retains the verified generic “Presentation” designation; its oral format and individual presenter have not been established.

Awards follow all research, presentation and experience sections.

For example, after adding approved image files, an entry can use:

```json
{
  "src": "assets/img/papers/energy-transition-thumb.jpg",
  "href": "assets/img/papers/energy-transition-full.jpg",
  "alt": "Description of the research figure",
  "caption": "",
  "badge": "Utilities Policy",
  "badgeTitle": "Utilities Policy"
}
```

For a new real paper, presentation or project, copy the `li` from the inert `research-entry-template` at the end of `index.html` into a `bibliography` list. Replace its title, authors, periodical and unique `data-media-id`, then add the matching media entry. Native Paper, Poster, Slides, Code and BibTeX buttons are prepared in the template; supply real URLs and remove `hidden` only for buttons you need. Templates are not rendered as fake projects.

The `life` array accepts `src`, optional full-size `href`, `alt`, `caption`, optional `subtitle`, `section` and `layout`. Supported sections are `general`, `frisbee`, `outdoors` and `creative`. Use `layout: "photo"` for the original two-column framed photos, or `layout: "scroll"` for the three-column mounted-artwork treatment. Photos retain their array order within each section. For another real hobby, copy an existing `life-section` in `life.html`, give its gallery a new `data-life-gallery` value, and use that value as `section`; no JavaScript change is needed. The source-style hover, zoom, captions, scroll reveal and keyboard-accessible in-page lightbox are ready; Escape, the close button or the backdrop closes the viewer. Leave the array empty until personal photos are provided.

```json
{
  "src": "assets/img/life/frisbee-thumb.jpg",
  "href": "assets/img/life/frisbee-full.jpg",
  "alt": "Description of the photograph",
  "caption": "Your caption",
  "subtitle": "Optional place and date",
  "section": "frisbee",
  "layout": "photo"
}
```

Conference acceptance and upcoming poster presentations are separate from journal publications. Add author lists, individual session times, poster PDFs, or presentation images only when their final versions are supplied or verified.

## Template fidelity

The audit baseline is `Hanchao-Zhang/Hanchao-Zhang.github.io` at `1247f17dbcdd8e65e780b3b89da8de92ec056420`.

| Source component | Preserved in this project |
| --- | --- |
| `_layouts/homepage.html` and `_sass/minimal-light.scss` | Crimson Pro typography, sidebar/body proportions, native publication rows, avatar frame and responsive rules. The supplied portrait retains its personal crop. |
| `assets/css/publications.css` | Native title, author, periodical, button, thumbnail and top-left journal/conference badge classes. |
| `style.md` | Original hover geometry, name shimmer, section/publication reveal at `.07` with `40ms` staggering, and the `3px` reading progress bar. |
| `_includes/beyond_research.md` | Hero, grouped photo/artwork frames, hover/zoom, `.08` and `60ms` reveal, and in-page lightbox. |

Intentional differences are the supplied personal information, section order, visible education and activities, Upcoming labels, white background, dark UH-red palette, IE formulas, official favicon, and the requested original NET effect with a central ellipse and gentler mouse movement. Keyboard/reduced-motion fallbacks and empty-image handling remain. The template owner's photos, publications, CV, account links and analytics ID are not copied into the public site.
