// app/privacy/page.tsx
import Script from "next/script";
import styles from "./privacy.module.css";
import { BASE_URL, BUSINESS, getFullUrl } from "@/config/constants";

export const metadata = {
  title: `Privacy Policy | ${BUSINESS.name}`,
  description: `How ${BUSINESS.name} handles your privacy and data.`,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: `Privacy Policy | ${BUSINESS.name}`,
    description: `Learn how ${BUSINESS.name} manages your data and privacy.`,
    url: "/privacy",
    siteName: BUSINESS.name,
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: `Privacy Policy | ${BUSINESS.name}`,
    description: `Learn how ${BUSINESS.name} manages your data and privacy.`,
  },
};

const privacyJsonLd = {
  "@context": "https://schema.org",
  "@type": "PrivacyPolicy",
  name: `${BUSINESS.name} Privacy Policy`,
  url: getFullUrl("/privacy"),
  publisher: {
    "@type": "Organization",
    name: BUSINESS.name,
    url: BASE_URL,
  },
};

export default function PrivacyPage() {
  return (
    <main className={styles.container}>
      <Script
        id="ld-privacy"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyJsonLd) }}
      />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Privacy Policy</h1>
          <p className={styles.lastUpdated}>
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <section className={styles.section}>
          <h2>1. Introduction</h2>
          <p>
            {BUSINESS.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to
            protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit our website{" "}
            <a href={BASE_URL} target="_blank" rel="noopener noreferrer">
              {BASE_URL}
            </a>
            .
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways:</p>
          <ul>
            <li>
              <strong>Personal Information:</strong> Name, email address, phone number, and other
              contact details you provide when booking appointments or contacting us.
            </li>
            <li>
              <strong>Booking Information:</strong> Service preferences, appointment history, and
              special requests.
            </li>
            <li>
              <strong>Technical Information:</strong> IP address, browser type, device information,
              and usage data collected through cookies and similar technologies.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and manage your appointments and service requests</li>
            <li>Communicate with you about your bookings and our services</li>
            <li>Improve our website and services</li>
            <li>Send you promotional materials (with your consent)</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Data Security</h2>
          <div className={styles.highlight}>
            <p>
              We implement appropriate technical and organizational measures to protect your
              personal information against unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>5. Data Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share
            your information only in the following circumstances:
          </p>
          <ul>
            <li>With service providers who assist us in operating our business</li>
            <li>When required by law or to protect our rights</li>
            <li>With your explicit consent</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and receive a copy of your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>7. Children&apos;s Privacy</h2>
          <p>
            Our services are not intended for children under the age of 13. We do not knowingly
            collect personal information from children under 13. If you believe we have collected
            information from a child under 13, please contact us immediately.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or wish to exercise your rights,
            please contact us:
          </p>
          <div className={styles.highlight}>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:garenghazarian1@gmail.com?subject=Privacy Inquiry&body=Hello, I have a question regarding privacy."
              >
                garenghazarian1@gmail.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong> +971-50-304-3570
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
