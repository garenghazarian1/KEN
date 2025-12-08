"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Instagram,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  Sparkles,
  Grid3x3,
  LayoutGrid,
} from "lucide-react";
import InstagramEmbed from "@/components/instagram/InstagramEmbed";
import { BUSINESS, SOCIAL_MEDIA } from "@/config/constants";
import styles from "./Gallery.modern.module.css";

// Sample gallery images - replace with your actual images
const galleryImages = [
  {
    id: 1,
    src: "/heroGridImage/hero001.jpg",
    category: "hair",
    title: "Hair Styling Excellence",
  },
  {
    id: 2,
    src: "/heroGridImage/hero002.jpg",
    category: "makeup",
    title: "Makeup Artistry",
  },
  {
    id: 3,
    src: "/heroGridImage/hero003.jpg",
    category: "hair",
    title: "Color Transformation",
  },
  {
    id: 4,
    src: "/heroGridImage/hero004.jpg",
    category: "nails",
    title: "Nail Art Design",
  },
  {
    id: 5,
    src: "/heroGridImage/hero007.jpg",
    category: "barber",
    title: "Men's Grooming",
  },
  {
    id: 6,
    src: "/heroGridImage/hero008.jpg",
    category: "facial",
    title: "Facial Treatment",
  },
  {
    id: 7,
    src: "/heroGridImage/hero009.jpg",
    category: "hair",
    title: "Complete Makeover",
  },
];

const categories = ["all", "hair", "makeup", "nails", "barber", "facial"];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [viewMode, setViewMode] = useState("masonry");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setViewMode("grid");
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "unset";
  };

  const navigateLightbox = (direction) => {
    if (direction === "prev") {
      setLightboxIndex((prev) =>
        prev === 0 ? filteredImages.length - 1 : prev - 1
      );
    } else {
      setLightboxIndex((prev) =>
        prev === filteredImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateLightbox("prev");
      if (e.key === "ArrowRight") navigateLightbox("next");
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [lightboxOpen]);

  return (
    <main className={styles.main}>
      {/* Animated Background */}
      <div className={styles.backgroundElements}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
        <div className={styles.gradientOrb3} />
      </div>

      {/* Hero Section */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.heroContent}>
          <motion.div
            className={styles.decorativeIcon}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles size={48} strokeWidth={1.5} />
          </motion.div>

          <h1 className={styles.title}>
            <span className={styles.titleMain}>Our</span>{" "}
            <span className={styles.titleAccent}>Gallery</span>
          </h1>

          <p className={styles.subtitle}>
            Discover our latest beauty transformations and stunning work
          </p>

          {/* Social Links */}
          <div className={styles.socialLinks}>
            <motion.a
              href={SOCIAL_MEDIA.instagram.beauty}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram size={20} />
              <span>@ken_beauty_ad</span>
              <ExternalLink size={16} className={styles.socialLinkIcon} />
            </motion.a>
            <motion.a
              href={SOCIAL_MEDIA.instagram.barbershop}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram size={20} />
              <span>@ken_barbershop.ad</span>
              <ExternalLink size={16} className={styles.socialLinkIcon} />
            </motion.a>
          </div>
        </div>
      </motion.section>

      {/* Gallery Controls */}
      <motion.section
        className={styles.controlsSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className={styles.controls}>
          {/* Category Filter */}
          <div className={styles.categoryFilter}>
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`${styles.categoryBtn} ${
                  selectedCategory === category ? styles.active : ""
                }`}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>

          {/* View Mode Toggle */}
          {!isMobile && (
            <div className={styles.viewModeToggle}>
              <button
                className={`${styles.viewBtn} ${
                  viewMode === "masonry" ? styles.active : ""
                }`}
                onClick={() => setViewMode("masonry")}
                aria-label="Masonry view"
              >
                <LayoutGrid size={20} />
              </button>
              <button
                className={`${styles.viewBtn} ${
                  viewMode === "grid" ? styles.active : ""
                }`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <Grid3x3 size={20} />
              </button>
            </div>
          )}
        </div>
      </motion.section>

      {/* Gallery Grid */}
      <motion.section
        className={styles.gallerySection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${viewMode}`}
            className={`${styles.galleryGrid} ${
              viewMode === "masonry" ? styles.masonry : styles.grid
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                className={styles.galleryItem}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => openLightbox(index)}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={image.src}
                    alt={image.title}
                    width={600}
                    height={800}
                    className={styles.galleryImage}
                    loading={index < 6 ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className={styles.imageOverlay}>
                    <div className={styles.overlayContent}>
                      <Heart size={24} className={styles.overlayIcon} />
                      <span className={styles.overlayText}>{image.title}</span>
                    </div>
                  </div>
                  <div className={styles.imageBadge}>{image.category}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.section>

      {/* Instagram Section */}
      <motion.section
        className={styles.instagramSection}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.sectionHeader}>
          <div className={styles.headerIcon}>
            <Instagram size={32} />
          </div>
          <h2 className={styles.sectionTitle}>Instagram Highlights</h2>
          <p className={styles.sectionSubtitle}>
            Follow us for daily inspiration and behind-the-scenes content
          </p>
        </div>
        <InstagramEmbed />
      </motion.section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.button
              className={styles.lightboxClose}
              onClick={closeLightbox}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={28} />
            </motion.button>

            <motion.button
              className={styles.lightboxNav}
              style={{ left: "2rem" }}
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("prev");
              }}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={32} />
            </motion.button>

            <motion.button
              className={styles.lightboxNav}
              style={{ right: "2rem" }}
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("next");
              }}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={32} />
            </motion.button>

            <motion.div
              className={styles.lightboxContent}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Image
                src={filteredImages[lightboxIndex]?.src}
                alt={filteredImages[lightboxIndex]?.title || "Gallery image"}
                width={1200}
                height={1600}
                className={styles.lightboxImage}
                priority
              />
              <div className={styles.lightboxInfo}>
                <h3 className={styles.lightboxInfoTitle}>
                  {filteredImages[lightboxIndex]?.title}
                </h3>
                <span className={styles.lightboxCategory}>
                  {filteredImages[lightboxIndex]?.category}
                </span>
              </div>
            </motion.div>

            <div className={styles.lightboxCounter}>
              {lightboxIndex + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
