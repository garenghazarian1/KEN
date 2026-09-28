import {
  Inter,
  Abril_Fatface,
  Sevillana,
  Bad_Script,
  PT_Sans_Narrow,
  Great_Vibes,
  Lora,
} from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
export const abril = Abril_Fatface({ subsets: ["latin"], weight: "400" });
export const sevillana = Sevillana({ subsets: ["latin"], weight: "400" });
export const bad = Bad_Script({ subsets: ["latin"], weight: "400" });
export const pt = PT_Sans_Narrow({ subsets: ["latin"], weight: "400" });
export const gv = Great_Vibes({ subsets: ["latin"], weight: "400" });
export const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-lora",
});
