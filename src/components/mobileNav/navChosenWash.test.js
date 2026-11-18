import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const press = readFileSync(
  new URL("./pressFeedback.module.css", import.meta.url),
  "utf8",
);
const top = readFileSync(
  new URL("./MobileNavTop.module.css", import.meta.url),
  "utf8",
);
const bottom = readFileSync(
  new URL("./MobileNavBottom.module.css", import.meta.url),
  "utf8",
);
const services = readFileSync(
  new URL(
    "../loading/navbar/ServicesMegaMenu/ServicesMegaMenu.module.css",
    import.meta.url,
  ),
  "utf8",
);
const ani = readFileSync(
  new URL("../AssistantWidget/AssistantWidget.module.css", import.meta.url),
  "utf8",
);

const WASH = "background-color: var(--overlay-black-12)";

function rule(css, selector) {
  const start = css.indexOf(selector);
  expect(start, `missing ${selector}`).toBeGreaterThan(-1);
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  return css.slice(open, close + 1);
}

describe("nav chosen wash", () => {
  it("fills the bars with a solid salon colour", () => {
    expect(rule(top, ".topBar")).toContain(
      "background-color: var(--color-bg-primary)",
    );
    expect(rule(bottom, ".bottomBar")).toContain(
      "background-color: var(--color-bg-primary)",
    );
  });

  it("paints a glass wash on bar press, not only scale", () => {
    expect(rule(press, ".bar:active")).toContain(WASH);
    expect(rule(press, ".bar[aria-busy=\"true\"]")).toContain(WASH);
  });

  it("marks the current or open tab with the same wash hover uses", () => {
    expect(rule(top, ".actionLink[aria-current=\"page\"]")).toContain(WASH);
    expect(rule(bottom, ".link[aria-current=\"page\"]")).toContain(WASH);
    expect(rule(bottom, ".link[aria-expanded=\"true\"]")).toContain(WASH);
    expect(rule(services, ".topbarTrigger[aria-current=\"page\"]")).toContain(
      WASH,
    );
    expect(rule(ani, ".navButton[aria-expanded=\"true\"]")).toContain(WASH);
  });

  it("lets the current or open icon follow the label colour", () => {
    expect(rule(top, ".actionLink[aria-current=\"page\"] .icon")).toContain(
      "color: inherit",
    );
    expect(rule(bottom, ".link[aria-current=\"page\"] .icon")).toContain(
      "color: inherit",
    );
    expect(
      rule(services, ".topbarTrigger[aria-current=\"page\"] .topbarIcon"),
    ).toContain("color: inherit");
    expect(rule(ani, ".navButton[aria-expanded=\"true\"] .navClose")).toContain(
      "color: inherit",
    );
  });

  it("keeps rest-state icons black", () => {
    expect(top).toMatch(
      /^\.icon \{\r?\n  flex-shrink: 0;\r?\n  color: var\(--color-bg-black\);/m,
    );
    expect(bottom).toMatch(
      /^\.icon \{\r?\n  flex-shrink: 0;\r?\n  color: var\(--color-bg-black\);/m,
    );
    expect(services).toMatch(
      /^\.topbarIcon \{\r?\n  flex-shrink: 0;\r?\n  color: var\(--color-bg-black\);/m,
    );
  });
});
