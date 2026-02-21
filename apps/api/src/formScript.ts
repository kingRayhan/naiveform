/** Inline script for headless forms: loading state, success message, redirect, error display. Served at GET /form.js */
export const FORM_SCRIPT = `(function () {
  "use strict";
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  function byName(el, name) {
    return el.querySelector("[data-" + name + "]");
  }
  function show(el) {
    if (el) el.style.display = "";
  }
  function hide(el) {
    if (el) el.style.display = "none";
  }
  function setText(el, text) {
    if (el) el.textContent = text;
  }
  ready(function () {
    document.querySelectorAll("form").forEach(function (form) {
      var wrapper = byName(form, "form-wrapper");
      var loadingEl = byName(form, "loading");
      var submittedEl = byName(form, "form-submitted");
      var errorEl = byName(form, "form-error");
      if (!wrapper) return;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        hide(wrapper);
        show(loadingEl);
        if (errorEl) hide(errorEl);
        var body = new URLSearchParams(new FormData(form));
        fetch(form.action, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: body,
        })
          .then(function (res) {
            hide(loadingEl);
            if (res.ok) {
              return res.json().then(function (data) {
                if (data && data.redirectUrl) {
                  window.location.href = data.redirectUrl;
                  return;
                }
                show(submittedEl);
              });
            }
            return res.text().then(function (text) {
              var msg = "Submission failed.";
              try {
                var j = JSON.parse(text);
                if (j && typeof j.error === "string") msg = j.error;
              } catch (_) {
                if (text) msg = text;
              }
              show(wrapper);
              if (errorEl) {
                setText(errorEl, msg);
                show(errorEl);
              } else {
                setText(loadingEl, msg);
                show(loadingEl);
              }
            });
          })
          .catch(function (err) {
            hide(loadingEl);
            show(wrapper);
            var msg = err && err.message ? err.message : "Submission failed.";
            if (errorEl) {
              setText(errorEl, msg);
              show(errorEl);
            } else {
              setText(loadingEl, msg);
              show(loadingEl);
            }
          });
      });
    });
  });
})();
`;
