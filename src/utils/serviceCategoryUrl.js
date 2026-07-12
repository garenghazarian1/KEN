/** Query key for the active service category on `/services`. */
export const SERVICE_CATEGORY_QUERY_KEY = "category";

/** Query key for open subcategory accordions (`comma-separated` ids). */
export const SERVICE_SUBCATEGORIES_QUERY_KEY = "sub";

/**
 * Resolve a raw category id from the URL against loaded sections.
 * @param {string | null | undefined} rawId
 * @param {Array<{ id: string }>} sections
 * @returns {string | null}
 */
export function resolveServiceCategoryId(rawId, sections) {
  if (!rawId || !sections?.length) return null;
  return sections.some((section) => section.id === rawId) ? rawId : null;
}

/**
 * Parse a comma-separated subcategory id list from the URL.
 * @param {string | null | undefined} raw
 * @returns {string[]}
 */
export function parseSubcategoryIdsParam(raw) {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

/**
 * Resolve open subcategory ids for the active category.
 * @param {string | null | undefined} rawSub
 * @param {Array<{ id: string, groups?: Array<{ id: string }> }>} sections
 * @param {string | null} categoryId
 * @returns {string[]}
 */
export function resolveOpenSubcategoryIds(rawSub, sections, categoryId) {
  if (!categoryId || !sections?.length) return [];

  const section = sections.find((entry) => entry.id === categoryId);
  if (!section?.groups?.length) return [];

  const validIds = new Set(section.groups.map((group) => group.id));
  return parseSubcategoryIdsParam(rawSub).filter((id) => validIds.has(id));
}

/**
 * Build the services path with optional category + open subcategory params.
 * @param {string | null} categoryId
 * @param {string[]} [openSubcategoryIds]
 * @returns {string}
 */
export function buildServicesCategoryPath(
  categoryId,
  openSubcategoryIds = [],
) {
  const params = new URLSearchParams();
  if (categoryId) {
    params.set(SERVICE_CATEGORY_QUERY_KEY, categoryId);
  }
  if (categoryId && openSubcategoryIds.length > 0) {
    params.set(SERVICE_SUBCATEGORIES_QUERY_KEY, openSubcategoryIds.join(","));
  }
  const query = params.toString();
  return query ? `/services?${query}` : "/services";
}

/**
 * Sync services menu navigation state to the URL without a Next.js navigation.
 * Uses pushState when opening a category from the grid; replaceState when switching
 * subcategories or clearing so `force-dynamic` `/services` does not refetch.
 *
 * @param {{ categoryId: string | null, openSubcategoryIds?: string[] }} state
 * @param {{ mode?: "auto" | "push" | "replace" }} [options]
 */
export function syncServiceMenuToUrl(
  { categoryId, openSubcategoryIds = [] },
  { mode = "replace" } = {},
) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  const currentCategoryId = url.searchParams.get(SERVICE_CATEGORY_QUERY_KEY);

  if (categoryId) {
    url.searchParams.set(SERVICE_CATEGORY_QUERY_KEY, categoryId);
  } else {
    url.searchParams.delete(SERVICE_CATEGORY_QUERY_KEY);
    url.searchParams.delete(SERVICE_SUBCATEGORIES_QUERY_KEY);
  }

  if (categoryId && openSubcategoryIds.length > 0) {
    url.searchParams.set(
      SERVICE_SUBCATEGORIES_QUERY_KEY,
      openSubcategoryIds.join(","),
    );
  } else {
    url.searchParams.delete(SERVICE_SUBCATEGORIES_QUERY_KEY);
  }

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextUrl === currentUrl) return;

  const usePush =
    mode === "push" ||
    (mode === "auto" && Boolean(categoryId) && !currentCategoryId);
  const historyMethod = usePush ? "pushState" : "replaceState";

  window.history[historyMethod](null, "", nextUrl);
}

/** @deprecated Use syncServiceMenuToUrl instead. */
export function syncServiceCategoryToUrl(categoryId, options) {
  syncServiceMenuToUrl({ categoryId, openSubcategoryIds: [] }, options);
}
