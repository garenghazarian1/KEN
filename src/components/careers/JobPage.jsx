import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import JobApplyForm from "./JobApplyForm";
import styles from "./JobPage.module.css";

export default function JobPage({ job }) {
  return (
    <main className={styles.page}>
      <Link className={styles.back} href="/careers">
        <ChevronLeft size={18} strokeWidth={1.75} aria-hidden />
        All roles
      </Link>

      <div className={styles.layout}>
        <article className={styles.article}>
          <h1 className={styles.title}>{job.title}</h1>
          <p className={styles.meta}>
            {job.businessName}
            {job.location ? <span className={styles.metaSep}> — {job.location}</span> : null}
          </p>

          {job.facts.length > 0 ? (
            <dl className={styles.facts}>
              {job.facts.map((fact) => (
                <div key={fact.key} className={styles.fact}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {job.closed ? (
            <p className={styles.closed} role="status">
              Applications are closed for this job.
            </p>
          ) : null}

          {job.professionImageUrl ? (
            <div className={styles.hero}>
              <Image
                src={job.professionImageUrl}
                alt=""
                fill
                priority
                sizes="(min-width: 64rem) 42rem, 100vw"
              />
            </div>
          ) : null}

          {job.sections.map((section) => (
            <section key={section.key} className={styles.section}>
              {section.heading ? <h2>{section.heading}</h2> : null}
              <p className={section.heading ? styles.prose : styles.lead}>{section.body}</p>
            </section>
          ))}
        </article>

        {job.closed ? null : (
          <JobApplyForm slug={job.publicSlug} apply={job.apply} />
        )}
      </div>
    </main>
  );
}
