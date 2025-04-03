// app/privacy/page.tsx
import styles from "./privacy.module.css";

export const metadata = {
  title: "Privacy Policy Ken Beauty Salon",
  description: "How Ken Beauty Salon handles your privacy.",
};

export default function PrivacyPage() {
  return (
    <main className={styles.container}>
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
        All information shared or entered is handled by the website and follows
        its own privacy terms.
      </p>
      <p>If you have any questions, contact us at garenghazarian1@gmail.com.</p>
    </main>
  );
}
