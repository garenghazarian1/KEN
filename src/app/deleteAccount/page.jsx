import styles from "./delete-account.module.css";

export const metadata = {
  title: "Delete Account - Ken Beauty Salon",
  description: "Request deletion of your data from Ken Beauty Salon.",
};

export default function DeleteAccountPage() {
  return (
    <main className={styles.container}>
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
        📧 <strong>garenghazarian1@gmail.com</strong>
      </p>
      <p>We will delete your data within 48 hours of receiving your request.</p>
    </main>
  );
}
