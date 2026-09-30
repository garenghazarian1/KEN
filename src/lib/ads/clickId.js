/** Accept only production-shaped Google Ads click identifiers. */
export function productionClickId(value) {
  const text = String(value || "").trim();
  if (!/^[A-Za-z0-9._-]{20,200}$/.test(text)) return null;
  if (/^test/i.test(text)) return null;
  return text;
}
