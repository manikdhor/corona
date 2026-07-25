import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import CTABanner from "@/components/home/CTABanner";
import LeadForm from "@/components/lead/LeadForm";
import { CORE_VALUES } from "@/lib/data";
import Image from "next/image";
import { Target, Eye, Award, Users, Building2, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Corona Properties Limited — Bangladesh's trusted premium land developer. Our story, vision, mission, values, and leadership team.",
};

const JOURNEY = [
  { year: "Inception", title: "The Beginning", text: "Corona Properties launched with a vision to bring transparency to Bangladesh's land market." },
  { year: "Growth", title: "First 100 Families", text: "Crossed our first 100 happy families with our Gulshan and Banani projects." },
  { year: "Expansion", title: "Expansion", text: "Expanded to Uttara, Bashundhara, and Baridhara with premium community projects." },
  { year: "Recognition", title: "REHAB Recognition", text: "Awarded by REHAB for excellence in land development and customer satisfaction." },
  { year: "Scale", title: "500+ Acres", text: "Crossed 500 acres of developed land with 1,000+ satisfied property owners." },
  { year: "Future", title: "Leading the Future", text: "Today, Corona Properties is one of the most trusted names in residential land development." },
];

export default function AboutPage() {
  return (
    <>
    <PageHero
      title="Our Story"
      subtitle="Crafting premium communities, building trust, and shaping the future of land development in Bangladesh."
      breadcrumb="About Us"
      bgImage="/About-corone.webp"
    />

      {/* Story section */}
      <section className="section-padding bg-cream relative overflow-hidden">
        <div className="container-luxury">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <Reveal x={-50}>
              <span className="eyebrow">Who We Are</span>
              <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                Excellence in Land Development
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy-400">
              Corona Properties Limited emerged from a simple conviction: that buying land in Bangladesh should be transparent, secure, and rewarding. We saw too many families and investors lose money to unclear titles, poor infrastructure, and unscrupulous dealers.
            </p>
              <p className="mt-4 leading-relaxed text-navy-400">
                Today, after developing over 500 acres of premium residential land and serving 1,200+ happy families, we remain driven by the same mission — to be the gold standard of land development in Bangladesh. Every plot we deliver carries our promise of legal integrity, quality infrastructure, and lasting value.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6">
                {[
                  { icon: Users, value: "1,200+", label: "Happy Families" },
                  { icon: Building2, value: "40+", label: "Projects Delivered" },
                  { icon: TrendingUp, value: "500+", label: "Acres Developed" },
                  { icon: Award, value: "10+", label: "Industry Awards" },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
                        <Icon className="h-6 w-6 text-gold-600" />
                      </div>
                      <div>
                        <p className="font-serif text-2xl font-bold text-navy">{stat.value}</p>
                        <p className="text-xs uppercase tracking-wider text-navy-400">{stat.label}</p>
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
                      src="/About-corone.webp"
                    alt="Corona Properties premium land development"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -top-6 -right-6 -z-10 h-full w-full rounded-2xl border-2 border-gold/30" />
                <div className="absolute -bottom-6 -left-6 bg-gradient-navy p-6 rounded-2xl shadow-gold-lg text-cream max-w-[200px]">
                  <p className="font-serif text-3xl font-bold text-gradient-gold">Our</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-cream/70">Commitment to Quality</p>
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
            {[
              {
                icon: Target,
                title: "Our Mission",
                text: "To democratize access to premium, legally-secure residential land in Bangladesh — making world-class land investment available to every family, at home and abroad.",
              },
              {
                icon: Eye,
                title: "Our Vision",
                text: "To be South Asia's most trusted land developer, recognized globally for legal integrity, infrastructure excellence, and unwavering commitment to client success.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={i} y={40} delay={i * 0.15}>
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-navy p-10 text-cream shadow-navy">
                    <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-3xl" />
                    <div className="relative">
                      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-gold shadow-gold">
                        <Icon className="h-8 w-8 text-navy" />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-cream">{item.title}</h3>
                      <p className="mt-4 leading-relaxed text-cream/75">{item.text}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="What Drives Us"
            title="Our Core Values"
            subtitle="The principles that guide every decision, every transaction, and every relationship at Corona Properties."
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map((value, i) => {
              const Icon = value.icon;
              return (
                <Reveal key={i} y={40} delay={i * 0.1}>
                  <div className="group rounded-2xl border border-navy-50 bg-white p-8 text-center shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1 h-full">
                    <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 transition-all duration-500 group-hover:bg-gradient-gold group-hover:scale-110">
                      <Icon className="h-8 w-8 text-gold-600 transition-colors group-hover:text-navy" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-navy">{value.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-navy-400">{value.description}</p>
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
    <SectionHeading
      eyebrow="Our Journey"
      title="Milestones That Define Us"
      subtitle="From a single office in Gulshan to becoming one of Bangladesh's most trusted land developers."
      light
    />
          <div className="mt-16 relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold via-gold/30 to-transparent md:-translate-x-1/2" />

            <div className="space-y-12">
              {JOURNEY.map((item, i) => (
                <Reveal key={i} y={30} delay={i * 0.05}>
                  <div className={`relative flex gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className="absolute left-4 md:left-1/2 top-2 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-gold shadow-gold md:translate-x-0">
                      <div className="h-2 w-2 rounded-full bg-navy" />
                    </div>
                    <div className={`ml-16 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10">
                        <span className="font-serif text-3xl font-bold text-gradient-gold">{item.year}</span>
                        <h3 className="mt-2 font-serif text-xl font-bold text-cream">{item.title}</h3>
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
          <SectionHeading
            eyebrow="Our Leadership"
            title="Management Messages"
            subtitle="Hear directly from the leaders guiding Corona Properties and Maple Leaf Garden City."
            light
          />
          <p className="mt-6 max-w-2xl mx-auto text-cream/75">
            Transparency, integrity, and customer satisfaction remain at the heart of everything we do.
          </p>
          <div className="mt-10">
            <Button href="/team">Meet Our Leadership</Button>
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="eyebrow">Partner With Us</span>
              <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                Ready to Own a Piece of the Future?
              </h2>
               <p className="mt-6 text-lg leading-relaxed text-navy-400">
                With a proven track record of excellence and 1,200+ happy families, we're ready to help you make your first or next land investment with confidence.
              </p>
            </div>
            <div>
              <LeadForm
                title="Start Your Journey With Us"
                subtitle="Tell us about your investment goals, preferred location, and budget. We'll get back to you with personalized options."
              />
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
