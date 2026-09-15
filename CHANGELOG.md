# Changelog

## 1.1.0 — 2026-09-15

### Focused views
- My Day, Upcoming, Undated, and All work are the primary scopes
- List, Agenda, and Calendar lead; analytical views are grouped as Insights
- One Refresh action handles current work and newly selected boards
- Clear pre-authorization state, filter modal, board search, and keyboard help

### Efficiency and resilience
- Incremental scans load only newly selected or failed boards
- Filter state is captured once per render instead of queried for every row
- Leaner Trello checklist payloads, rolling local request budget, and accurate retry logging
- Calendar-day Tomorrow behavior, improved token-expiry handling, and broader contract tests

## 1.0.1 — 2026-09-14

### Security & public readiness
- Demo mode never activates inside a Trello iframe (`?demo=1` ignored when framed)
- Hard error when Power-Up client fails to load while embedded
- Safe allowlist for Trello card URLs; CSV export guards spreadsheet formulas
- OAuth token expiration defaults to `30days` (configurable)
- Disconnect control clears the Power-Up token from the hub
- CSP meta tags + Netlify `_headers`; theme boot moved out of inline script
- Privacy policy rewritten for public self-hosted distribution

### Packaging
- MIT LICENSE, CONTRIBUTING, version in footer
- API key placeholder for public templates; rate-limit UI shows key + token caps

## 1.0.0 — 2026-09-09

- Initial Checklist Hub Power-Up: Load boards, Update status, filters, views, calendar, insights, demo dataset
