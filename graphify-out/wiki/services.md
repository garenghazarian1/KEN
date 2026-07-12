# Services Page Architecture

Last updated: 12 July 2026

## Route
- `src/app/(navPages)/services/page.jsx` — server page, `force-dynamic`, wraps `ServiceMenu` in `Suspense`

## Data pipeline
1. `getServiceCatalog(locale)` — admin public API, `cache: "no-store"`
2. `buildServiceSections(services)` — category → subcategory → item tree
3. `ServiceMenu` — client UI (browse, search, layout modes)

## Search
- `src/lib/business/serviceSearch.js` — MiniSearch index over flattened catalog
- `buildServiceSearchCatalog()`, `searchServices()`, `suggestServiceTitles()`
- Live autocomplete + ranked full-text results in `ServiceMenu`

## URL persistence (refresh-safe navigation)
- `src/utils/serviceCategoryUrl.js`
- `?category=<categoryId>` — open category focus view
- `?sub=<subId1,subId2>` — open subcategory accordions (validated against active category)
- `syncServiceMenuToUrl()` uses `history.pushState` / `replaceState` (not `router.replace`) to avoid refetching `force-dynamic` page
- Invalid/stale ids fall back to all-categories grid

## UI components (`ServiceMenu.jsx`)
- Category grid → `CategoryFocusView` (hero + services)
- `SubcategoryAccordion` per group
- Layout switcher: horizontal carousel / vertical list / grid
- WhatsApp booking banner, sticky search with suggestions
- Media via Cloudinary helpers + `serviceImages` fallbacks

## Graph edges (key)
- `ServicesPage()` → `getServiceCatalog()`, `buildServiceSections()`, `ServiceMenu`
- `ServiceMenu()` → `serviceSearch`, `serviceCategoryUrl`, `serviceImages`, `cloudinary`
