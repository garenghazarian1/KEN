"use client";

import {
  useState,
  useMemo,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useHideNavOnScroll } from "@/components/mobileNav/useHideNavOnScroll";
import { DROP_PANEL_MS, DropPanel, dropChevronClass } from "@/components/dropPanel/DropPanel";
import FitName from "@/components/fitName/FitName";
import {
  BOOKING_URL,
  BUSINESS_CURRENCY,
} from "@/config/constants";
import { getCategoryImage } from "@/data/serviceImages";
import {
  buildServiceSearchCatalog,
  searchServices,
  suggestServiceTitles,
} from "@/lib/business/serviceSearch";
import { BookingHint } from "./BookingGuide";
import {
  BOOKING_OPEN_EVENT,
  toggleBookingService,
  useBookingServices,
} from "@/components/bookingDock/bookingList";
import { cldTransform } from "@/utils/cloudinary";
import {
  SERVICE_CATEGORY_QUERY_KEY,
  SERVICE_QUERY_KEY,
  SERVICE_SUBCATEGORIES_QUERY_KEY,
  resolveOpenSubcategoryIds,
  resolveServiceCategoryId,
  syncServiceMenuToUrl,
} from "@/utils/serviceCategoryUrl";
import styles from "./ServiceMenu.module.css";

const PREVIEW_TRANSFORM = "f_auto,q_auto,w_960,h_960,c_fill,g_auto";
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const ARABIC_TEXT = /[\u0600-\u06FF]/;

function hasArabic(text) {
  return ARABIC_TEXT.test(text ?? "");
}

function directColumnId(sectionId) {
  return `${sectionId}__direct`;
}

function isDirectColumn(id) {
  return String(id).endsWith("__direct");
}

function columnIdForService(section, serviceId) {
  if (!section || !serviceId) return null;
  for (const group of section.groups ?? []) {
    if (group.items?.some((item) => item.id === serviceId)) return group.id;
  }
  if (section.items?.some((item) => item.id === serviceId)) {
    return directColumnId(section.id);
  }
  return null;
}

/** Subcategory columns, plus parent-only services under the category name. */
function pageColumns(section) {
  const columns = (section.groups ?? [])
    .filter((group) => group.items?.length)
    .map((group) => ({
      id: group.id,
      title: group.title,
      items: group.items,
      imageUrls: group.imageUrls,
    }));

  if (section.items?.length) {
    columns.push({
      id: directColumnId(section.id),
      title: section.title,
      items: section.items,
      imageUrls: section.imageUrls,
    });
  }

  return columns;
}

function remotePreview(imageUrls) {
  const url = imageUrls?.[0];
  return url ? cldTransform(url, PREVIEW_TRANSFORM) : null;
}

function categoryPreviewSrc(section) {
  return (
    remotePreview(section?.imageUrls) ??
    getCategoryImage(section?.title)?.src ??
    null
  );
}

function servicePreviewSrc(item) {
  return remotePreview(item?.imageUrls);
}

const CHAPTER_SCROLL_MS = 500;
let chapterScrollFrame = 0;

function chapterHeading(id) {
  return document
    .getElementById(`service-subcategory-${id}`)
    ?.querySelector("button");
}

function serviceRow(id) {
  return document.getElementById(`service-item-${id}`);
}

function categoryRestDelta(element) {
  const row = document.querySelector('[aria-label="Service categories"]');
  if (!element || !row) return null;
  return element.getBoundingClientRect().top - row.getBoundingClientRect().bottom - 8;
}

/** Ease an element up to sit just under the category row. */
function easeUnderCategoryRow(getElement, tappedTop) {
  const element = getElement();
  if (!element || categoryRestDelta(element) == null) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    if (tappedTop != null) {
      const jump = element.getBoundingClientRect().top - tappedTop;
      if (Math.abs(jump) > 1) window.scrollBy({ top: jump });
    }
    const delta = categoryRestDelta(getElement());
    if (delta != null && Math.abs(delta) >= 12) window.scrollBy({ top: delta });
    return;
  }

  const started = performance.now();
  let prevEased = 0;
  cancelAnimationFrame(chapterScrollFrame);
  const step = (now) => {
    const delta = categoryRestDelta(getElement());
    if (delta == null) return;
    const progress = Math.min(1, (now - started) / CHAPTER_SCROLL_MS);
    const eased = 1 - (1 - progress) ** 3;
    if (progress >= 1) {
      if (Math.abs(delta) > 1) window.scrollBy({ top: delta });
      return;
    }
    const portion = (eased - prevEased) / (1 - prevEased);
    prevEased = eased;
    if (Math.abs(delta) >= 1) window.scrollBy({ top: delta * portion });
    chapterScrollFrame = requestAnimationFrame(step);
  };
  chapterScrollFrame = requestAnimationFrame(step);
}

function settleOpenChapter(id, tappedTop) {
  easeUnderCategoryRow(() => chapterHeading(id), tappedTop);
}

function settleOpenService(id) {
  const element = serviceRow(id);
  const delta = categoryRestDelta(element);
  if (!element || delta == null) return;
  const rect = element.getBoundingClientRect();
  const visibleTop = rect.top - delta;
  if (rect.top >= visibleTop - 12 && rect.bottom <= window.innerHeight - 8) return;
  easeUnderCategoryRow(() => serviceRow(id));
}

function formatPrice(amount) {
  if (amount == null) return null;
  return `${amount} ${BUSINESS_CURRENCY}`;
}

function keepAmountWithCurrency(label) {
  if (!label) return label;
  const escapedCurrency = BUSINESS_CURRENCY.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
  return label.replace(
    new RegExp(`(\\d[\\d,.]*)\\s+(${escapedCurrency})`, "gi"),
    "$1\u00A0$2",
  );
}

function formatDuration(minutes) {
  if (minutes == null) return null;
  return `${minutes} min`;
}

function Highlight({ text, query }) {
  if (!text || !query.trim()) return text;
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

function PriceLabel({ item }) {
  const priceText = item.priceLabel ?? formatPrice(item.defaultPrice);
  if (!priceText) return null;
  const showCompareAt =
    item.priceDisplayType === "sale" && Boolean(item.priceCompareAtLabel);
  return (
    <span className={styles.servicePrice}>
      {showCompareAt ? (
        <span className={styles.compareAt}>
          {keepAmountWithCurrency(item.priceCompareAtLabel)}
        </span>
      ) : null}
      <span>{keepAmountWithCurrency(priceText)}</span>
    </span>
  );
}

function BookAdd({ item, added, onToggleBook }) {
  if (!onToggleBook) return null;
  return (
    <button
      type="button"
      className={styles.addService}
      aria-pressed={added}
      data-book-service={item.id}
      aria-label={added ? `Remove ${item.name}` : `Add ${item.name}`}
      onClick={() => onToggleBook(item)}
    >
      <span className={styles.addServiceSizer} aria-hidden="true">
        <Check size={14} />
        <span>Added</span>
      </span>
      <span className={styles.addServiceLabel}>
        {added ? <Check size={14} aria-hidden /> : <Plus size={14} aria-hidden />}
        <span>{added ? "Added" : "Add"}</span>
      </span>
    </button>
  );
}

function ServiceLine({
  item,
  query,
  onSelect,
  onToggleBook,
  selected = false,
  added = false,
  expandable = false,
  imageSrc = null,
}) {
  const hasDuration = item.durationMinutes != null && item.durationMinutes > 0;
  const nameClass = `${styles.serviceName} ${
    hasArabic(item.name) ? styles.quietScript : ""
  }`;
  const lineClass = [
    styles.serviceLine,
    selected ? styles.serviceLineSelected : "",
    added ? styles.serviceLineAdded : "",
  ]
    .filter(Boolean)
    .join(" ");
  const [panelSrc, setPanelSrc] = useState(imageSrc);

  useLayoutEffect(() => {
    if (expandable && selected && imageSrc) setPanelSrc(imageSrc);
  }, [expandable, imageSrc, selected]);

  useEffect(() => {
    if (!expandable || selected) return undefined;
    const timer = window.setTimeout(() => setPanelSrc(null), DROP_PANEL_MS);
    return () => window.clearTimeout(timer);
  }, [expandable, selected]);

  const notes = (
    <>
      {hasDuration ? (
        <p className={styles.serviceQuiet}>{formatDuration(item.durationMinutes)}</p>
      ) : null}
      {item.description ? (
        <p className={styles.serviceQuiet}>
          <Highlight text={item.description} query={query} />
        </p>
      ) : null}
    </>
  );

  const add = (
    <BookAdd item={item} added={added} onToggleBook={onToggleBook} />
  );

  if (expandable) {
    return (
      <div className={lineClass}>
        <div className={styles.serviceHead}>
          <button
            type="button"
            className={styles.serviceToggle}
            data-service-toggle=""
            aria-expanded={selected}
            onClick={onSelect}
          >
            <FitName className={nameClass} text={item.name}>
              <Highlight text={item.name} query={query} />
            </FitName>
            <ChevronDown
              size={16}
              aria-hidden
              className={`${dropChevronClass} ${
                selected ? styles.chevronOpen : styles.chevron
              }`}
            />
          </button>
          {add}
        </div>
        <DropPanel open={selected}>
          <div className={styles.serviceDetails}>
            {panelSrc ? (
              <div className={styles.boardMedia}>
                <div className={styles.boardFrame}>
                  <Image
                    key={panelSrc}
                    src={panelSrc}
                    alt=""
                    fill
                    className={styles.boardImage}
                    sizes="50vw"
                  />
                </div>
              </div>
            ) : null}
            <PriceLabel item={item} />
            {notes}
          </div>
        </DropPanel>
      </div>
    );
  }

  const body = (
    <>
      <div className={styles.serviceMain}>
        <FitName className={nameClass} text={item.name} syncPrice>
          <Highlight text={item.name} query={query} />
        </FitName>
        <PriceLabel item={item} />
      </div>
      {notes}
    </>
  );

  return (
    <div className={lineClass}>
      <div className={styles.serviceHead}>
        {onSelect ? (
          <button
            type="button"
            className={styles.serviceSelect}
            data-service-toggle=""
            aria-pressed={selected}
            onClick={onSelect}
          >
            {body}
          </button>
        ) : (
          <div className={styles.serviceSelect}>{body}</div>
        )}
        {add}
      </div>
    </div>
  );
}

function SearchResultRow({
  result,
  query,
  expandable,
  selected,
  added,
  onSelect,
  onToggleBook,
}) {
  const { item, categoryTitle, subcategoryTitle } = result;
  const breadcrumb = subcategoryTitle
    ? `${categoryTitle} · ${subcategoryTitle}`
    : categoryTitle;

  return (
    <li className={styles.searchResultRow}>
      <p className={styles.searchResultBreadcrumb}>{breadcrumb}</p>
      <ServiceLine
        item={item}
        query={query}
        expandable={expandable}
        selected={selected}
        added={added}
        imageSrc={remotePreview(item.imageUrls)}
        onSelect={onSelect}
        onToggleBook={onToggleBook}
      />
    </li>
  );
}

function SearchResultsList({ results, query, expandable, bookedIds, onToggleBook }) {
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    setOpenId(null);
  }, [query]);

  return (
    <>
      <BookingHint />
      <ul className={styles.searchResultsList} aria-label="Search results">
        {results.map((result) => (
          <SearchResultRow
            key={result.item.id}
            result={result}
            query={query}
            expandable={expandable}
            selected={openId === result.item.id}
            added={bookedIds.has(result.item.id)}
            onToggleBook={onToggleBook}
            onSelect={
              expandable
                ? () =>
                    setOpenId((current) =>
                      current === result.item.id ? null : result.item.id,
                    )
                : undefined
            }
          />
        ))}
      </ul>
    </>
  );
}

const SUGGESTIONS_LIST_ID = "service-search-suggestions";

function SearchSuggestions({
  suggestions,
  query,
  activeIndex,
  onSelect,
  onHighlight,
}) {
  return (
    <motion.ul
      id={SUGGESTIONS_LIST_ID}
      role="listbox"
      className={styles.suggestionsList}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
    >
      {suggestions.map((suggestion, index) => {
        const breadcrumb = suggestion.subcategoryTitle
          ? `${suggestion.categoryTitle} · ${suggestion.subcategoryTitle}`
          : suggestion.categoryTitle;

        return (
          <li
            key={suggestion.itemId}
            id={`${SUGGESTIONS_LIST_ID}-option-${index}`}
            role="option"
            aria-selected={index === activeIndex}
            className={`${styles.suggestionItem} ${
              index === activeIndex ? styles.suggestionItemActive : ""
            }`}
            onMouseDown={(event) => event.preventDefault()}
            onMouseEnter={() => onHighlight(index)}
            onClick={() => onSelect(suggestion.title)}
          >
            <span className={styles.suggestionTitle}>
              <Highlight text={suggestion.title} query={query} />
            </span>
            <span className={styles.suggestionBreadcrumb}>{breadcrumb}</span>
          </li>
        );
      })}
    </motion.ul>
  );
}

function PriceColumn({
  column,
  isWide,
  isOpen,
  onToggle,
  query,
  onSelectItem,
  onToggleBook,
  bookedIds,
  selectedId,
}) {
  const titleClass = `${styles.columnTitle} ${
    hasArabic(column.title) ? styles.quietScript : ""
  }`;

  const items = (
    <ul className={styles.serviceList}>
      {column.items.map((item) => (
        <li key={item.id} id={`service-item-${item.id}`}>
          <ServiceLine
            item={item}
            query={query}
            expandable={!isWide}
            selected={item.id === selectedId}
            added={bookedIds.has(item.id)}
            imageSrc={servicePreviewSrc(item)}
            onSelect={onSelectItem ? () => onSelectItem(item) : undefined}
            onToggleBook={onToggleBook}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section
      id={`service-subcategory-${column.id}`}
      className={styles.column}
    >
      {isWide ? (
        <h3 className={titleClass}>{column.title}</h3>
      ) : (
        <button
          type="button"
          className={styles.columnToggle}
          aria-expanded={isOpen}
          onClick={() => onToggle(column.id)}
        >
          <span className={titleClass}>{column.title}</span>
          <ChevronDown
            size={16}
            aria-hidden
            className={`${dropChevronClass} ${
              isOpen ? styles.chevronOpen : styles.chevron
            }`}
          />
        </button>
      )}
      {isWide ? (
        items
      ) : (
        <DropPanel open={isOpen}>{items}</DropPanel>
      )}
    </section>
  );
}

function CategoryBoard({
  sections,
  activeSection,
  openSubcategories,
  onSelectCategory,
  onToggleSubcategory,
  query,
  isWide,
  serviceId,
  onServiceChange,
  bookedIds,
  onToggleBook,
}) {
  const navHidden = useHideNavOnScroll();
  const columns = useMemo(
    () => (activeSection ? pageColumns(activeSection) : []),
    [activeSection],
  );
  const baseSrc = categoryPreviewSrc(activeSection);
  const [hoverSrc, setHoverSrc] = useState(null);
  const [picked, setPicked] = useState(null);
  const previewSrc = isWide ? hoverSrc || picked?.src || baseSrc : null;

  useEffect(() => {
    setHoverSrc(null);
    setPicked(null);
  }, [activeSection?.id]);

  useEffect(() => {
    if (isWide) return;
    setPicked((current) => {
      if (!current) return current;
      const stillOpen = columns.some(
        (column) =>
          openSubcategories.has(column.id) &&
          column.items.some((item) => item.id === current.id),
      );
      return stillOpen ? current : null;
    });
  }, [columns, isWide, openSubcategories]);

  const scrolledServiceRef = useRef(null);

  useEffect(() => {
    if (!serviceId) return undefined;
    for (const column of columns) {
      const item = column.items.find((entry) => entry.id === serviceId);
      if (!item) continue;
      setPicked({
        id: item.id,
        src: servicePreviewSrc(item),
      });
      if (scrolledServiceRef.current === serviceId) return undefined;
      scrolledServiceRef.current = serviceId;
      requestAnimationFrame(() => settleOpenService(serviceId));
      return undefined;
    }
    return undefined;
  }, [columns, serviceId]);

  const pickedIdRef = useRef(null);
  pickedIdRef.current = picked?.id ?? null;

  const selectItem = useCallback((item) => {
    setHoverSrc(null);
    const closing = !isWide && pickedIdRef.current === item.id;
    const next = closing
      ? null
      : {
          id: item.id,
          src: servicePreviewSrc(item),
        };
    setPicked(next);
    onServiceChange?.(next?.id ?? null);
  }, [isWide, onServiceChange]);

  const rowRef = useRef(null);
  const [finePointer, setFinePointer] = useState(false);
  const [rowOverflow, setRowOverflow] = useState(false);
  const [rowAtStart, setRowAtStart] = useState(true);
  const [rowAtEnd, setRowAtEnd] = useState(true);

  useLayoutEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setFinePointer(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return undefined;
    const update = () => {
      const max = row.scrollWidth - row.clientWidth;
      const overflow = max > 1;
      const left = row.scrollLeft;
      const rtl = getComputedStyle(row).direction === "rtl";
      let atStart = true;
      let atEnd = true;
      if (overflow) {
        if (!rtl || left <= 0) {
          atStart = Math.abs(left) <= 2;
          atEnd = Math.abs(left) >= max - 2;
        } else {
          atStart = left >= max - 2;
          atEnd = left <= 2;
        }
      }
      setRowOverflow((current) => (current === overflow ? current : overflow));
      setRowAtStart((current) => (current === atStart ? current : atStart));
      setRowAtEnd((current) => (current === atEnd ? current : atEnd));
    };
    update();
    row.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(row);
    return () => {
      row.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [sections]);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || !finePointer) return undefined;
    const onWheel = (event) => {
      if (row.scrollWidth <= row.clientWidth + 1) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const before = row.scrollLeft;
      row.scrollBy({ left: event.deltaY });
      if (row.scrollLeft !== before) event.preventDefault();
    };
    row.addEventListener("wheel", onWheel, { passive: false });
    return () => row.removeEventListener("wheel", onWheel);
  }, [finePointer, sections]);

  const scrollCategories = (direction) => {
    const row = rowRef.current;
    if (!row) return;
    const amount = Math.round(row.clientWidth * 0.75);
    const towardEnd = direction === "next" ? 1 : -1;
    const rtl = getComputedStyle(row).direction === "rtl";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({
      left: towardEnd * amount * (rtl ? -1 : 1),
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const rowMore =
    finePointer && rowOverflow
      ? !rowAtStart && !rowAtEnd
        ? "both"
        : !rowAtStart
          ? "start"
          : "end"
      : undefined;

  return (
    <div className={styles.board} data-nav-hidden={navHidden ? "true" : "false"}>
      <div
        className={styles.categoryBar}
        data-more={rowMore}
      >
        <ul
          ref={rowRef}
          className={styles.categoryRow}
          data-overflow={rowOverflow ? "true" : "false"}
          aria-label="Service categories"
          onPointerLeave={isWide ? () => setHoverSrc(null) : undefined}
        >
        {sections.map((section) => {
          const selected = section.id === activeSection?.id;
          return (
            <li key={section.id} className={styles.categoryItem}>
              <button
                type="button"
                className={`${styles.categoryButton} ${
                  selected ? styles.categoryButtonActive : ""
                } ${hasArabic(section.title) ? styles.quietScript : ""}`}
                aria-current={selected ? "true" : undefined}
                onClick={() => onSelectCategory(section.id)}
                onPointerEnter={
                  isWide
                    ? () => setHoverSrc(categoryPreviewSrc(section))
                    : undefined
                }
              >
                {section.title}
              </button>
            </li>
          );
        })}
        </ul>
        {finePointer && rowOverflow && !rowAtStart ? (
          <button
            type="button"
            className={`${styles.categoryStep} ${styles.categoryStepStart}`}
            aria-label="Previous categories"
            onClick={() => scrollCategories("previous")}
          >
            <ChevronLeft size={16} aria-hidden />
          </button>
        ) : null}
        {finePointer && rowOverflow && !rowAtEnd ? (
          <button
            type="button"
            className={`${styles.categoryStep} ${styles.categoryStepEnd}`}
            aria-label="Next categories"
            onClick={() => scrollCategories("next")}
          >
            <ChevronRight size={16} aria-hidden />
          </button>
        ) : null}
        {!finePointer && rowOverflow && !rowAtEnd ? (
          <span className={styles.swipeHint}>
            <span className={styles.swipeMark} aria-hidden="true">
              <ChevronRight size={16} strokeWidth={1.75} />
              <ChevronRight size={16} strokeWidth={1.75} />
            </span>
            <span className={styles.swipeLabel}>Swipe for more</span>
          </span>
        ) : null}
      </div>
      <BookingHint />

      {activeSection ? (
        <div className={styles.boardBody}>
          {previewSrc ? (
            <div className={styles.boardMedia}>
              <div
                className={
                  previewSrc ? styles.boardFrame : styles.boardFrameFallback
                }
              >
                {previewSrc ? (
                  <Image
                    key={previewSrc}
                    src={previewSrc}
                    alt=""
                    fill
                    className={styles.boardImage}
                    sizes={isWide ? "40vw" : "100vw"}
                    priority
                  />
                ) : (
                  <p className={styles.boardFallbackTitle}>{activeSection.title}</p>
                )}
              </div>
            </div>
          ) : null}

          <div className={styles.columns}>
            {columns.map((column) => (
              <PriceColumn
                key={column.id}
                column={column}
                isWide={isWide}
                isOpen={openSubcategories.has(column.id)}
                onToggle={onToggleSubcategory}
                query={query}
                bookedIds={bookedIds}
                onToggleBook={onToggleBook}
                selectedId={picked?.id ?? null}
                onSelectItem={selectItem}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function initialOpenIds(sections, categoryId, fromUrl, serviceId) {
  const section = sections.find((item) => item.id === categoryId);
  const serviceColumnId = columnIdForService(section, serviceId);
  if (serviceColumnId) return new Set([serviceColumnId]);
  if (fromUrl.length) return new Set(fromUrl);
  const first = section ? pageColumns(section)[0] : null;
  return first ? new Set([first.id]) : new Set();
}

export default function ServiceMenu({ sections = [], error = null }) {
  const searchParams = useSearchParams();
  const categoryFromUrl = useMemo(
    () =>
      resolveServiceCategoryId(
        searchParams.get(SERVICE_CATEGORY_QUERY_KEY),
        sections,
      ),
    [searchParams, sections],
  );

  const serviceFromUrl = searchParams.get(SERVICE_QUERY_KEY);

  const openSubcategoriesFromUrl = useMemo(
    () =>
      resolveOpenSubcategoryIds(
        searchParams.get(SERVICE_SUBCATEGORIES_QUERY_KEY),
        sections,
        categoryFromUrl,
      ),
    [searchParams, sections, categoryFromUrl],
  );

  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(
    () => categoryFromUrl ?? sections[0]?.id ?? null,
  );
  const [openSubcategories, setOpenSubcategories] = useState(() =>
    initialOpenIds(
      sections,
      categoryFromUrl ?? sections[0]?.id ?? null,
      openSubcategoriesFromUrl,
      serviceFromUrl,
    ),
  );
  const [isWide, setIsWide] = useState(false);
  const booked = useBookingServices();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestionsDismissed, setSuggestionsDismissed] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const ignoreNextUrlRef = useRef(false);

  useLayoutEffect(() => {
    const media = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const apply = () => setIsWide(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (categoryFromUrl) {
      setActiveCategoryId(categoryFromUrl);
      return;
    }
    setActiveCategoryId((current) => {
      if (current && sections.some((section) => section.id === current)) {
        return current;
      }
      return sections[0]?.id ?? null;
    });
  }, [categoryFromUrl, sections]);

  const syncMenuUrl = useCallback(
    (categoryId, subcategoryIds, { urlMode = "replace", serviceId = null } = {}) => {
      const before = `${window.location.pathname}${window.location.search}`;
      syncServiceMenuToUrl(
        {
          categoryId,
          openSubcategoryIds: [...subcategoryIds],
          serviceId,
        },
        { mode: urlMode },
      );
      const after = `${window.location.pathname}${window.location.search}`;
      if (after !== before) ignoreNextUrlRef.current = true;
    },
    [],
  );

  useEffect(() => {
    if (ignoreNextUrlRef.current) {
      ignoreNextUrlRef.current = false;
      return;
    }

    if (openSubcategoriesFromUrl.length && !serviceFromUrl) {
      setOpenSubcategories(new Set(openSubcategoriesFromUrl));
      return;
    }

    const section = sections.find((item) => item.id === activeCategoryId);
    const serviceColumnId = columnIdForService(section, serviceFromUrl);
    if (serviceColumnId) {
      setOpenSubcategories(new Set([serviceColumnId]));
      return;
    }

    if (openSubcategoriesFromUrl.length) {
      setOpenSubcategories(new Set(openSubcategoriesFromUrl));
      return;
    }

    if (!activeCategoryId) return;
    const first = section ? pageColumns(section)[0] : null;
    setOpenSubcategories(first ? new Set([first.id]) : new Set());
  }, [activeCategoryId, openSubcategoriesFromUrl, sections, serviceFromUrl]);

  const linkService = useCallback(
    (serviceId) => {
      const urlIds = [...openSubcategories].filter((id) => !isDirectColumn(id));
      syncMenuUrl(activeCategoryId, urlIds, { urlMode: "replace", serviceId });
    },
    [activeCategoryId, openSubcategories, syncMenuUrl],
  );

  const setActiveCategory = useCallback(
    (categoryId, { urlMode = "auto", resetSubs = true } = {}) => {
      setActiveCategoryId(categoryId);
      if (!categoryId || !resetSubs) {
        const urlIds = categoryId
          ? [...openSubcategories].filter((id) => !isDirectColumn(id))
          : [];
        if (!categoryId) setOpenSubcategories(new Set());
        syncMenuUrl(categoryId, urlIds, { urlMode });
        return;
      }
      const section = sections.find((item) => item.id === categoryId);
      const first = section ? pageColumns(section)[0] : null;
      const nextIds = first ? [first.id] : [];
      setOpenSubcategories(new Set(nextIds));
      syncMenuUrl(
        categoryId,
        nextIds.filter((id) => !isDirectColumn(id)),
        { urlMode },
      );
    },
    [openSubcategories, sections, syncMenuUrl],
  );

  const searchCatalog = useMemo(
    () => buildServiceSearchCatalog(sections),
    [sections],
  );

  const suggestions = useMemo(() => {
    if (!query.trim() || suggestionsDismissed) return [];
    return suggestServiceTitles(searchCatalog, query);
  }, [searchCatalog, query, suggestionsDismissed]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchServices(searchCatalog, query);
  }, [searchCatalog, query]);

  const totalResults = query.trim() ? searchResults.length : null;

  const showSuggestions =
    isSearchFocused &&
    !suggestionsDismissed &&
    query.trim().length >= 2 &&
    suggestions.length > 0;

  const applySuggestion = useCallback((title) => {
    setQuery(title);
    setSuggestionsDismissed(true);
    setActiveSuggestionIndex(-1);
    searchInputRef.current?.focus();
  }, []);

  const handleSearchKeyDown = useCallback(
    (event) => {
      if (!showSuggestions) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
      } else if (event.key === "Enter" && activeSuggestionIndex >= 0) {
        event.preventDefault();
        applySuggestion(suggestions[activeSuggestionIndex].title);
      } else if (event.key === "Escape") {
        event.preventDefault();
        setSuggestionsDismissed(true);
        setActiveSuggestionIndex(-1);
      }
    },
    [showSuggestions, suggestions, activeSuggestionIndex, applySuggestion],
  );

  const handleSearchChange = useCallback((event) => {
    setQuery(event.target.value);
    setSuggestionsDismissed(false);
    setActiveSuggestionIndex(-1);
  }, []);

  const selectCategory = useCallback(
    (id) => {
      const switchingCategory =
        activeCategoryId != null && activeCategoryId !== id;
      setActiveCategory(id, {
        urlMode: switchingCategory ? "replace" : "auto",
        resetSubs: switchingCategory || activeCategoryId == null,
      });
    },
    [activeCategoryId, setActiveCategory],
  );

  const toggleSubcategory = useCallback(
    (id) => {
      const tappedTop = chapterHeading(id)?.getBoundingClientRect().top ?? null;
      let opened = false;
      setOpenSubcategories((prev) => {
        const closing = prev.size === 1 && prev.has(id);
        opened = !closing;
        const next = closing ? new Set() : new Set([id]);
        const urlIds = [...next].filter((value) => !isDirectColumn(value));
        syncMenuUrl(activeCategoryId, urlIds, { urlMode: "replace" });
        return next;
      });
      if (!opened) {
        cancelAnimationFrame(chapterScrollFrame);
        return;
      }
      requestAnimationFrame(() => settleOpenChapter(id, tappedTop));
    },
    [activeCategoryId, syncMenuUrl],
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    setSuggestionsDismissed(false);
    setActiveSuggestionIndex(-1);
  }, []);

  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeCategoryId) ?? null,
    [sections, activeCategoryId],
  );

  const bookedIds = useMemo(
    () => new Set(booked.map((service) => service.id)),
    [booked],
  );

  const toggleBook = useCallback((item) => {
    const { added } = toggleBookingService(item);
    if (!added) return;
    window.dispatchEvent(
      new CustomEvent(BOOKING_OPEN_EVENT, { detail: { id: item.id } }),
    );
  }, []);

  const isSearching = Boolean(query.trim());

  return (
    <div className={styles.container}>
      {!error && sections.length > 0 && (
        <motion.div
          className={styles.searchWrapper}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className={styles.searchCombobox}>
            <div className={styles.searchBar}>
              <Search size={18} className={styles.searchIcon} aria-hidden />
              <input
                ref={searchInputRef}
                type="search"
                className={styles.searchInput}
                placeholder="Search services, e.g. Manicure, Facial…"
                value={query}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onKeyDown={handleSearchKeyDown}
                aria-label="Search services"
                aria-autocomplete="list"
                aria-controls={showSuggestions ? SUGGESTIONS_LIST_ID : undefined}
                aria-expanded={showSuggestions}
                aria-activedescendant={
                  showSuggestions && activeSuggestionIndex >= 0
                    ? `${SUGGESTIONS_LIST_ID}-option-${activeSuggestionIndex}`
                    : undefined
                }
                role="combobox"
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

            <AnimatePresence>
              {showSuggestions && (
                <SearchSuggestions
                  suggestions={suggestions}
                  query={query}
                  activeIndex={activeSuggestionIndex}
                  onSelect={applySuggestion}
                  onHighlight={setActiveSuggestionIndex}
                />
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

      {error && (
        <div className={styles.errorState} role="alert">
          <p>{error}</p>
          <p className={styles.errorHint}>
            Please try again later or contact us for current pricing.
          </p>
        </div>
      )}

      {!error && sections.length === 0 && (
        <div className={styles.emptyState} role="status">
          <p>No services are available to display right now.</p>
        </div>
      )}

      {!error && sections.length > 0 && isSearching && searchResults.length === 0 && (
        <div className={styles.noResults} role="status">
          <Search size={32} className={styles.noResultsIcon} />
          <p>No services match &ldquo;{query}&rdquo;</p>
          <button className={styles.noResultsClear} onClick={clearSearch}>
            Clear search
          </button>
        </div>
      )}

      {!error && (isSearching ? searchResults.length > 0 : sections.length > 0) && (
        <div className={styles.categoriesArea}>
          {isSearching ? (
            <SearchResultsList
              results={searchResults}
              query={query}
              expandable={!isWide}
              bookedIds={bookedIds}
              onToggleBook={toggleBook}
            />
          ) : (
            <CategoryBoard
              sections={sections}
              activeSection={activeSection}
              openSubcategories={openSubcategories}
              onSelectCategory={selectCategory}
              onToggleSubcategory={toggleSubcategory}
              query={query}
              isWide={isWide}
              serviceId={serviceFromUrl}
              onServiceChange={linkService}
              bookedIds={bookedIds}
              onToggleBook={toggleBook}
            />
          )}
        </div>
      )}

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
          Prices shown are starting rates in {BUSINESS_CURRENCY}.{" "}
          <Link href={BOOKING_URL} className={styles.footerLink}>
            Or book online
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
