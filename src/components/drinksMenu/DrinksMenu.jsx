"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Coffee, GlassWater, Plus, Sparkles } from "lucide-react";
import { drinksCategories } from "@/data/drinks";
import styles from "./DrinksMenu.module.css";

export default function DrinksMenu() {
  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case "hot":
        return Coffee;
      case "cold":
        return GlassWater;
      case "addons":
        return Plus;
      default:
        return Coffee;
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className={styles.headerBadge}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
        >
          <Sparkles size={16} className={styles.badgeIcon} />
          <span className={styles.badgeText}>Complimentary</span>
        </motion.div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.span
            className={styles.titleLine1}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Beverage
          </motion.span>
          <motion.span
            className={styles.titleLine2}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Menu
          </motion.span>
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Curated selection of premium drinks
          <br />
          <span className={styles.subtitleAccent}>
            complimentary during your visit
          </span>
        </motion.p>
      </motion.div>

      {/* Categories Grid */}
      <div className={styles.categoriesGrid}>
        {drinksCategories.map((category, categoryIndex) => {
          const Icon = getCategoryIcon(category.id);
          return (
            <motion.section
              key={category.id}
              className={styles.categorySection}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.7 + categoryIndex * 0.15,
                type: "spring",
                stiffness: 100,
              }}
            >
              <motion.div
                className={styles.categoryHeader}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.8 + categoryIndex * 0.15,
                }}
              >
                <motion.div
                  className={styles.categoryIcon}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  <Icon size={32} strokeWidth={2} />
                </motion.div>
                <h2 className={styles.categoryTitle}>{category.title}</h2>
              </motion.div>

              {/* Drinks Grid */}
              <div className={styles.drinksGrid}>
                {category.drinks.map((drink, drinkIndex) => (
                  <motion.div
                    key={drink.name}
                    className={styles.drinkCard}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.5,
                      delay: drinkIndex * 0.05,
                      type: "spring",
                      stiffness: 100,
                    }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <div className={styles.cardGlow}></div>
                    <motion.div
                      className={styles.imageContainer}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.6,
                        delay: drinkIndex * 0.05 + 0.1,
                      }}
                    >
                      {drink.image ? (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                          className={styles.imageWrapper}
                        >
                          <Image
                            src={drink.image}
                            alt={drink.name}
                            width={300}
                            height={300}
                            className={styles.drinkImage}
                            priority={drinkIndex < 4}
                            loading={drinkIndex < 4 ? undefined : "lazy"}
                          />
                        </motion.div>
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <Icon size={48} className={styles.placeholderIcon} />
                          <span className={styles.placeholderText}>
                            {drink.name}
                          </span>
                        </div>
                      )}
                    </motion.div>
                    <div className={styles.drinkInfo}>
                      <h3 className={styles.drinkName}>{drink.name}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>

      <motion.div
        className={styles.footerNote}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className={styles.footerIcon}>
          <Sparkles size={20} />
        </div>
        <p>
          All beverages are complimentary and available at all Ken Beauty Salon
          locations.
        </p>
      </motion.div>
    </div>
  );
}
