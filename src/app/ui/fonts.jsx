import { Inter, Lora } from "next/font/google";

/** Buttons, eyebrow, and body. One variable file. */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-inter",
  preload: true,
});

/** Hero H1 roman. Italic is a second file and is not preloaded. */
export const lora = Lora({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-lora",
  preload: true,
});

export const loraItalic = Lora({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-lora-italic",
  preload: false,
});
