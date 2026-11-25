/* =========================================================================
   HQ Agency: business details (one source of truth)
   Fill in the blanks below. Anything left empty is simply not shown.
   Never put made-up details here (see OWNER-CHECKLIST.md).
   ========================================================================= */

window.HQ = {
  business: {
    name: "HQ Agency",
    email: "",        // e.g. "hello@yourdomain.com" — shown on Contact and in the footer
    phone: "",        // e.g. "(509) 555-0123" — shown only if filled in
    location: "",     // e.g. "Kennewick, WA" — shown in the footer if filled in
    instagram: "",    // handle without @, e.g. "hqagency"
  },

  /* Contact form delivery.
     Create a free form at https://formspree.io, then paste its endpoint here,
     e.g. "https://formspree.io/f/abcdwxyz". Until this is set, the form
     tells visitors plainly that nothing was sent. */
  contactForm: {
    endpoint: "",
  },
};
