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
        📧 garenghazarian1@gmail.com
      </p>
    </main>
  );
}
