import { BUSINESS, CONTACT } from "@/config/constants";
import { stores } from "@/data/stores";
import styles from "./imprint.module.css";

export const metadata = {
  title: "Imprint",
  description: `Legal information and imprint for ${BUSINESS.name}`,
};

export default function Imprint() {
  const primaryStore = stores && stores.length > 0 ? stores[0] : null;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Imprint</h1>
          <p className={styles.lastUpdated}>Legal Information</p>
        </div>

        <section className={styles.section}>
          <h2>Company Information</h2>
          <div className={styles.infoBlock}>
            <p>
              <strong>Business Name:</strong> {BUSINESS.name}
            </p>
            <p>
              <strong>Location:</strong> {BUSINESS.location.city}, {BUSINESS.location.country}
            </p>
            <p>
              <strong>Country Code:</strong> {BUSINESS.location.countryCode}
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Contact Information</h2>
          <div className={styles.infoBlock}>
            <p>
              <strong>Phone:</strong>{" "}
              <a href={`tel:${CONTACT.primaryMobile.replace(/\s/g, "")}`}>
                {CONTACT.primaryPhone}
              </a>
            </p>
            <p>
              <strong>Mobile:</strong>{" "}
              <a href={`tel:${CONTACT.primaryMobile.replace(/\s/g, "")}`}>
                {CONTACT.primaryMobile}
              </a>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${CONTACT.email}?subject=Inquiry about ${BUSINESS.name}&body=Hello, I would like to know more about your services.`}
              >
                {CONTACT.email}
              </a>
            </p>
          </div>
        </section>

        {primaryStore && (
          <section className={styles.section}>
            <h2>Registered Address</h2>
            <div className={styles.infoBlock}>
              <p>
                <strong>{primaryStore.name}</strong>
              </p>
              <p>{primaryStore.street}</p>
              <p>
                {primaryStore.city}, {primaryStore.country}
              </p>
              <p>
                <strong>Phone:</strong> {primaryStore.phone}
              </p>
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h2>Legal Information</h2>
          <p>
            This website is operated by {BUSINESS.name}. All content on this website, including but
            not limited to text, graphics, logos, images, and software, is the property of{" "}
            {BUSINESS.name} and is protected by copyright and other intellectual property laws.
          </p>
          <div className={styles.highlight}>
            <p>
              <strong>Copyright:</strong> © {new Date().getFullYear()} {BUSINESS.name}. All rights
              reserved.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Disclaimer</h2>
          <p>
            The information on this website is provided for general information purposes only. We
            make no representations or warranties of any kind, express or implied, about the
            completeness, accuracy, reliability, or availability of the website or the information
            contained on it.
          </p>
          <p>
            Any reliance you place on such information is strictly at your own risk. We will not be
            liable for any loss or damage arising from the use of this website.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Governing Law</h2>
          <p>
            This imprint and all matters relating to this website are governed by the laws of the
            United Arab Emirates. Any disputes arising from or in connection with this website
            shall be subject to the exclusive jurisdiction of the courts of the United Arab
            Emirates.
          </p>
        </section>
      </div>
    </div>
  );
}

