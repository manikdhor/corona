import type { LucideIcon } from "lucide-react";

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface PlotType {
  label: string;
  badge?: string | null;
  size: string;
  katha: number;
  priceNote?: string | null;
}

export interface ProjectAssets {
  layoutPlan: string;
  brochure: string;
  brochureLabel?: string;
  brochureFile?: string;
  mapHref?: string;
  mapCoordinates?: { lat: number; lng: number };
}

export interface ProjectSpec {
  label: string;
  value: string;
  icon?: string | null;
}

export interface ProjectSectionHeadings {
  overviewTitle?: string;
  keyAssetsEyebrow?: string;
  keyAssetsTitle?: string;
  keyAssetsSubtitle?: string;
  highlightsTitle?: string;
  featuresTitle?: string;
  amenitiesEyebrow?: string;
  amenitiesTitle?: string;
  amenitiesSubtitle?: string;
  plotPortfolioTitle?: string;
  plotPortfolioSubtitle?: string;
  storyTitle?: string;
  storySubtitle?: string;
  contactTitle?: string;
  contactSubtitle?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactCtaText?: string;
  contactCtaHref?: string;
  locationTitle?: string;
  similarProjectsEyebrow?: string;
  similarProjectsTitle?: string;
  similarProjectsSubtitle?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  taglineBn: string;
  subtitle: string;
  heroImage: string;
  overview: string;
  genesis: string;
  location: string;
  coordinates: { lat: number; lng: number };
  totalPlots: number;
  totalArea: string;
  roadPrimary: string;
  roadSecondary: string;
  plotTypes: PlotType[];
  amenities: Amenity[];
  highlights: string[];
  features: string[];
  status: "launching" | "available" | "almost-sold" | "completed";
  isFlagship: boolean;
  gallery: string[];
  specs: ProjectSpec[];
  seo: {
    title: string;
    description: string;
  };
  assets: ProjectAssets;
  sectionHeadings?: ProjectSectionHeadings;
}

export const PROJECTS: Project[] = [
  {
    id: "maple-leaf-garden-city",
    slug: "maple-leaf-garden-city",
    name: "Maple Leaf Garden City",
    tagline: "Where Maple Canopy Meets Bangladeshi Aspiration",
    taglineBn: "কানাডার স্বপ্ন, বাংলাদেশের মাটিতে",
    subtitle:
      "A master-planned residential enclave of 2,504 premium plots in Purbachal — inspired by Toronto's finest urban living.",
    heroImage: "/image-06.webp",
    overview:
      "Maple Leaf Garden City is a meticulously master-planned residential enclave in Purbachal, Dhaka. Conceived by visionary Bangladeshi expatriates inspired by the serenity and architectural discipline of Toronto's planned neighbourhoods, this community brings international-grade living to Bangladesh's most ambitious new town. Here, wide tree-lined boulevards, luxury leisure amenities, and a gated community converge beneath a canopy of mature maple trees.",
    genesis:
      "The idea was born from a simple question: 'Can families in Bangladesh experience the same quality of life we found abroad?' That conviction transformed into a mission — to build something that does not yet exist here. A place where the discipline of planned urbanism meets the warmth of Bangladeshi community life.",
    location: "Purbachal, Dhaka — Bholabo Union",
    coordinates: { lat: 23.86489, lng: 90.56470 },
    totalPlots: 2504,
    totalArea: "Approximately 90 Acres",
    roadPrimary: "80 ft Wide Arterial Roads",
    roadSecondary: "40 ft Wide Access Roads",
    status: "available",
    isFlagship: true,
    gallery: [
      "/image-02.webp",
      "/image-03.webp",
      "/image-04.webp",
      "/image-05.webp",
      "/image-07.webp",
    ],
    plotTypes: [
      { label: "3 Katha Plot", badge: "Entry Luxury", size: "1,800 sq ft", katha: 3 },
      { label: "5 Katha Plot", badge: "Most Popular", size: "3,600 sq ft", katha: 5 },
      { label: "10 Katha Plot", badge: "Premium Choice", size: "7,200 sq ft", katha: 10 },
      { label: "20 Katha Plot", badge: "Luxury Estate", size: "14,400 sq ft", katha: 20 },
      { label: "20+ Katha Plot", badge: "Custom Plot", size: "Custom Size", katha: 21 },
    ],
    amenities: [
      { id: "hospital", name: "Central Hospital", icon: "HeartPulse", description: "24/7 multispecialty hospital with emergency care" },
      { id: "mosque", name: "Grand Community Mosque", icon: "Landmark", description: "Handcrafted architecture for 200+ worshippers" },
      { id: "sports", name: "Indoor Sports Complex", icon: "Trophy", description: "Badminton, table tennis, and squash courts" },
      { id: "lake", name: "Signature Lake & Waterbody", icon: "Waves", description: "3-acre landscaped lagoon with promenade" },
      { id: "playground", name: "Children's Playgrounds", icon: "Trees", description: "Age-segregated, secured play zones" },
      { id: "commercial", name: "Premium Commercial High Street", icon: "Store", description: "Retail, café, and F&B corridor" },
      { id: "utilities", name: "Underground Utility Network", icon: "Zap", description: "Clean skyline with no overhead wires" },
      { id: "security", name: "Gated Perimeter & Smart Surveillance", icon: "ShieldCheck", description: "Biometric access points and 24/7 patrols" },
      { id: "fuel", name: "24/7 Fuel Station", icon: "Fuel", description: "CNG and Petrol station inside the community" },
      { id: "fitness", name: "Fitness & Lounge Facilities", icon: "Dumbbell", description: "Premium gymnasium and co-working spaces" },
    ],
    highlights: [
      "Master layout with complete documentation",
      "80 ft and 40 ft wide roads ensuring smooth circulation",
      "Gated perimeter with 24/7 security and smart surveillance",
      "Continuous maple tree canopy along pedestrian walkways",
      "Underground utility corridors for a clean skyline",
      "Strategically located at Purbachal's growth nexus",
    ],
    features: [
      "Over 2,504 individually titled residential plots",
      "Wide tree-lined boulevards with pedestrian walkways",
      "Underground electricity and city-gas connectivity",
      "Modern sewage treatment and drainage system",
      "Designated green belts, parklands, and open spaces",
      "Community cemetery with dignified landscaping",
    ],
    specs: [
      { label: "Total Plots", value: "2,504" },
      { label: "Total Area", value: "~90 Acres" },
      { label: "Planning Authority", value: "Approved" },
      { label: "Arterial Roads", value: "80 ft / 40 ft" },
    ],
    seo: {
      title: "Maple Leaf Garden City — Premium Residential Plots in Purbachal, Dhaka",
      description:
        "Discover Maple Leaf Garden City, a master-planned residential community of 2,504 premium plots in Purbachal, Dhaka. Approved with world-class amenities.",
    },
    assets: {
      layoutPlan: "/Layout-Plan.pdf",
      brochure: "/brochure-maple-leaf.pdf",
      brochureLabel: "Project Brochure",
      brochureFile: "/brochure-maple-leaf.pdf",
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getActiveProject(): Project {
  const flagship = PROJECTS.find((p) => p.isFlagship);
  if (flagship) return flagship;
  return PROJECTS[0];
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.isFlagship || p.status === "available");
}

export function getRelatedProjects(currentId: string, limit = 3): Project[] {
  return PROJECTS.filter((p) => p.id !== currentId && p.slug !== currentId).slice(0, limit);
}

export function mapAdminPropertyToProject(
  p: {
    id: string;
    slug: string;
    title: string;
    titleBn?: string | null;
    tagline?: string | null;
    taglineBn?: string | null;
    location: string;
    price?: string;
    type?: string;
    status?: string;
    size?: string;
    featuredImage?: string;
    gallery?: string[];
    overview?: string;
    genesis?: string | null;
    highlights?: string[];
    features?: string[];
    specs?: { label: string; value: string; icon?: string | null }[];
    plotTypes?: { label: string; badge?: string | null; size: string; katha: number; priceNote?: string | null }[];
    totalPlots?: number | null;
    totalArea?: string | null;
    roadPrimary?: string | null;
    roadSecondary?: string | null;
    coordinates?: { lat: number; lng: number };
    isFlagship?: boolean;
    isFeatured?: boolean;
    customFieldValues?: Record<string, any>;
  },
  baseProj?: Project
): Project {
  const normStatus = (p.status?.toLowerCase().replace(/\s+/g, "-") || "") as Project["status"];
  const validStatus: Project["status"] = ["launching", "available", "almost-sold", "completed"].includes(normStatus)
    ? normStatus
    : (baseProj?.status || "available");

  const customFields = p.customFieldValues || {};

  // Dynamic Amenities (priority: p.customFieldValues.amenities -> baseProj.amenities -> fallback empty)
  const customAmenities =
    Array.isArray(customFields.amenities) && customFields.amenities.length > 0
      ? customFields.amenities
      : baseProj?.amenities || [];

  // Dynamic Assets (priority: p.customFieldValues.assets -> baseProj.assets -> default paths)
  const customAssets: ProjectAssets = {
    layoutPlan: customFields.assets?.layoutPlan || baseProj?.assets?.layoutPlan || "/Layout-Plan.pdf",
    brochure: customFields.assets?.brochure || baseProj?.assets?.brochure || "/brochure-maple-leaf.pdf",
    brochureLabel: customFields.assets?.brochureLabel || baseProj?.assets?.brochureLabel || "Project Brochure",
    brochureFile: customFields.assets?.brochureFile || baseProj?.assets?.brochureFile || "/brochure-maple-leaf.pdf",
    mapHref: customFields.assets?.mapHref || baseProj?.assets?.mapHref,
    mapCoordinates: customFields.assets?.mapCoordinates || p.coordinates || baseProj?.coordinates,
  };

  // Dynamic Headings & Copy
  const customHeadings: ProjectSectionHeadings = {
    overviewTitle: customFields.sectionHeadings?.overviewTitle || baseProj?.sectionHeadings?.overviewTitle || "Overview",
    keyAssetsEyebrow: customFields.sectionHeadings?.keyAssetsEyebrow || baseProj?.sectionHeadings?.keyAssetsEyebrow || "Project Assets",
    keyAssetsTitle: customFields.sectionHeadings?.keyAssetsTitle || baseProj?.sectionHeadings?.keyAssetsTitle || "Key Documents & Maps",
    keyAssetsSubtitle: customFields.sectionHeadings?.keyAssetsSubtitle || baseProj?.sectionHeadings?.keyAssetsSubtitle || "Download or view essential project documents for your reference.",
    highlightsTitle: customFields.sectionHeadings?.highlightsTitle || baseProj?.sectionHeadings?.highlightsTitle || "Highlights",
    featuresTitle: customFields.sectionHeadings?.featuresTitle || baseProj?.sectionHeadings?.featuresTitle || "Key Features",
    amenitiesEyebrow: customFields.sectionHeadings?.amenitiesEyebrow || baseProj?.sectionHeadings?.amenitiesEyebrow || "World-Class Amenities",
    amenitiesTitle: customFields.sectionHeadings?.amenitiesTitle || baseProj?.sectionHeadings?.amenitiesTitle || "Everything You Need",
    amenitiesSubtitle: customFields.sectionHeadings?.amenitiesSubtitle || baseProj?.sectionHeadings?.amenitiesSubtitle || "A community is defined by what it offers its residents.",
    plotPortfolioTitle: customFields.sectionHeadings?.plotPortfolioTitle || baseProj?.sectionHeadings?.plotPortfolioTitle || "Plot Portfolio",
    plotPortfolioSubtitle: customFields.sectionHeadings?.plotPortfolioSubtitle || baseProj?.sectionHeadings?.plotPortfolioSubtitle || "Explore our range of premium residential and commercial plot sizes",
    storyTitle: customFields.sectionHeadings?.storyTitle || baseProj?.sectionHeadings?.storyTitle || `The Story Behind ${p.title || baseProj?.name || "Project"}`,
    storySubtitle: customFields.sectionHeadings?.storySubtitle || baseProj?.sectionHeadings?.storySubtitle,
    contactTitle: customFields.sectionHeadings?.contactTitle || baseProj?.sectionHeadings?.contactTitle || "Interested in this project?",
    contactSubtitle: customFields.sectionHeadings?.contactSubtitle || baseProj?.sectionHeadings?.contactSubtitle || "Book a site visit or request a callback. Our team responds within 24 hours.",
    contactPhone: customFields.sectionHeadings?.contactPhone || baseProj?.sectionHeadings?.contactPhone,
    contactEmail: customFields.sectionHeadings?.contactEmail || baseProj?.sectionHeadings?.contactEmail,
    contactCtaText: customFields.sectionHeadings?.contactCtaText || baseProj?.sectionHeadings?.contactCtaText || "Book Site Visit",
    contactCtaHref: customFields.sectionHeadings?.contactCtaHref || baseProj?.sectionHeadings?.contactCtaHref || "/contact",
    locationTitle: customFields.sectionHeadings?.locationTitle || baseProj?.sectionHeadings?.locationTitle || "Location",
    similarProjectsEyebrow: customFields.sectionHeadings?.similarProjectsEyebrow || baseProj?.sectionHeadings?.similarProjectsEyebrow || "You May Also Explore",
    similarProjectsTitle: customFields.sectionHeadings?.similarProjectsTitle || baseProj?.sectionHeadings?.similarProjectsTitle || "Similar Projects",
    similarProjectsSubtitle: customFields.sectionHeadings?.similarProjectsSubtitle || baseProj?.sectionHeadings?.similarProjectsSubtitle,
  };

  // Dynamic Plot Types
  const dynamicPlotTypes =
    Array.isArray(p.plotTypes) && p.plotTypes.length > 0
      ? p.plotTypes
      : baseProj?.plotTypes || [
          { label: "3 Katha Plot", badge: "Entry Luxury", size: "1,800 sq ft", katha: 3 },
          { label: "5 Katha Plot", badge: "Most Popular", size: "3,600 sq ft", katha: 5 },
          { label: "10 Katha Plot", badge: "Premium Choice", size: "7,200 sq ft", katha: 10 },
        ];

  // Dynamic Specs & Stats
  const dynamicSpecs =
    Array.isArray(p.specs) && p.specs.length > 0
      ? p.specs
      : baseProj?.specs || [
          { label: "Total Plots", value: String(p.totalPlots || 2504) },
          { label: "Location", value: p.location || "Dhaka" },
          { label: "Plot Size", value: p.size || "3 - 10 Katha" },
          { label: "Price", value: p.price || "Contact for Price" },
        ];

  // Dynamic Highlights
  const dynamicHighlights =
    Array.isArray(p.highlights) && p.highlights.length > 0
      ? p.highlights
      : baseProj?.highlights || [];

  // Dynamic Features
  const dynamicFeatures =
    Array.isArray(p.features) && p.features.length > 0
      ? p.features
      : baseProj?.features || [];

  // Dynamic Gallery
  const dynamicGallery =
    Array.isArray(p.gallery) && p.gallery.length > 0
      ? p.gallery
      : baseProj?.gallery || [p.featuredImage || "/image-01.webp"];

  return {
    id: p.id || baseProj?.id || p.slug,
    slug: p.slug,
    name: p.title || baseProj?.name || "Project",
    tagline: p.tagline || baseProj?.tagline || "",
    taglineBn: p.taglineBn || baseProj?.taglineBn || p.tagline || "",
    subtitle: p.tagline || baseProj?.subtitle || p.location || "",
    heroImage: p.featuredImage || baseProj?.heroImage || "/image-01.webp",
    overview: p.overview !== undefined && p.overview !== null && p.overview !== "" ? p.overview : (baseProj?.overview || ""),
    genesis: p.genesis !== undefined && p.genesis !== null && p.genesis !== "" ? p.genesis : (baseProj?.genesis || ""),
    location: p.location || baseProj?.location || "Dhaka, Bangladesh",
    coordinates: p.coordinates || baseProj?.coordinates || { lat: 23.86489, lng: 90.5647 },
    totalPlots: p.totalPlots ?? baseProj?.totalPlots ?? 100,
    totalArea: p.totalArea || baseProj?.totalArea || p.size || "10 Acres",
    roadPrimary: p.roadPrimary || baseProj?.roadPrimary || "60 ft Wide",
    roadSecondary: p.roadSecondary || baseProj?.roadSecondary || "30 ft Wide",
    plotTypes: dynamicPlotTypes,
    amenities: customAmenities,
    highlights: dynamicHighlights,
    features: dynamicFeatures,
    status: validStatus,
    isFlagship: p.isFlagship ?? baseProj?.isFlagship ?? false,
    gallery: dynamicGallery,
    specs: dynamicSpecs,
    seo: {
      title: `${p.title || baseProj?.name} | Corona Properties`,
      description: p.overview || baseProj?.overview || p.title || "",
    },
    assets: customAssets,
    sectionHeadings: customHeadings,
  };
}

