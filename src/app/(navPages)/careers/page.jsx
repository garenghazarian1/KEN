import CareersBoard from "@/components/careers/CareersBoard";
import { BUSINESS } from "@/config/constants";
import { getCareersBoard } from "@/lib/business/careers";

export const dynamic = "force-dynamic";

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

export default async function CareersPage() {
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
