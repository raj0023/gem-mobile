# GEM Mobile

Mobile web app for the GEM Dashboard — view GeM bid status, costing backup info, workflow events, and security deposits from any phone.

**Live app:** https://raj0023.github.io/gem-mobile

---

## What it does

- Sign in with your Google account
- Reads `bids.json`, `manifest.json` from your `GEM-Mobile` folder in Google Drive
- Shows all bids with instant search and stage filtering
- No data is stored on your device — everything comes from your own Drive

## How data gets here

The desktop **GEM Dashboard** app exports data automatically after every backup run (Settings → Backup → Google Drive Mobile Export). You can also click **Export Now** to push data manually.

## Sessions

| Session | Status | Features |
|---------|--------|---------|
| 1 | ✅ Done | `mobile_export.py` — exports JSON + costing files to Drive |
| 2 | ✅ Done | Sign-in, bid list, search, stage filter chips |
| 3 | ⏳ Next | Bid detail, costing file open, workflow, security sections |

## Tech

- Pure static HTML — no build step, no npm, no server
- Hosted on GitHub Pages
- Google Identity Services (OAuth 2.0 token flow)
- Google Drive API v3 via `fetch()`
