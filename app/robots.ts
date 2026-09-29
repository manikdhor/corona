import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { adminStore } from "@/lib/admin/seed";

export default function robots(): MetadataRoute.Robots {
  const settings = adminStore.getSettings();
  const allowIndex = settings?.seo?.robotsIndex !== false;

  return {
    rules: {
      userAgent: "*",
      allow: allowIndex ? "/" : "",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
