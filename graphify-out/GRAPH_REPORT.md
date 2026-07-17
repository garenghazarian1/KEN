# Graph Report - ken  (2026-07-17)

## Corpus Check
- 131 files · ~709,156 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 955 nodes · 1024 edges · 99 communities (64 shown, 35 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `33204fcd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]

## God Nodes (most connected - your core abstractions)
1. `Image` - 36 edges
2. `Ken Beauty Salon - Comprehensive Improvement Plan` - 17 edges
3. `Component Development Patterns Guide` - 14 edges
4. `App Improvements Needed` - 14 edges
5. `POST()` - 12 edges
6. `Google Lighthouse Audit Report - Contact Page` - 12 edges
7. `Ken AI Assistant (Text + Voice)` - 11 edges
8. `POST()` - 10 edges
9. `getAssistantModels()` - 10 edges
10. `allowAssistantRequest()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `buildCatalogContext()`  [INFERRED]
  src/app/api/assistant/chat/route.js → src/lib/assistant/catalogContext.js
- `POST()` --calls--> `buildCatalogContext()`  [INFERRED]
  src/app/api/assistant/realtime/turn/route.js → src/lib/assistant/catalogContext.js
- `ServiceMenu()` --calls--> `suggestServiceTitles()`  [INFERRED]
  src/components/serviceMenu/ServiceMenu.jsx → src/lib/business/serviceSearch.js
- `ServiceMenu()` --calls--> `resolveServiceCategoryId()`  [INFERRED]
  src/components/serviceMenu/ServiceMenu.jsx → src/utils/serviceCategoryUrl.js
- `resolveLocationRequest()` --calls--> `buildDirectionsActions()`  [INFERRED]
  src/lib/assistant/intentGate.js → src/data/assistantFaq.js

## Communities (99 total, 35 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.04
Nodes (46): Accessibility Patterns, Analytics, Animation, ARIA Attributes, Basic Component Template, Code Organization, code:jsx ("use client"; // Required for client-side features (state, e), code:jsx (import { Phone, Mail, MessageCircle, ArrowRight, MapPin } fr) (+38 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (46): 10. Contact Page Legacy CSS, 11. NotFound Component, 12. ErrorBoundary Component, 13. Legal Pages Styling, 14. Home Page (Main Page), 15. Test Pages Cleanup, 16. Unused Files, 17. Hardcoded Colors Audit (+38 more)

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (46): 1.1 Clean and Organize globals.css, 1.2 Standardize Font System, 1.3 Create Typography Scale, 1.4 Create Spacing System, 1.5 Define Breakpoint System, 2.1 Fix Layout CSS Class Name, 2.2 Remove Dead Code, 2.3 Fix Third-Party Script Loading (+38 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (33): 1. **Form Labels Not Properly Associated** ✅ FIXED, 1. **Form Validation Not User-Friendly** ✅ FIXED, 1. **JSON-LD Placement** ✅ FIXED, 1. **Missing `sizes` Attribute on Images** ✅ FIXED, 2. **Image Alt Text Quality** ✅ IMPROVED, 2. **Missing Error Handling** ✅ FIXED, 2. **Missing Error Message Accessibility** ✅ FIXED, 2. **Suboptimal Image Loading Priority** ✅ FIXED (+25 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (21): APP_STORES, BUSINESS, CONTACT, formatPhoneForTel(), getSpecialPeriodLogo(), getTelLink(), IMAGES, METADATA_FAVICON_ICONS (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.18
Nodes (10): Component Testing, Device Testing Matrix, Executive Summary, Ken Beauty Salon - Comprehensive Improvement Plan, Next Steps, Notes, Recent Updates, Table of Contents (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (27): Border Radius Variables, code:css (/* Font Sizes */), code:css (var(--radius-sm)    /* 4px */), code:css (/* Glass Backgrounds */), code:css (var(--shadow-light)), code:css (var(--overlay-white-65)), code:css (/* Mobile First Approach */), code:css (.page {) (+19 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (24): 10. **Hardcoded Data** ✅ **RESOLVED**, 11. **Inconsistent Naming**, 12. **Unused Environment Variable**, 13. **Poor Alt Text**, 14. **Missing ARIA Labels**, 15. **Missing Semantic HTML**, 16. **Missing OpenGraph Images**, 17. **Hardcoded URLs** (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (28): dependencies, framer-motion, lucide-react, minisearch, mongoose, next, openai, react (+20 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (23): 1. Always Use CSS Variables, 2. Mobile-First Responsive Design, 3. Semantic HTML, 4. Proper Image Usage, 5. Animation Performance, 6. Accessibility First, 7. Error Handling, 8. Form Validation (+15 more)

### Community 10 - "Community 10"
Cohesion: 0.10
Nodes (20): ✅ 1. Layout.jsx ClassName Format, ✅ 2. Links.jsx Dead Code (signOut/handleLogout), ✅ 3. ErrorBoundary Implementation, ✅ 4. ClientLayout Implementation, ✅ 5. SSR Safety (window/document access), ✅ 6. Import Dependencies, ⚠️ 7. Unused CSS File (Non-Critical), code:jsx (<html lang="en" className={`${inter.className} ${lora.classN) (+12 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (19): 1. Fade In Animation, 2. Slide Up Animation, 3. Staggered Children Animation, 4. Scroll-Triggered Animation, 5. Hover Animation, 6. Page Entrance Animation, Animation Patterns, Animation Timing (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (16): Accessibility (Priority: MEDIUM), Code Quality (Priority: MEDIUM), Contact Page, Critical Bug Fixes (Priority: HIGH) ✅ **COMPLETED**, Design System (Priority: HIGH) ✅ **COMPLETED**, Detailed Todo List, Documentation (Priority: LOW), Footer (+8 more)

### Community 13 - "Community 13"
Cohesion: 0.13
Nodes (15): Contact Page, Current Breakpoint Inconsistencies, Device Breakpoint Strategy, Extra Large Devices (1024px+), Extra Small Devices (320px - 360px), Footer, Gallery Page, Hero Section (+7 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (14): Basic Glass Effect (with background), code:css (.element {), code:css (.element {), code:css (.button {), CSS Variables Available, Design Patterns Established, Files Created/Modified, Glass Button Pattern (+6 more)

### Community 15 - "Community 15"
Cohesion: 0.14
Nodes (13): App Installation Features, Bug Fixes, ✅ Completed (January 2025), Contact Information Enhancements, Documentation, Future Enhancements, 🔄 In Progress, Notes (+5 more)

### Community 16 - "Community 16"
Cohesion: 0.15
Nodes (12): background_color, description, display, icons, id, lang, name, orientation (+4 more)

### Community 17 - "Community 17"
Cohesion: 0.17
Nodes (12): 1. Priority Loading (Above the fold), 2. Lazy Loading (Below the fold), 3. Responsive Sizes, code:jsx (import Image from "next/image";), code:jsx (<Image), code:jsx (<Image), code:jsx (<Image), code:jsx (<Image) (+4 more)

### Community 18 - "Community 18"
Cohesion: 0.12
Nodes (14): astHash(), containsEdges, fileNodes, graph, graphPath, inferredCalls, manifest, manifestPath (+6 more)

### Community 19 - "Community 19"
Cohesion: 0.12
Nodes (15): 1. Replace the master image, 2. Regenerate all icon sizes, 3. Bump cache-bust revisions, 4. Deploy, 5. Update graphify, 6. Verify, Brand logo & favicon maintenance, Checklist — every icon change (+7 more)

### Community 21 - "Community 21"
Cohesion: 0.22
Nodes (8): compilerOptions, paths, exclude, @/*, typeAcquisition, disableFilenameBasedTypeAcquisition, enable, exclude

### Community 24 - "Community 24"
Cohesion: 0.25
Nodes (7): abril, bad, gv, inter, lora, pt, sevillana

### Community 25 - "Community 25"
Cohesion: 0.29
Nodes (3): categories, galleryImages, metadata

### Community 28 - "Community 28"
Cohesion: 0.50
Nodes (3): description, name, version

### Community 33 - "Community 33"
Cohesion: 0.13
Nodes (9): bgReveal, captionReveal, descriptions, galleryItemVariants, galleryViewport, HERO_VIDEO_PROPS, imageReveal, images (+1 more)

### Community 37 - "Community 37"
Cohesion: 0.53
Nodes (8): int, Path, build_square(), main(), Generates the full favicon / PWA icon suite from public/salon-logo-2026.jpg., save_ico(), save_png(), save_svg_wrapper()

### Community 40 - "Community 40"
Cohesion: 0.06
Nodes (39): COMPILED_INTENTS, detectEscalation(), matchFaqEntries(), resolveLocationRequest(), result, WHATSAPP_MESSAGES, conversationSchema, getAssistantModels() (+31 more)

### Community 54 - "Community 54"
Cohesion: 0.19
Nodes (14): ADDRESS_ENTRIES, collectMatches(), digitsOnly(), KNOWN_EMAILS, KNOWN_PATHS, KNOWN_PHONE_DIGITS, linkifyToNodes(), phoneHref() (+6 more)

### Community 62 - "Community 62"
Cohesion: 0.29
Nodes (7): Phase 1: Setup & Navbar ✅ **COMPLETED**, Phase 2: Hero Section, Phase 3: Footer, Phase 4: Portfolio Components, Phase 5: Contact & Other Pages, Phase 6: Final Polish, Redesign Tasks

### Community 65 - "Community 65"
Cohesion: 0.17
Nodes (11): Accuracy & escalation rules, API routes, Environment variables, History, Ken AI Assistant (Text + Voice), Known limitations (v1), Models, MongoDB collections (`beauty-admin`) (+3 more)

### Community 71 - "Community 71"
Cohesion: 0.22
Nodes (9): Completed Work (Latest Session), ✅ Critical Bug Fixes (BUG-001, BUG-002, BUG-003, BUG-006), ✅ Data Extraction & Centralized Configuration (CODE-001, CODE-002), ✅ Design System Implementation (DS-001 through DS-011), ✅ ErrorBoundary Implementation (BUG-004, BUG-005), ✅ Hero Section Mobile Responsiveness (MOB-001, MOB-002, MOB-003, MOB-004), ✅ Modern Loading Spinner Implementation (PERF-013, PERF-014, CODE-009), ✅ Navbar Mobile Responsiveness (MOB-006, MOB-007, MOB-008) (+1 more)

### Community 75 - "Community 75"
Cohesion: 0.29
Nodes (7): code:css (/* Heading Styles */), code:css (/* Margin Utilities */), code:css (/* Mobile First Approach */), Global Design System, Phase 2: Typography Utilities, Phase 3: Spacing Utilities, Phase 4: Responsive Mixins

### Community 76 - "Community 76"
Cohesion: 0.43
Nodes (4): drainReader(), playFromBlob(), playMpegResponse(), playWithMediaSource()

### Community 80 - "Community 80"
Cohesion: 0.40
Nodes (5): Accessibility, Code Quality, Mobile, Performance, Success Metrics

### Community 82 - "Community 82"
Cohesion: 0.40
Nodes (5): App Install Banner Testing (from TESTING_APP_BANNER), Changelog Snapshot (from CHANGELOG), iOS WebView Tel: Link Fix (from IOS_WEBVIEW_TEL_FIX), Merged References (formerly separate docs), Project Overview & Setup (from README)

### Community 83 - "Community 83"
Cohesion: 0.25
Nodes (7): cSpell.ignorePaths, cSpell.words, files.watcherExclude, **/graphify-out/cache/**, search.exclude, **/graphify-out/cache/**, **/graphify-out/graph.html

### Community 87 - "Community 87"
Cohesion: 0.10
Nodes (20): getCategoryImage(), isMenSection(), SERVICE_CATEGORY_IMAGES, CATEGORY_ICONS, CategoryAccordion(), CategoryBanner(), CategoryFocusView(), CategoryTile() (+12 more)

### Community 88 - "Community 88"
Cohesion: 0.07
Nodes (27): buildCatalogContext(), formatCategoryOverview(), getCachedCatalog(), loadCatalog(), localeCaches, buildServiceSections(), BusinessSchema, BusinessServiceCategorySchema (+19 more)

### Community 89 - "Community 89"
Cohesion: 0.40
Nodes (5): code:css (/* Main Theme */), code:css (:root {), Current Color Variables (to be organized), Phase 1: Color System, Proposed Organized Structure

### Community 90 - "Community 90"
Cohesion: 0.22
Nodes (8): Cloudinary media, Configuration, Endpoints, History, Pricing (render order), Public API Integration (Admin System), Service catalog, Tree rules

### Community 92 - "Community 92"
Cohesion: 0.40
Nodes (5): File Naming Convention, Key Principles, Migration Strategy, Modern Redesign (Priority: HIGH) 🎨, Overview

## Knowledge Gaps
- **468 isolated node(s):** `extends`, `@/*`, `enable`, `disableFilenameBasedTypeAcquisition`, `exclude` (+463 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Image` connect `Community 42` to `Community 4`, `Community 20`, `Community 23`, `Community 25`, `Community 33`, `Community 34`, `Community 37`, `Community 38`, `Community 39`, `Community 41`, `Community 53`, `Community 67`, `Community 68`, `Community 69`, `Community 70`, `Community 72`, `Community 73`, `Community 87`, `Community 94`, `Community 99`, `Community 102`, `Community 104`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `Ken Beauty Salon - Comprehensive Improvement Plan` connect `Community 5` to `Community 2`, `Community 71`, `Community 7`, `Community 75`, `Community 12`, `Community 13`, `Community 14`, `Community 80`, `Community 82`, `Community 92`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `ServiceMenu()` connect `Community 88` to `Community 87`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `extends`, `@/*`, `enable` to the rest of the system?**
  _469 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.043478260869565216 - nodes in this community are weakly interconnected._