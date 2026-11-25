# HQ Agency website

Static site, no build step. Pages: Home (`index.html`), Services, Example sites (`work.html`), Contact. The eight concept sites live in `examples/<slug>/index.html`.

## Preview locally

```bash
python3 -m http.server 8743
```

Then open http://localhost:8743.

## Edit business details

Everything (email, phone, location, Instagram, form endpoint) is in `js/config.js`. Empty values are hidden on the site.

## Connect the contact form

1. Make a free form at https://formspree.io and copy its endpoint (like `https://formspree.io/f/abcdwxyz`).
2. Paste it into `contactForm.endpoint` in `js/config.js`.

Until then, the form checks the fields and then tells visitors plainly that nothing was sent. It never pretends a message went through.

## Publish on GitHub Pages

Repo settings → Pages → Source: "Deploy from a branch" → `main` / root.

See `OWNER-CHECKLIST.md` for what still needs real details.
