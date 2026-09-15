# Checklist Hub — Trello Power-Up

Consolidates checklist items (and member cards without checklist tasks) across boards you can access into one filterable list and calendar. Read-only: complete work on the Trello card itself.

**English UI.** MIT licensed. Host the static `public/` folder on HTTPS and register it as a Power-Up.

## Status

Ready to share publicly once you:

1. Put your Power-Up **API key** in `public/config.js` (replace `YOUR_TRELLO_API_KEY`)
2. Lock **Allowed Origins** on the API key tab to your HTTPS origin only
3. Optionally set `supportEmail` / `supportUrl` in `config.js`
4. Host `public/` on **HTTPS** and point Trello at `index.html`

Local demo needs no Trello account: open `demo.html` or top-level `dashboard.html`.

## What you get

- Board button: **Checklist Hub**
- **Boards** picker (prefs in cookies)
- Saved views + teams from `Checklist Hub Team: …` checklists
- List, calendar, and insight views
- Focused **My Day**, **Upcoming**, **Undated**, and **All work** scopes
- **Refresh** for current work, with a full selected-board rescan when needed
- Built-in demo dataset for play without connecting Trello
- Disconnect control clears the Power-Up token from the hub

## Local demo (no Trello)

```bash
npm start
npm test
```

Open http://localhost:3000/demo.html

## Deploy

See the previous deploy checklist: register the Power-Up, set `config.js`, host `public/` as the site root, set connector URL to `https://YOUR-HOST/index.html` and privacy to `privacy.html`.

### Content-Security-Policy

HTML pages include a CSP meta tag. Netlify-style hosts also get `public/_headers`. On GitHub Pages, prefer Pages headers or rely on the meta CSP.

### Rate limits

One shared Power-Up API key serves all users (~**300** units / 10s). Each member token is ~**100** / 10s. Prefer **Refresh** day to day; lower `batchRoutesPerRequest` if many people use the same key.

### OAuth

Default token lifetime is **30 days** (`oauthExpiration` in `config.js`). Users re-authorize when it expires, or use **Disconnect** in the footer.

## Using it

1. Authorize (read-only)
2. Select boards → **View checklists**
3. Day to day: **Refresh**; rescan selected boards when you need new work
4. Open cards in Trello to complete items

Keyboard: `1`–`7` views · `/` search · `f` filters

Admin setup (teams & views): **[ADMIN.md](./ADMIN.md)** · Contributing: **[CONTRIBUTING.md](./CONTRIBUTING.md)** · Changes: **[CHANGELOG.md](./CHANGELOG.md)**

## Project layout

```
public/     # Host this folder
tests/      # node --test
LICENSE     # MIT
```
