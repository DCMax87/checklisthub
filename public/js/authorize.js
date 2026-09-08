(function () {
  const config = window.CHECKLIST_HUB_CONFIG;
  const statusEl = document.getElementById("auth-status");
  const btn = document.getElementById("authorize-btn");

  const t = window.TrelloPowerUp.iframe({
    appKey: config.appKey,
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

  btn.addEventListener("click", function () {
    btn.disabled = true;
    setStatus("Waiting for Trello authorization…");

    t.getRestApi()
      .authorize({
        scope: "read",
        expiration: "never",
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
        }
        setStatus(msg, true);
      });
  });
})();
