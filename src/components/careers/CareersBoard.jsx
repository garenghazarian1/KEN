import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import styles from "./CareersBoard.module.css";

export default function CareersBoard({ jobs = [], error = null }) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleLine1}>Careers</span>
          <span className={styles.titleLine2}>Join the salon</span>
        </h1>
        <p className={styles.subtitle}>Open roles across Abu Dhabi.</p>
      </header>

      {error ? (
        <p className={styles.status} role="alert">
          {error}
        </p>
      ) : jobs.length === 0 ? (
        <p className={styles.status}>No open roles at the moment. Check back later.</p>
      ) : (
        <ul className={styles.list}>
          {jobs.map((job) => {
            const body = (
              <>
                {job.professionImageUrl ? (
                  <span className={styles.thumb}>
                    <Image
                      src={job.professionImageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 100vw, 8rem"
                    />
                  </span>
                ) : null}
                <span className={styles.copy}>
                  <span className={styles.role}>{job.title}</span>
                  {job.location ? <span className={styles.location}>{job.location}</span> : null}
                  {job.deadlineLabel ? (
                    <span className={styles.deadline}>
                      {job.closed ? "Closed on" : "Applies until"} {job.deadlineLabel}
                    </span>
                  ) : null}
                </span>
                {job.closed ? (
                  <span className={styles.closed}>Closed</span>
                ) : (
                  <span className={styles.cta}>
                    View role
                    <ChevronRight size={18} strokeWidth={1.75} aria-hidden />
                  </span>
                )}
              </>
            );

            return (
              <li key={job.id || job.publicSlug}>
                {job.closed ? (
                  <div className={`${styles.row} ${styles.rowClosed}`}>{body}</div>
                ) : (
                  <Link className={styles.row} href={`/careers/${job.publicSlug}`}>
                    {body}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
