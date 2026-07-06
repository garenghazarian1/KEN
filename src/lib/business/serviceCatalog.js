import { ADMIN_PUBLIC_BASE_URL, BUSINESS_SLUG } from "@/config/constants";

/** Catalog media can change in admin; revalidate every 5 minutes in production. */
const CATALOG_REVALIDATE_SECONDS = 300;

/**
 * Fetch the service catalog from the admin system's read-only public API.
 *
 * @param {string} [locale="en"] - `en` or `ar`.
 * @param {string|null} [branchId=null] - optional Mongo ObjectId to scope to one branch.
 * @returns {Promise<{ businessSlug: string, total: number, services: Array }>}
 */
export async function getServiceCatalog(locale = "en", branchId = null) {
  const url = new URL(
    `${ADMIN_PUBLIC_BASE_URL}/api/public/businesses/${BUSINESS_SLUG}/service-catalog`
  );
  url.searchParams.set("locale", locale);
  if (branchId) url.searchParams.set("branchId", branchId);

  const fetchOptions =
    process.env.NODE_ENV === "development"
      ? { cache: "no-store" }
      : { next: { revalidate: CATALOG_REVALIDATE_SECONDS } };

  const res = await fetch(url.toString(), fetchOptions);

  if (!res.ok) {
    let message = `Failed to load services (${res.status}).`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // Non-JSON error body; keep the generic message.
    }
    throw new Error(message);
  }

  const data = await res.json();
  return {
    businessSlug: data.businessSlug ?? BUSINESS_SLUG,
    total: data.total ?? data.services?.length ?? 0,
    services: data.services ?? [],
  };
}

const sortByOrder = (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0);

/** Normalize media fields so the UI can rely on a stable shape. */
function pickMedia(node) {
  return {
    imageUrls: Array.isArray(node.imageUrls) ? node.imageUrls : [],
    videoUrl: node.videoUrl ?? null,
  };
}

/**
 * Group flat catalog nodes into display sections (categories → subcategories → items).
 * @param {Array} services
 */
export function buildServiceSections(services) {
  if (!services?.length) return [];

  const folders = services.filter(
    (s) => s.type === "category" || s.type === "subcategory"
  );

  const items = services
    .filter((s) => s.type === "item")
    .map((s) => ({
      id: s.id,
      name: s.name,
      defaultPrice: s.defaultPrice,
      priceLabel: s.priceLabel ?? null,
      priceCompareAtLabel: s.priceCompareAtLabel ?? null,
      priceDisplayType: s.priceDisplayType ?? null,
      durationMinutes: s.durationMinutes > 0 ? s.durationMinutes : undefined,
      description: s.serviceDescription || s.description || null,
      sortOrder: s.sortOrder ?? 0,
      categoryIds: s.categoryIds ?? [],
      ...pickMedia(s),
    }));

  const itemsForFolder = (folderId) =>
    items.filter((item) => item.categoryIds.includes(folderId)).sort(sortByOrder);

  const roots = folders
    .filter((f) => f.type === "category" && !f.parentId)
    .sort(sortByOrder);

  return roots
    .map((root) => {
      const rootMedia = pickMedia(root);
      const subcats = folders
        .filter((f) => f.parentId === root.id)
        .sort(sortByOrder);

      if (subcats.length > 0) {
        const groups = subcats
          .map((sub) => ({
            id: sub.id,
            title: sub.name,
            items: itemsForFolder(sub.id),
            ...pickMedia(sub),
          }))
          .filter((g) => g.items.length > 0);

        const directItems = itemsForFolder(root.id);

        return {
          id: root.id,
          title: root.name,
          groups: groups.length > 0 ? groups : undefined,
          items: directItems.length > 0 ? directItems : undefined,
          ...rootMedia,
        };
      }

      return {
        id: root.id,
        title: root.name,
        items: itemsForFolder(root.id),
        ...rootMedia,
      };
    })
    .filter(
      (section) =>
        (section.items?.length ?? 0) > 0 || (section.groups?.length ?? 0) > 0
    );
}
