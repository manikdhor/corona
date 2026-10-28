import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import LeadForm from "@/components/lead/LeadForm";
import CTABanner from "@/components/home/CTABanner";
import Image from "next/image";
import {
  Target,
  Eye,
  Award,
  Users,
  Building2,
  TrendingUp,
  ShieldCheck,
  Handshake,
} from "lucide-react";

import { getSiteContentAction } from "@/lib/admin/actions";
import { normalizeImageUrl } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us | Corona Properties",
  description:
    "Learn about Corona Properties Limited — Bangladesh's trusted premium land developer. Our story, vision, mission, values, and leadership team.",
};

const DEFAULT_STATS = [
  { value: "1,200+", label: "Happy Families", icon: Users },
  { value: "40+", label: "Projects Delivered", icon: Building2 },
  { value: "500+", label: "Acres Developed", icon: TrendingUp },
  { value: "10+", label: "Industry Awards", icon: Award },
];

const DEFAULT_CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "Every transaction is transparent, every document is authentic. We build trust through honesty, not just beautiful land.",
  },
  {
    icon: TrendingUp,
    title: "Excellence",
    description:
      "From site selection to handover, we pursue the highest standard of quality in every detail of land development.",
  },
  {
    icon: Handshake,
    title: "Client First",
    description:
      "Your goals are our goals. We measure our success by the satisfaction and prosperity of the families we serve.",
  },
  {
    icon: Building2,
    title: "Innovation",
    description:
      "We embrace modern planning, sustainable infrastructure, and forward-thinking design to create lasting value.",
  },
];

const DEFAULT_JOURNEY = [
  {
    year: "Inception",
    title: "The Beginning",
    text: "Corona Properties launched with a vision to bring transparency to Bangladesh's land market.",
  },
  {
    year: "Growth",
    title: "First 100 Families",
    text: "Crossed our first 100 happy families with our Gulshan and Banani projects.",
  },
  {
    year: "Expansion",
    title: "Expansion",
    text: "Expanded to Uttara, Bashundhara, and Baridhara with premium community projects.",
  },
  {
    year: "Scale",
    title: "500+ Acres",
    text: "Crossed 500 acres of developed land with 1,000+ satisfied property owners.",
  },
  {
    year: "Future",
    title: "Leading the Future",
    text: "Today, Corona Properties is one of the most trusted names in residential land development.",
  },
];

const ICON_MAP: Record<string, any> = {
  ShieldCheck,
  TrendingUp,
  Handshake,
  Building2,
  Users,
  Award,
  Target,
  Eye,
};

export default async function AboutPage() {
  const siteContent = await getSiteContentAction();

  const about = siteContent?.aboutTeaser;
  const aboutPage = siteContent?.aboutPage;
  const coreValuesData = siteContent?.coreValues;
  const journeyData = siteContent?.journey;
  const corporateGroup = siteContent?.corporateGroup;
  const leadCapture = siteContent?.leadCapture;

  const statsList =
    siteContent?.hero?.stats && siteContent.hero.stats.length > 0
      ? siteContent.hero.stats.map((st, idx) => ({
          value: st.value,
          label: st.label,
          icon: DEFAULT_STATS[idx % DEFAULT_STATS.length].icon,
        }))
      : DEFAULT_STATS;

  const missionText =
    siteContent?.visionMission?.mission ||
    (corporateGroup as any)?.visionMission?.mission ||
    "To democratize access to premium, legally-secure residential land in Bangladesh — making world-class land investment available to every family, at home and abroad.";

  const visionText =
    siteContent?.visionMission?.vision ||
    (corporateGroup as any)?.visionMission?.vision ||
    "To be South Asia's most trusted land developer, recognized globally for legal integrity, infrastructure excellence, and unwavering commitment to client success.";

  const values =
    coreValuesData?.values && coreValuesData.values.length > 0
      ? coreValuesData.values
      : DEFAULT_CORE_VALUES;

  const milestones =
    journeyData?.milestones && journeyData.milestones.length > 0
      ? journeyData.milestones
      : DEFAULT_JOURNEY;

  return (
    <>
      <PageHero
        title={aboutPage?.heroTitle || "Our Story"}
        subtitle={
          aboutPage?.heroSubtitle ||
          "Crafting premium communities, building trust, and shaping the future of land development in Bangladesh."
        }
        breadcrumb={aboutPage?.breadcrumb || "About Us"}
        bgImage={aboutPage?.heroBgImage || "/About-corone.webp"}
      />

      {/* Story section */}
      <section className="section-padding bg-cream relative overflow-hidden">
        <div className="container-luxury">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <Reveal x={-50}>
              <span className="eyebrow">{about?.eyebrow || "Who We Are"}</span>
              <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                {about?.heading || "Excellence in Land Development"}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy-400">
                {about?.p1 ||
                  "Corona Properties Limited emerged from a simple conviction: that buying land in Bangladesh should be transparent, secure, and rewarding. We saw too many families and investors lose money to unclear titles, poor infrastructure, and unscrupulous dealers."}
              </p>
              <p className="mt-4 leading-relaxed text-navy-400">
                {about?.p2 ||
                  "Today, after developing over 500 acres of premium residential land and serving 1,200+ happy families, we remain driven by the same mission — to be the gold standard of land development in Bangladesh. Every plot we deliver carries our promise of legal integrity, quality infrastructure, and lasting value."}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6">
                {statsList.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
                        <Icon className="h-6 w-6 text-gold-600" />
                      </div>
                      <div>
                        <p className="font-serif text-2xl font-bold text-navy">
                          {stat.value}
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
                <div className="relative aspect-square overflow-hidden rounded-2xl shadow-navy">
                  <Image
                    src={normalizeImageUrl(about?.image || "/About-corone.webp")}
                    alt="Corona Properties premium land development"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute -top-6 -right-6 -z-10 h-full w-full rounded-2xl border-2 border-gold/30" />
                <div className="absolute -bottom-6 -left-6 bg-gradient-navy p-6 rounded-2xl shadow-gold-lg text-cream max-w-[200px]">
                  <p className="font-serif text-3xl font-bold text-gradient-gold">
                    {about?.badgeValue || "Our"}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-cream/70">
                    {about?.badgeLabel || "Commitment to Quality"}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-navy-50/50">
        <div className="container-luxury">
          <div className="grid gap-8 md:grid-cols-2">
            <Reveal y={40} delay={0}>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-navy p-10 text-cream shadow-navy">
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-3xl" />
                <div className="relative">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-gold shadow-gold">
                    <Target className="h-8 w-8 text-navy" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-cream">
                    Our Mission
                  </h3>
                  <p className="mt-4 leading-relaxed text-cream/75">
                    {missionText}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal y={40} delay={0.15}>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-navy p-10 text-cream shadow-navy">
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-3xl" />
                <div className="relative">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-gold shadow-gold">
                    <Eye className="h-8 w-8 text-navy" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-cream">
                    Our Vision
                  </h3>
                  <p className="mt-4 leading-relaxed text-cream/75">
                    {visionText}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-5 flex justify-center">
              <span className="eyebrow">{coreValuesData?.eyebrow || "What Drives Us"}</span>
            </div>
            <h2 className="font-serif font-bold leading-tight text-navy">
              {coreValuesData?.heading || "Our Core Values"}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-navy-400">
              {coreValuesData?.subtitle || "The principles that guide every decision, every transaction, and every relationship at Corona Properties."}
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value: any, i: number) => {
              const Icon =
                typeof value.icon === "function"
                  ? value.icon
                  : ICON_MAP[value.icon] || ShieldCheck;
              return (
                <Reveal key={i} y={40} delay={i * 0.1}>
                  <div className="group rounded-2xl border border-navy-50 bg-white p-8 text-center shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1 h-full">
                    <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 transition-all duration-500 group-hover:bg-gradient-gold group-hover:scale-110">
                      <Icon className="h-8 w-8 text-gold-600 transition-colors group-hover:text-navy" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-navy">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-navy-400">
                      {value.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="section-padding bg-gradient-navy text-cream relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
        <div className="container-luxury relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-5 flex justify-center">
              <span className="eyebrow">{journeyData?.eyebrow || "Our Journey"}</span>
            </div>
            <h2 className="font-serif font-bold leading-tight text-cream">
              {journeyData?.heading || "Milestones That Define Us"}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cream/70">
              {journeyData?.subtitle || "From a single office in Gulshan to becoming one of Bangladesh's most trusted land developers."}
            </p>
          </div>
          <div className="mt-16 relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold via-gold/30 to-transparent md:-translate-x-1/2" />

            <div className="space-y-12">
              {milestones.map((item: any, i: number) => (
                <Reveal key={i} y={30} delay={i * 0.05}>
                  <div
                    className={`relative flex gap-8 ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="absolute left-4 md:left-1/2 top-2 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-gold shadow-gold md:translate-x-0">
                      <div className="h-2 w-2 rounded-full bg-navy" />
                    </div>
                    <div
                      className={`ml-16 md:ml-0 md:w-1/2 ${
                        i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"
                      }`}
                    >
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10">
                        <span className="font-serif text-3xl font-bold text-gradient-gold">
                          {item.year}
                        </span>
                        <h3 className="mt-2 font-serif text-xl font-bold text-cream">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-cream/70">{item.text}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Management Teaser */}
      <section className="section-padding bg-gradient-navy text-cream relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
        <div className="container-luxury relative text-center">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-5 flex justify-center">
              <span className="eyebrow">{aboutPage?.managementEyebrow || "Our Leadership"}</span>
            </div>
            <h2 className="font-serif font-bold leading-tight text-cream">
              {aboutPage?.managementHeading || "Management Messages"}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cream/70">
              {aboutPage?.managementSubtitle ||
                "Hear directly from the leaders guiding Corona Properties and Maple Leaf Garden City."}
            </p>
          </div>
          <p className="mt-6 max-w-2xl mx-auto text-cream/75">
            {aboutPage?.managementDescription ||
              "Transparency, integrity, and customer satisfaction remain at the heart of everything we do."}
          </p>
          <div className="mt-10">
            <Button href={aboutPage?.managementButtonLink || "/team"}>
              {aboutPage?.managementButtonText || "Meet Our Leadership"}
            </Button>
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="eyebrow">{leadCapture?.eyebrow || "Partner With Us"}</span>
              <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                {leadCapture?.heading || "Ready to Own a Piece of the Future?"}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy-400">
                {leadCapture?.description ||
                  "With a proven track record of excellence and 1,200+ happy families, we're ready to help you make your first or next land investment with confidence."}
              </p>
            </div>
            <div>
              <LeadForm
                title={leadCapture?.formTitle || "Start Your Journey With Us"}
                subtitle={
                  leadCapture?.formSubtitle ||
                  "Tell us about your investment goals, preferred location, and budget. We'll get back to you with personalized options."
                }
                source="About Page Form"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner data={siteContent?.ctaBanner} />
    </>
  );
}
