# Checklist Hub — private Trello Power-Up

Consolidates checklist items (and member cards without checklist tasks) across boards you can access into one filterable list and calendar. Read-only: complete work on the Trello card itself.

## Status

**Feature-complete for a private workspace Power-Up**, but not deployable until you:

1. Register the Power-Up and put the API key in `public/config.js`
2. Host `public/` on **HTTPS**
3. Point Trello at that HTTPS connector URL

## What you get

- Board button: **Checklist Hub**
- Single **Boards** picker (tick to include / show; prefs remembered in cookies)
- Saved views + optional default view; teams from `Checklist Hub Team: …` checklists
- Welcome **Quick start** (team or saved view) when available
- Undated queue + member cards with no checklist tasks
- List grouping + calendar
- Clear actions: **List boards** (names) → **Load checklists** (items) → **Update status** (known items)
- Label + list filters; My day preset; CSV export of the current view
- Batched Trello API usage; data stays in memory only while the hub is open (no browser storage of Trello payloads)
- Cambridge Advance Online–inspired UI

## Local demo (no Trello)

```bash
python -m http.server 3000 --directory public
```

Open http://localhost:3000/demo.html

## Deploy checklist

### A. Create the Power-Up (Trello)

1. Go to [trello.com/power-ups/admin](https://trello.com/power-ups/admin)
2. **New** → pick your workspace
3. Name it (e.g. Checklist Hub), set author/support email
4. **API key** tab → generate a key
5. **Capabilities** → enable at least:
   - `board-buttons`
   - `show-settings`
6. Leave connector URL blank until the site is live (or set it after step B)

### B. Configure the app

Edit `public/config.js`:

- `appKey` → Power-Up API key from step A  
- `appName` / `appAuthor` → shown on the OAuth consent screen  

Do **not** put member tokens in the repo. Users authorize individually (`read` scope).

### C. Host `public/` on HTTPS

Upload **only the contents of `public/`** (or set the host root to `public/`).

| Host | Notes |
|------|--------|
| Cloudflare Pages / Netlify / Vercel | Drop `public/` as site root; `_headers` works on Netlify |
| GitHub Pages | Settings → Pages → deploy `public` folder (or `/docs`); HTTPS included |

You need a stable URL like `https://your-org.example/index.html`.

### D. Finish Power-Up registration

| Field | Value |
|--------|--------|
| iframe connector URL | `https://YOUR-HOST/index.html` |
| Privacy policy URL | `https://YOUR-HOST/privacy.html` |
| Allowed origins / return URL | your HTTPS origin, if the admin UI asks |

Save. Then on a board in that workspace:

**Power-Ups → Custom → Checklist Hub → Enable** → open the button → **Authorize**.

Tip: enable on one hub board (teams are read from that board); **Load checklists** still covers the boards you tick under Filters → Boards.

### E. Smoke-test before rolling out

- [ ] Authorize succeeds  
- [ ] Boards list on open (names only)  
- [ ] Tick boards → **Load checklists** returns expected items  
- [ ] Untick a loaded board hides its items (no reload needed)  
- [ ] Tick a board not yet loaded → warning offers **Load checklists**  
- [ ] **Update status** reflects completes done in Trello  
- [ ] Member cards without tasks appear  
- [ ] Calendar + List views work  
- [ ] Saved views / filters / board picks persist after reload (cookies)  
- [ ] Welcome **Don't show again** stays dismissed on reopen (About still reopens it)  
- [ ] Open card links land on the right card  
- [ ] Closing the modal and reopening shows idle until **Load checklists**  

## GitHub tips

- Commit the project with `YOUR_TRELLO_API_KEY` replaced by the real Power-Up key (Power-Up keys are client-side by design), **or** keep a private repo.
- Never commit personal Trello tokens.
- Prefer a **private** GitHub repo for an internal team Power-Up.
- Root of the hosted site must be the Power-Up files (`index.html` at `/`), not the parent folder that also contains `README.md` / `package.json`, unless you configure the host to publish `public/`.

## Using it

1. Click **Checklist Hub** (each open starts empty — boards list automatically; press **Load checklists** after ticking boards)
2. Optional welcome **Quick start**: pick a **team** or **saved view**, or tick boards yourself
3. Default filter: **Assigned to me** + **Incomplete**
4. Change filters as needed; click or press Enter/Space on column headers to sort
5. Open a card in Trello to complete work (the hub is read-only)
6. Day to day: **Update status** refreshes items you already have  
7. When you need newly assigned work or newly ticked boards: **Load checklists**

For workspace setup (team checklists, views, hub board), see **[ADMIN.md](./ADMIN.md)**.

## Rate limits (admin)

**Load checklists** costs roughly one rate-limit unit per ticked board (plus a small bootstrap). **Update status** spends one unit per open card, or one unit per board those items sit on — whichever is smaller. Prefer Update for day-to-day checks; Load when you need new boards or brand-new assignments. Request activity in the hub footer shows this session’s usage.

Trello limits are about **300 requests / 10s per API key** and **100 / 10s per token**. Each URL inside `/batch` counts as one request.

## Project layout

```
public/
  index.html          # Power-Up connector
  dashboard.html      # Main UI
  authorize.html      # OAuth click handler
  privacy.html
  demo.html           # Local/QA demo entry
  config.js           # ← put API key here
  js/                 # connector, api, dashboard
  css/
  icons/
```

## Optional later

- Shared sync backend + webhooks (best at heavy concurrent load)
- GitHub Action / Pages workflow
- Tighten CSP on hosts that support `_headers` / `netlify.toml`
