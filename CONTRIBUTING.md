# Contributing to Checklist Hub

Thanks for helping improve this Trello Power-Up.

## Ground rules

- Keep the hub **read-only** toward Trello (no write/update/delete API calls).
- Do not commit personal member tokens or `.env` files.
- Power-Up API keys are client-side by design; each deployer should use **their own** key and lock **Allowed Origins**.
- Prefer small, focused pull requests.

## Local demo

```bash
npm start
```

Open http://localhost:3000/demo.html (no Trello account required).

## Tests

```bash
npm test
```

## Coding notes

- UI strings that name actions should match the product (**View checklists**, **Refresh**, **Rescan selected boards**).
- Demo mode must never activate inside a Trello iframe — see `public/js/demo-mode.js`.
- Prefer `textContent` / DOM APIs over `innerHTML` for user-controlled strings.
- Card links must go through `ChecklistHubDemoMode.safeTrelloUrl` / `setSafeHref`.

## Reporting issues

Use the support contact configured by the host (`supportEmail` / `supportUrl` in `config.js`), or open a GitHub issue if this repo is public.
