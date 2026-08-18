/**
 * Corona Properties Limited — Data Layer
 * Properties, blog posts, team members, testimonials, and more
 */

import {
  Building2,
  Trees,
  ShieldCheck,
  FileText,
  Handshake as HandshakeIcon,
  Landmark,
  TrendingUp,
  Headphones,
  MapPin,
  Maximize,
  Truck,
  Ship,
  Anchor,
  Globe,
  Video,
  type LucideIcon,
} from "lucide-react";

/* ============================================
   TYPES
   ============================================ */
export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  area: string;
  price: string;
  priceValue: number;
  type: "Premium" | "Standard" | "Investment" | "Exclusive";
  status: "Available" | "New Launch" | "Almost Sold Out" | "Featured";
  size: string;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
  amenities: string[];
  highlights: string[];
  coordinates: { lat: number; lng: number };
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  image: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
}

export interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
  width: number;
  height: number;
}

/* ============================================
   PROPERTIES DATA
   ============================================ */
export const PROPERTIES: Property[] = [
  {
    id: "1",
    slug: "gulshan-lake-residence",
    title: "Gulshan Lake Residence",
    location: "Gulshan 02, Dhaka",
    area: "Gulshan",
    price: "৳ 4.5 Crore",
    priceValue: 45000000,
    type: "Exclusive",
    status: "Featured",
    size: "5 Katha",
    image:
      "/image-01.webp",
    gallery: [
      "/image-01.webp",
      "/image-03.webp",
      "/image-02.webp",
      "/image-04.webp",
    ],
    description:
      "An exclusive residential enclave overlooking the serene Gulshan Lake. Each plot offers unparalleled privacy, natural light, and a prestigious address in Dhaka's most sought-after diplomatic zone. Expertly planned with wide access roads, underground utilities, and lush landscaping.",
    features: [
      "Lake-facing premium plots",
      "Gated community with 24/7 security",
      "Underground utility connections",
      "Wide access roads (40 ft)",
      "Landscaped green buffer zones",
    ],
    amenities: [
      "24/7 Security & CCTV",
      "Underground Electricity",
      "Gas & Water Supply",
      "Drainage System",
      "Street Lighting",
      "Community Park",
    ],
    highlights: [
      "Prime diplomatic zone location",
      "Lake views from every plot",
      "Ready for immediate construction",
      "Approved layout",
    ],
    coordinates: { lat: 23.7925, lng: 90.4119 },
    featured: true,
  },
  {
    id: "2",
    slug: "banani-greens-estate",
    title: "Banani Greens Estate",
    location: "Banani, Dhaka",
    area: "Banani",
    price: "৳ 3.8 Crore",
    priceValue: 38000000,
    type: "Premium",
    status: "Available",
    size: "4 Katha",
    image:
      "/image-04.webp",
    gallery: [
      "/image-04.webp",
      "/image-01.webp",
      "/image-02.webp",
    ],
    description:
      "Set in the heart of Banani, this premium residential estate combines urban convenience with serene living. Wide tree-lined avenues, proximity to top schools and hospitals, and thoughtfully designed plots make this a rare investment opportunity.",
    features: [
      "Tree-lined residential avenues",
      "Proximity to top schools & hospitals",
      "Modern drainage & utility system",
      "Walking & cycling tracks",
    ],
    amenities: [
      "24/7 Security",
      "Underground Electricity",
      "Gas & Water Supply",
      "Wide Roads (30 ft)",
      "Street Lighting",
      "Children's Play Area",
    ],
    highlights: [
      "Central Dhaka location",
      "Top-rated neighborhood",
      "High resale value",
      "Ready utilities",
    ],
    coordinates: { lat: 23.7937, lng: 90.4066 },
    featured: true,
  },
  {
    id: "3",
    slug: "baridhara-diplomatic-enclave",
    title: "Baridhara Diplomatic Enclave",
    location: "Baridhara, Dhaka",
    area: "Baridhara",
    price: "৳ 6.2 Crore",
    priceValue: 62000000,
    type: "Exclusive",
    status: "Almost Sold Out",
    size: "6 Katha",
    image:
      "/image-02.webp",
    gallery: [
      "/image-02.webp",
      "/image-01.webp",
      "/image-04.webp",
      "/image-03.webp",
    ],
    description:
      "Step into exclusivity at Baridhara Diplomatic Enclave, home to embassies and high commissions. This gated community offers the highest standard of residential living in Bangladesh, with immaculate infrastructure and unmatched prestige.",
    features: [
      "Diplomatic zone location",
      "Ultra-premium gated community",
      "Highest security standards",
      "International-standard infrastructure",
    ],
    amenities: [
      "24/7 Armed Security",
      "Smart Grid Electricity",
      "Central Gas & Water",
      "Paved Roads (60 ft)",
      "Decorative Lighting",
      "Private Park & Lake",
    ],
    highlights: [
      "Most prestigious address in Dhaka",
      "Embassy neighbors",
      "Limited availability",
      "Investment-grade asset",
    ],
    coordinates: { lat: 23.8115, lng: 90.4221 },
    featured: true,
  },
  {
    id: "4",
    slug: "uttara-lake-view",
    title: "Uttara Lake View",
    location: "Uttara, Dhaka",
    area: "Uttara",
    price: "৳ 1.8 Crore",
    priceValue: 18000000,
    type: "Standard",
    status: "New Launch",
    size: "3 Katha",
    image:
      "/image-05.webp",
    gallery: [
      "/image-05.webp",
      "/image-02.webp",
      "/image-01.webp",
    ],
    description:
      "A new launch offering exceptional value in Uttara Sector 15. Beautifully positioned near the lake with panoramic views, wide roads, and easy access to the airport. The perfect entry point into premium Dhaka living.",
    features: [
      "Lake view plots",
      "Sector 15 prime location",
      "Airport proximity (10 min)",
      "Modern utility infrastructure",
    ],
    amenities: [
      "Security Patrol",
      "Underground Electricity",
      "Gas & Water Supply",
      "Wide Roads (24 ft)",
      "Street Lighting",
      "Lake Walkway",
    ],
    highlights: [
      "Best value in North Dhaka",
      "New launch pricing",
      "Fast appreciation expected",
      "Family-friendly neighborhood",
    ],
    coordinates: { lat: 23.8728, lng: 90.3984 },
    featured: false,
  },
  {
    id: "5",
    slug: "dhanmondi-residential-park",
    title: "Dhanmondi Residential Park",
    location: "Dhanmondi, Dhaka",
    area: "Dhanmondi",
    price: "৳ 2.9 Crore",
    priceValue: 29000000,
    type: "Premium",
    status: "Available",
    size: "3.5 Katha",
    image:
      "/image-06.webp",
    gallery: [
      "/image-06.webp",
      "/image-02.webp",
      "/image-01.webp",
    ],
    description:
      "Set beside the historic Dhanmondi Lake, these premium residential plots offer a rare blend of cultural heritage and modern living. Walking distance to top schools, lakeside cafes, and the iconic Abahani Playground.",
    features: [
      "Lakeside premium plots",
      "Walking distance to top schools",
      "Cultural hub of Dhaka",
      "Mature tree canopy",
    ],
    amenities: [
      "24/7 Security",
      "Underground Electricity",
      "Gas & Water Supply",
      "Wide Roads (30 ft)",
      "Street Lighting",
      "Lakeside Walkway",
    ],
    highlights: [
      "Heritage location",
      "Strong rental demand",
      "Mature neighborhood",
      "Proximity to lake & parks",
    ],
    coordinates: { lat: 23.7461, lng: 90.3742 },
    featured: false,
  },
  {
    id: "6",
    slug: "bashundhara-canal-vista",
    title: "Bashundhara Canal Vista",
    location: "Bashundhara R/A, Dhaka",
    area: "Bashundhara",
    price: "৳ 2.4 Crore",
    priceValue: 24000000,
    type: "Investment",
    status: "New Launch",
    size: "4 Katha",
    image:
      "/image-03.webp",
    gallery: [
      "/image-03.webp",
      "/image-02.webp",
    ],
    description:
      "An exceptional investment opportunity in Bashundhara Residential Area. Block I offers wide canals, modern infrastructure, and proximity to leading universities and shopping malls. High appreciation potential over the next 3-5 years.",
    features: [
      "Block I premium location",
      "Canal-adjacent plots",
      "University proximity",
      "High appreciation potential",
    ],
    amenities: [
      "24/7 Security",
      "Underground Electricity",
      "Gas & Water Supply",
      "Wide Roads (30 ft)",
      "Street Lighting",
      "Canal Walkway",
    ],
    highlights: [
      "Top investment zone",
      "New launch pricing",
      "Fast-developing area",
      "Strong rental demand",
    ],
    coordinates: { lat: 23.8133, lng: 90.4255 },
    featured: false,
  },
];

/* ============================================
   SERVICES DATA
   ============================================ */
export const SERVICES: Service[] = [
  {
    id: "land-development",
    icon: Building2,
    title: "Land Development",
    description:
      "End-to-end land development services from site selection and feasibility analysis to infrastructure planning, grading, and handover-ready plot delivery.",
    features: [
      "Site feasibility & survey",
      "Master planning & layout design",
      "Infrastructure development",
      "Environmental compliance",
    ],
  },
  {
    id: "legal-services",
    icon: ShieldCheck,
    title: "Legal Services",
    description:
      "Complete legal assurance with thorough title verification, documentation, registration, and ownership transfer — ensuring 100% clear and marketable title.",
    features: [
      "Title verification & due diligence",
      "Deed preparation & registration",
      "Mutation & ownership transfer",
      "Legal opinion & documentation",
    ],
  },
  {
    id: "investment-advisory",
    icon: TrendingUp,
    title: "Investment Advisory",
    description:
      "Data-driven land investment advisory helping you identify high-growth zones, forecast appreciation, and build a diversified real estate portfolio.",
    features: [
      "Market analysis & trends",
      "ROI projections",
      "Portfolio diversification",
      "Growth corridor mapping",
    ],
  },
  {
    id: "property-management",
    icon: Building2,
    title: "Property Management",
    description:
      "Comprehensive management of your land assets — maintenance, security, tenant coordination, and periodic valuation to preserve and grow your investment.",
    features: [
      "Asset maintenance & security",
      "Periodic valuation reports",
      "Tenant & lease management",
      "Utility bill management",
    ],
  },
  {
    id: "documentation",
    icon: FileText,
    title: "Documentation",
    description:
      "Hassle-free documentation services covering all land registry, and municipal paperwork. We handle the bureaucracy so you don't have to.",
    features: [
      "Planning approval & clearance",
      "Land registry documentation",
      "Tax & utility connections",
      "Ownership documentation",
    ],
  },
  {
    id: "after-sales-support",
    icon: Headphones,
    title: "After-Sales Support",
    description:
      "Our relationship doesn't end at the sale. Dedicated after-sales support for construction guidance, resale assistance, and lifelong property consulting.",
    features: [
      "Construction advisory",
      "Resale & exit assistance",
      "Dedicated account manager",
      "Lifelong property consulting",
    ],
  },
];

/* ============================================
   TEAM DATA
   ============================================ */
export const TEAM: TeamMember[] = [
  {
    id: "1",
    name: "Nayma Fardusi",
    role: "Chairman",
    bio: '"We believe in creating not just homes, but communities." With 5 years of experience in the Real Estate Section in Canada and Bangladesh, I have personally overseen every detail of Maple Leaf Garden City to ensure it meets international standards. Our vision is to bring the Canadian lifestyle to Bangladesh, offering families a safe, green, and modern living environment. This project is a dream come true – a place where nature and urban convenience coexist. We are committed to transparency, quality, and customer satisfaction.',
    image: "/Nayma_Fardusi_Chairman.jpeg",
  },
  {
    id: "2",
    name: "Kazi Saiful Islam",
    role: "Managing Director",
    bio: "Dear Customers, Investors, and Valued Well-Wishers,\n\nWelcome to Corona Properties Ltd.\n\nAt Corona Properties Ltd., we believe that real estate is more than an investment — it is the foundation of a secure future, a better lifestyle, and a lasting legacy for generations. With this vision, we proudly present Maple Leaf Garden City Purbachal, a modern and thoughtfully planned residential community conveniently located near Kanchan Bridge.\n\nInspired by our commitment to bring \"The Dream of Canada to the Soil of Bangladesh,\" we are creating a unique living environment that blends international standards, modern infrastructure, natural beauty, and sustainable development. Designed with wide roads, green open spaces, essential civic facilities, and future-ready planning, Maple Leaf Garden City is set to become a landmark residential destination.\n\nWe understand that purchasing land is one of the most important decisions in a person's life. Therefore, transparency, integrity, and customer confidence remain at the heart of everything we do. We proudly ensure 100% land handover guarantee, supported by full compliance with all applicable regulations and land laws of Bangladesh.\n\nOur mission extends beyond selling plots; we are committed to building a vibrant, secure, and prosperous community where families can thrive and future generations can flourish.\n\nOn behalf of the entire Corona Properties family, I sincerely thank you for your trust and confidence. We look forward to accompanying you on your journey toward a brighter and more prosperous future.",
    image: "/Kazi_Saiful_Islam_Managing_Director.jpeg",
  },
  {
    id: "3",
    name: "Kazi Md Rauful Islam",
    role: "Director",
    bio: '"Customer trust is our greatest asset." Our team is dedicated to providing transparent and honest communication with every client. We understand that buying land is a major life decision, and we are here to guide you through every step with integrity. We are confident that Maple Leaf Garden City offers the best value in Purbachal, and we invite you to be part of this growing community.',
    image: "/Kazi_Md_Rauful_Islam_Director.jpeg",
  },
];

/* ============================================
   TESTIMONIALS DATA
   ============================================ */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Kamrul Hasan",
    role: "Business Owner, Dhaka",
    quote:
      "Corona Properties made buying land effortless. The team was transparent at every step, and my plot in Banani has already appreciated 40% in two years. Truly a premium experience.",
    rating: 5,
    image:
      "/image-13.webp",
  },
  {
    id: "2",
    name: "Sadia Islam",
    role: "Doctor, Uttara",
    quote:
      "As a first-time land buyer, I was nervous. But Corona's legal team handled everything — from title verification to registration. My Gulshan plot is now my family's proudest asset.",
    rating: 5,
    image:
      "/image-01.webp",
  },
  {
    id: "3",
    name: "Rakib Ahmed",
    role: "NRI Investor, Dubai",
    quote:
      "Being overseas, I needed a partner I could trust. Corona's after-sales support is exceptional. They manage my Bashundhara plot and send quarterly reports. Highly recommend.",
    rating: 5,
    image:
      "/image-11.webp",
  },
  {
    id: "4",
    name: "Tahmina Rahman",
    role: "Architect, Dhanmondi",
    quote:
      "The quality of infrastructure at Corona's projects is unmatched in Bangladesh. Wide roads, proper drainage, underground utilities — they truly set the benchmark for land development.",
    rating: 5,
    image:
      "/image-02.webp",
  },
];

/* ============================================
   BLOG POSTS DATA
   ============================================ */
export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "investing-in-dhaka-land-2026-guide",
    title: "Investing in Dhaka Land: A Complete 2026 Guide",
    excerpt:
      "From Purbachal to Bashundhara, discover the highest-growth land investment zones in and around Dhaka for 2026 and beyond.",
    content: [
      "Dhaka's real estate market continues to be one of the most resilient and rewarding investment destinations in South Asia. As the city expands outward and new satellite towns emerge, strategic land investment has never been more accessible — or more lucrative.",
      "In this comprehensive guide, we explore the top growth corridors for 2026, including Purbachal New Town, Bashundhara R/A extensions, and the emerging Hemayetpur belt. We analyze price trends, infrastructure developments, and the regulatory landscape that shapes every transaction.",
      "**Key Growth Zones.** Purbachal New Town remains the flagship project, with the approach road complete and the Rafiqul Islam Avenue now fully operational. Plots here have seen 25-35% appreciation in the last 18 months alone. Bashundhara R/A continues its steady growth, particularly in the newer blocks (J-N), which offer excellent entry points for investors seeking 3-5 year appreciation.",
      "When evaluating a plot, prioritize approved layouts, clear title history, underground utilities, and proximity to planned infrastructure (metro stations, expressways). A reputable developer will provide all of this transparently.",
      "Land in greater Dhaka remains a finite, appreciating asset. With the right guidance and due diligence, it represents one of the safest and most profitable long-term investments available to Bangladeshis at home and abroad.",
    ],
    category: "Investment Guide",
    author: "Kazi Saiful Islam",
    authorRole: "Managing Director",
    date: "July 10, 2026",
    readTime: "8 min read",
    image:
      "/image-01.webp",
  },
  {
    id: "2",
    slug: "how-to-verify-land-title-bangladesh",
    title: "How to Verify Land Title in Bangladesh: A Legal Primer",
    excerpt:
      "Understanding the legal framework of land ownership in Bangladesh. Learn how to verify title, check for disputes, and ensure your investment is protected.",
    content: [
      "Land title verification is the single most important step in any real estate transaction in Bangladesh. A clear title ensures your investment is protected and marketable for generations.",
      "Bangladesh's land records are maintained through a multi-layered system: the SA (Single Administration) khatian, the RS (Revisional Survey) khatian, and where applicable, the BS (Bangladesh Survey) khatian. Each provides a snapshot of ownership at different points in history.",
      "**Steps to Verify Title.** (1) Obtain the latest Khatian/Parcha from the local land office. (2) Check for mutations — ensure the seller's name appears in current records. (3) Verify no encumbrances — search for mortgages, liens, or court injunctions. (4) Review 30-year chain of title — trace ownership back three decades. (5) Confirm plot boundaries — physical survey and demarcation.",
      "Be cautious of significantly below-market pricing, pressure to skip due diligence, incomplete documentation, or any history of disputes in the neighborhood. A reputable developer like Corona Properties handles all of this for you.",
      "Never bypass legal verification, no matter how attractive the deal seems. The cost of proper due diligence is negligible compared to the cost of a disputed title.",
    ],
    category: "Legal",
    author: "Kazi Md Rauful Islam",
    authorRole: "Director",
    date: "July 2, 2026",
    readTime: "6 min read",
    image:
      "/image-03.webp",
  },
  {
    id: "3",
    slug: "top-5-emerging-areas-dhaka",
    title: "Top 5 Emerging Residential Areas Around Dhaka",
    excerpt:
      "Beyond the established neighborhoods, these five emerging areas are poised for explosive growth in the next decade.",
    content: [
      "While Gulshan, Banani, and Dhanmondi remain the gold standard, a new wave of emerging areas is offering exceptional value and growth potential for forward-thinking investors.",
      "**1. Purbachal New Town.** The largest planned project, with world-class infrastructure and the iconic 300-foot avenue. Prices still 40-60% below established areas, with appreciation potential of 50-100% over 5 years.",
      "**2. Hemayetpur.** Located on the western outskirts, Hemayetpur is benefiting from the Dhaka-Aricha highway expansion and the metro rail extension. Land here is among the most affordable entry points to greater Dhaka.",
      "**3. Keraniganj.** With the Padma Bridge and Buriganga riverfront development, Keraniganj is transforming from industrial outskirts to a mixed-use residential destination with excellent connectivity.",
      "**4. Narayanganj Belt.** The Dhaka-Narayanganj industrial corridor is seeing rapid residential conversion, particularly in Adamjee Nagar and Fatullah. Strong demand from young families and professionals.",
      "**5. Gazipur.** With the metro rail now connecting Gazipur to central Dhaka in under 30 minutes, this area is seeing explosive demand for residential plots. These emerging areas offer the best risk-adjusted returns for investors with a 5-10 year horizon.",
    ],
    category: "Market Trends",
    author: "Nayma Fardusi",
    authorRole: "Chairman",
    date: "June 25, 2026",
    readTime: "7 min read",
    image:
      "/image-02.webp",
  },
];

/* ============================================
   GALLERY DATA
   ============================================ */
export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: "g1",
    url: "/image-01.webp",
    title: "Gulshan Lake Residence",
    category: "Residential",
    width: 1600,
    height: 1000,
  },
  {
    id: "g2",
    url: "/image-03.webp",
    title: "Bashundhara Canal Vista",
    category: "Aerial Views",
    width: 1600,
    height: 1067,
  },
  {
    id: "g3",
    url: "/image-02.webp",
    title: "Baridhara Diplomatic Enclave",
    category: "Residential",
    width: 1600,
    height: 1067,
  },
  {
    id: "g4",
    url: "/image-04.webp",
    title: "Banani Greens Estate",
    category: "Aerial Views",
    width: 1600,
    height: 1067,
  },
  {
    id: "g5",
    url: "/image-05.webp",
    title: "Uttara Lake View",
    category: "Residential",
    width: 1600,
    height: 1067,
  },
  {
    id: "g6",
    url: "/image-06.webp",
    title: "Dhanmondi Residential Park",
    category: "Residential",
    width: 1600,
    height: 1067,
  },
  {
    id: "g7",
    url: "/image-04.webp",
    title: "Lakefront Development",
    category: "Aerial Views",
    width: 1400,
    height: 933,
  },
  {
    id: "g8",
    url: "/image-05.webp",
    title: "Premium Community Layout",
    category: "Layouts",
    width: 1600,
    height: 1067,
  },
  {
    id: "g9",
    url: "/image-06.webp",
    title: "Golden Hour Landscape",
    category: "Layouts",
    width: 1600,
    height: 1067,
  },
];

/* ============================================
   STATS DATA
   ============================================ */
export const STATS = [
  { value: 500, suffix: "+", label: "Acres Developed", icon: Trees },
  { value: 1200, suffix: "+", label: "Happy Families", icon: HandshakeIcon },
  { value: 40, suffix: "+", label: "Premium Projects", icon: Building2 },
  { value: 100, suffix: "%", label: "Legal Compliance", icon: ShieldCheck },
] as const;

/* ============================================
   VALUES DATA
   ============================================ */
export const CORE_VALUES = [
  {
    title: "Integrity",
    description:
      "Every transaction is transparent, every document is authentic. We build trust through honesty, not just beautiful land.",
    icon: ShieldCheck,
  },
  {
    title: "Excellence",
    description:
      "From site selection to handover, we pursue the highest standard of quality in every detail of land development.",
    icon: TrendingUp,
  },
  {
    title: "Client First",
    description:
      "Your goals are our goals. We measure our success by the satisfaction and prosperity of the families we serve.",
    icon: HandshakeIcon,
  },
  {
    title: "Innovation",
    description:
      "We embrace modern planning, sustainable infrastructure, and forward-thinking design to create lasting value.",
    icon: Building2,
  },
] as const;

/* ============================================
    CORONA GROUP DATA
    ============================================ */
export interface SisterConcern {
  id: string;
  name: string;
  established: number;
  tagline: string;
  description: string;
  strengths: string[];
  icon: LucideIcon;
  color: string;
}

export interface OfficeLocation {
  city: string;
  name: string;
  description: string;
}

export const SISTER_CONCERNS: SisterConcern[] = [
  {
    id: "corona-trade-transport",
    name: "Corona Trade & Transport Ltd.",
    established: 1987,
    tagline: "Pioneering Land Logistics Across Bangladesh",
    description:
      "The foundational pillar of Corona Group. A pioneer in Bangladesh's transportation and logistics industry, providing dependable nationwide cargo movement through a modern, well-maintained fleet.",
    strengths: [
      "Fleet of 80 cover vans",
      "4 heavy-duty long vehicles for oversized and project cargo",
      "Nationwide transportation and distribution",
      "Integrated logistics and supply chain solutions",
    ],
    icon: Truck,
    color: "navy",
  },
  {
    id: "far-eastern-shipping",
    name: "Far Eastern Shipping Agency",
    established: 1990,
    tagline: "Licensed Customs Agency & Shipping Support",
    description:
      "Professional customs agency and shipping support services, ensuring smooth and efficient cargo handling for domestic and international clients across Bangladesh.",
    strengths: [
      "Licensed Customs Agency",
      "Shipping Documentation",
      "Freight Coordination",
      "Logistics Support Services",
    ],
    icon: Ship,
    color: "gold",
  },
  {
    id: "corona-associates",
    name: "Corona Associates — Customs Clearing & Forwarding (C&F) Agent",
    established: 1997,
    tagline: "Flagship Customs Solutions Across Every Port",
    description:
      "One of the Group's flagship service companies, delivering comprehensive Customs Clearing and Forwarding solutions through Bangladesh's major ports and logistics gateways.",
    strengths: [
      "Hazrat Shahjalal International Airport, Dhaka",
      "Chattogram Sea Port",
      "Benapole Land Port",
      "ICD Kamalapur, EPZs, and Pangaon Inland Container Terminal",
    ],
    icon: ShieldCheck,
    color: "navy",
  },
  {
    id: "corona-shipping-lines",
    name: "Corona Shipping Lines",
    established: 2008,
    tagline: "Inland & Coastal Cargo Transportation",
    description:
      "Operates in the inland and coastal shipping sector, providing dependable cargo transportation through its growing fleet of vessels.",
    strengths: [
      "2 cargo vessels including M.V. Corona",
      "Inland Waterway Transportation",
      "Coastal Shipping Services",
      "Bulk and general cargo handling",
    ],
    icon: Anchor,
    color: "gold",
  },
  {
    id: "sohel-trading",
    name: "Sohel Trading",
    established: 2010,
    tagline: "Global Trade Facilitation & Sourcing",
    description:
      "Specializes in international sourcing, indenting, import management, and global trade facilitation, connecting businesses with trusted international suppliers.",
    strengths: [
      "Indenting & Import Management",
      "International Trade",
      "Global Sourcing & Supplier Verification",
    ],
    icon: Globe,
    color: "navy",
  },
  {
    id: "sj-motion-pictures",
    name: "S J Motion Pictures",
    established: 2014,
    tagline: "Creative Media & Production House",
    description:
      "The creative media arm of Corona Group, producing high-quality television, film, and digital content while offering professional media production services.",
    strengths: [
      "Television Production",
      "Film Production",
      "Commercial & Corporate Productions",
      "Creative Media Solutions",
    ],
    icon: Video,
    color: "gold",
  },
];

export const GROUP_STATS = [
  { value: "1987", suffix: "", label: "Founded", icon: Landmark },
  { value: "6", suffix: "+", label: "Operational Divisions", icon: Building2 },
  { value: "37+", suffix: "", label: "Years of Excellence", icon: TrendingUp },
  { value: "National", suffix: "", label: "Footprint", icon: MapPin },
] as const;

export const VISION_MISSION = {
  vision:
    "To be one of Bangladesh's most trusted and diversified business groups, recognized for excellence, innovation, and sustainable growth.",
  mission:
    "To deliver reliable, efficient, and customer-centric solutions across logistics, shipping, customs services, international trade, and media while maintaining the highest standards of ethics, safety, and professional excellence.",
};

export const OFFICE_LOCATIONS: OfficeLocation[] = [
  {
    city: "Dhaka",
    name: "Corporate Headquarters",
    description: "Strategic command center overseeing all Group operations, corporate affairs, and executive decision-making.",
  },
  {
    city: "Chattogram",
    name: "Sea Port Operations",
    description: "Dedicated seaport logistics hub managing international shipping and customs clearing at Bangladesh's primary commercial port.",
  },
  {
    city: "DEPZ, Savar",
    name: "Industrial & Export Services",
    description: "Focused unit serving export processing zones with streamlined customs, logistics, and supply chain solutions.",
  },
  {
    city: "Benapole",
    name: "Land Port Operations",
    description: "Strategic border office managing overland logistics at the busiest Indo-Bangladesh trade gateway.",
  },
];

/* ============================================
    EXPORTED ICONS (for reuse)
    ============================================ */
export {
  MapPin, Maximize, Truck, Ship, Anchor, Globe, Video, Landmark,
};

/* ============================================
   HELPER FUNCTIONS
   ============================================ */
export function getPropertyBySlug(slug: string): Property | undefined {
  return PROPERTIES.find((p) => p.slug === slug);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getFeaturedProperties(): Property[] {
  return PROPERTIES.filter((p) => p.featured);
}

export function getRelatedProperties(currentId: string, limit = 3): Property[] {
  return PROPERTIES.filter((p) => p.id !== currentId).slice(0, limit);
}
