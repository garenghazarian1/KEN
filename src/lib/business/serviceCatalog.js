import { cacheLife, cacheTag } from "next/cache";
import { ADMIN_PUBLIC_BASE_URL, BUSINESS_SLUG } from "@/config/constants";

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

  /** Always fetch fresh catalog so admin media uploads appear immediately. */
  const res = await fetch(url.toString(), { cache: "no-store" });

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

function firstImageOnly(imageUrls) {
  return Array.isArray(imageUrls) && imageUrls[0] ? [imageUrls[0]] : [];
}

function trimItem(item) {
  return {
    id: item.id,
    name: item.name,
    defaultPrice: item.defaultPrice,
    priceLabel: item.priceLabel ?? null,
    priceCompareAtLabel: item.priceCompareAtLabel ?? null,
    priceDisplayType: item.priceDisplayType ?? null,
    durationMinutes: item.durationMinutes,
    description: item.description ?? null,
    imageUrls: firstImageOnly(item.imageUrls),
  };
}

/** Fields the services page renders. Drops sort order, folder ids, and video. */
export function trimServiceSections(sections) {
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    items: section.items?.map(trimItem),
    groups: section.groups?.map((group) => ({
      id: group.id,
      title: group.title,
      items: group.items.map(trimItem),
      imageUrls: firstImageOnly(group.imageUrls),
    })),
    imageUrls: firstImageOnly(section.imageUrls),
  }));
}

/**
 * Services page catalog. Cached for 1 hour. Throws on failure or an empty
 * list so an error is never stored.
 * @param {string} [locale="en"]
 */
export async function getServiceSectionsCached(locale = "en") {
  "use cache";
  cacheLife("hours");
  cacheTag("service-catalog");
  const data = await getServiceCatalog(locale);
  const sections = trimServiceSections(buildServiceSections(data.services));
  if (!sections.length) {
    throw new Error("Failed to load services.");
  }
  return sections;
}
