import styles from "./Contact.module.css";

export const metadata = {
  title: "Contact & Locations | Ken Beauty Salon Abu Dhabi",
  description:
    "Contact Ken Beauty Salon and find our Abu Dhabi locations at The Galleria Al Maryah Island and Rixos Hotel Marina.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact & Locations | Ken Beauty Salon Abu Dhabi",
    description:
      "Call, email, or visit Ken Beauty Salon at The Galleria or Rixos Hotel Marina in Abu Dhabi.",
    url: "/contact",
    siteName: "Ken Beauty Salon",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Locations | Ken Beauty Salon Abu Dhabi",
    description:
      "Reach Ken Beauty Salon at The Galleria Al Maryah Island and Rixos Hotel Marina in Abu Dhabi.",
  },
};

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
    imageStore: "/Galleria.jpg",
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
    imageStore: "Rixos.jpg",
  },
];

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Ken Beauty Salon",
  url: "https://www.kenbeautysalon.com/contact",
  contactPoint: stores.map((store) => ({
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: store.mobile,
    areaServed: "AE",
  })),
  mainEntity: {
    "@type": "Organization",
    name: "Ken Beauty Salon",
    url: "https://www.kenbeautysalon.com/",
    sameAs: [
      "https://www.instagram.com/ken_beauty_ad",
      "https://www.instagram.com/ken_barbershop.ad",
      "https://www.tiktok.com/@ken_barbershop.ad",
      "https://www.tiktok.com/@kenbeauty04",
    ],
  },
};

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
      <script
        id="ld-contact"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      {/* Render Each Store Using the StoreInfo Component */}
      {stores.map((store) => (
        <StoreInfo key={store._id} store={store} />
      ))}
    </div>
  );
};

export default Contact;
