# CLAUDE.md — GEM Mobile

Read-only phone companion to the desktop GEM Dashboard (`..\CLAUDE.md`, `docs/MOBILE.md` there). Shows the GeM bid
portfolio (list, stage / TE / FE filters, bid detail, deposits, workflow timeline, costing link) from any phone.

## Stack
- One static `index.html` (all CSS + JS inline, ~110 KB). No build step, no npm, no framework.
- Google Identity Services token flow, scope `drive.readonly`; `fetch()` + Bearer token to Drive API v3. Token kept in
  memory only. Settings / cache live in `localStorage` (`gem_*` keys, cache `gem_cache`).
- PWA: `manifest.json` (scope `/gem-mobile/`), `sw.js` (caches `index.html` only, navigations), icons.

## Data
Never stored here. The desktop app (`mobile_export.py`) writes `data/{bids,workflow,security,manifest}.json` and
`costing/{bn}_latest.xlsx` into the Drive folder `GEM-Mobile`; the page reads them. A change to those JSON fields
must be made in both places (`mobile_export.py` and the renderers in `index.html`).

## Run / deploy
- Run: serve the folder (`python -m http.server`) — Drive sign-in only works from an origin registered for the
  OAuth client (`GOOGLE_CLIENT_ID` at the top of the script), i.e. the GitHub Pages URL.
- Live: https://raj0023.github.io/gem-mobile (GitHub Pages from `main`). Deploy = push. Bump `CACHE` in `sw.js`
  if `sw.js` itself changes.
- New users must be added as test users on the Google OAuth consent screen.

## Files
`index.html` app · `sw.js` service worker · `manifest.json` · `icon-*.png` / `icon.svg` / `gem.png` · `README.md` feature list.

## Never commit
`.gitignore` already excludes `client_secret.json`, `deploy.ps1` (holds a GitHub token) and `deploy.bat`; they sit in
the working folder. Keep it that way. Note `deploy.ps1`'s token is in plain text on disk — rotate it if it ever left this PC.
