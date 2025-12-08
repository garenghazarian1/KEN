"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Apple, Play } from "lucide-react";
import { APP_STORES, BUSINESS } from "@/config/constants";
import styles from "./AppInstallBanner.modern.module.css";

export default function AppInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deviceType, setDeviceType] = useState(null);
  const bannerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user has already dismissed the banner
    const dismissed = localStorage.getItem("appInstallBannerDismissed");

    // Development mode: Allow testing via URL parameter or localStorage flag
    const isDevelopment =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    const urlParams = new URLSearchParams(window.location.search);
    const testMode = urlParams.get("testAppBanner");
    const forceShow = localStorage.getItem("forceShowAppBanner") === "true";

    // In development test mode, bypass dismissal check
    if (isDevelopment && (testMode || forceShow)) {
      const testDevice =
        urlParams.get("device") ||
        localStorage.getItem("testDeviceType") ||
        "android";
      setDeviceType(testDevice);
      setShowBanner(true);
      return;
    }

    // If dismissed, don't show banner (unless in test mode)
    if (dismissed === "true") {
      return;
    }

    // Detect device type
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Check for Android
    if (/android/i.test(userAgent)) {
      setDeviceType("android");
      setShowBanner(true);
      return;
    }

    // Check for iOS (iPhone, iPad, iPod)
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setDeviceType("ios");
      setShowBanner(true);
      return;
    }
  }, []);

  // Add/remove class to body when banner is visible and update navbar position
  useEffect(() => {
    if (showBanner && bannerRef.current) {
      document.body.classList.add("app-banner-visible");
      // Calculate and set banner height for navbar adjustment
      const updateBannerHeight = () => {
        if (bannerRef.current) {
          const height = bannerRef.current.offsetHeight;
          document.documentElement.style.setProperty(
            "--app-banner-height",
            `${height}px`
          );
        }
      };

      // Update height initially and on resize
      updateBannerHeight();
      window.addEventListener("resize", updateBannerHeight);

      return () => {
        window.removeEventListener("resize", updateBannerHeight);
      };
    } else {
      document.body.classList.remove("app-banner-visible");
      document.documentElement.style.setProperty("--app-banner-height", "0px");
    }
  }, [showBanner]);

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("appInstallBannerDismissed", "true");
    }
    setShowBanner(false);
  };

  const handleInstall = () => {
    if (deviceType === "android") {
      window.open(APP_STORES.googlePlay, "_blank");
    } else if (deviceType === "ios") {
      window.open(APP_STORES.appleAppStore, "_blank");
    }
    // Track the click (optional)
    handleDismiss();
  };

  if (!showBanner || !deviceType) {
    return null;
  }

  const isAndroid = deviceType === "android";
  const isIOS = deviceType === "ios";

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          ref={bannerRef}
          className={styles.banner}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className={styles.bannerContent}>
            <div className={styles.bannerText}>
              <div className={styles.iconWrapper}>
                <Smartphone size={24} className={styles.icon} />
              </div>
              <div className={styles.textContent}>
                <h3 className={styles.textContentTitle}>
                  Get the {BUSINESS.name} App
                </h3>
                <p className={styles.textContentDescription}>
                  Install our app for a better experience. Book appointments,
                  browse services, and stay updated on the go!
                </p>
              </div>
            </div>
            <div className={styles.bannerActions}>
              <button
                onClick={handleInstall}
                className={styles.installButton}
                aria-label={`Install from ${
                  isAndroid ? "Google Play" : "App Store"
                }`}
              >
                {isAndroid ? (
                  <>
                    <Play size={18} />
                    <span>Get on Google Play</span>
                  </>
                ) : (
                  <>
                    <Apple size={18} />
                    <span>Get on App Store</span>
                  </>
                )}
              </button>
              <button
                onClick={handleDismiss}
                className={styles.dismissButton}
                aria-label="Dismiss banner"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
