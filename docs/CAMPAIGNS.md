# Campaigns (promotional packages)

Last updated: 12 October 2026

Single source of truth for limited-time offers: [`src/data/campaigns.js`](../src/data/campaigns.js).

Helpers: [`src/lib/business/campaigns.js`](../src/lib/business/campaigns.js) — Dubai-timezone active window (`Asia/Dubai`), bilingual `tCampaign`, price formatting.

## Website surfaces

- Home, under the hero: [`CampaignPoster`](../src/components/campaign/CampaignPoster.jsx) when the active campaign has no package list (Pink October). From 1200px the title and offer sit on one side and the explanation on the other; narrower screens keep that text behind Read more.
- Destination: [`/offers`](../src/app/(navPages)/offers/page.jsx) — the same poster while that campaign is active; package cards for a package campaign such as August
- Services does not show a campaign popup

## Assistant grounding (same pattern as catalog)

- [`src/lib/assistant/campaignContext.js`](../src/lib/assistant/campaignContext.js) — keyword detect → format active campaign into the system prompt
- Injected beside catalog context in `/api/assistant/chat` and `/api/assistant/realtime/turn`
- FAQ pointer: `campaign_offers` in [`assistantFaq.js`](../src/data/assistantFaq.js)
- Quick chips / launcher tips: `getAssistantQuickChips` / `getAssistantLauncherTips` in [`assistantUi.js`](../src/data/assistantUi.js)

**Authority:** the active campaign in campaigns.js. Package prices and Hot Tuesday only when that entry lists them. Ordinary à-la-carte services/prices = live admin catalog. Pink October is a free Monday haircut, not a package.

## Updating a campaign

1. Edit `src/data/campaigns.js` only (dates, packages, prices, copy en+ar).
2. Do not hardcode promo prices in FAQ answers or the system prompt — they come from `formatCampaignContext`.
3. When the campaign ends, set `endsOn` in the past (or remove the entry); UI + assistant stop grounding automatically.
4. Run `npm run test:run` (includes `campaigns.test.js` + `campaignContext.test.js`).
