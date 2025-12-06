import { BUSINESS } from "@/config/constants";
import styles from "./cookie.module.css";

export const metadata = {
  title: `Cookie Notice | ${BUSINESS.name}`,
  description: `Cookie Notice for ${BUSINESS.name}`,
};

export default function CookieNotice() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Cookie Notice</h1>
          <p className={styles.lastUpdated}>
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <section className={styles.section}>
          <h2>What Are Cookies</h2>
          <p>
            Cookies are small text files that are placed on your computer or
            mobile device when you visit a website. They are widely used to make
            websites work more efficiently and provide information to the
            website owners.
          </p>
          <div className={styles.highlight}>
            <p>
              Cookies help us provide you with a better experience by
              remembering your preferences and understanding how you use our
              website.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>How We Use Cookies</h2>
          <p>
            {BUSINESS.name} uses cookies to enhance your browsing experience,
            analyze site traffic, and personalize content. We use both session
            cookies (which expire when you close your browser) and persistent
            cookies (which stay on your device until deleted).
          </p>
        </section>

        <section className={styles.section}>
          <h2>Types of Cookies We Use</h2>
          <ul>
            <li>
              <strong>Essential Cookies:</strong> Required for the website to
              function properly. These cannot be disabled as they are necessary
              for basic site functionality.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how
              visitors interact with our website by collecting and reporting
              information anonymously.
            </li>
            <li>
              <strong>Functional Cookies:</strong> Remember your preferences and
              settings to provide a more personalized experience.
            </li>
            <li>
              <strong>Marketing Cookies:</strong> Used to track visitors across
              websites to display relevant advertisements (only with your
              consent).
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Managing Cookies</h2>
          <p>
            You can control and manage cookies through your browser settings.
            Most browsers allow you to:
          </p>
          <ul>
            <li>View and delete cookies</li>
            <li>Block cookies from specific sites</li>
            <li>Block all cookies</li>
            <li>Delete all cookies when you close your browser</li>
          </ul>
          <div className={styles.highlight}>
            <p>
              <strong>Note:</strong> Disabling cookies may affect the
              functionality of our website and limit your ability to use certain
              features.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Third-Party Cookies</h2>
          <p>
            Some cookies are placed by third-party services that appear on our
            pages. We use services like analytics tools and social media
            platforms that may set their own cookies. We do not control these
            cookies, so please refer to the third-party&apos;s privacy policy
            for more information.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact
            us through our contact page or by email at{" "}
            <a href="mailto:ken.beauty1@hotmail.com">ken.beauty1@hotmail.com</a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
