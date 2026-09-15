(function () {
  const config = window.CHECKLIST_HUB_CONFIG;
  const statusEl = document.getElementById("auth-status");
  const btn = document.getElementById("authorize-btn");

  function configuredAppKey() {
    var key = String((config && config.appKey) || "").trim();
    if (!key || /YOUR_TRELLO_API_KEY/i.test(key) || /^YOUR_/i.test(key)) {
      return "";
    }
    return key;
  }

  var appKey = configuredAppKey();
  const t = window.TrelloPowerUp.iframe({
    appKey: appKey || (config && config.appKey) || "",
    appName: config.appName,
    appAuthor: config.appAuthor,
  });

  function setStatus(message, isError) {
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.classList.toggle("error", Boolean(isError));
  }

  t.render(function () {
    t.sizeTo("body");
  });

  if (!appKey) {
    setStatus(
      "Checklist Hub loaded a placeholder API key. Wait for the latest deploy, hard-refresh, then try again.",
      true
    );
    btn.disabled = true;
  }

  btn.addEventListener("click", function () {
    if (!configuredAppKey()) {
      setStatus(
        "Checklist Hub is still using the placeholder API key. Hard-refresh after deploy, or set appKey in config.js.",
        true
      );
      return;
    }

    btn.disabled = true;
    setStatus("Waiting for Trello authorization…");

    t.getRestApi()
      .authorize({
        scope: "read",
        expiration: (config && config.oauthExpiration) || "30days",
      })
      .then(function () {
        setStatus("Authorized. Opening Checklist Hub…");
        return t.modal({
          url: "./dashboard.html",
          fullscreen: true,
          title: "Checklist Hub",
          accentColor: "#6BBBAE",
        });
      })
      .catch(function (err) {
        btn.disabled = false;
        if (
          window.TrelloPowerUp.restApiError &&
          err instanceof window.TrelloPowerUp.restApiError.AuthDeniedError
        ) {
          setStatus("Authorization was cancelled.", true);
          return;
        }
        var msg =
          err && err.message
            ? err.message
            : "Authorization failed. Ask an admin to check the Power-Up API key and allowed origins.";
        if (/YOUR_TRELLO_API_KEY|appKey/i.test(msg)) {
          msg =
            "Checklist Hub is not configured yet. An admin needs to set the Power-Up API key.";
        } else if (/app not found/i.test(msg)) {
          msg =
            "Trello does not recognise this API key. Confirm config.js matches Power-Ups admin → API key, and Allowed Origins includes https://dcmax87.github.io.";
        }
        setStatus(msg, true);
      });
  });
})();
