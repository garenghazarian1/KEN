"use client";

import Image from "next/image";
import { Phone, Mail, MessageCircle } from "lucide-react";
import {
  CONTACT,
  formatPhoneForTel,
  getTelLink,
  handlePhoneClick,
} from "@/config/constants";
import styles from "@/app/(navPages)/contact/Contact.module.css";

// Helper function to get WhatsApp URL for a phone number
const getWhatsAppUrl = (phoneNumber, message = null) => {
  const cleanNumber = formatPhoneForTel(phoneNumber).replace(/^\+/, "");
  const defaultMessage =
    message ||
    "Hello KEN Beauty Center, I would like to know more about your services.";
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    defaultMessage
  )}`;
};

// Reusable Store Info Component
const StoreInfo = ({ store }) => (
  <div className={styles.storeContainer}>
    <div className={styles.section}>
      <h2 className={styles.sectionHeader}>{store.name}</h2>
      <Image
        src={store.imageStore}
        alt={`${store.name} image`}
        className={styles.storeImage}
        width={500}
        height={500}
        priority={false}
      />
      <div className={styles.storeDetails}>
        <p className={styles.p}>{store.street}</p>
        <p className={styles.p}>
          {store.city}, {store.zipCode}
        </p>
        <p className={styles.p}>{store.country}</p>
      </div>
      <div className={styles.contactDetails}>
        {store.phone && (
          <p className={styles.p}>
            <Phone size={16} className={styles.icon} />
            Phone:{" "}
            <a
              className={styles.a}
              href={getTelLink(store.phone)}
              onClick={(e) => handlePhoneClick(store.phone, e)}
              aria-label={`Call ${store.phone}`}
            >
              {store.phone}
            </a>
          </p>
        )}
        {store.mobile && (
          <p className={styles.p}>
            <Phone size={16} className={styles.icon} />
            Mobile:{" "}
            <a
              className={styles.a}
              href={getTelLink(store.mobile)}
              onClick={(e) => handlePhoneClick(store.mobile, e)}
              aria-label={`Call ${store.mobile}`}
            >
              {store.mobile}
            </a>
            {" | "}
            <a
              className={styles.whatsappLink}
              href={getWhatsAppUrl(store.mobile)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${store.mobile}`}
            >
              <MessageCircle size={16} className={styles.whatsappIcon} />
              WhatsApp
            </a>
          </p>
        )}
        <p className={styles.p}>
          <Mail size={16} className={styles.icon} />
          Email:{" "}
          <a
            className={styles.emailLink}
            href={`mailto:${store.email}?subject=Inquiry about ${store.name}&body=Hello, I would like to know more about your services.`}
            aria-label={`Email ${store.email}`}
          >
            {store.email}
          </a>
        </p>
      </div>
    </div>
  </div>
);

export default function ContactContent({ stores, contactJsonLd }) {
  return (
    <div className={styles.container}>
      {contactJsonLd && (
        <script
          id="ld-contact"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
        />
      )}
      {stores.map((store) => (
        <StoreInfo key={store._id} store={store} />
      ))}
    </div>
  );
}
