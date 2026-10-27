import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Maximize,
  Check,
  BadgeCheck,
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  Zap,
  Droplets,
  Flame,
  Construction,
} from "lucide-react";
import { PROPERTIES, getPropertyBySlug, getRelatedProperties } from "@/lib/data";
import { getPropertyAction, getPropertiesAction } from "@/lib/admin/actions";
import PropertyGallery from "./PropertyGallery";
import LeadForm from "@/components/lead/LeadForm";
import PropertyCard from "@/components/property/PropertyCard";
import Button from "@/components/ui/Button";
import { CONTACT_INFO } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const dynamicParams = true;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const dynamic = await getPropertiesAction();
  if (dynamic && dynamic.length > 0) {
    return dynamic.map((p) => ({ slug: p.slug }));
  }
  return PROPERTIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const raw = (await getPropertyAction(params.slug)) || getPropertyBySlug(params.slug);
  if (!raw) return { title: "Property Not Found" };

  const desc = (raw as any).description || (raw as any).overview || "";
  const img = (raw as any).image || (raw as any).featuredImage || "/image-01.webp";

  return {
    title: raw.title,
    description: desc.slice(0, 160),
    openGraph: {
      title: `${raw.title} | Corona Properties`,
      description: desc.slice(0, 160),
      images: [img],
    },
  };
}

const AMENITY_ICONS: Record<string, typeof Zap> = {
  "24/7 Security & CCTV": ShieldCheck,
  "24/7 Security": ShieldCheck,
  "24/7 Armed Security": ShieldCheck,
  "Security Patrol": ShieldCheck,
  "Underground Electricity": Zap,
  "Smart Grid Electricity": Zap,
  "Gas & Water Supply": Droplets,
  "Central Gas & Water": Droplets,
  "Drainage System": Droplets,
  "Street Lighting": Zap,
  "Decorative Lighting": Zap,
  "Community Park": Construction,
  "Private Park & Lake": Construction,
  "Children's Play Area": Construction,
  "Lake Walkway": Construction,
  "Canal Walkway": Construction,
  "Lakeside Walkway": Construction,
};

export default async function PropertyDetailPage({ params }: PageProps) {
  const raw = (await getPropertyAction(params.slug)) || getPropertyBySlug(params.slug);

  if (!raw) {
    notFound();
  }

  const property = {
    ...raw,
    image: (raw as any).image || (raw as any).featuredImage || "/image-01.webp",
    gallery: (raw as any).gallery && (raw as any).gallery.length > 0
      ? (raw as any).gallery
      : [(raw as any).image || (raw as any).featuredImage || "/image-01.webp"],
    description: (raw as any).description || (raw as any).overview || "",
    highlights: ((raw as any).highlights || (raw as any).features || []) as string[],
    features: ((raw as any).features || (raw as any).highlights || []) as string[],
    amenities: ((raw as any).amenities || [
      "24/7 Security & CCTV",
      "Wide Access Roads",
      "Underground Drainage",
      "Electricity & Water",
    ]) as string[],
    specs: (raw as any).specs || [
      { label: "Location", value: raw.location },
      { label: "Plot Size", value: raw.size },
      { label: "Status", value: raw.status },
      { label: "Category", value: raw.type },
    ],
  };

  const allProperties = await getPropertiesAction();
  const otherProps = allProperties
    .filter((p) => p.id !== raw.id && p.slug !== params.slug)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      location: p.location,
      area: p.area,
      price: p.price,
      priceValue: p.priceValue,
      type: p.type,
      status: p.status,
      size: p.size,
      featured: p.isFeatured,
      image: p.featuredImage || "/image-01.webp",
      gallery: p.gallery || [],
      description: p.overview || "",
      highlights: p.highlights || [],
      features: p.features || [],
      amenities: p.customFieldValues?.amenities?.map((a: any) => a.name) || [],
      specs: p.specs || [],
    }));

  const related = otherProps.length > 0 ? otherProps.slice(0, 3) : getRelatedProperties(property.id, 3);

  return (
    <>
      {/* Back link */}
      <div className="bg-navy-950 py-4">
        <div className="container-luxury">
          <Link
            href="/properties"
            className="group inline-flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to All Properties
          </Link>
        </div>
      </div>

      {/* Hero gallery */}
      <section className="bg-navy-950 pb-16">
        <div className="container-luxury">
          <PropertyGallery images={property.gallery} title={property.title} />
        </div>
      </section>

      {/* Main content */}
      <section className="section-padding bg-cream !pt-12 !pb-20">
        <div className="container-luxury">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Left: Details */}
            <div className="lg:col-span-2">
              {/* Title block */}
              <div className="border-b border-navy-50 pb-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="rounded-full bg-gradient-gold px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy">
                        {property.type}
                      </span>
                      <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-700">
                        {property.status}
                      </span>
                    </div>
                    <h1 className="font-serif text-display-sm font-bold text-navy">
                      {property.title}
                    </h1>
                    <p className="mt-3 flex items-center gap-2 text-navy-400">
                      <MapPin className="h-5 w-5 text-gold" />
                      {property.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-navy-400">Starting Price</p>
                    <p className="font-serif text-4xl font-bold text-gradient-gold">{property.price}</p>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { icon: Maximize, label: "Plot Size", value: property.size },
                    { icon: MapPin, label: "Area", value: property.area },
                    { icon: BadgeCheck, label: "Approval", value: "Verified" },
                    { icon: ShieldCheck, label: "Title", value: "Verified" },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="rounded-xl border border-navy-50 bg-white p-4 text-center">
                        <Icon className="mx-auto h-5 w-5 text-gold-600" />
                        <p className="mt-2 text-xs uppercase tracking-wider text-navy-400">{stat.label}</p>
                        <p className="mt-1 font-serif text-sm font-bold text-navy">{stat.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="py-8 border-b border-navy-50">
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">Overview</h2>
                <p className="leading-relaxed text-navy-400 text-lg">{property.description}</p>
              </div>

              {/* Highlights */}
              <div className="py-8 border-b border-navy-50">
                <h2 className="font-serif text-2xl font-bold text-navy mb-6">Property Highlights</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {property.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-navy-50/50 p-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-gold">
                        <Check className="h-4 w-4 text-navy" />
                      </span>
                      <span className="text-sm font-medium text-navy">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="py-8 border-b border-navy-50">
                <h2 className="font-serif text-2xl font-bold text-navy mb-6">Key Features</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {property.features.map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 shrink-0 text-gold-600" />
                      <span className="text-sm text-navy">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="py-8">
                <h2 className="font-serif text-2xl font-bold text-navy mb-6">Amenities & Infrastructure</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {property.amenities.map((a: string, i: number) => {
                    const Icon = AMENITY_ICONS[a] || Check;
                    return (
                      <div key={i} className="flex items-center gap-3 rounded-xl border border-navy-50 bg-white p-4 shadow-sm">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                          <Icon className="h-5 w-5 text-gold-600" />
                        </div>
                        <span className="text-sm font-medium text-navy">{a}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Contact card */}
                <div className="rounded-2xl bg-gradient-navy p-8 text-cream shadow-navy">
                  <h3 className="font-serif text-xl font-bold text-cream">Interested in this plot?</h3>
                  <p className="mt-2 text-sm text-cream/70">
                    Book a site visit or request a callback. Our team responds within 24 hours.
                  </p>

                  <div className="mt-6 space-y-3">
                    <a
                      href={`tel:${CONTACT_INFO.phoneRaw}`}
                      className="flex items-center gap-3 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20">
                        <Phone className="h-4 w-4 text-gold" />
                      </span>
                      <div>
                        <p className="text-xs text-cream/60">Call us</p>
                        <p className="text-sm font-semibold">{CONTACT_INFO.phone}</p>
                      </div>
                    </a>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="flex items-center gap-3 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20">
                        <Mail className="h-4 w-4 text-gold" />
                      </span>
                      <div>
                        <p className="text-xs text-cream/60">Email us</p>
                        <p className="text-sm font-semibold break-all">{CONTACT_INFO.email}</p>
                      </div>
                    </a>
                  </div>

                  <Button href="/contact" variant="gold" showArrow className="mt-6 w-full">
                    Book Site Visit
                  </Button>
                </div>

                {/* Inquiry form */}
                <LeadForm propertyName={property.title} compact />

                {/* Location map */}
                <div className="rounded-2xl border border-navy-50 bg-white p-6 shadow-card">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4">Location</h3>
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-navy-50">
                    <iframe
                      title={`${property.title} location`}
                      src={
                        (property as any).coordinates?.lat && (property as any).coordinates?.lng
                          ? `https://www.google.com/maps?q=${(property as any).coordinates.lat},${(property as any).coordinates.lng}&z=14&output=embed`
                          : `https://www.google.com/maps?q=${encodeURIComponent(property.location)}&z=14&output=embed`
                      }
                      className="absolute inset-0 h-full w-full"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-3 text-sm text-navy-400">{property.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Properties */}
      {related.length > 0 && (
        <section className="section-padding bg-navy-50/50">
          <div className="container-luxury">
            <div className="mb-12 text-center">
              <span className="eyebrow !justify-center">
                {(raw as any).customFieldValues?.sectionHeadings?.similarProjectsEyebrow || "You May Also Like"}
              </span>
              <h2 className="mt-4 font-serif text-display-sm font-bold text-navy">
                {(raw as any).customFieldValues?.sectionHeadings?.similarProjectsTitle || "Similar Properties"}
              </h2>
              {(raw as any).customFieldValues?.sectionHeadings?.similarProjectsSubtitle && (
                <p className="mt-2 text-sm text-navy-400 max-w-xl mx-auto">
                  {(raw as any).customFieldValues.sectionHeadings.similarProjectsSubtitle}
                </p>
              )}
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <PropertyCard key={p.id} property={p as any} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
