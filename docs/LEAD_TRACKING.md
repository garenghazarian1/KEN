# Outbound contact-click tracking

Last updated: 5 October 2026

## Scope

The site records intentional outbound contact clicks for WhatsApp, telephone,
the salon email address, and store directions. These records measure an action
on the website only. A WhatsApp click does not prove that the app opened, a
message was sent, or an appointment was confirmed.

No WhatsApp API, webhook, CRM, paid integration, or staff action is required.

## Runtime map

1. A contact control calls `recordOutbound()` in
   `src/lib/leads/trackLead.js`.
2. The browser classifies the destination, creates an event ID, and sends a
   minimal payload to `POST /api/leads` without delaying navigation.
3. WhatsApp clicks also push the same event ID to the existing
   `whatsapp_click` data-layer event.
4. `src/lib/leads/leadRecord.js` validates the destination against the
   canonical stores, derives the branch server-side, and rejects malformed ad
   identifiers.
5. `src/app/api/leads/route.js` rate-limits and writes the event through
   `src/lib/leads/leadEvent.js`.

The services booking path remains:

`ServiceMenu` → `bookingList` → `BookingDock` → WhatsApp link →
`recordOutbound()` → `/api/leads`.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/leads` | Store one validated outbound contact click |

Successful and duplicate event IDs return `204`. Invalid payloads return `400`,
rate limits return `429`, and storage failures return `503`.

## Stored fields

- Event ID
- Contact type and canonical target
- Server-derived branch
- Pathname where the click occurred
- Selected service IDs and names for WhatsApp booking clicks
- Valid Google Ads click identifiers, when marketing consent exists
- Browser language, timezone, screen size (width, height, pixel ratio), and referrer
- First-touch visit (`src/lib/leads/visit.js`, `sessionStorage` key
  `ken_first_visit`, saved once per tab session, never overwritten, separate
  from the 90-day ads store): `visitId`, `landingUrl` (full, with query),
  `landingReferrer`, `landedAt`
- Per click: `pageUrl` (full URL at the tap), `placement` (`footer` or
  `floating`, set only where the button is obvious), `secondsOnSite`, and
  `utmSource/Medium/Campaign/Content/Term`, `fbclid`, `ttclid`, `msclkid`
  read from `landingUrl`
- User-agent and IP address, read from the request on the server
- Creation timestamp with automatic 90-day expiration

All first-touch fields are optional. A missing or malformed value is stored as
`null` and never rejects the click (ids 200 characters, URLs and referrers 500,
placement 80). No fingerprint, GPS, name, or visitor phone is collected.

The admin app shows these on the website-click detail. Records expire after 90 days.

## Consent

`src/components/ConsentAnalytics/ConsentAnalytics.jsx` loads Google Tag Manager
and captures ad attribution only after `cookieConsent` is `accepted`.
Declining consent clears `ken_ads_attribution` local storage and the
`ken_gclid` cookie. The same component saves the first-touch visit on load
unless consent is `declined`, and clears it on decline.

## Booking UI guarantees

- Tapping **Add** immediately opens the booking sheet.
- **Continue adding** returns to the service menu.
- The closed sheet is inert.
- The open sheet traps keyboard focus, supports Escape, and restores focus to
  the control that opened it.
- Saved services are deduplicated and bounded to 20 entries.

## Change log

- 5 October 2026: Added session first-touch visit, tap page URL, UTM and
  ad-click ids from the landing URL, button placement, and seconds on site.

- 1 October 2026: Restored language, timezone, screen size, referrer,
  user-agent, and IP on stored clicks; the admin click detail depends on them.

- 30 September 2026: Added consent-gated attribution, canonical target
  validation, event IDs, 90-day retention, data minimization, bounded booking
  persistence, and booking-dialog keyboard containment.
