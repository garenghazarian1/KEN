"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ken-booking-services";
const CHANGE_EVENT = "ken-booking-change";
export const BOOKING_OPEN_EVENT = "ken-booking-open";

function isService(value) {
  return (
    value &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.name === "string" &&
    value.name.length > 0
  );
}

export function readBookingServices() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isService).map((service) => ({
      id: service.id,
      name: service.name,
    }));
  } catch {
    return [];
  }
}

export function writeBookingServices(services) {
  if (typeof window === "undefined") return;
  if (!services.length) window.localStorage.removeItem(STORAGE_KEY);
  else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function toggleBookingService(item) {
  const current = readBookingServices();
  const removing = current.some((service) => service.id === item.id);
  const next = removing
    ? current.filter((service) => service.id !== item.id)
    : [...current, { id: item.id, name: item.name }];
  writeBookingServices(next);
  return { added: !removing };
}

export function useBookingServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const sync = () => setServices(readBookingServices());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return services;
}
