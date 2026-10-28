import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Check,
  ArrowLeft,
  Phone,
  Mail,
  Download,
  ExternalLink,
} from "lucide-react";
import { PROJECTS, getProjectBySlug, getRelatedProjects, mapAdminPropertyToProject } from "@/lib/projects";
import { CONTACT_INFO } from "@/lib/constants";
import { extractMapEmbedUrl, getGoogleMapsDirectionsUrl, getGoogleMapsViewUrl } from "@/lib/maps";
import { getPropertyAction, getPropertiesAction } from "@/lib/admin/actions";
import LeadForm from "@/components/lead/LeadForm";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/home/ProjectCard";
import KeyAssets from "@/components/property/KeyAssets";
import DynamicIcon from "@/components/ui/DynamicIcon";
import PropertyGallery from "@/components/property/PropertyGallery";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const dynamicParams = true;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const adminProp = await getPropertyAction(params.slug);
  const baseProject = getProjectBySlug(params.slug);

  if (!adminProp && !baseProject) return { title: "Project Not Found" };

  const title = adminProp?.title || baseProject?.seo.title || baseProject?.name || "Project";
  const description =
    (adminProp?.overview || baseProject?.seo.description || baseProject?.overview || "").slice(0, 160);
  const image = adminProp?.featuredImage || baseProject?.heroImage || "/image-01.webp";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const baseProject = getProjectBySlug(params.slug);
  const adminProp = await getPropertyAction(params.slug);

  if (!baseProject && !adminProp) {
    notFound();
  }

  // Merge dynamic admin property data with rich base project assets
  const project = adminProp
    ? mapAdminPropertyToProject(adminProp, baseProject)
    : baseProject!;

  // Fetch all admin properties for dynamic similar projects module
  const allAdminProps = await getPropertiesAction();

  // Dynamic Similar Projects computation
  const manualSlugs: string[] = adminProp?.customFieldValues?.similarProjectSlugs || [];
  let related: any[] = [];

  if (manualSlugs.length > 0) {
    related = allAdminProps
      .filter((p) => manualSlugs.includes(p.slug) || manualSlugs.includes(p.id))
      .map((p) => {
        const bp = PROJECTS.find((b) => b.slug === p.slug || b.id === p.id);
        return mapAdminPropertyToProject(p, bp);
      });
  }

  if (related.length === 0) {
    const otherDbProps = allAdminProps
      .filter((p) => p.slug !== params.slug && p.id !== (adminProp?.id || baseProject?.id))
      .map((p) => {
        const bp = PROJECTS.find((b) => b.slug === p.slug || b.id === p.id);
        return mapAdminPropertyToProject(p, bp);
      });

    if (otherDbProps.length > 0) {
      related = otherDbProps.slice(0, 3);
    } else {
      related = getRelatedProjects(params.slug, 3);
    }
  }

  const phoneDisplay = project.sectionHeadings?.contactPhone || CONTACT_INFO.phone;
  const phoneRaw = phoneDisplay.replace(/[^0-9+]/g, "") || CONTACT_INFO.phoneRaw;
  const emailDisplay = project.sectionHeadings?.contactEmail || CONTACT_INFO.email;

  const targetPlace = project.name.includes("Purbachal")
    ? project.name
    : `${project.name} Purbachal`;

  const mapEmbedUrl = extractMapEmbedUrl(
    project.assets?.mapHref,
    project.coordinates,
    targetPlace
  );
  const mapViewUrl = getGoogleMapsViewUrl(
    targetPlace,
    project.coordinates,
    project.assets?.mapHref
  );
  const directionsUrl = getGoogleMapsDirectionsUrl(
    targetPlace,
    project.coordinates,
    project.assets?.mapHref
  );

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
      <section className="bg-navy-950 pb-12">
        <div className="container-luxury">
          <PropertyGallery images={project.gallery} title={project.name} />

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-navy-800/60 pt-6">
            <div>
              <span className="inline-block rounded-full bg-gradient-gold px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-navy mb-2">
                {String(project.status).replace("-", " ")}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream leading-[1.1]">
                {project.name}
              </h1>
              <p className="mt-2 text-cream/80 flex items-center gap-2 text-sm sm:text-base">
                <MapPin className="h-4 w-4 text-gold shrink-0" />
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
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  {project.sectionHeadings?.overviewTitle || "Overview"}
                </h2>
                <div
                  className="leading-relaxed text-navy-400 text-lg space-y-4 prose prose-navy max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.overview }}
                />
              </div>

              {/* Key Assets */}
              {project.assets && (
                <KeyAssets
                  assets={project.assets}
                  mapCoordinates={project.coordinates}
                  mapHref={mapEmbedUrl}
                  mapViewHref={mapViewUrl}
                  projectName={targetPlace}
                  eyebrow={project.sectionHeadings?.keyAssetsEyebrow}
                  title={project.sectionHeadings?.keyAssetsTitle}
                  subtitle={project.sectionHeadings?.keyAssetsSubtitle}
                  className="!mt-12"
                />
              )}

              {/* Specs & Stats with Dynamic Icons */}
              {project.specs && project.specs.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {project.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-xl border border-navy-50 bg-white p-5 text-center transition-all hover:border-gold/30 hover:shadow-xs"
                    >
                      {spec.icon && (
                        <div className="flex justify-center mb-2">
                          <DynamicIcon name={spec.icon} className="h-5 w-5 text-gold-600" />
                        </div>
                      )}
                      <p className="font-serif text-xl font-bold text-gradient-gold">{spec.value}</p>
                      <p className="mt-1.5 text-[10px] uppercase tracking-[0.15em] text-navy-400">{spec.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Highlights */}
              {project.highlights.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-bold text-navy mb-6">
                    {project.sectionHeadings?.highlightsTitle || "Highlights"}
                  </h2>
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
              )}

              {/* Features */}
              {project.features.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-bold text-navy mb-6">
                    {project.sectionHeadings?.featuresTitle || "Key Features"}
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {project.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Check className="h-5 w-5 shrink-0 text-gold-600" />
                        <span className="text-sm text-navy">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {project.amenities.length > 0 && (
                <div>
                  <SectionHeading
                    eyebrow={project.sectionHeadings?.amenitiesEyebrow || "World-Class Amenities"}
                    title={project.sectionHeadings?.amenitiesTitle || "Everything You Need"}
                    subtitle={
                      project.sectionHeadings?.amenitiesSubtitle ||
                      "A community is defined by what it offers its residents."
                    }
                    align="left"
                  />
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {project.amenities.map((a) => (
                      <div
                        key={a.id || a.name}
                        className="flex items-start gap-3 rounded-xl border border-navy-50 bg-white p-4 transition-all hover:border-gold/30 hover:shadow-xs"
                      >
                        <DynamicIcon name={a.icon} className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                        <div>
                          <p className="text-sm font-semibold text-navy">{a.name}</p>
                          <p className="mt-1 text-xs text-navy-400">{a.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Plot Types / Portfolio */}
              {project.plotTypes && project.plotTypes.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="font-serif text-2xl font-bold text-navy">
                      {project.sectionHeadings?.plotPortfolioTitle || "Plot Portfolio"}
                    </h2>
                    <p className="mt-1 text-sm text-navy-400">
                      {project.sectionHeadings?.plotPortfolioSubtitle ||
                        "Explore our range of premium residential and commercial plot sizes"}
                    </p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {project.plotTypes.map((plot, idx) => (
                      <div
                        key={plot.label || idx}
                        className="relative rounded-2xl border border-navy-50 bg-white p-6 shadow-sm transition-all hover:border-gold/30 hover:shadow-md"
                      >
                        {plot.badge && (
                          <span className="absolute top-4 right-4 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy">
                            {plot.badge}
                          </span>
                        )}
                        <h3 className="font-serif text-xl font-bold text-navy">{plot.label}</h3>
                        <p className="mt-1 text-sm font-medium uppercase tracking-wider text-navy-400">
                          {plot.size}
                        </p>
                        <p className="mt-4 font-serif text-3xl font-bold text-gradient-gold">{plot.katha} Katha</p>
                        <p className="mt-2 text-xs text-navy-400">
                          {plot.priceNote || "Starting price available on request"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Genesis / Story */}
              {project.genesis && (
                <div className="rounded-2xl border border-navy-50 bg-white p-8 lg:p-10">
                  <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                    {project.sectionHeadings?.storyTitle || `The Story Behind ${project.name}`}
                  </h2>
                  {project.sectionHeadings?.storySubtitle && (
                    <p className="text-sm font-medium text-gold-700 mb-3">
                      {project.sectionHeadings.storySubtitle}
                    </p>
                  )}
                  <p className="leading-relaxed text-navy-400 whitespace-pre-line">{project.genesis}</p>
                </div>
              )}
            </div>

            {/* Right: Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Contact card */}
                <div className="rounded-2xl bg-gradient-navy p-8 text-cream shadow-navy">
                  <h3 className="font-serif text-xl font-bold text-cream">
                    {project.sectionHeadings?.contactTitle || "Interested in this project?"}
                  </h3>
                  <p className="mt-2 text-sm text-cream/70">
                    {project.sectionHeadings?.contactSubtitle ||
                      "Book a site visit or request a callback. Our team responds within 24 hours."}
                  </p>

                  <div className="mt-6 space-y-3">
                    <a
                      href={`tel:${phoneRaw}`}
                      className="flex items-center gap-3 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20">
                        <Phone className="h-4 w-4 text-gold" />
                      </span>
                      <div>
                        <p className="text-xs text-cream/60">Call us</p>
                        <p className="text-sm font-semibold">{phoneDisplay}</p>
                      </div>
                    </a>
                    <a
                      href={`mailto:${emailDisplay}`}
                      className="flex items-center gap-3 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20">
                        <Mail className="h-4 w-4 text-gold" />
                      </span>
                      <div>
                        <p className="text-xs text-cream/60">Email us</p>
                        <p className="text-sm font-semibold break-all">{emailDisplay}</p>
                      </div>
                    </a>
                  </div>

                  <Button
                    href={project.sectionHeadings?.contactCtaHref || "/contact"}
                    variant="gold"
                    showArrow
                    className="mt-6 w-full"
                  >
                    {project.sectionHeadings?.contactCtaText || "Book Site Visit"}
                  </Button>
                </div>

                {/* Inquiry form */}
                <LeadForm
                  propertyName={project.name}
                  source={`Project Detail Page: ${project.name}`}
                  compact
                />

                {/* Location map */}
                <div className="rounded-2xl border border-navy-50 bg-white p-6 shadow-card">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4">
                    {project.sectionHeadings?.locationTitle || "Location"}
                  </h3>
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-navy-50">
                    <iframe
                      title={`${project.name} location`}
                      src={mapEmbedUrl}
                      className="absolute inset-0 h-full w-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <a
                      href={directionsUrl}
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

      {/* Similar Projects */}
      {related.length > 0 && (
        <section className="section-padding bg-navy-50/50">
          <div className="container-luxury">
            <div className="mb-12 text-center">
              <span className="eyebrow !justify-center">
                {project.sectionHeadings?.similarProjectsEyebrow || "You May Also Explore"}
              </span>
              <h2 className="mt-4 font-serif text-display-sm font-bold text-navy">
                {project.sectionHeadings?.similarProjectsTitle || "Similar Projects"}
              </h2>
              {project.sectionHeadings?.similarProjectsSubtitle && (
                <p className="mt-2 text-sm text-navy-400 max-w-xl mx-auto">
                  {project.sectionHeadings.similarProjectsSubtitle}
                </p>
              )}
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
