Last updated: 17 November 2026
Last verified against code: 17 November 2026 (working tree)

# Outbound contact-click tracking

## Scope

The site records intentional outbound contact clicks for WhatsApp, telephone,
the salon email address, and store directions. These records measure an action
on the website only. A WhatsApp click does not prove that the app opened, a
message was sent, or an appointment was confirmed.

No WhatsApp API, webhook, CRM, paid integration, or staff action is required.

## Runtime map

1. A contact control calls `recordOutbound()` in
   `src/lib/leads/trackLead.js`. The navbar Call and WhatsApp rows paint
   Opening… first, then call `recordOutbound()` with the same arguments and
   open the same href.
2. The browser classifies the destination, creates an event ID, and sends a
   minimal payload to `POST /api/leads` without delaying navigation. Five
   clicks per minute are stored. Later taps in that minute still open the
   contact link and are not stored or sent to the data layer. The server
   keeps the same five-per-IP limit.
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
- Valid Google Ads click identifiers, saved from the landing URL
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

## Advertising tags

Google Tag Manager (`GTM-M3QMMNGZ`) loads from
`src/components/DeferredGoogleTag.jsx`. It does not start until the first
pointer, key, scroll, or touch, or until the browser is idle at least 5
seconds after load, whichever comes first. The script is inserted after the
next paint, so a tap can show "Opening…" before Tag Manager runs. The same
gate loads Microsoft Clarity on Vercel production and Vercel Analytics.
Pages do not wait for a cookie prompt.

The root layout installs queue stubs before hydration: `dataLayer`, a
temporary `fbq` stub, and a `clarity` queue. A click on a link or button
before Tag Manager is listening is pushed as `gtm.click` after paint. WhatsApp
clicks also push `whatsapp_click`. Tag Manager replays the queue when it
starts. The temporary `fbq` function is removed just before `gtm.js` so the
container's own pixel snippet can install, then any early `fbq` calls are
replayed.

No Google Tag Manager container change is required for Click and
`whatsapp_click` triggers. A tag that calls `fbq` only from a custom HTML tag
which aborts when `window.fbq` already exists is safe, because the stub is
removed before `gtm.js` runs. If a tag expects a different event name than
`gtm.click` or `whatsapp_click`, add a Custom Event trigger for that name.

`src/components/ConsentAnalytics/ConsentAnalytics.jsx` saves the Google click
id and the first-touch visit on load. There is no cookie-consent banner.

## Booking UI guarantees

- Tapping **Add** immediately opens the booking sheet.
- **Continue adding** returns to the service menu.
- The closed sheet is inert.
- The open sheet traps keyboard focus, supports Escape, and restores focus to
  the control that opened it.
- Saved services are deduplicated and bounded to 20 entries.

## Change log

- 17 November 2026: Navbar Call and WhatsApp show Opening… before
  `recordOutbound` and the same link open.

- 17 November 2026: Tag Manager, Clarity, and Vercel Analytics wait for the
  first interaction or for idle at least 5 seconds. Early clicks stay on the
  data-layer queue and are sent after paint.

- 4 November 2026: On the home page, Tag Manager waits for the hero still and then
  idle, with a cap of about 3 seconds. Other pages still load it immediately.

- 20 October 2026: Google Tag Manager loads on every page again. The click
  id is saved without a cookie prompt, and the consent banner is removed.

- 7 October 2026: Background click log keeps five events per minute. Further
  taps still open the contact link and do not create another stored click.

- 5 October 2026: Added session first-touch visit, tap page URL, UTM and
  ad-click ids from the landing URL, button placement, and seconds on site.

- 1 October 2026: Restored language, timezone, screen size, referrer,
  user-agent, and IP on stored clicks; the admin click detail depends on them.

- 30 September 2026: Added consent-gated attribution, canonical target
  validation, event IDs, 90-day retention, data minimization, bounded booking
  persistence, and booking-dialog keyboard containment.
