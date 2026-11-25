# HQ Agency website

Built from the brand-site starter (`~/web design context/starter/`) and the vault's Layout Patterns. Static, no build step.

Pages: Home (`index.html`), Example sites (`work.html`), Services, Contact. The eight concept sites live in `examples/<slug>/`, and their screenshots in `assets/work/`.

## Preview locally

```bash
python3 -m http.server 8743
```

Then open http://localhost:8743.

## Edit content

Business details, nav, services and the example sites list are all in `js/config.js` (`window.SITE`). Empty values are hidden on the site. Page copy is in the HTML.

## Contact form

Messages go to **Formspree** (`form.endpoint` in `js/config.js`, and the form's `action` in `contact.html`). Formspree emails each one to the address on the Formspree account and keeps a copy in its dashboard. The `_gotcha` field is Formspree's spam honeypot.

To switch to Netlify Forms, set `form.endpoint` to `"netlify"` and add `data-netlify="true"` plus a hidden `form-name` field to the form. With `""`, the form tells visitors plainly that nothing was sent.

## Publish

Netlify: drag this `site` folder onto your site's **Deploys** page. GitHub Pages: Settings → Pages → `main` / root.

See `OWNER-CHECKLIST.md` for what still needs real details.
