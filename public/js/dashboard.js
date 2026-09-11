(function () {
  var config = window.CHECKLIST_HUB_CONFIG;
  var api = window.ChecklistHubApi;
  var prefsApi = window.ChecklistHubPrefs;
  var cookies = window.ChecklistHubCookies;
  var params = new URLSearchParams(window.location.search);
  var isDemo =
    params.get("demo") === "1" ||
    params.get("demo") === "true" ||
    config.forceDemo === true;

  cookies.purgeLegacyBrowserStorage();

  var els = {
    subtitle: document.getElementById("subtitle"),
    refreshBtn: document.getElementById("refresh-btn"),
    statusBtn: document.getElementById("status-btn"),
    syncActions: document.getElementById("sync-actions"),
    syncMenuBtn: document.getElementById("sync-menu-btn"),
    syncMenu: document.getElementById("sync-menu"),
    syncScanBtn: document.getElementById("sync-scan-btn"),
    authBtn: document.getElementById("auth-btn"),
    workspace: document.getElementById("workspace"),
    configPanel: document.getElementById("config-panel"),
    configToggle: document.getElementById("config-toggle"),
    configClose: document.getElementById("config-close"),
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
    filterHideCompleted: document.getElementById("filter-hide-completed"),
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
    densityToggle: document.getElementById("density-toggle"),
    welcomeModal: document.getElementById("welcome-modal"),
    welcomeDismiss: document.getElementById("welcome-dismiss"),
    welcomeScan: document.getElementById("welcome-scan"),
    welcomeStarterBlock: document.getElementById("welcome-starter-block"),
    welcomeStarter: document.getElementById("welcome-starter"),
    welcomeStarterLoad: document.getElementById("welcome-starter-load"),
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
    groupField: document.getElementById("group-field"),
    calendarWrap: document.getElementById("calendar-wrap"),
    calendarGrid: document.getElementById("calendar-grid"),
    calendarTitle: document.getElementById("cal-title"),
    calendarUndated: document.getElementById("calendar-undated"),
    calendarUndatedText: document.getElementById("calendar-undated-text"),
    calendarUndatedBtn: document.getElementById("calendar-undated-btn"),
    calPrev: document.getElementById("cal-prev"),
    calNext: document.getElementById("cal-next"),
    calToday: document.getElementById("cal-today"),
    assigneeSearch: document.getElementById("assignee-search"),
  };

  var prefs = prefsApi.loadPrefs();

  var state = {
    token: null,
    data: null,
    sortKey: prefs.sortKey || "due",
    sortDir: prefs.sortDir || "asc",
    groupBy: prefs.groupBy || "due",
    view: prefs.view || "list",
    workType: prefs.workType || "both",
    showReminders: Boolean(prefs.showReminders),
    hideCompleted: prefs.hideCompleted !== false,
    density: prefs.density === "compact" ? "compact" : "comfortable",
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
    expandedCalDay: null,
    focusCalDayAfterRender: null,
    collapsedGroups: prefs.collapsedGroups || {},
    loading: false,
    statusTimer: null,
    statusNudgeDismissedUntil: 0,
    filtersOpen: Boolean(prefs.filtersOpen),
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
    pendingViewId: "",
    teams: [],
    selectedTeamId: "",
    preferredAssignees: null,
    assigneeDirectory: {},
    teamsContextNote: "",
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
    els.filterHideCompleted.checked = state.hideCompleted;
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
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
    if (patch.density != null) state.density = next.density;
    if (patch.groupPageSize != null) state.groupPageSize = next.groupPageSize;
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
    isDemo || !window.TrelloPowerUp
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

  /**
   * Why Load boards cannot start right now (or null if it can).
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
        message: "Authorize with Trello before you Load boards.",
        openFilters: false,
      };
    }
    if (!state.demo && !isApiKeyConfigured()) {
      return {
        message:
          "API key is not set in config.js, so Load boards cannot talk to Trello.",
        openFilters: false,
      };
    }
    if (!state.boardsReady) {
      return {
        message:
          "Board names are still loading. Wait a moment, then tick boards under Filters → Boards and press Load boards.",
        openFilters: true,
      };
    }
    var boardOptionCount = els.filterBoard
      ? els.filterBoard.querySelectorAll('input[type="checkbox"]').length
      : 0;
    if (!boardOptionCount) {
      return {
        message:
          "No boards are available. Refresh the board list under Filters → Boards, then try again.",
        openFilters: true,
      };
    }
    if (!getAllowlistBoardIds().length) {
      return {
        message:
          "No boards selected — Load boards has nothing to pull. Tick at least one board under Filters → Boards, then try again.",
        openFilters: true,
      };
    }
    return null;
  }

  function warnLoadBlocked(blocker) {
    if (!blocker) return;
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

  function dueClass(due, stateValue) {
    if (!due || stateValue === "complete") return "";
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
  function remindersVisible() {
    if (!remindersEnabled()) return false;
    if (state.view === "calendar") return true;
    if (state.groupBy === "due") return true;
    if (state.groupBy === "none" && state.sortKey === "due") return true;
    var due = els.filterDue ? els.filterDue.value : "all";
    return due === "myday" || due === "today" || due === "tomorrow";
  }

  /** List reminders only land in Due today / Due tomorrow (not week/later). */
  function reminderAllowedInList(item) {
    if (!isReminderRow(item)) return true;
    if (state.view === "calendar") return true;
    var bucket = dueBucket(item).id;
    return bucket === "today" || bucket === "tomorrow";
  }

  function isReminderRow(item) {
    return Boolean(item && (item.kind === "reminder" || item.isReminder));
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

  function isViewerOnlyAssignees() {
    var people = selectedPeopleIds();
    var meId = viewerMemberId();
    return people.length === 1 && meId && people[0] === meId;
  }

  function updateAssigneeVisibilityBanner() {
    if (!state.data || !els.filterAssignee) return;
    var people = selectedPeopleIds();
    if (!people.length || isViewerOnlyAssignees()) {
      if (
        els.banner &&
        !els.banner.hidden &&
        els.banner.getAttribute("data-banner-kind") === "shared-boards"
      ) {
        showBanner(null);
      }
      return;
    }
    if (
      els.banner &&
      !els.banner.hidden &&
      (els.banner.getAttribute("data-banner-kind") === "privacy" ||
        els.banner.getAttribute("data-banner-kind") === "error")
    ) {
      return;
    }
    showBanner(
      "You only see tasks on boards you can access — typically boards shared with the people you selected.",
      "info",
      { dismissible: true, bannerKind: "shared-boards" }
    );
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
    updateMultiSummary(els.filterAssignee, "Anyone", "Anyone");
  }

  function filterAssigneeOptions(query) {
    if (!els.filterAssignee) return;
    var q = String(query || "").trim().toLowerCase();
    els.filterAssignee.querySelectorAll(".multi-option").forEach(function (row) {
      var label = (
        (row.querySelector("input") &&
          row.querySelector("input").getAttribute("data-label")) ||
        row.textContent ||
        ""
      ).toLowerCase();
      row.hidden = Boolean(q) && label.indexOf(q) === -1;
    });
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
    if (state.data) renderTable();
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
    var workType = state.workType;
    if (workType === "checkitem") return items.slice();
    if (workType === "card") return memberCards.slice();
    return items.concat(memberCards);
  }

  function matchesFilters(item) {
    if (isReminderRow(item)) {
      if (!remindersVisible()) return false;
      if (!reminderAllowedInList(item)) return false;
    }

    var people = selectedPeopleIds();
    var boards = getCheckedValues(els.filterBoard);
    var due = els.filterDue.value;
    var q = (els.filterSearch.value || "").trim().toLowerCase();
    var rowState = itemState(item);
    var boardOptionCount = els.filterBoard
      ? els.filterBoard.querySelectorAll('input[type="checkbox"]').length
      : 0;

    if (!people.length) {
      // Anyone: assigned work only — no org-wide unassigned dump.
      if (!item.idMember) return false;
    } else {
      var ok = false;
      if (item.idMember && people.indexOf(item.idMember) >= 0) ok = true;
      if (!item.idMember) {
        var cardMembers = item.idMembers || [];
        ok = people.some(function (id) {
          return cardMembers.indexOf(id) >= 0;
        });
      }
      if (!ok) return false;
    }

    // Ticked boards = visible. Empty selection = show nothing.
    if (boardOptionCount) {
      if (!boards.length) return false;
      if (boards.indexOf(item.boardId) === -1) return false;
    }

    if (state.hideCompleted && rowState !== "incomplete") return false;

    var labels = els.filterLabel ? getCheckedValues(els.filterLabel) : [];
    if (labels.length) {
      var itemLabelIds = (item.labels || []).map(function (l) {
        return l.id;
      });
      var labelHit = labels.some(function (id) {
        return itemLabelIds.indexOf(id) >= 0;
      });
      if (!labelHit) return false;
    }

    var lists = els.filterList ? getCheckedValues(els.filterList) : [];
    if (lists.length && lists.indexOf(item.listId) === -1) return false;

    // Calendar already lays work out by date; due chips/select would only hollow days.
    if (due !== "all" && state.view !== "calendar") {
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
      if (due === "overdue") {
        if (!dueTs || rowState === "complete" || dueTs >= now.getTime()) {
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
      if (due === "week") {
        // Match dueBucket("week"): after end of tomorrow through end of day +7.
        var tomorrowEnd = endOfDay(
          new Date(now.getTime() + 24 * 60 * 60 * 1000)
        ).getTime();
        var weekEnd = endOfDay(
          new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        ).getTime();
        if (
          !dueTs ||
          rowState === "complete" ||
          dueTs <= tomorrowEnd ||
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
        item.cardName,
        item.boardName,
        item.checklistName,
        item.assigneeName,
        item.listName,
        labelNames,
        item.kind === "card"
          ? "card member"
          : item.kind === "reminder"
            ? "reminder"
            : "checklist task",
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
          filterAssigneeOptions("");
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

  function compareItems(a, b) {
    var key = state.sortKey;
    var av = a[key];
    var bv = b[key];

    if (key === "due") {
      av = av ? new Date(av).getTime() : Number.POSITIVE_INFINITY;
      bv = bv ? new Date(bv).getTime() : Number.POSITIVE_INFINITY;
    } else if (key === "kind") {
      av = a.kind === "card" ? 1 : 0;
      bv = b.kind === "card" ? 1 : 0;
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
      return { id: "overdue", label: "Overdue", order: 0 };
    }
    if (ts <= endOfDay(now).getTime()) {
      return { id: "today", label: "Due today", order: 1 };
    }
    var tomorrowEnd = endOfDay(
      new Date(now.getTime() + 24 * 60 * 60 * 1000)
    ).getTime();
    if (ts <= tomorrowEnd) {
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
      var isCard = item.kind === "card";
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
    if (isReminderRow(item)) return "Reminder";
    return item.kind === "card" ? "Card" : "Task";
  }

  function boardHue(name) {
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

  function createItemRow(item) {
    var tr = document.createElement("tr");
    var rowState = itemState(item);
    if (rowState === "complete") tr.classList.add("is-complete");
    if (isReminderRow(item)) tr.classList.add("is-reminder");

    var typeTd = document.createElement("td");
    typeTd.className = "col-type";
    var pill = document.createElement("span");
    pill.className =
      "type-pill" +
      (item.kind === "card" ? " is-card" : "") +
      (isReminderRow(item) ? " is-reminder" : "");
    pill.textContent = typeLabel(item);
    typeTd.appendChild(pill);

    var nameTd = document.createElement("td");
    nameTd.className = "col-item";
    var nameWrap = document.createElement("div");
    nameWrap.className = "item-name";
    if (item.cardUrl) {
      var nameLink = document.createElement("a");
      nameLink.className = "item-name-link";
      nameLink.href = item.cardUrl;
      nameLink.target = "_blank";
      nameLink.rel = "noopener noreferrer";
      nameLink.textContent = item.name;
      nameWrap.appendChild(nameLink);
    } else {
      nameWrap.textContent = item.name;
    }
    var meta = document.createElement("div");
    meta.className = "item-meta";
    if (isReminderRow(item)) {
      meta.textContent =
        "Due " +
        (item.sourceDue ? formatDue(item.sourceDue) : formatDue(item.due));
    } else {
      meta.textContent = item.checklistName || "";
    }
    nameTd.appendChild(nameWrap);
    nameTd.appendChild(meta);
    var mobileBits = [];
    if (item.cardName) mobileBits.push(item.cardName);
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
    cardTd.textContent = item.cardName;

    var assigneeTd = document.createElement("td");
    assigneeTd.className = "col-assignee";
    assigneeTd.textContent = item.assigneeName || "—";

    var dueTd = document.createElement("td");
    dueTd.className = "col-due " + dueClass(item.due, rowState);
    dueTd.textContent = formatDue(item.due);

    var linkTd = document.createElement("td");
    linkTd.className = "col-link";
    if (item.cardUrl) {
      var a = document.createElement("a");
      a.href = item.cardUrl;
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
      linkTd.appendChild(a);
    } else {
      linkTd.textContent = "—";
    }

    tr.appendChild(typeTd);
    tr.appendChild(nameTd);
    tr.appendChild(boardTd);
    tr.appendChild(cardTd);
    tr.appendChild(assigneeTd);
    tr.appendChild(dueTd);
    tr.appendChild(linkTd);
    return tr;
  }

  function updateFocusChips() {
    if (!els.focusChips) return;
    var dueValue = els.filterDue.value;
    els.filterDue.value = "all";
    var pool = collectRows()
      .filter(matchesFilters)
      .filter(function (item) {
        return !isReminderRow(item);
      });
    els.filterDue.value = dueValue;

    var counts = { overdue: 0, today: 0, week: 0, myday: 0 };
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
    });

    els.focusChips.querySelectorAll("[data-due-chip]").forEach(function (chip) {
      var key = chip.getAttribute("data-due-chip");
      var active = els.filterDue.value === key;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", active ? "true" : "false");
      if (key === "all") {
        chip.textContent = "All dates";
      } else if (key === "none") {
        chip.textContent = "Undated queue";
      } else if (key === "myday") {
        chip.textContent = "My day (" + counts.myday + ")";
      } else if (key === "overdue") {
        chip.textContent = "Overdue (" + counts.overdue + ")";
      } else if (key === "today") {
        chip.textContent = "Today (" + counts.today + ")";
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
    table.innerHTML =
      '<caption class="sr-only">Tasks due ' +
      String(dayLabel || "").replace(/</g, "") +
      "</caption>" +
      "<thead><tr>" +
      '<th class="col-type" scope="col">Type</th>' +
      '<th class="col-item" scope="col">Title</th>' +
      '<th class="col-board" scope="col">Board</th>' +
      '<th class="col-card" scope="col">Card</th>' +
      '<th class="col-assignee" scope="col">Assignee</th>' +
      '<th class="col-due" scope="col">Due</th>' +
      '<th class="col-link" scope="col">Open</th>' +
      "</tr></thead>";
    var tbody = document.createElement("tbody");
    dayItems.sort(compareItems).forEach(function (item) {
      tbody.appendChild(createItemRow(item));
    });
    table.appendChild(tbody);
    scroll.appendChild(table);
    wrap.appendChild(scroll);
    return wrap;
  }

  function renderCalendar(filtered) {
    var month = state.calendarMonth;
    var year = month.getFullYear();
    var monthIndex = month.getMonth();
    els.calendarTitle.textContent = month.toLocaleString(undefined, {
      month: "long",
      year: "numeric",
    });

    var firstDay = new Date(year, monthIndex, 1);
    var startOffset = (firstDay.getDay() + 6) % 7;
    var daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    var todayKey = dateKey(new Date());
    var MAX_PREVIEW = state.density === "compact" ? 2 : 3;

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

    // Drop expansion if that day is no longer in this month view.
    if (state.expandedCalDay) {
      var expandedDate = new Date(state.expandedCalDay + "T12:00:00");
      if (
        expandedDate.getMonth() !== monthIndex ||
        expandedDate.getFullYear() !== year
      ) {
        state.expandedCalDay = null;
      }
    }

    els.calendarGrid.innerHTML = "";
    els.calendarGrid.className = "calendar-grid calendar-grid-weeks";

    var totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
    var weekEl = null;
    var weekDaysEl = null;

    function startWeek() {
      weekEl = document.createElement("div");
      weekEl.className = "cal-week";
      weekDaysEl = document.createElement("div");
      weekDaysEl.className = "cal-week-days";
      weekEl.appendChild(weekDaysEl);
      els.calendarGrid.appendChild(weekEl);
    }

    startWeek();

    for (var i = 0; i < totalCells; i += 1) {
      if (i > 0 && i % 7 === 0) {
        startWeek();
      }

      var dayNum = i - startOffset + 1;
      var cell = document.createElement("div");
      cell.className = "cal-day";

      if (dayNum < 1 || dayNum > daysInMonth) {
        cell.classList.add("is-outside");
        weekDaysEl.appendChild(cell);
        continue;
      }

      var current = new Date(year, monthIndex, dayNum);
      var key = dateKey(current);
      var dayItems = byDay[key] || [];
      var isExpanded = state.expandedCalDay === key;

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

      cell.setAttribute("role", "button");
      cell.setAttribute("tabindex", "0");
      cell.setAttribute("data-day-key", key);
      cell.setAttribute(
        "aria-expanded",
        isExpanded ? "true" : "false"
      );
      cell.setAttribute(
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
      numSpan.textContent = String(dayNum);
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
      cell.appendChild(heading);

      var list = document.createElement("div");
      list.className = "cal-day-items";
      dayItems.slice(0, MAX_PREVIEW).forEach(function (item) {
        var node = document.createElement("div");
        node.className =
          "cal-item" +
          (dueBucket(item).id === "overdue" ? " is-overdue" : "") +
          (itemState(item) === "complete" ? " is-complete" : "") +
          (isReminderRow(item) ? " is-reminder" : "");
        var dot = document.createElement("span");
        dot.className = "cal-item-dot";
        dot.style.backgroundColor =
          "hsl(" + boardHue(item.boardName) + " 42% 48%)";
        dot.title = item.boardName || "Board";
        var text = document.createElement("span");
        text.className = "cal-item-text";
        text.textContent =
          (isReminderRow(item)
            ? "Reminder · "
            : item.kind === "card"
              ? "Card · "
              : "") + item.name;
        node.appendChild(dot);
        node.appendChild(text);
        node.title =
          (item.boardName || "Board") +
          (item.assigneeName ? " · " + item.assigneeName : "") +
          " — click day for details";
        list.appendChild(node);
      });
      if (dayItems.length > MAX_PREVIEW) {
        var more = document.createElement("div");
        more.className = "cal-more";
        more.innerHTML =
          '<span class="cal-more-icon" aria-hidden="true"></span>' +
          '<span>+' +
          (dayItems.length - MAX_PREVIEW) +
          " more</span>";
        list.appendChild(more);
      }
      cell.appendChild(list);

      cell.addEventListener("click", function (dayKey) {
        return function () {
          state.expandedCalDay =
            state.expandedCalDay === dayKey ? null : dayKey;
          state.focusCalDayAfterRender = dayKey;
          renderTable();
        };
      }(key));
      cell.addEventListener("keydown", function (dayKey) {
        return function (event) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            state.expandedCalDay =
              state.expandedCalDay === dayKey ? null : dayKey;
            state.focusCalDayAfterRender = dayKey;
            renderTable();
          }
        };
      }(key));

      weekDaysEl.appendChild(cell);

      // After finishing a week that contains the expanded day, insert detail row.
      if ((i + 1) % 7 === 0 && state.expandedCalDay) {
        var expandedInWeek = false;
        for (var d = i - 6; d <= i; d += 1) {
          var dn = d - startOffset + 1;
          if (dn < 1 || dn > daysInMonth) continue;
          if (dateKey(new Date(year, monthIndex, dn)) === state.expandedCalDay) {
            expandedInWeek = true;
            break;
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
          " matching item" +
          (undated.length === 1 ? "" : "s") +
          " have no due date.";
      } else {
        els.calendarUndated.textContent =
          undated.length +
          " matching item" +
          (undated.length === 1 ? "" : "s") +
          " have no due date.";
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
    var isCalendar = state.view === "calendar";
    if (els.viewToggle) {
      els.viewToggle.querySelectorAll(".view-btn").forEach(function (btn) {
        var active = btn.getAttribute("data-view") === state.view;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }
    if (els.groupField) {
      els.groupField.hidden = isCalendar;
    }
    if (els.groupPageSizeField) {
      els.groupPageSizeField.hidden = isCalendar;
    }
    if (els.focusChips) {
      els.focusChips.hidden = isCalendar;
    }
    if (els.filterDue && els.filterDue.closest) {
      var dueField = els.filterDue.closest(".field");
      if (dueField) dueField.hidden = isCalendar;
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
    var filtered = allRows.filter(matchesFilters).sort(compareItems);
    var overdue = filtered.filter(function (item) {
      return !isReminderRow(item) && dueBucket(item).id === "overdue";
    }).length;
    var split = countReminderSplit(filtered);
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

    updateFocusChips();
    updateFilterSummary();
    updateScanNudge();
    updateAssigneeVisibilityBanner();

    var isEmpty = !filtered.length;
    els.emptyState.hidden = !isEmpty;
    if (isEmpty) setEmptyCopy("filtered");

    if (state.view === "calendar") {
      els.tableWrap.hidden = true;
      els.calendarWrap.hidden = false;
      renderCalendar(filtered);
      return;
    }

    els.calendarWrap.hidden = true;
    els.tableWrap.hidden = false;
    els.itemsBody.innerHTML = "";

    if (isEmpty) return;

    var frag = document.createDocumentFragment();
    var groups = buildGroups(filtered);
    var showGroups = state.groupBy !== "none";

    groups.forEach(function (group) {
      if (showGroups) {
        var header = document.createElement("tr");
        header.className = "group-row";
        var collapsed = Boolean(state.collapsedGroups[group.id]);
        header.classList.toggle("is-collapsed", collapsed);
        var cell = document.createElement("td");
        cell.colSpan = 7;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "group-toggle";
        btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
        btn.innerHTML =
          '<span class="group-caret" aria-hidden="true"></span>' +
          '<span class="group-label"></span>' +
          '<span class="group-count"></span>';
        btn.querySelector(".group-label").textContent = group.label;
        var limit = visibleCountForGroup(group.id, group.items.length);
        var split = countReminderSplit(group.items);
        var countLabel =
          split.real +
          (split.real === 1 ? " item" : " items") +
          (split.reminders
            ? " · " +
              split.reminders +
              " reminder" +
              (split.reminders === 1 ? "" : "s")
            : "");
        if (state.groupPageSize && limit < group.items.length) {
          countLabel =
            "showing " +
            limit +
            " of " +
            group.items.length +
            (split.reminders
              ? " (" +
                split.real +
                " · " +
                split.reminders +
                "r)"
              : "");
        }
        btn.querySelector(".group-count").textContent = countLabel;
        btn.addEventListener("click", function () {
          state.collapsedGroups[group.id] = !state.collapsedGroups[group.id];
          savePrefs({ collapsedGroups: state.collapsedGroups });
          renderViews();
        });
        cell.appendChild(btn);
        header.appendChild(cell);
        frag.appendChild(header);

        if (collapsed) return;
      }

      var visibleLimit = visibleCountForGroup(group.id, group.items.length);
      for (var gi = 0; gi < visibleLimit; gi += 1) {
        frag.appendChild(createItemRow(group.items[gi]));
      }

      var remaining = group.items.length - visibleLimit;
      if (remaining > 0 && state.groupPageSize) {
        var moreRow = document.createElement("tr");
        moreRow.className = "group-more-row";
        var moreCell = document.createElement("td");
        moreCell.colSpan = 7;
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

  function renderTable() {
    renderViews();
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
    none.textContent = "None — tick boards yourself";
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

    if (els.welcomeStarterBlock) {
      els.welcomeStarterBlock.hidden = !(teams.length || views.length);
    }
    updateWelcomeStarterLoadButton();
  }

  function updateWelcomeStarterLoadButton() {
    if (!els.welcomeStarterLoad) return;
    var parsed = parseWelcomeStarter(
      els.welcomeStarter && els.welcomeStarter.value
    );
    els.welcomeStarterLoad.disabled = parsed.kind === "none";
    var label = els.welcomeStarterLoad.querySelector(".btn-label");
    var icon = els.welcomeStarterLoad.querySelector(
      ".material-symbols-outlined"
    );
    if (parsed.kind === "team") {
      if (label) label.textContent = "Load team checklists";
      if (icon) icon.textContent = "group";
    } else if (parsed.kind === "view") {
      if (label) label.textContent = "Load with this view";
      if (icon) icon.textContent = "bookmark";
    } else {
      if (label) label.textContent = "Load boards";
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
      workType: state.workType,
      status: state.hideCompleted ? "incomplete" : "all",
      due: els.filterDue.value,
      groupBy: state.groupBy,
      view: state.view,
      sortKey: state.sortKey,
      sortDir: state.sortDir,
      collapsedGroups: Object.assign({}, state.collapsedGroups),
      assignees: getCheckedValues(els.filterAssignee),
      boards: getCheckedValues(els.filterBoard),
      labels: els.filterLabel ? getCheckedValues(els.filterLabel) : [],
      lists: els.filterList ? getCheckedValues(els.filterList) : [],
      search: els.filterSearch.value || "",
      showReminders: state.showReminders,
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
    state.workType = view.workType || "both";
    state.groupBy = view.groupBy || "due";
    state.view = view.view || "list";
    state.sortKey = view.sortKey || "due";
    state.sortDir = view.sortDir === "desc" ? "desc" : "asc";
    state.showReminders = Boolean(view.showReminders);
    state.hideCompleted = view.status !== "all" && view.status !== "complete";
    state.collapsedGroups = Object.assign({}, view.collapsedGroups || {});
    if (els.filterWorkType) els.filterWorkType.value = state.workType;
    if (els.filterReminders) {
      els.filterReminders.checked = state.showReminders;
    }
    if (els.filterHideCompleted) {
      els.filterHideCompleted.checked = state.hideCompleted;
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
    });
    renderTable();
  }

  function setConfigOpen(open) {
    state.filtersOpen = Boolean(open);
    savePrefs({ filtersOpen: state.filtersOpen });
    if (els.configPanel) {
      els.configPanel.hidden = !state.filtersOpen;
    }
    if (els.configToggle) {
      els.configToggle.setAttribute(
        "aria-expanded",
        state.filtersOpen ? "true" : "false"
      );
      els.configToggle.classList.toggle("is-active", state.filtersOpen);
      var label = els.configToggle.querySelector(".btn-label");
      if (label) {
        label.textContent = state.filtersOpen ? "Hide filters" : "Filters";
      }
    }
    document.body.classList.toggle("config-open", state.filtersOpen);
  }

  function updateFilterSummary() {
    if (!els.filterSummary) return;
    var bits = [];
    var work =
      state.workType === "card"
        ? "Cards"
        : state.workType === "checkitem"
          ? "Tasks"
          : "Tasks + cards";
    bits.push(work);

    var assignees = getCheckedValues(els.filterAssignee);
    if (assignees.length === 1 && assignees[0] === "me") bits.push("Me");
    else if (assignees.length) bits.push(assignees.length + " assignees");

    if (state.hideCompleted) bits.push("Open");
    if (state.showReminders) bits.push("Reminders");
    if (els.filterDue.value !== "all" && state.view !== "calendar") {
      var dueLabels = {
        myday: "My day",
        overdue: "Overdue",
        today: "Today",
        week: "7 days",
        none: "Undated",
      };
      bits.push(dueLabels[els.filterDue.value] || els.filterDue.value);
    }
    var boards = getCheckedValues(els.filterBoard);
    var boardBoxes = els.filterBoard
      ? els.filterBoard.querySelectorAll('input[type="checkbox"]').length
      : 0;
    if (boardBoxes) {
      if (!boards.length) bits.push("No boards shown");
      else if (boards.length < boardBoxes) {
        bits.push(boards.length + " boards");
      }
    }
    if (els.filterLabel) {
      var labelIds = getCheckedValues(els.filterLabel);
      if (labelIds.length) bits.push(labelIds.length + " labels");
    }
    if (els.filterList) {
      var listIds = getCheckedValues(els.filterList);
      if (listIds.length) bits.push(listIds.length + " lists");
    }
    var q = (els.filterSearch.value || "").trim();
    if (q) bits.push('“' + q.slice(0, 18) + (q.length > 18 ? "…" : "") + '”');

    els.filterSummary.textContent = bits.join(" · ");
  }

  function setUiAuthorized(isAuthorized) {
    els.authBtn.hidden = isAuthorized;
    if (els.workspace) els.workspace.hidden = !isAuthorized;
    if (els.configToggle) els.configToggle.hidden = !isAuthorized;
    if (els.metaRow) els.metaRow.hidden = !isAuthorized;
    if (els.viewToggle) els.viewToggle.hidden = !isAuthorized;
    if (els.stageBar) els.stageBar.hidden = !isAuthorized;
    if (els.configPanel) {
      els.configPanel.hidden = !(isAuthorized && state.filtersOpen);
    }
    if (!isAuthorized) {
      if (els.calendarWrap) els.calendarWrap.hidden = true;
      if (els.refreshBtn) els.refreshBtn.hidden = true;
      if (els.syncActions) els.syncActions.hidden = true;
      stopStatusNudgeWatch();
      closeSyncMenu();
    } else {
      populateSavedViews();
      setConfigOpen(state.filtersOpen);
      if (state.data) startStatusNudgeWatch();
      else stopStatusNudgeWatch();
      updateAllowlistSummary();
      syncActionButtons();
    }
  }

  function closeSyncMenu() {
    if (!els.syncMenu || !els.syncMenuBtn) return;
    els.syncMenu.hidden = true;
    els.syncMenuBtn.setAttribute("aria-expanded", "false");
    if (els.syncActions) els.syncActions.classList.remove("is-open");
  }

  function syncActionButtons() {
    var ready = Boolean(state.token) && !state.loading;
    var hasData = Boolean(state.data);

    if (els.refreshBtn) {
      // Standalone primary action before the first successful load.
      els.refreshBtn.hidden = !ready || hasData;
      els.refreshBtn.disabled = !ready || hasData;
      var label = els.refreshBtn.querySelector(".btn-label");
      var icon = els.refreshBtn.querySelector(".material-symbols-outlined");
      if (label) label.textContent = "Load boards";
      if (icon) icon.textContent = "radar";
      els.refreshBtn.title =
        "Load items from the boards ticked under Filters → Boards";
    }

    if (els.syncActions) {
      // Split Update status + menu — after the first scan.
      els.syncActions.hidden = !ready || !hasData;
    }

    if (els.statusBtn) {
      els.statusBtn.disabled = !ready || !hasData;
      els.statusBtn.title = hasData
        ? "Refresh open/complete state for items already loaded"
        : "Load boards first, then Update status can refresh known items";
    }

    if (els.syncMenuBtn) {
      els.syncMenuBtn.disabled = !ready || !hasData;
    }

    if (els.syncScanBtn) {
      els.syncScanBtn.disabled = !ready;
    }

    if (els.exportBtn) {
      els.exportBtn.hidden = !ready || !hasData;
      els.exportBtn.disabled = !ready || !hasData;
    }

    if (!hasData) closeSyncMenu();
  }

  function runScan(options) {
    var opts = options || {};
    closeSyncMenu();
    closeWelcomeModal({ persist: true, skipSession: true });
    closeScanConfirm();
    if (!state.boardsReady && !opts.forceFull && !opts.boardListOnly) {
      return loadBoardList().then(function () {
        showBanner(
          "Board list ready. Tick boards under Filters → Boards, then press Load boards again.",
          "info",
          { dismissible: true, bannerKind: "board-pick" }
        );
        setConfigOpen(true);
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

  function beginScan() {
    closeScanConfirm();
    closeWelcomeModal({ persist: true, skipSession: true });
    closeSyncMenu();
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
          "Tick boards under Filters → Boards, then press Load boards.",
          "info",
          { dismissible: true, bannerKind: "board-pick" }
        );
        setConfigOpen(true);
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
        "Choose boards, then Load boards" +
        (catalog.me && (catalog.me.fullName || catalog.me.username)
          ? " · " + (catalog.me.fullName || catalog.me.username)
          : "");
    }
  }

  function loadBoardList(options) {
    var listOpts = options || {};
    if (state.loading) return Promise.resolve();
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

    if (state.demo) {
      setScanProgress(0, 1, "Board names", "catalog");
      return demoDelay(200)
        .then(function () {
          var mock = null;
          if (window.ChecklistHubMock) {
            if (typeof window.ChecklistHubMock.getDataset === "function") {
              mock = window.ChecklistHubMock.getDataset();
            } else if (typeof window.ChecklistHubMock.buildDataset === "function") {
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
            "Board name list refreshed. Checklist data is unchanged until you Load boards.",
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
        showErrorBanner(err, "Board list");
        els.subtitle.textContent = "Could not list board names";
      })
      .finally(finish);
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
      showBanner(
        "You ticked " +
          missingCount +
          " board" +
          (missingCount === 1 ? "" : "s") +
          " that " +
          (missingCount === 1 ? "is" : "are") +
          " not in this list yet. Load boards to pull " +
          (missingCount === 1 ? "its" : "their") +
          " items (board names stay as they are).",
        "info",
        {
          dismissible: true,
          bannerKind: "allowlist-rescan",
          actionLabel: "Load boards",
          action: function () {
            runScan({ skipConfirm: true, forceFull: true });
          },
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
    if (state.demoTimer) {
      clearTimeout(state.demoTimer);
      state.demoTimer = null;
    }
    if (state.scanAbort) {
      try {
        state.scanAbort.abort();
      } catch (e) {
        // ignore
      }
    }
  }

  function demoDelay(ms) {
    return new Promise(function (resolve, reject) {
      if (state.scanAbort && state.scanAbort.signal.aborted) {
        var early = new Error("Cancelled.");
        early.name = "AbortError";
        reject(early);
        return;
      }
      state.demoTimer = setTimeout(function () {
        state.demoTimer = null;
        if (state.scanAbort && state.scanAbort.signal.aborted) {
          var err = new Error("Cancelled.");
          err.name = "AbortError";
          reject(err);
          return;
        }
        resolve();
      }, ms);
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

  function updateScanNudge() {
    if (!els.scanNudge) return;
    if (state.allowlistRescanNeeded && state.data) {
      els.scanNudge.hidden = false;
      els.scanNudge.title =
        "Load checklist items from boards you newly selected under Boards";
      els.scanNudge.innerHTML =
        '<span class="material-symbols-outlined" aria-hidden="true">radar</span> Load boards for new boards?';
      return;
    }
    if (!state.data || !state.data.fetchedAt || state.loading) {
      els.scanNudge.hidden = true;
      return;
    }
    var ttl = config.cacheTtlMs || 5 * 60 * 1000;
    var nudgeAfter = Math.max(ttl, 15 * 60 * 1000);
    var age = Date.now() - state.data.fetchedAt;
    els.scanNudge.hidden = age < nudgeAfter;
    if (!els.scanNudge.hidden) {
      els.scanNudge.title =
        "Load boards again for selected boards (find newly assigned work)";
      els.scanNudge.innerHTML =
        '<span class="material-symbols-outlined" aria-hidden="true">radar</span> Load boards for new assignments?';
    }
  }

  function setEmptyCopy(mode) {
    if (!els.emptyState) return;
    var heading = els.emptyState.querySelector("h2");
    var steps = els.emptyState.querySelector(".empty-steps");
    var note = els.emptyState.querySelector(".empty-note");
    if (mode === "pick-boards") {
      if (heading) heading.textContent = "Choose boards to load";
      if (steps) steps.hidden = true;
      if (note) {
        note.hidden = false;
        note.textContent =
          "Tick boards under Filters → Boards, then Load boards. Closing the hub clears checklist data.";
      }
    } else if (mode === "idle") {
      if (heading) heading.textContent = "Ready when you are";
      if (steps) steps.hidden = false;
      if (note) {
        note.hidden = false;
        note.textContent =
          "Boards are listed when you open the hub. Tick the ones you need, then Load boards. Day to day, prefer Update status.";
      }
    } else {
      if (heading) heading.textContent = "No matching work";
      if (steps) steps.hidden = true;
      if (note) {
        note.hidden = false;
        note.textContent =
          "Try My day, widen filters, open Undated, or Load boards again.";
      }
    }
  }

  function showIdleWorkspace() {
    state.data = null;
    state.allowlistRescanNeeded = false;
    state.statusNudgeDismissedUntil = 0;
    stopStatusNudgeWatch();
    if (els.resultCount) els.resultCount.textContent = "";
    if (els.filterSummary) els.filterSummary.textContent = "";
    if (els.cacheNote) els.cacheNote.textContent = "";
    if (els.scanNudge) els.scanNudge.hidden = true;
    if (els.exportBtn) els.exportBtn.hidden = true;
    hideScanProgress();
    if (els.tableWrap) els.tableWrap.hidden = true;
    if (els.calendarWrap) els.calendarWrap.hidden = true;
    setEmptyCopy(state.boardsReady ? "pick-boards" : "idle");
    if (els.emptyState) els.emptyState.hidden = false;
    if (els.focusChips) {
      els.focusChips.querySelectorAll("[data-due-chip]").forEach(function (chip) {
        var key = chip.getAttribute("data-due-chip");
        var active = (els.filterDue && els.filterDue.value) === key;
        chip.classList.toggle("is-active", active);
        chip.setAttribute("aria-pressed", active ? "true" : "false");
        if (key === "all") chip.textContent = "All dates";
        else if (key === "myday") chip.textContent = "My day";
        else if (key === "none") chip.textContent = "Undated queue";
        else if (key === "overdue") chip.textContent = "Overdue";
        else if (key === "today") chip.textContent = "Today";
        else chip.textContent = "Next 7 days";
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
    if (els.welcomeModal && !els.welcomeModal.hidden) return els.welcomeModal;
    if (els.scanConfirmModal && !els.scanConfirmModal.hidden) {
      return els.scanConfirmModal;
    }
    if (els.privacyModal && !els.privacyModal.hidden) return els.privacyModal;
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
      if (prefsApi.loadPrefs().welcomeDismissed) return;
    }
    closeScanConfirm();
    closePrivacyModal();
    closeApiUsageModal();
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
    openModalShell(els.scanConfirmModal, els.scanConfirmOk);
  }

  function closeScanConfirm() {
    if (els.scanConfirmModal) els.scanConfirmModal.hidden = true;
    if (noOtherModalOpen()) {
      document.body.classList.remove("welcome-open");
      restoreModalFocus();
    }
  }

  function openPrivacyModal() {
    if (!els.privacyModal) return;
    closeWelcomeModal();
    closeScanConfirm();
    closeApiUsageModal();
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

  function stopStatusNudgeWatch() {
    if (state.statusTimer) {
      clearInterval(state.statusTimer);
      state.statusTimer = null;
    }
    hideStatusRefreshBanner();
  }

  function statusNudgeMs() {
    var ms =
      config.statusNudgeMs != null ? config.statusNudgeMs : config.statusPollMs;
    return ms;
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
    // Trello docs say Promise, but the client returns the RestApi object
    // (with .authorize / .isAuthorized / .getToken) in current power-up.min.js.
    var api = t.getRestApi();
    if (api && typeof api.then === "function") return api;
    return Promise.resolve(api);
  }

  function ensureAuthorized() {
    return getRestApiClient().then(function (rest) {
      return rest.isAuthorized().then(function (isAuthorized) {
        if (!isAuthorized) {
          setUiAuthorized(false);
          els.subtitle.textContent = "Authorize to load checklist items.";
          els.tableWrap.hidden = true;
          if (els.calendarWrap) els.calendarWrap.hidden = true;
          els.emptyState.hidden = true;
          showBanner(
            "Authorize once with Trello (read-only). Boards list next — tick what you need, then Load boards.",
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
    resetGroupVisibleCounts();
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
    if (data.meta && data.meta.boardErrors && data.meta.boardErrors.length) {
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
    // Rate / HTTP detail stays in Request activity modal — not the main cache note.
    if (!opts.keepSubtitle) {
      els.subtitle.textContent =
        opts.subtitle ||
        "Signed in as " +
          (data.me.fullName || data.me.username || "member");
    }
    state.statusNudgeDismissedUntil = 0;
    startStatusNudgeWatch();
    syncActionButtons();
    updateScanNudge();
    if (applyPendingOrDefaultView()) return;
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
      "Status updated · " +
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
          "Load boards first. Update status then refreshes what you already have.",
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
    };

    if (state.demo) {
      if (!silent) {
        els.subtitle.textContent = "Updating known items…";
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
            showBanner(
              "Status update only refreshes items already in the list — it does not find brand-new checklist assignments or member cards.",
              "info",
              { dismissible: true }
            );
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
          els.subtitle.textContent = "Updating open work…";
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
        var note = "Status updated";
        if (meta.updated != null) {
          note =
            "Status updated · checked " +
            (meta.checked || 0) +
            " · changed " +
            (meta.updated || 0) +
            (meta.added ? " · +" + meta.added : "") +
            (meta.removed ? " · âˆ’" + meta.removed : "");
        }

        applyDataset(result.data, {
          keepSubtitle: silent,
          cacheNote: note,
          skipMetaAppend: true,
        });

        if (!silent) {
          showBanner(
            "Updated statuses for items already in this list. Load boards to pick up brand-new work.",
            "info",
            { dismissible: true }
          );
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
        if (!silent) {
          showErrorBanner(err, "Update status");
          els.subtitle.textContent = "Status update failed";
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
      demoDelay(forceRefresh ? 250 : 80)
        .then(function () {
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
        })
        .catch(reject);
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

    var finish = function () {
      state.loading = false;
      state.scanAbort = null;
      hideScanProgress();
      syncActionButtons();
      updateScanNudge();
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
              : "Authorized · tick boards, then Load boards";
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
          signal: state.scanAbort ? state.scanAbort.signal : null,
          onProgress: function (done, total, boardName) {
            els.subtitle.textContent =
              "Loading checklists " + done + "/" + total + " · " + boardName;
            setScanProgress(done, total, boardName);
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
            : "Authorized · tick boards, then Load boards";
          return;
        }
        showErrorBanner(err, "Load boards");
        els.subtitle.textContent = "Something went wrong";
      })
      .finally(finish);
  }

  function noOtherModalOpen() {
    return (
      (!els.welcomeModal || els.welcomeModal.hidden) &&
      (!els.scanConfirmModal || els.scanConfirmModal.hidden) &&
      (!els.privacyModal || els.privacyModal.hidden) &&
      (!els.apiUsageModal || els.apiUsageModal.hidden)
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
    populateWelcomeStarter();
    if (els.welcomeLead) {
      if (!state.boardsReady) {
        if (hasTeams || hasViews) {
          els.welcomeLead.textContent =
            "Listing boards… Use Quick start for a team or saved view, or tick boards yourself.";
        } else {
          els.welcomeLead.textContent =
            "Listing available boards… then tick Boards and Load boards.";
        }
      } else if (hasTeams || hasViews) {
        els.welcomeLead.textContent =
          "Use Quick start, or tick Boards yourself, then Load boards.";
      } else {
        els.welcomeLead.textContent =
          "Tick boards under Filters → Boards, then Load boards. Day to day, prefer Update status.";
      }
    }
    if (els.welcomeScan) {
      var scanLabel = els.welcomeScan.querySelector(".btn-label");
      var scanIcon = els.welcomeScan.querySelector(".material-symbols-outlined");
      if (scanLabel) scanLabel.textContent = "Load boards";
      if (scanIcon) scanIcon.textContent = "radar";
      els.welcomeScan.title =
        "Load items from the boards ticked under Filters → Boards";
    }
    updateWelcomeStarterLoadButton();
  }

  function updateWelcomeScanTeamButton() {
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
              "” has no default boards. Tick boards under Filters → Boards yourself, then Load boards.",
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
      .catch(function () {
        state.teams = [];
        populateTeamsSelect([]);
        state.teamsContextNote = "Could not load teams from this board.";
      });
  }

  function preprocessApiUsageLog() {
    var root = els.apiUsageLog || document.getElementById("api-usage-log");
    var rows = root ? root.children : [];
    var totalUnits = 0;
    var totalCalls = rows.length;
    var buckets = {};
    Array.prototype.forEach.call(rows, function (row) {
      var at = Number(row.getAttribute("data-at")) || 0;
      var units = Number(row.getAttribute("data-units")) || 1;
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
    list.forEach(function (b) {
      if (b.units > peak) peak = b.units;
    });
    return {
      totalUnits: totalUnits,
      totalCalls: totalCalls,
      peak: peak,
      buckets: list,
      limit: 300,
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
        stats.limit +
        " in a 10s window</p>";
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
            bucket.units >= stats.limit
              ? " is-over"
              : bucket.units >= stats.limit * 0.8
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
    closePrivacyModal();
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

  function bootstrapHub() {
    state.applyDefaultViewPending = true;
    if (state.demo) {
      setUiAuthorized(true);
      state.token = "demo-token";
      els.subtitle.textContent = "Demo user · Alex Rivera";
      showBanner(
        "Demo mode — sample data only. Read-only hub: open cards in Trello to complete work.",
        "info"
      );
      return loadTeamsFromContext().then(function () {
        if (state.teamsContextNote && els.filterTeam) {
          els.filterTeam.title = state.teamsContextNote;
        }
        showIdleWorkspace();
        showWelcomeModal();
        return loadBoardList({ silent: true });
      });
    }

    return ensureAuthorized()
      .then(function (token) {
        if (!token) return null;
        state.token = token;
        els.subtitle.textContent =
          "Authorized · Listing boards…";
        return loadTeamsFromContext();
      })
      .then(function (loaded) {
        if (!state.token) return;
        if (state.teamsContextNote) {
          els.subtitle.textContent =
            "Authorized · " + state.teamsContextNote;
        }
        showIdleWorkspace();
        showWelcomeModal();
        return loadBoardList({ silent: true });
      });
  }

  els.refreshBtn.addEventListener("click", function () {
    runScan();
  });

  if (els.statusBtn) {
    els.statusBtn.addEventListener("click", function () {
      loadStatus(false);
    });
  }

  if (els.syncMenuBtn) {
    els.syncMenuBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      if (!els.syncMenu || els.syncMenuBtn.disabled) return;
      var willOpen = els.syncMenu.hidden;
      closeAllMultiSelects();
      if (willOpen) {
        els.syncMenu.hidden = false;
        els.syncMenuBtn.setAttribute("aria-expanded", "true");
        if (els.syncActions) els.syncActions.classList.add("is-open");
      } else {
        closeSyncMenu();
      }
    });
  }

  if (els.syncScanBtn) {
    els.syncScanBtn.addEventListener("click", function () {
      runScan();
    });
  }

  if (els.syncMenu) {
    els.syncMenu.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) updateStatusNudge();
  });

  els.authBtn.addEventListener("click", function () {
    if (state.demo) {
      setUiAuthorized(true);
      state.token = "demo-token";
      els.subtitle.textContent = "Demo user · Alex Rivera";
      showIdleWorkspace();
      showWelcomeModal(true);
      return;
    }
    getRestApiClient()
      .then(function (rest) {
        return rest.authorize({ scope: "read", expiration: "never" });
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
  });

  if (els.filterDue) {
    els.filterDue.addEventListener("change", function () {
      renderTable();
    });
  }

  if (els.filterHideCompleted) {
    els.filterHideCompleted.addEventListener("change", function () {
      state.hideCompleted = Boolean(els.filterHideCompleted.checked);
      savePrefs({ hideCompleted: state.hideCompleted });
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
      loadStatus(false);
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
        updateWelcomeStarterLoadButton();
      }
    });
  }

  if (els.welcomeStarterLoad) {
    els.welcomeStarterLoad.addEventListener("click", function () {
      var parsed = parseWelcomeStarter(
        els.welcomeStarter && els.welcomeStarter.value
      );
      if (parsed.kind === "none") {
        showBanner(
          "Choose a team or saved view in Quick start, or close this and tick boards under Filters → Boards before Load boards.",
          "warn",
          { dismissible: true, bannerKind: "load-blocked" }
        );
        return;
      }

      if (parsed.kind === "team") {
        closeWelcomeModal({ skipSession: true });
        applySelectedTeam(parsed.id).then(function () {
          if (teamBlocksScan() && !getAllowlistBoardIds().length) {
            warnLoadBlocked({
              message:
                "This team has no default boards. Tick boards under Filters → Boards, then Load boards.",
              openFilters: true,
            });
            return;
          }
          var goTeam = function () {
            runScan({ skipConfirm: true, forceFull: true });
          };
          if (!state.boardsReady) {
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
      runScan();
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

  if (els.filterGroup) {
    els.filterGroup.addEventListener("change", function () {
      state.groupBy = els.filterGroup.value;
      resetGroupVisibleCounts();
      savePrefs({ groupBy: state.groupBy });
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

  if (els.viewToggle) {
    els.viewToggle.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-view]");
      if (!btn) return;
      state.view = btn.getAttribute("data-view");
      savePrefs({ view: state.view });
      renderTable();
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
        "That view will apply after you Load boards next time you open Checklist Hub.",
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
    if (/[",\n\r]/.test(text)) {
      return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
  }

  function exportFilteredCsv() {
    if (!state.data) return;
    var rows = collectRows()
      .filter(matchesFilters)
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

  function shiftCalendarMonth(delta) {
    state.calendarMonth = startOfMonth(
      new Date(
        state.calendarMonth.getFullYear(),
        state.calendarMonth.getMonth() + delta,
        1
      )
    );
    state.expandedCalDay = null;
    if (state.view === "calendar") renderTable();
  }

  if (els.calPrev) {
    els.calPrev.addEventListener("click", function () {
      shiftCalendarMonth(-1);
    });
  }
  if (els.calNext) {
    els.calNext.addEventListener("click", function () {
      shiftCalendarMonth(1);
    });
  }
  if (els.calToday) {
    els.calToday.addEventListener("click", function () {
      var nextMonth = startOfMonth(new Date());
      var monthChanged =
        !state.calendarMonth ||
        state.calendarMonth.getFullYear() !== nextMonth.getFullYear() ||
        state.calendarMonth.getMonth() !== nextMonth.getMonth();
      state.calendarMonth = nextMonth;
      if (monthChanged) state.expandedCalDay = null;
      if (state.view === "calendar") renderTable();
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
    onChange: persistAllowlist,
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
    closeSyncMenu();
  });

  function isTypingTarget(target) {
    if (!target || !target.tagName) return false;
    var tag = target.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    return Boolean(target.isContentEditable);
  }

  function focusSearchField() {
    if (!els.filterSearch) return;
    if (!state.filtersOpen) setConfigOpen(true);
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
      if (els.scanConfirmModal && !els.scanConfirmModal.hidden) {
        closeScanConfirm();
        event.preventDefault();
        return;
      }
      if (els.welcomeModal && !els.welcomeModal.hidden) {
        closeWelcomeModal({ persist: true });
        event.preventDefault();
        return;
      }
      if (els.syncMenu && !els.syncMenu.hidden) {
        closeSyncMenu();
        if (els.syncMenuBtn) els.syncMenuBtn.focus();
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

    if (modal || typing) return;
    if (!state.token || (els.workspace && els.workspace.hidden)) return;

    if (key === "/") {
      event.preventDefault();
      focusSearchField();
      return;
    }
    if (key === "f" || key === "F") {
      event.preventDefault();
      setConfigOpen(!state.filtersOpen);
      return;
    }
    if (key === "1") {
      event.preventDefault();
      state.view = "list";
      savePrefs({ view: state.view });
      renderTable();
      return;
    }
    if (key === "2") {
      event.preventDefault();
      state.view = "calendar";
      savePrefs({ view: state.view });
      renderTable();
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

  populateSavedViews();

  // Fullscreen dashboard: sizeTo is a no-op and triggers host warnings.
  t.render(function () {});

  bootstrapHub();
})();
