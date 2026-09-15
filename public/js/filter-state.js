(function (global) {
  function checkedValues(root) {
    if (!root) return [];
    return Array.prototype.slice
      .call(root.querySelectorAll('input[type="checkbox"]:checked'))
      .map(function (input) {
        return input.value;
      });
  }

  function capture(options) {
    var opts = options || {};
    return {
      people: (opts.people || []).slice(),
      boards: checkedValues(opts.boardRoot),
      boardOptionCount: opts.boardRoot
        ? opts.boardRoot.querySelectorAll('input[type="checkbox"]').length
        : 0,
      labels: checkedValues(opts.labelRoot),
      lists: checkedValues(opts.listRoot),
      due: (opts.dueInput && opts.dueInput.value) || "all",
      search: String(
        (opts.searchInput && opts.searchInput.value) || ""
      )
        .trim()
        .toLowerCase(),
      hideCompleted: Boolean(opts.hideCompleted),
      hideCards: Boolean(opts.hideCards),
      view: opts.view || "list",
      bypassDue: Boolean(opts.bypassDue),
    };
  }

  global.ChecklistHubFilterState = {
    capture: capture,
    checkedValues: checkedValues,
  };
})(typeof window !== "undefined" ? window : globalThis);
