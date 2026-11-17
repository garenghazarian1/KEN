import { cacheLife, cacheTag } from "next/cache";

/**
 * Date values baked into prerendered pages.
 * Refreshed on the hours profile so the year and "today" stay current.
 */
export async function getPrerenderClock() {
  "use cache";
  cacheLife("hours");
  cacheTag("clock");
  const now = new Date();
  return {
    year: now.getFullYear(),
    dateLabel: now.toLocaleDateString(),
    iso: now.toISOString(),
  };
}
