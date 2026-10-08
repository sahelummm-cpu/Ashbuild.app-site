# avolens-site

The public website for the **AvoLens** mobile app (`app.avolens.mobile`) — landing page plus
the legal pages both app stores require.

Live at **https://avolens.ashbuild.app/**

Static HTML served by GitHub Pages. No build step, no framework, no external network
requests of any kind (no CDN, no web font, no analytics) — which is consistent with what the
privacy policy claims about the app.

## Pages

| URL | File | Why it exists |
| --- | --- | --- |
| `/` | `index.html` | Marketing page. Play Console "Website" field. |
| `/privacy/` | `privacy/index.html` | **Required** by Play and the App Store. Play's Data safety form will not submit without it. |
| `/terms/` | `terms/index.html` | Linked from the paywall and onboarding consent line. Required for auto-renewing subscriptions. |
| `/delete-account/` | `delete-account/index.html` | **Required** by Play — a *web* account-deletion path, in addition to the in-app one. Easy to miss; it blocks the release. |
| `/support/` | `support/index.html` | Play Console "Support" contact surface. |

`robots.txt` and `sitemap.xml` are at the root. `404.html` uses absolute paths (GitHub Pages
serves it from any depth), rooted at `/` now that the site is served from its own domain.

## Custom domain

The site is served from `avolens.ashbuild.app`, set up as:

- `CNAME` at the repo root holds the bare domain; Pages has the custom domain set with
  **Enforce HTTPS** on
- DNS for `ashbuild.app` is managed at your domain registrar/DNS provider
  hosting nameservers `dns1`/`dns2.namecheaphosting.com`, not Namecheap BasicDNS, so the
  Namecheap DNS API cannot touch it). The record is a `CNAME` `avolens` →
  `sahelummm-cpu.github.io.` in cPanel → Zone Editor.

To move to a different domain later, change those two things, then search-and-replace
`https://avolens.ashbuild.app` across `*.html`, `robots.txt` and `sitemap.xml`
(canonical, OG and JSON-LD URLs).

Still outstanding: in the **app** repo, `src/lib/links.ts` is the single source of truth for
every legal and support URL the app opens — it needs the new domain, then a shipped build.
Google Search Console verification is per-property, so the new hostname needs its own
verification; the existing `google-site-verification` meta covers the github.io property.

## Editing

Open any `.html` file directly in a browser; there is nothing to compile. Keep the legal
pages and the app in agreement: if the app starts collecting something new, the privacy
policy and the Play Data safety form both have to change with it.

The content here is derived from `store/listing/04-COMPLIANCE.md` in the app repo, which was
itself verified against the code. That document is the reference for anything ambiguous.
