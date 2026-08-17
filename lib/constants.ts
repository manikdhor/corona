/**
 * Corona Properties Limited — Site Constants
 * Central configuration for company info, navigation, and branding
 */

export const SITE_CONFIG = {
  name: "Corona Properties Limited",
  shortName: "Corona Properties",
  tagline: "Premium Land. Lasting Legacy.",
  description:
    "Corona Properties Limited is a leading residential land developer in Bangladesh, crafting premium plots and exclusive communities with integrity, vision, and unmatched quality.",
  logo: "/corona-logo.png",
  url: "https://coronapropertiesltd.com",
} as const;

export const CONTACT_INFO = {
  address:
    "Mar garden, House # 145, Flat # 704, Road # 3, Block A, Niketon, Gulshan 01, Dhaka 1212",
  addressShort: "Gulshan 01, Dhaka 1212, Bangladesh",
  email: "cplcoronapropertiesltd@gmail.com",
  phone: "+880 18 0575 9297",
  phoneRaw: "+8801805759297",
  hours: "Saturday – Thursday: 9:00 AM – 6:00 PM",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.7!2d90.4119!3d23.7925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a4b8e1c0c1%3A0x6!2sGulshan%201!3m1!1s0x3755c7a4b8e1c0c1%3A0x6!5e0!3m2!1sen!2sbd!4v1700000000000",
} as const;

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/coronapropertieslimited",
  instagram: "https://www.instagram.com/coronapropertiesltd/",
  twitter: "https://x.com/coronagroupbd",
  linkedin: "https://linkedin.com",
  pinterest: "https://www.pinterest.com/coronapropertiesltd/",
  youtube: "https://www.youtube.com/@CoronaPropertiesLtd",
  whatsapp: "https://wa.me/8801805759297",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Group Profile", href: "/corona-group" },
  { label: "Management", href: "/team" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Group Profile", href: "/corona-group" },
    { label: "Management Messages", href: "/team" },
    { label: "Our Projects", href: "/projects" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog & News", href: "/blog" },
  ],
  services: [
    { label: "Land Development", href: "/services" },
    { label: "Legal Services", href: "/services" },
    {
      label: "Investment Advisory",
      href: "/services",
    },
    { label: "Property Management", href: "/services" },
    { label: "Documentation", href: "/services" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Book a Visit", href: "/contact" },
    { label: "Privacy Policy", href: "/contact" },
    { label: "Terms of Service", href: "/contact" },
    { label: "FAQ", href: "/contact" },
  ],
} as const;

export const NAV_CATEGORIES = [
  {
    label: "Residential Plots",
    href: "/properties?type=residential",
    description: "Curated residential plots in prime locations",
  },
  {
    label: "Premium Communities",
    href: "/properties?type=premium",
    description: "Gated communities with modern amenities",
  },
  {
    label: "Investment Plots",
    href: "/properties?type=investment",
    description: "High-appreciation plots for smart investors",
  },
] as const;
