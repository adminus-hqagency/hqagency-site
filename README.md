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

The form uses **Netlify Forms** (`form.endpoint: "netlify"` in `js/config.js`), so it only sends when the site is hosted on Netlify.

1. In Netlify: your site → **Forms** → **Enable form detection**.
2. Redeploy (drag this folder onto **Deploys**). A form called `contact` appears under Forms.
3. To get each message by email: **Site configuration → Notifications → Emails and webhooks → Form submission notifications → Add notification → Email notification**, form `contact`.

To use Formspree instead, paste its endpoint into `form.endpoint`. With `""`, the form tells visitors plainly that nothing was sent.

## Publish

Netlify: drag this `site` folder onto your site's **Deploys** page. GitHub Pages: Settings → Pages → `main` / root.

See `OWNER-CHECKLIST.md` for what still needs real details.
