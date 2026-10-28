"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Preloader from "./Preloader";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import ScrollProgress from "@/components/ui/ScrollProgress";
import RouteProgressBar from "@/components/ui/RouteProgressBar";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { SITE_CONFIG } from "@/lib/constants";
import { getCustomScriptsAction, getSettingsAction } from "@/lib/admin/actions";
import { CustomScript } from "@/lib/admin/seed";

interface SiteChromeProps {
  children: React.ReactNode;
  initialSettings?: any;
  initialNavigation?: any;
  initialSocialLinks?: any[];
  initialCustomScripts?: CustomScript[];
}

export default function SiteChrome({
  children,
  initialSettings,
  initialNavigation,
  initialSocialLinks,
  initialCustomScripts,
}: SiteChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const [activeScripts, setActiveScripts] = useState<CustomScript[]>(
    initialCustomScripts?.filter((s) => s.isActive) || []
  );
  const [settings, setSettings] = useState<any>(initialSettings || null);
  const [jsonLd, setJsonLd] = useState<string | null>(
    initialSettings?.seo?.jsonLdSchema || null
  );

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
      if (initialSettings?.seo?.jsonLdSchema) {
        setJsonLd(initialSettings.seo.jsonLdSchema);
      }
    }
  }, [initialSettings]);

  useEffect(() => {
    if (initialCustomScripts) {
      setActiveScripts(initialCustomScripts.filter((s) => s.isActive));
    }
  }, [initialCustomScripts]);

  useEffect(() => {
    if (!isAdminRoute) {
      if (!initialCustomScripts) {
        getCustomScriptsAction().then((scripts) => {
          setActiveScripts(scripts.filter((s) => s.isActive));
        });
      }
      if (!initialSettings) {
        getSettingsAction().then((s) => {
          if (s) {
            setSettings(s);
            if (s?.seo?.jsonLdSchema) {
              setJsonLd(s.seo.jsonLdSchema);
            }
          }
        });
      }
    }
  }, [isAdminRoute, initialCustomScripts, initialSettings]);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  const headScripts = activeScripts.filter((s) => s.placement === "head");
  const bodyScripts = activeScripts.filter((s) => s.placement === "body_end");
  const company = settings?.company;

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

      <Preloader logo={company?.logo} name={company?.name} />
      <RouteProgressBar />
      <ScrollProgress />
      <TopBar initialCompany={company} initialSocials={initialSocialLinks} />
      <Navbar initialCompany={company} initialNavigation={initialNavigation} />
      <main>{children}</main>
      <Footer
        initialCompany={company}
        initialNavigation={initialNavigation}
        initialSocials={initialSocialLinks}
      />
      <ScrollToTop />
      <BottomNav
        initialNavLinks={initialNavigation?.header}
        initialPhone={company?.phone}
      />

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
              name: company?.name || SITE_CONFIG.name,
              description: company?.description || SITE_CONFIG.description,
              url: SITE_CONFIG.url,
              logo: company?.logo || SITE_CONFIG.logo,
              telephone: company?.phone || "+8801805759297",
              email: company?.email || "info@coronapropertiesltd.com",
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  company?.address ||
                  "Mar Garden, House #145, Flat #704, Road #3, Block A, Niketan, Gulshan 01",
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
