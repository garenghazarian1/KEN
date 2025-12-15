"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MessageCircle,
  Send,
  ArrowRight,
  Sparkles,
  MapPin,
} from "lucide-react";
import styles from "./Contact.modern.module.css";

const getGoogleMapsUrl = (store) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${store.name} ${store.street}, ${store.city}, ${store.country || ""}`
  )}`;

const StoreInfo = ({ store, isFirst, index }) => {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
    >
      <div className={styles.content}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        >
          <h2 className={styles.title}>{store.name}</h2>
          <p className={styles.subtitle}>
            {store.street}, {store.city}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        >
          <Image
            src={store.imageStore}
            alt={`${store.name} location at ${store.street}, ${store.city}`}
            className={styles.image}
            width={800}
            height={600}
            priority={isFirst}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading={isFirst ? "eager" : "lazy"}
          />
        </motion.div>

        <motion.div
          className={styles.details}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
        >
          <motion.div
            className={styles.row}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
          >
            <span className={styles.label}>Address</span>
            <span>
              {store.street}, {store.city}, {store.country}
            </span>
          </motion.div>

          <motion.div
            className={styles.row}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
          >
            <MapPin size={16} className={styles.icon} />
            <span className={styles.label}>Map</span>
            <motion.a
              className={styles.mapLink}
              href={store.mapUrl || getGoogleMapsUrl(store)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${store.name} in Google Maps`}
              data-track="location-map"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Open in Google Maps
            </motion.a>
          </motion.div>

          {store.phone && (
            <motion.div
              className={styles.row}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.7 }}
            >
              <Phone size={16} className={styles.icon} />
              <span className={styles.label}>Landline</span>
              <a
                className={styles.link}
                href={`tel:${store.phone.replace(/\s/g, "")}`}
                aria-label={`Call ${store.phone}`}
              >
                {store.phone}
              </a>
            </motion.div>
          )}

          {store.mobile && (
            <motion.div
              className={styles.row}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.8 }}
            >
              <Phone size={16} className={styles.icon} />
              <span className={styles.label}>Mobile</span>
              <a
                className={styles.link}
                href={`tel:${store.mobile.replace(/\s/g, "")}`}
                aria-label={`Call ${store.mobile}`}
              >
                {store.mobile}
              </a>
            </motion.div>
          )}

          {store.whatsapp && (
            <motion.div
              className={styles.row}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.9 }}
            >
              <MessageCircle size={16} className={styles.icon} />
              <span className={styles.label}>WhatsApp</span>
              <motion.a
                className={styles.whatsapp}
                href={`https://wa.me/${store.whatsapp.replace(
                  /[\s+]/g,
                  ""
                )}?text=${encodeURIComponent(
                  "Hello KEN Beauty Center, I would like to know more about your services."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${store.whatsapp}`}
                data-track="location-whatsapp"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {store.whatsapp}
              </motion.a>
            </motion.div>
          )}

          <motion.div
            className={styles.row}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 + 1.0 }}
          >
            <Mail size={16} className={styles.icon} />
            <span className={styles.label}>Email</span>
            <motion.a
              className={styles.link}
              href={`mailto:${store.email}?subject=Inquiry about ${store.name}&body=Hello, I would like to know more about your services.`}
              aria-label={`Email ${store.email}`}
              data-track="location-email"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {store.email}
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function ContactContent({ stores }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(
      `Inquiry from ${formData.name || "Ken Beauty guest"}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name || "Not provided"}\nEmail: ${
        formData.email || "Not provided"
      }\nPhone: ${formData.phone || "Not provided"}\n\nMessage:\n${
        formData.message || "I&apos;d like to know more about your services."
      }`
    );
    return `mailto:info@ken-salon.com?subject=${subject}&body=${body}`;
  }, [formData]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Clear any previous error messages
    const errorElements = document.querySelectorAll(`.${styles.errorText}`);
    errorElements.forEach((el) => (el.textContent = ""));

    // Basic validation
    const form = event.target;
    if (!form.checkValidity()) {
      // Handle HTML5 validation
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) {
        firstInvalid.focus();
        const errorId = firstInvalid
          .getAttribute("aria-describedby")
          ?.split(" ")[0];
        if (errorId) {
          const errorEl = document.getElementById(errorId);
          if (errorEl) {
            errorEl.textContent = firstInvalid.validationMessage;
          }
        }
      }
      return;
    }

    // Open mailto link
    window.location.href = mailtoHref;
  };

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className={styles.splitContainer}>
        <motion.div
          className={styles.splitLeft}
          style={{ backgroundImage: "url('/heroGridImage/hero004.webp')" }}
          role="img"
          aria-label="Luxury beauty salon interior showcasing elegant design and ambiance"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.splitOverlay} />
          <div className={styles.heroCopy}>
            <motion.div
              className={styles.kicker}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.span
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  delay: 0.4,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <Sparkles size={16} aria-hidden="true" />
              </motion.span>
              <span>Concierge, 7 days</span>
            </motion.div>
            <motion.h1
              className={styles.editorialTitle}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              Visit, call, or message our lounges
            </motion.h1>
            <motion.p
              className={styles.heroSubtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Luxe care, zero friction. Stop by, call to reserve, or WhatsApp us
              for instant confirmations.
            </motion.p>
            <motion.div
              className={styles.heroActions}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <a
                className={styles.primaryAction}
                href="tel:+971503043570"
                data-track="cta-call"
              >
                <Phone size={18} />
                Call our team
              </a>
              <motion.a
                className={styles.secondaryAction}
                href="https://wa.me/971503043570?text=Hello%20KEN%20Beauty%20Center%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                data-track="cta-whatsapp"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle size={18} />
                WhatsApp now
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className={styles.splitRight}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className={styles.floatingCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ y: -4 }}
          >
            <div
              className={styles.quickActions}
              aria-label="Quick contact actions"
            >
              <motion.a
                className={styles.quickAction}
                href="mailto:info@ken-salon.com"
                data-track="cta-email"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail size={16} />
                Email concierge
                <motion.span
                  className={styles.quickActionArrow}
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight size={14} />
                </motion.span>
              </motion.a>
              <motion.a
                className={styles.quickAction}
                href="https://wa.me/971503043570?text=Hi!%20I'd%20like%20to%20book%20an%20appointment."
                target="_blank"
                rel="noopener noreferrer"
                data-track="cta-whatsapp-secondary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle size={16} />
                WhatsApp booking
                <motion.span
                  className={styles.quickActionArrow}
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                >
                  <ArrowRight size={14} />
                </motion.span>
              </motion.a>
              <a
                className={styles.quickAction}
                href="tel:+97126218802"
                data-track="cta-landline"
              >
                <Phone size={16} />
                Front desk
                <motion.span
                  className={styles.quickActionArrow}
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6,
                  }}
                >
                  <ArrowRight size={14} />
                </motion.span>
              </a>
            </div>
          </motion.div>

          <motion.div
            className={styles.formShell}
            aria-label="Send us a message"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <motion.div
              className={`${styles.formCard} ${styles.floatingCard}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              whileHover={{ y: -4 }}
            >
              <motion.div
                className={styles.formHeader}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <motion.div
                  className={styles.formBadge}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 1.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  Concierge
                </motion.div>
                <div>
                  <motion.h2
                    className={styles.formTitle}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
                    Tell us what you need
                  </motion.h2>
                  <motion.p
                    className={styles.formSubtitle}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3, duration: 0.5 }}
                  >
                    Share a few details and we&apos;ll confirm via WhatsApp or
                    email within working hours.
                  </motion.p>
                </div>
              </motion.div>

              <motion.form
                className={styles.form}
                onSubmit={handleSubmit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <motion.div
                  className={styles.inputGrid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <motion.div
                    className={styles.field}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3, duration: 0.4 }}
                  >
                    <label htmlFor="contact-name" className={styles.labelText}>
                      Full name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange("name")}
                      required
                      aria-required="true"
                      aria-describedby="name-error"
                      className={styles.fieldInput}
                    />
                    <span
                      id="name-error"
                      className={styles.errorText}
                      role="alert"
                      aria-live="polite"
                    ></span>
                  </motion.div>
                  <motion.div
                    className={styles.field}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4, duration: 0.4 }}
                  >
                    <label htmlFor="contact-email" className={styles.labelText}>
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange("email")}
                      required
                      aria-required="true"
                      aria-describedby="email-error"
                      className={styles.fieldInput}
                    />
                    <span
                      id="email-error"
                      className={styles.errorText}
                      role="alert"
                      aria-live="polite"
                    ></span>
                  </motion.div>
                  <motion.div
                    className={styles.field}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5, duration: 0.4 }}
                  >
                    <label htmlFor="contact-phone" className={styles.labelText}>
                      Phone / WhatsApp
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      placeholder="+971 ..."
                      value={formData.phone}
                      onChange={handleChange("phone")}
                      aria-describedby="phone-help"
                      className={styles.fieldInput}
                    />
                    <span id="phone-help" className={styles.helperText}>
                      Optional
                    </span>
                  </motion.div>
                </motion.div>

                <motion.div
                  className={styles.field}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.4 }}
                >
                  <label htmlFor="contact-message" className={styles.labelText}>
                    How can we help?
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder="Tell us your preferred service, time, or any questions."
                    value={formData.message}
                    onChange={handleChange("message")}
                    required
                    aria-required="true"
                    aria-describedby="message-error message-help"
                    className={styles.fieldTextarea}
                  />
                  <span id="message-help" className={styles.helperText}>
                    We typically reply in minutes during open hours.
                  </span>
                  <span
                    id="message-error"
                    className={styles.errorText}
                    role="alert"
                    aria-live="polite"
                  ></span>
                </motion.div>

                <motion.div
                  className={styles.formActions}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  <motion.button
                    type="submit"
                    className={styles.submitButton}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Send size={16} />
                    </motion.span>
                    Send & open email draft
                  </motion.button>
                  <motion.a
                    className={styles.inlineLink}
                    href="https://wa.me/971503043570?text=Hello%20KEN%20Beauty%20Center%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="cta-whatsapp-inline"
                    whileHover={{ scale: 1.05, x: 4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Prefer chat? WhatsApp us
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight size={14} />
                    </motion.span>
                  </motion.a>
                </motion.div>
              </motion.form>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <motion.div
        className={styles.grid}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        {stores.map((store, index) => (
          <StoreInfo
            key={store._id}
            store={store}
            isFirst={index === 0}
            index={index}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
