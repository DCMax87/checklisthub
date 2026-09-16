/**
 * Demo / embed detection and safe external URL helpers.
 * Loaded before dashboard.js so gating cannot force mock data inside Trello.
 */
(function (global) {
  function isEmbedded() {
    try {
      return global.self !== global.top;
    } catch (e) {
      // Cross-origin parent ⇒ treat as embedded (e.g. Trello iframe).
      return true;
    }
  }

  function hasAuthOpener(options) {
    var opts = options || {};
    if (typeof opts.hasOpener === "boolean") return opts.hasOpener;
    try {
      return Boolean(global.opener && !global.opener.closed);
    } catch (e) {
      // Cross-origin opener still means this is likely an OAuth return window.
      return Boolean(global.opener);
    }
  }

  /**
   * Demo is only for top-level play (demo.html, localhost, marketing).
   * When embedded, always return false — even if ?demo=1 or forceDemo is set.
   * OAuth consent return windows also stay out of demo: they load our origin
   * top-level with window.opener set, and demo mode would replace the Power-Up
   * client and break token handoff.
   */
  function detectDemoMode(searchParams, hubConfig, options) {
    var opts = options || {};
    var embedded =
      typeof opts.embedded === "boolean" ? opts.embedded : isEmbedded();
    if (embedded) return false;
    if (hasAuthOpener(opts)) return false;

    var params = searchParams || new URLSearchParams("");
    if (
      params.get("demo") === "1" ||
      params.get("demo") === "true" ||
      Boolean(hubConfig && hubConfig.forceDemo)
    ) {
      return true;
    }
    // Top-level without (or with) Power-Up client: play with mock data.
    return true;
  }

  function powerUpMissingWhileEmbedded(options) {
    var opts = options || {};
    var embedded =
      typeof opts.embedded === "boolean" ? opts.embedded : isEmbedded();
    var hasPowerUp =
      opts.hasPowerUp != null
        ? Boolean(opts.hasPowerUp)
        : Boolean(global.TrelloPowerUp);
    return embedded && !hasPowerUp;
  }

  /** Allow only https://trello.com and https://*.trello.com hrefs. */
  function safeTrelloUrl(url) {
    if (url == null || url === "") return null;
    var raw = String(url).trim();
    if (!raw) return null;
    try {
      var parsed = new URL(raw, "https://trello.com");
      if (parsed.protocol !== "https:") return null;
      var host = parsed.hostname.toLowerCase();
      if (host === "trello.com" || host.endsWith(".trello.com")) {
        return parsed.href;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function setSafeHref(anchor, url) {
    if (!anchor) return false;
    var safe = safeTrelloUrl(url);
    if (!safe) {
      anchor.removeAttribute("href");
      return false;
    }
    anchor.href = safe;
    return true;
  }

  global.ChecklistHubDemoMode = {
    isEmbedded: isEmbedded,
    detect: detectDemoMode,
    powerUpMissingWhileEmbedded: powerUpMissingWhileEmbedded,
    safeTrelloUrl: safeTrelloUrl,
    setSafeHref: setSafeHref,
  };
})(typeof window !== "undefined" ? window : globalThis);
