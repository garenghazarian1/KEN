import { connectServicesDB } from "@/lib/db/mongoose";
import { BUSINESS_SLUG } from "@/config/constants";

/**
 * Get or register a model on a specific connection.
 * Avoids "Cannot overwrite model once compiled" errors across hot-reloads.
 */
function getModel(conn, name, schema) {
  return conn.models[name] || conn.model(name, schema);
}

import mongoose from "mongoose";

const { Schema } = mongoose;

const BusinessSchema = new Schema(
  { name: String, slug: { type: String, index: true }, isActive: Boolean },
  { timestamps: true, collection: "businesses" }
);

const BusinessServiceCategorySchema = new Schema(
  {
    businessId: Schema.Types.ObjectId,
    parentId: { type: Schema.Types.ObjectId, default: null },
    name: String,
    nameTranslations: Schema.Types.Mixed,
    type: { type: String, enum: ["category", "subcategory"] },
    sortOrder: { type: Number, default: 0 },
    description: String,
    descriptionTranslations: Schema.Types.Mixed,
    branchIds: [Schema.Types.ObjectId],
  },
  { timestamps: true, collection: "business_service_categories" }
);

const BusinessServiceItemSchema = new Schema(
  {
    businessId: Schema.Types.ObjectId,
    name: String,
    nameTranslations: Schema.Types.Mixed,
    sortOrder: { type: Number, default: 0 },
    durationMinutes: Number,
    defaultPrice: Number,
    description: String,
    descriptionTranslations: Schema.Types.Mixed,
    branchIds: [Schema.Types.ObjectId],
  },
  { timestamps: true, collection: "business_service_items" }
);

const BusinessServiceItemCategoryLinkSchema = new Schema(
  {
    businessId: Schema.Types.ObjectId,
    itemId: Schema.Types.ObjectId,
    categoryId: Schema.Types.ObjectId,
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "business_service_item_categories" }
);

/** Resolve name for the requested locale, fall back to default. */
function resolveName(nameTranslations, defaultName, locale) {
  if (!nameTranslations) return defaultName;
  return nameTranslations[locale] || nameTranslations["en"] || defaultName;
}

/**
 * Fetch the service catalog directly from MongoDB.
 * @param {string} [locale="en"]
 */
export async function getServiceCatalog(locale = "en") {
  const conn = await connectServicesDB();

  const Business = getModel(conn, "Business", BusinessSchema);
  const BusinessServiceCategory = getModel(conn, "BusinessServiceCategory", BusinessServiceCategorySchema);
  const BusinessServiceItem = getModel(conn, "BusinessServiceItem", BusinessServiceItemSchema);
  const BusinessServiceItemCategoryLink = getModel(conn, "BusinessServiceItemCategoryLink", BusinessServiceItemCategoryLinkSchema);

  const business = await Business.findOne({ slug: BUSINESS_SLUG })
    .select("_id isActive")
    .lean();

  if (!business || business.isActive === false) {
    throw new Error("Business not found.");
  }

  const businessId = business._id;

  const [categories, items, links] = await Promise.all([
    BusinessServiceCategory.find({ businessId })
      .sort({ sortOrder: 1, name: 1 })
      .lean(),
    BusinessServiceItem.find({ businessId })
      .sort({ sortOrder: 1, name: 1 })
      .lean(),
    BusinessServiceItemCategoryLink.find({ businessId })
      .select("itemId categoryId sortOrder")
      .lean(),
  ]);

  // Build categoryIds map: itemId → [categoryId, ...]
  const categoryIdsByItemId = {};
  for (const link of links) {
    const key = link.itemId.toString();
    if (!categoryIdsByItemId[key]) categoryIdsByItemId[key] = [];
    categoryIdsByItemId[key].push(link.categoryId.toString());
  }

  const services = [
    ...categories.map((c) => ({
      id: c._id.toString(),
      parentId: c.parentId ? c.parentId.toString() : null,
      type: c.type,
      name: resolveName(c.nameTranslations, c.name, locale),
      sortOrder: c.sortOrder ?? 0,
      durationMinutes: null,
      defaultPrice: null,
      description: c.description || null,
      branchIds: c.branchIds?.length ? c.branchIds.map((id) => id.toString()) : null,
    })),
    ...items.map((item) => ({
      id: item._id.toString(),
      parentId: null,
      categoryIds: categoryIdsByItemId[item._id.toString()] ?? [],
      type: "item",
      name: resolveName(item.nameTranslations, item.name, locale),
      sortOrder: item.sortOrder ?? 0,
      durationMinutes: item.durationMinutes ?? null,
      defaultPrice: item.defaultPrice ?? null,
      description: item.description || null,
      branchIds: item.branchIds?.length ? item.branchIds.map((id) => id.toString()) : null,
    })),
  ];

  return { services };
}

const sortByOrder = (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0);

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
      durationMinutes: s.durationMinutes > 0 ? s.durationMinutes : undefined,
      description: s.description,
      sortOrder: s.sortOrder ?? 0,
      categoryIds: s.categoryIds ?? [],
    }));

  const itemsForFolder = (folderId) =>
    items.filter((item) => item.categoryIds.includes(folderId)).sort(sortByOrder);

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
