/**
 * Simple in-memory sliding-window rate limiter for assistant routes.
 *
 * v1 limitation (documented in docs/ASSISTANT.md): state is per serverless
 * instance, so limits are approximate on Vercel. Good enough to stop abuse.
 */

const WINDOW_MS = 60 * 1000;
const DEFAULT_MAX_PER_WINDOW = 12;

const buckets = new Map();

/**
 * @param {string} key
 * @param {number} [maxPerWindow]
 * @param {number} [windowMs]
 * @returns {boolean} true if the request is allowed
 */
export function allowRequest(
  key,
  maxPerWindow = DEFAULT_MAX_PER_WINDOW,
  windowMs = WINDOW_MS
) {
  const now = Date.now();
  const bucket = buckets.get(key) || [];
  const recent = bucket.filter((t) => now - t < windowMs);

  if (recent.length >= maxPerWindow) {
    buckets.set(key, recent);
    return false;
  }

  recent.push(now);
  buckets.set(key, recent);

  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (buckets.size > 5000) {
    for (const [k, times] of buckets) {
      if (!times.some((t) => now - t < WINDOW_MS)) buckets.delete(k);
    }
  }
  return true;
}

/**
 * Apply both per-session and per-IP limits. A caller cannot bypass the IP
 * bucket by generating new local session ids.
 *
 * @param {Request} request
 * @param {string} scope
 * @param {string} sessionId
 * @param {{ sessionLimit?: number, ipLimit?: number }} [limits]
 */
export function allowAssistantRequest(
  request,
  scope,
  sessionId,
  { sessionLimit = 12, ipLimit = 30 } = {}
) {
  const vercelForwarded = request.headers.get("x-vercel-forwarded-for");
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    vercelForwarded?.split(",")[0]?.trim() ||
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const normalizedSession = String(sessionId || "anonymous").slice(0, 64);
  return (
    allowRequest(`${scope}:session:${normalizedSession}`, sessionLimit) &&
    allowRequest(`${scope}:ip:${ip}`, ipLimit)
  );
}
