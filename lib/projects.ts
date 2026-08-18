import type { LucideIcon } from "lucide-react";

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface PlotType {
  label: string;
  badge?: string;
  size: string;
  katha: number;
}

export interface ProjectAssets {
  layoutPlan: string;
  brochure: string;
  brochureLabel?: string;
  brochureFile?: string;
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
  specs: { label: string; value: string }[];
  seo: {
    title: string;
    description: string;
  };
  assets: ProjectAssets;
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
  return PROJECTS.filter((p) => p.id !== currentId).slice(0, limit);
}
