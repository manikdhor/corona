"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Preloader from "./Preloader";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { SITE_CONFIG } from "@/lib/constants";
import { getCustomScriptsAction, getSettingsAction } from "@/lib/admin/actions";
import { CustomScript } from "@/lib/admin/seed";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const [activeScripts, setActiveScripts] = useState<CustomScript[]>([]);
  const [jsonLd, setJsonLd] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminRoute) {
      getCustomScriptsAction().then((scripts) => {
        setActiveScripts(scripts.filter((s) => s.isActive));
      });
      getSettingsAction().then((settings) => {
        if (settings?.seo?.jsonLdSchema) {
          setJsonLd(settings.seo.jsonLdSchema);
        }
      });
    }
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  const headScripts = activeScripts.filter((s) => s.placement === "head");
  const bodyScripts = activeScripts.filter((s) => s.placement === "body_end");

  return (
    <>
      {/* Injected Head Custom Scripts from Admin CMS */}
      {headScripts.map((s) => (
        <div
          key={s.id}
          dangerouslySetInnerHTML={{ __html: s.code }}
          className="hidden custom-script-head"
        />
      ))}

      <Preloader />
      <ScrollProgress />
      <TopBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
      <BottomNav />

      {/* Injected Body Custom Scripts from Admin CMS */}
      {bodyScripts.map((s) => (
        <div
          key={s.id}
          dangerouslySetInnerHTML={{ __html: s.code }}
          className="hidden custom-script-body"
        />
      ))}

      {/* JSON-LD Structured Data for Public Site */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            jsonLd ||
            JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: SITE_CONFIG.name,
              description: SITE_CONFIG.description,
              url: SITE_CONFIG.url,
              logo: SITE_CONFIG.logo,
              telephone: "+8801805759297",
              email: "cplcoronapropertiesltd@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "House # 145, Flat # 704, Road # 3, Block A, Niketon, Gulshan 01",
                addressLocality: "Dhaka",
                postalCode: "1212",
                addressCountry: "BD",
              },
              areaServed: "Bangladesh",
            }),
        }}
      />
    </>
  );
}
