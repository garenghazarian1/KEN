import Script from "next/script";
import styles from "./delete-account.module.css";
import { BASE_URL, BUSINESS, getFullUrl } from "@/config/constants";

export const metadata = {
  title: `Delete Account | ${BUSINESS.name}`,
  description: `Request deletion of your data from ${BUSINESS.name}.`,
  alternates: {
    canonical: "/deleteAccount",
  },
  openGraph: {
    title: `Delete Account | ${BUSINESS.name}`,
    description: `Request removal of your personal data from ${BUSINESS.name}.`,
    url: "/deleteAccount",
    siteName: BUSINESS.name,
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: `Delete Account | ${BUSINESS.name}`,
    description: `Request removal of your personal data from ${BUSINESS.name}.`,
  },
};

const deleteJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I request deletion of my data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Email garenghazarian1@gmail.com to request deletion of your submitted information (name, email, phone).",
      },
    },
  ],
  url: getFullUrl("/deleteAccount"),
  name: `Delete Account | ${BUSINESS.name}`,
};

export default function DeleteAccountPage() {
  return (
    <main className={styles.container}>
      <Script
        id="ld-delete-account"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(deleteJsonLd) }}
      />
      <h1 className={styles.heading}>Request to Delete Your Data</h1>
      <p>
        At {BUSINESS.name}, we respect your privacy. While we do not offer
        account creation, we may store your booking or contact information
        temporarily to process your appointment.
      </p>
      <p>
        If you would like your submitted information (e.g., name, email, phone
        number) to be deleted from our records, please send an email to:
      </p>
      <p className={styles.email}>
        Email:{" "}
        <a
          href="mailto:garenghazarian1@gmail.com?subject=Request to Delete My Data&body=Hello, I would like to request deletion of my personal data (name, email, phone number) from your records."
          className={styles.emailLink}
        >
          <strong>garenghazarian1@gmail.com</strong>
        </a>
      </p>
      <p>We will delete your data within 48 hours of receiving your request.</p>
    </main>
  );
}
