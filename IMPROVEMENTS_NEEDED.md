# App Improvements Needed

This document outlines all areas where the application can be improved, organized by priority and category.

**Last Updated**: 2025-01-27

---

## Table of Contents

1. [Critical Issues](#critical-issues)
2. [High Priority Improvements](#high-priority-improvements)
3. [Medium Priority Improvements](#medium-priority-improvements)
4. [Low Priority Improvements](#low-priority-improvements)
5. [Code Quality Improvements](#code-quality-improvements)
6. [Performance Optimizations](#performance-optimizations)
7. [Accessibility Improvements](#accessibility-improvements)
8. [Modernization Tasks](#modernization-tasks)

---

## Critical Issues

### 1. Layout.jsx ClassName Error ⚠️

**Location**: `ken/src/app/layout.jsx` (line 40)

**Issue**: 
```jsx
className={`${inter.className}, ${lora.className}`}
```

**Problem**: Comma creates invalid CSS class name. Should be space-separated.

**Fix**:
```jsx
className={`${inter.className} ${lora.className}`}
```

**Priority**: 🔴 CRITICAL

---

## High Priority Improvements

### 2. Portfolio Components Modernization (27 Components)

**Location**: `ken/src/components/portfolio/`

**Issue**: All 27 portfolio components still use old CSS files (`.module.css`) instead of modern styling.

**Components Affected**:
- `aPageOne` through `zPageTwentySeven` (27 components)
- All use `ComponentName.module.css` instead of `ComponentName.modern.module.css`

**Required Actions**:
1. Create modern CSS files for each component
2. Migrate to use CSS variables from globals.css
3. Add framer-motion animations
4. Replace react-icons with lucide-react (if used)
5. Improve mobile responsiveness
6. Add accessibility attributes

**Priority**: 🟠 HIGH

**Estimated Impact**: Large - affects 27 components

---

### 3. Gallery Page Modernization

**Location**: `ken/src/app/(navPages)/gallery/`

**Files**:
- `Gallery.jsx`
- `Gallery.module.css`

**Issues**:
- Using old CSS module (not `.modern.module.css`)
- May not be using CSS variables
- Missing framer-motion animations
- May not be fully responsive
- Missing accessibility attributes

**Required Actions**:
1. Create `Gallery.modern.module.css`
2. Migrate to CSS variables
3. Add framer-motion animations
4. Improve mobile responsiveness
5. Add accessibility attributes
6. Optimize images

**Priority**: 🟠 HIGH

---

### 4. About Page Modernization

**Location**: `ken/src/app/(navPages)/about/page.jsx`

**Issues**:
- May not have modern styling
- Missing animations
- May not be using CSS variables
- Missing accessibility attributes

**Required Actions**:
1. Check current implementation
2. Create modern CSS module if needed
3. Add framer-motion animations
4. Migrate to CSS variables
5. Improve accessibility

**Priority**: 🟠 HIGH

---

### 5. Drinks Page Modernization

**Location**: `ken/src/app/(navPages)/drinks/`

**Files**:
- `page.jsx`
- `DrinksMenu.jsx` (in components)
- `DrinksMenu.module.css`

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

### 6. AppInstallBanner Component

**Location**: `ken/src/components/AppInstallBanner/`

**Files**:
- `AppInstallBanner.jsx`
- `AppInstallBanner.module.css`

**Issues**:
- Using old CSS module
- May have hardcoded colors
- Missing modern styling patterns

**Required Actions**:
1. Create `AppInstallBanner.modern.module.css`
2. Migrate to CSS variables
3. Add framer-motion animations
4. Follow modern patterns

**Priority**: 🟠 HIGH

---

### 7. InstagramEmbed Component

**Location**: `ken/src/components/instagram/`

**Files**:
- `InstagramEmbed.jsx`
- `InstagramEmbed.module.css`

**Issues**:
- Using old CSS module
- May have hardcoded colors
- Missing modern styling

**Required Actions**:
1. Create `InstagramEmbed.modern.module.css`
2. Migrate to CSS variables
3. Add animations if appropriate

**Priority**: 🟠 HIGH

---

### 8. HamburgerButton Component

**Location**: `ken/src/components/navbar/HamburgerButton/`

**Files**:
- `HamburgerButton.jsx`
- `HamburgerButton.module.css`

**Issues**:
- Using old CSS module
- May have hardcoded colors
- Missing modern styling

**Required Actions**:
1. Create `HamburgerButton.modern.module.css`
2. Migrate to CSS variables
3. Add framer-motion animations

**Priority**: 🟠 HIGH

---

## Medium Priority Improvements

### 9. Legacy Component Cleanup

**Location**: Multiple locations

**Files to Review**:
- `ken/src/components/hero/Hero.jsx` (old version)
- `ken/src/components/hero/hero-old.jsx` (backup)
- `ken/src/components/hero/Hero.module.css` (old CSS)
- `ken/src/components/hero/Hero.module-old.css` (backup)
- `ken/src/components/footer/Footer.jsx` (old version)
- `ken/src/components/footer/Footer.module.css` (old CSS)
- `ken/src/components/navbar/Navbar.jsx` (old version)
- `ken/src/components/navbar/Navbar.module.css` (old CSS)
- `ken/src/components/loading/LoadingSkeleton.jsx` (old version)
- `ken/src/components/loading/LoadingSkeleton.module.css` (old CSS)

**Action**: After verifying modern components work correctly, consider removing or archiving old files.

**Priority**: 🟡 MEDIUM

---

### 10. Contact Page Legacy CSS

**Location**: `ken/src/app/(navPages)/contact/Contact.module.css`

**Issue**: Old CSS file exists alongside modern component. Should be removed after verification.

**Priority**: 🟡 MEDIUM

---

### 11. NotFound Component

**Location**: `ken/src/components/notFound/`

**Files**:
- `NotFounded.jsx` (typo in filename - should be `NotFound.jsx`)
- `NotFound.module.css`

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

**Location**: `ken/src/components/ErrorBoundary.jsx`

**Files**:
- `ErrorBoundary.jsx`
- `ErrorBoundary.module.css`

**Issues**:
- Using old CSS module
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

**Location**: `ken/src/app/page.jsx`

**Files**:
- `page.jsx`
- `mainPage.module.css`

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

**Potential Unused Files**:
- `ken/src/components/navbar/links/Links.jsx` (if not used)
- `ken/src/components/navbar/links/navLink/navLink.jsx` (if not used)
- Old component files after migration

**Action**: Audit and remove unused files.

**Priority**: 🟢 LOW

---

## Code Quality Improvements

### 17. Hardcoded Colors Audit

**Action**: Search for any remaining hardcoded color values in:
- Portfolio components
- Gallery component
- About page
- Drinks page
- Legal pages
- Other components

**Priority**: 🟡 MEDIUM

---

### 18. React Icons Migration

**Action**: Search for any remaining `react-icons` imports and replace with `lucide-react`.

**Files to Check**:
- Portfolio components
- Gallery component
- Other components

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

### 🔴 Critical (1)
1. Layout.jsx className error

### 🟠 High Priority (7)
1. Portfolio components modernization (27 components)
2. Gallery page modernization
3. About page modernization
4. Drinks page modernization
5. AppInstallBanner component
6. InstagramEmbed component
7. HamburgerButton component

### 🟡 Medium Priority (15)
1. Legacy component cleanup
2. Contact page legacy CSS
3. NotFound component
4. ErrorBoundary component
5. Legal pages styling
6. Home page styling
7. Hardcoded colors audit
8. React icons migration
9. Image optimization
10. Accessibility audit
11. Bundle size optimization
12. Animation performance
13. Form accessibility
14. Navigation accessibility
15. Standardize component structure
16. CSS variable migration

### 🟢 Low Priority (2)
1. Test pages cleanup
2. Unused files removal

---

## Recommended Implementation Order

1. **Fix Critical Issue** (Layout.jsx)
2. **High Priority Components** (Start with most visible):
   - Gallery page
   - About page
   - Drinks page
   - AppInstallBanner
   - InstagramEmbed
   - HamburgerButton
3. **Portfolio Components** (Batch process - 27 components)
4. **Medium Priority** (Code quality and accessibility)
5. **Low Priority** (Cleanup)

---

## Quick Wins

These can be done quickly and have immediate impact:

1. ✅ Fix Layout.jsx className error (5 minutes)
2. ✅ Create modern CSS for Gallery page (1-2 hours)
3. ✅ Create modern CSS for About page (1 hour)
4. ✅ Create modern CSS for AppInstallBanner (30 minutes)
5. ✅ Create modern CSS for InstagramEmbed (30 minutes)
6. ✅ Create modern CSS for HamburgerButton (30 minutes)

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

**Next Steps**: Start with critical issue, then move to high-priority components one at a time.

