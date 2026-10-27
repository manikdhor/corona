import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";
import SiteChrome from "@/components/layout/SiteChrome";
import {
  getSettingsAction,
  getNavigationAction,
  getSocialLinksAction,
  getCustomScriptsAction,
} from "@/lib/admin/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700", "900"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsAction().catch(() => null);
  const company = settings?.company;
  const name = company?.name || SITE_CONFIG.name;
  const shortName = company?.shortName || SITE_CONFIG.shortName;
  const tagline = company?.tagline || SITE_CONFIG.tagline;
  const description = company?.description || SITE_CONFIG.description;
  const logo = company?.logo || SITE_CONFIG.logo;
  const favicon = company?.favicon || "/favicon.ico";

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: `${name} | ${tagline}`,
      template: `%s | ${shortName}`,
    },
    description,
    keywords: [
      "land for sale Bangladesh",
      "residential plots Dhaka",
      "Corona Properties",
      "premium land Bangladesh",
      "Gulshan plots",
      "Banani land",
      "real estate Bangladesh",
    ],
    authors: [{ name }],
    creator: name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_CONFIG.url,
      title: `${name} | ${tagline}`,
      description,
      siteName: name,
      images: [
        {
          url: logo,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${tagline}`,
      description,
      images: [logo],
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
      icon: favicon || logo,
      apple: logo,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, navigation, socialLinks, customScripts] = await Promise.all([
    getSettingsAction().catch(() => null),
    getNavigationAction().catch(() => null),
    getSocialLinksAction().catch(() => []),
    getCustomScriptsAction().catch(() => []),
  ]);

  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <SiteChrome
          initialSettings={settings}
          initialNavigation={navigation}
          initialSocialLinks={socialLinks}
          initialCustomScripts={customScripts}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
