/**
 * Apply saved theme before paint (external file so CSP can avoid inline scripts).
 */
(function () {
  try {
    var match = document.cookie.match(/(?:^|; )ch_hub_prefs=([^;]*)/);
    if (!match) return;
    var prefs = JSON.parse(decodeURIComponent(match[1]));
    if (prefs && prefs.theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch (e) {
    // ignore
  }
})();
