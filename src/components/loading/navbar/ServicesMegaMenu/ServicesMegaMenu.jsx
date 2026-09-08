"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Scissors, Sparkles, X } from "lucide-react";
import { getCategoryImage } from "@/data/serviceImages";
import { cldTransform } from "@/utils/cloudinary";
import { buildServicesCategoryPath } from "@/utils/serviceCategoryUrl";
import { scrollChildToContainerTop } from "@/utils/scrollChildToContainerTop";
import styles from "./ServicesMegaMenu.module.css";

const THUMB_TRANSFORM = "f_auto,q_auto,w_120,h_120,c_fit";

function sectionHasGroups(section) {
  return Boolean(section?.groups?.length);
}

function directGroupId(sectionId) {
  return `${sectionId}__direct`;
}

/** Subcategories plus a collapsed "Other" row for services linked only to the category. */
function accordionGroups(section) {
  const groups = section.groups ?? [];
  if (!groups.length || !section.items?.length) return groups;
  return [
    ...groups,
    {
      id: directGroupId(section.id),
      title: "Other",
      items: section.items,
      imageUrl: section.imageUrl ?? null,
    },
  ];
}

function totalCount(section) {
  const direct = section.items?.length ?? 0;
  const nested =
    section.groups?.reduce((sum, group) => sum + group.items.length, 0) ?? 0;
  return direct + nested;
}

/**
 * Resolve thumb: API image → static category banner → icon fallback.
 * @param {{ title?: string, name?: string, imageUrl?: string | null }} node
 * @param {string} [fallbackTitle]
 */
function resolveThumb(node, fallbackTitle) {
  const title = node.title ?? node.name ?? "";
  const remote = node.imageUrl
    ? cldTransform(node.imageUrl, THUMB_TRANSFORM)
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

function RowThumb({ node, fallbackTitle, size = "md" }) {
  const cover = resolveThumb(node, fallbackTitle);

  return (
    <span
      className={`${styles.thumb} ${size === "sm" ? styles.thumbSm : ""}`}
      aria-hidden={!cover}
    >
      {cover ? (
        <Image
          src={cover.src}
          alt={cover.kind === "static" ? cover.alt : ""}
          fill
          className={styles.thumbImage}
          sizes={size === "sm" ? "68px" : "80px"}
        />
      ) : (
        <span className={styles.thumbFallback}>
          <Sparkles size={size === "sm" ? 14 : 18} strokeWidth={1.75} />
        </span>
      )}
    </span>
  );
}

function ServiceRow({ item, categoryId, groupId, fallbackTitle, onNavigate }) {
  return (
    <Link
      href={buildServicesCategoryPath(categoryId, groupId ? [groupId] : [])}
      className={`${styles.row} ${styles.rowService}`}
      onClick={onNavigate}
    >
      <RowThumb node={item} fallbackTitle={fallbackTitle} />
      <span className={styles.rowText}>
        <span className={styles.rowTitle}>{item.name}</span>
        {item.priceLabel ? (
          <span className={styles.rowMeta}>{item.priceLabel}</span>
        ) : null}
      </span>
    </Link>
  );
}

function ServiceList({ items, categoryId, groupId, fallbackTitle, onNavigate }) {
  if (!items?.length) {
    return <p className={styles.emptyNested}>No services in this group.</p>;
  }

  return (
    <ul className={styles.nestedList} aria-label="Services">
      {items.map((item) => (
        <li key={item.id}>
          <ServiceRow
            item={item}
            categoryId={categoryId}
            groupId={groupId}
            fallbackTitle={fallbackTitle}
            onNavigate={onNavigate}
          />
        </li>
      ))}
    </ul>
  );
}

function usePinOpenRow(containerRef, openId) {
  const rowEls = useRef(new Map());

  const bindRow = useCallback(
    (id) => (node) => {
      if (!id) return;
      if (node) rowEls.current.set(id, node);
      else rowEls.current.delete(id);
    },
    [],
  );

  useLayoutEffect(() => {
    if (!openId) return undefined;
    const container = containerRef?.current;
    const row = rowEls.current.get(openId);
    if (!container || !row) return undefined;

    let cancel = () => {};
    const raf = requestAnimationFrame(() => {
      cancel = scrollChildToContainerTop(container, row, { duration: 620 });
    });
    return () => {
      cancelAnimationFrame(raf);
      cancel();
    };
  }, [openId, containerRef]);

  return bindRow;
}

function GroupAccordionList({
  section,
  openSubcategoryId,
  onToggleSubcategory,
  onNavigate,
  bindRow,
}) {
  const groups = accordionGroups(section);

  return (
    <ul className={styles.nestedList} aria-label="Subcategories">
      {groups.map((group) => {
        const groupOpen = openSubcategoryId === group.id;
        const pathGroupId =
          group.id === directGroupId(section.id) ? undefined : group.id;
        return (
          <li key={group.id}>
            <button
              ref={bindRow?.(group.id)}
              type="button"
              className={`${styles.row} ${styles.rowGroup} ${
                groupOpen ? `${styles.rowOpen} ${styles.rowCentered}` : ""
              }`}
              aria-expanded={groupOpen}
              aria-controls={`nav-services-sub-${group.id}`}
              onClick={() => onToggleSubcategory(group.id)}
            >
              <RowThumb
                node={group}
                fallbackTitle={section.title}
                size="sm"
              />
              <span className={styles.rowText}>
                <span className={styles.rowTitle}>{group.title}</span>
                <span className={styles.rowHint}>
                  {group.items.length} service
                  {group.items.length === 1 ? "" : "s"}
                </span>
              </span>
              <ChevronDown
                size={16}
                className={`${styles.rowChevron} ${
                  groupOpen ? styles.chevronOpen : ""
                }`}
                aria-hidden
              />
            </button>
            {groupOpen && (
              <div id={`nav-services-sub-${group.id}`}>
                <ServiceList
                  items={group.items}
                  categoryId={section.id}
                  groupId={pathGroupId}
                  fallbackTitle={group.title}
                  onNavigate={onNavigate}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function CatalogAccordion({
  sections,
  openCategoryId,
  openSubcategoryId,
  onToggleCategory,
  onToggleSubcategory,
  onNavigate,
  scrollParentRef,
}) {
  const pinId = openSubcategoryId || openCategoryId;
  const bindRow = usePinOpenRow(scrollParentRef, pinId);

  return (
    <ul className={styles.list} aria-label="Service categories">
      {sections.map((section) => {
        const isOpen = openCategoryId === section.id;
        const count = totalCount(section);
        const hasGroups = sectionHasGroups(section);

        return (
          <li key={section.id}>
            <button
              ref={bindRow(section.id)}
              type="button"
              className={`${styles.row} ${
                isOpen ? `${styles.rowOpen} ${styles.rowCentered}` : ""
              }`}
              aria-expanded={isOpen}
              aria-controls={`nav-services-cat-${section.id}`}
              onClick={() => onToggleCategory(section.id)}
            >
              <RowThumb node={section} />
              <span className={styles.rowText}>
                <span className={styles.rowTitle}>{section.title}</span>
                <span className={styles.rowHint}>
                  {count} service{count === 1 ? "" : "s"}
                </span>
              </span>
              <ChevronDown
                size={18}
                className={`${styles.rowChevron} ${
                  isOpen ? styles.chevronOpen : ""
                }`}
                aria-hidden
              />
            </button>

            {isOpen && (
              <div id={`nav-services-cat-${section.id}`}>
                {hasGroups ? (
                  <GroupAccordionList
                    section={section}
                    openSubcategoryId={openSubcategoryId}
                    onToggleSubcategory={onToggleSubcategory}
                    onNavigate={onNavigate}
                    bindRow={bindRow}
                  />
                ) : null}
                {!hasGroups && section.items?.length ? (
                  <ServiceList
                    items={section.items}
                    categoryId={section.id}
                    fallbackTitle={section.title}
                    onNavigate={onNavigate}
                  />
                ) : null}
                {!hasGroups && !section.items?.length && (
                  <p className={styles.emptyNested}>No services in this group.</p>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function DesktopMegaPanel({
  sections,
  activeCategoryId,
  openSubcategoryId,
  onSelectCategory,
  onToggleSubcategory,
  onNavigate,
  scrollParentRef,
}) {
  const bindRow = usePinOpenRow(scrollParentRef, openSubcategoryId);
  const activeSection =
    sections.find((section) => section.id === activeCategoryId) ??
    sections[0] ??
    null;
  const paneCount = activeSection ? totalCount(activeSection) : 0;

  return (
    <div className={styles.mega}>
      <ul className={styles.megaRail} aria-label="Service categories">
        {sections.map((section) => {
          const isActive = activeSection?.id === section.id;
          return (
            <li key={section.id}>
              <button
                type="button"
                className={`${styles.megaRailItem} ${
                  isActive ? styles.megaRailActive : ""
                }`}
                aria-current={isActive ? "true" : undefined}
                onMouseEnter={() => onSelectCategory(section.id)}
                onFocus={() => onSelectCategory(section.id)}
                onClick={() => onSelectCategory(section.id)}
              >
                {section.title}
              </button>
            </li>
          );
        })}
      </ul>
      <div className={styles.megaPane} ref={scrollParentRef}>
        {activeSection ? (
          <>
            <div className={styles.megaPaneHead}>
              <h3 className={styles.megaPaneTitle}>{activeSection.title}</h3>
              <span className={styles.rowHint}>
                {paneCount} service{paneCount === 1 ? "" : "s"}
              </span>
            </div>
            {sectionHasGroups(activeSection) ? (
              <GroupAccordionList
                section={activeSection}
                openSubcategoryId={openSubcategoryId}
                onToggleSubcategory={onToggleSubcategory}
                onNavigate={onNavigate}
                bindRow={bindRow}
              />
            ) : null}
            {!sectionHasGroups(activeSection) &&
            activeSection.items?.length ? (
              <ServiceList
                items={activeSection.items}
                categoryId={activeSection.id}
                fallbackTitle={activeSection.title}
                onNavigate={onNavigate}
              />
            ) : null}
            {!sectionHasGroups(activeSection) &&
              !activeSection.items?.length && (
                <p className={styles.emptyNested}>No services in this group.</p>
              )}
          </>
        ) : (
          <p className={styles.status}>Choose a category</p>
        )}
      </div>
    </div>
  );
}

function CatalogStatus({ loadState, errorMessage, isEmpty }) {
  if (loadState === "idle" || loadState === "loading") {
    return <p className={styles.status}>Loading services…</p>;
  }
  if (loadState === "error") {
    return (
      <p className={styles.status} role="alert">
        {errorMessage}
      </p>
    );
  }
  if (isEmpty) {
    return <p className={styles.status}>No services available.</p>;
  }
  return null;
}

/**
 * Nested services viewer for the live top bar and desktop nav.
 * Portaled to document.body so backdrop-filter on the top bar cannot trap it.
 */
export default function ServicesMegaMenu({
  variant = "topbar",
  onNavigate,
  isActive = false,
}) {
  const panelId = useId();
  const loadRef = useRef("idle");
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const listScrollRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const [loadState, setLoadState] = useState("idle");
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState(null);
  const [panelCoords, setPanelCoords] = useState(null);

  const isDesktop = variant === "desktop";
  const isDrawer = variant !== "desktop";
  const ready = loadState === "ready" && sections.length > 0;

  const activeSection =
    sections.find((section) => section.id === activeCategoryId) ?? null;
  const activeGroup =
    activeSection?.groups?.find((group) => group.id === activeSubcategoryId) ??
    null;

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetTree = useCallback(() => {
    setActiveCategoryId(null);
    setActiveSubcategoryId(null);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    resetTree();
  }, [resetTree]);

  const ensureCatalog = useCallback(async () => {
    if (loadRef.current === "ready" || loadRef.current === "loading") return;
    loadRef.current = "loading";
    setLoadState("loading");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/services/catalog");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load services.");
      }
      setSections(data.sections ?? []);
      loadRef.current = "ready";
      setLoadState("ready");
    } catch (err) {
      setSections([]);
      loadRef.current = "error";
      setLoadState("error");
      setErrorMessage(err?.message || "Failed to load services.");
    }
  }, []);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        void ensureCatalog();
      } else {
        resetTree();
      }
      return next;
    });
  }, [ensureCatalog, resetTree]);

  const toggleCategory = useCallback((categoryId) => {
    setActiveCategoryId((prev) => (prev === categoryId ? null : categoryId));
  }, []);

  const selectCategory = useCallback((categoryId) => {
    setActiveCategoryId(categoryId);
  }, []);

  const toggleSubcategory = useCallback((groupId) => {
    setActiveSubcategoryId((prev) => (prev === groupId ? null : groupId));
  }, []);

  useEffect(() => {
    setActiveSubcategoryId(null);
  }, [activeCategoryId]);

  useEffect(() => {
    if (!open || !isDesktop || !sections.length) return;
    if (!activeCategoryId) {
      setActiveCategoryId(sections[0].id);
    }
  }, [open, isDesktop, sections, activeCategoryId]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    if (isDrawer) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close, isDrawer]);

  useEffect(() => {
    if (!open || !isDesktop) return undefined;

    const onPointerDown = (event) => {
      if (triggerRef.current?.contains(event.target)) return;
      if (panelRef.current?.contains(event.target)) return;
      close();
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, isDesktop, close]);

  useEffect(() => {
    if (!open || !isDesktop) {
      setPanelCoords(null);
      return undefined;
    }

    const update = () => {
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const width = Math.min(44 * 16, window.innerWidth - 24);
      let left = rect.left;
      if (left + width > window.innerWidth - 12) {
        left = Math.max(12, window.innerWidth - width - 12);
      }
      setPanelCoords({
        top: rect.bottom + 8,
        left,
        width,
        maxHeight: Math.min(window.innerHeight - rect.bottom - 24, window.innerHeight * 0.72),
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, isDesktop]);

  const handleNavigate = useCallback(() => {
    close();
    onNavigate?.();
  }, [close, onNavigate]);

  const footerHref = activeSection
    ? buildServicesCategoryPath(
        activeSection.id,
        activeGroup ? [activeGroup.id] : [],
      )
    : "/services";
  const footerLabel = activeSection
    ? `Open ${activeGroup?.title ?? activeSection.title}`
    : "View full services page";

  const triggerClassName = isDesktop
    ? `${styles.trigger} ${open ? styles.triggerOpen : ""}`
    : variant === "mobile"
      ? `${styles.mobileTrigger} ${open ? styles.mobileTriggerOpen : ""}`
      : `${styles.topbarTrigger} ${open ? styles.topbarTriggerOpen : ""} ${
          isActive ? styles.topbarTriggerActive : ""
        }`;

  const bodyContent = (
    <>
      <CatalogStatus
        loadState={loadState}
        errorMessage={errorMessage}
        isEmpty={loadState === "ready" && sections.length === 0}
      />
      {ready &&
        (isDesktop ? (
          <DesktopMegaPanel
            sections={sections}
            activeCategoryId={activeCategoryId}
            openSubcategoryId={activeSubcategoryId}
            onSelectCategory={selectCategory}
            onToggleSubcategory={toggleSubcategory}
            onNavigate={handleNavigate}
            scrollParentRef={listScrollRef}
          />
        ) : (
          <CatalogAccordion
            sections={sections}
            openCategoryId={activeCategoryId}
            openSubcategoryId={activeSubcategoryId}
            onToggleCategory={toggleCategory}
            onToggleSubcategory={toggleSubcategory}
            onNavigate={handleNavigate}
            scrollParentRef={listScrollRef}
          />
        ))}
    </>
  );

  const overlay =
    open && mounted && (isDrawer || panelCoords)
      ? createPortal(
          isDrawer ? (
            <>
              <button
                type="button"
                className={styles.backdrop}
                aria-label="Close services menu"
                onClick={close}
              />
              <div
                id={panelId}
                className={styles.drawer}
                role="dialog"
                aria-modal="true"
                aria-label="Browse services"
              >
                <header className={styles.drawerHeader}>
                  <h2 className={styles.drawerTitle}>Services</h2>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={close}
                    aria-label="Close"
                  >
                    <X size={20} aria-hidden />
                  </button>
                </header>
                <div className={styles.drawerBody} ref={listScrollRef}>
                  {bodyContent}
                </div>
                <footer className={styles.drawerFooter}>
                  <Link
                    href={footerHref}
                    className={styles.footerLink}
                    onClick={handleNavigate}
                  >
                    {footerLabel}
                  </Link>
                </footer>
              </div>
            </>
          ) : (
            <div
              ref={panelRef}
              id={panelId}
              className={styles.desktopPanel}
              role="dialog"
              aria-label="Browse services"
              style={
                panelCoords
                  ? {
                      top: panelCoords.top,
                      left: panelCoords.left,
                      width: panelCoords.width,
                      maxHeight: panelCoords.maxHeight,
                    }
                  : undefined
              }
            >
              <div className={styles.desktopBody}>{bodyContent}</div>
              <footer className={styles.drawerFooter}>
                <Link
                  href={footerHref}
                  className={styles.footerLink}
                  onClick={handleNavigate}
                >
                  {footerLabel}
                </Link>
              </footer>
            </div>
          ),
          document.body,
        )
      : null;

  return (
    <div
      className={styles.wrap}
      onMouseEnter={isDesktop ? () => void ensureCatalog() : undefined}
    >
      <button
        ref={triggerRef}
        type="button"
        className={triggerClassName}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-haspopup={isDrawer ? "dialog" : "true"}
        aria-label="Services"
        onClick={toggle}
      >
        {isDesktop || variant === "mobile" ? (
          <span>Services</span>
        ) : (
          <>
            <Scissors size={22} className={styles.topbarIcon} aria-hidden />
            <span className={styles.topbarLabel}>Services</span>
          </>
        )}
      </button>
      {overlay}
    </div>
  );
}
