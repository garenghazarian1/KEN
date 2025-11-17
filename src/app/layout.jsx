import { lora, inter } from "@/app/ui/fonts";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import styles from "./Layout.module.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  metadataBase: new URL("https://www.kenbeautysalon.com"),
  title: {
    default: "Ken Beauty Salon | Beauty & Barber Services in Abu Dhabi",
    template: "%s | Ken Beauty Salon",
  },
  description:
    "Luxury beauty and barber services in Abu Dhabi including hair, nails, facials, and solarium treatments.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ken Beauty Salon | Beauty & Barber Services in Abu Dhabi",
    description:
      "Luxury beauty and barber services in Abu Dhabi including hair, nails, facials, and solarium treatments.",
    url: "/",
    siteName: "Ken Beauty Salon",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ken Beauty Salon | Beauty & Barber Services in Abu Dhabi",
    description:
      "Luxury beauty and barber services in Abu Dhabi including hair, nails, facials, and solarium treatments.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className}, ${lora.className} `}>
      <body>
        <div className={styles.layoutContainer}>
          <Navbar />
          <div className={styles.childrenContainer}>{children}</div>
          <Footer />
        </div>
        <Analytics />
        <script
          src="//code.tidio.co/wuxjaut5j0iru5lnq6efealcjpqmlyhw.js"
          async
        ></script>
      </body>
    </html>
  );
}
