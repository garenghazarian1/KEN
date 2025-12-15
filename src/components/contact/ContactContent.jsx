"use client";

import Image from "next/image";
import { useState } from "react";
import { Phone, Mail, MessageCircle, MapPin, Send } from "lucide-react";
import styles from "./Contact.modern.module.css";

const getGoogleMapsUrl = (store) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${store.name} ${store.street}, ${store.city}, ${store.country || ""}`
  )}`;

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
    const subject = encodeURIComponent(`Inquiry from ${formData.name || "Guest"}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:info@ken-salon.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Get in Touch</h1>
        <p className={styles.subtitle}>
          Visit us or reach out — we&apos;d love to hear from you
        </p>
      </header>

      {/* Locations */}
      <section className={styles.locations}>
        {stores.map((store) => (
          <article key={store._id} className={styles.location}>
            <Image
              src={store.imageStore}
              alt={store.name}
              width={600}
              height={400}
              className={styles.locationImage}
            />
            <div className={styles.locationInfo}>
              <h2 className={styles.locationName}>{store.name}</h2>
              <p className={styles.locationAddress}>
                {store.street}, {store.city}
              </p>

              <div className={styles.contactList}>
                <a
                  href={`tel:${store.phone.replace(/\s/g, "")}`}
                  className={styles.contactItem}
                >
                  <Phone size={18} />
                  <span>{store.phone}</span>
                </a>

                <a
                  href={`tel:${store.mobile.replace(/\s/g, "")}`}
                  className={styles.contactItem}
                >
                  <Phone size={18} />
                  <span>{store.mobile}</span>
                </a>

                <a
                  href={`https://wa.me/${store.whatsapp.replace(/[\s+]/g, "")}?text=${encodeURIComponent("Hi, I'd like to book an appointment.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.contactItem} ${styles.whatsapp}`}
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`mailto:${store.email}`}
                  className={styles.contactItem}
                >
                  <Mail size={18} />
                  <span>{store.email}</span>
                </a>

                <a
                  href={getGoogleMapsUrl(store)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactItem}
                >
                  <MapPin size={18} />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Contact Form */}
      <section className={styles.formSection}>
        <h2 className={styles.formTitle}>Send a Message</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange("name")}
            required
            className={styles.input}
          />
          <input
            type="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleChange("email")}
            required
            className={styles.input}
          />
          <textarea
            placeholder="Your message"
            value={formData.message}
            onChange={handleChange("message")}
            required
            rows={4}
            className={styles.textarea}
          />
          <button type="submit" className={styles.submitBtn}>
            <Send size={18} />
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
}
