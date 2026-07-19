import { NextResponse } from "next/server";
import {
  buildServiceSections,
  getServiceCatalog,
} from "@/lib/business/serviceCatalog";

/**
 * Slim catalog for navbar drawer (ids, titles, prices, first image).
 * @param {ReturnType<typeof buildServiceSections>} sections
 */
function firstImage(node) {
  return Array.isArray(node.imageUrls) && node.imageUrls[0]
    ? node.imageUrls[0]
    : null;
}

function slimItem(item) {
  return {
    id: item.id,
    name: item.name,
    priceLabel: item.priceLabel ?? null,
    imageUrl: firstImage(item),
  };
}

function slimSections(sections) {
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    imageUrl: firstImage(section),
    groups: section.groups?.map((group) => ({
      id: group.id,
      title: group.title,
      imageUrl: firstImage(group),
      items: group.items.map(slimItem),
    })),
    items: section.items?.map(slimItem),
  }));
}

export async function GET() {
  try {
    const data = await getServiceCatalog("en");
    const sections = slimSections(buildServiceSections(data.services));
    return NextResponse.json({ sections });
  } catch (err) {
    return NextResponse.json(
      {
        sections: [],
        error: err?.message || "Failed to load services.",
      },
      { status: 502 },
    );
  }
}
