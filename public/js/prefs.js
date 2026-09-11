(function (global) {
  const cookies = global.ChecklistHubCookies;
  const PREFS_COOKIE = "ch_hub_prefs";
  const VIEWS_COOKIE = "ch_hub_views";

  function normalizeGroupPageSize(value) {
    var n = Number(value);
    if (!isFinite(n) || n < 0) return 20;
    if (n === 0) return 0;
    if (n === 10 || n === 20 || n === 50 || n === 100) return n;
    return 20;
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
      groupPageSize: 20,
      privacyBannerDismissed: false,
      welcomeDismissed: false,
      defaultViewId: "",
      showReminders: false,
      hideCompleted: true,
    };
  }

  function loadPrefs() {
    const stored = cookies.readJson(PREFS_COOKIE, null);
    return Object.assign(defaultPrefs(), stored || {});
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
      collapsedGroups: next.collapsedGroups || {},
      filtersOpen: Boolean(next.filtersOpen),
      density: next.density === "compact" ? "compact" : "comfortable",
      groupPageSize: normalizeGroupPageSize(next.groupPageSize),
      privacyBannerDismissed: Boolean(next.privacyBannerDismissed),
      welcomeDismissed: Boolean(next.welcomeDismissed),
      defaultViewId: String(next.defaultViewId || "").slice(0, 40),
      showReminders: Boolean(next.showReminders),
      hideCompleted: next.hideCompleted !== false,
    };
    cookies.writeJson(PREFS_COOKIE, safe, 180);
    return safe;
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
        collapsedGroups: view.collapsedGroups || {},
        assignees: (view.assignees || []).slice(0, 40),
        boards: (view.boards || []).slice(0, 40),
        labels: (view.labels || []).slice(0, 40),
        lists: (view.lists || []).slice(0, 40),
        search: String(view.search || "").slice(0, 80),
        showReminders: Boolean(view.showReminders),
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
  };
})(window);
