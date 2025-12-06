import { BUSINESS } from "@/config/constants";
import styles from "./terms.module.css";

export const metadata = {
  title: `Terms of Use | ${BUSINESS.name}`,
  description: `Terms of Use for ${BUSINESS.name}`,
};

export default function TermsOfUse() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Terms of Use</h1>
          <p className={styles.lastUpdated}>
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <section className={styles.section}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms and
            provision of this agreement. If you do not agree to abide by the above, please do not
            use this service.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on{" "}
            {BUSINESS.name}&apos;s website for personal, non-commercial transitory viewing only.
            This is the grant of a license, not a transfer of title, and under this license you may
            not:
          </p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software</li>
            <li>Remove any copyright or other proprietary notations</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Services</h2>
          <p>
            {BUSINESS.name} provides beauty and barber services including hair styling, nail
            services, facials, and solarium treatments. All services are subject to availability
            and booking confirmation.
          </p>
          <div className={styles.highlight}>
            <p>
              <strong>Booking Policy:</strong> Appointments must be confirmed and may be subject to
              cancellation policies. Please review our booking terms when making a reservation.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>4. User Responsibilities</h2>
          <p>You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of your account information</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and complete information when booking services</li>
            <li>Complying with all applicable laws and regulations</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Limitation of Liability</h2>
          <p>
            {BUSINESS.name} shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from your use of or inability to use the
            service. Our total liability shall not exceed the amount you paid for the service in
            question.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Modifications</h2>
          <p>
            {BUSINESS.name} reserves the right to modify these terms at any time. We will notify
            users of any material changes by posting the new Terms of Use on this page and updating
            the &quot;Last Updated&quot; date.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Use, please contact us through our
            contact page or by email at{" "}
            <a href="mailto:ken.beauty1@hotmail.com">ken.beauty1@hotmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

