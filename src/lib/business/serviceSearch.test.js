import { describe, expect, it } from "vitest";
import { buildServiceSections } from "./serviceCatalog";
import {
  buildServiceSearchCatalog,
  searchServices,
} from "./serviceSearch";

const SHARED_ITEM = {
  id: "6a3926982730bf095dd5bb85",
  name: "Gel Manicure",
  description: "Long-wear gel polish",
};

describe("buildServiceSearchCatalog", () => {
  it("indexes a service once when it appears in section.items and a group", () => {
    const sections = [
      {
        id: "nails",
        title: "Nails",
        items: [SHARED_ITEM],
        groups: [
          {
            id: "manicure",
            title: "Manicure",
            items: [SHARED_ITEM],
          },
        ],
      },
    ];

    const catalog = buildServiceSearchCatalog(sections);
    expect(catalog.itemMap.size).toBe(1);
    expect(catalog.itemMap.get(SHARED_ITEM.id).item.name).toBe("Gel Manicure");

    const hits = searchServices(catalog, "gel manicure");
    expect(hits).toHaveLength(1);
    expect(hits[0].item.id).toBe(SHARED_ITEM.id);
  });

  it("indexes a service once when it appears in two groups", () => {
    const sections = [
      {
        id: "nails",
        title: "Nails",
        groups: [
          {
            id: "manicure",
            title: "Manicure",
            items: [SHARED_ITEM],
          },
          {
            id: "gel",
            title: "Gel",
            items: [SHARED_ITEM],
          },
        ],
      },
    ];

    expect(() => buildServiceSearchCatalog(sections)).not.toThrow();
    const catalog = buildServiceSearchCatalog(sections);
    expect(catalog.itemMap.size).toBe(1);
    expect(searchServices(catalog, "manicure").some((h) => h.item.id === SHARED_ITEM.id)).toBe(
      true
    );
  });

  it("survives buildServiceSections placing the same item in multiple folders", () => {
    const services = [
      {
        id: "nails",
        type: "category",
        name: "Nails",
        parentId: null,
        sortOrder: 0,
      },
      {
        id: "manicure",
        type: "subcategory",
        name: "Manicure",
        parentId: "nails",
        sortOrder: 0,
      },
      {
        id: "pedicure",
        type: "subcategory",
        name: "Pedicure",
        parentId: "nails",
        sortOrder: 1,
      },
      {
        id: SHARED_ITEM.id,
        type: "item",
        name: SHARED_ITEM.name,
        serviceDescription: SHARED_ITEM.description,
        categoryIds: ["manicure", "pedicure"],
        sortOrder: 0,
      },
    ];

    const sections = buildServiceSections(services);
    const appearances = sections.flatMap((section) => [
      ...(section.items ?? []),
      ...(section.groups ?? []).flatMap((group) => group.items),
    ]);
    expect(appearances.filter((item) => item.id === SHARED_ITEM.id).length).toBe(2);

    const catalog = buildServiceSearchCatalog(sections);
    expect(catalog.itemMap.size).toBe(1);
    expect(searchServices(catalog, "gel").some((h) => h.item.id === SHARED_ITEM.id)).toBe(
      true
    );
  });
});
