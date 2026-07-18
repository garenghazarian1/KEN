# Ken AI Assistant (Text + Voice)

Last updated: 18 July 2026

Catalog-grounded website assistant: floating widget, optional guest name
(dismissible strip on chat), text + voice input, MongoDB transcript
persistence, and hard escalation to WhatsApp / phone for everything controlled
by the third-party booking system (Zenoti).

## Environment variables

| Variable          | Purpose                                                |
| ----------------- | ------------------------------------------------------ |
| `OPENAI_API_KEY`  | Server-only. Chat + transcription + TTS. Never `NEXT_PUBLIC` |
| `MONGODB_URI`     | Existing cluster URI (already used by `connectDB`)     |
| `SERVICES_MONGODB_DB_NAME` | `beauty-admin` (assistant collections live in the admin platform DB) |

All three must also be set in Vercel project env vars before deploy.

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
| POST   | `/api/assistant/session`          | Start a **fresh** conversation (closes previous open one); no hydration |
| PATCH  | `/api/assistant/session`          | Set optional `guestName` on an owned open conversation                 |
| POST   | `/api/assistant/session/end`      | Close an owned conversation (`user_end` / `idle_timeout` / `panel_closed` / `connection_lost`) |
| POST   | `/api/assistant/chat`             | JSON text or multipart audio → transcript → gate → **SSE reply**     |
| POST   | `/api/assistant/handoff`          | Mark conversation `handed_off`; return WhatsApp/call CTAs            |
| POST   | `/api/assistant/speak`            | Speak an owned, stored assistant message via streamed OpenAI TTS     |
| POST   | `/api/assistant/realtime/session` | Mint short-lived Realtime **client secret** (10 min) + conversation  |
| POST   | `/api/assistant/realtime/turn`    | Persist final user voice transcript; hard gate; return grounded instructions |
| POST   | `/api/assistant/realtime/message` | Persist a completed assistant voice transcript                       |

`/api/assistant/chat` success responses use `text/event-stream` with events:

- `transcript` — voice input only (final STT text)
- `delta` — assistant text chunk
- `done` — `{ assistantMessageId, actions, escalated }`
- `error` — `{ code, message }` (also used mid-stream)

Validation / rate-limit failures still return JSON `{ code, message }`.

Error shape: `{ code, message }` (`BAD_REQUEST`, `RATE_LIMITED`, `NOT_FOUND`,
`TRANSCRIPTION_FAILED`, `TTS_FAILED`, `REALTIME_FAILED`, `NOT_CONFIGURED`,
`SERVER_ERROR`).

`/speak` requires the owning `sessionId`, `conversationId`, and
`assistantMessageId`; it does not accept arbitrary text. Assistant routes apply
both per-session and per-IP in-memory limits and declare explicit Vercel
execution durations. The real OpenAI API key never reaches the browser — the
voice client connects with an ephemeral client secret only.

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
7. Explicit **End** and **Mute** controls; ending the call posts
   `/api/assistant/session/end`. Closing the panel stops the mic without
   closing the conversation. Denied mic / unsupported WebRTC / connection
   failure fall back to text with a visible message.

Status states shown in the composer: Connecting, Listening, Thinking,
Speaking, Muted, Ending (animated dot, `prefers-reduced-motion` respected).

## MongoDB collections (`beauty-admin`)

Assistant transcripts live in the **admin platform database** (via
`connectServicesDB`) so the admin app can render per-business chat history.
Every conversation is stamped with `businessSlug` (`BUSINESS_SLUG` =
`ken-beauty-salon` from `src/config/constants.js`); all ken queries and the
admin UI filter by it — the collections are multi-tenant.

- `assistant_conversations` — `businessSlug`, `sessionId`, optional
  `guestName`, `status` (`open` / `handed_off` / `closed`), `handoffReason`,
  `closedReason`, `lastMessageAt`, light metadata.
- `assistant_messages` — `conversationId`, `role`, `content` (text only),
  `inputModality` (`text` / `voice`), `sources[]`, `model`, `escalationReason`.

Voice messages store the **transcript only** — raw audio is never written to
disk or the database. Models registered per-connection in
`src/lib/assistant/models.js` (first Mongoose models in this app).
Compound indexes cover open-session lookup, status/last-message listing, and
conversation history.

Every new assistant session **starts fresh**: starting the widget (or the
voice call without a live conversation) closes the previous open conversation
(`closedReason: superseded`) and creates a new one. Old transcripts are never
hydrated into the UI.

`handed_off` is an operational flag, not a hard chat lock: the open panel may
still answer unrelated catalog/location questions after showing human-contact
CTAs.

## Accuracy & escalation rules

1. Prices/services come only from the live catalog
   (`src/lib/assistant/catalogContext.js`), cached in-memory ~10 minutes with
   MiniSearch ranking. English and Arabic queries load the corresponding live
   catalog locale. Price labels are quoted verbatim.
2. Curated FAQ + approved copy: `src/data/assistantFaq.js`.
3. **Deterministic locations** (`resolveLocationRequest`): address/directions
   questions bypass model phrasing and use `src/data/stores.js`, the same source
   as the Contact page. Replies include exact full addresses; the shared
   linkifier makes each address a Google Maps link and the API returns explicit
   Directions action buttons. Recent user turns preserve short follow-ups such
   as “Galleria” / “galeria”.
4. **Hard gate** (`src/lib/assistant/intentGate.js`): payments/refunds/billing,
   Zenoti account/login/registration, cancel/reschedule/no-show/deposit, and
   "book me for..." requests never reach the LLM. They get a fixed template +
   WhatsApp/call/Book Now CTAs and mark the conversation `handed_off`.
5. System prompt (`src/lib/assistant/prompt.js`) forbids invented prices,
   hours, policies, and any claim of booking/cancelling/refunding.
6. Retrieval includes the last three user turns so follow-ups such as “How
   much is it?” remain grounded in the previously mentioned service.

## UI

- `src/components/AssistantWidget/` — launcher fixed bottom-left (WhatsApp
  button owns bottom-right), panel lazy-loaded via `next/dynamic` on first open.
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
  persistent text bubble and never plays audio. Closing the panel stops voice.
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
- `src/lib/assistant/intentGate.test.js` covers exact two-branch addresses,
  Galleria follow-up resolution, Google Maps actions, and non-location branch
  questions. `vitest.config.mjs` maps the app's existing `@/` import alias.

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
- No retention job yet; decide a transcript retention window (e.g. 180 days)
  and add a TTL index if required.
- graphify CLI is not installed in the dev environment, so `graphify update .`
  was not run for these files.

## History

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
