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

## Connect the contact form

1. Make a free form at https://formspree.io and copy its endpoint (like `https://formspree.io/f/abcdwxyz`).
2. Paste it into `form.endpoint` in `js/config.js`.

Until then, the form checks the fields and then tells visitors plainly that nothing was sent.

## Publish

Netlify: drag this `site` folder onto your site's **Deploys** page. GitHub Pages: Settings → Pages → `main` / root.

See `OWNER-CHECKLIST.md` for what still needs real details.
