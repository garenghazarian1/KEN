import { cacheLife, cacheTag } from "next/cache";
import { getActiveCampaign } from "@/lib/business/campaigns";

/** Same one-hour window the home and offers pages used with `revalidate = 3600`. */
export async function getCampaignCached() {
  "use cache";
  cacheLife("hours");
  cacheTag("campaign");
  const now = new Date();
  return {
    campaign: getActiveCampaign(now),
    now: now.toISOString(),
  };
}
