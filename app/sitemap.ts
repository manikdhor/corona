import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { PROPERTIES, BLOG_POSTS } from "@/lib/data";
import { PROJECTS } from "@/lib/projects";
import { adminStore } from "@/lib/admin/seed";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/team`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/corona-group`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  // Dynamic properties from admin store
  const allProperties = adminStore.getProperties();
  const propertyPages: MetadataRoute.Sitemap = (
    allProperties.length > 0 ? allProperties : PROPERTIES
  )
    .filter((p: any) => !p.approvalStatus || p.approvalStatus === "Published")
    .map((p: any) => ({
      url: `${baseUrl}/properties/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  // Dynamic projects
  const projectPages: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic blog posts from admin store
  const allBlogPosts = adminStore.getBlogPosts();
  const blogPages: MetadataRoute.Sitemap = (
    allBlogPosts.length > 0 ? allBlogPosts : (BLOG_POSTS as any[])
  )
    .filter((p: any) => p.status === "Published")
    .map((p: any) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  // Dynamic CMS pages (privacy, terms, refund, disclaimer, etc.)
  const allPages = adminStore.getPages();
  const cmsPages: MetadataRoute.Sitemap = allPages
    .filter((p) => p.isPublished !== false)
    .map((p) => ({
      url: `${baseUrl}/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    }));

  return [...staticPages, ...projectPages, ...propertyPages, ...blogPages, ...cmsPages];
}
