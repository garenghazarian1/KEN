/**
 * AI-generated category banners for the service menu.
 */

const MODEL_IMAGE_BASE = "/price-catalog/categories";

/** @type {Array<{ match: RegExp; slug: string; alt: string }>} */
export const SERVICE_CATEGORY_IMAGES = [
  {
    match: /hair/i,
    slug: "hair",
    alt: "Hair styling service at Ken Salon",
  },
  {
    match: /nail/i,
    slug: "nails",
    alt: "Nail services at Ken Salon",
  },
  {
    match: /solarium|tan/i,
    slug: "solarium",
    alt: "Solarium and light therapy at Ken Salon",
  },
  {
    match: /facial|skin/i,
    slug: "facial",
    alt: "Facial treatments at Ken Salon",
  },
  {
    match: /make\s*up|makeup/i,
    slug: "makeup",
    alt: "Makeup services at Ken Salon",
  },
  {
    match: /wax|bleach/i,
    slug: "waxing-bleaching",
    alt: "Waxing and bleaching services at Ken Salon",
  },
  {
    match: /men|barber/i,
    slug: "men",
    alt: "Men's grooming and barbershop services at Ken Salon",
  },
];

/**
 * @param {string} title
 * @returns {{ src: string; srcSet: string; alt: string } | null}
 */
export function getCategoryImage(title = "") {
  const entry = SERVICE_CATEGORY_IMAGES.find(({ match }) => match.test(title));
  if (!entry) return null;

  const { slug, alt } = entry;
  const widths = [640, 1280, 1920];

  return {
    src: `${MODEL_IMAGE_BASE}/${slug}.webp`,
    srcSet: widths
      .map((w) => `${MODEL_IMAGE_BASE}/${slug}-${w}.webp ${w}w`)
      .join(", "),
    alt,
  };
}
