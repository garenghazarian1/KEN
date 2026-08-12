# Campaigns (promotional packages)

Last updated: 12 August 2026

Single source of truth for limited-time offers: [`src/data/campaigns.js`](../src/data/campaigns.js).

Helpers: [`src/lib/business/campaigns.js`](../src/lib/business/campaigns.js) — Dubai-timezone active window (`Asia/Dubai`), bilingual `tCampaign`, price formatting.

## Website surfaces

- Hero + Services: [`OfferPromo`](../src/components/campaign/OfferPromo.jsx) (glass takeover → water-drop pill)
- Destination: [`/offers`](../src/app/(navPages)/offers/page.jsx)

## Assistant grounding (same pattern as catalog)

- [`src/lib/assistant/campaignContext.js`](../src/lib/assistant/campaignContext.js) — keyword detect → format active campaign into the system prompt
- Injected beside catalog context in `/api/assistant/chat` and `/api/assistant/realtime/turn`
- FAQ pointer: `campaign_offers` in [`assistantFaq.js`](../src/data/assistantFaq.js)
- Quick chips / launcher tips: `getAssistantQuickChips` / `getAssistantLauncherTips` in [`assistantUi.js`](../src/data/assistantUi.js)

**Authority:** campaign packages + promo prices = campaigns.js. Ordinary à-la-carte services/prices = live admin catalog. Hot Tuesday excludes August Special Packages.

## Updating a campaign

1. Edit `src/data/campaigns.js` only (dates, packages, prices, copy en+ar).
2. Do not hardcode promo prices in FAQ answers or the system prompt — they come from `formatCampaignContext`.
3. When the campaign ends, set `endsOn` in the past (or remove the entry); UI + assistant stop grounding automatically.
4. Run `npm run test:run` (includes `campaigns.test.js` + `campaignContext.test.js`).
