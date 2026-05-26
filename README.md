# GEM Mobile

A read-only companion web app for the GEM Dashboard — monitor your GeM (Government e-Marketplace) bid portfolio from any phone or browser, anywhere, without installing anything.

**Live app:** https://raj0023.github.io/gem-mobile

---

## Overview

GEM Mobile gives the procurement team a clean, mobile-friendly window into bid data that lives on the office network. The desktop GEM Dashboard exports a snapshot to Google Drive after every backup run; this app reads that snapshot and renders it — no server, no database, no installation.

Because all data flows through your own Google Drive account, nothing is stored on external servers or shared with third parties. Sign in once, and your bids are a tap away.

---

## Features

### Bid List
- **Instant search** across bid number, client, product, location, quoted company, and GeM contract number
- **Stage filter chips** — Quoted, Technical Eval, Financial Eval, Order, Closed — with live counts
- **TE/FE/Non-GEM filter row** — filter by evaluation outcome or bid type; pills show counts and hide when empty
- **Sort controls** — sort by bid number, client, product, stage, or status; direction toggles with ↑/↓
- **Three layout modes** — Default (full cards), Compact (tighter spacing), Dense (single-row list)
- **Show/hide Closed** toggle — keep the list focused on active bids

### Bid Detail
Each bid opens a full detail screen with collapsible sections:
- **Overview** — key fields in a two-column grid (dates, company, contract number, etc.)
- **Evaluation** — TE result (Qualified / Not Qualified / Partly Qualified) and FE result with rank (L1 / L2 / L3 / Disqualified / …)
- **Security Deposits** — EMD, PBG, and SD cards showing amount, bank, instrument number, issue/due dates, and status
- **Workflow Timeline** — chronological events with type, date, notes, and status; spine-and-dot layout
- **Costing Backup** — freshness indicator (green / amber when stale), last-backed-up timestamp, and a direct link to open the costing Excel in Google Drive Viewer

### Cards
- **TE/FE badges** on every card — quick pass/fail indicators without opening the detail
- **Deposit pills** — grouped by type (EMD/PBG/SD), summed amounts in K/L shorthand, green dot = active
- **Costing shortcut button** — `📂 ↗` on cards that have a costing file; opens Drive Viewer directly from the list

### Settings Panel
Tap the ⚙ gear to open the slide-in settings drawer:
- **Theme** — Dark (default), High-Contrast, Warm
- **Font size** — Small, Medium, Large
- **Date format** — DD-MM-YYYY or DD MMM YYYY
- **Costing freshness threshold** — how many days before the costing badge turns amber
- **Show Closed bids** toggle

All settings persist in `localStorage` — they survive page refreshes and are per-device.

---

## How data gets here

The desktop **GEM Dashboard** app writes a snapshot to a local folder that syncs to Google Drive (typically `G:\My Drive\GEM-Mobile`):

| File | Contents |
|------|----------|
| `data/bids.json` | All bids with stage, status, TE/FE results, costing status |
| `data/workflow.json` | Workflow events per bid (non-Done + Done within 90 days) |
| `data/security.json` | EMD/PBG/SD deposit records per bid |
| `data/manifest.json` | Export metadata — timestamp, machine, counts |
| `costing/{bn}_latest.xlsx` | Latest costing Excel, MD5-guarded (skips unchanged files) |

**Automatic export:** Settings → Backup → Google Drive Mobile Export → enable and set the folder path. The export runs automatically after every backup.

**Manual export:** Settings → Backup → Export Now.

---

## Tech

- **Pure static HTML** — all CSS and JS inline, no build step, no npm, no bundler
- **Hosted on GitHub Pages** — repo: `raj0023/gem-mobile`
- **Auth:** Google Identity Services, OAuth 2.0 token flow (`initTokenClient`), scope `drive.readonly`
- **Data:** `fetch()` + Bearer token → Google Drive API v3; token in memory only, never in localStorage
- **PWA:** `manifest.json` + `apple-touch-icon` for Add to Home Screen on iOS/Android
- **No external dependencies** — no React, no Vue, no Tailwind; ships as a single `index.html`

---

## Access

The app uses Google OAuth. New users must be added as test users in the Google Cloud Console before they can sign in (OAuth consent screen → Test users). Contact the admin to be added.

Once signed in, the token is kept in memory for the session. Closing the tab signs you out. The app attempts a silent re-auth on page load if the previous token hasn't expired.
