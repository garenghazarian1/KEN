import {
  ADMIN_PUBLIC_BASE_URL,
  BUSINESS_SLUG,
} from "@/config/constants";

/**
 * Fetch the public service catalog from the admin system.
 * @param {string} [locale="en"]
 * @param {string|null} [branchId]
 */
export async function getServiceCatalog(locale = "en", branchId = null) {
  const url = new URL(
    `${ADMIN_PUBLIC_BASE_URL}/api/public/businesses/${BUSINESS_SLUG}/service-catalog`
  );
  url.searchParams.set("locale", locale);
  if (branchId) {
    url.searchParams.set("branchId", branchId);
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Service catalog error: ${res.status}`);
  }

  return res.json();
}

const sortByOrder = (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0);

/**
 * Group flat catalog nodes into display sections (categories → subcategories → items).
 * @param {Array} services
 */
export function buildServiceSections(services) {
  if (!services?.length) {
    return [];
  }

  const folders = services.filter(
    (s) => s.type === "category" || s.type === "subcategory"
  );

  const items = services
    .filter((s) => s.type === "item")
    .map((s) => ({
      id: s.id,
      name: s.name,
      defaultPrice: s.defaultPrice,
      durationMinutes: s.durationMinutes > 0 ? s.durationMinutes : undefined,
      description: s.description,
      sortOrder: s.sortOrder ?? 0,
      categoryIds: s.categoryIds ?? [],
    }));

  const itemsForFolder = (folderId) =>
    items
      .filter((item) => item.categoryIds.includes(folderId))
      .sort(sortByOrder);

  const roots = folders
    .filter((f) => f.type === "category" && !f.parentId)
    .sort(sortByOrder);

  return roots
    .map((root) => {
      const subcats = folders
        .filter((f) => f.parentId === root.id)
        .sort(sortByOrder);

      if (subcats.length > 0) {
        const groups = subcats
          .map((sub) => ({
            id: sub.id,
            title: sub.name,
            items: itemsForFolder(sub.id),
          }))
          .filter((g) => g.items.length > 0);

        const directItems = itemsForFolder(root.id);

        return {
          id: root.id,
          title: root.name,
          groups: groups.length > 0 ? groups : undefined,
          items: directItems.length > 0 ? directItems : undefined,
        };
      }

      return {
        id: root.id,
        title: root.name,
        items: itemsForFolder(root.id),
      };
    })
    .filter(
      (section) =>
        (section.items?.length ?? 0) > 0 || (section.groups?.length ?? 0) > 0
    );
}
