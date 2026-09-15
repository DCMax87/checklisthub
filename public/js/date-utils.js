(function (global) {
  function startOfDay(date) {
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function nextCalendarDay(from) {
    var d = startOfDay(from || new Date());
    d.setDate(d.getDate() + 1);
    return d;
  }

  global.ChecklistHubDates = {
    startOfDay: startOfDay,
    nextCalendarDay: nextCalendarDay,
  };
})(typeof window !== "undefined" ? window : globalThis);
