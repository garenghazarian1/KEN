"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Gallery.modern.module.css";

const galleryImages = [
  {
    id: 1,
    src: "/heroGridImage/hero001.webp",
    category: "hair",
    title: "Hair Styling Excellence",
  },
  {
    id: 2,
    src: "/heroGridImage/hero002.webp",
    category: "makeup",
    title: "Makeup Artistry",
  },
  {
    id: 3,
    src: "/heroGridImage/hero003.webp",
    category: "hair",
    title: "Color Transformation",
  },
  {
    id: 4,
    src: "/heroGridImage/hero004.webp",
    category: "nails",
    title: "Nail Art Design",
  },
  {
    id: 5,
    src: "/heroGridImage/hero007.webp",
    category: "barber",
    title: "Men's Grooming",
  },
  {
    id: 6,
    src: "/heroGridImage/hero008.webp",
    category: "facial",
    title: "Facial Treatment",
  },
  {
    id: 7,
    src: "/heroGridImage/hero009.webp",
    category: "hair",
    title: "Complete Makeover",
  },
];

const categories = ["all", "hair", "makeup", "nails", "barber", "facial"];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const dialogRef = useRef(null);

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const current = filteredImages[lightboxIndex];

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const navigateLightbox = useCallback(
    (direction) => {
      setLightboxIndex((prev) => {
        const len = filteredImages.length;
        if (len === 0) return 0;
        if (direction === "prev") return prev === 0 ? len - 1 : prev - 1;
        return prev === len - 1 ? 0 : prev + 1;
      });
    },
    [filteredImages.length]
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightboxOpen && !dialog.open) dialog.showModal();
    if (!lightboxOpen && dialog.open) dialog.close();
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigateLightbox("prev");
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigateLightbox("next");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, navigateLightbox]);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleLine1}>Our</span>
          <span className={styles.titleLine2}>Gallery</span>
        </h1>
        <p className={styles.subtitle}>
          Discover our latest beauty transformations and stunning work
        </p>
      </header>

      <div className={styles.filters} role="group" aria-label="Filter by category">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={styles.categoryBtn}
            aria-pressed={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <section className={styles.gallerySection} aria-label="Gallery photos">
        <ul className={styles.galleryGrid}>
          {filteredImages.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                className={styles.galleryItem}
                onClick={() => openLightbox(index)}
              >
                <span className={styles.frame}>
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    className={styles.galleryImage}
                    sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                  />
                </span>
                <span className={styles.caption}>{image.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        aria-labelledby="gallery-lightbox-title"
        onClose={closeLightbox}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeLightbox();
        }}
      >
        {current ? (
          <>
            <button
              type="button"
              className={`${styles.lightboxControl} ${styles.lightboxClose}`}
              onClick={closeLightbox}
              aria-label="Close gallery"
            >
              <X size={22} aria-hidden="true" />
            </button>

            <button
              type="button"
              className={`${styles.lightboxControl} ${styles.lightboxPrev}`}
              onClick={() => navigateLightbox("prev")}
              aria-label="Previous photo"
            >
              <ChevronLeft size={26} aria-hidden="true" />
            </button>

            <button
              type="button"
              className={`${styles.lightboxControl} ${styles.lightboxNext}`}
              onClick={() => navigateLightbox("next")}
              aria-label="Next photo"
            >
              <ChevronRight size={26} aria-hidden="true" />
            </button>

            <div className={styles.lightboxStage}>
              <div className={styles.lightboxFrame}>
                <Image
                  src={current.src}
                  alt={current.title}
                  fill
                  className={styles.lightboxImage}
                  sizes="90vw"
                  priority
                />
              </div>
              <h2 id="gallery-lightbox-title" className={styles.lightboxTitle}>
                {current.title}
              </h2>
              <p className={styles.lightboxCounter}>
                {lightboxIndex + 1} / {filteredImages.length}
              </p>
            </div>
          </>
        ) : null}
      </dialog>
    </main>
  );
}
