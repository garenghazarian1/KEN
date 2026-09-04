# Ken AI Assistant — Ani (Text + Voice)

Last updated: 4 September 2026

Catalog-grounded website assistant **Ani**: floating widget with model-style
avatar, optional guest name (dismissible strip on chat), text + voice input,
MongoDB transcript persistence, and hard escalation to WhatsApp / phone for
everything controlled by the third-party booking system (Zenoti).

Persona display name and greeting live in `src/data/assistantUi.js`; system
prompt identity is in `src/lib/assistant/prompt.js`. Avatar assets:
`public/assistant/ken-assistant-avatar.webp` (+ `.png` fallback), paths in
`src/config/constants.js`. On each page load, launcher tips rotate above the
launcher (`getAssistantLauncherTips()`, ~4.2 s each, once per load) then stop;
opening the chat ends the sequence early. When a campaign is active, tips and
quick chips include an August-offers prompt.

## Environment variables

| Variable          | Purpose                                                |
| ----------------- | ------------------------------------------------------ |
| `OPENAI_API_KEY`  | Server-only. Chat + transcription + TTS. Never `NEXT_PUBLIC` |
| `MONGODB_URI`     | Existing cluster URI (already used by `connectDB`)     |
| `SERVICES_MONGODB_DB_NAME` | `beauty-admin` (assistant collections live in the admin platform DB) |
| `CRON_SECRET`     | Bearer token for `GET /api/cron/assistant-cleanup` (Vercel Cron sends `Authorization: Bearer …`) |

All four must also be set in Vercel project env vars before deploy.

## Models

- Text chat: `gpt-4.1-mini` (temperature 0.3, max 400 output tokens),
  **streamed** over SSE so the widget can render tokens as they arrive
- Live voice conversation: **OpenAI Realtime** `gpt-realtime-mini` over browser
  WebRTC, voice `coral`, input transcription `gpt-4o-mini-transcribe`,
  near-field noise reduction, **semantic VAD** (auto eagerness) with
  `interrupt_response: true` (barge-in) and `create_response: false`
  (every response must be authorized by the turn route first)
- Text chat is text-only. Voice playback belongs exclusively to the Realtime
  voice conversation. The authenticated `/speak` endpoint remains available
  server-side but the widget does not call it.

## API routes

| Method | Path                              | Purpose                                                              |
| ------ | --------------------------------- | -------------------------------------------------------------------- |
| POST   | `/api/assistant/session`          | Start a **fresh** conversation (closes previous open/idle); no hydration |
| PATCH  | `/api/assistant/session`          | Set optional `guestName` on an owned open/idle/`handed_off` conversation |
| POST   | `/api/assistant/session/end`      | Close an owned conversation (`user_end` / `idle_timeout` / `panel_closed` / `connection_lost`) |
| POST   | `/api/assistant/chat`             | JSON text or multipart audio → transcript → gate → **SSE reply**     |
| POST   | `/api/assistant/handoff`          | Mark conversation `handed_off`; return WhatsApp/call CTAs            |
| POST   | `/api/assistant/speak`            | Speak an owned, stored assistant message via streamed OpenAI TTS     |
| POST   | `/api/assistant/realtime/session` | Mint short-lived Realtime **client secret** (10 min) + conversation  |
| POST   | `/api/assistant/realtime/turn`    | Persist final user voice transcript; hard gate; return grounded instructions |
| POST   | `/api/assistant/realtime/message` | Persist a completed assistant voice transcript                       |
| GET    | `/api/cron/assistant-cleanup`     | Every 15 min: mark idle (15 min) then close (24 h) for this business |

`/api/assistant/chat` success responses use `text/event-stream` with events:

- `transcript` — voice input only (final STT text)
- `delta` — assistant text chunk
- `done` — `{ assistantMessageId, actions, escalated }`
- `error` — `{ code, message }` (also used mid-stream)

Validation / rate-limit failures still return JSON `{ code, message }`.

Error shape: `{ code, message }` (`BAD_REQUEST`, `RATE_LIMITED`, `NOT_FOUND`,
`CONVERSATION_CLOSED`, `TRANSCRIPTION_FAILED`, `TTS_FAILED`, `REALTIME_FAILED`,
`NOT_CONFIGURED`, `SERVER_ERROR`).

`/speak` requires the owning `sessionId`, `conversationId`, and
`assistantMessageId`; it does not accept arbitrary text. Assistant routes apply
both per-session and per-IP in-memory limits and declare explicit Vercel
execution durations. The real OpenAI API key never reaches the browser — the
voice client connects with an ephemeral client secret only.

## Conversation close lifecycle

Cheer-ported inactivity rules live in `src/lib/assistant/assistantLifecycle.js`
+ `assistantRetention.js` (15 min idle, 24 h close). Cron:
`vercel.json` → `GET /api/cron/assistant-cleanup` every 15 minutes, scoped by
`BUSINESS_SLUG`. `handed_off` is skipped by cron. Guest activity on an `idle`
row reopens it to `open` and bumps `lastMessageAt`. Writes to `closed` return
`409 CONVERSATION_CLOSED`.

| Event | Mongo |
| ----- | ----- |
| Panel close / Escape | `closed` (`panel_closed`) |
| Header **End chat** or Talk orb **End** | `closed` (`user_end`) |
| Voice 15 s + 15 s silence goodbye | `closed` (`idle_timeout`) |
| Fresh session for same browser sessionId | prior `open`/`idle` → `closed` (`superseded`) |
| Cron after 15 min no messages | `open` → `idle` |
| Cron after 24 h no messages | `open`/`idle` → `closed` (`inactivity`) |

Switching voice → text (`switch_to_text`) and WebRTC `connection_lost` tear
down the mic only — they do **not** close Mongo (guest may keep typing; cron
covers abandoned sessions).

The panel stays open after an explicit End; `ensureSession` starts a new row.
Closing the panel resets client state so the next open is also a new session.
Reopening continues the same thread only while the panel stays open and the
row is still `open` or `idle`.

## Voice conversation lifecycle

Client hook: `src/hooks/useAssistantRealtime.js` (WebRTC + data channel);
idle-close state machine: `src/lib/assistant/voiceLifecycle.js` (unit tested).

1. Talk orb → `POST /api/assistant/realtime/session` → ephemeral secret →
   WebRTC offer to `https://api.openai.com/v1/realtime/calls`.
2. Guest speech: live caption bubbles from
   `conversation.item.input_audio_transcription.delta` events; semantic VAD
   detects turn end — no fixed silence timeout, natural pauses are respected.
3. Final transcript → `POST /api/assistant/realtime/turn`: persist user turn,
   run the Zenoti escalation gate, retrieve catalog/FAQ context. Escalated
   topics return the fixed template (model only reads it aloud) + CTAs;
   otherwise the client applies grounded instructions via `session.update`
   and sends `response.create`.
4. Assistant speech streams over the audio track; captions from
   `response.output_audio_transcript.delta`. Completed transcripts persist via
   `POST /api/assistant/realtime/message` (transcript only — never audio).
5. **Barge-in:** guest speech interrupts the assistant server-side.
6. **Two-stage inactivity close:** 15 s of silence after an assistant turn →
   spoken check-in ("anything else?"); 15 s more without speech, typing, or
   interaction → spoken goodbye, conversation marked `closed`
   (`closedReason: idle_timeout`), WebRTC torn down, panel closes and resets.
7. Explicit **End chat** (header), Talk orb **End**, and **Mute**; ending posts
   `/api/assistant/session/end` with `user_end`. Closing the panel stops the
   mic and closes the conversation (`panel_closed`). Denied mic / unsupported
   WebRTC / connection failure fall back to text with a visible message.

Status states shown in the composer: Connecting, Listening, Thinking,
Speaking, Muted, Ending (animated dot, `prefers-reduced-motion` respected).

## MongoDB collections (`beauty-admin`)

Assistant transcripts live in the **admin platform database** (via
`connectServicesDB`) so the admin app can render per-business chat history.
Every conversation is stamped with `businessSlug` (`BUSINESS_SLUG` =
`ken-beauty-salon` from `src/config/constants.js`); all ken queries and the
admin UI filter by it — the collections are multi-tenant.

- `assistant_conversations` — `businessSlug`, `sessionId`, optional
  `guestName`, `status` (`open` / `idle` / `handed_off` / `closed`),
  `handoffReason`, `closedReason`, `lastMessageAt`, light metadata.
- `assistant_messages` — `conversationId`, `role`, `content` (text only),
  `inputModality` (`text` / `voice`), `sources[]`, `model`, `escalationReason`.

Voice messages store the **transcript only** — raw audio is never written to
disk or the database. Models registered per-connection in
`src/lib/assistant/models.js` (first Mongoose models in this app).
Compound indexes cover open-session lookup, status/last-message listing, and
conversation history.

Every new assistant session **starts fresh**: starting the widget (or the
voice call without a live conversation) closes the previous open/idle
conversation (`closedReason: superseded`) and creates a new one. Old
transcripts are never hydrated into the UI.

`handed_off` is an operational flag, not a hard chat lock: the open panel may
still answer unrelated catalog/location questions after showing human-contact
CTAs. Cron inactivity does not change `handed_off` rows.

## Accuracy & escalation rules

1. Prices/services come only from the live catalog
   (`src/lib/assistant/catalogContext.js`), cached in-memory ~10 minutes with
   MiniSearch ranking. English and Arabic queries load the corresponding live
   catalog locale. Price labels are quoted verbatim. Guest phrasing is expanded
   before search (`catalogQueryExpand.js`: synonym rules + optional
   `gpt-4.1-mini` keyword rewrite) so questions like “barber cut” still retrieve
   catalog rows such as “Men’s Haircut” — the model still must not invent prices.
   Drink-menu and **active campaign** questions skip the service-catalog overview
   so they do not drown FAQ / campaign grounding.
2. **Active campaigns** (`src/lib/assistant/campaignContext.js` +
   `src/data/campaigns.js`): promotional packages, package inclusions, promo
   prices, and Hot Tuesday rules. Injected into the system prompt the same way
   as catalog context (text chat + Realtime turn). See `docs/CAMPAIGNS.md`.
3. Curated FAQ + approved copy: `src/data/assistantFaq.js` — includes
   complimentary **drinks** (from `src/data/drinks.js`), **About / founder**
   (Vicken Ghazarian / Ken), **Gallery** page pointers, and a
   `campaign_offers` pointer that defers to ACTIVE CAMPAIGN context.
4. **Deterministic locations** (`resolveLocationRequest`): address/directions
   questions bypass model phrasing and use `src/data/stores.js`, the same source
   as the Contact page. Replies include exact full addresses; the shared
   linkifier makes each address a Google Maps link and the API returns explicit
   Directions action buttons. Recent user turns preserve short follow-ups such
   as “Galleria” / “galeria”.
5. **Hard gate** (`src/lib/assistant/intentGate.js`): payments/refunds/billing,
   Zenoti account/login/registration, cancel/reschedule/no-show/deposit, and
   "book me for..." requests never reach the LLM. They get a fixed template +
   WhatsApp/call/Book Now CTAs and mark the conversation `handed_off`.
6. System prompt (`src/lib/assistant/prompt.js`) forbids invented prices,
   hours, policies, and any claim of booking/cancelling/refunding. Campaign
   packages override only for promo packages; ordinary services stay on the
   catalog.
7. Retrieval includes the last three user turns so follow-ups such as “How
   much is it?” remain grounded in the previously mentioned service.

## UI

- `src/components/AssistantWidget/` — launcher fixed bottom-left (WhatsApp
  button owns bottom-right), panel lazy-loaded via `next/dynamic` on first open.
  One-time tip bubble above the face button (3 marketing lines × 3 s).
- Mounted once in `src/app/layout.jsx`.
- Flow: opening the panel starts a session immediately and shows chat (greeting
  + quick chips). Optional name is a small dismissible strip above the
  transcript — it never blocks chatting. Save updates `guestName` via PATCH;
  dismiss persists in `localStorage` (`ken-assistant-name-dismissed`). Session
  id lives in `localStorage` (`ken-assistant-session`).
- The **Talk** orb is always shown in the composer (including App Store /
  Play Store WebViews). If mic/WebRTC APIs are missing, tapping Talk shows a
  clear in-panel message instead of hiding the control. Live voice still needs
  native mic permission in WKWebView (`NSMicrophoneUsageDescription` + media
  capture grant) — website changes alone cannot unlock that.
- Talk orb CSS strips iOS default button chrome (`appearance: none`) so Safari
  does not draw a square around the circle. Site `Permissions-Policy` allows
  `microphone=(self)`.
- Text and voice modes are exclusive. Sending typed text ends the live
  mic/WebRTC call before the text request starts; its response streams into a
  persistent text bubble and never plays audio. Closing the panel stops voice
  and closes the Mongo conversation (`panel_closed`).
- Header **End chat** (square control) ends the conversation for text and
  voice (`user_end`) without closing the panel; a new session starts if the
  guest keeps chatting.
- The two transports keep independent message ids/state (`source: "text"` or
  `"voice"`) but reuse the same accessible message-list presentation. Voice
  captions come only from Realtime transcription events: the guest transcript
  appears at turn completion (with a listening placeholder while speaking),
  and assistant captions stream with the audio. A completed-transcript event
  and `response.done` both provide fallbacks when token deltas are unavailable.
- After the two-stage inactivity goodbye the panel resets the conversation,
  so the next open starts a brand-new session.

## Tests

- `npm run test:run` (Vitest) — `src/lib/assistant/voiceLifecycle.test.js`
  covers the two-stage close: check-in at 15 s, goodbye 15 s after the
  check-in turn, activity resets, single-close guarantee, and disposal.
- `src/lib/assistant/assistantLifecycle.test.js` covers cron idle/close
  transitions, handed_off skip, explicit close reasons, and idle reopen.
- `assistantRetention.test.js`, `touchConversationActivity.test.js`,
  `shouldAdoptAssistantSession.test.js`, and
  `applyAssistantCleanupBatch.test.js` cover thresholds, idle reopen,
  the in-flight session race, and cron batch writes.
- Route tests: `session/end/route.test.js`, `cron/assistant-cleanup/route.test.js`.
- `npm run e2e` (Playwright) — `e2e/assistant-close.spec.js` covers panel
  close, launcher close, End chat, and reopen creating a new session.
- `src/lib/assistant/intentGate.test.js` covers exact two-branch addresses,
  Galleria follow-up resolution, Google Maps actions, and non-location branch
  questions. `vitest.config.mjs` maps the app's existing `@/` import alias.
- `src/lib/assistant/campaignContext.test.js` + `src/lib/business/campaigns.test.js`
  cover active-window detection and offer-query grounding (EN + AR).
- `src/lib/assistant/catalogQueryExpand.test.js` covers synonym expansion
  (barber cut → men/haircut) and LLM keyword rewrite parsing.

## Known limitations (v1)

- App Store / Play Store WebViews: Talk is visible, but live voice only works
  after the native shell grants microphone capture. Until then guests see an
  in-panel message and can keep typing.
- Rate limiter (`src/lib/assistant/rateLimit.js`) is in-memory per serverless
  instance — approximate on Vercel despite combined IP/session buckets. Move to
  a shared Redis-backed limiter before high-traffic promotion.
- English-first UI copy; the model replies in the guest's language.
- Transcripts are viewable in the admin app under AI Assistant Chats
  (business-scoped); raw data lives in `beauty-admin.assistant_*`.
- Admin UI currently maps unknown statuses to “Closed”, so `idle` may look
  closed in the list until admin labels are updated. `closedReason:
  inactivity` shows as the raw string until admin i18n adds a label.
- Transcript retention purge (180 days) is owned by the admin app cron — Ken
  does not set `expireAt` / TTL indexes on assistant collections.
- graphify CLI may be unavailable in some environments; run
  `python -m graphify update .` when present.

## History

- **4 September 2026** — Ported Cheer-style close lifecycle: panel close and
  End chat post `/session/end`; cron idle (15 min) / close (24 h); `idle`
  status + `inactivity` reason; keep voice 15 s idle and `superseded`.
- **12 August 2026** — Catalog search understands guest phrasing via synonym
  rules + optional LLM keyword rewrite (`catalogQueryExpand.js`) before
  MiniSearch; prices still only from catalog hits.
- **12 August 2026** — Grounded Ani on active promotional campaigns
  (`campaigns.js` → `campaignContext.js`), same injection path as catalog
  context; FAQ `campaign_offers`; dynamic offer chip/tip when campaign active.
- **19 July 2026** — Grounded Ani on complimentary drinks (`drinks.js`), About /
  founder (Vicken Ghazarian / Ken), and Gallery URLs; greeting + quick chip
  updated; drink queries no longer pull the service-catalog overview.
- **18 July 2026** — Talk button always visible (WebView no longer hides it);
  iOS Safari square chrome fixed via `appearance: none`; Realtime playback uses
  a DOM-attached `playsInline` audio element; `Permissions-Policy` allows mic.
- **17 July 2026** — Address/directions answers now resolve deterministically
  from the Contact page's canonical `stores.js` data in both text and Realtime
  voice flows. Exact addresses are clickable Google Maps links and replies add
  branch-specific Directions actions; added intent tests and centralized the
  maps URL builder.
- **17 July 2026** — Separated text and voice interaction: typed messages now
  stop Realtime voice before sending, text replies never invoke TTS, and every
  text request owns a persistent streaming bubble instead of a separate
  temporary typing row.
- **17 July 2026** — Voice captions now use voice-tagged message state while
  sharing the standard bubble renderer. Added completed-transcript fallback
  events and voice-only cleanup so captions cannot overwrite text messages.
  Fixed caption insertion under React Strict Mode by keeping voice-id map
  mutations outside functional state updaters (which React may invoke twice).
- **17 July 2026** — Realtime voice conversation: replaced the
  record→upload→transcribe→TTS chain with OpenAI Realtime over WebRTC
  (`gpt-realtime-mini`, semantic VAD, barge-in, live captions both ways,
  ephemeral client secrets). Added `realtime/session|turn|message` and
  `session/end` routes, fresh-conversation sessions (no hydration),
  `closedReason`, two-stage 15 s inactivity check-in/goodbye auto-close, and
  Vitest lifecycle tests.
- **17 July 2026** — Faster replies: chat uses SSE token streaming; TTS is
  piped from OpenAI and the client starts MPEG playback early (MediaSource)
  when available.
- **17 July 2026** — Reliability/security audit: bound TTS to stored assistant
  messages, added IP+session rate limits, ObjectId/MIME validation, explicit
  route durations, multi-turn retrieval, Arabic catalog/escalation support,
  session transcript hydration, complete handoff persistence, compound Mongo
  indexes, trusted-domain linkification, voice lifecycle cleanup, and expanded
  privacy/local-storage disclosure.
- **17 July 2026** — Initial release: widget, session/chat/handoff routes,
  Mongo persistence, catalog grounding, Zenoti escalation gate, voice
  (transcribe-only) + spoken replies. Assistant replies linkify phones
  (WhatsApp numbers → wa.me), emails, URLs, known street addresses, and
  `/contact` / `/services`. Live admin catalog API remains the only source
  of truth for service names and prices.
