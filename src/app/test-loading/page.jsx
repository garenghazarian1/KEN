"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LoadingSkeletonModern from "@/components/loading/LoadingSkeleton.modern";
import styles from "./test-loading.module.css";

export default function TestLoadingPage() {
  const [showLoading, setShowLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestLoading = () => {
    setIsLoading(true);
    setShowLoading(true);
    
    // Simulate loading for 3 seconds
    setTimeout(() => {
      setIsLoading(false);
      setShowLoading(false);
    }, 3000);
  };

  return (
    <div className={styles.container}>
      {showLoading && <LoadingSkeletonModern />}
      
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Loading Spinner Test</h1>
        <p>Click the button below to see the loading spinner in action:</p>
        <button
          onClick={handleTestLoading}
          className={styles.testButton}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Show Loading Spinner"}
        </button>
      </motion.div>
    </div>
  );
}

