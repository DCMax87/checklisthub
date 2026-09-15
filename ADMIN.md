# Checklist Hub — admin setup (teams & views)

Short guide for workspace admins and power users. End users mainly need: select boards → **View checklists** → use **Refresh** day to day.

## Mental model

| Action | What it does |
|--------|----------------|
| Board catalog (automatic) | Fetches open board **names** on open |
| **View checklists** | Pulls checklist items from selected boards |
| **Refresh** | Refreshes current work and adds newly selected boards |
| **Rescan selected boards** | Finds brand-new assignments on boards already loaded |
| **Select / deselect Boards** | Controls which boards contribute visible work |

Completing work always happens on the **Trello card** (Power-Up is read-only).

## Hub board (for Teams)

1. Pick one board as the **Checklist Hub** board and enable the Power-Up there.
2. Teams are only discovered when the hub is opened **from that board**.
3. Create a checklist named exactly:

   `Checklist Hub Team: {Team Name}`

   Example: `Checklist Hub Team: Content Ops`

### Checklist items on a team checklist

| Item type | Meaning |
|-----------|---------|
| **Assigned to a member** | That person is on the team (Assignees preselect) |
| **Unassigned, text = board short link or URL** | Board included when that team is chosen |

Board links can be:

- Trello short link (e.g. `AbCdEfGh`)
- Full board URL (`https://trello.com/b/AbCdEfGh/...`)

If a team has **no board links**, users can still select boards manually. Prefer adding board links so Quick start is one click.

## Saved views (personal)

Anyone can save the current filters / boards / grouping from **Filters → Saved views**.

- **Save** — stores the current setup under a name (cookie on this host).
- **Set as default** — applied automatically after the next successful start (unless they picked another view on welcome).
- Welcome **Quick start** lists saved views under an optgroup when any exist.

Views are **per browser / host cookie**, not shared workspace config. For a shared “starter”, document a recommended view name and have each person Save it once, or rely on **Teams** for shared board/people scope.

## Welcome → Quick start

When teams and/or saved views exist, welcome shows one control:

1. **None** — tick boards yourself  
2. **Teams** — preselect people + boards from the team checklist  
3. **Saved views** — apply that person’s saved filters and board picks  

Then **View checklists** (button label adapts).
**Don't show again** hides welcome on future opens; **How refreshing works** (in Filters) brings it back.

## Day-to-day ops

1. Open Checklist Hub (boards list themselves).
2. View checklists (or use Quick start).
3. Use **Refresh** for current work and newly selected boards.
4. Use **Rescan selected boards** when hunting newly assigned work.
5. Closing the hub clears checklist data; board picks and views stay in cookies.

## Demo (no Trello)

`demo.html` and top-level `dashboard.html` use the built-in mock dataset so people can try filters/views without authorizing. Demo data is intentionally kept wired in the dashboard bundle.

## Privacy & hosting (admin)

- Host `public/` on **HTTPS**; set the Power-Up connector to that origin.
- OAuth scope is **read** only.
- Trello card/board content stays **in memory** while the hub is open — not in cookies.
- Cookies hold UI prefs only (boards ticks, views, density, etc.).
- API key in `config.js` is expected client-side for Power-Ups; set **Allowed Origins**; never commit personal member tokens.
- Netlify-style hosts pick up CSP from `public/_headers`; other hosts need an equivalent header.

## Smoke checklist

- [ ] Open from hub board → teams appear in Quick start / Filters → Team  
- [ ] Team with board links → View checklists works
- [ ] Team with no boards → can still select boards and start
- [ ] Saved view on welcome → starting applies filters after load
- [ ] Deselecting a board hides items; selecting a new board offers Add
- [ ] Don't show again persists; About reopens welcome
- [ ] `demo.html` works offline from Trello  
