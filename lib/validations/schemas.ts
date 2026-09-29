import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  titleBn: z.string().optional().nullable(),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  tagline: z.string().optional().nullable(),
  taglineBn: z.string().optional().nullable(),
  location: z.string().min(2, "Location is required"),
  area: z.string().min(2, "Area is required"),
  price: z.string().min(2, "Display price is required"),
  priceValue: z.number().min(0, "Numeric price must be positive"),
  type: z.enum(["Exclusive", "Premium", "Standard", "Investment"]),
  status: z.enum(["Available", "New Launch", "Almost Sold Out", "Featured", "Sold Out"]),
  approvalStatus: z.enum(["Draft", "Pending Review", "Published", "Archived"]).default("Published"),
  size: z.string().min(1, "Size is required"),
  featuredImage: z.string().min(1, "Featured image is required"),
  gallery: z.array(z.string()).default([]),
  overview: z.string().optional().nullable(),
  overviewBn: z.string().optional().nullable(),
  genesis: z.string().optional().nullable(),
  highlights: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  specs: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      icon: z.string().optional().nullable(),
    })
  ).default([]),
  plotTypes: z.array(
    z.object({
      label: z.string(),
      badge: z.string().optional().nullable(),
      size: z.string(),
      katha: z.coerce.number(),
      priceNote: z.string().optional().nullable(),
    })
  ).default([]),
  totalPlots: z.number().optional().nullable(),
  totalArea: z.string().optional().nullable(),
  roadPrimary: z.string().optional().nullable(),
  roadSecondary: z.string().optional().nullable(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).default({ lat: 23.86489, lng: 90.5647 }),
  isFlagship: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  assignedAgentId: z.string().optional().nullable(),
  customFieldValues: z.record(z.string(), z.any()).default({}),
});

export const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Valid phone number is required"),
  source: z.string().default("Website Form"),
  propertyId: z.string().optional().nullable(),
  propertyTitle: z.string().optional().nullable(),
  stageId: z.string().min(1, "Stage is required"),
  assignedAgentId: z.string().optional().nullable(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).default("Medium"),
  budget: z.string().optional().nullable(),
  preferredLocation: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  score: z.number().min(0).max(100).default(50),
  tags: z.array(z.string()).default([]),
  nextFollowUp: z.string().optional().nullable(),
});

export const agentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Valid phone number is required"),
  role: z.string().default("Senior Property Consultant"),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const seoMetaSchema = z.object({
  entityType: z.string(),
  entityId: z.string(),
  metaTitle: z.string().max(70, "Meta title recommended under 70 chars").optional().nullable(),
  metaDescription: z.string().max(160, "Meta description recommended under 160 chars").optional().nullable(),
  canonicalUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  ogTitle: z.string().optional().nullable(),
  ogDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  twitterCard: z.enum(["summary", "summary_large_image"]).default("summary_large_image"),
  focusKeyword: z.string().optional().nullable(),
  robotsIndex: z.boolean().default(true),
  robotsFollow: z.boolean().default(true),
  customJsonLd: z.string().optional().nullable(),
});

export const redirectSchema = z.object({
  sourcePath: z.string().min(1, "Source path required").startsWith("/", "Must start with /"),
  targetPath: z.string().min(1, "Target path required"),
  statusCode: z.number().refine((v) => [301, 302, 307, 308].includes(v), "Status code must be 301, 302, 307, or 308").default(301),
  isActive: z.boolean().default(true),
});

export const customScriptSchema = z.object({
  name: z.string().min(2, "Name required"),
  placement: z.enum(["head", "body_end"]),
  code: z.string().min(5, "Script code required"),
  isActive: z.boolean().default(true),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform name required"),
  label: z.string().min(1, "Label required"),
  url: z.string().url("Must be a valid URL or tel/mailto link").or(z.string().startsWith("tel:")).or(z.string().startsWith("mailto:")),
  iconName: z.string().optional().nullable(),
  customSvgId: z.string().optional().nullable(),
  openNewTab: z.boolean().default(true),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export const customIconSchema = z.object({
  name: z.string().min(2, "Icon name required"),
  svgContent: z.string().min(10, "Valid SVG required"),
  category: z.string().default("Custom"),
});

export const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  titleBn: z.string().optional().nullable(),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  excerptBn: z.string().optional().nullable(),
  content: z.string().min(20, "Content must be at least 20 characters"),
  contentBn: z.string().optional().nullable(),
  category: z.string().min(2, "Category is required"),
  author: z.string().min(2, "Author is required"),
  authorRole: z.string().default("Editorial Team"),
  image: z.string().min(1, "Featured image is required"),
  readTime: z.string().default("5 min read"),
  status: z.enum(["Draft", "Published", "Archived"]).default("Published"),
  publishedAt: z.string().optional().nullable(),
});

export const teamMemberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  role: z.string().min(2, "Role is required"),
  bio: z.string().min(10, "Bio message must be at least 10 characters"),
  image: z.string().min(1, "Portrait image is required"),
  sortOrder: z.number().default(0),
});

export const testimonialSchema = z.object({
  name: z.string().min(2, "Name is required"),
  role: z.string().min(2, "Role or location is required"),
  quote: z.string().min(10, "Quote must be at least 10 characters"),
  rating: z.number().min(1).max(5).default(5),
  image: z.string().min(1, "Avatar image is required"),
  isActive: z.boolean().default(true),
});

export const serviceSchema = z.object({
  title: z.string().min(3, "Title is required"),
  iconName: z.string().default("Building2"),
  description: z.string().min(10, "Description is required"),
  features: z.array(z.string()).default([]),
  sortOrder: z.number().default(0),
});

export const faqSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
  category: z.string().default("General"),
  sortOrder: z.number().default(0),
});

export const pageSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  content: z.string().default(""),
  isPublished: z.boolean().default(true),
  lastUpdated: z.string().optional().nullable(),
});

