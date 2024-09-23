"use client";

import styles from "./Contact.module.css";

// Store data
const stores = [
  {
    _id: "1",
    name: "Ken Salon, The Galleria Al Maryah Island",
    street: "The Galleria Al Maryah Island - 107 Hamouda Bin Ali Al Dhaheri St",
    city: "Abu Dhabi",
    zipCode: "00000",
    country: "United Arab Emirates",
    phone: "(02) 6218808",
    mobile: "+971 503043570",
    email: "ken.beauty1@hotmail.com",
    imageStore:
      "https://res.cloudinary.com/dzzm7ye56/image/upload/v1727123223/The-Galleria-Mall-Cover_vd3dau.jpg",
  },
  {
    _id: "2",
    name: "Ken Salon, Rixos Hotel",
    street: "Rixos Hotel, Marina - Al Kasir - Al Marina",
    city: "Abu Dhabi",
    zipCode: "00000",
    country: "United Arab Emirates",
    phone: "(02) 635 9993",
    mobile: "+971 55 557 0029",
    barberMobile: "+971 56 181 6017",
    email: "ken.beauty1@hotmail.com",
    imageStore:
      "https://res.cloudinary.com/dzzm7ye56/image/upload/v1727123735/495553057_zs2coz.jpg",
  },
];

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

const Contact = () => {
  return (
    <div className={styles.container}>
      {/* Render Each Store Using the StoreInfo Component */}
      {stores.map((store) => (
        <StoreInfo key={store._id} store={store} />
      ))}
    </div>
  );
};

export default Contact;
