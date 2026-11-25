/* =========================================================================
   HQ Agency: shared behavior
   - header border on scroll, phone menu
   - live site previews scaled to fit their frames, with a view switch
   - business details from js/config.js filled into [data-hq] slots
   ========================================================================= */

(function () {
  const HQ = window.HQ || { business: {} };
  const b = HQ.business;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* Header border once the page scrolls */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Phone menu */
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector("span").textContent = open ? "Close" : "Menu";
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); } });
    window.matchMedia("(min-width: 761px)").addEventListener("change", (m) => { if (m.matches) setOpen(false); });
  }

  /* Live previews: each iframe renders at a real screen width (--vw),
     then scales down to the width of its frame */
  const screens = [...document.querySelectorAll(".screen")];
  const rescale = (screen) => {
    const vw = parseFloat(getComputedStyle(screen).getPropertyValue("--vw")) || 1440;
    screen.style.setProperty("--s", (screen.clientWidth / vw).toFixed(4));
  };
  if (screens.length) {
    const ro = new ResizeObserver((entries) => entries.forEach((e) => rescale(e.target)));
    screens.forEach((s) => ro.observe(s));
  }

  /* Desktop / Tablet / Phone switch on the work page */
  const grid = document.querySelector("[data-examples]");
  const viewButtons = [...document.querySelectorAll("[data-view-btn]")];
  if (grid && viewButtons.length) {
    const setView = (view) => {
      grid.dataset.view = view;
      viewButtons.forEach((btn) => btn.setAttribute("aria-pressed", String(btn.dataset.viewBtn === view)));
      screens.forEach(rescale);
    };
    viewButtons.forEach((btn) => btn.addEventListener("click", () => setView(btn.dataset.viewBtn)));
    setView(window.matchMedia("(max-width: 600px)").matches ? "phone" : "desktop");
  }

  /* Business details: fill or hide [data-hq="email|phone|location|instagram"] */
  document.querySelectorAll("[data-hq]").forEach((el) => {
    const key = el.dataset.hq;
    const v = (b[key] || "").trim();
    const wrap = el.closest("[data-hq-wrap]") || el;
    if (!v) { wrap.hidden = true; return; }
    if (key === "email") el.innerHTML = `<a href="mailto:${esc(v)}">${esc(v)}</a>`;
    else if (key === "phone") el.innerHTML = `<a href="tel:${esc(v.replace(/[^\d+]/g, ""))}">${esc(v)}</a>`;
    else if (key === "instagram") el.innerHTML = `<a href="https://instagram.com/${esc(v)}" rel="noopener">@${esc(v)}</a>`;
    else el.textContent = v;
  });

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
