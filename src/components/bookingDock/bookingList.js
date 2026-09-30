"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ken-booking-services";
const CHANGE_EVENT = "ken-booking-change";
const MAX_SERVICES = 20;
const MAX_ID_LENGTH = 80;
const MAX_NAME_LENGTH = 120;
export const BOOKING_OPEN_EVENT = "ken-booking-open";

function normalizedService(value) {
  if (!value || typeof value.id !== "string" || typeof value.name !== "string") {
    return null;
  }
  const id = value.id.trim().slice(0, MAX_ID_LENGTH);
  const name = value.name.trim().slice(0, MAX_NAME_LENGTH);
  return id && name ? { id, name } : null;
}

function normalizeServices(values) {
  if (!Array.isArray(values)) return [];
  const unique = new Map();
  for (const value of values) {
    const service = normalizedService(value);
    if (!service || unique.has(service.id)) continue;
    unique.set(service.id, service);
    if (unique.size === MAX_SERVICES) break;
  }
  return [...unique.values()];
}

export function readBookingServices() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return normalizeServices(parsed);
  } catch {
    return [];
  }
}

export function writeBookingServices(services) {
  if (typeof window === "undefined") return;
  const normalized = normalizeServices(services);
  if (!normalized.length) window.localStorage.removeItem(STORAGE_KEY);
  else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function toggleBookingService(item) {
  const current = readBookingServices();
  const service = normalizedService(item);
  if (!service) return { added: false };
  const removing = current.some((entry) => entry.id === service.id);
  if (!removing && current.length >= MAX_SERVICES) {
    return { added: false, limitReached: true };
  }
  const next = removing
    ? current.filter((entry) => entry.id !== service.id)
    : [...current, service];
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
