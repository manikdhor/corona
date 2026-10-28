import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import CTABanner from "@/components/home/CTABanner";
import {
  SISTER_CONCERNS,
  GROUP_STATS,
  VISION_MISSION,
  OFFICE_LOCATIONS,
} from "@/lib/data";
import { getSiteContentAction } from "@/lib/admin/actions";

export const revalidate = 60;
import {
  Target,
  Eye,
  Truck,
  Ship,
  ShieldCheck,
  Anchor,
  Globe,
  Video,
  Landmark,
  Building2,
  TrendingUp,
  MapPin,
  Clock,
  Briefcase,
  Users,
} from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Corporate Profile — Corona Group",
  description:
    "Learn about Corona Group Bangladesh — a diversified conglomerate with nearly four decades of excellence across transportation, shipping, customs brokerage, international trade, and media.",
};

const ICON_MAP: Record<string, any> = {
  Clock,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  Truck,
  Ship,
  ShieldCheck,
  Anchor,
  Globe,
  Video,
  Landmark,
  MapPin,
};

export default async function CoronaGroupPage() {
  const siteContent = await getSiteContentAction();
  const corporateGroup = siteContent?.corporateGroup;

  const pioneer = corporateGroup?.foundingPioneer || {
    name: "Kazi Rafiqul Islam",
    title: "A Pioneer in Transportation & Logistics",
    bio: [
      "From a single truck to a nationwide fleet, Kazi Rafiqul Islam built the foundational pillar of Corona Group — pioneering land logistics across Bangladesh and setting the standard for reliability, scale, and customer-centric service.",
    ],
    image: "/Kazi_Rafiqul_Islam.jpeg",
  };

  const groupStats = (corporateGroup as any)?.groupStats && (corporateGroup as any).groupStats.length > 0
    ? (corporateGroup as any).groupStats
    : GROUP_STATS;

  const missionText = siteContent?.visionMission?.mission || (corporateGroup as any)?.visionMission?.mission || VISION_MISSION.mission;
  const visionText = siteContent?.visionMission?.vision || (corporateGroup as any)?.visionMission?.vision || VISION_MISSION.vision;

  const sisterConcerns = corporateGroup?.sisterConcerns && corporateGroup.sisterConcerns.length > 0
    ? corporateGroup.sisterConcerns
    : SISTER_CONCERNS;

  const officeLocations =
    (corporateGroup?.offices && corporateGroup.offices.length > 0
      ? corporateGroup.offices
      : (corporateGroup as any)?.officeLocations && (corporateGroup as any).officeLocations.length > 0
      ? (corporateGroup as any).officeLocations
      : OFFICE_LOCATIONS);

  const whoWeAre = corporateGroup?.whoWeAre;
  const ethos = corporateGroup?.ethos;

  const philosophy = [
    {
      icon: Target,
      title: "Our Mission",
      text: missionText,
    },
    {
      icon: Eye,
      title: "Our Vision",
      text: visionText,
    },
  ];
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative flex items-center justify-center overflow-hidden bg-navy pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, #c9a96e 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="absolute top-0 left-0 h-20 w-20 border-l-2 border-t-2 border-gold/40 hidden md:block" />
        <div className="absolute bottom-0 right-0 h-20 w-20 border-r-2 border-b-2 border-gold/40 hidden md:block" />

        <div className="container-luxury relative z-10 text-center">
          <Reveal y={40}>
            <span className="eyebrow">{corporateGroup?.heroEyebrow || "Corona Group"}</span>
            <h1 className="mt-6 font-serif text-display-lg font-bold text-cream md:text-display-xl text-balance">
              {corporateGroup?.heroTitle || "Building Trust. Delivering Excellence. Since 1987"}
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-cream/70">
              {corporateGroup?.heroSubtitle ||
                "A diversified Bangladeshi business conglomerate with a legacy of excellence spanning nearly four decades — driving growth across logistics, trade, and media."}
            </p>
            <div className="mx-auto mt-10 flex justify-center">
              <span className="ornament-line md:hidden">
                <span className="text-gold text-lg">◆</span>
              </span>
              <span className="hidden md:inline-block ornament-line">
                <span className="text-gold text-lg">◆</span>
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== FOUNDING PIONEER ===== */}
      <section className="section-padding bg-gradient-navy text-cream relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
        <div className="container-luxury relative">
          <div className="grid items-center gap-12 lg:gap-20 lg:grid-cols-2">
            <Reveal x={-50}>
              <span className="eyebrow text-gold">Founding Legacy</span>
              <h2 className="mt-6 font-serif text-display-md font-bold text-cream text-balance">
                {pioneer.name}
              </h2>
              <p className="mt-2 text-gold font-medium tracking-wide">
                {pioneer.title}
              </p>
              {pioneer.quote && (
                <blockquote className="mt-4 border-l-2 border-gold pl-4 font-serif italic text-cream/85">
                  &ldquo;{pioneer.quote}&rdquo;
                </blockquote>
              )}
              <div className="mt-6 space-y-3 text-lg leading-relaxed text-cream/70">
                {Array.isArray(pioneer.bio) ? (
                  pioneer.bio.map((para: string, idx: number) => <p key={idx}>{para}</p>)
                ) : (
                  <p>{pioneer.bio}</p>
                )}
              </div>
              <div className="mt-8 divider-gold" />
            </Reveal>

            <Reveal x={50}>
              <div className="relative">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-navy">
                  <Image
                    src={pioneer.image || "/Kazi_Rafiqul_Islam.jpeg"}
                    alt={`${pioneer.name} — ${pioneer.title}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gradient-gold px-6 py-3 rounded-xl shadow-gold-lg text-navy">
                  <p className="font-serif text-sm font-bold uppercase tracking-wider">
                    Since 1987
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== ABOUT GROUP ===== */}
      <section className="section-padding bg-cream relative overflow-hidden">
        <div className="container-luxury">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <Reveal x={-50}>
              <span className="eyebrow">{whoWeAre?.eyebrow || "Who We Are"}</span>
              <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                {whoWeAre?.heading || "A Legacy of Excellence Across Industries"}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy-400">
                {whoWeAre?.p1 ||
                  "Corona Group is a diversified Bangladeshi business conglomerate with a legacy of excellence spanning nearly four decades. Since its inception in 1987, the Group has built a strong reputation across transportation, shipping, customs brokerage, international trade, and media production."}
              </p>
              <p className="mt-4 leading-relaxed text-navy-400">
                {whoWeAre?.p2 ||
                  "Driven by professionalism, integrity, and customer-focused solutions, Corona Group continues to deliver reliable, efficient, and innovative services that contribute to the growth of Bangladesh's logistics and commercial sectors."}
              </p>

              <div className="mt-10 grid grid-cols-2 gap-6">
                {groupStats.map((stat: any, i: number) => {
                  const Icon =
                    typeof stat.icon === "function"
                      ? stat.icon
                      : ICON_MAP[stat.icon] || TrendingUp;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-2xl border border-navy-50 bg-white p-5 shadow-card"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                        <Icon className="h-6 w-6 text-gold-600" />
                      </div>
                      <div>
                        <p className="font-serif text-2xl font-bold text-navy">
                          {stat.value}
                          {stat.suffix && (
                            <span className="text-lg text-gold-600">
                              {stat.suffix}
                            </span>
                          )}
                        </p>
                        <p className="text-xs uppercase tracking-wider text-navy-400">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>

            <Reveal x={50}>
              <div className="relative">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-navy">
                  <Image
                    src={whoWeAre?.image || "/About-corone.webp"}
                    alt="Corona Group corporate operations"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -top-6 -right-6 -z-10 h-full w-full rounded-2xl border-2 border-gold/30" />
                <div className="absolute -bottom-6 -left-6 bg-gradient-navy p-6 rounded-2xl shadow-gold-lg text-cream max-w-[220px]">
                  <p className="font-serif text-3xl font-bold text-gradient-gold">
                    {whoWeAre?.badgeValue || "37+"}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-cream/70">
                    {whoWeAre?.badgeLabel || "Years of Operational Excellence"}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== PHILOSOPHY ===== */}
      <section className="section-padding bg-navy-50/50">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Leadership Philosophy"
            title="Mission & Vision"
            subtitle="The principles that guide every decision, every transaction, and every relationship within Corona Group."
          />
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {philosophy.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={i} y={40} delay={i * 0.15}>
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-navy p-10 text-cream shadow-navy">
                    <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-3xl" />
                    <div className="relative">
                      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-gold shadow-gold">
                        <Icon className="h-8 w-8 text-navy" />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-cream">
                        {item.title}
                      </h3>
                      <p className="mt-4 leading-relaxed text-cream/75">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SISTER CONCERNS ===== */}
      <section className="section-padding bg-cream relative">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Our Portfolio"
            title="Business Verticals"
            subtitle="Six strategically diversified sister concerns operating across logistics, trade, and media — each a recognized leader in its field."
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sisterConcerns.map((concern: any, i: number) => {
              const Icon =
                typeof concern.icon === "function"
                  ? concern.icon
                  : ICON_MAP[concern.icon] || Building2;
              return (
                <Reveal key={concern.id || i} y={40} delay={i * 0.08}>
                  <div className="group relative h-full rounded-2xl border border-navy-50 bg-white p-8 shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1">
                    <div className="flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10 transition-all duration-500 group-hover:bg-gradient-gold group-hover:scale-110">
                        <Icon className="h-7 w-7 text-gold-600 transition-colors group-hover:text-navy" />
                      </div>
                      <span className="rounded-full border border-gold/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-600">
                        Est. {concern.established}
                      </span>
                    </div>

                    <h3 className="mt-6 font-serif text-xl font-bold text-navy">
                      {concern.name}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-gold-600">
                      {concern.tagline}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-navy-400">
                      {concern.description}
                    </p>

                    {(concern.strengths || concern.highlights) &&
                      (concern.strengths || concern.highlights).length > 0 && (
                        <div className="mt-6 space-y-2.5">
                          {(concern.strengths || concern.highlights).map(
                            (strength: string, j: number) => (
                              <div key={j} className="flex items-center gap-3">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-gold">
                                  <svg
                                    className="h-2.5 w-2.5 text-navy"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                  >
                                    <path d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                                <span className="text-xs font-medium text-navy-400">
                                  {strength}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== NATIONAL PRESENCE ===== */}
      <section className="section-padding bg-gradient-navy text-cream relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
        <div className="container-luxury relative">
          <SectionHeading
            eyebrow="Strategic Network"
            title="National Footprint"
            subtitle="Our offices are strategically located to serve Bangladesh's major commercial and logistics hubs."
            light
          />

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {officeLocations.map((office: any, i: number) => (
              <Reveal key={i} y={40} delay={i * 0.1}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all duration-500 hover:bg-white/10 h-full">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold/40 bg-gold/10">
                    <MapPin className="h-7 w-7 text-gold" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-cream">
                    {office.city || office.label}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-gold">
                    {office.name || office.company}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-cream/65">
                    {office.description || office.address}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMMITMENT ===== */}
      <section className="section-padding bg-cream relative overflow-hidden">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal y={40}>
              <span className="eyebrow">{ethos?.eyebrow || "Our Ethos"}</span>
              <h2 className="mt-6 font-serif text-display-md font-bold text-navy text-balance">
                {ethos?.heading || "Commitment to Sustainable Growth"}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy-400">
                {ethos?.description ||
                  "At Corona Group, we believe sustainable success is built on integrity, professionalism, innovation, and long-term partnerships. With decades of operational excellence and industry expertise, we remain committed to delivering world-class services that create value for our clients, partners, employees, and the communities we serve."}
              </p>
              <div className="mx-auto mt-10 flex justify-center">
                <span className="ornament-line">
                  <span className="text-gold text-lg">◆</span>
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABanner data={siteContent?.ctaBanner} />
    </>
  );
}
