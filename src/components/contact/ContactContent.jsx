"use client";

import styles from "@/app/(navPages)/contact/Contact.module.css";

// Reusable Store Info Component
const StoreInfo = ({ store }) => (
  <div className={styles.storeContainer}>
    <div className={styles.section}>
      <h2 className={styles.sectionHeader}>{store.name}</h2>
      <img
        src={store.imageStore}
        alt={`${store.name} image`}
        className={styles.storeImage}
      />
      <div className={styles.storeDetails}>
        <p className={styles.p}>{store.street}</p>
        <p className={styles.p}>
          {store.city}, {store.zipCode}
        </p>
        <p className={styles.p}>{store.country}</p>
      </div>
      <div className={styles.contactDetails}>
        <p className={styles.p}>
          Phone:{" "}
          <a className={styles.a} href={`tel:${store.phone}`}>
            {store.phone}
          </a>
        </p>
        <p className={styles.p}>
          Mobile:{" "}
          <a className={styles.a} href={`tel:${store.mobile}`}>
            {store.mobile}
          </a>
        </p>
        {store.barberMobile && (
          <p className={styles.p}>
            Barber Mobile:{" "}
            <a className={styles.a} href={`tel:${store.barberMobile}`}>
              {store.barberMobile}
            </a>
          </p>
        )}
        <p className={styles.p}>
          Email:{" "}
          <a className={styles.a} href={`mailto:${store.email}`}>
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
