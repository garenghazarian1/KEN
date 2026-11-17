import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import JobPage from "@/components/careers/JobPage";
import styles from "@/components/careers/JobPage.module.css";
import { BUSINESS } from "@/config/constants";
import { getPublicJob, getPublicJobMeta, isPublicJobSlug, jobMetaDescription } from "@/lib/business/careers";

async function ConnectionMarker() {
  await connection();
  return null;
}

export async function generateMetadata(props) {
  const params = await props.params;
  const slug = typeof params?.slug === "string" ? params.slug : "";
  if (!isPublicJobSlug(slug)) notFound();

  let meta = null;
  try {
    meta = await getPublicJobMeta(slug);
  } catch (err) {
    if (typeof err?.digest === "string" && err.digest.includes("NEXT_NOT_FOUND")) throw err;
    return { title: "Careers" };
  }
  if (!meta) notFound();
  const description = jobMetaDescription(meta.title, meta.summary, BUSINESS.name);
  return {
    title: `${meta.title} | Careers`,
    description,
    alternates: { canonical: `/careers/${meta.publicSlug}` },
    openGraph: {
      title: `${meta.title} | ${BUSINESS.name}`,
      description,
      url: `/careers/${meta.publicSlug}`,
      siteName: BUSINESS.name,
      locale: "en_US",
      type: "website",
    },
  };
}

function JobFallback() {
  return <main className={styles.page} aria-busy="true" />;
}

async function CareerJobContent({ params }) {
  await connection();
  const resolved = await params;
  const slug = typeof resolved?.slug === "string" ? resolved.slug : "";
  if (!isPublicJobSlug(slug)) notFound();

  let job = null;
  try {
    job = await getPublicJob(slug);
  } catch (err) {
    if (typeof err?.digest === "string" && err.digest.includes("NEXT_NOT_FOUND")) throw err;
    return (
      <main className={styles.page}>
        <p className={styles.loadError} role="alert">
          {err?.message || "Could not load the job. Try again later."}
        </p>
      </main>
    );
  }

  if (!job) notFound();
  return <JobPage job={job} />;
}

export default function CareerJobPage(props) {
  return (
    <>
      <Suspense fallback={null}>
        <ConnectionMarker />
      </Suspense>
      <Suspense fallback={<JobFallback />}>
        <CareerJobContent params={props.params} />
      </Suspense>
    </>
  );
}
