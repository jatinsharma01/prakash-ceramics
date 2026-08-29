import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EnquiryProvider } from "@/context/EnquiryContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { EnquiryDrawer } from "@/components/EnquiryDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { ScrollProgressBar } from "@/components/MotionWrappers";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PARKASH CERAMICS | Luxury Bathrooms, Sanitaryware & Wellness Solutions",
  description: "Explore Parkash Ceramics' signature collection of premium architectural faucets, hydrotherapy showers, freestanding bathtubs, saunas, and luxury sanitaryware.",
  keywords: ["Parkash Ceramics", "luxury bathroom", "sanitaryware", "faucets", "showers", "freestanding bathtubs", "saunas", "steam bath", "architectural fittings"],
  authors: [{ name: "Parkash Ceramics" }],
  openGraph: {
    title: "PARKASH CERAMICS | Luxury Sanitaryware & Bath Fittings",
    description: "Crafting architectural bathroom spaces with world-class engineering, Swiss cartridges, and bespoke luxury finishes.",
    url: "https://parkashceramics.com",
    siteName: "Parkash Ceramics",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Parkash Ceramics Luxury Bathroom Suite",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} light scroll-smooth`}>
      <body className="min-h-screen bg-[#fbf9f7] text-[#1c1815] flex flex-col antialiased selection:bg-[#F2ECE7] selection:text-[#1c1815]">
        <ScrollProgressBar />
        <WishlistProvider>
          <EnquiryProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <EnquiryDrawer />
            <WishlistDrawer />
            <Footer />
          </EnquiryProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
