import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = dirname(fileURLToPath(import.meta.url));

function block(css, selector) {
  const match = css.match(new RegExp(`${selector}\\s*\\{([^}]*)\\}`));
  return match ? match[1] : "";
}

function filterOrder(rule) {
  const lines = rule.split(";");
  return {
    webkit: lines.findIndex((line) => line.includes("-webkit-backdrop-filter")),
    standard: lines.findIndex(
      (line) =>
        line.includes("backdrop-filter") &&
        !line.includes("-webkit-backdrop-filter"),
    ),
  };
}

describe("iPhone glass CSS", () => {
  const glass = readFileSync(join(root, "iphoneGlass.module.css"), "utf8");

  it("keeps the standard blur after the WebKit line so the build cannot drop it", () => {
    const order = filterOrder(block(glass, "\\.surface"));
    expect(order.webkit).toBeGreaterThan(-1);
    expect(order.standard).toBeGreaterThan(order.webkit);
  });
});

function walkCss(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walkCss(path, out);
    else if (name.endsWith(".css")) out.push(path);
  }
  return out;
}

function badBackdropOrder(css) {
  const stack = [[]];
  const bad = [];
  for (const line of css.split(/\r?\n/)) {
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    if (opens && !closes) {
      stack.push([]);
      continue;
    }
    if (closes && !opens) {
      const block = stack.pop() || [];
      const webkit = block.findIndex((row) =>
        /^\s*-webkit-backdrop-filter\s*:/.test(row),
      );
      const standard = block.findIndex((row) =>
        /^\s*backdrop-filter\s*:/.test(row),
      );
      if (webkit !== -1 && standard !== -1 && standard < webkit) {
        bad.push(block.join(" ").trim());
      }
      continue;
    }
    stack[stack.length - 1].push(line);
  }
  return bad;
}

describe("glass blur across the site", () => {
  it("writes the WebKit line before backdrop-filter in every rule", () => {
    const src = join(root, "../..");
    const failures = [];
    for (const file of walkCss(src)) {
      const bad = badBackdropOrder(readFileSync(file, "utf8"));
      if (bad.length) failures.push(`${file}: ${bad[0]}`);
    }
    expect(failures).toEqual([]);
  });
});

describe("nav bars", () => {
  it("do not pin a transform layer that clears the glass", () => {
    for (const file of [
      "../mobileNav/MobileNavTop.module.css",
      "../mobileNav/MobileNavBottom.module.css",
    ]) {
      const css = readFileSync(join(root, file), "utf8");
      expect(css).not.toContain("will-change: transform");
      expect(css).not.toContain("backdrop-filter");
    }
  });
});
