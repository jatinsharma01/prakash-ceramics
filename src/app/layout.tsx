import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EnquiryProvider } from "@/context/EnquiryContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { UserAuthProvider } from "@/context/UserAuthContext";
import { EnquiryDrawer } from "@/components/EnquiryDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { AuthModal } from "@/components/AuthModal";
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

import { getPageSeoByPath } from "@/lib/serverDb";

export async function generateMetadata(): Promise<Metadata> {
  const homeSeo = await getPageSeoByPath("/");
  const title =
    homeSeo?.title ||
    "PRAKASH CERAMICS | Luxury Bathrooms, Sanitaryware & Wellness Solutions";
  const description =
    homeSeo?.description ||
    "Explore Prakash Ceramics' signature collection of premium architectural faucets, hydrotherapy showers, freestanding bathtubs, saunas, and luxury sanitaryware.";

  return {
    title,
    description,
    keywords: homeSeo?.keywords
      ? homeSeo.keywords.split(",").map((k) => k.trim())
      : [
          "Prakash Ceramics",
          "luxury bathroom",
          "sanitaryware",
          "faucets",
          "showers",
          "freestanding bathtubs",
          "saunas",
          "steam bath",
          "architectural fittings",
        ],
    authors: [{ name: "Prakash Ceramics" }],
    openGraph: {
      title,
      description,
      url: "https://prakashceramic.com",
      siteName: "Prakash Ceramics",
      images: [
        {
          url:
            homeSeo?.ogImage ||
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
          width: 1200,
          height: 630,
          alt: "Prakash Ceramics Luxury Bathroom Suite",
        },
      ],
      locale: "en_IN",
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} light scroll-smooth`}>
      <body className="min-h-screen bg-[#fbf9f7] text-[#1c1815] flex flex-col antialiased selection:bg-[#F2ECE7] selection:text-[#1c1815]">
        <ScrollProgressBar />
        <UserAuthProvider>
          <WishlistProvider>
            <EnquiryProvider>
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <EnquiryDrawer />
              <WishlistDrawer />
              <AuthModal />
              <Footer />
            </EnquiryProvider>
          </WishlistProvider>
        </UserAuthProvider>
      </body>
    </html>
  );
}

