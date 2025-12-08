# Component Development Patterns Guide

This document outlines the patterns, libraries, and conventions used in the Ken Beauty Salon project. Follow these patterns when creating new components to ensure consistency, maintainability, and best practices.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Component Structure](#component-structure)
3. [Styling Patterns](#styling-patterns)
4. [Animation Patterns](#animation-patterns)
5. [Icon Patterns](#icon-patterns)
6. [Image Optimization](#image-optimization)
7. [Accessibility Patterns](#accessibility-patterns)
8. [File Naming Conventions](#file-naming-conventions)
9. [Code Organization](#code-organization)
10. [Best Practices](#best-practices)

---

## Technology Stack

### Core Framework

- **Next.js 14.2.13** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - (Optional, but recommended for type safety)

### Key Libraries

#### Animation

- **framer-motion ^11.5.6** - Animation library for React
  - Used for: Page transitions, component animations, hover effects, scroll animations

#### Icons

- **lucide-react ^0.556.0** - Modern icon library (PRIMARY)
- **react-icons ^5.3.0** - Alternative icon library (legacy, being phased out)

#### UI Components

- **swiper ^11.1.14** - Touch slider/carousel component

#### Analytics

- **@vercel/analytics ^1.3.1** - Analytics tracking

#### Styling

- **CSS Modules** - Component-scoped styling (PRIMARY)
- **Tailwind CSS ^3.4.1** - Utility-first CSS (minimal usage)
- **PostCSS ^8** - CSS processing

---

## Component Structure

### Basic Component Template

```jsx
"use client"; // Required for client-side features (state, effects, animations)

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconName } from "lucide-react";
import styles from "./ComponentName.modern.module.css";

export default function ComponentName() {
  // State management
  const [state, setState] = useState(null);

  // Effects
  useEffect(() => {
    // Effect logic
  }, []);

  return (
    <motion.section
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Component content */}
    </motion.section>
  );
}
```

### Component Structure Checklist

- [ ] Use `"use client"` directive for client components
- [ ] Import React hooks at the top
- [ ] Import Next.js components (Image, Link)
- [ ] Import framer-motion for animations
- [ ] Import icons from lucide-react
- [ ] Import CSS module styles
- [ ] Use default export for main component
- [ ] Wrap main container with `motion` component
- [ ] Use semantic HTML elements
- [ ] Add proper accessibility attributes

---

## Styling Patterns

### CSS Modules

**File Naming**: `ComponentName.modern.module.css`

**Import Pattern**:

```jsx
import styles from "./ComponentName.modern.module.css";
```

**Usage Pattern**:

```jsx
<div className={styles.container}>
  <h1 className={styles.title}>Title</h1>
</div>
```

**⚠️ CRITICAL: Always Use Direct Class Names - NO Nested Selectors**

❌ **Don't use nested selectors**:

```css
/* BAD - Nested selector */
.textContent h3 {
  color: var(--color-text-primary);
}

.textContent p {
  font-size: var(--font-size-base);
}
```

```jsx
/* BAD - No class on child elements */
<div className={styles.textContent}>
  <h3>Title</h3>
  <p>Description</p>
</div>
```

✅ **Do use direct class names**:

```css
/* GOOD - Direct class names */
.textContent {
  /* Container styles */
}

.textContentTitle {
  color: var(--color-text-primary);
}

.textContentDescription {
  font-size: var(--font-size-base);
}
```

```jsx
/* GOOD - Each element has its unique class */
<div className={styles.textContent}>
  <h3 className={styles.textContentTitle}>Title</h3>
  <p className={styles.textContentDescription}>Description</p>
</div>
```

**Why?**

- Prevents style conflicts and specificity issues
- Better for CSS Modules scoping
- More maintainable and explicit
- Easier to debug
- Follows React/Next.js best practices
- Each element should have its own unique class name

### CSS Variables (Global Design System)

**Location**: `ken/src/app/globals.css`

**Always use CSS variables instead of hardcoded colors/values:**

#### Color Variables

```css
/* Primary Colors */
var(--color-primary)
var(--color-primary-light)
var(--color-primary-dark)

/* Secondary Colors */
var(--color-secondary)
var(--color-secondary-light)
var(--color-secondary-dark)

/* Text Colors */
var(--color-text-primary)
var(--color-text-secondary)
var(--color-text-tertiary)
var(--color-text-inverse)
var(--color-text-hover)

/* Background Colors */
var(--color-bg-primary)
var(--color-bg-secondary)
var(--color-bg-dark)

/* UI Element Colors */
var(--color-whatsapp)
var(--color-whatsapp-hover)
var(--color-error)
var(--color-link)
var(--color-link-hover)
```

#### Spacing Variables

```css
var(--spacing-1)   /* 4px */
var(--spacing-2)   /* 8px */
var(--spacing-3)   /* 12px */
var(--spacing-4)   /* 16px */
var(--spacing-5)   /* 20px */
var(--spacing-6)   /* 24px */
var(--spacing-8)   /* 32px */
var(--spacing-10)  /* 40px */
var(--spacing-12)  /* 48px */
var(--spacing-16)  /* 64px */
var(--spacing-20)  /* 80px */
```

#### Typography Variables

```css
/* Font Sizes */
var(--font-size-xs)    /* 12px */
var(--font-size-sm)    /* 14px */
var(--font-size-base)  /* 16px */
var(--font-size-lg)    /* 18px */
var(--font-size-xl)    /* 20px */
var(--font-size-2xl)   /* 24px */
var(--font-size-3xl)   /* 30px */
var(--font-size-4xl)   /* 36px */
var(--font-size-5xl)   /* 48px */
var(--font-size-6xl)   /* 60px */

/* Font Weights */
var(--font-weight-light)     /* 300 */
var(--font-weight-normal)    /* 400 */
var(--font-weight-medium)   /* 500 */
var(--font-weight-semibold)  /* 600 */
var(--font-weight-bold)      /* 700 */

/* Line Heights */
var(--line-height-tight)     /* 1.25 */
var(--line-height-normal)    /* 1.5 */
var(--line-height-relaxed)   /* 1.75 */
var(--line-height-loose)     /* 2 */
```

#### Border Radius Variables

```css
var(--radius-sm)    /* 4px */
var(--radius-md)    /* 8px */
var(--radius-lg)    /* 12px */
var(--radius-xl)    /* 16px */
var(--radius-2xl)   /* 24px */
var(--radius-full)  /* 9999px */
```

#### Glass Effect Variables

```css
/* Glass Backgrounds */
var(--glass-white-light)
var(--glass-white-medium)
var(--glass-white-strong)
var(--glass-teal-light)
var(--glass-teal-medium)
var(--glass-transparent)

/* Glass Borders */
var(--glass-border-light)
var(--glass-border-medium)
var(--glass-border-strong)

/* Glass Blur */
var(--glass-blur-sm)  /* 5px */
var(--glass-blur-md)  /* 10px */
var(--glass-blur-lg)  /* 15px */
var(--glass-blur-xl)  /* 20px */
```

#### Shadow Variables

```css
var(--shadow-light)
var(--shadow-medium)
var(--shadow-heavy)
var(--shadow-card)
var(--shadow-card-hover)
var(--shadow-button)
var(--shadow-button-hover)
```

#### Overlay Variables

```css
var(--overlay-white-65)
var(--overlay-white-90)
var(--overlay-white-95)
var(--overlay-white-98)
var(--overlay-beige)
var(--overlay-secondary)
var(--overlay-black-04)
var(--overlay-black-10)
```

### Responsive Design Pattern

```css
/* Mobile First Approach */
.component {
  /* Base mobile styles */
  padding: var(--spacing-4);
  font-size: var(--font-size-base);
}

/* Tablet (768px and below) */
@media (max-width: 768px) {
  .component {
    padding: var(--spacing-3);
    font-size: var(--font-size-sm);
  }
}

/* Large phones (480px and below) */
@media (max-width: 480px) {
  .component {
    padding: var(--spacing-2);
    font-size: var(--font-size-sm);
  }
}

/* Small phones (360px and below) */
@media (max-width: 360px) {
  .component {
    padding: var(--spacing-2);
  }
}
```

### Mobile Padding Pattern (Account for Fixed Navbar)

```css
.page {
  /* Account for fixed navbar (5rem) + banner + spacing */
  padding-top: calc(
    var(--app-banner-height, 0px) + 5rem + var(--spacing-6) + env(safe-area-inset-top, 0px)
  );
  padding-left: max(
    clamp(var(--spacing-4), 5vw, var(--spacing-7)),
    env(safe-area-inset-left, 0px)
  );
  padding-right: max(
    clamp(var(--spacing-4), 5vw, var(--spacing-7)),
    env(safe-area-inset-right, 0px)
  );
}
```

---

## Animation Patterns

### Framer Motion Basics

**Import**:

```jsx
import { motion, AnimatePresence } from "framer-motion";
```

### Common Animation Patterns

#### 1. Fade In Animation

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

#### 2. Slide Up Animation

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  Content
</motion.div>
```

#### 3. Staggered Children Animation

```jsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }}
>
  <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
    Item 1
  </motion.div>
  <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
    Item 2
  </motion.div>
</motion.div>
```

#### 4. Scroll-Triggered Animation

```jsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

#### 5. Hover Animation

```jsx
<motion.div
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Interactive Element
</motion.div>
```

#### 6. Page Entrance Animation

```jsx
<motion.div
  className={styles.page}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  Page Content
</motion.div>
```

### Animation Timing

- **Fast**: 150-200ms (micro-interactions)
- **Base**: 300-600ms (standard animations)
- **Slow**: 800-1000ms (page transitions)

### Easing Functions

```jsx
// Standard easing
ease: "easeOut";

// Custom easing
ease: [0.22, 1, 0.36, 1]; // Smooth cubic bezier

// Built-in easings
ease: "easeIn";
ease: "easeInOut";
ease: "linear";
```

---

## Icon Patterns

### Lucide React Icons (PRIMARY)

**Import Pattern**:

```jsx
import { Phone, Mail, MessageCircle, ArrowRight, MapPin } from "lucide-react";
```

**Usage Pattern**:

```jsx
<Phone className={styles.icon} size={20} />
<Mail className={styles.icon} size={24} />
```

**Icon Sizing**:

- Small: `size={16}` or `size={18}`
- Medium: `size={20}` or `size={24}`
- Large: `size={28}` or `size={32}`

**Accessibility**:

```jsx
// Decorative icons (no meaning)
<IconName className={styles.icon} aria-hidden="true" />

// Semantic icons (have meaning)
<IconName className={styles.icon} aria-label="Phone number" />
```

### Common Icons Used

- **Contact**: `Phone`, `Mail`, `MessageCircle`, `MapPin`
- **Navigation**: `ArrowRight`, `ArrowLeft`, `Menu`, `X`, `Home`
- **Social**: `Instagram`, `Facebook`, `Twitter`
- **Actions**: `Send`, `Calendar`, `Check`, `X`
- **Content**: `Image`, `FileText`, `Info`, `Shield`

---

## Image Optimization

### Next.js Image Component

**Import**:

```jsx
import Image from "next/image";
```

**Basic Usage**:

```jsx
<Image
  src="/path/to/image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
  className={styles.image}
/>
```

### Image Optimization Patterns

#### 1. Priority Loading (Above the fold)

```jsx
<Image
  src={imageSrc}
  alt="Description"
  width={800}
  height={600}
  priority
  loading="eager"
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

#### 2. Lazy Loading (Below the fold)

```jsx
<Image
  src={imageSrc}
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

#### 3. Responsive Sizes

```jsx
<Image
  src={imageSrc}
  alt="Description"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### Image Best Practices

- [ ] Always provide `width` and `height` props
- [ ] Use descriptive `alt` text
- [ ] Use `priority` for above-the-fold images
- [ ] Use `loading="lazy"` for below-the-fold images
- [ ] Provide `sizes` attribute for responsive images
- [ ] Use appropriate image formats (WebP when possible)

---

## Accessibility Patterns

### Semantic HTML

```jsx
// Use semantic elements
<header>, <nav>, <main>, <section>, <article>, <aside>, <footer>
<h1>, <h2>, <h3> (proper heading hierarchy)
<button>, <a>, <form>, <input>, <label>
```

### ARIA Attributes

```jsx
// Labels
<button aria-label="Close menu">
  <X />
</button>

// Descriptions
<input
  aria-describedby="email-error"
  aria-invalid={hasError}
/>

// Live regions
<div role="alert" aria-live="polite">
  {errorMessage}
</div>

// Hidden decorative elements
<IconName aria-hidden="true" />
```

### Form Accessibility

```jsx
<div className={styles.field}>
  <label htmlFor="email" className={styles.labelText}>
    Email
  </label>
  <input
    id="email"
    type="email"
    aria-describedby="email-error"
    aria-invalid={hasError}
    aria-required="true"
  />
  {hasError && (
    <span id="email-error" className={styles.errorText} role="alert">
      {errorMessage}
    </span>
  )}
</div>
```

### Focus States

```css
/* Always style focus-visible for keyboard navigation */
.button:focus-visible {
  outline: 2px solid var(--glass-border-strong);
  outline-offset: 2px;
}

.input:focus-visible {
  outline: 3px solid var(--overlay-secondary-90);
  outline-offset: 2px;
}
```

### Color Contrast

- **Text**: Minimum 4.5:1 contrast ratio (WCAG AA)
- **Large Text**: Minimum 3:1 contrast ratio (WCAG AA)
- **Interactive Elements**: Clear focus indicators
- **Always use CSS variables** from globals.css (already optimized for contrast)

---

## File Naming Conventions

### Components

- **Modern Components**: `ComponentName.modern.jsx`
- **Legacy Components**: `ComponentName.jsx` (being phased out)

### CSS Files

- **Modern Styles**: `ComponentName.modern.module.css`
- **Legacy Styles**: `ComponentName.module.css` (kept as backup)

### Page Files

- **App Router**: `page.jsx` (Next.js 14 App Router)
- **Layout Files**: `layout.jsx`

### Constants/Config

- **Constants**: `constants.js` or `config/constants.js`
- **Data**: `data/` directory

### Example Structure

```
src/
├── components/
│   ├── contact/
│   │   ├── ContactContent.jsx
│   │   └── Contact.modern.module.css
│   ├── hero/
│   │   ├── Hero.modern.jsx
│   │   └── Hero.modern.module.css
│   └── navbar/
│       ├── Navbar.modern.jsx
│       └── Navbar.modern.module.css
├── app/
│   ├── (navPages)/
│   │   └── contact/
│   │       └── page.jsx
│   └── globals.css
└── config/
    └── constants.js
```

---

## Code Organization

### Import Order

```jsx
// 1. React and Next.js
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// 2. Third-party libraries
import { motion } from "framer-motion";
import { IconName } from "lucide-react";

// 3. Internal modules
import { CONSTANTS } from "@/config/constants";
import { data } from "@/data/data";

// 4. Styles
import styles from "./ComponentName.modern.module.css";
```

### Component Organization

```jsx
"use client";

// 1. Imports
import ...

// 2. Constants/Helpers (if needed)
const helperFunction = () => { ... };

// 3. Sub-components (if needed)
const SubComponent = ({ prop }) => { ... };

// 4. Main Component
export default function ComponentName() {
  // 4a. State
  const [state, setState] = useState(null);

  // 4b. Effects
  useEffect(() => { ... }, []);

  // 4c. Handlers
  const handleClick = () => { ... };

  // 4d. Render
  return (
    <motion.div>
      {/* JSX */}
    </motion.div>
  );
}
```

### CSS Organization

```css
/* 1. Container/Base Styles */
.container {
  ...;
}

/* 2. Layout Styles */
.grid {
  ...;
}
.flex {
  ...;
}

/* 3. Typography */
.title {
  ...;
}
.subtitle {
  ...;
}

/* 4. Interactive Elements */
.button {
  ...;
}
.button:hover {
  ...;
}
.button:focus-visible {
  ...;
}

/* 5. Responsive Styles */
@media (max-width: 768px) {
  ...;
}
@media (max-width: 480px) {
  ...;
}
```

---

## Best Practices

### 1. Always Use CSS Variables

❌ **Don't**:

```css
color: #3d2f2d;
padding: 16px;
font-size: 18px;
```

✅ **Do**:

```css
color: var(--color-text-primary);
padding: var(--spacing-4);
font-size: var(--font-size-lg);
```

### 2. Mobile-First Responsive Design

❌ **Don't**:

```css
.desktop {
  ...;
}
@media (max-width: 768px) {
  .mobile {
    ...;
  }
}
```

✅ **Do**:

```css
.component {
  /* Mobile styles first */
  padding: var(--spacing-4);
}

@media (min-width: 769px) {
  .component {
    /* Desktop styles */
    padding: var(--spacing-6);
  }
}
```

### 3. Semantic HTML

❌ **Don't**:

```jsx
<div onClick={handleClick}>Click me</div>
```

✅ **Do**:

```jsx
<button onClick={handleClick} className={styles.button}>
  Click me
</button>
```

### 4. Proper Image Usage

❌ **Don't**:

```jsx
<img src="/image.jpg" alt="image" />
```

✅ **Do**:

```jsx
<Image
  src="/image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
  className={styles.image}
/>
```

### 5. Animation Performance

❌ **Don't**:

```jsx
<motion.div
  animate={{ x: [0, 100, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
>
```

✅ **Do**:

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
>
```

### 6. Accessibility First

❌ **Don't**:

```jsx
<IconName />
<input type="text" />
```

✅ **Do**:

```jsx
<IconName aria-hidden="true" />
<input
  type="text"
  aria-label="Email address"
  aria-required="true"
/>
```

### 7. Error Handling

```jsx
// Always handle errors gracefully
const [error, setError] = useState(null);

try {
  // Operation
} catch (err) {
  setError(err.message);
}

{
  error && (
    <div role="alert" className={styles.error}>
      {error}
    </div>
  );
}
```

### 8. Form Validation

```jsx
// Client-side validation
const handleSubmit = (e) => {
  e.preventDefault();
  const form = e.target;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Submit form
};
```

---

## Quick Reference Checklist

When creating a new component:

- [ ] Use `"use client"` directive
- [ ] Import required libraries (framer-motion, lucide-react, Next.js)
- [ ] Use CSS modules for styling
- [ ] Use CSS variables from globals.css (no hardcoded values)
- [ ] Add framer-motion animations
- [ ] Use semantic HTML elements
- [ ] Add accessibility attributes (aria-labels, roles)
- [ ] Implement responsive design (mobile-first)
- [ ] Use Next.js Image component
- [ ] Add proper focus states
- [ ] Follow file naming conventions
- [ ] Organize imports properly
- [ ] Add error handling
- [ ] Test on multiple devices

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

**Last Updated**: 2025-01-27
**Maintained By**: Development Team
