import fs from "fs";

const html = fs.readFileSync(".next/server/app/index.html", "utf8");
const head = html.split("</head>")[0];
console.log("--- PRELOADS ---");
for (const m of head.matchAll(/<link[^>]*rel="preload"[^>]*>/g)) {
  console.log(m[0].slice(0, 280));
}
console.log("--- FONT PRELOADS ---", [...head.matchAll(/as="font"/g)].length);
console.log("--- HIGH ---");
for (const m of html.matchAll(/fetchPriority="high"/g)) {
  const i = m.index;
  console.log(html.slice(Math.max(0, i - 180), i + 40).replace(/\s+/g, " ").slice(0, 240));
}
const scripts = [...head.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
console.log("--- SCRIPTS ---");
scripts.forEach((s) => console.log(s));
console.log("has 5567", scripts.some((s) => s.includes("5567")));
console.log("has gtm", html.includes("googletagmanager.com/gtm.js"));
console.log("has clarity src", html.includes("clarity.ms/tag"));
console.log("hero", html.includes("hero-facial-mobile"));
console.log("Hair and skin", html.includes("Hair and skin"));

const cssFiles = [...head.matchAll(/href="(\/_next\/static\/css\/[^"]+)"/g)].map((m) => m[1]);
let faces = 0;
const fams = {};
for (const file of cssFiles) {
  const css = fs.readFileSync(".next" + file.replace("/_next", ""), "utf8");
  if (!css.includes("font-face")) continue;
  for (const m of css.matchAll(/font-family:([^;{]+)/g)) {
    if (!m[1].includes("__")) continue;
    fams[m[1]] = (fams[m[1]] || 0) + 1;
    faces += 1;
  }
}
console.log("font families in loaded css", fams);
