/**
 * Application Constants
 *
 * Centralized configuration for URLs, contact information, and social media links.
 * This is the single source of truth for all application constants.
 *
 * Update these values to change URLs, phone numbers, or social links across the entire app.
 */

// Base URL Configuration
export const BASE_URL = "https://www.kenbeautysalon.com";

// Booking/Appointment URLs
export const BOOKING_URL = "https://kenbeauty.zenoti.com/webstoreNew/services";

// Contact Information
export const CONTACT = {
  primaryPhone: "+971-50-304-3570",
  primaryMobile: "+971 503043570",
  email: "ken.beauty1@hotmail.com",
  whatsapp: {
    number: "971555570029", // Without + for wa.me links
    formatted: "+971 55 557 0029",
    message:
      "Hello KEN Beauty Center, I would like to know more about your services.",
    url: (message = null) => {
      const msg = message || CONTACT.whatsapp.message;
      return `https://wa.me/${
        CONTACT.whatsapp.number
      }?text=${encodeURIComponent(msg)}`;
    },
  },
};

// Social Media Links
export const SOCIAL_MEDIA = {
  instagram: {
    beauty: "https://www.instagram.com/ken_beauty_ad",
    barbershop: "https://www.instagram.com/ken_barbershop.ad",
    ghazarian: "https://www.instagram.com/ken_ghazarian/",
  },
  tiktok: {
    barbershop: "https://www.tiktok.com/@ken_barbershop.ad",
    beauty: "https://www.tiktok.com/@kenbeauty04",
  },
  twitter: "https://twitter.com/kenssalon",
};

// Social Media Handles (for display)
export const SOCIAL_HANDLES = {
  instagram: {
    beauty: "ken_beauty_ad",
    barbershop: "ken_barbershop.ad",
    ghazarian: "ken_ghazarian",
  },
  tiktok: {
    barbershop: "@ken_barbershop.ad",
    beauty: "@kenbeauty04",
  },
  twitter: "@kenssalon",
};

// Business Information
export const BUSINESS = {
  name: "Ken Beauty Salon",
  fullName: "Ken Beauty Salon | Beauty & Barber Services in Abu Dhabi",
  description:
    "Luxury beauty and barber services in Abu Dhabi including hair, nails, facials, and solarium treatments.",
  location: {
    city: "Abu Dhabi",
    country: "United Arab Emirates",
    countryCode: "AE",
  },
};

// Third-Party Services
export const THIRD_PARTY = {
  tidio: {
    scriptUrl: "//code.tidio.co/wuxjaut5j0iru5lnq6efealcjpqmlyhw.js",
  },
  instagram: {
    embedScript: "https://www.instagram.com/embed.js",
    lightwidget:
      "https://cdn.lightwidget.com/widgets/0df751793acd50a8a639c5a6d27cadeb.html",
  },
};

// Image URLs (for metadata, structured data, etc.)
export const IMAGES = {
  logo: `${BASE_URL}/logo01.png`,
  hero: `${BASE_URL}/hero04.jpg`,
  favicon: `${BASE_URL}/favicon.ico`,
};

// Helper function to get full URL
export const getFullUrl = (path) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}/${cleanPath}`;
};

// Helper function to get social media array for structured data
export const getSocialMediaArray = () => [
  SOCIAL_MEDIA.instagram.beauty,
  SOCIAL_MEDIA.instagram.barbershop,
  SOCIAL_MEDIA.tiktok.barbershop,
  SOCIAL_MEDIA.tiktok.beauty,
];
