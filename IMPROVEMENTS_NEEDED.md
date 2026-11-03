Last verified against code: 3 Nov 2026 (working tree)

# App Improvements Needed

This document outlines all areas where the application can be improved, organized by priority and category.

---

## Table of Contents

1. [Resolved](#resolved)
2. [Critical Issues](#critical-issues)
3. [High Priority Improvements](#high-priority-improvements)
4. [Medium Priority Improvements](#medium-priority-improvements)
5. [Low Priority Improvements](#low-priority-improvements)
6. [Code Quality Improvements](#code-quality-improvements)
7. [Performance Optimizations](#performance-optimizations)
8. [Accessibility Improvements](#accessibility-improvements)
9. [Modernization Tasks](#modernization-tasks)

---

## Resolved

✅ Resolved 1 Nov 2026

### Layout className

`src/app/layout.jsx` line 63 is `` className={`${inter.variable} ${lora.variable}`} `` with `lang="en"`. The comma-separated `className` bug is gone. This fix is in HEAD `8634780`.

### Gallery

`src/app/(navPages)/gallery/Gallery.jsx` line 6 imports `Gallery.modern.module.css`.

### About

`src/app/(navPages)/about/page.jsx` renders `Portfolio` from `src/components/portfolio/Portfolio`.

### Portfolio pages

26 page components under `src/components/portfolio/` import `*.modern.module.css` (`PageOne` through `PageSeven` and `PageNine` through `PageTwentySeven`).

`hPageEight/PageEight.jsx` is not one of those 26. It imports no CSS and renders `ContactContent`. `hPageEight/PageEight.module.css` has no importer. See the open item below.

`src/components/portfolio/Portfolio.modern.module.css` exists and has no importer. `Portfolio.jsx` does not import it.

### AppInstallBanner

`src/components/AppInstallBanner/AppInstallBanner.jsx` line 7 imports `AppInstallBanner.modern.module.css`. The banner is commented out in `src/app/layout.jsx` lines 5 and 84. That comment-out is an uncommitted working-tree change, intended by Garen. The component is not mounted.

### HamburgerButton

`src/components/loading/navbar/HamburgerButton/HamburgerButton.jsx` line 1 imports `HamburgerButton.modern.module.css`. The only importer is `src/components/loading/navbar/links/Links.jsx`, which is only imported by `src/components/loading/navbar/Navbar.jsx`. Nothing imports `Navbar.jsx`. The live nav is `MobileNavTop` and `MobileNavBottom` in `src/app/layout.jsx`.

---

## Critical Issues

None. The layout className bug is in Resolved.

---

## High Priority Improvements

### 1. Drinks page modernization

**Location**: `src/components/drinksMenu/DrinksMenu.jsx` line 7 imports `DrinksMenu.module.css`

**Issues**:
- Using old CSS module
- May not be using CSS variables
- Missing modern animations
- May not be fully responsive

**Required Actions**:
1. Create `DrinksMenu.modern.module.css`
2. Migrate to CSS variables
3. Add framer-motion animations
4. Improve mobile responsiveness

**Priority**: 🟠 HIGH

---

### 2. Portfolio page eight

**Location**: `src/components/portfolio/hPageEight/PageEight.jsx`

**Issue**: This is the only portfolio page component that does not import a `*.modern.module.css` file. It renders `ContactContent`. `PageEight.module.css` is not imported.

**Priority**: 🟠 HIGH

---

## Medium Priority Improvements

### 9. Legacy Component Cleanup

**Location**: Multiple locations

**Files with no importer** (checked 1 Nov 2026):
- `src/components/hero/Hero.jsx`
- `src/components/hero/hero-old.jsx`
- `src/components/hero/Hero.module-old.css`
- `src/components/footer/Footer.jsx` and `src/components/footer/Footer.module.css` (live footer is `Footer.modern`)
- `src/components/loading/LoadingSkeleton.jsx` and `LoadingSkeleton.module.css` (live loader is `LoadingSkeleton.modern`)
- `src/components/loading/navbar/Navbar.jsx` and `src/components/loading/navbar/links/Links.jsx` (not `src/components/navbar/`)
- `src/components/loading/navbar/Navbar.modern.jsx` (also has no importer; live nav is `MobileNavTop` / `MobileNavBottom`)

`src/components/hero/Hero.module.css` is imported only by `Hero.jsx` and `hero-old.jsx`. Those two files have no importer.

**Action**: These files are not imported. Removing them is still a separate change.

**Priority**: 🟡 MEDIUM

---

### 10. Contact Page Legacy CSS

**Location**:
- `src/app/(navPages)/contact/Contact.module.css` (not imported; `ContactContent.jsx` uses `Contact.modern.module.css`)
- `src/components/contact/contactOldtest.jsx` (not imported)

**Priority**: 🟡 MEDIUM

---

### 11. NotFound Component

**Location**: `src/components/notFound/NotFounded.jsx`

`src/app/not-found.jsx` lines 1 and 6 import and render `NotFounded`. The stylesheet is `NotFound.module.css`. The filename typo is still there.

**Issues**:
- Typo in filename
- Using old CSS module
- May have hardcoded colors
- Missing modern styling

**Required Actions**:
1. Rename `NotFounded.jsx` to `NotFound.jsx`
2. Update all imports
3. Create `NotFound.modern.module.css`
4. Migrate to CSS variables
5. Add framer-motion animations

**Priority**: 🟡 MEDIUM

---

### 12. ErrorBoundary Component

**Location**: `src/components/ErrorBoundary.jsx` line 5 imports `ErrorBoundary.module.css`

The component is implemented and used. The open item is the old CSS module, not a missing error boundary.

**Issues**:
- Using `ErrorBoundary.module.css`
- May have hardcoded colors
- Missing modern styling

**Required Actions**:
1. Create `ErrorBoundary.modern.module.css`
2. Migrate to CSS variables
3. Improve styling

**Priority**: 🟡 MEDIUM

---

### 13. Legal Pages Styling

**Location**: 
- `ken/src/app/privacy/`
- `ken/src/app/terms-of-use/`
- `ken/src/app/imprint/`
- `ken/src/app/cookie-notice/`
- `ken/src/app/deleteAccount/`

**Issues**:
- All using old CSS modules
- May have hardcoded colors
- Missing modern styling
- May not be fully responsive

**Required Actions**:
1. Create modern CSS modules for each
2. Migrate to CSS variables
3. Add framer-motion animations
4. Improve mobile responsiveness

**Priority**: 🟡 MEDIUM

---

### 14. Home Page (Main Page)

**Location**: `src/app/page.jsx` line 13 imports `mainPage.module.css`

**Issues**:
- Using old CSS module
- May have hardcoded colors
- Missing modern styling

**Required Actions**:
1. Review current implementation
2. Create `mainPage.modern.module.css` if needed
3. Migrate to CSS variables
4. Add animations

**Priority**: 🟡 MEDIUM

---

## Low Priority Improvements

### 15. Test Pages Cleanup

**Location**:
- `ken/src/app/test-loading/`
- `ken/src/app/test-error/`

**Action**: Consider removing or moving to a `/dev` or `/test` route group after development.

**Priority**: 🟢 LOW

---

### 16. Unused Files

**Location**: Various

**Confirmed unused on 1 Nov 2026**: see Legacy Component Cleanup above, plus `src/app/test-loading` and `src/app/test-error`.

`src/components/navbar/links/Links.jsx` is the wrong path. The file that exists is `src/components/loading/navbar/links/Links.jsx`, and it is only imported by the unused `Navbar.jsx`.

`src/components/navbar/links/navLink/navLink.jsx`: unverified (that path was not found in this check).

**Action**: Audit and remove unused files.

**Priority**: 🟢 LOW

---

## Code Quality Improvements

### 17. Hardcoded Colors Audit

**Status**: On 1 Nov 2026, `src` CSS contained 117 matches of `#[0-9A-Fa-f]{3,8}`. That count includes every hex in `src` CSS, not a per-component audit.

**Priority**: 🟡 MEDIUM

---

### 18. React Icons Migration

**Status**: `react-icons` remains in:
- `src/components/DraggableWhatsAppButton/DraggableWhatsAppButton.jsx` (live; imported by `src/app/page.jsx`)
- `src/components/hero/Hero.jsx` (no importer)
- `src/components/hero/hero-old.jsx` (no importer)

**Priority**: 🟡 MEDIUM

---

### 19. Image Optimization

**Action**: Ensure all images use Next.js `Image` component with:
- Proper `width` and `height`
- `priority` for above-the-fold images
- `loading="lazy"` for below-the-fold images
- `sizes` attribute for responsive images
- Descriptive `alt` text

**Priority**: 🟡 MEDIUM

---

### 20. Accessibility Audit

**Action**: Review all components for:
- Proper semantic HTML
- ARIA labels where needed
- Focus states
- Keyboard navigation
- Screen reader support

**Priority**: 🟡 MEDIUM

---

## Performance Optimizations

### 21. Bundle Size Optimization

**Action**: 
- Check for unused imports
- Lazy load heavy components
- Optimize images
- Code splitting

**Priority**: 🟡 MEDIUM

---

### 22. Animation Performance

**Action**: 
- Ensure animations use `transform` and `opacity` (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Respect `prefers-reduced-motion`

**Priority**: 🟡 MEDIUM

---

## Accessibility Improvements

### 23. Form Accessibility

**Action**: Ensure all forms have:
- Proper label-input associations
- Error messages with `role="alert"`
- `aria-describedby` for error messages
- `aria-required` for required fields
- Focus management

**Priority**: 🟡 MEDIUM

---

### 24. Navigation Accessibility

**Action**: Ensure navigation has:
- Proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Skip links

**Priority**: 🟡 MEDIUM

---

## Modernization Tasks

### 25. Standardize Component Structure

**Action**: Ensure all components follow the pattern in `FOLLOW_PATTERNS.md`:
- Use `"use client"` directive
- Import order consistency
- CSS module naming
- Animation patterns
- Accessibility patterns

**Priority**: 🟡 MEDIUM

---

### 26. CSS Variable Migration

**Action**: Complete migration of all components to use CSS variables from `globals.css`:
- Colors
- Spacing
- Typography
- Shadows
- Overlays
- Glass effects

**Priority**: 🟡 MEDIUM

---

## Summary by Priority

### Critical (0)

None.

### High Priority (2)

1. Drinks page (`DrinksMenu.jsx` line 7 imports `DrinksMenu.module.css`)
2. Portfolio `PageEight` (no modern CSS import)

### Medium Priority

1. Legacy files with no importer
2. Contact `Contact.module.css` and `contactOldtest.jsx`
3. `NotFounded.jsx` filename
4. `ErrorBoundary.module.css`
5. Legal pages styling (not re-audited on 1 Nov 2026)
6. Home page `mainPage.module.css`
7. 117 hardcoded hex colours in `src` CSS
8. `react-icons` in the three files listed above
9. Image optimization (not re-audited)
10. Accessibility audit (not re-audited)
11. Bundle size (not re-audited)
12. Animation performance (not re-audited)
13. Form accessibility (not re-audited)
14. Navigation accessibility (not re-audited)
15. Standardize component structure (not re-audited)
16. CSS variable migration (not re-audited)

### Low Priority (2)

1. `src/app/test-loading` and `src/app/test-error`
2. Unused files listed under Legacy Component Cleanup

---

## Recommended Implementation Order

1. Drinks page and portfolio `PageEight`
2. Remove or archive the unused legacy files after a fresh import check
3. `NotFounded` rename, `ErrorBoundary` CSS, home page CSS, contact leftovers
4. Hex colours and the live `react-icons` import in `DraggableWhatsAppButton`
5. Items marked "not re-audited" only after they are checked against the code

---

## Quick Wins

Done on 1 Nov 2026: layout className, Gallery modern CSS, About rendering Portfolio, 26 portfolio page CSS modules, AppInstallBanner modern CSS (not mounted), HamburgerButton modern CSS (not on the live nav).

Removed 3 Nov 2026: unused `InstagramEmbed` and the Tidio and LightWidget config. Instagram, TikTok, Facebook, and YouTube profile links stay.

Still small and open:

1. Delete or archive the unused files listed above
2. Rename `NotFounded.jsx` and update `src/app/not-found.jsx`

---

## Notes

- Always create `.modern.module.css` files alongside old ones
- Keep old files as backup until new ones are verified
- Follow patterns in `FOLLOW_PATTERNS.md`
- Use CSS variables from `globals.css`
- Add framer-motion animations
- Ensure mobile responsiveness
- Add accessibility attributes

---

**Next Steps**: Drinks page and portfolio `PageEight`, then the unused files.

