import Hero from "@/components/hero/Hero";

// Define metadata for the page
export const metadata = {
  title: "Ken Salon",
  description: "Welcome to Ken Salon",
  icons: {
    icon: "/favicon.ico", // Specify the favicon path
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
