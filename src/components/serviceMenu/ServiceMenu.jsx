"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  Sparkles,
  Sun,
  Smile,
  Palette,
  User,
  Clock,
  Banknote,
  Calendar,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import {
  BOOKING_URL,
  BUSINESS_CURRENCY,
  WHATSAPP_CONTACTS,
} from "@/config/constants";
import { getCategoryImage } from "@/data/serviceImages";
import { cldResponsiveCover, cldTransform } from "@/utils/cloudinary";
import styles from "./ServiceMenu.module.css";

/* ─── Category icon map ───────────────────────────────────────────── */
const CATEGORY_ICONS = [
  { match: /hair/i, Icon: Scissors },
  { match: /nail/i, Icon: Sparkles },
  { match: /solarium|tan/i, Icon: Sun },
  { match: /facial|skin/i, Icon: Smile },
  { match: /make\s*up|makeup/i, Icon: Palette },
  { match: /barber|men|him/i, Icon: User },
];

const SERVICE_LAYOUT_OPTIONS = [
  { id: "horizontal", label: "Horizontal", Icon: Columns3 },
  { id: "vertical", label: "Vertical", Icon: LayoutList },
  { id: "grid", label: "Grid", Icon: LayoutGrid },
];

function ServiceLayoutSwitcher({ layoutMode, onLayoutModeChange }) {
  return (
    <div className={styles.viewSwitcher} aria-label="Service layout">
      <span className={styles.viewSwitcherLabel}>View</span>
      {SERVICE_LAYOUT_OPTIONS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={`${styles.viewButton} ${
            layoutMode === id ? styles.viewButtonActive : ""
          }`}
          onClick={() => onLayoutModeChange(id)}
          aria-pressed={layoutMode === id}
        >
          <Icon size={15} className={styles.viewButtonIcon} aria-hidden />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

function getCategoryIcon(title) {
  return (
    CATEGORY_ICONS.find(({ match }) => match.test(title))?.Icon ?? Sparkles
  );
}

/**
 * Cover for category/subcategory folders: API image first, then static banner.
 * @param {string} title
 * @param {string[] | undefined} imageUrls
 * @param {string} cldOptions
 * @param {string} [fallbackTitle]
 */
function resolveFolderCover(title, imageUrls, cldOptions, fallbackTitle) {
  const remote = imageUrls?.[0]
    ? cldTransform(imageUrls[0], cldOptions)
    : null;
  if (remote) return { kind: "remote", src: remote };

  const staticMatch =
    getCategoryImage(title) ??
    (fallbackTitle ? getCategoryImage(fallbackTitle) : null);
  if (staticMatch) {
    return { kind: "static", src: staticMatch.src, alt: staticMatch.alt };
  }

  return null;
}

/* ─── Helpers ─────────────────────────────────────────────────────── */
function formatPrice(amount) {
  if (amount == null) return null;
  return `${amount} ${BUSINESS_CURRENCY}`;
}

function formatDuration(minutes) {
  if (minutes == null) return null;
  return `${minutes} min`;
}

function totalItemCount(section) {
  const direct = section.items?.length ?? 0;
  const nested =
    section.groups?.reduce((acc, g) => acc + (g.items?.length ?? 0), 0) ?? 0;
  return direct + nested;
}

/* ─── Search highlight ────────────────────────────────────────────── */
function Highlight({ text, query }) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className={styles.highlight}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

/* ─── Filter logic ────────────────────────────────────────────────── */
function filterSections(sections, query) {
  if (!query.trim()) return sections;
  const q = query.toLowerCase();

  return sections
    .map((section) => {
      const filteredItems = section.items?.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q),
      );

      const filteredGroups = section.groups
        ?.map((group) => ({
          ...group,
          items: group.items.filter(
            (item) =>
              item.name.toLowerCase().includes(q) ||
              item.description?.toLowerCase().includes(q),
          ),
        }))
        .filter((g) => g.items.length > 0);

      if (
        (filteredItems?.length ?? 0) === 0 &&
        (filteredGroups?.length ?? 0) === 0
      )
        return null;

      return {
        ...section,
        items: filteredItems?.length ? filteredItems : undefined,
        groups: filteredGroups?.length ? filteredGroups : undefined,
      };
    })
    .filter(Boolean);
}

/* ─── Service card ────────────────────────────────────────────────── */
function ServiceCard({ item, index, query, layoutMode }) {
  // Prefer the API's localized, currency-suffixed priceLabel; fall back to raw.
  const priceText = item.priceLabel ?? formatPrice(item.defaultPrice);
  const hasPrice = Boolean(priceText);
  const showCompareAt =
    item.priceDisplayType === "sale" && Boolean(item.priceCompareAtLabel);
  const hasDuration = item.durationMinutes != null && item.durationMinutes > 0;
  const isVertical = layoutMode === "vertical";
  const cover = item.imageUrls?.[0]
    ? cldResponsiveCover(
        item.imageUrls[0],
        isVertical ? [120, 160, 240] : [320, 400, 640, 800],
        isVertical ? "f_auto,q_auto,h_120,c_fill" : "f_auto,q_auto,h_300,c_fill",
        isVertical ? 160 : 400,
      )
    : null;

  return (
    <motion.article
      className={styles.serviceCard}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.18) }}
      whileHover={{ y: -3 }}
    >
      {cover && (
        <div className={styles.serviceImageWrap}>
          <Image
            src={cover.src}
            srcSet={cover.srcSet}
            alt={item.name}
            fill
            className={styles.serviceImage}
            sizes={
              isVertical
                ? "120px"
                : "(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 320px"
            }
            loading="lazy"
          />
        </div>
      )}
      <div className={styles.serviceInfo}>
        <div className={styles.serviceTopRow}>
          <h3 className={styles.serviceName}>
            <Highlight text={item.name} query={query} />
          </h3>
          {(hasPrice || hasDuration) && (
            <div className={styles.serviceMeta}>
              {hasPrice && (
                <span className={styles.metaItem}>
                  <Banknote size={13} className={styles.metaIcon} aria-hidden />
                  {showCompareAt && (
                    <span className={styles.metaCompareAt}>
                      {item.priceCompareAtLabel}
                    </span>
                  )}
                  {priceText}
                </span>
              )}
              {hasPrice && hasDuration && (
                <span className={styles.metaDivider} aria-hidden>
                  •
                </span>
              )}
              {hasDuration && (
                <span className={styles.metaItem}>
                  <Clock size={13} className={styles.metaIcon} aria-hidden />
                  {formatDuration(item.durationMinutes)}
                </span>
              )}
            </div>
          )}
        </div>
        {item.description && (
          <p className={styles.serviceDescription}>
            <Highlight text={item.description} query={query} />
          </p>
        )}
      </div>
    </motion.article>
  );
}

function ServicesDisplay({ items, query, layoutMode }) {
  const trackRef = useRef(null);
  const isHorizontal = layoutMode === "horizontal";

  const scrollCarousel = useCallback((direction) => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * track.clientWidth,
      behavior: "smooth",
    });
  }, []);

  return (
    <div
      className={`${styles.servicesDisplay} ${
        isHorizontal
          ? styles.servicesDisplayHorizontal
          : layoutMode === "grid"
            ? styles.servicesDisplayGrid
            : styles.servicesDisplayVertical
      }`}
    >
      {isHorizontal && (
        <div className={styles.carouselControls} aria-label="Carousel controls">
          <span className={styles.carouselHint}>Swipe or use arrows</span>
          <div className={styles.carouselButtons}>
            <button
              type="button"
              className={styles.carouselArrow}
              onClick={() => scrollCarousel(-1)}
              aria-label="Previous services"
            >
              <ChevronLeft size={22} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.carouselArrow}
              onClick={() => scrollCarousel(1)}
              aria-label="Next services"
            >
              <ChevronRight size={22} aria-hidden />
            </button>
          </div>
        </div>
      )}

      <div className={styles.servicesTrack} ref={isHorizontal ? trackRef : null}>
        {items.map((item, i) => (
          <ServiceCard
            key={item.id}
            item={item}
            index={i}
            query={query}
            layoutMode={layoutMode}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Subcategory accordion ───────────────────────────────────────── */
function SubcategoryAccordion({
  group,
  parentTitle,
  isOpen,
  onToggle,
  query,
  layoutMode,
}) {
  const Icon = getCategoryIcon(group.title);
  const cover = resolveFolderCover(
    group.title,
    group.imageUrls,
    "f_auto,q_auto,w_120,h_120,c_fill",
    parentTitle,
  );

  return (
    <div className={styles.subcategoryBlock}>
      <button
        className={styles.subcategoryTrigger}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={styles.subcategoryLead}>
          <span className={styles.subcategoryThumbWrap}>
            {cover ? (
              <Image
                src={cover.src}
                alt={cover.kind === "static" ? cover.alt : ""}
                fill
                className={styles.subcategoryThumb}
                sizes="44px"
                loading="lazy"
              />
            ) : (
              <span className={styles.subcategoryThumbFallback} aria-hidden>
                <Icon size={18} strokeWidth={1.75} />
              </span>
            )}
          </span>
          <span className={styles.subcategoryTitleText}>{group.title}</span>
        </span>
        <span className={styles.subcategoryMeta}>
          <span className={styles.subCount}>{group.items.length}</span>
          <motion.span
            className={styles.chevronSub}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown size={16} />
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="sub-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <ServicesDisplay
              items={group.items}
              query={query}
              layoutMode={layoutMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Category tile (browse grid + picker) ────────────────────────── */
function CategoryTile({ section, onSelect, compact = false }) {
  const Icon = getCategoryIcon(section.title);
  const count = totalItemCount(section);
  const cover = resolveFolderCover(
    section.title,
    section.imageUrls,
    "f_auto,q_auto,w_640,h_480,c_fill",
  );

  return (
    <motion.button
      type="button"
      className={`${styles.categoryTile} ${
        compact ? styles.categoryTileCompact : ""
      }`}
      onClick={() => onSelect(section.id)}
      aria-label={`View ${section.title} services`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: compact ? 0 : -2 }}
    >
      {cover ? (
        <div className={styles.categoryTileImageWrap}>
          <Image
            src={cover.src}
            alt={cover.kind === "static" ? cover.alt : ""}
            fill
            className={styles.categoryTileImage}
            sizes={
              compact
                ? "120px"
                : "(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            }
          />
        </div>
      ) : (
        <div className={styles.categoryTileImageWrap}>
          <div className={styles.categoryImageFallback} aria-hidden>
            <Icon size={compact ? 28 : 40} strokeWidth={1.5} />
          </div>
        </div>
      )}

      <div className={styles.categoryTileContent}>
        <span className={styles.categoryIcon} aria-hidden>
          <Icon size={compact ? 16 : 18} strokeWidth={2} />
        </span>
        <span className={styles.categoryTileTitle}>{section.title}</span>
        <span className={styles.categoryTileMeta}>
          {count} service{count !== 1 ? "s" : ""}
        </span>
      </div>
    </motion.button>
  );
}

/* ─── Unified category focus view (hero + services, one block) ───── */
function CategoryFocusView({
  section,
  onClose,
  showClose = true,
  openSubcategories,
  onToggleSub,
  query,
  layoutMode,
  onLayoutModeChange,
  focusRef,
}) {
  const Icon = getCategoryIcon(section.title);
  const count = totalItemCount(section);
  const cover = resolveFolderCover(
    section.title,
    section.imageUrls,
    "f_auto,q_auto,w_960,h_480,c_fill",
  );

  return (
    <motion.article
      ref={focusRef}
      className={styles.categoryFocus}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      aria-labelledby={`category-focus-title-${section.id}`}
    >
      <header className={styles.categoryFocusHero}>
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.kind === "static" ? cover.alt : ""}
            fill
            className={styles.categoryFocusHeroImage}
            sizes="100vw"
            priority
          />
        ) : (
          <div className={styles.categoryFocusHeroFallback} aria-hidden>
            <Icon size={56} strokeWidth={1.25} />
          </div>
        )}
        <div className={styles.categoryFocusHeroOverlay} aria-hidden />
        <div className={styles.categoryFocusHeroContent}>
          <span className={styles.categoryFocusIcon} aria-hidden>
            <Icon size={22} strokeWidth={2} />
          </span>
          <div className={styles.categoryFocusHeading}>
            <h2
              id={`category-focus-title-${section.id}`}
              className={styles.categoryFocusTitle}
            >
              {section.title}
            </h2>
            <p className={styles.categoryFocusMeta}>
              {count} service{count !== 1 ? "s" : ""}
            </p>
          </div>
          {showClose && onClose && (
            <button
              type="button"
              className={styles.categoryFocusClose}
              onClick={onClose}
              aria-label={`Close ${section.title} and return to categories`}
            >
              <X size={20} aria-hidden />
            </button>
          )}
        </div>
      </header>

      <div className={styles.categoryFocusBody}>
        <ServiceLayoutSwitcher
          layoutMode={layoutMode}
          onLayoutModeChange={onLayoutModeChange}
        />
        {section.groups?.map((group) => (
          <SubcategoryAccordion
            key={group.id}
            group={group}
            parentTitle={section.title}
            isOpen={openSubcategories.has(group.id)}
            onToggle={() => onToggleSub(group.id)}
            query={query}
            layoutMode={layoutMode}
          />
        ))}
        {section.items && section.items.length > 0 && (
          <ServicesDisplay
            items={section.items}
            query={query}
            layoutMode={layoutMode}
          />
        )}
      </div>
    </motion.article>
  );
}

/* ─── WhatsApp icon (SVG) ─────────────────────────────────────────── */
function WhatsAppIcon({ size = 22 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ─── WhatsApp booking banner ─────────────────────────────────────── */
function WhatsAppBanner() {
  const [isOpen, setIsOpen] = useState(false);

  if (!WHATSAPP_CONTACTS || WHATSAPP_CONTACTS.length === 0) return null;

  return (
    <motion.div
      className={styles.whatsappBanner}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <button
        type="button"
        className={styles.whatsappBannerTrigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className={styles.whatsappBannerIcon}>
          <WhatsAppIcon size={22} />
        </span>
        <span className={styles.whatsappBannerTitle}>Book via WhatsApp</span>
        <motion.span
          className={styles.whatsappChevron}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown size={16} aria-hidden />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="wa-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className={styles.whatsappButtonsRow}>
              {WHATSAPP_CONTACTS.map((contact) => {
                const url = `https://wa.me/${contact.number}?text=${encodeURIComponent(contact.message)}`;
                return (
                  <a
                    key={contact.number}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappButton}
                  >
                    <span className={styles.whatsappButtonIconWrap} aria-hidden>
                      <WhatsAppIcon size={20} />
                    </span>
                    <span className={styles.whatsappButtonText}>
                      {contact.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main component ──────────────────────────────────────────────── */
export default function ServiceMenu({ sections = [], error = null }) {
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [openSubcategories, setOpenSubcategories] = useState(new Set());
  const [layoutMode, setLayoutMode] = useState("horizontal");
  const categoryFocusRef = useRef(null);

  /* Filtered list */
  const filtered = useMemo(
    () => filterSections(sections, query),
    [sections, query],
  );

  /* Total result count when searching */
  const totalResults = useMemo(() => {
    if (!query.trim()) return null;
    return filtered.reduce((acc, s) => acc + totalItemCount(s), 0);
  }, [filtered, query]);

  /* Auto-expand subcategories that have search matches */
  useEffect(() => {
    if (!query.trim()) return;
    setActiveCategoryId(null);
    const subIds = new Set(
      filtered.flatMap((s) => (s.groups ?? []).map((g) => g.id)),
    );
    setOpenSubcategories(subIds);
  }, [filtered, query]);

  const selectCategory = useCallback((id) => {
    setActiveCategoryId(id);
  }, []);

  const closeCategory = useCallback(() => {
    setActiveCategoryId(null);
  }, []);

  useEffect(() => {
    if (!activeCategoryId || !categoryFocusRef.current) return;
    const el = categoryFocusRef.current;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [activeCategoryId]);

  const toggleSubcategory = useCallback((id) => {
    setOpenSubcategories((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setActiveCategoryId(null);
    setOpenSubcategories(new Set());
  }, []);

  const activeSection = useMemo(
    () => filtered.find((section) => section.id === activeCategoryId) ?? null,
    [filtered, activeCategoryId],
  );

  const otherSections = useMemo(
    () => filtered.filter((section) => section.id !== activeCategoryId),
    [filtered, activeCategoryId],
  );

  const isSearching = Boolean(query.trim());

  return (
    <div className={styles.container}>
      {/* ─ Sticky search bar ─ */}
      {!error && sections.length > 0 && (
        <motion.div
          className={styles.searchWrapper}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} aria-hidden />
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search services, e.g. Manicure, Facial…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search services"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  className={styles.clearButton}
                  onClick={clearSearch}
                  aria-label="Clear search"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {query && (
              <motion.p
                className={styles.resultsCount}
                key={totalResults}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                role="status"
                aria-live="polite"
              >
                {totalResults === 0
                  ? "No services found"
                  : `${totalResults} service${totalResults !== 1 ? "s" : ""} found`}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ─ WhatsApp booking banner ─ */}
      {!error && sections.length > 0 && <WhatsAppBanner />}

      {/* ─ Error ─ */}
      {error && (
        <div className={styles.errorState} role="alert">
          <p>{error}</p>
          <p className={styles.errorHint}>
            Please try again later or contact us for current pricing.
          </p>
        </div>
      )}

      {/* ─ Empty ─ */}
      {!error && sections.length === 0 && (
        <div className={styles.emptyState} role="status">
          <p>No services are available to display right now.</p>
        </div>
      )}

      {/* ─ No search results ─ */}
      {!error && sections.length > 0 && query && filtered.length === 0 && (
        <div className={styles.noResults} role="status">
          <Search size={32} className={styles.noResultsIcon} />
          <p>No services match &ldquo;{query}&rdquo;</p>
          <button className={styles.noResultsClear} onClick={clearSearch}>
            Clear search
          </button>
        </div>
      )}

      {/* ─ Categories ─ */}
      {!error && filtered.length > 0 && (
        <div className={styles.categoriesArea}>
          {isSearching ? (
            <div className={styles.categorySearchStack}>
              {filtered.map((section) => (
                <CategoryFocusView
                  key={section.id}
                  section={section}
                  showClose={false}
                  openSubcategories={openSubcategories}
                  onToggleSub={toggleSubcategory}
                  query={query}
                  layoutMode={layoutMode}
                  onLayoutModeChange={setLayoutMode}
                />
              ))}
            </div>
          ) : activeSection ? (
            <div className={styles.categoryBrowseFocus}>
              <CategoryFocusView
                section={activeSection}
                onClose={closeCategory}
                openSubcategories={openSubcategories}
                onToggleSub={toggleSubcategory}
                query={query}
                layoutMode={layoutMode}
                onLayoutModeChange={setLayoutMode}
                focusRef={categoryFocusRef}
              />
              {otherSections.length > 0 && (
                <div className={styles.categoryPicker}>
                  <p className={styles.categoryPickerLabel}>Other categories</p>
                  <div className={styles.categoryPickerGrid}>
                    {otherSections.map((section) => (
                      <CategoryTile
                        key={section.id}
                        section={section}
                        compact
                        onSelect={selectCategory}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.categoriesGrid}>
              {filtered.map((section) => (
                <CategoryTile
                  key={section.id}
                  section={section}
                  onSelect={selectCategory}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─ Footer note ─ */}
      <motion.div
        className={styles.footerNote}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <div className={styles.footerIcon}>
          <Calendar size={20} />
        </div>
        <p>
          Prices shown are starting rates in {BUSINESS_CURRENCY}. Message us on
          WhatsApp to confirm availability and book at all Ken Beauty Salon
          locations.{" "}
          <Link href={BOOKING_URL} className={styles.footerLink}>
            Or book online
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
