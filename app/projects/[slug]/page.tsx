import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Maximize2,
  Check,
  BadgeCheck,
  ArrowLeft,
  Phone,
  Mail,
  ShieldCheck,
  Fuel,
  Dumbbell,
  HeartPulse,
  Landmark,
  Trophy,
  Waves,
  TreePine,
  Store,
  Zap,
  Download,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { PROJECTS, getProjectBySlug, getRelatedProjects } from "@/lib/projects";
import { CONTACT_INFO, SITE_CONFIG } from "@/lib/constants";
import LeadForm from "@/components/lead/LeadForm";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/home/ProjectCard";
import KeyAssets from "@/components/property/KeyAssets";

const AMENITY_ICONS: Record<string, LucideIcon> = {
  HeartPulse,
  Landmark,
  Trophy,
  Waves,
  TreePine,
  Store,
  Zap,
  ShieldCheck,
  Fuel,
  Dumbbell,
};

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.seo.title,
    description: project.seo.description,
    openGraph: {
      title: project.seo.title,
      description: project.seo.description,
      images: [project.heroImage],
    },
  };
}

export default function ProjectDetailPage({ params }: PageProps) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const related = getRelatedProjects(project.id, 3);

  return (
    <>
      {/* Back link */}
      <div className="bg-navy-950 py-4">
        <div className="container-luxury">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to All Projects
          </Link>
        </div>
      </div>

      {/* Hero Gallery */}
      <section className="bg-navy-950 pb-16">
        <div className="container-luxury">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl lg:aspect-[21/9]">
            <Image
              src={project.heroImage}
              alt={project.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-navy-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
              <span className="inline-block rounded-full bg-gradient-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy mb-3">
                {project.status.replace("-", " ")}
              </span>
              <h1 className="font-serif text-display-sm font-bold text-cream leading-[1.1]">
                {project.name}
              </h1>
              <p className="mt-2 text-cream/80 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" />
                {project.location}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="section-padding bg-cream !pt-16 !pb-20">
        <div className="container-luxury">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-10">
              {/* Overview */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">Overview</h2>
                <p className="leading-relaxed text-navy-400 text-lg">{project.overview}</p>
              </div>

              {/* Key Assets */}
              <KeyAssets
                assets={project.assets}
                mapCoordinates={project.coordinates}
                mapHref={`https://www.google.com/maps?q=${encodeURIComponent(project.name + " Purbachal")}&z=14&output=embed`}
                className="!mt-12"
              />

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {project.specs.map((spec) => (
                  <div key={spec.label} className="rounded-xl border border-navy-50 bg-white p-5 text-center">
                    <p className="font-serif text-xl font-bold text-gradient-gold">{spec.value}</p>
                    <p className="mt-1.5 text-[10px] uppercase tracking-[0.15em] text-navy-400">{spec.label}</p>
                  </div>
                ))}
              </div>

              {/* Highlights */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-6">Highlights</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {project.highlights.map((h, i) => (
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
              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-6">Key Features</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {project.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 shrink-0 text-gold-600" />
                      <span className="text-sm text-navy">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <SectionHeading eyebrow="World-Class Amenities" title="Everything You Need" subtitle="A community is defined by what it offers its residents." align="left" />
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {project.amenities.map((a) => {
                    const Icon = AMENITY_ICONS[a.icon];
                    return (
                      <div key={a.id} className="flex items-start gap-3 rounded-xl border border-navy-50 bg-white p-4">
                        {Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />}
                        <div>
                          <p className="text-sm font-semibold text-navy">{a.name}</p>
                          <p className="mt-1 text-xs text-navy-400">{a.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Plot Types */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-6">Plot Portfolio</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {project.plotTypes.map((plot) => (
                    <div key={plot.label} className="relative rounded-2xl border border-navy-50 bg-white p-6 shadow-sm">
                      {plot.badge && (
                        <span className="absolute top-4 right-4 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy">
                          {plot.badge}
                        </span>
                      )}
                      <h3 className="font-serif text-xl font-bold text-navy">{plot.label}</h3>
                      <p className="mt-1 text-sm font-medium uppercase tracking-wider text-navy-400">{plot.size}</p>
                      <p className="mt-4 font-serif text-3xl font-bold text-gradient-gold">{plot.katha} Katha</p>
                      <p className="mt-2 text-xs text-navy-400">Starting price available on request</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Genesis / Story */}
              <div className="rounded-2xl border border-navy-50 bg-white p-8 lg:p-10">
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">The Story Behind {project.name}</h2>
                <p className="leading-relaxed text-navy-400">{project.genesis}</p>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Contact card */}
                <div className="rounded-2xl bg-gradient-navy p-8 text-cream shadow-navy">
                  <h3 className="font-serif text-xl font-bold text-cream">Interested in this project?</h3>
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
                <LeadForm propertyName={project.name} compact />

                {/* Location map */}
                <div className="rounded-2xl border border-navy-50 bg-white p-6 shadow-card">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4">Location</h3>
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-navy-50">
                      <iframe
                        title={`${project.name} location`}
                        src={`https://www.google.com/maps?q=${encodeURIComponent(project.name + " Purbachal")}&z=14&output=embed`}
                        className="absolute inset-0 h-full w-full"
                        loading="lazy"
                      />
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(project.name + " Purbachal")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-navy transition-all hover:shadow-gold hover:-translate-y-0.5"
                    >
                      Get Directions
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    {project.assets?.layoutPlan && (
                      <Link
                        href={project.assets.layoutPlan}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy/10 bg-cream px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-navy transition-all hover:border-navy/20 hover:bg-white hover:text-gold-600"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Layout Plan (PDF)
                      </Link>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-navy-400">{project.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {related.length > 0 && (
        <section className="section-padding bg-navy-50/50">
          <div className="container-luxury">
            <div className="mb-12 text-center">
              <span className="eyebrow !justify-center">You May Also Explore</span>
              <h2 className="mt-4 font-serif text-display-sm font-bold text-navy">Similar Projects</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
