/* =========================================================================
   HQ Agency: contact form
   Static site, no backend. Messages are delivered only once a form service
   endpoint (e.g. Formspree) is set in js/config.js → HQ.contactForm.endpoint.
   - Endpoint set:   POSTs to it; shows success ONLY if the service says OK.
   - Endpoint empty: validates, then says plainly that nothing was sent.
   ========================================================================= */

(function () {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const HQ = window.HQ || { business: {}, contactForm: {} };
  const endpoint = ((HQ.contactForm && HQ.contactForm.endpoint) || "").trim();
  const email = (HQ.business.email || "").trim();
  const isLocal = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  const $ = (s) => form.querySelector(s);
  const summary = $("[data-error-summary]");
  const result = document.querySelector("[data-form-result]");
  const submit = $('button[type="submit"]');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  if (!endpoint && isLocal) $("[data-setup-notice]").hidden = false;

  /* ?type=refresh or ?type=new preselects the project type */
  const preset = new URLSearchParams(location.search).get("type");
  if (preset) {
    const radio = form.querySelector(`input[name="projectType"][value="${CSS.escape(preset)}"]`);
    if (radio) radio.checked = true;
  }

  /* ---------- Validation ---------- */
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    email: (v) => (!v.trim() ? "Please enter your email address." : emailOk(v.trim()) ? "" : "Please enter a valid email, like name@example.com."),
    website: (v) => {
      const s = v.trim().replace(/^https?:\/\//i, "");
      return !s || /^[^\s/]+\.[a-z]{2,}(\/\S*)?$/i.test(s) ? "" : "Please enter a web address like yourbusiness.com, or leave it blank.";
    },
    projectType: () => (form.querySelector('input[name="projectType"]:checked') ? "" : "Please choose what you need."),
    message: (v) => (v.trim().length >= 20 ? "" : "Please tell us a bit about the project (at least 20 characters)."),
  };

  const fieldFor = (name) => (name === "projectType" ? form.querySelector('input[name="projectType"]') : form.elements[name]);

  function setError(name, msg) {
    const err = document.getElementById(`${name}-error`);
    if (err) err.textContent = msg;
    if (name === "projectType") {
      form.querySelectorAll('input[name="projectType"]').forEach((r) => r.setAttribute("aria-invalid", msg ? "true" : "false"));
    } else {
      form.elements[name].setAttribute("aria-invalid", msg ? "true" : "false");
    }
  }
  function check(name) {
    const value = name === "projectType" ? "" : form.elements[name].value;
    const msg = rules[name](value);
    setError(name, msg);
    return msg;
  }

  ["name", "email", "website", "message"].forEach((name) => {
    const input = form.elements[name];
    input.addEventListener("blur", () => { if (input.value || input.getAttribute("aria-invalid") === "true") check(name); });
    input.addEventListener("input", () => { if (input.getAttribute("aria-invalid") === "true") check(name); });
  });
  form.querySelectorAll('input[name="projectType"]').forEach((r) => r.addEventListener("change", () => check("projectType")));

  function showSummary(errors) {
    if (!errors.length) { summary.hidden = true; return; }
    summary.innerHTML = `<strong>Please fix ${errors.length === 1 ? "1 field" : `${errors.length} fields`}:</strong><ul>${errors
      .map((e) => `<li><a href="#${fieldFor(e.name).id}">${esc(e.msg)}</a></li>`).join("")}</ul>`;
    summary.hidden = false;
    summary.focus();
  }
  summary.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    e.preventDefault();
    document.querySelector(a.getAttribute("href")).focus();
  });

  function showResult(kind, title, body) {
    result.className = `form-result is-${kind}`;
    result.innerHTML = `<h2>${esc(title)}</h2><p>${body}</p>`;
    result.hidden = false;
    result.focus();
  }

  /* ---------- Submit ---------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    result.hidden = true;

    if (form.elements.company_url && form.elements.company_url.value) return; // honeypot: quietly drop bots

    const errors = Object.keys(rules).map((name) => ({ name, msg: check(name) })).filter((x) => x.msg);
    showSummary(errors);
    if (errors.length) return;

    const emailLine = email ? ` You can also email <a href="mailto:${esc(email)}">${esc(email)}</a>.` : "";

    if (!endpoint) {
      showResult("warn", "This form isn't connected yet, so your message was not sent.",
        `Sorry about that. Please try again later.${emailLine}`);
      return;
    }

    submit.disabled = true;
    submit.textContent = "Sending…";
    try {
      const res = await fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      showResult("ok", "Thanks, your message was sent.",
        "We'll reply by email. Sending a message doesn't commit you to anything; it just starts the conversation.");
    } catch (err) {
      showResult("warn", "Your message didn't go through.",
        `Nothing was sent. Please check your connection and try again.${emailLine}`);
    } finally {
      submit.disabled = false;
      submit.textContent = "Send message";
    }
  });
})();
