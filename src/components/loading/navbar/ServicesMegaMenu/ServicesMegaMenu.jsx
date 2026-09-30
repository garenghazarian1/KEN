"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Scissors, X } from "lucide-react";
import { getCategoryImage } from "@/data/serviceImages";
import { cldTransform } from "@/utils/cloudinary";
import { buildServicesCategoryPath } from "@/utils/serviceCategoryUrl";
import { DropPanel, dropChevronClass } from "@/components/dropPanel/DropPanel";
import FitName from "@/components/fitName/FitName";
import styles from "./ServicesMegaMenu.module.css";

const PREVIEW_TRANSFORM = "f_auto,q_auto,w_960,h_960,c_fill,g_auto";
const DESKTOP_SERVICE_LIMIT = 4;
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const ARABIC_TEXT = /[\u0600-\u06FF]/;

function hasArabic(text) {
  return ARABIC_TEXT.test(text ?? "");
}

/**
 * Category or subcategory image only. Missing art stays a token panel.
 * @param {{ title?: string, name?: string, imageUrl?: string | null } | null | undefined} node
 * @param {string} [fallbackTitle]
 */
function resolvePreview(node, fallbackTitle) {
  const title = node?.title ?? node?.name ?? fallbackTitle ?? "";
  const remote = node?.imageUrl
    ? cldTransform(node.imageUrl, PREVIEW_TRANSFORM)
    : null;
  if (remote) return { src: remote, alt: "", title };

  const staticMatch =
    getCategoryImage(title) ??
    (fallbackTitle ? getCategoryImage(fallbackTitle) : null);
  if (staticMatch) {
    return { src: staticMatch.src, alt: "", title };
  }

  return { src: null, alt: "", title };
}

/** Subcategory columns, plus parent-only services under the category name. */
function desktopColumns(section) {
  const columns = (section.groups ?? [])
    .filter((group) => group.items?.length)
    .map((group) => ({
      id: group.id,
      title: group.title,
      items: group.items,
      imageUrl: group.imageUrl ?? null,
      groupId: group.id,
    }));

  if (section.items?.length) {
    columns.push({
      id: directGroupId(section.id),
      title: section.title,
      items: section.items,
      imageUrl: section.imageUrl ?? null,
      groupId: null,
    });
  }

  return columns;
}

function columnPreview(column, section) {
  const category = resolvePreview(section, section.title);
  const own = resolvePreview(
    { title: column.title, imageUrl: column.imageUrl },
    section.title,
  );
  return {
    src: own.src ?? category.src,
    alt: "",
    title: column.title,
  };
}

function servicePreview(item, column, section) {
  const remote = item.imageUrl
    ? cldTransform(item.imageUrl, PREVIEW_TRANSFORM)
    : null;
  const columnBase = columnPreview(column, section);
  return {
    src: remote ?? columnBase.src,
    alt: "",
    title: item.name,
  };
}

function directGroupId(sectionId) {
  return `${sectionId}__direct`;
}

function MobileLookbook({
  sections,
  activeCategoryId,
  openSubcategoryId,
  onSelectCategory,
  onToggleSubcategory,
  onNavigate,
}) {
  const activeSection =
    sections.find((section) => section.id === activeCategoryId) ??
    sections[0] ??
    null;
  const columns = activeSection ? desktopColumns(activeSection) : [];
  const activeColumn =
    columns.find((column) => column.id === openSubcategoryId) ?? null;

  if (!activeSection) {
    return <p className={styles.status}>Choose a category</p>;
  }

  return (
    <div className={styles.phoneSheet}>
      <ul className={styles.phoneCategories} aria-label="Service categories">
        {sections.map((section) => {
          const isActive = activeSection.id === section.id;
          return (
            <li key={section.id} className={styles.phoneCategoryItem}>
              <button
                type="button"
                className={`${styles.phoneCategory} ${
                  isActive ? styles.phoneCategoryActive : ""
                } ${hasArabic(section.title) ? styles.megaQuietScript : ""}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelectCategory(section.id)}
              >
                {section.title}
              </button>
            </li>
          );
        })}
      </ul>

      <Link
        href={buildServicesCategoryPath(activeSection.id)}
        className={styles.phoneView}
        onClick={onNavigate}
      >
        View services
      </Link>

      {columns.length ? (
        <ul className={styles.phoneGroups} aria-label="Subcategories">
          {columns.map((column) => {
            const isOpen = activeColumn?.id === column.id;
            const href = buildServicesCategoryPath(
              activeSection.id,
              column.groupId ? [column.groupId] : [],
            );
            const shown = column.items.slice(0, DESKTOP_SERVICE_LIMIT);
            return (
              <li key={column.id}>
                <button
                  type="button"
                  className={`${styles.phoneGroup} ${
                    isOpen ? styles.phoneGroupOpen : ""
                  } ${hasArabic(column.title) ? styles.megaQuietScript : ""}`}
                  aria-expanded={isOpen}
                  onClick={() => onToggleSubcategory(column.id)}
                >
                  <span>{column.title}</span>
                  <ChevronDown
                    size={16}
                    className={`${dropChevronClass} ${styles.phoneChevron} ${
                      isOpen ? styles.phoneChevronOpen : ""
                    }`}
                    aria-hidden
                  />
                </button>
                <DropPanel open={isOpen}>
                  <ul className={styles.phoneServices} aria-label={column.title}>
                    {shown.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={buildServicesCategoryPath(
                            activeSection.id,
                            column.groupId ? [column.groupId] : [],
                            item.id,
                          )}
                          className={styles.phoneService}
                          onClick={onNavigate}
                        >
                          <FitName>{item.name}</FitName>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href={href}
                        className={styles.phoneViewAll}
                        onClick={onNavigate}
                      >
                        View all
                      </Link>
                    </li>
                  </ul>
                </DropPanel>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.emptyNested}>No services in this group.</p>
      )}
    </div>
  );
}

function DesktopMegaPanel({
  sections,
  activeCategoryId,
  onSelectCategory,
  onNavigate,
}) {
  const activeSection =
    sections.find((section) => section.id === activeCategoryId) ??
    sections[0] ??
    null;
  const columns = activeSection ? desktopColumns(activeSection) : [];
  const fallbackPreview = useMemo(
    () =>
      activeSection
        ? resolvePreview(activeSection, activeSection.title)
        : { src: null, alt: "", title: "" },
    [activeSection],
  );
  const [preview, setPreview] = useState(fallbackPreview);

  useEffect(() => {
    setPreview(fallbackPreview);
  }, [fallbackPreview]);

  const showColumn = (column) => {
    if (!activeSection) return;
    setPreview(columnPreview(column, activeSection));
  };

  const showService = (column, item) => {
    if (!activeSection) return;
    setPreview(servicePreview(item, column, activeSection));
  };

  return (
    <div className={styles.megaShell}>
      <ul className={styles.megaCategories} aria-label="Service categories">
        {sections.map((section) => {
          const isActive = activeSection?.id === section.id;
          return (
            <li key={section.id}>
              <button
                type="button"
                className={`${styles.megaCategory} ${
                  isActive ? styles.megaCategoryActive : ""
                } ${hasArabic(section.title) ? styles.megaQuietScript : ""}`}
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

      {activeSection ? (
        <div className={styles.mega}>
          <div className={styles.megaMedia}>
            <div
              className={
                preview.src ? styles.megaFrame : styles.megaFrameFallback
              }
            >
              {preview.src ? (
                <>
                  <Image
                    key={preview.src}
                    src={preview.src}
                    alt={preview.alt}
                    fill
                    className={styles.megaImage}
                    sizes="(max-width: 1440px) 38vw, 520px"
                  />
                  <div className={styles.megaScrim} aria-hidden />
                </>
              ) : null}
              <div className={styles.megaCopy}>
                {preview.src ? null : (
                  <p
                    className={`${styles.megaMediaTitle} ${
                      hasArabic(preview.title) ? styles.megaQuietScript : ""
                    }`}
                  >
                    {preview.title}
                  </p>
                )}
                <Link
                  href={buildServicesCategoryPath(activeSection.id)}
                  className={styles.megaView}
                  onClick={onNavigate}
                >
                  View services
                </Link>
              </div>
            </div>
          </div>

          {columns.length ? (
            <div className={styles.megaColumns}>
              {columns.map((column) => {
                const href = buildServicesCategoryPath(
                  activeSection.id,
                  column.groupId ? [column.groupId] : [],
                );
                const shown = column.items.slice(0, DESKTOP_SERVICE_LIMIT);
                return (
                  <div
                    key={column.id}
                    className={styles.megaColumn}
                    onPointerEnter={() => showColumn(column)}
                    onPointerLeave={() => setPreview(fallbackPreview)}
                    onBlurCapture={(event) => {
                      const next = event.relatedTarget;
                      if (next instanceof Node && event.currentTarget.contains(next)) {
                        return;
                      }
                      setPreview(fallbackPreview);
                    }}
                  >
                    <Link
                      href={href}
                      className={`${styles.megaColumnTitle} ${
                        hasArabic(column.title) ? styles.megaQuietScript : ""
                      }`}
                      onClick={onNavigate}
                      onFocus={() => showColumn(column)}
                    >
                      {column.title}
                    </Link>
                    <ul className={styles.megaServiceList} aria-label={column.title}>
                      {shown.map((item) => (
                        <li key={item.id}>
                          <Link
                            href={buildServicesCategoryPath(
                              activeSection.id,
                              column.groupId ? [column.groupId] : [],
                              item.id,
                            )}
                            className={styles.megaService}
                            onClick={onNavigate}
                            onPointerEnter={() => showService(column, item)}
                            onPointerLeave={(event) => {
                              const next = event.relatedTarget;
                              const columnEl = event.currentTarget.closest(
                                `.${styles.megaColumn}`,
                              );
                              if (!(next instanceof Node) || !columnEl?.contains(next)) {
                                return;
                              }
                              if (
                                next instanceof Element &&
                                next.closest(`.${styles.megaService}`)
                              ) {
                                return;
                              }
                              showColumn(column);
                            }}
                            onFocus={() => showService(column, item)}
                          >
                            <FitName>{item.name}</FitName>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={href}
                      className={styles.megaViewAll}
                      onClick={onNavigate}
                    >
                      View all
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className={styles.emptyNested}>No services in this group.</p>
          )}
        </div>
      ) : (
        <p className={styles.status}>Choose a category</p>
      )}
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
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const [loadState, setLoadState] = useState("idle");
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState(null);
  const [panelCoords, setPanelCoords] = useState(null);
  const [isWide, setIsWide] = useState(false);

  useLayoutEffect(() => {
    const media = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const apply = () => setIsWide(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const useEditorial = variant === "desktop" || (variant !== "mobile" && isWide);
  const isDrawer = !useEditorial;
  const ready = loadState === "ready" && sections.length > 0;

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

  const selectCategory = useCallback((categoryId) => {
    setActiveCategoryId(categoryId);
  }, []);

  const toggleSubcategory = useCallback((groupId) => {
    setActiveSubcategoryId((prev) => (prev === groupId ? null : groupId));
  }, []);

  useEffect(() => {
    if (!activeCategoryId || useEditorial) {
      setActiveSubcategoryId(null);
      return;
    }
    const section = sections.find((item) => item.id === activeCategoryId);
    const firstColumn = section ? desktopColumns(section)[0] : null;
    setActiveSubcategoryId(firstColumn?.id ?? null);
  }, [activeCategoryId, useEditorial, sections]);

  useEffect(() => {
    setOpen(false);
    resetTree();
  }, [useEditorial, resetTree]);

  useEffect(() => {
    if (!open || !sections.length) return;
    if (!activeCategoryId) {
      setActiveCategoryId(sections[0].id);
    }
  }, [open, sections, activeCategoryId]);

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
    if (!open || !useEditorial) return undefined;

    const onPointerDown = (event) => {
      if (triggerRef.current?.contains(event.target)) return;
      if (panelRef.current?.contains(event.target)) return;
      close();
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, useEditorial, close]);

  useEffect(() => {
    if (!open || !useEditorial) {
      setPanelCoords(null);
      return undefined;
    }

    const update = () => {
      const el = triggerRef.current;
      if (!el) return;
      const anchor =
        el.closest("header")?.getBoundingClientRect() ??
        el.closest("nav")?.getBoundingClientRect() ??
        el.getBoundingClientRect();
      const bottomReserve = 4.25 * 16 + 12;
      setPanelCoords({
        top: anchor.bottom,
        left: 0,
        width: window.innerWidth,
        maxHeight: Math.max(
          280,
          window.innerHeight - anchor.bottom - bottomReserve,
        ),
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, useEditorial]);

  const handleNavigate = useCallback(() => {
    close();
    onNavigate?.();
  }, [close, onNavigate]);

  const triggerClassName = variant === "desktop"
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
        (useEditorial ? (
          <DesktopMegaPanel
            sections={sections}
            activeCategoryId={activeCategoryId}
            onSelectCategory={selectCategory}
            onNavigate={handleNavigate}
          />
        ) : (
          <MobileLookbook
            sections={sections}
            activeCategoryId={activeCategoryId}
            openSubcategoryId={activeSubcategoryId}
            onSelectCategory={selectCategory}
            onToggleSubcategory={toggleSubcategory}
            onNavigate={handleNavigate}
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
                <div className={styles.drawerBody}>{bodyContent}</div>
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
            </div>
          ),
          document.body,
        )
      : null;

  return (
    <div
      className={styles.wrap}
      onMouseEnter={variant !== "mobile" ? () => void ensureCatalog() : undefined}
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
        {variant === "desktop" || variant === "mobile" ? (
          <span>Services</span>
        ) : (
          <>
            <Scissors size={22} strokeWidth={1} className={styles.topbarIcon} aria-hidden />
            <span className={styles.topbarLabel}>Services</span>
          </>
        )}
      </button>
      {overlay}
    </div>
  );
}
