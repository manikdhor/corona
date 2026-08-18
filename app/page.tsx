import Hero from "@/components/home/Hero";
import AboutTeaser from "@/components/home/AboutTeaser";
import ProjectShowcase from "@/components/home/ProjectShowcase";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Process from "@/components/home/Process";
import Testimonials from "@/components/home/Testimonials";
import Genesis from "@/components/home/Genesis";
import { Check } from "lucide-react";
import LeadForm from "@/components/lead/LeadForm";
import CTABanner from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutTeaser />
      <Genesis />
      <ProjectShowcase />
      <WhyChooseUs />
      <Process />
      <Testimonials />

      {/* Lead Capture Section */}
      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="eyebrow">Get Started</span>
              <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                Begin Your Land Ownership Journey
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy-400">
                Ready to invest in premium residential land? Our team will provide personalized recommendations and guide you through every step — from plot selection to registration.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Free consultation with land experts",
                  "Curated property recommendations",
                  "Approved, legally verified plots",
                  "Zero obligation, transparent process",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-gold">
                      <Check className="h-4 w-4 text-navy" />
                    </span>
                    <span className="text-sm font-medium text-navy">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <LeadForm
                title="Request a Consultation"
                subtitle="Share your details and our specialists will reach out within 24 hours with curated options tailored to your needs."
              />
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
