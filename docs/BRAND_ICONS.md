# Brand logo & favicon maintenance

Last updated: 12 July 2026

How to replace the Ken Salon logo and propagate it to favicons, PWA launchers,
navbar, and metadata.

## Source asset

| File | Purpose |
| --- | --- |
| `public/salon-logo-2026.jpg` | Master brand mark (1200×1200). Replace this first. |

Navbar / loading UI read from `BRAND_LOGO_SRC` in `src/config/constants.js`.

## Checklist — every icon change

Run from the `ken/` directory.

### 1. Replace the master image

Drop the new logo over `public/salon-logo-2026.jpg` (or update `BRAND_LOGO_SRC`
if the filename changes).

### 2. Regenerate all icon sizes

```bash
python scripts/generate-brand-icons.py
```

This overwrites:

- `public/favicon.ico` (16 / 32 / 48)
- `public/favicon-for-app/favicon.ico`
- `public/favicon-for-app/favicon-96x96.png`
- `public/favicon-for-app/apple-touch-icon.png`
- `public/favicon-for-app/apple-icon.png`
- `public/favicon-for-app/icon1.png`
- `public/favicon-for-app/web-app-manifest-192x192.png`
- `public/favicon-for-app/web-app-manifest-512x512.png`
- `public/favicon-for-app/favicon.svg` (+ `icon0.svg`)

### 3. Bump cache-bust revisions

In `src/config/constants.js`, increment **all three** (same number):

| Constant | Used for |
| --- | --- |
| `FAVICON_REVISION` | Tab favicons (`favicon.ico`, `.svg`, `-96x96`, root `/favicon.ico`) |
| `APPLE_TOUCH_ICON_REVISION` | iOS Add to Home Screen |
| `WEB_APP_MANIFEST_REVISION` | PWA manifest URL + launcher PNGs |

Also update the matching `?v=` on PWA icon paths in:

- `public/favicon-for-app/site.webmanifest`
- `public/favicon-for-app/manifest.json`

Example: if revisions go from `2` → `3`, set `?v=3` on both manifest icon `src`
entries.

### 4. Deploy

Push and deploy to production. Local dev does not update user devices.

### 5. Update graphify

After code or asset-path changes:

```bash
graphify update .
```

Run from `ken/` (or use full path to `graphify.exe` if not on PATH).

### 6. Verify

With the dev server running:

```bash
npm run verify:head
```

Manually check: browser tab favicon, navbar logo, Chrome Application → Manifest,
and a fresh Add to Home Screen / PWA install.

## What updates automatically vs manually

| Surface | After deploy |
| --- | --- |
| Website navbar / loading | Yes |
| New browser visits / new PWA installs | Yes (faster with `?v=` bumps) |
| Existing iOS home-screen shortcut | **No** — user must delete and re-add |
| Existing Android shortcut / installed PWA | **No** — uninstall shortcut or reinstall |
| Native app (Play Store / App Store) | Separate release with new app icon |

## Code map

| Location | Role |
| --- | --- |
| `src/config/constants.js` | `BRAND_LOGO_SRC`, revision constants, `METADATA_FAVICON_ICONS` |
| `src/app/layout.jsx` | `<head>` favicon + manifest links |
| `public/favicon-for-app/site.webmanifest` | PWA install icons |
| `scripts/generate-brand-icons.py` | Icon generation from master JPG |

## Out of scope (unchanged by this flow)

- Portfolio pages still use legacy `logo01.png` / `logo03.png` hardcoded paths.
- Open Graph / Twitter preview images stay on `hero04.jpg`.
