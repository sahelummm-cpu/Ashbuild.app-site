# freed-site

The public website for the **Freed** mobile app (`app.freed.mobile`) — landing page plus the legal and support pages required by both Apple App Store and Google Play Console.

Live at **https://freed.ashbuild.app/**

Pure static HTML/CSS/JS served by GitHub Pages. No heavy build step, no bloated framework, responsive dark luxury glassmorphism design, ultra-fast load time, and local-first privacy.

## Pages

| URL | File | Description & Purpose |
| --- | --- | --- |
| `/` | `index.html` | Marketing landing page: interactive puff reduction calculator, tapering science, 3D app mockup, reviews, FAQ. App Store / Play Console "Website" URL. |
| `/privacy/` | `privacy/index.html` | **Required** by Apple App Store and Google Play. Transparent disclosure of local storage & RevenueCat receipt validation. |
| `/terms/` | `terms/index.html` | Standard Apple EULA & Terms of Service with full medical disclaimer and crisis quitlines. Required for auto-renewing subscriptions. |
| `/delete-account/` | `delete-account/index.html` | **Required** by Google Play & Apple Guideline 5.1.1(v) — web account and data deletion pathway. |
| `/support/` | `support/index.html` | Customer support surface, purchase restoration guide, and help desk contact. |

`robots.txt` and `sitemap.xml` are at the root. `404.html` uses absolute paths to handle any dead link correctly on GitHub Pages.

## Custom Domain Setup

The site is served with `freed.ashbuild.app`:

1. **CNAME file**: The `CNAME` file at the root contains `freed.ashbuild.app`.
2. **GitHub Pages settings**: Set to deploy from the `main` branch, `/ (root)` folder with **Enforce HTTPS** enabled.
3. **DNS Configuration**:
   In your DNS provider (e.g. cPanel Zone Editor, Cloudflare, or Namecheap):
   - **Type**: `CNAME`
   - **Name**: `freed`
   - **Target**: `sahelummm-cpu.github.io.`
   - **TTL**: Auto / 14400

## In-App Integration

In the mobile app repository (`Freed`):
- `src/constants.ts` defines `LEGAL_LINKS`:
  - `privacy`: `https://freed.ashbuild.app/privacy`
  - `terms`: `https://freed.ashbuild.app/terms`
  - `support`: `https://freed.ashbuild.app/support`
  - `deleteAccount`: `https://freed.ashbuild.app/delete-account`
- `src/screens/Paywall.tsx` and `src/screens/Settings.tsx` directly open these verified URLs.
