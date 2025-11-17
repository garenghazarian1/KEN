import Script from "next/script";
import styles from "./delete-account.module.css";

export const metadata = {
  title: "Delete Account | Ken Beauty Salon",
  description: "Request deletion of your data from Ken Beauty Salon.",
  alternates: {
    canonical: "/deleteAccount",
  },
  openGraph: {
    title: "Delete Account | Ken Beauty Salon",
    description: "Request removal of your personal data from Ken Beauty Salon.",
    url: "/deleteAccount",
    siteName: "Ken Beauty Salon",
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Delete Account | Ken Beauty Salon",
    description: "Request removal of your personal data from Ken Beauty Salon.",
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
  url: "https://www.kenbeautysalon.com/deleteAccount",
  name: "Delete Account | Ken Beauty Salon",
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
        At Ken Beauty Salon, we respect your privacy. While we do not offer
        account creation, we may store your booking or contact information
        temporarily to process your appointment.
      </p>
      <p>
        If you would like your submitted information (e.g., name, email, phone
        number) to be deleted from our records, please send an email to:
      </p>
      <p className={styles.email}>
        dY"� <strong>garenghazarian1@gmail.com</strong>
      </p>
      <p>We will delete your data within 48 hours of receiving your request.</p>
    </main>
  );
}
