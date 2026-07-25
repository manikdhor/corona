import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TopBar from "@/components/layout/TopBar";
import Preloader from "@/components/layout/Preloader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { SITE_CONFIG } from "@/lib/constants";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.shortName}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "land for sale Bangladesh",
    "residential plots Dhaka",
    "Corona Properties",
    "premium land Bangladesh",
    "Gulshan plots",
    "Banani land",
    "real estate Bangladesh",
    "RAJUK approved plots",
  ],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.logo,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.logo],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: SITE_CONFIG.logo,
    apple: SITE_CONFIG.logo,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <Preloader />
        <ScrollProgress />
        <TopBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ScrollToTop />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: SITE_CONFIG.name,
              description: SITE_CONFIG.description,
              url: SITE_CONFIG.url,
              logo: SITE_CONFIG.logo,
              telephone: "+8801805759297",
              email: "info@coronaproperties.com",
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "House # 145, Flat # 704, Road # 3, Block A, Niketon, Gulshan 01",
                addressLocality: "Dhaka",
                postalCode: "1212",
                addressCountry: "BD",
              },
              areaServed: "Bangladesh",
            }),
          }}
        />
      </body>
    </html>
  );
}
