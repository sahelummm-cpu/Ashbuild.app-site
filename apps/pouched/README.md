# pouched-site

Website for the **Pouched** app (`app.pouched.mobile`): the landing page plus the legal and support pages Apple and Google require.

Live at **https://pouched.ashbuild.app/** once deployed. Static HTML/CSS/JS with no build step.

| URL | File | Purpose |
| --- | --- | --- |
| `/` | `index.html` | Landing page: taper chart, features, savings calculator, 4-7-8 breathing demo, FAQ |
| `/privacy/` | `privacy/index.html` | Privacy policy (App Store / Play "Privacy Policy URL") |
| `/terms/` | `terms/index.html` | Terms of Use / EULA, including auto-renewing subscription terms |
| `/support/` | `support/index.html` | Support URL: purchases, backups, reminders, quitlines |
| `/delete-account/` | `delete-account/index.html` | Data deletion page (Play "Delete data URL") |
| — | `404.html` | Not-found page |

## Preview locally

```bash
cd website
python -m http.server 5055
# open http://localhost:5055
```

Links are root-absolute (`/assets/...`), so serve from this folder rather than opening the files directly.

## Deploy (GitHub Pages, when the GitHub account is available)

1. Push this folder as its own repo (the app repo gitignores `website/`).
2. Settings → Pages → deploy from `main`, `/ (root)`, and enable **Enforce HTTPS**.
3. DNS for `ashbuild.app`: add a `CNAME` record, name `pouched`, value `<github-username>.github.io`.

`CNAME` already contains `pouched.ashbuild.app`.

## Keep in sync with the app

- The privacy policy lists exactly what Ask Pouched sends (see `src/ai/context.ts` and `src/ai/consent.ts` in the app). Update both if that changes.
- The FAQ lists Pro features. Check them against the app's paywall gates when they change.
