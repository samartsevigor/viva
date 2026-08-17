(function applySiteLinks() {
  "use strict";

  var config = window.VIVO_SITE;
  if (!config) return;

  document.querySelectorAll("[data-vivo-calendly]").forEach(function (el) {
    el.href = config.calendlyUrl;
  });

  document.querySelectorAll("[data-vivo-email]").forEach(function (el) {
    el.href = "mailto:" + config.contactEmail;
    if (el.hasAttribute("data-vivo-email-text")) {
      el.textContent = config.contactEmail;
    }
  });
})();
