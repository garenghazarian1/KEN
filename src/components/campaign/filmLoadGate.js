/** Home loads only when the section is on screen. A paused hero does not block it. Offers loads on its own. */
export function shouldLoadFilm({ placement, intersecting }) {
  if (placement === "page") return true;
  return Boolean(intersecting);
}
