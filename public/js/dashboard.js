(function () {
  var config = window.CHECKLIST_HUB_CONFIG;
  var api = window.ChecklistHubApi;
  var prefsApi = window.ChecklistHubPrefs;
  var cookies = window.ChecklistHubCookies;
  var demoMode = window.ChecklistHubDemoMode || {};
  var mdApi = window.ChecklistHubMarkdown || {};
  var params = new URLSearchParams(window.location.search);
  var powerUpMissing =
    typeof demoMode.powerUpMissingWhileEmbedded === "function"
      ? demoMode.powerUpMissingWhileEmbedded()
      : false;
  var isDemo =
    !powerUpMissing &&
    (typeof demoMode.detect === "function"
      ? demoMode.detect(params, config)
      : false);

  if (
    isDemo &&
    params.get("demo") !== "1" &&
    params.get("demo") !== "true" &&
    !(config && config.forceDemo)
  ) {
    try {
      var demoUrl = new URL(window.location.href);
      demoUrl.searchParams.set("demo", "1");
      window.history.replaceState({}, "", demoUrl.toString());
    } catch (e) {
      // ignore
    }
  }

  cookies.purgeLegacyBrowserStorage();

  var els = {
    brandMark: document.querySelector(".brand-mark"),
    subtitle: document.getElementById("subtitle"),
    refreshBtn: document.getElementById("refresh-btn"),
    authBtn: document.getElementById("auth-btn"),
    authEmptyState: document.getElementById("auth-empty-state"),
    authEmptyBtn: document.getElementById("auth-empty-btn"),
    workspace: document.getElementById("workspace"),
    configPanel: document.getElementById("config-panel"),
    configBackdrop: document.getElementById("config-backdrop"),
    configToggle: document.getElementById("config-toggle"),
    configClose: document.getElementById("config-close"),
    configDone: document.getElementById("config-done"),
    filterSummary: document.getElementById("filter-summary"),
    prefsBar: document.getElementById("config-panel"),
    filterWorkType: document.getElementById("filter-work-type"),
    allowlistBoards: document.getElementById("filter-board"),
    savedViews: document.getElementById("saved-views"),
    saveViewBtn: document.getElementById("save-view-btn"),
    renameViewBtn: document.getElementById("rename-view-btn"),
    deleteViewBtn: document.getElementById("delete-view-btn"),
    savedViewName: document.getElementById("saved-view-name"),
    filters: document.getElementById("config-panel"),
    metaRow: document.getElementById("meta-row"),
    resultCount: document.getElementById("result-count"),
    cacheNote: document.getElementById("cache-note"),
    banner: document.getElementById("banner"),
    bannerText: document.getElementById("banner-text"),
    bannerDismiss: document.getElementById("banner-dismiss"),
    bannerDetails: document.getElementById("banner-details"),
    bannerTechnical: document.getElementById("banner-technical"),
    bannerCopy: document.getElementById("banner-copy"),
    bannerActions: document.getElementById("banner-actions"),
    bannerActionBtn: document.getElementById("banner-action-btn"),
    bannerActionLabel: document.getElementById("banner-action-label"),
    stageBar: document.getElementById("stage-bar"),
    emptyState: document.getElementById("empty-state"),
    tableWrap: document.getElementById("table-wrap"),
    itemsBody: document.getElementById("items-body"),
    filterAssignee: document.getElementById("filter-assignee"),
    filterHideCompleted: document.getElementById("filter-show-completed"),
    filterHideCards: document.getElementById("filter-show-member-cards"),
    filterShowUnassigned: document.getElementById("filter-show-unassigned"),
    stageHideCompleted: document.getElementById("stage-hide-completed"),
    stageHideCards: document.getElementById("stage-hide-cards"),
    stageReminders: document.getElementById("stage-reminders"),
    filterDue: document.getElementById("filter-due"),
    filterReminders: document.getElementById("filter-reminders"),
    filterBoard: document.getElementById("filter-board"),
    filterLabel: document.getElementById("filter-label"),
    filterList: document.getElementById("filter-list"),
    filterSearch: document.getElementById("filter-search"),
    filterGroup: document.getElementById("filter-group"),
    filterGroupPageSize: document.getElementById("filter-group-page-size"),
    groupPageSizeField: document.getElementById("group-page-size-field"),
    focusChips: document.getElementById("focus-chips"),
    exportBtn: document.getElementById("export-btn"),
    viewToggle: document.getElementById("view-toggle"),
    viewSelect: document.getElementById("view-select"),
    viewMenuBtn: document.getElementById("view-menu-btn"),
    viewMenu: document.getElementById("view-menu"),
    viewMenuIcon: document.getElementById("view-menu-icon"),
    viewMenuLabel: document.getElementById("view-menu-label"),
    themeToggle: document.getElementById("theme-toggle"),
    themeToggleIcon: document.getElementById("theme-toggle-icon"),
    themeToggleLabel: document.getElementById("theme-toggle-label"),
    themeToggleGroup: document.getElementById("theme-toggle-group"),
    densityToggle: document.getElementById("density-toggle"),
    welcomeModal: document.getElementById("welcome-modal"),
    welcomeDismiss: document.getElementById("welcome-dismiss"),
    welcomeScan: document.getElementById("welcome-scan"),
    welcomeStarterBlock: document.getElementById("welcome-starter-block"),
    welcomeStarter: document.getElementById("welcome-starter"),
    welcomeStarterLoad: document.getElementById("welcome-starter-load"),
    welcomeQuickStart: document.getElementById("welcome-quick-start"),
    welcomeBoardsBlock: document.getElementById("welcome-boards-block"),
    welcomeBoardOptions: document.getElementById("welcome-board-options"),
    welcomeBoardsEmpty: document.getElementById("welcome-boards-empty"),
    welcomeBoardsAll: document.getElementById("welcome-boards-all"),
    welcomeBoardsClear: document.getElementById("welcome-boards-clear"),
    welcomeLead: document.getElementById("welcome-lead"),
    welcomeHelpBtn: document.getElementById("welcome-help-btn"),
    scanNudge: document.getElementById("scan-nudge"),
    statusRefreshBanner: document.getElementById("status-refresh-banner"),
    statusRefreshBtn: document.getElementById("status-refresh-btn"),
    statusRefreshDismiss: document.getElementById("status-refresh-dismiss"),
    scanProgress: document.getElementById("scan-progress"),
    scanProgressFill: document.getElementById("scan-progress-fill"),
    scanProgressText: document.getElementById("scan-progress-text"),
    scanCancelBtn: document.getElementById("scan-cancel-btn"),
    scanConfirmModal: document.getElementById("scan-confirm-modal"),
    scanConfirmOk: document.getElementById("scan-confirm-ok"),
    scanConfirmCancel: document.getElementById("scan-confirm-cancel"),
    loadBlockedModal: document.getElementById("load-blocked-modal"),
    loadBlockedTitle: document.getElementById("load-blocked-title"),
    loadBlockedLead: document.getElementById("load-blocked-lead"),
    loadBlockedDismiss: document.getElementById("load-blocked-dismiss"),
    loadBlockedFilters: document.getElementById("load-blocked-filters"),
    defaultViewBtn: document.getElementById("default-view-btn"),
    privacyModal: document.getElementById("privacy-modal"),
    privacyOpenBtn: document.getElementById("privacy-open-btn"),
    privacyModalClose: document.getElementById("privacy-modal-close"),
    filterTeam: document.getElementById("filter-team"),
    apiUsageLog: document.getElementById("api-usage-log"),
    apiUsageOpenBtn: document.getElementById("api-usage-open-btn"),
    apiUsageModal: document.getElementById("api-usage-modal"),
    apiUsageModalClose: document.getElementById("api-usage-modal-close"),
    apiUsageSummary: document.getElementById("api-usage-summary"),
    apiUsageBuckets: document.getElementById("api-usage-buckets"),
    disconnectBtn: document.getElementById("disconnect-btn"),
    disconnectSep: document.getElementById("disconnect-sep"),
    footerSupport: document.getElementById("footer-support"),
    footerSupportSep: document.getElementById("footer-support-sep"),
    footerVersion: document.getElementById("footer-version"),
    footerNote: document.getElementById("footer-note"),
    ganttChecklistModal: document.getElementById("gantt-checklist-modal"),
    ganttChecklistModalTitle: document.getElementById(
      "gantt-checklist-modal-title"
    ),
    ganttChecklistModalMeta: document.getElementById(
      "gantt-checklist-modal-meta"
    ),
    ganttChecklistModalNote: document.getElementById(
      "gantt-checklist-modal-note"
    ),
    ganttChecklistModalList: document.getElementById(
      "gantt-checklist-modal-list"
    ),
    ganttChecklistOpenCard: document.getElementById(
      "gantt-checklist-open-card"
    ),
    ganttChecklistModalClose: document.getElementById(
      "gantt-checklist-modal-close"
    ),
    groupField: document.getElementById("group-field"),
    calendarWrap: document.getElementById("calendar-wrap"),
    insightWrap: document.getElementById("insight-wrap"),
    calendarGrid: document.getElementById("calendar-grid"),
    calendarTitle: document.getElementById("cal-title"),
    calendarUndated: document.getElementById("calendar-undated"),
    calendarUndatedText: document.getElementById("calendar-undated-text"),
    calendarUndatedBtn: document.getElementById("calendar-undated-btn"),
    calPrev: document.getElementById("cal-prev"),
    calNext: document.getElementById("cal-next"),
    calToday: document.getElementById("cal-today"),
    calModeMonth: document.getElementById("cal-mode-month"),
    calModeWeek: document.getElementById("cal-mode-week"),
    assigneeSearch: document.getElementById("assignee-search"),
    boardSearch: document.getElementById("board-search"),
    copyListBtn: document.getElementById("copy-list-btn"),
    shortcutsOpenBtn: document.getElementById("shortcuts-open-btn"),
    shortcutsModal: document.getElementById("shortcuts-modal"),
    shortcutsModalClose: document.getElementById("shortcuts-modal-close"),
  };

  var prefs = prefsApi.loadPrefs();

  var state = {
    token: null,
    data: null,
    sortKey: prefs.sortKey || "due",
    sortDir: prefs.sortDir || "asc",
    groupBy: prefs.groupBy || "due",
    view: prefs.view === "week" ? "calendar" : prefs.view || "list",
    // workType kept for saved views; stage Hide cards is the live control.
    workType: prefs.workType === "card" ? "card" : "both",
    showReminders: Boolean(prefs.showReminders),
    hideCompleted: prefs.hideCompleted !== false,
    showUnassigned: Boolean(prefs.showUnassigned),
    hideCards:
      Boolean(prefs.hideCards) || prefs.workType === "checkitem",
    density: prefs.density === "compact" ? "compact" : "comfortable",
    theme: prefs.theme === "dark" ? "dark" : "light",
    groupPageSize:
      prefs.groupPageSize === 0
        ? 0
        : prefs.groupPageSize === 10 ||
            prefs.groupPageSize === 50 ||
            prefs.groupPageSize === 100
          ? prefs.groupPageSize
          : 20,
    groupVisibleCounts: {},
    calendarMonth: startOfMonth(new Date()),
    calendarWeekStart: null,
    calendarMode:
      prefs.view === "week" || prefs.calendarMode === "week" ? "week" : "month",
    expandedCalDay: null,
    focusCalDayAfterRender: null,
    collapsedGroups: prefs.collapsedGroups || {},
    /** After first list render for a grouping, stop re-defaulting missing ids. */
    groupCollapseSeeded: false,
    loading: false,
    statusTimer: null,
    statusNudgeDismissedUntil: 0,
    filtersOpen: false,
    searchTimer: null,
    scanAbort: null,
    demoTimer: null,
    applyDefaultViewPending: false,
    modalFocusBefore: null,
    demo: isDemo,
    welcomeSkippedThisSession: false,
    boardsReady: false,
    boardCatalog: null,
    allowlistRescanNeeded: false,
    bannerAction: null,
    /** Board id currently being refreshed from a row action (null when idle). */
    refreshingBoardId: null,
    /**
     * Debounced Open→board refresh: boardId →
     * { timerId, boardName, followUp, dueAt }.
     */
    pendingBoardRefreshes: {},
    pendingRefreshTicker: null,
    pendingViewId: "",
    teams: [],
    selectedTeamId: "",
    preferredAssignees: null,
    assigneeDirectory: {},
    teamsContextNote: "",
    selectedRowId: "",
    visibleItems: [],
    /** Last list order (item id → index) for stable refresh reordering. */
    listOrderIndex: {},
  };

  if (els.filterGroup) {
    els.filterGroup.value = state.groupBy;
  }
  if (els.filterGroupPageSize) {
    els.filterGroupPageSize.value = String(state.groupPageSize);
  }
  if (els.filterWorkType) {
    els.filterWorkType.value = state.workType;
  }
  if (els.filterReminders) {
    els.filterReminders.checked = state.showReminders;
  }
  if (els.filterHideCompleted) {
    // Checkbox means "show"; prefs still store hideCompleted.
    els.filterHideCompleted.checked = !state.hideCompleted;
  }
  if (els.filterHideCards) {
    els.filterHideCards.checked = !state.hideCards;
  }
  if (els.filterShowUnassigned) {
    els.filterShowUnassigned.checked = state.showUnassigned;
  }
  if (els.filterDue) {
    els.filterDue.value = "all";
  }
  if (els.viewSelect) {
    els.viewSelect.value = state.view;
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function addCalendarDays(date, days) {
    var next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    next.setDate(next.getDate() + days);
    return next;
  }

  function startOfWeek(date) {
    var day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var offset = (day.getDay() + 6) % 7;
    day.setDate(day.getDate() - offset);
    day.setHours(0, 0, 0, 0);
    return day;
  }

  if (!state.calendarWeekStart) {
    state.calendarWeekStart = startOfWeek(new Date());
  }

  function dateKey(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1);
    if (m.length < 2) m = "0" + m;
    var d = String(date.getDate());
    if (d.length < 2) d = "0" + d;
    return y + "-" + m + "-" + d;
  }

  function savePrefs(patch) {
    var next = prefsApi.savePrefs(patch);
    if (patch.sortKey != null) state.sortKey = next.sortKey;
    if (patch.sortDir != null) state.sortDir = next.sortDir;
    if (patch.groupBy != null) state.groupBy = next.groupBy;
    if (patch.view != null) state.view = next.view;
    if (patch.workType != null) state.workType = next.workType;
    if (patch.showReminders != null) state.showReminders = next.showReminders;
    if (patch.hideCompleted != null) state.hideCompleted = next.hideCompleted;
    if (patch.hideCards != null) state.hideCards = next.hideCards;
    if (patch.showUnassigned != null) state.showUnassigned = next.showUnassigned;
    if (patch.density != null) state.density = next.density;
    if (patch.theme != null) state.theme = next.theme;
    if (patch.groupPageSize != null) state.groupPageSize = next.groupPageSize;
    if (patch.calendarMode != null) {
      state.calendarMode = next.calendarMode === "week" ? "week" : "month";
    }
    if (patch.collapsedGroups != null) {
      state.collapsedGroups = next.collapsedGroups;
    }
    return next;
  }

  function resetGroupVisibleCounts() {
    state.groupVisibleCounts = {};
  }

  function visibleCountForGroup(groupId, total) {
    var pageSize = state.groupPageSize;
    if (!pageSize) return total;
    var shown = state.groupVisibleCounts[groupId];
    if (shown == null || shown < pageSize) shown = pageSize;
    return Math.min(total, shown);
  }

  function applyDensity(density) {
    state.density = density === "compact" ? "compact" : "comfortable";
    document.body.classList.toggle("density-compact", state.density === "compact");
    if (els.densityToggle) {
      els.densityToggle.querySelectorAll("[data-density]").forEach(function (btn) {
        var active = btn.getAttribute("data-density") === state.density;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }
  }

  applyDensity(state.density);

  var VIEW_OPTIONS = {
    list: { label: "List", icon: "view_list" },
    agenda: { label: "Agenda", icon: "view_agenda" },
    horizon: { label: "Upcoming by board", icon: "stacked_bar_chart" },
    workload: { label: "Workload", icon: "group" },
    progress: { label: "Checklist progress", icon: "donut_large" },
    gantt: { label: "Timeline", icon: "view_timeline" },
    calendar: { label: "Calendar", icon: "calendar_month" },
  };

  function closeViewMenu() {
    if (!els.viewMenu || !els.viewMenuBtn) return;
    els.viewMenu.hidden = true;
    els.viewMenuBtn.setAttribute("aria-expanded", "false");
    if (els.viewToggle) els.viewToggle.classList.remove("is-open");
  }

  function syncViewMenu() {
    var key = state.view || "list";
    var opt = VIEW_OPTIONS[key] || VIEW_OPTIONS.list;
    if (els.viewSelect) els.viewSelect.value = key;
    if (els.viewMenuIcon) els.viewMenuIcon.textContent = opt.icon;
    if (els.viewMenuLabel) els.viewMenuLabel.textContent = opt.label;
    if (els.viewMenuBtn) {
      els.viewMenuBtn.title = "View: " + opt.label;
      els.viewMenuBtn.setAttribute("aria-label", "View: " + opt.label);
    }
    if (els.viewMenu) {
      els.viewMenu.querySelectorAll("[data-view]").forEach(function (btn) {
        var selected = btn.getAttribute("data-view") === key;
        btn.classList.toggle("is-active", selected);
        btn.setAttribute("aria-selected", selected ? "true" : "false");
      });
    }
  }

  function setView(view) {
    var next = view === "week" ? "calendar" : VIEW_OPTIONS[view] ? view : "list";
    state.view = next;
    if (view === "week") {
      state.calendarMode = "week";
      savePrefs({ view: state.view, calendarMode: "week" });
    } else {
      savePrefs({ view: state.view });
    }
    if (els.viewSelect) els.viewSelect.value = next;
    syncViewMenu();
    closeViewMenu();
    renderTable();
  }

  function applyTheme(theme) {
    state.theme = theme === "dark" ? "dark" : "light";
    var dark = state.theme === "dark";
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light"
    );
    document.body.classList.toggle("theme-dark", dark);
    if (els.themeToggle) {
      els.themeToggle.setAttribute("aria-pressed", dark ? "true" : "false");
      els.themeToggle.title = dark
        ? "Switch to light mode"
        : "Switch to dark mode";
    }
    if (els.themeToggleIcon) {
      els.themeToggleIcon.textContent = dark ? "light_mode" : "dark_mode";
    }
    if (els.themeToggleLabel) {
      els.themeToggleLabel.textContent = dark ? "Light mode" : "Dark mode";
    }
    if (els.brandMark) {
      els.brandMark.src = dark ? "./icons/hub-light.svg" : "./icons/hub-dark.svg";
    }
    if (els.themeToggleGroup) {
      els.themeToggleGroup
        .querySelectorAll("[data-theme]")
        .forEach(function (btn) {
          var active = btn.getAttribute("data-theme") === state.theme;
          btn.classList.toggle("is-active", active);
          btn.setAttribute("aria-pressed", active ? "true" : "false");
        });
    }
  }

  applyTheme(state.theme);
  syncViewMenu();
  updateViewChrome();

  function createDemoTrelloClient() {
    return {
      render: function (cb) {
        if (typeof cb === "function") cb();
      },
      sizeTo: function () {},
      getRestApi: function () {
        return Promise.resolve({
          isAuthorized: function () {
            return Promise.resolve(true);
          },
          getToken: function () {
            return Promise.resolve("demo-token");
          },
          authorize: function () {
            return Promise.resolve("demo-token");
          },
        });
      },
    };
  }

  var t =
    powerUpMissing
      ? null
      : isDemo || !window.TrelloPowerUp
        ? createDemoTrelloClient()
        : window.TrelloPowerUp.iframe({
            appKey: (window.CHECKLIST_HUB_CONFIG &&
              window.CHECKLIST_HUB_CONFIG.appKey) ||
              config.appKey,
            appName: (window.CHECKLIST_HUB_CONFIG &&
              window.CHECKLIST_HUB_CONFIG.appName) ||
              config.appName,
            appAuthor: (window.CHECKLIST_HUB_CONFIG &&
              window.CHECKLIST_HUB_CONFIG.appAuthor) ||
              config.appAuthor,
          });

  if (isDemo) {
    document.body.classList.add("is-demo");
  }

  function oauthExpiration() {
    var allowed = { "1hour": 1, "1day": 1, "30days": 1, never: 1 };
    var value = (config && config.oauthExpiration) || "30days";
    return allowed[value] ? value : "30days";
  }

  /**
   * OAuth return must NOT be dashboard.html: the consent popup loads return_url
   * as a top-level window, and dashboard treats top-level as demo — which
   * replaces the Power-Up client and breaks re-authorization.
   */
  function oauthAuthReturnUrl() {
    try {
      var url = new URL("./authorize.html", window.location.href);
      url.hash = "";
      url.search = "";
      return url.href;
    } catch (e) {
      return String(window.location.href || "").replace(/[^/]*$/, "authorize.html");
    }
  }

  function safeCardUrl(url) {
    if (demoMode && typeof demoMode.safeTrelloUrl === "function") {
      return demoMode.safeTrelloUrl(url);
    }
    return null;
  }

  function openSafeCardUrl(url, item) {
    var safe = safeCardUrl(url);
    if (!safe) return;
    window.open(safe, "_blank", "noopener,noreferrer");
    if (item && item.boardId) {
      scheduleBoardRefreshAfterOpen(item.boardId, item.boardName);
    }
  }

  function applySafeHref(anchor, url) {
    if (demoMode && typeof demoMode.setSafeHref === "function") {
      return demoMode.setSafeHref(anchor, url);
    }
    var safe = safeCardUrl(url);
    if (!safe || !anchor) return false;
    anchor.href = safe;
    return true;
  }

  function initFooterMeta() {
    if (els.footerVersion) {
      els.footerVersion.textContent =
        "v" + ((config && config.appVersion) || "1.1.0");
    }
    var email = (config && config.supportEmail) || "";
    var url = (config && config.supportUrl) || "";
    if (els.footerSupport) {
      if (email) {
        els.footerSupport.hidden = false;
        if (els.footerSupportSep) els.footerSupportSep.hidden = false;
        els.footerSupport.href = "mailto:" + email;
        els.footerSupport.textContent = "Support";
      } else if (url) {
        els.footerSupport.hidden = false;
        if (els.footerSupportSep) els.footerSupportSep.hidden = false;
        els.footerSupport.href = url;
        els.footerSupport.target = "_blank";
        els.footerSupport.textContent = "Support";
      }
    }
  }

  initFooterMeta();

  if (powerUpMissing) {
    document.body.classList.add("is-powerup-missing");
  }

  function showBanner(message, kind, options) {
    var opts = options || {};
    if (!message) {
      els.banner.hidden = true;
      if (els.bannerText) els.bannerText.textContent = "";
      else els.banner.textContent = "";
      if (els.bannerDismiss) els.bannerDismiss.hidden = true;
      if (els.bannerActions) els.bannerActions.hidden = true;
      state.bannerAction = null;
      if (els.bannerDetails) {
        els.bannerDetails.hidden = true;
        els.bannerDetails.open = false;
      }
      if (els.bannerTechnical) els.bannerTechnical.textContent = "";
      if (els.banner) els.banner.removeAttribute("data-banner-kind");
      return;
    }
    els.banner.hidden = false;
    els.banner.className = "banner" + (kind ? " banner-" + kind : "");
    els.banner.setAttribute("data-banner-kind", opts.bannerKind || kind || "info");
    if (kind === "error" || kind === "warn") {
      els.banner.setAttribute("role", "alert");
      els.banner.setAttribute("aria-live", "assertive");
    } else {
      els.banner.setAttribute("role", "status");
      els.banner.setAttribute("aria-live", "polite");
    }
    if (els.bannerText) {
      els.bannerText.textContent = message;
    } else {
      els.banner.textContent = message;
    }
    if (els.bannerDismiss) {
      els.bannerDismiss.hidden = !opts.dismissible;
    }
    if (els.bannerActions && els.bannerActionBtn) {
      if (opts.actionLabel && opts.action) {
        els.bannerActions.hidden = false;
        if (els.bannerActionLabel) {
          els.bannerActionLabel.textContent = opts.actionLabel;
        } else {
          els.bannerActionBtn.textContent = opts.actionLabel;
        }
        state.bannerAction = opts.action;
      } else {
        els.bannerActions.hidden = true;
        state.bannerAction = null;
      }
    }
    if (els.bannerDetails && els.bannerTechnical) {
      if (opts.technical) {
        els.bannerDetails.hidden = false;
        els.bannerTechnical.textContent = opts.technical;
      } else {
        els.bannerDetails.hidden = true;
        els.bannerDetails.open = false;
        els.bannerTechnical.textContent = "";
      }
    }
  }

  function describeError(err, context) {
    var raw = (err && err.message) || String(err || "Unknown error");
    var technical =
      (err && err.technical) ||
      raw +
        (err && err.stack ? "\n\n" + String(err.stack).split("\n").slice(0, 6).join("\n") : "");
    var friendly = raw;
    var status = err && err.status;

    if (err && err.name === "TrelloApiError" && err.message) {
      friendly = err.message;
    } else if (err && err.name === "TrelloRateLimitError") {
      friendly = err.message;
    } else if (err && err.name === "TrelloNetworkError") {
      friendly = err.message;
    } else if (/YOUR_TRELLO_API_KEY/.test(raw) || /config\.js/.test(raw)) {
      friendly =
        "Checklist Hub is not configured yet. An admin needs to set the Power-Up API key.";
      technical = raw;
    } else if (/Trello API (\d+)/.test(raw)) {
      var statusMatch = raw.match(/Trello API (\d+)/);
      status = statusMatch ? Number(statusMatch[1]) : status;
      friendly =
        status === 401 || status === 403
          ? "Trello refused access. Try authorizing again."
          : status === 429
            ? "Trello is busy right now. Wait a minute and try again."
            : "Something went wrong talking to Trello. Try again, or share the technical details with an admin.";
      technical = raw;
    } else if (/Failed to fetch|NetworkError|Load failed/i.test(raw)) {
      friendly =
        "Could not reach Trello. Check your network connection and try again.";
      technical = raw;
    }

    var stamp = new Date().toISOString();
    var report =
      "Checklist Hub error report\n" +
      "When: " +
      stamp +
      "\n" +
      "Context: " +
      (context || "general") +
      "\n" +
      "User message: " +
      friendly +
      "\n" +
      (status ? "HTTP status: " + status + "\n" : "") +
      "Details:\n" +
      technical;

    return {
      friendly: friendly,
      technical: report,
    };
  }

  function showErrorBanner(err, context) {
    var info = describeError(err, context);
    showBanner(info.friendly, "error", {
      technical: info.technical,
      dismissible: true,
    });
  }

  function handleAuthorizationError(err) {
    if (!err || (err.status !== 401 && err.status !== 403)) return false;
    state.token = null;
    state.data = null;
    state.boardsReady = false;
    state.boardCatalog = null;
    if (api && api.clearCache) api.clearCache();
    setUiAuthorized(false);
    els.subtitle.textContent = "Trello access expired · authorize again";
    // Drop the stale plugin token so the board button opens authorize.html next time.
    getRestApiClient()
      .then(function (rest) {
        if (rest && typeof rest.clearToken === "function") {
          return rest.clearToken();
        }
        return null;
      })
      .catch(function () {
        // Ignore — UI already shows Authorize.
      });
    showBanner(
      "Your Trello access has expired or was revoked. Authorize again to continue.",
      "warn",
      {
        dismissible: false,
        actionLabel: "Authorize",
        action: function () {
          authorizeHub();
        },
      }
    );
    return true;
  }

  /**
   * Why the initial board scan cannot start right now (or null if it can).
   * Covers boards, auth, in-flight work, and config — not post-load filters.
   */
  function getLoadChecklistsBlocker() {
    if (state.loading) {
      return {
        message:
          "Already working — wait for the current load to finish, or press Cancel.",
        openFilters: false,
      };
    }
    if (!state.demo && !state.token) {
      return {
        message: "Authorize with Trello before you view checklists.",
        openFilters: false,
      };
    }
    if (!state.demo && !isApiKeyConfigured()) {
      return {
        message:
          "API key is not set in config.js, so Checklist Hub cannot talk to Trello.",
        openFilters: false,
      };
    }
    if (!state.boardsReady) {
      return {
        message:
          "Board names are still loading. Wait a moment, then select boards under Filters and view checklists.",
        openFilters: true,
      };
    }
    var boardOptionCount = els.filterBoard
      ? els.filterBoard.querySelectorAll('input[type="checkbox"]').length
      : 0;
    if (!boardOptionCount) {
      return {
        title: "No boards available",
        message:
          "No boards are available to load. Refresh the board list under Filters → Boards, then try again.",
        openFilters: true,
        modal: true,
      };
    }
    if (!getAllowlistBoardIds().length) {
      return {
        title: "No boards selected",
        message:
          "Select at least one board under Filters, then try again.",
        openFilters: true,
        modal: true,
      };
    }
    return null;
  }

  function warnLoadBlocked(blocker) {
    if (!blocker) return;
    if (blocker.modal) {
      openLoadBlockedModal(blocker);
      return;
    }
    showBanner(blocker.message, "warn", {
      dismissible: true,
      bannerKind: "load-blocked",
    });
    if (blocker.openFilters) setConfigOpen(true);
  }

  function clearNonPrivacyBanner() {
    if (
      els.bannerDismiss &&
      !els.bannerDismiss.hidden &&
      !els.banner.hidden &&
      els.banner.className.indexOf("banner-error") === -1
    ) {
      return;
    }
    showBanner(null);
  }

  function showPrivacyBannerIfNeeded() {
    var current = prefsApi.loadPrefs();
    if (current.privacyBannerDismissed) return;
    if (!els.banner.hidden && els.bannerDismiss && !els.bannerDismiss.hidden) {
      return;
    }
    if (!els.banner.hidden && els.banner.className.indexOf("banner-error") >= 0) {
      return;
    }
    showBanner(
      "Preferences are saved in cookies only. Trello data stays in memory while this tab is open.",
      "info",
      { dismissible: true, bannerKind: "privacy" }
    );
  }

  showPrivacyBannerIfNeeded();

  function startOfDay(date) {
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function endOfDay(date) {
    var d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  /** The next calendar day. "Tomorrow" must never silently skip weekends. */
  function nextCalendarDay(from) {
    if (
      window.ChecklistHubDates &&
      typeof window.ChecklistHubDates.nextCalendarDay === "function"
    ) {
      return window.ChecklistHubDates.nextCalendarDay(from);
    }
    var d = startOfDay(from || new Date());
    d.setDate(d.getDate() + 1);
    return d;
  }

  function formatDue(due) {
    if (!due) return "—";
    var date = new Date(due);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  /** Compact relative span: 45m / 3h / 2d (absolute magnitude). */
  function formatDueSpan(msAbs) {
    var minutes = Math.max(1, Math.round(Math.abs(msAbs) / 60000));
    if (minutes < 60) return minutes + "m";
    var hours = Math.round(Math.abs(msAbs) / 3600000);
    if (hours < 48) return hours + "h";
    var days = Math.max(1, Math.round(Math.abs(msAbs) / 86400000));
    return days + "d";
  }

  function itemActualDue(item) {
    if (!item) return null;
    if (isReminderRow(item)) return item.sourceDue || item.due || null;
    return item.due || null;
  }

  function formatDueRelative(due, stateValue, item) {
    if (!due) return "No date";
    var date = new Date(due);
    if (isNaN(date.getTime())) return "—";
    var now = new Date();
    var ts = date.getTime();
    var delta = ts - now.getTime();
    var startToday = startOfDay(now).getTime();
    var endToday = endOfDay(now).getTime();
    var reminder = isReminderRow(item);

    if (reminder) {
      var actual = itemActualDue(item);
      var actualLabel = actual
        ? formatDueRelative(actual, stateValue, null)
        : formatDueSpan(delta);
      var leadBit;
      if (ts <= endToday && ts >= startToday) leadBit = "Reminded today";
      else if (ts < startToday) {
        leadBit = "Reminded " + formatDueSpan(now.getTime() - ts) + " ago";
      } else {
        leadBit = "Reminded in " + formatDueSpan(delta);
      }
      return leadBit + " · item " + actualLabel;
    }

    if (stateValue === "complete") {
      if (delta < 0) return formatDueSpan(-delta) + " ago";
      if (delta === 0) return "Now";
      return "in " + formatDueSpan(delta);
    }

    if (delta < 0) {
      return "Overdue " + formatDueSpan(-delta) + " ago";
    }
    if (ts <= endToday) {
      return delta < 60 * 60 * 1000
        ? "Due in " + formatDueSpan(delta)
        : "Today · in " + formatDueSpan(delta);
    }
    var nextWorkday = nextCalendarDay(now);
    var nextStartTs = startOfDay(nextWorkday).getTime();
    var nextEndTs = endOfDay(nextWorkday).getTime();
    if (ts >= nextStartTs && ts <= nextEndTs) {
      return "Tomorrow · in " + formatDueSpan(delta);
    }
    var daysAhead = Math.round(
      (startOfDay(date).getTime() - startToday) / 86400000
    );
    if (daysAhead > 0 && daysAhead < 7) {
      return "In " + formatDueSpan(delta);
    }
    return "In " + formatDueSpan(delta);
  }

  function viewOwnsTime(view) {
    // Views with their own time axis hide the due chips.
    return (
      view === "calendar" ||
      view === "agenda" ||
      view === "horizon" ||
      view === "gantt"
    );
  }

  function viewUsesHideCompleted(view) {
    // These views either filter completes themselves or need them for meters.
    return view === "list" || view === "agenda" || view === "calendar";
  }

  function viewUsesReminders(view) {
    return view === "list" || view === "agenda" || view === "calendar";
  }

  function viewDropsCompleted(view) {
    return view === "horizon" || view === "workload";
  }

  function isInsightView(view) {
    return (
      view === "agenda" ||
      view === "horizon" ||
      view === "workload" ||
      view === "progress" ||
      view === "gantt"
    );
  }

  function dueClass(due, stateValue, item) {
    if (!due || stateValue === "complete") return "";
    if (isReminderRow(item)) {
      var reminderTs = new Date(due).getTime();
      if (reminderTs <= endOfDay(new Date()).getTime()) return "due-today";
      return "";
    }
    var now = Date.now();
    var ts = new Date(due).getTime();
    if (ts < now) return "due-overdue";
    if (ts <= endOfDay(new Date()).getTime()) return "due-today";
    return "";
  }

  function itemState(item) {
    if (item.kind === "reminder") {
      return item.state || "incomplete";
    }
    if (item.kind === "card") {
      if (item.dueComplete) return "complete";
      return item.state || "incomplete";
    }
    if (item.cardClosed || item.cardDueComplete) return "complete";
    return item.state || "incomplete";
  }

  /** Master Reminders toggle is on. */
  function remindersEnabled() {
    return Boolean(state.showReminders);
  }

  /**
   * Whether reminder rows should appear in the current view.
   * Calendar: anytime Show is on. List: only when time-framed;
   * individual rows are further limited to today/tomorrow lead days.
   */
  function remindersVisibleFor(filters) {
    if (!remindersEnabled()) return false;
    if (filters.view === "calendar" || filters.view === "agenda") return true;
    if (state.groupBy === "due") return true;
    if (state.groupBy === "none" && state.sortKey === "due") return true;
    return (
      filters.due === "myday" ||
      filters.due === "today" ||
      filters.due === "tomorrow"
    );
  }

  /** List reminders only land in Due today / Due tomorrow (not week/later). */
  function reminderAllowedInList(item) {
    if (!isReminderRow(item)) return true;
    if (state.view === "calendar" || state.view === "agenda") {
      return true;
    }
    var bucket = dueBucket(item).id;
    return bucket === "today" || bucket === "tomorrow";
  }

  function isReminderRow(item) {
    return Boolean(item && (item.kind === "reminder" || item.isReminder));
  }

  /** Underlying work type — reminders are lead rows for a card or a task. */
  function workKind(item) {
    if (!item) return "checkitem";
    if (isReminderRow(item)) {
      return item.sourceKind === "card" ? "card" : "checkitem";
    }
    return item.kind === "card" ? "card" : "checkitem";
  }

  function isCardWork(item) {
    return workKind(item) === "card";
  }

  function countReminderSplit(items) {
    var reminderCount = 0;
    (items || []).forEach(function (item) {
      if (isReminderRow(item)) reminderCount += 1;
    });
    return {
      real: (items || []).length - reminderCount,
      reminders: reminderCount,
    };
  }

  function registerAssigneeMember(member) {
    if (!member || !member.id) return;
    state.assigneeDirectory[member.id] = {
      id: member.id,
      fullName: member.fullName || member.username || "Member",
      username: member.username || "",
    };
  }

  function viewerMemberId() {
    return (
      (state.data && state.data.me && state.data.me.id) ||
      (state.demo && "member-me") ||
      null
    );
  }

  function selectedPeopleIds() {
    var meId = viewerMemberId();
    var assignees = els.filterAssignee
      ? getCheckedValues(els.filterAssignee)
      : [];
    var ids = [];
    var seen = {};
    assignees.forEach(function (value) {
      var id = null;
      if (value === "me") id = meId;
      else if (value && value !== "unassigned") id = value;
      if (!id || seen[id]) return;
      seen[id] = true;
      ids.push(id);
    });
    return ids;
  }

  function captureFilterState(overrides) {
    var helper = window.ChecklistHubFilterState;
    var snapshot = helper.capture({
      people: selectedPeopleIds(),
      boardRoot: els.filterBoard,
      labelRoot: els.filterLabel,
      listRoot: els.filterList,
      dueInput: els.filterDue,
      searchInput: els.filterSearch,
      hideCompleted: state.hideCompleted,
      hideCards: state.hideCards,
      showUnassigned: state.showUnassigned,
      view: state.view,
      bypassDue: state.bypassDue,
    });
    return Object.assign(snapshot, overrides || {});
  }

  function isViewerOnlyAssignees() {
    var people = selectedPeopleIds();
    var meId = viewerMemberId();
    return people.length === 1 && meId && people[0] === meId;
  }

  function updateAssigneeVisibilityBanner() {
    if (
      els.banner &&
      !els.banner.hidden &&
      els.banner.getAttribute("data-banner-kind") === "shared-boards"
    ) {
      showBanner(null);
    }
  }

  function getCheckedValues(root) {
    return Array.prototype.slice
      .call(root.querySelectorAll('input[type="checkbox"]:checked'))
      .map(function (input) {
        return input.value;
      });
  }

  function setCheckedValues(root, values) {
    var set = {};
    (values || []).forEach(function (v) {
      set[v] = true;
    });
    root.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
      input.checked = Boolean(set[input.value]);
    });
  }

  function updateMultiSummary(root, emptyLabel, allLabel) {
    var summary = root.querySelector(".multi-select-summary");
    var checked = getCheckedValues(root);
    var total = root.querySelectorAll('input[type="checkbox"]').length;
    if (!checked.length) {
      summary.textContent = emptyLabel;
      return;
    }
    if (allLabel && checked.length === total) {
      summary.textContent = allLabel;
      return;
    }
    if (checked.length === 1) {
      var only = null;
      var boxes = root.querySelectorAll('input[type="checkbox"]');
      for (var i = 0; i < boxes.length; i += 1) {
        if (boxes[i].value === checked[0]) {
          only = boxes[i];
          break;
        }
      }
      summary.textContent =
        (only && only.getAttribute("data-label")) || checked[0];
      return;
    }
    summary.textContent = checked.length + " selected";
  }

  function updateAssigneeSummary() {
    updateMultiSummary(
      els.filterAssignee,
      "All assigned people",
      "All assigned people"
    );
  }

  function filterMultiOptions(root, query) {
    if (!root) return;
    var q = String(query || "").trim().toLowerCase();
    root.querySelectorAll(".multi-option").forEach(function (row) {
      var label = (
        (row.querySelector("input") &&
          row.querySelector("input").getAttribute("data-label")) ||
        row.textContent ||
        ""
      ).toLowerCase();
      row.hidden = Boolean(q) && label.indexOf(q) === -1;
    });
  }

  function filterAssigneeOptions(query) {
    filterMultiOptions(els.filterAssignee, query);
  }

  function addOption(container, value, label, checked) {
    var row = document.createElement("label");
    row.className = "multi-option";
    var input = document.createElement("input");
    input.type = "checkbox";
    input.value = value;
    input.checked = Boolean(checked);
    input.setAttribute("data-label", label);
    var text = document.createElement("span");
    text.textContent = label;
    row.appendChild(input);
    row.appendChild(text);
    container.appendChild(row);
  }

  function updateAllowlistSummary() {
    if (!els.filterBoard) return;
    var summary = els.filterBoard.querySelector(".multi-select-summary");
    if (!summary) return;
    var optionCount = els.filterBoard.querySelectorAll(
      'input[type="checkbox"]'
    ).length;
    if (!optionCount) {
      var saved = prefsApi.loadPrefs().allowlist || [];
      if (saved.length) {
        summary.textContent =
          saved.length +
          " saved board" +
          (saved.length === 1 ? "" : "s") +
          " (list names to show them)";
        return;
      }
      summary.textContent = state.boardsReady
        ? "No boards selected"
        : "Listing boards…";
      return;
    }
    var checked = getCheckedValues(els.filterBoard);
    if (!checked.length) {
      summary.textContent = "No boards selected";
      return;
    }
    if (checked.length === optionCount) {
      summary.textContent = "All " + optionCount + " boards";
      return;
    }
    summary.textContent =
      checked.length + " board" + (checked.length === 1 ? "" : "s");
  }

  function getSelectedBoardIds() {
    // Live checkbox state always wins once the board list exists —
    // including an empty selection (never fall back to “all” / saved picks).
    if (els.filterBoard) {
      var optionCount = els.filterBoard.querySelectorAll(
        'input[type="checkbox"]'
      ).length;
      if (optionCount) {
        return getCheckedValues(els.filterBoard);
      }
    }
    // Before names are listed: fall back to team defaults, then saved picks.
    if (state.selectedTeamId) {
      var team = findTeamById(state.selectedTeamId);
      if (team && team.boardIds && team.boardIds.length) {
        return team.boardIds.slice();
      }
    }
    var saved = prefsApi.loadPrefs().allowlist || [];
    return saved.slice();
  }

  function getAllowlistBoardIds() {
    // Load scope = currently selected boards (never "all if empty").
    var ids = getSelectedBoardIds();
    return ids;
  }

  function persistAllowlist() {
    var ids = getCheckedValues(els.filterBoard);
    savePrefs({ allowlist: ids });
    updateAllowlistSummary();
    updateAllowlistRescanNudge();
  }

  function populateBoardOptions(boards) {
    if (!els.filterBoard) return;
    var container = document.getElementById("filter-board-options");
    if (!container) return;
    var previous = getCheckedValues(els.filterBoard);
    var hadOptions =
      els.filterBoard.querySelectorAll('input[type="checkbox"]').length > 0;
    var allowlist = prefsApi.loadPrefs().allowlist || [];
    var team = state.selectedTeamId ? findTeamById(state.selectedTeamId) : null;
    var teamBoards =
      team && team.boardIds && team.boardIds.length ? team.boardIds : null;
    // If the board list was already shown, keep the current ticks — including none.
    // Only seed from team/saved prefs on the first populate.
    var prefer = hadOptions
      ? previous
      : teamBoards
        ? teamBoards
        : allowlist;
    container.innerHTML = "";
    boards
      .slice()
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      })
      .forEach(function (board) {
        var checked = prefer.indexOf(board.id) >= 0;
        addOption(container, board.id, board.name, checked);
      });
    updateAllowlistSummary();
    updateAllowlistRescanNudge();
    syncWelcomeBoardsFromFilters();
  }

  function populateAllowlistBoards(boards) {
    populateBoardOptions(boards);
  }

  function populateBoards(boards) {
    // Single Boards control — keep in sync after checklist load.
    populateBoardOptions(
      (state.boardCatalog && state.boardCatalog.boards) || boards || []
    );
  }

  function applyAllowlistBoardIds(boardIds) {
    if (!els.filterBoard) return;
    var container = document.getElementById("filter-board-options");
    var ids = boardIds || [];
    if (container) {
      var existing = {};
      container.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
        existing[input.value] = true;
        input.checked = ids.indexOf(input.value) >= 0;
      });
      ids.forEach(function (id) {
        if (existing[id]) return;
        var name = id;
        var team = findTeamById(state.selectedTeamId);
        if (team && team.resolvedBoards) {
          team.resolvedBoards.forEach(function (b) {
            if (b.id === id) name = b.name || id;
          });
        }
        addOption(container, id, name, true);
      });
    }
    persistAllowlist();
    syncWelcomeBoardsFromFilters();
    if (state.data) renderTable();
  }

  function syncWelcomeBoardsFromFilters() {
    if (!els.welcomeBoardOptions) return;
    var source = document.getElementById("filter-board-options");
    var boards =
      (state.boardCatalog && state.boardCatalog.boards) || [];
    var checked = els.filterBoard ? getCheckedValues(els.filterBoard) : [];
    els.welcomeBoardOptions.innerHTML = "";

    var list = [];
    if (source && source.querySelectorAll('input[type="checkbox"]').length) {
      source.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
        list.push({
          id: input.value,
          name: input.getAttribute("data-label") || input.value,
          checked: input.checked,
        });
      });
    } else {
      list = boards
        .slice()
        .sort(function (a, b) {
          return String(a.name || "").localeCompare(String(b.name || ""));
        })
        .map(function (board) {
          return {
            id: board.id,
            name: board.name,
            checked: checked.indexOf(board.id) >= 0,
          };
        });
    }

    list.forEach(function (board) {
      addOption(
        els.welcomeBoardOptions,
        board.id,
        board.name,
        Boolean(board.checked)
      );
    });

    if (els.welcomeBoardsBlock) {
      els.welcomeBoardsBlock.hidden = false;
    }
    if (els.welcomeBoardsEmpty) {
      els.welcomeBoardsEmpty.hidden = list.length > 0;
      els.welcomeBoardsEmpty.textContent = state.boardsReady
        ? "No boards available."
        : "Board names are still loading…";
    }
    updateWelcomeStarterLoadButton();
  }

  function applyWelcomeBoardSelection() {
    if (!els.welcomeBoardOptions || !els.filterBoard) return;
    var ids = getCheckedValues(els.welcomeBoardOptions);
    setCheckedValues(els.filterBoard, ids);
    persistAllowlist();
    updateWelcomeStarterLoadButton();
  }

  function populateLabels(labels) {
    if (!els.filterLabel) return;
    var container = document.getElementById("filter-label-options");
    if (!container) return;
    var previous = getCheckedValues(els.filterLabel);
    var hadOptions = container.querySelectorAll('input[type="checkbox"]').length > 0;
    container.innerHTML = "";
    (labels || []).forEach(function (label) {
      var checked = hadOptions && previous.indexOf(label.id) >= 0;
      addOption(container, label.id, label.name || "Label", checked);
    });
    updateMultiSummary(els.filterLabel, "All labels", "All labels");
  }

  function populateLists(lists) {
    if (!els.filterList) return;
    var container = document.getElementById("filter-list-options");
    if (!container) return;
    var previous = getCheckedValues(els.filterList);
    var hadOptions = container.querySelectorAll('input[type="checkbox"]').length > 0;
    container.innerHTML = "";
    (lists || []).forEach(function (list) {
      var label =
        (list.boardName ? list.boardName + " · " : "") + (list.name || "List");
      var checked = hadOptions && previous.indexOf(list.id) >= 0;
      addOption(container, list.id, label, checked);
    });
    updateMultiSummary(els.filterList, "All lists", "All lists");
  }

  function populateAssignees(members, me) {
    var container = document.getElementById("filter-assignee-options");
    if (!container || !els.filterAssignee) return;
    var previous = getCheckedValues(els.filterAssignee);
    var hadOptions =
      els.filterAssignee.querySelectorAll('input[type="checkbox"]').length > 0;
    if (
      !hadOptions &&
      state.preferredAssignees &&
      state.preferredAssignees.length
    ) {
      previous = state.preferredAssignees.slice();
      hadOptions = true;
    }
    container.innerHTML = "";

    var meId = me && me.id;
    var meLabel = "Me (" + ((me && me.fullName) || "you") + ")";
    addOption(
      container,
      "me",
      meLabel,
      !hadOptions ? true : previous.indexOf("me") >= 0
    );

    (members || []).forEach(registerAssigneeMember);
    Object.keys(state.assigneeDirectory).forEach(function (id) {
      registerAssigneeMember(state.assigneeDirectory[id]);
    });

    var listed = {};
    if (meId) listed[meId] = true;

    Object.keys(state.assigneeDirectory)
      .map(function (id) {
        return state.assigneeDirectory[id];
      })
      .sort(function (a, b) {
        return (a.fullName || "").localeCompare(b.fullName || "");
      })
      .forEach(function (member) {
        if (!member || !member.id || listed[member.id]) return;
        listed[member.id] = true;
        var label = member.fullName || member.username || member.id;
        addOption(
          container,
          member.id,
          label,
          hadOptions && previous.indexOf(member.id) >= 0
        );
      });

    if (hadOptions) {
      previous.forEach(function (value) {
        if (value === "me" || value === "unassigned") return;
        if (listed[value]) return;
        var member = state.assigneeDirectory[value] || {
          id: value,
          fullName: value,
        };
        addOption(container, value, member.fullName || value, true);
        listed[value] = true;
      });
    }

    state.preferredAssignees = getCheckedValues(els.filterAssignee);
    updateAssigneeSummary();
  }

  function collectRows() {
    if (!state.data) return [];
    var items = state.data.items || [];
    var memberCards = state.data.memberCards || [];
    // Cards are toggled with Hide cards; always collect both row kinds here.
    return items.concat(memberCards);
  }

  function matchesFilters(item, filterState) {
    var filters = filterState || captureFilterState();
    if (isReminderRow(item)) {
      if (!remindersVisibleFor(filters)) return false;
      if (!reminderAllowedInList(item)) return false;
    }

    var people = filters.people;
    var boards = filters.boards;
    var due = filters.due;
    var q = filters.search;
    var rowState = itemState(item);
    var boardOptionCount = filters.boardOptionCount;

    if (!item.idMember) {
      // Unassigned checklist items stay hidden unless explicitly opted in.
      if (!filters.showUnassigned) return false;
    } else if (people.length && people.indexOf(item.idMember) === -1) {
      return false;
    }

    // Ticked boards = visible. Empty selection = show nothing.
    if (boardOptionCount) {
      if (!boards.length) return false;
      if (boards.indexOf(item.boardId) === -1) return false;
    }

    if (
      filters.hideCompleted &&
      viewUsesHideCompleted(filters.view) &&
      rowState !== "incomplete"
    ) {
      return false;
    }
    if (filters.hideCards && isCardWork(item)) return false;

    var labels = filters.labels;
    if (labels.length) {
      var itemLabelIds = (item.labels || []).map(function (l) {
        return l.id;
      });
      var labelHit = labels.some(function (id) {
        return itemLabelIds.indexOf(id) >= 0;
      });
      if (!labelHit) return false;
    }

    var lists = filters.lists;
    if (lists.length && lists.indexOf(item.listId) === -1) return false;

    // Views that own their time axis ignore due chips so they are not hollowed out.
    if (!filters.bypassDue && due !== "all" && !viewOwnsTime(filters.view)) {
      var dueTs = item.due ? new Date(item.due).getTime() : null;
      var now = new Date();
      if (due === "none" && dueTs) return false;
      if (due === "myday") {
        if (!dueTs || rowState === "complete") return false;
        var dayStart = startOfDay(now).getTime();
        var dayEnd = endOfDay(now).getTime();
        var isOverdue = dueTs < now.getTime();
        var isToday = dueTs >= dayStart && dueTs <= dayEnd;
        if (!isOverdue && !isToday) return false;
      }
      if (due === "upcoming") {
        if (
          !dueTs ||
          rowState === "complete" ||
          dueTs <= endOfDay(now).getTime()
        ) {
          return false;
        }
      }
      if (due === "overdue") {
        if (
          isReminderRow(item) ||
          !dueTs ||
          rowState === "complete" ||
          dueTs >= now.getTime()
        ) {
          return false;
        }
      }
      if (due === "today") {
        if (
          !dueTs ||
          dueTs < startOfDay(now).getTime() ||
          dueTs > endOfDay(now).getTime()
        ) {
          return false;
        }
      }
      if (due === "tomorrow") {
        var nextDay = nextCalendarDay(now);
        var tomorrowStart = startOfDay(nextDay).getTime();
        var tomorrowEndDue = endOfDay(nextDay).getTime();
        if (!dueTs || dueTs < tomorrowStart || dueTs > tomorrowEndDue) {
          return false;
        }
      }
      if (due === "week") {
        // After today, within 7 days, excluding tomorrow.
        var nextDay = nextCalendarDay(now);
        var nextStart = startOfDay(nextDay).getTime();
        var nextEnd = endOfDay(nextDay).getTime();
        var todayEnd = endOfDay(now).getTime();
        var weekEnd = endOfDay(
          new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        ).getTime();
        if (
          !dueTs ||
          rowState === "complete" ||
          dueTs <= todayEnd ||
          (dueTs >= nextStart && dueTs <= nextEnd) ||
          dueTs > weekEnd
        ) {
          return false;
        }
      }
    }

    if (q) {
      var labelNames = (item.labels || [])
        .map(function (l) {
          return l.name;
        })
        .join(" ");
      var hay = [
        item.name,
        plainItemTitle(item.name),
        item.cardName,
        item.boardName,
        item.checklistName,
        item.assigneeName,
        item.listName,
        labelNames,
        item.kind === "card" ||
        (isReminderRow(item) && item.sourceKind === "card")
          ? "card member"
          : isReminderRow(item)
            ? "reminder checklist task"
            : "checklist task",
        isReminderRow(item) ? "reminder" : "",
      ]
        .join(" ")
        .toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }

    return true;
  }

  function closeAllMultiSelects(except) {
    document.querySelectorAll(".multi-select.is-open").forEach(function (root) {
      if (except && root === except) return;
      root.classList.remove("is-open");
      var panel = root.querySelector(".multi-select-panel");
      var toggle = root.querySelector(".multi-select-toggle");
      if (panel) panel.hidden = true;
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  }

  function wireMultiSelect(root, options) {
    if (!root) return;
    var opts = options || {};
    var toggle = root.querySelector(".multi-select-toggle");
    var panel = root.querySelector(".multi-select-panel");

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      var willOpen = panel.hidden;
      closeAllMultiSelects();
      if (willOpen) {
        panel.hidden = false;
        root.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        var search = panel.querySelector(".multi-select-search");
        if (search) {
          search.value = "";
          filterMultiOptions(root, "");
          setTimeout(function () {
            search.focus();
          }, 0);
        }
      }
    });

    panel.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    panel.addEventListener("change", function (event) {
      if (event.target && event.target.matches('input[type="checkbox"]')) {
        if (opts.onChange) opts.onChange();
        if (opts.onChangeSummary) opts.onChangeSummary();
        if (!opts.skipRender) renderTable();
      }
    });

    panel.querySelectorAll("[data-action]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var action = btn.getAttribute("data-action");
        var boxes = root.querySelectorAll('input[type="checkbox"]');
        if (action === "all") {
          boxes.forEach(function (box) {
            box.checked = true;
          });
        } else if (action === "clear") {
          boxes.forEach(function (box) {
            box.checked = false;
          });
        } else if (action === "me") {
          boxes.forEach(function (box) {
            box.checked = box.value === "me";
          });
        } else if (action === "visible") {
          boxes.forEach(function (box) {
            var row = box.closest(".multi-option");
            if (row && !row.hidden) box.checked = true;
          });
        } else if (action === "refresh-list") {
          return;
        }
        if (opts.onChange) opts.onChange();
        if (opts.onChangeSummary) opts.onChangeSummary();
        if (!opts.skipRender) renderTable();
      });
    });
  }

  function clearListOrderMemory() {
    state.listOrderIndex = {};
  }

  function rememberListOrder(items) {
    var index = {};
    (items || []).forEach(function (item, i) {
      if (item && item.id != null) index[String(item.id)] = i;
    });
    state.listOrderIndex = index;
  }

  function compareItems(a, b) {
    var key = state.sortKey;
    var av = a[key];
    var bv = b[key];

    if (key === "due") {
      av = av ? new Date(av).getTime() : Number.POSITIVE_INFINITY;
      bv = bv ? new Date(bv).getTime() : Number.POSITIVE_INFINITY;
    } else if (key === "kind") {
      av = isCardWork(a) ? 1 : 0;
      bv = isCardWork(b) ? 1 : 0;
    } else {
      av = (av || "").toString().toLowerCase();
      bv = (bv || "").toString().toLowerCase();
    }

    if (av < bv) return state.sortDir === "asc" ? -1 : 1;
    if (av > bv) return state.sortDir === "asc" ? 1 : -1;
    // Same due/sort key: real work before reminder clones.
    var aRem = isReminderRow(a);
    var bRem = isReminderRow(b);
    if (aRem !== bRem) return aRem ? 1 : -1;
    // Keep prior on-screen order across refreshes unless the sort key moved them.
    var order = state.listOrderIndex || {};
    var ai = order[String(a.id)];
    var bi = order[String(b.id)];
    if (ai != null && bi != null && ai !== bi) return ai - bi;
    if (ai != null && bi == null) return -1;
    if (ai == null && bi != null) return 1;
    return (a.name || "").localeCompare(b.name || "");
  }

  function dueBucket(item) {
    var rowState = itemState(item);
    if (!item.due) {
      return { id: "none", label: "No due date", order: 5 };
    }
    if (rowState === "complete") {
      return { id: "done", label: "Completed", order: 6 };
    }
    var ts = new Date(item.due).getTime();
    var now = new Date();
    if (ts < now.getTime()) {
      if (isReminderRow(item)) {
        // Lead-up notices are never overdue; keep them in Today.
        return { id: "today", label: "Due today", order: 1 };
      }
      return { id: "overdue", label: "Overdue", order: 0 };
    }
    if (ts <= endOfDay(now).getTime()) {
      return { id: "today", label: "Due today", order: 1 };
    }
    var nextWorkday = nextCalendarDay(now);
    var nextStart = startOfDay(nextWorkday).getTime();
    var nextEnd = endOfDay(nextWorkday).getTime();
    if (ts >= nextStart && ts <= nextEnd) {
      return { id: "tomorrow", label: "Due tomorrow", order: 2 };
    }
    if (
      ts <=
      endOfDay(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)).getTime()
    ) {
      return { id: "week", label: "Next 7 days", order: 3 };
    }
    return { id: "later", label: "Later", order: 4 };
  }

  function groupInfo(item) {
    var mode = state.groupBy;
    if (mode === "none") {
      return { id: "all", label: "All items", order: 0 };
    }
    if (mode === "due") return dueBucket(item);
    if (mode === "board") {
      return {
        id: item.boardId || "unknown-board",
        label: item.boardName || "Unknown board",
        order: (item.boardName || "").toLowerCase(),
      };
    }
    if (mode === "assignee") {
      var isUnassigned = !item.idMember;
      return {
        id: item.idMember || "unassigned",
        label: item.assigneeName || "Unassigned",
        order: isUnassigned ? "\uffff" : (item.assigneeName || "").toLowerCase(),
      };
    }
    if (mode === "card") {
      return {
        id: item.cardId || "unknown-card",
        label: (item.cardName || "Unknown card") + " · " + (item.boardName || ""),
        order: (item.cardName || "").toLowerCase(),
      };
    }
    if (mode === "checklist") {
      return {
        id:
          (item.checklistId || item.checklistName || "checklist") +
          ":" +
          item.cardId,
        label:
          (item.checklistName || "Checklist") +
          " · " +
          (item.cardName || ""),
        order: (item.checklistName || "").toLowerCase(),
      };
    }
    if (mode === "kind") {
      var isCard = isCardWork(item);
      return {
        id: isCard ? "card" : "checkitem",
        label: isCard ? "Member card" : "Checklist task",
        order: isCard ? 1 : 0,
      };
    }
    return { id: "all", label: "All items", order: 0 };
  }

  function buildGroups(items) {
    var map = {};
    items.forEach(function (item) {
      var info = groupInfo(item);
      if (!map[info.id]) {
        map[info.id] = {
          id: info.id,
          label: info.label,
          order: info.order,
          items: [],
        };
      }
      map[info.id].items.push(item);
    });
    return Object.keys(map)
      .map(function (id) {
        return map[id];
      })
      .sort(function (a, b) {
        if (typeof a.order === "number" && typeof b.order === "number") {
          return a.order - b.order;
        }
        return String(a.order).localeCompare(String(b.order));
      });
  }

  function typeLabel(item) {
    return isCardWork(item) ? "Card" : "Task";
  }

  function appendTypePills(host, item) {
    var typePill = document.createElement("span");
    typePill.className =
      "type-pill " + (isCardWork(item) ? "is-card" : "is-task");
    typePill.textContent = typeLabel(item);
    host.appendChild(typePill);
    if (isReminderRow(item)) {
      var reminderPill = document.createElement("span");
      reminderPill.className = "type-pill is-reminder";
      reminderPill.textContent = "Reminder";
      host.appendChild(reminderPill);
    }
  }

  function boardHue(name) {
    if (
      window.ChecklistHubViews &&
      typeof window.ChecklistHubViews.boardHue === "function"
    ) {
      return window.ChecklistHubViews.boardHue(name);
    }
    var str = String(name || "board");
    var hash = 0;
    for (var i = 0; i < str.length; i += 1) {
      hash = (hash * 31 + str.charCodeAt(i)) % 360;
    }
    return hash;
  }

  function materialIcon(name) {
    var span = document.createElement("span");
    span.className = "material-symbols-outlined";
    span.setAttribute("aria-hidden", "true");
    span.textContent = name;
    return span;
  }

  function membershipCaptionFor(item) {
    if (item.checklistItemCount != null && item.checklistName && item.checklistName.indexOf("You're on this card") === 0) {
      return item.checklistName;
    }
    var stats = state.cardStatsAll && state.cardStatsAll[item.cardId];
    if (!stats || !stats.total) return "You're on this card · no checklist items";
    var lists = stats.lists || 0;
    return (
      "You're on this card · " +
      (lists ? lists + " checklist" + (lists === 1 ? "" : "s") + " · " : "") +
      stats.total +
      " item" +
      (stats.total === 1 ? "" : "s") +
      " · none assigned to you"
    );
  }

  function setTableVisible(show) {
    if (!els.tableWrap) return;
    els.tableWrap.hidden = !show;
    els.tableWrap.classList.toggle("is-shown", Boolean(show));
  }

  function createFallbackRow(item) {
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.colSpan = 6;
    td.textContent =
      (item && item.name) || "Untitled item";
    tr.appendChild(td);
    return tr;
  }

  function appendItemTitle(parent, text, options) {
    var title = text == null ? "" : String(text);
    if (mdApi && typeof mdApi.appendInline === "function") {
      mdApi.appendInline(parent, title, options || {});
      return;
    }
    parent.appendChild(document.createTextNode(title));
  }

  function plainItemTitle(text) {
    if (mdApi && typeof mdApi.strip === "function") {
      return mdApi.strip(text);
    }
    return String(text == null ? "" : text);
  }

  function titleHasMarkdownLink(text) {
    return /\[[^\]]+\]\(https?:[^)\s]+\)/.test(String(text || ""));
  }

  /** Render a checklist/card title with inline markdown; card link when safe. */
  function appendLinkedItemTitle(parent, item, linkClassName) {
    var title = item && item.name != null ? String(item.name) : "";
    var className = linkClassName || "item-name-link";
    var cardUrl = item && item.cardUrl;
    var useCardLink = Boolean(cardUrl) && !titleHasMarkdownLink(title);

    if (useCardLink) {
      var nameLink = document.createElement("a");
      nameLink.className = className;
      nameLink.target = "_blank";
      nameLink.rel = "noopener noreferrer";
      appendItemTitle(nameLink, title, { allowLinks: false });
      if (applySafeHref(nameLink, cardUrl)) {
        nameLink.addEventListener("click", function () {
          scheduleBoardRefreshAfterOpen(item.boardId, item.boardName);
        });
        parent.appendChild(nameLink);
      } else {
        var fallback = document.createElement("span");
        fallback.className = className;
        appendItemTitle(fallback, title, { allowLinks: true });
        parent.appendChild(fallback);
      }
      return;
    }

    var nameSpan = document.createElement("span");
    nameSpan.className = className;
    appendItemTitle(nameSpan, title, { allowLinks: true });
    parent.appendChild(nameSpan);
  }

  function assigneeInitials(name) {
    var parts = String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) return "?";
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function appendAssigneeChip(parent, item) {
    var name = (item && item.assigneeName) || "";
    if (!item || (!item.idMember && !name)) {
      parent.textContent = "—";
      return;
    }
    var chip = document.createElement("span");
    chip.className = "assignee-chip";
    var meId = viewerMemberId();
    if (item.idMember && meId && item.idMember === meId) {
      chip.classList.add("is-me");
    } else {
      chip.classList.add("is-other");
    }
    var label = name || "Assignee";
    chip.textContent = assigneeInitials(label);
    chip.title = label;
    chip.setAttribute("aria-label", label);
    parent.appendChild(chip);
  }

  function createItemRow(item) {
    var tr = document.createElement("tr");
    var rowState = itemState(item);
    tr.classList.add("hub-row");
    tr.setAttribute("data-row-id", item.id);
    if (state.selectedRowId === item.id) tr.classList.add("is-selected");
    if (rowState === "complete") tr.classList.add("is-complete");
    if (isReminderRow(item)) tr.classList.add("is-reminder");
    if (isCardWork(item)) tr.classList.add("is-card");

    var nameTd = document.createElement("td");
    nameTd.className = "col-item";
    var nameWrap = document.createElement("div");
    nameWrap.className = "item-name";
    appendTypePills(nameWrap, item);
    appendLinkedItemTitle(nameWrap, item, "item-name-link");
    nameTd.appendChild(nameWrap);
    var metaBits = [];
    if (isReminderRow(item)) {
      metaBits.push(
        "Item due " +
          formatDue(itemActualDue(item) || item.due)
      );
    } else if (isCardWork(item) && !isReminderRow(item)) {
      metaBits.push(membershipCaptionFor(item));
    }
    if (metaBits.length) {
      var meta = document.createElement("div");
      meta.className = "item-meta";
      meta.textContent = metaBits.join(" · ");
      nameTd.appendChild(meta);
    }
    var mobileBits = [];
    if (item.cardName) mobileBits.push(item.cardName);
    if (
      !isReminderRow(item) &&
      !isCardWork(item) &&
      item.checklistName
    ) {
      mobileBits.push(item.checklistName);
    }
    if (item.assigneeName) mobileBits.push(item.assigneeName);
    if (mobileBits.length) {
      var mobileMeta = document.createElement("div");
      mobileMeta.className = "item-mobile-meta";
      mobileMeta.textContent = mobileBits.join(" · ");
      nameTd.appendChild(mobileMeta);
    }
    if (item.labels && item.labels.length) {
      var labelRow = document.createElement("div");
      labelRow.className = "item-labels";
      item.labels.forEach(function (label) {
        var chip = document.createElement("span");
        chip.className = "label-chip";
        chip.setAttribute("data-color", label.color || "null");
        chip.textContent = label.name || "Label";
        chip.title = label.name || "Label";
        labelRow.appendChild(chip);
      });
      nameTd.appendChild(labelRow);
    }

    var boardTd = document.createElement("td");
    boardTd.className = "col-board";
    var boardCell = document.createElement("div");
    boardCell.className = "board-cell";
    var boardDot = document.createElement("span");
    boardDot.className = "board-color-dot";
    boardDot.style.background =
      "hsl(" + boardHue(item.boardName) + " 48% 46%)";
    boardDot.setAttribute("aria-hidden", "true");
    var boardText = document.createElement("div");
    boardText.textContent = item.boardName || "—";
    if (item.listName) {
      var listLine = document.createElement("div");
      listLine.className = "item-list-name";
      listLine.textContent = item.listName;
      boardText.appendChild(listLine);
    }
    boardCell.appendChild(boardDot);
    boardCell.appendChild(boardText);
    boardTd.appendChild(boardCell);

    var cardTd = document.createElement("td");
    cardTd.className = "col-card";
    var cardCell = document.createElement("div");
    cardCell.className = "card-cell";
    var cardNameEl = document.createElement("div");
    cardNameEl.className = "card-cell-name";
    cardNameEl.textContent = item.cardName || "—";
    cardCell.appendChild(cardNameEl);
    if (
      !isReminderRow(item) &&
      !isCardWork(item) &&
      item.checklistName
    ) {
      var checklistLine = document.createElement("div");
      checklistLine.className = "card-checklist-name";
      checklistLine.textContent = item.checklistName;
      cardCell.appendChild(checklistLine);
    }
    cardTd.appendChild(cardCell);

    var assigneeTd = document.createElement("td");
    assigneeTd.className = "col-assignee";
    appendAssigneeChip(assigneeTd, item);

    var dueTd = document.createElement("td");
    dueTd.className = "col-due " + dueClass(item.due, rowState, item);
    var dueText = document.createElement("span");
    dueText.textContent = formatDueRelative(item.due, rowState, item);
    if (isReminderRow(item)) {
      var actualDue = itemActualDue(item);
      dueText.title = actualDue
        ? "Item due " +
          formatDue(actualDue) +
          " · reminder lead " +
          formatDue(item.due)
        : formatDue(item.due);
    } else {
      dueText.title = item.due ? formatDue(item.due) : "No due date";
    }
    dueTd.appendChild(dueText);

    var linkTd = document.createElement("td");
    linkTd.className = "col-link";
    var linkActions = document.createElement("div");
    linkActions.className = "link-actions";

    if (item.boardId) {
      var pending = getPendingBoardRefresh(item.boardId);
      var boardRefreshing =
        state.refreshingBoardId &&
        state.refreshingBoardId === item.boardId;
      if (pending && pending.timerId && pending.dueAt && !boardRefreshing) {
        var queued = document.createElement("span");
        queued.className = "link-refresh-queued";
        queued.setAttribute("data-queued-board", String(item.boardId));
        queued.setAttribute(
          "aria-label",
          "Board refresh queued for " + (item.boardName || "board")
        );
        queued.title =
          "Refresh queued for " +
          (item.boardName || "this board") +
          " — opens reset the timer";
        queued.textContent = formatQueueCountdown(pending.dueAt);
        linkActions.appendChild(queued);
        tr.classList.add("is-refresh-queued");
      } else if (pending && pending.followUp && !boardRefreshing) {
        var soon = document.createElement("span");
        soon.className = "link-refresh-queued is-soon";
        soon.setAttribute("data-queued-board", String(item.boardId));
        soon.title = "Board refresh waiting to start…";
        soon.setAttribute("aria-label", "Board refresh waiting to start");
        soon.appendChild(materialIcon("sync"));
        linkActions.appendChild(soon);
        tr.classList.add("is-refresh-queued");
      } else {
        var refreshBtn = document.createElement("button");
        refreshBtn.type = "button";
        refreshBtn.className = "link-refresh";
        refreshBtn.title =
          "Refresh this board (" + (item.boardName || "board") + ")";
        refreshBtn.setAttribute(
          "aria-label",
          "Refresh board " + (item.boardName || "")
        );
        refreshBtn.appendChild(materialIcon("sync"));
        var boardBusy = state.loading || boardRefreshing;
        refreshBtn.disabled = Boolean(boardBusy);
        if (boardBusy && boardRefreshing) {
          refreshBtn.classList.add("is-busy");
        }
        refreshBtn.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          refreshOneBoard(item.boardId, item.boardName);
        });
        linkActions.appendChild(refreshBtn);
      }
    }

    if (item.cardUrl) {
      var a = document.createElement("a");
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "link-open";
      a.appendChild(materialIcon("open_in_new"));
      var openLabel = document.createElement("span");
      openLabel.textContent = "Open";
      a.appendChild(openLabel);
      a.setAttribute(
        "aria-label",
        "Open card " + (item.cardName || item.name || "") + " in Trello"
      );
      if (applySafeHref(a, item.cardUrl)) {
        a.addEventListener("click", function () {
          scheduleBoardRefreshAfterOpen(item.boardId, item.boardName);
        });
        linkActions.appendChild(a);
      }
    }

    if (linkActions.childNodes.length) {
      linkTd.appendChild(linkActions);
    } else {
      linkTd.textContent = "—";
    }

    tr.appendChild(nameTd);
    tr.appendChild(boardTd);
    tr.appendChild(cardTd);
    tr.appendChild(assigneeTd);
    tr.appendChild(dueTd);
    tr.appendChild(linkTd);
    return tr;
  }

  function updateFocusChips(filterState) {
    if (!els.focusChips) return;
    var current = filterState || captureFilterState();
    var dueValue = current.due;
    var allDates = Object.assign({}, current, { due: "all" });
    var pool = collectRows()
      .filter(function (item) {
        return matchesFilters(item, allDates);
      })
      .filter(function (item) {
        return !isReminderRow(item);
      });

    var counts = {
      overdue: 0,
      today: 0,
      tomorrow: 0,
      week: 0,
      myday: 0,
      upcoming: 0,
    };
    var now = new Date();
    var dayStart = startOfDay(now).getTime();
    var dayEnd = endOfDay(now).getTime();
    pool.forEach(function (item) {
      if (itemState(item) === "complete") return;
      var bucket = dueBucket(item).id;
      if (counts[bucket] != null) counts[bucket] += 1;
      var dueTs = item.due ? new Date(item.due).getTime() : null;
      if (!dueTs) return;
      var isOverdue = dueTs < now.getTime();
      var isToday = dueTs >= dayStart && dueTs <= dayEnd;
      if (isOverdue || isToday) counts.myday += 1;
      if (dueTs > dayEnd) counts.upcoming += 1;
    });

    els.focusChips.querySelectorAll("[data-due-chip]").forEach(function (chip) {
      var key = chip.getAttribute("data-due-chip");
      var active = els.filterDue.value === key;
      chip.classList.toggle("is-active", active);
      chip.classList.toggle("chip-emphasis", active);
      chip.setAttribute("aria-pressed", active ? "true" : "false");
      if (key === "all") {
        chip.textContent = "All work";
      } else if (key === "none") {
        chip.textContent = "Undated";
      } else if (key === "myday") {
        chip.textContent = "My day (" + counts.myday + ")";
      } else if (key === "upcoming") {
        chip.textContent = "Upcoming (" + counts.upcoming + ")";
      } else if (key === "overdue") {
        chip.textContent = "Overdue (" + counts.overdue + ")";
      } else if (key === "today") {
        chip.textContent = "Today (" + counts.today + ")";
      } else if (key === "tomorrow") {
        chip.textContent = "Tomorrow (" + counts.tomorrow + ")";
      } else if (key === "week") {
        chip.textContent = "Next 7 days (" + counts.week + ")";
      }
    });
  }

  function renderCalendarDayDetail(dayItems, dayLabel) {
    var wrap = document.createElement("div");
    wrap.className = "cal-expand-panel";

    var head = document.createElement("div");
    head.className = "cal-expand-head";
    var title = document.createElement("h3");
    title.textContent =
      dayLabel +
      " · " +
      dayItems.length +
      " item" +
      (dayItems.length === 1 ? "" : "s");
    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "btn btn-ghost cal-expand-close";
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      state.focusCalDayAfterRender = state.expandedCalDay;
      state.expandedCalDay = null;
      renderTable();
    });
    head.appendChild(title);
    head.appendChild(closeBtn);
    wrap.appendChild(head);

    if (!dayItems.length) {
      var empty = document.createElement("p");
      empty.className = "cal-expand-empty";
      empty.textContent = "No matching tasks on this day.";
      wrap.appendChild(empty);
      return wrap;
    }

    var scroll = document.createElement("div");
    scroll.className = "cal-expand-scroll";
    var table = document.createElement("table");
    table.className = "items-table cal-expand-table";
    var caption = document.createElement("caption");
    caption.className = "sr-only";
    caption.textContent = "Tasks due " + String(dayLabel || "");
    table.appendChild(caption);
    var thead = document.createElement("thead");
    var headRow = document.createElement("tr");
    [
      ["col-item", "Title"],
      ["col-board", "Board"],
      ["col-card", "Card"],
      ["col-assignee", "Assignee"],
      ["col-due", "Due"],
      ["col-link", "Open"],
    ].forEach(function (pair) {
      var th = document.createElement("th");
      th.className = pair[0];
      th.scope = "col";
      th.textContent = pair[1];
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);
    var tbody = document.createElement("tbody");
    dayItems.sort(compareItems).forEach(function (item) {
      tbody.appendChild(createItemRow(item));
    });
    table.appendChild(tbody);
    scroll.appendChild(table);
    wrap.appendChild(scroll);
    return wrap;
  }

  function syncCalendarModeControls() {
    var mode = state.calendarMode === "week" ? "week" : "month";
    state.calendarMode = mode;
    if (els.calModeMonth) {
      els.calModeMonth.classList.toggle("is-active", mode === "month");
      els.calModeMonth.setAttribute(
        "aria-pressed",
        mode === "month" ? "true" : "false"
      );
    }
    if (els.calModeWeek) {
      els.calModeWeek.classList.toggle("is-active", mode === "week");
      els.calModeWeek.setAttribute(
        "aria-pressed",
        mode === "week" ? "true" : "false"
      );
    }
    if (els.calPrev) {
      els.calPrev.setAttribute(
        "aria-label",
        mode === "week" ? "Previous week" : "Previous month"
      );
    }
    if (els.calNext) {
      els.calNext.setAttribute(
        "aria-label",
        mode === "week" ? "Next week" : "Next month"
      );
    }
    if (els.calendarWrap) {
      els.calendarWrap.setAttribute("data-cal-mode", mode);
    }
  }

  function setCalendarMode(mode) {
    var next = mode === "week" ? "week" : "month";
    if (next === "week") {
      var anchor = state.expandedCalDay
        ? new Date(state.expandedCalDay + "T12:00:00")
        : state.calendarMonth || new Date();
      state.calendarWeekStart = startOfWeek(anchor);
    } else {
      var weekAnchor = state.calendarWeekStart || new Date();
      state.calendarMonth = startOfMonth(weekAnchor);
    }
    state.calendarMode = next;
    savePrefs({ calendarMode: next });
    syncCalendarModeControls();
    if (state.view === "calendar") renderTable();
  }

  function renderCalendar(filtered) {
    syncCalendarModeControls();
    var isWeek = state.calendarMode === "week";
    var todayKey = dateKey(new Date());
    var byDay = {};
    var undated = [];
    filtered.forEach(function (item) {
      if (!item.due) {
        undated.push(item);
        return;
      }
      var key = dateKey(new Date(item.due));
      if (!byDay[key]) byDay[key] = [];
      byDay[key].push(item);
    });

    var year;
    var monthIndex;
    var startOffset = 0;
    var daysInMonth = 0;
    var totalCells;
    var weekStart;

    if (isWeek) {
      weekStart = startOfWeek(state.calendarWeekStart || new Date());
      state.calendarWeekStart = weekStart;
      var weekEnd = addCalendarDays(weekStart, 6);
      els.calendarTitle.textContent =
        weekStart.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }) +
        " – " +
        weekEnd.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      totalCells = 7;
      if (state.expandedCalDay) {
        var expandedTs = new Date(state.expandedCalDay + "T12:00:00").getTime();
        if (
          expandedTs < weekStart.getTime() ||
          expandedTs > weekEnd.getTime() + 24 * 60 * 60 * 1000 - 1
        ) {
          state.expandedCalDay = null;
        }
      }
    } else {
      var month = state.calendarMonth;
      year = month.getFullYear();
      monthIndex = month.getMonth();
      els.calendarTitle.textContent = month.toLocaleString(undefined, {
        month: "long",
        year: "numeric",
      });
      var firstDay = new Date(year, monthIndex, 1);
      startOffset = (firstDay.getDay() + 6) % 7;
      daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
      if (state.expandedCalDay) {
        var expandedDate = new Date(state.expandedCalDay + "T12:00:00");
        if (
          expandedDate.getMonth() !== monthIndex ||
          expandedDate.getFullYear() !== year
        ) {
          state.expandedCalDay = null;
        }
      }
    }

    els.calendarGrid.innerHTML = "";
    els.calendarGrid.className =
      "calendar-grid calendar-grid-weeks" + (isWeek ? " is-week-mode" : "");

    var weekEl = null;
    var weekDaysEl = null;

    function startWeekRow() {
      weekEl = document.createElement("div");
      weekEl.className = "cal-week";
      weekDaysEl = document.createElement("div");
      weekDaysEl.className = "cal-week-days";
      weekEl.appendChild(weekDaysEl);
      els.calendarGrid.appendChild(weekEl);
    }

    function appendDayCell(current, inMonth) {
      var key = dateKey(current);
      var dayItems = byDay[key] || [];
      var isExpanded = state.expandedCalDay === key;
      var cell = document.createElement("div");
      cell.className = "cal-day";
      if (!inMonth) {
        cell.classList.add("is-outside");
        weekDaysEl.appendChild(cell);
        return cell;
      }
      if (key === todayKey) cell.classList.add("is-today");
      if (dayItems.length) cell.classList.add("has-items");
      if (isExpanded) cell.classList.add("is-expanded");

      var daySplit = countReminderSplit(dayItems);
      var countText = daySplit.reminders
        ? daySplit.real + " · " + daySplit.reminders + "r"
        : String(daySplit.real);
      var ariaCount =
        daySplit.real +
        (daySplit.real === 1 ? " task" : " tasks") +
        (daySplit.reminders
          ? ", " +
            daySplit.reminders +
            " reminder" +
            (daySplit.reminders === 1 ? "" : "s")
          : "");

      var trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "cal-day-trigger";
      trigger.setAttribute("data-day-key", key);
      trigger.setAttribute("aria-expanded", isExpanded ? "true" : "false");
      trigger.setAttribute(
        "aria-label",
        current.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        }) +
          ", " +
          ariaCount +
          ". " +
          (isExpanded ? "Activate to collapse." : "Activate to expand.")
      );

      var heading = document.createElement("div");
      heading.className = "cal-day-num";
      var numSpan = document.createElement("span");
      numSpan.textContent = String(current.getDate());
      heading.appendChild(numSpan);
      if (dayItems.length) {
        var countBadge = document.createElement("span");
        countBadge.className = "cal-day-count";
        countBadge.textContent = countText;
        heading.appendChild(countBadge);
      }
      var chevron = document.createElement("span");
      chevron.className = "cal-day-chevron";
      chevron.setAttribute("aria-hidden", "true");
      heading.appendChild(chevron);
      trigger.appendChild(heading);
      cell.appendChild(trigger);

      if (dayItems.length) {
        var previews = document.createElement("div");
        previews.className = "cal-day-items";
        dayItems.slice(0, 2).forEach(function (item) {
          var preview = document.createElement(item.cardUrl ? "a" : "span");
          preview.className =
            "cal-item" +
            (dueBucket(item).id === "overdue" ? " is-overdue" : "") +
            (itemState(item) === "complete" ? " is-complete" : "");
          var previewText = document.createElement("span");
          previewText.className = "cal-item-text";
          previewText.textContent = plainItemTitle(
            item.name || item.cardName || "Untitled"
          );
          preview.appendChild(previewText);
          if (preview.tagName === "A") {
            preview.target = "_blank";
            preview.rel = "noopener noreferrer";
            preview.setAttribute(
              "aria-label",
              "Open " + previewText.textContent + " in Trello"
            );
            if (!applySafeHref(preview, item.cardUrl)) {
              preview.removeAttribute("href");
            }
            preview.addEventListener("click", function (event) {
              event.stopPropagation();
              scheduleBoardRefreshAfterOpen(item.boardId, item.boardName);
            });
          }
          previews.appendChild(preview);
        });
        if (dayItems.length > 2) {
          var more = document.createElement("span");
          more.className = "cal-more";
          more.textContent = "+" + (dayItems.length - 2) + " more";
          previews.appendChild(more);
        }
        cell.appendChild(previews);
      }

      trigger.addEventListener(
        "click",
        (function (dayKey) {
          return function () {
            state.expandedCalDay =
              state.expandedCalDay === dayKey ? null : dayKey;
            state.focusCalDayAfterRender = dayKey;
            renderTable();
          };
        })(key)
      );
      trigger.addEventListener(
        "keydown",
        (function (dayKey) {
          return function (event) {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              state.expandedCalDay =
                state.expandedCalDay === dayKey ? null : dayKey;
              state.focusCalDayAfterRender = dayKey;
              renderTable();
            }
          };
        })(key)
      );

      weekDaysEl.appendChild(cell);
      return cell;
    }

    startWeekRow();

    for (var i = 0; i < totalCells; i += 1) {
      if (!isWeek && i > 0 && i % 7 === 0) {
        startWeekRow();
      }

      var current;
      var inMonth = true;
      if (isWeek) {
        current = addCalendarDays(weekStart, i);
      } else {
        var dayNum = i - startOffset + 1;
        current = new Date(year, monthIndex, dayNum);
        inMonth = dayNum >= 1 && dayNum <= daysInMonth;
      }

      appendDayCell(current, inMonth);

      if ((i + 1) % 7 === 0 && state.expandedCalDay) {
        var expandedInWeek = false;
        var w;
        if (isWeek) {
          for (w = 0; w < 7; w += 1) {
            if (
              dateKey(addCalendarDays(weekStart, w)) === state.expandedCalDay
            ) {
              expandedInWeek = true;
              break;
            }
          }
        } else {
          for (var d = i - 6; d <= i; d += 1) {
            var dn = d - startOffset + 1;
            if (dn < 1 || dn > daysInMonth) continue;
            if (
              dateKey(new Date(year, monthIndex, dn)) === state.expandedCalDay
            ) {
              expandedInWeek = true;
              break;
            }
          }
        }
        if (expandedInWeek) {
          var expandRow = document.createElement("div");
          expandRow.className = "cal-week-expand";
          var labelDate = new Date(state.expandedCalDay + "T12:00:00");
          var label = labelDate.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          });
          expandRow.appendChild(
            renderCalendarDayDetail(byDay[state.expandedCalDay] || [], label)
          );
          weekEl.appendChild(expandRow);
        }
      }
    }

    if (undated.length) {
      els.calendarUndated.hidden = false;
      if (els.calendarUndatedText) {
        els.calendarUndatedText.textContent =
          undated.length +
          " undated item" +
          (undated.length === 1 ? "" : "s");
      } else {
        els.calendarUndated.textContent =
          undated.length +
          " undated item" +
          (undated.length === 1 ? "" : "s");
      }
    } else {
      els.calendarUndated.hidden = true;
      if (els.calendarUndatedText) els.calendarUndatedText.textContent = "";
    }

    var focusKey = state.focusCalDayAfterRender;
    state.focusCalDayAfterRender = null;
    if (focusKey && els.calendarGrid) {
      var focusCell = els.calendarGrid.querySelector(
        '[data-day-key="' + focusKey + '"]'
      );
      if (focusCell && focusCell.focus) {
        setTimeout(function () {
          focusCell.focus();
        }, 0);
      }
    }
  }

  function updateViewChrome() {
    var ownsTime = viewOwnsTime(state.view);
    var insight = isInsightView(state.view);
    syncViewMenu();
    if (els.groupField) {
      els.groupField.hidden = state.view !== "list";
    }
    if (els.groupPageSizeField) {
      els.groupPageSizeField.hidden = state.view !== "list";
    }
    if (els.focusChips) {
      els.focusChips.hidden = ownsTime;
    }
    if (els.insightWrap && !insight) {
      els.insightWrap.hidden = true;
    }

    var hideCompletedOn = viewUsesHideCompleted(state.view);
    var remindersOn = viewUsesReminders(state.view);
    if (els.stageHideCompleted) {
      els.stageHideCompleted.hidden = !hideCompletedOn;
      var hideCompletedInput = els.filterHideCompleted;
      if (hideCompletedInput) {
        hideCompletedInput.disabled = !hideCompletedOn;
      }
    }
    if (els.stageReminders) {
      els.stageReminders.hidden = !remindersOn;
      if (els.filterReminders) {
        els.filterReminders.disabled = !remindersOn;
      }
    }
    if (els.stageHideCards) {
      els.stageHideCards.hidden = false;
    }
  }

  function renderViews() {
    updateViewChrome();
    if (!state.data) {
      // Still sync timeframe chip active state before the first load.
      updateFocusChips();
      return;
    }

    var allRows = collectRows();
    state.cardStatsAll = {};
    (state.data.items || []).forEach(function (item) {
      if (!item.cardId || isReminderRow(item)) return;
      if (!state.cardStatsAll[item.cardId]) {
        state.cardStatsAll[item.cardId] = { total: 0, lists: 0, seen: {} };
      }
      var stats = state.cardStatsAll[item.cardId];
      stats.total += 1;
      if (item.checklistId && !stats.seen[item.checklistId]) {
        stats.seen[item.checklistId] = true;
        stats.lists += 1;
      }
    });
    var filterState = captureFilterState();
    var filtered = allRows
      .filter(function (item) {
        return matchesFilters(item, filterState);
      })
      .sort(compareItems);
    state.visibleItems = filtered;
    rememberListOrder(filtered);

    var counted = filtered.filter(function (item) {
      if (!viewUsesReminders(state.view) && isReminderRow(item)) return false;
      if (viewDropsCompleted(state.view) && itemState(item) !== "incomplete") {
        return false;
      }
      return true;
    });
    var overdue = counted.filter(function (item) {
      return !isReminderRow(item) && dueBucket(item).id === "overdue";
    }).length;
    var split = countReminderSplit(counted);
    var realLoaded = countReminderSplit(allRows).real;

    els.resultCount.textContent =
      split.real +
      " item" +
      (split.real === 1 ? "" : "s") +
      (split.reminders
        ? " · " +
          split.reminders +
          " reminder" +
          (split.reminders === 1 ? "" : "s")
        : "") +
      (overdue ? " · " + overdue + " overdue" : "") +
      " · " +
      realLoaded +
      " total loaded";

    updateFocusChips(filterState);
    updateFilterSummary();
    updateScanNudge();
    updateAssigneeVisibilityBanner();
    updateAuxButtons(filtered);

    var insight = isInsightView(state.view);
    var isEmpty = !filtered.length;
    els.emptyState.hidden = insight || !isEmpty;
    if (isEmpty && !insight) setEmptyCopy("filtered");

    if (state.view === "calendar") {
      setTableVisible(false);
      if (els.insightWrap) els.insightWrap.hidden = true;
      els.calendarWrap.hidden = false;
      renderCalendar(filtered);
      return;
    }

    if (insight) {
      setTableVisible(false);
      els.calendarWrap.hidden = true;
      if (els.insightWrap) {
        els.insightWrap.hidden = false;
        renderInsight(filtered);
      }
      return;
    }

    els.calendarWrap.hidden = true;
    if (els.insightWrap) els.insightWrap.hidden = true;
    els.emptyState.hidden = !filtered.length ? false : true;
    els.itemsBody.innerHTML = "";

    if (!filtered.length) {
      setTableVisible(false);
      setEmptyCopy("filtered");
      return;
    }
    setTableVisible(true);

    var frag = document.createDocumentFragment();
    var groups = buildGroups(filtered);
    var showGroups = state.groupBy !== "none";
    if (showGroups && groups.length) {
      var collapseTouched = false;
      if (!state.groupCollapseSeeded) {
        // First paint for this grouping: expand only the first group.
        // Missing keys after prefs prune mean "expanded", so we must not
        // re-apply this default on every render or expands get undone.
        groups.forEach(function (group, index) {
          if (state.collapsedGroups[group.id] === undefined) {
            state.collapsedGroups[group.id] = index !== 0;
            collapseTouched = true;
          }
        });
        state.groupCollapseSeeded = true;
      }
      if (collapseTouched) {
        savePrefs({ collapsedGroups: state.collapsedGroups });
      }
    }
    var appended = 0;

    groups.forEach(function (group) {
      if (showGroups) {
        var header = document.createElement("tr");
        header.className = "group-row";
        var collapsed = Boolean(state.collapsedGroups[group.id]);
        header.classList.toggle("is-collapsed", collapsed);
        // Column-group header so AT treat this as a section label, not a data cell.
        var cell = document.createElement("th");
        cell.colSpan = 6;
        cell.scope = "colgroup";
        // h2 > button matches accordion heading pattern (h1 is the hub title).
        var heading = document.createElement("h2");
        heading.className = "group-heading";
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "group-toggle";
        btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
        var caret = document.createElement("span");
        caret.className = "group-caret";
        caret.setAttribute("aria-hidden", "true");
        var label = document.createElement("span");
        label.className = "group-label";
        label.textContent = group.label;
        var count = document.createElement("span");
        count.className = "group-count";
        var limit = visibleCountForGroup(group.id, group.items.length);
        var groupSplit = countReminderSplit(group.items);
        var countLabel =
          String(groupSplit.real) +
          (groupSplit.reminders
            ? " · " + groupSplit.reminders + " rem."
            : "");
        if (state.groupPageSize && limit < group.items.length) {
          countLabel = limit + "/" + group.items.length;
        }
        count.textContent = countLabel;
        count.title =
          groupSplit.real +
          (groupSplit.real === 1 ? " item" : " items") +
          (groupSplit.reminders
            ? ", " +
              groupSplit.reminders +
              " reminder" +
              (groupSplit.reminders === 1 ? "" : "s")
            : "") +
          (state.groupPageSize && limit < group.items.length
            ? " (showing " + limit + ")"
            : "");
        btn.appendChild(caret);
        btn.appendChild(label);
        btn.appendChild(count);
        btn.addEventListener("click", function () {
          state.collapsedGroups[group.id] = !Boolean(
            state.collapsedGroups[group.id]
          );
          savePrefs({ collapsedGroups: state.collapsedGroups });
          renderViews();
        });
        heading.appendChild(btn);
        cell.appendChild(heading);
        header.appendChild(cell);
        frag.appendChild(header);

        if (collapsed) return;
      }

      var visibleLimit = visibleCountForGroup(group.id, group.items.length);
      for (var gi = 0; gi < visibleLimit; gi += 1) {
        try {
          frag.appendChild(createItemRow(group.items[gi]));
          appended += 1;
        } catch (err) {
          frag.appendChild(createFallbackRow(group.items[gi]));
          appended += 1;
        }
      }

      var remaining = group.items.length - visibleLimit;
      if (remaining > 0 && state.groupPageSize) {
        var moreRow = document.createElement("tr");
        moreRow.className = "group-more-row";
        var moreCell = document.createElement("td");
        moreCell.colSpan = 6;
        var moreBtn = document.createElement("button");
        moreBtn.type = "button";
        moreBtn.className = "group-more-btn";
        var chunk = Math.min(state.groupPageSize, remaining);
        moreBtn.textContent =
          "Show next " +
          chunk +
          (remaining > chunk ? " · " + remaining + " remaining" : "");
        moreBtn.setAttribute(
          "aria-label",
          "Show next " +
            chunk +
            " items in " +
            (group.label || "this group") +
            ", " +
            remaining +
            " remaining"
        );
        moreBtn.addEventListener("click", function () {
          var current = visibleCountForGroup(group.id, group.items.length);
          state.groupVisibleCounts[group.id] = current + state.groupPageSize;
          renderViews();
        });
        moreCell.appendChild(moreBtn);
        moreRow.appendChild(moreCell);
        frag.appendChild(moreRow);
      }
    });

    els.itemsBody.appendChild(frag);
  }

  function renderInsight(filtered) {
    if (!els.insightWrap) return;
    if (!window.ChecklistHubViews) {
      els.insightWrap.innerHTML = "";
      var missing = document.createElement("p");
      missing.className = "insight-note";
      missing.textContent =
        "This view did not load. Hard-refresh the page and try again.";
      els.insightWrap.appendChild(missing);
      return;
    }
    try {
      window.ChecklistHubViews.render(state.view, els.insightWrap, filtered, {
      now: new Date(),
      selectedId: state.selectedRowId,
      formatDue: formatDue,
      formatRelative: formatDueRelative,
      dueBucket: dueBucket,
      itemState: itemState,
      isReminder: isReminderRow,
      workKind: workKind,
      dateKey: dateKey,
      remindersOn: remindersEnabled,
      appendItemTitle: appendItemTitle,
      plainItemTitle: plainItemTitle,
      appendLinkedItemTitle: appendLinkedItemTitle,
      listOrderIndex: state.listOrderIndex,
      onSelect: function (id) {
        state.selectedRowId = id;
        highlightSelectedRow();
      },
      onOpen: function (item) {
        if (item && item.cardUrl) {
          openSafeCardUrl(item.cardUrl, item);
        }
      },
      onChecklistDetail: function (checklist) {
        openGanttChecklistModal(checklist);
      },
    });
    } catch (err) {
      els.insightWrap.innerHTML = "";
      var failed = document.createElement("p");
      failed.className = "insight-note";
      failed.textContent =
        "This view could not be drawn. Hard-refresh and try again.";
      els.insightWrap.appendChild(failed);
    }
  }

  function highlightSelectedRow() {
    document.querySelectorAll(".hub-row").forEach(function (row) {
      row.classList.toggle(
        "is-selected",
        row.getAttribute("data-row-id") === state.selectedRowId
      );
    });
  }

  function updateAuxButtons(filtered) {
    if (els.copyListBtn) {
      els.copyListBtn.hidden = !state.data;
      els.copyListBtn.disabled = !filtered.length;
    }
  }

  function copyVisibleList() {
    var rows = state.visibleItems || [];
    if (!rows.length) return;
    var lines = ["# Checklist Hub"];
    rows.forEach(function (item) {
      if (isReminderRow(item)) return;
      var due = formatDueRelative(item.due, itemState(item));
      var bits = [item.cardName, item.boardName, due].filter(Boolean);
      var box = itemState(item) === "complete" ? "x" : " ";
      lines.push("- [" + box + "] " + item.name + (bits.length ? " — " + bits.join(" · ") : ""));
      if (item.cardUrl) lines.push("  " + item.cardUrl);
    });
    var text = lines.join("\n");
    var done = function () {
      showBanner("Copied " + (lines.length - 1) + " lines.", "info", {
        dismissible: true,
      });
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        showBanner("Could not copy the list.", "warn", { dismissible: true });
      });
      return;
    }
    showBanner("Copy is not available in this browser.", "warn", { dismissible: true });
  }

  var renderFrame = 0;
  function renderTable() {
    if (renderFrame) return;
    renderFrame = window.requestAnimationFrame
      ? window.requestAnimationFrame(function () {
          renderFrame = 0;
          renderViews();
        })
      : (setTimeout(function () {
          renderFrame = 0;
          renderViews();
        }, 0),
        1);
  }

  function populateSavedViews() {
    if (!els.savedViews) return;
    var views = prefsApi.loadViews();
    var current = els.savedViews.value;
    var defaultId = prefsApi.loadPrefs().defaultViewId || "";
    els.savedViews.innerHTML = "";
    var placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select a saved view…";
    els.savedViews.appendChild(placeholder);
    views.forEach(function (view) {
      var opt = document.createElement("option");
      opt.value = view.id;
      opt.textContent =
        view.name + (view.id === defaultId ? " (default)" : "");
      els.savedViews.appendChild(opt);
    });
    if (current) {
      els.savedViews.value = current;
    }
    populateWelcomeStarter();
  }

  function parseWelcomeStarter(value) {
    var raw = value || "";
    if (raw.indexOf("team:") === 0) {
      return { kind: "team", id: raw.slice(5) };
    }
    if (raw.indexOf("view:") === 0) {
      return { kind: "view", id: raw.slice(5) };
    }
    return { kind: "none", id: "" };
  }

  function populateWelcomeStarter() {
    if (!els.welcomeStarter) return;
    var teams = state.teams || [];
    var views = prefsApi.loadViews();
    var defaultId = prefsApi.loadPrefs().defaultViewId || "";
    var previous = parseWelcomeStarter(els.welcomeStarter.value);
    var prefer =
      previous.kind !== "none"
        ? previous
        : state.pendingViewId
          ? { kind: "view", id: state.pendingViewId }
          : state.selectedTeamId
            ? { kind: "team", id: state.selectedTeamId }
            : { kind: "none", id: "" };

    els.welcomeStarter.innerHTML = "";
    var none = document.createElement("option");
    none.value = "";
    none.textContent = "None — pick boards below";
    els.welcomeStarter.appendChild(none);

    if (teams.length) {
      var teamGroup = document.createElement("optgroup");
      teamGroup.label = "Teams";
      teams.forEach(function (team) {
        var opt = document.createElement("option");
        opt.value = "team:" + team.id;
        opt.textContent = team.name;
        teamGroup.appendChild(opt);
      });
      els.welcomeStarter.appendChild(teamGroup);
    }

    if (views.length) {
      var viewGroup = document.createElement("optgroup");
      viewGroup.label = "Saved views";
      views.forEach(function (view) {
        var opt = document.createElement("option");
        opt.value = "view:" + view.id;
        opt.textContent =
          view.name + (view.id === defaultId ? " (default)" : "");
        viewGroup.appendChild(opt);
      });
      els.welcomeStarter.appendChild(viewGroup);
    }

    var preferValue =
      prefer.kind === "team"
        ? "team:" + prefer.id
        : prefer.kind === "view"
          ? "view:" + prefer.id
          : "";
    var hasPrefer = false;
    if (preferValue) {
      els.welcomeStarter.querySelectorAll("option").forEach(function (opt) {
        if (opt.value === preferValue) hasPrefer = true;
      });
    }
    els.welcomeStarter.value = hasPrefer ? preferValue : "";

    if (els.welcomeQuickStart) {
      els.welcomeQuickStart.hidden = !(teams.length || views.length);
    }
    syncWelcomeBoardsFromFilters();
    if (els.welcomeStarterBlock) {
      els.welcomeStarterBlock.hidden = !(
        teams.length ||
        views.length ||
        state.boardsReady ||
        (state.boardCatalog &&
          state.boardCatalog.boards &&
          state.boardCatalog.boards.length)
      );
    }
    updateWelcomeStarterLoadButton();
  }

  function updateWelcomeStarterLoadButton() {
    if (!els.welcomeStarterLoad) return;
    var parsed = parseWelcomeStarter(
      els.welcomeStarter && els.welcomeStarter.value
    );
    var hasBoards = getAllowlistBoardIds().length > 0;
    els.welcomeStarterLoad.disabled =
      parsed.kind === "none" && !hasBoards;
    var label = els.welcomeStarterLoad.querySelector(".btn-label");
    var icon = els.welcomeStarterLoad.querySelector(
      ".material-symbols-outlined"
    );
    if (parsed.kind === "team") {
      if (label) label.textContent = "View this team's work";
      if (icon) icon.textContent = "group";
    } else if (parsed.kind === "view") {
      if (label) label.textContent = "Start with this view";
      if (icon) icon.textContent = "bookmark";
    } else {
      if (label) label.textContent = "View checklists";
      if (icon) icon.textContent = "radar";
    }
  }

  function clearWelcomeStarterExtras() {
    state.pendingViewId = "";
  }

  function applyPendingOrDefaultView() {
    var pendingId = state.pendingViewId;
    if (pendingId) {
      state.pendingViewId = "";
      state.applyDefaultViewPending = false;
      var pendingView = findSavedView(pendingId);
      if (pendingView) {
        applySavedView(pendingView);
        return true;
      }
    }
    if (state.applyDefaultViewPending) {
      state.applyDefaultViewPending = false;
      var defaultId = prefsApi.loadPrefs().defaultViewId;
      if (defaultId) {
        var defaultView = findSavedView(defaultId);
        if (defaultView) {
          applySavedView(defaultView);
          return true;
        }
      }
    }
    return false;
  }

  function applyViewBoardPicks(view) {
    if (!view) return;
    var boards = view.boards || [];
    if (boards.length) {
      if (
        els.filterBoard &&
        els.filterBoard.querySelectorAll('input[type="checkbox"]').length
      ) {
        applyAllowlistBoardIds(boards);
      } else {
        savePrefs({ allowlist: boards.slice() });
        updateAllowlistSummary();
      }
    }
    if (view.assignees && view.assignees.length) {
      state.preferredAssignees = view.assignees.slice();
      if (
        els.filterAssignee &&
        els.filterAssignee.querySelectorAll('input[type="checkbox"]').length
      ) {
        setCheckedValues(els.filterAssignee, view.assignees);
        state.preferredAssignees = getCheckedValues(els.filterAssignee);
        updateAssigneeSummary();
      }
    }
  }

  function captureCurrentView(name, id) {
    return {
      id: id || "view-" + Date.now(),
      name: name,
      workType: state.hideCards ? "checkitem" : "both",
      status: state.hideCompleted ? "incomplete" : "all",
      due: els.filterDue.value,
      groupBy: state.groupBy,
      view: state.view,
      calendarMode: state.calendarMode,
      sortKey: state.sortKey,
      sortDir: state.sortDir,
      collapsedGroups: Object.assign({}, state.collapsedGroups),
      assignees: getCheckedValues(els.filterAssignee),
      boards: getCheckedValues(els.filterBoard),
      labels: els.filterLabel ? getCheckedValues(els.filterLabel) : [],
      lists: els.filterList ? getCheckedValues(els.filterList) : [],
      search: els.filterSearch.value || "",
      showReminders: state.showReminders,
      hideCards: state.hideCards,
      showUnassigned: state.showUnassigned,
    };
  }

  function syncSortHeaders() {
    document.querySelectorAll("th.sortable").forEach(function (node) {
      node.classList.remove("sort-asc", "sort-desc");
      var key = node.getAttribute("data-sort");
      var base =
        node.getAttribute("data-label") ||
        (node.textContent || "").replace(/\s*[â†‘â†“]\s*$/, "").trim();
      if (!node.getAttribute("data-label")) {
        node.setAttribute("data-label", base);
      }
      if (key === state.sortKey) {
        node.classList.add(state.sortDir === "asc" ? "sort-asc" : "sort-desc");
        node.setAttribute(
          "aria-sort",
          state.sortDir === "asc" ? "ascending" : "descending"
        );
        node.setAttribute(
          "aria-label",
          base +
            ", sorted " +
            (state.sortDir === "asc" ? "ascending" : "descending")
        );
      } else {
        node.setAttribute("aria-sort", "none");
        node.setAttribute("aria-label", base + ", activate to sort");
      }
    });
  }

  function applySavedView(view) {
    if (!view) return;
    clearListOrderMemory();
    state.workType = view.workType || "both";
    state.groupBy = view.groupBy || "due";
    state.view = view.view || "list";
    if (state.view === "week") {
      state.view = "calendar";
      state.calendarMode = "week";
    } else if (view.calendarMode === "week" || view.calendarMode === "month") {
      state.calendarMode = view.calendarMode;
    }
    state.sortKey = view.sortKey || "due";
    state.sortDir = view.sortDir === "desc" ? "desc" : "asc";
    state.showReminders = Boolean(view.showReminders);
    state.hideCompleted = view.status !== "all" && view.status !== "complete";
    state.hideCards =
      view.hideCards != null
        ? Boolean(view.hideCards)
        : view.workType === "checkitem";
    state.showUnassigned = Boolean(view.showUnassigned);
    state.collapsedGroups = Object.assign({}, view.collapsedGroups || {});
    state.groupCollapseSeeded =
      Object.keys(state.collapsedGroups).length > 0;
    if (els.filterWorkType) els.filterWorkType.value = state.workType;
    if (els.filterReminders) {
      els.filterReminders.checked = state.showReminders;
    }
    if (els.filterHideCompleted) {
      els.filterHideCompleted.checked = !state.hideCompleted;
    }
    if (els.filterHideCards) {
      els.filterHideCards.checked = !state.hideCards;
    }
    if (els.filterShowUnassigned) {
      els.filterShowUnassigned.checked = state.showUnassigned;
    }
    if (els.filterGroup) els.filterGroup.value = state.groupBy;
    els.filterDue.value = view.due || "all";
    els.filterSearch.value = view.search || "";
    setCheckedValues(els.filterAssignee, view.assignees || []);
    setCheckedValues(els.filterBoard, view.boards || []);
    if (els.filterLabel) setCheckedValues(els.filterLabel, view.labels || []);
    if (els.filterList) setCheckedValues(els.filterList, view.lists || []);
    updateAssigneeSummary();
    updateAllowlistSummary();
    persistAllowlist();
    if (els.filterLabel) {
      updateMultiSummary(els.filterLabel, "All labels", "All labels");
    }
    if (els.filterList) {
      updateMultiSummary(els.filterList, "All lists", "All lists");
    }
    var advanced = document.querySelector(".field-advanced");
    if (
      advanced &&
      ((view.labels && view.labels.length) || (view.lists && view.lists.length))
    ) {
      advanced.open = true;
    }
    var savedDetails = document.querySelector(".field-saved");
    if (savedDetails && view.id) savedDetails.open = true;
    if (els.savedViewName) els.savedViewName.value = view.name || "";
    if (els.savedViews && view.id) els.savedViews.value = view.id;
    syncSortHeaders();
    savePrefs({
      workType: state.workType,
      groupBy: state.groupBy,
      view: state.view,
      sortKey: state.sortKey,
      sortDir: state.sortDir,
      collapsedGroups: state.collapsedGroups,
      showReminders: state.showReminders,
      hideCompleted: state.hideCompleted,
      hideCards: state.hideCards,
      showUnassigned: state.showUnassigned,
      calendarMode: state.calendarMode,
    });
    renderTable();
  }

  function setConfigOpen(open) {
    var next = Boolean(open);
    if (!els.configPanel) {
      state.filtersOpen = next;
      updateAllowlistRescanNudge();
      return;
    }
    if (next) {
      if (state.filtersOpen && !els.configPanel.hidden) return;
      state.filtersOpen = true;
      closeWelcomeModal({ skipSession: true });
      closeScanConfirm();
      closeLoadBlockedModal();
      closePrivacyModal();
      closeApiUsageModal();
      closeGanttChecklistModal();
      closeShortcutsModal();
      closeViewMenu();
      if (els.configToggle) {
        els.configToggle.setAttribute("aria-expanded", "true");
        els.configToggle.classList.add("is-active");
      }
      openModalShell(
        els.configPanel,
        els.configClose || els.configDone
      );
      updateAllowlistRescanNudge();
      return;
    }
    if (!state.filtersOpen && els.configPanel.hidden) return;
    state.filtersOpen = false;
    els.configPanel.hidden = true;
    if (els.configToggle) {
      els.configToggle.setAttribute("aria-expanded", "false");
      els.configToggle.classList.remove("is-active");
    }
    if (noOtherModalOpen()) {
      document.body.classList.remove("welcome-open");
      restoreModalFocus();
    }
    updateAllowlistRescanNudge();
  }

  function updateFilterSummary() {
    if (!els.filterSummary) return;
    var filters = captureFilterState();
    var bits = [];
    bits.push(state.hideCards ? "Tasks" : "Tasks + member cards");

    var assignees = getCheckedValues(els.filterAssignee);
    if (assignees.length === 1 && assignees[0] === "me") bits.push("Me");
    else if (assignees.length) bits.push(assignees.length + " assignees");

    if (!state.hideCompleted && viewUsesHideCompleted(state.view)) {
      bits.push("Completed");
    }
    if (state.showUnassigned) {
      bits.push("Unassigned");
    }
    if (state.showReminders && viewUsesReminders(state.view)) {
      bits.push("Reminders");
    }
    if (filters.due !== "all" && !viewOwnsTime(state.view)) {
      var dueLabels = {
        myday: "My day",
        upcoming: "Upcoming",
        overdue: "Overdue",
        today: "Today",
        tomorrow: "Tomorrow",
        week: "7 days",
        none: "Undated",
      };
      bits.push(dueLabels[filters.due] || filters.due);
    }
    var boards = filters.boards;
    var boardBoxes = filters.boardOptionCount;
    if (boardBoxes) {
      if (!boards.length) bits.push("No boards shown");
      else if (boards.length < boardBoxes) {
        bits.push(boards.length + " boards");
      }
    }
    if (els.filterLabel) {
      var labelIds = filters.labels;
      if (labelIds.length) bits.push(labelIds.length + " labels");
    }
    if (els.filterList) {
      var listIds = filters.lists;
      if (listIds.length) bits.push(listIds.length + " lists");
    }
    var q = filters.search;
    if (q) bits.push('“' + q.slice(0, 18) + (q.length > 18 ? "…" : "") + '”');

    els.filterSummary.textContent = bits.join(" · ");
  }

  function setUiAuthorized(isAuthorized) {
    els.authBtn.hidden = isAuthorized;
    if (els.authEmptyState) els.authEmptyState.hidden = isAuthorized;
    if (els.disconnectBtn) {
      els.disconnectBtn.hidden = !isAuthorized || state.demo;
    }
    if (els.disconnectSep) {
      els.disconnectSep.hidden = !isAuthorized || state.demo;
    }
    if (els.workspace) els.workspace.hidden = !isAuthorized;
    if (els.configToggle) els.configToggle.hidden = !isAuthorized;
    if (els.themeToggle) els.themeToggle.hidden = !isAuthorized;
    if (els.metaRow) els.metaRow.hidden = !isAuthorized;
    if (els.viewToggle) els.viewToggle.hidden = !isAuthorized;
    if (els.stageBar) els.stageBar.hidden = !isAuthorized;
    if (!isAuthorized) {
      setConfigOpen(false);
      if (els.calendarWrap) els.calendarWrap.hidden = true;
      if (els.insightWrap) els.insightWrap.hidden = true;
      if (els.insightWrap) els.insightWrap.hidden = true;
      if (els.refreshBtn) els.refreshBtn.hidden = true;
      stopStatusNudgeWatch();
      closeViewMenu();
    } else {
      populateSavedViews();
      if (state.data) startStatusNudgeWatch();
      else stopStatusNudgeWatch();
      updateAllowlistSummary();
      syncActionButtons();
    }
  }

  function syncActionButtons() {
    var ready = Boolean(state.token) && !state.loading;
    var hasData = Boolean(state.data);

    if (els.refreshBtn) {
      els.refreshBtn.hidden = !ready;
      els.refreshBtn.disabled = !ready;
      var label = els.refreshBtn.querySelector(".btn-label");
      var icon = els.refreshBtn.querySelector(".material-symbols-outlined");
      if (hasData) {
        if (label) label.textContent = "Refresh";
        if (icon) icon.textContent = "sync";
        els.refreshBtn.title =
          "Reload checklist work from all selected boards";
      } else {
        if (label) label.textContent = "View checklists";
        if (icon) icon.textContent = "radar";
        els.refreshBtn.title =
          "Collect checklist work from the selected boards";
      }
    }

    if (els.exportBtn) {
      els.exportBtn.hidden = !ready || !hasData;
      els.exportBtn.disabled = !ready || !hasData;
    }
    if (els.copyListBtn) {
      els.copyListBtn.hidden = !ready || !hasData;
    }
  }

  function runScan(options) {
    var opts = options || {};
    closeWelcomeModal({ persist: true, skipSession: true });
    closeScanConfirm();
    if (!state.boardsReady && !opts.forceFull && !opts.boardListOnly) {
      return loadBoardList().then(function () {
        showBanner(
          "Board list ready. Select boards under Filters, then choose View checklists.",
          "info",
          { dismissible: true, bannerKind: "board-pick" }
        );
        if (!getAllowlistBoardIds().length) setConfigOpen(true);
      });
    }
    if (opts.boardListOnly) {
      return loadBoardList();
    }
    if (state.data && !opts.skipConfirm) {
      var blocker = getLoadChecklistsBlocker();
      if (blocker) {
        warnLoadBlocked(blocker);
        return Promise.resolve();
      }
      openScanConfirm();
      return;
    }
    beginScan();
  }

  function beginScan(retried) {
    closeScanConfirm();
    closeLoadBlockedModal();
    closeWelcomeModal({ persist: true, skipSession: true });
    clearAllPendingBoardRefreshes();
    if (!retried && boardListInFlight && !state.boardsReady) {
      return boardListInFlight.then(function () {
        return beginScan(true);
      });
    }
    var blocker = getLoadChecklistsBlocker();
    if (blocker) {
      warnLoadBlocked(blocker);
      return Promise.resolve();
    }
    if (state.scanAbort) {
      try {
        state.scanAbort.abort();
      } catch (e) {
        // ignore
      }
    }
    // Release any in-flight single-board refresh so loadData is not blocked.
    state.refreshingBoardId = null;
    state.loading = false;
    state.scanAbort =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    if (!state.demo) api.clearCache();
    return loadData(true);
  }

  function applyBoardCatalog(catalog, options) {
    var opts = options || {};
    state.boardCatalog = catalog;
    state.boardsReady = true;
    if (catalog && catalog.me && !state.data) {
      // Keep me available for assignee defaults before full scan.
      state.catalogMe = catalog.me;
    }
    populateAllowlistBoards((catalog && catalog.boards) || []);
    if (state.pendingViewId) {
      applyViewBoardPicks(findSavedView(state.pendingViewId));
    }
    updateAllowlistSummary();
    syncActionButtons();
    syncWelcomeTeamsUi();
    populateWelcomeStarter();
    if (!state.data) {
      setEmptyCopy("pick-boards");
      if (els.emptyState) els.emptyState.hidden = false;
      if (!opts.silent) {
        showBanner(
          "Select boards under Filters, then choose View checklists.",
          "info",
          { dismissible: true, bannerKind: "board-pick" }
        );
        if (!getAllowlistBoardIds().length) setConfigOpen(true);
      }
    }
    if (els.cacheNote && !state.data) {
      var count = (catalog.boards || []).length;
      els.cacheNote.textContent =
        count +
        " board" +
        (count === 1 ? "" : "s") +
        " listed · checklists not loaded yet";
    }
    if (els.subtitle && !state.data) {
      els.subtitle.textContent =
        "Choose boards, then view checklists" +
        (catalog.me && (catalog.me.fullName || catalog.me.username)
          ? " · " + (catalog.me.fullName || catalog.me.username)
          : "");
    }
  }

  var boardListInFlight = null;

  function loadBoardList(options) {
    if (boardListInFlight) return boardListInFlight;
    if (state.loading) return Promise.resolve();
    var listOpts = options || {};
    state.loading = true;
    syncActionButtons();

    var finish = function () {
      state.loading = false;
      state.scanAbort = null;
      hideScanProgress();
      syncActionButtons();
    };

    if (state.scanAbort) {
      try {
        state.scanAbort.abort();
      } catch (e) {
        // ignore
      }
    }
    state.scanAbort =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    var listAbort = state.scanAbort;

    var work;
    if (state.demo) {
      setScanProgress(0, 1, "Board names", "catalog");
      // Demo catalog uses a standalone timer so abort races with Load cannot hang UI.
      work = new Promise(function (resolve) {
        setTimeout(resolve, 120);
      })
        .then(function () {
          if (listAbort && listAbort.signal && listAbort.signal.aborted) {
            var err = new Error("Cancelled.");
            err.name = "AbortError";
            throw err;
          }
          var mock = null;
          if (window.ChecklistHubMock) {
            if (typeof window.ChecklistHubMock.getDataset === "function") {
              mock = window.ChecklistHubMock.getDataset();
            } else if (
              typeof window.ChecklistHubMock.buildDataset === "function"
            ) {
              mock = window.ChecklistHubMock.buildDataset();
            }
          }
          applyBoardCatalog(
            {
              me:
                (mock && mock.me) || {
                  id: "member-me",
                  fullName: "Alex Rivera",
                },
              boards: (mock && mock.boards) || [],
              meta: { httpCalls: 0, rateLimitUnits: 0 },
            },
            listOpts
          );
          setScanProgress(1, 1, "Done", "catalog");
        })
        .catch(function (err) {
          if (err && err.name === "AbortError") {
            showBanner("Cancelled.", "info", { dismissible: true });
            return;
          }
          showErrorBanner(err, "Board list");
        });
    } else {
      work = ensureAuthorized()
        .then(function (token) {
          if (!token) return null;
          state.token = token;
          if (!isApiKeyConfigured()) {
            throw new Error(
              "Set your Power-Up API key in public/config.js before using Checklist Hub. Or open dashboard.html?demo=1 for a local preview."
            );
          }
          els.subtitle.textContent = "Listing boards…";
          setScanProgress(0, 1, "Board names", "catalog");
          return api.loadBoardCatalog(state.token, {
            signal: state.scanAbort ? state.scanAbort.signal : null,
          });
        })
        .then(function (catalog) {
          if (!catalog) return;
          applyBoardCatalog(catalog, listOpts);
          setScanProgress(1, 1, "Done", "catalog");
          if (listOpts.refreshOnly && state.data) {
            showBanner(
              "Board names refreshed. Your work is unchanged until you refresh selected boards.",
              "info",
              { dismissible: true, bannerKind: "board-pick" }
            );
          }
        })
        .catch(function (err) {
          if (err && err.name === "AbortError") {
            showBanner("Cancelled.", "info", { dismissible: true });
            return;
          }
          if (handleAuthorizationError(err)) return;
          showErrorBanner(err, "Board list");
          els.subtitle.textContent = "Could not list board names";
        });
    }

    boardListInFlight = work.finally(function () {
      boardListInFlight = null;
      if (state.scanAbort === listAbort) {
        finish();
      }
    });
    return boardListInFlight;
  }

  function boardsMissingFromScan() {
    if (!state.data) return [];
    var scanned = {};
    (state.data.scannedBoardIds || []).forEach(function (id) {
      scanned[id] = true;
    });
    var missing = [];
    getAllowlistBoardIds().forEach(function (id) {
      if (!scanned[id]) missing.push(id);
    });
    return missing;
  }

  function maybeLoadBoardsAfterFilters() {
    if (!getAllowlistBoardIds().length) return Promise.resolve();
    if (!state.data) {
      return runScan({ skipConfirm: true, forceFull: true });
    }
    var missing = boardsMissingFromScan();
    if (!missing.length) return Promise.resolve();
    return loadMissingBoards(missing);
  }

  function updateAllowlistRescanNudge() {
    if (!state.data) {
      state.allowlistRescanNeeded = false;
      if (
        els.banner &&
        !els.banner.hidden &&
        els.banner.getAttribute("data-banner-kind") === "allowlist-rescan"
      ) {
        showBanner(null);
      }
      updateScanNudge();
      return;
    }
    var missing = boardsMissingFromScan();
    state.allowlistRescanNeeded = missing.length > 0;
    if (state.allowlistRescanNeeded) {
      var missingCount = missing.length;
      // Refresh loads newly selected boards with the rest of the allowlist.
      var how = state.filtersOpen
        ? missingCount === 1
          ? "Press Done to load it."
          : "Press Done to load them."
        : missingCount === 1
          ? "Press Refresh to load it."
          : "Press Refresh to load them.";
      showBanner(
        missingCount +
          (missingCount === 1
            ? " selected board is not loaded yet. "
            : " selected boards are not loaded yet. ") +
          how,
        "info",
        {
          dismissible: true,
          bannerKind: "allowlist-rescan",
        }
      );
    } else if (
      els.banner &&
      !els.banner.hidden &&
      els.banner.getAttribute("data-banner-kind") === "allowlist-rescan"
    ) {
      showBanner(null);
    }
    updateScanNudge();
  }

  function cancelScan() {
    if (state.scanAbort) {
      try {
        state.scanAbort.abort();
      } catch (e) {
        // ignore
      }
    }
    if (state.demoTimer) {
      clearTimeout(state.demoTimer);
      state.demoTimer = null;
    }
  }

  function demoDelay(ms) {
    return new Promise(function (resolve, reject) {
      var signal = state.scanAbort && state.scanAbort.signal;
      if (signal && signal.aborted) {
        var early = new Error("Cancelled.");
        early.name = "AbortError";
        reject(early);
        return;
      }
      var settled = false;
      var timer = null;
      function settle(fn, arg) {
        if (settled) return;
        settled = true;
        if (signal) signal.removeEventListener("abort", onAbort);
        if (state.demoTimer === timer) state.demoTimer = null;
        fn(arg);
      }
      function onAbort() {
        if (timer) clearTimeout(timer);
        var err = new Error("Cancelled.");
        err.name = "AbortError";
        settle(reject, err);
      }
      timer = setTimeout(function () {
        settle(resolve);
      }, ms);
      state.demoTimer = timer;
      if (signal) signal.addEventListener("abort", onAbort);
    });
  }

  function setScanProgress(done, total, detail, mode) {
    if (!els.scanProgress) return;
    els.scanProgress.hidden = false;
    var pct = total ? Math.round((done / total) * 100) : 0;
    if (els.scanProgressFill) els.scanProgressFill.style.width = pct + "%";
    if (els.scanProgressText) {
      var verb = mode === "update" ? "Updating" : "Loading checklists";
      if (mode === "catalog") verb = "Listing boards";
      els.scanProgressText.textContent =
        verb +
        " " +
        done +
        "/" +
        total +
        (detail ? " · " + detail : "") +
        " (" +
        pct +
        "%)";
    }
  }

  function hideScanProgress() {
    if (els.scanProgress) els.scanProgress.hidden = true;
    if (els.scanProgressFill) els.scanProgressFill.style.width = "0%";
  }

  function formatAgo(ts) {
    if (!ts) return "";
    var mins = Math.max(0, Math.round((Date.now() - ts) / 60000));
    if (mins < 1) return "just now";
    if (mins === 1) return "1 min ago";
    if (mins < 60) return mins + " min ago";
    var hours = Math.round(mins / 60);
    if (hours === 1) return "1 hour ago";
    if (hours < 48) return hours + " hours ago";
    var days = Math.round(hours / 24);
    return days === 1 ? "1 day ago" : days + " days ago";
  }

  function setScanNudge(label, title) {
    if (!els.scanNudge) return;
    els.scanNudge.hidden = false;
    els.scanNudge.title = title;
    var text = els.scanNudge.querySelector(".scan-nudge-label");
    if (text) text.textContent = label;
  }

  function updateScanNudge() {
    if (!els.scanNudge) return;
    if (state.allowlistRescanNeeded && state.data) {
      var missing = boardsMissingFromScan().length;
      var label =
        missing === 1 ? "Add selected board" : "Add " + missing + " selected boards";
      setScanNudge(
        label,
        "These boards are selected, but their checklist items are not here yet."
      );
      return;
    }
    if (!state.data || !state.data.fetchedAt || state.loading) {
      els.scanNudge.hidden = true;
      return;
    }
    var nudgeAfter =
      (config && config.rescanNudgeMs) || 15 * 60 * 1000;
    var age = Date.now() - state.data.fetchedAt;
    els.scanNudge.hidden = age < nudgeAfter;
    if (!els.scanNudge.hidden) {
      setScanNudge(
        "Refresh selected boards",
        "Reload checklist work from all selected boards."
      );
    }
  }

  function setEmptyCopy(mode) {
    if (!els.emptyState) return;
    var heading = els.emptyState.querySelector("h2");
    var steps = els.emptyState.querySelector(".empty-steps");
    var note = els.emptyState.querySelector(".empty-note");
    if (mode === "pick-boards") {
      var ticked = getAllowlistBoardIds().length;
      if (heading) {
        heading.textContent = ticked
          ? "Start with these boards"
          : "Choose your boards";
      }
      if (steps) steps.hidden = true;
      if (note) {
        note.hidden = false;
        note.textContent = ticked
          ? ticked +
            " board" +
            (ticked === 1 ? " is" : "s are") +
            " selected. Choose View checklists to collect checklist work."
          : "Select boards under Filters, then choose View checklists.";
      }
    } else if (mode === "idle") {
      if (heading) heading.textContent = "Ready when you are";
      if (steps) {
        steps.hidden = false;
        var items = steps.querySelectorAll("li");
        if (items.length >= 3) {
          if (state.demo) {
            items[0].textContent = "Demo mode — no Trello authorize needed.";
            items[1].textContent =
              "Boards list automatically. Select the ones you need.";
            items[2].textContent =
              "View checklists — then explore the sample work.";
          } else {
            items[0].textContent = "Authorize once (read-only).";
            items[1].textContent =
              "Boards list automatically. Select the ones you need.";
            items[2].textContent =
              "View checklists — then open cards in Trello to finish work.";
          }
        }
      }
      if (note) {
        note.hidden = false;
        note.textContent = state.demo
          ? "Pick a Quick start team or select boards, then view checklists."
          : "Select the boards that contribute to your work, then view checklists.";
      }
    } else {
      var scope = els.filterDue ? els.filterDue.value : "all";
      if (heading) {
        heading.textContent =
          scope === "myday"
            ? "Your day is clear"
            : scope === "upcoming"
              ? "No upcoming work"
              : scope === "none"
                ? "No undated work"
                : "No matching work";
      }
      if (steps) steps.hidden = true;
      if (note) {
        note.hidden = false;
        note.textContent =
          scope === "myday"
            ? "Review Upcoming or Undated work, or refresh selected boards."
            : "Try another due filter, widen filters, or refresh selected boards.";
      }
    }
  }

  function showIdleWorkspace() {
    state.data = null;
    state.allowlistRescanNeeded = false;
    state.refreshingBoardId = null;
    clearAllPendingBoardRefreshes();
    state.statusNudgeDismissedUntil = 0;
    stopStatusNudgeWatch();
    if (els.resultCount) els.resultCount.textContent = "";
    if (els.filterSummary) els.filterSummary.textContent = "";
    if (els.cacheNote) els.cacheNote.textContent = "";
    if (els.scanNudge) els.scanNudge.hidden = true;
    if (els.exportBtn) els.exportBtn.hidden = true;
    hideScanProgress();
    if (els.tableWrap) els.tableWrap.hidden = true;
    if (els.tableWrap) els.tableWrap.classList.remove("is-shown");
    if (els.calendarWrap) els.calendarWrap.hidden = true;
    setEmptyCopy(state.boardsReady ? "pick-boards" : "idle");
    if (els.emptyState) els.emptyState.hidden = false;
    if (els.focusChips) {
      els.focusChips.querySelectorAll("[data-due-chip]").forEach(function (chip) {
        var key = chip.getAttribute("data-due-chip");
        var active = (els.filterDue && els.filterDue.value) === key;
        chip.classList.toggle("is-active", active);
        chip.classList.toggle("chip-emphasis", active);
        chip.setAttribute("aria-pressed", active ? "true" : "false");
        if (key === "all") chip.textContent = "All work";
        else if (key === "myday") chip.textContent = "My day";
        else if (key === "upcoming") chip.textContent = "Upcoming";
        else if (key === "none") chip.textContent = "Undated";
        else if (key === "overdue") chip.textContent = "Overdue";
        else if (key === "today") chip.textContent = "Today";
        else if (key === "tomorrow") chip.textContent = "Tomorrow";
        else if (key === "week") chip.textContent = "Next 7 days";
      });
    }
    syncActionButtons();
  }

  function getFocusableElements(root) {
    if (!root) return [];
    return Array.prototype.slice
      .call(
        root.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      )
      .filter(function (el) {
        if (el.closest("[hidden]")) return false;
        return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
      });
  }

  function activeModal() {
    if (els.configPanel && !els.configPanel.hidden) return els.configPanel;
    if (els.welcomeModal && !els.welcomeModal.hidden) return els.welcomeModal;
    if (els.scanConfirmModal && !els.scanConfirmModal.hidden) {
      return els.scanConfirmModal;
    }
    if (els.loadBlockedModal && !els.loadBlockedModal.hidden) {
      return els.loadBlockedModal;
    }
    if (els.ganttChecklistModal && !els.ganttChecklistModal.hidden) {
      return els.ganttChecklistModal;
    }
    if (els.privacyModal && !els.privacyModal.hidden) return els.privacyModal;
    if (els.shortcutsModal && !els.shortcutsModal.hidden) {
      return els.shortcutsModal;
    }
    if (els.apiUsageModal && !els.apiUsageModal.hidden) return els.apiUsageModal;
    return null;
  }

  function setPageInert(inert) {
    var nodes = [
      document.querySelector("header.topbar"),
      els.workspace,
      document.querySelector("footer.site-footer") ||
        document.querySelector("footer"),
    ];
    nodes.forEach(function (node) {
      if (!node) return;
      if (inert) {
        node.setAttribute("inert", "");
        node.setAttribute("aria-hidden", "true");
      } else {
        node.removeAttribute("inert");
        node.removeAttribute("aria-hidden");
      }
    });
  }

  function openModalShell(modal, focusEl) {
    if (!modal) return;
    if (!activeModal()) {
      state.modalFocusBefore = document.activeElement;
    }
    modal.hidden = false;
    document.body.classList.add("welcome-open");
    setPageInert(true);
    setTimeout(function () {
      var target =
        focusEl ||
        getFocusableElements(modal.querySelector(".welcome-dialog"))[0];
      if (target && target.focus) target.focus();
    }, 0);
  }

  function restoreModalFocus() {
    setPageInert(false);
    var prev = state.modalFocusBefore;
    state.modalFocusBefore = null;
    if (prev && prev.focus && document.contains(prev)) {
      try {
        prev.focus();
      } catch (e) {
        // ignore
      }
    }
  }

  function showWelcomeModal(force) {
    if (!els.welcomeModal) return;
    if (!force) {
      if (state.data) return;
      if (state.welcomeSkippedThisSession) return;
      if (
        params.get("welcome") !== "1" &&
        prefsApi.loadPrefs().welcomeDismissed
      ) {
        return;
      }
    }
    closeScanConfirm();
    closeLoadBlockedModal();
    closePrivacyModal();
    closeApiUsageModal();
    closeGanttChecklistModal();
    setConfigOpen(false);
    syncWelcomeTeamsUi();
    populateWelcomeStarter();
    var focusEl =
      (els.welcomeStarterBlock &&
        !els.welcomeStarterBlock.hidden &&
        els.welcomeStarter) ||
      els.welcomeScan ||
      els.welcomeDismiss;
    openModalShell(els.welcomeModal, focusEl);
  }

  function closeWelcomeModal(opts) {
    var options = opts || {};
    if (els.welcomeModal) els.welcomeModal.hidden = true;
    if (options.persist || options.skipSession) {
      state.welcomeSkippedThisSession = true;
    }
    if (options.persist) {
      savePrefs({ welcomeDismissed: true });
    }
    if (noOtherModalOpen()) {
      document.body.classList.remove("welcome-open");
      restoreModalFocus();
    }
  }

  function openScanConfirm() {
    if (!els.scanConfirmModal) {
      beginScan();
      return;
    }
    closePrivacyModal();
    closeApiUsageModal();
    closeLoadBlockedModal();
    closeGanttChecklistModal();
    setConfigOpen(false);
    openModalShell(els.scanConfirmModal, els.scanConfirmOk);
  }

  function closeScanConfirm() {
    if (els.scanConfirmModal) els.scanConfirmModal.hidden = true;
    if (noOtherModalOpen()) {
      document.body.classList.remove("welcome-open");
      restoreModalFocus();
    }
  }

  function openLoadBlockedModal(blocker) {
    if (!els.loadBlockedModal) {
      showBanner(blocker.message, "warn", {
        dismissible: true,
        bannerKind: "load-blocked",
      });
      if (blocker.openFilters) setConfigOpen(true);
      return;
    }
    closeWelcomeModal({ skipSession: true });
    closeScanConfirm();
    closePrivacyModal();
    closeApiUsageModal();
    closeGanttChecklistModal();
    setConfigOpen(false);
    if (els.loadBlockedTitle) {
      els.loadBlockedTitle.textContent = blocker.title || "Can't load boards";
    }
    if (els.loadBlockedLead) {
      els.loadBlockedLead.textContent = blocker.message || "";
    }
    openModalShell(
      els.loadBlockedModal,
      els.loadBlockedFilters || els.loadBlockedDismiss
    );
  }

  function closeLoadBlockedModal() {
    if (els.loadBlockedModal) els.loadBlockedModal.hidden = true;
    if (noOtherModalOpen()) {
      document.body.classList.remove("welcome-open");
      restoreModalFocus();
    }
  }

  function openPrivacyModal() {
    if (!els.privacyModal) return;
    closeWelcomeModal();
    closeScanConfirm();
    closeLoadBlockedModal();
    closeApiUsageModal();
    closeGanttChecklistModal();
    setConfigOpen(false);
    openModalShell(
      els.privacyModal,
      els.privacyModalClose ||
        els.privacyModal.querySelector(".welcome-dialog button, .welcome-dialog a")
    );
  }

  function closePrivacyModal() {
    if (els.privacyModal) els.privacyModal.hidden = true;
    if (noOtherModalOpen()) {
      document.body.classList.remove("welcome-open");
      restoreModalFocus();
    }
  }

  function openShortcutsModal() {
    if (!els.shortcutsModal) return;
    closePrivacyModal();
    closeApiUsageModal();
    setConfigOpen(false);
    openModalShell(
      els.shortcutsModal,
      els.shortcutsModalClose ||
        els.shortcutsModal.querySelector(".welcome-dialog button")
    );
  }

  function closeShortcutsModal() {
    if (els.shortcutsModal) els.shortcutsModal.hidden = true;
    if (noOtherModalOpen()) {
      document.body.classList.remove("welcome-open");
      restoreModalFocus();
    }
  }

  function stopStatusNudgeWatch() {
    if (state.statusTimer) {
      clearInterval(state.statusTimer);
      state.statusTimer = null;
    }
    hideStatusRefreshBanner();
  }

  function statusNudgeMs() {
    if (!config) return 0;
    var ms =
      config.statusNudgeMs != null ? config.statusNudgeMs : config.statusPollMs;
    return ms || 0;
  }

  function lastStatusFreshAt() {
    if (!state.data) return 0;
    return state.data.statusSyncedAt || state.data.fetchedAt || 0;
  }

  function hideStatusRefreshBanner() {
    if (els.statusRefreshBanner) els.statusRefreshBanner.hidden = true;
  }

  function updateStatusNudge() {
    if (!els.statusRefreshBanner) return;
    var ms = statusNudgeMs();
    if (
      !state.data ||
      state.loading ||
      !ms ||
      ms < 15000 ||
      (state.statusNudgeDismissedUntil &&
        Date.now() < state.statusNudgeDismissedUntil)
    ) {
      hideStatusRefreshBanner();
      return;
    }
    var age = Date.now() - lastStatusFreshAt();
    els.statusRefreshBanner.hidden = age < ms;
  }

  function startStatusNudgeWatch() {
    stopStatusNudgeWatch();
    if (!state.data) return;
    var ms = statusNudgeMs();
    if (!ms || ms < 15000) return;
    updateStatusNudge();
    // Local age check only — never calls the API by itself.
    state.statusTimer = setInterval(updateStatusNudge, 30000);
  }

  function getAppKey() {
    var live =
      (window.CHECKLIST_HUB_CONFIG && window.CHECKLIST_HUB_CONFIG.appKey) ||
      (config && config.appKey) ||
      "";
    return String(live).trim();
  }

  function isApiKeyConfigured() {
    var key = getAppKey();
    return Boolean(
      key &&
        key !== "YOUR_TRELLO_API_KEY" &&
        !/^YOUR_/i.test(key) &&
        key.length >= 16
    );
  }

  function getRestApiClient() {
    if (!t || typeof t.getRestApi !== "function") {
      return Promise.reject(new Error("Trello Power-Up client is not available."));
    }
    // Trello docs say Promise, but the client returns the RestApi object
    // (with .authorize / .isAuthorized / .getToken) in current power-up.min.js.
    var api = t.getRestApi();
    if (api && typeof api.then === "function") return api;
    return Promise.resolve(api);
  }

  function disconnectHub() {
    if (state.demo) {
      showBanner("Demo mode has no Trello token to disconnect.", "info", {
        dismissible: true,
      });
      return;
    }
    getRestApiClient()
      .then(function (rest) {
        if (rest && typeof rest.clearToken === "function") {
          return rest.clearToken();
        }
        return null;
      })
      .then(function () {
        clearAllPendingBoardRefreshes();
        state.refreshingBoardId = null;
        state.token = null;
        state.data = null;
        state.boardsReady = false;
        state.boardCatalog = null;
        if (api && api.clearCache) api.clearCache();
        setUiAuthorized(false);
        els.subtitle.textContent = "Disconnected · authorize to continue";
        if (els.tableWrap) {
          els.tableWrap.hidden = true;
          els.tableWrap.classList.remove("is-shown");
        }
        if (els.calendarWrap) els.calendarWrap.hidden = true;
        if (els.insightWrap) els.insightWrap.hidden = true;
        if (els.emptyState) els.emptyState.hidden = true;
        showBanner(
          "Disconnected from Trello. Authorize again when you want to use Checklist Hub.",
          "info",
          { dismissible: true }
        );
      })
      .catch(function (err) {
        showErrorBanner(err, "Disconnect");
      });
  }

  function ensureAuthorized() {
    return getRestApiClient().then(function (rest) {
      return rest.isAuthorized().then(function (isAuthorized) {
        if (!isAuthorized) {
          setUiAuthorized(false);
          els.subtitle.textContent = "Authorize to load checklist items.";
          els.tableWrap.hidden = true;
          els.tableWrap.classList.remove("is-shown");
          if (els.calendarWrap) els.calendarWrap.hidden = true;
      if (els.insightWrap) els.insightWrap.hidden = true;
          els.emptyState.hidden = true;
          showBanner(
            "Authorize once with Trello (read-only). Then select the boards that contribute to your work.",
            "info"
          );
          return null;
        }
        setUiAuthorized(true);
        return rest.getToken();
      });
    });
  }

  function applyDataset(data, options) {
    var opts = options || {};
    if (
      window.ChecklistHubApi &&
      typeof window.ChecklistHubApi.withRemindersExpanded === "function"
    ) {
      data = window.ChecklistHubApi.withRemindersExpanded(data);
    }
    state.data = data;
    if (!opts.progressive) {
      resetGroupVisibleCounts();
    }
    (data.members || []).forEach(registerAssigneeMember);
    if (data.me) registerAssigneeMember(data.me);
    populateAllowlistBoards(data.boards);
    // Keep live board ticks (including boards added after a team was chosen).
    // Do not reset to team.boardIds here — that wiped unscanned/extra picks after Load.
    populateBoards(data.boards);
    populateLabels(data.labels || []);
    populateLists(data.lists || []);
    populateAssignees(data.members, data.me);
    els.cacheNote.textContent = opts.cacheNote || "";
    if (data.fetchedAt && !opts.skipLastScanned) {
      var scannedLabel =
        "Last loaded " + formatAgo(data.fetchedAt);
      els.cacheNote.textContent = els.cacheNote.textContent
        ? scannedLabel + " · " + els.cacheNote.textContent
        : scannedLabel;
    }
    if (
      !opts.progressive &&
      data.meta &&
      data.meta.boardErrors &&
      data.meta.boardErrors.length
    ) {
      var failCount = data.meta.boardErrors.length;
      var okCount = Math.max(
        0,
        (data.meta.boardCount || 0) - failCount
      );
      var failNames = data.meta.boardErrors
        .slice(0, 4)
        .map(function (err) {
          return err.boardName || err.boardId;
        })
        .join(", ");
      var moreFails =
        failCount > 4 ? " +" + (failCount - 4) + " more" : "";
      showBanner(
        "Loaded " +
          okCount +
          " board" +
          (okCount === 1 ? "" : "s") +
          " with " +
          failCount +
          " issue" +
          (failCount === 1 ? "" : "s") +
          ".",
        "info",
        {
          dismissible: true,
          actionLabel: "Retry affected boards",
          action: function () {
            loadMissingBoards(
              data.meta.boardErrors.map(function (err) {
                return err.boardId;
              })
            );
          },
          technical:
            "Board issues:\n" +
            data.meta.boardErrors
              .map(function (err) {
                return (
                  "- " +
                  (err.boardName || err.boardId) +
                  ": " +
                  (err.message || "unknown")
                );
              })
              .join("\n") +
            (failNames ? "\nPreview: " + failNames + moreFails : ""),
        }
      );
    }
    // Rate / HTTP detail stays in API usage — not the main cache note.
    if (!opts.keepSubtitle) {
      els.subtitle.textContent =
        opts.subtitle ||
        "Signed in as " +
          (data.me.fullName || data.me.username || "member");
    }
    state.statusNudgeDismissedUntil = 0;
    try {
      startStatusNudgeWatch();
    } catch (err) {
      // Nudge is optional; a config miss must not hide loaded items.
    }
    syncActionButtons();
    try {
      updateScanNudge();
    } catch (err) {
      // Scan nudge is optional.
    }
    if (!opts.progressive && applyPendingOrDefaultView()) return;
    renderTable();
  }

  function loadDemoStatus() {
    if (!state.data) return Promise.resolve();
    var changed = 0;
    // Flip one incomplete sample that is not the overdue showcase (index 0).
    var flipped = false;
    state.data.items.forEach(function (item, index) {
      if (flipped || index === 0) return;
      if (item.state === "incomplete" && item.due) {
        var dueTs = new Date(item.due).getTime();
        if (dueTs > Date.now()) {
          item.state = "complete";
          changed += 1;
          flipped = true;
        }
      }
    });
    state.data.statusSyncedAt = Date.now();
    els.cacheNote.textContent =
      "Refreshed · " +
      changed +
      " item(s) changed locally (demo)";
    renderTable();
    return Promise.resolve();
  }

  function loadStatus(silent) {
    if (state.loading) return Promise.resolve();
    if (!state.data) {
      if (!silent) {
        showBanner(
          "View checklists first. Refresh then checks the work already here.",
          "info",
          { dismissible: true }
        );
      }
      return Promise.resolve();
    }
    state.loading = true;
    syncActionButtons();
    hideStatusRefreshBanner();
    if (!silent) clearNonPrivacyBanner();

    var finish = function () {
      state.loading = false;
      state.scanAbort = null;
      hideScanProgress();
      syncActionButtons();
      updateStatusNudge();
      flushScheduledBoardRefreshes();
    };

    if (state.demo) {
      if (!silent) {
        els.subtitle.textContent = "Refreshing current work…";
      }
      if (state.scanAbort) {
        try {
          state.scanAbort.abort();
        } catch (e) {
          // ignore
        }
      }
      state.scanAbort =
        typeof AbortController !== "undefined" ? new AbortController() : null;
      setScanProgress(0, 1, "Updating…", "update");
      return demoDelay(280)
        .then(function () {
          setScanProgress(1, 1, "Done", "update");
          return loadDemoStatus();
        })
        .then(function () {
          if (!silent) {
            els.subtitle.textContent = "Demo user · Alex Rivera";
            showBanner(null);
          }
        })
        .catch(function (err) {
          if (err && err.name === "AbortError") {
            showBanner("Update cancelled.", "info", { dismissible: true });
            els.subtitle.textContent = "Demo user · Alex Rivera";
            return;
          }
          throw err;
        })
        .finally(finish);
    }

    if (state.scanAbort) {
      try {
        state.scanAbort.abort();
      } catch (e) {
        // ignore
      }
    }
    state.scanAbort =
      typeof AbortController !== "undefined" ? new AbortController() : null;

    return ensureAuthorized()
      .then(function (token) {
        if (!token) return null;
        state.token = token;
        if (!silent) {
          els.subtitle.textContent = "Refreshing current work…";
          setScanProgress(0, 1, "Starting…", "update");
        }
        return api.refreshKnownStatus(state.token, state.data, {
          onlyIncomplete: true,
          signal: state.scanAbort ? state.scanAbort.signal : null,
          onProgress: function (done, total, label) {
            if (!silent) {
              els.subtitle.textContent =
                (label || "Updating") + " " + done + "/" + total;
              setScanProgress(done, total, label || "", "update");
            }
          },
        });
      })
      .then(function (result) {
        if (!result) return;
        var meta = result.meta || {};
        var note = "Refreshed";
        if (meta.updated != null) {
          note =
            "Refreshed · checked " +
            (meta.checked || 0) +
            " · changed " +
            (meta.updated || 0) +
            (meta.added ? " · +" + meta.added : "") +
            (meta.removed ? " · −" + meta.removed : "") +
            (meta.skipped ? " · skipped " + meta.skipped : "");
        }

        applyDataset(result.data, {
          keepSubtitle: silent,
          cacheNote: note,
          skipMetaAppend: true,
        });

        if (!silent) {
          showBanner(null);
        }
      })
      .catch(function (err) {
        if (err && err.name === "AbortError") {
          if (!silent) {
            showBanner("Update cancelled.", "info", { dismissible: true });
            els.subtitle.textContent =
              "Signed in as " +
              ((state.data.me &&
                (state.data.me.fullName || state.data.me.username)) ||
                "member");
          }
          return;
        }
        if (handleAuthorizationError(err)) return;
        if (!silent) {
          showErrorBanner(err, "Refresh current work");
          els.subtitle.textContent = "Refresh failed";
        }
      })
      .finally(finish);
  }

  function loadMissingBoards(boardIds) {
    var missing =
      Array.isArray(boardIds) && boardIds.length
        ? boardIds.slice()
        : boardsMissingFromScan();
    if (!state.data || !missing.length) return Promise.resolve();
    if (state.demo) {
      return runScan({ skipConfirm: true, forceFull: true });
    }
    if (state.loading) return Promise.resolve();

    state.loading = true;
    syncActionButtons();
    clearNonPrivacyBanner();
    state.scanAbort =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    var loadAbort = state.scanAbort;
    setScanProgress(0, missing.length, "Selected boards");
    els.subtitle.textContent = "Adding selected boards…";

    var finish = function () {
      if (state.scanAbort !== loadAbort) return;
      state.loading = false;
      state.scanAbort = null;
      hideScanProgress();
      syncActionButtons();
      updateScanNudge();
      flushScheduledBoardRefreshes();
    };

    return ensureAuthorized()
      .then(function (token) {
        if (!token) return null;
        state.token = token;
        return api.loadAdditionalBoards(
          token,
          state.data,
          missing,
          {
            signal: loadAbort ? loadAbort.signal : null,
            onProgress: function (done, total, boardName) {
              els.subtitle.textContent =
                "Adding boards " + done + "/" + total + " · " + boardName;
              setScanProgress(done, total, boardName);
            },
            onBoardReady: function (slice, info) {
              ingestProgressiveBoard(slice, info);
            },
          }
        );
      })
      .then(function (result) {
        if (!result) return;
        if (result.data) delete result.data._progressiveScan;
        applyDataset(result.data, {
          cacheNote:
            "Added " +
            missing.length +
            " board" +
            (missing.length === 1 ? "" : "s"),
        });
        state.allowlistRescanNeeded = false;
        showBanner(
          missing.length === 1
            ? "Selected board added."
            : "Selected boards added.",
          "info",
          { dismissible: true }
        );
      })
      .catch(function (err) {
        if (err && err.name === "AbortError") {
          showBanner("Refresh cancelled.", "info", { dismissible: true });
          return;
        }
        if (handleAuthorizationError(err)) return;
        showErrorBanner(err, "Add selected boards");
      })
      .finally(finish);
  }

  /**
   * Reload one board's checklist work (typically one nested /boards/{id} call).
   * Used by the per-row sync control and debounced Open→refresh.
   */
  function openBoardRefreshDelayMs() {
    var raw = config && config.openBoardRefreshMs;
    if (raw === 0 || raw === "0") return 0;
    var ms = Number(raw);
    if (!isFinite(ms) || ms < 0) return 45 * 1000;
    return ms;
  }

  function getPendingBoardRefresh(boardId) {
    var id = boardId && String(boardId);
    if (!id) return null;
    return state.pendingBoardRefreshes[id] || null;
  }

  function formatQueueCountdown(dueAt) {
    var ms = Math.max(0, Number(dueAt) - Date.now());
    var s = Math.ceil(ms / 1000);
    if (s >= 60) {
      var m = Math.floor(s / 60);
      var r = s % 60;
      return m + ":" + (r < 10 ? "0" : "") + r;
    }
    return s + "s";
  }

  function updateQueuedRefreshIndicators() {
    var pending = state.pendingBoardRefreshes || {};
    var anyTimer = Object.keys(pending).some(function (id) {
      var entry = pending[id];
      return Boolean(entry && entry.timerId && entry.dueAt);
    });
    if (!anyTimer) {
      stopPendingRefreshTicker();
      return;
    }
    var nodes = document.querySelectorAll(
      ".link-refresh-queued[data-queued-board]"
    );
    Array.prototype.forEach.call(nodes, function (node) {
      var id = node.getAttribute("data-queued-board");
      var entry = getPendingBoardRefresh(id);
      if (!entry || !entry.dueAt || !entry.timerId) return;
      if (node.classList.contains("is-soon")) return;
      node.textContent = formatQueueCountdown(entry.dueAt);
    });
  }

  function stopPendingRefreshTicker() {
    if (state.pendingRefreshTicker) {
      clearInterval(state.pendingRefreshTicker);
      state.pendingRefreshTicker = null;
    }
  }

  function ensurePendingRefreshTicker() {
    if (state.pendingRefreshTicker) return;
    state.pendingRefreshTicker = setInterval(updateQueuedRefreshIndicators, 1000);
  }

  function clearPendingBoardRefresh(boardId) {
    var id = boardId && String(boardId);
    if (!id || !state.pendingBoardRefreshes) return;
    var entry = state.pendingBoardRefreshes[id];
    if (entry && entry.timerId) {
      clearTimeout(entry.timerId);
    }
    delete state.pendingBoardRefreshes[id];
  }

  function clearAllPendingBoardRefreshes() {
    Object.keys(state.pendingBoardRefreshes || {}).forEach(function (id) {
      clearPendingBoardRefresh(id);
    });
    state.pendingBoardRefreshes = {};
    stopPendingRefreshTicker();
  }

  /**
   * After Open card: wait openBoardRefreshMs, then refresh that board.
   * Re-open of the same board cancels the prior timer and starts a new one.
   */
  function scheduleBoardRefreshAfterOpen(boardId, boardName) {
    var delay = openBoardRefreshDelayMs();
    var id = boardId && String(boardId);
    if (!delay || !id || !state.data || state.demo) return;

    var prev = state.pendingBoardRefreshes[id];
    if (prev && prev.timerId) clearTimeout(prev.timerId);

    var label = boardName || (prev && prev.boardName) || "board";
    var dueAt = Date.now() + delay;
    var timerId = setTimeout(function () {
      var entry = state.pendingBoardRefreshes[id];
      delete state.pendingBoardRefreshes[id];
      runScheduledBoardRefresh(id, (entry && entry.boardName) || label);
      renderTable();
    }, delay);

    state.pendingBoardRefreshes[id] = {
      timerId: timerId,
      boardName: label,
      followUp: false,
      dueAt: dueAt,
    };
    ensurePendingRefreshTicker();
    renderTable();
  }

  function runScheduledBoardRefresh(boardId, boardName) {
    var id = boardId && String(boardId);
    if (!id || !state.data) return;
    // Hub busy: keep a single follow-up; do not start overlapping loads.
    if (state.loading || state.refreshingBoardId) {
      markBoardRefreshFollowUp(id, boardName);
      return;
    }
    refreshOneBoard(id, boardName, { quiet: true });
  }

  /** Queue a follow-up without cancelling an active debounce timer. */
  function markBoardRefreshFollowUp(boardId, boardName) {
    var id = boardId && String(boardId);
    if (!id) return;
    var existing = state.pendingBoardRefreshes[id];
    if (existing && existing.timerId) {
      // Latest Open timer still owns this board; when it fires it will retry.
      existing.boardName = boardName || existing.boardName || "board";
      return;
    }
    var changed =
      !existing ||
      !existing.followUp ||
      existing.boardName !==
        (boardName || (existing && existing.boardName) || "board");
    state.pendingBoardRefreshes[id] = {
      timerId: null,
      boardName: boardName || (existing && existing.boardName) || "board",
      followUp: true,
      dueAt: null,
    };
    if (changed) renderTable();
  }

  function flushScheduledBoardRefreshes() {
    if (state.loading || state.refreshingBoardId || !state.data) return;
    var ids = Object.keys(state.pendingBoardRefreshes || {});
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      var entry = state.pendingBoardRefreshes[id];
      if (entry && entry.followUp && !entry.timerId) {
        delete state.pendingBoardRefreshes[id];
        refreshOneBoard(id, entry.boardName, { quiet: true });
        return;
      }
    }
  }

  function refreshOneBoard(boardId, boardName, options) {
    var opts = options || {};
    var id = boardId && String(boardId);
    if (!id || !state.data) return Promise.resolve();
    if (state.loading || state.refreshingBoardId) {
      if (opts.quiet) markBoardRefreshFollowUp(id, boardName);
      return Promise.resolve();
    }

    clearPendingBoardRefresh(id);

    if (state.demo) {
      if (!opts.quiet) {
        showBanner(
          "Demo mode — board refresh is simulated.",
          "info",
          { dismissible: true }
        );
      }
      return Promise.resolve();
    }

    state.loading = true;
    state.refreshingBoardId = id;
    syncActionButtons();
    renderTable();
    if (!opts.quiet) clearNonPrivacyBanner();
    state.scanAbort =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    var loadAbort = state.scanAbort;
    var label = boardName || "board";
    els.subtitle.textContent = "Refreshing " + label + "…";
    setScanProgress(0, 1, label);

    var finish = function () {
      // Always release this board refresh, even if a newer scan replaced scanAbort.
      if (state.refreshingBoardId === id) {
        state.refreshingBoardId = null;
        state.loading = false;
        hideScanProgress();
        syncActionButtons();
        updateScanNudge();
        renderTable();
      }
      if (state.scanAbort === loadAbort) {
        state.scanAbort = null;
      }
      flushScheduledBoardRefreshes();
    };

    return ensureAuthorized()
      .then(function (token) {
        if (!token) return null;
        state.token = token;
        return api.loadAdditionalBoards(token, state.data, [id], {
          signal: loadAbort ? loadAbort.signal : null,
          onProgress: function (done, total, name) {
            if (state.refreshingBoardId !== id) return;
            els.subtitle.textContent =
              "Refreshing " + (name || label) + "…";
            setScanProgress(done, total, name || label);
          },
          onBoardReady: function (slice, info) {
            if (state.refreshingBoardId !== id) return;
            ingestProgressiveBoard(slice, info);
          },
        });
      })
      .then(function (result) {
        if (!result) return;
        // Stale response after a newer full scan took over — ignore.
        if (state.refreshingBoardId !== id) return;
        if (result.data) delete result.data._progressiveScan;
        applyDataset(result.data, {
          cacheNote: "Refreshed · " + label,
        });
        if (!opts.quiet) {
          showBanner("Refreshed " + label + ".", "info", {
            dismissible: true,
          });
        }
      })
      .catch(function (err) {
        if (err && err.name === "AbortError") {
          if (!opts.quiet && state.refreshingBoardId === id) {
            showBanner("Refresh cancelled.", "info", { dismissible: true });
          }
          return;
        }
        if (handleAuthorizationError(err)) return;
        if (state.refreshingBoardId === id) {
          showErrorBanner(err, "Refresh board");
        }
      })
      .finally(finish);
  }

  function loadDemoData(forceRefresh) {
    setUiAuthorized(true);
    state.token = "demo-token";
    els.subtitle.textContent = forceRefresh
      ? "Reloading demo data…"
      : "Loading demo data…";
    showBanner(
      "Demo mode — sample data only. Read-only hub: open cards in Trello to complete work.",
      "info"
    );
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          if (
            state.scanAbort &&
            state.scanAbort.signal &&
            state.scanAbort.signal.aborted
          ) {
            var err = new Error("Cancelled.");
            err.name = "AbortError";
            reject(err);
            return;
          }
          var dataset = window.ChecklistHubMock.buildDataset();
          var selected = getAllowlistBoardIds();
          var selectedSet = {};
          selected.forEach(function (id) {
            selectedSet[id] = true;
          });
          if (selected.length) {
            dataset.boards = (dataset.boards || []).filter(function (b) {
              return selectedSet[b.id];
            });
            dataset.scannedBoardIds = selected.slice();
            dataset.items = (dataset.items || []).filter(function (item) {
              return selectedSet[item.boardId];
            });
            dataset.memberCards = (dataset.memberCards || []).filter(
              function (card) {
                return selectedSet[card.boardId];
              }
            );
          }
          applyDataset(dataset, {
            subtitle: "Demo user · Alex Rivera",
            cacheNote:
              "Local mock dataset · boards are member-accessible only · open cards in Trello to complete",
          });
          state.boardsReady = true;
          state.allowlistRescanNeeded = false;
          resolve();
        } catch (e) {
          reject(e);
        }
      }, forceRefresh ? 180 : 60);
    });
  }

  function ingestProgressiveBoard(slice, info) {
    if (!slice) return;
    var done = (info && info.done) || 0;
    var total = (info && info.total) || 0;
    var boardName = (info && info.boardName) || "board";
    var note =
      total > 0
        ? "Loading " + done + "/" + total + " · " + boardName
        : "Loading · " + boardName;

    if (!state.data) {
      var seed = {
        fetchedAt: Date.now(),
        me: slice.me || (state.boardCatalog && state.boardCatalog.me) || null,
        boards:
          slice.boards ||
          (state.boardCatalog && state.boardCatalog.boards) ||
          [],
        scannedBoardIds: (slice.scannedBoardIds || []).slice(),
        members: (slice.members || []).slice(),
        labels: (slice.labels || []).slice(),
        lists: (slice.lists || []).slice(),
        items: (slice.items || []).slice(),
        memberCards: (slice.memberCards || []).slice(),
        meta: { progressive: true },
        _progressiveScan: true,
      };
      applyDataset(seed, {
        progressive: true,
        cacheNote: note,
        keepSubtitle: true,
        skipLastScanned: true,
      });
      return;
    }

    state.data._progressiveScan = true;
    if (api && typeof api.mergeBoardSlice === "function") {
      api.mergeBoardSlice(state.data, slice);
    }
    if (api && typeof api.withRemindersExpanded === "function") {
      api.withRemindersExpanded(state.data);
    }
    applyDataset(state.data, {
      progressive: true,
      cacheNote: note,
      keepSubtitle: true,
      skipLastScanned: true,
    });
  }

  function loadData(forceRefresh) {
    var blocker = getLoadChecklistsBlocker();
    // beginScan already checks; guard any other callers.
    if (blocker && !state.loading) {
      warnLoadBlocked(blocker);
      return Promise.resolve();
    }
    if (state.loading) return Promise.resolve();
    state.loading = true;
    syncActionButtons();
    updateScanNudge();
    if (
      els.banner &&
      els.banner.getAttribute("data-banner-kind") === "load-blocked"
    ) {
      showBanner(null);
    } else if (!state.demo) {
      clearNonPrivacyBanner();
    }

    var loadAbort = state.scanAbort;
    if (!loadAbort && typeof AbortController !== "undefined") {
      loadAbort = new AbortController();
      state.scanAbort = loadAbort;
    }

    // Clear prior checklist rows so progressive boards fill an empty list.
    if (state.data) {
      state.data.items = [];
      state.data.memberCards = [];
      state.data.scannedBoardIds = [];
      state.data._progressiveScan = true;
      clearListOrderMemory();
      try {
        renderTable();
      } catch (e) {
        // ignore
      }
    }

    var finish = function () {
      if (state.scanAbort !== loadAbort) return;
      state.loading = false;
      state.scanAbort = null;
      hideScanProgress();
      syncActionButtons();
      updateScanNudge();
      flushScheduledBoardRefreshes();
    };

    if (state.demo) {
      setScanProgress(0, 1, "Demo", "scan");
      return loadDemoData(forceRefresh)
        .then(function () {
          setScanProgress(1, 1, "Done", "scan");
        })
        .catch(function (err) {
          if (err && err.name === "AbortError") {
            showBanner("Cancelled.", "info", { dismissible: true });
            els.subtitle.textContent = state.data
              ? "Demo user · Alex Rivera"
              : "Authorized · select boards, then view checklists";
            return;
          }
          throw err;
        })
        .finally(finish);
    }

    return ensureAuthorized()
      .then(function (token) {
        if (!token) return null;
        state.token = token;

        if (!isApiKeyConfigured()) {
          throw new Error(
            "Set your Power-Up API key in public/config.js before using Checklist Hub. Or open dashboard.html?demo=1 for a local preview."
          );
        }

        els.subtitle.textContent = "Loading checklists…";
        setScanProgress(0, 1, "Starting…");

        return api.getChecklistData(state.token, {
          forceRefresh: true,
          boardIds: getAllowlistBoardIds(),
          me:
            (state.boardCatalog && state.boardCatalog.me) ||
            state.catalogMe ||
            null,
          allBoards:
            (state.boardCatalog && state.boardCatalog.boards) || null,
          signal: state.scanAbort ? state.scanAbort.signal : null,
          onProgress: function (done, total, boardName) {
            els.subtitle.textContent =
              "Loading checklists " + done + "/" + total + " · " + boardName;
            setScanProgress(done, total, boardName);
          },
          onBoardReady: function (slice, info) {
            ingestProgressiveBoard(slice, info);
          },
        });
      })
      .then(function (result) {
        if (!result) return;
        var scanned = result.data.scannedBoardIds
          ? result.data.scannedBoardIds.length
          : result.data.boards.length;
        var failed =
          (result.data.meta &&
            result.data.meta.boardErrors &&
            result.data.meta.boardErrors.length) ||
          0;
        if (result.data) delete result.data._progressiveScan;
        applyDataset(result.data, {
          cacheNote:
            "Loaded from " +
            scanned +
            " board" +
            (scanned === 1 ? "" : "s") +
            (failed ? " · " + failed + " with issues" : ""),
        });
        state.boardsReady = true;
        state.allowlistRescanNeeded = false;
        if (
          els.banner &&
          !els.banner.hidden &&
          (els.banner.getAttribute("data-banner-kind") === "allowlist-rescan" ||
            els.banner.getAttribute("data-banner-kind") === "board-pick")
        ) {
          showBanner(null);
        }
        updateScanNudge();
        syncWelcomeTeamsUi();
      })
      .catch(function (err) {
        if (err && err.name === "AbortError") {
          showBanner("Cancelled.", "info", { dismissible: true });
          els.subtitle.textContent = state.data
            ? "Signed in as " +
              ((state.data.me &&
                (state.data.me.fullName || state.data.me.username)) ||
                "member")
            : "Authorized · select boards, then view checklists";
          return;
        }
        if (handleAuthorizationError(err)) return;
        showErrorBanner(err, "Refresh selected boards");
        els.subtitle.textContent = "Something went wrong";
      })
      .finally(finish);
  }

  function noOtherModalOpen() {
    return (
      (!els.welcomeModal || els.welcomeModal.hidden) &&
      (!els.scanConfirmModal || els.scanConfirmModal.hidden) &&
      (!els.loadBlockedModal || els.loadBlockedModal.hidden) &&
      (!els.ganttChecklistModal || els.ganttChecklistModal.hidden) &&
      (!els.privacyModal || els.privacyModal.hidden) &&
      (!els.shortcutsModal || els.shortcutsModal.hidden) &&
      (!els.apiUsageModal || els.apiUsageModal.hidden) &&
      (!els.configPanel || els.configPanel.hidden)
    );
  }

  function populateTeamsSelect(teams) {
    if (!els.filterTeam) {
      populateWelcomeStarter();
      return;
    }
    var list = teams || [];
    var current =
      (els.filterTeam && els.filterTeam.value) ||
      state.selectedTeamId ||
      "";

    els.filterTeam.innerHTML = "";
    var none = document.createElement("option");
    none.value = "";
    none.textContent = "None";
    els.filterTeam.appendChild(none);
    list.forEach(function (team) {
      var opt = document.createElement("option");
      opt.value = team.id;
      opt.textContent = team.name;
      els.filterTeam.appendChild(opt);
    });
    if (current && list.some(function (t) { return t.id === current; })) {
      els.filterTeam.value = current;
    } else {
      els.filterTeam.value = "";
      state.selectedTeamId = "";
    }
    syncWelcomeTeamsUi();
  }

  function syncWelcomeTeamsUi() {
    var hasTeams = state.teams && state.teams.length > 0;
    var hasViews = prefsApi.loadViews().length > 0;
    var hasBoardCatalog = Boolean(
      (state.boardCatalog &&
        state.boardCatalog.boards &&
        state.boardCatalog.boards.length) ||
        state.boardsReady
    );
    var showStarter = hasTeams || hasViews || hasBoardCatalog;
    populateWelcomeStarter();
    if (els.welcomeStarterBlock) {
      els.welcomeStarterBlock.hidden = !showStarter;
    }
    if (els.welcomeLead) {
      if (state.demo && !state.boardsReady) {
        els.welcomeLead.textContent = showStarter
          ? "Listing boards… Pick a team or tick boards below when they appear."
          : "Listing sample boards… then select the boards you need.";
      } else if (state.demo) {
        els.welcomeLead.textContent = showStarter
          ? "Pick a team or tick boards below, then view checklists. Sample data only."
          : "Select boards under Filters, then view checklists. Sample data only.";
      } else if (!state.boardsReady) {
        if (showStarter) {
          els.welcomeLead.textContent =
            "Listing boards… Pick a team or tick boards below when they appear.";
        } else {
          els.welcomeLead.textContent =
            "Listing available boards… then select the boards you need.";
        }
      } else if (showStarter) {
        els.welcomeLead.textContent =
          "Pick a team, saved view, or tick boards below, then view checklists.";
      } else {
        els.welcomeLead.textContent =
          "Select boards under Filters, then view checklists.";
      }
    }
    if (els.welcomeScan) {
      // Avoid two primary buttons when Quick start already has one.
      els.welcomeScan.hidden = showStarter;
      var scanLabel = els.welcomeScan.querySelector(".btn-label");
      var scanIcon = els.welcomeScan.querySelector(".material-symbols-outlined");
      if (scanLabel) scanLabel.textContent = "View checklists";
      if (scanIcon) scanIcon.textContent = "radar";
      els.welcomeScan.title =
        "Collect checklist work from the selected boards";
    }
    updateWelcomeStarterLoadButton();
  }

  function findTeamById(id) {
    if (!id) return null;
    for (var i = 0; i < state.teams.length; i += 1) {
      if (state.teams[i].id === id) return state.teams[i];
    }
    return null;
  }

  function teamBlocksScan() {
    // Team with no default boards must not block manual Load boards.
    // Only the welcome "Load team checklists" shortcut needs team boards.
    var team = findTeamById(state.selectedTeamId);
    if (!team) return false;
    return !(team.boardIds && team.boardIds.length);
  }

  function setAssigneeSelectionForTeam(team) {
    var meId = viewerMemberId();
    (team.members || []).forEach(registerAssigneeMember);
    var values = [];
    (team.memberIds || []).forEach(function (id) {
      if (meId && id === meId) {
        if (values.indexOf("me") < 0) values.push("me");
      } else if (values.indexOf(id) < 0) {
        values.push(id);
      }
    });
    if (!values.length && meId) values = ["me"];
    state.preferredAssignees = values.slice();
    var me = (state.data && state.data.me) ||
      (state.demo
        ? { id: "member-me", fullName: "Alex Rivera" }
        : null);
    populateAssignees(
      (state.data && state.data.members) || team.members || [],
      me || { id: meId, fullName: "you" }
    );
    setCheckedValues(els.filterAssignee, values);
    state.preferredAssignees = getCheckedValues(els.filterAssignee);
    updateAssigneeSummary();
    updateAssigneeVisibilityBanner();
  }

  function applySelectedTeam(teamId) {
    state.selectedTeamId = teamId || "";
    if (!teamId) {
      updateAssigneeVisibilityBanner();
      if (state.data) renderTable();
      return Promise.resolve();
    }
    var team = findTeamById(teamId);
    if (!team) return Promise.resolve();

    setAssigneeSelectionForTeam(team);

    var resolveLinks = function () {
      if (state.demo) {
        team.boardIds = (team.demoBoardIds || []).slice();
        team.resolvedBoards = team.boardIds.map(function (id) {
          var board =
            ((state.data && state.data.boards) || []).find(function (b) {
              return b.id === id;
            }) || { id: id, name: id };
          return { id: board.id, name: board.name || id, shortLink: id };
        });
        return Promise.resolve(team.resolvedBoards);
      }
      if (!state.token || !team.boardShortLinks || !team.boardShortLinks.length) {
        team.boardIds = [];
        team.resolvedBoards = [];
        return Promise.resolve([]);
      }
      return api
        .resolveBoardShortLinks(state.token, team.boardShortLinks)
        .then(function (resolved) {
          team.resolvedBoards = resolved || [];
          team.boardIds = team.resolvedBoards.map(function (b) {
            return b.id;
          });
          return team.resolvedBoards;
        });
    };

    return resolveLinks()
      .then(function () {
        if (!team.boardIds || !team.boardIds.length) {
          showBanner(
            "Team “" +
              team.name +
              "” has no default boards. Select boards under Filters, then view checklists.",
            "info",
            { dismissible: true, bannerKind: "board-pick" }
          );
          setConfigOpen(true);
          // Keep any boards the user already ticked — do not clear them.
          updateAllowlistSummary();
          return;
        }
        applyAllowlistBoardIds(team.boardIds);
        if (state.data) renderTable();
      })
      .catch(function (err) {
        if (handleAuthorizationError(err)) return;
        showErrorBanner(err, "Resolve team boards");
      });
  }

  function loadTeamsFromContext() {
    if (state.demo) {
      var mock =
        window.ChecklistHubMock && window.ChecklistHubMock.getDemoTeams
          ? window.ChecklistHubMock.getDemoTeams()
          : [];
      state.teams = mock || [];
      state.teams.forEach(function (team) {
        (team.members || []).forEach(registerAssigneeMember);
      });
      populateTeamsSelect(state.teams);
      state.teamsContextNote = state.teams.length
        ? ""
        : "Demo teams unavailable.";
      return Promise.resolve();
    }

    var boardId = null;
    try {
      if (typeof t.getContext === "function") {
        var ctx = t.getContext();
        if (ctx && ctx.board) {
          boardId =
            typeof ctx.board === "string"
              ? ctx.board
              : ctx.board.id || null;
        }
      }
    } catch (e) {
      boardId = null;
    }

    if (!boardId) {
      state.teams = [];
      populateTeamsSelect([]);
      state.teamsContextNote =
        "Open from the Checklist Hub board to load teams.";
      return Promise.resolve();
    }

    return api
      .loadTeamConfig(state.token, boardId)
      .then(function (result) {
        state.teams = (result && result.teams) || [];
        ((result && result.members) || []).forEach(registerAssigneeMember);
        populateTeamsSelect(state.teams);
        state.teamsContextNote = state.teams.length
          ? ""
          : "No Checklist Hub Team checklists on this board.";
      })
      .catch(function (err) {
        state.teams = [];
        populateTeamsSelect([]);
        state.teamsContextNote = "Could not load teams from this board.";
        if (err && err.name === "AbortError") return;
        if (handleAuthorizationError(err)) return;
        showErrorBanner(err, "Load teams");
      });
  }

  function preprocessApiUsageLog() {
    var events =
      (api.getApiUsageEvents && api.getApiUsageEvents()) || [];
    var totalUnits = 0;
    var totalCalls = events.length;
    var buckets = {};
    events.forEach(function (row) {
      var at = Number(row.at) || 0;
      var units = Number(row.units) || 1;
      totalUnits += units;
      var bucket = Math.floor(at / 10000) * 10000;
      if (!buckets[bucket]) buckets[bucket] = { at: bucket, units: 0, calls: 0 };
      buckets[bucket].units += units;
      buckets[bucket].calls += 1;
    });
    var list = Object.keys(buckets)
      .map(function (key) {
        return buckets[key];
      })
      .sort(function (a, b) {
        return b.at - a.at;
      });
    var peak = 0;
    var ordered = events.slice().sort(function (a, b) {
      return Number(a.at) - Number(b.at);
    });
    var windowStart = 0;
    var rollingUnits = 0;
    ordered.forEach(function (event, index) {
      rollingUnits += Number(event.units) || 1;
      while (
        windowStart <= index &&
        Number(event.at) - Number(ordered[windowStart].at) >= 10000
      ) {
        rollingUnits -= Number(ordered[windowStart].units) || 1;
        windowStart += 1;
      }
      if (rollingUnits > peak) peak = rollingUnits;
    });
    return {
      totalUnits: totalUnits,
      totalCalls: totalCalls,
      peak: peak,
      buckets: list,
      keyLimit: 300,
      tokenLimit: 100,
      limit: 100,
    };
  }

  function renderApiUsageModal() {
    var stats = preprocessApiUsageLog();
    if (els.apiUsageSummary) {
      els.apiUsageSummary.innerHTML =
        "<p><strong>" +
        stats.totalCalls +
        "</strong> request" +
        (stats.totalCalls === 1 ? "" : "s") +
        " · <strong>" +
        stats.totalUnits +
        "</strong> request unit" +
        (stats.totalUnits === 1 ? "" : "s") +
        " · peak <strong>" +
        stats.peak +
        "</strong> / " +
        stats.tokenLimit +
        " token (and " +
        stats.keyLimit +
        " API key) per 10s</p>";
    }
    if (els.apiUsageBuckets) {
      if (!stats.buckets.length) {
        els.apiUsageBuckets.innerHTML =
          "<p class=\"field-hint\">No requests logged yet in this session.</p>";
      } else {
        var html =
          '<table class="api-usage-table"><thead><tr><th>10s window</th><th>Units</th><th>Calls</th></tr></thead><tbody>';
        stats.buckets.forEach(function (bucket) {
          var warn =
            bucket.units >= stats.tokenLimit
              ? " is-over"
              : bucket.units >= stats.tokenLimit * 0.8
                ? " is-warn"
                : "";
          var start = new Date(bucket.at);
          var end = new Date(bucket.at + 10000);
          html +=
            '<tr class="' +
            warn.trim() +
            '"><td>' +
            start.toLocaleTimeString() +
            " – " +
            end.toLocaleTimeString() +
            "</td><td>" +
            bucket.units +
            "</td><td>" +
            bucket.calls +
            "</td></tr>";
        });
        html += "</tbody></table>";
        els.apiUsageBuckets.innerHTML = html;
      }
    }
  }

  function openApiUsageModal() {
    if (!els.apiUsageModal) return;
    closeWelcomeModal();
    closeScanConfirm();
    closeLoadBlockedModal();
    closePrivacyModal();
    closeGanttChecklistModal();
    setConfigOpen(false);
    renderApiUsageModal();
    openModalShell(
      els.apiUsageModal,
      els.apiUsageModalClose ||
        els.apiUsageModal.querySelector(".welcome-dialog button")
    );
  }

  function closeApiUsageModal() {
    if (els.apiUsageModal) els.apiUsageModal.hidden = true;
    if (noOtherModalOpen()) {
      document.body.classList.remove("welcome-open");
      restoreModalFocus();
    }
  }

  function resolveGanttChecklistItems(checklist) {
    var fallback = (checklist && checklist.items) || [];
    if (!checklist || !state.data) return fallback.slice();
    var cardId =
      checklist.sample && checklist.sample.cardId
        ? checklist.sample.cardId
        : null;
    var checklistId = checklist.id || null;
    var checklistName = checklist.name || "";
    var found = [];
    (state.data.items || []).forEach(function (item) {
      if (!item || item.kind !== "checkitem") return;
      if (isReminderRow(item)) return;
      if (checklistId && item.checklistId === checklistId) {
        found.push(item);
        return;
      }
      if (
        !checklistId &&
        cardId &&
        item.cardId === cardId &&
        (item.checklistName || "") === checklistName
      ) {
        found.push(item);
      }
    });
    return found.length ? found : fallback.slice();
  }

  function openGanttChecklistModal(checklist) {
    if (!els.ganttChecklistModal || !checklist) return;
    closeWelcomeModal();
    closeScanConfirm();
    closeLoadBlockedModal();
    closePrivacyModal();
    closeApiUsageModal();
    setConfigOpen(false);

    var items = resolveGanttChecklistItems(checklist);
    items.sort(function (a, b) {
      var aDue = a.due ? new Date(a.due).getTime() : Infinity;
      var bDue = b.due ? new Date(b.due).getTime() : Infinity;
      if (aDue !== bDue) return aDue - bDue;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });

    var dated = 0;
    var undated = 0;
    var complete = 0;
    items.forEach(function (item) {
      if (item.due) dated += 1;
      else undated += 1;
      if (itemState(item) === "complete") complete += 1;
    });

    if (els.ganttChecklistModalTitle) {
      els.ganttChecklistModalTitle.textContent =
        checklist.name || "Checklist";
    }
    if (els.ganttChecklistModalMeta) {
      els.ganttChecklistModalMeta.textContent = [
        checklist.boardName,
        checklist.cardName,
        checklist.listName,
        items.length +
          " item" +
          (items.length === 1 ? "" : "s") +
          (dated ? " · " + dated + " dated" : "") +
          (undated ? " · " + undated + " undated" : "") +
          (complete ? " · " + complete + " complete" : ""),
      ]
        .filter(Boolean)
        .join(" · ");
    }
    if (els.ganttChecklistModalNote) {
      if (undated && dated) {
        els.ganttChecklistModalNote.hidden = false;
        els.ganttChecklistModalNote.textContent =
          "The timeline spans dated items only. Undated items are listed here.";
      } else if (undated && !dated) {
        els.ganttChecklistModalNote.hidden = false;
        els.ganttChecklistModalNote.textContent =
          "No due dates on this checklist — nothing to plot on the timeline.";
      } else {
        els.ganttChecklistModalNote.hidden = true;
        els.ganttChecklistModalNote.textContent = "";
      }
    }

    if (els.ganttChecklistOpenCard) {
      var url =
        checklist.cardUrl ||
        (checklist.sample && checklist.sample.cardUrl) ||
        "";
      var ganttBoardId =
        (checklist.sample && checklist.sample.boardId) ||
        (items[0] && items[0].boardId) ||
        "";
      var ganttBoardName =
        (checklist.sample && checklist.sample.boardName) ||
        (items[0] && items[0].boardName) ||
        "";
      if (url && applySafeHref(els.ganttChecklistOpenCard, url)) {
        els.ganttChecklistOpenCard.hidden = false;
        els.ganttChecklistOpenCard.setAttribute(
          "aria-label",
          "Open card " +
            (checklist.cardName || "") +
            " in Trello"
        );
        els.ganttChecklistOpenCard.onclick = function () {
          if (ganttBoardId) {
            scheduleBoardRefreshAfterOpen(ganttBoardId, ganttBoardName);
          }
        };
      } else {
        els.ganttChecklistOpenCard.hidden = true;
        els.ganttChecklistOpenCard.removeAttribute("href");
        els.ganttChecklistOpenCard.onclick = null;
      }
    }

    if (els.ganttChecklistModalList) {
      els.ganttChecklistModalList.innerHTML = "";
      if (!items.length) {
        var empty = document.createElement("li");
        empty.className = "gantt-checklist-modal-empty";
        empty.textContent = "No checklist items found.";
        els.ganttChecklistModalList.appendChild(empty);
      } else {
        items.forEach(function (item) {
          var rowState = itemState(item);
          var li = document.createElement("li");
          li.className =
            "gantt-checklist-modal-item" +
            (rowState === "complete" ? " is-complete" : "") +
            (item.due ? "" : " is-undated");

          var main = document.createElement("div");
          main.className = "gantt-checklist-modal-main";
          var name = document.createElement("span");
          name.className = "gantt-checklist-modal-name";
          appendItemTitle(name, item.name || "Untitled item", {
            allowLinks: true,
          });
          main.appendChild(name);

          var actions = document.createElement("div");
          actions.className = "gantt-checklist-modal-row-actions";

          var status = document.createElement("span");
          status.className =
            "gantt-checklist-modal-status" +
            (rowState === "complete" ? " is-complete" : "");
          status.textContent =
            rowState === "complete" ? "Complete" : "Incomplete";
          actions.appendChild(status);

          var itemUrl =
            item.cardUrl ||
            checklist.cardUrl ||
            (checklist.sample && checklist.sample.cardUrl) ||
            "";
          var openLink = document.createElement("a");
          openLink.className = "link-open gantt-checklist-modal-open";
          openLink.target = "_blank";
          openLink.rel = "noopener noreferrer";
          openLink.textContent = "Open";
          openLink.setAttribute(
            "aria-label",
            "Open card " +
              (item.cardName || checklist.cardName || item.name || "") +
              " in Trello"
          );
          if (applySafeHref(openLink, itemUrl)) {
            openLink.addEventListener("click", function () {
              scheduleBoardRefreshAfterOpen(
                item.boardId || ganttBoardId,
                item.boardName || ganttBoardName
              );
            });
            actions.appendChild(openLink);
          }
          main.appendChild(actions);
          li.appendChild(main);

          var meta = document.createElement("div");
          meta.className = "gantt-checklist-modal-item-meta";
          var dueSpan = document.createElement("span");
          dueSpan.className =
            "gantt-checklist-modal-due " +
            dueClass(item.due, rowState, item);
          dueSpan.textContent = formatDueRelative(
            item.due,
            rowState,
            item
          );
          dueSpan.title = item.due ? formatDue(item.due) : "No due date";
          meta.appendChild(dueSpan);
          if (item.assigneeName) {
            var who = document.createElement("span");
            who.textContent = item.assigneeName;
            meta.appendChild(who);
          }
          li.appendChild(meta);
          els.ganttChecklistModalList.appendChild(li);
        });
      }
    }

    openModalShell(
      els.ganttChecklistModal,
      (els.ganttChecklistOpenCard && !els.ganttChecklistOpenCard.hidden
        ? els.ganttChecklistOpenCard
        : null) ||
        els.ganttChecklistModalClose ||
        els.ganttChecklistModal.querySelector(".welcome-dialog button")
    );
  }

  function closeGanttChecklistModal() {
    if (els.ganttChecklistModal) els.ganttChecklistModal.hidden = true;
    if (noOtherModalOpen()) {
      document.body.classList.remove("welcome-open");
      restoreModalFocus();
    }
  }

  function bootstrapHub() {
    if (powerUpMissing) {
      if (els.subtitle) {
        els.subtitle.textContent = "Power-Up client failed to load";
      }
      if (els.authBtn) els.authBtn.hidden = true;
      showBanner(
        "Checklist Hub could not load Trello’s Power-Up client. Check your network or Content-Security-Policy, then reopen from the board. Demo mode is disabled inside Trello.",
        "error",
        { dismissible: false }
      );
      return Promise.resolve();
    }
    state.applyDefaultViewPending = true;
    if (state.demo) {
      setUiAuthorized(true);
      state.token = "demo-token";
      els.subtitle.textContent = "Demo user · Alex Rivera";
      showBanner(
        "Demo mode — sample data only. Read-only hub: open cards in Trello to complete work.",
        "info"
      );
      showIdleWorkspace();
      showWelcomeModal();
      return Promise.all([
        loadTeamsFromContext(),
        loadBoardList({ silent: true }),
      ]).then(function () {
        if (state.teamsContextNote && els.filterTeam) {
          els.filterTeam.title = state.teamsContextNote;
        }
      });
    }

    return ensureAuthorized()
      .then(function (token) {
        if (!token) return null;
        state.token = token;
        els.subtitle.textContent =
          "Authorized · Listing boards…";
        showIdleWorkspace();
        showWelcomeModal();
        return Promise.all([
          loadTeamsFromContext(),
          loadBoardList({ silent: true }),
        ]).then(function () {
          if (state.teamsContextNote && !state.data) {
            els.subtitle.textContent =
              "Authorized · " + state.teamsContextNote;
          }
        });
      });
  }

  els.refreshBtn.addEventListener("click", function () {
    // Always reload selected boards (cheaper than per-card refresh at scale).
    runScan({ skipConfirm: Boolean(state.data), forceFull: true });
  });

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) updateStatusNudge();
  });

  function authorizeHub() {
    if (state.demo) {
      setUiAuthorized(true);
      state.token = "demo-token";
      els.subtitle.textContent = "Demo user · Alex Rivera";
      showIdleWorkspace();
      showWelcomeModal(true);
      return Promise.resolve();
    }
    els.subtitle.textContent = "Waiting for Trello authorization…";
    return getRestApiClient()
      .then(function (rest) {
        return rest.authorize({
          scope: "read",
          expiration: oauthExpiration(),
          // Consent popup redirects here; must be authorize.html (not dashboard).
          return_url: oauthAuthReturnUrl(),
        });
      })
      .then(function () {
        return ensureAuthorized();
      })
      .then(function (token) {
        if (!token) return;
        state.token = token;
        return loadTeamsFromContext().then(function () {
          els.subtitle.textContent = state.teamsContextNote
            ? "Authorized · " + state.teamsContextNote
            : "Authorized · Listing boards…";
          showIdleWorkspace();
          showWelcomeModal(true);
          return loadBoardList({ silent: true });
        });
      })
      .catch(function (err) {
        if (
          window.TrelloPowerUp.restApiError &&
          err instanceof window.TrelloPowerUp.restApiError.AuthDeniedError
        ) {
          showBanner("Authorization cancelled.", "info", { dismissible: true });
          return;
        }
        showErrorBanner(err, "Authorize");
      });
  }

  els.authBtn.addEventListener("click", authorizeHub);
  if (els.authEmptyBtn) {
    els.authEmptyBtn.addEventListener("click", authorizeHub);
  }

  if (els.disconnectBtn) {
    els.disconnectBtn.addEventListener("click", function () {
      if (
        !window.confirm(
          "Disconnect Trello? You will need to authorize again before loading boards."
        )
      ) {
        return;
      }
      disconnectHub();
    });
  }

  if (els.filterDue) {
    els.filterDue.addEventListener("change", function () {
      renderTable();
    });
  }

  if (els.filterHideCompleted) {
    els.filterHideCompleted.addEventListener("change", function () {
      state.hideCompleted = !els.filterHideCompleted.checked;
      savePrefs({ hideCompleted: state.hideCompleted });
      renderTable();
    });
  }

  if (els.filterHideCards) {
    els.filterHideCards.addEventListener("change", function () {
      state.hideCards = !els.filterHideCards.checked;
      savePrefs({ hideCards: state.hideCards });
      renderTable();
    });
  }

  if (els.filterShowUnassigned) {
    els.filterShowUnassigned.addEventListener("change", function () {
      state.showUnassigned = Boolean(els.filterShowUnassigned.checked);
      savePrefs({ showUnassigned: state.showUnassigned });
      renderTable();
    });
  }

  if (els.filterWorkType) {
    els.filterWorkType.addEventListener("change", function () {
      state.workType = els.filterWorkType.value;
      savePrefs({ workType: state.workType });
      renderTable();
    });
  }

  if (els.filterReminders) {
    els.filterReminders.addEventListener("change", function () {
      state.showReminders = Boolean(els.filterReminders.checked);
      savePrefs({ showReminders: state.showReminders });
      renderTable();
    });
  }

  els.filterSearch.addEventListener("input", function () {
    if (state.searchTimer) clearTimeout(state.searchTimer);
    state.searchTimer = setTimeout(function () {
      state.searchTimer = null;
      renderTable();
    }, 200);
  });

  function applyUndatedQueue() {
    els.filterDue.value = "none";
    state.view = "list";
    savePrefs({ view: state.view });
    renderTable();
  }

  if (els.focusChips) {
    els.focusChips.addEventListener("click", function (event) {
      var chip = event.target.closest("[data-due-chip]");
      if (!chip) return;
      var key = chip.getAttribute("data-due-chip");
      if (!key) return;
      state.dueTouched = true;
      els.filterDue.value = key;
      renderTable();
    });
  }

  if (els.calendarUndatedBtn) {
    els.calendarUndatedBtn.addEventListener("click", function () {
      applyUndatedQueue();
    });
  }

  if (els.bannerDismiss) {
    els.bannerDismiss.addEventListener("click", function () {
      if (els.banner.className.indexOf("banner-error") >= 0) {
        showBanner(null);
        return;
      }
      var kind = els.banner.getAttribute("data-banner-kind");
      if (kind === "privacy") {
        savePrefs({ privacyBannerDismissed: true });
      }
      showBanner(null);
    });
  }

  if (els.bannerActionBtn) {
    els.bannerActionBtn.addEventListener("click", function () {
      var action = state.bannerAction;
      if (typeof action === "function") action();
    });
  }

  if (els.bannerCopy) {
    els.bannerCopy.addEventListener("click", function () {
      var text =
        (els.bannerTechnical && els.bannerTechnical.textContent) || "";
      if (!text) return;
      var done = function () {
        els.bannerCopy.textContent = "Copied";
        setTimeout(function () {
          els.bannerCopy.textContent = "Copy for admin";
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          window.prompt("Copy this error report:", text);
        });
      } else {
        window.prompt("Copy this error report:", text);
      }
    });
  }

  if (els.statusRefreshBtn) {
    els.statusRefreshBtn.addEventListener("click", function () {
      hideStatusRefreshBanner();
      runScan({ skipConfirm: true, forceFull: true });
    });
  }

  if (els.statusRefreshDismiss) {
    els.statusRefreshDismiss.addEventListener("click", function () {
      var ms = statusNudgeMs() || 2 * 60 * 1000;
      state.statusNudgeDismissedUntil = Date.now() + ms;
      hideStatusRefreshBanner();
    });
  }

  if (els.welcomeDismiss) {
    els.welcomeDismiss.addEventListener("click", function () {
      closeWelcomeModal({ persist: true, skipSession: true });
    });
  }

  if (els.welcomeScan) {
    els.welcomeScan.addEventListener("click", function () {
      if (els.filterTeam) els.filterTeam.value = "";
      state.selectedTeamId = "";
      clearWelcomeStarterExtras();
      if (els.welcomeStarter) els.welcomeStarter.value = "";
      updateWelcomeStarterLoadButton();
      closeWelcomeModal({ skipSession: true });
      if (!state.boardsReady) {
        loadBoardList();
        return;
      }
      runScan({ skipConfirm: !state.data, forceFull: true });
    });
  }

  if (els.welcomeStarter) {
    els.welcomeStarter.addEventListener("change", function () {
      var parsed = parseWelcomeStarter(els.welcomeStarter.value);
      updateWelcomeStarterLoadButton();
      if (parsed.kind === "none") {
        state.selectedTeamId = "";
        if (els.filterTeam) els.filterTeam.value = "";
        clearWelcomeStarterExtras();
        return;
      }
      if (parsed.kind === "team") {
        clearWelcomeStarterExtras();
        if (els.filterTeam) els.filterTeam.value = parsed.id;
        applySelectedTeam(parsed.id).then(function () {
          syncWelcomeBoardsFromFilters();
          updateWelcomeStarterLoadButton();
        });
        return;
      }
      if (parsed.kind === "view") {
        if (els.filterTeam) els.filterTeam.value = "";
        state.selectedTeamId = "";
        state.pendingViewId = parsed.id;
        state.applyDefaultViewPending = false;
        applyViewBoardPicks(findSavedView(parsed.id));
        syncWelcomeBoardsFromFilters();
        updateWelcomeStarterLoadButton();
      }
    });
  }

  if (els.welcomeBoardOptions) {
    els.welcomeBoardOptions.addEventListener("change", function (event) {
      if (!event.target || event.target.type !== "checkbox") return;
      // Manual board picks clear a team quick-start selection.
      if (els.welcomeStarter && els.welcomeStarter.value.indexOf("team:") === 0) {
        els.welcomeStarter.value = "";
        state.selectedTeamId = "";
        if (els.filterTeam) els.filterTeam.value = "";
        clearWelcomeStarterExtras();
      }
      applyWelcomeBoardSelection();
    });
  }

  if (els.welcomeBoardsAll) {
    els.welcomeBoardsAll.addEventListener("click", function () {
      if (!els.welcomeBoardOptions) return;
      els.welcomeBoardOptions
        .querySelectorAll('input[type="checkbox"]')
        .forEach(function (input) {
          input.checked = true;
        });
      if (els.welcomeStarter) els.welcomeStarter.value = "";
      state.selectedTeamId = "";
      if (els.filterTeam) els.filterTeam.value = "";
      clearWelcomeStarterExtras();
      applyWelcomeBoardSelection();
    });
  }

  if (els.welcomeBoardsClear) {
    els.welcomeBoardsClear.addEventListener("click", function () {
      if (!els.welcomeBoardOptions) return;
      els.welcomeBoardOptions
        .querySelectorAll('input[type="checkbox"]')
        .forEach(function (input) {
          input.checked = false;
        });
      applyWelcomeBoardSelection();
    });
  }

  if (els.welcomeStarterLoad) {
    els.welcomeStarterLoad.addEventListener("click", function () {
      var parsed = parseWelcomeStarter(
        els.welcomeStarter && els.welcomeStarter.value
      );
      if (parsed.kind === "none") {
        applyWelcomeBoardSelection();
        if (!getAllowlistBoardIds().length) {
          showBanner(
            "Tick at least one board below, or choose a team / saved view.",
            "warn",
            { dismissible: true, bannerKind: "load-blocked" }
          );
          return;
        }
        closeWelcomeModal({ skipSession: true });
        var goBoards = function () {
          runScan({ skipConfirm: !state.data, forceFull: true });
        };
        if (!state.boardsReady || boardListInFlight) {
          return loadBoardList({ silent: true }).then(goBoards);
        }
        goBoards();
        return;
      }

      if (parsed.kind === "team") {
        closeWelcomeModal({ skipSession: true });
        applySelectedTeam(parsed.id).then(function () {
          var team = findTeamById(parsed.id);
          if (team && team.boardIds && team.boardIds.length) {
            applyAllowlistBoardIds(team.boardIds);
          }
          if (teamBlocksScan() && !getAllowlistBoardIds().length) {
            warnLoadBlocked({
              title: "No boards for this team",
              message:
                "This team has no default boards. Select boards under Filters, then view checklists.",
              openFilters: true,
              modal: true,
            });
            return;
          }
          var goTeam = function () {
            if (team && team.boardIds && team.boardIds.length) {
              applyAllowlistBoardIds(team.boardIds);
            }
            runScan({ skipConfirm: true, forceFull: true });
          };
          if (!state.boardsReady || boardListInFlight) {
            return loadBoardList({ silent: true }).then(goTeam);
          }
          goTeam();
        });
        return;
      }

      if (parsed.kind === "view") {
        if (els.filterTeam) els.filterTeam.value = "";
        state.selectedTeamId = "";
        state.pendingViewId = parsed.id;
        state.applyDefaultViewPending = false;
        applyViewBoardPicks(findSavedView(parsed.id));
        closeWelcomeModal({ skipSession: true });
        var goView = function () {
          runScan({ skipConfirm: true, forceFull: true });
        };
        if (!state.boardsReady) {
          return loadBoardList({ silent: true }).then(function () {
            applyViewBoardPicks(findSavedView(parsed.id));
            goView();
          });
        }
        goView();
      }
    });
  }

  if (els.welcomeHelpBtn) {
    els.welcomeHelpBtn.addEventListener("click", function () {
      showWelcomeModal(true);
    });
  }

  if (els.scanNudge) {
    els.scanNudge.addEventListener("click", function () {
      if (boardsMissingFromScan().length) {
        loadMissingBoards();
        return;
      }
      runScan({ skipConfirm: true, forceFull: true });
    });
  }

  if (els.scanCancelBtn) {
    els.scanCancelBtn.addEventListener("click", function () {
      cancelScan();
    });
  }

  if (els.scanConfirmOk) {
    els.scanConfirmOk.addEventListener("click", function () {
      beginScan();
    });
  }

  if (els.scanConfirmCancel) {
    els.scanConfirmCancel.addEventListener("click", function () {
      closeScanConfirm();
    });
  }

  if (els.scanConfirmModal) {
    els.scanConfirmModal.addEventListener("click", function (event) {
      if (
        event.target &&
        event.target.hasAttribute("data-scan-confirm-close")
      ) {
        closeScanConfirm();
      }
    });
  }

  if (els.loadBlockedDismiss) {
    els.loadBlockedDismiss.addEventListener("click", function () {
      closeLoadBlockedModal();
    });
  }

  if (els.loadBlockedFilters) {
    els.loadBlockedFilters.addEventListener("click", function () {
      closeLoadBlockedModal();
      setConfigOpen(true);
    });
  }

  if (els.loadBlockedModal) {
    els.loadBlockedModal.addEventListener("click", function (event) {
      if (
        event.target &&
        event.target.hasAttribute("data-load-blocked-close")
      ) {
        closeLoadBlockedModal();
      }
    });
  }

  if (els.welcomeModal) {
    els.welcomeModal.addEventListener("click", function (event) {
      if (event.target && event.target.hasAttribute("data-welcome-close")) {
        closeWelcomeModal({ persist: true });
      }
    });
  }

  if (els.privacyOpenBtn) {
    els.privacyOpenBtn.addEventListener("click", function () {
      openPrivacyModal();
    });
  }

  if (els.privacyModalClose) {
    els.privacyModalClose.addEventListener("click", function () {
      closePrivacyModal();
    });
  }

  if (els.privacyModal) {
    els.privacyModal.addEventListener("click", function (event) {
      if (event.target && event.target.hasAttribute("data-privacy-close")) {
        closePrivacyModal();
      }
    });
  }

  if (els.shortcutsOpenBtn) {
    els.shortcutsOpenBtn.addEventListener("click", openShortcutsModal);
  }

  if (els.shortcutsModalClose) {
    els.shortcutsModalClose.addEventListener("click", closeShortcutsModal);
  }

  if (els.shortcutsModal) {
    els.shortcutsModal.addEventListener("click", function (event) {
      if (event.target && event.target.hasAttribute("data-shortcuts-close")) {
        closeShortcutsModal();
      }
    });
  }

  if (els.apiUsageOpenBtn) {
    els.apiUsageOpenBtn.addEventListener("click", function () {
      openApiUsageModal();
    });
  }

  if (els.apiUsageModalClose) {
    els.apiUsageModalClose.addEventListener("click", function () {
      closeApiUsageModal();
    });
  }

  if (els.apiUsageModal) {
    els.apiUsageModal.addEventListener("click", function (event) {
      if (event.target && event.target.hasAttribute("data-api-usage-close")) {
        closeApiUsageModal();
      }
    });
  }

  if (els.ganttChecklistModalClose) {
    els.ganttChecklistModalClose.addEventListener("click", function () {
      closeGanttChecklistModal();
    });
  }

  if (els.ganttChecklistModal) {
    els.ganttChecklistModal.addEventListener("click", function (event) {
      if (
        event.target &&
        event.target.hasAttribute("data-gantt-checklist-close")
      ) {
        closeGanttChecklistModal();
      }
    });
  }

  if (els.filterTeam) {
    els.filterTeam.addEventListener("change", function () {
      var teamId = els.filterTeam.value || "";
      if (teamId) {
        clearWelcomeStarterExtras();
        if (els.welcomeStarter) els.welcomeStarter.value = "team:" + teamId;
      } else if (els.welcomeStarter) {
        var parsed = parseWelcomeStarter(els.welcomeStarter.value);
        if (parsed.kind === "team") els.welcomeStarter.value = "";
      }
      updateWelcomeStarterLoadButton();
      applySelectedTeam(teamId);
    });
  }

  if (els.densityToggle) {
    els.densityToggle.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-density]");
      if (!btn) return;
      applyDensity(btn.getAttribute("data-density"));
      savePrefs({ density: state.density });
      if (state.data) renderTable();
    });
  }

  if (els.assigneeSearch) {
    els.assigneeSearch.addEventListener("input", function () {
      filterAssigneeOptions(els.assigneeSearch.value);
    });
    els.assigneeSearch.addEventListener("click", function (event) {
      event.stopPropagation();
    });
    els.assigneeSearch.addEventListener("keydown", function (event) {
      event.stopPropagation();
    });
  }

  if (els.boardSearch) {
    els.boardSearch.addEventListener("input", function () {
      filterMultiOptions(els.filterBoard, els.boardSearch.value);
    });
    els.boardSearch.addEventListener("click", function (event) {
      event.stopPropagation();
    });
    els.boardSearch.addEventListener("keydown", function (event) {
      event.stopPropagation();
    });
  }

  if (els.filterGroup) {
    els.filterGroup.addEventListener("change", function () {
      state.groupBy = els.filterGroup.value;
      // Fresh grouping → expand only the first group again.
      state.collapsedGroups = {};
      state.groupCollapseSeeded = false;
      resetGroupVisibleCounts();
      clearListOrderMemory();
      savePrefs({
        groupBy: state.groupBy,
        collapsedGroups: state.collapsedGroups,
      });
      renderTable();
    });
  }

  if (els.filterGroupPageSize) {
    els.filterGroupPageSize.addEventListener("change", function () {
      var next = Number(els.filterGroupPageSize.value);
      resetGroupVisibleCounts();
      savePrefs({ groupPageSize: next });
      if (els.filterGroupPageSize) {
        els.filterGroupPageSize.value = String(state.groupPageSize);
      }
      renderTable();
    });
  }

  if (els.configToggle) {
    els.configToggle.addEventListener("click", function () {
      setConfigOpen(!state.filtersOpen);
    });
  }

  if (els.configClose) {
    els.configClose.addEventListener("click", function () {
      setConfigOpen(false);
      if (els.configToggle) els.configToggle.focus();
    });
  }

  if (els.configDone) {
    els.configDone.addEventListener("click", function () {
      setConfigOpen(false);
      if (els.configToggle) els.configToggle.focus();
      maybeLoadBoardsAfterFilters();
    });
  }

  if (els.configBackdrop) {
    els.configBackdrop.addEventListener("click", function () {
      setConfigOpen(false);
      if (els.configToggle) els.configToggle.focus();
    });
  }

  if (els.themeToggle) {
    els.themeToggle.addEventListener("click", function () {
      applyTheme(state.theme === "dark" ? "light" : "dark");
      savePrefs({ theme: state.theme });
    });
  }

  if (els.themeToggleGroup) {
    els.themeToggleGroup.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-theme]");
      if (!btn) return;
      applyTheme(btn.getAttribute("data-theme"));
      savePrefs({ theme: state.theme });
    });
  }

  if (els.viewMenuBtn && els.viewMenu) {
    els.viewMenuBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      closeAllMultiSelects();
      var willOpen = els.viewMenu.hidden;
      closeViewMenu();
      if (willOpen) {
        els.viewMenu.hidden = false;
        els.viewMenuBtn.setAttribute("aria-expanded", "true");
        if (els.viewToggle) els.viewToggle.classList.add("is-open");
        var activeOption =
          els.viewMenu.querySelector('[aria-selected="true"]') ||
          els.viewMenu.querySelector("[data-view]");
        if (activeOption) activeOption.focus();
      }
    });
    els.viewMenu.addEventListener("click", function (event) {
      event.stopPropagation();
      var opt = event.target.closest("[data-view]");
      if (!opt) return;
      setView(opt.getAttribute("data-view"));
    });
    els.viewMenu.addEventListener("keydown", function (event) {
      var options = Array.prototype.slice.call(
        els.viewMenu.querySelectorAll("[data-view]")
      );
      var index = options.indexOf(document.activeElement);
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        var delta = event.key === "ArrowDown" ? 1 : -1;
        var next = index < 0 ? 0 : (index + delta + options.length) % options.length;
        options[next].focus();
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        options[event.key === "Home" ? 0 : options.length - 1].focus();
      } else if (event.key === "Enter" || event.key === " ") {
        var current = document.activeElement;
        if (current && current.hasAttribute("data-view")) {
          event.preventDefault();
          setView(current.getAttribute("data-view"));
          els.viewMenuBtn.focus();
        }
      }
    });
  }

  if (els.viewSelect) {
    els.viewSelect.addEventListener("change", function () {
      setView(els.viewSelect.value || "list");
    });
  }

  function findSavedView(id) {
    var views = prefsApi.loadViews();
    for (var vi = 0; vi < views.length; vi += 1) {
      if (views[vi].id === id) return views[vi];
    }
    return null;
  }

  if (els.saveViewBtn) {
    els.saveViewBtn.addEventListener("click", function () {
      var name =
        (els.savedViewName && els.savedViewName.value.trim()) ||
        "Untitled view";
      var existingId = els.savedViews && els.savedViews.value;
      var view = captureCurrentView(name, existingId || undefined);
      prefsApi.upsertView(view);
      populateSavedViews();
      els.savedViews.value = view.id;
      if (els.savedViewName) els.savedViewName.value = view.name;
      showBanner(
        existingId ? "Saved view updated." : "Saved view created.",
        "info",
        { dismissible: true }
      );
    });
  }

  if (els.renameViewBtn) {
    els.renameViewBtn.addEventListener("click", function () {
      var id = els.savedViews && els.savedViews.value;
      if (!id) {
        showBanner("Select a saved view to rename.", "info", {
          dismissible: true,
        });
        return;
      }
      var existing = findSavedView(id);
      if (!existing) return;
      var name =
        (els.savedViewName && els.savedViewName.value.trim()) || existing.name;
      existing.name = name;
      prefsApi.upsertView(existing);
      populateSavedViews();
      els.savedViews.value = id;
      if (els.savedViewName) els.savedViewName.value = name;
    });
  }

  if (els.deleteViewBtn) {
    els.deleteViewBtn.addEventListener("click", function () {
      var id = els.savedViews && els.savedViews.value;
      if (!id) {
        showBanner("Select a saved view to delete.", "info", {
          dismissible: true,
        });
        return;
      }
      var selectedView = findSavedView(id);
      if (
        !window.confirm(
          "Delete saved view “" +
            ((selectedView && selectedView.name) || "this view") +
            "”? This cannot be undone."
        )
      ) {
        return;
      }
      prefsApi.deleteView(id);
      if (prefsApi.loadPrefs().defaultViewId === id) {
        savePrefs({ defaultViewId: "" });
      }
      populateSavedViews();
      if (els.savedViewName) els.savedViewName.value = "";
      showBanner("Saved view deleted.", "info", { dismissible: true });
      renderTable();
    });
  }

  if (els.defaultViewBtn) {
    els.defaultViewBtn.addEventListener("click", function () {
      var id = els.savedViews && els.savedViews.value;
      if (!id) {
        showBanner(
          "Select a saved view first, then set it as default.",
          "info",
          { dismissible: true }
        );
        return;
      }
      savePrefs({ defaultViewId: id });
      populateSavedViews();
      els.savedViews.value = id;
      showBanner(
        "That view will apply after you view checklists next time.",
        "info",
        { dismissible: true }
      );
    });
  }

  if (els.savedViews) {
    els.savedViews.addEventListener("change", function () {
      var id = els.savedViews.value;
      if (!id) {
        if (els.savedViewName) els.savedViewName.value = "";
        return;
      }
      applySavedView(findSavedView(id));
    });
  }

  function csvEscape(value) {
    var text = value == null ? "" : String(value);
    if (/^[=+\-@]/.test(text)) {
      text = "'" + text;
    }
    if (/[",\n\r]/.test(text)) {
      return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
  }

  function exportFilteredCsv() {
    if (!state.data) return;
    var filterState = captureFilterState();
    var rows = collectRows()
      .filter(function (item) {
        return matchesFilters(item, filterState);
      })
      .filter(function (item) {
        return !isReminderRow(item);
      })
      .sort(compareItems);
    var header = [
      "Type",
      "Title",
      "Board",
      "List",
      "Card",
      "Assignee",
      "Due",
      "Status",
      "Labels",
      "Checklist",
      "URL",
    ];
    var lines = [header.join(",")];
    rows.forEach(function (item) {
      lines.push(
        [
          csvEscape(typeLabel(item)),
          csvEscape(item.name),
          csvEscape(item.boardName),
          csvEscape(item.listName || ""),
          csvEscape(item.cardName),
          csvEscape(item.assigneeName || ""),
          csvEscape(item.due || ""),
          csvEscape(itemState(item)),
          csvEscape(
            (item.labels || [])
              .map(function (l) {
                return l.name;
              })
              .join("; ")
          ),
          csvEscape(item.checklistName || ""),
          csvEscape(item.cardUrl || ""),
        ].join(",")
      );
    });
    var blob = new Blob([lines.join("\r\n")], {
      type: "text/csv;charset=utf-8",
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download =
      "checklist-hub-" +
      new Date().toISOString().slice(0, 10) +
      ".csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
    showBanner(
      "Exported " + rows.length + " row" + (rows.length === 1 ? "" : "s") + ".",
      "info",
      { dismissible: true }
    );
  }

  if (els.copyListBtn) {
    els.copyListBtn.addEventListener("click", copyVisibleList);
  }

  function shiftCalendar(delta) {
    if (state.calendarMode === "week") {
      state.calendarWeekStart = startOfWeek(
        addCalendarDays(state.calendarWeekStart || new Date(), delta * 7)
      );
    } else {
      state.calendarMonth = startOfMonth(
        new Date(
          state.calendarMonth.getFullYear(),
          state.calendarMonth.getMonth() + delta,
          1
        )
      );
    }
    state.expandedCalDay = null;
    if (state.view === "calendar") renderTable();
  }

  if (els.calPrev) {
    els.calPrev.addEventListener("click", function () {
      shiftCalendar(-1);
    });
  }
  if (els.calNext) {
    els.calNext.addEventListener("click", function () {
      shiftCalendar(1);
    });
  }
  if (els.calToday) {
    els.calToday.addEventListener("click", function () {
      var today = new Date();
      if (state.calendarMode === "week") {
        var nextWeek = startOfWeek(today);
        var weekChanged =
          !state.calendarWeekStart ||
          dateKey(state.calendarWeekStart) !== dateKey(nextWeek);
        state.calendarWeekStart = nextWeek;
        if (weekChanged) state.expandedCalDay = null;
      } else {
        var nextMonth = startOfMonth(today);
        var monthChanged =
          !state.calendarMonth ||
          state.calendarMonth.getFullYear() !== nextMonth.getFullYear() ||
          state.calendarMonth.getMonth() !== nextMonth.getMonth();
        state.calendarMonth = nextMonth;
        if (monthChanged) state.expandedCalDay = null;
      }
      if (state.view === "calendar") renderTable();
    });
  }
  if (els.calModeMonth) {
    els.calModeMonth.addEventListener("click", function () {
      setCalendarMode("month");
    });
  }
  if (els.calModeWeek) {
    els.calModeWeek.addEventListener("click", function () {
      setCalendarMode("week");
    });
  }

  wireMultiSelect(els.filterAssignee, {
    onChangeSummary: function () {
      state.preferredAssignees = getCheckedValues(els.filterAssignee);
      updateAssigneeSummary();
      updateAssigneeVisibilityBanner();
    },
  });
  wireMultiSelect(els.filterBoard, {
    onChange: function () {
      persistAllowlist();
      syncWelcomeBoardsFromFilters();
    },
    onChangeSummary: updateAllowlistSummary,
  });
  wireMultiSelect(els.filterLabel, {
    onChangeSummary: function () {
      updateMultiSummary(els.filterLabel, "All labels", "All labels");
    },
  });
  wireMultiSelect(els.filterList, {
    onChangeSummary: function () {
      updateMultiSummary(els.filterList, "All lists", "All lists");
    },
  });

  var refreshBoardListBtn = document.getElementById("refresh-board-list-btn");
  if (refreshBoardListBtn) {
    refreshBoardListBtn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      closeAllMultiSelects();
      loadBoardList({ silent: true, refreshOnly: true });
    });
  }

  if (els.exportBtn) {
    els.exportBtn.addEventListener("click", function () {
      exportFilteredCsv();
    });
  }

  document.addEventListener("click", function () {
    closeAllMultiSelects();
    closeViewMenu();
  });

  function isTypingTarget(target) {
    if (!target || !target.tagName) return false;
    var tag = target.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    return Boolean(target.isContentEditable);
  }

  function moveRowSelection(key) {
    var active = document.activeElement;
    if (
      key === "Enter" &&
      active &&
      active.closest &&
      active.closest("button, a, select, input, textarea")
    ) {
      return;
    }
    var rows = Array.prototype.slice.call(document.querySelectorAll(".hub-row"));
    if (!rows.length) return;
    var idx = -1;
    rows.forEach(function (row, i) {
      if (row.getAttribute("data-row-id") === state.selectedRowId) idx = i;
    });
    if (key === "Enter") {
      var item = (state.visibleItems || []).find(function (row) {
        return row.id === state.selectedRowId;
      });
      if (item && item.cardUrl) {
        openSafeCardUrl(item.cardUrl, item);
      }
      return;
    }
    if (idx < 0) idx = 0;
    else idx += key === "j" ? 1 : -1;
    if (idx < 0) idx = 0;
    if (idx >= rows.length) idx = rows.length - 1;
    state.selectedRowId = rows[idx].getAttribute("data-row-id");
    highlightSelectedRow();
    if (rows[idx].scrollIntoView) rows[idx].scrollIntoView({ block: "nearest" });
  }

  function focusSearchField() {
    if (!els.filterSearch) return;
    els.filterSearch.focus();
    els.filterSearch.select();
  }

  document.addEventListener("keydown", function (event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    var key = event.key;
    var typing = isTypingTarget(event.target);
    var modal = activeModal();

    if (modal && key === "Tab") {
      var dialog = modal.querySelector(".welcome-dialog") || modal;
      var focusables = getFocusableElements(dialog);
      if (focusables.length) {
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
          return;
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
          return;
        }
      }
    }

    if (key === "Escape") {
      if (els.shortcutsModal && !els.shortcutsModal.hidden) {
        closeShortcutsModal();
        event.preventDefault();
        return;
      }
      if (els.apiUsageModal && !els.apiUsageModal.hidden) {
        closeApiUsageModal();
        event.preventDefault();
        return;
      }
      if (els.privacyModal && !els.privacyModal.hidden) {
        closePrivacyModal();
        event.preventDefault();
        return;
      }
      if (els.ganttChecklistModal && !els.ganttChecklistModal.hidden) {
        closeGanttChecklistModal();
        event.preventDefault();
        return;
      }
      if (els.scanConfirmModal && !els.scanConfirmModal.hidden) {
        closeScanConfirm();
        event.preventDefault();
        return;
      }
      if (els.loadBlockedModal && !els.loadBlockedModal.hidden) {
        closeLoadBlockedModal();
        event.preventDefault();
        return;
      }
      if (els.welcomeModal && !els.welcomeModal.hidden) {
        closeWelcomeModal({ persist: true });
        event.preventDefault();
        return;
      }
      if (els.viewMenu && !els.viewMenu.hidden) {
        closeViewMenu();
        if (els.viewMenuBtn) els.viewMenuBtn.focus();
        event.preventDefault();
        return;
      }
      if (state.expandedCalDay) {
        state.focusCalDayAfterRender = state.expandedCalDay;
        state.expandedCalDay = null;
        renderTable();
        event.preventDefault();
        return;
      }
      if (document.querySelector(".multi-select.is-open")) {
        var openMulti = document.querySelector(".multi-select.is-open");
        var multiToggle =
          openMulti && openMulti.querySelector(".multi-select-toggle");
        closeAllMultiSelects();
        if (multiToggle) multiToggle.focus();
        event.preventDefault();
        return;
      }
      if (state.filtersOpen) {
        setConfigOpen(false);
        if (els.configToggle) els.configToggle.focus();
        event.preventDefault();
      }
      return;
    }

    if ((key === "f" || key === "F") && state.filtersOpen && !typing) {
      event.preventDefault();
      setConfigOpen(false);
      return;
    }

    if (modal || typing) return;
    if (!state.token || (els.workspace && els.workspace.hidden)) return;

    if (key === "/") {
      event.preventDefault();
      focusSearchField();
      return;
    }
    if (key === "?") {
      event.preventDefault();
      openShortcutsModal();
      return;
    }
    if (key === "f" || key === "F") {
      event.preventDefault();
      setConfigOpen(!state.filtersOpen);
      return;
    }
    if (key === "1") {
      event.preventDefault();
      setView("list");
      return;
    }
    if (key === "2") {
      event.preventDefault();
      setView("agenda");
      return;
    }
    if (key === "3") {
      event.preventDefault();
      setView("horizon");
      return;
    }
    if (key === "4") {
      event.preventDefault();
      setView("workload");
      return;
    }
    if (key === "5") {
      event.preventDefault();
      setView("progress");
      return;
    }
    if (key === "6") {
      event.preventDefault();
      setView("gantt");
      return;
    }
    if (key === "7") {
      event.preventDefault();
      setView("calendar");
      return;
    }
    if (key === "j" || key === "k" || key === "Enter") {
      moveRowSelection(key);
      event.preventDefault();
    }
  });

  function applyColumnSort(th) {
    var key = th.getAttribute("data-sort");
    if (!key) return;
    if (state.sortKey === key) {
      state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
    } else {
      state.sortKey = key;
      state.sortDir = "asc";
    }
    clearListOrderMemory();
    savePrefs({ sortKey: state.sortKey, sortDir: state.sortDir });
    syncSortHeaders();
    renderTable();
  }

  document.querySelectorAll("th.sortable").forEach(function (th) {
    th.addEventListener("click", function () {
      applyColumnSort(th);
    });
    th.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        applyColumnSort(th);
      }
    });
  });
  syncSortHeaders();
  updateFocusChips();

  populateSavedViews();

  // Fullscreen dashboard: sizeTo is a no-op and triggers host warnings.
  t.render(function () {});

  bootstrapHub();
})();
