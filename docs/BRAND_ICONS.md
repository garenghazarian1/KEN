# Brand logo & favicon maintenance

Last updated: 19 July 2026

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
- `public/favicon-for-app/favicon-v3.ico`
- `public/favicon-for-app/favicon-96x96-v3.png`
- `public/favicon-for-app/apple-touch-icon-v3.png`
- `public/favicon-for-app/apple-icon-v3.png`
- `public/favicon-for-app/icon1-v3.png`
- `public/favicon-for-app/web-app-manifest-192x192-v3.png`
- `public/favicon-for-app/web-app-manifest-512x512-v3.png`
- `public/favicon-for-app/favicon-v3.svg` (+ `icon0-v3.svg`)

### 3. Bump cache-bust revisions (and rename if Google is stale)

In `src/config/constants.js`, increment **all three** (same number):

| Constant | Used for |
| --- | --- |
| `FAVICON_REVISION` | Tab favicons (`favicon-v3.ico`, `.svg`, `-96x96-v3`, root `/favicon.ico`) |
| `APPLE_TOUCH_ICON_REVISION` | iOS Add to Home Screen |
| `WEB_APP_MANIFEST_REVISION` | PWA manifest URL + launcher PNGs |

Also update the matching `?v=` on PWA icon paths in:

- `public/favicon-for-app/site-v3.webmanifest`
- `public/favicon-for-app/manifest-v3.json`

**Google Search favicon still old?** A `?v=` bump alone is often ignored. Rename
the icon files and manifest to a new stem (e.g. `*-v3` → `*-v4`), point
`constants.js` + manifests at the new paths, deploy, then URL-inspect the
homepage and the new `favicon-96x96-vN.png` once.

Example: if revisions go from `3` → `4`, set `?v=4` on manifest icon `src`
entries and prefer new filenames over reusing the old paths.

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
| Google Search result favicon | Slow — may need filename rename + days |
| Existing iOS home-screen shortcut | **No** — user must delete and re-add |
| Existing Android shortcut / installed PWA | **No** — uninstall shortcut or reinstall |
| Native app (Play Store / App Store) | Separate release with new app icon |

## Code map

| Location | Role |
| --- | --- |
| `src/config/constants.js` | `BRAND_LOGO_SRC`, revision constants, `METADATA_FAVICON_ICONS` |
| `src/app/layout.jsx` | `<head>` favicon + manifest links |
| `public/favicon-for-app/site-v3.webmanifest` | PWA install icons |
| `scripts/generate-brand-icons.py` | Icon generation from master JPG |

## Out of scope (unchanged by this flow)

- Portfolio pages still use legacy `logo01.png` / `logo03.png` hardcoded paths.
- Open Graph / Twitter preview images stay on `hero04.jpg`.
