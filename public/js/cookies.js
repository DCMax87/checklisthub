(function (global) {
  /**
   * Tiny cookie helpers for preferences only (not Trello payload data).
   * Note: document cookies are still JS-readable; we never put tokens or
   * board/card contents here—only compact UI preference IDs.
   */
  function cookieSecuritySuffix() {
    var secure =
      typeof location !== "undefined" && location.protocol === "https:"
        ? "; Secure"
        : "";
    return "; SameSite=Lax" + secure;
  }

  function getCookie(name) {
    const prefix = name + "=";
    const parts = document.cookie.split("; ");
    for (let i = 0; i < parts.length; i += 1) {
      if (parts[i].indexOf(prefix) === 0) {
        return decodeURIComponent(parts[i].slice(prefix.length));
      }
    }
    return null;
  }

  function setCookie(name, value, days) {
    const maxAge = Math.floor((days == null ? 180 : days) * 24 * 60 * 60);
    const encoded = encodeURIComponent(value == null ? "" : String(value));
    // Keep under typical 4KB cookie limits by refusing oversized values.
    if (encoded.length > 3500) {
      throw new Error("Preference too large to store in a cookie.");
    }
    document.cookie =
      name +
      "=" +
      encoded +
      "; path=/; max-age=" +
      maxAge +
      cookieSecuritySuffix();
  }

  function removeCookie(name) {
    document.cookie =
      name + "=; path=/; max-age=0" + cookieSecuritySuffix();
  }

  function readJsonCookie(name, fallback) {
    const raw = getCookie(name);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeJsonCookie(name, value, days) {
    setCookie(name, JSON.stringify(value), days);
  }

  /** Remove legacy localStorage keys that held Trello payloads / prefs. */
  function purgeLegacyBrowserStorage() {
    try {
      [
        "checklist-hub-cache-v1",
        "checklist-hub-cache-v2",
        "checklist-hub-cache-v3",
        "checklist-hub-prefs-v1",
      ].forEach(function (key) {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    } catch (e) {
      // ignore
    }
  }

  global.ChecklistHubCookies = {
    get: getCookie,
    set: setCookie,
    remove: removeCookie,
    readJson: readJsonCookie,
    writeJson: writeJsonCookie,
    purgeLegacyBrowserStorage: purgeLegacyBrowserStorage,
  };
})(window);
