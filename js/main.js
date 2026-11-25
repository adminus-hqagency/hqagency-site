/* =========================================================================
   SHARED PAGE BEHAVIOR
   Contact links · service rows/blocks · featured work · work grid + filters
   · lightbox · contact form · scroll reveal
   ========================================================================= */

(function () {
  const site = window.SITE;
  const b = site.business;
  const esc = site.esc;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = (n) => String(n).padStart(2, "0");

  /* ---------- Contact links stay in sync with config ---------- */
  document.querySelectorAll('[data-link="phone"]').forEach((a) => {
    if (!b.phoneHref) { (a.closest("[data-link-wrap]") || a).hidden = true; return; }
    a.href = `tel:${b.phoneHref}`;
    if (!a.dataset.keepText) a.textContent = b.phoneDisplay;
  });
  document.querySelectorAll('[data-link="email"]').forEach((a) => {
    if (!b.email) { (a.closest("[data-link-wrap]") || a).hidden = true; return; }
    a.href = `mailto:${b.email}`;
    if (!a.dataset.keepText) a.textContent = b.email;
  });
  document.querySelectorAll('[data-link="instagram"]').forEach((a) => {
    if (!b.instagramUrl) { (a.closest("[data-link-wrap]") || a).hidden = true; return; }
    a.href = b.instagramUrl;
    if (!a.dataset.keepText) a.textContent = b.instagramHandle;
  });

  /* ---------- Service rows (home) ---------- */
  const rows = document.querySelector("[data-service-rows]");
  if (rows) {
    rows.innerHTML = site.services.map((s, i) => `
      <li class="service-row" data-reveal>
        <a href="services.html#${esc(s.id)}">
          <span class="service-row__num">${i + 1}</span>
          <span class="h3">${esc(s.title)}</span>
          <span class="service-row__text">${esc(s.summary)}</span>
          <span class="service-row__arrow" aria-hidden="true">&rarr;</span>
        </a>
      </li>`).join("");
  }

  /* ---------- Service blocks (services page) ---------- */
  const blocks = document.querySelector("[data-service-blocks]");
  if (blocks) {
    const media = (s) => s.image
      ? `<img src="${esc(s.image)}" alt="${esc(s.imageAlt)}" loading="lazy" decoding="async" />`
      : `<div class="placeholder-frame" style="aspect-ratio:4/3">Image · 4:3</div>`;
    blocks.innerHTML = site.services.map((s, i) => `
      <article class="service-block" id="${esc(s.id)}" aria-labelledby="${esc(s.id)}-title">
        <div class="container service-block__grid">
          <div class="service-block__media" data-reveal>${media(s)}</div>
          <div data-reveal>
            <span class="service-block__num">Service ${i + 1}</span>
            <h2 class="display h2" id="${esc(s.id)}-title" style="font-size:clamp(1.9rem,3.6vw,3rem)">${esc(s.title)}</h2>
            <p class="service-block__summary">${esc(s.summary)}</p>
            <p class="service-block__desc">${esc(s.description)}</p>
            <p class="eyebrow fit-label">A good fit for</p>
            <ul class="fit-list">${s.fitFor.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
            <div class="service-block__cta">
              <a class="link-arrow" href="contact.html?service=${encodeURIComponent(s.title)}">Inquire about this <span class="arrow" aria-hidden="true">&rarr;</span></a>
            </div>
          </div>
        </div>
      </article>`).join("");
  }

  /* ---------- Work cards: each opens the live example site ---------- */
  const card = (w, i) => `
    <a class="work-card" href="${esc(w.href)}" target="_blank" rel="noopener" data-index="${i}">
      <div class="work-card__frame">
        <div class="work-card__bar" aria-hidden="true"><i></i><i></i><i></i></div>
        <img src="${esc(w.image)}" alt="${esc(w.alt)}" width="1440" height="900" loading="lazy" decoding="async" />
        ${w.phoneImage ? `<img class="work-card__phone" src="${esc(w.phoneImage)}" alt="" width="780" height="1688" loading="lazy" decoding="async" />` : ""}
      </div>
      <div class="work-card__caption">
        <span class="work-card__title">${esc(w.title)}<span class="visually-hidden"> (concept site, opens in a new tab)</span></span>
        <span class="work-card__meta">${esc(w.meta)}</span>
      </div>
      ${w.style ? `<p class="work-card__style">${esc(w.style)}</p>` : ""}
    </a>`;

  const featured = document.querySelector("[data-featured-work]");
  if (featured) {
    featured.innerHTML = site.work.map((w, i) => (w.featured ? card(w, i) : "")).join("");
  }

  const grid = document.querySelector("[data-work-grid]");
  const filters = document.querySelector("[data-filters]");
  if (grid) {
    grid.innerHTML = site.work.map(card).join("");
    if (filters) {
      const count = (f) => (f === "All" ? site.work.length : site.work.filter((w) => w.category === f).length);
      filters.innerHTML = site.workFilters.map((f, i) =>
        `<button class="filter" type="button" aria-pressed="${i === 0}" data-filter="${esc(f)}">${esc(f)}<span class="filter__count">${count(f)}</span></button>`
      ).join("");
      filters.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-filter]");
        if (!btn) return;
        filters.querySelectorAll("[data-filter]").forEach((x) => x.setAttribute("aria-pressed", String(x === btn)));
        const f = btn.dataset.filter;
        grid.querySelectorAll(".work-card").forEach((el) => {
          el.hidden = f !== "All" && site.work[el.dataset.index].category !== f;
        });
      });
    }
  }

  /* ---------- Pricing (pricing.html), from SITE.pricing ---------- */
  const pr = site.pricing;
  const money = (n) => "$" + Number(n).toLocaleString("en-US");
  const tiersEl = document.querySelector("[data-pricing-tiers]");
  if (pr && tiersEl) {
    tiersEl.innerHTML = pr.tiers.map((t) => `
      <article class="tier${t.featured ? " tier--featured" : ""}" aria-labelledby="tier-${esc(t.id)}">
        ${t.featured ? '<p class="tier__badge">Most popular</p>' : ""}
        <h2 class="tier__name" id="tier-${esc(t.id)}">${esc(t.name)}</h2>
        <p class="tier__for">${esc(t.bestFor)}</p>
        <p class="tier__price"><span class="tier__amount">${money(t.build)}</span> <span class="tier__unit">build</span></p>
        <p class="tier__monthly">+ ${money(t.monthly)}/month</p>
        <ul class="tier__list">${t.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
        <a class="btn${t.featured ? "" : " btn--dark"}" href="contact.html?plan=${esc(t.id)}">Choose ${esc(t.name)}</a>
      </article>`).join("");
  }
  const cmpEl = document.querySelector("[data-pricing-compare]");
  if (pr && cmpEl) {
    const cell = (v) => v === true ? '<span class="yes" aria-label="Included">&#10003;</span>'
      : v === false ? '<span class="no" aria-label="Not included">&ndash;</span>' : esc(v);
    cmpEl.innerHTML = `<table class="compare">
      <caption class="visually-hidden">Features in each package</caption>
      <thead><tr><th scope="col"><span class="visually-hidden">Feature</span></th>${pr.tiers.map((t) => `<th scope="col">${esc(t.name)}<span>${money(t.build)} + ${money(t.monthly)}/mo</span></th>`).join("")}</tr></thead>
      <tbody>${pr.compare.map((r) => `<tr><th scope="row">${esc(r.label)}</th>${r.values.map((v) => `<td>${cell(v)}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>`;
  }
  const aiPrice = document.querySelector("[data-ai-price]");
  if (pr && aiPrice) {
    const a = pr.aiAddon;
    aiPrice.innerHTML = `<strong>${money(a.setup)}</strong> setup + <strong>${money(a.monthly)}/month</strong>, up to ${a.chats.toLocaleString("en-US")} chats a month. Included in Pro + AI.`;
    document.querySelector("[data-ai-features]").innerHTML = a.features.map((f) => `<li>${esc(f)}</li>`).join("");
  }
  const refreshEl = document.querySelector("[data-refresh-table]");
  if (pr && refreshEl) {
    refreshEl.innerHTML = `<table class="compare compare--small">
      <caption class="visually-hidden">Refresh prices</caption>
      <thead><tr><th scope="col">Refresh of</th><th scope="col">Build fee</th><th scope="col">Monthly</th></tr></thead>
      <tbody>${pr.refresh.map((r) => `<tr><th scope="row">${esc(r.tier)}</th><td>${money(r.build)}</td><td>${money(r.monthly)}/mo</td></tr>`).join("")}</tbody>
    </table>`;
    document.querySelector("[data-pricing-extras]").innerHTML = pr.extras.map((x) => `<li>${esc(x)}</li>`).join("");
  }
  document.querySelectorAll("[data-open-bot]").forEach((a) => {
    const launch = () => document.querySelector(".hqbot__launch");
    if (!site.helpBot || !site.helpBot.endpoint) { a.hidden = true; return; }
    a.addEventListener("click", (e) => { e.preventDefault(); const l = launch(); if (l && l.getAttribute("aria-expanded") !== "true") l.click(); });
  });

  /* ---------- Contact form ---------- */
  const form = document.querySelector("[data-contact-form]");
  if (form) {
    const svc = form.querySelector("#service");
    if (svc) {
      svc.insertAdjacentHTML("beforeend", site.services.map((s) => `<option>${esc(s.title)}</option>`).join("") + "<option>Something else</option>");
      const pre = new URLSearchParams(location.search).get("service");
      if (pre && [...svc.options].some((o) => o.value === pre)) svc.value = pre;
    }
    const planSel = form.querySelector("#plan");
    if (planSel && site.pricing) {
      const opts = [...site.pricing.tiers.map((t) => ({ id: t.id, label: `${t.name} (${money(t.build)} + ${money(t.monthly)}/mo)` })),
        { id: "ai-bot", label: `AI help bot add-on (${money(site.pricing.aiAddon.setup)} + ${money(site.pricing.aiAddon.monthly)}/mo)` },
        { id: "unsure", label: "Not sure yet" }];
      planSel.insertAdjacentHTML("beforeend", opts.map((o) => `<option value="${esc(o.id)}">${esc(o.label)}</option>`).join(""));
      const plan = new URLSearchParams(location.search).get("plan");
      if (plan && opts.some((o) => o.id === plan)) {
        planSel.value = plan;
        if (svc && !svc.value) svc.value = plan === "ai-bot" ? "Something else" : "New website";
      }
    }
    const setup = form.querySelector("[data-setup-notice]");
    if (setup && !site.form.endpoint && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) setup.hidden = false;
    const result = document.querySelector("[data-form-result]");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let firstBad = null;
      form.querySelectorAll("[required]").forEach((el) => {
        const err = document.getElementById(`${el.id}-error`);
        const bad = !el.value.trim() || (el.type === "email" && !/^\S+@\S+\.\S+$/.test(el.value));
        el.setAttribute("aria-invalid", String(bad));
        if (err) err.textContent = bad ? (el.type === "email" && el.value ? "Enter a valid email address." : "This field is required.") : "";
        if (bad && !firstBad) firstBad = el;
      });
      if (firstBad) { firstBad.focus(); return; }
      if (!site.form.endpoint) {
        const n = form.querySelector("[data-send-error]");
        n.hidden = false;
        n.innerHTML = `<strong>This form isn't connected yet, so your message was not sent.</strong>${b.email ? ` Please email <a href="mailto:${esc(b.email)}">${esc(b.email)}</a> instead.` : " Please try again later."}`;
        n.focus();
        return;
      }

      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      try {
        const data = new FormData(form);
        const res = site.form.endpoint === "netlify"
          ? await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(data).toString() })
          : await fetch(site.form.endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error();
        form.hidden = true;
        result.hidden = false;
        result.innerHTML = `<h2 class="display">Message sent</h2><p>Thanks. We'll reply by email soon. Sending a message doesn't commit you to anything.</p>`;
        result.focus();
      } catch {
        const n = form.querySelector("[data-send-error]");
        n.hidden = false;
        n.textContent = `Nothing was sent. Please check your connection and try again${b.email ? `, or email ${b.email}` : ""}.`;
      } finally { btn.disabled = false; }
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
})();
