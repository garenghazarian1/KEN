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
