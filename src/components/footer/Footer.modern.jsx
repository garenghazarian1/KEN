"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Home,
  Info,
  Image as ImageIcon,
  FileText,
  Shield,
  Cookie,
  Building2,
  X,
  Check,
} from "lucide-react";
import {
  CONTACT,
  SOCIAL_MEDIA,
  BUSINESS,
  BOOKING_URL,
  BASE_URL,
} from "@/config/constants";
import { stores } from "@/data/stores";
import styles from "./Footer.modern.module.css";

export default function FooterModern() {
  const [cookieConsent, setCookieConsent] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowCookieBanner(true);
    } else {
      setCookieConsent(consent === "accepted");
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setCookieConsent(true);
    setShowCookieBanner(false);
  };

  const handleDeclineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setCookieConsent(false);
    setShowCookieBanner(false);
  };

  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { title: "Home", path: "/", icon: Home },
    { title: "Book Appointment", path: BOOKING_URL, icon: Calendar },
    { title: "About Us", path: "/about", icon: Info },
    { title: "Contact", path: "/contact", icon: Phone },
    { title: "Gallery", path: "/gallery", icon: ImageIcon },
  ];

  const legalLinks = [
    { title: "Privacy Policy", path: "/privacy", icon: Shield },
    { title: "Terms of Use", path: "/terms-of-use", icon: FileText },
    { title: "Cookie Notice", path: "/cookie-notice", icon: Cookie },
    { title: "Imprint", path: "/imprint", icon: Building2 },
  ];

  return (
    <>
      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div
            className={styles.cookieBanner}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className={styles.cookieContent}>
              <div className={styles.cookieText}>
                <Cookie size={24} className={styles.cookieIcon} />
                <div>
                  <h3>Cookie Consent</h3>
                  <p>
                    We use cookies to enhance your browsing experience and
                    analyze site traffic. By clicking &quot;Accept All&quot;,
                    you consent to our use of cookies.{" "}
                    <Link href="/cookie-notice" className={styles.cookieLink}>
                      Learn more
                    </Link>
                  </p>
                </div>
              </div>
              <div className={styles.cookieButtons}>
                <button
                  onClick={handleDeclineCookies}
                  className={styles.cookieDecline}
                  aria-label="Decline cookies"
                >
                  <X size={18} />
                  <span>Decline</span>
                </button>
                <button
                  onClick={handleAcceptCookies}
                  className={styles.cookieAccept}
                  aria-label="Accept all cookies"
                >
                  <Check size={18} />
                  <span>Accept All</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          {/* Top Section */}
          <div className={styles.footerTop}>
            {/* Company Info */}
            <motion.div
              className={styles.footerSection}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className={styles.sectionTitle}>{BUSINESS.name}</h3>
              <p className={styles.sectionDescription}>
                {BUSINESS.description}
              </p>
              <div className={styles.contactInfo}>
                <a
                  href={`tel:${CONTACT.primaryMobile.replace(/\s/g, "")}`}
                  className={styles.contactLink}
                  aria-label="Call us"
                >
                  <Phone size={18} />
                  <span>{CONTACT.primaryPhone}</span>
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className={styles.contactLink}
                  aria-label="Email us"
                >
                  <Mail size={18} />
                  <span>{CONTACT.email}</span>
                </a>
                <div className={styles.location}>
                  <MapPin size={18} />
                  <span>
                    {BUSINESS.location.city}, {BUSINESS.location.country}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className={styles.footerSection}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className={styles.sectionSubtitle}>Quick Links</h4>
              <ul className={styles.linkList}>
                {navigationLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.title}>
                      <Link href={link.path} className={styles.footerLink}>
                        <Icon size={16} />
                        <span>{link.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Locations */}
            <motion.div
              className={styles.footerSection}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className={styles.sectionSubtitle}>Our Locations</h4>
              <ul className={styles.locationList}>
                {stores.map((store) => (
                  <li key={store._id} className={styles.locationItem}>
                    <h5 className={styles.locationName}>{store.name}</h5>
                    <p className={styles.locationAddress}>
                      {store.street}, {store.city}
                    </p>
                    <a
                      href={`tel:${store.mobile.replace(/\s/g, "")}`}
                      className={styles.locationPhone}
                    >
                      {store.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Social Media */}
            <motion.div
              className={styles.footerSection}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className={styles.sectionSubtitle}>Follow Us</h4>
              <div className={styles.socialLinks}>
                <a
                  href={SOCIAL_MEDIA.instagram.beauty}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="Follow us on Instagram - Beauty"
                >
                  <Instagram size={20} />
                  <span>Beauty</span>
                </a>
                <a
                  href={SOCIAL_MEDIA.instagram.barbershop}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="Follow us on Instagram - Barbershop"
                >
                  <Instagram size={20} />
                  <span>Barbershop</span>
                </a>
                <a
                  href={SOCIAL_MEDIA.tiktok.beauty}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="Follow us on TikTok - Beauty"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  <span>TikTok</span>
                </a>
                {SOCIAL_MEDIA.twitter && (
                  <a
                    href={SOCIAL_MEDIA.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label="Follow us on Twitter"
                  >
                    <Twitter size={20} />
                    <span>Twitter</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className={styles.footerBottom}>
            <div className={styles.footerBottomContent}>
              <p className={styles.copyright}>
                © {currentYear} {BUSINESS.name}. All rights reserved.
              </p>
              <div className={styles.legalLinks}>
                {legalLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.title}
                      href={link.path}
                      className={styles.legalLink}
                    >
                      <Icon size={14} />
                      <span>{link.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

