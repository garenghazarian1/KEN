import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  readBookingServices,
  toggleBookingService,
  writeBookingServices,
} from "@/components/bookingDock/bookingList";

function localStorageStub() {
  const values = new Map();
  return {
    getItem: vi.fn((key) => values.get(key) ?? null),
    setItem: vi.fn((key, value) => values.set(key, String(value))),
    removeItem: vi.fn((key) => values.delete(key)),
  };
}

describe("bookingList", () => {
  beforeEach(() => {
    global.window = {
      localStorage: localStorageStub(),
      dispatchEvent: vi.fn(),
    };
  });

  afterEach(() => {
    delete global.window;
  });

  it("ignores malformed storage", () => {
    window.localStorage.setItem("ken-booking-services", "{not-json");
    expect(readBookingServices()).toEqual([]);
  });

  it("deduplicates, trims, and bounds persisted services", () => {
    const services = Array.from({ length: 24 }, (_, index) => ({
      id: ` service-${index} `,
      name: ` Service ${index} `,
    }));
    services.splice(1, 0, {
      id: "service-0",
      name: "Duplicate",
    });

    writeBookingServices(services);

    const stored = readBookingServices();
    expect(stored).toHaveLength(20);
    expect(stored[0]).toEqual({ id: "service-0", name: "Service 0" });
    expect(stored.filter((service) => service.id === "service-0")).toHaveLength(1);
  });

  it("adds and removes the same service", () => {
    expect(toggleBookingService({ id: "cut", name: "Haircut" })).toEqual({
      added: true,
    });
    expect(readBookingServices()).toEqual([{ id: "cut", name: "Haircut" }]);

    expect(toggleBookingService({ id: "cut", name: "Haircut" })).toEqual({
      added: false,
    });
    expect(readBookingServices()).toEqual([]);
  });
});
