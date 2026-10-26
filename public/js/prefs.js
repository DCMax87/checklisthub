(function (global) {
  const cookies = global.ChecklistHubCookies;
  const PREFS_COOKIE = "ch_hub_prefs";
  const VIEWS_COOKIE = "ch_hub_views";
  const ACK_COOKIE = "ch_hub_ack_day";
  const ACK_MAX_IDS = 80;

  function normalizeGroupPageSize(value) {
    var n = Number(value);
    if (!isFinite(n) || n < 0) return 20;
    if (n === 0) return 0;
    if (n === 10 || n === 20 || n === 50 || n === 100) return n;
    return 20;
  }

  function normalizeAgendaHorizon(value) {
    if (value === "7" || value === "14" || value === "today") return value;
    return "today";
  }

  function localDayKey(date) {
    var d = date || new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1);
    if (m.length < 2) m = "0" + m;
    var day = String(d.getDate());
    if (day.length < 2) day = "0" + day;
    return y + "-" + m + "-" + day;
  }

  function nextLocalMidnight() {
    var d = new Date();
    d.setHours(24, 0, 0, 0);
    return d;
  }

  function baseAckId(id) {
    if (
      global.ChecklistHubApi &&
      typeof global.ChecklistHubApi.baseItemId === "function"
    ) {
      return global.ChecklistHubApi.baseItemId(id);
    }
    return String(id || "").replace(/#reminder-.*$/, "");
  }

  function pruneCollapsedGroups(map) {
    var src = map && typeof map === "object" ? map : {};
    var out = {};
    var keys = Object.keys(src).filter(function (key) {
      return src[key];
    });
    keys.slice(0, 80).forEach(function (key) {
      out[String(key).slice(0, 80)] = true;
    });
    return out;
  }

  function defaultPrefs() {
    return {
      groupBy: "due",
      view: "list",
      workType: "both",
      sortKey: "due",
      sortDir: "asc",
      allowlist: [],
      collapsedGroups: {},
      filtersOpen: false,
      density: "comfortable",
      theme: "light",
      groupPageSize: 20,
      privacyBannerDismissed: false,
      welcomeDismissed: false,
      defaultViewId: "",
      showReminders: false,
      hideCompleted: true,
      hideCards: true,
      showUnassigned: false,
      calendarMode: "month",
      /** One-time: Member Only Cards default flipped to off. */
      memberCardsDefaultOff: true,
      agendaHorizon: "today",
      ackPanelOpen: false,
    };
  }

  function loadPrefs() {
    const stored = cookies.readJson(PREFS_COOKIE, null);
    const prefs = Object.assign(defaultPrefs(), stored || {});
    // Week view folded into Calendar (week range).
    if (prefs.view === "week") {
      prefs.view = "calendar";
      prefs.calendarMode = "week";
    }
    if (prefs.calendarMode !== "week") prefs.calendarMode = "month";
    prefs.agendaHorizon = normalizeAgendaHorizon(prefs.agendaHorizon);
    prefs.ackPanelOpen = Boolean(prefs.ackPanelOpen);
    // Apply new default once for existing cookies that still had member cards on.
    if (stored && !stored.memberCardsDefaultOff) {
      prefs.hideCards = true;
      prefs.memberCardsDefaultOff = true;
    }
    return prefs;
  }

  function savePrefs(patch) {
    const next = Object.assign(loadPrefs(), patch || {});
    // Never persist Trello payloads—only compact preference fields.
    const safe = {
      groupBy: next.groupBy,
      view: next.view,
      workType: next.workType,
      sortKey: next.sortKey,
      sortDir: next.sortDir,
      allowlist: (next.allowlist || []).slice(0, 80),
      collapsedGroups: pruneCollapsedGroups(next.collapsedGroups),
      filtersOpen: Boolean(next.filtersOpen),
      density: next.density === "compact" ? "compact" : "comfortable",
      theme: next.theme === "dark" ? "dark" : "light",
      groupPageSize: normalizeGroupPageSize(next.groupPageSize),
      privacyBannerDismissed: Boolean(next.privacyBannerDismissed),
      welcomeDismissed: Boolean(next.welcomeDismissed),
      defaultViewId: String(next.defaultViewId || "").slice(0, 40),
      showReminders: Boolean(next.showReminders),
      hideCompleted: next.hideCompleted !== false,
      hideCards: Boolean(next.hideCards),
      showUnassigned: Boolean(next.showUnassigned),
      calendarMode: next.calendarMode === "week" ? "week" : "month",
      memberCardsDefaultOff: true,
      agendaHorizon: normalizeAgendaHorizon(next.agendaHorizon),
      ackPanelOpen: Boolean(next.ackPanelOpen),
    };
    cookies.writeJson(PREFS_COOKIE, safe, 180);
    return safe;
  }

  function loadAcknowledgedIds() {
    const raw = cookies.readJson(ACK_COOKIE, null);
    const today = localDayKey();
    if (!raw || typeof raw !== "object" || raw.day !== today) {
      return [];
    }
    if (!Array.isArray(raw.ids)) return [];
    return raw.ids
      .map(function (id) {
        return String(id || "").slice(0, 48);
      })
      .filter(Boolean)
      .slice(0, ACK_MAX_IDS);
  }

  function saveAcknowledgedIds(ids) {
    const seen = {};
    const next = [];
    (ids || []).forEach(function (id) {
      const key = baseAckId(id).slice(0, 48);
      if (!key || seen[key]) return;
      seen[key] = true;
      next.push(key);
    });
    const trimmed = next.slice(0, ACK_MAX_IDS);
    if (!trimmed.length) {
      cookies.remove(ACK_COOKIE);
      return [];
    }
    const payload = { day: localDayKey(), ids: trimmed };
    const midnight = nextLocalMidnight();
    // Prefer absolute expiry; fall back to fractional-day max-age (same path as prefs).
    if (typeof cookies.writeJsonExpiresAt === "function") {
      cookies.writeJsonExpiresAt(ACK_COOKIE, payload, midnight);
    }
    var written = cookies.readJson(ACK_COOKIE, null);
    if (
      !written ||
      written.day !== payload.day ||
      !Array.isArray(written.ids) ||
      written.ids.indexOf(trimmed[0]) < 0
    ) {
      var daysLeft = Math.max(
        1 / 1440,
        (midnight.getTime() - Date.now()) / 86400000
      );
      cookies.writeJson(ACK_COOKIE, payload, daysLeft);
    }
    return trimmed;
  }

  function acknowledgeId(id) {
    const key = baseAckId(id);
    if (!key) return loadAcknowledgedIds();
    const ids = loadAcknowledgedIds();
    if (ids.indexOf(key) >= 0) return ids;
    ids.push(key);
    return saveAcknowledgedIds(ids);
  }

  function unacknowledgeId(id) {
    const key = baseAckId(id);
    return saveAcknowledgedIds(
      loadAcknowledgedIds().filter(function (entry) {
        return entry !== key;
      })
    );
  }

  function resetAcknowledged() {
    cookies.remove(ACK_COOKIE);
    return [];
  }

  function isAcknowledgedId(id) {
    const key = baseAckId(id);
    if (!key) return false;
    return loadAcknowledgedIds().indexOf(key) >= 0;
  }

  function loadViews() {
    const views = cookies.readJson(VIEWS_COOKIE, []);
    return Array.isArray(views) ? views : [];
  }

  function saveViews(views) {
    const compact = (views || []).slice(0, 12).map(function (view) {
      return {
        id: view.id,
        name: String(view.name || "View").slice(0, 40),
        workType: view.workType || "both",
        status: view.status || "incomplete",
        due: view.due || "all",
        groupBy: view.groupBy || "due",
        view: view.view || "list",
        sortKey: view.sortKey || "due",
        sortDir: view.sortDir === "desc" ? "desc" : "asc",
        collapsedGroups: pruneCollapsedGroups(view.collapsedGroups),
        assignees: (view.assignees || []).slice(0, 40),
        boards: (view.boards || []).slice(0, 40),
        labels: (view.labels || []).slice(0, 40),
        lists: (view.lists || []).slice(0, 40),
        search: String(view.search || "").slice(0, 80),
        showReminders: Boolean(view.showReminders),
        hideCards: Boolean(view.hideCards),
        showUnassigned: Boolean(view.showUnassigned),
      };
    });
    cookies.writeJson(VIEWS_COOKIE, compact, 180);
    return compact;
  }

  function upsertView(view) {
    const views = loadViews().filter(function (v) {
      return v.id !== view.id;
    });
    views.unshift(view);
    return saveViews(views);
  }

  function deleteView(id) {
    return saveViews(
      loadViews().filter(function (v) {
        return v.id !== id;
      })
    );
  }

  global.ChecklistHubPrefs = {
    loadPrefs: loadPrefs,
    savePrefs: savePrefs,
    loadViews: loadViews,
    saveViews: saveViews,
    upsertView: upsertView,
    deleteView: deleteView,
    normalizeAgendaHorizon: normalizeAgendaHorizon,
    loadAcknowledgedIds: loadAcknowledgedIds,
    saveAcknowledgedIds: saveAcknowledgedIds,
    acknowledgeId: acknowledgeId,
    unacknowledgeId: unacknowledgeId,
    resetAcknowledged: resetAcknowledged,
    isAcknowledgedId: isAcknowledgedId,
    baseAckId: baseAckId,
  };
})(window);

