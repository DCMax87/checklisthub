# Checklist Hub — admin setup (teams & views)

Short guide for workspace admins and power users. End users mainly need: tick boards → **Load checklists** → day to day **Update status**.

## Mental model

| Action | What it does |
|--------|----------------|
| **List boards** | Fetches open board **names** (automatic on open) |
| **Load checklists** | Pulls checklist items from **ticked** boards |
| **Update status** | Refreshes open/complete for items **already** in the hub |
| **Tick / untick Boards** | Show/hide after load; also sets the next Load scope |

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

If a team has **no board links**, users can still tick boards manually and Load checklists. Prefer adding board links so Quick start is one click.

## Saved views (personal)

Anyone can save the current filters / boards / grouping from **Filters → Saved views**.

- **Save** — stores the current setup under a name (cookie on this host).
- **Set as default** — applied automatically after the next successful Load (unless they picked another view on welcome).
- Welcome **Quick start** lists saved views under an optgroup when any exist.

Views are **per browser / host cookie**, not shared workspace config. For a shared “starter”, document a recommended view name and have each person Save it once, or rely on **Teams** for shared board/people scope.

## Welcome → Quick start

When teams and/or saved views exist, welcome shows one control:

1. **None** — tick boards yourself  
2. **Teams** — preselect people + boards from the team checklist  
3. **Saved views** — apply that person’s saved filters and board picks  

Then **Load checklists** (button label adapts).  
**Don't show again** hides welcome on future opens; **About List, Load & Update** (in Filters) brings it back.

## Day-to-day ops

1. Open Checklist Hub (boards list themselves).
2. Load (or use Quick start).
3. Prefer **Update status** for completes already in the list.
4. **Load checklists** again when adding boards or hunting newly assigned work.
5. Closing the hub clears checklist data; board picks and views stay in cookies.

## Privacy & hosting (admin)

- Host `public/` on **HTTPS**; set the Power-Up connector to that origin.
- OAuth scope is **read** only.
- Trello card/board content stays **in memory** while the hub is open — not in cookies.
- Cookies hold UI prefs only (boards ticks, views, density, etc.).
- API key in `config.js` is expected client-side for Power-Ups; never commit personal member tokens.

## Smoke checklist

- [ ] Open from hub board → teams appear in Quick start / Filters → Team  
- [ ] Team with board links → Load team checklists works  
- [ ] Team with no boards → can still tick boards and Load  
- [ ] Saved view on welcome → Load with this view applies filters after load  
- [ ] Untick board hides items; tick new board offers Load  
- [ ] Don't show again persists; About reopens welcome  
