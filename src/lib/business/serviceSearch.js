import MiniSearch from "minisearch";

/**
 * Flatten category sections into searchable documents + a lookup map.
 * @param {Array} sections
 */
export function buildServiceSearchCatalog(sections) {
  /** @type {Array<{ id: string, name: string, description: string, category: string, subcategory: string }>} */
  const docs = [];
  /** @type {Map<string, { item: object, categoryTitle: string, categoryId: string, subcategoryTitle: string | null, subcategoryId: string | null }>} */
  const itemMap = new Map();

  for (const section of sections) {
    const registerItem = (item, subcategoryTitle = null, subcategoryId = null) => {
      docs.push({
        id: item.id,
        name: item.name,
        description: item.description ?? "",
        category: section.title,
        subcategory: subcategoryTitle ?? "",
      });
      itemMap.set(item.id, {
        item,
        categoryTitle: section.title,
        categoryId: section.id,
        subcategoryTitle,
        subcategoryId,
      });
    };

    section.items?.forEach((item) => registerItem(item));

    section.groups?.forEach((group) => {
      group.items.forEach((item) =>
        registerItem(item, group.title, group.id),
      );
    });
  }

  const index = new MiniSearch({
    idField: "id",
    fields: ["name", "description", "category", "subcategory"],
    storeFields: ["id"],
    searchOptions: {
      prefix: true,
      fuzzy: 0.2,
      boost: { name: 3, subcategory: 2, category: 1.5, description: 1 },
    },
  });

  if (docs.length > 0) {
    index.addAll(docs);
  }

  return { index, itemMap };
}

/**
 * Ranked service search over a pre-built catalog.
 * @param {{ index: MiniSearch, itemMap: Map }} catalog
 * @param {string} query
 * @param {number} [limit=100]
 */
export function searchServices(catalog, query, limit = 100) {
  const trimmed = query.trim();
  if (!trimmed || !catalog?.index) return [];

  const hits = catalog.index.search(trimmed, { limit });

  return hits
    .map((hit) => {
      const entry = catalog.itemMap.get(hit.id);
      if (!entry) return null;
      return { ...entry, score: hit.score };
    })
    .filter(Boolean);
}

/**
 * Title-only autocomplete suggestions from the live catalog (no hardcoded list).
 * Dedupes by service name; breadcrumb distinguishes same title in different folders.
 * @param {{ index: MiniSearch, itemMap: Map }} catalog
 * @param {string} query
 * @param {number} [limit=8]
 */
export function suggestServiceTitles(catalog, query, limit = 8) {
  const trimmed = query.trim();
  if (trimmed.length < 2 || !catalog?.index) return [];

  const hits = catalog.index.search(trimmed, {
    fields: ["name"],
    prefix: true,
    fuzzy: 0.15,
    limit: limit * 3,
  });

  const seenTitles = new Set();
  /** @type {Array<{ title: string, itemId: string, categoryTitle: string, subcategoryTitle: string | null, score: number }>} */
  const suggestions = [];

  for (const hit of hits) {
    const entry = catalog.itemMap.get(hit.id);
    if (!entry) continue;

    const titleKey = entry.item.name.toLowerCase();
    if (seenTitles.has(titleKey)) continue;
    seenTitles.add(titleKey);

    suggestions.push({
      title: entry.item.name,
      itemId: entry.item.id,
      categoryTitle: entry.categoryTitle,
      subcategoryTitle: entry.subcategoryTitle,
      score: hit.score,
    });

    if (suggestions.length >= limit) break;
  }

  return suggestions;
}
