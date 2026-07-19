"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Scissors, Sparkles, X } from "lucide-react";
import { getCategoryImage } from "@/data/serviceImages";
import { cldTransform } from "@/utils/cloudinary";
import { buildServicesCategoryPath } from "@/utils/serviceCategoryUrl";
import styles from "./ServicesMegaMenu.module.css";

const THUMB_TRANSFORM = "f_auto,q_auto,w_120,h_120,c_fill,g_auto";

function sectionHasGroups(section) {
  return Boolean(section?.groups?.length);
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

function RowThumb({ node, fallbackTitle }) {
  const cover = resolveThumb(node, fallbackTitle);

  return (
    <span className={styles.thumb} aria-hidden={!cover}>
      {cover ? (
        <Image
          src={cover.src}
          alt={cover.kind === "static" ? cover.alt : ""}
          fill
          className={styles.thumbImage}
          sizes="56px"
        />
      ) : (
        <span className={styles.thumbFallback}>
          <Sparkles size={18} strokeWidth={1.75} />
        </span>
      )}
    </span>
  );
}

/**
 * Drill-down services viewer for the live top bar.
 * Portaled to document.body so backdrop-filter on the top bar cannot trap it.
 */
export default function ServicesMegaMenu({
  variant = "topbar",
  onNavigate,
  isActive = false,
}) {
  const panelId = useId();
  const loadRef = useRef("idle");
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const [loadState, setLoadState] = useState("idle");
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState(null);

  const activeSection =
    sections.find((section) => section.id === activeCategoryId) ?? null;
  const activeGroup =
    activeSection?.groups?.find((group) => group.id === activeSubcategoryId) ??
    null;

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetDrill = useCallback(() => {
    setActiveCategoryId(null);
    setActiveSubcategoryId(null);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    resetDrill();
  }, [resetDrill]);

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
        resetDrill();
      }
      return next;
    });
  }, [ensureCatalog, resetDrill]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (activeSubcategoryId) {
        setActiveSubcategoryId(null);
      } else if (activeCategoryId) {
        setActiveCategoryId(null);
      } else {
        close();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close, activeCategoryId, activeSubcategoryId]);

  const handleNavigate = useCallback(() => {
    close();
    onNavigate?.();
  }, [close, onNavigate]);

  const goBack = useCallback(() => {
    if (activeSubcategoryId) {
      setActiveSubcategoryId(null);
      return;
    }
    if (activeCategoryId) {
      setActiveCategoryId(null);
    }
  }, [activeCategoryId, activeSubcategoryId]);

  const headerTitle =
    activeGroup?.title ?? activeSection?.title ?? "Services";

  const showCategories = !activeSection;
  const showSubcategories = Boolean(
    activeSection && sectionHasGroups(activeSection) && !activeGroup,
  );
  const showServices = Boolean(
    activeGroup || (activeSection && !sectionHasGroups(activeSection)),
  );
  const serviceItems = activeGroup
    ? activeGroup.items
    : (activeSection?.items ?? []);

  const triggerClassName =
    variant === "desktop"
      ? `${styles.trigger} ${open ? styles.triggerOpen : ""}`
      : `${styles.topbarTrigger} ${open ? styles.topbarTriggerOpen : ""} ${
          isActive ? styles.topbarTriggerActive : ""
        }`;

  const drawer =
    open && mounted
      ? createPortal(
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
                <div className={styles.drawerHeaderStart}>
                  {(activeCategoryId || activeSubcategoryId) && (
                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={goBack}
                      aria-label="Go back"
                    >
                      <ChevronLeft size={22} aria-hidden />
                    </button>
                  )}
                  <h2 className={styles.drawerTitle}>{headerTitle}</h2>
                </div>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={close}
                  aria-label="Close"
                >
                  <X size={20} aria-hidden />
                </button>
              </header>

              <div className={styles.drawerBody}>
                {(loadState === "idle" || loadState === "loading") && (
                  <p className={styles.status}>Loading services…</p>
                )}
                {loadState === "error" && (
                  <p className={styles.status} role="alert">
                    {errorMessage}
                  </p>
                )}
                {loadState === "ready" && sections.length === 0 && (
                  <p className={styles.status}>No services available.</p>
                )}

                {loadState === "ready" &&
                  showCategories &&
                  sections.length > 0 && (
                    <ul className={styles.list} aria-label="Service categories">
                      {sections.map((section) => {
                        const count = totalCount(section);
                        return (
                          <li key={section.id}>
                            <button
                              type="button"
                              className={styles.row}
                              onClick={() => {
                                setActiveCategoryId(section.id);
                                setActiveSubcategoryId(null);
                              }}
                            >
                              <RowThumb node={section} />
                              <span className={styles.rowText}>
                                <span className={styles.rowTitle}>
                                  {section.title}
                                </span>
                                <span className={styles.rowHint}>
                                  {count} service{count === 1 ? "" : "s"}
                                </span>
                              </span>
                              <ChevronRight
                                size={18}
                                className={styles.rowChevron}
                                aria-hidden
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                {showSubcategories && (
                  <ul className={styles.list} aria-label="Subcategories">
                    {activeSection.groups.map((group) => (
                      <li key={group.id}>
                        <button
                          type="button"
                          className={styles.row}
                          onClick={() => setActiveSubcategoryId(group.id)}
                        >
                          <RowThumb
                            node={group}
                            fallbackTitle={activeSection.title}
                          />
                          <span className={styles.rowText}>
                            <span className={styles.rowTitle}>
                              {group.title}
                            </span>
                            <span className={styles.rowHint}>
                              {group.items.length} service
                              {group.items.length === 1 ? "" : "s"}
                            </span>
                          </span>
                          <ChevronRight
                            size={18}
                            className={styles.rowChevron}
                            aria-hidden
                          />
                        </button>
                      </li>
                    ))}
                    {activeSection.items?.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={buildServicesCategoryPath(activeSection.id)}
                          className={styles.row}
                          onClick={handleNavigate}
                        >
                          <RowThumb
                            node={item}
                            fallbackTitle={activeSection.title}
                          />
                          <span className={styles.rowText}>
                            <span className={styles.rowTitle}>{item.name}</span>
                            {item.priceLabel ? (
                              <span className={styles.rowHint}>
                                {item.priceLabel}
                              </span>
                            ) : null}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {showServices && (
                  <ul className={styles.list} aria-label="Services">
                    {serviceItems.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={buildServicesCategoryPath(
                            activeSection.id,
                            activeGroup ? [activeGroup.id] : [],
                          )}
                          className={styles.row}
                          onClick={handleNavigate}
                        >
                          <RowThumb
                            node={item}
                            fallbackTitle={
                              activeGroup?.title ?? activeSection.title
                            }
                          />
                          <span className={styles.rowText}>
                            <span className={styles.rowTitle}>{item.name}</span>
                            {item.priceLabel ? (
                              <span className={styles.rowMeta}>
                                {item.priceLabel}
                              </span>
                            ) : null}
                          </span>
                        </Link>
                      </li>
                    ))}
                    {serviceItems.length === 0 && (
                      <li>
                        <p className={styles.status}>
                          No services in this group.
                        </p>
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <footer className={styles.drawerFooter}>
                <Link
                  href={
                    activeSection
                      ? buildServicesCategoryPath(
                          activeSection.id,
                          activeGroup ? [activeGroup.id] : [],
                        )
                      : "/services"
                  }
                  className={styles.footerLink}
                  onClick={handleNavigate}
                >
                  {activeSection
                    ? `Open ${activeGroup?.title ?? activeSection.title}`
                    : "View full services page"}
                </Link>
              </footer>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={triggerClassName}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-haspopup="dialog"
        aria-label="Services"
        onClick={toggle}
      >
        {variant === "desktop" ? (
          <span>Services</span>
        ) : (
          <>
            <Scissors size={22} className={styles.topbarIcon} aria-hidden />
            <span className={styles.topbarLabel}>Services</span>
          </>
        )}
      </button>
      {drawer}
    </div>
  );
}
