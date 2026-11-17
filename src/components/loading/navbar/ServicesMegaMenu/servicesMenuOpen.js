let requested = false;

export function requestServicesOpen() {
  requested = true;
}

export function takeServicesOpen() {
  const value = requested;
  requested = false;
  return value;
}
