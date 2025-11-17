// app/privacy/page.tsx
import Script from "next/script";
import styles from "./privacy.module.css";

export const metadata = {
  title: "Privacy Policy | Ken Beauty Salon",
  description: "How Ken Beauty Salon handles your privacy and data.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Ken Beauty Salon",
    description: "Learn how Ken Beauty Salon manages your data and privacy.",
    url: "/privacy",
    siteName: "Ken Beauty Salon",
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Ken Beauty Salon",
    description: "Learn how Ken Beauty Salon manages your data and privacy.",
  },
};

const privacyJsonLd = {
  "@context": "https://schema.org",
  "@type": "PrivacyPolicy",
  name: "Ken Beauty Salon Privacy Policy",
  url: "https://www.kenbeautysalon.com/privacy",
  publisher: {
    "@type": "Organization",
    name: "Ken Beauty Salon",
    url: "https://www.kenbeautysalon.com/",
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
      <h1>Privacy Policy</h1>
      <p>
        This app displays the Ken Beauty Salon website (
        <a
          href="https://www.kenbeautysalon.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.kenbeautysalon.com
        </a>
        ) using a WebView.
      </p>
      <p>
        We do not collect, store, or share any personal data through the app.
        All personal information is handled directly by the Ken Beauty Salon
        website according to its own Privacy Policy.
      </p>
      <p>
        Any data you enter (such as booking information) is transmitted securely
        and used only to provide salon services. We do not sell or share your
        personal data with third parties for marketing.
      </p>
      <p>
        Children under the age of 13 are not intended users of this app, and we
        do not knowingly collect information from children.
      </p>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at:
        <br />
        Email: garenghazarian1@gmail.com
      </p>
    </main>
  );
}
