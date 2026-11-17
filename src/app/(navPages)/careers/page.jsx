import { Suspense } from "react";
import { connection } from "next/server";
import CareersBoard from "@/components/careers/CareersBoard";
import styles from "@/components/careers/CareersBoard.module.css";
import { BUSINESS } from "@/config/constants";
import { getCareersBoard } from "@/lib/business/careers";

export const metadata = {
  title: "Careers",
  description: `Open roles at ${BUSINESS.name} in Abu Dhabi. View a position and apply.`,
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: `Careers | ${BUSINESS.name}`,
    description: `Open roles at ${BUSINESS.name} in Abu Dhabi.`,
    url: "/careers",
    siteName: BUSINESS.name,
    locale: "en_US",
    type: "website",
  },
};

function CareersFallback() {
  return (
    <main className={styles.page} aria-busy="true">
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleLine1}>Careers</span>
          <span className={styles.titleLine2}>Join the salon</span>
        </h1>
        <p className={styles.subtitle}>Open roles across Abu Dhabi.</p>
      </header>
    </main>
  );
}

async function CareersData() {
  await connection();
  let jobs = [];
  let error = null;

  try {
    const board = await getCareersBoard();
    jobs = board.jobs;
  } catch (err) {
    error = err?.message || "Could not load careers. Try again later.";
  }

  return <CareersBoard jobs={jobs} error={error} />;
}

export default function CareersPage() {
  return (
    <Suspense fallback={<CareersFallback />}>
      <CareersData />
    </Suspense>
  );
}
