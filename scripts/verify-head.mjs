/**
 * Fetches the home page HTML and asserts head tags for favicon / PWA / OG checks.
 * Run with the app already listening (e.g. `npm run dev` or `npm run start`).
 *
 *   VERIFY_URL=http://127.0.0.1:3000/ npm run verify:head
 */

const url = process.env.VERIFY_URL || "http://127.0.0.1:3000/";

const patterns = [
  { name: "apple-touch-icon", re: /rel=["']apple-touch-icon["']/i },
  { name: "web manifest", re: /rel=["']manifest["']/i },
  { name: "og:image", re: /property=["']og:image["']/i },
  { name: "twitter:image", re: /name=["']twitter:image["']/i },
  { name: "shortcut icon / icon", re: /rel=["'](?:shortcut )?icon["']/i },
];

async function main() {
  let html;
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      console.error(`verify-head: GET ${url} -> ${res.status} ${res.statusText}`);
      process.exit(1);
    }
    html = await res.text();
  } catch (e) {
    console.error(
      `verify-head: failed to fetch ${url}\n  Is the server running? (${e.message})`
    );
    process.exit(1);
  }

  const missing = [];
  for (const { name, re } of patterns) {
    if (!re.test(html)) missing.push(name);
  }

  if (missing.length) {
    console.error(
      `verify-head: missing in HTML: ${missing.join(", ")}\n  URL: ${url}`
    );
    process.exit(1);
  }

  console.log(`verify-head: OK (${patterns.length} checks) — ${url}`);
}

main();
