(function () {
  const config = window.CHECKLIST_HUB_CONFIG;
  const origin = window.location.href.replace(/\/[^/]*$/, "/");
  const ICON_LIGHT = origin + "icons/hub-dark.svg";
  const ICON_DARK = origin + "icons/hub-light.svg";

  function openDashboard(t) {
    return t.modal({
      url: "./dashboard.html",
      fullscreen: true,
      title: "Checklist Hub",
        accentColor: "#6BBBAE",
    });
  }

  function openAuthorize(t) {
    return t.popup({
      title: "Authorize Checklist Hub",
      url: "./authorize.html",
      height: 240,
    });
  }

  function openSettings(t) {
    return t
      .getRestApi()
      .isAuthorized()
      .then(function (isAuthorized) {
        return isAuthorized ? openDashboard(t) : openAuthorize(t);
      })
      .catch(function () {
        return openAuthorize(t);
      });
  }

  window.TrelloPowerUp.initialize(
    {
      "board-buttons": function (t) {
        return t
          .getRestApi()
          .isAuthorized()
          .then(function (isAuthorized) {
            return [
              {
                icon: {
                  dark: ICON_DARK,
                  light: ICON_LIGHT,
                },
                text: "Checklist Hub",
                condition: "signedIn",
                callback: isAuthorized ? openDashboard : openAuthorize,
              },
            ];
          })
          .catch(function () {
            return [
              {
                icon: {
                  dark: ICON_DARK,
                  light: ICON_LIGHT,
                },
                text: "Checklist Hub",
                condition: "signedIn",
                callback: openAuthorize,
              },
            ];
          });
      },
      "show-settings": function (t) {
        return openSettings(t);
      },
    },
    {
      appKey: config.appKey,
      appName: config.appName,
      appAuthor: config.appAuthor,
    }
  );
})();
