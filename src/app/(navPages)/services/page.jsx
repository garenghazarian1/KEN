import { Suspense } from "react";
import ServiceMenu from "@/components/serviceMenu/ServiceMenu";
import { BookingHint } from "@/components/serviceMenu/BookingGuide";
import styles from "@/components/serviceMenu/ServiceMenu.module.css";
import { BUSINESS } from "@/config/constants";
import { getServiceSectionsCached } from "@/lib/business/serviceCatalog";

/** Catalog is cached up to 1 hour. Admin changes show within an hour. */
export const metadata = {
  title: `Services & Prices | ${BUSINESS.name} Abu Dhabi`,
  description: `Browse services and prices at ${BUSINESS.name} in Abu Dhabi — hair, nails, facials, solarium, and more.`,
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: `Services & Prices | ${BUSINESS.name} Abu Dhabi`,
    description: `View our full service menu with live pricing and durations at ${BUSINESS.name}.`,
    url: "/services",
    siteName: BUSINESS.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Services & Prices | ${BUSINESS.name} Abu Dhabi`,
    description: `Browse services and prices at ${BUSINESS.name}.`,
  },
};

function queryValue(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" && raw ? raw : null;
}

function ServiceMenuFallback() {
  return (
    <div className={styles.container} aria-busy="true">
      <div className={styles.searchWrapper}>
        <div className={styles.searchBar}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search services, e.g. Manicure, Facial…"
            aria-label="Search services"
            readOnly
          />
        </div>
      </div>
      <div className={styles.categoriesArea}>
        <div className={styles.board}>
          <div className={styles.categoryBar}>
            <ul className={styles.categoryRow} aria-hidden="true">
              <li className={styles.categoryItem}>
                <span className={styles.categoryButton}>&nbsp;</span>
              </li>
            </ul>
          </div>
          <BookingHint />
          <div className={styles.columns}>
            <section className={styles.column}>
              <h3 className={`${styles.columnHeading} ${styles.columnTitle}`}>&nbsp;</h3>
              <div className={styles.columnToggle} aria-hidden="true">
                &nbsp;
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

async function ServiceMenuData({ searchParams }) {
  const params = await searchParams;
  let sections = [];
  let error = null;

  try {
    sections = await getServiceSectionsCached("en");
  } catch (err) {
    error = err?.message || "Failed to load services.";
  }

  return (
    <ServiceMenu
      sections={sections}
      error={error}
      initialCategory={queryValue(params?.category)}
      initialService={queryValue(params?.service)}
      initialSubcategories={queryValue(params?.sub)}
    />
  );
}

export default function ServicesPage(props) {
  return (
    <>
      <h1 className="sr-only">Beauty Services at KEN Beauty Salon Abu Dhabi</h1>
      <Suspense fallback={<ServiceMenuFallback />}>
        <ServiceMenuData searchParams={props.searchParams} />
      </Suspense>
    </>
  );
}
