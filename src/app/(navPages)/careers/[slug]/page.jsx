import { notFound } from "next/navigation";
import JobPage from "@/components/careers/JobPage";
import styles from "@/components/careers/JobPage.module.css";
import { BUSINESS } from "@/config/constants";
import { getPublicJob, isPublicJobSlug } from "@/lib/business/careers";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  if (!isPublicJobSlug(slug)) notFound();

  let job = null;
  try {
    job = await getPublicJob(slug);
  } catch (err) {
    if (typeof err?.digest === "string" && err.digest.includes("NEXT_NOT_FOUND")) throw err;
    return { title: "Careers" };
  }
  if (!job) notFound();
  const description = job.sections.find((section) => section.key === "summary")?.body
    || `Apply for ${job.title} at ${BUSINESS.name}.`;
  return {
    title: `${job.title} | Careers`,
    description,
    alternates: { canonical: `/careers/${job.publicSlug}` },
    openGraph: {
      title: `${job.title} | ${BUSINESS.name}`,
      description,
      url: `/careers/${job.publicSlug}`,
      siteName: BUSINESS.name,
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function CareerJobPage({ params }) {
  const slug = typeof params?.slug === "string" ? params.slug : "";
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
