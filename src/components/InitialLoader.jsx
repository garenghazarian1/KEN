"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSkeletonModern from "./loading/LoadingSkeleton.modern";

export default function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loader for minimum 1.5 seconds for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Also hide when page is fully loaded
    if (document.readyState === "complete") {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } else {
      window.addEventListener("load", () => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      });
    }

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingSkeletonModern />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

