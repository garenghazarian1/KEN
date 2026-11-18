import { createElement } from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ServicesSlot } from "./MobileNavTop";
import { beginPress, paintThen, planPress, usePressFeedback } from "./usePressFeedback";

vi.mock("next/navigation", () => ({
  usePathname: () => "/salon",
}));

vi.mock("next/image", () => ({ default: () => null }));

vi.mock("next/link", () => ({ default: () => null }));

vi.mock("./MobileNavTop.module.css", () => ({ default: {} }));

vi.mock("./pressFeedback.module.css", () => ({ default: {} }));

vi.mock("@/components/loading/navbar/ServicesMegaMenu/ServicesMegaMenu", () => ({
  default: () => null,
}));

function plainEvent(href = "https://example.com/book") {
  return {
    button: 0,
    currentTarget: { href },
    preventDefault: vi.fn(),
  };
}

describe("planPress", () => {
  it("takes a plain click and asks external links to reset after 4s", () => {
    expect(planPress({ event: plainEvent(), locked: false, external: true })).toEqual({
      prevent: true,
      resetIn: 4000,
      taken: true,
    });
  });

  it("keeps an internal link busy until the route changes", () => {
    expect(planPress({ event: plainEvent("/drinks"), locked: false })).toEqual({
      prevent: true,
      resetIn: null,
      taken: true,
    });
  });

  it("ignores a second tap on a control that is already opening", () => {
    expect(planPress({ event: plainEvent(), locked: true, external: true })).toEqual({
      prevent: true,
      resetIn: null,
      taken: false,
    });
  });

  it("lets a modified click through and still resets the press", () => {
    expect(
      planPress({
        event: { ...plainEvent(), metaKey: true },
        locked: false,
        external: true,
      }),
    ).toEqual({
      prevent: false,
      resetIn: 4000,
      taken: false,
    });
  });
});

describe("beginPress", () => {
  it("sets the pressed state before preventDefault or any work", () => {
    const order = [];
    const event = plainEvent("tel:+971500000000");
    event.preventDefault = () => order.push("prevent");
    beginPress({
      event,
      locked: false,
      external: true,
      setBusy: () => order.push("busy"),
      afterPaint: () => order.push("schedule"),
      arm: () => {},
      reset: () => {},
      work: () => order.push("work"),
    });
    expect(order).toEqual(["busy", "prevent", "schedule"]);
  });

  it("runs tracking and navigation only after paint", () => {
    const work = vi.fn();
    let painted = null;
    beginPress({
      event: plainEvent("https://wa.me/971500000000"),
      locked: false,
      external: true,
      setBusy: () => {},
      afterPaint: (fn) => {
        painted = fn;
      },
      arm: vi.fn(),
      reset: vi.fn(),
      work,
    });
    expect(work).not.toHaveBeenCalled();
    painted();
    expect(work).toHaveBeenCalledWith({ href: "https://wa.me/971500000000" });
  });

  it("does not run the work again on a double tap", () => {
    const work = vi.fn();
    const event = plainEvent();
    beginPress({
      event,
      locked: true,
      external: true,
      setBusy: () => {},
      afterPaint: () => {
        throw new Error("second tap should not be scheduled");
      },
      arm: () => {},
      reset: () => {},
      work,
    });
    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(work).not.toHaveBeenCalled();
  });

  it("arms a 4s reset after an external open", () => {
    const arm = vi.fn();
    let painted = null;
    beginPress({
      event: plainEvent(),
      locked: false,
      external: true,
      setBusy: () => {},
      afterPaint: (fn) => {
        painted = fn;
      },
      arm,
      reset: () => {},
      work: () => {},
    });
    expect(arm).not.toHaveBeenCalled();
    painted();
    expect(arm).toHaveBeenCalledWith(4000);
  });

  it("clears a toggle as soon as its work finishes", () => {
    const reset = vi.fn();
    let painted = null;
    beginPress({
      event: plainEvent(),
      locked: false,
      release: true,
      setBusy: () => {},
      afterPaint: (fn) => {
        painted = fn;
      },
      arm: () => {},
      reset,
      work: () => {},
    });
    painted();
    expect(reset).toHaveBeenCalledOnce();
  });

  it("clears an internal link that is already on that page", () => {
    const reset = vi.fn();
    let painted = null;
    beginPress({
      event: plainEvent("/drinks"),
      locked: false,
      setBusy: () => {},
      afterPaint: (fn) => {
        painted = fn;
      },
      arm: () => {},
      reset,
      work: () => "stay",
    });
    painted();
    expect(reset).toHaveBeenCalledOnce();
  });
});

describe("paintThen", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("runs the work after a frame and a timeout", () => {
    vi.useFakeTimers();
    vi.stubGlobal("requestAnimationFrame", (fn) => {
      fn();
      return 1;
    });
    const work = vi.fn();
    paintThen(work);
    expect(work).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(work).toHaveBeenCalledOnce();
  });
});

function remember(map, type, fn) {
  if (!map.has(type)) map.set(type, new Set());
  map.get(type).add(fn);
}

function makeNode(document, tag) {
  const listeners = new Map();
  return {
    tagName: String(tag).toUpperCase(),
    nodeType: 1,
    nodeName: String(tag).toUpperCase(),
    childNodes: [],
    children: [],
    style: {},
    attributes: {},
    ownerDocument: document,
    parentNode: null,
    namespaceURI: "http://www.w3.org/1999/xhtml",
    _listeners: listeners,
    setAttribute(name, value) {
      this.attributes[name] = String(value);
    },
    getAttribute(name) {
      return name in this.attributes ? this.attributes[name] : null;
    },
    removeAttribute(name) {
      delete this.attributes[name];
    },
    hasAttribute(name) {
      return name in this.attributes;
    },
    appendChild(child) {
      child.parentNode = this;
      this.childNodes.push(child);
      if (child.nodeType === 1) this.children.push(child);
      return child;
    },
    removeChild(child) {
      this.childNodes = this.childNodes.filter((node) => node !== child);
      this.children = this.childNodes.filter((node) => node.nodeType === 1);
      child.parentNode = null;
      return child;
    },
    insertBefore(child, before) {
      const index = this.childNodes.indexOf(before);
      child.parentNode = this;
      if (index < 0) this.childNodes.push(child);
      else this.childNodes.splice(index, 0, child);
      this.children = this.childNodes.filter((node) => node.nodeType === 1);
      return child;
    },
    addEventListener(type, fn) {
      remember(listeners, type, fn);
    },
    removeEventListener(type, fn) {
      listeners.get(type)?.delete(fn);
    },
    dispatchEvent(event) {
      const path = [];
      let current = this;
      while (current) {
        path.push(current);
        current = current.parentNode;
      }
      event.target = this;
      for (const node of path) {
        event.currentTarget = node;
        for (const fn of node._listeners?.get(event.type) || []) fn(event);
      }
      return true;
    },
    focus() {},
    blur() {},
    contains(other) {
      let current = other;
      while (current) {
        if (current === this) return true;
        current = current.parentNode;
      }
      return false;
    },
    getRootNode() {
      return document;
    },
  };
}

function installDocument() {
  const listeners = new Map();
  const document = {
    nodeType: 9,
    nodeName: "#document",
    visibilityState: "visible",
    hidden: false,
    _listeners: listeners,
    createElement(tag) {
      return makeNode(document, tag);
    },
    createElementNS(_namespace, tag) {
      return makeNode(document, tag);
    },
    createTextNode(text) {
      return { nodeType: 3, nodeName: "#text", textContent: String(text), parentNode: null };
    },
    addEventListener(type, fn) {
      remember(listeners, type, fn);
    },
    removeEventListener(type, fn) {
      listeners.get(type)?.delete(fn);
    },
    dispatchEvent(event) {
      event.target = document;
      event.currentTarget = document;
      for (const fn of listeners.get(event.type) || []) fn(event);
    },
  };
  document.documentElement = makeNode(document, "html");
  document.body = makeNode(document, "body");
  document.head = makeNode(document, "head");
  document.documentElement.appendChild(document.head);
  document.documentElement.appendChild(document.body);

  class HTMLIFrameElement {}
  const windowListeners = new Map();
  const window = {
    document,
    HTMLIFrameElement,
    HTMLElement: class HTMLElement {},
    Element: class Element {},
    Node: class Node {},
    scrollY: 0,
    requestIdleCallback: () => 0,
    cancelIdleCallback() {},
    addEventListener(type, fn) {
      remember(windowListeners, type, fn);
    },
    removeEventListener(type, fn) {
      windowListeners.get(type)?.delete(fn);
    },
    setTimeout(...args) {
      return globalThis.setTimeout(...args);
    },
    clearTimeout(...args) {
      return globalThis.clearTimeout(...args);
    },
    location: { href: "http://localhost/" },
  };
  document.defaultView = window;
  globalThis.document = document;
  globalThis.window = window;
  globalThis.HTMLIFrameElement = HTMLIFrameElement;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  globalThis.requestAnimationFrame = (fn) => globalThis.setTimeout(fn, 0);
  return document;
}

function findTag(node, tag) {
  if (node?.nodeName === tag) return node;
  for (const child of node?.childNodes || []) {
    const found = findTag(child, tag);
    if (found) return found;
  }
  return null;
}

async function render(element) {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  await act(async () => {
    root.render(element);
  });
  return {
    host,
    async unmount() {
      await act(async () => {
        root.unmount();
      });
    },
  };
}

async function pointer(node, type) {
  await act(async () => {
    node.dispatchEvent({ type, button: 0, bubbles: true, preventDefault() {} });
  });
}

function CallButton() {
  const { busy, press } = usePressFeedback();
  return createElement(
    "button",
    {
      type: "button",
      "aria-label": busy ? "Opening…" : "Call",
      onClick: (event) => press(event, () => {}, { external: true }),
    },
    busy ? "Opening…" : "Call",
  );
}

describe("usePressFeedback", () => {
  afterEach(() => {
    vi.useRealTimers();
    delete globalThis.document;
    delete globalThis.window;
    delete globalThis.requestAnimationFrame;
  });

  it("clears a press that was skipped while the page was hidden, once it is visible again", async () => {
    const document = installDocument();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const view = await render(createElement(CallButton));
    const button = findTag(view.host, "BUTTON");

    await pointer(button, "click");
    await act(async () => {
      vi.advanceTimersByTime(0);
      vi.advanceTimersByTime(0);
    });
    expect(button.getAttribute("aria-label")).toBe("Opening…");

    document.visibilityState = "hidden";
    await act(async () => {
      vi.advanceTimersByTime(4000);
    });
    expect(button.getAttribute("aria-label")).toBe("Opening…");

    document.visibilityState = "visible";
    await act(async () => {
      document.dispatchEvent({ type: "visibilitychange" });
    });
    expect(button.getAttribute("aria-label")).toBe("Call");

    const listeners = document._listeners.get("visibilitychange").size;
    await view.unmount();
    expect(document._listeners.get("visibilitychange").size).toBe(listeners - 1);
  });
});

describe("ServicesSlot", () => {
  afterEach(() => {
    vi.useRealTimers();
    delete globalThis.document;
    delete globalThis.window;
    delete globalThis.requestAnimationFrame;
  });

  it("clears Opening when a touch never becomes a tap", async () => {
    installDocument();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const view = await render(createElement(ServicesSlot, { servicesActive: false }));
    const button = findTag(view.host, "BUTTON");

    await pointer(button, "pointerdown");
    expect(button.getAttribute("aria-label")).toBe("Opening…");

    await act(async () => {
      vi.advanceTimersByTime(4000);
    });
    expect(button.getAttribute("aria-label")).toBe("Services");
    await view.unmount();
  });
});
