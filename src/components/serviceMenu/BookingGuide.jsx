import Link from "next/link";
import { WHATSAPP_CONTACTS } from "@/config/constants";
import styles from "./BookingGuide.module.css";

const SAMPLE_SERVICE = "Skin Fade";

export function bookingMessage(branch, services) {
  const lines = services.map((service) => `- ${service.name}`).join("\n");
  return `Hello KEN Beauty Center (${branch})\nI would like to book:\n${lines}`;
}

function branchChoice(contacts) {
  const names = contacts.map((contact) => contact.shortLabel).filter(Boolean);
  if (names.length === 0) return "WhatsApp";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} or ${names[names.length - 1]}`;
}

export function BookingHint() {
  if (!WHATSAPP_CONTACTS.length) return null;

  return (
    <p className={styles.hint}>
      <span className={styles.hintLead}>Book on WhatsApp.</span> Add a
      service, then send to {branchChoice(WHATSAPP_CONTACTS)}.{" "}
      <Link href="/services/how-to-book" className={styles.hintLink}>
        See how
      </Link>
    </p>
  );
}

export function BookingGuide() {
  const first = WHATSAPP_CONTACTS[0];
  const branch = first?.shortLabel ?? "Galleria";
  const others = WHATSAPP_CONTACTS.slice(1)
    .map((contact) => contact.shortLabel)
    .filter(Boolean);
  const sample = bookingMessage(branch, [{ name: SAMPLE_SERVICE }]);

  return (
    <article className={styles.page}>
      <h1 className={styles.title}>Book on WhatsApp</h1>
      <p className={styles.lead}>No account. One message. We reply with a time.</p>
      <ol className={styles.steps}>
        <li>
          <strong>Add.</strong> Tap Add next to any service. The button becomes
          Added.
        </li>
        <li>
          <strong>The bar.</strong> After you add a service, a bar appears at
          the bottom and counts what you chose.
        </li>
        <li>
          <strong>Send.</strong> Tap {branchChoice(WHATSAPP_CONTACTS)}. WhatsApp
          opens with the list already written.
        </li>
      </ol>
      <h2 className={styles.subhead}>The message</h2>
      <p className={styles.message}>{sample}</p>
      {others.length > 0 ? (
        <p className={styles.note}>
          {others.join(" and ")} opens the same message, with that branch name
          in the first line.
        </p>
      ) : null}
      <p className={styles.note}>
        The round WhatsApp button on the screen is for a general question. The
        services you add go through the bar.
      </p>
      <Link href="/services" className={styles.backLink}>
        Back to services
      </Link>
    </article>
  );
}
