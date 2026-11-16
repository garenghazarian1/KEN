export function savesData() {
  return Boolean(navigator.connection && navigator.connection.saveData);
}
