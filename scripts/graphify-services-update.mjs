import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = path.resolve(import.meta.dirname, "..");
const graphPath = path.join(root, "graphify-out", "graph.json");
const manifestPath = path.join(root, "graphify-out", "manifest.json");
const reportPath = path.join(root, "graphify-out", "GRAPH_REPORT.md");

const graph = JSON.parse(fs.readFileSync(graphPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const SERVICES_COMMUNITY = 87;
const CATALOG_COMMUNITY = 88;

function astHash(filePath) {
  const absolute = path.join(root, filePath);
  const content = fs.readFileSync(absolute);
  return crypto.createHash("sha256").update(content).digest("hex");
}

function touchManifest(relativePath) {
  const absolute = path.join(root, relativePath);
  const stat = fs.statSync(absolute);
  manifest[absolute.replace(/\\/g, "\\")] = {
    mtime: stat.mtimeMs / 1000,
    ast_hash: astHash(relativePath),
    semantic_hash: "",
  };
}

function upsertNode(node) {
  const index = graph.nodes.findIndex((entry) => entry.id === node.id);
  if (index >= 0) {
    graph.nodes[index] = { ...graph.nodes[index], ...node };
    return;
  }
  graph.nodes.push(node);
}

function upsertEdge(edge) {
  const links = graph.links ?? [];
  const exists = links.some(
    (entry) =>
      entry.source === edge.source &&
      entry.target === edge.target &&
      entry.relation === edge.relation,
  );
  if (!exists) {
    graph.links = links;
    graph.links.push(edge);
  }
}

const fileNodes = [
  {
    id: "src_utils_servicecategoryurl_js",
    label: "serviceCategoryUrl.js",
    file_type: "code",
    source_file: "src/utils/serviceCategoryUrl.js",
    source_location: "L1",
    community: SERVICES_COMMUNITY,
    norm_label: "servicecategoryurl.js",
  },
  {
    id: "src_lib_business_servicesearch_js",
    label: "serviceSearch.js",
    file_type: "code",
    source_file: "src/lib/business/serviceSearch.js",
    source_location: "L1",
    community: SERVICES_COMMUNITY,
    norm_label: "servicesearch.js",
  },
];

const symbolNodes = [
  {
    id: "utils_servicecategoryurl_service_category_query_key",
    label: "SERVICE_CATEGORY_QUERY_KEY",
    file_type: "code",
    source_file: "src/utils/serviceCategoryUrl.js",
    source_location: "L1",
    community: SERVICES_COMMUNITY,
    norm_label: "service_category_query_key",
  },
  {
    id: "utils_servicecategoryurl_service_subcategories_query_key",
    label: "SERVICE_SUBCATEGORIES_QUERY_KEY",
    file_type: "code",
    source_file: "src/utils/serviceCategoryUrl.js",
    source_location: "L4",
    community: SERVICES_COMMUNITY,
    norm_label: "service_subcategories_query_key",
  },
  {
    id: "utils_servicecategoryurl_resolveservicecategoryid",
    label: "resolveServiceCategoryId()",
    file_type: "code",
    source_file: "src/utils/serviceCategoryUrl.js",
    source_location: "L10",
    community: SERVICES_COMMUNITY,
    norm_label: "resolveservicecategoryid()",
  },
  {
    id: "utils_servicecategoryurl_resolveopensubcategoryids",
    label: "resolveOpenSubcategoryIds()",
    file_type: "code",
    source_file: "src/utils/serviceCategoryUrl.js",
    source_location: "L38",
    community: SERVICES_COMMUNITY,
    norm_label: "resolveopensubcategoryids()",
  },
  {
    id: "utils_servicecategoryurl_syncservicemenutourl",
    label: "syncServiceMenuToUrl()",
    file_type: "code",
    source_file: "src/utils/serviceCategoryUrl.js",
    source_location: "L77",
    community: SERVICES_COMMUNITY,
    norm_label: "syncservicemenutourl()",
  },
  {
    id: "business_servicesearch_buildservicesearchcatalog",
    label: "buildServiceSearchCatalog()",
    file_type: "code",
    source_file: "src/lib/business/serviceSearch.js",
    source_location: "L7",
    community: SERVICES_COMMUNITY,
    norm_label: "buildservicesearchcatalog()",
  },
  {
    id: "business_servicesearch_searchservices",
    label: "searchServices()",
    file_type: "code",
    source_file: "src/lib/business/serviceSearch.js",
    source_location: "L64",
    community: SERVICES_COMMUNITY,
    norm_label: "searchservices()",
  },
  {
    id: "business_servicesearch_suggestservicetitles",
    label: "suggestServiceTitles()",
    file_type: "code",
    source_file: "src/lib/business/serviceSearch.js",
    source_location: "L86",
    community: SERVICES_COMMUNITY,
    norm_label: "suggestservicetitles()",
  },
];

for (const node of [...fileNodes, ...symbolNodes]) upsertNode(node);

const containsEdges = [
  ["src_utils_servicecategoryurl_js", "utils_servicecategoryurl_service_category_query_key"],
  ["src_utils_servicecategoryurl_js", "utils_servicecategoryurl_service_subcategories_query_key"],
  ["src_utils_servicecategoryurl_js", "utils_servicecategoryurl_resolveservicecategoryid"],
  ["src_utils_servicecategoryurl_js", "utils_servicecategoryurl_resolveopensubcategoryids"],
  ["src_utils_servicecategoryurl_js", "utils_servicecategoryurl_syncservicemenutourl"],
  ["src_lib_business_servicesearch_js", "business_servicesearch_buildservicesearchcatalog"],
  ["src_lib_business_servicesearch_js", "business_servicesearch_searchservices"],
  ["src_lib_business_servicesearch_js", "business_servicesearch_suggestservicetitles"],
];

for (const [source, target] of containsEdges) {
  upsertEdge({
    relation: "contains",
    confidence: "EXTRACTED",
    source_file: graph.nodes.find((node) => node.id === source)?.source_file,
    source_location: "L1",
    weight: 1,
    confidence_score: 1,
    source,
    target,
  });
}

const inferredCalls = [
  {
    source: "servicemenu_servicemenu_servicemenu",
    target: "utils_servicecategoryurl_resolveservicecategoryid",
    source_file: "src/components/serviceMenu/ServiceMenu.jsx",
    source_location: "L794",
    context: "import",
  },
  {
    source: "servicemenu_servicemenu_servicemenu",
    target: "utils_servicecategoryurl_resolveopensubcategoryids",
    source_file: "src/components/serviceMenu/ServiceMenu.jsx",
    source_location: "L804",
    context: "import",
  },
  {
    source: "servicemenu_servicemenu_servicemenu",
    target: "utils_servicecategoryurl_syncservicemenutourl",
    source_file: "src/components/serviceMenu/ServiceMenu.jsx",
    source_location: "L835",
    context: "call",
  },
  {
    source: "servicemenu_servicemenu_servicemenu",
    target: "business_servicesearch_buildservicesearchcatalog",
    source_file: "src/components/serviceMenu/ServiceMenu.jsx",
    source_location: "L866",
    context: "call",
  },
  {
    source: "servicemenu_servicemenu_servicemenu",
    target: "business_servicesearch_searchservices",
    source_file: "src/components/serviceMenu/ServiceMenu.jsx",
    source_location: "L876",
    context: "call",
  },
  {
    source: "servicemenu_servicemenu_servicemenu",
    target: "business_servicesearch_suggestservicetitles",
    source_file: "src/components/serviceMenu/ServiceMenu.jsx",
    source_location: "L871",
    context: "call",
  },
  {
    source: "services_page_servicespage",
    target: "src_components_servicemenu_servicemenu_jsx",
    source_file: "src/app/(navPages)/services/page.jsx",
    source_location: "L46",
    context: "render",
  },
];

for (const edge of inferredCalls) {
  upsertEdge({
    relation: "calls",
    confidence: "INFERRED",
    confidence_score: 0.85,
    weight: 1,
    ...edge,
  });
}

[
  "src/utils/serviceCategoryUrl.js",
  "src/components/serviceMenu/ServiceMenu.jsx",
  "src/app/(navPages)/services/page.jsx",
  "src/lib/business/serviceSearch.js",
  "src/lib/business/serviceCatalog.js",
  "docs/PUBLIC_API_INTEGRATION.md",
].forEach(touchManifest);

fs.writeFileSync(graphPath, `${JSON.stringify(graph, null, 2)}\n`);
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const servicesWiki = `# Services Page Architecture

Last updated: 12 July 2026

## Route
- \`src/app/(navPages)/services/page.jsx\` — server page, \`force-dynamic\`, wraps \`ServiceMenu\` in \`Suspense\`

## Data pipeline
1. \`getServiceCatalog(locale)\` — admin public API, \`cache: "no-store"\`
2. \`buildServiceSections(services)\` — category → subcategory → item tree
3. \`ServiceMenu\` — client UI (browse, search, layout modes)

## Search
- \`src/lib/business/serviceSearch.js\` — MiniSearch index over flattened catalog
- \`buildServiceSearchCatalog()\`, \`searchServices()\`, \`suggestServiceTitles()\`
- Live autocomplete + ranked full-text results in \`ServiceMenu\`

## URL persistence (refresh-safe navigation)
- \`src/utils/serviceCategoryUrl.js\`
- \`?category=<categoryId>\` — open category focus view
- \`?sub=<subId1,subId2>\` — open subcategory accordions (validated against active category)
- \`syncServiceMenuToUrl()\` uses \`history.pushState\` / \`replaceState\` (not \`router.replace\`) to avoid refetching \`force-dynamic\` page
- Invalid/stale ids fall back to all-categories grid

## UI components (\`ServiceMenu.jsx\`)
- Category grid → \`CategoryFocusView\` (hero + services)
- \`SubcategoryAccordion\` per group
- Layout switcher: horizontal carousel / vertical list / grid
- WhatsApp booking banner, sticky search with suggestions
- Media via Cloudinary helpers + \`serviceImages\` fallbacks

## Graph edges (key)
- \`ServicesPage()\` → \`getServiceCatalog()\`, \`buildServiceSections()\`, \`ServiceMenu\`
- \`ServiceMenu()\` → \`serviceSearch\`, \`serviceCategoryUrl\`, \`serviceImages\`, \`cloudinary\`
`;

const wikiDir = path.join(root, "graphify-out", "wiki");
fs.mkdirSync(wikiDir, { recursive: true });
fs.writeFileSync(path.join(wikiDir, "services.md"), servicesWiki);

let report = fs.readFileSync(reportPath, "utf8");
report = report.replace(
  /^# Graph Report - ken.*$/m,
  "# Graph Report - ken  (2026-07-12)",
);
if (!report.includes("Services URL persistence")) {
  const insertion = `\n## Services Feature Map (updated 2026-07-12)\n- Route: \`src/app/(navPages)/services/page.jsx\` (\`force-dynamic\`, \`Suspense\`)\n- UI: \`src/components/serviceMenu/ServiceMenu.jsx\` — category grid, focus view, subcategory accordions, layout modes, search\n- Catalog: \`src/lib/business/serviceCatalog.js\` — \`getServiceCatalog()\`, \`buildServiceSections()\`\n- Search: \`src/lib/business/serviceSearch.js\` — MiniSearch autocomplete + ranked results\n- URL state: \`src/utils/serviceCategoryUrl.js\` — \`?category=\` + \`?sub=\` via \`history.pushState\`/\`replaceState\`\n- Wiki: [[wiki/services|Services Page Architecture]]\n- \`ServiceMenu()\` --calls--> \`syncServiceMenuToUrl()\`  [INFERRED]\n- \`ServiceMenu()\` --calls--> \`buildServiceSearchCatalog()\` / \`searchServices()\` / \`suggestServiceTitles()\`  [INFERRED]\n`;
  report = report.replace("## Surprising Connections", `${insertion}\n## Surprising Connections`);
}
report = report.replace(
  /### Community 87 - "Community 87"\nCohesion: [\d.]+\nNodes \(\d+\):[^\n]+/,
  '### Community 87 - "Services UI"\nCohesion: 0.11\nNodes: ServiceMenu.jsx, serviceCategoryUrl.js, serviceSearch.js, category/subcategory accordions, URL persistence (`?category=`, `?sub=`), MiniSearch, layout switcher, Cloudinary covers',
);
fs.writeFileSync(reportPath, report);

console.log("graphify services update complete");
