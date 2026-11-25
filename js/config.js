/* =========================================================================
   SITE CONTENT: HQ Agency
   Business details, nav, services and work items live here; the header,
   footer, service lists and work grids are all rendered from it.
   Empty values are hidden on the site. Never ship invented facts
   (see OWNER-CHECKLIST.md for the blanks still to fill).
   ========================================================================= */

window.SITE = {
  business: {
    name: "HQ Agency",
    wordmark: ["HQ", "Agency"],
    tagline: "New websites for businesses, and refreshes for the ones that need it.",
    city: "",            // e.g. "Kennewick"
    state: "",           // e.g. "WA"
    stateLong: "",
    region: "",          // e.g. "Tri-Cities"
    phoneDisplay: "",    // e.g. "(509) 555-0100"
    phoneHref: "",       // e.g. "+15095550100"
    email: "",           // e.g. "hello@hqagency.com"
    instagramUrl: "",
    instagramHandle: "",
  },

  logo: {
    src: "assets/brand/hq-logo-horizontal.svg",          // from brand-kit/svg
    srcOnDark: "assets/brand/hq-logo-horizontal-white.svg",
    alt: "HQ Agency",
    height: 34,
  },

  cta: { label: "Start a project", href: "contact.html" },

  nav: [
    { key: "work", label: "Example sites", href: "work.html" },
    { key: "services", label: "Services", href: "services.html" },
    { key: "pricing", label: "Pricing", href: "pricing.html" },
    { key: "contact", label: "Contact", href: "contact.html" },
  ],

  // Where the contact form sends messages:
  //   "netlify"                        = Netlify Forms (site must be hosted on Netlify)
  //   "https://formspree.io/f/xxxxxx"  = Formspree or another form service
  //   ""                               = not connected (the form says nothing was sent)
  form: { endpoint: "https://formspree.io/f/mgakrgeb" },

  // AI help bot (js/help-bot.js). Paste the Cloudflare Worker's address + "/chat",
  // e.g. "https://hq-help-bot.yourname.workers.dev/chat". "" = bot hidden.
  helpBot: { endpoint: "https://hq-help-bot.hq-help-bot.workers.dev/chat" },

  services: [
    {
      id: "new-website",
      title: "New website",
      summary: "Designed and built from scratch around your business and what you want visitors to do.",
      description: "We start with a short brief about your business, your customers and the one action that matters most: call, book, visit or buy. Then we design a look from your own name, logo and trade, and build the pages: home, services, about and contact, plus anything else you need. Every site is built for phones first, with a contact form that reaches you.",
      fitFor: ["New businesses", "Businesses running on a social page alone", "Rebrands", "Sites stuck on an old template"],
      image: "assets/work/shrub-and-steppe-desktop.jpg",
      imageAlt: "Homepage of the Shrub & Steppe Café concept site: cream background, serif headline and an illustrated hero.",
    },
    {
      id: "website-refresh",
      title: "Website refresh",
      summary: "Keep your content and web address. Rebuild the design, speed and phone experience.",
      description: "A refresh keeps what already works: your domain, your content and the page addresses people and search engines know. We redesign the look, speed up the pages, make it work properly on phones, and put calling, booking or contacting you one tap away. Existing booking, payment and ordering tools get linked in, not replaced.",
      fitFor: ["Sites that look dated", "Slow or clunky pages", "Sites that break on phones", "Contact details that are hard to find"],
      image: "assets/work/wheatline-detail-desktop.jpg",
      imageAlt: "Homepage of the Wheatline Detail Co. concept site: dark background, centered headline and a white sedan.",
    },
  ],

  // Pricing (pricing.html, contact form "Plan" field, help bot facts).
  // Change prices here only. Every project is still confirmed in a written quote.
  pricing: {
    tiers: [
      {
        id: "launch", name: "Launch", build: 499, monthly: 29,
        bestFor: "New businesses that need to look legit fast.",
        features: ["Up to 3 pages", "Custom look from your brand", "Phone-friendly site and contact form", "Basic SEO (titles, Google-ready)", "Hosting, security and upkeep", "15 minutes of edits a month"],
      },
      {
        id: "growth", name: "Growth", build: 1199, monthly: 59, featured: true,
        bestFor: "Established local businesses that want more customers.",
        features: ["Up to 6 pages", "Custom look plus a gallery or portfolio", "Local SEO, including Google Business Profile setup", "Booking or ordering links", "Visitor stats (analytics)", "Basic brand kit: logo cleanup, icons, share image", "30 minutes of edits a month"],
      },
      {
        id: "pro", name: "Pro + AI", build: 2499, monthly: 129,
        bestFor: "Busy businesses that answer lots of questions.",
        features: ["Up to 10 pages", "Advanced design with interactive features", "AI help bot included", "Everything in Growth, plus a quarterly report", "Full brand kit", "60 minutes of priority edits a month"],
      },
    ],
    compare: [
      { label: "Pages", values: ["Up to 3", "Up to 6", "Up to 10"] },
      { label: "Custom design from your brand", values: [true, true, true] },
      { label: "Phone-friendly site and contact form", values: [true, true, true] },
      { label: "Basic SEO", values: [true, true, true] },
      { label: "Gallery or portfolio", values: [false, true, true] },
      { label: "Local SEO (Google Business Profile)", values: [false, true, true] },
      { label: "Booking or ordering links", values: [false, true, true] },
      { label: "Visitor stats (analytics)", values: [false, true, "Yes, plus quarterly report"] },
      { label: "Brand kit", values: [false, "Basic", "Full"] },
      { label: "Interactive features (menus, estimators, finders)", values: [false, false, true] },
      { label: "AI help bot", values: ["Add-on", "Add-on", "Included"] },
      { label: "Hosting, security and upkeep", values: [true, true, true] },
      { label: "Edit time each month", values: ["15 min", "30 min", "60 min, priority"] },
    ],
    aiAddon: {
      setup: 249, monthly: 39, chats: 1000,
      features: ["A chat bubble on every page, styled to your brand", "Answers only from facts you approve: services, hours, area, policies", "Hands visitors to your contact form or phone when it doesn't know", "Monthly update of the bot's facts when your business changes"],
    },
    refresh: [
      { tier: "Launch", build: 349, monthly: 29 },
      { tier: "Growth", build: 799, monthly: 59 },
      { tier: "Pro + AI", build: 1699, monthly: 129 },
    ],
    extras: [
      "Domain registration and renewals",
      "Paid third-party tools, such as booking apps or business email",
      "Online stores and custom software",
      "Copywriting and photography",
    ],
  },

  // Example sites. All eight are concept sites for fictional businesses.
  workFilters: ["All", "Food & drink", "Fitness & sport", "Local services", "Studios & spaces"],
  work: [
    { slug: "northbound-athletics", title: "Northbound Athletics", category: "Fitness & sport", meta: "Performance gym", style: "Bold condensed type, action photos, neon accent", featured: true },
    { slug: "shrub-and-steppe", title: "Shrub & Steppe Café", category: "Food & drink", meta: "Neighborhood café", style: "Warm serif type, illustrated hero, tabbed menu", featured: true },
    { slug: "wheatline-detail", title: "Wheatline Detail Co.", category: "Local services", meta: "Mobile auto detailing", style: "Dark and minimal, centered hero, pricing tiers", featured: true },
    { slug: "juniper-hollow", title: "Juniper Hollow Florals", category: "Studios & spaces", meta: "Floral studio", style: "Quiet editorial serif, seasonal guide" },
    { slug: "fetch-and-fluff", title: "Fetch & Fluff Grooming", category: "Local services", meta: "Dog grooming salon", style: "Pastel color blocks, live price estimator" },
    { slug: "basalt-lacrosse", title: "Basalt Lacrosse Club", category: "Fitness & sport", meta: "Youth sports club", style: "Friendly rounded cards, program finder" },
    { slug: "hangar-nine", title: "Hangar Nine Workspace", category: "Studios & spaces", meta: "Coworking space", style: "Dark tech polish, clickable desk map" },
    { slug: "basin-and-range", title: "Basin & Range River Co.", category: "Local services", meta: "River rafting outfitter", style: "Rugged outdoor caps, trip finder" },
  ].map((w) => ({
    ...w,
    href: `examples/${w.slug}/`,
    image: `assets/work/${w.slug}-desktop.jpg`,
    phoneImage: `assets/work/${w.slug}-phone.jpg`,
    alt: `Homepage of the ${w.title} concept site.`,
  })),
};
