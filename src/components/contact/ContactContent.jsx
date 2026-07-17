"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Send,
  Briefcase,
  ArrowUpRight,
} from "lucide-react";
import { CAREERS_URL } from "@/config/constants";
import { getGoogleMapsUrl } from "@/data/stores";
import styles from "./Contact.modern.module.css";

function shortLocationLabel(name) {
  if (name.includes("Galleria")) return "The Galleria";
  if (name.includes("Rixos")) return "Rixos Marina";
  return name;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ContactContent({ stores }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Inquiry from ${formData.name || "Guest"}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:info@ken-salon.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className={styles.page}>
      <div className={styles.atmosphere} aria-hidden="true" />

      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
        >
          <p className={styles.eyebrow}>Ken Beauty Salon</p>
          <h1 className={styles.title}>We&apos;d love to hear from you</h1>
          <p className={styles.subtitle}>
            Find us at The Galleria and Rixos Marina — or message us anytime to
            book, ask a question, or plan your next visit.
          </p>
        </motion.header>

        <section className={styles.locations} aria-label="Salon locations">
          {stores.map((store, index) => (
            <motion.article
              key={store._id}
              className={styles.location}
              initial="hidden"
              animate="visible"
              custom={index + 1}
              variants={fadeUp}
            >
              <div className={styles.locationMedia}>
                <Image
                  src={store.imageStore}
                  alt={store.name}
                  width={640}
                  height={200}
                  className={styles.locationImage}
                  sizes="(max-width: 700px) 100vw, 460px"
                  priority={index === 0}
                />
                <span className={styles.locationIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className={styles.locationInfo}>
                <h2 className={styles.locationName}>
                  {shortLocationLabel(store.name)}
                </h2>
                <p className={styles.locationAddress}>
                  <MapPin size={14} aria-hidden="true" />
                  <span>
                    {store.street}, {store.city}
                  </span>
                </p>

                <div className={styles.primaryActions}>
                  <a
                    href={`tel:${store.phone.replace(/\s/g, "")}`}
                    className={styles.actionPrimary}
                  >
                    <Phone size={16} aria-hidden="true" />
                    <span>{store.phone}</span>
                  </a>
                  <a
                    href={`tel:${store.mobile.replace(/\s/g, "")}`}
                    className={styles.actionPrimary}
                  >
                    <Phone size={16} aria-hidden="true" />
                    <span>{store.mobile}</span>
                  </a>
                  <a
                    href={`https://wa.me/${store.whatsapp.replace(/[\s+]/g, "")}?text=${encodeURIComponent("Hi, I'd like to book an appointment.")}`}
                    className={styles.actionWhatsapp}
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <div className={styles.secondaryActions}>
                  <a
                    href={`mailto:${store.email}`}
                    className={styles.actionLink}
                  >
                    <Mail size={14} aria-hidden="true" />
                    <span>{store.email}</span>
                  </a>
                  <a
                    href={getGoogleMapsUrl(store)}
                    className={styles.actionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin size={14} aria-hidden="true" />
                    <span>Directions</span>
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        <motion.section
          className={styles.formSection}
          aria-labelledby="contact-form-title"
          initial="hidden"
          animate="visible"
          custom={3}
          variants={fadeUp}
        >
          <div className={styles.formIntro}>
            <h2 id="contact-form-title" className={styles.formTitle}>
              Send a message
            </h2>
            <p className={styles.formHint}>
              We&apos;ll reply to your email as soon as we can
            </p>
          </div>
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.formRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Name</span>
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange("name")}
                  required
                  className={styles.input}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Email</span>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                  className={styles.input}
                />
              </label>
            </div>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Message</span>
              <textarea
                placeholder="How can we help?"
                value={formData.message}
                onChange={handleChange("message")}
                required
                rows={3}
                className={styles.textarea}
              />
            </label>
            <button type="submit" className={styles.submitBtn}>
              <Send size={16} aria-hidden="true" />
              Send Message
            </button>
          </form>
        </motion.section>

        <motion.section
          className={styles.careersCta}
          aria-label="Careers"
          initial="hidden"
          animate="visible"
          custom={4}
          variants={fadeUp}
        >
          <div className={styles.careersText}>
            <h2 className={styles.careersTitle}>Join our team</h2>
            <p className={styles.careersDescription}>
              Stylists, barbers, and trainers — open roles across Abu Dhabi
            </p>
          </div>
          <a
            href={CAREERS_URL}
            className={styles.careersBtn}
            aria-label="View open roles at Ken Beauty Salon"
          >
            <Briefcase size={16} aria-hidden />
            <span>View open roles</span>
            <ArrowUpRight size={14} aria-hidden />
          </a>
        </motion.section>
      </div>
    </main>
  );
}
