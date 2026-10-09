# DuoClash site

Landing page and legal pages for **DuoClash: 2 Player Games 1v1** (`com.duoclash.twoplayergames`), served at
**https://duoclash.ashbuild.app/** by the root `index.php` router (`duoclash` in `$appMap`), and at
`https://ashbuild.app/apps/duoclash/`.

| URL | File | Use |
| --- | --- | --- |
| `/` | `index.html` | Play Console "Website" field (also where AdMob looks for app-ads.txt) |
| `/privacy/` (and `/policy/`) | `privacy/index.html` | Play Console privacy policy URL, Data safety |
| `/terms/` | `terms/index.html` | Terms of use, Remove Ads purchase |
| `/support/` | `support/index.html` | Play Console support contact |

`/app-ads.txt` is served for every subdomain from the repo root (`index.php`), so
`https://duoclash.ashbuild.app/app-ads.txt` already lists `pub-6799355728341823`.

All assets are prefixed `duoclash-`: the router answers `/assets/<file>` from the other apps'
folders first, so a generic name such as `style.css` would serve another app's file.

No build step and no external requests. Keep the privacy policy in step with the app: it
describes AdMob (with Google's UMP consent message) and Google Play Billing, and nothing else
leaving the device. If the app's audience or data use changes, change this page and the Play
Data safety form with it.
