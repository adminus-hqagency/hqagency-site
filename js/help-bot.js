/* =========================================================================
   HQ HELP BOT: chat bubble + panel
   Talks to the help-bot Worker (SITE.helpBot.endpoint). The Worker holds the
   Claude API key; nothing secret is in this file. If no endpoint is set,
   the widget doesn't appear.
   ========================================================================= */

(function () {
  const site = window.SITE || {};
  const cfg = site.helpBot || {};
  if (!cfg.endpoint) return;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const STORE = "hq-help-bot";
  const GREETING = "Hi! I'm HQ Agency's AI assistant. Ask me about new websites, refreshes, or how a project works.";
  const SUGGESTIONS = ["Which package is right for me?", "How does a website refresh work?", "What does the AI help bot do?"];

  /* Safe rendering: escape everything, then turn page names into links and keep line breaks */
  const render = (text) =>
    esc(text)
      // [Label](page.html) -> link, but only to this site's own pages
      .replace(/\[([^\]]{1,60})\]\(((?:contact|work|services|pricing|index)\.html)\)/g, (_, label, href) => `<a href="${href}">${label}</a>`)
      // any other markdown link: keep the label, drop the address
      .replace(/\[([^\]]{1,80})\]\([^)]*\)/g, "$1")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");

  let history = [];
  try { history = JSON.parse(sessionStorage.getItem(STORE) || "[]"); } catch { history = []; }
  const save = () => { try { sessionStorage.setItem(STORE, JSON.stringify(history.slice(-20))); } catch {} };

  /* ---------- Markup ---------- */
  const root = document.createElement("div");
  root.className = "hqbot";
  root.innerHTML = `
    <button class="hqbot__launch" type="button" aria-expanded="false" aria-controls="hqbot-panel">
      <img class="hqbot__tile" src="assets/brand/hq-favicon.svg" alt="" width="30" height="30"><span class="hqbot__launch-label">Questions? Ask HQ</span>
    </button>
    <section class="hqbot__panel" id="hqbot-panel" role="dialog" aria-modal="false" aria-labelledby="hqbot-title" hidden>
      <header class="hqbot__head">
        <img class="hqbot__tile" src="assets/brand/hq-favicon.svg" alt="" width="30" height="30">
        <div><h2 class="hqbot__title" id="hqbot-title">HQ help</h2><p class="hqbot__sub">AI assistant · answers can be wrong</p></div>
        <button class="hqbot__close" type="button" aria-label="Close chat">&times;</button>
      </header>
      <div class="hqbot__log" role="log" aria-live="polite" aria-label="Conversation"></div>
      <div class="hqbot__chips" aria-label="Suggested questions"></div>
      <form class="hqbot__form">
        <label class="visually-hidden" for="hqbot-input">Your question</label>
        <textarea id="hqbot-input" class="hqbot__input" rows="1" maxlength="1000" placeholder="Ask a question…" autocomplete="off"></textarea>
        <button class="hqbot__send" type="submit" aria-label="Send">&rarr;</button>
      </form>
      <p class="hqbot__foot">For quotes and anything specific, use the <a href="contact.html">Contact page</a>.</p>
    </section>`;
  document.body.appendChild(root);

  const launch = root.querySelector(".hqbot__launch");
  const panel = root.querySelector(".hqbot__panel");
  const log = root.querySelector(".hqbot__log");
  const chips = root.querySelector(".hqbot__chips");
  const form = root.querySelector(".hqbot__form");
  const input = root.querySelector(".hqbot__input");
  const send = root.querySelector(".hqbot__send");

  const bubble = (role, html, extra = "") => {
    const el = document.createElement("div");
    el.className = `hqbot__msg hqbot__msg--${role} ${extra}`.trim();
    el.innerHTML = html;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  };

  const drawChips = () => {
    chips.hidden = history.length > 0;
    chips.innerHTML = SUGGESTIONS.map((q) => `<button type="button" class="hqbot__chip">${esc(q)}</button>`).join("");
  };

  const drawAll = () => {
    log.innerHTML = "";
    bubble("bot", esc(GREETING));
    history.forEach((m) => bubble(m.role === "user" ? "user" : "bot", m.role === "user" ? esc(m.content) : render(m.content)));
    drawChips();
  };

  /* ---------- Open / close ---------- */
  const setOpen = (open) => {
    panel.hidden = !open;
    launch.setAttribute("aria-expanded", String(open));
    root.classList.toggle("is-open", open);
    if (open) { if (!log.childElementCount) drawAll(); input.focus(); log.scrollTop = log.scrollHeight; }
    else launch.focus();
  };
  launch.addEventListener("click", () => setOpen(panel.hidden));
  root.querySelector(".hqbot__close").addEventListener("click", () => setOpen(false));
  panel.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });

  /* ---------- Sending ---------- */
  let busy = false;
  async function ask(text) {
    const q = text.trim().slice(0, 1000);
    if (!q || busy) return;
    busy = true;
    send.disabled = true;
    history.push({ role: "user", content: q });
    save();
    chips.hidden = true;
    bubble("user", esc(q));
    input.value = "";
    autosize();
    const typing = bubble("bot", '<span class="hqbot__dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="visually-hidden">HQ assistant is typing</span>', "is-typing");

    try {
      const res = await fetch(cfg.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-12) }),
      });
      const data = await res.json().catch(() => ({}));
      typing.remove();
      if (!res.ok || !data.reply) {
        history.pop(); // don't keep an unanswered question in the history
        save();
        bubble("bot", esc(data.error || "Sorry, something went wrong. Please try again, or use the Contact page."), "is-error");
      } else {
        history.push({ role: "assistant", content: data.reply });
        save();
        bubble("bot", render(data.reply));
      }
    } catch {
      typing.remove();
      history.pop();
      save();
      bubble("bot", "I couldn't connect. Please check your connection and try again, or use the <a href=\"contact.html\">Contact page</a>.", "is-error");
    } finally {
      busy = false;
      send.disabled = false;
      input.focus();
    }
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input.value); }
  });
  chips.addEventListener("click", (e) => { const c = e.target.closest(".hqbot__chip"); if (c) ask(c.textContent); });

  function autosize() { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 120) + "px"; }
  input.addEventListener("input", autosize);
})();
