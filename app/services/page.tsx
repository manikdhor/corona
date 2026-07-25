import type { Metadata } from "next";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import CTABanner from "@/components/home/CTABanner";
import LeadForm from "@/components/lead/LeadForm";
import Process from "@/components/home/Process";
import { SERVICES } from "@/lib/data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Comprehensive land development services from Corona Properties — legal services, investment advisory, property management, documentation, and after-sales support.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Premium Services"
        subtitle="From first inquiry to lifetime support — we offer end-to-end land services that make ownership effortless, secure, and rewarding."
        breadcrumb="Services"
        bgImage="/image-11.webp"
      />

      {/* Services grid */}
      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="What We Offer"
            title="Comprehensive Land Solutions"
            subtitle="Six pillars of service that cover every aspect of land ownership — backed by a decade of expertise and unwavering integrity."
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <Reveal key={service.id} y={40} delay={i * 0.1}>
                  <div className="group relative overflow-hidden rounded-2xl border border-navy-50 bg-white p-8 shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2 h-full">
                    <span className="absolute top-6 right-6 font-serif text-5xl font-bold text-navy/[0.04] transition-colors group-hover:text-gold/10">
                      0{i + 1}
                    </span>

                    <div className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-gold shadow-gold transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="h-8 w-8 text-navy" />
                    </div>

                    <h3 className="font-serif text-xl font-bold text-navy mb-3">
                      {service.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-navy-400 mb-5">
                      {service.description}
                    </p>

                    <ul className="space-y-2">
                      {service.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-navy">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/contact"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold-600 transition-colors hover:text-navy"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-gold transition-all duration-500 group-hover:w-full" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process section */}
      <Process />

      {/* Why choose us banner */}
      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <Reveal x={-50}>
              <div className="relative">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-navy">
                  <Image
                    src="/image-02.webp"
                    alt="Corona Properties service quality"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -top-6 -right-6 -z-10 h-full w-full rounded-2xl border-2 border-gold/30" />
              </div>
            </Reveal>

            <Reveal x={50}>
              <span className="eyebrow">The Corona Promise</span>
              <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                White-Glove Service, End to End
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy-400">
                We don't just sell plots and disappear. From the moment you express
                interest to decades after handover, Corona Properties walks alongside
                you — handling legalities, infrastructure, documentation, and lifetime
                advisory with the same care and attention.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Dedicated account manager for every client",
                  "Free site visits and consultation sessions",
                  "Transparent pricing — no hidden charges",
                  "Lifetime after-sales support and advisory",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-gold">
                      <Check className="h-4 w-4 text-navy" />
                    </span>
                    <span className="text-sm font-medium text-navy">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Button href="/contact" variant="gold" showArrow>
                  Get Started Today
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="section-padding bg-navy-50/50">
        <div className="container-luxury">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="eyebrow">Get Expert Help</span>
              <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                Let Us Handle Everything for You
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy-400">
                From legal documentation to site visits, our team is ready to guide you. Share your requirements and experience the Corona difference.
              </p>
            </div>
            <div>
              <LeadForm
                title="Request a Service Consultation"
                subtitle="Describe what you need and we'll assign a dedicated expert to assist you within 24 hours."
              />
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
