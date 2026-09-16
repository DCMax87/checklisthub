/**
 * Checklist Hub — configure after you register the Power-Up
 * at https://trello.com/power-ups/admin
 *
 * APP_KEY must match the key from your Power-Up's "API key" tab.
 * This value is public in the browser (Power-Up client keys always are);
 * protect it with Allowed Origins on the API key tab (your HTTPS origin only).
 *
 * For public forks: leave the placeholder and set your own key before hosting.
 */
window.CHECKLIST_HUB_CONFIG = {
  appKey: "c43e2f461e015efa5cdcb07fdd5ce506",
  appName: "Checklist Hub",
  appAuthor: "Checklist Hub",
  /** Shown in footer / privacy contact. Optional. */
  supportEmail: "",
  /** Alternate support link (docs, issues). Optional. */
  supportUrl: "",
  /** Display version in the hub footer. */
  appVersion: "1.1.0",
  /** After this age, suggest a full selected-board rescan for new work. */
  rescanNudgeMs: 15 * 60 * 1000,
  /**
   * Routes packed into each Trello /batch request (1–10).
   * Lower = gentler on shared API-key rate limits; higher = fewer HTTP round-trips.
   */
  batchRoutesPerRequest: 3,
  /**
   * After statuses are this old, show a Refresh banner (no automatic API calls).
   * 0 disables the nudge.
   */
  statusNudgeMs: 5 * 60 * 1000,
  /**
   * Trello OAuth token lifetime: "1hour" | "1day" | "30days" | "never".
   * Prefer a finite value for public installs; users can re-authorize when it expires.
   */
  oauthExpiration: "30days",
};
