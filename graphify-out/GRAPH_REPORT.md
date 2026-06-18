# Graph Report - ken  (2026-06-18)

## Corpus Check
- 97 files · ~603,659 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 743 nodes · 701 edges · 89 communities (60 shown, 29 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cf90a41a`
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
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]

## God Nodes (most connected - your core abstractions)
1. `Ken Beauty Salon - Comprehensive Improvement Plan` - 17 edges
2. `Component Development Patterns Guide` - 14 edges
3. `App Improvements Needed` - 14 edges
4. `Google Lighthouse Audit Report - Contact Page` - 12 edges
5. `Implementation Plan` - 10 edges
6. `Detailed Todo List` - 10 edges
7. `Best Practices` - 9 edges
8. `Issues Checked` - 8 edges
9. `CSS Variables (Global Design System)` - 8 edges
10. `High Priority Improvements` - 8 edges

## Surprising Connections (you probably didn't know these)
- `ServicesPage()` --calls--> `buildServiceSections()`  [INFERRED]
  src/app/(navPages)/services/page.jsx → src/lib/business/serviceCatalog.js
- `ServicesPage()` --calls--> `getServiceCatalog()`  [INFERRED]
  src/app/(navPages)/services/page.jsx → src/lib/business/serviceCatalog.js
- `getWhatsAppUrl()` --calls--> `formatPhoneForTel()`  [INFERRED]
  src/components/contact/contactOldtest.jsx → src/config/constants.js
- `StoreInfo()` --calls--> `getTelLink()`  [INFERRED]
  src/components/contact/contactOldtest.jsx → src/config/constants.js
- `ContactContent()` --calls--> `getTelLink()`  [INFERRED]
  src/components/contact/contactOldtest.jsx → src/config/constants.js

## Communities (89 total, 29 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (36): Analytics, Animation, Basic Component Template, Code Organization, code:jsx ("use client"; // Required for client-side features (state, e), code:jsx (import { Phone, Mail, MessageCircle, ArrowRight, MapPin } fr), code:jsx (<Phone className={styles.icon} size={20} />), code:jsx (// Decorative icons (no meaning)) (+28 more)

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
Nodes (20): APP_STORES, BUSINESS, CONTACT, formatPhoneForTel(), getSpecialPeriodLogo(), getTelLink(), IMAGES, SOCIAL_HANDLES (+12 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (41): Accessibility, App Install Banner Testing (from TESTING_APP_BANNER), Changelog Snapshot (from CHANGELOG), Code Quality, code:css (/* Main Theme */), code:css (:root {), code:css (/* Heading Styles */), code:css (/* Margin Utilities */) (+33 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (27): Border Radius Variables, code:css (/* Font Sizes */), code:css (var(--radius-sm)    /* 4px */), code:css (/* Glass Backgrounds */), code:css (var(--shadow-light)), code:css (var(--overlay-white-65)), code:css (/* Mobile First Approach */), code:css (.page {) (+19 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (24): 10. **Hardcoded Data** ✅ **RESOLVED**, 11. **Inconsistent Naming**, 12. **Unused Environment Variable**, 13. **Poor Alt Text**, 14. **Missing ARIA Labels**, 15. **Missing Semantic HTML**, 16. **Missing OpenGraph Images**, 17. **Hardcoded URLs** (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (24): dependencies, framer-motion, lucide-react, mongoose, next, react, react-dom, react-icons (+16 more)

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
Cohesion: 0.20
Nodes (10): Accessibility Patterns, ARIA Attributes, code:jsx (// Use semantic elements), code:jsx (// Labels), code:jsx (<div className={styles.field}>), code:css (/* Always style focus-visible for keyboard navigation */), Color Contrast, Focus States (+2 more)

### Community 19 - "Community 19"
Cohesion: 0.17
Nodes (12): File Naming Convention, Key Principles, Migration Strategy, Modern Redesign (Priority: HIGH) 🎨, Overview, Phase 1: Setup & Navbar ✅ **COMPLETED**, Phase 2: Hero Section, Phase 3: Footer (+4 more)

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
Cohesion: 0.25
Nodes (3): descriptions, HERO_VIDEO_PROPS, images

### Community 83 - "Community 83"
Cohesion: 0.25
Nodes (7): cSpell.ignorePaths, cSpell.words, files.watcherExclude, **/graphify-out/cache/**, search.exclude, **/graphify-out/cache/**, **/graphify-out/graph.html

### Community 87 - "Community 87"
Cohesion: 0.11
Nodes (12): getCategoryImage(), isMenSection(), SERVICE_CATEGORY_IMAGES, CATEGORY_ICONS, CategoryAccordion(), CategoryBanner(), formatDuration(), formatPrice() (+4 more)

### Community 88 - "Community 88"
Cohesion: 0.13
Nodes (11): buildServiceSections(), BusinessSchema, BusinessServiceCategorySchema, BusinessServiceItemCategoryLinkSchema, BusinessServiceItemSchema, getModel(), getServiceCatalog(), connectDB (+3 more)

## Knowledge Gaps
- **393 isolated node(s):** `extends`, `@/*`, `enable`, `disableFilenameBasedTypeAcquisition`, `exclude` (+388 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Ken Beauty Salon - Comprehensive Improvement Plan` connect `Community 5` to `Community 2`, `Community 7`, `Community 12`, `Community 13`, `Community 14`, `Community 19`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `Component Development Patterns Guide` connect `Community 0` to `Community 6`, `Community 9`, `Community 11`, `Community 17`, `Community 18`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `Implementation Plan` connect `Community 2` to `Community 5`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `extends`, `@/*`, `enable` to the rest of the system?**
  _393 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.043478260869565216 - nodes in this community are weakly interconnected._