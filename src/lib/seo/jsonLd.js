export function jsonLdHtml(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
