# Public API Integration (Admin System)

Last updated: 6 July 2026

This consumer app (kenbeautysalon.com) reads business data from the **Garen admin
system** over its **read-only public HTTP API**. We do **not** connect to the admin
MongoDB directly.

## Configuration

All in `src/config/constants.js`:

| Constant | Value | Purpose |
|----------|-------|---------|
| `ADMIN_PUBLIC_BASE_URL` | `https://beauty-admin-mauve.vercel.app` | Public API origin |
| `BUSINESS_SLUG` | `ken-beauty-salon` | Our business slug on the admin |
| `BUSINESS_CURRENCY` | `AED` | Fallback currency label only |

- No auth, cookies, or API key. CORS is `Access-Control-Allow-Origin: *`.
- Locales: `en`, `ar`. Pass `locale`; for `ar` render `dir="rtl"`, `lang="ar"`.
- Errors: `{ code, message, details?: { fieldErrors? } }`. Treat 404 `BUSINESS_NOT_FOUND` as "no catalog".

## Endpoints

| Method | Path | Purpose | Used by |
|--------|------|---------|---------|
| GET | `/api/public/businesses/{slug}/service-catalog` | Catalog + pricing + media | `getServiceCatalog()` |
| GET | `/api/public/careers/company/{businessSlug}` | Careers board (published jobs) | (planned in app) |
| GET | `/api/public/jobs/{slug}` | Job detail + apply form config | (planned in app) |
| POST | `/api/public/jobs/{slug}/apply` | Submit application (multipart) | (planned in app) |

Planned/admin-side-only (do not call until published): branches, branch hours,
closures, contact.

## Service catalog

`src/lib/business/serviceCatalog.js`:

- `getServiceCatalog(locale = "en", branchId = null)` — fetches the API with
  `cache: "no-store"` on every request so admin media uploads appear immediately;
  surfaces the API error `message`, and returns `{ businessSlug, total, services }`.
- `buildServiceSections(services)` — turns the flat list into
  category → subcategory → item sections for the UI, carrying media + price fields.

Consumed by `src/app/(navPages)/services/page.jsx` → `src/components/serviceMenu/ServiceMenu.jsx`.

### Tree rules

- Flat list; build hierarchy from `parentId`; sort each level by `sortOrder` asc.
- Only `type === "item"` rows are bookable/priced (`parentId: null`, linked via `categoryIds[]`).
- `category` / `subcategory` are grouping nodes (may also carry media).
- `branchIds` null/`[]` = available at all branches.

### Pricing (render order)

1. **Primary:** display `priceLabel` verbatim — already localized, currency-suffixed,
   grouped (`From 150 AED`, `700 AED – 1,200 AED`, `25 AED each`, `Included`,
   `Price on consultation`), includes any price note.
2. **Sale:** if `priceDisplayType === "sale"` and `priceCompareAtLabel` set, show it
   struck through next to `priceLabel`.
3. **Custom only if needed:** raw fields by `priceDisplayType` (`fixed`, `from`, `range`,
   `per_unit`, `sale`, `free`, `quote`) + `priceNote`.

Never invent currency — raw numeric fields (`defaultPrice`, `priceMax`, `compareAtPrice`)
have no currency code. Prefer `priceLabel`.

Admin-only fields are never returned: `internalCost`, `defaultCommission`, `commissionEligible`.

## Cloudinary media

Every node (`category` / `subcategory` / `item`) can carry:

| Field | Type | Meaning |
|-------|------|---------|
| `imageUrls` | `string[]` | 0–10 absolute Cloudinary `secure_url`s; `[0]` is the cover. `[]` = none. |
| `videoUrl` | `string \| null` | One optional promo video (direct `.mp4`). `null` = none. |

- URLs are absolute and ready for `next/image` / `<video controls preload="metadata">`. Always guard empties.
- Optimize by URL rewrite via `cldTransform(url, transform)` in `src/utils/cloudinary.js`
  (inserts e.g. `f_auto,q_auto,w_400,c_fill` after `/upload/`; no SDK). Non-Cloudinary URLs pass through.
- `next.config.mjs` → `images.remotePatterns` allows `res.cloudinary.com` pathname `/**`
  so any admin Cloudinary cloud renders. Lock to a specific cloud once confirmed.
- The URL contains a Cloudinary version segment (`/v123/`), so cache aggressively; combine with row `updatedAt`.

## History

- **6 July 2026** — Service catalog fetch is always `cache: "no-store"`; `/services` uses
  `dynamic = "force-dynamic"` so admin media uploads show on the next page load.
- **22 June 2026** — Migrated the service catalog from a direct admin-MongoDB query to the
  public HTTP API; added Cloudinary media rendering (`imageUrls`, `videoUrl`) and `priceLabel`
  support. `connectServicesDB` in `src/lib/db/mongoose.js` is now unused.
