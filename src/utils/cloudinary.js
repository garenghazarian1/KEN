/**
 * Cloudinary delivery URL helpers.
 *
 * The admin public API returns absolute Cloudinary `secure_url`s. We can apply
 * on-the-fly transformations by inserting parameters right after `/upload/`,
 * without the Cloudinary SDK. Non-Cloudinary URLs are returned unchanged.
 */

const CLOUDINARY_HOST = "res.cloudinary.com";

/**
 * Insert a transformation segment into a Cloudinary delivery URL.
 *
 * @param {string|null|undefined} url - absolute Cloudinary URL.
 * @param {string} transform - e.g. "f_auto,q_auto,w_400,c_fill".
 * @returns {string|null} transformed URL, original URL, or null.
 */
export function cldTransform(url, transform) {
  if (!url) return null;
  if (!url.includes(CLOUDINARY_HOST) || !url.includes("/upload/")) return url;
  if (!transform) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
}

/**
 * Build a responsive Cloudinary cover (src + srcSet) for next/image.
 *
 * @param {string|null|undefined} url
 * @param {number[]} widths
 * @param {string} transform - base transform without width, e.g. "f_auto,q_auto,h_300,c_fill".
 * @param {number} defaultWidth - width used for the primary `src`.
 * @returns {{ src: string; srcSet: string } | null}
 */
export function cldResponsiveCover(url, widths, transform, defaultWidth) {
  if (!url) return null;

  const src = cldTransform(url, `${transform},w_${defaultWidth}`);
  if (!src) return null;

  const srcSet = widths
    .map((w) => `${cldTransform(url, `${transform},w_${w}`)} ${w}w`)
    .join(", ");

  return { src, srcSet };
}
