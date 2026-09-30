# Outbound contact-click tracking

Last updated: 30 September 2026

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
- Creation timestamp with automatic 90-day expiration

The click pipeline does not store screen dimensions, timezone, referrer,
user-agent, or IP address. The request IP is used transiently for rate limiting.
Records expire after 90 days.

## Consent

`src/components/ConsentAnalytics/ConsentAnalytics.jsx` loads Google Tag Manager
and captures ad attribution only after `cookieConsent` is `accepted`.
Declining consent clears `ken_ads_attribution` local storage and the
`ken_gclid` cookie.

## Booking UI guarantees

- Tapping **Add** immediately opens the booking sheet.
- **Continue adding** returns to the service menu.
- The closed sheet is inert.
- The open sheet traps keyboard focus, supports Escape, and restores focus to
  the control that opened it.
- Saved services are deduplicated and bounded to 20 entries.

## Change log

- 30 September 2026: Added consent-gated attribution, canonical target
  validation, event IDs, 90-day retention, data minimization, bounded booking
  persistence, and booking-dialog keyboard containment.
