Last updated: 2 November 2026
Last verified against code: 2 Nov 2026 (working tree)

# Campaigns (promotional packages)

Single source of truth for limited-time offers: [`src/data/campaigns.js`](../src/data/campaigns.js).

Helpers: [`src/lib/business/campaigns.js`](../src/lib/business/campaigns.js) — Dubai-timezone active window (`Asia/Dubai`), bilingual `tCampaign`, price formatting.

## Website surfaces

- Home, under the hero: [`CampaignFilm`](../src/components/campaign/CampaignFilm.jsx) when the active campaign has a film (November iPhone offer). The film autoplays muted. A “Tap for sound” button on the video unmutes it; tapping the video or the button again mutes it. Only one video on the page plays with sound. Play and the timeline stay on the browser’s own controls. “Watch with sound” still opens the YouTube short. [`CampaignPoster`](../src/components/campaign/CampaignPoster.jsx) when the active campaign has no package list and no film (Pink October). From 1200px the poster title and offer sit on one side and the explanation on the other; narrower screens keep that text behind Read more.
- Destination: [`/offers`](../src/app/(navPages)/offers/page.jsx) — the film is its own section at the top of the page while that campaign is active; otherwise the same poster, or package cards for a package campaign such as August
- `soldOut: true` on a campaign hides it before `endsOn` (home, `/offers`, and Ani). The November iPhone offer uses this when the 200 places are gone.
- Services does not show a campaign popup

## Assistant grounding (same pattern as catalog)

- [`src/lib/assistant/campaignContext.js`](../src/lib/assistant/campaignContext.js) — keyword detect → format active campaign into the system prompt
- Injected beside catalog context in `/api/assistant/chat` and `/api/assistant/realtime/turn`
- FAQ pointer: `campaign_offers` in [`assistantFaq.js`](../src/data/assistantFaq.js)
- Quick chips / launcher tips: `getAssistantQuickChips` / `getAssistantLauncherTips` in [`assistantUi.js`](../src/data/assistantUi.js)

**Authority:** the active campaign in campaigns.js. Package prices and Hot Tuesday only when that entry lists them. Ordinary à-la-carte services/prices = live admin catalog. Pink October is a free Monday haircut, not a package. The November iPhone offer is 3 blow-dry sessions + 1 Moremo session for AED 500 and entry into the draw, limited to 200 subscribers — not a package list. Set `soldOut: true` to end it early.

## Updating a campaign

1. Edit `src/data/campaigns.js` only (dates, packages, prices, copy en+ar).
2. Do not hardcode promo prices in FAQ answers or the system prompt — they come from `formatCampaignContext`.
3. When the campaign ends, set `endsOn` in the past, set `soldOut: true`, or remove the entry. UI + assistant stop grounding automatically.
4. Run `npm run test:run` (includes `campaigns.test.js` + `campaignContext.test.js`).
