# Jinghang Gao's homepage

This static edition adapts Hanchao Zhang's homepage and the Minimal Light theme. It uses the template's existing HTML/CSS layout without a Notion API or Jekyll build dependency.

- Update biography, education, experience, awards, papers, and links in `index.html`.
- Update personal activities in `life.html`.
- Personal styling is in `assets/css/site.css`; template styles retain their provenance.
- The original repository content and history are preserved outside `docs/`. Publish only `docs/` so inherited third-party CVs and PDFs are not deployed with the new site.

For a local preview, run `python3 -m http.server 3108 --directory docs`. Publishing this version from `codex/minimal-light-homepage:/docs` updates the repository's public GitHub Pages site; it is not an isolated preview environment. After review, merge the changes and publish `master:/docs` for the permanent site. The `.nojekyll` file keeps publication buildless.

After reviewing the new site, set the Pages custom domain to `gaojinghang.top` before changing DNS. Point the apex A records at GitHub Pages and the `www` CNAME at `jakegjh.github.io`, following GitHub's current documentation. Enable HTTPS after the certificate is ready. Keep the previous Vercel project paused.

If a whole-domain Google Search Console removal was submitted, cancel it once the new site is ready to be indexed. The DNS TXT ownership verification record can remain.
