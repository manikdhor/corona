import {
  PROPERTIES,
  Property as LibProperty,
  BLOG_POSTS,
  TEAM,
  TESTIMONIALS,
  SERVICES,
  SISTER_CONCERNS,
  GROUP_STATS,
  VISION_MISSION,
  OFFICE_LOCATIONS,
  GALLERY_IMAGES,
} from "@/lib/data";
import { PROJECTS } from "@/lib/projects";
import {
  NAV_LINKS,
  FOOTER_LINKS,
  NAV_CATEGORIES,
  SITE_CONFIG,
  CONTACT_INFO,
} from "@/lib/constants";


export interface AdminProperty {
  id: string;
  slug: string;
  title: string;
  titleBn?: string | null;
  tagline?: string | null;
  taglineBn?: string | null;
  location: string;
  area: string;
  price: string;
  priceValue: number;
  type: string;
  status: string;
  approvalStatus: "Draft" | "Pending Review" | "Published" | "Archived";
  size: string;
  featuredImage: string;
  gallery: string[];
  overview: string;
  overviewBn?: string | null;
  genesis?: string | null;
  highlights: string[];
  features: string[];
  specs: { label: string; value: string; icon?: string | null }[];
  plotTypes: { label: string; badge?: string | null; size: string; katha: number; priceNote?: string | null }[];
  totalPlots?: number | null;
  totalArea?: string | null;
  roadPrimary?: string | null;
  roadSecondary?: string | null;
  coordinates: { lat: number; lng: number };
  isFlagship: boolean;
  isFeatured: boolean;
  assignedAgentId?: string | null;
  customFieldValues?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  propertyId?: string | null;
  propertyTitle?: string | null;
  stageId: string;
  assignedAgentId?: string | null;
  priority: "Low" | "Medium" | "High" | "Urgent";
  budget?: string | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  preferredLocation?: string | null;
  message?: string | null;
  score: number;
  tags: string[];
  nextFollowUp?: string | null;
  isDuplicate: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadStage {
  id: string;
  name: string;
  slug: string;
  color: string;
  sortOrder: number;
  isSystem: boolean;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  actorId?: string;
  actorName: string;
  type: "note" | "call" | "email" | "stage_change" | "whatsapp" | "visit";
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  filePath: string;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  title?: string;
  category?: string;
  altText: string;
  usageCount: number;
  usageReferences: { type: string; title: string; id: string }[];
  createdAt: string;
}

export type CategoryScope =
  | "property_type"
  | "property_area"
  | "property_status"
  | "gallery"
  | "blog"
  | "faq"
  | "amenity"
  | "service";

export interface AdminCategory {
  id: string;
  name: string;
  nameBn?: string | null;
  slug: string;
  scope: CategoryScope;
  description?: string;
  iconName?: string;
  color?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CustomFieldDef {
  id: string;
  name: string;
  key?: string;
  label: string;
  type: "text" | "number" | "select" | "boolean";
  options?: string[];
  isRequired: boolean;
  required?: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  iconName?: string | null;
  customSvgId?: string | null;
  openNewTab: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface SeoMeta {
  id: string;
  entityType: string;
  entityId: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  twitterCard: "summary" | "summary_large_image";
  focusKeyword?: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  customJsonLd?: string | null;
}

export interface RedirectRule {
  id: string;
  sourcePath: string;
  targetPath: string;
  statusCode: number;
  isActive: boolean;
  hitCount: number;
  lastAccessedAt?: string | null;
  createdAt: string;
}

export interface CustomScript {
  id: string;
  name: string;
  placement: "head" | "body_end";
  code: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  actorId?: string | null;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  oldValues?: Record<string, any> | null;
  newValues?: Record<string, any> | null;
  ipAddress?: string | null;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  bio?: string | null;
  avatarUrl?: string | null;
  activeLeadsCount: number;
  isActive: boolean;
}

export interface AdminBlogPost {
  id: string;
  slug: string;
  title: string;
  titleBn?: string | null;
  excerpt: string;
  excerptBn?: string | null;
  content: string;
  contentBn?: string | null;
  category: string;
  author: string;
  authorRole?: string;
  image: string;
  readTime: string;
  status: "Draft" | "Published" | "Archived";
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  sortOrder: number;
  createdAt?: string;
}

export interface AdminTestimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
  isActive: boolean;
  createdAt?: string;
}

export interface AdminService {
  id: string;
  title: string;
  category?: string;
  iconName: string;
  description: string;
  features: string[];
  sortOrder: number;
}

export interface AdminFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

export interface AdminPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  isPublished: boolean;
  lastUpdated?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminNavChildItem {
  label: string;
  href: string;
  description?: string;
}

export interface AdminNavItem {
  label: string;
  href: string;
  isDropdown?: boolean;
  children?: AdminNavChildItem[];
}

export interface AdminNavigation {
  header: AdminNavItem[];
  footer: {
    company: { label: string; href: string }[];
    services: { label: string; href: string }[];
    support: { label: string; href: string }[];
    legal: { label: string; href: string }[];
  };
  categories: { label: string; href: string; description: string }[];
}

export interface AdminSiteContent {
  hero: {
    slides: string[];
    showOverlay?: boolean;
    eyebrow: string;
    headline: string;
    subtitle: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    stats: { value: string; label: string }[];
  };
  aboutTeaser: {
    eyebrow: string;
    heading: string;
    p1: string;
    p2: string;
    badgeValue: string;
    badgeLabel: string;
    image: string;
    bullets: string[];
  };
  genesis: {
    eyebrow: string;
    heading: string;
    quote: string;
    p1: string;
    p2: string;
    p3: string;
    image: string;
    badgeValue: string;
    badgeLabel: string;
  };
  whyChooseUs: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    reasons: { title: string; description: string; icon: string }[];
  };
  process: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    steps: { step: string; title: string; description: string; icon: string }[];
  };
  ctaBanner: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    phone: string;
    bgImage: string;
  };
  corporateGroup: {
    heroEyebrow?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    whoWeAre?: {
      eyebrow: string;
      heading: string;
      p1: string;
      p2: string;
      image: string;
      badgeValue: string;
      badgeLabel: string;
    };
    ethos?: {
      eyebrow: string;
      heading: string;
      description: string;
    };
    foundingPioneer: {
      name: string;
      title: string;
      honorific?: string;
      quote?: string;
      bio: string[] | string;
      image?: string;
    };
    groupStats: { value: string; suffix: string; label: string; icon: string }[];
    visionMission: { vision: string; mission: string };
    sisterConcerns: {
      id: string;
      name: string;
      established: number;
      tagline: string;
      description: string;
      strengths?: string[];
      highlights?: string[];
      icon?: string;
      color?: string;
    }[];
    officeLocations: { city?: string; name?: string; description?: string; label?: string; company?: string; address?: string }[];
    offices?: { city?: string; name?: string; description?: string; label?: string; company?: string; address?: string }[];
  };
  coreValues?: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    values: { title: string; description: string; icon: string }[];
  };
  journey?: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    milestones: { year: string; title: string; text: string }[];
  };
  visionMission?: {
    mission: string;
    vision: string;
  };
  leadCapture?: {
    eyebrow: string;
    heading: string;
    description: string;
    bullets: string[];
    formTitle: string;
    formSubtitle: string;
  };
  executiveMessages?: {
    mdMessage: {
      title?: string;
      name: string;
      role: string;
      image: string;
      quote: string;
      fullText: string;
    };
    chairmanMessage: {
      title?: string;
      name: string;
      role: string;
      image: string;
      quote: string;
      fullText: string;
    };
  };
  aboutPage?: {
    heroTitle: string;
    heroSubtitle: string;
    heroBgImage: string;
    breadcrumb?: string;
    managementEyebrow: string;
    managementHeading: string;
    managementDescription: string;
    managementSubtitle?: string;
    managementButtonText: string;
    managementButtonLink: string;
  };
  projectsPage?: {
    heroTitle: string;
    heroSubtitle: string;
    heroBgImage: string;
    breadcrumb?: string;
    leadEyebrow: string;
    leadHeading: string;
    leadDescription: string;
    leadBullets: string[];
    formTitle: string;
    formSubtitle: string;
  };
  propertiesPage?: {
    heroTitle: string;
    heroSubtitle: string;
    heroBgImage: string;
    breadcrumb?: string;
    leadEyebrow: string;
    leadHeading: string;
    leadDescription: string;
    leadBullets: string[];
    formTitle: string;
    formSubtitle: string;
  };
  servicesPage?: {
    heroTitle: string;
    heroSubtitle: string;
    heroBgImage: string;
    breadcrumb?: string;
    sectionEyebrow: string;
    sectionTitle: string;
    sectionSubtitle: string;
    promiseEyebrow: string;
    promiseHeading: string;
    promiseDescription: string;
    promiseImage: string;
    promiseBullets: string[];
  };
  teamPage?: {
    heroTitle: string;
    heroSubtitle: string;
    heroBgImage: string;
    breadcrumb?: string;
    sectionEyebrow: string;
    sectionTitle: string;
    sectionSubtitle: string;
    ctaEyebrow: string;
    ctaHeading: string;
    ctaDescription: string;
  };
  galleryPage?: {
    heroTitle: string;
    heroSubtitle: string;
    heroBgImage: string;
    breadcrumb?: string;
    leadEyebrow: string;
    leadHeading: string;
    leadDescription: string;
    leadBullets: string[];
    formTitle: string;
    formSubtitle: string;
  };
  blogPage?: {
    heroTitle: string;
    heroSubtitle: string;
    heroBgImage: string;
    breadcrumb?: string;
    leadEyebrow: string;
    leadHeading: string;
    leadDescription: string;
    leadBullets: string[];
    formTitle: string;
    formSubtitle: string;
  };
  contactPage?: {
    heroTitle: string;
    heroSubtitle: string;
    heroBgImage: string;
    breadcrumb?: string;
    mapEyebrow: string;
    mapTitle: string;
    mapSubtitle: string;
    faqEyebrow: string;
    faqTitle: string;
    faqSubtitle: string;
  };
}

// Global in-memory persistent store for fast responsive access
class AdminDataStore {
  properties: AdminProperty[] = [];
  leads: AdminLead[] = [];
  leadStages: LeadStage[] = [];
  leadActivities: LeadActivity[] = [];
  media: MediaItem[] = [];
  socialLinks: SocialLink[] = [];
  seoMeta: Record<string, SeoMeta> = {};
  redirects: RedirectRule[] = [];
  customScripts: CustomScript[] = [];
  auditLogs: AuditLogItem[] = [];
  agents: Agent[] = [];
  roles: any[] = [];
  categories: AdminCategory[] = [];
  customFields: CustomFieldDef[] = [];
  siteSettings: Record<string, any> = {};
  blogPosts: AdminBlogPost[] = [];
  teamMembers: AdminTeamMember[] = [];
  testimonials: AdminTestimonial[] = [];
  services: AdminService[] = [];
  faqs: AdminFaq[] = [];
  pages: AdminPage[] = [];
  navigation: AdminNavigation = {
    header: [],
    footer: { company: [], services: [], support: [], legal: [] },
    categories: [],
  };
  siteContent: AdminSiteContent = {} as AdminSiteContent;
  isInitialized = false;

  constructor() {
    this.init();
  }

  init() {
    if (this.isInitialized) return;

    // 1. Initialize Stages
    this.leadStages = [
      { id: "stage-1", name: "New", slug: "new", color: "#3b82f6", sortOrder: 1, isSystem: true },
      { id: "stage-2", name: "Contacted", slug: "contacted", color: "#f59e0b", sortOrder: 2, isSystem: true },
      { id: "stage-3", name: "Qualified", slug: "qualified", color: "#10b981", sortOrder: 3, isSystem: true },
      { id: "stage-4", name: "Site Visit Scheduled", slug: "site-visit-scheduled", color: "#8b5cf6", sortOrder: 4, isSystem: true },
      { id: "stage-5", name: "Negotiation", slug: "negotiation", color: "#ec4899", sortOrder: 5, isSystem: true },
      { id: "stage-6", name: "Won", slug: "won", color: "#059669", sortOrder: 6, isSystem: true },
      { id: "stage-7", name: "Lost", slug: "lost", color: "#ef4444", sortOrder: 7, isSystem: true },
    ];

    // 2. Initialize Agents
    this.agents = [
      {
        id: "agent-1",
        name: "Rafiqul Islam",
        email: "rafiqul@coronaproperties.com",
        phone: "+880 1805 759297",
        role: "Director of Client Relations",
        bio: "Specializing in high-value Purbachal and Gulshan investments with over 14 years experience.",
        avatarUrl: "/image-01.webp",
        activeLeadsCount: 12,
        isActive: true,
      },
      {
        id: "agent-2",
        name: "Nadia Chowdhury",
        email: "nadia@coronaproperties.com",
        phone: "+880 1711 223344",
        role: "Senior Property Consultant",
        bio: "Expert in residential layout planning, titles, and NRI buyer advisory.",
        avatarUrl: "/image-02.webp",
        activeLeadsCount: 8,
        isActive: true,
      },
      {
        id: "agent-3",
        name: "Tanvir Ahmed",
        email: "tanvir@coronaproperties.com",
        phone: "+880 1912 334455",
        role: "Investment Portfolio Manager",
        bio: "Advises institutional investors on commercial land banking.",
        avatarUrl: "/image-03.webp",
        activeLeadsCount: 5,
        isActive: true,
      },
    ];

    // 3. Initialize Properties from PROJECTS & PROPERTIES
    const flagshipProject = PROJECTS[0];
    const initialProps: AdminProperty[] = [];

    if (flagshipProject) {
      initialProps.push({
        id: "prop-flagship-1",
        slug: flagshipProject.slug,
        title: flagshipProject.name,
        titleBn: "ম্যাপল লিফ গার্ডেন সিটি",
        tagline: flagshipProject.tagline,
        taglineBn: flagshipProject.taglineBn,
        location: flagshipProject.location,
        area: "Purbachal, Dhaka",
        price: "BDT 35 Lakh - 2.5 Crore",
        priceValue: 35000000,
        type: "Exclusive",
        status: "Available",
        approvalStatus: "Published",
        size: "3 to 20+ Katha Plots",
        featuredImage: flagshipProject.heroImage || "/image-06.webp",
        gallery: flagshipProject.gallery || ["/image-02.webp", "/image-03.webp", "/image-04.webp"],
        overview: flagshipProject.overview,
        overviewBn: "ম্যাপল লিফ গার্ডেন সিটি পূর্বাচল ঢাকার একটি অনন্য ও আধুনিক পরিকল্পিত আবাসিক প্রকল্প।",
        genesis: flagshipProject.genesis,
        highlights: flagshipProject.highlights,
        features: flagshipProject.features,
        specs: flagshipProject.specs,
        plotTypes: flagshipProject.plotTypes,
        totalPlots: flagshipProject.totalPlots,
        totalArea: flagshipProject.totalArea,
        roadPrimary: flagshipProject.roadPrimary,
        roadSecondary: flagshipProject.roadSecondary,
        coordinates: flagshipProject.coordinates,
        isFlagship: true,
        isFeatured: true,
        assignedAgentId: "agent-1",
        createdAt: "2026-01-15T10:00:00Z",
        updatedAt: "2026-03-10T14:30:00Z",
      });
    }

    PROPERTIES.forEach((p, idx) => {
      if (p.slug !== flagshipProject?.slug) {
        initialProps.push({
          id: `prop-${idx + 2}`,
          slug: p.slug,
          title: p.title,
          titleBn: p.title,
          tagline: `Exclusive ${p.type} plots in prime ${p.location}`,
          taglineBn: `প্রাইম লোকেশনে আধুনিক প্লট`,
          location: p.location,
          area: p.area,
          price: p.price,
          priceValue: p.priceValue,
          type: p.type as any,
          status: (p.status === "New Launch" ? "New Launch" : p.status === "Almost Sold Out" ? "Almost Sold Out" : "Available") as any,
          approvalStatus: "Published",
          size: p.size,
          featuredImage: p.image || `/image-0${(idx % 6) + 1}.webp`,
          gallery: p.gallery || ["/image-02.webp", "/image-03.webp"],
          overview: p.description,
          overviewBn: p.description,
          highlights: p.highlights || [],
          features: p.features || [],
          specs: [
            { label: "Plot Size", value: p.size },
            { label: "Category", value: p.type },
          ],
          plotTypes: [{ label: p.size, size: p.size, katha: 5 }],
          coordinates: p.coordinates || { lat: 23.86489, lng: 90.5647 },
          isFlagship: false,
          isFeatured: !!p.featured,
          assignedAgentId: idx % 2 === 0 ? "agent-2" : "agent-3",
          createdAt: "2026-02-01T08:00:00Z",
          updatedAt: "2026-03-12T11:20:00Z",
        });
      }
    });

    this.properties = initialProps;

    // 4. Initialize Media Items
    this.media = [
      {
        id: "media-yt-1",
        filename: "youtube-tour-1.mp4",
        filePath: "youtube/ysz5S6PUM-U",
        url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
        thumbnailUrl: "https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg",
        mimeType: "video/youtube",
        sizeBytes: 0,
        width: 1920,
        height: 1080,
        title: "Maple Leaf Garden City — Cinematic Drone Tour",
        category: "Video Tours",
        altText: "Maple Leaf Garden City Cinematic Drone Tour 4K",
        usageCount: 1,
        usageReferences: [{ type: "property", title: "Maple Leaf Garden City", id: "prop-flagship-1" }],
        createdAt: "2026-02-01T12:00:00Z",
      },
      {
        id: "media-1",
        filename: "image-06.webp",
        filePath: "properties/image-06.webp",
        url: "/image-06.webp",
        thumbnailUrl: "/image-06.webp",
        mimeType: "image/webp",
        sizeBytes: 342000,
        width: 1920,
        height: 1080,
        title: "Maple Leaf Garden City — Plot Layout",
        category: "Layouts",
        altText: "Maple Leaf Garden City Master Layout Canopy",
        usageCount: 2,
        usageReferences: [{ type: "property", title: "Maple Leaf Garden City", id: "prop-flagship-1" }],
        createdAt: "2026-01-10T12:00:00Z",
      },
      {
        id: "media-2",
        filename: "image-01.webp",
        filePath: "properties/image-01.webp",
        url: "/image-01.webp",
        thumbnailUrl: "/image-01.webp",
        mimeType: "image/webp",
        sizeBytes: 285000,
        width: 1920,
        height: 1080,
        title: "Corona Lakeview Enclave — Aerial View",
        category: "Aerial Views",
        altText: "Corona Lakeview Enclave Waterfront Perspective",
        usageCount: 3,
        usageReferences: [{ type: "property", title: "Corona Lakeview Enclave", id: "prop-2" }],
        createdAt: "2026-01-12T10:00:00Z",
      },
      {
        id: "media-3",
        filename: "image-02.webp",
        filePath: "properties/image-02.webp",
        url: "/image-02.webp",
        thumbnailUrl: "/image-02.webp",
        mimeType: "image/webp",
        sizeBytes: 410000,
        width: 1920,
        height: 1080,
        title: "Corona Green Valley — Plot Layout",
        category: "Layouts",
        altText: "Maple Leaf Garden City Boulevards and Maple Trees",
        usageCount: 1,
        usageReferences: [{ type: "property", title: "Maple Leaf Garden City", id: "prop-flagship-1" }],
        createdAt: "2026-01-15T15:00:00Z",
      },
      {
        id: "media-4",
        filename: "image-03.webp",
        filePath: "properties/image-03.webp",
        url: "/image-03.webp",
        thumbnailUrl: "/image-03.webp",
        mimeType: "image/webp",
        sizeBytes: 380000,
        width: 1920,
        height: 1080,
        title: "Corona Royal Crest — Main Entrance",
        category: "Residential",
        altText: "Corona Royal Crest Estate Avenue",
        usageCount: 1,
        usageReferences: [{ type: "property", title: "Corona Royal Crest", id: "prop-3" }],
        createdAt: "2026-01-18T09:00:00Z",
      },
      {
        id: "media-5",
        filename: "image-04.webp",
        filePath: "properties/image-04.webp",
        url: "/image-04.webp",
        thumbnailUrl: "/image-04.webp",
        mimeType: "image/webp",
        sizeBytes: 315000,
        width: 1920,
        height: 1080,
        title: "Corona Heritage Park — Green Corridor",
        category: "Residential",
        altText: "Corona Heritage Park Green Corridor",
        usageCount: 1,
        usageReferences: [],
        createdAt: "2026-01-20T11:00:00Z",
      },
      {
        id: "media-6",
        filename: "image-05.webp",
        filePath: "properties/image-05.webp",
        url: "/image-05.webp",
        thumbnailUrl: "/image-05.webp",
        mimeType: "image/webp",
        sizeBytes: 360000,
        width: 1920,
        height: 1080,
        title: "Corona Horizon — Panoramic View",
        category: "Aerial Views",
        altText: "Corona Horizon Panoramic View",
        usageCount: 1,
        usageReferences: [],
        createdAt: "2026-01-22T14:00:00Z",
      },
    ];

    // 5. Initialize Leads
    this.leads = [
      {
        id: "lead-1",
        name: "Eng. M. Rahman",
        email: "m.rahman.eng@gmail.com",
        phone: "+880 1819 123456",
        source: "Property Page Inquiry",
        propertyId: "prop-flagship-1",
        propertyTitle: "Maple Leaf Garden City",
        stageId: "stage-4",
        assignedAgentId: "agent-1",
        priority: "High",
        budget: "BDT 1.5 - 2.0 Crore",
        budgetMin: 15000000,
        budgetMax: 20000000,
        preferredLocation: "Purbachal Lakeside",
        message: "Interested in 10 Katha plot with lake-facing orientation. Visit scheduled for upcoming Friday.",
        score: 92,
        tags: ["Hot Lead", "Lake Facing", "Site Visit"],
        nextFollowUp: "2026-09-25T10:00:00Z",
        isDuplicate: false,
        status: "Active",
        createdAt: "2026-03-18T14:20:00Z",
        updatedAt: "2026-03-20T11:00:00Z",
      },
      {
        id: "lead-2",
        name: "Dr. Arifa Sultana",
        email: "arifa.sultana@dmc.edu.bd",
        phone: "+880 1712 987654",
        source: "WhatsApp Direct",
        propertyId: "prop-flagship-1",
        propertyTitle: "Maple Leaf Garden City",
        stageId: "stage-3",
        assignedAgentId: "agent-2",
        priority: "High",
        budget: "BDT 70 - 90 Lakh",
        budgetMin: 7000000,
        budgetMax: 9000000,
        preferredLocation: "Healthcare Zone",
        message: "Looking for 5 Katha residential plot near the community hospital zone for immediate construction.",
        score: 85,
        tags: ["Doctor", "5 Katha", "Hospital Zone"],
        nextFollowUp: "2026-09-24T14:30:00Z",
        isDuplicate: false,
        status: "Active",
        createdAt: "2026-03-19T09:15:00Z",
        updatedAt: "2026-03-19T16:45:00Z",
      },
      {
        id: "lead-3",
        name: "Kamal Hossain (Toronto NRI)",
        email: "kamal.hossain@rogers.ca",
        phone: "+1 416 555 0192",
        source: "Schedule a Visit",
        propertyId: "prop-flagship-1",
        propertyTitle: "Maple Leaf Garden City",
        stageId: "stage-1",
        assignedAgentId: "agent-1",
        priority: "Urgent",
        budget: "BDT 2.5 Crore",
        budgetMin: 25000000,
        budgetMax: 30000000,
        preferredLocation: "Executive Enclave",
        message: "Arriving at Hazrat Shahjalal Airport next week. Wants private limousine pickup and executive plot tour.",
        score: 96,
        tags: ["NRI", "Cash Buyer", "Toronto"],
        nextFollowUp: "2026-09-22T08:00:00Z",
        isDuplicate: false,
        status: "Active",
        createdAt: "2026-03-20T17:00:00Z",
        updatedAt: "2026-03-20T17:00:00Z",
      },
      {
        id: "lead-4",
        name: "Fahim Shahriar",
        email: "fahim.shahriar@techcorp.io",
        phone: "+880 1911 556677",
        source: "Website Consultation Form",
        propertyId: "prop-2",
        propertyTitle: "Corona Lakeview Enclave",
        stageId: "stage-2",
        assignedAgentId: "agent-3",
        priority: "Medium",
        budget: "BDT 1.2 Crore",
        budgetMin: 12000000,
        budgetMax: 15000000,
        preferredLocation: "Gulshan Corridor",
        message: "Checking installment payment structures and legal clearance on title deed.",
        score: 68,
        tags: ["Installment", "Legal Check"],
        nextFollowUp: "2026-09-26T11:00:00Z",
        isDuplicate: false,
        status: "Active",
        createdAt: "2026-03-17T11:30:00Z",
        updatedAt: "2026-03-18T10:00:00Z",
      },
      {
        id: "lead-5",
        name: "Barrister Anisuzzaman",
        email: "anis@dhakachambers.com",
        phone: "+880 1817 665544",
        source: "Callback Request",
        propertyId: "prop-flagship-1",
        propertyTitle: "Maple Leaf Garden City",
        stageId: "stage-5",
        assignedAgentId: "agent-1",
        priority: "High",
        budget: "BDT 2.2 Crore",
        score: 89,
        tags: ["Negotiation", "Corner Plot"],
        message: "Final pricing review for Plot 104 and 105 (Commercial High Street corridor).",
        nextFollowUp: "2026-09-23T16:00:00Z",
        isDuplicate: false,
        status: "Active",
        createdAt: "2026-03-15T09:00:00Z",
        updatedAt: "2026-03-19T18:00:00Z",
      },
      {
        id: "lead-6",
        name: "Tariqul Islam",
        email: "tariqul.islam@beximco.net",
        phone: "+880 1713 001122",
        source: "Direct Referral",
        propertyId: "prop-flagship-1",
        propertyTitle: "Maple Leaf Garden City",
        stageId: "stage-6",
        assignedAgentId: "agent-2",
        priority: "High",
        budget: "BDT 1.8 Crore",
        score: 100,
        tags: ["Won", "Registration Done"],
        message: "Token advance received. Title deed registration scheduled at Sub-Registry office.",
        isDuplicate: false,
        status: "Closed",
        createdAt: "2026-03-01T10:00:00Z",
        updatedAt: "2026-03-14T15:00:00Z",
      },
    ];

    // 6. Lead Activities
    this.leadActivities = [
      {
        id: "act-1",
        leadId: "lead-1",
        actorName: "Rafiqul Islam",
        type: "call",
        title: "Phone Consultation Completed",
        description: "Discussed 10 Katha plot orientations. Client prefers sunset view towards the northern maple boulevard.",
        createdAt: "2026-03-18T15:00:00Z",
      },
      {
        id: "act-2",
        leadId: "lead-1",
        actorName: "Rafiqul Islam",
        type: "stage_change",
        title: "Stage Moved to Site Visit Scheduled",
        description: "Scheduled visit for Friday 10:00 AM with Project Director.",
        createdAt: "2026-03-19T11:00:00Z",
      },
      {
        id: "act-3",
        leadId: "lead-2",
        actorName: "Nadia Chowdhury",
        type: "whatsapp",
        title: "Sent Master Layout PDF & Pricing Table",
        description: "Sent Purbachal Sector 1 / Bholabo Union master plan with hospital proximity marked.",
        createdAt: "2026-03-19T10:00:00Z",
      },
    ];

    // 7. Social Links
    this.socialLinks = [
      { id: "soc-1", platform: "Facebook", label: "Corona Properties Official", url: "https://facebook.com/coronapropertiesltd", iconName: "Facebook", openNewTab: true, isActive: true, sortOrder: 1 },
      { id: "soc-2", platform: "Instagram", label: "Corona Luxury Living", url: "https://instagram.com/coronaproperties", iconName: "Instagram", openNewTab: true, isActive: true, sortOrder: 2 },
      { id: "soc-3", platform: "YouTube", label: "Corona Properties Tours", url: "https://youtube.com/@coronaproperties", iconName: "Youtube", openNewTab: true, isActive: true, sortOrder: 3 },
      { id: "soc-4", platform: "WhatsApp", label: "WhatsApp Concierge", url: "https://wa.me/8801805759297", iconName: "MessageCircle", openNewTab: true, isActive: true, sortOrder: 4 },
      { id: "soc-5", platform: "LinkedIn", label: "Corona Properties Corporate", url: "https://linkedin.com/company/corona-properties", iconName: "Linkedin", openNewTab: true, isActive: true, sortOrder: 5 },
      { id: "soc-6", platform: "Phone", label: "Direct Helpline", url: "tel:+8801805759297", iconName: "Phone", openNewTab: false, isActive: true, sortOrder: 6 },
      { id: "soc-7", platform: "Email", label: "Concierge Desk", url: "mailto:cplcoronapropertiesltd@gmail.com", iconName: "Mail", openNewTab: false, isActive: true, sortOrder: 7 },
    ];

    // 8. Redirects
    this.redirects = [
      { id: "red-1", sourcePath: "/maple-leaf", targetPath: "/properties/maple-leaf-garden-city", statusCode: 301, isActive: true, hitCount: 142, createdAt: "2026-01-20T00:00:00Z" },
      { id: "red-2", sourcePath: "/plots-dhaka", targetPath: "/properties", statusCode: 301, isActive: true, hitCount: 89, createdAt: "2026-02-01T00:00:00Z" },
      { id: "red-3", sourcePath: "/purbachal-land", targetPath: "/properties/maple-leaf-garden-city", statusCode: 301, isActive: true, hitCount: 215, createdAt: "2026-02-15T00:00:00Z" },
    ];

    // 9. Custom Scripts
    this.customScripts = [
      {
        id: "script-1",
        name: "Google Tag Manager / Analytics",
        placement: "head",
        code: "<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer','GTM-CORONA');</script>\n<!-- End Google Tag Manager -->",
        isActive: true,
        createdBy: "Super Admin",
        createdAt: "2026-01-01T00:00:00Z",
      },
      {
        id: "script-2",
        name: "Facebook Pixel & Meta Conversions",
        placement: "head",
        code: "<!-- Meta Pixel Code -->\n<script>\n!function(f,b,e,v,n,t,s)\n{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\nn.callMethod.apply(n,arguments):n.queue.push(arguments)};\nif(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\nn.queue=[];t=b.createElement(e);t.async=!0;\nt.src=v;s=b.getElementsByTagName(e)[0];\ns.parentNode.insertBefore(t,s)}(window, document,'script',\n'https://connect.facebook.net/en_US/fbevents.js');\nfbq('init', '1805759297001');\nfbq('track', 'PageView');\n</script>",
        isActive: true,
        createdBy: "Super Admin",
        createdAt: "2026-01-05T00:00:00Z",
      },
    ];

    // 10. Audit Logs
    this.auditLogs = [
      {
        id: "log-1",
        actorEmail: "superadmin@coronaproperties.com",
        action: "UPDATE",
        entityType: "property",
        entityId: "prop-flagship-1",
        oldValues: { status: "New Launch", price: "BDT 32 Lakh" },
        newValues: { status: "Available", price: "BDT 35 Lakh - 2.5 Crore" },
        ipAddress: "103.145.23.4",
        createdAt: "2026-03-20T16:30:00Z",
      },
      {
        id: "log-2",
        actorEmail: "rafiqul@coronaproperties.com",
        action: "UPDATE_STAGE",
        entityType: "lead",
        entityId: "lead-1",
        oldValues: { stage: "Qualified" },
        newValues: { stage: "Site Visit Scheduled" },
        ipAddress: "103.145.23.12",
        createdAt: "2026-03-20T15:10:00Z",
      },
      {
        id: "log-3",
        actorEmail: "superadmin@coronaproperties.com",
        action: "CREATE",
        entityType: "redirect",
        entityId: "red-3",
        newValues: { sourcePath: "/purbachal-land", targetPath: "/properties/maple-leaf-garden-city" },
        ipAddress: "103.145.23.4",
        createdAt: "2026-03-19T14:00:00Z",
      },
    ];

    // 11. Roles & Permissions
    this.roles = [
      {
        id: "role-1",
        name: "Super Admin",
        displayName: "Super Administrator",
        description: "Full unrestricted access to all properties, leads, settings, and database management.",
        isSystem: true,
        userCount: 2,
      },
      {
        id: "role-2",
        name: "Admin",
        displayName: "Administrator",
        description: "Can manage content, listings, leads, agents, and view audit reports.",
        isSystem: true,
        userCount: 3,
      },
      {
        id: "role-3",
        name: "Editor",
        displayName: "Content Editor",
        description: "Can create and edit property listings and blog articles.",
        isSystem: false,
        userCount: 2,
      },
      {
        id: "role-4",
        name: "Agent",
        displayName: "Property Consultant",
        description: "Can view listings and edit only their own assigned leads.",
        isSystem: false,
        userCount: 8,
      },
      {
        id: "role-5",
        name: "Auditor",
        displayName: "Read-Only Auditor",
        description: "Read-only access for compliance, accounting, and legal audit.",
        isSystem: false,
        userCount: 1,
      },
    ];

    // 12. Site Settings
    this.siteSettings = {
      branding: {
        companyName: "Corona Properties Limited",
        shortName: "Corona Properties",
        tagline: "Crafting Timeless Land Legacies",
        taglineBn: "সময়ের ঊর্ধ্বে ভূমির ঐতিহ্য",
        description:
          "Bangladesh's premier residential land developer. Crafting legacies through premium plots, transparent transactions, and enduring value since 2015.",
        logoUrl: "/image-01.webp",
        faviconUrl: "/favicon.ico",
        primaryColor: "#0a1a3e",
        accentGold: "#c9a96e",
        phone: "+880 1805 759297",
        whatsapp: "8801805759297",
        email: "cplcoronapropertiesltd@gmail.com",
        address: "House # 145, Flat # 704, Road # 3, Block A, Niketon, Gulshan 01, Dhaka - 1212",
        hours: "Saturday – Thursday: 9:00 AM – 6:00 PM | Friday: Closed",
        headerCtaText: "Book a Visit",
        headerCtaLink: "/contact",
        mapEmbedUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.233099212104!2d90.40905247604982!3d23.77471198784286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c777f2685349%3A0x601032d9c6106b95!2sNiketan%2C%20Dhaka%201212!5e0!3m2!1sen!2sbd!4v1711100000000!5m2!1sen!2sbd",
        directionsUrl: "https://maps.google.com/?q=Niketon+Gulshan+1+Dhaka+1212",
      },
      webhooks: {
        n8nLeadWebhook: "https://n8n.coronaproperties.com/webhook/new-lead",
        telegramBotToken: "",
        telegramChatId: "",
        enableTelegramAlerts: true,
        enableEmailAlerts: true,
      },
      mapConfig: {
        defaultLat: 23.86489,
        defaultLng: 90.5647,
        defaultZoom: 14,
        clusterPins: true,
      },
    };

    // 13. Initialize Blog Posts
    this.blogPosts = BLOG_POSTS.map((bp) => ({
      id: bp.id,
      slug: bp.slug,
      title: bp.title,
      titleBn: null,
      excerpt: bp.excerpt,
      excerptBn: null,
      content: bp.content.join("\n\n"),
      contentBn: null,
      category: bp.category,
      author: bp.author,
      authorRole: bp.authorRole,
      image: bp.image,
      readTime: bp.readTime,
      status: "Published",
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // 14. Initialize Team Members (Leadership Messages)
    this.teamMembers = TEAM.map((m, idx) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      bio: m.bio,
      image: m.image,
      sortOrder: idx + 1,
      createdAt: new Date().toISOString(),
    }));

    // 15. Initialize Testimonials
    this.testimonials = TESTIMONIALS.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      quote: t.quote,
      rating: t.rating,
      image: t.image,
      isActive: true,
      createdAt: new Date().toISOString(),
    }));

    // 16. Initialize Services
    const serviceIconMap: Record<string, string> = {
      "land-development": "Building2",
      "legal-services": "ShieldCheck",
      "investment-advisory": "TrendingUp",
      "property-management": "Building",
      "documentation": "FileText",
      "after-sales-support": "Headphones",
    };

    this.services = SERVICES.map((s, idx) => ({
      id: s.id,
      title: s.title,
      iconName: serviceIconMap[s.id] || "Building2",
      description: s.description,
      features: [...s.features],
      sortOrder: idx + 1,
    }));

    // 17. Initialize FAQs
    this.faqs = [
      {
        id: "faq-1",
        question: "Are all Corona Properties plots fully documented?",
        answer: "Yes, every single plot we sell comes with complete documentation and verified titles. We never list plots without proper paperwork — that's our core promise.",
        category: "Legal & Title",
        sortOrder: 1,
      },
      {
        id: "faq-2",
        question: "What payment plans do you offer?",
        answer: "We offer flexible payment plans including installment options spread across 12-36 months, depending on the project. Many plots also qualify for bank financing through our partner banks. Contact us for project-specific plans.",
        category: "Financing",
        sortOrder: 2,
      },
      {
        id: "faq-3",
        question: "Can non-resident Bangladeshis (NRBs) buy land from Corona Properties?",
        answer: "Absolutely. We have extensive experience serving NRB clients worldwide. Our dedicated team handles remote verification, digital documentation, and secure transactions. We also offer property management services for overseas owners.",
        category: "NRI / Expat",
        sortOrder: 3,
      },
      {
        id: "faq-4",
        question: "Do you provide legal verification for the plots?",
        answer: "Yes, legal verification is included at no extra cost for every purchase. Our in-house legal team conducts thorough title verification, mutation checks, and ensures complete documentation before handover.",
        category: "Legal & Title",
        sortOrder: 4,
      },
      {
        id: "faq-5",
        question: "What happens after I purchase a plot?",
        answer: "After purchase, we handle mutation, ownership transfer, and all documentation. You also receive lifetime after-sales support including construction advisory, resale assistance, and dedicated account management.",
        category: "After Sales",
        sortOrder: 5,
      },
      {
        id: "faq-6",
        question: "Can I visit a plot before making a decision?",
        answer: "Yes, we encourage site visits. Book a free site visit through our contact form or by calling us. Our team will arrange a guided tour, answer your questions, and help you evaluate the plot firsthand.",
        category: "Site Visit",
        sortOrder: 6,
      },
    ];

    // 18. Initialize Pages (Legal & Policy)
    this.pages = [
      {
        id: "page-privacy-policy",
        slug: "privacy-policy",
        title: "Privacy Policy",
        content: `Corona Properties Limited ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this policy carefully.

We may collect personal information that you voluntarily provide to us when you fill out an inquiry form, schedule a site visit, or communicate with our property specialists. We implement appropriate technical and organizational security measures to protect your personal data.`,
        isPublished: true,
        lastUpdated: "August 29, 2026",
      },
      {
        id: "page-terms-conditions",
        slug: "terms-and-conditions",
        title: "Terms & Conditions",
        content: `By accessing or using the Corona Properties Limited website and services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website or services.

All property listings, layouts, specifications, and prices displayed on our website are subject to availability and formal contract execution. While we strive to maintain accurate and up-to-date information, variations in site conditions and municipal guidelines may occur.`,
        isPublished: true,
        lastUpdated: "August 29, 2026",
      },
      {
        id: "page-refund-policy",
        slug: "refund-policy",
        title: "Refund Policy",
        content: `At Corona Properties Limited, we strive for complete transparency and client satisfaction in every property transaction. This Refund Policy outlines the terms and conditions under which refunds, booking cancellations, and payment adjustments are processed.

Booking tokens and earnest money deposits are processed in accordance with specific plot reservation agreements and applicable land laws of Bangladesh.`,
        isPublished: true,
        lastUpdated: "August 29, 2026",
      },
      {
        id: "page-disclaimer",
        slug: "disclaimer",
        title: "Disclaimer",
        content: `The information provided by Corona Properties Limited on this website is for general informational and marketing purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding accuracy or completeness.

All maps, plot sizes, artistic 3D renderings, and master plans are conceptual representations intended to illustrate planned developments. Final plot measurements and boundaries are governed strictly by certified deed plans and registry records.`,
        isPublished: true,
        lastUpdated: "August 29, 2026",
      },
    ];

    // 19. Initialize Navigation
    this.navigation = {
      header: [
        { label: "Home", href: "/" },
        {
          label: "About",
          href: "/about",
          isDropdown: true,
          children: [
            { label: "About Us", href: "/about", description: "Our heritage, philosophy, and legacy" },
            { label: "Group Profile", href: "/corona-group", description: "Corona Group corporate profile & enterprises" },
            { label: "Management Messages", href: "/team", description: "Leadership messages & executive directors" },
          ],
        },
        {
          label: "Projects",
          href: "/projects",
          isDropdown: true,
          children: [
            { label: "Maple Leaf Garden City", href: "/projects/maple-leaf-garden-city", description: "Flagship master-planned township in Purbachal" },
          ],
        },
        { label: "Services", href: "/services" },
        { label: "Gallery", href: "/gallery" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
      footer: {
        company: [...FOOTER_LINKS.company],
        services: [...FOOTER_LINKS.services],
        support: [...FOOTER_LINKS.support],
        legal: [...FOOTER_LINKS.legal],
      },
      categories: [...NAV_CATEGORIES],
    };

    // 20. Initialize Site Section Content
    this.siteContent = {
      hero: {
        slides: ["/image-01.webp", "/image-02.webp", "/image-03.webp"],
        eyebrow: "Premium Land Developer Since 2015",
        headline: "Where Legacy Meets the Land",
        subtitle:
          "Discover Bangladesh's finest residential plots in prime locations. Premium land, transparent transactions, and a legacy you can build on.",
        primaryCtaText: "Explore Properties",
        primaryCtaLink: "/properties",
        secondaryCtaText: "Our Story",
        secondaryCtaLink: "/about",
        stats: [
          { value: "500+", label: "Acres Developed" },
          { value: "1,200+", label: "Happy Families" },
          { value: "40+", label: "Premium Projects" },
          { value: "10+", label: "Years of Trust" },
        ],
      },
      aboutTeaser: {
        eyebrow: "About Corona Properties",
        heading: "Crafting Premium Communities Across Bangladesh",
        p1: "Corona Properties Limited is redefining residential land development in Bangladesh. We don't just sell plots — we craft communities where families build their dreams and investors grow their wealth with confidence.",
        p2: "Every project reflects our unwavering commitment to legal transparency, world-class infrastructure, and long-term value creation.",
        badgeValue: "100%",
        badgeLabel: "Legal & Transparent Transactions",
        image: "/About-corone.webp",
        bullets: [
          "Approved residential plots",
          "100% clear & verified titles",
          "Underground utilities & wide roads",
          "Transparent, end-to-end support",
        ],
      },
      genesis: {
        eyebrow: "Our Origin Story",
        heading: "From Toronto to Purbachal — A Story of Vision",
        quote: "Can the quality of life we experience abroad become available here?",
        p1: "Behind every great community lies a conviction that world-class living should know no borders. Maple Leaf Garden City was born from a thought that germinated in Toronto — a question asked by Bangladeshi expatriates who discovered something they wanted to bring home:",
        p2: "We didn't simply replicate a concept. We envisioned a place where the serenity of a maple-lined boulevard and the architectural discipline of a planned city merge with the warmth of Bangladeshi community life.",
        p3: "This is the birth of an address that will outlive generations. A statement that the future of Bangladesh can be shaped by Bangladeshi visionaries, with international-grade standards and local heart.",
        image: "/Toronto_to_Purbachal.webp",
        badgeValue: "100%",
        badgeLabel: "Legal & Transparent Transactions",
      },
      whyChooseUs: {
        eyebrow: "Why Corona Properties",
        heading: "The Corona Difference",
        subtitle:
          "Six pillars that make us Bangladesh's most trusted name in premium residential land.",
        reasons: [
          {
            icon: "ShieldCheck",
            title: "100% Legal Assurance",
            description:
              "Every plot comes with verified title, complete legal documentation, and zero disputes guaranteed.",
          },
          {
            icon: "TrendingUp",
            title: "High ROI Potential",
            description:
              "Strategically located plots in high-growth corridors, historically delivering 25–40% appreciation over 3 years.",
          },
          {
            icon: "Handshake",
            title: "Transparent Deals",
            description:
              "No hidden costs, no surprise clauses. What you see is exactly what you get — crystal-clear transactions.",
          },
          {
            icon: "Building2",
            title: "Premium Infrastructure",
            description:
              "Wide roads, underground utilities, proper drainage, and modern amenities on par with international standards.",
          },
          {
            icon: "Headphones",
            title: "Lifetime Support",
            description:
              "Dedicated after-sales team supporting you through construction, resale, and lifelong property management.",
          },
        ],
      },
      process: {
        eyebrow: "How We Work",
        heading: "A Seamless Journey to Ownership",
        subtitle:
          "Four refined steps that take you from first inquiry to proud landowner — stress-free and fully supported.",
        steps: [
          {
            step: "01",
            icon: "Search",
            title: "Discovery",
            description:
              "We understand your goals, budget, and preferences, then curate the perfect plots from our portfolio.",
          },
          {
            step: "02",
            icon: "FileCheck",
            title: "Verification",
            description:
              "Our legal team conducts thorough title verification, due diligence, and documentation — at no extra cost.",
          },
          {
            step: "03",
            icon: "Handshake",
            title: "Transaction",
            description:
              "Transparent pricing, flexible payment plans, and seamless registration with complete transfer.",
          },
          {
            step: "04",
            icon: "KeyRound",
            title: "Handover & Beyond",
            description:
              "Plot handover with mutation complete, plus lifetime after-sales support for construction and resale.",
          },
        ],
      },
      ctaBanner: {
        title: "Your Dream Plot is One Conversation Away",
        subtitle:
          "Schedule a complimentary consultation with our land experts. We'll guide you through every option, answer all your questions, and help you make a confident, informed decision.",
        buttonText: "Book a Site Visit",
        buttonLink: "/contact",
        phone: CONTACT_INFO.phone,
        bgImage: "/image-02.webp",
      },
      corporateGroup: {
        heroEyebrow: "Est. 1987 · Dhaka & Chittagong",
        heroTitle: "Corona Group",
        heroSubtitle:
          "Over three decades of pioneering excellence across transportation, maritime logistics, customs brokerage, international trade, and media production in Bangladesh.",
        whoWeAre: {
          eyebrow: "Who We Are",
          heading: "A Legacy of Excellence Across Industries",
          p1: "Founded in 1987 in Dhaka, Corona Group has grown from a single overland transport company into a diversified Bangladeshi conglomerate operating six dynamic business divisions. With offices in both Dhaka and Chittagong, the Group forms an integrated backbone across the nation's supply chain, maritime trade, and creative sectors.",
          p2: "Every Corona enterprise is bound by a shared commitment to operational precision, regulatory compliance, and long-term partnership — values that have earned the trust of leading national and multinational clients for nearly four decades.",
          image: "/image-01.webp",
          badgeValue: "37+",
          badgeLabel: "Years of Corporate Heritage",
        },
        ethos: {
          eyebrow: "Our Ethos",
          heading: "Commitment to Sustainable Growth",
          description:
            "As Bangladesh continues its journey as one of South Asia's fastest-growing economies, Corona Group remains dedicated to strengthening the nation's trade infrastructure, creating meaningful employment, and upholding the highest standards of corporate governance across every venture we undertake.",
        },
        foundingPioneer: {
          name: "Kazi Rafiqul Islam",
          title: "A Pioneer in Transportation & Logistics",
          honorific: "Founding Pioneer",
          quote:
            "True enterprise is measured not merely by growth, but by the trust it earns and the nation it helps build.",
          bio: [
            "In 1987, Kazi Rafiqul Islam laid the cornerstone of what would become one of Bangladesh's most enduring corporate legacies. Starting with a vision to revolutionize overland transportation in a developing nation, he established Corona Trade & Transport Ltd. with an unwavering commitment to reliability and customer trust.",
            "Under his visionary leadership, Corona Group expanded systematically across vital sectors of the national economy — shipping agency services in 1990, customs brokerage in 1997, coastal vessel operations in 2008, international trade in 2010, and media production in 2014.",
            "His guiding philosophy — that business success must be built on honesty, discipline, and national contribution — continues to inspire every enterprise under the Corona banner today.",
          ],
          image: "/Founder_Image.webp",
        },
        groupStats: [
          { value: "1987", suffix: "", label: "Founded", icon: "Landmark" },
          { value: "6", suffix: "+", label: "Operational Divisions", icon: "Building2" },
          { value: "37+", suffix: "", label: "Years of Excellence", icon: "TrendingUp" },
          { value: "National", suffix: "", label: "Footprint", icon: "MapPin" },
        ],
        visionMission: { ...VISION_MISSION },
        sisterConcerns: SISTER_CONCERNS.map((sc) => ({
          id: sc.id,
          name: sc.name,
          established: sc.established,
          tagline: sc.tagline,
          description: sc.description,
          strengths: [...sc.strengths],
          icon: sc.id === "corona-trade-transport" ? "Truck" : sc.id === "far-eastern-shipping" ? "Ship" : sc.id === "corona-associates" ? "ShieldCheck" : sc.id === "corona-shipping-lines" ? "Anchor" : sc.id === "sohel-trading" ? "Globe" : "Video",
          color: sc.color,
        })),
        officeLocations: [...OFFICE_LOCATIONS],
      },
      executiveMessages: {
        mdMessage: {
          title: "Message from the Managing Director",
          name: "Syed Al Faruk",
          role: "Managing Director",
          image: "/image-01.webp",
          quote: "Our vision is to build communities where trust, transparency, and sustainable development form the foundation of every plot we hand over.",
          fullText:
            "Corona Properties Limited was born out of a desire to redefine the real estate experience in Bangladesh. Having observed the anxieties families encounter when navigating land ownership, our commitment is simple: 100% legal veracity, unmatched infrastructure, and lifetime client partnership.",
        },
        chairmanMessage: {
          title: "Message from the Chairman",
          name: "Kazi Rafiqul Islam",
          role: "Chairman & Founder",
          image: "/image-02.webp",
          quote: "From our founding in 1987 across the Corona Group, integrity and discipline have been our only compass.",
          fullText:
            "Over nearly four decades, the Corona banner has expanded into shipping, logistics, and trading. With Corona Properties, we carry forward this legacy into land banking and urban planning, ensuring every land parcel we develop stands as a timeless asset for generations to come.",
        },
      },
      coreValues: {
        eyebrow: "What Drives Us",
        heading: "Our Core Values",
        subtitle: "The principles that guide every decision, every transaction, and every relationship at Corona Properties.",
        values: [
          { title: "Integrity", description: "Every transaction is transparent, every document is authentic. We build trust through honesty, not just beautiful land.", icon: "ShieldCheck" },
          { title: "Excellence", description: "From site selection to handover, we pursue the highest standard of quality in every detail of land development.", icon: "TrendingUp" },
          { title: "Client First", description: "Your goals are our goals. We measure our success by the satisfaction and prosperity of the families we serve.", icon: "Handshake" },
          { title: "Innovation", description: "We embrace modern planning, sustainable infrastructure, and forward-thinking design to create lasting value.", icon: "Building2" },
        ],
      },
      journey: {
        eyebrow: "Our Journey",
        heading: "Milestones That Define Us",
        subtitle: "From a single office in Gulshan to becoming one of Bangladesh's most trusted land developers.",
        milestones: [
          { year: "Inception", title: "The Beginning", text: "Corona Properties launched with a vision to bring transparency to Bangladesh's land market." },
          { year: "Growth", title: "First 100 Families", text: "Crossed our first 100 happy families with our Gulshan and Banani projects." },
          { year: "Expansion", title: "Expansion", text: "Expanded to Uttara, Bashundhara, and Baridhara with premium community projects." },
          { year: "Scale", title: "500+ Acres", text: "Crossed 500 acres of developed land with 1,000+ satisfied property owners." },
          { year: "Future", title: "Leading the Future", text: "Today, Corona Properties is one of the most trusted names in residential land development." },
        ],
      },
      visionMission: {
        mission: "To democratize access to premium, legally-secure residential land in Bangladesh — making world-class land investment available to every family, at home and abroad.",
        vision: "To be South Asia's most trusted land developer, recognized globally for legal integrity, infrastructure excellence, and unwavering commitment to client success.",
      },
      leadCapture: {
        eyebrow: "Get Started",
        heading: "Begin Your Land Ownership Journey",
        description: "Ready to invest in premium residential land? Our team will provide personalized recommendations and guide you through every step — from plot selection to registration.",
        bullets: [
          "Free consultation with land experts",
          "Curated property recommendations",
          "Fully documented plots",
          "Zero obligation, transparent process",
        ],
        formTitle: "Request a Consultation",
        formSubtitle: "Share your details and our specialists will reach out within 24 hours with curated options tailored to your needs.",
      },
      aboutPage: {
        heroTitle: "Crafting Legacies, One Plot at a Time",
        heroSubtitle: "Discover the story, values, and vision behind Bangladesh's most trusted residential land developer.",
        heroBgImage: "/image-04.webp",
        managementEyebrow: "Leadership",
        managementHeading: "Guided by Visionary Leadership",
        managementDescription: "Read the messages from our Managing Director and Chairman on how Corona Properties is building communities defined by integrity, planning excellence, and enduring value.",
        managementButtonText: "Read Management Messages",
        managementButtonLink: "/team",
      },
      projectsPage: {
        heroTitle: "Our Projects",
        heroSubtitle: "Master-planned residential townships engineered for generational value, serene living, and world-class infrastructure.",
        heroBgImage: "/image-01.webp",
        leadEyebrow: "Schedule a Private Tour",
        leadHeading: "Experience Maple Leaf Garden City Firsthand",
        leadDescription: "Visit our flagship project in Purbachal or schedule a private consultation at our Gulshan office. Our specialists will walk you through available plots, master plans, and flexible ownership options.",
        leadBullets: [
          "Guided on-site tour of Purbachal project",
          "Complete legal & title deed review",
          "Customized installment & payment plans",
          "Dedicated assistance for NRB investors",
        ],
        formTitle: "Book a Project Consultation",
        formSubtitle: "Share your contact details and preferred plot size — our project advisor will reach out within 24 hours.",
      },
      propertiesPage: {
        heroTitle: "Our Properties",
        heroSubtitle: "Explore our curated collection of residential plots across Dhaka's most prestigious locations. Every plot is legally verified.",
        heroBgImage: "/image-02.webp",
        leadEyebrow: "Need Guidance?",
        leadHeading: "Let Our Experts Find Your Ideal Plot",
        leadDescription: "Not sure which property aligns best with your goals? Tell us what you're looking for and our land specialists will curate a personalized shortlist — including exclusive off-market plots.",
        leadBullets: [
          "Access to off-market and upcoming launches",
          "Price comparison & ROI projection reports",
          "Free site visit with our property advisors",
          "Complete legal & documentation assistance",
        ],
        formTitle: "Get Personalized Recommendations",
        formSubtitle: "Share your preferences and budget — we'll get back to you within 24 hours.",
      },
      servicesPage: {
        heroTitle: "Comprehensive Land Solutions",
        heroSubtitle: "From plot selection and legal verification to construction advisory and lifetime property management — we handle everything.",
        heroBgImage: "/image-05.webp",
        sectionEyebrow: "What We Offer",
        sectionTitle: "End-to-End Land Services",
        sectionSubtitle: "Every service is designed to make your land ownership journey seamless, transparent, and rewarding.",
        promiseEyebrow: "The Corona Promise",
        promiseHeading: "White-Glove Service, End to End",
        promiseDescription: "At Corona Properties, our relationship doesn't end at the sale. We provide a complete ecosystem of services to ensure your land investment appreciates in value and brings you peace of mind for generations.",
        promiseImage: "/image-06.webp",
        promiseBullets: [
          "Dedicated relationship manager for every client",
          "Zero hidden fees — complete cost breakdown upfront",
          "In-house legal team with 100% clean record",
          "NRB-friendly remote transaction capability",
          "Lifetime after-sales support included",
          "Partner bank financing facilitation",
        ],
      },
      teamPage: {
        heroTitle: "Management Messages",
        heroSubtitle: "Insights, vision, and commitment from the leadership steering Corona Properties Limited.",
        heroBgImage: "/image-03.webp",
        sectionEyebrow: "Leadership Perspective",
        sectionTitle: "Words From the Top",
        sectionSubtitle: "Our leadership's unwavering pledge to legal transparency, modern urban planning, and generational trust.",
        ctaEyebrow: "Connect With Us",
        ctaHeading: "Have Questions for Our Advisory Team?",
        ctaDescription: "Schedule a private consultation at our Gulshan office or arrange a guided site visit to Maple Leaf Garden City.",
      },
      galleryPage: {
        heroTitle: "Project Gallery",
        heroSubtitle: "Take a visual tour through our developed communities, aerial views, and master-planned plot layouts across Dhaka.",
        heroBgImage: "/image-01.webp",
        leadEyebrow: "See It In Person",
        leadHeading: "Nothing Compares to Visiting in Person",
        leadDescription: "Photos capture only a fraction of the experience. Book a complimentary guided site visit and walk the wide roads, green corridors, and premium plots yourself.",
        leadBullets: [
          "Complimentary guided tour with transport",
          "Walk the actual plot boundaries",
          "Review on-site infrastructure progress",
          "Meet our project engineers in person",
        ],
        formTitle: "Book a Free Site Visit",
        formSubtitle: "Choose a convenient day and our team will arrange everything for your visit.",
      },
      blogPage: {
        heroTitle: "Insights & Guides",
        heroSubtitle: "Expert perspectives on land investment, legal documentation, market trends, and smart property decisions in Bangladesh.",
        heroBgImage: "/image-04.webp",
        leadEyebrow: "Expert Advice",
        leadHeading: "Have Questions About Land Investment?",
        leadDescription: "Speak directly with our research and advisory team for personalized guidance on market trends, legal due diligence, and high-growth corridors in Dhaka.",
        leadBullets: [
          "One-on-one session with market analysts",
          "Custom ROI & appreciation forecasts",
          "NRB investment & repatriation guidance",
          "Legal & mutation checklist walkthrough",
        ],
        formTitle: "Speak With an Advisor",
        formSubtitle: "Drop your details below and we'll schedule a complimentary advisory call.",
      },
      contactPage: {
        heroTitle: "Let's Start a Conversation",
        heroSubtitle: "Whether you're ready to invest, want to book a site visit, or simply have questions — our team is here to help.",
        heroBgImage: "/image-06.webp",
        mapEyebrow: "Our Location",
        mapTitle: "Visit Our Gulshan Office",
        mapSubtitle: "Conveniently located in Niketon, Gulshan 01 — drop by for a coffee and a personal consultation with our land specialists.",
        faqEyebrow: "Common Questions",
        faqTitle: "Frequently Asked Questions",
        faqSubtitle: "Quick answers to the questions we hear most from prospective buyers and investors.",
      },
    };

    // 21. Initialize Unified Categories across all scopes
    this.categories = [
      // Property Types / Categories
      { id: "cat-pt-1", name: "Exclusive", nameBn: "এক্সক্লুসিভ", slug: "exclusive", scope: "property_type", description: "Flagship & ultra-prime master-planned enclaves", color: "#c9a96e", sortOrder: 1, isActive: true },
      { id: "cat-pt-2", name: "Premium", nameBn: "প্রিমিয়াম", slug: "premium", scope: "property_type", description: "High-end residential plots in prime corridors", color: "#0a1a3e", sortOrder: 2, isActive: true },
      { id: "cat-pt-3", name: "Standard", nameBn: "স্ট্যান্ডার্ড", slug: "standard", scope: "property_type", description: "Well-connected family residential plots", color: "#10b981", sortOrder: 3, isActive: true },
      { id: "cat-pt-4", name: "Investment", nameBn: "ইনভেস্টমেন্ট", slug: "investment", scope: "property_type", description: "High-appreciation land banking opportunities", color: "#3b82f6", sortOrder: 4, isActive: true },
      { id: "cat-pt-5", name: "Commercial", nameBn: "কমার্শিয়াল", slug: "commercial", scope: "property_type", description: "Commercial boulevard & mixed-use plots", color: "#8b5cf6", sortOrder: 5, isActive: true },

      // Property Areas / Locations
      { id: "cat-pa-1", name: "Purbachal", nameBn: "পূর্বাচল", slug: "purbachal", scope: "property_area", description: "Purbachal New Town & adjacent corridors", sortOrder: 1, isActive: true },
      { id: "cat-pa-2", name: "Gulshan", nameBn: "গুলশান", slug: "gulshan", scope: "property_area", description: "Gulshan diplomatic & residential zone", sortOrder: 2, isActive: true },
      { id: "cat-pa-3", name: "Banani", nameBn: "বনানী", slug: "banani", scope: "property_area", description: "Banani prime urban neighborhood", sortOrder: 3, isActive: true },
      { id: "cat-pa-4", name: "Baridhara", nameBn: "বারিধারা", slug: "baridhara", scope: "property_area", description: "Baridhara diplomatic & J Block corridor", sortOrder: 4, isActive: true },
      { id: "cat-pa-5", name: "Uttara", nameBn: "উত্তরা", slug: "uttara", scope: "property_area", description: "Uttara model town & metro corridor", sortOrder: 5, isActive: true },
      { id: "cat-pa-6", name: "Dhanmondi", nameBn: "ধানমন্ডি", slug: "dhanmondi", scope: "property_area", description: "Dhanmondi heritage residential zone", sortOrder: 6, isActive: true },
      { id: "cat-pa-7", name: "Bashundhara", nameBn: "বসুন্ধরা", slug: "bashundhara", scope: "property_area", description: "Bashundhara Residential Area", sortOrder: 7, isActive: true },

      // Property / Project Statuses
      { id: "cat-ps-1", name: "Available", slug: "available", scope: "property_status", description: "Plots open for immediate reservation", color: "#10b981", sortOrder: 1, isActive: true },
      { id: "cat-ps-2", name: "Ongoing", slug: "ongoing", scope: "property_status", description: "Infrastructure development actively in progress", color: "#3b82f6", sortOrder: 2, isActive: true },
      { id: "cat-ps-3", name: "New Launch", slug: "new-launch", scope: "property_status", description: "Newly unveiled phase or enclave", color: "#c9a96e", sortOrder: 3, isActive: true },
      { id: "cat-ps-4", name: "Upcoming", slug: "upcoming", scope: "property_status", description: "Pre-launch registration open", color: "#8b5cf6", sortOrder: 4, isActive: true },
      { id: "cat-ps-5", name: "Almost Sold Out", slug: "almost-sold-out", scope: "property_status", description: "Limited final plots remaining", color: "#f59e0b", sortOrder: 5, isActive: true },
      { id: "cat-ps-6", name: "Completed", slug: "completed", scope: "property_status", description: "Development completed and ready for handover", color: "#059669", sortOrder: 6, isActive: true },
      { id: "cat-ps-7", name: "Sold Out", slug: "sold-out", scope: "property_status", description: "All plots allocated", color: "#ef4444", sortOrder: 7, isActive: true },

      // Gallery Categories
      { id: "cat-gal-1", name: "Residential", slug: "residential", scope: "gallery", description: "Developed residential avenues, entrances, and green parks", sortOrder: 1, isActive: true },
      { id: "cat-gal-2", name: "Aerial Views", slug: "aerial-views", scope: "gallery", description: "Drone & panoramic perspectives of project sites", sortOrder: 2, isActive: true },
      { id: "cat-gal-3", name: "Layouts", slug: "layouts", scope: "gallery", description: "Master plans, plot grids, and architectural layouts", sortOrder: 3, isActive: true },
      { id: "cat-gal-4", name: "Infrastructure", slug: "infrastructure", scope: "gallery", description: "On-site roadworks, utilities, and civic development", sortOrder: 4, isActive: true },
      { id: "cat-gal-5", name: "Video Tours", slug: "video-tours", scope: "gallery", description: "Drone & cinematic video tours of our premium developments", sortOrder: 5, isActive: true },

      // Blog Categories
      { id: "cat-blog-1", name: "Investment Guide", slug: "investment-guide", scope: "blog", description: "ROI analysis and land buying guides", sortOrder: 1, isActive: true },
      { id: "cat-blog-2", name: "Legal", slug: "legal", scope: "blog", description: "Title deed, mutation, and regulatory insights", sortOrder: 2, isActive: true },
      { id: "cat-blog-3", name: "Market Trends", slug: "market-trends", scope: "blog", description: "Dhaka real estate market reports & forecasts", sortOrder: 3, isActive: true },
      { id: "cat-blog-4", name: "Market Insights", slug: "market-insights", scope: "blog", description: "In-depth research by Corona analysts", sortOrder: 4, isActive: true },
      { id: "cat-blog-5", name: "Architecture", slug: "architecture", scope: "blog", description: "Urban design and master-planning spotlights", sortOrder: 5, isActive: true },
      { id: "cat-blog-6", name: "Company News", slug: "company-news", scope: "blog", description: "Project milestones, handovers, and announcements", sortOrder: 6, isActive: true },

      // FAQ Categories
      { id: "cat-faq-1", name: "Legal & Title", slug: "legal-title", scope: "faq", description: "Questions about deeds, mutation, and verification", sortOrder: 1, isActive: true },
      { id: "cat-faq-2", name: "Financing", slug: "financing", scope: "faq", description: "Installments, booking advances, and bank loans", sortOrder: 2, isActive: true },
      { id: "cat-faq-3", name: "NRI / Expat", slug: "nri-expat", scope: "faq", description: "Remote buying & management for overseas Bangladeshis", sortOrder: 3, isActive: true },
      { id: "cat-faq-4", name: "After Sales", slug: "after-sales", scope: "faq", description: "Handover, construction support, and property care", sortOrder: 4, isActive: true },
      { id: "cat-faq-5", name: "Site Visit", slug: "site-visit", scope: "faq", description: "Scheduling guided tours to our project sites", sortOrder: 5, isActive: true },
      { id: "cat-faq-6", name: "General", slug: "general", scope: "faq", description: "General inquiries about Corona Properties", sortOrder: 6, isActive: true },

      // Amenity Categories
      { id: "cat-am-1", name: "Healthcare", slug: "healthcare", scope: "amenity", description: "Hospitals, clinics, and medical facilities", sortOrder: 1, isActive: true },
      { id: "cat-am-2", name: "Civic", slug: "civic", scope: "amenity", description: "Schools, mosques, community centers, and conventions", sortOrder: 2, isActive: true },
      { id: "cat-am-3", name: "Recreation", slug: "recreation", scope: "amenity", description: "Clubs, sports complexes, playgrounds, and leisure", sortOrder: 3, isActive: true },
      { id: "cat-am-4", name: "Nature", slug: "nature", scope: "amenity", description: "Lakes, parks, botanical gardens, and green belts", sortOrder: 4, isActive: true },
      { id: "cat-am-5", name: "Commercial", slug: "commercial", scope: "amenity", description: "Shopping arcades, markets, and business zones", sortOrder: 5, isActive: true },
      { id: "cat-am-6", name: "Infrastructure", slug: "infrastructure", scope: "amenity", description: "Wide avenues, underground utilities, water & power", sortOrder: 6, isActive: true },
      { id: "cat-am-7", name: "Security", slug: "security", scope: "amenity", description: "24/7 gated security, CCTV surveillance, and patrols", sortOrder: 7, isActive: true },

      // Service Categories
      { id: "cat-srv-1", name: "Core Development", slug: "core-development", scope: "service", description: "Township planning & residential land development", sortOrder: 1, isActive: true },
      { id: "cat-srv-2", name: "Legal & Registry", slug: "legal-registry", scope: "service", description: "Title verification, mutation, and deed documentation", sortOrder: 2, isActive: true },
      { id: "cat-srv-3", name: "Advisory & Care", slug: "advisory-care", scope: "service", description: "Investment advisory, NRB concierge, and after-sales support", sortOrder: 3, isActive: true },
    ];

    // 22. Initialize Custom Fields
    this.customFields = [
      { id: "f-1", name: "road_facing", label: "Road Facing Direction", type: "select", options: ["North", "South", "East", "West", "Corner Double Road"], isRequired: true },
      { id: "f-2", name: "soil_test_certified", label: "Soil Test Certified", type: "boolean", isRequired: true },
      { id: "f-3", name: "distance_to_metro", label: "Distance to Metro Rail (km)", type: "number", isRequired: false },
      { id: "f-4", name: "mutation_paper_ready", label: "Mutation Paper Ready", type: "boolean", isRequired: true },
    ];

    this.isInitialized = true;
  }

  // --- CRUD OPERATIONS ---
  getProperties() {
    return this.properties;
  }

  getPropertyById(idOrSlug: string) {
    return this.properties.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  }

  saveProperty(prop: Partial<AdminProperty> & { title: string; location: string; price: string }) {
    const existingIndex = this.properties.findIndex((p) => p.id === prop.id || p.slug === prop.slug);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const old = this.properties[existingIndex];
      const updated: AdminProperty = {
        ...old,
        ...prop,
        updatedAt: now,
      } as AdminProperty;
      this.properties[existingIndex] = updated;
      this.logAction("UPDATE", "property", updated.id, old, updated);
      return updated;
    } else {
      const id = `prop-${Date.now()}`;
      const slug = prop.slug || prop.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const created: AdminProperty = {
        id,
        slug,
        title: prop.title,
        titleBn: prop.titleBn || prop.title,
        tagline: prop.tagline || "",
        taglineBn: prop.taglineBn || "",
        location: prop.location,
        area: prop.area || prop.location,
        price: prop.price,
        priceValue: prop.priceValue || 0,
        type: prop.type || "Exclusive",
        status: prop.status || "Available",
        approvalStatus: prop.approvalStatus || "Published",
        size: prop.size || "5 Katha",
        featuredImage: prop.featuredImage || "/image-06.webp",
        gallery: prop.gallery || ["/image-02.webp"],
        overview: prop.overview || "",
        overviewBn: prop.overviewBn || "",
        highlights: prop.highlights || [],
        features: prop.features || [],
        specs: prop.specs || [],
        plotTypes: prop.plotTypes || [],
        coordinates: prop.coordinates || { lat: 23.86489, lng: 90.5647 },
        isFlagship: !!prop.isFlagship,
        isFeatured: !!prop.isFeatured,
        assignedAgentId: prop.assignedAgentId || "agent-1",
        createdAt: now,
        updatedAt: now,
      };
      this.properties.unshift(created);
      this.logAction("CREATE", "property", created.id, undefined, created);
      return created;
    }
  }

  deleteProperty(id: string) {
    const idx = this.properties.findIndex((p) => p.id === id);
    if (idx >= 0) {
      const old = this.properties[idx];
      this.properties.splice(idx, 1);
      this.logAction("DELETE", "property", id, old, undefined);
      return true;
    }
    return false;
  }

  bulkUpdateProperties(ids: string[], updates: Partial<AdminProperty>) {
    ids.forEach((id) => {
      const idx = this.properties.findIndex((p) => p.id === id);
      if (idx >= 0) {
        this.properties[idx] = { ...this.properties[idx], ...updates, updatedAt: new Date().toISOString() };
      }
    });
    this.logAction("BULK_UPDATE", "property", ids.join(","), undefined, updates);
  }

  getLeads() {
    return this.leads;
  }

  getLeadById(id: string) {
    return this.leads.find((l) => l.id === id);
  }

  saveLead(lead: Partial<AdminLead> & { name: string; email: string; phone: string }) {
    const now = new Date().toISOString();
    const existingIndex = this.leads.findIndex((l) => l.id === lead.id);

    if (existingIndex >= 0) {
      const old = this.leads[existingIndex];
      const updated: AdminLead = { ...old, ...lead, updatedAt: now } as AdminLead;
      this.leads[existingIndex] = updated;
      this.logAction("UPDATE", "lead", updated.id, old, updated);
      return updated;
    } else {
      const isDuplicate = this.leads.some((l) => l.email.toLowerCase() === lead.email.toLowerCase() || l.phone === lead.phone);
      const created: AdminLead = {
        id: `lead-${Date.now()}`,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: lead.source || "Website Form",
        propertyId: lead.propertyId,
        propertyTitle: lead.propertyTitle || "Maple Leaf Garden City",
        stageId: lead.stageId || "stage-1",
        assignedAgentId: lead.assignedAgentId || "agent-1",
        priority: lead.priority || "Medium",
        budget: lead.budget || "BDT 50 Lakh",
        score: lead.score || 70,
        tags: lead.tags || ["New Lead"],
        nextFollowUp: lead.nextFollowUp,
        isDuplicate,
        status: "Active",
        message: lead.message || "",
        createdAt: now,
        updatedAt: now,
      };
      this.leads.unshift(created);
      this.addLeadActivity({
        leadId: created.id,
        actorName: "System",
        type: "note",
        title: "Lead Created",
        description: `New lead captured via ${created.source}`,
      });
      this.logAction("CREATE", "lead", created.id, undefined, created);
      return created;
    }
  }

  updateLeadStage(leadId: string, newStageId: string, actorName = "Admin User") {
    const lead = this.leads.find((l) => l.id === leadId);
    if (lead) {
      const oldStage = this.leadStages.find((s) => s.id === lead.stageId)?.name || lead.stageId;
      const newStage = this.leadStages.find((s) => s.id === newStageId)?.name || newStageId;
      const old = { ...lead };
      lead.stageId = newStageId;
      lead.updatedAt = new Date().toISOString();

      this.addLeadActivity({
        leadId,
        actorName,
        type: "stage_change",
        title: `Stage changed to ${newStage}`,
        description: `Moved from ${oldStage} → ${newStage}`,
      });
      this.logAction("STAGE_CHANGE", "lead", leadId, old, lead);
      return lead;
    }
    return null;
  }

  deleteLead(id: string) {
    const idx = this.leads.findIndex((l) => l.id === id);
    if (idx >= 0) {
      const old = this.leads[idx];
      this.leads.splice(idx, 1);
      this.logAction("DELETE", "lead", id, old, undefined);
      return true;
    }
    return false;
  }

  addLeadActivity(act: Omit<LeadActivity, "id" | "createdAt">) {
    const created: LeadActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      leadId: act.leadId,
      actorName: act.actorName || "Admin",
      type: act.type,
      title: act.title,
      description: act.description,
      metadata: act.metadata,
      createdAt: new Date().toISOString(),
    };
    this.leadActivities.unshift(created);
    return created;
  }

  getLeadActivities(leadId: string) {
    return this.leadActivities.filter((a) => a.leadId === leadId);
  }

  getStages() {
    return this.leadStages.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getMedia() {
    return this.media;
  }

  addMediaItem(item: Omit<MediaItem, "id" | "createdAt">) {
    const created: MediaItem = {
      ...item,
      id: `media-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.media.unshift(created);
    this.logAction("UPLOAD", "media", created.id, undefined, created);
    return created;
  }

  deleteMediaItem(id: string) {
    const idx = this.media.findIndex((m) => m.id === id);
    if (idx >= 0) {
      const item = this.media[idx];
      this.media.splice(idx, 1);
      this.logAction("DELETE", "media", id, item, undefined);
      return true;
    }
    return false;
  }

  updateMediaAltText(id: string, altText: string) {
    const item = this.media.find((m) => m.id === id);
    if (item) {
      item.altText = altText;
      return item;
    }
    return null;
  }

  getSocialLinks() {
    return this.socialLinks.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  saveSocialLink(link: Partial<SocialLink> & { platform: string; label: string; url: string }) {
    const idx = this.socialLinks.findIndex((s) => s.id === link.id);
    if (idx >= 0) {
      this.socialLinks[idx] = { ...this.socialLinks[idx], ...link };
      return this.socialLinks[idx];
    } else {
      const created: SocialLink = {
        id: `soc-${Date.now()}`,
        platform: link.platform,
        label: link.label,
        url: link.url,
        iconName: link.iconName || link.platform,
        openNewTab: link.openNewTab !== false,
        isActive: link.isActive !== false,
        sortOrder: this.socialLinks.length + 1,
      };
      this.socialLinks.push(created);
      return created;
    }
  }

  reorderSocialLinks(orderedIds: string[]) {
    orderedIds.forEach((id, index) => {
      const link = this.socialLinks.find((s) => s.id === id);
      if (link) link.sortOrder = index + 1;
    });
  }

  deleteSocialLink(id: string) {
    const idx = this.socialLinks.findIndex((s) => s.id === id);
    if (idx >= 0) {
      this.socialLinks.splice(idx, 1);
      return true;
    }
    return false;
  }

  getRedirects() {
    return this.redirects;
  }

  saveRedirect(r: Partial<RedirectRule> & { sourcePath: string; targetPath: string }) {
    const idx = this.redirects.findIndex((red) => red.id === r.id || red.sourcePath === r.sourcePath);
    if (idx >= 0) {
      this.redirects[idx] = { ...this.redirects[idx], ...r };
      return this.redirects[idx];
    } else {
      const created: RedirectRule = {
        id: `red-${Date.now()}`,
        sourcePath: r.sourcePath,
        targetPath: r.targetPath,
        statusCode: r.statusCode || 301,
        isActive: r.isActive !== false,
        hitCount: 0,
        createdAt: new Date().toISOString(),
      };
      this.redirects.unshift(created);
      return created;
    }
  }

  deleteRedirect(id: string) {
    const idx = this.redirects.findIndex((r) => r.id === id);
    if (idx >= 0) {
      this.redirects.splice(idx, 1);
      return true;
    }
    return false;
  }

  getCustomScripts() {
    return this.customScripts;
  }

  saveCustomScript(s: Partial<CustomScript> & { name: string; placement: "head" | "body_end"; code: string }) {
    const idx = this.customScripts.findIndex((cs) => cs.id === s.id);
    if (idx >= 0) {
      this.customScripts[idx] = { ...this.customScripts[idx], ...s };
      return this.customScripts[idx];
    } else {
      const created: CustomScript = {
        id: `script-${Date.now()}`,
        name: s.name,
        placement: s.placement,
        code: s.code,
        isActive: s.isActive !== false,
        createdBy: "Super Admin",
        createdAt: new Date().toISOString(),
      };
      this.customScripts.push(created);
      return created;
    }
  }

  deleteCustomScript(id: string) {
    const idx = this.customScripts.findIndex((cs) => cs.id === id);
    if (idx >= 0) {
      this.customScripts.splice(idx, 1);
      return true;
    }
    return false;
  }

  getAuditLogs() {
    return this.auditLogs;
  }

  logAction(action: string, entityType: string, entityId?: string, oldValues?: any, newValues?: any) {
    const item: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      actorEmail: "superadmin@coronaproperties.com",
      action,
      entityType,
      entityId,
      oldValues,
      newValues,
      ipAddress: "127.0.0.1",
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(item);
  }

  getRoles() {
    return this.roles;
  }

  getAgents() {
    return this.agents;
  }

  getSettings() {
    return this.siteSettings;
  }

  updateSettings(key: string, value: any) {
    this.siteSettings[key] = { ...this.siteSettings[key], ...value };
    this.logAction("UPDATE_SETTINGS", "settings", key, undefined, value);
    return this.siteSettings[key];
  }

  // --- BLOG POSTS CRUD ---
  getBlogPosts() {
    return this.blogPosts;
  }

  getBlogPostByIdOrSlug(idOrSlug: string) {
    return this.blogPosts.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
  }

  saveBlogPost(post: Partial<AdminBlogPost> & { title: string; excerpt: string; content: string }) {
    const idx = this.blogPosts.findIndex((b) => b.id === post.id || b.slug === post.slug);
    const now = new Date().toISOString();
    if (idx >= 0) {
      const old = this.blogPosts[idx];
      const updated: AdminBlogPost = {
        ...old,
        ...post,
        updatedAt: now,
      } as AdminBlogPost;
      this.blogPosts[idx] = updated;
      this.logAction("UPDATE", "blog_post", updated.id, old, updated);
      return updated;
    } else {
      const id = post.id || `post-${Date.now()}`;
      const slug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const created: AdminBlogPost = {
        id,
        slug,
        title: post.title,
        titleBn: post.titleBn || null,
        excerpt: post.excerpt,
        excerptBn: post.excerptBn || null,
        content: post.content,
        contentBn: post.contentBn || null,
        category: post.category || "Market Insights",
        author: post.author || "Corona Research Desk",
        authorRole: post.authorRole || "Editorial Team",
        image: post.image || "/image-01.webp",
        readTime: post.readTime || "5 min read",
        status: post.status || "Published",
        publishedAt: post.publishedAt || now,
        createdAt: now,
        updatedAt: now,
      };
      this.blogPosts.unshift(created);
      this.logAction("CREATE", "blog_post", created.id, undefined, created);
      return created;
    }
  }

  deleteBlogPost(id: string) {
    const idx = this.blogPosts.findIndex((b) => b.id === id);
    if (idx >= 0) {
      const old = this.blogPosts[idx];
      this.blogPosts.splice(idx, 1);
      this.logAction("DELETE", "blog_post", id, old, undefined);
      return true;
    }
    return false;
  }

  // --- TEAM MEMBERS (LEADERSHIP) CRUD ---
  getTeamMembers() {
    return this.teamMembers.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getTeamMemberById(id: string) {
    return this.teamMembers.find((m) => m.id === id);
  }

  saveTeamMember(member: Partial<AdminTeamMember> & { name: string; role: string; bio: string }) {
    const idx = this.teamMembers.findIndex((m) => m.id === member.id);
    if (idx >= 0) {
      const old = this.teamMembers[idx];
      const updated: AdminTeamMember = { ...old, ...member };
      this.teamMembers[idx] = updated;
      this.logAction("UPDATE", "team_member", updated.id, old, updated);
      return updated;
    } else {
      const created: AdminTeamMember = {
        id: member.id || `team-${Date.now()}`,
        name: member.name,
        role: member.role,
        bio: member.bio,
        image: member.image || "/image-01.webp",
        sortOrder: member.sortOrder || this.teamMembers.length + 1,
        createdAt: new Date().toISOString(),
      };
      this.teamMembers.push(created);
      this.logAction("CREATE", "team_member", created.id, undefined, created);
      return created;
    }
  }

  deleteTeamMember(id: string) {
    const idx = this.teamMembers.findIndex((m) => m.id === id);
    if (idx >= 0) {
      const old = this.teamMembers[idx];
      this.teamMembers.splice(idx, 1);
      this.logAction("DELETE", "team_member", id, old, undefined);
      return true;
    }
    return false;
  }

  reorderTeamMembers(ids: string[]) {
    ids.forEach((id, index) => {
      const member = this.teamMembers.find((m) => m.id === id);
      if (member) member.sortOrder = index + 1;
    });
    this.logAction("REORDER", "team_member", "multiple", undefined, ids);
    return true;
  }

  // --- TESTIMONIALS CRUD ---
  getTestimonials() {
    return this.testimonials;
  }

  getTestimonialById(id: string) {
    return this.testimonials.find((t) => t.id === id);
  }

  saveTestimonial(t: Partial<AdminTestimonial> & { name: string; role: string; quote: string }) {
    const idx = this.testimonials.findIndex((item) => item.id === t.id);
    if (idx >= 0) {
      const old = this.testimonials[idx];
      const updated: AdminTestimonial = { ...old, ...t };
      this.testimonials[idx] = updated;
      this.logAction("UPDATE", "testimonial", updated.id, old, updated);
      return updated;
    } else {
      const created: AdminTestimonial = {
        id: t.id || `test-${Date.now()}`,
        name: t.name,
        role: t.role,
        quote: t.quote,
        rating: t.rating ?? 5,
        image: t.image || "/image-01.webp",
        isActive: t.isActive !== false,
        createdAt: new Date().toISOString(),
      };
      this.testimonials.unshift(created);
      this.logAction("CREATE", "testimonial", created.id, undefined, created);
      return created;
    }
  }

  deleteTestimonial(id: string) {
    const idx = this.testimonials.findIndex((t) => t.id === id);
    if (idx >= 0) {
      const old = this.testimonials[idx];
      this.testimonials.splice(idx, 1);
      this.logAction("DELETE", "testimonial", id, old, undefined);
      return true;
    }
    return false;
  }

  // --- SERVICES CRUD ---
  getServices() {
    return this.services.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getServiceById(id: string) {
    return this.services.find((s) => s.id === id);
  }

  saveService(s: Partial<AdminService> & { title: string; description: string }) {
    const idx = this.services.findIndex((item) => item.id === s.id);
    if (idx >= 0) {
      const old = this.services[idx];
      const updated: AdminService = { ...old, ...s };
      this.services[idx] = updated;
      this.logAction("UPDATE", "service", updated.id, old, updated);
      return updated;
    } else {
      const created: AdminService = {
        id: s.id || `svc-${Date.now()}`,
        title: s.title,
        iconName: s.iconName || "Building2",
        description: s.description,
        features: s.features || [],
        sortOrder: s.sortOrder || this.services.length + 1,
      };
      this.services.push(created);
      this.logAction("CREATE", "service", created.id, undefined, created);
      return created;
    }
  }

  deleteService(id: string) {
    const idx = this.services.findIndex((s) => s.id === id);
    if (idx >= 0) {
      const old = this.services[idx];
      this.services.splice(idx, 1);
      this.logAction("DELETE", "service", id, old, undefined);
      return true;
    }
    return false;
  }

  // --- FAQS CRUD ---
  getFaqs() {
    return this.faqs.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  saveFaq(faq: Partial<AdminFaq> & { question: string; answer: string }) {
    const idx = this.faqs.findIndex((f) => f.id === faq.id);
    if (idx >= 0) {
      const old = this.faqs[idx];
      const updated: AdminFaq = { ...old, ...faq };
      this.faqs[idx] = updated;
      this.logAction("UPDATE", "faq", updated.id, old, updated);
      return updated;
    } else {
      const created: AdminFaq = {
        id: faq.id || `faq-${Date.now()}`,
        question: faq.question,
        answer: faq.answer,
        category: faq.category || "General",
        sortOrder: faq.sortOrder || this.faqs.length + 1,
      };
      this.faqs.push(created);
      this.logAction("CREATE", "faq", created.id, undefined, created);
      return created;
    }
  }

  deleteFaq(id: string) {
    const idx = this.faqs.findIndex((f) => f.id === id);
    if (idx >= 0) {
      const old = this.faqs[idx];
      this.faqs.splice(idx, 1);
      this.logAction("DELETE", "faq", id, old, undefined);
      return true;
    }
    return false;
  }

  // --- PAGES (LEGAL & CONTENT) CRUD ---
  getPages() {
    return this.pages;
  }

  getPageBySlug(slug: string) {
    return this.pages.find((p) => p.slug === slug);
  }

  savePage(page: Partial<AdminPage> & { title: string; slug: string }) {
    const idx = this.pages.findIndex((p) => p.id === page.id || p.slug === page.slug);
    const now = new Date().toISOString();
    if (idx >= 0) {
      const old = this.pages[idx];
      const updated: AdminPage = {
        ...old,
        ...page,
        updatedAt: now,
      };
      this.pages[idx] = updated;
      this.logAction("UPDATE", "page", updated.id, old, updated);
      return updated;
    } else {
      const created: AdminPage = {
        id: page.id || `page-${Date.now()}`,
        slug: page.slug,
        title: page.title,
        content: page.content || "",
        isPublished: page.isPublished !== false,
        lastUpdated: page.lastUpdated || "Recently Updated",
        createdAt: now,
        updatedAt: now,
      };
      this.pages.push(created);
      this.logAction("CREATE", "page", created.id, undefined, created);
      return created;
    }
  }

  deletePage(id: string) {
    const idx = this.pages.findIndex((p) => p.id === id);
    if (idx >= 0) {
      const old = this.pages[idx];
      this.pages.splice(idx, 1);
      this.logAction("DELETE", "page", id, old, undefined);
      return true;
    }
    return false;
  }

  // --- SITE CONTENT & SECTIONS ---
  getSiteContent(): AdminSiteContent {
    return this.siteContent;
  }

  updateSiteContent(section: keyof AdminSiteContent, data: any) {
    this.siteContent[section] = {
      ...this.siteContent[section],
      ...data,
    };
    this.logAction("UPDATE_CONTENT", "site_content", section, undefined, data);
    return this.siteContent[section];
  }

  // --- NAVIGATION BUILDER ---
  getNavigation(): AdminNavigation {
    return this.navigation;
  }

  updateNavigation(nav: Partial<AdminNavigation>) {
    this.navigation = {
      ...this.navigation,
      ...nav,
    };
    this.logAction("UPDATE_NAVIGATION", "navigation", "global", undefined, nav);
    return this.navigation;
  }

  // --- UNIFIED CATEGORIES CRUD ---
  getCategories(scope?: CategoryScope | string): AdminCategory[] {
    const list = scope ? this.categories.filter((c) => c.scope === scope) : this.categories;
    return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  saveCategory(cat: Partial<AdminCategory> & { name: string; scope: CategoryScope }) {
    const idx = this.categories.findIndex((c) => c.id === cat.id);
    if (idx >= 0) {
      const old = this.categories[idx];
      const updated: AdminCategory = {
        ...old,
        ...cat,
        slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      };
      this.categories[idx] = updated;
      this.logAction("UPDATE", "category", updated.id, old, updated);
      return updated;
    } else {
      const scopeCount = this.categories.filter((c) => c.scope === cat.scope).length;
      const created: AdminCategory = {
        id: cat.id || `cat-${cat.scope}-${Date.now()}`,
        name: cat.name,
        nameBn: cat.nameBn || null,
        slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        scope: cat.scope,
        description: cat.description || "",
        iconName: cat.iconName || "Tag",
        color: cat.color || "#c9a96e",
        sortOrder: cat.sortOrder ?? scopeCount + 1,
        isActive: cat.isActive !== false,
      };
      this.categories.push(created);
      this.logAction("CREATE", "category", created.id, undefined, created);
      return created;
    }
  }

  deleteCategory(id: string) {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx >= 0) {
      const old = this.categories[idx];
      this.categories.splice(idx, 1);
      this.logAction("DELETE", "category", id, old, undefined);
      return true;
    }
    return false;
  }

  reorderCategories(ids: string[]) {
    ids.forEach((id, index) => {
      const item = this.categories.find((c) => c.id === id);
      if (item) item.sortOrder = index + 1;
    });
    this.logAction("REORDER", "category", "multiple", undefined, ids);
    return true;
  }

  // --- CUSTOM FIELDS CRUD ---
  getCustomFields(): CustomFieldDef[] {
    return this.customFields;
  }

  saveCustomField(field: Partial<CustomFieldDef> & { label: string; type: CustomFieldDef["type"] }) {
    const idx = this.customFields.findIndex((f) => f.id === field.id);
    if (idx >= 0) {
      this.customFields[idx] = { ...this.customFields[idx], ...field };
      return this.customFields[idx];
    } else {
      const created: CustomFieldDef = {
        id: field.id || `f-${Date.now()}`,
        name: field.name || field.label.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
        label: field.label,
        type: field.type,
        options: field.options,
        isRequired: !!field.isRequired,
      };
      this.customFields.push(created);
      this.logAction("CREATE", "custom_field", created.id, undefined, created);
      return created;
    }
  }

  deleteCustomField(id: string) {
    const idx = this.customFields.findIndex((f) => f.id === id);
    if (idx >= 0) {
      this.customFields.splice(idx, 1);
      return true;
    }
    return false;
  }

  // --- MEDIA UPDATE ---
  updateMediaItem(id: string, updates: Partial<MediaItem>) {
    const idx = this.media.findIndex((m) => m.id === id);
    if (idx >= 0) {
      this.media[idx] = { ...this.media[idx], ...updates };
      return this.media[idx];
    }
    return null;
  }

  // --- STAGES & AGENTS CRUD ---
  saveStage(stage: Partial<LeadStage> & { name: string }) {
    const idx = this.leadStages.findIndex((s) => s.id === stage.id);
    if (idx >= 0) {
      this.leadStages[idx] = { ...this.leadStages[idx], ...stage };
      return this.leadStages[idx];
    } else {
      const created: LeadStage = {
        id: stage.id || `stage-${Date.now()}`,
        name: stage.name,
        slug: stage.slug || stage.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        color: stage.color || "#c9a96e",
        sortOrder: stage.sortOrder ?? this.leadStages.length + 1,
        isSystem: false,
      };
      this.leadStages.push(created);
      return created;
    }
  }

  saveAgent(agent: Partial<Agent> & { name: string; email: string; phone: string }) {
    const idx = this.agents.findIndex((a) => a.id === agent.id);
    if (idx >= 0) {
      this.agents[idx] = { ...this.agents[idx], ...agent };
      return this.agents[idx];
    } else {
      const created: Agent = {
        id: agent.id || `agent-${Date.now()}`,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        role: agent.role || "Property Consultant",
        bio: agent.bio || "",
        avatarUrl: agent.avatarUrl || "/image-01.webp",
        activeLeadsCount: agent.activeLeadsCount ?? 0,
        isActive: agent.isActive !== false,
      };
      this.agents.push(created);
      return created;
    }
  }

  deleteAgent(id: string) {
    const idx = this.agents.findIndex((a) => a.id === id);
    if (idx >= 0) {
      this.agents.splice(idx, 1);
      return true;
    }
    return false;
  }
}


// Singleton global in Node.js runtime
const globalForAdmin = global as unknown as { adminDataStore?: AdminDataStore };
export const adminStore = globalForAdmin.adminDataStore || new AdminDataStore();
if (process.env.NODE_ENV !== "production") globalForAdmin.adminDataStore = adminStore;
