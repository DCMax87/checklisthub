/**
 * Checklist Hub — fill these in after you register the Power-Up
 * and generate an API key at https://trello.com/power-ups/admin
 *
 * APP_KEY must match the key from your Power-Up's "API key" tab.
 */
window.CHECKLIST_HUB_CONFIG = {
  appKey: "b80f2d51e1b906460bc7ff7166238cba",
  appName: "Checklist Hub",
  appAuthor: "Your Team",
  /** How long cached checklist data is considered fresh (ms). */
  cacheTtlMs: 5 * 60 * 1000,
  /**
   * Routes packed into each Trello /batch request (1–10).
   * Lower = gentler on shared API-key rate limits; higher = fewer HTTP round-trips.
   */
  maxConcurrentBoardFetches: 4,
  /**
   * After statuses are this old, show an Update status banner (no automatic API calls).
   * 0 disables the nudge.
   */
  statusNudgeMs: 5 * 60 * 1000,
};
