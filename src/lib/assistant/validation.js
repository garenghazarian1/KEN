/** Shared validation for anonymous assistant request identifiers. */
export function normalizeSessionId(value) {
  if (typeof value !== "string") return "";
  const sessionId = value.trim();
  return /^[a-zA-Z0-9-]{8,64}$/.test(sessionId) ? sessionId : "";
}
