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

  /**
   * Absolute expiry (e.g. local midnight). Uses both expires= and max-age.
   * partitioned=true is for the Trello iframe: SameSite=Lax cookies are
   * rejected there, so the parked-item cookie would not survive a close.
   */
  function setCookieExpiresAt(name, value, expiresAt, partitioned) {
    const expires = new Date(expiresAt);
    if (!isFinite(expires.getTime())) {
      throw new Error("Invalid cookie expiry.");
    }
    const maxAge = Math.max(
      1,
      Math.floor((expires.getTime() - Date.now()) / 1000)
    );
    const encoded = encodeURIComponent(value == null ? "" : String(value));
    if (encoded.length > 3500) {
      throw new Error("Preference too large to store in a cookie.");
    }
    var suffix = cookieSecuritySuffix();
    if (
      partitioned &&
      typeof location !== "undefined" &&
      location.protocol === "https:"
    ) {
      suffix = "; SameSite=None; Secure; Partitioned";
    }
    document.cookie =
      name +
      "=" +
      encoded +
      "; path=/; expires=" +
      expires.toUTCString() +
      "; max-age=" +
      maxAge +
      suffix;
  }

  function removeCookie(name, partitioned) {
    var suffix = cookieSecuritySuffix();
    if (
      partitioned &&
      typeof location !== "undefined" &&
      location.protocol === "https:"
    ) {
      suffix = "; SameSite=None; Secure; Partitioned";
    }
    document.cookie = name + "=; path=/; max-age=0" + suffix;
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
    try {
      setCookie(name, JSON.stringify(value), days);
    } catch (e) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("Checklist Hub could not save preferences:", e.message || e);
      }
    }
  }

  function writeJsonCookieExpiresAt(name, value, expiresAt, partitioned) {
    try {
      setCookieExpiresAt(name, JSON.stringify(value), expiresAt, partitioned);
    } catch (e) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("Checklist Hub could not save preferences:", e.message || e);
      }
    }
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
    setExpiresAt: setCookieExpiresAt,
    remove: removeCookie,
    readJson: readJsonCookie,
    writeJson: writeJsonCookie,
    writeJsonExpiresAt: writeJsonCookieExpiresAt,
    purgeLegacyBrowserStorage: purgeLegacyBrowserStorage,
  };
})(window);
