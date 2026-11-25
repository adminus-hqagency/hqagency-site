/* =========================================================================
   <site-header current="home|work|services|about|contact">  and  <site-footer>
   Rendered from js/config.js so details change in one place.
   ========================================================================= */

(function () {
  const site = window.SITE;
  const b = site.business;
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  site.esc = esc;

  const brandMarkup = (withLogo) => {
    const logo =
      withLogo && site.logo && site.logo.src
        ? `<img src="${esc(site.logo.src)}" alt="${esc(site.logo.alt)}" height="${site.logo.height || 26}" style="height:${site.logo.height || 26}px" /><span class="brand__divider" aria-hidden="true"></span>`
        : "";
    const [bold, light] = b.wordmark || [b.name, ""];
    return `${logo}<span class="brand__word"><span class="brand__tile" aria-hidden="true">${esc(bold)}</span>${light ? `<span>${esc(light)}</span>` : ""}</span>`;
  };
  const current = (el, key) => (el.getAttribute("current") === key ? ' aria-current="page"' : "");

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      const navLinks = site.nav
        .map((n) => `<li><a class="nav__link" href="${esc(n.href)}"${current(this, n.key)}>${esc(n.label)}</a></li>`)
        .join("");
      const mobileLinks = [{ key: "home", label: "Home", href: "index.html" }, ...site.nav]
        .map((n) => `<li><a href="${esc(n.href)}"${current(this, n.key)}>${esc(n.label)}</a></li>`)
        .join("");

      this.innerHTML = `
        <a class="skip-link" href="#main">Skip to content</a>
        <header class="site-header">
          <div class="container site-header__bar">
            <a class="brand" href="index.html" aria-label="${esc(b.name)}, home">${brandMarkup(true)}</a>
            <nav class="nav" aria-label="Main">
              <ul class="nav__list">${navLinks}</ul>
              <a class="btn btn--sm" href="${esc(site.cta.href)}">${esc(site.cta.label)}</a>
            </nav>
            <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu">
              <span class="menu-toggle__label">Menu</span><span class="menu-toggle__icon" aria-hidden="true"></span>
            </button>
          </div>
        </header>
        <div class="mobile-menu" id="mobile-menu" hidden>
          <nav aria-label="Mobile"><ul class="mobile-menu__list">${mobileLinks}</ul></nav>
          <div class="mobile-menu__foot">
            <a class="btn" href="${esc(site.cta.href)}">${esc(site.cta.label)}</a>
            <div class="mobile-menu__contact">
              ${b.phoneDisplay ? `<a href="tel:${esc(b.phoneHref)}">${esc(b.phoneDisplay)}</a>` : ""}
              ${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ""}
              ${b.instagramUrl ? `<a href="${esc(b.instagramUrl)}" target="_blank" rel="noopener">Instagram ${esc(b.instagramHandle)}</a>` : ""}
            </div>
          </div>
        </div>`;

      const header = this.querySelector(".site-header");
      const toggle = this.querySelector(".menu-toggle");
      const menu = this.querySelector(".mobile-menu");
      const label = this.querySelector(".menu-toggle__label");
      const setOpen = (open) => {
        toggle.setAttribute("aria-expanded", String(open));
        label.textContent = open ? "Close" : "Menu";
        menu.hidden = !open;
        document.body.classList.toggle("menu-open", open);
      };
      toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !menu.hidden) { setOpen(false); toggle.focus(); }
      });
      menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
      window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <footer class="site-footer">
          <div class="container site-footer__top">
            <div>
              <a class="brand" href="index.html" aria-label="${esc(b.name)}, home">${brandMarkup(false)}</a>
              <p class="site-footer__blurb">${esc(b.tagline)}${b.city ? ` Based in ${esc(b.city)}, ${esc(b.stateLong)}.` : ""}</p>
            </div>
            <div>
              <h2>Site</h2>
              <ul><li><a href="index.html">Home</a></li>${site.nav.map((n) => `<li><a href="${esc(n.href)}">${esc(n.label)}</a></li>`).join("")}</ul>
            </div>
            <div>
              <h2>Contact</h2>
              <ul>
                <li><a href="contact.html">Start a project</a></li>
                ${b.email ? `<li><a href="mailto:${esc(b.email)}">${esc(b.email)}</a></li>` : ""}
                ${b.phoneDisplay ? `<li><a href="tel:${esc(b.phoneHref)}">${esc(b.phoneDisplay)}</a></li>` : ""}
                ${b.instagramUrl ? `<li><a href="${esc(b.instagramUrl)}" target="_blank" rel="noopener">Instagram ${esc(b.instagramHandle)}</a></li>` : ""}
              </ul>
            </div>
          </div>
          <div class="container site-footer__bottom">
            <span>&copy; ${new Date().getFullYear()} ${esc(b.name)}</span>
            ${b.city ? `<span>${esc(b.city)}, ${esc(b.state)}${b.region ? ` &middot; ${esc(b.region)}` : ""}</span>` : ""}
          </div>
        </footer>`;
    }
  }

  customElements.define("site-header", SiteHeader);
  customElements.define("site-footer", SiteFooter);
})();
