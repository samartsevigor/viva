(function initContactForm() {
  "use strict";

  var ACCESS_KEY = "05ecfed7-7212-4f96-b825-3d5e1db58a3c";
  var API_URL = "https://api.web3forms.com/submit";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var submitBtn = form.querySelector(".contact-form__submit");
  var statusEl = form.querySelector(".contact-form__status");
  var defaultBtnText = submitBtn ? submitBtn.textContent : "Send project inquiry";

  function setStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = "contact-form__status contact-form__status--" + type;
  }

  function clearStatus() {
    if (!statusEl) return;
    statusEl.textContent = "";
    statusEl.className = "contact-form__status";
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? "Sending…" : defaultBtnText;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearStatus();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var honeypot = form.querySelector("[name='_gotcha']");
    if (honeypot && honeypot.value) {
      setStatus(
        "Thanks — we'll get back to you within an hour during business hours.",
        "success"
      );
      form.reset();
      return;
    }

    var formData = new FormData(form);
    var payload = {
      access_key: ACCESS_KEY,
      subject: "New VIVO project inquiry",
      from_name: "VIVO Website",
      name: formData.get("name"),
      email: formData.get("email"),
      project_type: formData.get("project_type"),
      budget: formData.get("budget") || "Not specified",
      message: formData.get("message"),
    };

    setLoading(true);

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok || !data.success) {
            throw new Error(data.message || "Submission failed");
          }
          return data;
        });
      })
      .then(function () {
        setStatus(
          "Thanks — we'll get back to you within an hour during business hours.",
          "success"
        );
        form.reset();
      })
      .catch(function () {
        setStatus(
          "Something went wrong. Please try again or email us directly.",
          "error"
        );
      })
      .finally(function () {
        setLoading(false);
      });
  });
})();
